var cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

(function($) {

    var i=0;
    var options = [];
    while (true) {
        i++;
        if ('wpcf7cf_options_'+i in window) {
            options.push(window['wpcf7cf_options_'+i]);
            continue;
        }
        break;
    }

    $(document).ready(function() {
        function display_fields(unit_tag, wpcf7cf_conditions) {

            //for compatibility with contact-form-7-signature-addon
            if (cf7signature_resized == 0 && typeof signatures !== 'undefined' && signatures.constructor === Array && signatures.length > 0 ) {
                if (signatures[0].canvas.width == 0) {
                    for (var i = 0; i < signatures.length; i++) {

                        jQuery(".wpcf7-form-control-signature-body>canvas").eq(0).attr('width', jQuery(".wpcf7-form-control-signature-wrap").width());
                        jQuery(".wpcf7-form-control-signature-body>canvas").eq(0).attr('height', jQuery(".wpcf7-form-control-signature-wrap").height());

                        cf7signature_resized = 1;
                    }
                }
            }

            $("#"+unit_tag+" [data-class='wpcf7cf_group']").hide();
            for (var i=0; i < wpcf7cf_conditions.length; i++) {

                var condition = wpcf7cf_conditions[i];

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
                            if (condition.operator == 'equals' && $option.val() == condition.if_value) {
                                show = true;
                            } else if (condition.operator == 'not equals' && $option.val() == condition.if_value) {
                                show = false;
                            }
                        });

                        if(show == true) {
                            $('#' + unit_tag + ' #' + condition.then_field).show();
                        }

                        continue;
                    }

                    if ($field.attr('type') == 'checkbox') {
                        if (
                                $field.is(':checked') && condition.operator == 'equals'     && $field.val() == condition.if_value
                            || !$field.is(':checked') && condition.operator == 'not equals' && $field.val() == condition.if_value
                            || condition.operator == 'not equals' && $field.val() != condition.if_value
                        ) {
                            $('#'+unit_tag+' #'+condition.then_field).show();
                        }
                    } else if (condition.operator == 'equals' && $field.val() == condition.if_value || condition.operator == 'not equals' && $field.val() != condition.if_value) {
                        $('#'+unit_tag+' #'+condition.then_field).show();
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



                    if (condition.operator == 'equals' && $.inArray(condition.if_value, checked_values) != -1) {
                        $('#'+unit_tag+' #'+condition.then_field).show();
                    } else if (condition.operator == 'not equals' && $.inArray(condition.if_value, all_values) != -1 && $.inArray(condition.if_value, checked_values) == -1) {
                        $('#'+unit_tag+' #'+condition.then_field).show();
                    }
                }

            }
        }

        for (var i = 0; i<options.length; i++) {
            var unit_tag = options[i]['unit_tag'];
            var conditions = options[i]['conditions'];
            display_fields(unit_tag, conditions);
            $('#'+unit_tag+' input, #'+unit_tag+' select, #'+unit_tag+' textarea').change({unit_tag:unit_tag, conditions:conditions}, function(e) {
                console.log('change');
                display_fields(e.data.unit_tag, e.data.conditions);
            });
        }

        // before the form values are serialized to submit via ajax, we quickly add all invisible fields in the hidden
        // _wpcf7cf_hidden_group_fields field, so the PHP code knows which fields were inside hidden groups.
        // TODO: maybe modify this code so it only takes fields which are strictly inside hidden group tags.
        // TODO: For now the hidden field is filled with all hidden form elements.

        $('form.wpcf7-form').on('form-pre-serialize', function(form,options,veto) {
            $form = $(form.target);

            $hidden_group_fields = $form.find('[name="_wpcf7cf_hidden_group_fields"]');
            $hidden_groups = $form.find('[name="_wpcf7cf_hidden_groups"]');
            $visible_groups = $form.find('[name="_wpcf7cf_visible_groups"]');

            var hidden_fields = [];
            var hidden_groups = [];
            var visible_groups = [];

            $form.find('input:hidden,select:hidden,textarea:hidden').each(function () {
                hidden_fields.push($(this).attr('name'));
            });

            $form.find('[data-class="wpcf7cf_group"]:hidden').each(function () {
                hidden_groups.push($(this).attr('id'));
            });

            $form.find('[data-class="wpcf7cf_group"]:visible').each(function () {
                visible_groups.push($(this).attr('id'));
            });

            $($hidden_group_fields).val(JSON.stringify(hidden_fields));
            $($hidden_groups).val(JSON.stringify(hidden_groups));
            $($visible_groups).val(JSON.stringify(visible_groups));

            return true;
        });
    });

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
            console.log('new func');
            $(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false).eq(0).change();
        });
    };

})( jQuery );
