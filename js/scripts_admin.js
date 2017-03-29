/**
 * Created by jules on 7/17/2015.
 */

var old_compose = _wpcf7.taggen.compose;

(function($) {

    // ...before overwriting the jQuery extension point
    _wpcf7.taggen.compose = function(tagType, $form)
    {

       $('#tag-generator-panel-group-style-hidden').val($('#tag-generator-panel-group-style').val());

        // original behavior - use function.apply to preserve context
        var ret = old_compose.apply(this, arguments);
        //tagType = arguments[0];
        //$form = arguments[1];

        // START: code here will be executed after the _wpcf7.taggen.update function
        if (tagType== 'group') ret += "[/group]";
        // END

        return ret;
    };

    var index = $('#wpcf7cf-entries .entry').length;

    $('.delete-button').click(function(){

        //if (confirm('You sure?')===false) return false;
        $(this).parent().remove();
        return false;

    });

    $('#wpcf7cf-add-button').click(function(){

        var id = add_condition_fields();

        return false;

    });

    function clear_all_condition_fields() {
        $('.entry').remove();
    }

    function add_condition_fields() {
        var $delete_button = $('#wpcf7cf-delete-button').clone().removeAttr('id');
        $('<div class="entry" id="entry-'+index+'">'+($('#wpcf7cf-new-entry').html().replace(/{id}/g, index))+'</div>').prependTo('#wpcf7cf-entries').append($delete_button);
        $delete_button.click(function(){
            $(this).parent().remove();
            return false;
        });
        index++;

        return (index-1);
    }

    function import_condition_fields() {
        var lines = $('#wpcf7cf-settings-text').val().split(/\r?\n/);
        for (var i = lines.length+1; i>-1; i--) {

            var str = lines[i];

            var match = regex.exec(str);

            if (match == null) continue;

            var id = add_condition_fields();

            $('#entry-'+id+' .if-field-select').val(match[1]);
            $('#entry-'+id+' .operator').val(match[2]);
            $('#entry-'+id+' .if-value').val(match[3]);
            $('#entry-'+id+' .then-field-select').val(match[4]);

            regex.lastIndex = 0;
        }
    }

    // export/import settings

    $('#wpcf7cf-settings-text-wrap').hide();

    $('#wpcf7cf-settings-to-text').click(function() {
        $('#wpcf7cf-settings-text-wrap').show();

        $('#wpcf7cf-settings-text').val('');
        $('#wpcf7cf-entries .entry').each(function() {
            var $entry = $(this);
            var line = 'if [' + $entry.find('.if-field-select').val() + ']'
                + ' ' + $entry.find('.operator').val()
                + ' "' + $entry.find('.if-value').val() + '" then show'
                + ' [' + $entry.find('.then-field-select').val() + ']';
            $('#wpcf7cf-settings-text').val($('#wpcf7cf-settings-text').val() + line + "\n" ).select();
        });
        return false;
    });

    var regex = /if \[(.*)] (equals|not equals|equals \(regex\)|not equals \(regex\)|>|>=|<=|<|is empty|not empty) "(.*)" then show \[(.*)]/g;

    $('#add-fields').click(function() {
        import_condition_fields();
        update_entries();
        return false;
    });

    $('#overwrite-fields').click(function() {
        clear_all_condition_fields();
        import_condition_fields();
        update_entries();
        return false;
    });

    $('#wpcf7cf-settings-text-clear').click(function() {
        $('#wpcf7cf-settings-text-wrap').hide();
        $('#wpcf7cf-settings-text').val('');
        return false;
    });

    function update_entries() {
        $('.if-value').css({'visibility':'visible'});
        $('.entry').each(function() {
            var $entry = $(this);
            if ($entry.find('.operator').eq(0).val() == 'is empty' || $entry.find('.operator').eq(0).val() == 'not empty') {
                $entry.find('.if-value').eq(0).css({'visibility':'hidden'});
            }
        });
    }

    update_entries();
    $('.operator').change(function() {
        update_entries();
    });


})( jQuery );
