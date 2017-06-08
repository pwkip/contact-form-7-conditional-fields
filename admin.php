<?php

add_action( 'admin_enqueue_scripts', 'wpcf7cf_admin_enqueue_scripts', 11 ); // set priority so scripts and styles get loaded later.

function wpcf7cf_admin_enqueue_scripts( $hook_suffix ) {
	if ( false === strpos( $hook_suffix, 'wpcf7' ) ) {
		return; //don't load styles and scripts if this isn't a CF7 page.
	}

	wp_enqueue_script('cf7cf-scripts-admin', wpcf7cf_plugin_url( 'js/scripts_admin.js' ),array('jquery-ui-autocomplete'), WPCF7CF_VERSION,true);
	wp_localize_script('cf7cf-scripts-admin', 'wpcf7cf_options_0', get_option(WPCF7CF_OPTIONS));

}

add_filter('wpcf7_editor_panels', 'add_conditional_panel');

function add_conditional_panel($panels) {
	$panels['contitional-panel'] = array(
		'title' => __( 'Conditional fields', 'wpcf7cf' ),
		'callback' => 'wpcf7cf_editor_panel_conditional'
	);
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
			?>
			<option value="<?php echo htmlentities($option) ?>" <?php echo $selected == $option?'selected':'' ?>><?php echo htmlentities($option) ?></option>
			<?php
		}
	}
}

function wpcf7cf_editor_panel_conditional($form) {

	$form_id = $_GET['post'];
	$wpcf7cf_entries = get_post_meta($form_id,'wpcf7cf_options',true);

	if (!is_array($wpcf7cf_entries)) $wpcf7cf_entries = array();


	?>
	<h3><?php echo esc_html( __( 'Conditional fields', 'wpcf7cf' ) ); ?></h3>


	<div id="wpcf7cf-new-entry">
		if 
		<select name="wpcf7cf_options[{id}][if_field]" class="if-field-select"><?php wpcf7cf_all_field_options($form); ?></select>
		<select name="wpcf7cf_options[{id}][operator]" class="operator"><?php all_operator_options(); ?></select>
		<input name="wpcf7cf_options[{id}][if_value]" class="if-value" type="text" placeholder="value">
		then show
		<select name="wpcf7cf_options[{id}][then_field]" class="then-field-select"><?php wpcf7cf_all_group_options($form); ?></select>
	</div>
	<a id="wpcf7cf-delete-button" class="delete-button" title="delete rule" href="#"><span class="dashicons dashicons-dismiss"></span> Remove rule</a>
	<a id="wpcf7cf-add-button" title="add new rule" href="#"><span class="dashicons dashicons-plus-alt"></span> add new conditional rule</a>
	
	<div id="wpcf7cf-entries">
		<?php
		$i = 0;
		foreach($wpcf7cf_entries as $id => $entry) {
			?>
			<div class="entry" id="entry-<?php echo $i ?>">
				if
				<select name="wpcf7cf_options[<?php echo $i ?>][if_field]" class="if-field-select"><?php wpcf7cf_all_field_options($form, $entry['if_field']); ?></select>
				<select name="wpcf7cf_options[<?php echo $i ?>][operator]" class="operator"><?php all_operator_options($entry['operator']) ?></select>
				<input name="wpcf7cf_options[<?php echo $i ?>][if_value]" class="if-value" type="text" placeholder="value" value="<?php echo $entry['if_value'] ?>">
				then show
				<select name="wpcf7cf_options[<?php echo $i ?>][then_field]" class="then-field-select"><?php wpcf7cf_all_group_options($form, $entry['then_field']); ?></select>
				<a style="display: inline-block;" href="#" title="delete rule" class="delete-button"><span class="dashicons dashicons-dismiss"></span> Remove rule</a>
			</div>
			<?php
			$i++;
		}
		?>
	</div>


	<div id="wpcf7cf-text-entries">
		<p><a href="#" id="wpcf7cf-settings-to-text">import/export</a></p>
		<div id="wpcf7cf-settings-text-wrap">
			<textarea id="wpcf7cf-settings-text"></textarea>
			<br>
			Import actions (Beta feature!):
			<input type="button" value="Add conditions" id="add-fields" >
			<input type="button" value="Overwrite conditions" id="overwrite-fields" >
			<span style="color:red"><b>WARNING</b>: If you screw something up, just reload the page without saving. If you click <em>save</em> after screwing up, you're screwed.</span>

			<p><a href="#" id="wpcf7cf-settings-text-clear">Clear</a></p>

		</div>
	</div>
<?php
}

// define the wpcf7_save_contact_form callback
function wpcf7cf_save_contact_form( $contact_form )
{
	if ( ! isset( $_POST ) || empty( $_POST ) || ! isset( $_POST['wpcf7cf_options'] ) || ! is_array( $_POST['wpcf7cf_options'] ) )
		return;
	$post_id = $contact_form->id();
	if ( ! $post_id )
		return;

	unset($_POST['wpcf7cf_options']['{id}']); // remove the dummy entry

    $options = array_values($_POST['wpcf7cf_options']);

	update_post_meta( $post_id, 'wpcf7cf_options', $options );

    return;

};

// add the action
add_action( 'wpcf7_save_contact_form', 'wpcf7cf_save_contact_form', 10, 1 );