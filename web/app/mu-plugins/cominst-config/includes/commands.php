<?php

/**
 * Migrate CPT media-intervention to simple posts with category 'C&I dans les médias'
 */
function cominst_migrate_interventions() {
    global $wpdb;

    // select all media-nterventions IDs
    $ids = $wpdb->get_col("SELECT ID from wp_posts WHERE post_type = 'media-intervention'");

    echo "Count: " . count($ids) . "\n";
    ob_flush();
    foreach($ids as $post_id) {
        
        echo "ID: $id\n";

        // set post_type as post
        set_post_type( $post_id, 'post' );

        // WPML: set element_type as post_post
        $wpdb->update(
            'wp_icl_translations',
            [ 'element_type' => 'post_post'],
            [ 'element_id' => $post_id],
            $format = null, $where_format = null
        );
        
        // add category 'C&I dans les médias' - ID: 58
        $wpdb->insert(
            'wp_term_relationships',
            [
                'object_id' => $post_id,
                'term_taxonomy_id' => 58
            ]
        );

        ob_flush();
    }

}

function correct_wrong_category_id_for_en_cimedia_posts() {

    global $wpdb;

    $ids = $wpdb->get_col("SELECT ID FROM wp_posts as p
    INNER JOIN wp_icl_translations as wpml ON wpml.element_id = p.ID
    INNER JOIN wp_term_relationships AS tr ON tr.object_id = p.ID 
    WHERE p.post_type = 'post' 
    AND wpml.language_code = 'en'
    AND tr.term_taxonomy_id = 58");

    foreach($ids as $post_id) {
        $wpdb->update(
            'wp_term_relationships',
            [
                'term_taxonomy_id' => 60
            ],
            [
                'term_taxonomy_id' => 58,
                'object_id' => $post_id
            ]
        );
    }


}