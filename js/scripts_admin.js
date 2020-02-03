/**
 * Created by jules on 7/17/2015.
 */
var $wpcf7cf_new_entry = jQuery('#wpcf7cf-new-entry').eq(0);

if ($wpcf7cf_new_entry.length > 0) {

    var wpcf7cf_new_and_rule_html = $wpcf7cf_new_entry.find('.wpcf7cf-and-rule')[0].outerHTML;
    var wpcf7cf_new_entry_html = $wpcf7cf_new_entry.html();

    var cf_rule_regex = /(?:show \[([^\]]*?)\]) if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/g;
    var cf_rule_regex_and = /and if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/g;


    if (_wpcf7 == null) { var _wpcf7 = wpcf7}; // wpcf7 4.8 fix

    var old_compose = _wpcf7.taggen.compose;

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

    (function($) {

        $('#wpcf7cf-entries').sortable();
        $(('.wpcf7cf-and-rules')).sortable();


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
            if (tagType== 'repeater') ret += "[/repeater]";

            // END

            if (tagType== 'togglebutton') {
                $val1 = $('#tag-generator-panel-togglebutton-value-1');
                $val2 = $('#tag-generator-panel-togglebutton-value-2');
                var val1 = $val1.val();
                var val2 = $val2.val();

                if (val1 == "") val1 = $val1.data('default');
                if (val2 == "") val2 = $val2.data('default');

                str_val = ' "'+val1+'" "'+val2+'"';

                ret = ret.replace(']', str_val+']');
            }

            return ret;
        };

        var index = $('#wpcf7cf-entries .entry').length;
        var index_and = 0;

        $('#wpcf7cf-add-button').click(function(){

            var id = add_condition_fields();

            return false;

        });

        function clear_all_condition_fields() {
            $('.entry').remove();
        }

        function add_condition_fields() {
            $('<div class="entry" id="entry-'+index+'">'+(wpcf7cf_new_entry_html.replace(/{id}/g, index))+'</div>').appendTo('#wpcf7cf-entries');
            index++;
            update_entries();
            update_settings_textarea();
            return (index-1);
        }

        function add_and_condition_fields(id) {
            // $('#entry-'+id+' .wpcf7cf-and-rules').eq(0).append($wpcf7cf_new_and_rule.clone());
            $('#entry-'+id+' .wpcf7cf-and-rules').eq(0).append(wpcf7cf_new_and_rule_html.replace(/{id}/g, index-1).replace(/\[and_rules\]\[0\]/g, '[and_rules]['+index_and+']'));
            index_and++;
            return (index_and-1);
        }

        /**
         * Copy the textarea field to the entries.
         */
        function import_condition_fields() {

            $if_values = $('.if-value');

            var lines = $('#wpcf7cf-settings-text').val().split(/\r?\n/);

            var id = -1;

            for (var i = 0; i<lines.length; i++) {

                var str = lines[i];

                var match = cf_rule_regex.exec(str);

                if (match != null) {

                    index_and = 0; // reset this for each first condition (This one has and_index [0]).

                    id = add_condition_fields();

                    $('#entry-'+id+' .then-field-select').val(match[1]);
                    $('#entry-'+id+' .if-field-select').val(match[2]);
                    $('#entry-'+id+' .operator').val(match[3]);
                    $('#entry-'+id+' .if-value').val(match[4]);

                    index_and = 1; // the next and condition will have and_index [1];

                    cf_rule_regex.lastIndex = 0;

                }

                match = cf_rule_regex_and.exec(str);

                if (match != null && id != -1) {

                    var and_id = add_and_condition_fields(id);

                    $('#entry-'+id+' .wpcf7cf-and-rule:last-child .if-field-select').val(match[1]);
                    $('#entry-'+id+' .wpcf7cf-and-rule:last-child .operator').val(match[2]);
                    $('#entry-'+id+' .wpcf7cf-and-rule:last-child .if-value').val(match[3]);

                    cf_rule_regex_and.lastIndex = 0;

                }
            }

            update_entries();

        }

        $('#wpcf7-admin-form-element, #post').on('submit.wpcf7cf', function() {
            update_settings_textarea();
            return true;
        });

        // export/import settings

        $('#wpcf7cf-settings-text-wrap').hide();

        $('#wpcf7cf-settings-to-text').click(function() {
            $('#wpcf7cf-settings-text-wrap').show();
            update_settings_textarea();
            return false;
        });

        /**
         * Copy the entries to the textarea field.
         */
        function update_settings_textarea() {
            $('#wpcf7cf-settings-text').val('');
            $('#wpcf7cf-entries .entry').each(function() {
                var $entry = $(this);
                var line = 'show [' + $entry.find('.then-field-select').val() + ']';
                var text_indent = line.length-3;
                $entry.find('.wpcf7cf-and-rule').each(function(i) {
                    const $and_rule = $(this);
                    const operator = $and_rule.find('.operator').val();
                    if (i>0) {

                        line += '\n'+' '.repeat(text_indent)+'and';

                    }
                    line += ' if [' + $and_rule.find('.if-field-select').val() + ']' + ' ' + operator;
                    if (!['is empty', 'not empty'].includes(operator)) {
                        line += ' "' + $and_rule.find('.if-value').val() + '"';
                    }
                });
                $('#wpcf7cf-settings-text').val($('#wpcf7cf-settings-text').val() + line + "\n" );
            });
        }

        $if_values = $('.if-value');

        $('#add-fields').click(function() {
            import_condition_fields();
            return false;
        });

        $('#overwrite-fields').click(function() {
            clear_all_condition_fields();
            import_condition_fields();
            return false;
        });

        $('#wpcf7cf-settings-text').on('change.wpcf7cf', function(){
            clear_all_condition_fields();
            import_condition_fields();
            return true;
        });

        

        $('#wpcf7cf-settings-text-clear').click(function() {
            $('#wpcf7cf-settings-text-wrap').hide();
            $('#wpcf7cf-settings-text').val('');
            return false;
        });
        
        function update_entries() {
            $if_values = $('.if-value');
            init_autocomplete();
            $if_values.css({'visibility':'visible'});
            $if_values.autocomplete( "disable" );

            $('#wpcf7cf-entries .wpcf7cf-and-rule').each(function() {
                var $and_rule = $(this);
                if ($and_rule.find('.operator').eq(0).val() === 'is empty' || $and_rule.find('.operator').eq(0).val() === 'not empty') {
                    $and_rule.find('.if-value').eq(0).css({'visibility':'hidden'});
                } else if ($and_rule.find('.operator').eq(0).val().endsWith('(regex)')) {
                    $and_rule.find('.if-value').eq(0).autocomplete( "enable" );
                }
            });

            scale_and_button();

            set_events();
        }

        function init_autocomplete() {

            $if_values.autocomplete({
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
                },
                minLength: 0
            }).each(function() {
                $(this).autocomplete( "instance" )._renderItem = function( ul, item ) {
                    return $("<li>")
                    .append("<div><em>" + item.label + "</em><br><em>" + item.desc + "</em></div>")
                    .appendTo(ul);
                }
            });
            $if_values.on('focus', function() {
                $(this).autocomplete("search");
            });
        }

        update_entries();

        function set_events() { // called at the end of update_entries

            $('.wpcf7cf-and-rules').sortable();

            $('.and-button').off('click').click(function() {
                $this = $(this);
                $andblock = $this.closest('.wpcf7cf-and-rule');
                $andblocks_container = $this.closest('.wpcf7cf-and-rules');
                next_index = $andblocks_container.data('next-index');
                $andblocks_container.data('next-index',next_index+1);
                var and_i = next_index;
                clone_html = $andblock.get(0).outerHTML.replace(/wpcf7cf_options\[([0-9]*)\]\[and_rules\]\[([0-9]*)\]/g, 'wpcf7cf_options[$1][and_rules]['+and_i+']');
                $andblock.after(clone_html);
                update_settings_textarea();
                update_entries();
                return false;
            });

            $('.delete-button').off('click').click(function(){
                $and_rule = $(this).closest('.wpcf7cf-and-rule');
                if ($and_rule.siblings().length > 0) {
                    $and_rule.remove();
                } else {
                    $and_rule[0].closest('.entry').remove();
                }

                update_settings_textarea();
                update_entries();

                return false;
            });

            $('.operator').off('change').change(function() {
                update_entries();
                return false;
            });

            $('input,select', '#wpcf7cf-entries').off('change.wpcf7cf_sync').on('change.wpcf7cf_sync', function() {
                update_settings_textarea();
            });
        }

        function scale_and_button() {
            $('.wpcf7cf-and-rule:first-child .and-button').each(function(){
               $and_button = $(this);
               num_and_rules = $and_button.closest('.wpcf7cf-and-rule').siblings().length+1;
               var height = (34*num_and_rules-12)+'px';
               $and_button.css({'height':height,'line-height':height});
            });
        }

    })( jQuery );

}

(function($) {
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