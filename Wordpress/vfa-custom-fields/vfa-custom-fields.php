<?php
/**
 * Plugin Name: VFA Custom Fields
 * Description: Custom fields for interviews, people, venues, and events.
 * Version: 1.7.0
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


add_action('rest_api_init', function() {

    function vfa_get_person_data($post_id) {
        if (!$post_id) return null;
        $post = get_post((int) $post_id);
        if (!$post) return null;
        return [
            'id'             => (int) $post_id,
            'slug'           => $post->post_name,
            'name'           => $post->post_title,
            'alternate_name'    => get_post_meta($post_id, 'alternate_name', true),
            'name_pronunciation' => get_post_meta($post_id, 'name_pronunciation', true),
            'pronouns'          => get_post_meta($post_id, 'pronouns', true),
            'pronouns_other'    => get_post_meta($post_id, 'pronouns_other', true),
            'bio'               => get_post_meta($post_id, 'bio', true),
            'website_url'    => get_post_meta($post_id, 'website_url', true),
            'photo'          => (function() use ($post_id) {
                                    $kidfest_years = get_post_meta($post_id, 'kidfest_years', false);
                                    if (!empty($kidfest_years)) {
                                        $kidfest_photo_id = get_post_meta($post_id, 'kidfest_photo', true);
                                        if ($kidfest_photo_id) {
                                            return wp_get_attachment_image_src((int)$kidfest_photo_id, 'medium');
                                        }
                                    }
                                    return wp_get_attachment_image_src(get_post_meta($post_id, 'photo', true), 'medium');
                                })(),
            'author_years'    => array_map('intval', get_post_meta($post_id, 'author_years', false)),
            'moderator_years' => array_map('intval', get_post_meta($post_id, 'moderator_years', false)),
            'curator_years'   => array_map('intval', get_post_meta($post_id, 'curator_years', false)),
            'musician_years'  => array_map('intval', get_post_meta($post_id, 'musician_years', false)),
            'kidfest_years'   => array_map('intval', get_post_meta($post_id, 'kidfest_years', false)),
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
            'alternate_name'    => get_post_meta($post_id, 'alternate_name', true),
            'name_pronunciation' => get_post_meta($post_id, 'name_pronunciation', true),
            'building'          => get_post_meta($post_id, 'building', true),
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
            $author_ids    = get_post_meta($post['id'], 'author', false);
            $festival_year = (int) get_post_meta($post['id'], 'festival_year', true) ?: null;
            $book_id       = (int) get_post_meta($post['id'], 'book', true) ?: null;
            $book_title    = $book_id ? get_the_title($book_id) : null;
            $book_cover    = $book_id
                ? wp_get_attachment_image_src(get_post_meta($book_id, 'cover_image', true), 'large') ?: null
                : null;
            return [
                'authors'          => array_values(array_filter(array_map('vfa_get_person_data', $author_ids))),
                'festival_year'    => $festival_year,
                'book_title'       => $book_title,
                'interviewer_name' => get_post_meta($post['id'], 'interviewer_name', true),
                'interviewer_bio'  => get_post_meta($post['id'], 'interviewer_bio', true),
                'interviewer_age'  => get_post_meta($post['id'], 'interviewer_age', true) !== ''
                                        ? (int) get_post_meta($post['id'], 'interviewer_age', true)
                                        : null,
                'intro'            => get_post_meta($post['id'], 'intro', true),
                'book_cover'       => $book_cover ?: null,
                'question'         => get_post_meta($post['id'], 'question'),
                'answer'           => get_post_meta($post['id'], 'answer'),
                'question_image'   => array_map(function($attachment_id) {
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
                'authors'      => array_values(array_filter(array_map(
                                     'vfa_get_person_data', $author_ids
                                 ))),
                'subtitle'     => get_post_meta($id, 'subtitle', true),
                'additional_authors' => get_post_meta($id, 'additional_authors', true),
                'illustrators' => get_post_meta($id, 'illustrators', true),
                'categories'   => get_post_meta($id, 'categories', false),
                'age_min'      => get_post_meta($id, 'age_min', true) !== '' ? (int) get_post_meta($id, 'age_min', true) : null,
                'age_max'      => get_post_meta($id, 'age_max', true) !== '' ? (int) get_post_meta($id, 'age_max', true) : null,
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
                'is_kidfest'   => (bool) get_post_meta($id, 'is_kidfest', true),
                'event_type'   => get_post_meta($id, 'event_type', true) ?: 'conversation',
                'hosts'        => array_values(array_filter(array_map(
                                      'vfa_get_person_data', get_post_meta($id, 'hosts', false)
                                  ))),
                'hosted_by'    => get_post_meta($id, 'hosted_by', true),
                'age_range'   => get_post_meta($id, 'age_range', true),
                'extra_info'  => get_post_meta($id, 'extra_info', true),
                'summary'     => get_post_meta($id, 'summary', true),
                'event_date'  => get_post_meta($id, 'event_date', true),
                'time_start'       => get_post_meta($id, 'time_start', true),
                'time_end'         => get_post_meta($id, 'time_end', true),
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
                'tickets' => (function() use ($id) {
                    $types  = get_post_meta($id, 'ticket_type', false);
                    $tiers  = get_post_meta($id, 'ticket_tier', false);
                    $prices = get_post_meta($id, 'ticket_price', false);
                    $count  = max(count($types), count($tiers), count($prices));
                    if ($count === 0) return [];
                    return array_map(function($i) use ($types, $tiers, $prices) {
                        return [
                            'type'  => $types[$i]  ?? '',
                            'tier'  => $tiers[$i]  ?? '',
                            'price' => $prices[$i] ?? '',
                        ];
                    }, range(0, $count - 1));
                })(),
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

    register_rest_route('vfa/v1', '/people/authors', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function($request) {
            $year = $request->get_param('year') ? (int) $request->get_param('year') : (int) date('Y');
            $people = get_posts([
                'post_type'      => 'people',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'orderby'        => 'title',
                'order'          => 'ASC',
                'meta_query'     => [
                    ['key' => 'author_years', 'value' => $year, 'compare' => '=', 'type' => 'NUMERIC'],
                ],
            ]);
            return array_map(function($person) {
                return vfa_get_person_data($person->ID);
            }, $people);
        },
    ]);

    register_rest_route('vfa/v1', '/people/kidfest', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function($request) {
            $year = $request->get_param('year') ? (int) $request->get_param('year') : (int) date('Y');
            $people = get_posts([
                'post_type'      => 'people',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'meta_query'     => [
                    ['key' => 'kidfest_years', 'value' => $year, 'compare' => '=', 'type' => 'NUMERIC'],
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
                    ['key' => 'hosts',     'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
                ],
            ]);

            return array_map(function($event) use ($person_id) {
                $id = $event->ID;
                $roles = [];
                if (in_array((string) $person_id, get_post_meta($id, 'authors',   false))) $roles[] = 'author';
                if (in_array((string) $person_id, get_post_meta($id, 'moderator', false))) $roles[] = 'moderator';
                if (in_array((string) $person_id, get_post_meta($id, 'curator',   false))) $roles[] = 'curator';
                if (in_array((string) $person_id, get_post_meta($id, 'musician',  false))) $roles[] = 'musician';
                if (in_array((string) $person_id, get_post_meta($id, 'hosts',     false))) $roles[] = 'host';

                $event_date = get_post_meta($id, 'event_date', true);
                $year       = $event_date ? (int) substr($event_date, 0, 4) : null;

                return [
                    'id'             => $id,
                    'slug'           => $event->post_name,
                    'title'          => $event->post_title,
                    'event_date'     => $event_date,
                    'time_start'     => get_post_meta($id, 'time_start', true),
                    'time_end'       => get_post_meta($id, 'time_end', true),
                    'eventbrite_url' => get_post_meta($id, 'eventbrite_url', true),
                    'year'           => $year,
                    'roles'          => $roles,
                ];
            }, $events);
        },
    ]);

    register_rest_route('vfa/v1', '/people/(?P<id>\d+)/interviews', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function($request) {
            $person_id  = (int) $request['id'];
            $interviews = get_posts([
                'post_type'      => 'interviews',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'orderby'        => 'meta_value_num',
                'meta_key'       => 'festival_year',
                'order'          => 'DESC',
                'meta_query'     => [
                    ['key' => 'author', 'value' => $person_id, 'compare' => '=', 'type' => 'NUMERIC'],
                ],
            ]);
            return array_map(function($post) {
                $book_id = (int) get_post_meta($post->ID, 'book', true) ?: null;
                return [
                    'id'           => $post->ID,
                    'slug'         => $post->post_name,
                    'title'        => $post->post_title,
                    'festival_year' => (int) get_post_meta($post->ID, 'festival_year', true) ?: null,
                    'book_title'   => $book_id ? get_the_title($book_id) : null,
                ];
            }, $interviews);
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
                    'categories'    => get_post_meta($id, 'categories', false),
                ];
            }, $books);
        },
    ]);

});
