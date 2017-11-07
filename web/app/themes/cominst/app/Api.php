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
        return [
            'data' => $response->data,
            'paging' => [
                'currentPage' => 1,
                'total' => $response->headers['X-WP-Total'],
                'totalPages' => $response->headers['X-WP-TotalPages'],
            ]
        ];
    }

    /**
    * post categories
    */
    public static function get_categories( $per_page = 99 ) {
        $request = new \WP_REST_Request( 'GET', '/wp/v2/categories' );
        $request->set_param( 'per_page', $per_page );
        $response = rest_do_request( $request );
        return $response->data;
    }

    /**
    * taxonomies
    */
    public static function get_taxonomies( $per_page = 99 ) {
        $request = new \WP_REST_Request( 'GET', '/wp/v2/taxonomies' );
        $request->set_param( 'per_page', $per_page );
        $response = rest_do_request( $request );
        return $response->data;
    }

    /**
    * post types
    */
    public static function get_post_types( $per_page = 99 ) {
        $request = new \WP_REST_Request( 'GET', '/wp/v2/types' );
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
            'per_page' => 99, // max allowed is 99 - if more is needed > make anothe call and combine
            // 'parent' => 0
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

    /**
     * Theme options
     * used for Client infos like contact details, social networks ...
     */
    public static function get_theme_options() {
        $request = new \WP_REST_Request( 'GET', '/acf/v3/options/theme-general-settings' );
        $response = rest_do_request( $request );
        return $response->data;
    }

    /**
     * Sectors & References for 'Nos références'
     * we get a list of sectors and associate the 'references'
     * we are not using the REST API because it would require custom endpoints
     * and we won't need to fetch the date from the client
     */
    public static function get_references_by_sectors() {
        $sectors = get_terms(['taxonomy' => 'sector', 'orderby' => 'name']);
        foreach($sectors as $key => $sector) {
            $sectors[$key]->image = get_field('image', $sector);
            if(isset($sectors[$key]->image) && $sectors[$key]->image) {
                $sectors[$key]->image_tag = wp_get_attachment_image( $sectors[$key]->image['ID'], 'medium');
            }
            $sectors[$key]->references = get_posts([
                'post_type' => 'reference',
                'tax_query' => [ ['taxonomy' => 'sector', 'field' => 'term_id', 'terms' => [$sector->term_id] ] ]
            ]);
        }
        return $sectors;
    }

}
