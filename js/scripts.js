var cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

(function($) {

    var i=0;
    var options = [];

    var show_animation = { "height": "show", "marginTop": "show", "marginBottom": "show", "paddingTop": "show", "paddingBottom": "show" };
    var hide_animation = { "height": "hide", "marginTop": "hide", "marginBottom": "hide", "paddingTop": "hide",  "paddingBottom": "hide" };

    $('.wpcf7').each(function(){

        // Bug fix thanks to 972 creative (@toddedelman) https://wordpress.org/support/topic/conditional-fields-not-opening-using-radio-buttons/#post-10442923

        var $this = $(this);
        var options_element = $this.find('input[name="_wpcf7cf_options"]').eq(0);
        if (options_element.length) {
            var value = options_element.val();
            if (value) {
                form_options = JSON.parse(value);
                form_options.unit_tag = $this.attr('id');
                options.push(form_options);
            }
        }
    });

    $(document).ready(function() {

        //wpcf7pro-togglebutton

        $('.wpcf7cf-togglebutton').click(function() {
            $this = $(this);
            if ($this.text() == $this.data('val-1')) {
                $this.text($this.data('val-2'));
                $this.val($this.data('val-2'));
            } else {
                $this.text($this.data('val-1'));
                $this.val($this.data('val-1'));
            }
        });


        function display_fields(unit_tag, wpcf7cf_conditions, wpcf7cf_settings) {

            $current_form = $('#'+unit_tag);
            $groups = $("[data-class='wpcf7cf_group']",$current_form);

            //for compatibility with contact-form-7-signature-addon
            if (cf7signature_resized == 0 && typeof signatures !== 'undefined' && signatures.constructor === Array && signatures.length > 0 ) {
                for (var i = 0; i < signatures.length; i++) {
                    if (signatures[i].canvas.width == 0) {

                        jQuery(".wpcf7-form-control-signature-body>canvas").eq(i).attr('width', jQuery(".wpcf7-form-control-signature-wrap").width());
                        jQuery(".wpcf7-form-control-signature-body>canvas").eq(i).attr('height', jQuery(".wpcf7-form-control-signature-wrap").height());

                        cf7signature_resized = 1;
                    }
                }
            }

            $groups.addClass('wpcf7cf-hidden');

            for (var i=0; i < wpcf7cf_conditions.length; i++) {

                var condition = wpcf7cf_conditions[i];

                // compatibility with conditional forms created with older versions of the plugin ( < 1.4 )
                if (!('and_rules' in condition)) {
                    condition.and_rules = [{'if_field':condition.if_field,'if_value':condition.if_value,'operator':condition.operator}];
                }

                var show_group = should_group_be_shown(condition, $current_form);

                if (show_group) {
                    $('[data-id='+condition.then_field+']',$current_form).eq(0).removeClass('wpcf7cf-hidden');
                }
            }

            var animation_intime = parseInt(wpcf7cf_settings.animation_intime);
            var animation_outtime = parseInt(wpcf7cf_settings.animation_outtime);

            if (wpcf7cf_settings.animation === 'no') {
                animation_intime = 0;
                animation_outtime = 0;
            }

            $groups.each(function (index) {
                $group = $(this);
                if ($group.is(':animated')) $group.finish(); // stop any current animations on the group

                if ($group.css('display') === 'none' && !$group.hasClass('wpcf7cf-hidden')) { // show the group

                    if ($group.prop('tagName') === 'SPAN') {
                        $group.show().trigger('wpcf7cf_show_group'); // Never animate inline groups because it tends to look messy.
                    } else {
                        $group.animate(show_animation, animation_intime).trigger('wpcf7cf_show_group'); // show
                    }

                } else if ($group.css('display') !== 'none' && $group.hasClass('wpcf7cf-hidden')) { // hide the group


                    if ($group.attr('data-clear_on_hide') !== undefined) {
                        $inputs = $(':input', $group).not(':button, :submit, :reset, :hidden');
                        $inputs.prop('checked', false).prop('selected', false).prop('selectedIndex', 0);
                        $inputs.not('[type=checkbox],[type=radio],select').val('');
                        $inputs.change();
                        //display_fields();
                    }

                    if ($group.prop('tagName') === 'SPAN') {
                        $group.hide().trigger('wpcf7cf_hide_group'); // Never animate inline groups because it tends to look messy.
                    } else {
                        $group.animate(hide_animation, animation_outtime).trigger('wpcf7cf_hide_group');
                    }

                }
            });

            wpcf7cf_update_hidden_fields($current_form);
        }

        var timeout;

        for (var i = 0; i<options.length; i++) {

            var unit_tag = options[i]['unit_tag'];
            var conditions = options[i]['conditions'];
            var settings = options[i]['settings'];

            display_fields(unit_tag, conditions, settings);

            $('#'+unit_tag+' input, #'+unit_tag+' select, #'+unit_tag+' textarea, #'+unit_tag+' button').on('input paste change click',{unit_tag:unit_tag, conditions:conditions, settings:settings}, function(e) {
                clearTimeout(timeout);
                timeout = setTimeout(display_fields, 100, e.data.unit_tag, e.data.conditions, e.data.settings);
            });

            // bring form in initial state if
            $('#'+unit_tag+' form').on('reset', {unit_tag:unit_tag, conditions:conditions, settings:settings}, function(e) {
                setTimeout(display_fields, 200, e.data.unit_tag, e.data.conditions, e.data.settings);
            });
        }

        // Also add hidden fields in case a form gets submitted without any input:
        $('form.wpcf7-form').each(function(){
            wpcf7cf_update_hidden_fields($(this));
        });
    });

    function wpcf7cf_update_hidden_fields($form) {

        $hidden_group_fields = $form.find('[name="_wpcf7cf_hidden_group_fields"]');
        $hidden_groups = $form.find('[name="_wpcf7cf_hidden_groups"]');
        $visible_groups = $form.find('[name="_wpcf7cf_visible_groups"]');
        $repeaters = $form.find('[name="_wpcf7cf_repeaters"]');

        var hidden_fields = [];
        var hidden_groups = [];
        var visible_groups = [];

        $form.find('[data-class="wpcf7cf_group"]').each(function () {
            var $this = $(this);
            if ($this.hasClass('wpcf7cf-hidden')) {
                hidden_groups.push($this.data('id'));
                $this.find('input,select,textarea').each(function () {
                    hidden_fields.push($(this).attr('name'));
                });
            } else {
                visible_groups.push($this.data('id'));
            }
        });

        $hidden_group_fields.val(JSON.stringify(hidden_fields));
        $hidden_groups.val(JSON.stringify(hidden_groups));
        $visible_groups.val(JSON.stringify(visible_groups));

        return true;
    }

    //reset the form completely
    $( document ).ajaxComplete(function(e,xhr) {
        if( typeof xhr.responseJSON !== 'undefined' &&
            typeof xhr.responseJSON.mailSent !== 'undefined' &&
            typeof xhr.responseJSON.into !== 'undefined' &&
            xhr.responseJSON.mailSent === true)
        {
            $( xhr.responseJSON.into + ' input, '+xhr.responseJSON.into+' select, ' + xhr.responseJSON.into + ' textarea, ' + xhr.responseJSON.into + ' button' ).change();
        }
    });

    // fix for exclusive checkboxes in IE (this will call the change-event again after all other checkboxes are unchecked, triggering the display_fields() function)
    var old_wpcf7ExclusiveCheckbox = $.fn.wpcf7ExclusiveCheckbox;
    $.fn.wpcf7ExclusiveCheckbox = function() {
        return this.find('input:checkbox').click(function() {
            var name = $(this).attr('name');
            $(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false).eq(0).change();
        });
    };




    function should_group_be_shown(condition, $current_form) {

        var show_group = true;

        for (var and_rule_i = 0; and_rule_i < condition.and_rules.length; and_rule_i++) {

            var condition_ok = false;

            var condition_and_rule = condition.and_rules[and_rule_i];

            var regex_patt = new RegExp(condition_and_rule.if_value, 'i');

            $field = $('[name="' + condition_and_rule.if_field + '"], [name="' + condition_and_rule.if_field + '[]"], [data-original-name="' + condition_and_rule.if_field + '"], [data-original-name="' + condition_and_rule.if_field + '[]"]',$current_form); //, [data-original-name="' + condition_and_rule.if_field + '"]

            //TODO: ignore everything outside the sub_repeater if field is inside sub_repeater

            if ($field.length == 1) {

                // single field (tested with text field, single checkbox, select with single value (dropdown), select with multiple values)

                if ($field.is('select')) {

                    if (condition_and_rule.operator == 'not equals') {
                        condition_ok = true;
                    }

                    $field.find('option:selected').each(function () {
                        var $option = $(this);
                        if (
                            condition_and_rule.operator == 'equals' && $option.val() == condition_and_rule.if_value ||
                            condition_and_rule.operator == 'equals (regex)' && regex_patt.test($option.val())
                        ) {
                            condition_ok = true;
                        } else if (
                            condition_and_rule.operator == 'not equals' && $option.val() == condition_and_rule.if_value ||
                            condition_and_rule.operator == 'not equals (regex)' && !regex_patt.test($option.val())
                        ) {
                            condition_ok = false;
                        }
                    });

                    show_group = show_group && condition_ok;

                    return show_group;
                }

                if ($field.attr('type') == 'checkbox') {
                    if (
                        condition_and_rule.operator == 'equals' && $field.is(':checked') && $field.val() == condition_and_rule.if_value ||
                        condition_and_rule.operator == 'not equals' && !$field.is(':checked') ||
                        condition_and_rule.operator == 'is empty' && !$field.is(':checked') ||
                        condition_and_rule.operator == 'not empty' && $field.is(':checked') ||
                        condition_and_rule.operator == '>' && $field.is(':checked') && $field.val() > condition_and_rule.if_value ||
                        condition_and_rule.operator == '<' && $field.is(':checked') && $field.val() < condition_and_rule.if_value ||
                        condition_and_rule.operator == '>=' && $field.is(':checked') && $field.val() >= condition_and_rule.if_value ||
                        condition_and_rule.operator == '<=' && $field.is(':checked') && $field.val() <= condition_and_rule.if_value ||
                        condition_and_rule.operator == 'equals (regex)' && $field.is(':checked') && regex_patt.test($field.val()) ||
                        condition_and_rule.operator == 'not equals (regex)' && !$field.is(':checked')
                    ) {
                        condition_ok = true;
                    }
                } else if (
                    ( condition_and_rule.operator == 'equals' && $field.val() == condition_and_rule.if_value ) ||
                    ( condition_and_rule.operator == 'not equals' && $field.val() != condition_and_rule.if_value ) ||
                    ( condition_and_rule.operator == 'equals (regex)' && regex_patt.test($field.val())      ) ||
                    ( condition_and_rule.operator == 'not equals (regex)' && !regex_patt.test($field.val())     ) ||
                    ( condition_and_rule.operator == '>' && $field.val() > condition_and_rule.if_value  ) ||
                    ( condition_and_rule.operator == '<' && $field.val() < condition_and_rule.if_value  ) ||
                    ( condition_and_rule.operator == '>=' && $field.val() >= condition_and_rule.if_value ) ||
                    ( condition_and_rule.operator == '<=' && $field.val() <= condition_and_rule.if_value ) ||
                    ( condition_and_rule.operator == 'is empty' && $field.val() == ''                 ) ||
                    ( condition_and_rule.operator == 'not empty' && $field.val() != ''                 )
                ) {
                    condition_ok = true;
                }


            } else if ($field.length > 1) {

                // multiple fields (tested with checkboxes, exclusive checkboxes, dropdown with multiple values)

                var all_values = [];
                var checked_values = [];
                $field.each(function () {
                    all_values.push($(this).val());
                    if ($(this).is(':checked')) {
                        checked_values.push($(this).val());
                    }
                });

                var checked_value_index = $.inArray(condition_and_rule.if_value, checked_values);
                var value_index = $.inArray(condition_and_rule.if_value, all_values);

                if (
                    ( condition_and_rule.operator == 'is empty' && checked_values.length == 0 ) ||
                    ( condition_and_rule.operator == 'not empty' && checked_values.length > 0  )
                ) {
                    condition_ok = true;
                }


                for (var ind = 0; ind < checked_values.length; ind++) {
                    if (
                        ( condition_and_rule.operator == 'equals' && checked_values[ind] == condition_and_rule.if_value ) ||
                        ( condition_and_rule.operator == 'not equals' && checked_values[ind] != condition_and_rule.if_value ) ||
                        ( condition_and_rule.operator == 'equals (regex)' && regex_patt.test(checked_values[ind])      ) ||
                        ( condition_and_rule.operator == 'not equals (regex)' && !regex_patt.test(checked_values[ind])     ) ||
                        ( condition_and_rule.operator == '>' && checked_values[ind] > condition_and_rule.if_value  ) ||
                        ( condition_and_rule.operator == '<' && checked_values[ind] < condition_and_rule.if_value  ) ||
                        ( condition_and_rule.operator == '>=' && checked_values[ind] >= condition_and_rule.if_value ) ||
                        ( condition_and_rule.operator == '<=' && checked_values[ind] <= condition_and_rule.if_value )
                    ) {
                        condition_ok = true;
                    }
                }
            }

            show_group = show_group && condition_ok;
        }

        return show_group;

    }


    //removed pro functions

})( jQuery );