<?php

/** Loading ACF fields 
* this needs to be done after ACF Plugin has been loaded
* and mu-plugins load first
*/

function cominst_add_acf_fields() {
    if( function_exists('acf_add_local_field_group') ):
        require_once('acf/home-page.php');
        require_once('acf/page.php');
        require_once('acf/content-containers.php');
        require_once('acf/general-settings.php');
    endif;
}
add_action( 'plugins_loaded', 'cominst_add_acf_fields' );