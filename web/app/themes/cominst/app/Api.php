<?php

namespace App;

class Api {
    /**
    * get data from REST API
    * to be used in initial data payload for JS app
    */

    /**
    * posts
    */
    public static function get_posts( $per_page = 10 ) {
        $request = new \WP_REST_Request( 'GET', '/wp/v2/posts' );
        $request->set_param( 'per_page', $per_page );
        $response = rest_do_request( $request );
        return $response->data;
    }

    /**
    * pages
    */
    public static function get_pages( $params ) {
        $request = new \WP_REST_Request( 'GET', '/wp/v2/pages' );
        foreach($params as $key => $value) {
            $request->set_param( $key, $value );
        }
        $response = rest_do_request( $request );
        return $response->data;
    }

    public static function get_top_pages() {
        $params = [
            'per_page' => 99, // max allowed is 99
            'parent' => 0
        ];
        return self::get_pages($params);
    }

    /**
    * menu
    */
    public static function get_primary_navigation() {
        $request = new \WP_REST_Request( 'GET', '/wp-api-menus/v2/menu-locations/primary_navigation' );
        $response = rest_do_request( $request );
        return $response->data;
    }
}
