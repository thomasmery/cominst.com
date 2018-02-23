<?php

namespace App;

use Sober\Controller\Controller;

class FrontPage extends Controller
{

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
     * returns the items for the subPages menu
    */
    public function subPagesNavItems()
    {
        $menu_items = self::getPrimaryNavigationItems();
        $page = \get_queried_object();
        // find page in menu items - using array_slice to get an array where keys start at 0
        $extracted_items = array_slice(wp_filter_object_list($menu_items, [ 'object_id' => $page->ID ]), 0);
        if (!empty($extracted_items)) {
            $item = $extracted_items[0];
        } else {
            return [];
        }
        // root level - get children
        if (!$item->menu_item_parent) {
            $items = wp_filter_object_list($menu_items, [ 'menu_item_parent' => $item->ID ]);
        } else { // below root level - get siblings
            $items = wp_filter_object_list($menu_items, [ 'menu_item_parent' => $item->menu_item_parent ]);
        }
        return $items;
    }

    /**
    * returns the title for the sub pages
    * will always be the root level menu object title
    */
    public function subPagesNavTitle()
    {
        $title = '';
        $menu_items = self::getPrimaryNavigationItems();
        $page = \get_queried_object();
        // find page in menu items - using array_slice to get an array where keys start at 0
        $extracted_items = array_slice(wp_filter_object_list($menu_items, [ 'object_id' => $page->ID ]), 0);
        if (!empty($extracted_items)) {
            $item = $extracted_items[0];
        } else {
            return '';
        }
        // root level - get the item's title
        if (!$item->menu_item_parent) {
            $title = $item->title;
        } else { // below root level - get parent title
            $parent_item = array_slice(wp_filter_object_list($menu_items, [ 'ID' => $item->menu_item_parent ]), 0)[0];
            $title = $parent_item->title;
        }
        return $title;
    }

    /**
     * Get the WP Menu Items for the primary navigation location
     */
    private static function getPrimaryNavigationItems()
    {
        $locations = get_nav_menu_locations();
        $menu_object = wp_get_nav_menu_object($locations['primary_navigation']);
        if ($menu_object) {
            return wp_get_nav_menu_items($menu_object->term_id, array( 'update_post_term_cache' => false ));
        }
        return [];
    }
}
