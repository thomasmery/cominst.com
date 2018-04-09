<?php

if( function_exists('acf_add_local_field_group') ):

    // home page
    acf_add_local_field_group(array(
        'key' => 'group_5a34e7a845cd9',
        'title' => 'Champs supplémentaires pour Home Page',
        'fields' => array(
            array(
                'key' => 'field_5a34e7a858de0',
                'label' => 'Theme',
                'name' => 'theme',
                'type' => 'clone',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'clone' => array(
                    0 => 'field_5a3921bb9db8c',
                ),
                'display' => 'seamless',
                'layout' => 'block',
                'prefix_label' => 0,
                'prefix_name' => 0,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page',
                    'operator' => '==',
                    'value' => '103',// Home Page FR
                ),
            ),
            array(
                array(
                    'param' => 'page',
                    'operator' => '==',
                    'value' => '106',// Home Page EN
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'field',
        'hide_on_screen' => '',
        'active' => 1,
        'description' => '',
    ));
    
endif;