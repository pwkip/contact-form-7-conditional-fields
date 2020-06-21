<?php

define('WPCF7CF_SLUG', 'wpcf7cf');
define('WPCF7CF_OPTIONS', WPCF7CF_SLUG.'_options');
define('WPCF7CF_TEXT_DOMAIN', WPCF7CF_SLUG.'_text_domain');

define('WPCF7CF_DEFAULT_ANIMATION', 'yes');
define('WPCF7CF_DEFAULT_ANIMATION_INTIME', 200);
define('WPCF7CF_DEFAULT_ANIMATION_OUTTIME', 200);
define('WPCF7CF_DEFAULT_CONDITIONS_UI', 'normal');
define('WPCF7CF_DEFAULT_NOTICE_DISMISSED', false);

if ( ! defined( 'WPCF7_ADMIN_READ_WRITE_CAPABILITY' ) ) {
	define( 'WPCF7_ADMIN_READ_WRITE_CAPABILITY', 'publish_pages' );
}

global $wpcf7cf_default_settings_glob;
$wpcf7cf_default_settings_glob = false;
function wpcf7cf_get_default_settings() {
    global $wpcf7cf_default_settings_glob;
    if ($wpcf7cf_default_settings_glob) return $wpcf7cf_default_settings_glob;

    $wpcf7cf_default_settings_glob = array(
        'animation' => WPCF7CF_DEFAULT_ANIMATION,
        'animation_intime' => WPCF7CF_DEFAULT_ANIMATION_INTIME,
        'animation_outtime' => WPCF7CF_DEFAULT_ANIMATION_OUTTIME,
        'conditions_ui' => WPCF7CF_DEFAULT_CONDITIONS_UI,
        'notice_dismissed' => WPCF7CF_DEFAULT_NOTICE_DISMISSED
    );
    $wpcf7cf_default_settings_glob = apply_filters('wpcf7cf_default_options', $wpcf7cf_default_settings_glob);
    return $wpcf7cf_default_settings_glob;
}

global $wpcf7cf_settings_glob;
$wpcf7cf_settings_glob = false;
function wpcf7cf_get_settings() {
    global $wpcf7cf_settings_glob;
    if ($wpcf7cf_settings_glob) {
        return $wpcf7cf_settings_glob;
    }

    $wpcf7cf_default_settings = wpcf7cf_get_default_settings();
    $wpcf7cf_saved_settings = get_option(WPCF7CF_OPTIONS);

    if (!$wpcf7cf_saved_settings) {
        $wpcf7cf_saved_settings = [];
    }
    
    $wpcf7cf_settings_glob = array_merge($wpcf7cf_default_settings,$wpcf7cf_saved_settings);

    return $wpcf7cf_settings_glob;
}

function wpcf7cf_set_options($settings) {
    global $wpcf7cf_settings_glob;
    $wpcf7cf_settings_glob = $settings;
    update_option(WPCF7CF_OPTIONS, $wpcf7cf_settings_glob);
}

function wpcf7cf_reset_options() {
    delete_option(WPCF7CF_OPTIONS);
}

add_action( 'admin_enqueue_scripts', 'wpcf7cf_load_page_options_wp_admin_style' );
function wpcf7cf_load_page_options_wp_admin_style() {
    wp_register_style( 'wpcf7cf_admin_css', plugins_url('admin-style.css',__FILE__), false, WPCF7CF_VERSION );
    wp_enqueue_style( 'wpcf7cf_admin_css' );
}


add_action('admin_menu', 'wpcf7cf_admin_add_page');
function wpcf7cf_admin_add_page() {
    add_submenu_page('wpcf7', 'Conditional Fields', 'Conditional Fields', WPCF7_ADMIN_READ_WRITE_CAPABILITY, 'wpcf7cf', 'wpcf7cf_options_page' );
}

function wpcf7cf_options_page() {
    $settings = wpcf7cf_get_settings();

    if (isset($_POST['reset'])) {
        echo '<div id="message" class="updated fade"><p><strong>Settings restored to defaults</strong></p></div>';
    } else if (isset($_REQUEST['settings-updated'])) {
        echo '<div id="message" class="updated fade"><p><strong>Settings updated</strong></p></div>';
    }

    ?>

    <div class="wrap wpcf7cf-admin-wrap">
        <h2>Contact Form 7 - Conditional Fields Settings</h2>
        <?php if (!$settings['notice_dismissed']) { ?>
        <div class="wpcf7cf-options-notice notice notice-warning is-dismissible"><div style="padding: 10px 0;"><strong>Notice</strong>: These are global settings for Contact Form 7 - Conditional Fields. <br><br><strong>How to create/edit conditional fields?</strong>
            <ol>
                <li>Create a new Contact Form or edit an existing one</li>
                <li>Create at least one [group] inside the form</li>
                <li>Save the Contact Form</li>
                <li>go to the <strong><em>Conditional Fields</em></strong> Tab</li>
            </ol>
                <a href="https://conditional-fields-cf7.bdwm.be/conditional-fields-for-contact-form-7-tutorial/" target="_blank">Show me an example</a> | <a class="notice-dismiss-2" href="#">Dismiss notice</a>
        </div></div>
        <?php } ?>
        <form action="options.php" method="post">
            <?php settings_fields(WPCF7CF_OPTIONS); ?>

            <input type="hidden" name="<?php echo WPCF7CF_OPTIONS.'[notice_dismissed]' ?>" value="<?php echo $settings['notice_dismissed'] ?>" />

            <?php

            echo '<h3>Default animation Settings</h3>';
            wpcf7cf_input_fields_wrapper_start();

            wpcf7cf_input_select('animation', array(
                'label' => 'Animation',
                'description' => 'Use animations while showing/hiding groups',
                'select_options' => array('yes' => 'Enabled', 'no'=> 'Disabled')
            ));

            wpcf7cf_input_field('animation_intime', array(
                'label' => 'Animation In time',
                'description' => 'A positive integer value indicating the time, in milliseconds, it will take for each group to show.',
            ));

            wpcf7cf_input_field('animation_outtime', array(
                'label' => 'Animation Out Time',
                'description' => 'A positive integer value indicating the time, in milliseconds, it will take for each group to hide.',
            ));

            wpcf7cf_input_fields_wrapper_end();
            submit_button();

            if (!WPCF7CF_IS_PRO) {
            ?>
            <h3>Conditional Fields PRO</h3>
            Get conditional Fields PRO to unlock the full potential of CF7
            <ul class="wpcf7cf-list">
                <li>Repeaters</li>
                <li>Regular expressions</li>
                <li>Togglebuttons</li>
                <li>Additional operators <code>&lt;</code> <code>&gt;</code> <code>&le;</code> <code>&ge;</code> <code>is empty</code></li>
                <li>Multistep (with Summary)</li>
                <li>More comming soon (Calculated Fields, ...)</li>
            </ul>
            <p><a target="_blank" class="button button-primary" href="https://conditional-fields-cf7.bdwm.be/contact-form-7-conditional-fields-pro/">Get PRO</a></p>
            <?php
            }
            do_action('wpcf7cf_after_animation_settings');

            echo '<h3>Advanced Settings</h3>';
            wpcf7cf_input_fields_wrapper_start();

            wpcf7cf_input_select('conditions_ui', array(
                'label' => 'Conditonal Fields UI',
                'description' => 'If you want to add more than '.WPCF7CF_MAX_RECOMMENDED_CONDITIONS.' conditions, it\'s recommended to switch to <strong>Text mode</strong> mode for better performance.',
                'select_options' => array('normal'=> 'Normal', 'text_only' => 'Text mode')
            ));
            
            wpcf7cf_input_fields_wrapper_end();

            submit_button();

            ?>

        </form></div>

    <h3>Restore Default Settings</h3>
    <form method="post" id="reset-form" action="">
        <p class="submit">
            <input name="reset" class="button button-secondary" type="submit" value="Restore defaults" >
            <input type="hidden" name="action" value="reset" />
        </p>
    </form>
    <script>
        (function($){
            $('#reset-form').submit(function() {
                return confirm('Are you sure you want to reset the plugin settings to the default values? All changes you have previously made will be lost.');
            });
        }(jQuery))
    </script>

    <?php
}

function wpcf7cf_input_fields_wrapper_start() {
    echo '<table class="form-table" role="presentation"><tbody>';
}
function wpcf7cf_input_fields_wrapper_end() {
    echo '</tbody></table>';
}

function wpcf7cf_input_field($slug, $args) {
    $settings = wpcf7cf_get_settings();

    $defaults = array(
        'label'=>'',
        'desription' => '',
        'default' => wpcf7cf_get_default_settings()[$slug],
        'label_editable' => false
    );

    $args = wp_parse_args( $args, $defaults );
    extract($args);

    $label; $description; $default; $label_editable;

    if (!key_exists($slug, $settings)) {
        $settings[$slug] = $default;
        $settings[$slug.'_label'] = $label;
    }

    ?>

    <tr>
        <th scope="row">

            <?php if ($label_editable) { ?>
                <span class="label editable"><input type="text" data-default-value="<?php echo $label ?>" value="<?php echo $settings[$slug.'_label'] ?>" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug.'_label' ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.'_label]' ?>"></span>
            <?php } else { ?>
                <label for="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>"><?php echo $label ?></label>
            <?php } ?>

        </th>
        <td>
            <input type="text" data-default-value="<?php echo $default ?>" value="<?php echo $settings[$slug] ?>" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.']' ?>">
            <p class="description" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>-description">
                <?php echo $description ?><?php if (!empty($default)) echo ' (Default: '.$default.')' ?>
            </p>
        </td>
    </tr>

    <?php

}

function wpcf7cf_input_select($slug, $args) {
    $settings = wpcf7cf_get_settings();

    $defaults = array(
        'label'=>'',
        'desription' => '',
        'select_options' => array(), // array($name => $value)
        'default' => wpcf7cf_get_default_settings()[$slug],
    );

    $args = wp_parse_args( $args, $defaults );
    extract($args);

    $label; $description; $select_options; $default;

    if (!key_exists($slug, $settings)) {
        $settings[$slug] = $default;
    }

    ?>
        <tr>
            <th scope="row"><label for="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>"><?php echo $label ?></label></th>
            <td>
                <select id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>" data-default-value="<?php echo $default ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.']' ?>">
                    <?php foreach($select_options as $value => $text) { ?>
                        <option value="<?php echo $value ?>" <?php echo $settings[$slug]==$value?'selected':'' ?>><?php echo $text ?></option>
                    <?php } ?>
                </select>
                <p class="description" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>-description">
                    <?php echo $description ?><?php if (!empty($default)) echo ' (Default: '.$select_options[$default].')' ?>
                </p>
            </td>
        </tr>
    <?php
}

add_action('admin_init', 'wpcf7cf_admin_init');
function wpcf7cf_admin_init(){

    if(isset($_POST['reset']) && current_user_can( 'wpcf7_edit_contact_form' ) ) {
        wpcf7cf_reset_options();
    }

    register_setting( WPCF7CF_OPTIONS, WPCF7CF_OPTIONS, 'wpcf7cf_options_sanitize' );
}

function wpcf7cf_options_sanitize($input) {
    return $input;
}

add_action( 'wp_ajax_wpcf7cf_dismiss_notice', 'wpcf7cf_dismiss_notice' );
function wpcf7cf_dismiss_notice() {
    $settings = wpcf7cf_get_settings();
    $settings['notice_dismissed'] = true;
    wpcf7cf_set_options($settings);
}