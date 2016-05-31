(function($) {
    //if (wpcf7cf_options == null) var wpcf7cf_options = [];
	console.log(wpcf7cf_options);
	
$(document).ready(function() {
    function display_fields() {
        console.log('display fields');
        $('.wpcf7cf_group').hide();
        for (var i=0; i < wpcf7cf_options.length; i++) {

            var condition = wpcf7cf_options[i];
            console.log(condition);
            if (condition.then_visibility == 'hide') continue;

            if ($('[name='+condition.if_field+']').length) {

                // single field

                $field = $('[name='+condition.if_field+']');
                if (condition.operator == 'equals' && $field.val() == condition.if_value || condition.operator == 'not equals' && $field.val() != condition.if_value) {
                    $('#'+condition.then_field).show();
                }

            } else if ($('[name='+condition.if_field+'\\[\\]]').length) {

                // multiple fields (checkboxes)

                $fields = $('[name='+condition.if_field+'\\[\\]]');

                var all_values = [];
                var checked_values = [];
                $fields.each(function() {
                    all_values.push($(this).val());
                    if($(this).is(':checked')) {
                        checked_values.push($(this).val());
                    }
                });

                console.log(all_values);
                console.log(checked_values);
                console.log(condition.operator);
                console.log(condition.if_value);
                console.log(condition.then_field);

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
