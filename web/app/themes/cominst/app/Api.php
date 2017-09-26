<?php

namespace App;

class Api {
    /**
    * get posts from REST API
    * to be used in initial data payload for JS app
    */
    public static function get_posts( $per_page = 10 ) {
        $request = new \WP_REST_Request( 'GET', '/wp/v2/posts' );
        $request->set_param( 'per_page', $per_page );
        $response = rest_do_request( $request );
        return $response->data;
    }
}
