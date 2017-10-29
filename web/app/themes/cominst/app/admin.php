<?php

namespace App;

/**
 * Theme customizer
 */
add_action('customize_register', function (\WP_Customize_Manager $wp_customize) {
    // Add postMessage support
    $wp_customize->get_setting('blogname')->transport = 'postMessage';
    $wp_customize->selective_refresh->add_partial('blogname', [
        'selector' => '.brand',
        'render_callback' => function () {
            bloginfo('name');
        }
    ]);
});

/**
 * Customizer JS
 */
add_action('customize_preview_init', function () {
    wp_enqueue_script('sage/customizer.js', asset_path('scripts/customizer.js'), ['customize-preview'], null, true);
});


/** We want a 'All posts' menu item in 'Posts' meta box in Nav Menus Admin
 * so we can link to the section in the main page
 * note: this is not available by default as basic post type has has_archive = false
 * @see wp/nav-menus.php wp_nav_menu_item_post_type_meta_box() method
*/
add_filter(
    'nav_menu_items_post',
    function ($posts) {
        $post_type_name = 'post';
        $post_type = get_post_type_object($post_type_name);
        array_unshift( $posts, (object) array(
            'ID' => 0,
            'object_id' => -1,
            'object'     => $post_type_name,
            'post_content' => '',
            'post_excerpt' => '',
            'post_title' => $post_type->labels->archives,
            'post_type' => 'nav_menu_item',
            'type' => 'post_type_archive',
            'url' => get_post_type_archive_link( $post_type_name ),
        ) );
        return $posts;
    }
);
