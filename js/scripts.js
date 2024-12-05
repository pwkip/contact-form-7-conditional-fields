"use strict";

// disable client side validation introduced in CF7 5.6 for now
if (typeof wpcf7 !== 'undefined') {
    wpcf7.validate = (a,b) => null;
}

let cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

let wpcf7cf_timeout;
let wpcf7cf_change_time_ms = 100; // the timeout after a change in the form is detected

if (window.wpcf7 && !wpcf7.setStatus) {
    wpcf7.setStatus = ( form, status ) => {
        form = form.length ? form[0] : form; // if form is a jQuery object, only grab te html-element
        const defaultStatuses = new Map( [
            // 0: Status in API response, 1: Status in HTML class
            [ 'init', 'init' ],
            [ 'validation_failed', 'invalid' ],
            [ 'acceptance_missing', 'unaccepted' ],
            [ 'spam', 'spam' ],
            [ 'aborted', 'aborted' ],
            [ 'mail_sent', 'sent' ],
            [ 'mail_failed', 'failed' ],
            [ 'submitting', 'submitting' ],
            [ 'resetting', 'resetting' ],
        ] );
    
        if ( defaultStatuses.has( status ) ) {
            status = defaultStatuses.get( status );
        }
    
        if ( ! Array.from( defaultStatuses.values() ).includes( status ) ) {
            status = status.replace( /[^0-9a-z]+/i, ' ' ).trim();
            status = status.replace( /\s+/, '-' );
            status = `custom-${ status }`;
        }
    
        const prevStatus = form.getAttribute( 'data-status' );
    
        form.wpcf7.status = status;
        form.setAttribute( 'data-status', status );
        form.classList.add( status );
    
        if ( prevStatus && prevStatus !== status ) {
            form.classList.remove( prevStatus );
        }
    
        return status;
    };
}

if (window.wpcf7cf_running_tests) {
    jQuery('input[name="_wpcf7cf_options"]').each(function(e) {
        const $input = jQuery(this);
        const opt = JSON.parse($input.val());
        opt.settings.animation_intime = 0;
        opt.settings.animation_outtime = 0;
        $input.val(JSON.stringify(opt));
    });
    wpcf7cf_change_time_ms = 0;
}

const wpcf7cf_show_animation = { "height": "show", "marginTop": "show", "marginBottom": "show", "paddingTop": "show", "paddingBottom": "show" };
const wpcf7cf_hide_animation = { "height": "hide", "marginTop": "hide", "marginBottom": "hide", "paddingTop": "hide", "paddingBottom": "hide" };

const wpcf7cf_show_step_animation = { "opacity": "show" };
const wpcf7cf_hide_step_animation = { "opacity": "hide" };

const wpcf7cf_change_events = 'input.wpcf7cf paste.wpcf7cf change.wpcf7cf click.wpcf7cf propertychange.wpcf7cf changedisabledprop.wpcf7cf';

const wpcf7cf_forms = [];

const Wpcf7cfForm = function($form) {

    const options_element = $form.find('input[name="_wpcf7cf_options"]').eq(0);
    if (!options_element.length || !options_element.val()) {
        // doesn't look like a CF7 form created with conditional fields plugin enabled.
        return false;
    }

    const form = this;

    const form_options = JSON.parse(options_element.val());

    form.$form = $form;
    form.$input_hidden_group_fields = $form.find('[name="_wpcf7cf_hidden_group_fields"]');
    form.$input_hidden_groups = $form.find('[name="_wpcf7cf_hidden_groups"]');
    form.$input_visible_groups = $form.find('[name="_wpcf7cf_visible_groups"]');
    form.$input_repeaters = $form.find('[name="_wpcf7cf_repeaters"]');
    form.$input_steps = $form.find('[name="_wpcf7cf_steps"]');

    form.unit_tag = $form.closest('.wpcf7').attr('id');
    form.conditions = form_options['conditions'];

    form.simpleDom = null;

    form.reloadSimpleDom = function() {
        form.simpleDom = wpcf7cf.get_simplified_dom_model(form.$form[0]);
    }

    // quicker than reloading the simpleDom completely with reloadSimpleDom
    form.updateSimpleDom = function() {
        if (!form.simpleDom) {
            form.reloadSimpleDom();
        }
        const inputs = Object.values(form.simpleDom).filter(item => item.type === 'input');
        const formdata = new FormData(form.$form[0]);

        let formdataEntries = [... formdata.entries()].map(entry => [ entry[0], entry[1].name ?? entry[1] ]);
        const buttonEntries = [ ... jQuery('button', form.$form) ].map(entry => [entry.name, entry.value]);
        formdataEntries = formdataEntries.concat(buttonEntries);

        inputs.forEach(simpleDomItem => {
            const newValue = form.getNewDomValueIfChanged(simpleDomItem, formdataEntries);
            if (newValue !== null) {
                form.simpleDom[simpleDomItem.name].val = newValue;
            }
        });

    }

    form.isDomMatch = function(simpleDomItem, formDataEntries) {
        const simpleDomItemName = simpleDomItem.name;
        const simpleDomItemValues = simpleDomItem.val;
        const currentValues = formDataEntries.filter(entry => entry[0] === simpleDomItemName).map(entry => entry[1]);
        return currentValues.join('|') === simpleDomItemValues.join('|');
    }

    /**
     * 
     * @param {*} simpleDomItem 
     * @param {*} formDataEntries 
     * @returns the new value, or NULL if no change
     */
    form.getNewDomValueIfChanged = function(simpleDomItem, formDataEntries) {
        const simpleDomItemName = simpleDomItem.name;
        const simpleDomItemValues = simpleDomItem.val;
        const currentValues = formDataEntries.filter(entry => entry[0] === simpleDomItemName).map(entry => entry[1]);
        return currentValues.join('|') === simpleDomItemValues.join('|') ? null : currentValues;
    }

    // Wrapper around jQuery(selector, form.$form)
    form.get = function (selector) {
        // TODO: implement some caching here.
        return jQuery(selector, form.$form);
    }

    form.getFieldByName = function(name) {
        return form.simpleDom[name] || form.simpleDom[name+'[]'];
    }

    // compatibility with conditional forms created with older versions of the plugin ( < 1.4 )
    for (let i=0; i < form.conditions.length; i++) {
        const condition = form.conditions[i];
        if (!('and_rules' in condition)) {
            condition.and_rules = [{'if_field':condition.if_field,'if_value':condition.if_value,'operator':condition.operator}];
        }
    }

    form.initial_conditions = form.conditions;
    form.settings = form_options['settings'];

    form.$groups = jQuery(); // empty jQuery set
    form.repeaters = [];
    form.multistep = null;
    form.fields = [];

    form.settings.animation_intime = parseInt(form.settings.animation_intime);
    form.settings.animation_outtime = parseInt(form.settings.animation_outtime);

    if (form.settings.animation === 'no') {
        form.settings.animation_intime = 0;
        form.settings.animation_outtime = 0;
    }

    form.updateGroups();
    form.updateEventListeners();
    form.displayFields();

    // bring form in initial state if the reset event is fired on it.
    // (CF7 triggers the 'reset' event by default on each successfully submitted form)
    form.$form.on('reset.wpcf7cf', form, function(e) {
        const form = e.data;
        setTimeout(function(){
            form.reloadSimpleDom();
            form.displayFields();
            form.resetRepeaters();
            if (form.multistep != null) {
                form.multistep.moveToStep(1, false);
            }
            setTimeout(function(){
                if (form.$form.hasClass('sent')) {
                    jQuery('.wpcf7-response-output', form.$form)[0].scrollIntoView({behavior: "smooth", block:"nearest", inline:"nearest"});
                }
            }, 400);
        },200);
    });

    

}

/**
 * reset initial number of subs for each repeater.
 * (does not clear values)
 */
Wpcf7cfForm.prototype.resetRepeaters = function() {
    const form = this;
    form.repeaters.forEach(repeater => {
        repeater.updateSubs( repeater.params.$repeater.initial_subs );
    });
}

Wpcf7cfForm.prototype.displayFields = function() {

    const form = this;

    const wpcf7cf_conditions = this.conditions;
    const wpcf7cf_settings = this.settings;

    //for compatibility with contact-form-7-signature-addon
    if (cf7signature_resized === 0 && typeof signatures !== 'undefined' && signatures.constructor === Array && signatures.length > 0 ) {
        for (let i = 0; i < signatures.length; i++) {
            if (signatures[i].canvas.width === 0) {

                const $sig_canvas = jQuery(".wpcf7-form-control-signature-body>canvas");
                const $sig_wrap = jQuery(".wpcf7-form-control-signature-wrap");
                $sig_canvas.eq(i).attr('width',  $sig_wrap.width());
                $sig_canvas.eq(i).attr('height', $sig_wrap.height());

                cf7signature_resized = 1;
            }
        }
    }

    form.$groups.addClass('wpcf7cf-hidden');

    for (let i=0; i < wpcf7cf_conditions.length; i++) {

        const condition = wpcf7cf_conditions[i];

        const show_group = window.wpcf7cf.should_group_be_shown(condition, form);

        if (show_group) {
            form.get('[data-id="'+condition.then_field+'"]').removeClass('wpcf7cf-hidden');
        }
    }


    const animation_intime = wpcf7cf_settings.animation_intime;
    const animation_outtime = wpcf7cf_settings.animation_outtime;

    form.$groups.each(function (index) {
        const $group = jQuery(this);
        if ($group.is(':animated')) {
            $group.finish(); // stop any current animations on the group
        }
        if ($group.css('display') === 'none' && !$group.hasClass('wpcf7cf-hidden')) {
            if ($group.prop('tagName') === 'SPAN') {
                $group.show().trigger('wpcf7cf_show_group'); // show instantly
            } else {
                $group.animate(wpcf7cf_show_animation, animation_intime).trigger('wpcf7cf_show_group'); // show with animation
            }

            if($group.attr('data-disable_on_hide') !== undefined) {
                $group.find(':input').prop('disabled', false).trigger('changedisabledprop.wpcf7cf');
                $group.find('.wpcf7-form-control-wrap').removeClass('wpcf7cf-disabled');
            }

        } else if ($group.css('display') !== 'none' && $group.hasClass('wpcf7cf-hidden')) {

            if ($group.attr('data-clear_on_hide') !== undefined) {
                const $inputs = jQuery(':input', $group).not(':button, :submit, :reset, :hidden');

                $inputs.each(function(){
                    const $this = jQuery(this);
                    $this.val(this.defaultValue);
                    $this.prop('checked', this.defaultChecked);
                });

                jQuery('option', $group).each(function() {
                    this.selected = this.defaultSelected;
                });

                jQuery('select', $group).each(function() {
                    const $select = jQuery(this);
                    if ($select.val() === null) {
                        $select.val(jQuery("option:first",$select).val());
                    }
                });

                $inputs.each(function(){this.dispatchEvent(new Event("change",{"bubbles":true}))});
            }

            if ($group.prop('tagName') === 'SPAN') {
                $group.hide().trigger('wpcf7cf_hide_group');
            } else {
                $group.animate(wpcf7cf_hide_animation, animation_outtime).trigger('wpcf7cf_hide_group'); // hide
            }
        }
    });

    form.updateHiddenFields();
    form.updateSummaryFields();
};

Wpcf7cfForm.prototype.updateSummaryFields = function() {
    const form = this;
    const $summary = form.get('.wpcf7cf-summary');

    if ($summary.length == 0 || !$summary.is(':visible')) { 
        return;
    }

    const fd = new FormData();

    const formdata = form.$form.serializeArray();
    jQuery.each(formdata,function(key, input){
        fd.append(input.name, input.value);
    });

    // Make sure to add file fields to FormData
    jQuery.each(form.$form.find('input[type="file"]'), function(index, el) {
        if (! el.files.length) return true; // continue
        const fieldName = el.name;
        fd.append(fieldName, new Blob() , Array.from(el.files).map(file => file.name).join(', '));
    });

    // add file fields to form-data

    jQuery.ajax({
        url: wpcf7cf_global_settings.ajaxurl + '?action=wpcf7cf_get_summary',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(json) {
            $summary.html(json.summaryHtml);
        }
    });
};

Wpcf7cfForm.prototype.updateHiddenFields = function() {

    const form = this;

    const hidden_fields = [];
    const hidden_groups = [];
    const visible_groups = [];

    form.$groups.each(function () {
        const $group = jQuery(this);
        if ($group.hasClass('wpcf7cf-hidden')) {
            hidden_groups.push($group.attr('data-id'));
            if($group.attr('data-disable_on_hide') !== undefined) {
                // fields inside hidden disable_on_hide group
                $group.find('input,select,textarea').each(function(){
                    const $this = jQuery(this);
                    if (!$this.prop('disabled')) {
                        $this.prop('disabled', true).trigger('changedisabledprop.wpcf7cf');
                    }

                    // if there's no other field with the same name visible in the form
                    // then push this field to hidden_fields
                    if (form.$form.find(`[data-class="wpcf7cf_group"]:not(.wpcf7cf-hidden) [name='${$this.attr('name')}']`).length === 0) {
                        hidden_fields.push($this.attr('name'));
                    }
                })
                $group.find('.wpcf7-form-control-wrap').addClass('wpcf7cf-disabled');
            } else {
                // fields inside regular hidden group are all pushed to hidden_fields
                $group.find('input,select,textarea').each(function () {
                    hidden_fields.push(jQuery(this).attr('name'));
                });
            }
        } else {
            visible_groups.push($group.attr('data-id'));
        }
    });

    form.hidden_fields = hidden_fields;
    form.hidden_groups = hidden_groups;
    form.visible_groups = visible_groups;

    form.$input_hidden_group_fields.val(JSON.stringify(hidden_fields));
    form.$input_hidden_groups.val(JSON.stringify(hidden_groups));
    form.$input_visible_groups.val(JSON.stringify(visible_groups));

    return true;
};
Wpcf7cfForm.prototype.updateGroups = function() {
    const form = this;
    form.$groups = form.$form.find('[data-class="wpcf7cf_group"]');
    form.$groups.height('auto');
    form.conditions = window.wpcf7cf.get_nested_conditions(form);

};
Wpcf7cfForm.prototype.updateEventListeners = function() {

    const form = this;

    // monitor input changes, and call displayFields() if something has changed
    form.get('input, select, textarea, button').not('.wpcf7cf_add, .wpcf7cf_remove').off(wpcf7cf_change_events).on(wpcf7cf_change_events,form, function(e) {
        const form = e.data;
        clearTimeout(wpcf7cf_timeout);
        wpcf7cf_timeout = setTimeout(function() {
            window.wpcf7cf.updateMultistepState(form.multistep);
            form.updateSimpleDom();
            form.displayFields();
        }, wpcf7cf_change_time_ms);
    });

    
};



/**
 * @global
 * @namespace wpcf7cf
 */
window.wpcf7cf = {

    hideGroup : function($group, animate) {

    },

    showGroup : function($group, animate) {

    },

    updateRepeaterSubHTML : function(html, oldSuffix, newSuffix, parentRepeaters) {
        const oldIndexes = oldSuffix.split('__');
        oldIndexes.shift(); // remove first empty element
        const newIndexes = newSuffix.split('__');
        newIndexes.shift(); // remove first empty element

        let returnHtml = html;

        if (
            oldIndexes && newIndexes &&
            oldIndexes.length === parentRepeaters.length &&
            newIndexes.length === parentRepeaters.length
        ) {

            const parentRepeatersInfo = parentRepeaters.map((repeaterId, i) => {
                return {[repeaterId.split('__')[0]]: [oldIndexes[i], newIndexes[i]]};
            });

            const length = parentRepeatersInfo.length;

            let replacements = oldIndexes.map( (oldIndex, i) => {
                return [
                    '__'+oldIndexes.slice(0,length-i).join('__'),
                    '__'+newIndexes.slice(0,length-i).join('__'),
                ];
            });

            
            for (let i=0; i<length ; i++) {
                const id = Object.keys(parentRepeatersInfo[i])[0];
                const find = parentRepeatersInfo[i][id][0];
                const repl = parentRepeatersInfo[i][id][1];
                replacements.push([
                    `<span class="wpcf7cf-index wpcf7cf__${id}">${find}<\\/span>`,
                    `<span class="wpcf7cf-index wpcf7cf__${id}">${repl}</span>`
                ]);
            }
            
            replacements.forEach( ([oldSuffix, newSuffix]) => {
                returnHtml = returnHtml.replace(new RegExp(oldSuffix,'g'), newSuffix);
            });

        }

        return returnHtml ;
    },

    // keep this for backwards compatibility
    initForm : function($forms) {
        $forms.each(function(){
            const $form = jQuery(this);
            // only add form is its class is "wpcf7-form" and if the form was not previously added
            if (
                $form.hasClass('wpcf7-form') &&
                !wpcf7cf_forms.some((form)=>{ return form.$form.get(0) === $form.get(0); })
            ) {
                wpcf7cf_forms.push(new Wpcf7cfForm($form));
            }
        });
    },

    getWpcf7cfForm : function ($form) {
        const matched_forms = wpcf7cf_forms.filter((form)=>{
            return form.$form.get(0) === $form.get(0);
        });
        if (matched_forms.length) {
            return matched_forms[0];
        }
        return false;
    },

    get_nested_conditions : function(form) {
        const conditions = form.initial_conditions;
        //loop trough conditions. Then loop trough the dom, and each repeater we pass we should update all sub_values we encounter with __index
        form.reloadSimpleDom();
        const groups = Object.values(form.simpleDom).filter(function(item, i) {
            return item.type==='group';
        });

        let sub_conditions = [];

        for(let i = 0;  i < groups.length; i++) {
            const g = groups[i];
            let relevant_conditions = conditions.filter(function(condition, i) {
                return condition.then_field === g.original_name;
            });
            
            relevant_conditions = relevant_conditions.map(function(item,i) {
                return {
                    then_field : g.name,
                    and_rules : item.and_rules.map(function(and_rule, i) {
                        return {
                            if_field : and_rule.if_field+g.suffix,
                            if_value : and_rule.if_value,
                            operator : and_rule.operator
                        };
                    })
                }
            });

            sub_conditions = sub_conditions.concat(relevant_conditions);
        }
        return sub_conditions;
    },

    get_simplified_dom_model : function(currentNode, simplified_dom = {}, parentGroups = [], parentRepeaters = []) {

        const type = currentNode.classList && currentNode.classList.contains('wpcf7cf_repeater') ? 'repeater' :
            currentNode.dataset.class == 'wpcf7cf_group' ? 'group' :
            currentNode.className == 'wpcf7cf_step' ? 'step' :
            currentNode.hasAttribute('name') ? 'input' : false;

        let newParentRepeaters = [...parentRepeaters];
        let newParentGroups = [...parentGroups];

        if (type) {

            const name = type === 'input' ? currentNode.getAttribute('name') : currentNode.dataset.id;
            
            if (type === 'repeater') {
                newParentRepeaters.push(name);
            }
            if (type === 'group') {
                newParentGroups.push(name);
            }

            // skip _wpcf7 hidden fields
            if (name.substring(0,6) === '_wpcf7') return {};
    
            const original_name = type === 'repeater' || type === 'group' ? currentNode.dataset.orig_data_id
                                    : type === 'input' ? (currentNode.getAttribute('data-orig_name') || name)
                                    : name;
    
            const nameWithoutBrackets = name.replace('[]','');
            const originalNameWithoutBrackets = original_name.replace('[]','');
    
            const val = type === 'step' ? [currentNode.dataset.id.substring(5)] : [];
    
            const suffix = nameWithoutBrackets.replace(originalNameWithoutBrackets, '');
    
            if (!simplified_dom[name]) {
                // init entry
                simplified_dom[name] = {name, type, original_name, suffix, val, parentGroups, parentRepeaters}
            }
    
            if (type === 'input') {
    
                // skip unchecked checkboxes and radiobuttons
                if ( (currentNode.type === 'checkbox' || currentNode.type === 'radio') && !currentNode.checked ) return {};
    
                // if multiselect, make sure to add all the values
                if ( currentNode.multiple && currentNode.options ) {
                    simplified_dom[name].val = Object.values(currentNode.options).filter(o => o.selected).map(o => o.value)
                } else {
                    simplified_dom[name].val.push(currentNode.value);
                }
            }
        }
        
        // can't use currentNode.children (because then field name cannot be "children")
        const getter = Object.getOwnPropertyDescriptor(Element.prototype, "children").get;
        const children = getter.call(currentNode);

        Array.from(children).forEach(childNode => {
            const dom = wpcf7cf.get_simplified_dom_model(childNode, simplified_dom, newParentGroups, newParentRepeaters);
            simplified_dom = {...dom, ...simplified_dom} ;
        });

        return simplified_dom;
    },

    updateMultistepState: function (multistep) {
        if (multistep == null) return;
        if (multistep.form.$form.hasClass('submitting')) return;

        // update hidden input field

        const stepsData = {
            currentStep : multistep.currentStep,
            numSteps : multistep.numSteps,
            fieldsInCurrentStep : multistep.getFieldsInStep(multistep.currentStep)
        };
        multistep.form.$input_steps.val(JSON.stringify(stepsData));

        // update Buttons
        multistep.$btn_prev.removeClass('disabled').attr('disabled', false);
        multistep.$btn_next.removeClass('disabled').attr('disabled', false);
        if (multistep.currentStep == multistep.numSteps) {
            multistep.$btn_next.addClass('disabled').attr('disabled', true);
        }
        if (multistep.currentStep == 1) {
            multistep.$btn_prev.addClass('disabled').attr('disabled', true);
        }

        // replace next button with submit button on last step.
        // TODO: make this depend on a setting
        const $submit_button = multistep.form.$form.find('input[type="submit"]:last').eq(0);
        const $ajax_loader = multistep.form.$form.find('.wpcf7-spinner').eq(0);

        $submit_button.detach().prependTo(multistep.$btn_next.parent());
        $ajax_loader.detach().prependTo(multistep.$btn_next.parent());

        if (multistep.currentStep == multistep.numSteps) {
            multistep.$btn_next.hide();
            $submit_button.show();
        } else {
            $submit_button.hide();
            multistep.$btn_next.show();
        }

        // update dots
        const $dots = multistep.$dots.find('.dot');
        $dots.removeClass('active').removeClass('completed');
        for(let step = 1; step <= multistep.numSteps; step++) {
            if (step < multistep.currentStep) {
                $dots.eq(step-1).addClass('completed');
            } else if (step == multistep.currentStep) {
                $dots.eq(step-1).addClass('active');
            }
        }

    },

    should_group_be_shown : function(condition, form) {

        let show_group = true;
        let atLeastOneFieldFound = false;

        for (let and_rule_i = 0; and_rule_i < condition.and_rules.length; and_rule_i++) {

            let condition_ok = false;

            const condition_and_rule = condition.and_rules[and_rule_i];

            const inputField = form.getFieldByName(condition_and_rule.if_field);

            if (!inputField) continue; // field not found

            atLeastOneFieldFound = true;

            const if_val = condition_and_rule.if_value;
            let operator = condition_and_rule.operator;

            //backwards compat
            operator = operator === '≤' ? 'less than or equals' : operator;
            operator = operator === '≥' ? 'greater than or equals' : operator;
            operator = operator === '>' ? 'greater than' : operator;
            operator = operator === '<' ? 'less than' : operator;

            const $field = operator === 'function' && jQuery(`[name="${inputField.name}"]`).eq(0);

            condition_ok = this.isConditionTrue(inputField.val,operator,if_val, $field);

            show_group = show_group && condition_ok;
        }

        return show_group && atLeastOneFieldFound;

    },

    isConditionTrue(values, operator, testValue='', $field=jQuery()) {

        if (!Array.isArray(values)) {
            values = [values];
        }

        let condition_ok = false; // start by assuming that the condition is not met

        // Considered EMPTY:       []     ['']          [null]        ['',null]    [,,'']
        // Considered NOT EMPTY:   [0]    ['ab','c']    ['',0,null]
        const valuesAreEmpty = values.length === 0 || values.every((v) => !v&&v!==0); // 0 is not considered empty

        // special cases: [] equals '' => TRUE; [] not equals '' => FALSE
        if (operator === 'equals' && testValue === '' && valuesAreEmpty)  {
            return true;
        }
        if (operator === 'not equals' && testValue === '' && valuesAreEmpty) {
            return false;
        }

        if (valuesAreEmpty) {
            if (operator === 'is empty') {
                condition_ok = true;
            }
        } else {
            if (operator === 'not empty') {
                condition_ok = true;
            }
        }

        const testValueNumber = isFinite(parseFloat(testValue)) ? parseFloat(testValue) : NaN;


        if (operator === 'not equals' || operator === 'not equals (regex)') {
            // start by assuming that the condition is met
            condition_ok = true;
        }

        if (
            operator === 'function'
            && typeof window[testValue] == 'function'
            && window[testValue]($field) // here we call the actual user defined function
        ) {
            condition_ok = true;
        }

        let regex_patt = /.*/i; // fallback regex pattern
        let isValidRegex = true;
        if (operator === 'equals (regex)' || operator === 'not equals (regex)') {
            try {
                regex_patt = new RegExp(testValue, 'i');
            } catch(e) {
                isValidRegex = false;
            }
        }


        for(let i = 0; i < values.length; i++) {

            const value = values[i];

            const valueNumber = isFinite(parseFloat(value)) ? parseFloat(value) : NaN;
            const valsAreNumbers = !isNaN(valueNumber) && !isNaN(testValueNumber);

            if (

                operator === 'equals' && value === testValue ||
                operator === 'equals (regex)' && regex_patt.test(value) ||
                operator === 'greater than' && valsAreNumbers && valueNumber > testValueNumber ||
                operator === 'less than' && valsAreNumbers && valueNumber < testValueNumber ||
                operator === 'greater than or equals' && valsAreNumbers && valueNumber >= testValueNumber ||
                operator === 'less than or equals' && valsAreNumbers && valueNumber <= testValueNumber
                
            ) {

                condition_ok = true;
                break;

            } else if (

                operator === 'not equals' && value === testValue ||
                operator === 'not equals (regex)' && regex_patt.test(value)

            ) {

                condition_ok = false;
                break;

            }
        }

        return condition_ok;

    },

    getFormObj($form) {
        if (typeof $form === 'string') {
            $form = jQuery($form).eq(0);
        }
        return wpcf7cf.getWpcf7cfForm($form);
    },

    getRepeaterObj($form, repeaterDataId) {
        const form = wpcf7cf.getFormObj($form);
        const repeater = form.repeaters.find( repeater => repeater.params.$repeater.attr('data-id') === repeaterDataId );

        return repeater;

    },

    getMultiStepObj($form){
        const form = wpcf7cf.getFormObj($form);
        return form.multistep;
    },

    /**
     * Append a new sub-entry to the repeater with the name `repeaterDataId` inside the form `$form`
     * @memberof wpcf7cf
     * @function wpcf7cf.repeaterAddSub
     * @link
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {String} repeaterDataId - *data-id* attribute of the repeater. Normally this is simply the name of the repeater. However, in case of a nested repeater you need to append the name with the correct suffix. For example `my-nested-repeater__1__3`. Hint (check the `data-id` attribute in the HTML code to find the correct suffix)
     */
    repeaterAddSub($form,repeaterDataId) {
        const repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
        repeater.updateSubs(repeater.params.$repeater.num_subs+1);
    },

    /**
     * Insert a new sub-entry at the given `index` of the repeater with the name `repeaterDataId` inside the form `$form`
     * @memberof wpcf7cf
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {String} repeaterDataId - *data-id* attribute of the repeater.
     * @param {Number} index - position where to insert the new sub-entry within the repeater
     */
    repeaterAddSubAtIndex($form,repeaterDataId,index) {
        const repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
        repeater.addSubs(1, index);
    },

    /**
     * Remove the sub-entry at the given `index` of the repeater with the *data-id* attribute of `repeaterDataId` inside the form `$form`
     * @memberof wpcf7cf
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {String} repeaterDataId - *data-id* attribute of the repeater.
     * @param {Number} index - position where to insert the new sub-entry within the repeater
     */
    repeaterRemoveSubAtIndex($form,repeaterDataId,index) {
        const repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
        repeater.removeSubs(1, index);
    },

    /**
     * Remove the last sub-entry from the repeater with the *data-id* attribute of `repeaterDataId` inside the form `$form`
     * @memberof wpcf7cf
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {String} repeaterDataId - *data-id* attribute of the repeater.
     * @param {Number} index - position where to insert the new sub-entry within the repeater
     */ 
    repeaterRemoveSub($form,repeaterDataId) {
        const repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
        repeater.updateSubs(repeater.params.$repeater.num_subs-1);
    },

    /**
     * Set the number of subs for the repeater with the *data-id* attribute of `repeaterDataId` inside the form `$form`.
     * Subs are either appended to or removed from the end of the repeater.
     * @memberof wpcf7cf
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {String} repeaterDataId - *data-id* attribute of the repeater.
     * @param {Number} numberOfSubs - position where to insert the new sub-entry within the repeater
     */ 
    repeaterSetNumberOfSubs($form, repeaterDataId, numberOfSubs) {
        const repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
        repeater.updateSubs(numberOfSubs);
    },

    /**
     * Move to step number `step`, ignoring any validation.
     * @memberof wpcf7cf
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {*} step 
     */
    multistepMoveToStep($form, step) {
        const multistep = wpcf7cf.getMultiStepObj($form);
        multistep.moveToStep(step); 
    },

    /**
     * Validate the current step, and move to step number `step` if validation passes.
     * @memberof wpcf7cf
     * @param {String|JQuery} $form - JQuery object or css-selector representing the form
     * @param {Number} step 
     */
    async multistepMoveToStepWithValidation($form, step) {
        const multistep = wpcf7cf.getMultiStepObj($form);

        const result = await multistep.validateStep(multistep.currentStep);
        if (result === 'success') {
            multistep.moveToStep(step); 
        }
    },


};

jQuery('.wpcf7-form').each(function(){
    wpcf7cf_forms.push(new Wpcf7cfForm(jQuery(this)));
});

// Call displayFields again on all forms
// Necessary in case some theme or plugin changed a form value by the time the entire page is fully loaded.
jQuery('document').ready( function() {
    wpcf7cf_forms.forEach(function(f){
        f.displayFields();
    });
});

// fix for exclusive checkboxes in IE (this will call the change-event again after all other checkboxes are unchecked, triggering the display_fields() function)
const old_wpcf7ExclusiveCheckbox = jQuery.fn.wpcf7ExclusiveCheckbox;
jQuery.fn.wpcf7ExclusiveCheckbox = function() {
    return this.find('input:checkbox').on('click', function() {
        const name = jQuery(this).attr('name');
        jQuery(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false).eq(0).change();
    });
};