=== Conditional Fields for Contact Form 7 ===
Contributors: Jules Colle, stevish
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=j_colle%40hotmail%2ecom&lc=US&item_name=Jules%20Colle%20%2d%20WP%20plugins%20%2d%20Responsive%20Gallery%20Grid&item_number=rgg&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
Author: Jules Colle
Website: http://bdwm.be
Tags: wordpress, contact form 7, forms, conditional fields
Requires at least: 4.1
Tested up to: 4.7.2
Stable tag: 1.2.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Adds conditional logic to Contact Form 7.

== Description ==

This plugin adds conditional logic to [Contact Form 7](https://wordpress.org/plugins/contact-form-7/).

If you edit your CF7 form, you will see an additional tag called "Conditional fields Group". Everything you put between the start and end tag will be hidden by default.
After you added the field group(s), you should click Save.
Then you should go to the "Conditional fields" tab to create one or more conditions that will make the group(s) appear.

= How to use it =

A detailed example of how to use the plugin can be found here: [http://bdwm.be/wpcf7cf/how-to-set-up-conditional-fields-for-contact-form-7/](http://bdwm.be/wpcf7cf/how-to-set-up-conditional-fields-for-contact-form-7/)

== Main/ New features ==

= Compatible with Contact Form 7 Multi-Step Forms =

Conditional Fields for Contact Form 7 is now fully compatible with <a target="_blank" href="https://wordpress.org/plugins/contact-form-7-multi-step-module/">Contact Form 7 Multi-Step Forms</a>

= Support for required fields =

Required fields can be used inside hidden groups without causing validation problems.

= Hide/show info in emails based on what groups are visible =

Conditional groups can now be added to the emails as well.
Just wrap the content with `[group-name] ... [/group-name]` tags.

= Groups can be nested =
Groups can be nested, both in the form and in the email

Example form:
`
[group group-1]
  [group group-inside-1]
    ...
  [/group]
[/group]`

Example email:
`
[group-1]
  [group-inside-1]
    ...
  [/group-inside-1]
[/group-1]`

= Advanced =

Advanced users can now code up the conditions as plain text instead of using the select boxes, using the import/export feature.


== Installation ==

Please follow the [standard installation procedure for WordPress plugins](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins).

== Frequently Asked Questions ==

= Something isn't working. Why? =

I will assume that you successfully installed both plugins, that you were able to create some conditional groups, and that you managed to create some conditions. But for some reason it's not working the way you expect it too. Here are the most common problems/causes people have encountered in the support forums. (Ordered from most frequent to least frequent.)

1. <strong>All field names should be unique</strong> - Even though your fields might never show up at the same time, it is still important to realize that WPCF7CF will not remove the fields, it merely hides them. So all fields will be submitted when the form is sent. Because of this no two fields can have the same name.
1. <strong>All my groups show up all the time and never get hidden.</strong> - Likely this is due to a javascript error caused by your theme or another plugin. WPCF7CF loads it's scripts at the bottom of the HTML page. If some javascript error gets triggered before, the code will not be executed. Before reaching out to the support forum try to determine which plugin or theme is causing the problem, by gradually disabling plugins and changing theme. Your browser's developer tools (F12) might point you in the right direction.

== Screenshots ==

1. Back End
2. Front End

== Changelog ==

= 1.2.2 =
* Fix critical bug that was present in version 1.2 and 1.2.1

= 1.2.1 =
* Improve compatibility with <a href="https://wordpress.org/plugins/contact-form-7-signature-addon/">Contact Form 7 Signature Addon</a>: now allowing multiple hidden signature fields.

= 1.2 =
* Made compatible with <a href="https://wordpress.org/plugins/contact-form-7-multi-step-module/">Contact Form 7 Multi-Step Forms</a>
* Small bug fix by Manual from advantia.net: now only considering fields which are strictly inside hidden group tags with form submit. Important in some edge cases where form elements get hidden by other mechanisms, i.e. tabbed forms.
* Started work on CF7CF Pro, made some structural code modifications so the free plugin can function as the base for both plugins.
* Removed some debug code
* Updated readme file

= 1.1 =
* Added import feature
* Added support for nested groups in email
* Tested on WP version 4.7.2 with Contact Form 7 version 4.6.1

= 1.0 =
* I feel that at this point the plugin is stable enough in most cases, so it's about time to take it out of beta :)
* Update JS en CSS version numbers
* Fix PHP warning with forms that are not using conditional fields (https://wordpress.org/support/topic/conditional-formatting-error/)
* Tested on WP 4.7.1

= 0.2.9 =
* Re-added wpcf7_add_shortcode() function if wpcf7_add_form_tag() is not found, because some people claimed to get a "function not found" error for the wpcf7_add_form_tag function with the latest version of CF7 installed. (https://wordpress.org/support/topic/activation-issue-5/ and https://wordpress.org/support/topic/http-500-unable-to-handle-request-error-after-update/)
* Fixed some PHP notices (https://wordpress.org/support/topic/undefined-index-error-in-ajax-response/)
* Attempted to fix error with the CF7 success page redirects plugin (https://wordpress.org/support/topic/warning-invalid-argument-error-for-forms-without-conditional-fields/)

= 0.2.8 =
* forgot to update version number in 0.2.7, so changing version to 0.2.8 now.

= 0.2.7 =
* Added support for conditional fields in the email (2) field
* Got rid of some PHP warnings
* Saving a form only once, directly after adding or removing conditions, caused conditional logic not to work. This is fixed now. Thanks to @cpaprotna for pointing me in the right direction. (https://wordpress.org/support/topic/no-more-than-3-conditional-statements/)
* Fix validation error with hidden checkbox groups (https://wordpress.org/support/topic/hidden-group-required-field-is-showing-error/)

= 0.2.6 =
* Fixed problems with exclusive checkboxes in IE (https://wordpress.org/support/topic/internet-explorer-conditional-exclusive-checkboxes/)

= 0.2.5 =
* Changed deprecated function wpcf7_add_shortcode to wpcf7_add_form_tag as it was causing errors in debug mode. (https://wordpress.org/support/topic/wpcf7_add_shortcode-deprecated-notice-2/)
* Removed the hide option and fixed the not-equals option for single checkboxes

= 0.2.4 =
* Fixed bug that destroyed the conditional fields in email functionality

= 0.2.3 =
* Added support for conditional fields in the other email fields (subject, sender, recipient, additional_headers). Thanks @stevish!
* WP 4.7 broke the required conditional fields inside hidden groups, implemented in version 0.2. Thanks again to @stevish for pointing this out.
* Got rid of checking which groups are hidden both on the front-end (JS) and in the back-end (PHP). Now this is only done in the front-end.
* Tested the plugin with WP 4.7

= 0.2.2 =
* Prevent strict standards notice to appear while adding new group via the "Conditional Fields Group" popup.
* Only load cf7cf admin styles and scripts on cf7 pages.
* groups are now reset to their initial states after the form is successfully submitted.

= 0.2.1 =
* Bug fix: arrow kept spinning after submitting a form without conditional fields. (https://wordpress.org/support/topic/version-0-2-gives-a-continues-spinning-arrow-after-submitting/)
* Removed anonymous functions from code, so the plugin also works for PHP versions older than 5.3.
* Suppress errors generated if user uses invalid HTML markup in their form code. These errors could prevent form success message from appearing.

= 0.2 =
* Added support for required conditional fields inside hidden groups. A big thank you to @stevish for implementing this.
* Added support for conditional fields in the email messages. This one also goes entirely to @stevish. Thanks man!
* Added @stevish as a contributer to the project :)
* Fix form not working in widgets or other places outside of the loop. Thanks to @ciprianolaru for the solution (https://wordpress.org/support/topic/problem-with-unit_tag-when-not-in-the-loop-form-not-used-in-post-or-page/#post-8299801)

= 0.1.7 =
* Fix popup warning to leave page even tough no changes have been made. Thanks to @hhmaster2045 for reporting the bug. https://wordpress.org/support/topic/popup-warning-to-leave-page-even-though-no-changes-have-been-made
* Added export option for easier troubleshooting.
* Don't include front end javascript in backend.

= 0.1.6 =
* made compatible with wpcf7-form-control-signature-wrap plugin https://wordpress.org/support/topic/signature-add-on-not-working

= 0.1.5 =
* fixed PHP notice thanks to @natalia_c https://wordpress.org/support/topic/php-notice-80
* tested with WP 4.5.3

= 0.1.4 =
* Prevent conflicts between different forms on one page.
* Prevent conflicts between multiple instances of the same form on one page. (https://wordpress.org/support/topic/bug-153)
* Changed regex to convert \[group\] tags to &lt;div&gt; tags, as it was posing some conflicts with other plugins (https://wordpress.org/support/topic/plugin-influence-cf7-send-button-style)

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


