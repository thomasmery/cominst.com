<?php
/*
Plugin Name: Communication & Institutions - Configuration plugin
*/

/** 
 * Note: in C&I v2 we don't need additional CPTs or Taxonomies
 * we keep the config here and comment the includes for future reference
 */

// post types
// require ('includes/post-types.php');

// taxonomies
// require ('includes/taxonomies.php');


// WP custom fields - meta boxes
// require ('includes/custom-fields.php');

// ACF
require ('includes/acf.php');

// Commands
require ('includes/commands.php');
