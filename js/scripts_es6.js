"use strict";

var cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

var wpcf7cf_timeout;

var wpcf7cf_show_animation = { "height": "show", "marginTop": "show", "marginBottom": "show", "paddingTop": "show", "paddingBottom": "show" };
var wpcf7cf_hide_animation = { "height": "hide", "marginTop": "hide", "marginBottom": "hide", "paddingTop": "hide", "paddingBottom": "hide" };

var wpcf7cf_show_step_animation = { "opacity": "show" };
var wpcf7cf_hide_step_animation = { "opacity": "hide" };

var wpcf7cf_change_events = 'input.wpcf7cf paste.wpcf7cf change.wpcf7cf click.wpcf7cf propertychange.wpcf7cf';

var wpcf7cf_forms = [];

// endswith polyfill
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}

var Wpcf7cfForm = function($form) {

    var options_element = $form.find('input[name="_wpcf7cf_options"]').eq(0);
    if (!options_element.length || !options_element.val()) {
        // doesn't look like a CF7 form created with conditional fields plugin enabled.
        return false;
    }

    var form = this;

    var form_options = JSON.parse(options_element.val());

    form.$form = $form;
    form.$input_hidden_group_fields = $form.find('[name="_wpcf7cf_hidden_group_fields"]');
    form.$input_hidden_groups = $form.find('[name="_wpcf7cf_hidden_groups"]');
    form.$input_visible_groups = $form.find('[name="_wpcf7cf_visible_groups"]');
    form.$input_repeaters = $form.find('[name="_wpcf7cf_repeaters"]');
    form.$input_steps = $form.find('[name="_wpcf7cf_steps"]');

    form.unit_tag = $form.closest('.wpcf7').attr('id');
    form.conditions = form_options['conditions'];

    // compatibility with conditional forms created with older versions of the plugin ( < 1.4 )
    for (var i=0; i < form.conditions.length; i++) {
        var condition = form.conditions[i];
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
    form.$form.on('reset.wpcf7cf', form, function(e) {
        var form = e.data;
        setTimeout(function(){
            form.displayFields();
            form.resetRepeaters();
            if (form.multistep != null) {
                form.multistep.moveToStep(1); 
            }
        },200);
    });

    // PRO ONLY

    jQuery('.wpcf7cf_repeater:not(.wpcf7cf_repeater .wpcf7cf_repeater)', $form).each(function(){
        form.repeaters.push(new Wpcf7cfRepeater(jQuery(this),form));
    });

    form.$input_repeaters.val(JSON.stringify(form.repeaters.map((item)=>item.params.$repeater.id)));

    var $multistep = jQuery('.wpcf7cf_multistep', $form);

    if ($multistep.length) {
        form.multistep = new Wpcf7cfMultistep($multistep, form);
        // window.wpcf7cf.updateMultistepState(form.multistep);
    }

    // END PRO ONLY

}

/**
 * reset initial number of subs for each repeater.
 * (does not clear values)
 */
Wpcf7cfForm.prototype.resetRepeaters = function() {
    var form = this;
    form.repeaters.forEach(repeater => {
        repeater.updateSubs( repeater.params.$repeater.initial_subs );
    });
}

Wpcf7cfForm.prototype.displayFields = function() {

    var form = this;

    window.wpcf7cf.get_simplified_dom_model(form.$form);

    var unit_tag = this.unit_tag;
    var wpcf7cf_conditions = this.conditions;
    var wpcf7cf_settings = this.settings;

    //for compatibility with contact-form-7-signature-addon
    if (cf7signature_resized === 0 && typeof signatures !== 'undefined' && signatures.constructor === Array && signatures.length > 0 ) {
        for (var i = 0; i < signatures.length; i++) {
            if (signatures[i].canvas.width === 0) {

                var $sig_canvas = jQuery(".wpcf7-form-control-signature-body>canvas");
                var $sig_wrap = jQuery(".wpcf7-form-control-signature-wrap");
                $sig_canvas.eq(i).attr('width',  $sig_wrap.width());
                $sig_canvas.eq(i).attr('height', $sig_wrap.height());

                cf7signature_resized = 1;
            }
        }
    }

    form.$groups.addClass('wpcf7cf-hidden');

    for (var i=0; i < wpcf7cf_conditions.length; i++) {

        var condition = wpcf7cf_conditions[i];

        var show_group = window.wpcf7cf.should_group_be_shown(condition, form.$form);

        if (show_group) {
            jQuery('[data-id='+condition.then_field+']',form.$form).eq(0).removeClass('wpcf7cf-hidden');
        }
    }

    var animation_intime = wpcf7cf_settings.animation_intime;
    var animation_outtime = wpcf7cf_settings.animation_outtime;

    form.$groups.each(function (index) {
        var $group = jQuery(this);
        if ($group.is(':animated')) $group.finish(); // stop any current animations on the group
        if ($group.css('display') === 'none' && !$group.hasClass('wpcf7cf-hidden')) {
            if ($group.prop('tagName') === 'SPAN') {
                $group.show().trigger('wpcf7cf_show_group');
            } else {
                $group.animate(wpcf7cf_show_animation, animation_intime).trigger('wpcf7cf_show_group'); // show
            }
        } else if ($group.css('display') !== 'none' && $group.hasClass('wpcf7cf-hidden')) {

            if ($group.attr('data-clear_on_hide') !== undefined) {
                var $inputs = jQuery(':input', $group).not(':button, :submit, :reset, :hidden');

                $inputs.each(function(){
                    var $this = jQuery(this);
                    $this.val(this.defaultValue);
                    $this.prop('checked', this.defaultChecked);
                });

                $inputs.change();
                //display_fields();
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
    var $summary = jQuery('.wpcf7cf-summary', this.$form);

    if ($summary.length == 0 || !$summary.is(':visible')) return;

    var fd = new FormData();

    var formdata = this.$form.serializeArray();
    jQuery.each(formdata,function(key, input){
        fd.append(input.name, input.value);
    });

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

    var form = this;

    var hidden_fields = [];
    var hidden_groups = [];
    var visible_groups = [];

    form.$groups.each(function () {
        var $this = jQuery(this);
        if ($this.hasClass('wpcf7cf-hidden')) {
            hidden_groups.push($this.data('id'));
            $this.find('input,select,textarea').each(function () {
                hidden_fields.push(jQuery(this).attr('name'));
            });
        } else {
            visible_groups.push($this.data('id'));
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
    var form = this;
    form.$groups = form.$form.find('[data-class="wpcf7cf_group"]');

    form.conditions = window.wpcf7cf.get_nested_conditions(form.initial_conditions, form.$form);

};
Wpcf7cfForm.prototype.updateEventListeners = function() {

    var form = this;

    // monitor input changes, and call display_fields() if something has changed
    jQuery('input, select, textarea, button',form.$form).not('.wpcf7cf_add, .wpcf7cf_remove').off(wpcf7cf_change_events).on(wpcf7cf_change_events,form, function(e) {
        var form = e.data;
        clearTimeout(wpcf7cf_timeout);
        wpcf7cf_timeout = setTimeout(function() {
            form.displayFields();
        }, 100);
    });

    // PRO ONLY
    jQuery('.wpcf7cf-togglebutton', form.$form).off('click.toggle_wpcf7cf').on('click.toggle_wpcf7cf',function() {
        var $this = jQuery(this);
        if ($this.text() === $this.data('val-1')) {
            $this.text($this.data('val-2'));
            $this.val($this.data('val-2'));
        } else {
            $this.text($this.data('val-1'));
            $this.val($this.data('val-1'));
        }
    });
    // END PRO ONLY
};

// PRO ONLY
function Wpcf7cfRepeater($repeater, form) {
    var $ = jQuery;

    var repeater = this;

    var wpcf7cf_settings = form.settings;

    repeater.form = form;

    $repeater.num_subs = 0;
    $repeater.id = $repeater.data('id');
    $repeater.orig_id = $repeater.data('orig_data_id');
    $repeater.min = typeof( $repeater.data('min')) !== 'undefined' ? parseInt($repeater.data('min')) : 1;
    $repeater.max = typeof( $repeater.data('max')) !== 'undefined' ? parseInt($repeater.data('max')) : 200;
    $repeater.initial_subs = typeof( $repeater.data('initial')) !== 'undefined' ? parseInt($repeater.data('initial')) : $repeater.min;
    if ($repeater.initial_subs > $repeater.max) $repeater.initial_subs = $repeater.max;
    var $repeater_sub = $repeater.children('.wpcf7cf_repeater_sub').eq(0);
    var $repeater_controls = $repeater.children('.wpcf7cf_repeater_controls').eq(0);

    var $repeater_sub_clone = $repeater_sub.clone();

    $repeater_sub_clone.find('.wpcf7cf_repeater_sub').addBack('.wpcf7cf_repeater_sub').each(function() {
        var $this = jQuery(this);
        var prev_suffix = $this.attr('data-repeater_sub_suffix');
        var new_suffix = prev_suffix+'__{{repeater_sub_suffix}}';
        $this.attr('data-repeater_sub_suffix', new_suffix);
    });

    $repeater_sub_clone.find('[name]').each(function() {
        var $this = jQuery(this);
        var prev_name = $this.attr('name');
        var orig_name = $this.attr('data-orig_name') != null ? $this.attr('data-orig_name') : prev_name;
        var new_name = prev_name+'__{{repeater_sub_suffix}}';

        if(prev_name.endsWith('_count')) {
            new_name = prev_name.replace('_count','__{{repeater_sub_suffix}}_count');
        }

        $this.attr('name', new_name);
        $this.attr('data-orig_name', orig_name);
        $this.closest('.wpcf7-form-control-wrap').addClass(new_name);
    });

    $repeater_sub_clone.find('.wpcf7cf_repeater,[data-class="wpcf7cf_group"]').each(function() {
        var $this = jQuery(this);
        var prev_data_id = $this.attr('data-id');
        var orig_data_id = $this.attr('data-orig_data_id') != null ? $this.attr('data-orig_data_id') : prev_data_id;
        var new_data_id = prev_data_id+'__{{repeater_sub_suffix}}';

        if(prev_data_id.endsWith('_count')) {
            new_data_id = prev_data_id.replace('_count','__{{repeater_sub_suffix}}_count');
        }

        $this.attr('data-id', new_data_id);
        $this.attr('data-orig_data_id', orig_data_id);
        $this.closest('.wpcf7-form-control-wrap').addClass(new_data_id);
    });

    $repeater_sub_clone.find('[id]').each(function() {
        var $this = jQuery(this);
        var prev_id = $this.attr('id');
        var orig_id =  $this.attr('data-orig_id') != null ? $this.attr('data-orig_id') : prev_id;
        var new_id = prev_id+'__{{repeater_sub_suffix}}';

        $this.attr('id', new_id);
        $this.attr('data-orig_id', orig_id);
        $this.closest('.wpcf7-form-control-wrap').addClass(new_id);
    });

    $repeater_sub_clone.find('[for]').each(function() {
        var $this = jQuery(this);
        var prev_for = $this.attr('for');
        var orig_for =  $this.attr('data-orig_for') != null ? $this.attr('data-orig_for') : prev_for;
        var new_for = prev_for+'__{{repeater_sub_suffix}}';

        $this.attr('for', new_for);
        $this.attr('data-orig_for', orig_for);
        $this.closest('.wpcf7-form-control-wrap').addClass(new_for);
    });

    var repeater_sub_html = $repeater_sub_clone[0].outerHTML;

    var $repeater_count_field = $repeater.find('[name='+$repeater.id+'_count]').eq(0);
    var $button_add = $repeater_controls.find('.wpcf7cf_add').eq(0);
    var $button_remove = $repeater_controls.find('.wpcf7cf_remove').eq(0);

    var params = {
        $repeater:             $repeater,
        $repeater_count_field: $repeater_count_field,
        repeater_sub_html:     repeater_sub_html,
        $repeater_controls:    $repeater_controls,
        $button_add:           $button_add,
        $button_remove:        $button_remove,
        wpcf7cf_settings:      wpcf7cf_settings
    };
    
    this.params = params;

    $button_add.click( repeater, function(e) {
        var repeater = e.data;
        repeater.updateSubs(params.$repeater.num_subs+1);
    });

    $button_remove.click( repeater,function(e) {
        var repeater = e.data;
        repeater.updateSubs(params.$repeater.num_subs-1);
    });

    jQuery('> .wpcf7cf_repeater_sub',params.$repeater).eq(0).remove(); // remove the first sub, it's just a template.

    repeater.updateSubs($repeater.initial_subs); 

}



Wpcf7cfRepeater.prototype.updateSubs = function(subs_to_show) {
    var repeater = this;
    var params = repeater.params;
    var subs_to_add = subs_to_show - params.$repeater.num_subs;

    if (subs_to_add < 0) {
        repeater.removeSubs(-subs_to_add);
    } else if (subs_to_add > 0) {
        repeater.addSubs(subs_to_add);
    }

    var showButtonRemove = false;
    var showButtonAdd = false;

    if (params.$repeater.num_subs < params.$repeater.max) {
        showButtonAdd = true;
    }
    if (params.$repeater.num_subs > params.$repeater.min) {
        showButtonRemove = true;
    }

    if (showButtonAdd) {
        params.$button_add.show();
    } else {
        params.$button_add.hide();

    }

    if (showButtonRemove) {
        params.$button_remove.show();
    } else {
        params.$button_remove.hide();
    }

    params.$repeater_count_field.val(subs_to_show);

};
Wpcf7cfRepeater.prototype.addSubs = function(subs_to_add) {
    var $ = jQuery;
    var params = this.params;
    var repeater = this;
    var form = repeater.form;


    var $repeater = params.$repeater; 
    var $repeater_controls = params.$repeater_controls;

    //jQuery(params.repeater_sub_html.replace(/name="(.*?)"/g,'name="wpcf7cf_repeater['+$repeater.id+']['+$repeater.num_subs+'][$1]" data-original-name="$1"')).hide().insertBefore($repeater_controls).animate(wpcf7cf_show_animation, params.wpcf7cf_settings.animation_intime);

    var html_str = '';

    for(var i=1; i<=subs_to_add; i++) {
        var sub_suffix = $repeater.num_subs+i;
        html_str += params.repeater_sub_html.replace(/\{\{repeater_sub_suffix\}\}/g,sub_suffix)
        .replace(new RegExp('\{\{'+$repeater.orig_id+'_index\}\}','g'),sub_suffix);
    }


    var $html = jQuery(html_str);

    // Add the newly created fields to the form
    $html.hide().insertBefore($repeater_controls).animate(wpcf7cf_show_animation, params.wpcf7cf_settings.animation_intime).trigger('wpcf7cf_repeater_added');

    jQuery('.wpcf7cf_repeater', $html).each(function(){
        form.repeaters.push(new Wpcf7cfRepeater(jQuery(this),form));
    });
    form.$input_repeaters.val(JSON.stringify(form.repeaters.map((item)=>item.params.$repeater.id)));

    $repeater.num_subs+= subs_to_add;

    window.wpcf7cf.updateMultistepState(form.multistep);
    form.updateGroups();
    form.updateEventListeners();
    form.displayFields();

    // Exclusive Checkbox
    $html.on( 'click', '.wpcf7-exclusive-checkbox input:checkbox', function() {
        var name = $( this ).attr( 'name' );
        $html.find( 'input:checkbox[name="' + name + '"]' ).not( this ).prop( 'checked', false );
    } );

    //basic compatibility with material-design-for-contact-form-7
    if (typeof window.cf7mdInit === "function") {
        window.cf7mdInit();
    }

    return false;
};
Wpcf7cfRepeater.prototype.removeSubs = function(num_subs) {
    var $ = jQuery;
    var params = this.params;
    var form = this.form;

    params.$repeater.num_subs-= num_subs;

    jQuery('> .wpcf7cf_repeater_sub',params.$repeater).slice(-num_subs).animate(wpcf7cf_hide_animation, {duration:params.wpcf7cf_settings.animation_intime, done:function() {
        var $this = jQuery(this);
        //remove the actual fields from the form
        $this.remove();
        params.$repeater.trigger('wpcf7cf_repeater_removed');
        window.wpcf7cf.updateMultistepState(form.multistep);
        form.updateGroups();
        form.updateEventListeners();
        form.displayFields();
    }});

    return false;
};

function Wpcf7cfMultistep($multistep, form) {
    var multistep = this;
    multistep.$multistep = $multistep;
    multistep.form = form;
    multistep.$steps = $multistep.find('.wpcf7cf_step');
    multistep.$btn_next = $multistep.find('.wpcf7cf_next');
    multistep.$btn_prev = $multistep.find('.wpcf7cf_prev');
    multistep.$dots = $multistep.find('.wpcf7cf_steps-dots');
    multistep.currentStep = 0;
    multistep.numSteps = multistep.$steps.length;


    multistep.$dots.html('');
    for (var i = 1; i <= multistep.numSteps; i++) {
        multistep.$dots.append(`
            <div class="dot" data-step="${i}">
                <div class="step-index">${i}</div>
                <div class="step-title">${multistep.$steps.eq(i-1).data('title')}</div>
            </div>
        `);
    }

    multistep.$btn_next.on('click.wpcf7cf_step', async function() {
        
        var result = await multistep.validateStep(multistep.currentStep);
        if (result === 'success') {
            multistep.moveToStep(multistep.currentStep+1); 
        }

    });

    // If form is submitted (by pressing retrun for example), and if we are not on the last step,
    // then trigger click event on the $next button instead.
    multistep.form.$form.on('submit.wpcf7cf_step', function(e) {

        if (multistep.currentStep !== multistep.numSteps) {
            multistep.$btn_next.trigger('click.wpcf7cf_step');

            e.stopImmediatePropagation();
            return false;
        }
    });

    multistep.$btn_prev.click(function() {
        multistep.moveToStep(multistep.currentStep-1);
    });

    multistep.moveToStep(1);
}

jQuery(document).ajaxComplete(function(e, xhr, settings){
    if (
        xhr.hasOwnProperty('responseJSON')          &&
        xhr.responseJSON != null                    &&
        xhr.responseJSON.hasOwnProperty('status')   &&
        xhr.responseJSON.hasOwnProperty('into')     &&
        xhr.responseJSON.status === "mail_success"
    ) {
        jQuery( xhr.responseJSON.into ).trigger('reset.wpcf7cf');
    }
});

Wpcf7cfMultistep.prototype.validateStep = function(step_index) {

    var multistep = this;
    var $multistep = multistep.$multistep;
    var $form = multistep.form.$form;

    $form.find('.wpcf7-response-output').addClass('wpcf7-display-none');

    return new Promise(resolve => {

        var fd = new FormData();

        // TEST IF FILES UPLOADS WORK? THEN REMOVE THIS
        // jQuery.each($form.find('[data-id="step'+step_index+'"] input[type="file"]'), function(index, el) {
        //     fd.append(jQuery(el).attr('name'), jQuery(el)[0].files[0]);
        // });

        var formdata = $form.serializeArray();
        jQuery.each(formdata,function(key, input){
            fd.append(input.name, input.value);
        });

        jQuery.ajax({
            url: wpcf7cf_global_settings.ajaxurl + '?action=wpcf7cf_validate_step',
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
        }).done(function(json) {

            /*
            * Insert _form_data_id if 'json variable' has
            */
            if (typeof json._cf7mls_db_form_data_id != 'undefined') {
                if (!form.find('input[name="_cf7mls_db_form_data_id"]').length) {
                    form.append('<input type="hidden" name="_cf7mls_db_form_data_id" value="'+json._cf7mls_db_form_data_id+'" />');
                }
            }

            //reset error messages
            $multistep.find('.wpcf7-form-control-wrap').removeClass('cf7mls-invalid');
            $multistep.find('.wpcf7-form-control-wrap .wpcf7-not-valid-tip').remove();
            $multistep.find('.wpcf7-response-output').remove();
            $multistep.find('.wpcf7-response-output.wpcf7-validation-errors').removeClass('wpcf7-validation-errors');

            if (!json.success) {
                var checkError = 0;

                jQuery.each(json.invalid_fields, function(index, el) {
                    if ($multistep.find('input[name="'+index+'"]').length ||
                        $multistep.find('input[name="'+index+'[]"]').length ||
                        $multistep.find('select[name="'+index+'"]').length ||
                        $multistep.find('select[name="'+index+'[]"]').length ||
                        $multistep.find('textarea[name="'+index+'"]').length ||
                        $multistep.find('textarea[name="'+index+'[]"]').length
                    ) {
                        checkError = checkError + 1;

                        var controlWrap = jQuery('.wpcf7-form-control-wrap.' + index, $form);
                        controlWrap.addClass('cf7mls-invalid');
                        controlWrap.find('span.wpcf7-not-valid-tip').remove();
                        controlWrap.append('<span role="alert" class="wpcf7-not-valid-tip">' + el.reason + '</span>');

                        //return false;
                    }
                });

                resolve('failed');
                //$multistep.append('<div class="wpcf7-response-output wpcf7-display-none wpcf7-validation-errors" style="display: block;" role="alert">' + json.message + '</div>');

                console.log($multistep.parent().find('.wpcf7-response-output'));
                $multistep.parent().find('.wpcf7-response-output').removeClass('wpcf7-display-none').html(json.message);

            } else if (json.success) {
                resolve('success');
                return false;
            }

        }).fail(function() {
            resolve('error');
        }).always(function() {
            // do nothing
        });
    });

};
Wpcf7cfMultistep.prototype.moveToStep = function(step_index) {
    var multistep = this;
    var previousStep = multistep.currentStep;

    multistep.currentStep = step_index > multistep.numSteps ? multistep.numSteps
                                : step_index < 1 ? 1
                                    : step_index;

    // ANIMATION DISABLED FOR NOW cause it's ugly
    // multistep.$steps.animate(wpcf7cf_hide_step_animation, multistep.form.settings.animation_outtime);
    // multistep.$steps.eq(multistep.currentStep-1).animate(wpcf7cf_show_step_animation, multistep.form.settings.animation_intime);

    multistep.$multistep.attr('data-current_step', multistep.currentStep);
    multistep.$steps.hide();
    multistep.$steps
        .eq(multistep.currentStep-1)
        .show()
        .trigger('wpcf7cf_change_step', [previousStep, multistep.currentStep]);

    multistep.form.$form[0].scrollIntoView();

    multistep.form.updateSummaryFields();

    window.wpcf7cf.updateMultistepState(multistep);
};

Wpcf7cfMultistep.prototype.getFieldsInStep = function(step_index) {
    var simpleDom = window.wpcf7cf.get_simplified_dom_model(this.form.$form);
    var inStep = false;
    return simpleDom.filter(function(item, i) {
        if(item.type == 'step') {
            inStep = item.step == step_index+'';
        }
        return inStep && item.type == 'input';
    }).map(function(item) {
        return item.name;
    });
};

// END PRO ONLY

window.wpcf7cf = {

    // keep this for backwards compatibility
    initForm : function($form) {
        wpcf7cf_forms.push(new Wpcf7cfForm($form));
    },

    get_nested_conditions : function(conditions, $current_form) {
        //loop trough conditions. Then loop trough the dom, and each repeater we pass we should update all sub_values we encounter with __index
        var simplified_dom = window.wpcf7cf.get_simplified_dom_model($current_form);
        var groups = simplified_dom.filter(function(item, i) {
            return item.type==='group';
        });

        var sub_conditions = [];

        for(var i = 0;  i < groups.length; i++) {
            var g = groups[i];
            var relevant_conditions = conditions.filter(function(condition, i) {
                return condition.then_field === g.original_name;
            });
            
            var relevant_conditions = relevant_conditions.map(function(item,i) {
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
        return conditions.concat(sub_conditions);
    },

    get_simplified_dom_model : function($current_form) {
        // if the dom is something like:
        // <form>
        //   <repeater ra>
        //     <group ga__1>
        //         <repeater rb__1>
        //             <input txta__1__1 />
        //             <input txta__1__2 />
        //         </repeater>
        //         <group gb__1>
        //             <input txtb__1 />
        //         </group>
        //     </group>
        //     <group ga__2>
        //         <repeater rb__2>
        //             <input txta__2__1 />
        //         </repeater>
        //         <group gb__2>
        //             <input txtb__2 />
        //         </group>
        //     </group>
        //   </repeater>
        // </form>
        // 
        // return something like:
        // [{type:repeater, name:'ra', suffix: '__1'}, {type: group, name:'ga', suffix: '__1'}, ...]

        var currentNode;
        var ni = document.createNodeIterator($current_form[0], NodeFilter.SHOW_ELEMENT, null, false); //, NodeFilter.SHOW_ELEMENT, function(){ return NodeFilter.FILTER_ACCEPT; }

        var simplified_dom = [];

        while(currentNode = ni.nextNode()) {
            if (currentNode.classList.contains('wpcf7cf_repeater')) {
                simplified_dom.push({type:'repeater', name:currentNode.dataset.id, original_name:currentNode.dataset.orig_data_id})
            } else if (currentNode.dataset.class == 'wpcf7cf_group') {
                simplified_dom.push({type:'group', name:currentNode.dataset.id, original_name:currentNode.dataset.orig_data_id})
            } else if (currentNode.className == 'wpcf7cf_step') {
                simplified_dom.push({type:'step', name:currentNode.dataset.id, original_name:currentNode.dataset.id, step: currentNode.dataset.id.substring(5)})
            } else if (currentNode.hasAttribute('name')) {
                simplified_dom.push({type:'input', name:currentNode.getAttribute('name'), original_name:currentNode.getAttribute('data-orig_name')})
            }
        }

        simplified_dom = simplified_dom.map(function(item, i){
            var original_name_length = item.original_name == null ? item.name.length : item.original_name.length;
            item.suffix = item.name.substring(original_name_length);
            return item;
        });

        //console.table(simplified_dom);
        return simplified_dom;

    },

    updateMultistepState: function (multistep) {
        if (multistep == null) return;

        // update hidden input field

        var stepsData = {
            currentStep : multistep.currentStep,
            numSteps : multistep.numSteps,
            fieldsInCurrentStep : multistep.getFieldsInStep(multistep.currentStep)
        };
        multistep.form.$input_steps.val(JSON.stringify(stepsData));

        // update Buttons
        multistep.$btn_prev.removeClass('disabled');
        multistep.$btn_next.removeClass('disabled');
        if (multistep.currentStep == multistep.numSteps) {
            multistep.$btn_next.addClass('disabled');
        }
        if (multistep.currentStep == 1) {
            multistep.$btn_prev.addClass('disabled');
        }

        // replace next button with submit button on last step.
        // TODO: make this depend on a setting
        var $submit_button = multistep.form.$form.find('input[type="submit"]').eq(0);
        var $ajax_loader = multistep.form.$form.find('.ajax-loader').eq(0);
        if (multistep.currentStep == multistep.numSteps) {
            multistep.$btn_next.hide();
            $ajax_loader.detach().appendTo(multistep.$btn_next.parent());
            $submit_button.detach().appendTo(multistep.$btn_next.parent());
            $submit_button.show();
        } else {
            $submit_button.hide();
            multistep.$btn_next.show();
        }

        // update dots
        var $dots = multistep.$dots.find('.dot');
        $dots.removeClass('active').removeClass('completed');
        for(var step = 1; step <= multistep.numSteps; step++) {
            if (step < multistep.currentStep) {
                $dots.eq(step-1).addClass('completed');
            } else if (step == multistep.currentStep) {
                $dots.eq(step-1).addClass('active');
            }
        }

    },

    should_group_be_shown : function(condition, $current_form) {

        var $ = jQuery;

        var show_group = true;

        for (var and_rule_i = 0; and_rule_i < condition.and_rules.length; and_rule_i++) {

            var condition_ok = false;

            var condition_and_rule = condition.and_rules[and_rule_i];

            var $field = jQuery('[name="' + condition_and_rule.if_field + '"], [name="' + condition_and_rule.if_field + '[]"], [data-original-name="' + condition_and_rule.if_field + '"], [data-original-name="' + condition_and_rule.if_field + '[]"]',$current_form);

            var if_val = condition_and_rule.if_value;
            var if_val_as_number = isFinite(parseFloat(if_val)) ? parseFloat(if_val):0;
            var operator = condition_and_rule.operator;
            
            var regex_patt = /.*/i; // fallback regex pattern
            var isValidRegex = true;
            try {
                regex_patt = new RegExp(if_val, 'i');
            } catch(e) {
                isValidRegex = false;
            }


            //backwards compat
            operator = operator === '≤' ? 'less than or equals' : operator;
            operator = operator === '≥' ? 'greater than or equals' : operator;
            operator = operator === '>' ? 'greater than' : operator;
            operator = operator === '<' ? 'less than' : operator;


            if ($field.length === 1) {

                // single field (tested with text field, single checkbox, select with single value (dropdown), select with multiple values)

                if ($field.is('select')) {

                    if (operator === 'not equals') {
                        condition_ok = true;
                    }

                    $field.find('option:selected').each(function () {
                        var $option = jQuery(this);
                        var option_val = $option.val()
                        if (
                            operator === 'equals' && option_val === if_val ||
                            operator === 'equals (regex)' && regex_patt.test($option.val())
                        ) {
                            condition_ok = true;
                        } else if (
                            operator === 'not equals' && option_val === if_val ||
                            operator === 'not equals (regex)' && !regex_patt.test($option.val())
                        ) {
                            condition_ok = false;
                            return false; // break out of the loop
                        }
                    });

                    show_group = show_group && condition_ok;
                }

                var field_val = $field.val();
                var field_val_as_number = isFinite(parseFloat(field_val)) ? parseFloat(field_val):0;

                if ($field.attr('type') === 'checkbox') {
                    var field_is_checked = $field.is(':checked');
                    if (
                        operator === 'equals'                   && field_is_checked && field_val === if_val ||
                        operator === 'not equals'               && !field_is_checked ||
                        operator === 'is empty'                 && !field_is_checked ||
                        operator === 'not empty'                && field_is_checked ||
                        operator === 'greater than'             && field_is_checked && field_val_as_number > if_val_as_number ||
                        operator === 'less than'                && field_is_checked && field_val_as_number < if_val_as_number ||
                        operator === 'greater than or equals'   && field_is_checked && field_val_as_number >= if_val_as_number ||
                        operator === 'less than or equals'      && field_is_checked && field_val_as_number <= if_val_as_number ||
                        operator === 'equals (regex)'           && field_is_checked && regex_patt.test(field_val) ||
                        operator === 'not equals (regex)'       && !field_is_checked

                    ) {
                        condition_ok = true;
                    }
                } else if (
                    operator === 'equals'                   && field_val === if_val ||
                    operator === 'not equals'               && field_val !== if_val ||
                    operator === 'equals (regex)'           && regex_patt.test(field_val) ||
                    operator === 'not equals (regex)'       && !regex_patt.test(field_val) ||
                    operator === 'greater than'             && field_val_as_number >  if_val_as_number ||
                    operator === 'less than'                && field_val_as_number <  if_val_as_number ||
                    operator === 'greater than or equals'   && field_val_as_number >= if_val_as_number ||
                    operator === 'less than or equals'      && field_val_as_number <= if_val_as_number ||
                    operator === 'is empty'                 && field_val === '' ||
                    operator === 'not empty'                && field_val !== '' ||
                    (
                        operator === 'function'
                        && typeof window[if_val] == 'function'
                        && window[if_val]($field)
                    )
                ) {
                    condition_ok = true;
                }


            } else if ($field.length > 1) {

                // multiple fields (tested with checkboxes, exclusive checkboxes, dropdown with multiple values)

                var all_values = [];
                var checked_values = [];
                $field.each(function () {
                    all_values.push(jQuery(this).val());
                    if (jQuery(this).is(':checked')) {
                        checked_values.push(jQuery(this).val());
                    }
                });

                var checked_value_index = jQuery.inArray(if_val, checked_values);
                var value_index = jQuery.inArray(if_val, all_values);

                if (
                    ( operator === 'is empty' && checked_values.length === 0 ) ||
                    ( operator === 'not empty' && checked_values.length > 0  )
                ) {
                    condition_ok = true;
                }


                for (var ind = 0; ind < checked_values.length; ind++) {
                    var checked_val = checked_values[ind];
                    var checked_val_as_number = isFinite(parseFloat(checked_val)) ? parseFloat(checked_val):0;
                    if (
                        ( operator === 'equals'                    && checked_val === if_val ) ||
                        ( operator === 'not equals'                && checked_val !== if_val ) ||
                        ( operator === 'equals (regex)'            && regex_patt.test(checked_val) ) ||
                        ( operator === 'not equals (regex)'        && !regex_patt.test(checked_val) ) ||
                        ( operator === 'greater than'              && checked_val_as_number > if_val_as_number ) ||
                        ( operator === 'less than'                 && checked_val_as_number < if_val_as_number ) ||
                        ( operator === 'greater than or equals'    && checked_val_as_number >= if_val_as_number ) ||
                        ( operator === 'less than or equals'       && checked_val_as_number <= if_val_as_number )
                    ) {
                        condition_ok = true;
                    }
                }
            }

            show_group = show_group && condition_ok;
        }

        return show_group;

    }

};


jQuery('.wpcf7-form').each(function(){
    wpcf7cf_forms.push(new Wpcf7cfForm(jQuery(this)));
});

// Call displayFields again on all forms
// Necessary in case some theme or plugin changed a form value by the time the entire page is fully loaded.
jQuery('document').ready(function() {
    wpcf7cf_forms.forEach(function(f){
        f.displayFields();
    });
});

// fix for exclusive checkboxes in IE (this will call the change-event again after all other checkboxes are unchecked, triggering the display_fields() function)
var old_wpcf7ExclusiveCheckbox = jQuery.fn.wpcf7ExclusiveCheckbox;
jQuery.fn.wpcf7ExclusiveCheckbox = function() {
    return this.find('input:checkbox').click(function() {
        var name = jQuery(this).attr('name');
        jQuery(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false).eq(0).change();
    });
};

