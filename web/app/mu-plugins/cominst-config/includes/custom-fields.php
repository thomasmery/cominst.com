<?php
global $pagecustomfields_metabox_page;
$pagecustomfields_metabox_page = array( 
	'id' => 'pagecustomfields',
	'title' => 'Page Custom Fields',
	'page' => 'page',
	'context' => 'advanced',
	'priority' => 'core',
	'fields' => $pagecustomfields_fields = array(

				
				array(
					'name' 			=> 'Subtitle',
					'desc' 			=> '',
					'id' 			=> 'ecpt_subtitle',
					'class' 		=> 'ecpt_subtitle',
					'type' 			=> 'text',
					'rich_editor' 	=> 1,			
					'max' 			=> 0													
				),
															
				array(
					'name' 			=> 'Introduction',
					'desc' 			=> '',
					'id' 			=> 'ecpt_introduction',
					'class' 		=> 'ecpt_introduction',
					'type' 			=> 'textarea',
					'rich_editor' 	=> 1,			
					'max' 			=> 0													
				),
												)
);			

add_action('admin_menu', 'ecpt_add_pagecustomfields_meta_box');
function ecpt_add_pagecustomfields_meta_box() {

	global $pagecustomfields_metabox_page;			
		
	add_meta_box($pagecustomfields_metabox_page['id'], $pagecustomfields_metabox_page['title'], 'ecpt_show_pagecustomfields_box', 'page', 'advanced', 'core', $pagecustomfields_metabox_page);
}

// function to show meta boxes
function ecpt_show_pagecustomfields_box()	{
	global $post;
	global $pagecustomfields_metabox_page;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_pagecustomfields_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($pagecustomfields_metabox_page['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_pagecustomfields_save');

// Save data from meta box
function ecpt_pagecustomfields_save($post_id) {
	global $post;
	global $pagecustomfields_metabox_page;
	
	$post_type = $pagecustomfields_metabox_page['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}
	
	// verify nonce
	if (isset($_POST['ecpt_pagecustomfields_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_pagecustomfields_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($pagecustomfields_metabox_page['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
global $mediainterventioncustomfields_metabox_media_intervention;
$mediainterventioncustomfields_metabox_media_intervention = array( 
	'id' => 'mediainterventioncustomfields',
	'title' => 'Media Intervention Custom Fields',
	'page' => 'media-intervention',
	'context' => 'normal',
	'priority' => 'default',
	'fields' => $mediainterventioncustomfields_fields = array(

				
				array(
					'name' 			=> 'Featured',
					'desc' 			=> 'Whether this intervention is featured',
					'id' 			=> 'ecpt_featured',
					'class' 		=> 'ecpt_featured',
					'type' 			=> 'checkbox',
					'rich_editor' 	=> 1,			
					'max' 			=> 0													
				),
															
				array(
					'name' 			=> 'Intervention date',
					'desc' 			=> '',
					'id' 			=> 'ecpt_interventiondate',
					'class' 		=> 'ecpt_interventiondate',
					'type' 			=> 'date',
					'rich_editor' 	=> 1,			
					'max' 			=> 0													
				),
												)
);			
			
add_action('admin_menu', 'ecpt_add_mediainterventioncustomfields_meta_box');
function ecpt_add_mediainterventioncustomfields_meta_box() {

	global $mediainterventioncustomfields_metabox_media_intervention;			
		
	add_meta_box($mediainterventioncustomfields_metabox_media_intervention['id'], $mediainterventioncustomfields_metabox_media_intervention['title'], 'ecpt_show_mediainterventioncustomfields_box', 'media-intervention', 'normal', 'default', $mediainterventioncustomfields_metabox_media_intervention);
}

// function to show meta boxes
function ecpt_show_mediainterventioncustomfields_box()	{
	global $post;
	global $mediainterventioncustomfields_metabox_media_intervention;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_mediainterventioncustomfields_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($mediainterventioncustomfields_metabox_media_intervention['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_mediainterventioncustomfields_save');

// Save data from meta box
function ecpt_mediainterventioncustomfields_save($post_id) {
	global $post;
	global $mediainterventioncustomfields_metabox_media_intervention;
	
	$post_type = $mediainterventioncustomfields_metabox_media_intervention['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}

	// verify nonce
	if (isset($_POST['ecpt_mediainterventioncustomfields_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_mediainterventioncustomfields_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($mediainterventioncustomfields_metabox_media_intervention['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
global $seocontent_metabox_page;
$seocontent_metabox_page = array( 
	'id' => 'seocontent',
	'title' => 'SEO Content',
	'page' => 'page',
	'context' => 'normal',
	'priority' => 'high',
	'fields' => $seocontent_fields = array(

				
				array(
					'name' 			=> 'seo content',
					'desc' 			=> 'Special content for search engines',
					'id' 			=> 'ecpt_seocontent',
					'class' 		=> 'ecpt_seocontent',
					'type' 			=> 'textarea',
					'rich_editor' 	=> 1,			
					'max' 			=> 0													
				),
												)
);			
			
add_action('admin_menu', 'ecpt_add_seocontent_meta_box');
function ecpt_add_seocontent_meta_box() {

	global $seocontent_metabox_page;			
		
	add_meta_box($seocontent_metabox_page['id'], $seocontent_metabox_page['title'], 'ecpt_show_seocontent_box', 'page', 'normal', 'high', $seocontent_metabox_page);
}

// function to show meta boxes
function ecpt_show_seocontent_box()	{
	global $post;
	global $seocontent_metabox_page;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_seocontent_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($seocontent_metabox_page['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_seocontent_save');

// Save data from meta box
function ecpt_seocontent_save($post_id) {
	global $post;
	global $seocontent_metabox_page;

	$post_type = $seocontent_metabox_page['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}
	
	// verify nonce
	if (isset($_POST['ecpt_seocontent_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_seocontent_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($seocontent_metabox_page['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
global $publicationcustomfields_metabox_publication;
$publicationcustomfields_metabox_publication = array( 
	'id' => 'publicationcustomfields',
	'title' => 'Publication Custom Fields',
	'page' => 'publication',
	'context' => 'normal',
	'priority' => 'high',
	'fields' => $publicationcustomfields_fields = array(

				
				array(
					'name' 			=> 'Buy Link',
					'desc' 			=> '',
					'id' 			=> 'ecpt_buylink',
					'class' 		=> 'ecpt_buylink',
					'type' 			=> 'text',
					'rich_editor' 	=> 0,			
					'max' 			=> 0													
				),
															
				array(
					'name' 			=> 'Buy Link Text',
					'desc' 			=> '',
					'id' 			=> 'ecpt_buylinktext',
					'class' 		=> 'ecpt_buylinktext',
					'type' 			=> 'text',
					'rich_editor' 	=> 0,			
					'max' 			=> 0													
				),
															
				array(
					'name' 			=> 'Authors',
					'desc' 			=> '',
					'id' 			=> 'ecpt_authors',
					'class' 		=> 'ecpt_authors',
					'type' 			=> 'text',
					'rich_editor' 	=> 0,			
					'max' 			=> 0													
				),
												)
);			
			
add_action('admin_menu', 'ecpt_add_publicationcustomfields_meta_box');
function ecpt_add_publicationcustomfields_meta_box() {

	global $publicationcustomfields_metabox_publication;			
		
	add_meta_box($publicationcustomfields_metabox_publication['id'], $publicationcustomfields_metabox_publication['title'], 'ecpt_show_publicationcustomfields_box', 'publication', 'normal', 'high', $publicationcustomfields_metabox_publication);
}

// function to show meta boxes
function ecpt_show_publicationcustomfields_box()	{
	global $post;
	global $publicationcustomfields_metabox_publication;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_publicationcustomfields_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($publicationcustomfields_metabox_publication['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_publicationcustomfields_save');

// Save data from meta box
function ecpt_publicationcustomfields_save($post_id) {
	global $post;
	global $publicationcustomfields_metabox_publication;
	
	$post_type = $publicationcustomfields_metabox_publication['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}
	
	// verify nonce
	if (isset($_POST['ecpt_publicationcustomfields_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_publicationcustomfields_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($publicationcustomfields_metabox_publication['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
global $newscustomfields_metabox_post;
$newscustomfields_metabox_post = array( 
	'id' => 'newscustomfields',
	'title' => 'News Custom Fields',
	'page' => 'post',
	'context' => 'normal',
	'priority' => 'high',
	'fields' => $newscustomfields_fields = array(

				
				array(
					'name' 			=> 'featured',
					'desc' 			=> 'Whether this post is featured',
					'id' 			=> 'ecpt_featured',
					'class' 		=> 'ecpt_featured',
					'type' 			=> 'checkbox',
					'rich_editor' 	=> 0,			
					'max' 			=> 0													
				),
												)
);			
			
add_action('admin_menu', 'ecpt_add_newscustomfields_meta_box');
function ecpt_add_newscustomfields_meta_box() {

	global $newscustomfields_metabox_post;			
		
	add_meta_box($newscustomfields_metabox_post['id'], $newscustomfields_metabox_post['title'], 'ecpt_show_newscustomfields_box', 'post', 'normal', 'high', $newscustomfields_metabox_post);
}

// function to show meta boxes
function ecpt_show_newscustomfields_box()	{
	global $post;
	global $newscustomfields_metabox_post;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_newscustomfields_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($newscustomfields_metabox_post['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_newscustomfields_save');

// Save data from meta box
function ecpt_newscustomfields_save($post_id) {
	global $post;
	global $newscustomfields_metabox_post;
	
	$post_type = $newscustomfields_metabox_post['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}
	
	// verify nonce
	if (isset($_POST['ecpt_newscustomfields_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_newscustomfields_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($newscustomfields_metabox_post['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
global $traductionimage_metabox_drawing;
$traductionimage_metabox_drawing = array( 
	'id' => 'traductionimage',
	'title' => 'Traduction Image',
	'page' => 'drawing',
	'context' => 'normal',
	'priority' => 'high',
	'fields' => $traductionimage_fields = array(

				
				array(
					'name' 			=> 'Text for image',
					'desc' 			=> '',
					'id' 			=> 'ecpt_textforimage',
					'class' 		=> 'ecpt_textforimage',
					'type' 			=> 'textarea',
					'rich_editor' 	=> 1,			
					'max' 			=> 0													
				),
												)
);			
			
add_action('admin_menu', 'ecpt_add_traductionimage_meta_box');
function ecpt_add_traductionimage_meta_box() {

	global $traductionimage_metabox_drawing;			
		
	add_meta_box($traductionimage_metabox_drawing['id'], $traductionimage_metabox_drawing['title'], 'ecpt_show_traductionimage_box', 'drawing', 'normal', 'high', $traductionimage_metabox_drawing);
}

// function to show meta boxes
function ecpt_show_traductionimage_box()	{
	global $post;
	global $traductionimage_metabox_drawing;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_traductionimage_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($traductionimage_metabox_drawing['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_traductionimage_save');

// Save data from meta box
function ecpt_traductionimage_save($post_id) {
	global $post;
	global $traductionimage_metabox_drawing;
	
	$post_type = $traductionimage_metabox_drawing['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}
	
	// verify nonce
	if (isset($_POST['ecpt_traductionimage_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_traductionimage_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($traductionimage_metabox_drawing['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
global $referencescustomfields_metabox_reference;
$referencescustomfields_metabox_reference = array( 
	'id' => 'referencescustomfields',
	'title' => 'References Custom fields',
	'page' => 'reference',
	'context' => 'normal',
	'priority' => 'high',
	'fields' => $referencescustomfields_fields = array(

				
				array(
					'name' 			=> 'reference_url',
					'desc' 			=> 'Adresse du site web de cette référence',
					'id' 			=> 'ecpt_referenceurl',
					'class' 		=> 'ecpt_referenceurl',
					'type' 			=> 'text',
					'rich_editor' 	=> 0,			
					'max' 			=> 0													
				),
												)
);			
			
add_action('admin_menu', 'ecpt_add_referencescustomfields_meta_box');
function ecpt_add_referencescustomfields_meta_box() {

	global $referencescustomfields_metabox_reference;			
		
	add_meta_box($referencescustomfields_metabox_reference['id'], $referencescustomfields_metabox_reference['title'], 'ecpt_show_referencescustomfields_box', 'reference', 'normal', 'high', $referencescustomfields_metabox_reference);
}

// function to show meta boxes
function ecpt_show_referencescustomfields_box()	{
	global $post;
	global $referencescustomfields_metabox_reference;
	global $ecpt_prefix;
	
	// Use nonce for verification
	echo '<input type="hidden" name="ecpt_referencescustomfields_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	
	echo '<table class="form-table">';

	foreach ($referencescustomfields_metabox_reference['fields'] as $field) {
		// get current post meta data

		$meta = get_post_meta($post->ID, $field['id'], true);
		
		echo '<tr>',
				'<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
				'<td>';
		switch ($field['type']) {
			case 'text':
				echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" /><br/>', '', $field['desc'];
				break;
			case 'date':
				echo '<input type="text" class="ecpt_datepicker" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:97%" />', '', $field['desc'];
				break;
			case 'upload':
				echo '<input type="text" class="ecpt_upload_field" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : '', '" size="30" style="width:80%" /><input class="upload_image_button" type="button" value="Upload Image" /><br/>', '', $field['desc'];
				break;
			case 'textarea':
				if($field['rich_editor'] == 1) {
					// this is the old method of enabling the RTE. Now it only needs the class name.
					//wp_tiny_mce(true, array('editor_selector' => $field['class'], 'remove_linebreaks' => false) );
					echo '<div style="width: 97%; border: 1px solid #DFDFDF;"><textarea name="', $field['id'], '" class="theEditor ', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];
				} else {
					echo '<div style="width: 100%;"><textarea name="', $field['id'], '" class="', $field['class'], '" id="', $field['id'], '" cols="60" rows="8" style="width:97%">', $meta ? $meta : '', '</textarea></div>', '', $field['desc'];				
				}
				break;
			case 'select':
				echo '<select name="', $field['id'], '" id="', $field['id'], '">';
				foreach ($field['options'] as $option) {
					echo '<option value="' . $option . '"', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
				echo '</select>', '', $field['desc'];
				break;
			case 'radio':
				foreach ($field['options'] as $option) {
					echo '<input type="radio" name="', $field['id'], '" value="', $option, '"', $meta == $option ? ' checked="checked"' : '', ' /> ', $option;
				}
				echo '<br/>' . $field['desc'];
				break;
			case 'checkbox':
				echo '<input type="checkbox" name="', $field['id'], '" id="', $field['id'], '"', $meta ? ' checked="checked"' : '', ' /> ';
				echo $field['desc'];
				break;
			case 'slider':
				echo '<input type="text" rel="' . $field['max'] . '" name="' . $field['id'] . '" id="' . $field['id'] . '" value="' . $meta . '" size="1" style="float: left; margin-right: 5px" />';
				echo '<div class="ecpt-slider" rel="' . $field['id'] . '" style="float: left; width: 60%; margin: 5px 0 0 0;"></div>';		
				echo '<div style="width: 100%; clear: both;">' . $field['desc'] . '</div>';
				break;
		}
		echo     '<td>',
			'</tr>';
	}
	
	echo '</table>';
}	

add_action('save_post', 'ecpt_referencescustomfields_save');

// Save data from meta box
function ecpt_referencescustomfields_save($post_id) {
	global $post;
	global $referencescustomfields_metabox_reference;
	
	$post_type = $referencescustomfields_metabox_reference['page'];
	if( ! isset($post->post_type) || $post->post_type != $post_type) {
		return;
	}
	
	// verify nonce
	if (isset($_POST['ecpt_referencescustomfields_meta_box_nonce']) && !wp_verify_nonce($_POST['ecpt_referencescustomfields_meta_box_nonce'], basename(__FILE__))) {
		return $post_id;
	}

	// check autosave
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return $post_id;
	}

	// check permissions
	if ('page' == $_POST['post_type']) {
		if (!current_user_can('edit_page', $post_id)) {
			return $post_id;
		}
	} elseif (!current_user_can('edit_post', $post_id)) {
		return $post_id;
	}
	
	foreach ($referencescustomfields_metabox_reference['fields'] as $field) {
		$old = get_post_meta($post_id, $field['id'], true);
		$new = $_POST[$field['id']];
		
		if ($new && $new != $old) {
			update_post_meta($post_id, $field['id'], $new);
		} elseif ('' == $new && $old) {
			delete_post_meta($post_id, $field['id'], $old);
		}
	}
}

								
function ecpt_export_ui_scripts() {

	global $ecpt_options;
?> 
<script type="text/javascript">
		jQuery(document).ready(function()
		{
			
			if(jQuery('.form-table .ecpt_upload_field').length > 0 ) {
				// Media Uploader
				window.formfield = '';

				jQuery('.upload_image_button').live('click', function() {
				window.formfield = jQuery('.ecpt_upload_field',jQuery(this).parent());
					tb_show('', 'media-upload.php?type=file&TB_iframe=true');
									return false;
					});

					window.original_send_to_editor = window.send_to_editor;
					window.send_to_editor = function(html) {
						if (window.formfield) {
							imgurl = jQuery('a','<div>'+html+'</div>').attr('href');
							window.formfield.val(imgurl);
							tb_remove();
						}
						else {
							window.original_send_to_editor(html);
						}
						window.formfield = '';
						window.imagefield = false;
					}
			}
			if(jQuery('.form-table .ecpt-slider').length > 0 ) {
				jQuery('.ecpt-slider').each(function(){
					var $this = jQuery(this);
					var id = $this.attr('rel');
					var val = jQuery('#' + id).val();
					var max = jQuery('#' + id).attr('rel');
					max = parseInt(max);
					//var step = $('#' + id).closest('input').attr('rel');
					$this.slider({
						value: val,
						max: max,
						step: 1,
						slide: function(event, ui) {
							jQuery('#' + id).val(ui.value);
						}
					});
				});
			}
			
			if(jQuery('.form-table .ecpt_datepicker').length > 0 ) {
				var dateFormat = 'mm-dd-yy';
				jQuery('.ecpt_datepicker').datepicker({dateFormat: dateFormat});
			}
		});
  </script>
<?php
}

function ecpt_export_datepicker_ui_scripts() {
	global $ecpt_base_dir;
	wp_enqueue_script('jquery-ui.min', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js', false, '1.8', 'all');
}
function ecpt_export_datepicker_ui_styles() {
	global $ecpt_base_dir;
	wp_enqueue_style('jquery-ui-css', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css', false, '1.8', 'all');
}

// these are for newest versions of WP
// add_action('admin_print_scripts-post.php', 'ecpt_export_datepicker_ui_scripts');
// add_action('admin_print_scripts-edit.php', 'ecpt_export_datepicker_ui_scripts');
// add_action('admin_print_scripts-post-new.php', 'ecpt_export_datepicker_ui_scripts');
// add_action('admin_print_styles-post.php', 'ecpt_export_datepicker_ui_styles');
// add_action('admin_print_styles-edit.php', 'ecpt_export_datepicker_ui_styles');
// add_action('admin_print_styles-post-new.php', 'ecpt_export_datepicker_ui_styles');

if ((isset($_GET['post']) && (isset($_GET['action']) && $_GET['action'] == 'edit') ) || (strstr($_SERVER['REQUEST_URI'], 'wp-admin/post-new.php')))
{
	add_action('admin_head', 'ecpt_export_ui_scripts');
}