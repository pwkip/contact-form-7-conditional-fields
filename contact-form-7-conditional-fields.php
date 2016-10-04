<?php
/**
Plugin Name: Contact Form 7 Conditional Fields
Plugin URI: http://bdwm.be/
Description: Adds support for conditional fields to Contact Form 7. This plugin depends on Contact Form 7.
Author: Jules Colle
Version: 0.1.6
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

define( 'WPCF7CF_VERSION', '0.1.7' );
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

	if (is_admin()) return;

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

/**
 * Remove validation requirements for fields that are hidden at the time of form submission.
 * Called using add_filter( 'wpcf7_validate_[tag_type]', 'wpcf7cf_skip_validation_for_hidden_fields', 2, 2 );
 * where the priority of 2
 */
function wpcf7cf_skip_validation_for_hidden_fields($result, $tag) {
	global $wp_filter;
	$hidden_fields = wpcf7cf_get_hidden_fields();

	// If this field is hidden, skip the rest of the validation hooks
	if( in_array($tag['name'], $hidden_fields) ) {
		// end() skips to the end of the $wp_filter array, effectively skipping any filters with a priority
		// lower than whatever priority this function was given.
		// In our case, this means that a hidden field won't be marked as "Invalid", regardless of its contents
		// unless it's done by a filter of priority 1 or 2
		end( $wp_filter[ current_filter() ] );
	}

	return $result;
}


add_filter( 'wpcf7_posted_data', 'wpcf7cf_remove_hidden_post_data' );
/**
 * When a CF7 form is posted, check the form for hidden fields, then remove those fields from the post data
 */
function wpcf7cf_remove_hidden_post_data($posted_data) {
	$hidden_fields = wpcf7cf_get_hidden_fields($posted_data);

	foreach( $hidden_fields as $name => $value ) {
		unset( $posted_data[$name] );
	}
	return $posted_data;
}


/**
 * Finds the currently submitted form and returns an array of fields that are hidden and should be ignored
 *
 * @param bool|array $posted_data
 * @return mixed
 */
function wpcf7cf_get_hidden_fields($posted_data = false) {
	if ( isset( $posted_data['_wpcf7'] ) ) {
		// When called by wpcf7cf_remove_hidden_post_data() and $posted_data is available
		$form_id = $posted_data['_wpcf7'];
	} else {
		// When called from wpcf7cf_skip_validation_for_hidden_fields(), use WPCF7_Submission object to get form id
		$form_id = WPCF7_Submission::get_instance()->get_posted_data( '_wpcf7' );
	}

	// We only need to run through this once, so check to see if the global variable exists.
	if ( ! isset( $GLOBALS['wpcf7cf_hidden_fields'][$form_id] ) ) {
		// Get the WPCF7_ContactForm object for this form
		$contact_form = WPCF7_ContactForm::get_instance( $form_id );

		// While we have the contact form object, find all used tags so we can add our validation filter
		foreach( (array) $contact_form->form_scan_shortcode() as $tag ) {
			//Priority of 2 allows other filters at priority 1 or 2 to actually validate hidden fields (just in case)
			add_filter( 'wpcf7_validate_' . $tag['type'], 'wpcf7cf_skip_validation_for_hidden_fields', 2, 2 );
		}

		// Get the form properties so we have access to the form itself
		$form_properties = $contact_form->get_properties();

		//Find out which tags are in which groups
		$dom = new DOMDocument();
		$dom->loadHTML($form_properties['form']);
		$divs = $dom->getElementsByTagName('div');
		$groups = array();
		foreach ($divs as $div) {
			$is_group = false;
			foreach($div->attributes as $attribute) {
				if ( 'data-class' == $attribute->name && 'wpcf7cf_group' == $attribute->value ) {
					// Group divs will have a data-class of wpcf7cf_group
					$is_group = true;
				}
				if ( 'id' == $attribute->name ) {
					$id = $attribute->value;
				}
			}
			if ( $is_group ) {
				// Match all tag names (format = [tag_type tag_name] or [tag_type tag_name options values etc...])
				preg_match_all("/\[[^\s\]]* ([^\s\]]*)[^\]]*\]/", $div->textContent, $matches);
				foreach( $matches[1] as $tag ) {
					$groups[$id][] = $tag;
				}
			}
		}
		// $groups is now an array of groups (by id) with an array of the name of each tag that is inside that group.

		// Groups are hidden by default. Find all the visible ones and mark them.
		// This is a duplicate of the logic in js/scripts.js and needs to be included
		// so our verification is done server-side. If we ran this verification in
		// javascript, then all the form's normal validation could be overridden.
		//
		// Unfortunately, separate javascript and php validation is probably necessary since to use only php
		// would mean that every onChange() would require an ajax call, and that'd get too slow.
		$visible_groups = array();
		$conditions = get_post_meta($form_id,'wpcf7cf_options', true);
		foreach( $conditions as $condition ) {
			if ( $condition['then_visibility'] == 'show' ) {
				if ( is_array($posted_data[ $condition['if_field'] ]) ) {
					if ( 'not equals' == $condition['operator'] && ! in_array( $condition['if_value'], $posted_data[ $condition['if_field'] ] ) ) {
						$visible_groups[] = $condition['then_field'];
					} elseif ( 'equals' == $condition['operator'] && in_array( $condition['if_value'], $posted_data[ $condition['if_field'] ] ) ) {
						$visible_groups[] = $condition['then_field'];
					}
				} else {
					if ( 'not equals' == $condition['operator'] && $condition['if_value'] != $posted_data[ $condition['if_field'] ] ) {
						$visible_groups[] = $condition['then_field'];
					} elseif ( 'equals' == $condition['operator'] && $condition['if_value'] == $posted_data[ $condition['if_field'] ] ) {
						$visible_groups[] = $condition['then_field'];
					}
				}
			}
		}

		$GLOBALS['wpcf7cf_hidden_fields'][$form_id] = array();
		// Iterate through the groups.
		// When we find one that's not in the $visible_groups array, add its tags to our list of hidden tags
		foreach( $groups as $group => $fields ) {
			if ( ! in_array($group, $visible_groups) ) {
				$GLOBALS['wpcf7cf_hidden_fields'][$form_id] = array_merge($GLOBALS['wpcf7cf_hidden_fields'][$form_id], $fields);
			}
		}


	}
	return $GLOBALS['wpcf7cf_hidden_fields'][$form_id];
}
