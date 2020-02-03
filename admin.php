<?php

add_action( 'admin_enqueue_scripts', 'wpcf7cf_admin_enqueue_scripts', 11 ); // set priority so scripts and styles get loaded later.

function wpcf7cf_admin_enqueue_scripts( $hook_suffix ) {
	if ( false === strpos( $hook_suffix, 'wpcf7' ) ) {
		return; //don't load styles and scripts if this isn't a CF7 page.
	}

	wp_enqueue_script('cf7cf-scripts-admin', wpcf7cf_plugin_url( 'js/scripts_admin.js' ),array('jquery-ui-autocomplete', 'jquery-ui-sortable'), WPCF7CF_VERSION,true);
	wp_localize_script('cf7cf-scripts-admin', 'wpcf7cf_options_0', get_option(WPCF7CF_OPTIONS));

}

add_filter('wpcf7_editor_panels', 'add_conditional_panel');

function add_conditional_panel($panels) {
	if ( current_user_can( 'wpcf7_edit_contact_form' ) ) {
		$panels['wpcf7cf-conditional-panel'] = array(
			'title'    => __( 'Conditional fields', 'wpcf7cf' ),
			'callback' => 'wpcf7cf_editor_panel_conditional'
		);
	}
	return $panels;
}

function wpcf7cf_all_field_options($post, $selected = '-1') {
	$all_fields = $post->scan_form_tags();
	?>
	<option value="-1" <?php echo $selected == '-1'?'selected':'' ?>>-- Select field --</option>
	<?php
	foreach ($all_fields as $tag) {
		if ($tag['type'] == 'group' || $tag['name'] == '') continue;
		?>
		<option value="<?php echo $tag['name']; ?>" <?php echo $selected == $tag['name']?'selected':'' ?>><?php echo $tag['name']; ?></option>
		<?php
	}
}

function wpcf7cf_all_group_options($post, $selected = '-1') {
	$all_groups = $post->scan_form_tags(array('type'=>'group'));

	?>
	<option value="-1" <?php echo $selected == '-1'?'selected':'' ?>>-- Select group --</option>
	<?php
	foreach ($all_groups as $tag) {
		?>
		<option value="<?php echo $tag['name']; ?>" <?php echo $selected == $tag['name']?'selected':'' ?>><?php echo $tag['name']; ?></option>
		<?php
	}
}

if (!function_exists('all_operator_options')) {
	function all_operator_options($selected = 'equals') {
		$all_options = array('equals', 'not equals');
		$all_options = apply_filters('wpcf7cf_get_operators', $all_options);
		foreach($all_options as $option) {
			// backwards compat
			$selected = $selected == '≤' ? 'less than or equals' : $selected;
			$selected = $selected == '≥' ? 'greater than or equals' : $selected;
			$selected = $selected == '>' ? 'greater than' : $selected;
			$selected = $selected == '<' ? 'less than' : $selected;

			?>
			<option value="<?php echo htmlentities($option) ?>" <?php echo $selected == $option?'selected':'' ?>><?php echo htmlentities($option) ?></option>
			<?php
		}
	}
}

function wpcf7cf_editor_panel_conditional($form) {

	$form_id = $_GET['post'];

	$wpcf7cf_entries = CF7CF::getConditions($form_id);

	if (!is_array($wpcf7cf_entries)) $wpcf7cf_entries = array();

	$wpcf7cf_entries = array_values($wpcf7cf_entries);

	?>
    <div class="wpcf7cf-inner-container">
        <h3><?php echo esc_html( __( 'Conditional fields', 'wpcf7cf' ) ); ?></h3>

        <?php
        print_entries_html($form);
        ?>

        <div id="wpcf7cf-entries">
            <?php
            print_entries_html($form, $wpcf7cf_entries);
            ?>
		</div>
		
        <span id="wpcf7cf-add-button" title="add new rule">+ add new conditional rule</span>

        <div id="wpcf7cf-text-entries">
			<p><a href="#" id="wpcf7cf-settings-to-text">Text view</a></p>
            <div id="wpcf7cf-settings-text-wrap">
                <textarea id="wpcf7cf-settings-text" name="wpcf7cf-settings-text"></textarea>
                <br>
                <input type="button" value="Update fields">
                <p><a href="#" id="wpcf7cf-settings-text-clear">Hide</a></p>
            </div>
        </div>
    </div>
<?php
}

// duplicate conditions on duplicate form part 1.
add_filter('wpcf7_copy','wpcf7cf_copy', 10, 2);
function wpcf7cf_copy($new_form,$current_form) {

	$id = $current_form->id();
	$props = $new_form->get_properties();
	$props['messages']['wpcf7cf_copied'] = $id;
	$new_form->set_properties($props);

	return $new_form;
}

// duplicate conditions on duplicate form part 2.
add_action('wpcf7_after_save','wpcf7cf_after_save',10,1);
function wpcf7cf_after_save($contact_form) {
	$props = $contact_form->get_properties();
	$original_id = isset($props['messages']['wpcf7cf_copied']) ? $props['messages']['wpcf7cf_copied'] : 0;
	if ($original_id !== 0) {
		$post_id = $contact_form->id();
		unset($props['messages']['wpcf7cf_copied']);
		$contact_form->set_properties($props);
		CF7CF::setConditions($post_id, CF7CF::getConditions($original_id));
		return;
	}
}

// wpcf7_save_contact_form callback
add_action( 'wpcf7_save_contact_form', 'wpcf7cf_save_contact_form', 10, 1 );
function wpcf7cf_save_contact_form( $contact_form )
{

	if ( ! isset( $_POST ) || empty( $_POST ) || ! isset( $_POST['wpcf7cf-settings-text'] ) ) {
		return;
	}
	$post_id = $contact_form->id();
	if ( ! $post_id )
		return;

	// unset($_POST['wpcf7cf_options']['{id}']); // remove the dummy entry

	// TODO: only save the one import/export field.
	$conditions_string = stripslashes(sanitize_textarea_field($_POST['wpcf7cf-settings-text']));

	$conditions = CF7CF::parse_conditions($conditions_string);

	CF7CF::setConditions($post_id, $conditions);

    return;

};

function wpcf7cf_sanitize_options($options) {
    //$options = array_values($options);
    $sanitized_options = [];
    foreach ($options as $option_entry) {
	    $sanitized_option = [];
	    $sanitized_option['then_field'] = sanitize_text_field($option_entry['then_field']);
	    foreach ($option_entry['and_rules'] as $and_rule) {
		    $sanitized_option['and_rules'][] = [
		            'if_field' => sanitize_text_field($and_rule['if_field']),
		            'operator' => $and_rule['operator'],
		            'if_value' => sanitize_text_field($and_rule['if_value']),
            ];
        }

	    $sanitized_options[] = $sanitized_option;
    }
    return $sanitized_options;
}

function print_entries_html($form, $wpcf7cf_entries = false) {

    $is_dummy = !$wpcf7cf_entries;

    if ($is_dummy) {
	    $wpcf7cf_entries = array(
		    '{id}' => array(
			    'then_field' => '-1',
			    'and_rules' => array(
				    0 => array(
					    'if_field' => '-1',
					    'operator' => 'equals',
					    'if_value' => ''
				    )
			    )
		    )
	    );
    }

	foreach($wpcf7cf_entries as $i => $entry) {

		// check for backwards compatibility ( < 2.0 )
		if (!key_exists('and_rules', $wpcf7cf_entries[$i]) || !is_array($wpcf7cf_entries[$i]['and_rules'])) {
			$wpcf7cf_entries[$i]['and_rules'][0] = $wpcf7cf_entries[$i];
		}

		$and_entries = array_values($wpcf7cf_entries[$i]['and_rules']);

		if ($is_dummy) {
?>
        <div id="wpcf7cf-new-entry">
<?php
        } else {
?>
        <div class="entry" id="entry-<?php echo $i ?>">
<?php
        }
		?>
            <div class="wpcf7cf-if">
                <span class="label">Show</span>
                <select class="then-field-select"><?php wpcf7cf_all_group_options($form, $entry['then_field']); ?></select>
            </div>
            <div class="wpcf7cf-and-rules" data-next-index="<?php echo count($and_entries) ?>">
				<?php



				foreach($and_entries as $and_i => $and_entry) {
					?>
                    <div class="wpcf7cf-and-rule">
                        <span class="rule-part if-txt label">if</span>
                        <select class="rule-part if-field-select"><?php wpcf7cf_all_field_options( $form, $and_entry['if_field'] ); ?></select>
                        <select class="rule-part operator"><?php all_operator_options( $and_entry['operator'] ) ?></select>
                        <input class="rule-part if-value" type="text"
                               placeholder="value" value="<?php echo $and_entry['if_value'] ?>">
                        <span class="and-button">And</span>
                        <span title="delete rule" class="rule-part delete-button">remove</span>
                    </div>
					<?php
				}
				?>
            </div>
        </div>
		<?php
	}
}