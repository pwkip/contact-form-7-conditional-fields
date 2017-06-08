<?php

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

        // compatibility with CF7 multi-step forms by Webhead LLC.
        add_filter( 'wpcf7_posted_data', array($this,'cf7msm_merge_post_with_cookie'), 8, 1 );

        // compatibility with CF7 Multi Step by NinjaTeam https://wordpress.org/plugins/cf7-multi-step/
        add_action('wp_ajax_cf7mls_validation', array($this,'cf7mls_validation_callback'),9);
        add_action('wp_ajax_nopriv_cf7mls_validation', array($this,'cf7mls_validation_callback'),9);

        add_filter( 'wpcf7_posted_data', array($this, 'remove_hidden_post_data') );
        add_filter( 'wpcf7_mail_components', array($this, 'hide_hidden_mail_fields') );
        add_filter('wpcf7_additional_mail', array($this, 'hide_hidden_mail_fields_additional_mail'), 10, 2);

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
            __('Conditional fields Group', 'wpcf7cf'),
            'wpcf7-tg-pane-group',
            array(__CLASS__, 'tg_pane')
        );

        do_action('wpcf7cf_tag_generator');
    }

    static function tg_pane( $contact_form, $args = '' ) {
        $args = wp_parse_args( $args, array() );
        $type = 'group';

        $description = __( "Generate a group tag to group form elements that can be shown conditionally.", 'cf7cf' );

        include 'tg_pane_group.php';
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

    function cf7msm_merge_post_with_cookie($posted_data) {

        if (!function_exists('cf7msm_get') || !key_exists('cf7msm_posted_data',$_COOKIE)) return $posted_data;

        if (!$posted_data) {
            $posted_data = WPCF7_Submission::get_instance()->get_posted_data();
        }

        // this will temporarily set the hidden fields data to the posted_data.
        // later this function will be called again with the updated posted_data
        $this->set_hidden_fields_arrays($posted_data);

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

        if (!$posted_data) {
            $posted_data = WPCF7_Submission::get_instance()->get_posted_data();
        }

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
    if (!is_admin() || (defined('DOING_AJAX') && DOING_AJAX)) { // TODO: kind of hacky. maybe find a better solution. Needed because otherwise the group tags will be replaced in the editor as well.
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

add_action('wpcf7_contact_form', 'wpcf7cf_enqueue_scripts', 10, 1);
function wpcf7cf_enqueue_scripts(WPCF7_ContactForm $cf7form) {
    if (is_admin()) return;
    wp_enqueue_script('wpcf7cf-scripts', plugins_url('js/scripts.js', __FILE__), array('jquery'), WPCF7CF_VERSION, true);
}

add_action('wpcf7_form_hidden_fields', 'wpcf7cf_form_hidden_fields',10,1);

function wpcf7cf_form_hidden_fields($hidden_fields) {

    $current_form = wpcf7_get_current_contact_form();
    $current_form_id = $current_form->id();

    $options = array(
        'form_id' => $current_form_id,
        'conditions' => get_post_meta($current_form_id,'wpcf7cf_options', true),
        'settings' => get_option(WPCF7CF_OPTIONS)
    );

    return array(
        '_wpcf7cf_hidden_group_fields' => '',
        '_wpcf7cf_hidden_groups' => '',
        '_wpcf7cf_visible_groups' => '',
        '_wpcf7cf_options' => ''.json_encode($options),
    );
}

function wpcf7cf_endswith($string, $test) {
    $strlen = strlen($string);
    $testlen = strlen($test);
    if ($testlen > $strlen) return false;
    return substr_compare($string, $test, $strlen - $testlen, $testlen) === 0;
}