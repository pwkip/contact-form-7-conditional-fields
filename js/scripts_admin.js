/**
 * Created by jules on 7/17/2015.
 */

if (_wpcf7 == null) { var _wpcf7 = wpcf7}; // wpcf7 4.8 fix

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
        $('.if-value').autocomplete( "disable" );

        $('.entry').each(function() {
            var $entry = $(this);
            if ($entry.find('.operator').eq(0).val() == 'is empty' || $entry.find('.operator').eq(0).val() == 'not empty') {
                $entry.find('.if-value').eq(0).css({'visibility':'hidden'});
            } else if ($entry.find('.operator').eq(0).val().endsWith('(regex)')) {
                $entry.find('.if-value').eq(0).autocomplete( "enable" );
            }
        });
    }

    var regexes = [
        { label: wpcf7cf_options_0.regex_email_label, desc: wpcf7cf_options_0.regex_email },
        { label: wpcf7cf_options_0.regex_numeric_label, desc: wpcf7cf_options_0.regex_numeric },
        { label: wpcf7cf_options_0.regex_alphanumeric_label, desc: wpcf7cf_options_0.regex_alphanumeric },
        { label: wpcf7cf_options_0.regex_alphabetic_label, desc: wpcf7cf_options_0.regex_alphabetic },
        { label: wpcf7cf_options_0.regex_date_label, desc: wpcf7cf_options_0.regex_date },
        { label: wpcf7cf_options_0.regex_custom_1_label, desc: wpcf7cf_options_0.regex_custom_1 },
        { label: wpcf7cf_options_0.regex_custom_2_label, desc: wpcf7cf_options_0.regex_custom_2 },
        { label: wpcf7cf_options_0.regex_custom_3_label, desc: wpcf7cf_options_0.regex_custom_3 },
        { label: wpcf7cf_options_0.regex_custom_4_label, desc: wpcf7cf_options_0.regex_custom_4 },
        { label: wpcf7cf_options_0.regex_custom_5_label, desc: wpcf7cf_options_0.regex_custom_5 },
    ];

    var i = regexes.length;
    while (i--) {
        if (null == regexes[i].label || null == regexes[i].desc || regexes[i].label == '' || regexes[i].desc == '') {
            regexes.splice(i,1);
        }
    }

    var termTemplate = "<span class='ui-autocomplete-term'>%s</span>";

    $('.if-value').autocomplete({
        disabled: true,
        source: function(request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response($.grep(regexes, function(value) {
                return matcher.test(value.label || value.value || value) || matcher.test(value.desc);
            }));
        },
        focus: function( event, ui ) {
            $( event.target ).val( ui.item.desc );
            return false;
        },
        select: function( event, ui ) {
            $( event.target ).val( ui.item.desc );
            return false;
        },
        open: function(e,ui) {
            $el = $(e.target);
            var styledTerm = termTemplate.replace('%s', $el.val());

            $('.ui-autocomplete').find('em').each(function() {
                var me = $(this);
                me.html( me.text().replace($el.val(), styledTerm) );
            });
        }
    }).each(function() {
        $(this).autocomplete( "instance" )._renderItem = function( ul, item ) {
            return $("<li>")
            .append("<div><em>" + item.label + "</em><br><em>" + item.desc + "</em></div>")
            .appendTo(ul);
        }
    });

    update_entries();

    $('.operator').change(function() {
        update_entries();
    });

    // ------------------------------------
    //            OPTIONS PAGE
    // ------------------------------------

    $(document).ready(function() {

        $('.wpcf7cf-options-notice .notice-dismiss-2').click(function () {
            $('.wpcf7cf-options-notice .notice-dismiss').click();
        });
        $('.wpcf7cf-options-notice .notice-dismiss').click(function () {
            wpcf7cf_dismiss_notice();
        });

        function wpcf7cf_dismiss_notice() {
            $('input[name="wpcf7cf_options[notice_dismissed]"]').val('true');
            $.post(ajaxurl, {action:'wpcf7cf_dismiss_notice'}, function(response) {
                // nothing to do. dismiss_notice option should be set to TRUE server side by now.
            });
        }

    });

})( jQuery );
