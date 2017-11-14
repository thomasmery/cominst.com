<?php

/** Loading ACF fields 
* this needs to be done after ACF Plugin has been loaded
* mu-plugins load first
*/

function cominst_add_acf_fields() {

   

}
add_action( 'plugins_loaded', 'cominst_add_acf_fields' );