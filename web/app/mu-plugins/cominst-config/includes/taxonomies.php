<?php
// registration code for faq-category taxonomy
function register_faq_category_tax() {
	$labels = array(
		'name' 					=> _x( 'Question - Answer Categories', 'taxonomy general name' ),
		'singular_name' 		=> _x( 'Question - Answer Category', 'taxonomy singular name' ),
		'add_new' 				=> _x( 'Add New Question - Answer Category', 'Question - Answer Category'),
		'add_new_item' 			=> __( 'Add New Question - Answer Category' ),
		'edit_item' 			=> __( 'Edit Question - Answer Category' ),
		'new_item' 				=> __( 'New Question - Answer Category' ),
		'view_item' 			=> __( 'View Question - Answer Category' ),
		'search_items' 			=> __( 'Search Question - Answer Categories' ),
		'not_found' 			=> __( 'No Question - Answer Category found' ),
		'not_found_in_trash' 	=> __( 'No Question - Answer Category found in Trash' ),
	);
	
	$pages = array('faq');
				
	$args = array(
		'labels' 			=> $labels,
		'singular_label' 	=> __('Question - Answer Category'),
		'public' 			=> true,
		'show_ui' 			=> true,
		'hierarchical' 		=> true,
		'show_tagcloud' 	=> false,
		'show_in_nav_menus' => true,
		'rewrite' 			=> array('slug' => 'faq-category'),
	 );
	register_taxonomy('faq-category', $pages, $args);
}
add_action('init', 'register_faq_category_tax');

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

// registration code for sector taxonomy
function register_sector_tax() {
	$labels = array(
		'name' 					=> _x( 'Sectors', 'taxonomy general name' ),
		'singular_name' 		=> _x( 'Sector', 'taxonomy singular name' ),
		'add_new' 				=> _x( 'Add New Sector', 'Sector'),
		'add_new_item' 			=> __( 'Add New Sector' ),
		'edit_item' 			=> __( 'Edit Sector' ),
		'new_item' 				=> __( 'New Sector' ),
		'view_item' 			=> __( 'View Sector' ),
		'search_items' 			=> __( 'Search Sectors' ),
		'not_found' 			=> __( 'No Sector found' ),
		'not_found_in_trash' 	=> __( 'No Sector found in Trash' ),
	);
	
	$pages = array('reference');
				
	$args = array(
		'labels' 			=> $labels,
		'singular_label' 	=> __('Sector'),
		'public' 			=> true,
		'show_ui' 			=> true,
		'hierarchical' 		=> true,
		'show_tagcloud' 	=> false,
		'show_in_nav_menus' => true,
		'rewrite' 			=> array('slug' => 'sector'),
	 );
	register_taxonomy('sector', $pages, $args);
}
add_action('init', 'register_sector_tax');