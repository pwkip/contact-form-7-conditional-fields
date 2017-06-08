var cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

(function($) {

    var i=0;
    var options = [];
    // while (true) {
    //     i++;
    //     if ('wpcf7cf_options_'+i in window) {
    //         options.push(window['wpcf7cf_options_'+i]);
    //         continue;
    //     }
    //     break;
    // }

    $('.wpcf7').each(function(){
        $this = $(this);
        form_options = JSON.parse($this.find('input[name="_wpcf7cf_options"]').eq(0).val());
        form_options.unit_tag = $this.attr('id');
        options.push(form_options);
    });

    $(document).ready(function() {
        function display_fields(unit_tag, wpcf7cf_conditions, wpcf7cf_settings) {

            $current_form = $('#'+unit_tag);

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

            $("#"+unit_tag+" [data-class='wpcf7cf_group']").addClass('wpcf7cf-hidden');

            for (var i=0; i < wpcf7cf_conditions.length; i++) {

                var condition = wpcf7cf_conditions[i];

                var regex_patt = new RegExp(condition.if_value,'i');

                $field = $('#'+unit_tag+' [name="'+condition.if_field+'"]').length ? $('#'+unit_tag+' [name="'+condition.if_field+'"]') : $('#'+unit_tag+' [name="'+condition.if_field+'[]"]');

                if ($field.length == 1) {

                    // single field (tested with text field, single checkbox, select with single value (dropdown), select with multiple values)

                    if ($field.is('select')) {

                        var show = false;

                        if(condition.operator == 'not equals') {
                            show = true;
                        }

                        $field.find('option:selected').each(function () {
                            var $option = $(this);
                            if (
                                condition.operator == 'equals' && $option.val() == condition.if_value ||
                                condition.operator == 'equals (regex)' && regex_patt.test($option.val())
                            ) {
                                show = true;
                            } else if (
                                condition.operator == 'not equals' && $option.val() == condition.if_value ||
                                condition.operator == 'not equals (regex)' && !regex_patt.test($option.val())
                            ) {
                                show = false;
                            }
                        });

                        if(show == true) {
                            $('#' + unit_tag + ' #' + condition.then_field).removeClass('wpcf7cf-hidden');
                        }

                        continue;
                    }

                    if ($field.attr('type') == 'checkbox') {
                        if (
                            condition.operator == 'equals'             && $field.is(':checked')  && $field.val() == condition.if_value ||
                            condition.operator == 'not equals'         && !$field.is(':checked')                                       ||
                            condition.operator == 'is empty'           && !$field.is(':checked')                                       ||
                            condition.operator == 'not empty'          && $field.is(':checked')                                        ||
                            condition.operator == '>'                  && $field.is(':checked')  && $field.val() > condition.if_value  ||
                            condition.operator == '<'                  && $field.is(':checked')  && $field.val() < condition.if_value  ||
                            condition.operator == '>='                 && $field.is(':checked')  && $field.val() >= condition.if_value ||
                            condition.operator == '<='                 && $field.is(':checked')  && $field.val() <= condition.if_value ||
                            condition.operator == 'equals (regex)'     && $field.is(':checked')  && regex_patt.test($field.val())      ||
                            condition.operator == 'not equals (regex)' && !$field.is(':checked')
                        ) {
                            $('#'+unit_tag+' #'+condition.then_field).removeClass('wpcf7cf-hidden');
                        }
                    } else if (
                        ( condition.operator == 'equals'             && $field.val() == condition.if_value ) ||
                        ( condition.operator == 'not equals'         && $field.val() != condition.if_value ) ||
                        ( condition.operator == 'equals (regex)'     && regex_patt.test($field.val())      ) ||
                        ( condition.operator == 'not equals (regex)' && !regex_patt.test($field.val())     ) ||
                        ( condition.operator == '>'                  && $field.val() > condition.if_value  ) ||
                        ( condition.operator == '<'                  && $field.val() < condition.if_value  ) ||
                        ( condition.operator == '>='                 && $field.val() >= condition.if_value ) ||
                        ( condition.operator == '<='                 && $field.val() <= condition.if_value ) ||
                        ( condition.operator == 'is empty'           && $field.val() == ''                 ) ||
                        ( condition.operator == 'not empty'          && $field.val() != ''                 )
                    ) {
                        $('#'+unit_tag+' #'+condition.then_field).removeClass('wpcf7cf-hidden');
                    }


                } else if ($field.length > 1) {

                    // multiple fields (tested with checkboxes, exclusive checkboxes, dropdown with multiple values)

                    var all_values = [];
                    var checked_values = [];
                    $field.each(function() {
                        all_values.push($(this).val());
                        if($(this).is(':checked')) {
                            checked_values.push($(this).val());
                        }
                    });

                    var checked_value_index = $.inArray(condition.if_value, checked_values);
                    var value_index = $.inArray(condition.if_value, all_values);

                    if (
                        ( condition.operator == 'is empty'   && checked_values.length == 0 ) ||
                        ( condition.operator == 'not empty'  && checked_values.length > 0  )
                    ) {
                        $('#'+unit_tag+' #'+condition.then_field).removeClass('wpcf7cf-hidden');
                    }


                    for(var ind=0; ind<checked_values.length; ind++) {
                        if (
                            ( condition.operator == 'equals' &&              checked_values[ind] == condition.if_value ) ||
                            ( condition.operator == 'not equals' &&          checked_values[ind] != condition.if_value ) ||
                            ( condition.operator == 'equals (regex)' &&      regex_patt.test(checked_values[ind])      ) ||
                            ( condition.operator == 'not equals (regex)' &&  !regex_patt.test(checked_values[ind])     ) ||
                            ( condition.operator == '>' &&                   checked_values[ind] > condition.if_value  ) ||
                            ( condition.operator == '<' &&                   checked_values[ind] < condition.if_value  ) ||
                            ( condition.operator == '>=' &&                  checked_values[ind] >= condition.if_value ) ||
                            ( condition.operator == '<=' &&                  checked_values[ind] <= condition.if_value )
                        ) {
                            $('#'+unit_tag+' #'+condition.then_field).removeClass('wpcf7cf-hidden');
                        }
                    }
                }
            }

            var show_animation = { "height": "show", "marginTop": "show", "marginBottom": "show", "paddingTop": "show", "paddingBottom": "show" };
            var hide_animation = { "height": "hide", "marginTop": "hide", "marginBottom": "hide", "paddingTop": "hide",  "paddingBottom": "hide" };

            var animation_intime = parseInt(wpcf7cf_settings.animation_intime);
            var animation_outtime = parseInt(wpcf7cf_settings.animation_outtime);

            if (wpcf7cf_settings.animation == 'no') {
                animation_intime = 0;
                animation_outtime = 0;
            }

            $("#" + unit_tag + " [data-class='wpcf7cf_group']").each(function (index) {
                $group = $(this);
                if ($group.is(':animated')) $group.finish(); // stop any current animations on the group
                if ($group.css('display') == 'none' && !$group.hasClass('wpcf7cf-hidden')) {
                    $group.animate(show_animation, animation_intime); // show
                } else if ($group.css('display') != 'none' && $group.hasClass('wpcf7cf-hidden')) {
                    $group.animate(hide_animation, animation_outtime); // hide
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

            $('#'+unit_tag+' input, #'+unit_tag+' select, #'+unit_tag+' textarea').on('input paste change',{unit_tag:unit_tag, conditions:conditions, settings:settings}, function(e) {
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

        var hidden_fields = [];
        var hidden_groups = [];
        var visible_groups = [];

        $form.find('[data-class="wpcf7cf_group"]').each(function () {
            var $this = $(this);
            if ($this.hasClass('wpcf7cf-hidden')) {
                hidden_groups.push($this.attr('id'));
                $this.find('input,select,textarea').each(function () {
                    hidden_fields.push($(this).attr('name'));
                });
            } else {
                visible_groups.push($this.attr('id'));
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
            $( xhr.responseJSON.into + ' input, '+xhr.responseJSON.into+' select, ' + xhr.responseJSON.into + ' textarea' ).change();
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

})( jQuery );
