<?php

namespace App;

use Sober\Controller\Controller;

class Single extends Controller
{
    /**
     * returns the items for the subPages menu
    */
    public function categories()
    {
       return get_terms([ 'taxonomy' => 'category', 'orderby' => 'term_order']);
    }

    public function postCategories() {
        global $post;
        $terms = get_the_terms($post, 'category');
        return empty($terms) ? [] : $terms;
    }

    public function postCategoriesNames() {
        global $post;
        $terms = $this->postCategories();
        $names = array_map(
            function ($term) {
                return $term->name;
            },
            $terms
        );
        return empty($names) ? [] : $names;
    }

    public function postMedias() {
        global $post;
        $terms = get_the_terms($post, 'media');
        return empty($terms) ? [] : $terms;
    }

    public function postMetaDataContainerClasses() {
        $classes = ['meta-data'];
        if($this->postMedias()) {
            $classes[] = 'meta-data-ci-medias';
        }
        return implode(' ', $classes);
    }
}
