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
                if (condition.then_visibility == 'hide') continue;

                $field = $('#'+unit_tag+' [name='+condition.if_field+']').length ? $('#'+unit_tag+' [name='+condition.if_field+']') : $('#'+unit_tag+' [name='+condition.if_field+'\\[\\]]');

                if ($field.length == 1) {

                    // single field (tested with text field, single checkbox, select with single value (dropdown), select with multiple values)

                    if ($field.is('select')) {
                        $field.find('option:selected').each(function() {
                            var $option = $(this);
                            if (condition.operator == 'equals' && $option.val() == condition.if_value) {
                                $('#'+unit_tag+' #'+condition.then_field).show();
                            }
                        });
                        continue;
                    }

                    if (condition.operator == 'equals' && $field.val() == condition.if_value || condition.operator == 'not equals' && $field.val() != condition.if_value) {
                        if ($field.attr('type') == 'checkbox' && !$field.attr('checked')) continue;
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
                display_fields(e.data.unit_tag, e.data.conditions);
            });
        }

    });
	
})( jQuery );
