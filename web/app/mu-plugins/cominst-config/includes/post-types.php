<?php

// registration code for media-intervention post type
function register_media_intervention_posttype() {
    $labels = array(
        'name' 				=> _x( 'Media Interventions', 'post type general name' ),
        'singular_name'		=> _x( 'Media Intervention', 'post type singular name' ),
        'add_new' 			=> _x( 'Add New', 'Media Intervention'),
        'add_new_item' 		=> __( 'Add New Media Intervention '),
        'edit_item' 		=> __( 'Edit Media Intervention '),
        'new_item' 			=> __( 'New Media Intervention '),
        'view_item' 		=> __( 'View Media Intervention '),
        'search_items' 		=> __( 'Search Media Interventions '),
        'not_found' 		=>  __( 'No Media Intervention found' ),
        'not_found_in_trash'=> __( 'No Media Interventions found in Trash' ),
        'parent_item_colon' => ''
    );
    
    $taxonomies = array('category');
    
    $supports = array('title','editor','thumbnail','excerpt');
    
    $post_type_args = array(
        'labels' 			=> $labels,
        'singular_label' 	=> __('Media Intervention'),
        'public' 			=> true,
        'show_ui' 			=> true,
        'publicly_queryable'=> true,
        'query_var'			=> true,
        'capability_type' 	=> 'post',
        'has_archive' 		=> true,
        'hierarchical' 		=> false,
        'rewrite' 			=> array('slug' => '', 'with_front' => false ),
        'supports' 			=> $supports,
        'menu_position' 	=> 5,
        'menu_icon' 		=> 'http://www.cominst.com/wp-content/plugins/easy-content-types/includes/images/icon.png',
        'taxonomies'		=> $taxonomies
        );
        register_post_type('media-intervention',$post_type_args);
}
add_action('init', 'register_media_intervention_posttype');// registration code for reference post type
function register_reference_posttype() {
    $labels = array(
        'name' 				=> _x( 'References', 'post type general name' ),
        'singular_name'		=> _x( 'Reference', 'post type singular name' ),
        'add_new' 			=> _x( 'Add New', 'Reference'),
        'add_new_item' 		=> __( 'Add New Reference '),
        'edit_item' 		=> __( 'Edit Reference '),
        'new_item' 			=> __( 'New Reference '),
        'view_item' 		=> __( 'View Reference '),
        'search_items' 		=> __( 'Search References '),
        'not_found' 		=>  __( 'No Reference found' ),
        'not_found_in_trash'=> __( 'No References found in Trash' ),
        'parent_item_colon' => ''
    );
    
    $taxonomies = array();
    
    $supports = array('title','editor','thumbnail','excerpt');
    
    $post_type_args = array(
        'labels' 			=> $labels,
        'singular_label' 	=> __('Reference'),
        'public' 			=> true,
        'show_ui' 			=> true,
        'publicly_queryable'=> true,
        'query_var'			=> true,
        'capability_type' 	=> 'post',
        'has_archive' 		=> false,
        'hierarchical' 		=> false,
        'rewrite' 			=> array('slug' => '', 'with_front' => false ),
        'supports' 			=> $supports,
        'menu_position' 	=> 5,
        'menu_icon' 		=> 'http://www.cominst.com/wp-content/plugins/easy-content-types/includes/images/icon.png',
        'taxonomies'		=> $taxonomies
        );
        register_post_type('reference',$post_type_args);
}
add_action('init', 'register_reference_posttype');// registration code for drawing post type
function register_drawing_posttype() {
    $labels = array(
        'name' 				=> _x( 'Drawings', 'post type general name' ),
        'singular_name'		=> _x( 'Drawing', 'post type singular name' ),
        'add_new' 			=> _x( 'Add New', 'Drawing'),
        'add_new_item' 		=> __( 'Add New Drawing '),
        'edit_item' 		=> __( 'Edit Drawing '),
        'new_item' 			=> __( 'New Drawing '),
        'view_item' 		=> __( 'View Drawing '),
        'search_items' 		=> __( 'Search Drawings '),
        'not_found' 		=>  __( 'No Drawing found' ),
        'not_found_in_trash'=> __( 'No Drawings found in Trash' ),
        'parent_item_colon' => ''
    );
    
    $taxonomies = array();
    
    $supports = array('title','thumbnail','excerpt','page-attributes');
    
    $post_type_args = array(
        'labels' 			=> $labels,
        'singular_label' 	=> __('Drawing'),
        'public' 			=> true,
        'show_ui' 			=> true,
        'publicly_queryable'=> true,
        'query_var'			=> true,
        'capability_type' 	=> 'post',
        'has_archive' 		=> true,
        'hierarchical' 		=> true,
        'rewrite' 			=> array('slug' => '', 'with_front' => false ),
        'supports' 			=> $supports,
        'menu_position' 	=> 5,
        'menu_icon' 		=> 'http://www.cominst.com/wp-content/plugins/easy-content-types/includes/images/icon.png',
        'taxonomies'		=> $taxonomies
        );
        register_post_type('drawing',$post_type_args);
}
add_action('init', 'register_drawing_posttype');// registration code for publication post type
function register_publication_posttype() {
    $labels = array(
        'name' 				=> _x( 'Publications', 'post type general name' ),
        'singular_name'		=> _x( 'Publication', 'post type singular name' ),
        'add_new' 			=> _x( 'Add New', 'Publication'),
        'add_new_item' 		=> __( 'Add New Publication '),
        'edit_item' 		=> __( 'Edit Publication '),
        'new_item' 			=> __( 'New Publication '),
        'view_item' 		=> __( 'View Publication '),
        'search_items' 		=> __( 'Search Publications '),
        'not_found' 		=>  __( 'No Publication found' ),
        'not_found_in_trash'=> __( 'No Publications found in Trash' ),
        'parent_item_colon' => ''
    );
    
    $taxonomies = array();
    
    $supports = array('title','editor','thumbnail','excerpt');
    
    $post_type_args = array(
        'labels' 			=> $labels,
        'singular_label' 	=> __('Publication'),
        'public' 			=> true,
        'show_ui' 			=> true,
        'publicly_queryable'=> true,
        'query_var'			=> true,
        'capability_type' 	=> 'post',
        'has_archive' 		=> false,
        'hierarchical' 		=> false,
        'rewrite' 			=> array('slug' => '', 'with_front' => false ),
        'supports' 			=> $supports,
        'menu_position' 	=> 5,
        'menu_icon' 		=> 'http://www.cominst.com/wp-content/plugins/easy-content-types/includes/images/icon.png',
        'taxonomies'		=> $taxonomies
        );
        register_post_type('publication',$post_type_args);
}
add_action('init', 'register_publication_posttype');									