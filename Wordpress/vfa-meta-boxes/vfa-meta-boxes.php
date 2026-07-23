<?php
/**
 * Plugin Name: VFA Meta Boxes
 * Description: Custom meta box UI for VFA post types. No third-party dependencies.
 * Version: 1.6.0
 */

if (!defined('ABSPATH')) exit;

// ─── Configuration ───────────────────────────────────────────────────────────

function vfa_mb_config(): array {
    $year_opts = array_combine(
        array_map('strval', range(2020, 2040)),
        array_map('strval', range(2020, 2040))
    );
    $cur_year = (string) date('Y');
    $year_select = function(string $id, string $name) use ($year_opts): array {
        return ['id' => $id, 'name' => $name, 'type' => 'select', 'multiple' => true, 'year_select' => true, 'options' => $year_opts];
    };
    return [
        [
            'id'         => 'interview_fields',
            'title'      => 'Interview Fields',
            'post_types' => ['interviews'],
            'fields'     => [
                ['type' => 'section', 'name' => 'Details'],
                ['id' => 'title',          'name' => 'Title',         'type' => 'text',   'required' => true],
                ['id' => 'festival_year',  'name' => 'Festival Year', 'type' => 'number', 'std' => date('Y'), 'min' => 2020, 'max' => 2099],
                ['id' => 'author',         'name' => 'Author(s)',     'type' => 'post',   'post_type' => ['people'], 'multiple' => true],
                ['id' => 'book',           'name' => 'Book',          'type' => 'post',   'post_type' => ['books']],
                ['type' => 'section', 'name' => 'Content'],
                ['id' => 'intro',          'name' => 'Intro',         'type' => 'wysiwyg'],
                [
                    'type'   => 'clone_group',
                    'name'   => 'Q&A',
                    'fields' => [
                        ['id' => 'question',       'name' => 'Question', 'type' => 'wysiwyg', 'height' => 100],
                        ['id' => 'answer',         'name' => 'Answer',   'type' => 'wysiwyg', 'height' => 100],
                        [
                            'id'   => 'question_image',
                            'name' => 'Image',
                            'type' => 'image_advanced',
                            'desc' => 'Optional. Pairs with the question above.',
                        ],
                    ],
                ],
                ['type' => 'section', 'name' => 'Interviewer'],
                ['id' => 'interviewer_name', 'name' => 'Name', 'type' => 'text'],
                ['id' => 'interviewer_age',  'name' => 'Age',  'type' => 'number', 'min' => 0, 'max' => 99,
                 'desc' => 'For child interviewers only.'],
                ['id' => 'interviewer_bio',  'name' => 'Bio',  'type' => 'wysiwyg'],
            ],
        ],
        [
            'id'         => 'person_fields',
            'title'      => 'Person Fields',
            'post_types' => ['people'],
            'fields'     => [
                ['id' => 'title',              'name' => 'Name',              'type' => 'text', 'required' => true],
                ['id' => 'alternate_name',    'name' => 'Alternate Name',    'type' => 'text'],
                ['id' => 'name_pronunciation', 'name' => 'Name Pronunciation', 'type' => 'text',
                 'desc' => 'Optional phonetic guide, e.g. "SAHN-dra"'],
                [
                    'id'      => 'pronouns',
                    'name'    => 'Pronouns',
                    'type'    => 'select',
                    'options' => [
                        ''          => '— Select —',
                        'she_her'   => 'She/Her',
                        'he_him'    => 'He/Him',
                        'they_them' => 'They/Them',
                        'she_they'  => 'She/They',
                        'he_they'   => 'He/They',
                        'ze_zir'    => 'Ze/Zir',
                        'other'     => 'Other',
                    ],
                ],
                ['id' => 'pronouns_other', 'name' => 'Custom Pronouns', 'type' => 'text',
                 'desc' => 'Required if "Other" selected above.'],
                ['id' => 'photo',          'name' => 'Photo',          'type' => 'image_advanced'],
                [
                    'id'   => 'kidfest_photo',
                    'name' => 'Kidfest Photo',
                    'type' => 'image_advanced',
                    'desc' => 'Cartoon-style image for Kidfest. Optional.',
                ],
                ['id' => 'bio',         'name' => 'Bio',         'type' => 'wysiwyg'],
                ['id' => 'website_url', 'name' => 'Website URL', 'type' => 'url'],
                $year_select('author_years',    'Author Years'),
                $year_select('kidfest_years',   'Kidfest Years'),
                $year_select('moderator_years', 'Moderator Years'),
                $year_select('curator_years',   'Curator Years'),
                $year_select('musician_years',  'Musician Years'),
            ],
        ],
        [
            'id'         => 'venue_fields',
            'title'      => 'Venue Fields',
            'post_types' => ['venues'],
            'fields'     => [
                ['id' => 'title',              'name' => 'Name',              'type' => 'text', 'required' => true],
                ['id' => 'alternate_name', 'name' => 'Former Name', 'type' => 'text',
                 'desc' => 'e.g. "Mary Lake" or "Mount Doug"'],
                ['id' => 'name_pronunciation', 'name' => 'Name Pronunciation', 'type' => 'text',
                 'desc' => 'Optional phonetic guide, e.g. "kwuh-KWUH-tlum"'],
                [
                    'id'   => 'building',
                    'name' => 'Building',
                    'type' => 'text',
                    'desc' => 'e.g. "MacLaurin Building". Leave blank if not on a campus.',
                ],
                [
                    'id'   => 'room',
                    'name' => 'Room',
                    'type' => 'text',
                    'desc' => 'e.g. "Room A144". Leave blank if not applicable.',
                ],
                ['id' => 'street_address', 'name' => 'Street Address', 'type' => 'text'],
                ['id' => 'city',           'name' => 'City',           'type' => 'text', 'std' => 'Victoria'],
                [
                    'id'      => 'province',
                    'name'    => 'Province',
                    'type'    => 'select',
                    'std'     => 'BC',
                    'options' => [
                        'AB' => 'Alberta',                   'BC' => 'British Columbia',
                        'MB' => 'Manitoba',                  'NB' => 'New Brunswick',
                        'NL' => 'Newfoundland and Labrador', 'NS' => 'Nova Scotia',
                        'NT' => 'Northwest Territories',     'NU' => 'Nunavut',
                        'ON' => 'Ontario',                   'PE' => 'Prince Edward Island',
                        'QC' => 'Quebec',                    'SK' => 'Saskatchewan',
                        'YT' => 'Yukon',
                    ],
                ],
                ['id' => 'postal_code', 'name' => 'Postal Code', 'type' => 'text'],
                ['id' => 'country',     'name' => 'Country',      'type' => 'text', 'std' => 'Canada'],
                ['id' => 'phone',       'name' => 'Phone',        'type' => 'text'],
                ['id' => 'website_url', 'name' => 'Website',      'type' => 'url'],
                ['id' => 'description', 'name' => 'Description',  'type' => 'wysiwyg'],
            ],
        ],
        [
            'id'         => 'festival_event_fields',
            'title'      => 'Festival Event Fields',
            'post_types' => ['festival_events'],
            'fields'     => [
                // ── Key information ──────────────────────────────────────────
                ['id' => 'title', 'name' => 'Event Name', 'type' => 'text', 'required' => true],
                ['id' => 'event_date', 'name' => 'Date', 'type' => 'date'],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Time',
                    'fields' => [
                        ['id' => 'time_start', 'name' => 'Start', 'type' => 'time'],
                        ['id' => 'time_end',   'name' => 'End',   'type' => 'time'],
                    ],
                ],
                ['id' => 'venue',          'name' => 'Venue',          'type' => 'post', 'post_type' => ['venues']],
                ['id' => 'eventbrite_url', 'name' => 'Eventbrite URL', 'type' => 'url'],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Images',
                    'fields' => [
                        ['id' => 'event_image',      'name' => 'Event Image',      'type' => 'image_advanced'],
                        ['id' => 'eventbrite_image', 'name' => 'Eventbrite Image', 'type' => 'image_advanced'],
                    ],
                ],

                // ── People ───────────────────────────────────────────────────
                ['type' => 'section', 'name' => 'People'],
                [
                    'id'        => 'authors',
                    'name'      => 'Authors',
                    'type'      => 'post',
                    'post_type' => ['people'],
                    'multiple'  => true,
                    'desc'      => 'Select all participating authors.',
                ],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Support Roles',
                    'fields' => [
                        ['id' => 'moderator', 'name' => 'Moderators', 'type' => 'post', 'post_type' => ['people'], 'multiple' => true],
                        ['id' => 'curator',   'name' => 'Curators',   'type' => 'post', 'post_type' => ['people'], 'multiple' => true],
                        ['id' => 'musician',  'name' => 'Musicians',  'type' => 'post', 'post_type' => ['people'], 'multiple' => true],
                    ],
                ],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Hosted By',
                    'desc'   => 'Use free text for people or organizations without a profile page.',
                    'fields' => [
                        ['id' => 'hosts',     'name' => 'People',    'type' => 'post', 'post_type' => ['people'], 'multiple' => true],
                        ['id' => 'hosted_by', 'name' => 'Free Text', 'type' => 'text'],
                    ],
                ],

                // ── Description ──────────────────────────────────────────────
                ['type' => 'section', 'name' => 'Description'],
                ['id' => 'summary', 'name' => 'Summary', 'type' => 'text',
                 'desc' => 'One-line description for listings and schedules.'],
                ['id' => 'description', 'name' => 'Description', 'type' => 'wysiwyg'],

                // ── KidsFest ─────────────────────────────────────────────────
                ['type' => 'section', 'name' => 'KidsFest'],
                [
                    'id'   => 'is_kidfest',
                    'name' => 'KidsFest Event',
                    'type' => 'checkbox',
                    'desc' => 'Check if this is a KidsFest event.',
                ],
                ['id' => 'age_range', 'name' => 'Age Range', 'type' => 'text',
                 'desc' => 'e.g. "Ages 5–8", "Ages 8+", or "All ages".'],

                // ── Additional details ────────────────────────────────────────
                ['type' => 'section', 'name' => 'Additional Details'],
                [
                    'id'      => 'event_type',
                    'name'    => 'Event Type',
                    'type'    => 'select',
                    'std'     => 'conversation',
                    'options' => [
                        'conversation' => 'Conversation',
                        'walk'         => 'Walk',
                        'workshop'     => 'Workshop',
                        'author_fair'  => 'Author Fair',
                    ],
                ],
                ['id' => 'extra_info', 'name' => 'Extra Information', 'type' => 'text',
                 'desc' => 'e.g. "No latecomers" or "Refreshments will be provided".'],
                ['type' => 'section', 'name' => 'Tickets'],
                [
                    'type'   => 'clone_group',
                    'name'   => 'Ticket Tier',
                    'fields' => [
                        [
                            'id'      => 'ticket_type',
                            'name'    => 'Type',
                            'type'    => 'select',
                            'options' => [
                                'in_person' => 'In-Person',
                                'online'    => 'Online',
                            ],
                        ],
                        [
                            'id'   => 'ticket_tier',
                            'name' => 'Tier Name',
                            'type' => 'text',
                            'desc' => 'e.g. "Low income", "General", "Supporter"',
                        ],
                        [
                            'id'   => 'ticket_price',
                            'name' => 'Price',
                            'type' => 'text',
                            'desc' => 'e.g. "$10" or "Free"',
                        ],
                    ],
                ],
            ],
        ],
        [
            'id'         => 'book_fields',
            'title'      => 'Book Fields',
            'post_types' => ['books'],
            'fields'     => [
                ['id' => 'title',    'name' => 'Title',    'type' => 'text', 'required' => true],
                ['id' => 'subtitle', 'name' => 'Subtitle', 'type' => 'text'],
                [
                    'id'        => 'authors',
                    'name'      => 'Authors',
                    'type'      => 'post',
                    'post_type' => ['people'],
                    'multiple'  => true,
                    'desc'      => 'Select all authors of this book.',
                ],
                ['id' => 'munros_url', 'name' => 'Buy Online URL', 'type' => 'url'],
                ['id' => 'cover_image', 'name' => 'Cover Image', 'type' => 'image_advanced'],
                ['id' => 'festival_year', 'name' => 'Festival Year', 'type' => 'number', 'std' => date('Y'), 'min' => 2020, 'max' => 2099],
                ['id' => 'description', 'name' => 'Description', 'type' => 'wysiwyg'],
                [
                    'id'       => 'categories',
                    'name'     => 'Categories',
                    'type'     => 'select',
                    'multiple' => true,
                    'options'  => [
                        'children'       => 'Children',
                        'immigrant'      => 'Immigration',
                        'lgbt'           => 'LGBT',
                        'indigenous'     => 'Indigenous',
                        'romance'        => 'Romance',
                        'comedy'         => 'Comedy',
                        'illustrated'    => 'Illustrated',
                        'mystery'        => 'Mystery',
                        'nature'         => 'Nature',
                        'poetry'         => 'Poetry',
                        'social_justice' => 'Social Justice',
                    ],
                ],
                ['id' => 'additional_authors', 'name' => 'Additional Authors', 'type' => 'text',
                 'desc' => 'Names of authors without a person entry, e.g. "Jane Smith, John Doe"'],
                ['id' => 'illustrators', 'name' => 'Illustrated By', 'type' => 'text'],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Age Range',
                    'desc'   => 'For children\'s books only. Leave Max blank for "X+".',
                    'fields' => [
                        ['id' => 'age_min', 'name' => 'Min', 'type' => 'number', 'min' => 0, 'max' => 99],
                        ['id' => 'age_max', 'name' => 'Max', 'type' => 'number', 'min' => 0, 'max' => 99],
                    ],
                ],
            ],
        ],
    ];
}

// ─── Registration ─────────────────────────────────────────────────────────────

add_action('add_meta_boxes', function() {
    foreach (vfa_mb_config() as $config) {
        foreach ($config['post_types'] as $post_type) {
            add_meta_box(
                $config['id'],
                $config['title'],
                'vfa_mb_render',
                $post_type,
                'normal',
                'high',
                $config
            );
        }
    }
});

// ─── Rendering ───────────────────────────────────────────────────────────────

function vfa_mb_render(WP_Post $post, array $mb): void {
    $config = $mb['args'];
    wp_nonce_field('vfa_save_' . $config['id'], 'vfa_nonce_' . $config['id']);
    echo '<div class="vfa-mb">';
    vfa_mb_render_fields($config['fields'], $post);
    echo '</div>';
}

function vfa_mb_render_fields(array $fields, WP_Post $post): void {
    foreach ($fields as $field) {
        $type = $field['type'] ?? '';
        if ($type === 'clone_group') {
            vfa_mb_render_clone_group($field, $post);
        } elseif ($type === 'inline_fields') {
            vfa_mb_render_inline_fields($field, $post);
        } elseif ($type === 'section') {
            echo '<div class="vfa-section"><h3 class="vfa-section-title">' . esc_html($field['name']) . '</h3></div>';
        } else {
            vfa_mb_render_row($field, $post);
        }
    }
}

function vfa_mb_render_inline_fields(array $config, WP_Post $post): void {
    echo '<div class="vfa-row">';
    echo '<div class="vfa-label">' . esc_html($config['name']) . '</div>';
    echo '<div class="vfa-input"><div class="vfa-inline">';
    foreach ($config['fields'] as $sub) {
        echo '<div class="vfa-inline-item">';
        echo '<label class="vfa-inline-label" for="' . esc_attr($sub['id']) . '">' . esc_html($sub['name']) . '</label>';
        vfa_mb_render_field($sub, $post);
        echo '</div>';
    }
    echo '</div>';
    if (!empty($config['desc'])) {
        echo '<p class="description">' . esc_html($config['desc']) . '</p>';
    }
    echo '</div></div>';
}

function vfa_mb_render_row(array $field, WP_Post $post): void {
    $is_checkbox = $field['type'] === 'checkbox';
    $required    = !empty($field['required']);
    $label       = esc_html($field['name']) . ($required ? ' <span class="required">*</span>' : '');
    $row_class   = in_array($field['type'], ['wysiwyg', 'image_advanced']) ? 'vfa-row vfa-row--full' : 'vfa-row';

    echo '<div class="' . $row_class . '">';
    echo '<div class="vfa-label"><label for="' . esc_attr($field['id']) . '">' . $label . '</label></div>';
    echo '<div class="vfa-input">';
    vfa_mb_render_field($field, $post);
    if (!empty($field['desc']) && !$is_checkbox) {
        echo '<p class="description">' . esc_html($field['desc']) . '</p>';
    }
    echo '</div>';
    echo '</div>';
}

function vfa_mb_render_field(array $field, WP_Post $post): void {
    $id   = $field['id'];
    $type = $field['type'];

    if (!empty($field['clone'])) {
        vfa_mb_render_clone($field, $post);
        return;
    }

    switch ($type) {
        case 'text':
        case 'url':
            $value = vfa_mb_get_value($field, $post);
            $attrs = sprintf('type="%s" id="%s" name="%s" value="%s" class="regular-text"%s',
                $type === 'url' ? 'url' : 'text',
                esc_attr($id), esc_attr($id), esc_attr($value),
                $type === 'url' ? ' placeholder="https://"' : ''
            );
            if (!empty($field['required'])) $attrs .= ' required';
            echo '<input ' . $attrs . '>';
            break;

        case 'number':
            $value = vfa_mb_get_value($field, $post);
            $min   = isset($field['min']) ? ' min="' . (int)$field['min'] . '"' : '';
            $max   = isset($field['max']) ? ' max="' . (int)$field['max'] . '"' : '';
            echo '<input type="number" id="' . esc_attr($id) . '" name="' . esc_attr($id) . '" value="' . esc_attr($value) . '" class="small-text"' . $min . $max . '>';
            break;

        case 'textarea':
            $value = vfa_mb_get_value($field, $post);
            echo '<textarea id="' . esc_attr($id) . '" name="' . esc_attr($id) . '" rows="4" class="large-text">' . esc_textarea($value) . '</textarea>';
            break;

        case 'wysiwyg':
            $value     = vfa_mb_get_value($field, $post);
            $editor_id = 'vfa' . preg_replace('/[^a-z0-9]/', '', strtolower($id));
            wp_editor($value, $editor_id, [
                'textarea_name' => $id,
                'media_buttons' => false,
                'teeny'         => true,
                'editor_height' => $field['height'] ?? 100,
                'quicktags'     => true,
            ]);
            break;

        case 'checkbox':
            $checked = get_post_meta($post->ID, $id, true) ? ' checked' : '';
            echo '<input type="hidden" name="' . esc_attr($id) . '" value="0">';
            echo '<label>';
            echo '<input type="checkbox" id="' . esc_attr($id) . '" name="' . esc_attr($id) . '" value="1"' . $checked . '>';
            if (!empty($field['desc'])) echo ' ' . esc_html($field['desc']);
            echo '</label>';
            break;

        case 'select':
            if (!empty($field['multiple'])) {
                $values = array_map('strval', get_post_meta($post->ID, $id, false));
                $class  = !empty($field['year_select']) ? 'vfa-multi-select vfa-year-select' : 'vfa-multi-select';
                echo '<select id="' . esc_attr($id) . '" name="' . esc_attr($id) . '[]" class="' . $class . '" multiple>';
                foreach ($field['options'] as $opt_val => $opt_label) {
                    $sel = in_array((string)$opt_val, $values) ? ' selected' : '';
                    echo '<option value="' . esc_attr($opt_val) . '"' . $sel . '>' . esc_html($opt_label) . '</option>';
                }
                echo '</select>';
            } else {
                $value = vfa_mb_get_value($field, $post);
                echo '<select id="' . esc_attr($id) . '" name="' . esc_attr($id) . '">';
                foreach ($field['options'] as $opt_val => $opt_label) {
                    $sel = $value === (string)$opt_val ? ' selected' : '';
                    echo '<option value="' . esc_attr($opt_val) . '"' . $sel . '>' . esc_html($opt_label) . '</option>';
                }
                echo '</select>';
            }
            break;

        case 'date':
            $value = get_post_meta($post->ID, $id, true);
            echo '<input type="date" id="' . esc_attr($id) . '" name="' . esc_attr($id) . '" value="' . esc_attr($value) . '">';
            break;

        case 'time':
            $value = get_post_meta($post->ID, $id, true);
            echo '<input type="time" id="' . esc_attr($id) . '" name="' . esc_attr($id) . '" value="' . esc_attr($value) . '">';
            break;

        case 'image_advanced':
            vfa_mb_render_image($id, get_post_meta($post->ID, $id, true), $id);
            break;

        case 'post':
            $multiple    = !empty($field['multiple']);
            $post_types  = $field['post_type'] ?? ['post'];
            $current_ids = $multiple
                ? array_map('intval', get_post_meta($post->ID, $id, false))
                : [(int) get_post_meta($post->ID, $id, true)];

            $related = get_posts([
                'post_type'      => $post_types,
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'orderby'        => 'title',
                'order'          => 'ASC',
            ]);

            $name          = $multiple ? esc_attr($id) . '[]' : esc_attr($id);
            $multiple_attr = $multiple ? ' multiple' : '';

            echo '<select id="' . esc_attr($id) . '" name="' . $name . '" class="vfa-post-select"' . $multiple_attr . '>';
            if (!$multiple) echo '<option value="">— Select —</option>';
            foreach ($related as $p) {
                $sel   = in_array($p->ID, $current_ids) ? ' selected' : '';
                $label = vfa_mb_post_option_label($p, $post_types);
                echo '<option value="' . esc_attr($p->ID) . '"' . $sel . '>' . esc_html($label) . '</option>';
            }
            echo '</select>';
            break;
    }
}

function vfa_mb_post_option_label(WP_Post $p, array $post_types): string {
    $label = $p->post_title;
    if (in_array('venues', $post_types)) {
        $building = get_post_meta($p->ID, 'building', true);
        $room     = get_post_meta($p->ID, 'room', true);
        $parts    = array_filter([$building, $room]);
        if ($parts) $label .= ' – ' . implode(', ', $parts);
    }
    return $label;
}

function vfa_mb_render_image(string $field_id, $attachment_id, string $input_name): void {
    $src     = $attachment_id ? wp_get_attachment_image_url((int)$attachment_id, 'medium') : '';
    $display = $src ? '' : ' style="display:none"';

    echo '<div class="vfa-img">';
    echo '<input type="hidden" name="' . esc_attr($input_name) . '" value="' . esc_attr($attachment_id ?: '') . '">';
    echo '<div class="vfa-img-preview"' . $display . '>';
    echo '<img src="' . esc_url($src ?: '') . '" alt="">';
    echo '<button type="button" class="button vfa-img-remove">Remove</button>';
    echo '</div>';
    echo '<button type="button" class="button vfa-img-select">Select Image</button>';
    echo '</div>';
}

// Repeating clone field (single field type, multiple rows)
function vfa_mb_render_clone(array $field, WP_Post $post): void {
    $id     = $field['id'];
    $type   = $field['type'];
    $values = get_post_meta($post->ID, $id, false);
    if (empty($values)) $values = [''];

    echo '<div class="vfa-clone" id="clone-' . esc_attr($id) . '">';
    echo '<div class="vfa-clone-rows">';
    foreach ($values as $val) {
        echo '<div class="vfa-clone-row">';
        vfa_mb_render_clone_input($field, $val);
        echo '<button type="button" class="button vfa-clone-remove" title="Remove">&#x2715;</button>';
        echo '</div>';
    }
    echo '</div>';

    echo '<template>';
    echo '<div class="vfa-clone-row">';
    vfa_mb_render_clone_input($field, '');
    echo '<button type="button" class="button vfa-clone-remove" title="Remove">&#x2715;</button>';
    echo '</div>';
    echo '</template>';

    echo '<button type="button" class="button vfa-clone-add">+ Add ' . esc_html($field['name']) . '</button>';
    echo '</div>';

    if (!empty($field['desc'])) {
        echo '<p class="description">' . esc_html($field['desc']) . '</p>';
    }
}

function vfa_mb_render_clone_input(array $field, $value): void {
    $id   = $field['id'];
    $type = $field['type'];
    switch ($type) {
        case 'text':
        case 'url':
            $placeholder = $type === 'url' ? ' placeholder="https://"' : '';
            echo '<input type="' . ($type === 'url' ? 'url' : 'text') . '" name="' . esc_attr($id) . '[]" value="' . esc_attr($value) . '" class="regular-text"' . $placeholder . '>';
            break;
        case 'number':
            $min = isset($field['min']) ? ' min="' . (int)$field['min'] . '"' : '';
            $max = isset($field['max']) ? ' max="' . (int)$field['max'] . '"' : '';
            echo '<input type="number" name="' . esc_attr($id) . '[]" value="' . esc_attr($value) . '" class="small-text"' . $min . $max . '>';
            break;
        case 'textarea':
            echo '<textarea name="' . esc_attr($id) . '[]" rows="3" class="large-text">' . esc_textarea($value) . '</textarea>';
            break;
        case 'image_advanced':
            vfa_mb_render_image($id, $value, $id . '[]');
            break;
    }
}

// Repeating group (multiple field types grouped into one repeating row)
function vfa_mb_render_clone_group(array $cg, WP_Post $post): void {
    $label = esc_html($cg['name']);

    // Collect existing values for each sub-field; count = longest array
    $sub_values = [];
    $count      = 0;
    foreach ($cg['fields'] as $sub) {
        $vals                    = get_post_meta($post->ID, $sub['id'], false);
        $sub_values[$sub['id']] = $vals;
        $count                   = max($count, count($vals));
    }
    if ($count === 0) $count = 1;

    echo '<div class="vfa-cg" data-name="' . $label . '">';
    echo '<div class="vfa-cg-rows">';
    for ($i = 0; $i < $count; $i++) {
        echo '<div class="vfa-cg-row">';
        echo '<div class="vfa-cg-row-head">';
        echo '<span class="vfa-cg-num">' . $label . ' ' . ($i + 1) . '</span>';
        echo '<button type="button" class="button vfa-cg-remove">Remove</button>';
        echo '</div>';
        foreach ($cg['fields'] as $sub) {
            $val = $sub_values[$sub['id']][$i] ?? '';
            vfa_mb_render_cg_sub_field($sub, $val, false, $i);
        }
        echo '</div>';
    }
    echo '</div>';

    echo '<template>';
    echo '<div class="vfa-cg-row">';
    echo '<div class="vfa-cg-row-head">';
    echo '<span class="vfa-cg-num">' . $label . ' N</span>';
    echo '<button type="button" class="button vfa-cg-remove">Remove</button>';
    echo '</div>';
    foreach ($cg['fields'] as $sub) {
        vfa_mb_render_cg_sub_field($sub, '', true, 0);
    }
    echo '</div>';
    echo '</template>';

    echo '<button type="button" class="button vfa-cg-add">+ Add ' . $label . '</button>';
    echo '</div>';
}

function vfa_mb_render_cg_sub_field(array $field, $value, bool $is_template = false, int $index = 0): void {
    $row_class = $field['type'] === 'wysiwyg' ? 'vfa-row vfa-row--full' : 'vfa-row';
    echo '<div class="' . $row_class . '">';
    echo '<div class="vfa-label"><label>' . esc_html($field['name']) . '</label></div>';
    echo '<div class="vfa-input">';
    switch ($field['type']) {
        case 'text':
            echo '<input type="text" name="' . esc_attr($field['id']) . '[]" value="' . esc_attr($value) . '" class="regular-text">';
            break;
        case 'textarea':
            echo '<textarea name="' . esc_attr($field['id']) . '[]" rows="4" class="large-text">' . esc_textarea($value) . '</textarea>';
            break;
        case 'wysiwyg':
            $h = $field['height'] ?? 100;
            if ($is_template) {
                echo '<textarea name="' . esc_attr($field['id']) . '[]" class="vfa-wysiwyg-init large-text" rows="4" data-height="' . (int)$h . '"></textarea>';
            } else {
                $editor_id = 'vfa' . preg_replace('/[^a-z0-9]/', '', strtolower($field['id'])) . $index;
                wp_editor((string)$value, $editor_id, [
                    'textarea_name' => $field['id'] . '[]',
                    'media_buttons' => false,
                    'teeny'         => true,
                    'editor_height' => $h,
                    'quicktags'     => true,
                ]);
            }
            break;
        case 'select':
            echo '<select name="' . esc_attr($field['id']) . '[]">';
            foreach ($field['options'] as $opt_val => $opt_label) {
                $sel = (string)$value === (string)$opt_val ? ' selected' : '';
                echo '<option value="' . esc_attr($opt_val) . '"' . $sel . '>' . esc_html($opt_label) . '</option>';
            }
            echo '</select>';
            break;
        case 'image_advanced':
            vfa_mb_render_image($field['id'], $value, $field['id'] . '[]');
            break;
    }
    if (!empty($field['desc'])) {
        echo '<p class="description">' . esc_html($field['desc']) . '</p>';
    }
    echo '</div>';
    echo '</div>';
}

function vfa_mb_get_value(array $field, WP_Post $post): string {
    $value = get_post_meta($post->ID, $field['id'], true);
    if ($field['id'] === 'title' && ($value === '' || $value === null)) {
        $title = $post->post_title;
        return $title !== '(no title)' ? $title : '';
    }
    if (($value === '' || $value === null) && isset($field['std'])) {
        return (string)$field['std'];
    }
    return (string)($value ?? '');
}

// ─── Saving ──────────────────────────────────────────────────────────────────

add_action('save_post', function(int $post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $post_type = get_post_type($post_id);

    foreach (vfa_mb_config() as $config) {
        if (!in_array($post_type, $config['post_types'])) continue;

        $nonce_name = 'vfa_nonce_' . $config['id'];
        if (empty($_POST[$nonce_name]) || !wp_verify_nonce($_POST[$nonce_name], 'vfa_save_' . $config['id'])) {
            continue;
        }

        vfa_mb_save_fields($config['fields'], $post_id);
    }
}, 20);

function vfa_mb_save_fields(array $fields, int $post_id): void {
    foreach ($fields as $field) {
        $type = $field['type'] ?? '';
        if ($type === 'clone_group') {
            foreach ($field['fields'] as $sub) {
                $sub['clone'] = true;
                vfa_mb_save_field($sub, $post_id);
            }
        } elseif ($type === 'inline_fields') {
            foreach ($field['fields'] as $sub) {
                vfa_mb_save_field($sub, $post_id);
            }
        } elseif ($type === 'section') {
            // nothing to save
        } else {
            vfa_mb_save_field($field, $post_id);
        }
    }
}

function vfa_mb_save_field(array $field, int $post_id): void {
    $id       = $field['id'];
    $type     = $field['type'];
    $is_multi = !empty($field['clone']) || (!empty($field['multiple']) && in_array($type, ['post', 'select']));

    if ($is_multi) {
        delete_post_meta($post_id, $id);
        $values = isset($_POST[$id]) && is_array($_POST[$id]) ? $_POST[$id] : [];
        foreach ($values as $val) {
            $clean = vfa_mb_sanitize($type, $val);
            if ($clean !== '') {
                add_post_meta($post_id, $id, $clean);
            }
        }
    } else {
        $raw   = $_POST[$id] ?? ($type === 'checkbox' ? '0' : null);
        $clean = vfa_mb_sanitize($type, $raw);
        update_post_meta($post_id, $id, $clean);
    }
}

function vfa_mb_sanitize(string $type, $value): string {
    $value = $value ?? '';
    switch ($type) {
        case 'text':         return sanitize_text_field($value);
        case 'textarea':     return sanitize_textarea_field($value);
        case 'wysiwyg':      return wp_kses_post($value);
        case 'url':          return (filter_var($value, FILTER_VALIDATE_URL) !== false) ? esc_url_raw($value) : '';
        case 'number':       return is_numeric($value) ? (string)(int)$value : '';
        case 'checkbox':     return $value === '1' ? '1' : '0';
        case 'select':       return sanitize_text_field($value);
        case 'date':         return preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) ? $value : '';
        case 'time':         return preg_match('/^\d{2}:\d{2}/', $value) ? $value : '';
        case 'post':
        case 'image_advanced':
            return is_numeric($value) && (int)$value > 0 ? (string)(int)$value : '';
        default:             return sanitize_text_field($value);
    }
}

// ─── Assets ──────────────────────────────────────────────────────────────────

add_action('admin_enqueue_scripts', function(string $hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'])) return;
    $screen = get_current_screen();
    if (!$screen) return;
    $types = ['interviews', 'people', 'festival_events', 'venues', 'books'];
    if (!in_array($screen->post_type, $types)) return;

    wp_enqueue_media();

    wp_enqueue_style(
        'tom-select',
        'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.default.min.css',
        [],
        null
    );
    wp_enqueue_script(
        'tom-select',
        'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js',
        [],
        null,
        true
    );

    // Runs after tom-select.js is printed in the footer
    wp_add_inline_script('tom-select', vfa_mb_js());
});

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (!$screen) return;
    $types = ['interviews', 'people', 'festival_events', 'venues', 'books'];
    if (!in_array($screen->post_type ?? '', $types)) return;
    echo '<style>' . vfa_mb_css() . '</style>';
});


// ─── CSS ─────────────────────────────────────────────────────────────────────

function vfa_mb_css(): string {
    return '
.vfa-mb { padding: 4px 0; }

.vfa-row {
    display: flex;
    gap: 16px;
    margin-bottom: 14px;
    align-items: flex-start;
}

/* Stacked layout for wysiwyg fields so editors use full width */
.vfa-row--full {
    flex-direction: column;
    gap: 4px;
}

.vfa-row--full .vfa-label {
    width: auto;
    padding-top: 0;
}

.vfa-row--full .vfa-input {
    width: 100%;
}

.vfa-label {
    width: 160px;
    flex-shrink: 0;
    padding-top: 5px;
    font-weight: 600;
}

.vfa-label .required { color: #d63638; }

.vfa-input { flex: 1; min-width: 0; }

.vfa-input .description { margin-top: 4px; }

/* Make text/url inputs fill their column instead of using WP fixed widths */
.vfa-input input[type="text"],
.vfa-input input[type="url"] {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

/* Keep number/date/time inputs from overflowing but sized to content */
.vfa-mb input[type="number"],
.vfa-mb input[type="date"],
.vfa-mb input[type="time"] {
    max-width: 100%;
    box-sizing: border-box;
}

/* Tom Select fills its column */
.vfa-input .ts-wrapper {
    max-width: 100%;
}

/* Section dividers */
.vfa-section {
    margin: 20px 0 12px;
    padding-top: 16px;
    border-top: 2px solid #dcdcde;
}

.vfa-section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: #50575e;
    margin: 0;
}

/* Inline side-by-side fields (e.g. Min / Max age) */
.vfa-inline {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    flex-wrap: wrap;
}

.vfa-inline-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 0;
}

.vfa-inline-item .ts-wrapper {
    max-width: none;
    width: 100%;
}

.vfa-inline-item input[type="text"] {
    width: 100%;
    box-sizing: border-box;
}

.vfa-inline-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .04em;
    color: #50575e;
}

/* Clone group (repeating rows of multiple fields) */
.vfa-cg-rows { margin-bottom: 8px; }

.vfa-cg-row {
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    margin-bottom: 10px;
    background: #f9f9f9;
}

.vfa-cg-row-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    background: #f0f0f0;
    border-bottom: 1px solid #c3c4c7;
    border-radius: 4px 4px 0 0;
}

.vfa-cg-num {
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #50575e;
}

.vfa-cg-row .vfa-row {
    padding: 0 10px;
    margin-bottom: 10px;
}

.vfa-cg-row .vfa-row:first-of-type { padding-top: 10px; }

/* Simple clone (single field, repeating) */
.vfa-clone-rows { margin-bottom: 6px; }

.vfa-clone-row {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 6px;
}

.vfa-clone-row input[type="text"],
.vfa-clone-row input[type="url"],
.vfa-clone-row textarea { flex: 1; }

.vfa-clone-remove {
    flex-shrink: 0;
    padding: 0 8px !important;
    line-height: 28px !important;
    height: 28px !important;
}

/* Image picker */
.vfa-img-preview { margin-bottom: 8px; }

.vfa-img-preview img {
    display: block;
    max-width: 200px;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-bottom: 6px;
}

/* Tom Select overrides for WP admin */
.ts-wrapper { max-width: 400px; }

.ts-control {
    border-color: #8c8f94 !important;
    border-radius: 4px !important;
    box-shadow: none !important;
    min-height: 32px !important;
    padding: 3px 6px !important;
    background: #fff !important;
    font-size: 13px !important;
    font-family: inherit !important;
}

.ts-control:focus-within {
    border-color: #2271b1 !important;
    box-shadow: 0 0 0 1px #2271b1 !important;
}

.ts-dropdown {
    border-color: #8c8f94 !important;
    border-radius: 0 0 4px 4px !important;
    font-size: 13px !important;
    font-family: inherit !important;
    z-index: 9999 !important;
}

.ts-dropdown .option { padding: 6px 10px !important; }

.ts-dropdown .option:hover,
.ts-dropdown .option.active { background: #2271b1 !important; color: #fff !important; }

.ts-control .item {
    background: #e0e8f5 !important;
    border: 1px solid #b3c7e6 !important;
    border-radius: 3px !important;
    color: #1d4480 !important;
    padding: 1px 6px !important;
    font-size: 12px !important;
}

.ts-control .item .remove {
    color: #1d4480 !important;
    border-left-color: #b3c7e6 !important;
}

.ts-control input { font-family: inherit !important; font-size: 13px !important; }
';
}

// ─── JavaScript ──────────────────────────────────────────────────────────────

function vfa_mb_js(): string {
    return '
(function() {
    "use strict";

    // Search-select for post relationship fields
    document.querySelectorAll(".vfa-post-select").forEach(function(el) {
        new TomSelect(el, {
            plugins: el.multiple ? ["remove_button"] : ["clear_button"],
            create: false,
            allowEmptyOption: !el.multiple,
            placeholder: "Search...",
            maxOptions: null,
        });
    });

    // Multi-select for option fields (e.g. categories and year selects)
    var currentYear = new Date().getFullYear().toString();
    document.querySelectorAll(".vfa-multi-select").forEach(function(el) {
        var isYear = el.classList.contains("vfa-year-select");
        var config = {
            plugins: ["remove_button"],
            create: false,
            maxOptions: null,
        };
        if (isYear) {
            config.onDropdownOpen = function() {
                var opt = this.getOption(currentYear);
                if (opt) this.setActiveOption(opt);
            };
        }
        new TomSelect(el, config);
    });

    // Image picker
    function openPicker(wrap) {
        var frame = wp.media({
            title: "Select Image",
            button: { text: "Use this image" },
            multiple: false,
            library: { type: "image" },
        });
        frame.on("select", function() {
            var att   = frame.state().get("selection").first().toJSON();
            var src   = (att.sizes && att.sizes.medium) ? att.sizes.medium.url : att.url;
            var input = wrap.querySelector("input[type=\'hidden\']");
            var img   = wrap.querySelector(".vfa-img-preview img");
            var prev  = wrap.querySelector(".vfa-img-preview");
            input.value = att.id;
            img.src     = src;
            prev.style.display = "";
        });
        frame.open();
    }

    // Update "Q&A 1", "Q&A 2", etc. after add/remove
    function updateCgNums(cg) {
        var name = cg.dataset.name || "";
        cg.querySelectorAll(".vfa-cg-rows > .vfa-cg-row").forEach(function(row, i) {
            var num = row.querySelector(".vfa-cg-num");
            if (num) num.textContent = name + " " + (i + 1);
        });
    }

    document.addEventListener("click", function(e) {

        // Image: select
        var sel = e.target.closest(".vfa-img-select");
        if (sel) { e.preventDefault(); openPicker(sel.closest(".vfa-img")); return; }

        // Image: remove
        var rem = e.target.closest(".vfa-img-remove");
        if (rem) {
            e.preventDefault();
            var wrap  = rem.closest(".vfa-img");
            wrap.querySelector("input[type=\'hidden\']").value = "";
            wrap.querySelector(".vfa-img-preview img").src = "";
            wrap.querySelector(".vfa-img-preview").style.display = "none";
            return;
        }

        // Clone group: add row
        var cgAdd = e.target.closest(".vfa-cg-add");
        if (cgAdd) {
            e.preventDefault();
            var cg   = cgAdd.closest(".vfa-cg");
            var tmpl = cg.querySelector("template");
            var rows = cg.querySelector(".vfa-cg-rows");
            rows.appendChild(document.importNode(tmpl.content, true));
            updateCgNums(cg);
            // Initialize TinyMCE on any wysiwyg placeholders in the new row
            var newRow = rows.lastElementChild;
            newRow.querySelectorAll(".vfa-wysiwyg-init").forEach(function(el) {
                var uid = "vfacg" + Date.now() + Math.random().toString(36).substr(2, 5);
                el.id = uid;
                el.classList.remove("vfa-wysiwyg-init");
                if (window.wp && wp.editor) {
                    var h = parseInt(el.dataset.height) || 100;
                    wp.editor.initialize(uid, {
                        tinymce: { wpautop: true, height: h, toolbar1: "bold italic | link unlink | bullist numlist | undo redo", plugins: "lists,link" },
                        quicktags: true,
                        mediaButtons: false,
                    });
                }
            });
            return;
        }

        // Clone group: remove row
        var cgRem = e.target.closest(".vfa-cg-remove");
        if (cgRem) {
            e.preventDefault();
            var row  = cgRem.closest(".vfa-cg-row");
            var cg   = cgRem.closest(".vfa-cg");
            var rows = cg.querySelector(".vfa-cg-rows");
            if (rows.querySelectorAll(".vfa-cg-row").length > 1) {
                // Clean up TinyMCE instances before removing from DOM
                row.querySelectorAll("textarea.wp-editor-area").forEach(function(el) {
                    if (el.id && window.wp && wp.editor) wp.editor.remove(el.id);
                });
                row.remove();
            } else {
                // Last row — clear content rather than remove
                row.querySelectorAll("textarea.wp-editor-area").forEach(function(el) {
                    if (el.id && window.tinymce && tinymce.get(el.id)) tinymce.get(el.id).setContent("");
                    el.value = "";
                });
                row.querySelectorAll("input:not([type=\'hidden\']), textarea:not(.wp-editor-area)").forEach(function(el) { el.value = ""; });
                row.querySelectorAll("input[type=\'hidden\']").forEach(function(el) { el.value = ""; });
                row.querySelectorAll(".vfa-img-preview").forEach(function(el) { el.style.display = "none"; el.querySelector("img").src = ""; });
            }
            updateCgNums(cg);
            return;
        }

        // Simple clone: add row
        var cloneAdd = e.target.closest(".vfa-clone-add");
        if (cloneAdd) {
            e.preventDefault();
            var clone = cloneAdd.closest(".vfa-clone");
            var tmpl  = clone.querySelector("template");
            var rows  = clone.querySelector(".vfa-clone-rows");
            rows.appendChild(document.importNode(tmpl.content, true));
            return;
        }

        // Simple clone: remove row
        var cloneRem = e.target.closest(".vfa-clone-remove");
        if (cloneRem) {
            e.preventDefault();
            var row  = cloneRem.closest(".vfa-clone-row");
            var rows = row.closest(".vfa-clone-rows");
            if (rows.querySelectorAll(".vfa-clone-row").length > 1) {
                row.remove();
            } else {
                row.querySelectorAll("input, textarea").forEach(function(el) { el.value = ""; });
            }
            return;
        }

    });
})();
';
}
