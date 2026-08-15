<?php
/**
 * Plugin Name: VFA Cache
 * Description: Purges the Cloudflare cache whenever content changes, so edits appear
 *              on the live site within seconds with no manual intervention. Busts the
 *              entire cache (simple + reliable; saves are infrequent). Also triggers
 *              a Cloudflare Pages redeploy when sitemap-relevant content is published,
 *              so the sitemap stays current automatically.
 * Version: 1.1.0
 *
 * ── SETUP (one time) ─────────────────────────────────────────────────────────
 * Credentials are read from wp-config.php so they are never stored in this plugin
 * or its zip. Add these lines to wp-config.php (above "That's all, stop editing"):
 *
 *   define('VFA_CLOUDFLARE_ZONE_ID',   'your-zone-id');
 *   define('VFA_CLOUDFLARE_API_TOKEN', 'your-api-token');
 *   define('VFA_CLOUDFLARE_DEPLOY_HOOK', 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...');
 *
 *   - Zone ID:   Cloudflare dashboard → your domain → Overview (right sidebar).
 *   - API Token: Cloudflare → My Profile → API Tokens → Create Token →
 *                "Zone → Cache Purge" permission, scoped to this zone only.
 *                (Use a scoped Token, NOT the Global API Key.)
 *   - Deploy Hook: Cloudflare Pages → your project → Settings → Build & deployments
 *                  → Deploy hooks → Create hook → copy the URL.
 *
 * Until constants are set the plugin is inert: it records "not configured" and
 * does nothing. Verify anytime under Tools → VFA Cache, which also has manual
 * "Purge cache" and "Trigger deploy" buttons.
 * See docs/ARCHITECTURE.md in the frontend repo for the full picture.
 */

if (!defined('ABSPATH')) exit;

// ─── Configuration ───────────────────────────────────────────────────────────

function vfa_cache_configured(): bool {
    return defined('VFA_CLOUDFLARE_ZONE_ID')   && VFA_CLOUDFLARE_ZONE_ID
        && defined('VFA_CLOUDFLARE_API_TOKEN') && VFA_CLOUDFLARE_API_TOKEN;
}

function vfa_deploy_configured(): bool {
    return defined('VFA_CLOUDFLARE_DEPLOY_HOOK') && VFA_CLOUDFLARE_DEPLOY_HOOK;
}

// Post types whose slugs appear in the sitemap — publishing these triggers a redeploy.
define('VFA_SITEMAP_POST_TYPES', ['festival_events', 'people', 'interviews', 'venues', 'books']);

// ─── Triggers: flag the cache and/or deploy dirty on content changes ──────────
//
// We don't purge/deploy immediately — a single "Save" fires several hooks. Instead
// we set per-request flags and act once at shutdown (see below), so bulk or repeated
// triggers within one request collapse into a single API call each.

function vfa_cache_mark_dirty(): void {
    $GLOBALS['vfa_cache_dirty'] = true;
}

function vfa_deploy_mark_dirty(): void {
    $GLOBALS['vfa_deploy_dirty'] = true;
}

// Posts of every type → cache purge. Sitemap post types → also trigger deploy.
add_action('save_post', function($post_id, $post) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    if (in_array($post->post_status, ['auto-draft', 'inherit'], true)) return;
    vfa_cache_mark_dirty();
    if (in_array($post->post_type, VFA_SITEMAP_POST_TYPES, true)) {
        vfa_deploy_mark_dirty();
    }
}, 10, 2);

// Removing content should purge too; also redeploy if it's a sitemap type.
add_action('trashed_post', function($post_id) {
    vfa_cache_mark_dirty();
    if (in_array(get_post_type($post_id), VFA_SITEMAP_POST_TYPES, true)) vfa_deploy_mark_dirty();
});
add_action('untrashed_post', function($post_id) {
    vfa_cache_mark_dirty();
    if (in_array(get_post_type($post_id), VFA_SITEMAP_POST_TYPES, true)) vfa_deploy_mark_dirty();
});
add_action('deleted_post', function($post_id) {
    vfa_cache_mark_dirty();
    if (in_array(get_post_type($post_id), VFA_SITEMAP_POST_TYPES, true)) vfa_deploy_mark_dirty();
});

// Terms — e.g. the "Q&A 20xx" categories that drive the Archives page.
add_action('created_term', 'vfa_cache_mark_dirty');
add_action('edited_term',  'vfa_cache_mark_dirty');
add_action('delete_term',  'vfa_cache_mark_dirty');

// ─── Execute one purge + one deploy per request, after everything else has run ─

add_action('shutdown', function() {
    if (!empty($GLOBALS['vfa_cache_dirty']) && vfa_cache_configured()) {
        vfa_cache_purge();
    }
    if (!empty($GLOBALS['vfa_deploy_dirty']) && vfa_deploy_configured()) {
        vfa_trigger_deploy();
    }
});

// ─── The purge itself ─────────────────────────────────────────────────────────

/**
 * Purge the entire Cloudflare zone. Records the outcome in an option so the admin
 * page and failure notice can report it. Returns ['ok' => bool, 'message' => str].
 */
function vfa_cache_purge(): array {
    if (!vfa_cache_configured()) {
        // Not an error — just not set up yet. Don't persist a "failure" (that would
        // trigger the site-wide admin notice). Message is shown inline on the Tools
        // page if reached via the manual button.
        return [
            'ok'      => false,
            'message' => 'Cloudflare credentials are not set in wp-config.php (VFA_CLOUDFLARE_ZONE_ID / VFA_CLOUDFLARE_API_TOKEN).',
        ];
    }

    $response = wp_remote_post(
        'https://api.cloudflare.com/client/v4/zones/' . rawurlencode(VFA_CLOUDFLARE_ZONE_ID) . '/purge_cache',
        [
            'timeout' => 15,
            'headers' => [
                'Authorization' => 'Bearer ' . VFA_CLOUDFLARE_API_TOKEN,
                'Content-Type'  => 'application/json',
            ],
            'body' => wp_json_encode(['purge_everything' => true]),
        ]
    );

    if (is_wp_error($response)) {
        return vfa_cache_record([
            'ok'      => false,
            'message' => 'Could not reach Cloudflare: ' . $response->get_error_message(),
        ]);
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code === 200 && !empty($body['success'])) {
        return vfa_cache_record(['ok' => true, 'message' => 'Cache purged.']);
    }

    $detail = !empty($body['errors']) ? wp_json_encode($body['errors']) : ('HTTP ' . $code);
    return vfa_cache_record([
        'ok'      => false,
        'message' => 'Cloudflare rejected the purge: ' . $detail,
    ]);
}

/** Store the last purge outcome (with timestamp) and log failures. */
function vfa_cache_record(array $result): array {
    $result['time'] = time();
    update_option('vfa_cache_last_result', $result, false);
    if (empty($result['ok'])) {
        error_log('[VFA Cache] Purge failed: ' . $result['message']);
    }
    return $result;
}

// ─── Deploy hook ──────────────────────────────────────────────────────────────

/**
 * POST to the Cloudflare Pages deploy hook, triggering a fresh build.
 * The build runs generate-sitemap so the sitemap reflects new content.
 */
function vfa_trigger_deploy(): array {
    if (!vfa_deploy_configured()) {
        return ['ok' => false, 'message' => 'Deploy hook URL not set in wp-config.php (VFA_CLOUDFLARE_DEPLOY_HOOK).'];
    }

    $response = wp_remote_post(VFA_CLOUDFLARE_DEPLOY_HOOK, [
        'timeout' => 15,
        'body'    => '',
    ]);

    if (is_wp_error($response)) {
        return vfa_deploy_record([
            'ok'      => false,
            'message' => 'Could not reach Cloudflare Pages: ' . $response->get_error_message(),
        ]);
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code === 200 && !empty($body['result']['id'])) {
        return vfa_deploy_record(['ok' => true, 'message' => 'Deploy triggered (build ID: ' . $body['result']['id'] . ')']);
    }

    return vfa_deploy_record([
        'ok'      => false,
        'message' => 'Cloudflare Pages rejected the deploy hook: HTTP ' . $code,
    ]);
}

function vfa_deploy_record(array $result): array {
    $result['time'] = time();
    update_option('vfa_deploy_last_result', $result, false);
    if (empty($result['ok'])) {
        error_log('[VFA Cache] Deploy trigger failed: ' . $result['message']);
    }
    return $result;
}

// ─── Admin: status page + manual purge button (Tools → VFA Cache) ─────────────

add_action('admin_menu', function() {
    add_management_page('VFA Cache', 'VFA Cache', 'manage_options', 'vfa-cache', 'vfa_cache_admin_page');
});

function vfa_cache_admin_page(): void {
    if (!current_user_can('manage_options')) return;

    $manual_purge  = null;
    $manual_deploy = null;

    if (isset($_POST['vfa_cache_purge_now']) && check_admin_referer('vfa_cache_purge_now')) {
        $manual_purge = vfa_cache_purge();
    }
    if (isset($_POST['vfa_deploy_now']) && check_admin_referer('vfa_deploy_now')) {
        $manual_deploy = vfa_trigger_deploy();
    }

    $cache_configured  = vfa_cache_configured();
    $deploy_configured = vfa_deploy_configured();
    $last_purge        = get_option('vfa_cache_last_result');
    $last_deploy       = get_option('vfa_deploy_last_result');

    echo '<div class="wrap"><h1>VFA Cache</h1>';
    echo '<p>Purges the Cloudflare cache whenever content is saved, and triggers a frontend redeploy (to update the sitemap) when interviews, events, authors, venues, or books are published.</p>';

    foreach (array_filter([$manual_purge, $manual_deploy]) as $result) {
        $cls = $result['ok'] ? 'success' : 'error';
        echo '<div class="notice notice-' . $cls . '"><p>' . esc_html($result['message']) . '</p></div>';
    }

    // ── Cache status ──
    echo '<h2>Cache purge</h2><table class="widefat striped" style="max-width:640px"><tbody>';
    echo '<tr><th>Credentials (wp-config.php)</th><td>'
        . ($cache_configured
            ? '<span style="color:#008a20">✓ Configured</span>'
            : '<span style="color:#d63638">✗ Not set — automatic purging is disabled</span>')
        . '</td></tr>';
    if ($last_purge) {
        $when   = human_time_diff($last_purge['time'], time()) . ' ago';
        $status = !empty($last_purge['ok'])
            ? '<span style="color:#008a20">✓ Success</span>'
            : '<span style="color:#d63638">✗ Failed</span>';
        echo '<tr><th>Last purge</th><td>' . $status . ' &middot; ' . esc_html($when) . '</td></tr>';
        echo '<tr><th>Last message</th><td>' . esc_html($last_purge['message']) . '</td></tr>';
    } else {
        echo '<tr><th>Last purge</th><td>None yet</td></tr>';
    }
    echo '</tbody></table>';
    echo '<form method="post" style="margin-top:8px">';
    wp_nonce_field('vfa_cache_purge_now');
    echo '<button type="submit" name="vfa_cache_purge_now" class="button button-primary">Purge entire cache now</button>';
    echo '</form>';

    // ── Deploy status ──
    echo '<h2>Deploy hook (sitemap)</h2><table class="widefat striped" style="max-width:640px"><tbody>';
    echo '<tr><th>Deploy hook (wp-config.php)</th><td>'
        . ($deploy_configured
            ? '<span style="color:#008a20">✓ Configured</span>'
            : '<span style="color:#d63638">✗ Not set — sitemap will not update automatically</span>')
        . '</td></tr>';
    echo '<tr><th>Triggers on</th><td>Publish / update / delete: interviews, events, authors, venues, books</td></tr>';
    if ($last_deploy) {
        $when   = human_time_diff($last_deploy['time'], time()) . ' ago';
        $status = !empty($last_deploy['ok'])
            ? '<span style="color:#008a20">✓ Success</span>'
            : '<span style="color:#d63638">✗ Failed</span>';
        echo '<tr><th>Last deploy</th><td>' . $status . ' &middot; ' . esc_html($when) . '</td></tr>';
        echo '<tr><th>Last message</th><td>' . esc_html($last_deploy['message']) . '</td></tr>';
    } else {
        echo '<tr><th>Last deploy</th><td>None yet</td></tr>';
    }
    echo '</tbody></table>';
    echo '<form method="post" style="margin-top:8px">';
    wp_nonce_field('vfa_deploy_now');
    echo '<button type="submit" name="vfa_deploy_now" class="button">Trigger deploy now</button>';
    echo '</form>';

    if (!$cache_configured || !$deploy_configured) {
        echo '<h2>Setup</h2><p>Add these to <code>wp-config.php</code>:</p>';
        echo '<pre style="background:#f6f7f7;padding:12px;border:1px solid #dcdcde;max-width:640px;overflow:auto">'
            . "define('VFA_CLOUDFLARE_ZONE_ID',   'your-zone-id');\n"
            . "define('VFA_CLOUDFLARE_API_TOKEN', 'your-api-token');\n"
            . "define('VFA_CLOUDFLARE_DEPLOY_HOOK', 'https://api.cloudflare.com/...');"
            . '</pre>';
        echo '<p>See the plugin header for where to find each value.</p>';
    }

    echo '</div>';
}

// Loud failure: surface a persistent purge failure on every admin screen.
add_action('admin_notices', function() {
    if (!current_user_can('manage_options')) return;
    $last = get_option('vfa_cache_last_result');
    if ($last && empty($last['ok'])) {
        echo '<div class="notice notice-error"><p><strong>VFA Cache:</strong> the last cache purge failed — '
            . esc_html($last['message']) . ' '
            . '<a href="' . esc_url(admin_url('tools.php?page=vfa-cache')) . '">Details &amp; retry</a></p></div>';
    }
});
