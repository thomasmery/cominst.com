<?php

// registration code for media taxonomy
function register_media_tax() {
	$labels = array(
		'name' 					=> _x( 'Medias', 'taxonomy general name' ),
		'singular_name' 		=> _x( 'Media', 'taxonomy singular name' ),
		'add_new' 				=> _x( 'Add New Media', 'Media'),
		'add_new_item' 			=> __( 'Add New Media' ),
		'edit_item' 			=> __( 'Edit Media' ),
		'new_item' 				=> __( 'New Media' ),
		'view_item' 			=> __( 'View Media' ),
		'search_items' 			=> __( 'Search Medias' ),
		'not_found' 			=> __( 'No Media found' ),
		'not_found_in_trash' 	=> __( 'No Media found in Trash' ),
	);
	
	$pages = array('media-intervention', 'post');
				
	$args = array(
		'labels' 			=> $labels,
		'singular_label' 	=> __('Media'),
		'public' 			=> true,
		'show_ui' 			=> true,
		'hierarchical' 		=> true,
		'show_tagcloud' 	=> false,
		'show_in_nav_menus' => false,
		'rewrite' 			=> array('slug' => 'media'),
	 );
	register_taxonomy('media', $pages, $args);
}
add_action('init', 'register_media_tax');