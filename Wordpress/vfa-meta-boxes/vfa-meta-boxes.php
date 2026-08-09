<?php
/**
 * Plugin Name: VFA Meta Boxes
 * Description: Custom meta box UI for VFA post types. No third-party dependencies.
 * Version: 1.10.0
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
                ['id' => 'book', 'name' => 'Book Override', 'type' => 'post', 'post_type' => ['books'],
                 'desc' => 'Optional. Leave blank to use the author\'s first book automatically.'],
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
                    'type'   => 'inline_fields',
                    'name'   => 'Pronouns',
                    'fields' => [
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
                        ['id' => 'pronouns_other', 'name' => 'Other', 'type' => 'text',
                         'desc' => 'Required if "Other" selected above.'],
                    ],
                ],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Photos',
                    'fields' => [
                        ['id' => 'photo',        'name' => 'Photo 7x10',   'type' => 'image_advanced'],
                        ['id' => 'photo_square', 'name' => 'Photo Square', 'type' => 'image_advanced'],
                        ['id' => 'kidfest_photo', 'name' => 'Kidfest Photo', 'type' => 'image_advanced',
                         'desc' => 'Cartoon-style image for Kidfest. Optional.'],
                    ],
                ],
                ['id' => 'bio',         'name' => 'Bio',         'type' => 'wysiwyg'],
                ['id' => 'website_url', 'name' => 'Website URL', 'type' => 'url'],
                $year_select('author_years',    'Author Years'),
                $year_select('kidfest_years',   'Kidfest Years'),
                $year_select('elder_years',     'Elder Years'),
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
                ['id' => 'description',   'name' => 'Description',   'type' => 'wysiwyg'],
                ['id' => 'accessibility', 'name' => 'Accessibility', 'type' => 'wysiwyg',
                 'desc' => 'Wheelchair access, hearing loops, parking, accessible washrooms, etc.'],
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

                // ── Promotion ────────────────────────────────────────────────
                ['type' => 'section', 'name' => 'Promotion'],
                [
                    'id'   => 'is_featured',
                    'name' => 'Featured Event',
                    'type' => 'checkbox',
                    'desc' => 'Highlight this event in the "Featured Events" section on the homepage. Use for off-season promotions.',
                ],

                // ── KidsFest ────────────No─────────────────────────────────────
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
                    'std'     => '',
                    'options' => [
                        ''             => '— None —',
                        'conversation' => 'Conversation',
                        'panel'        => 'Panel',
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
                            'id'   => 'ticket_price_min',
                            'name' => 'Price',
                            'type' => 'number',
                            'min'  => 0,
                            'desc' => 'Ticket price in dollars. Use 0 for free.',
                        ],
                        [
                            'id'   => 'ticket_price_max',
                            'name' => 'Max Price',
                            'type' => 'number',
                            'min'  => 0,
                            'desc' => 'Optional. Set only if this tier has a price range (e.g. sliding scale).',
                        ],
                    ],
                ],
            ],
        ],
        [
            'id'         => 'team_member_fields',
            'title'      => 'Team Member Fields',
            'post_types' => ['team_members'],
            'fields'     => [
                ['id' => 'title',    'name' => 'Name',     'type' => 'text', 'required' => true],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Pronouns',
                    'fields' => [
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
                        ['id' => 'pronouns_other', 'name' => 'Other', 'type' => 'text',
                         'desc' => 'Required if "Other" selected above.'],
                    ],
                ],
                ['id' => 'position', 'name' => 'Position', 'type' => 'text',
                 'desc' => 'e.g. "Executive Director" or "Board Chair"'],
                [
                    'id'      => 'team_role',
                    'name'    => 'Role',
                    'type'    => 'select',
                    'std'     => 'staff',
                    'options' => [
                        'staff'    => 'Staff',
                        'board'    => 'Board',
                        'honorary' => 'Honorary',
                    ],
                ],
                ['id' => 'photo', 'name' => 'Photo', 'type' => 'image_advanced'],
                [
                    'type'   => 'inline_fields',
                    'name'   => 'Term',
                    'desc'   => 'Optional. Board members may have partial-year terms.',
                    'fields' => [
                        ['id' => 'term_start', 'name' => 'Start', 'type' => 'text',
                         'desc' => 'e.g. "2024"'],
                        ['id' => 'term_end', 'name' => 'End', 'type' => 'text',
                         'desc' => 'e.g. "2026" — leave blank if ongoing'],
                    ],
                ],
                ['id' => 'display_order', 'name' => 'Display Order', 'type' => 'number', 'min' => 0,
                 'desc' => 'Lower numbers appear first. Leave blank to sort alphabetically.'],
                ['id' => 'description', 'name' => 'Description', 'type' => 'wysiwyg'],
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
    $src          = $attachment_id ? wp_get_attachment_image_url((int)$attachment_id, 'medium') : '';
    $preview_hide = $src ? '' : ' style="display:none"';
    $empty_hide   = $src ? ' style="display:none"' : '';

    echo '<div class="vfa-img">';
    echo '<input type="hidden" name="' . esc_attr($input_name) . '" value="' . esc_attr($attachment_id ?: '') . '">';
    echo '<div class="vfa-img-preview"' . $preview_hide . '>';
    echo '<img src="' . esc_url($src ?: '') . '" alt="">';
    echo '<div class="vfa-img-actions">';
    echo '<button type="button" class="button vfa-img-remove">Remove</button>';
    echo '<button type="button" class="button vfa-img-select">Select Image</button>';
    echo '</div>';
    echo '</div>';
    echo '<button type="button" class="button vfa-img-select vfa-img-select-empty"' . $empty_hide . '>Select Image</button>';
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
        case 'number':
            $min = isset($field['min']) ? ' min="' . (int)$field['min'] . '"' : '';
            $max = isset($field['max']) ? ' max="' . (int)$field['max'] . '"' : '';
            echo '<input type="number" name="' . esc_attr($field['id']) . '[]" value="' . esc_attr($value) . '" class="small-text"' . $min . $max . '>';
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

    // WordPress adds slashes to superglobals; unslash before sanitizing so quotes
    // and apostrophes are stored cleanly rather than accumulating backslashes.
    if ($is_multi) {
        delete_post_meta($post_id, $id);
        $values = isset($_POST[$id]) && is_array($_POST[$id]) ? wp_unslash($_POST[$id]) : [];
        foreach ($values as $val) {
            $clean = vfa_mb_sanitize($type, $val);
            if ($clean !== '') {
                add_post_meta($post_id, $id, $clean);
            }
        }
    } else {
        $raw   = isset($_POST[$id]) ? wp_unslash($_POST[$id]) : ($type === 'checkbox' ? '0' : null);
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
        case 'number':       return is_numeric($value) ? (string)(float)$value : '';
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

// ─── Draft Preview ────────────────────────────────────────────────────────────

define('VFA_PREVIEW_TYPES', ['interviews', 'people', 'festival_events', 'venues', 'books', 'team_members']);

// Generate a stable token on first save for any supported post type.
add_action('save_post', function(int $post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    if (!in_array(get_post_type($post_id), VFA_PREVIEW_TYPES)) return;
    if (!get_post_meta($post_id, '_vfa_preview_token', true)) {
        update_post_meta($post_id, '_vfa_preview_token', bin2hex(random_bytes(16)));
    }
}, 5);

// Deactivate the preview link when the post goes live.
add_action('transition_post_status', function(string $new_status, string $old_status, WP_Post $post) {
    if ($new_status === 'publish' && in_array($post->post_type, VFA_PREVIEW_TYPES)) {
        delete_post_meta($post->ID, '_vfa_preview_token');
    }
}, 10, 3);

// Show a clickable preview link in the Publish box (drafts only).
add_action('post_submitbox_misc_actions', function(WP_Post $post) {
    if (!in_array($post->post_type, VFA_PREVIEW_TYPES)) return;
    if (get_post_status($post->ID) === 'publish') return;
    $token = get_post_meta($post->ID, '_vfa_preview_token', true);
    if (!$token) return;
    $url = add_query_arg('vfa_preview', $token, home_url('/'));
    echo '<div class="misc-pub-section">';
    echo '<span style="font-weight:600;">Draft preview:</span> ';
    echo '<a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer">Open preview</a>';
    echo '</div>';
});

// Serve the preview page when ?vfa_preview=<token> is requested.
add_action('template_redirect', function() {
    if (empty($_GET['vfa_preview'])) return;
    $token = sanitize_text_field(wp_unslash($_GET['vfa_preview']));
    if (!preg_match('/^[0-9a-f]{32}$/', $token)) return;

    global $wpdb;
    $post_id = $wpdb->get_var($wpdb->prepare(
        "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_vfa_preview_token' AND meta_value = %s LIMIT 1",
        $token
    ));

    if (!$post_id) {
        wp_die('Preview not found.', 'Not Found', ['response' => 404]);
    }

    $post = get_post((int) $post_id);
    if (!$post || $post->post_status === 'publish') {
        wp_die('This preview link is no longer active — the post has been published.', 'Preview Unavailable', ['response' => 410]);
    }

    switch ($post->post_type) {
        case 'interviews':      vfa_render_interview_preview($post);   break;
        case 'people':          vfa_render_person_preview($post);      break;
        case 'festival_events': vfa_render_event_preview($post);       break;
        case 'venues':          vfa_render_venue_preview($post);       break;
        case 'books':           vfa_render_book_preview($post);        break;
        case 'team_members':    vfa_render_team_member_preview($post); break;
        default:                wp_die('Preview not available.', 'Preview Unavailable');
    }
    exit;
});

function vfa_preview_css(): string {
    return '
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Georgia, serif; font-size: 18px; line-height: 1.7; color: #1a1a1a; background: #fff; }
.banner { background: #1d4480; color: #fff; padding: 10px 24px; font-family: sans-serif; font-size: 13px; }
.container { max-width: 720px; margin: 0 auto; padding: 40px 24px 80px; }
h1 { font-size: 1.9em; line-height: 1.2; margin-bottom: 10px; }
.meta { font-family: sans-serif; font-size: 14px; color: #666; margin-bottom: 36px; }
.meta span + span::before { content: " \B7 "; }
.section-label { font-family: sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #888; margin: 40px 0 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
.field { margin-bottom: 12px; }
.field-label { font-family: sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #888; margin-bottom: 3px; }
.photo-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.photo-item { display: flex; flex-direction: column; gap: 4px; }
.photo-item img { max-width: 160px; max-height: 200px; width: auto; height: auto; border: 1px solid #e0e0e0; border-radius: 4px; display: block; }
.photo-item span { font-family: sans-serif; font-size: 11px; color: #888; text-align: center; }
.qa-item { margin-bottom: 40px; }
.qa-question { font-weight: 700; font-style: italic; margin-bottom: 10px; }
.qa-question p { margin: 0; }
.qa-answer p + p { margin-top: 12px; }
.qa-image { margin: 12px 0; }
.qa-image img { max-width: 100%; height: auto; border-radius: 4px; }
.interviewer { margin-top: 40px; background: #f7f7f7; border-left: 3px solid #1d4480; padding: 20px 24px; }
.interviewer-name { font-family: sans-serif; font-weight: 700; margin-bottom: 2px; }
.interviewer-age { font-family: sans-serif; font-size: 13px; color: #666; margin-bottom: 10px; }
.cover-img { margin-bottom: 20px; }
.cover-img img { max-width: 160px; height: auto; border: 1px solid #e0e0e0; border-radius: 4px; }
.ticket-table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 15px; margin-top: 8px; }
.ticket-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #888; padding: 6px 10px; border-bottom: 2px solid #e0e0e0; }
.ticket-table td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
p + p { margin-top: 12px; }
';
}

function vfa_preview_open(string $page_title): void {
    header('Content-Type: text/html; charset=utf-8');
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Preview: <?php echo esc_html($page_title ?: '(untitled)'); ?></title>
<style><?php echo vfa_preview_css(); ?></style>
</head>
<body>
<div class="banner">DRAFT PREVIEW &mdash; not public. Link deactivates when published.</div>
<div class="container">
<?php
}

function vfa_preview_close(): void {
    echo '</div></body></html>';
}

function vfa_preview_person_names(array $ids): array {
    $names = [];
    foreach ($ids as $id) {
        if (!$id) continue;
        $name = get_post_meta((int) $id, 'title', true);
        if (!$name) {
            $p = get_post((int) $id);
            $name = $p ? $p->post_title : '';
        }
        if ($name) $names[] = $name;
    }
    return $names;
}

function vfa_render_interview_preview(WP_Post $post): void {
    $id = $post->ID;
    $title           = get_post_meta($id, 'title', true) ?: $post->post_title;
    $festival_year   = get_post_meta($id, 'festival_year', true);
    $author_ids      = get_post_meta($id, 'author', false);
    $book_id         = get_post_meta($id, 'book', true);
    $intro           = get_post_meta($id, 'intro', true);
    $questions       = get_post_meta($id, 'question', false);
    $answers         = get_post_meta($id, 'answer', false);
    $question_images = get_post_meta($id, 'question_image', false);
    $iname           = get_post_meta($id, 'interviewer_name', true);
    $iage            = get_post_meta($id, 'interviewer_age', true);
    $ibio            = get_post_meta($id, 'interviewer_bio', true);

    $author_names = vfa_preview_person_names((array) $author_ids);

    $book_title = '';
    if ($book_id) {
        $book_title = get_post_meta((int) $book_id, 'title', true);
        if (!$book_title) {
            $bp = get_post((int) $book_id);
            $book_title = $bp ? $bp->post_title : '';
        }
    }

    vfa_preview_open($title);
    ?>
<h1><?php echo esc_html($title ?: '(untitled)'); ?></h1>
<div class="meta">
    <?php if ($festival_year): ?><span>Festival Year: <?php echo esc_html($festival_year); ?></span><?php endif; ?>
    <?php if ($author_names): ?><span>Author(s): <?php echo esc_html(implode(', ', $author_names)); ?></span><?php endif; ?>
    <?php if ($book_title): ?><span>Book: <?php echo esc_html($book_title); ?></span><?php endif; ?>
</div>
<?php if ($intro): ?>
<div class="section-label">Intro</div>
<div><?php echo wp_kses_post($intro); ?></div>
<?php endif; ?>
<?php if (!empty($questions)): ?>
<div class="section-label">Q&amp;A</div>
<?php foreach ($questions as $i => $q):
    $a      = $answers[$i] ?? '';
    $img_id = $question_images[$i] ?? '';
    if (!$q && !$a) continue; ?>
<div class="qa-item">
    <?php if ($q): ?><div class="qa-question"><?php echo wp_kses_post($q); ?></div><?php endif; ?>
    <?php if ($img_id): $img_url = wp_get_attachment_image_url((int) $img_id, 'medium');
        if ($img_url): ?><div class="qa-image"><img src="<?php echo esc_url($img_url); ?>" alt=""></div><?php endif; endif; ?>
    <?php if ($a): ?><div class="qa-answer"><?php echo wp_kses_post($a); ?></div><?php endif; ?>
</div>
<?php endforeach; endif; ?>
<?php if ($iname || $ibio): ?>
<div class="interviewer">
    <?php if ($iname): ?><div class="interviewer-name"><?php echo esc_html($iname); ?></div><?php endif; ?>
    <?php if ($iage): ?><div class="interviewer-age">Age: <?php echo esc_html($iage); ?></div><?php endif; ?>
    <?php if ($ibio): ?><div><?php echo wp_kses_post($ibio); ?></div><?php endif; ?>
</div>
<?php endif;
    vfa_preview_close();
}

function vfa_render_person_preview(WP_Post $post): void {
    $id = $post->ID;
    $title          = get_post_meta($id, 'title', true) ?: $post->post_title;
    $alt_name       = get_post_meta($id, 'alternate_name', true);
    $pronunciation  = get_post_meta($id, 'name_pronunciation', true);
    $pronouns_key   = get_post_meta($id, 'pronouns', true);
    $pronouns_other = get_post_meta($id, 'pronouns_other', true);
    $bio            = get_post_meta($id, 'bio', true);
    $website_url    = get_post_meta($id, 'website_url', true);

    $pronouns_map = [
        'she_her' => 'She/Her', 'he_him' => 'He/Him', 'they_them' => 'They/Them',
        'she_they' => 'She/They', 'he_they' => 'He/They', 'ze_zir' => 'Ze/Zir', 'other' => 'Other',
    ];
    $pronouns_label = $pronouns_key === 'other' ? $pronouns_other : ($pronouns_map[$pronouns_key] ?? '');

    $year_fields = [
        'author_years' => 'Author', 'kidfest_years' => 'Kidfest', 'elder_years' => 'Elder',
        'moderator_years' => 'Moderator', 'curator_years' => 'Curator', 'musician_years' => 'Musician',
    ];

    vfa_preview_open($title);
    ?>
<h1><?php echo esc_html($title ?: '(untitled)'); ?></h1>
<div class="meta">
    <?php if ($alt_name): ?><span>Also known as: <?php echo esc_html($alt_name); ?></span><?php endif; ?>
    <?php if ($pronunciation): ?><span>Pronunciation: <?php echo esc_html($pronunciation); ?></span><?php endif; ?>
    <?php if ($pronouns_label): ?><span>Pronouns: <?php echo esc_html($pronouns_label); ?></span><?php endif; ?>
    <?php if ($website_url): ?><span><a href="<?php echo esc_url($website_url); ?>"><?php echo esc_html($website_url); ?></a></span><?php endif; ?>
</div>
<?php
$photos = ['photo' => '7×10', 'photo_square' => 'Square', 'kidfest_photo' => 'Kidfest'];
$photo_items = [];
foreach ($photos as $field_id => $label) {
    $att_id = get_post_meta($id, $field_id, true);
    if ($att_id) {
        $url = wp_get_attachment_image_url((int) $att_id, 'medium');
        if ($url) $photo_items[] = ['url' => $url, 'label' => $label];
    }
}
if ($photo_items): ?>
<div class="photo-row">
    <?php foreach ($photo_items as $pi): ?>
    <div class="photo-item"><img src="<?php echo esc_url($pi['url']); ?>" alt=""><span><?php echo esc_html($pi['label']); ?></span></div>
    <?php endforeach; ?>
</div>
<?php endif; ?>
<?php if ($bio): ?>
<div class="section-label">Bio</div>
<div><?php echo wp_kses_post($bio); ?></div>
<?php endif; ?>
<?php
$year_rows = [];
foreach ($year_fields as $field_id => $label) {
    $years = get_post_meta($id, $field_id, false);
    if (!empty($years)) $year_rows[] = $label . ': ' . implode(', ', $years);
}
if ($year_rows): ?>
<div class="section-label">Festival Years</div>
<?php foreach ($year_rows as $row): ?><div><?php echo esc_html($row); ?></div><?php endforeach;
endif;
    vfa_preview_close();
}

function vfa_render_event_preview(WP_Post $post): void {
    $id = $post->ID;
    $title          = get_post_meta($id, 'title', true) ?: $post->post_title;
    $event_date     = get_post_meta($id, 'event_date', true);
    $time_start     = get_post_meta($id, 'time_start', true);
    $time_end       = get_post_meta($id, 'time_end', true);
    $venue_id       = get_post_meta($id, 'venue', true);
    $eventbrite_url = get_post_meta($id, 'eventbrite_url', true);
    $event_img_id   = get_post_meta($id, 'event_image', true);
    $summary        = get_post_meta($id, 'summary', true);
    $description    = get_post_meta($id, 'description', true);
    $is_featured    = get_post_meta($id, 'is_featured', true);
    $is_kidfest     = get_post_meta($id, 'is_kidfest', true);
    $age_range      = get_post_meta($id, 'age_range', true);
    $event_type_key = get_post_meta($id, 'event_type', true);
    $extra_info     = get_post_meta($id, 'extra_info', true);
    $hosted_by      = get_post_meta($id, 'hosted_by', true);

    $author_ids    = get_post_meta($id, 'authors', false);
    $moderator_ids = get_post_meta($id, 'moderator', false);
    $curator_ids   = get_post_meta($id, 'curator', false);
    $musician_ids  = get_post_meta($id, 'musician', false);
    $host_ids      = get_post_meta($id, 'hosts', false);

    $ticket_types  = get_post_meta($id, 'ticket_type', false);
    $ticket_tiers  = get_post_meta($id, 'ticket_tier', false);
    $ticket_prices = get_post_meta($id, 'ticket_price', false);

    $event_type_map = [
        'conversation' => 'Conversation', 'panel' => 'Panel', 'walk' => 'Walk',
        'workshop' => 'Workshop', 'author_fair' => 'Author Fair',
    ];
    $event_type_label = $event_type_map[$event_type_key] ?? '';

    $venue_name = '';
    if ($venue_id) {
        $vname    = get_post_meta((int) $venue_id, 'title', true);
        if (!$vname) { $vp = get_post((int) $venue_id); $vname = $vp ? $vp->post_title : ''; }
        $building = get_post_meta((int) $venue_id, 'building', true);
        $room     = get_post_meta((int) $venue_id, 'room', true);
        $venue_name = implode(', ', array_filter([$vname, $building, $room]));
    }

    $time_str = $time_start && $time_end ? $time_start . ' – ' . $time_end : $time_start;

    vfa_preview_open($title);
    ?>
<h1><?php echo esc_html($title ?: '(untitled)'); ?></h1>
<div class="meta">
    <?php if ($event_date): ?><span><?php echo esc_html($event_date); ?><?php if ($time_str): ?> at <?php echo esc_html($time_str); endif; ?></span><?php endif; ?>
    <?php if ($venue_name): ?><span><?php echo esc_html($venue_name); ?></span><?php endif; ?>
    <?php if ($event_type_label): ?><span><?php echo esc_html($event_type_label); ?></span><?php endif; ?>
    <?php if ($is_featured === '1'): ?><span>Featured</span><?php endif; ?>
    <?php if ($is_kidfest === '1'): ?><span>KidsFest</span><?php endif; ?>
    <?php if ($age_range): ?><span><?php echo esc_html($age_range); ?></span><?php endif; ?>
</div>
<?php if ($event_img_id): $img_url = wp_get_attachment_image_url((int) $event_img_id, 'medium');
    if ($img_url): ?><div class="cover-img"><img src="<?php echo esc_url($img_url); ?>" alt=""></div><?php endif; endif; ?>
<?php if ($summary): ?>
<div class="section-label">Summary</div>
<div><?php echo esc_html($summary); ?></div>
<?php endif; ?>
<?php if ($description): ?>
<div class="section-label">Description</div>
<div><?php echo wp_kses_post($description); ?></div>
<?php endif; ?>
<?php
$people_sections = [
    'Authors'    => vfa_preview_person_names((array) $author_ids),
    'Moderators' => vfa_preview_person_names((array) $moderator_ids),
    'Curators'   => vfa_preview_person_names((array) $curator_ids),
    'Musicians'  => vfa_preview_person_names((array) $musician_ids),
    'Hosts'      => vfa_preview_person_names((array) $host_ids),
];
$has_people = (bool) array_filter($people_sections) || $hosted_by;
if ($has_people): ?>
<div class="section-label">People</div>
<?php foreach ($people_sections as $label => $names):
    if (!$names) continue; ?>
<div class="field"><div class="field-label"><?php echo esc_html($label); ?></div><?php echo esc_html(implode(', ', $names)); ?></div>
<?php endforeach;
if ($hosted_by): ?>
<div class="field"><div class="field-label">Hosted By</div><?php echo esc_html($hosted_by); ?></div>
<?php endif; endif; ?>
<?php if ($extra_info): ?>
<div class="section-label">Extra Information</div>
<div><?php echo esc_html($extra_info); ?></div>
<?php endif; ?>
<?php if ($eventbrite_url): ?>
<div class="section-label">Links</div>
<div><a href="<?php echo esc_url($eventbrite_url); ?>">Eventbrite</a></div>
<?php endif; ?>
<?php if (!empty($ticket_types)): ?>
<div class="section-label">Tickets</div>
<table class="ticket-table">
<thead><tr><th>Type</th><th>Tier</th><th>Price</th></tr></thead>
<tbody>
<?php $ticket_type_labels = ['in_person' => 'In-Person', 'online' => 'Online'];
foreach ($ticket_types as $i => $tt):
    $tier = $ticket_tiers[$i] ?? ''; $price = $ticket_prices[$i] ?? '';
    if (!$tt && !$tier && !$price) continue; ?>
<tr><td><?php echo esc_html($ticket_type_labels[$tt] ?? $tt); ?></td><td><?php echo esc_html($tier); ?></td><td><?php echo esc_html($price); ?></td></tr>
<?php endforeach; ?>
</tbody></table>
<?php endif;
    vfa_preview_close();
}

function vfa_render_venue_preview(WP_Post $post): void {
    $id = $post->ID;
    $title         = get_post_meta($id, 'title', true) ?: $post->post_title;
    $alt_name      = get_post_meta($id, 'alternate_name', true);
    $pronunciation = get_post_meta($id, 'name_pronunciation', true);
    $building      = get_post_meta($id, 'building', true);
    $room          = get_post_meta($id, 'room', true);
    $street        = get_post_meta($id, 'street_address', true);
    $city          = get_post_meta($id, 'city', true);
    $province      = get_post_meta($id, 'province', true);
    $postal_code   = get_post_meta($id, 'postal_code', true);
    $country       = get_post_meta($id, 'country', true);
    $phone         = get_post_meta($id, 'phone', true);
    $website_url   = get_post_meta($id, 'website_url', true);
    $description   = get_post_meta($id, 'description', true);
    $accessibility = get_post_meta($id, 'accessibility', true);

    $province_map = [
        'AB' => 'Alberta', 'BC' => 'British Columbia', 'MB' => 'Manitoba', 'NB' => 'New Brunswick',
        'NL' => 'Newfoundland and Labrador', 'NS' => 'Nova Scotia', 'NT' => 'Northwest Territories',
        'NU' => 'Nunavut', 'ON' => 'Ontario', 'PE' => 'Prince Edward Island',
        'QC' => 'Quebec', 'SK' => 'Saskatchewan', 'YT' => 'Yukon',
    ];
    $address_parts = array_filter([$street, $city, $province_map[$province] ?? $province, $postal_code, $country]);

    vfa_preview_open($title);
    ?>
<h1><?php echo esc_html($title ?: '(untitled)'); ?></h1>
<div class="meta">
    <?php if ($alt_name): ?><span>Formerly: <?php echo esc_html($alt_name); ?></span><?php endif; ?>
    <?php if ($pronunciation): ?><span>Pronunciation: <?php echo esc_html($pronunciation); ?></span><?php endif; ?>
</div>
<?php if ($building || $room || $address_parts || $phone || $website_url): ?>
<div class="section-label">Location</div>
<?php if ($building): ?><div><?php echo esc_html($building); ?></div><?php endif; ?>
<?php if ($room): ?><div><?php echo esc_html($room); ?></div><?php endif; ?>
<?php if ($address_parts): ?><div><?php echo esc_html(implode(', ', $address_parts)); ?></div><?php endif; ?>
<?php if ($phone): ?><div><?php echo esc_html($phone); ?></div><?php endif; ?>
<?php if ($website_url): ?><div><a href="<?php echo esc_url($website_url); ?>"><?php echo esc_html($website_url); ?></a></div><?php endif; ?>
<?php endif; ?>
<?php if ($description): ?>
<div class="section-label">Description</div>
<div><?php echo wp_kses_post($description); ?></div>
<?php endif; ?>
<?php if ($accessibility): ?>
<div class="section-label">Accessibility</div>
<div><?php echo wp_kses_post($accessibility); ?></div>
<?php endif;
    vfa_preview_close();
}

function vfa_render_book_preview(WP_Post $post): void {
    $id = $post->ID;
    $title        = get_post_meta($id, 'title', true) ?: $post->post_title;
    $subtitle     = get_post_meta($id, 'subtitle', true);
    $author_ids   = get_post_meta($id, 'authors', false);
    $cover_id     = get_post_meta($id, 'cover_image', true);
    $buy_url      = get_post_meta($id, 'munros_url', true);
    $year         = get_post_meta($id, 'festival_year', true);
    $description  = get_post_meta($id, 'description', true);
    $cats         = get_post_meta($id, 'categories', false);
    $add_authors  = get_post_meta($id, 'additional_authors', true);
    $illustrators = get_post_meta($id, 'illustrators', true);
    $age_min      = get_post_meta($id, 'age_min', true);
    $age_max      = get_post_meta($id, 'age_max', true);

    $cat_map = [
        'children' => 'Children', 'immigrant' => 'Immigration', 'lgbt' => 'LGBT',
        'indigenous' => 'Indigenous', 'romance' => 'Romance', 'comedy' => 'Comedy',
        'illustrated' => 'Illustrated', 'mystery' => 'Mystery', 'nature' => 'Nature',
        'poetry' => 'Poetry', 'social_justice' => 'Social Justice',
    ];
    $author_names = vfa_preview_person_names((array) $author_ids);
    $cat_labels   = array_values(array_filter(array_map(fn($c) => $cat_map[$c] ?? '', (array) $cats)));
    $age_str      = $age_min && $age_max ? 'Ages ' . $age_min . '–' . $age_max : ($age_min ? 'Ages ' . $age_min . '+' : '');

    vfa_preview_open($title);
    ?>
<?php if ($cover_id): $cover_url = wp_get_attachment_image_url((int) $cover_id, 'medium');
    if ($cover_url): ?><div class="cover-img"><img src="<?php echo esc_url($cover_url); ?>" alt=""></div><?php endif; endif; ?>
<h1><?php echo esc_html($title ?: '(untitled)'); ?></h1>
<?php if ($subtitle): ?><div style="font-size:1.1em;color:#555;margin-bottom:8px;"><?php echo esc_html($subtitle); ?></div><?php endif; ?>
<div class="meta">
    <?php if ($author_names): ?><span><?php echo esc_html(implode(', ', $author_names)); ?></span><?php endif; ?>
    <?php if ($add_authors): ?><span>Also: <?php echo esc_html($add_authors); ?></span><?php endif; ?>
    <?php if ($illustrators): ?><span>Illustrated by: <?php echo esc_html($illustrators); ?></span><?php endif; ?>
    <?php if ($year): ?><span>Festival Year: <?php echo esc_html($year); ?></span><?php endif; ?>
    <?php if ($cat_labels): ?><span><?php echo esc_html(implode(', ', $cat_labels)); ?></span><?php endif; ?>
    <?php if ($age_str): ?><span><?php echo esc_html($age_str); ?></span><?php endif; ?>
    <?php if ($buy_url): ?><span><a href="<?php echo esc_url($buy_url); ?>">Buy online</a></span><?php endif; ?>
</div>
<?php if ($description): ?>
<div class="section-label">Description</div>
<div><?php echo wp_kses_post($description); ?></div>
<?php endif;
    vfa_preview_close();
}

function vfa_render_team_member_preview(WP_Post $post): void {
    $id = $post->ID;
    $title          = get_post_meta($id, 'title', true) ?: $post->post_title;
    $pronouns_key   = get_post_meta($id, 'pronouns', true);
    $pronouns_other = get_post_meta($id, 'pronouns_other', true);
    $position       = get_post_meta($id, 'position', true);
    $team_role      = get_post_meta($id, 'team_role', true);
    $photo_id       = get_post_meta($id, 'photo', true);
    $term_start     = get_post_meta($id, 'term_start', true);
    $term_end       = get_post_meta($id, 'term_end', true);
    $description    = get_post_meta($id, 'description', true);

    $pronouns_map = [
        'she_her' => 'She/Her', 'he_him' => 'He/Him', 'they_them' => 'They/Them',
        'she_they' => 'She/They', 'he_they' => 'He/They', 'ze_zir' => 'Ze/Zir', 'other' => 'Other',
    ];
    $pronouns_label = $pronouns_key === 'other' ? $pronouns_other : ($pronouns_map[$pronouns_key] ?? '');
    $role_map       = ['staff' => 'Staff', 'board' => 'Board', 'honorary' => 'Honorary'];
    $role_label     = $role_map[$team_role] ?? '';
    $term_str       = $term_start && $term_end ? $term_start . '–' . $term_end : ($term_start ? 'From ' . $term_start : '');

    vfa_preview_open($title);
    ?>
<?php if ($photo_id): $photo_url = wp_get_attachment_image_url((int) $photo_id, 'medium');
    if ($photo_url): ?><div class="cover-img"><img src="<?php echo esc_url($photo_url); ?>" alt=""></div><?php endif; endif; ?>
<h1><?php echo esc_html($title ?: '(untitled)'); ?></h1>
<div class="meta">
    <?php if ($position): ?><span><?php echo esc_html($position); ?></span><?php endif; ?>
    <?php if ($role_label): ?><span><?php echo esc_html($role_label); ?></span><?php endif; ?>
    <?php if ($pronouns_label): ?><span><?php echo esc_html($pronouns_label); ?></span><?php endif; ?>
    <?php if ($term_str): ?><span>Term: <?php echo esc_html($term_str); ?></span><?php endif; ?>
</div>
<?php if ($description): ?>
<div class="section-label">Description</div>
<div><?php echo wp_kses_post($description); ?></div>
<?php endif;
    vfa_preview_close();
}

// ─── Assets ──────────────────────────────────────────────────────────────────

add_action('admin_enqueue_scripts', function(string $hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'])) return;
    $screen = get_current_screen();
    if (!$screen) return;
    $types = ['interviews', 'people', 'festival_events', 'venues', 'books', 'team_members'];
    if (!in_array($screen->post_type, $types)) return;

    wp_enqueue_media();

    wp_enqueue_style(
        'tom-select',
        plugins_url('vendor/tom-select/tom-select.default.min.css', __FILE__),
        [],
        '2.3.1'
    );
    wp_enqueue_script(
        'tom-select',
        plugins_url('vendor/tom-select/tom-select.complete.min.js', __FILE__),
        [],
        '2.3.1',
        true
    );

    wp_add_inline_script('tom-select', vfa_mb_js());
});

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (!$screen) return;
    $types = ['interviews', 'people', 'festival_events', 'venues', 'books', 'team_members'];
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
    min-width: 140px;
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
.vfa-img-preview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 6px;
}

.vfa-img-preview img {
    display: block;
    max-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 3px;
}

.vfa-img-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-self: stretch;
}

.vfa-img-actions .button {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
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

    // Conditional: show "Other" pronouns field only when "other" is selected
    (function() {
        var pronounsSel = document.getElementById("pronouns");
        var otherInput  = document.getElementById("pronouns_other");
        if (!pronounsSel || !otherInput) return;
        var otherItem = otherInput.closest(".vfa-inline-item");
        if (!otherItem) return;
        function toggle() {
            otherItem.style.display = pronounsSel.value === "other" ? "" : "none";
        }
        toggle();
        pronounsSel.addEventListener("change", toggle);
    })();

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
            var emptyBtn = wrap.querySelector(".vfa-img-select-empty");
            if (emptyBtn) emptyBtn.style.display = "none";
        });
        frame.open();
    }

    // Initialize TinyMCE on a textarea by cloning WordPress\'s own mceInit settings.
    // tinyMCEPreInit.mceInit is set by _WP_Editors::editor_js() before footer scripts run,
    // so it contains the correct content_css, language, plugins, etc. for this WP install.
    function initWysiwyg(el, uid) {
        uid = uid || el.id;
        if (!uid || !window.tinymce || !window.tinyMCEPreInit) return;
        el.id = uid;
        el.classList.remove("vfa-wysiwyg-preload");
        el.classList.remove("vfa-wysiwyg-init");

        var mceInit = tinyMCEPreInit.mceInit;
        var baseKey = Object.keys(mceInit)[0];
        if (!baseKey) return;

        var settings = Object.assign({}, mceInit[baseKey], {
            selector:       "#" + uid,
            height:         parseInt(el.dataset.height) || 100,
            toolbar1:       "bold italic | link unlink | bullist numlist | undo redo",
            toolbar2:       "",
            textarea_name:  el.getAttribute("name") || uid,
        });
        // Avoid wiring this editor to a different quicktags instance via the base setup callback
        delete settings.setup;

        tinymce.init(settings);
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
            var emptyBtn = wrap.querySelector(".vfa-img-select-empty");
            if (emptyBtn) emptyBtn.style.display = "";
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
                initWysiwyg(el, uid);
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
                // Clean up any TinyMCE instances before removing the row
                row.querySelectorAll("textarea").forEach(function(el) {
                    var inst = el.id && window.tinymce && tinymce.get(el.id);
                    if (inst) inst.remove();
                });
                row.remove();
            } else {
                // Last row — clear content rather than remove
                row.querySelectorAll("textarea").forEach(function(el) {
                    var inst = el.id && window.tinymce && tinymce.get(el.id);
                    if (inst) inst.setContent("");
                    el.value = "";
                });
                row.querySelectorAll("input").forEach(function(el) { el.value = ""; });
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
