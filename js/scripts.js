(function($) {
    if (typeof wpcf7cf_options == 'undefined') return; // return if there is no form on the page
	//console.log(wpcf7cf_options);
	
$(document).ready(function() {
    function display_fields() {
        $('[data-class=wpcf7cf_group]').hide();
        for (var i=0; i < wpcf7cf_options.length; i++) {

            var condition = wpcf7cf_options[i];
            if (condition.then_visibility == 'hide') continue;

            $field = $('[name='+condition.if_field+']').length ? $('[name='+condition.if_field+']') : $('[name='+condition.if_field+'\\[\\]]');

            if ($field.length == 1) {

                // single field (tested with text field, single checkbox, select with single value (dropdown), select with multiple values)

                if ($field.is('select')) {
                    $field.find('option:selected').each(function() {
                        var $option = $(this);
                        if (condition.operator == 'equals' && $option.val() == condition.if_value) {
                            $('#'+condition.then_field).show();
                        }
                    });
                    continue;
                }

                if (condition.operator == 'equals' && $field.val() == condition.if_value || condition.operator == 'not equals' && $field.val() != condition.if_value) {
                    if ($field.attr('type') == 'checkbox' && !$field.attr('checked')) continue;
                    $('#'+condition.then_field).show();
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
                    $('#'+condition.then_field).show();
                } else if (condition.operator == 'not equals' && $.inArray(condition.if_value, all_values) != -1 && $.inArray(condition.if_value, checked_values) == -1) {
                    $('#'+condition.then_field).show();
                }
            }

        }
    }
    display_fields();
    $('input, select, textarea').change(display_fields);
});
	
})( jQuery );
