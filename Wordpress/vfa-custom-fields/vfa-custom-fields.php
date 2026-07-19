<?php
/**
 * Plugin Name: VFA Custom Fields
 * Description: Custom fields for interviews, people, venues, and events.
 * Version: 1.5.7
 */

add_action('init', function() {
    global $wp_post_types;
    $icons = [
        'interviews'      => 'dashicons-format-chat',
        'people'          => 'dashicons-admin-users',
        'festival_events' => 'dashicons-calendar-alt',
        'venues'          => 'dashicons-location',
        'books'           => 'dashicons-book-alt',
    ];
    foreach ($icons as $type => $icon) {
        if (isset($wp_post_types[$type])) {
            $wp_post_types[$type]->menu_icon = $icon;
        }
    }
}, 99);

// Remove content editor — safe to do via post type support since 'editor'
// doesn't affect the REST API. Title is hidden via CSS only (removing title
// support would strip title.rendered from REST API responses).
add_action('init', function() {
    $types = ['interviews', 'people', 'venues', 'festival_events', 'books'];
    foreach ($types as $type) {
        remove_post_type_support($type, 'editor');
    }
}, 20);

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (!$screen) return;
    $types = ['interviews', 'people', 'venues', 'festival_events', 'books'];
    if (!in_array($screen->post_type, $types)) return;
    echo '<style>#titlediv { display: none; }</style>';
});

function vfa_sync_title_to_post($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    $types = ['interviews', 'people', 'venues', 'festival_events', 'books'];
    if (!in_array(get_post_type($post_id), $types)) return;
    $title = get_post_meta($post_id, 'title', true);
    if (!$title) return;
    remove_action('save_post', 'vfa_sync_title_to_post', 20);
    wp_update_post([
        'ID'        => $post_id,
        'post_title' => sanitize_text_field($title),
        'post_name'  => sanitize_title($title),
    ]);
    add_action('save_post', 'vfa_sync_title_to_post', 20);
}
add_action('save_post', 'vfa_sync_title_to_post', 20);

add_filter('rwmb_title_field_meta', function($value, $field, $post_id) {
    if ($value === '' || $value === null) {
        return get_post_field('post_title', $post_id);
    }
    return $value;
}, 10, 3);

add_filter('rwmb_meta_boxes', function($meta_boxes) {

    $meta_boxes[] = [
        'title'      => 'Interview Fields',
        'id'         => 'interview_fields',
        'post_types' => ['interviews'],
        'show_in_rest' => true,
        'fields'     => [
            [
                'id'       => 'title',
                'name'     => 'Title',
                'type'     => 'text',
                'required' => true,
            ],
            [
                'id'        => 'author',
                'name'      => 'Author',
                'type'      => 'post',
                'post_type' => ['people'],
            ],
            [
                'id'   => 'interviewer_name',
                'name' => 'Interviewer Name',
                'type' => 'text',
            ],
            [
                'id'   => 'intro',
                'name' => 'Intro',
                'type' => 'textarea',
            ],
            [
                'id'               => 'question',
                'name'             => 'Question %i%',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
            ],
            [
                'id'               => 'answer',
                'name'             => 'Answer %i%',
                'type'             => 'textarea',
                'clone'            => true,
                'clone_as_multiple' => true,
            ],
            [
                'id'               => 'question_image',
                'name'             => 'Image %i%',
                'type'             => 'image_advanced',
                'max_file_uploads' => 1,
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'Image 1 pairs with Question 1, Image 2 with Question 2, etc.',
            ],
        ],
    ];

    $meta_boxes[] = [
        'title'      => 'Person Fields',
        'id'         => 'person_fields',
        'post_types' => ['people'],
        'fields'     => [
            [
                'id'       => 'title',
                'name'     => 'Name',
                'type'     => 'text',
                'required' => true,
            ],
            [
                'id'   => 'alternate_name',
                'name' => 'Alternate Name',
                'type' => 'text',
            ],
            [
                'id'   => 'photo',
                'name' => 'Photo',
                'type' => 'image_advanced',
            ],
            [
                'id'   => 'is_kidfest',
                'name' => 'Kidfest Author',
                'type' => 'checkbox',
                'desc' => 'Check if this author is participating in Kidfest.',
            ],
            [
                'id'   => 'kidfest_photo',
                'name' => 'Kidfest Photo',
                'type' => 'image_advanced',
                'desc' => 'Cartoon-style image for Kidfest. Optional.',
            ],
            [
                'id'   => 'bio',
                'name' => 'Bio',
                'type' => 'textarea',
            ],
            [
                'id'   => 'website_url',
                'name' => 'Website URL',
                'type' => 'url',
            ],
        ],
    ];

    $meta_boxes[] = [
        'title'      => 'Venue Fields',
        'id'         => 'venue_fields',
        'post_types' => ['venues'],
        'fields'     => [
            [
                'id'       => 'title',
                'name'     => 'Name',
                'type'     => 'text',
                'required' => true,
            ],
            [
                'id'   => 'alternate_name',
                'name' => 'Alternate Name',
                'type' => 'text',
            ],
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
            [
                'id'   => 'street_address',
                'name' => 'Street Address',
                'type' => 'text',
            ],
            [
                'id'   => 'city',
                'name' => 'City',
                'type' => 'text',
                'std'  => 'Victoria',
            ],
            [
                'id'      => 'province',
                'name'    => 'Province',
                'type'    => 'select',
                'std'     => 'BC',
                'options' => [
                    'AB' => 'Alberta',
                    'BC' => 'British Columbia',
                    'MB' => 'Manitoba',
                    'NB' => 'New Brunswick',
                    'NL' => 'Newfoundland and Labrador',
                    'NS' => 'Nova Scotia',
                    'NT' => 'Northwest Territories',
                    'NU' => 'Nunavut',
                    'ON' => 'Ontario',
                    'PE' => 'Prince Edward Island',
                    'QC' => 'Quebec',
                    'SK' => 'Saskatchewan',
                    'YT' => 'Yukon',
                ],
            ],
            [
                'id'   => 'postal_code',
                'name' => 'Postal Code',
                'type' => 'text',
            ],
            [
                'id'   => 'country',
                'name' => 'Country',
                'type' => 'text',
                'std'  => 'Canada',
            ],
            [
                'id'   => 'phone',
                'name' => 'Phone',
                'type' => 'text',
            ],
            [
                'id'   => 'website_url',
                'name' => 'Website',
                'type' => 'url',
            ],
            [
                'id'   => 'description',
                'name' => 'Description',
                'type' => 'textarea',
            ],
        ],
    ];

    $meta_boxes[] = [
        'title'      => 'Festival Event Fields',
        'id'         => 'festival_event_fields',
        'post_types' => ['festival_events'],
        'fields'     => [
            [
                'id'       => 'title',
                'name'     => 'Event Name',
                'type'     => 'text',
                'required' => true,
            ],
            [
                'id'   => 'event_image',
                'name' => 'Event Image',
                'type' => 'image_advanced',
            ],
            [
                'id'   => 'eventbrite_image',
                'name' => 'Eventbrite Waiting Room Image',
                'type' => 'image_advanced',
            ],
            [
                'id'   => 'description',
                'name' => 'Description',
                'type' => 'textarea',
            ],
            [
                'id'   => 'event_date',
                'name' => 'Date',
                'type' => 'date',
            ],
            [
                'id'   => 'time_start',
                'name' => 'Start Time',
                'type' => 'time',
            ],
            [
                'id'   => 'time_end',
                'name' => 'End Time',
                'type' => 'time',
            ],
            [
                'id'   => 'has_online_option',
                'name' => 'Available Online',
                'type' => 'checkbox',
                'desc' => 'Check if this event can be attended online.',
            ],
            [
                'id'      => 'timezone',
                'name'    => 'Timezone',
                'type'    => 'select',
                'options' => [
                    ''                  => '— Select timezone —',
                    'America/Vancouver' => 'Pacific Time (PT)',
                    'America/Edmonton'  => 'Mountain Time (MT)',
                    'America/Winnipeg'  => 'Central Time (CT)',
                    'America/Toronto'   => 'Eastern Time (ET)',
                    'America/Halifax'   => 'Atlantic Time (AT)',
                    'America/St_Johns'  => 'Newfoundland Time (NT)',
                ],
                'desc'    => 'Set for online events. In-person events are assumed to be in the venue\'s local time.',
            ],
            [
                'id'        => 'venue',
                'name'      => 'Venue',
                'type'      => 'post',
                'post_type' => ['venues'],
            ],
            [
                'id'   => 'eventbrite_url',
                'name' => 'Eventbrite URL',
                'type' => 'url',
            ],
            [
                'id'        => 'authors',
                'name'      => 'Authors',
                'type'      => 'post',
                'post_type' => ['people'],
                'multiple'  => true,
                'desc'      => 'Select all participating authors.',
            ],
            [
                'id'        => 'moderator',
                'name'      => 'Moderator',
                'type'      => 'post',
                'post_type' => ['people'],
                'multiple'  => true,
            ],
            [
                'id'        => 'curator',
                'name'      => 'Curator',
                'type'      => 'post',
                'post_type' => ['people'],
                'multiple'  => true,
            ],
            [
                'id'        => 'musician',
                'name'      => 'Musician',
                'type'      => 'post',
                'post_type' => ['people'],
                'multiple'  => true,
            ],
            [
                'id'               => 'ticket_tier',
                'name'             => 'In-Person Ticket Tier',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'e.g. "Low income", "General", "Supporter". Each tier pairs with the price below.',
            ],
            [
                'id'               => 'ticket_price',
                'name'             => 'In-Person Ticket Price',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'e.g. "$10". Price 1 pairs with Tier 1, Price 2 with Tier 2, etc.',
            ],
            [
                'id'               => 'online_ticket_tier',
                'name'             => 'Online Ticket Tier',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'e.g. "Low income", "General", "Supporter". Leave blank if this event is in-person only.',
            ],
            [
                'id'               => 'online_ticket_price',
                'name'             => 'Online Ticket Price',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'e.g. "$5". Price 1 pairs with Tier 1, Price 2 with Tier 2, etc.',
            ],
        ],
    ];

    $meta_boxes[] = [
        'title'      => 'Book Fields',
        'id'         => 'book_fields',
        'post_types' => ['books'],
        'fields'     => [
            [
                'id'       => 'title',
                'name'     => 'Title',
                'type'     => 'text',
                'required' => true,
            ],
            [
                'id'   => 'festival_year',
                'name' => 'Festival Year',
                'type' => 'number',
                'std'  => date('Y'),
                'min'  => 2020,
            ],
            [
                'id'        => 'authors',
                'name'      => 'Authors',
                'type'      => 'post',
                'post_type' => ['people'],
                'multiple'  => true,
                'desc'      => 'Select all authors of this book.',
            ],
            [
                'id'   => 'cover_image',
                'name' => 'Cover Image',
                'type' => 'image_advanced',
            ],
            [
                'id'   => 'description',
                'name' => 'Description',
                'type' => 'textarea',
            ],
            [
                'id'   => 'munros_url',
                'name' => 'Buy Online URL',
                'type' => 'url',
            ],
        ],
    ];

    return $meta_boxes;
});

add_action('rest_api_init', function() {

    function vfa_get_person_data($post_id) {
        if (!$post_id) return null;
        $post = get_post((int) $post_id);
        if (!$post) return null;
        return [
            'id'             => (int) $post_id,
            'slug'           => $post->post_name,
            'name'           => $post->post_title,
            'alternate_name' => get_post_meta($post_id, 'alternate_name', true),
            'bio'            => get_post_meta($post_id, 'bio', true),
            'website_url'    => get_post_meta($post_id, 'website_url', true),
            'photo'          => wp_get_attachment_image_src(
                                    get_post_meta($post_id, 'photo', true),
                                    'medium'
                                ),
            'is_kidfest'     => (bool) get_post_meta($post_id, 'is_kidfest', true),
            'kidfest_photo'  => wp_get_attachment_image_src(
                                    get_post_meta($post_id, 'kidfest_photo', true),
                                    'medium'
                                ),
        ];
    }

    function vfa_get_venue_data($post_id) {
        if (!$post_id) return null;
        $post = get_post((int) $post_id);
        if (!$post) return null;
        return [
            'id'             => (int) $post_id,
            'slug'           => $post->post_name,
            'name'           => $post->post_title,
            'alternate_name' => get_post_meta($post_id, 'alternate_name', true),
            'building'       => get_post_meta($post_id, 'building', true),
            'room'           => get_post_meta($post_id, 'room', true),
            'street_address' => get_post_meta($post_id, 'street_address', true),
            'city'           => get_post_meta($post_id, 'city', true),
            'province'       => get_post_meta($post_id, 'province', true),
            'postal_code'    => get_post_meta($post_id, 'postal_code', true),
            'country'        => get_post_meta($post_id, 'country', true),
            'phone'          => get_post_meta($post_id, 'phone', true),
            'website_url'    => get_post_meta($post_id, 'website_url', true),
            'description'    => get_post_meta($post_id, 'description', true),
        ];
    }

    register_rest_field('interviews', 'interview_data', [
        'get_callback' => function($post) {
            return [
                'author'           => vfa_get_person_data(get_post_meta($post['id'], 'author', true)),
                'interviewer_name' => get_post_meta($post['id'], 'interviewer_name', true),
                'intro'            => get_post_meta($post['id'], 'intro', true),
                'question'       => get_post_meta($post['id'], 'question'),
                'answer'         => get_post_meta($post['id'], 'answer'),
                'question_image' => array_map(function($attachment_id) {
                    return $attachment_id
                        ? wp_get_attachment_image_src((int) $attachment_id, 'large')
                        : null;
                }, get_post_meta($post['id'], 'question_image')),
            ];
        },
        'schema' => null,
    ]);

    register_rest_field('people', 'person_data', [
        'get_callback' => function($post) {
            return vfa_get_person_data($post['id']);
        },
        'schema' => null,
    ]);

    register_rest_field('books', 'book_data', [
        'get_callback' => function($post) {
            $id = $post['id'];
            $author_ids = get_post_meta($id, 'authors', false);
            return [
                'authors'     => array_values(array_filter(array_map(
                                     'vfa_get_person_data', $author_ids
                                 ))),
                'cover_image' => wp_get_attachment_image_src(
                                     get_post_meta($id, 'cover_image', true),
                                     'large'
                                 ),
                'description'   => get_post_meta($id, 'description', true),
                'munros_url'    => get_post_meta($id, 'munros_url', true),
                'festival_year' => (int) get_post_meta($id, 'festival_year', true) ?: null,
            ];
        },
        'schema' => null,
    ]);

    register_rest_field('venues', 'venue_data', [
        'get_callback' => function($post) {
            return vfa_get_venue_data($post['id']);
        },
        'schema' => null,
    ]);

    register_rest_field('festival_events', 'event_data', [
        'get_callback' => function($post) {
            $id = $post['id'];
            $author_ids = get_post_meta($id, 'authors', false);
            return [
                'event_date'  => get_post_meta($id, 'event_date', true),
                'time_start'       => get_post_meta($id, 'time_start', true),
                'time_end'         => get_post_meta($id, 'time_end', true),
                'has_online_option' => (bool) get_post_meta($id, 'has_online_option', true),
                'timezone'         => get_post_meta($id, 'timezone', true),
                'event_image' => wp_get_attachment_image_src(
                                     get_post_meta($id, 'event_image', true),
                                     'large'
                                 ),
                'eventbrite_image' => wp_get_attachment_image_src(
                                          get_post_meta($id, 'eventbrite_image', true),
                                          'large'
                                      ),
                'description' => get_post_meta($id, 'description', true),
                'venue'          => vfa_get_venue_data(get_post_meta($id, 'venue', true)),
                'online_url'     => get_post_meta($id, 'online_url', true),
                'eventbrite_url' => get_post_meta($id, 'eventbrite_url', true),
                'ticket_tier'         => get_post_meta($id, 'ticket_tier'),
                'ticket_price'        => get_post_meta($id, 'ticket_price'),
                'online_ticket_tier'  => get_post_meta($id, 'online_ticket_tier'),
                'online_ticket_price' => get_post_meta($id, 'online_ticket_price'),
                'authors'     => array_values(array_filter(array_map(
                                     'vfa_get_person_data', $author_ids
                                 ))),
                'moderator'   => array_values(array_filter(array_map(
                                     'vfa_get_person_data', get_post_meta($id, 'moderator', false)
                                 ))),
                'curator'     => array_values(array_filter(array_map(
                                     'vfa_get_person_data', get_post_meta($id, 'curator', false)
                                 ))),
                'musician'    => array_values(array_filter(array_map(
                                     'vfa_get_person_data', get_post_meta($id, 'musician', false)
                                 ))),
            ];
        },
        'schema' => null,
    ]);

    register_rest_route('vfa/v1', '/people/kidfest', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function() {
            $people = get_posts([
                'post_type'      => 'people',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'meta_query'     => [
                    ['key' => 'is_kidfest', 'value' => '1', 'compare' => '='],
                ],
            ]);
            return array_map(function($person) {
                return vfa_get_person_data($person->ID);
            }, $people);
        },
    ]);

    register_rest_route('vfa/v1', '/people/(?P<id>\d+)/events', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function($request) {
            $person_id = (int) $request['id'];
            $events = get_posts([
                'post_type'      => 'festival_events',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'meta_query'     => [
                    'relation' => 'OR',
                    ['key' => 'authors',   'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
                    ['key' => 'moderator', 'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
                    ['key' => 'curator',   'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
                    ['key' => 'musician',  'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
                ],
            ]);

            return array_map(function($event) use ($person_id) {
                $id = $event->ID;
                $roles = [];
                if (in_array((string) $person_id, get_post_meta($id, 'authors',   false))) $roles[] = 'author';
                if (in_array((string) $person_id, get_post_meta($id, 'moderator', false))) $roles[] = 'moderator';
                if (in_array((string) $person_id, get_post_meta($id, 'curator',   false))) $roles[] = 'curator';
                if (in_array((string) $person_id, get_post_meta($id, 'musician',  false))) $roles[] = 'musician';

                $event_date = get_post_meta($id, 'event_date', true);
                $year       = $event_date ? (int) substr($event_date, 0, 4) : null;

                return [
                    'id'         => $id,
                    'slug'       => $event->post_name,
                    'title'      => $event->post_title,
                    'event_date' => $event_date,
                    'year'       => $year,
                    'roles'      => $roles,
                ];
            }, $events);
        },
    ]);

    register_rest_route('vfa/v1', '/people/(?P<id>\d+)/books', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function($request) {
            $person_id = (int) $request['id'];
            $year      = $request->get_param('year') ? (int) $request->get_param('year') : null;

            $meta_query = [
                ['key' => 'authors', 'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
            ];
            if ($year) {
                $meta_query[] = ['key' => 'festival_year', 'value' => $year, 'compare' => '=', 'type' => 'NUMERIC'];
            }

            $books = get_posts([
                'post_type'      => 'books',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'meta_query'     => $meta_query,
            ]);

            return array_map(function($book) {
                $id = $book->ID;
                return [
                    'id'            => $id,
                    'slug'          => $book->post_name,
                    'title'         => $book->post_title,
                    'festival_year' => (int) get_post_meta($id, 'festival_year', true) ?: null,
                    'cover_image'   => wp_get_attachment_image_src(
                                           get_post_meta($id, 'cover_image', true),
                                           'medium'
                                       ),
                    'description'   => get_post_meta($id, 'description', true),
                    'munros_url'    => get_post_meta($id, 'munros_url', true),
                ];
            }, $books);
        },
    ]);

});
