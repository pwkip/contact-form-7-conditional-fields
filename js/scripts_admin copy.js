/**
 * These scripts are part of the Conditional Fields for Contact Form 7 plugin.
 * Should only be loaded when editing a form in the WP backend.
 */


var wpcf7cf = {};

wpcf7cf.MAX_CONDITIONS = 50;

wpcf7cf.$newEntry = jQuery('#wpcf7cf-new-entry').eq(0);
wpcf7cf.$textView = jQuery('#wpcf7cf-settings-text').eq(0);
wpcf7cf.$textOnlyCheckbox = jQuery('#wpcf7cf-text-only-checkbox').eq(0);
wpcf7cf.$textOnlyLinks = jQuery('.wpcf7cf-switch-to-txt-link');
wpcf7cf.$entriesUi = jQuery('#wpcf7cf-entries-ui').eq(0);
wpcf7cf.$addButton = jQuery('#wpcf7cf-add-button').eq(0);
wpcf7cf.$maxReachedWarning = jQuery('#wpcf7cf-a-lot-of-conditions').eq(0);
wpcf7cf.$formEditorForm = jQuery('#wpcf7-admin-form-element').eq(0);

// Smart Grid compat https://wordpress.org/support/topic/rule-sets-only-saving-when-in-text-mode/
if(jQuery('#cf7sg-editor').length>0) wpcf7cf.$formEditorForm = jQuery('form#post').eq(0);

wpcf7cf.$if_values = jQuery('.if-value'); // gets updated now and then

wpcf7cf.regexCondition = /(?:show \[([^\]]*?)\]) if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/g;
wpcf7cf.regexConditionAnd = /and if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/g;


// HTML templates
wpcf7cf.template_for_condition_fields_with_one_and_rule = wpcf7cf.$newEntry.html();
wpcf7cf.template_for_and_rule = wpcf7cf.$newEntry.find('.wpcf7cf-and-rule')[0] ? wpcf7cf.$newEntry.find('.wpcf7cf-and-rule')[0].outerHTML : '';
// remove and-rules from dom
wpcf7cf.$newEntry.find('.wpcf7cf-and-rules').eq(0).html('');
wpcf7cf.template_for_condition_fields_without_and_rules = wpcf7cf.$newEntry.html();

wpcf7cf.transformConditionsFromStringToArrayOfObjects = function(str) {

    if (!str) str = '';
    
    var conditionsAsStrings = str.split(/\r?\n(?=show)/);
    var conditionsAsObjects = [];
    for (var i = 0; i<conditionsAsStrings.length; i++) {

        var lines = conditionsAsStrings[i].split(/\r?\n/);
        
        wpcf7cf.regexCondition.lastIndex = 0;
        var line1Match = wpcf7cf.regexCondition.exec(lines[0]);

        if (line1Match != null) {

            var conditionObject = {
                then_field:line1Match[1],
                and_rules: [
                    {
                        if_field: line1Match[2],
                        operator: line1Match[3],
                        if_value: line1Match[4],
                    },
                ],
            };

            for(var and_i = 1; and_i < lines.length; and_i++) {
                wpcf7cf.regexConditionAnd.lastIndex = 0;
                lineMatch = wpcf7cf.regexConditionAnd.exec(lines[and_i]);
                if (lineMatch != null) {
                    conditionObject.and_rules.push({
                        if_field: lineMatch[1],
                        operator: lineMatch[2],
                        if_value: lineMatch[3],
                    });
                }
            }

            conditionsAsObjects.push(conditionObject);

        }
    }
    return conditionsAsObjects;
}

wpcf7cf.getnumberOfTextEntries = function () {
    const textConditions = wpcf7cf.transformConditionsFromStringToArrayOfObjects(wpcf7cf.$textView.val());
    return textConditions.length;
}

wpcf7cf.getnumberOfFieldEntries = function () {
    return wpcf7cf.$entriesUi.find('.entry').length;
}

wpcf7cf.transformConditionsFromArrayOfObjectsToString = function(conditions) {
    return conditions.map(function(condition){
        var indent = ' '.repeat(condition.then_field.length + 4);
        return `show [${condition.then_field}] `+condition.and_rules.map(function(rule, i){
            return ( i>0 ? indent+'and ':'' ) + `if [${rule.if_field}] ${rule.operator} "${rule.if_value}"`
        }).join('\n');
    }).join('\n');
}

/**
 * Tranform an array of conditions (Objects) to HTML fields
 * @param Array conditions 
 * @returns jQuery
 */
wpcf7cf.transformConditionsFromArrayOfObjectsToFieldElements = function(conditions) {

    if ( wpcf7cf.MAX_CONDITIONS < conditions.length ) {
        jQuery('#wpcf7cf-entries').html('');
        wpcf7cf.maybeDisableAddButton();
        return;
    }
    
    var entries = [];

    for (var c_i = 0; c_i<conditions.length; c_i++) {

        var condition = conditions[c_i];
        var id=0;

        // setup then_field
        var $entry = jQuery( '<div class="entry">' + wpcf7cf.template_for_condition_fields_without_and_rules + '</div>' );
        jQuery('.then-field-select', $entry).val(condition.then_field);

        for (var a_i = 0; a_i < condition.and_rules.length; a_i++) {
            var and_rule = condition.and_rules[a_i];

            $rule = jQuery(wpcf7cf.template_for_and_rule);

            jQuery('.if-field-select', $rule).val(and_rule.if_field);
            jQuery('.operator', $rule).val(and_rule.operator);
            jQuery('.if-value', $rule).val(and_rule.if_value);

            jQuery('.wpcf7cf-and-rules', $entry).eq(0).append($rule);
            
        }

        entries.push($entry);
    }

    jQuery('#wpcf7cf-entries').html(entries);

    update_entries();

}

wpcf7cf.maybeDisableAddButton = function() {
    if (wpcf7cf.getnumberOfTextEntries() >= wpcf7cf.MAX_CONDITIONS && wpcf7cf.getnumberOfFieldEntries() == 0 ||
        wpcf7cf.getnumberOfFieldEntries() >= wpcf7cf.MAX_CONDITIONS
    ) {
        wpcf7cf.$addButton.hide();
        wpcf7cf.$maxReachedWarning.show();
    } else {
        wpcf7cf.$addButton.show();
        wpcf7cf.$maxReachedWarning.hide();
    }
}

wpcf7cf.maybeDisableAddButton();

wpcf7cf.transformConditionsFromFieldsToArrayOfObjects = function($entries) {

    if (!$entries) {
        $entries = jQuery('#wpcf7cf-entries .entry');
    }

    var conditionsAsObjects = [];

    $entries.each(function() {
        
        var $entry = jQuery(this);
        var then_field = $entry.find('.then-field-select').val() ?? '';
        
        var conditionObject = {
            then_field: then_field,
            and_rules: [],
        };

        $entry.find('.wpcf7cf-and-rule').each(function(i) {
            const $and_rule = jQuery(this);
            conditionObject.and_rules.push({
                operator : $and_rule.find('.operator').val() ?? '',
                if_field : $and_rule.find('.if-field-select').val() ?? '',
                if_value : $and_rule.find('.if-value').val() ?? '',
            });
        });

        conditionsAsObjects.push(conditionObject);

    });

    return conditionsAsObjects;
}


wpcf7cf.copyTextToFields = function() {
    var str = wpcf7cf.$textView.val();
    var obj = wpcf7cf.transformConditionsFromStringToArrayOfObjects(str);
    wpcf7cf.transformConditionsFromArrayOfObjectsToFieldElements(obj);
}

wpcf7cf.copyFieldsToText = function() {
    var obj = wpcf7cf.transformConditionsFromFieldsToArrayOfObjects();
    var str = wpcf7cf.transformConditionsFromArrayOfObjectsToString(obj);
    wpcf7cf.$textView.val(str);
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

jQuery('#wpcf7cf-entries').sortable();

var index = jQuery('#wpcf7cf-entries .entry').length;
var index_and = 0;

wpcf7cf.$addButton.click(function(){
    add_condition_fields();
});

function add_condition_fields() {
    $c = jQuery('<div class="entry">'+wpcf7cf.template_for_condition_fields_with_one_and_rule+'</div>')
    $c.appendTo('#wpcf7cf-entries');
    update_entries();
}

function update_entries() {
    wpcf7cf.$if_values = jQuery('.if-value');
    init_autocomplete();
    wpcf7cf.$if_values.css({'visibility':'visible'});
    wpcf7cf.$if_values.autocomplete( "disable" );

    jQuery('#wpcf7cf-entries .wpcf7cf-and-rule').each(function() {
        var $and_rule = jQuery(this);
        var $operatorField = $and_rule.find('.operator').eq(0);
        var operator = $operatorField.val() || 'equals';
        if ($and_rule.find('.operator').eq(0).val() === 'is empty' || $and_rule.find('.operator').eq(0).val() === 'not empty') {
            $and_rule.find('.if-value').eq(0).css({'visibility':'hidden'});
        } else if (operator.endsWith('(regex)')) {
            $and_rule.find('.if-value').eq(0).autocomplete( "enable" );
        }
    });

    scale_and_button();

    set_events();

    wpcf7cf.maybeDisableAddButton();
}

function init_autocomplete() {

    wpcf7cf.$if_values.autocomplete({
        disabled: true,
        source: function(request, response) {
            var matcher = new RegExp(jQuery.ui.autocomplete.escapeRegex(request.term), "i");
            response(jQuery.grep(regexes, function(value) {
                return matcher.test(value.label || value.value || value) || matcher.test(value.desc);
            }));
        },
        focus: function( event, ui ) {
            jQuery( event.target ).val( ui.item.desc );
            return false;
        },
        select: function( event, ui ) {
            jQuery( event.target ).val( ui.item.desc );
            return false;
        },
        open: function(e,ui) {
            $el = jQuery(e.target);
            var styledTerm = termTemplate.replace('%s', $el.val());

            jQuery('.ui-autocomplete').find('em').each(function() {
                var me = jQuery(this);
                me.html( me.text().replace($el.val(), styledTerm) );
            });
        },
        minLength: 0
    }).each(function() {
        jQuery(this).autocomplete( "instance" )._renderItem = function( ul, item ) {
            return jQuery("<li>")
            .append("<div><em>" + item.label + "</em><br><em>" + item.desc + "</em></div>")
            .appendTo(ul);
        }
    });
    wpcf7cf.$if_values.on('focus', function() {
        jQuery(this).autocomplete("search");
    });
}

function set_events() { // called at the end of update_entries

    jQuery('.wpcf7cf-and-rules').sortable();

    jQuery('.and-button').off('click').click(function() {
        $this = jQuery(this);
        $andblock = $this.closest('.wpcf7cf-and-rule');
        $andblocks_container = $this.closest('.wpcf7cf-and-rules');
        next_index = $andblocks_container.data('next-index');
        $andblocks_container.data('next-index',next_index+1);
        var and_i = next_index;
        clone_html = $andblock.get(0).outerHTML.replace(/wpcf7cf_options\[([0-9]*)\]\[and_rules\]\[([0-9]*)\]/g, 'wpcf7cf_options[$1][and_rules]['+and_i+']');
        $andblock.after(clone_html);
        //update_settings_textarea();
        update_entries();
        return false;
    });

    jQuery('.delete-button').off('click').click(function(){
        $and_rule = jQuery(this).closest('.wpcf7cf-and-rule');
        if ($and_rule.siblings().length > 0) {
            $and_rule.remove();
        } else {
            $and_rule[0].closest('.entry').remove();
        }

        //update_settings_textarea();
        update_entries();

        return false;
    });

    jQuery('.operator').off('change').change(function() {
        update_entries();
        return false;
    });
}

function scale_and_button() {
    jQuery('.wpcf7cf-and-rule:first-child .and-button').each(function(){
        $and_button = jQuery(this);
        num_and_rules = $and_button.closest('.wpcf7cf-and-rule').siblings().length+1;
        var height = (34*num_and_rules-12)+'px';
        $and_button.css({'height':height,'line-height':height});
    });
}

// ------------------------------------
//          TOOGGLE UI MODE
// ------------------------------------

function setUiMode(is_text_only) {
    if (is_text_only) {
        wpcf7cf.currentMode = 'text';
        wpcf7cf.$entriesUi.hide();
        wpcf7cf.$textView.show();
        if (wpcf7cf.getnumberOfFieldEntries() > 0) {
            wpcf7cf.copyFieldsToText();
        }
    } else {
        wpcf7cf.currentMode = 'normal';
        wpcf7cf.$entriesUi.show();
        wpcf7cf.$textView.hide();
        wpcf7cf.copyTextToFields();
    }
}

wpcf7cf.$textOnlyLinks.on( 'click', function() {
    wpcf7cf.$textOnlyCheckbox.prop('checked', true).trigger('change');
} )

wpcf7cf.$textOnlyCheckbox.on( 'change', function() {
    setUiMode( wpcf7cf.$textOnlyCheckbox.is( ':checked' ) );
} );

setUiMode(wpcf7cf.$textOnlyCheckbox.is(':checked'));

wpcf7cf.$formEditorForm.on('submit', function() {
    if (wpcf7cf.currentMode == 'normal' && wpcf7cf.getnumberOfFieldEntries() > 0) {
        wpcf7cf.copyFieldsToText();
    }
});


// ------------------------------------
//      CF7 TAG GENERATOR OVERRIDE
// ------------------------------------

if (_wpcf7 == null) { var _wpcf7 = wpcf7}; // wpcf7 4.8 fix
var old_compose = _wpcf7.taggen.compose;
// ...before overwriting the jQuery extension point
_wpcf7.taggen.compose = function(tagType, $form)
{

    jQuery('#tag-generator-panel-group-style-hidden').val(jQuery('#tag-generator-panel-group-style').val());

    // original behavior - use function.apply to preserve context
    var ret = old_compose.apply(this, arguments);
    //tagType = arguments[0];
    //$form = arguments[1];

    // START: code here will be executed after the _wpcf7.taggen.update function
    if (tagType== 'group') ret += "[/group]";
    if (tagType== 'repeater') ret += "[/repeater]";
    // END

    if (tagType== 'togglebutton') {
        $val1 = jQuery('#tag-generator-panel-togglebutton-value-1');
        $val2 = jQuery('#tag-generator-panel-togglebutton-value-2');
        var val1 = $val1.val();
        var val2 = $val2.val();

        if (val1 == "") val1 = $val1.data('default');
        if (val2 == "") val2 = $val2.data('default');

        str_val = ' "'+val1+'" "'+val2+'"';

        ret = ret.replace(']', str_val+']');
    }

    return ret;
};
