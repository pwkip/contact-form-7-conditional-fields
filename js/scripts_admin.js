/**
 * These scripts are part of the Conditional Fields for Contact Form 7 plugin.
 * Should only be loaded when editing a form in the WP backend.
 */

let wpcf7cf_formcode = null; // used to detect if the form code has changed

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


if (typeof(_wpcf7) != 'undefined' || typeof(wpcf7) != 'undefined') {

    var wpcf7cf = {};
    
    wpcf7cf.MAX_CONDITIONS = 50;

    wpcf7cf.operators = [
        'equals',
        'not equals',
        'greater than',
        'greater than or equals',
        'less than',
        'less than or equals',
        'is empty',
        'not empty',
        'equals (regex)',
        'not equals (regex)',
        
     ];
    
    wpcf7cf.$newEntry = jQuery(`<div class="entry">
            <div class="wpcf7cf-if">
                <span class="label">Show</span>
                <select class="then-field-select"></select>
            </div>
            <div class="wpcf7cf-and-rules ui-sortable" data-next-index="1">
                <div class="wpcf7cf-and-rule ui-sortable-handle">
                    <span class="rule-part if-txt label">if</span>
                    <select class="rule-part if-field-select"></select>
                    <select class="rule-part operator">${ wpcf7cf.operators.map(o => `<option value="${o}">${o}</option>`) }</select>
                    <input class="rule-part if-value" type="text" placeholder="value" value="" style="visibility: visible;">
                    <span class="and-button" style="height: 22px; line-height: 22px;">And</span>
                    <span title="delete rule" class="rule-part delete-button">remove</span>
                </div>
            </div>
        </div>`);
    wpcf7cf.$textView = jQuery('#wpcf7cf-settings-text').eq(0);
    wpcf7cf.$textOnlyCheckbox = jQuery('#wpcf7cf-text-only-checkbox').eq(0);
    wpcf7cf.$textOnlyLinks = jQuery('.wpcf7cf-switch-to-txt-link');
    wpcf7cf.$entriesUi = jQuery('#wpcf7cf-entries-ui').eq(0);
    wpcf7cf.$addButton = jQuery('#wpcf7cf-add-button').eq(0);
    wpcf7cf.$maxReachedWarning = jQuery('#wpcf7cf-a-lot-of-conditions').eq(0);
    wpcf7cf.$formEditorForm = jQuery('#wpcf7-admin-form-element').eq(0);
    wpcf7cf.$formEditor = jQuery('#wpcf7-form').eq(0);
    
    // Smart Grid compat https://wordpress.org/support/topic/rule-sets-only-saving-when-in-text-mode/
    if(jQuery('#cf7sg-editor').length>0) wpcf7cf.$formEditorForm = jQuery('form#post').eq(0);
    
    wpcf7cf.regexCondition = /(?:show \[([^\]]*?)\]) if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/g;
    wpcf7cf.regexConditionAnd = /and if \[([^\]]*?)\] (?:(equals \(regex\)|not equals \(regex\)|equals|not equals|greater than or equals|greater than|less than or equals|less than|is empty|not empty|function)(?: \"(.*)\")?)/g;
    
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
            var $entry = jQuery(wpcf7cf.template_for_condition_fields_without_and_rules);
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
    
        updateDisplayOfEntries();
    
    }

    wpcf7cf.isMaxConditionsReached = function() {
        return wpcf7cf.getnumberOfTextEntries() >= wpcf7cf.MAX_CONDITIONS && wpcf7cf.getnumberOfFieldEntries() == 0 ||
            wpcf7cf.getnumberOfFieldEntries() >= wpcf7cf.MAX_CONDITIONS;
        
    }
    
    wpcf7cf.maybeDisableAddButton = function() {
        if (wpcf7cf.isMaxConditionsReached()) {
            wpcf7cf.$addButton.hide();
            wpcf7cf.$maxReachedWarning.show();
        } else {
            wpcf7cf.$addButton.show();
            wpcf7cf.$maxReachedWarning.hide();
        }
    }
    
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
        wpcf7cf.setDefaultValues();
    }
    
    wpcf7cf.copyFieldsToText = function() {
        var obj = wpcf7cf.transformConditionsFromFieldsToArrayOfObjects();
        var str = wpcf7cf.transformConditionsFromArrayOfObjectsToString(obj);
        wpcf7cf.$textView.val(str);
    }
    
    function add_condition_fields() {
        $c = jQuery(wpcf7cf.template_for_condition_fields_with_one_and_rule)
        $c.appendTo('#wpcf7cf-entries');
        updateDisplayOfEntries();
    }
    
    /**
     * Update visibility / autocomplete and some other visual properties based on the selected conditions.
     */
    function updateDisplayOfEntries() {
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
                var styledTerm = `<span class='ui-autocomplete-term'>${$el.val()}</span>`;
    
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
    
    function set_events() { // called at the end of updateDisplayOfEntries
    
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
            updateDisplayOfEntries();
            wpcf7cf.copyFieldsToText();
            return false;
        });
    
        jQuery('.delete-button').off('click').click(function(){
            $and_rule = jQuery(this).closest('.wpcf7cf-and-rule');
            if ($and_rule.siblings().length > 0) {
                $and_rule.remove();
            } else {
                $and_rule[0].closest('.entry').remove();
            }
            updateDisplayOfEntries();
            wpcf7cf.copyFieldsToText();
            return false;
        });
    
        jQuery('.operator').on('change', (function() {
            updateDisplayOfEntries();
            wpcf7cf.copyFieldsToText();
            return false;
        }));
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
    
    /**
     * Make either Text-only view or field view visible.
     * 
     * @param {boolean} is_text_only `true` to show text-only view. `false` for fields view
     */
    wpcf7cf.setViewMode = function(is_text_only) {
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
        return false;
    } )

    wpcf7cf.$textOnlyCheckbox.on('change', function() {
        wpcf7cf.setViewMode(wpcf7cf.$textOnlyCheckbox.is(':checked'));
    });
    
    wpcf7cf.$formEditorForm.on('submit', function() {
        if (wpcf7cf.currentMode == 'normal' && wpcf7cf.getnumberOfFieldEntries() > 0) {
            wpcf7cf.copyFieldsToText();
        }
    });

    wpcf7cf.$entriesUi.on('change', function(){
        wpcf7cf.copyFieldsToText();
    });
    
    
    // ------------------------------------
    //      CF7 TAG GENERATOR OVERRIDE
    // ------------------------------------

    window.addEventListener('load', function() {

        document.querySelectorAll(
            '[data-taggen="open-dialog"]'
        ).forEach( button => {
            button.addEventListener( 'click', event => {
                const dialog = document.querySelector( `#${ button.dataset.target }` );
                if (!dialog) {
                    return true;
                }
                const form = dialog.querySelector( 'form.tag-generator-panel' );
                if (!form) {
                    return true;
                }
                setTimeout( function() {
                    wpcf7cf.updateTagGenerator(form);
                }, 10 );
            } );
        } );

        document.querySelectorAll('form.tag-generator-panel .control-box input').forEach(function(input){
            const form = input.closest('form.tag-generator-panel');
            if (!form) { return; }
            setTimeout( function() {
                wpcf7cf.updateTagGenerator(form);
            }, 10 );
            input.addEventListener('keyup', function(e) {
                wpcf7cf.updateTagGenerator(form);
            });
            input.addEventListener('change', function(e) {
                wpcf7cf.updateTagGenerator(form);
            });
        });
    });

    wpcf7cf.updateTagGenerator = function( form ) {
        setTimeout( function() {
            form.querySelectorAll(
                '[data-tag-part="mail-tag-closed"]'
            ).forEach( tag => {
                const nameField = form.querySelector( '[data-tag-part="name"]' );

                if ( nameField ) {
                    tag.innerText = `[/${ nameField.value.trim() }]`;
                }
            } );
        }, 10 );
    };





    
    function scanFormTags(formCode) {
        const fields = [...formCode.matchAll(/\[(?!group|step|repeater|submit)[^\] ]+ ([^\] ]+)/g)].map(e=>e[1]);
        const groups = [...formCode.matchAll(/\[group ([^\] ]+)/g)].map(e=>e[1]);
        return [ fields, groups ];
    }
    
    function updateAvailableGroupsAndFields() {
        const formCode = wpcf7cf.$formEditor.val();
        const [ fields, groups ] = scanFormTags(formCode);
    
        $temp = jQuery(wpcf7cf.template_for_condition_fields_with_one_and_rule);
        $temp.find('.then-field-select').eq(0).html(createOptionsHTML(groups, 'group'));
        $temp.find('.if-field-select').eq(0).html(createOptionsHTML(fields, 'field'));
        // $temp.find('.operator').eq(0).html(createOptionsHTML(wpcf7cf.operators, null));
        wpcf7cf.template_for_condition_fields_with_one_and_rule = $temp[0].outerHTML;
        
        $temp.find('.wpcf7cf-and-rules').eq(0).html('');
        wpcf7cf.template_for_condition_fields_without_and_rules = $temp[0].outerHTML;
    
        $temp = jQuery(wpcf7cf.template_for_and_rule);
        $temp.find('.if-field-select').eq(0).html(createOptionsHTML(fields, 'field'));
        wpcf7cf.template_for_and_rule = $temp[0].outerHTML;

        jQuery('.then-field-select').each(function(){
            const $this = jQuery(this);
            updateSelectWithValues($this, groups, 'group');
        });
        jQuery('.if-field-select').each(function(){
            const $this = jQuery(this);
            updateSelectWithValues($this, fields, 'field');
        });
    }
    
    function updateSelectWithValues($select, values, type) {
        $select.html(createOptionsHTML(values, type));
    }
    
    function createOptionsHTML(values, type) {
        return (type?`<option value="-1">-- Select ${type} --</option>`:'')+values.map(value => `<option value="${value}">${value}</option>`).join('');
    }

    /**
     * Set the default value of all fields to their current value.
     * This prevents CF7 to show an unsaved-changes warning on these fields.
     * (The single source of truth is the value in the text view.)
     */
    wpcf7cf.setDefaultValues = function() {
        jQuery('#wpcf7cf-entries select').each(function() {
            const $select = jQuery(this);
            let selectedIndex = $select.prop('selectedIndex');
            if (selectedIndex == -1) {
                selectedIndex = 0;
            }
            $select.find('option').removeAttr('selected');
            $select.find(`option:eq(${selectedIndex})`).prop('selected', 'selected').attr('selected', 'selected');
        })

        jQuery('#wpcf7cf-entries .if-value').each(function(){
            const $input = jQuery(this);
            $input.attr('value',$input.val());
        });
    }
    
    // update available groups and fields each time there is a change in the form code.
    wpcf7cf.$formEditor.on('change focusout', function() {
        if( !wpcf7cf_formcode || wpcf7cf_formcode !== this.value ) {
            wpcf7cf_formcode = this.value;
            updateAvailableGroupsAndFields();
            if (!wpcf7cf.isMaxConditionsReached()) {
                wpcf7cf.copyTextToFields();
                wpcf7cf.copyFieldsToText();
            }
        }
    });
    
    wpcf7cf.$addButton.click(function(){
        add_condition_fields();
        wpcf7cf.copyFieldsToText();
    });
    
    jQuery(document).ready(function() {
    
        wpcf7cf.$if_values = jQuery('.if-value'); // gets updated now and then
    
        // init HTML templates (will be updated immediatly by updateAvailableGroupsAndFields())
        wpcf7cf.template_for_condition_fields_with_one_and_rule = wpcf7cf.$newEntry[0].outerHTML;
        wpcf7cf.template_for_and_rule = wpcf7cf.$newEntry.find('.wpcf7cf-and-rule')[0] ? wpcf7cf.$newEntry.find('.wpcf7cf-and-rule')[0].outerHTML : '';
    
        updateAvailableGroupsAndFields();
        wpcf7cf.copyTextToFields();
    
        wpcf7cf.maybeDisableAddButton();
    
        jQuery('#wpcf7cf-entries').sortable();
    
        wpcf7cf.setViewMode(wpcf7cf.$textOnlyCheckbox.is(':checked'));
    
    })
    
}