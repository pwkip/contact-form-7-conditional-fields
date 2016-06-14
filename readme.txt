=== Conditional Fields for Contact Form 7 ===
Contributors: Jules Colle
Author: Jules Colle
Website: http://bdwm.be
Tags: wordpress, contact form 7, forms, conditional fields
Requires at least: 3.6.1
Tested up to: 4.5.2
Stable tag: 0.1.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Adds conditional logic to Contact Form 7.

== Description ==

This plugin adds conditional logic to [Contact Form 7](https://wordpress.org/plugins/contact-form-7/).

If you edit your CF7 form, you will see an additional tag called "Conditional fields Group". Everything you put between the start and end tag will be hidden by default.
After you added the field group(s), you should click Save.
Then you should go to the "Conditional fields" tab to create one or more conditions that will make the group(s) appear.

A detailed example of how to use the plugin can be found here: [http://bdwm.be/wpcf7cf/how-to-set-up-conditional-fields-for-contact-form-7/](http://bdwm.be/wpcf7cf/how-to-set-up-conditional-fields-for-contact-form-7/)

== Installation ==

Please follow the [standard installation procedure for WordPress plugins](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins).

== Frequently Asked Questions ==

= Why are there not more Frequently asked questions? =

Because no questions have been asked frequently about this plugin.

== Screenshots ==

1. Back End
2. Front End

== Changelog ==

= 0.1.3 =

* Removed fielset, id and class attributes for group tags, because they weren't used anyway and broke the shortcode
* If extra attributes are added to the group shortcode, this will no longer break functionality (even though no attributes are supported)

= 0.1.2 =

* Make code work with select element that allows multiple options.
* Only load javascript on pages that contain a CF7 form

= 0.1.1 =

Fixed bug with exclusive checkboxes (https://wordpress.org/support/topic/groups-not-showing)

= 0.1 =

First release


