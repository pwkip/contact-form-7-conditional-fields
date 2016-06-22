<?php
/**
Plugin Name: Contact Form 7 Conditional Fields
Plugin URI: http://bdwm.be/
Description: Adds support for conditional fields to Contact Form 7. This plugin depends on Contact Form 7.
Author: Jules Colle
Version: 0.1.5
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

define( 'WPCF7CF_VERSION', '0.1.5' );
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

	function __construct() {

		add_action('wpcf7_enqueue_scripts', array(__CLASS__, 'enqueue_js'));
		add_action('wpcf7_enqueue_styles', array(__CLASS__, 'enqueue_css'));

		// Register shortcodes
		add_action('wpcf7_init', array(__CLASS__, 'add_shortcodes'));

		// Tag generator
		add_action('load-contact_page_wpcf7-new', array(__CLASS__, 'tag_generator'));
		add_action('load-toplevel_page_wpcf7', array(__CLASS__, 'tag_generator'));

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

		wp_enqueue_style('cf7cf-style', plugins_url('style.css', __FILE__));
	}

	public static function add_shortcodes() {
		wpcf7_add_shortcode('group', array(__CLASS__, 'shortcode_handler'), true);
		//add_shortcode( 'group', array(__CLASS__, 'group_shortcode_handler') );
	}

	function group_shortcode_handler( $atts, $content = "" ) {
		return $content;
	}

	function shortcode_handler($tag) {
		$tag = new WPCF7_Shortcode($tag);
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

	function tg_pane( $contact_form, $args = '' ) {
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
}

new ContactForm7ConditionalFields;

add_filter( 'wpcf7_contact_form_properties', 'wpcf7cf_properties', 10, 2 );

function wpcf7cf_properties($properties, $wpcf7form) {
	if (!is_admin()) { // TODO: kind of hacky. maybe find a better solution. Needed because otherwise the group tags will be replaced in the editor aswell.
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
function wpcf7cf_enqueue_scripts($cf7form) {
	global $global_count, $post;
	$global_count++;

	$unit_tag = 'wpcf7-f'.$cf7form->id().'-p'.$post->ID.'-o'.$global_count;

	$options = array(
		'form_id' => $cf7form->id(),
		'unit_tag' => $unit_tag,
		'conditions' => get_post_meta($cf7form->id(),'wpcf7cf_options', true),
	);

	wp_enqueue_script('cf7cf-scripts', plugins_url('js/scripts.js', __FILE__), array('jquery'), WPCF7CF_VERSION, true);
	wp_localize_script('cf7cf-scripts', 'wpcf7cf_options_'.$global_count, $options);
}