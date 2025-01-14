=== Conditional Fields for Contact Form 7 ===
Contributors: Jules Colle
Donate link: https://shop.bdwm.be/contact-form-7-conditional-fields-pro/
Author: Jules Colle
Website: http://bdwm.be
Tags: contact form 7, forms, form, conditional fields, conditional logic
Requires at least: 5.0
Tested up to: 6.7
Stable tag: 2.5.7
Requires PHP: 7.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Adds conditional logic to Contact Form 7.

== Description ==

This plugin adds conditional logic to [Contact Form 7](https://wordpress.org/plugins/contact-form-7/).

If you edit your CF7 form, you will see an additional tag called "Conditional fields Group". Everything you put between the start and end tag will be hidden by default.
After you have added the field group(s), go to the "Conditional fields" tab to create one or more conditions that will make the group(s) appear.

Conditional Fields for Contact Form 7 is an independent plugin. This plugin is not affiliated with or endorsed by the developers of Contact Form 7.

= How to use it =

[Follow this tutorial](https://conditional-fields-cf7.bdwm.be/conditional-fields-for-contact-form-7-tutorial/)

== Main features ==

= Support for required fields =

Required fields inside hidden groups will never trigger validation errors.

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

Advanced users can code up the conditions as plain text instead of using the select boxes, using the Text View.

== Need more power? ==

Just like WordPress, the power of Contact Form 7 lies in its [rich eco-system of extensions](https://conditional-fields-cf7.bdwm.be/list-of-all-contact-form-7-extensions/) that build on top of it. However, it can be difficult to find a set of complex extensions that work well together.

That's why I created Conditional Fields Pro. It adds some powerful features to Contact form 7 and guarantees that everything will run smoothly with Conditional Fields.

Pro features include:

* Repeatable fields (repeaters)
* Forms with multiple steps (multistep)
* Custom conditions with JavaScript functions
* Conditions with regular expressions
* Multiple file upload

[Get the PRO version of Conditional Fields for Contact Form 7!](https://conditional-fields-cf7.bdwm.be/contact-form-7-conditional-fields-pro/)

== Installation ==

Please follow the [standard installation procedure for WordPress plugins](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins).

Follow [this tutorial](https://conditional-fields-cf7.bdwm.be/conditional-fields-for-contact-form-7-tutorial/) if you are not sure how to use the plugin.

== Frequently Asked Questions ==

= Email message is not showing the correct values / Wrong values are submitted =

<strong>All field names should be unique</strong>

Even though your fields might never show up at the same time, it is still important to realize that WPCF7CF will not remove the fields, it merely hides them. So all fields will be submitted when the form is sent. Because of this no two fields can have the same name.

Incorrect form (2 input elements having the same name "a"):
`
[group group-1][select a "1" "2" "3"][/group]
[group group-2][select a "1" "2" "3"][/group]
`

Correct form (all groups and fields have unique names):
`
[group group-1][select a "1" "2" "3"][/group]
[group group-2][select b "1" "2" "3"][/group]
`

= All my groups show up all the time and never get hidden. =

<strong>Reason #1: Javascript error</strong>
Check your browser console (F12) for any javascript errors. WPCF7CF loads it's scripts at the bottom of the HTML page, so if some javascript error gets triggered before that, the code will not be executed in most browsers.
Before reaching out to the support forum try to determine which plugin or theme is causing the problem, by gradually disabling plugins and changing theme.

<strong>Reason #2: wp_footer() isn't loaded</strong>
Check if your theme is calling the `wp_footer()` function. Typically this function will be called in your theme's footer.php file.
The conditional fields javascript code is loaded during wp_footer, so a call to this function is crucial. If there is no such call in your theme, go to your theme's footer.php file and add this code right before the closing `</body>` tag:
`&lt;?php wp_footer(); ?&gt;`

== Screenshots ==

1. Conditional fields in action
2. Defining rules to show/hide groups of input elements in the backend interface

== Upgrade Notice ==

= 2.0 =

Make sure to also update CF7 to the latest version! (Version 2.0 is only compatible with CF7 versions 5.4 and up. Version 1.9.16 is only compatible with CF7 version 5.3.*)

= 2.2 =

Make sure to also update CF7 to the latest version! (Version 2.2 is only compatible with CF7 versions 5.6 and up. Version 2.1.6 is only compatible with CF7 version 5.5.*)

= 2.2.10 =

Because the nature of the changes introduced in version 5.7 of Contact Form 7 you might need to make some manual changes to your forms and/or to your wp-config.php file. Please check the changelog. You could also wait for the release of version 5.7.1 of Contact Form 7. We hope the author will have address some of the issues by then.

= 2.2.11 =

Reverted autop-fix because it was causing addional errors. Bottom line: Make sure you are om Conditional Fields version 2.2.11 and CF7 version 5.6.4

== Changelog ==

= 2.5.7 (2025-01-14) =
* Fully tested with Contact Form 7 version 6.0.3

= 2.5.6 (2024-12-23) =
* Fully tested with Contact Form 7 version 6.0.2

= 2.5.5 (2024-12-20) =
* FREE: Rename plugin folder and main file from contact-form-7-conditional-fields/contact-form-7-conditional-fields to conditional-fields
* PRO: Rename plugin folder and main file from contact-form-7-conditional-fields-pro to conditional-fields-pro/conditional-fields.php

= 2.5.4 (2024-12-05) =
* Remove some code in the free plugin that was only needed for the PRO version.

= 2.5.3 (2024-12-04) =
* Fix form-tag generator button. Now you can insert [group] tags again with the new CF7 form-tag generator. Renamed the button to "Conditional group".

= 2.5.2 (2024-11-27) =
* Fully tested with Contact Form 7 version 6.0.1
* Tested up to WP 6.7

= 2.5.1 (2024-11-03) =
* Temporarily remove Conditional Fields buttons to prevent conflicts with CF7 6.0. This means you need to enter the [group] tags manually and can't insert them with the form-tag generator buttons anymore. We are looking into a fix.
* Fully tested with Contact Form 7 version 6.0

= 2.5 (2024-10-22) =
* Add Plugin Dependency for CF7 in plugin header
* fix deprecated warning dynamic property creation
* fix Using ${var} in strings is deprecated
* Fix XSS vulnerability in admin settings page. Thanks to [Patchstack](patchstack.com) for reporting this issue.
* PRO: Fix: [response] tag doesn't work properly in multistep [#127](https://github.com/pwkip/contact-form-7-conditional-fields/issues/127)
* PRO: Add support for checkbox free_text option in summary field [#126](https://github.com/pwkip/contact-form-7-conditional-fields/issues/126)
* PRO: Fix: [multifile] allows uploading of filetype that is not specified in allowed filetypes [#103]((https://github.com/pwkip/contact-form-7-conditional-fields/issues/103)

= 2.4.15 (2024-07-27) =
* Fully tested with Contact Form 7 version 5.9.8

= 2.4.14 (2024-07-18) =
* Fix medium security problem (CVSS 4.3). Thanks to Wordfence for reporting this issue.
* Fully tested with Contact Form 7 version 5.9.7
* Tested up to WP 6.6

= 2.4.13 (2024-06-29) =
* Fully tested with Contact Form 7 version 5.9.6

= 2.4.12 (2024-05-25) =
* Fully tested with Contact Form 7 version 5.9.5

= 2.4.11 (2024-05-12) =
* PRO: multistep - Disable next button and prevent submitting while step is being validated.
* Fully tested with Contact Form 7 version 5.9.4

= 2.4.10 (2024-03-30) =
* Fix crappy release

= 2.4.9 (2024-03-30) =
* Fully tested with Contact Form 7 version 5.9.3

= 2.4.8 (2024-03-14) =
* Fully tested with Contact Form 7 version 5.9.2

= 2.4.7 (2024-02-13) =
* Fully tested with Contact Form 7 version 5.8.7

= 2.4.6 (2024-01-15) =
* Fully tested with Contact Form 7 version 5.8.6

= 2.4.5 (2023-12-19) =
* Fix bug with Multistep validation. Caused by cf7cf script not depending on cf7 script.
* Fully tested with Contact Form 7 version 5.8.5

= 2.4.4 (2023-12-10) =
* Fully tested with Contact Form 7 version 5.8.4

= 2.4.3 (2023-11-23) =
* Tested up to WP 6.4

= 2.4.2 (2023-11-22) =
* Prevent "CF7 needs to be installed" notice from being dismissable. (This notice is only shown to users with the update_plugins capability)
* Add nonce for dismissing other notices, so bad people who are stealing your session can't dismiss your precious CF7CF related notices on your behalf anymore. Hopefully now the people of Patchstack will be happy and stop marking this plugin as vulnerable.
* Tested up to WP 6.3
* Remove some unused constants

= 2.4.1 (2023-11-16) =
* Patch minor access-control vulnerability reported by [patchstack](https://patchstack.com/database/vulnerability/cf7-conditional-fields/wordpress-conditional-fields-for-contact-form-7-plugin-2-4-broken-access-control-vulnerability?_a_id=110)
* Fully tested with Contact Form 7 version 5.8.3

= 2.4 (2023-11-13) =
* Removed webpack build. (This might cause JS errors in outdated browsers.)
* Fix admin validator Error. Thanks to [joostdekeijzer](https://github.com/pwkip/contact-form-7-conditional-fields/pull/113)
* Fix some jQuery code. Thanks to [hirasso](https://github.com/pwkip/contact-form-7-conditional-fields/pull/111)

= 2.3.12 (2023-10-27) =
* Fully tested with Contact Form 7 version 5.8.2

= 2.3.11 (2023-10-03) =
* Fully tested with Contact Form 7 version 5.8.1

= 2.3.10 (2023-08-07) =
* Fully tested with Contact Form 7 version 5.8

= 2.3.9 (2023-05-31) =
* Fully tested with Contact Form 7 version 5.7.7

= 2.3.8 (2023-04-23) =
* Fully tested with Contact Form 7 version 5.7.6

= 2.3.7 (2023-04-13) =
* PRO: Fix obscure bug with disable_on_hide. Disabled fields didn't get recognized after calling reset() on the form element or after adding a repeater, causing conditions relying on disabled fields to malfunction.

= 2.3.6 (2023-04-11) =
* Fully tested with WP version 6.2

= 2.3.5 (2023-03-24) =
* Fully tested with Contact Form 7 version 5.7.5.1
* Note: Previously it was possible to add a contact-form shortcode with only the title and not the ID. But since the last update of CF7 this seems to throw an error. Use the official shortcode provided by CF7 to prevent this.

= 2.3.4 (2023-02-19) =
* Fully tested with Contact Form 7 version 5.7.4

= 2.3.3 (2023-01-26) =
* PRO: Fix [summary]. CF7 5.7.3 introduced a tag-check function which [summary] did not pass.
* Fully tested with Contact Form 7 version 5.7.3

= 2.3.2 (2022-12-28) =
* Fully tested with Contact Form 7 version 5.7.2

= 2.3.1 (2022-12-17) =
* PRO: fix problem with line breaks in multistep forms.

= 2.3 (2022-12-16) =
* Fully tested with Contact Form 7 version 5.7.1
* PRO: Changed containing element for repeater and step controls from DIV to P. Otherwise CF7 would create additional P elements. 

= 2.2.11 (2022-12-13) =
* DO NOT UPDATE TO CONTACT FORM VERSION 5.7!! At least wait for version 5.7.1 before updating
* Reverted autop-fix because it was causing addional errors.
* Reverted compatibility declaration to CF7 version 5.6.4

= 2.2.10 (2022-12-11) =
* Fully tested with Contact Form 7 version 5.7 (when WP_DEBUG is false). Note: due to some errors in Contact Form 7 version 5.7 you will need to make sure WP_DEBUG is set to false in your wp-config.php file.
* disable automatic insertion of paragraphs. Recent CF7 updates have changed the autop mechanism, causing too many problems with parsing the HTML code. If you still want to use autop (at your own risk) copy this code to your functions.php file: `add_filter( 'wpcf7_autop_or_not', '__return_true', 41, 0);`. Untill further notice Conditional Fields and Conditional Fields for Contact Form 7 will not use the automatic paragraph feature of CF7. Always try to write clean and valid HTML code. [GH issue 85](https://github.com/pwkip/contact-form-7-conditional-fields/issues/85)

= 2.2.9 (2022-10-19) =
* Fully tested with Contact Form 7 version 5.6.4
* Add action hook: [wpcf7cf_step_completed](https://conditional-fields-cf7.bdwm.be/wpcf7cf_step_completed/)

= 2.2.8 (2022-10-14) =
* Fix acceptance field bug

= 2.2.7 (2022-10-14) =
* Remove unwanted whitespace between closing and opening group tags in mail messages.
* Fix problems with acceptance fields [More info](https://conditional-fields-cf7.bdwm.be/acceptance/)
* Redesign of [form tester](https://conditional-fields-cf7.bdwm.be/form-tester/)

= 2.2.6 (2022-09-08) =
* PRO: Fix issues with validation in nested repeaters [GH issue 92](https://github.com/pwkip/contact-form-7-conditional-fields/issues/92)
* Fix error with optional file field in hidden group [GH issue 92](https://github.com/pwkip/contact-form-7-conditional-fields/issues/92)

= 2.2.5 (2022-09-04) =
* PRO: Fix bug with togglebutton

= 2.2.4 (2022-09-01) =
* Fully tested with Contact Form 7 version 5.6.3
* JS code refactoring
* Allow adding class names to group. For example: [group g class:my-class][/group]

= 2.2.3 (2022-08-10) =
* Fully tested with Contact Form 7 version 5.6.2
* [Fix](https://wordpress.org/support/topic/only-textmode-with-smartgrid-plugin/#post-15895061) for smartgrid plugin
* Some code refactoring

= 2.2.2 (2022-08-07) =
* Performance improvements

= 2.2.1 (2022-07-21) =
* Fully tested with Contact Form 7 version 5.6.1

= 2.2 (2022-06-17) =
* Make compatibile with Contact Form 7 version 5.6

= 2.1.6 (2022-06-07) =
* Fix bug: text view cleared after making a change to form code when there are more than 50 conditions.

= 2.1.5 (2022-05-22) =
* Fully tested with Contact Form 7 version 5.5.6.1

= 2.1.4 (2022-05-16) =
* It's no longer needed to save the form before adding conditions. Available groups are updated instantaneously after adding/changing them in the form editor.
* Fix problems when group is named "children" [GH issue 74](https://github.com/pwkip/contact-form-7-conditional-fields/issues/74)
* Fix problems with unsaved changes notice [GH issue 91](https://github.com/pwkip/contact-form-7-conditional-fields/issues/91)
* Tested up to WP 6.0

= 2.1.3 (2022-04-18) =
* check for user_cap 'wpcf7_edit_contact_forms' instead of 'wpcf7_edit_contact_form' in several places. Thanks, [@paybox](https://wordpress.org/support/topic/some-notices-appearing-fix-suggested/)!
* PRO multistep: make "Next step" and "Previous step" buttons translatable by third party plugins like wpml and loco translate.
* PRO multistep: show spinner while validating a step.
* PRO Fix additional disable_on_hide bug with multistep [GH issue 87-4](https://github.com/pwkip/contact-form-7-conditional-fields/issues/87)
* Replace all occurences of text domain 'contact-form-7' with 'cf7-conditional-fields'

= 2.1.2 (2022-02-23) =
* Fully tested with Contact Form 7 version 5.5.6

= 2.1.1 (2022-02-14) =
* Fully tested with Contact Form 7 version 5.5.5
* Make scroll to success message less annoying. [GH Issue 90](https://github.com/pwkip/contact-form-7-conditional-fields/issues/90)
* Add extra check to make sure that scroll to success message only happens when the e-mail is sent. [GH Issue 90](https://github.com/pwkip/contact-form-7-conditional-fields/issues/90)
* PRO: fix disable_on_hide bugs. [GH sssue 87](https://github.com/pwkip/contact-form-7-conditional-fields/issues/87) 

= 2.1 (2022-01-27) =
* Tested up to wp 5.9
* Scroll success message into view after successful form submission. [GH Issue 90](https://github.com/pwkip/contact-form-7-conditional-fields/issues/90)
* Small changes [GH PR 86](https://github.com/pwkip/contact-form-7-conditional-fields/pull/86)
* Make 'change' event bubble up [GH PR 88](https://github.com/pwkip/contact-form-7-conditional-fields/pull/88)

= 2.0.9 (2022-01-20) =
* Fully tested with Contact Form 7 version 5.5.4

= 2.0.8 (2021-11-28) =
* Check how code changes in CF7 related to `wpcf7_contact_form_properties` impact the plugin, and update TODO comments accordingly.
* Fully tested with Contact Form 7 version 5.5.3
* Write additional tests for forms loaded via AJAX
* only show compatibility notices to users with the update_plugins capabilities

= 2.0.7 (2021-10-26) =
* Fully tested with Contact Form 7 version 5.5.2 (and also make the warning message disappear if all plugins are up to date)

= 2.0.6 (2021-10-26) =
* Fully tested with Contact Form 7 version 5.5.2

= 2.0.5 (2021-10-13) =
* Fully tested with Contact Form 7 version 5.5.1

= 2.0.4 (2021-07-19) =
* Fix issue with required file fields
* Fully tested with Contact Form 7 version 5.4.2

= 2.0.3 (2021-05-02) =
* Fully tested with Contact Form 7 version 5.4.1
* (dev note: fixed automated tests)

= 2.0.2 (2021-04-06) =
* Fix bug: third-party required fields not triggering validation. Thanks [@dedotombo](https://wordpress.org/support/topic/bugfix-skip_validation_for_hidden_fields-issue/)!

= 2.0.1 (2021-03-31) =
* Force height:auto on groups. (Fixes regression errors with groups inside repeaters)
* Allow more funky characters as conditional fields values (there was a problem with less than sign <)
* Fix bug with hidden required file and multifile fields causing validation errors
* Implemented extra tests so these errors cannot reoccur in future updates.

= 2.0 (2021-03-29) =
* WARNING! 2.0 requires at least Contact Form 7 version 5.4 to work!
* Make plugin compatible with CF7 5.4
* Modify wpcf7cf_generate_summary function, so it can be used without $_POST
* fix animaton when showing group

= Versions 0.1 - 1.9.16 (2020-06-04 - 2021-03-09) =
* [Full changelog](https://conditional-fields-cf7.bdwm.be/changelog/)