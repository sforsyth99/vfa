<?php
/**
 * Plugin Name: VFA Custom Fields
 * Description: Custom fields for interviews, people, venues, and events.
 * Version: 1.3.0
 */

add_filter('rwmb_meta_boxes', function($meta_boxes) {

    $meta_boxes[] = [
        'title'      => 'Interview Fields',
        'id'         => 'interview_fields',
        'post_types' => ['interviews'],
        'show_in_rest' => true,
        'fields'     => [
            [
                'id'   => 'author_name',
                'name' => 'Author Name',
                'type' => 'text',
            ],
            [
                'id'   => 'interviewer_name',
                'name' => 'Interviewer Name',
                'type' => 'text',
            ],
            [
                'id'   => 'author_photo',
                'name' => 'Author Photo',
                'type' => 'image_advanced',
            ],
            [
                'id'   => 'author_bio_url',
                'name' => 'Author Bio URL',
                'type' => 'url',
            ],
            [
                'id'   => 'intro',
                'name' => 'Intro',
                'type' => 'textarea',
            ],
            [
                'id'               => 'question',
                'name'             => 'Question',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'Add one question per row. Each question must match the answer in the same position below.',
            ],
            [
                'id'               => 'answer',
                'name'             => 'Answer',
                'type'             => 'textarea',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'Add one answer per row. Answer 1 pairs with Question 1, Answer 2 with Question 2, etc.',
            ],
        ],
    ];

    $meta_boxes[] = [
        'title'      => 'Person Fields',
        'id'         => 'person_fields',
        'post_types' => ['people'],
        'fields'     => [
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
                'id'   => 'alternate_name',
                'name' => 'Alternate Name',
                'type' => 'text',
            ],
            [
                'id'   => 'address',
                'name' => 'Address',
                'type' => 'text',
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
                'id'   => 'event_image',
                'name' => 'Event Image',
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
                'id'        => 'venue',
                'name'      => 'Venue',
                'type'      => 'post',
                'post_type' => ['venues'],
            ],
            [
                'id'   => 'online_url',
                'name' => 'Online URL',
                'type' => 'url',
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
                'name'             => 'Ticket Tier',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'e.g. "Low income", "General", "Supporter". Each tier pairs with the price below.',
            ],
            [
                'id'               => 'ticket_price',
                'name'             => 'Ticket Price',
                'type'             => 'text',
                'clone'            => true,
                'clone_as_multiple' => true,
                'desc'             => 'e.g. "$10". Price 1 pairs with Tier 1, Price 2 with Tier 2, etc.',
            ],
        ],
    ];

    $meta_boxes[] = [
        'title'      => 'Book Fields',
        'id'         => 'book_fields',
        'post_types' => ['books'],
        'fields'     => [
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
                'name' => 'Buy at Munro\'s Books',
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
            'id'          => (int) $post_id,
            'name'           => $post->post_title,
            'alternate_name' => get_post_meta($post_id, 'alternate_name', true),
            'bio'            => get_post_meta($post_id, 'bio', true),
            'website_url' => get_post_meta($post_id, 'website_url', true),
            'photo'       => wp_get_attachment_image_src(
                                 get_post_meta($post_id, 'photo', true),
                                 'medium'
                             ),
        ];
    }

    function vfa_get_venue_data($post_id) {
        if (!$post_id) return null;
        $post = get_post((int) $post_id);
        if (!$post) return null;
        return [
            'id'              => (int) $post_id,
            'slug'            => $post->post_name,
            'name'            => $post->post_title,
            'alternate_name'  => get_post_meta($post_id, 'alternate_name', true),
            'address'         => get_post_meta($post_id, 'address', true),
            'description'     => get_post_meta($post_id, 'description', true),
        ];
    }

    register_rest_field('interviews', 'interview_data', [
        'get_callback' => function($post) {
            return [
                'author_name'      => get_post_meta($post['id'], 'author_name', true),
                'interviewer_name' => get_post_meta($post['id'], 'interviewer_name', true),
                'author_bio_url'   => get_post_meta($post['id'], 'author_bio_url', true),
                'intro'            => get_post_meta($post['id'], 'intro', true),
                'author_photo'     => wp_get_attachment_image_src(
                                          get_post_meta($post['id'], 'author_photo', true),
                                          'large'
                                      ),
                'question'         => get_post_meta($post['id'], 'question'),
                'answer'           => get_post_meta($post['id'], 'answer'),
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
                'description' => get_post_meta($id, 'description', true),
                'munros_url'  => get_post_meta($id, 'munros_url', true),
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
                'time_start'  => get_post_meta($id, 'time_start', true),
                'time_end'    => get_post_meta($id, 'time_end', true),
                'event_image' => wp_get_attachment_image_src(
                                     get_post_meta($id, 'event_image', true),
                                     'large'
                                 ),
                'description' => get_post_meta($id, 'description', true),
                'venue'          => vfa_get_venue_data(get_post_meta($id, 'venue', true)),
                'online_url'     => get_post_meta($id, 'online_url', true),
                'eventbrite_url' => get_post_meta($id, 'eventbrite_url', true),
                'ticket_tier' => get_post_meta($id, 'ticket_tier'),
                'ticket_price'=> get_post_meta($id, 'ticket_price'),
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

});
