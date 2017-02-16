<?php
/**
Plugin Name: Contact Form 7 Conditional Fields
Plugin URI: http://bdwm.be/
Description: Adds support for conditional fields to Contact Form 7. This plugin depends on Contact Form 7.
Author: Jules Colle
Version: 1.1
Author URI: http://bdwm.be/
 */

/**
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */
?>
<?php

define( 'WPCF7CF_VERSION', '1.1' );
define( 'WPCF7CF_REQUIRED_WP_VERSION', '4.1' );
define( 'WPCF7CF_PLUGIN', __FILE__ );
define( 'WPCF7CF_PLUGIN_BASENAME', plugin_basename( WPCF7CF_PLUGIN ) );
define( 'WPCF7CF_PLUGIN_NAME', trim( dirname( WPCF7CF_PLUGIN_BASENAME ), '/' ) );
define( 'WPCF7CF_PLUGIN_DIR', untrailingslashit( dirname( WPCF7CF_PLUGIN ) ) );

function wpcf7cf_plugin_path( $path = '' ) {
	return path_join( WPCF7CF_PLUGIN_DIR, trim( $path, '/' ) );
}

function wpcf7cf_plugin_url( $path = '' ) {
	$url = plugins_url( $path, WPCF7CF_PLUGIN );
	if ( is_ssl() && 'http:' == substr( $url, 0, 5 ) ) {
		$url = 'https:' . substr( $url, 5 );
	}
	return $url;
}

class ContactForm7ConditionalFields {
	private $hidden_fields = array();
	private $visible_groups = array();
	private $hidden_groups = array();

	function __construct() {

		add_action('wpcf7_enqueue_scripts', array(__CLASS__, 'enqueue_js'));
		add_action('wpcf7_enqueue_styles', array(__CLASS__, 'enqueue_css'));

		// Register shortcodes
		add_action('wpcf7_init', array(__CLASS__, 'add_shortcodes'));

		// Tag generator
		add_action('load-contact_page_wpcf7-new', array(__CLASS__, 'tag_generator'));
		add_action('load-toplevel_page_wpcf7', array(__CLASS__, 'tag_generator'));

		add_filter( 'wpcf7_posted_data', array($this, 'remove_hidden_post_data') );
		add_filter( 'wpcf7_mail_components', array($this, 'hide_hidden_mail_fields') );
		add_filter('wpcf7_additional_mail', array($this, 'hide_hidden_mail_fields_additional_mail'), 10, 2);

			//apply_filters( 'wpcf7_additional_mail',$additional_mail, $contact_form )

		add_filter( 'wpcf7_validate', array($this, 'skip_validation_for_hidden_fields'), 2, 2 );

		register_activation_hook(__FILE__, array($this, 'activate'));

		if (is_admin()) {
			require_once dirname(__FILE__) . '/admin.php';
		}
	}

	function activate() {
		//add options with add_option and stuff
	}

	public static function enqueue_js() {
		// nothing here. We will only load the CF7 script if there is a CF7 form on the page.
	}

	public static function enqueue_css() {
		wp_enqueue_style('cf7cf-style', plugins_url('style.css', __FILE__), array(), WPCF7CF_VERSION);
	}

	public static function add_shortcodes() {
		//wpcf7_add_shortcode('group', array(__CLASS__, 'shortcode_handler'), true);
		//add_shortcode( 'group', array(__CLASS__, 'group_shortcode_handler') );
		if (function_exists('wpcf7_add_form_tag'))
			wpcf7_add_form_tag('group', array(__CLASS__, 'shortcode_handler'), true);
		else if (function_exists('wpcf7_add_shortcode')) {
			wpcf7_add_shortcode('group', array(__CLASS__, 'shortcode_handler'), true);
		} else {
			throw new Exception('functions wpcf7_add_form_tag and wpcf7_add_shortcode not found.');
		}
	}

	function group_shortcode_handler( $atts, $content = "" ) {
		return $content;
	}

	function shortcode_handler($tag) {
		//$tag = new WPCF7_Shortcode($tag);
		$tag = new WPCF7_FormTag($tag);
		//ob_start();
		//print_r($tag);
		//return print_r($tag, true);
		return $tag->content;
	}


	public static function tag_generator() {
		if (! function_exists( 'wpcf7_add_tag_generator'))
			return;

		wpcf7_add_tag_generator('group',
			__('Conditional fields Group', 'wpcf7cf'),
			'wpcf7-tg-pane-group',
			array(__CLASS__, 'tg_pane')
		);
	}

	static function tg_pane( $contact_form, $args = '' ) {
		$args = wp_parse_args( $args, array() );
		$type = 'group';

		$description = __( "Generate a group tag to group form elements that can be shown conditionally.", 'cf7cf' );

		?>
		<div class="control-box">
			<fieldset>
				<legend><?php echo sprintf( esc_html( $description ) ); ?></legend>

				<table class="form-table">
					<tbody>

					<tr>
						<th scope="row"><label for="<?php echo esc_attr( $args['content'] . '-name' ); ?>"><?php echo esc_html( __( 'Name', 'contact-form-7' ) ); ?></label></th>
						<td><input type="text" name="name" class="tg-name oneline" id="<?php echo esc_attr( $args['content'] . '-name' ); ?>" /></td>
					</tr>

					</tbody>
				</table>
			</fieldset>
		</div>

		<div class="insert-box">
			<input type="text" name="<?php echo $type; ?>" class="tag code" readonly="readonly" onfocus="this.select()" />

			<div class="submitbox">
				<input type="button" class="button button-primary insert-tag" value="<?php echo esc_attr( __( 'Insert Tag', 'contact-form-7' ) ); ?>" />
			</div>

			<br class="clear" />
		</div>
		<?php
	}

	/**
	 * Remove validation requirements for fields that are hidden at the time of form submission.
	 * Called using add_filter( 'wpcf7_validate_[tag_type]', array($this, 'skip_validation_for_hidden_fields'), 2, 2 );
	 * where the priority of 2 causes this to kill any validations with a priority higher than 2
	 *
	 * @param $result
	 * @param $tag
	 *
	 * @return mixed
	 */
	function skip_validation_for_hidden_fields($result, $tags) {

		if (count($this->hidden_fields) == 0) return $result;

		$return_result = new WPCF7_Validation();

		$invalid_fields = $result->get_invalid_fields();

		if (!is_array($invalid_fields) || count($invalid_fields) == 0) return $result;

		foreach ($invalid_fields as $invalid_field_key => $invalid_field_data) {
			if (!in_array($invalid_field_key, $this->hidden_fields)) {
				// the invalid field is not a hidden field, so we'll add it to the final validation result
				$return_result->invalidate($invalid_field_key, $invalid_field_data['reason']);
			}
		}

		return $return_result;
	}


	/**
	 * When a CF7 form is posted, check the form for hidden fields, then remove those fields from the post data
	 *
	 * @param $posted_data
	 *
	 * @return mixed
	 */
	function remove_hidden_post_data($posted_data) {
		$this->set_hidden_fields_arrays($posted_data);

		foreach( $this->hidden_fields as $name => $value ) {
			unset( $posted_data[$name] );
		}

		return $posted_data;
	}


	/**
	 * Finds the currently submitted form and set the hidden_fields variables accoringly
	 *
	 * @param bool|array $posted_data
	 */
	function set_hidden_fields_arrays($posted_data = false) {

		if (!$posted_data) {
			$posted_data = WPCF7_Submission::get_instance()->get_posted_data();
		}

		$hidden_fields = json_decode(stripslashes($posted_data['_wpcf7cf_hidden_group_fields']));
		if (!is_array($hidden_fields) || count($hidden_fields) == 0) return;
		foreach ($hidden_fields as $field) {
			$this->hidden_fields[] = $field;
			if (wpcf7cf_endswith($field, '[]')) {
				$this->hidden_fields[] = substr($field,0,strlen($field)-2);
			}
		}
		$this->hidden_groups = json_decode(stripslashes($posted_data['_wpcf7cf_hidden_groups']));
		$this->visible_groups = json_decode(stripslashes($posted_data['_wpcf7cf_visible_groups']));
	}

	function hide_hidden_mail_fields( $components ) {
		$regex = '@\[[\t ]*([a-zA-Z_][0-9a-zA-Z:._-]*)[\t ]*\](.*?)\[[\t ]*/[\t ]*\1[\t ]*\]@s';
		// [1] = name [2] = contents

		$components['body'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $components['body'] );
		$components['subject'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $components['subject'] );
		$components['sender'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $components['sender'] );
		$components['recipient'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $components['recipient'] );
		$components['additional_headers'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $components['additional_headers'] );

		return $components;
	}

	function hide_hidden_mail_fields_additional_mail($additional_mail, $contact_form) {

		if (!is_array($additional_mail) || !array_key_exists('mail_2', $additional_mail)) return $additional_mail;

		$regex = '@\[[\t ]*([a-zA-Z_][0-9a-zA-Z:._-]*)[\t ]*\](.*?)\[[\t ]*/[\t ]*\1[\t ]*\]@s';

		$additional_mail['mail_2']['body'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $additional_mail['mail_2']['body'] );
		$additional_mail['mail_2']['subject'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $additional_mail['mail_2']['subject'] );
		$additional_mail['mail_2']['sender'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $additional_mail['mail_2']['sender'] );
		$additional_mail['mail_2']['recipient'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $additional_mail['mail_2']['recipient'] );
		$additional_mail['mail_2']['additional_headers'] = preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $additional_mail['mail_2']['additional_headers'] );

		return $additional_mail;
	}

	function hide_hidden_mail_fields_regex_callback ( $matches ) {
		$name = $matches[1];
		$content = $matches[2];
		if ( in_array( $name, $this->hidden_groups ) ) {
			// The tag name represents a hidden group, so replace everything from [tagname] to [/tagname] with nothing
			return '';
		} elseif ( in_array( $name, $this->visible_groups ) ) {
			// The tag name represents a visible group, so remove the tags themselves, but return everything else
			//return $content;
			$regex = '@\[[\t ]*([a-zA-Z_][0-9a-zA-Z:._-]*)[\t ]*\](.*?)\[[\t ]*/[\t ]*\1[\t ]*\]@s';

			// instead of just returning the $content, return the preg_replaced content :)
			return preg_replace_callback($regex, array($this, 'hide_hidden_mail_fields_regex_callback'), $content );
		} else {
			// The tag name doesn't represent a group that was used in the form. Leave it alone (return the entire match).
			return $matches[0];
		}
	}
}

new ContactForm7ConditionalFields;

add_filter( 'wpcf7_contact_form_properties', 'wpcf7cf_properties', 10, 2 );

function wpcf7cf_properties($properties, $wpcf7form) {
	if (!is_admin()) { // TODO: kind of hacky. maybe find a better solution. Needed because otherwise the group tags will be replaced in the editor as well.
		$form = $properties['form'];

		$find = array(
			'/\[group\s*\]/s', // matches [group    ] or [group]
			'/\[group\s+([^\s\]]*)\s*([^\]]*)\]/s', // matches [group something some:thing] or [group   something  som   ]
			// doesn't match [group-special something]
			'/\[\/group\]/s'
		);

		$replace = array(
			'<div data-class="wpcf7cf_group">',
			'<div id="$1" data-class="wpcf7cf_group">',
			'</div>'
		);

		$form = preg_replace( $find, $replace, $form );

		$properties['form'] = $form;
	}
	return $properties;
}

$global_count = 0;

add_action('wpcf7_contact_form', 'wpcf7cf_enqueue_scripts', 10, 1);
function wpcf7cf_enqueue_scripts(WPCF7_ContactForm $cf7form) {

	if (is_admin()) return;

	global $global_count, $post;
	$global_count++;

	if ( in_the_loop() ) {
		$unit_tag = 'wpcf7-f'.$cf7form->id().'-p'.$post->ID.'-o'.$global_count;
	} else {
		$unit_tag = 'wpcf7-f'.$cf7form->id().'-o'.$global_count;
	}

	$options = array(
		'form_id' => $cf7form->id(),
		'unit_tag' => $unit_tag,
		'conditions' => get_post_meta($cf7form->id(),'wpcf7cf_options', true),
	);

	wp_enqueue_script('cf7cf-scripts', plugins_url('js/scripts.js', __FILE__), array('jquery'), WPCF7CF_VERSION, true);
	wp_localize_script('cf7cf-scripts', 'wpcf7cf_options_'.$global_count, $options);
}

add_action('wpcf7_form_hidden_fields', 'wpcf7cf_form_hidden_fields',10,1);

function wpcf7cf_form_hidden_fields($hidden_fields) {
	return array('_wpcf7cf_hidden_group_fields' => '', '_wpcf7cf_hidden_groups' => '', '_wpcf7cf_visible_groups' => '');
}

function wpcf7cf_endswith($string, $test) {
	$strlen = strlen($string);
	$testlen = strlen($test);
	if ($testlen > $strlen) return false;
	return substr_compare($string, $test, $strlen - $testlen, $testlen) === 0;
}