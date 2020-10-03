<?php
/**
Plugin Name: Contact Form 7 Conditional Fields
Plugin URI: http://bdwm.be/
Description: Adds support for conditional fields to Contact Form 7. This plugin depends on Contact Form 7.
Author: Jules Colle
Version: 1.9.14
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


if ( function_exists( 'wpcf7cf_pro_deactivate_free_version_notice' ) ) {
	add_action( 'admin_notices', 'wpcf7cf_pro_deactivate_free_version_notice' );
} else {

	function wpcf7cf_pro_deactivate_free_version_notice() {
		?>
        <div class="notice notice-error is-dismissible">
            <p><?php echo sprintf( __( '<strong>Contact Form 7 - Conditional Fields PRO</strong> needs to %sdeactivate the free plugin%s', 'wpcf7cf' ), '<a href="' . wp_nonce_url( 'plugins.php?action=deactivate&amp;plugin=cf7-conditional-fields%2Fcontact-form-7-conditional-fields.php&amp;plugin_status=all&amp;paged=1&amp;s=', 'deactivate-plugin_cf7-conditional-fields/contact-form-7-conditional-fields.php' ) . '">', '</a>' ); ?></p>
        </div>
		<?php
	}

    require_once __DIR__.'/init.php';

}