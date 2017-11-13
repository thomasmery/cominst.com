<?php

namespace App;

/**
 * we need to add some custom data to some WP REST API responses
 */
add_action('rest_api_init', function() {
    // an image tag for featured images
    register_rest_field(
        ['post', 'page'],
        'featured_media_html',
        [
            'get_callback' => '\App\get_featured_media_html'
        ]
    );

    // all featured_image sizes for a post or page
    register_rest_field(
        ['post', 'page'],
        'featured_media_metadata',
        [
            'get_callback' => '\App\get_featured_media_metadata'
        ]
    );

    // categories names
    register_rest_field(
        'post',
        'categories_names',
        [
            'get_callback' => '\App\get_categories_names'
        ]
    );

    // Media taxonomy terms - names
    register_rest_field(
        'post',
        'medias_names',
        [
            'get_callback' => '\App\get_medias_names'
        ]
    );

    // formatted published date
    register_rest_field(
        'post',
        'formatted_published_date',
        [
            'get_callback' => '\App\get_formatted_published_date'
        ]
    );

    // path to post - used by the client Router
    register_rest_field(
        'post',
        'path',
        [
            'get_callback' => '\App\get_path'
        ]
    );

});

function get_featured_media_html($object) {
    $html = '';
    if(isset($object['featured_media']) && $object['featured_media']) {
        $html = wp_get_attachment_image( $object['featured_media'], 'medium');
    }
    return $html;
}

function get_featured_media_metadata($object) {
    $sizes = '';
    if(isset($object['featured_media']) && $object['featured_media']) {
        $sizes = wp_get_attachment_metadata( $object['featured_media']);
    }
    return $sizes;
}

function get_categories_names($object) {
    return wp_get_object_terms($object['id'], 'category', ['fields' => 'names']);
}

function get_medias_names($object) {
    return wp_get_object_terms($object['id'], 'media', ['fields' => 'names']);
}

function get_formatted_published_date($object) {
    return get_the_date(null, $object['id']);
}

function get_path($object) {
    return str_replace(get_option('home'), '', get_the_permalink($object['id']));
}


/**
 * a simple Class to access WP data
 * either via the REST API
 * or in some cases
 * (when we don't need to fetch data fro the client - and don't want to create custom endpoints)
 * with regular WP methods
 */
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
                $sectors[$key]->image_html = wp_get_attachment_image( $sectors[$key]->image['ID'], 'medium');
            }
            $sectors[$key]->references = get_posts([
                'post_type' => 'reference',
                'tax_query' => [ ['taxonomy' => 'sector', 'field' => 'term_id', 'terms' => [$sector->term_id] ] ]
            ]);
        }
        return $sectors;
    }

}
