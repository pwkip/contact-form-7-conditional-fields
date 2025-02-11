<?php
/**
 * Old main file upgrade routine (Thanks to RavanH for the idea)
 * 
 * This is the old plugin main file, it was the main plugin file until version 2.5.4
 * We'll keep this file for a couple more versions before removing it definitively.
 * 
 */

defined( 'WPINC' ) || die;

$old = 'contact-form-7-conditional-fields.php';
$new = 'conditional-fields.php';

// Change the active plugin settings to make WP start using the new one.
$active_plugins = (array) get_option( 'active_plugins', array() );

$old_plugin_array = array( basename( __DIR__ ) . '/' . $old );
$active_plugins   = array_diff( $active_plugins, $old_plugin_array );

$new_plugin = basename( __DIR__ ) . '/' . $new;
if ( ! in_array( $new_plugin, $active_plugins ) ) {
    $active_plugins[] = $new_plugin;

    include_once __DIR__ . '/' . $new;
}

// Update active plugins and never come back here.
update_option( 'active_plugins', $active_plugins );