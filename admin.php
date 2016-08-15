<?php

add_action( 'admin_enqueue_scripts', 'wpcf7cf_admin_enqueue_scripts', 11 ); // set priority so scripts and styles get loaded later.

function wpcf7cf_admin_enqueue_scripts( $hook_suffix ) {
	wp_enqueue_style( 'contact-form-7-cf-admin', wpcf7cf_plugin_url( 'admin-style.css' ), array(), WPCF7CF_VERSION, 'all' );
	wp_enqueue_script('cf7cf-scripts-admin', wpcf7cf_plugin_url( 'js/scripts_admin.js' ),array(), WPCF7CF_VERSION,true);
}

add_filter('wpcf7_editor_panels', 'add_conditional_panel');

function add_conditional_panel($panels) {
	$panels['contitional-panel'] = array(
		'title' => __( 'Conditional fields', 'wpcf7cf' ),
		'callback' => 'wpcf7cf_editor_panel_conditional'
	);
	return $panels;
}

function all_field_options($post, $selected = '-1') {
	$all_fields = $post->form_scan_shortcode();
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

function all_group_options($post, $selected = '-1') {
	$all_groups = $post->form_scan_shortcode(array('type'=>'group'));

	?>
	<option value="-1" <?php echo $selected == '-1'?'selected':'' ?>>-- Select group --</option>
	<?php
	foreach ($all_groups as $tag) {
		?>
		<option value="<?php echo $tag['name']; ?>" <?php echo $selected == $tag['name']?'selected':'' ?>><?php echo $tag['name']; ?></option>
		<?php
	}
}

function all_operator_options($selected = 'equals') {
	$all_options = array('equals', 'not equals');
	foreach($all_options as $option) {
		?>
		<option value="<?php echo $option ?>" <?php echo $selected == $option?'selected':'' ?>><?php echo $option ?></option>
		<?php
	}
}

function all_display_options($selected = 'show') {
	$all_options = array('show', 'hide');
	foreach($all_options as $option) {
		?>
		<option value="<?php echo $option ?>" <?php echo $selected == $option?'selected':'' ?>><?php echo $option ?></option>
		<?php
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
		<select name="wpcf7cf_options[{id}][if_field]" class="if-field-select"><?php all_field_options($form); ?></select>
		<select name="wpcf7cf_options[{id}][operator]" class="operator"><?php all_operator_options(); ?></select>
		<input name="wpcf7cf_options[{id}][if_value]" class="if-value" type="text" placeholder="value">
		then
		<select name="wpcf7cf_options[{id}][then_visibility]" class="then-visibility"><?php all_display_options() ?></select>
		<select name="wpcf7cf_options[{id}][then_field]" class="then-field-select"><?php all_group_options($form); ?></select>
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
				<select name="wpcf7cf_options[<?php echo $i ?>][if_field]" class="if-field-select"><?php all_field_options($form, $entry['if_field']); ?></select>
				<select name="wpcf7cf_options[<?php echo $i ?>][operator]" class="operator"><?php all_operator_options($entry['operator']) ?></select>
				<input name="wpcf7cf_options[<?php echo $i ?>][if_value]" class="if-value" type="text" placeholder="value" value="<?php echo $entry['if_value'] ?>">
				then
				<select name="wpcf7cf_options[<?php echo $i ?>][then_visibility]" class="then-visibility"><?php all_display_options($entry['then_visibility']) ?></select>
				<select name="wpcf7cf_options[<?php echo $i ?>][then_field]" class="then-field-select"><?php all_group_options($form, $entry['then_field']); ?></select>
				<a style="display: inline-block;" href="#" title="delete rule" class="delete-button"><span class="dashicons dashicons-dismiss"></span> Remove rule</a>
			</div>
			<?php
			$i++;
		}
		?>
	</div>


	<div id="wpcf7cf-text-entries">
		<p><a href="#" id="wpcf7cf-settings-to-text">Export settings</a></p>
		<div id="wpcf7cf-settings-text-wrap">
			<textarea id="wpcf7cf-settings-text"></textarea>
			<p><a href="#" id="wpcf7cf-settings-text-clear">Clear</a></p>
		</div>
	</div>
	
	<script>
		(function($) {
			var index = $('#wpcf7cf-entries .entry').length;

			$('.delete-button').click(function(){

				//if (confirm('You sure?')===false) return false;
				$(this).parent().remove();
				return false;

			});

			$('#wpcf7cf-add-button').click(function(){
				
				// if ($('#wpcf7cf-new-entry .if-field-select').val() == '-1' || $('#wpcf7cf-new-entry .then-field-select').val() == '-1') {
					// alert('Please select 2 fields');
					// $(this).parent().remove();
					// return false;
				// } else if($('#wpcf7cf-new-entry .if-field-select').val() == $('#wpcf7cf-new-entry .then-field-select').val())  {
					// alert('The fields cannot be the same');
					// $(this).parent().remove();
					// return false;
				// }
				
				var $delete_button = $('#wpcf7cf-delete-button').clone().removeAttr('id');
				$('<div class="entry" id="entry-'+index+'">'+($('#wpcf7cf-new-entry').html().replace(/{id}/g, index))+'</div>').prependTo('#wpcf7cf-entries').append($delete_button);
				$delete_button.click(function(){

					//if (confirm('You sure?')===false) return false;
					$(this).parent().remove();
					return false;

				});
				index++;
				return false;
				
			});

			// settings to

			$('#wpcf7cf-settings-text-wrap').hide();

			$('#wpcf7cf-settings-to-text').click(function() {
				$('#wpcf7cf-settings-text-wrap').show();

				$('#wpcf7cf-settings-text').val('');
				$('#wpcf7cf-entries .entry').each(function() {
					var $entry = $(this);
					var line = 'if [' + $entry.find('.if-field-select').val() + ']'
						+ ' ' + $entry.find('.operator').val()
						+ ' "' + $entry.find('.if-value').val() + '" then '
						+ $entry.find('.then-visibility').val()
						+ ' [' + $entry.find('.then-field-select').val() + ']';
					$('#wpcf7cf-settings-text').val($('#wpcf7cf-settings-text').val() + line + "\n" ).select();
				});
				return false;
			});

			$('#wpcf7cf-settings-text-clear').click(function() {
				$('#wpcf7cf-settings-text-wrap').hide();
				$('#wpcf7cf-settings-text').val('');
				return false;
			});

		})( jQuery );
	</script>
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

	update_post_meta( $post_id, 'wpcf7cf_options', $_POST['wpcf7cf_options'] );

};

// add the action
add_action( 'wpcf7_save_contact_form', 'wpcf7cf_save_contact_form', 10, 1 );