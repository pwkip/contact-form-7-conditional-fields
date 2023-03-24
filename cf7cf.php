<?php

class CF7CF {
    private $hidden_fields = array();
    private $visible_groups = array();
    private $hidden_groups = array();
    private $repeaters = array();

    function __construct() {

        // Register shortcodes
        add_action('wpcf7_init', array(__CLASS__, 'add_shortcodes'));

        // Tag generator
        add_action('admin_init', array(__CLASS__, 'tag_generator'), 590);

        // compatibility with CF7 multi-step forms by Webhead LLC.
        add_filter( 'wpcf7_posted_data', array($this,'cf7msm_merge_post_with_cookie'), 8, 1 );

        // compatibility with CF7 Multi Step by NinjaTeam https://wordpress.org/plugins/cf7-multi-step/
        add_action('wp_ajax_cf7mls_validation', array($this,'cf7mls_validation_callback'),9);
        add_action('wp_ajax_nopriv_cf7mls_validation', array($this,'cf7mls_validation_callback'),9);

        add_filter( 'wpcf7_validate', array($this, 'skip_validation_for_hidden_fields'), 2, 2 );

        add_filter( 'wpcf7_validate_file*', array($this, 'skip_validation_for_hidden_file_field'), 30, 3);
        add_filter( 'wpcf7_validate_multifile*', array($this, 'skip_validation_for_hidden_file_field'), 30, 3);

        // If acceptance_as_validation is on, then Acceptance fields inside hidden groups should not trigger an error
        add_filter( 'wpcf7_acceptance', function($accepted, $submission) {
            $acceptance_as_validation = $submission->get_contact_form()->additional_setting('acceptance_as_validation');
            return $accepted || (is_array($acceptance_as_validation) && in_array('on', $acceptance_as_validation));
        }, 20, 2 );

	    // validation messages
	    add_action('wpcf7_config_validator_validate', array($this,'wpcf7cf_config_validator_validate'));

	    add_action("wpcf7_before_send_mail", [$this, 'hide_hidden_mail_fields'], 10, 3);

        register_activation_hook(__FILE__, array($this, 'activate'));

        if (is_admin()) {
            require_once dirname(__FILE__) . '/admin.php';
        }
    }



	/**
	 * Suppress invalid mailbox syntax errors on fields that contain existing conditional
	 */
    function wpcf7cf_config_validator_validate(WPCF7_ConfigValidator $wpcf7_config_validator) {

    	// TODO: For now we kill every syntax error once a [groupname] tag is detected.
	    //       Ideally, this function should check each string inside the group for invalid syntax.
	    // TODO 2: ajax validation not working yet, because $cf->scan_form_tags() does not seem to contain group tags if it's an ajax request. Need to investigate.

	    $cf = $wpcf7_config_validator->contact_form();
	    $all_group_tags = $cf->scan_form_tags();

    	foreach ($wpcf7_config_validator->collect_error_messages() as $err_type => $err) {

//    	    print_r($err_type);

		    $parts = explode('.',$err_type);

		    $property = $parts[0];

		    if ($property == 'form') continue; // the 'form' field can be safely validated by CF7. No need to suppress it.

		    $sub_prop = $parts[1];
		    $prop_val = $cf->prop($property)[$sub_prop];


		    // TODO 2: Dirty hack. Because of TODO 2 we are just going to kill the error message if we detect the string '[/'
		    //         Start removing here.
		    if (strpos($prop_val, '[/') !== false) {
			    $wpcf7_config_validator->remove_error($err_type, WPCF7_ConfigValidator::error_invalid_mailbox_syntax);
				continue;
		    }
		    // TODO 2: Stop removing here. and uncomment code below.

//		    foreach ($all_group_tags as $form_tag) {
//				if (strpos($prop_val, '['.$form_tag->name.']') !== false) {
//					$wpcf7_config_validator->remove_error($err_type, WPCF7_ConfigValidator::error_invalid_mailbox_syntax);
//				}
//		    }

	    }

    	return new WPCF7_ConfigValidator($wpcf7_config_validator->contact_form());
    }

    function activate() {
        //add options with add_option and stuff
    }

    public static function add_shortcodes() {
        if (function_exists('wpcf7_add_form_tag'))
            wpcf7_add_form_tag('group', array(__CLASS__, 'shortcode_handler'), true);
        else if (function_exists('wpcf7_add_shortcode')) {
            wpcf7_add_shortcode('group', array(__CLASS__, 'shortcode_handler'), true);
        } else {
            throw new Exception('functions wpcf7_add_form_tag and wpcf7_add_shortcode not found.');
        }
    }

    // TODO: check if we can remove this function. Doesn't seem to be called.
    function group_shortcode_handler( $atts, $content = "" ) {
        return $content;
    }

    // TODO: check if we can remove this function. Doesn't seem to be called.
    public static function shortcode_handler($tag) {
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
            __('Conditional Fields Group', 'cf7-conditional-fields'),
            'wpcf7-tg-pane-group',
            array(__CLASS__, 'tg_pane')
        );

        do_action('wpcf7cf_tag_generator');
    }

    static function tg_pane( $contact_form, $args = '' ) {
        $args = wp_parse_args( $args, array() );
        $type = 'group';

        $description = __( "Generate a group tag to group form elements that can be shown conditionally.", 'cf7-conditional-fields' );

        include 'tg_pane_group.php';
    }

    /**
     * Remove validation requirements for fields that are hidden at the time of form submission.
     * Required/invalid fields should never trigger validation errors if they are inside a hidden group during submission.
     * Called using add_filter( 'wpcf7_validate', array($this, 'skip_validation_for_hidden_fields'), 2, 2 );
     * where the priority of 2 causes this to kill any validations with a priority higher than 2
     * 
     * NOTE: CF7 is weirdly designed when it comes to validating a form with files.
     *       Only the non-file fields are considered during the wpcf7_validate filter.
     *       When validation passes for all fields (except the file fields), the files fields are validated individually.
     *       ( see skip_validation_for_hidden_file_field )
     *
     * @param $result
     * @param $tag
     *
     * @return mixed
     */
    function skip_validation_for_hidden_fields($result, $tags, $args = []) {

        if(isset($_POST)) {
            $this->set_hidden_fields_arrays($_POST);
        }

        $invalid_fields = $result->get_invalid_fields();
        $return_result = new WPCF7_Validation();

        if (count($this->hidden_fields) == 0 || !is_array($invalid_fields) || count($invalid_fields) == 0) {
            $return_result = $result;
        } else {
            foreach ($invalid_fields as $invalid_field_key => $invalid_field_data) {
                if (!in_array($invalid_field_key, $this->hidden_fields)) {
                    foreach ($tags as $tag) {
                        if ($tag['name'] === $invalid_field_key) {
                           $return_result->invalidate($tag, $invalid_field_data['reason']);
                        }
                    }
                }
            }
        }

        return apply_filters('wpcf7cf_validate', $return_result, $tags);

    }

    /**
     * Does the same thing as skip_validation_for_hidden_fields, but CF7 will check files again later
     * via the wpcf7_unship_uploaded_files function
     * so we need to skip validation a second time for individual file fields
     */
    function skip_validation_for_hidden_file_field($result, $tag, $args=[]) {

        if (!count($result->get_invalid_fields())) {
            return $result;
        }
        if(isset($_POST)) {
            $this->set_hidden_fields_arrays($_POST);
        }

        $invalid_field_keys = array_keys($result->get_invalid_fields());

        // if the current file is the only invalid tag in the result AND if the file is hidden: return a valid (blank) object
        if (isset($this->hidden_fields) && is_array($this->hidden_fields) && in_array($tag->name, $this->hidden_fields) && count($invalid_field_keys) == 1) {
            return new WPCF7_Validation();
        }

        // if the current file is not hidden, we'll just return the result (keep it invalid).
        // (Note that this might also return the hidden files as invalid, but that shouldn't matter because the form is invalid, and the notification will be inside a hidden group)
        return $result;
    }

    function cf7msm_merge_post_with_cookie($posted_data) {

        if (!function_exists('cf7msm_get') || !key_exists('cf7msm_posted_data',$_COOKIE)) return $posted_data;

        if (!$posted_data) {
            $posted_data = WPCF7_Submission::get_instance()->get_posted_data();
        }

        // this will temporarily set the hidden fields data to the posted_data.
        // later this function will be called again with the updated posted_data
        $this->set_hidden_fields_arrays($_POST);

        // get cookie data
        $cookie_data = cf7msm_get('cf7msm_posted_data');
        $cookie_data_hidden_group_fields = json_decode(stripslashes($cookie_data['_wpcf7cf_hidden_group_fields']));
        $cookie_data_hidden_groups = json_decode(stripslashes($cookie_data['_wpcf7cf_hidden_groups']));
        $cookie_data_visible_groups = json_decode(stripslashes($cookie_data['_wpcf7cf_visible_groups']));

        // remove all the currently posted data from the cookie data (we don't wanna add it twice)
        $cookie_data_hidden_group_fields = array_diff($cookie_data_hidden_group_fields, array_keys($posted_data));
        $cookie_data_hidden_groups = array_diff((array) $cookie_data_hidden_groups, $this->hidden_groups, $this->visible_groups);
        $cookie_data_visible_groups = array_diff((array) $cookie_data_visible_groups, $this->hidden_groups, $this->visible_groups);

        // update current post data with cookie data
        $posted_data['_wpcf7cf_hidden_group_fields'] = addslashes(json_encode(array_merge((array) $cookie_data_hidden_group_fields, $this->hidden_fields)));
        $posted_data['_wpcf7cf_hidden_groups'] = addslashes(json_encode(array_merge((array) $cookie_data_hidden_groups, $this->hidden_groups)));
        $posted_data['_wpcf7cf_visible_groups'] = addslashes(json_encode(array_merge((array) $cookie_data_visible_groups, $this->visible_groups)));

        return $posted_data;
    }

    // compatibility with CF7 Multi Step by NinjaTeam https://wordpress.org/plugins/cf7-multi-step/
    function cf7mls_validation_callback() {
        $this->set_hidden_fields_arrays($_POST);
    }

    /**
     * Finds the currently submitted form and set the hidden_fields variables accoringly
     *
     * @param bool|array $posted_data
     */
    function set_hidden_fields_arrays($posted_data = false) {

        if (!$posted_data) $posted_data = $_POST;

        $hidden_fields = json_decode(stripslashes($posted_data['_wpcf7cf_hidden_group_fields']));
        if (is_array($hidden_fields) && count($hidden_fields) > 0) {
            foreach ($hidden_fields as $field) {
                $this->hidden_fields[] = $field;
                if (wpcf7cf_endswith($field, '[]')) {
                    $this->hidden_fields[] = substr($field,0,strlen($field)-2);
                }
            }
        }
        $this->hidden_groups = json_decode(stripslashes($posted_data['_wpcf7cf_hidden_groups']));
        $this->visible_groups = json_decode(stripslashes($posted_data['_wpcf7cf_visible_groups']));
        $this->repeaters = json_decode(stripslashes($posted_data['_wpcf7cf_repeaters']));
        $this->steps = json_decode(stripslashes($posted_data['_wpcf7cf_steps']));
    }

	function hide_hidden_mail_fields($form,$abort,$submission) {
		$props = $form->get_properties();
		$mails = ['mail','mail_2','messages'];
		foreach ($mails as $mail) {
            if (!is_array($props[$mail])) { continue; }
			foreach ($props[$mail] as $key=>$val) {

                // remove unwanted whitespace between closing and opening groups from email
                $count = 1;
                while ($count) {
                    $val = preg_replace(WPCF7CF_REGEX_MAIL_UNWANTED_WHITESPACE, '$1$2', $val, -1, $count);
                }

                // remove hiddden groups from email
                $parser = new Wpcf7cfMailParser($val, $this->visible_groups, $this->hidden_groups, $this->repeaters, $_POST);
				$props[$mail][$key] = $parser->getParsedMail();
            }
        }


        //$props['mail']['body'] = 'xxx';
		$form->set_properties($props);
	}

    function hide_hidden_mail_fields_regex_callback ( $matches ) {
        $name = $matches[1];
        $content = $matches[2];
        if ( in_array( $name, $this->hidden_groups ) ) {
            // The tag name represents a hidden group, so replace everything from [tagname] to [/tagname] with nothing
            return '';
        } elseif ( in_array( $name, $this->visible_groups ) ) {
            // The tag name represents a visible group, so remove the tags themselves, but return everything else
            // instead of just returning the $content, return the preg_replaced content :)
            return preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP, array($this, 'hide_hidden_mail_fields_regex_callback'), $content );
        } else {
            // The tag name doesn't represent a group that was used in the form. Leave it alone (return the entire match).
            return $matches[0];
        }
    }

    public static function parse_conditions($string, $format='array') {
        // Parse stuff like "show [g1] if [field] equals 2" to Array

        preg_match_all(WPCF7CF_REGEX_CONDITIONS, $string, $matches);

        $conditions = [];

        $prev_then_field = '';
        foreach ($matches[0] as $i=>$line) {
            $then_field = $matches[1][$i];
            $if_field   = $matches[2][$i];
            $operator   = $matches[3][$i];
            $if_value   = $matches[4][$i];

            $index = count($conditions);

            if ($then_field == '') {
                $index = $index -1;
                $then_field = $prev_then_field;
            } else {
                $conditions[$index]['then_field'] = $then_field;
            }

            $conditions[$index]['and_rules'][] = [
                'if_field' => $if_field,
                'operator' => $operator,
                'if_value' => $if_value,
            ];

            $prev_then_field = $then_field;

        }

        $conditions = array_values($conditions);

        if ($format == 'array') {
            return $conditions;
        } else if ($format == 'json') {
            return json_encode($conditions);
        }
    }

    /**
     * load the conditions from the form's post_meta
     *
     * @param string $form_id
     * @return array
     */
    public static function getConditions($form_id) {
        // make sure conditions are an array.
        $options = get_post_meta($form_id,'wpcf7cf_options',true);
        return is_array($options) ? $options : array(); // the meta key 'wpcf7cf_options' is a bit misleading at this point, because it only holds the form's conditions, no other options/settings
    }

    /**
     * load the conditions from the form's post_meta as plain text
     *
     * @param string $form_id
     * @return void
     */
    public static function getConditionsPlainText($form_id) {
        return CF7CF::serializeConditions(CF7CF::getConditions($form_id));
    }

    public static function serializeConditions($array) {

        $lines = [];

        foreach ($array as $entry) {
            $then_field = $entry['then_field'];
            $and_rules = $entry['and_rules'];
            $indent = strlen($then_field) + 4;
            foreach ($and_rules as $i => $rule) {
                $if_field = $rule['if_field'];
                $operator = $rule['operator'];
                $if_value = $rule['if_value'];

                if ($i == 0) {
                    $lines[] = "show [$then_field] if [$if_field] $operator \"$if_value\"";
                } else {
                    $lines[] = str_repeat(' ',$indent)."and if [$if_field] $operator \"$if_value\"";
                }
            }
        }
        
        return implode("\n", $lines);
    }
    
    /**
     * save the conditions to the form's post_meta
     *
     * @param string $form_id
     * @return void
     */
    public static function setConditions($form_id, $conditions) {
        return update_post_meta($form_id,'wpcf7cf_options',$conditions); // the meta key 'wpcf7cf_options' is a bit misleading at this point, because it only holds the form's conditions, no other options/settings
    }
}

new CF7CF;

add_filter( 'wpcf7_contact_form_properties', 'wpcf7cf_properties', 10, 2 );

function wpcf7cf_properties($properties, $wpcf7form) {
	// Before CF7 5.5.3, this function was called each time we call get_properties() on a contact form. Since CF7 5.5.3 this function is called only once in the WPCF7_ContactForm
	if (!is_admin() || (defined('DOING_AJAX') && DOING_AJAX)) { // TODO: kind of hacky. maybe find a better solution. Needed because otherwise the group tags will be replaced in the editor as well.
        $form = $properties['form'];

	    $form_parts = preg_split('/(\[\/?group(?:\]|\s.*?\]))/',$form, -1,PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

	    ob_start();

	    $stack = array();

	    foreach ($form_parts as $form_part) {
	    	if (substr($form_part,0,7) == '[group ') {
	    		$tag_parts = explode(' ',rtrim($form_part,']'));

	    		array_shift($tag_parts);

	    		$tag_id = $tag_parts[0];
	    		$tag_html_type = 'div';
	    		$tag_html_data = array();

	    		foreach ($tag_parts as $i => $tag_part) {
                    if ($i==0) continue;
                    $tag_part = explode(':',$tag_part);
					if ($tag_part[0] == 'inline') $tag_html_type = 'span';
					else if ($tag_part[0] == 'clear_on_hide') $tag_html_data[] = 'data-clear_on_hide';
					else if ($tag_part[0] == 'disable_on_hide' && WPCF7CF_IS_PRO) $tag_html_data[] = 'data-disable_on_hide';
                    else if ($tag_part[0] == 'class') $tag_html_data[] = 'class="'.($tag_part[1]??'').'"';
			    }

			    array_push($stack,$tag_html_type);

			    echo '<'.$tag_html_type.' data-id="'.$tag_id.'" data-orig_data_id="'.$tag_id.'" '.implode(' ',$tag_html_data).' data-class="wpcf7cf_group">';
		    } else if ($form_part == '[/group]') {
	    		echo '</'.array_pop($stack).'>';
		    } else {
	    		echo $form_part;
		    }
	    }

        $properties['form'] = ob_get_clean();
    }
    return $properties;
}

add_filter('wpcf7_form_hidden_fields', 'wpcf7cf_form_hidden_fields',10,1);

function wpcf7cf_form_hidden_fields($hidden_fields) {

    $current_form = wpcf7_get_current_contact_form();
    $current_form_id = $current_form->id();

    $options = array(
        'form_id' => $current_form_id,
        'conditions' => CF7CF::getConditions($current_form_id),
        'settings' => wpcf7cf_get_settings()
    );

    unset($options['settings']['license_key']); // don't show license key in the source code duh.

	return array_merge($hidden_fields, array(
        '_wpcf7cf_hidden_group_fields' => '[]',
        '_wpcf7cf_hidden_groups' => '[]',
        '_wpcf7cf_visible_groups' => '[]',
        '_wpcf7cf_repeaters' => '[]',
        '_wpcf7cf_steps' => '{}',
        '_wpcf7cf_options' => ''.json_encode($options),
    ));
}

function wpcf7cf_endswith($string, $test) {
    $strlen = strlen($string);
    $testlen = strlen($test);
    if ($testlen > $strlen) return false;
    return substr_compare($string, $test, $strlen - $testlen, $testlen) === 0;
}

add_filter( 'wpcf7_form_tag_data_option', 'wpcf7cf_form_tag_data_option', 10, 3 );

function wpcf7cf_form_tag_data_option($output, $args, $nog) {
	$data = array();
	return $data;
}

/* Scripts & Styles */

function wpcf7cf_load_js() {
	return apply_filters( 'wpcf7cf_load_js', WPCF7CF_LOAD_JS );
}

function wpcf7cf_load_css() {
	return apply_filters( 'wpcf7cf_load_css', WPCF7CF_LOAD_CSS );
}

add_action( 'wp_enqueue_scripts', 'wpcf7cf_do_enqueue_scripts', 20, 0 );

function wpcf7cf_do_enqueue_scripts() {
	if ( wpcf7cf_load_js() ) {
		wpcf7cf_enqueue_scripts();
	}

	if ( wpcf7cf_load_css() ) {
		wpcf7cf_enqueue_styles();
	}
}

function wpcf7cf_enqueue_scripts() {
	if (is_admin()) return;
	wp_enqueue_script('wpcf7cf-scripts', plugins_url('js/scripts.js', __FILE__), array('jquery'), WPCF7CF_VERSION, true);
	wp_localize_script('wpcf7cf-scripts', 'wpcf7cf_global_settings',
		array(
			'ajaxurl' => admin_url('admin-ajax.php'),
		)
	);

}

function wpcf7cf_enqueue_styles() {
	if (is_admin()) return;
	wp_enqueue_style('cf7cf-style', plugins_url('style.css', __FILE__), array(), WPCF7CF_VERSION);
}

// Make sure CF7 doesn't target any disabled fields for validation
// (HTML standard: "disabled fields don't get submitted", so no need to validate them)
add_filter( 'wpcf7_feedback_response', function($response, $result) {
    foreach ($response['invalid_fields'] as $i => $inv) {
        if (isset($response['invalid_fields'][$i]['into'])) {
            $response['invalid_fields'][$i]['into'] .= ':not(.wpcf7cf-disabled)';
        }
    }
    return $response;
}, 2, 10 );