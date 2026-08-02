<?php
/**
 * Plugin Name: VFA Cache
 * Description: Purges the Cloudflare cache whenever content changes, so edits appear
 *              on the live site within seconds with no manual intervention. Busts the
 *              entire cache (simple + reliable; saves are infrequent).
 * Version: 1.0.0
 *
 * ── SETUP (one time) ─────────────────────────────────────────────────────────
 * Credentials are read from wp-config.php so they are never stored in this plugin
 * or its zip. Add these two lines to wp-config.php (above "That's all, stop editing"):
 *
 *   define('VFA_CLOUDFLARE_ZONE_ID',   'your-zone-id');
 *   define('VFA_CLOUDFLARE_API_TOKEN', 'your-api-token');
 *
 *   - Zone ID:   Cloudflare dashboard → your domain → Overview (right sidebar).
 *   - API Token: Cloudflare → My Profile → API Tokens → Create Token →
 *                "Zone → Cache Purge" permission, scoped to this zone only.
 *                (Use a scoped Token, NOT the Global API Key.)
 *
 * Until both constants are set (and Cloudflare is in front of the site) the plugin
 * is inert: it records "not configured" and does nothing. Verify anytime under
 * Tools → VFA Cache, which also has a manual "Purge now" button.
 * See docs/ARCHITECTURE.md in the frontend repo for the full picture.
 */

if (!defined('ABSPATH')) exit;

// ─── Configuration ───────────────────────────────────────────────────────────

function vfa_cache_configured(): bool {
    return defined('VFA_CLOUDFLARE_ZONE_ID')   && VFA_CLOUDFLARE_ZONE_ID
        && defined('VFA_CLOUDFLARE_API_TOKEN') && VFA_CLOUDFLARE_API_TOKEN;
}

// ─── Triggers: flag the cache dirty on any content change ─────────────────────
//
// We don't purge immediately — a single "Save" fires several hooks. Instead we set
// a per-request flag and do exactly one purge at shutdown (see below), so bulk or
// repeated triggers within one request collapse into a single Cloudflare API call.

function vfa_cache_mark_dirty(): void {
    $GLOBALS['vfa_cache_dirty'] = true;
}

// Posts of every type (create / edit / publish / unpublish). Skip the noise.
add_action('save_post', function($post_id, $post) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    if (in_array($post->post_status, ['auto-draft', 'inherit'], true)) return;
    vfa_cache_mark_dirty();
}, 10, 2);

// Removing content should purge too.
add_action('trashed_post',   'vfa_cache_mark_dirty');
add_action('untrashed_post', 'vfa_cache_mark_dirty');
add_action('deleted_post',   'vfa_cache_mark_dirty');

// Terms — e.g. the "Q&A 20xx" categories that drive the Archives page.
add_action('created_term', 'vfa_cache_mark_dirty');
add_action('edited_term',  'vfa_cache_mark_dirty');
add_action('delete_term',  'vfa_cache_mark_dirty');

// ─── Execute one purge per request, after everything else has run ─────────────

add_action('shutdown', function() {
    // Stay completely dormant until credentials are set — no calls, no stored state.
    // Safe to activate before Cloudflare is ready; it simply does nothing.
    if (!empty($GLOBALS['vfa_cache_dirty']) && vfa_cache_configured()) {
        vfa_cache_purge();
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

// ─── Admin: status page + manual purge button (Tools → VFA Cache) ─────────────

add_action('admin_menu', function() {
    add_management_page('VFA Cache', 'VFA Cache', 'manage_options', 'vfa-cache', 'vfa_cache_admin_page');
});

function vfa_cache_admin_page(): void {
    if (!current_user_can('manage_options')) return;

    $manual = null;
    if (isset($_POST['vfa_cache_purge_now']) && check_admin_referer('vfa_cache_purge_now')) {
        $manual = vfa_cache_purge();
    }

    $configured = vfa_cache_configured();
    $last       = get_option('vfa_cache_last_result');

    echo '<div class="wrap"><h1>VFA Cache</h1>';
    echo '<p>Purges the Cloudflare cache automatically whenever content is saved, so edits go live within seconds.</p>';

    if ($manual) {
        $cls = $manual['ok'] ? 'success' : 'error';
        echo '<div class="notice notice-' . $cls . '"><p>' . esc_html($manual['message']) . '</p></div>';
    }

    echo '<h2>Status</h2><table class="widefat striped" style="max-width:640px"><tbody>';
    echo '<tr><th>Credentials (wp-config.php)</th><td>'
        . ($configured
            ? '<span style="color:#008a20">✓ Configured</span>'
            : '<span style="color:#d63638">✗ Not set — automatic purging is disabled</span>')
        . '</td></tr>';

    if ($last) {
        $when   = human_time_diff($last['time'], time()) . ' ago';
        $status = !empty($last['ok'])
            ? '<span style="color:#008a20">✓ Success</span>'
            : '<span style="color:#d63638">✗ Failed</span>';
        echo '<tr><th>Last purge</th><td>' . $status . ' &middot; ' . esc_html($when) . '</td></tr>';
        echo '<tr><th>Last message</th><td>' . esc_html($last['message']) . '</td></tr>';
    } else {
        echo '<tr><th>Last purge</th><td>None yet</td></tr>';
    }
    echo '</tbody></table>';

    echo '<h2>Manual purge</h2>';
    echo '<p>Use this to test the connection or force a refresh.</p>';
    echo '<form method="post">';
    wp_nonce_field('vfa_cache_purge_now');
    echo '<p><button type="submit" name="vfa_cache_purge_now" class="button button-primary">Purge entire cache now</button></p>';
    echo '</form>';

    if (!$configured) {
        echo '<h2>Setup</h2><p>Add these to <code>wp-config.php</code>, then reload this page:</p>';
        echo '<pre style="background:#f6f7f7;padding:12px;border:1px solid #dcdcde;max-width:640px;overflow:auto">'
            . "define('VFA_CLOUDFLARE_ZONE_ID',   'your-zone-id');\n"
            . "define('VFA_CLOUDFLARE_API_TOKEN', 'your-api-token');"
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
