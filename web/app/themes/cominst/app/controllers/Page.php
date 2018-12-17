<?php

namespace App;

use Sober\Controller\Controller;

class FrontPage extends Controller
{
    /**
     * returns the items for the subPages menu
    */
    public function subPagesNavItems()
    {
        $menu_items = \App::getPrimaryNavigationItems();
        $page = \get_queried_object();
        // find page in menu items - using array_slice to get an array where keys start at 0
        $extracted_items = array_slice(wp_filter_object_list($menu_items, [ 'object_id' => $page->ID ]), 0);
        if (!empty($extracted_items)) {
            $currentItem = $extracted_items[0];
        } else {
            return [];
        }
        // root level - get children
        if (!$currentItem->menu_item_parent) {
            $items = wp_filter_object_list($menu_items, [ 'menu_item_parent' => $currentItem->ID ]);
        } else { // below root level - get siblings
            $items = wp_filter_object_list($menu_items, [ 'menu_item_parent' => $currentItem->menu_item_parent ]);
        }

        // allows augmenting items
        $items = array_map(function ($_item) use ($currentItem) {
            if($currentItem->url === $_item->url) {
                $_item->active = true;
            }
            return $_item;
        }, $items);

        return $items;
    }

    /**
    * returns the title for the sub pages
    * will always be the root level menu object title
    */
    public function subPagesNavTitle()
    {
        $title = '';
        $menu_items = \App::getPrimaryNavigationItems();
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
            $url = $item->url;
        } else { // below root level - get parent title
            $parent_item = array_slice(wp_filter_object_list($menu_items, [ 'ID' => $item->menu_item_parent ]), 0)[0];
            $title = $parent_item->title;
            $url = $parent_item->url;
        }
        return "<a href=\"$url\">$title</a>";
    }

    /**
    * returns the secondary image html tag if this field has been set
    */
    public function secondaryImageHtml() {
        $image_infos = get_field('secondary_image');

        if(!$image_infos) {
            return null;
        }

        $image_id = $image_infos['id'];

        return wp_get_attachment_image( $image_id, 'medium', false, [ 'class' => 'alignright secondary-image']);
    }

}
