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

    acf_add_local_field_group(array(
        'key' => 'group_5c113482db9b4',
        'title' => 'Style de la page',
        'fields' => array(
            array(
                'key' => 'field_5c11347518480',
                'label' => 'Thème Couleur',
                'name' => 'color_theme',
                'type' => 'select',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'choices' => array(
                    'dark' => 'Sombre',
                    'light' => 'Clair',
                ),
                'default_value' => array(
                ),
                'allow_null' => 1,
                'multiple' => 0,
                'ui' => 0,
                'ajax' => 0,
                'return_format' => 'value',
                'placeholder' => '',
            ),
            array(
			'key' => 'field_5c126e632688e',
			'label' => 'Image secondaire',
			'name' => 'secondary_image',
			'type' => 'image',
			'instructions' => 'Cette image, si elle existe, sera placée à droite en regard du titre et du texte de l\'encart',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'array',
			'preview_size' => 'medium',
			'library' => 'all',
			'min_width' => '',
			'min_height' => '',
			'min_size' => '',
			'max_width' => '',
			'max_height' => '',
			'max_size' => '',
			'mime_types' => '',
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
                array(
                    'param' => 'page_type',
                    'operator' => '!=',
                    'value' => 'top_level',
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