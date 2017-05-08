<?php

define('WPCF7CF_SLUG', 'wpcf7cf');
define('WPCF7CF_OPTIONS', WPCF7CF_SLUG.'_options');
define('WPCF7CF_TEXT_DOMAIN', WPCF7CF_SLUG.'_text_domain');

define('WPCF7CF_DEFAULT_ANIMATION', 'yes');
define('WPCF7CF_DEFAULT_ANIMATION_INTIME', 200);
define('WPCF7CF_DEFAULT_ANIMATION_OUTTIME', 200);
define('WPCF7CF_DEFAULT_NOTICE_DISMISSED', false);

$wpcf7cf_default_options = array(
    'animation' => WPCF7CF_DEFAULT_ANIMATION,
    'animation_intime' => WPCF7CF_DEFAULT_ANIMATION_INTIME,
    'animation_outtime' => WPCF7CF_DEFAULT_ANIMATION_OUTTIME,
    'notice_dismissed' => WPCF7CF_DEFAULT_NOTICE_DISMISSED
);

$wpcf7cf_default_options = apply_filters('wpcf7cf_default_options', $wpcf7cf_default_options);

$wpcf7cf_options = get_option(WPCF7CF_OPTIONS);

if (!is_array($wpcf7cf_options)) $wpcf7cf_options = array();

if(isset($_POST['reset'])) {
    update_option(WPCF7CF_OPTIONS, $wpcf7cf_default_options);
    $wpcf7cf_options['wpcf7cf_settings_saved'] = 0;
}

// this setting will only be 0 as long as the user has not saved any settings. Once the user has saved the WPCF7CF settings, this value will always remain 1.
if (!key_exists('wpcf7cf_settings_saved',$wpcf7cf_options)) $wpcf7cf_options['wpcf7cf_settings_saved'] = 0;

if ($wpcf7cf_options['wpcf7cf_settings_saved'] == 0) {
    $wpcf7cf_options = $wpcf7cf_default_options;
}


add_action('ninja_forms_display_before_field_function','wpcf7cf_wrap_input_field_before');
add_action('ninja_forms_display_after_field_function','wpcf7cf_wrap_input_field_after');

function wpcf7cf_wrap_input_field_before() { echo '<div class="resizable_input_wrapper">'; }
function wpcf7cf_wrap_input_field_after() { echo '</div>'; }

add_action( 'admin_enqueue_scripts', 'wpcf7cf_load_page_options_wp_admin_style' );
function wpcf7cf_load_page_options_wp_admin_style() {
    wp_register_style( 'page_options_wp_admin_css', plugins_url('admin-style.css',__FILE__), false, WPCF7CF_VERSION );
    wp_enqueue_style( 'page_options_wp_admin_css' );
}


add_action('admin_menu', 'wpcf7cf_admin_add_page');
function wpcf7cf_admin_add_page() {
    add_submenu_page('wpcf7', 'Conditional Fields', 'Conditional Fields', WPCF7_ADMIN_READ_WRITE_CAPABILITY, 'wpcf7cf', 'wpcf7cf_options_page' );
}

function wpcf7cf_options_page() {
    global $wpcf7cf_options;

    // Include in admin_enqueue_scripts action hook
    wp_enqueue_media();
    //wp_enqueue_script( 'custom-background' );
    wp_enqueue_script( 'wpcf7cf-image-upload', plugins_url('framework/js/bdwm-image-upload.js',__FILE__), array('jquery'), '1.0.0', true );

    if (isset($_POST['reset'])) {
        echo '<div id="message" class="updated fade"><p><strong>Settings restored to defaults</strong></p></div>';
    } else if ($_REQUEST['settings-updated']) {
        echo '<div id="message" class="updated fade"><p><strong>Settings updated</strong></p></div>';
    }

    ?>

    <div class="wrap wpcf7cf-admin-wrap">
        <?php screen_icon(); ?>
        <h2>Conditional Fields for Contact Form 7 Settings</h2>
        <?php if (!$wpcf7cf_options['notice_dismissed']) { ?>
        <div class="wpcf7cf-options-notice notice notice-warning is-dismissible"><div style="padding: 10px 0;"><strong>Notice</strong>: These are global settings for Conditional Fields for Contact Form 7. <br><br><strong>How to create/edit conditional fields?</strong>
            <ol>
                <li>Create a new Contact Form or edit an existing one</li>
                <li>Create at least one [group] inside the form</li>
                <li>Save the Contact Form</li>
                <li>go to the <strong><em>Conditional Fields</em></strong> Tab</li>
            </ol>
                <a href="http://bdwm.be/wpcf7cf/how-to-set-up-conditional-fields-for-contact-form-7/" target="_blank">Show me an example</a> | <a class="notice-dismiss-2" href="#">Dismiss notice</a>
        </div></div>
        <?php } ?>
        <form action="options.php" method="post">
            <?php settings_fields(WPCF7CF_OPTIONS); ?>

            <input type="hidden" value="1" id="wpcf7cf_settings_saved" name="<?php echo WPCF7CF_OPTIONS.'[wpcf7cf_settings_saved]' ?>">
            <input type="hidden" name="<?php echo WPCF7CF_OPTIONS.'[notice_dismissed]' ?>" value="<?php echo $wpcf7cf_options['notice_dismissed'] ?>" />


            <h3>Default animation Settings</h3>

            <?php

            wpcf7cf_input_select('animation', array(
                'label' => 'Animation',
                'description' => 'Use animations while showing/hiding groups',
                'options' => array('no'=> 'Disabled', 'yes' => 'Enabled')
            ));

            wpcf7cf_input_field('animation_intime', array(
                'label' => 'Animation In time',
                'description' => 'A positive integer value indicating the time, in milliseconds, it will take for each group to show.',
            ));

            wpcf7cf_input_field('animation_outtime', array(
                'label' => 'Animation Out Time',
                'description' => 'A positive integer value indicating the time, in milliseconds, it will take for each group to hide.',
            ));

            submit_button();

            do_action('wpcf7cf_after_animation_settings');

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


function wpcf7cf_image_field($slug, $args) {

    global $wpcf7cf_options, $wpcf7cf_default_options;

    $defaults = array(
        'title'=>'Image',
        'description' => '',
        'choose_text' => 'Choose an image',
        'update_text' => 'Use image',
        'default' => $wpcf7cf_default_options[$slug]
    );

    $args = wp_parse_args( $args, $defaults );
    extract($args);
    $label; $description; $choose_text; $update_text; $default;

    if (!key_exists($slug, $wpcf7cf_options)) {
        $wpcf7cf_options[$slug] = $default;
    }

    ?>
    <div class="option-line">
        <span class="label"><?php echo $label; ?></span>
        <?php
        if ($description) {
            ?>
            <p><?php echo $description; ?></p>
            <?php
        }
        ?>
        <div>
        <div class="image-container" id="default-thumbnail-preview_<?php echo $slug ?>">
            <?php
            if ($wpcf7cf_options[$slug] != '') {
                $img_info = wp_get_attachment_image_src($wpcf7cf_options[$slug], 'full');
                $img_src = $img_info[0];
                ?>
                <img src="<?php echo $img_src ?>" height="100">
                <?php
            }
            ?>
        </div>
        <a class="choose-from-library-link" href="#"
           data-field="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>"
           data-image_container="default-thumbnail-preview_<?php echo $slug ?>"
           data-choose="<?php echo $choose_text; ?>"
           data-update="<?php echo $update_text; ?>"><?php _e( 'Choose image' ); ?>
        </a>
        <input type="hidden" value="<?php echo $wpcf7cf_options[$slug] ?>" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.']' ?>">
        </div>
    </div>
    <?php

}

function wpcf7cf_input_field($slug, $args) {
    global $wpcf7cf_options, $wpcf7cf_default_options;

    $defaults = array(
        'label'=>'',
        'desription' => '',
        'default' => $wpcf7cf_default_options[$slug],
        'label_editable' => false
    );

    $args = wp_parse_args( $args, $defaults );
    extract($args);

    $label; $description; $default; $label_editable;

    if (!key_exists($slug, $wpcf7cf_options)) {
        $wpcf7cf_options[$slug] = $default;
        $wpcf7cf_options[$slug.'_label'] = $label;
    }

    ?>
    <div class="option-line">
        <?php if ($label_editable) { ?>
            <span class="label"><input type="text" data-default-value="<?php echo $label ?>" value="<?php echo $wpcf7cf_options[$slug.'_label'] ?>" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug.'_label' ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.'_label]' ?>"></span>
        <?php } else { ?>
            <span class="label"><?php echo $label ?></span>
        <?php } ?>
        <span class="field"><input type="text" data-default-value="<?php echo $default ?>" value="<?php echo $wpcf7cf_options[$slug] ?>" id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.']' ?>"></span>
        <span class="description"><?php echo $description ?><?php if (!empty($default)) echo ' (Default: '.$default.')' ?></span>
    </div>
    <?php

}

function wpcf7cf_input_select($slug, $args) {
    global $wpcf7cf_options, $wpcf7cf_default_options;

    $defaults = array(
        'label'=>'',
        'desription' => '',
        'options' => array(), // array($name => $value)
        'default' => $wpcf7cf_default_options[$slug],
    );

    $args = wp_parse_args( $args, $defaults );
    extract($args);

    $label; $description; $options; $default;

    if (!key_exists($slug, $wpcf7cf_options)) {
        $wpcf7cf_options[$slug] = $default;
    }

    // $first_element = array('-1' => '-- Select --');
    // $options = array_merge($first_element, $options);

    ?>
    <div class="option-line">
        <span class="label"><?php echo $label ?></span>
        <span class="field">
			<select id="<?php echo WPCF7CF_OPTIONS.'_'.$slug ?>" data-default-value="<?php echo $default ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.']' ?>">
<?php
foreach($options as $value => $text) {
    ?>
    <option value="<?php echo $value ?>" <?php echo $wpcf7cf_options[$slug]==$value?'selected':'' ?>><?php echo $text ?></option>
    <?php
}
?>
			</select>			
		</span>
        <span class="description"><?php echo $description ?><?php if (!empty($default)) echo ' (Default: '.$options[$default].')' ?></span>
    </div>
    <?php

}

function wpcf7cf_checkbox($slug, $args) {
    global $wpcf7cf_options, $wpcf7cf_default_options;

    $defaults = array(
        'label'=>'',
        'desription' => '',
        'default' => $wpcf7cf_default_options[$slug],
    );

    $args = wp_parse_args( $args, $defaults );
    extract($args);

    $label; $description; $default;

    ?>
    <div class="option-line">
        <span class="label"><?php echo $label ?></span>
        <span class="field">
			
			<input type="checkbox" data-default-value="<?php echo $default ?>" name="<?php echo WPCF7CF_OPTIONS.'['.$slug.']' ?>" value="1" <?php checked('1', $wpcf7cf_options[$slug]) ?>>
		</span>
        <span class="description"><?php echo $description ?><?php if (!empty($default)) echo ' (Default: '.$default.')' ?></span>
    </div>
    <?php
}

function wpcf7cf_regex_collection() {
    global $wpcf7cf_options, $wpcf7cf_default_options;

}

add_action('admin_init', 'wpcf7cf_admin_init');
function wpcf7cf_admin_init(){
    register_setting( WPCF7CF_OPTIONS, WPCF7CF_OPTIONS, 'wpcf7cf_options_sanitize' );
}

function wpcf7cf_options_sanitize($input) {
    return $input;
}

add_action( 'wp_ajax_wpcf7cf_dismiss_notice', 'wpcf7cf_dismiss_notice' );
function wpcf7cf_dismiss_notice() {
    global $wpcf7cf_options;
    $wpcf7cf_options['notice_dismissed'] = true;
    $wpcf7cf_options['wpcf7cf_settings_saved'] = 1;
    update_option(WPCF7CF_OPTIONS,$wpcf7cf_options);
}