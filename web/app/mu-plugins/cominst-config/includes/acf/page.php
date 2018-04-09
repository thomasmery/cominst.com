<?php

if( function_exists('acf_add_local_field_group') ):

    acf_add_local_field_group(array(
        'key' => 'group_5a09bbc3c9eb0',
        'title' => 'Champs pour Pages',
        'fields' => array(
            array(
                'key' => 'field_5a09bb5b0eeaf',
                'label' => 'Sous-titre',
                'name' => 'subtitle',
                'type' => 'text',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'placeholder' => '',
                'prepend' => '',
                'append' => '',
                'maxlength' => '',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ),
                array(
                    'param' => 'page',
                    'operator' => '!=',
                    'value' => '103',// Home Page FR
                ),
                array(
                    'param' => 'page',
                    'operator' => '!=',
                    'value' => '106',// Home Page EN
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'acf_after_title',
        'style' => 'seamless',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => 1,
        'description' => '',
    ));
    
    endif;