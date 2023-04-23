<?php

if (!defined('WPCF7CF_VERSION')) define( 'WPCF7CF_VERSION', '2.3.8' );
if (!defined('WPCF7CF_CF7_MIN_VERSION')) define( 'WPCF7CF_CF7_MIN_VERSION', '5.6' );
if (!defined('WPCF7CF_CF7_MAX_VERSION')) define( 'WPCF7CF_CF7_MAX_VERSION', '5.7.6' );
if (!defined('WPCF7CF_REQUIRED_WP_VERSION')) define( 'WPCF7CF_REQUIRED_WP_VERSION', '4.1' );
if (!defined('WPCF7CF_PLUGIN')) define( 'WPCF7CF_PLUGIN', __FILE__ );
if (!defined('WPCF7CF_PLUGIN_BASENAME')) define( 'WPCF7CF_PLUGIN_BASENAME', plugin_basename( WPCF7CF_PLUGIN ) );
if (!defined('WPCF7CF_PLUGIN_NAME')) define( 'WPCF7CF_PLUGIN_NAME', trim( dirname( WPCF7CF_PLUGIN_BASENAME ), '/' ) );
if (!defined('WPCF7CF_PLUGIN_DIR')) define( 'WPCF7CF_PLUGIN_DIR', untrailingslashit( dirname( WPCF7CF_PLUGIN ) ) );

if (!defined('WPCF7CF_LOAD_JS')) define('WPCF7CF_LOAD_JS', true);
if (!defined('WPCF7CF_LOAD_CSS')) define('WPCF7CF_LOAD_CSS', true);

if (!defined('WPCF7CF_REGEX_MAIL_GROUP')) define( 'WPCF7CF_REGEX_MAIL_GROUP', '@\[[\s]*([a-zA-Z_][0-9a-zA-Z:._-]*)[\s]*\](.*?)\[[\s]*/[\s]*\1[\s]*\]@s');
if (!defined('WPCF7CF_REGEX_MAIL_GROUP_INVERTED')) define( 'WPCF7CF_REGEX_MAIL_GROUP_INVERTED', '@\[![\s]*([a-zA-Z_][0-9a-zA-Z:._-]*)[\s]*\](.*?)\[![\s]*/[\s]*\1[\s]*\]@s');
if (!defined('WPCF7CF_REGEX_MAIL_UNWANTED_WHITESPACE')) define('WPCF7CF_REGEX_MAIL_UNWANTED_WHITESPACE', '@(\[/[^\]]*\])\s+?(\[)@s');
if (!defined('WPCF7CF_REGEX_CONDITIONS')) define( 'WPCF7CF_REGEX_CONDITIONS', '/(?:show \[([^\]]*?)\]|and) if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/m');

if (!defined('WPCF7CF_MAX_RECOMMENDED_CONDITIONS')) define( 'WPCF7CF_MAX_RECOMMENDED_CONDITIONS', 50 );

if(file_exists(WPCF7CF_PLUGIN_DIR.'/pro/pro-functions.php')) {
    if (!defined('WPCF7CF_IS_PRO')) define( 'WPCF7CF_IS_PRO', true );
} else {
    if (!defined('WPCF7CF_IS_PRO')) define( 'WPCF7CF_IS_PRO', false );
}

if(file_exists(WPCF7CF_PLUGIN_DIR.'/tests/init.php')) {
    require_once WPCF7CF_PLUGIN_DIR.'/tests/init.php';
    if (!defined('WPCF7CF_TESTMODE')) define( 'WPCF7CF_TESTMODE', true );
}

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

require_once WPCF7CF_PLUGIN_DIR.'/Wpcf7cfMailParser.php';

if (WPCF7CF_IS_PRO) {
    require_once WPCF7CF_PLUGIN_DIR.'/pro/pro-functions.php';
}

require_once WPCF7CF_PLUGIN_DIR.'/cf7cf.php';
require_once WPCF7CF_PLUGIN_DIR.'/wpcf7cf-options.php';

if (WPCF7CF_IS_PRO) {
	require_once WPCF7CF_PLUGIN_DIR.'/pro/update.php';
}