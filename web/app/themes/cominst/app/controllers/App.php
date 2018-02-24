<?php

namespace App;

use Sober\Controller\Controller;

class App extends Controller
{
    public function siteName()
    {
        return get_bloginfo('name');
    }

    public function postSlug()
    {
        $post = get_post();
        if ($post) {
            return $post->post_name;
        }
        return '';
    }

    public static function title()
    {
        if (is_home()) {
            if ($home = get_option('page_for_posts', true)) {
                return get_the_title($home);
            }
            return __('Latest Posts', 'sage');
        }
        if (is_archive()) {
            return get_the_archive_title();
        }
        if (is_search()) {
            return sprintf(__('Search Results for %s', 'sage'), get_search_query());
        }
        if (is_404()) {
            return __('Not Found', 'sage');
        }
        return get_the_title();
    }

    /**
     * returns the root level pages of the primary navaigation
     * used to be able to use the client app markup easily within wp template
     * and not have to deal with a full wp menu (or a custom walker ...)
     */
    public function mainNavItems()
    {
        $menu_items = self::getPrimaryNavigationItems();
        $menu_items = array_filter($menu_items, function ($item) {
            return $item->menu_item_parent == 0;
        });
        usort($menu_items, function ($item_a, $item_b) {
            return $item_a->menu_order > $item_b->menu_order ? 1 : -1;
        });
        return $menu_items;
    }

    /**
     * Get the WP Menu Items for the primary navigation location
     */
    public static function getPrimaryNavigationItems()
    {
        $locations = get_nav_menu_locations();
        $menu_object = wp_get_nav_menu_object($locations['primary_navigation']);
        if ($menu_object) {
            return wp_get_nav_menu_items($menu_object->term_id, array( 'update_post_term_cache' => false ));
        }
        return [];
    }
}
