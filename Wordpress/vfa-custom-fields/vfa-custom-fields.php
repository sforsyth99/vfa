<?php
  /**
   * Plugin Name: VFA Custom Fields
   * Description: Custom fields for interviews and other VFA content.
   * Version: 1.0.0
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
                  'id'      => 'question',
                  'name'    => 'Question',
                  'type'    => 'text',
                  'clone'   => true,
                  'clone_as_multiple' => true,
                  'desc'    => 'Add one question per row. Each question must match the answer in the same position 
              below.',
              ],
              [
                  'id'      => 'answer',
                  'name'    => 'Answer',
                  'type'    => 'textarea',
                  'clone'   => true,
                  'clone_as_multiple' => true,
                  'desc'    => 'Add one answer per row. Answer 1 pairs with Question 1, Answer 2 with Question 2, 
              etc.',
              ],
          ],
      ];
      return $meta_boxes;
  });
  
   add_action('rest_api_init', function() {
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
  });


