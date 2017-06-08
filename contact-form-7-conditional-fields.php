<?php
/**
Plugin Name: Contact Form 7 Conditional Fields
Plugin URI: http://bdwm.be/
Description: Adds support for conditional fields to Contact Form 7. This plugin depends on Contact Form 7.
Author: Jules Colle
Version: 1.3.4
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

if (!defined('WPCF7CF_VERSION')) define( 'WPCF7CF_VERSION', '1.3.4' );
if (!defined('WPCF7CF_REQUIRED_WP_VERSION')) define( 'WPCF7CF_REQUIRED_WP_VERSION', '4.1' );
if (!defined('WPCF7CF_PLUGIN')) define( 'WPCF7CF_PLUGIN', __FILE__ );
if (!defined('WPCF7CF_PLUGIN_BASENAME')) define( 'WPCF7CF_PLUGIN_BASENAME', plugin_basename( WPCF7CF_PLUGIN ) );
if (!defined('WPCF7CF_PLUGIN_NAME')) define( 'WPCF7CF_PLUGIN_NAME', trim( dirname( WPCF7CF_PLUGIN_BASENAME ), '/' ) );
if (!defined('WPCF7CF_PLUGIN_DIR')) define( 'WPCF7CF_PLUGIN_DIR', untrailingslashit( dirname( WPCF7CF_PLUGIN ) ) );

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

if(file_exists(WPCF7CF_PLUGIN_DIR.'/pro/pro-functions.php')) {
    if (!defined('WPCF7CF_IS_PRO')) define( 'WPCF7CF_IS_PRO', true );
    require_once WPCF7CF_PLUGIN_DIR.'/pro/pro-functions.php';
} else {
    if (!defined('WPCF7CF_IS_PRO')) define( 'WPCF7CF_IS_PRO', false );
}

require_once 'cf7cf.php';
require_once 'wpcf7cf-options.php';

