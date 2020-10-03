"use strict";

var cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

var wpcf7cf_timeout;
var wpcf7cf_change_time_ms = 100;

if (window.wpcf7cf_running_tests) {
    jQuery('input[name="_wpcf7cf_options"]').each(function(e) {
        var $input = jQuery(this);
        var opt = JSON.parse($input.val());
        opt.settings.animation_intime = 0;
        opt.settings.animation_outtime = 0;
        $input.val(JSON.stringify(opt));
    });
    wpcf7cf_change_time_ms = 0;
}

var wpcf7cf_show_animation = { "height": "show", "marginTop": "show", "marginBottom": "show", "paddingTop": "show", "paddingBottom": "show" };
var wpcf7cf_hide_animation = { "height": "hide", "marginTop": "hide", "marginBottom": "hide", "paddingTop": "hide", "paddingBottom": "hide" };

var wpcf7cf_show_step_animation = { "opacity": "show" };
var wpcf7cf_hide_step_animation = { "opacity": "hide" };

var wpcf7cf_change_events = 'input.wpcf7cf paste.wpcf7cf change.wpcf7cf click.wpcf7cf propertychange.wpcf7cf';

var wpcf7cf_forms = [];

window.wpcf7cf_dom = {};

const wpcf7cf_reload_dom = function($form) {
    wpcf7cf_dom = wpcf7cf.get_simplified_dom_model($form[0]);
}

const wpcf7cf_getFieldsByOriginalName = function(originalName) {
    return Object.values(wpcf7cf_dom).filter(function (inputField) {
        return inputField.original_name === originalName || inputField.original_name === originalName+'[]';
    });
}

const wpcf7cf_getFieldByName = function(name) {
    return wpcf7cf_dom[name] || wpcf7cf_dom[name+'[]'];
}

// endsWith polyfill
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}

// Object.values polyfill
if (!Object.values) Object.values = o=>Object.keys(o).map(k=>o[k]);

// Array.from polyfill
if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };
  
      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;
  
        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);
  
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }
  
        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }
  
          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
  
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);
  
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
  
        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
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

    // Wrapper around jQuery(selector, form.$form)
    form.get = function (selector) {
        // TODO: implement some caching here.
        return jQuery(selector, form.$form);
    }

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

    form.get('.wpcf7cf_repeater:not(.wpcf7cf_repeater .wpcf7cf_repeater)').each(function(){
        form.repeaters.push(new Wpcf7cfRepeater(jQuery(this),form));
    });

    form.$input_repeaters.val(JSON.stringify(form.repeaters.map((item)=>item.params.$repeater.id)));

    var $multistep = form.get('.wpcf7cf_multistep');

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

    wpcf7cf_reload_dom(form.$form);

    for (var i=0; i < wpcf7cf_conditions.length; i++) {

        var condition = wpcf7cf_conditions[i];

        var show_group = window.wpcf7cf.should_group_be_shown(condition, form);

        if (show_group) {
            form.get('[data-id="'+condition.then_field+'"]').removeClass('wpcf7cf-hidden');
        }
    }


    var animation_intime = wpcf7cf_settings.animation_intime;
    var animation_outtime = wpcf7cf_settings.animation_outtime;

    form.$groups.each(function (index) {
        var $group = jQuery(this);
        if ($group.is(':animated')) $group.finish(); // stop any current animations on the group
        if ($group.css('display') === 'none' && !$group.hasClass('wpcf7cf-hidden')) {
            if ($group.prop('tagName') === 'SPAN' || $group.is(':hidden')) {
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

                jQuery('option', $group).each(function() {
                    this.selected = this.defaultSelected;
                });

                jQuery('select', $group).each(function() {
                    const $select = jQuery(this);
                    if ($select.val() === null) {
                        $select.val(jQuery("option:first",$select).val());
                    }
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
    const form = this;
    var $summary = form.get('.wpcf7cf-summary');

    if ($summary.length == 0 || !$summary.is(':visible')) return;

    var fd = new FormData();

    var formdata = form.$form.serializeArray();
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

    var form = this;

    var hidden_fields = [];
    var hidden_groups = [];
    var visible_groups = [];

    form.$groups.each(function () {
        var $this = jQuery(this);
        if ($this.hasClass('wpcf7cf-hidden')) {
            hidden_groups.push($this.attr('data-id'));
            $this.find('input,select,textarea').each(function () {
                hidden_fields.push(jQuery(this).attr('name'));
            });
        } else {
            visible_groups.push($this.attr('data-id'));
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

    // monitor input changes, and call displayFields() if something has changed
    form.get('input, select, textarea, button').not('.wpcf7cf_add, .wpcf7cf_remove').off(wpcf7cf_change_events).on(wpcf7cf_change_events,form, function(e) {
        var form = e.data;
        clearTimeout(wpcf7cf_timeout);
        wpcf7cf_timeout = setTimeout(function() {
            form.displayFields();
        }, wpcf7cf_change_time_ms);
    });

    // PRO ONLY
    form.get('.wpcf7cf-togglebutton').off('click.toggle_wpcf7cf').on('click.toggle_wpcf7cf',function() {
        var $this = jQuery(this);
        if ($this.text() === $this.attr('data-val-1')) {
            $this.text($this.attr('data-val-2'));
            $this.val($this.attr('data-val-2'));
        } else {
            $this.text($this.attr('data-val-1'));
            $this.val($this.attr('data-val-1'));
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

    $repeater.parentRepeaters = Array.from($repeater.parents('.wpcf7cf_repeater').map(function() {
        return this.getAttribute('data-id');
    } )).reverse();

    $repeater.num_subs = 0;
    $repeater.id = $repeater.attr('data-id');
    $repeater.orig_id = $repeater.attr('data-orig_data_id');
    $repeater.min = typeof( $repeater.attr('data-min')) !== 'undefined' ? parseInt($repeater.attr('data-min')) : 1;
    $repeater.max = typeof( $repeater.attr('data-max')) !== 'undefined' ? parseInt($repeater.attr('data-max')) : 200;
    $repeater.initial_subs = typeof( $repeater.attr('data-initial')) !== 'undefined' ? parseInt($repeater.attr('data-initial')) : $repeater.min;
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
        var new_name = repeater.getNewName(prev_name);

        var orig_name = $this.attr('data-orig_name') != null ? $this.attr('data-orig_name') : prev_name;

        $this.attr('name', new_name);
        $this.attr('data-orig_name', orig_name);
        $this.closest('.wpcf7-form-control-wrap').addClass(new_name.replace('[]',''));
    });

    $repeater_sub_clone.find('.wpcf7cf_repeater,[data-class="wpcf7cf_group"]').each(function() {
        var $this = jQuery(this);
        var prev_data_id = $this.attr('data-id');
        var orig_data_id = $this.attr('data-orig_data_id') != null ? $this.attr('data-orig_data_id') : prev_data_id;
        var new_data_id = repeater.getNewName(prev_data_id);

        if(prev_data_id.endsWith('_count')) {
            new_data_id = prev_data_id.replace('_count','__{{repeater_sub_suffix}}_count');
        }

        $this.attr('data-id', new_data_id);
        $this.attr('data-orig_data_id', orig_data_id);
    });

    $repeater_sub_clone.find('[id]').each(function() {
        var $this = jQuery(this);
        var prev_id = $this.attr('id');
        var orig_id =  $this.attr('data-orig_id') != null ? $this.attr('data-orig_id') : prev_id;
        var new_id = repeater.getNewName(prev_id);

        $this.attr('id', new_id);
        $this.attr('data-orig_id', orig_id);
    });

    $repeater_sub_clone.find('[for]').each(function() {
        var $this = jQuery(this);
        var prev_for = $this.attr('for');
        var orig_for =  $this.attr('data-orig_for') != null ? $this.attr('data-orig_for') : prev_for;
        var new_for = repeater.getNewName(prev_for);

        $this.attr('for', new_for);
        $this.attr('data-orig_for', orig_for);
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

    $button_add.on('click', null, repeater, function(e) {
        var repeater = e.data;
        repeater.updateSubs(params.$repeater.num_subs+1);
    });

    $button_remove.on('click', null, repeater,function(e) {
        var repeater = e.data;
        repeater.updateSubs(params.$repeater.num_subs-1);
    });

    jQuery('> .wpcf7cf_repeater_sub',params.$repeater).eq(0).remove(); // remove the first sub, it's just a template.

    repeater.updateSubs($repeater.initial_subs);
    repeater.updateButtons();

}

Wpcf7cfRepeater.prototype.getNewName = function(previousName) {
    var prev_parts = previousName.split('[');
    previousName = prev_parts[0];
    var prev_suff = prev_parts.length > 1 ? '['+prev_parts.splice(1).join('[') : '';
    var newName = previousName+'__{{repeater_sub_suffix}}'+prev_suff;

    if(previousName.endsWith('_count')) {
        newName = previousName.replace('_count','__{{repeater_sub_suffix}}_count');
    }

    return newName;
}

Wpcf7cfRepeater.prototype.updateButtons = function() {
    const repeater = this;
    const params = repeater.params;
    const num_subs = params.$repeater.num_subs;

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

    params.$repeater_count_field.val(num_subs);
}

Wpcf7cfRepeater.prototype.updateSubs = function(subs_to_show) {
    var repeater = this;
    var params = repeater.params;

    // make sure subs_to_show is a valid number
    subs_to_show = subs_to_show < params.$repeater.min ? params.$repeater.min : subs_to_show
    subs_to_show = subs_to_show > params.$repeater.max ? params.$repeater.max : subs_to_show

    var subs_to_add = subs_to_show - params.$repeater.num_subs;

    if (subs_to_add < 0) {
        repeater.removeSubs(-subs_to_add);
    } else if (subs_to_add > 0) {
        repeater.addSubs(subs_to_add);
    }
};
/**
 * add Subs to repeater
 * @param {Number} subs_to_add 
 * @param {Number} index - zero-based. leave blank (or null) to append at the end
 */
Wpcf7cfRepeater.prototype.addSubs = function(subs_to_add, index=null) {

    var $ = jQuery;
    var params = this.params;
    var repeater = this;
    var form = repeater.form;
    

    
    var $repeater = params.$repeater; 
    var $repeater_controls = params.$repeater_controls;

    if (subs_to_add + $repeater.num_subs > $repeater.max) {
        subs_to_add = $repeater.max - $repeater.num_subs;
    }
    
    var html_str = '';

    for(var i=1; i<=subs_to_add; i++) {
        var sub_suffix = $repeater.num_subs+i;
        html_str += params.repeater_sub_html.replace(/\{\{repeater_sub_suffix\}\}/g,sub_suffix)
        .replace(new RegExp('\{\{'+$repeater.orig_id+'_index\}\}','g'),'<span class="wpcf7cf-index wpcf7cf__'+$repeater.orig_id+'">'+sub_suffix+'</span>');
    }


    var $html = jQuery(html_str);

    jQuery('> .wpcf7cf_repeater_sub',$repeater).finish(); // finish any currently running animations immediately.

    // Add the newly created fields to the form
    if (index === null) {
        $html.hide().insertBefore($repeater_controls).animate(wpcf7cf_show_animation, params.wpcf7cf_settings.animation_intime).trigger('wpcf7cf_repeater_added');
    } else {
        $html.hide().insertBefore(jQuery('> .wpcf7cf_repeater_sub', $repeater).eq(index)).animate(wpcf7cf_show_animation, params.wpcf7cf_settings.animation_intime).trigger('wpcf7cf_repeater_added');
    }


    jQuery('.wpcf7cf_repeater', $html).each(function(){
        form.repeaters.push(new Wpcf7cfRepeater(jQuery(this),form));
    });

    form.$input_repeaters.val(JSON.stringify(form.repeaters.map((item)=>item.params.$repeater.id)));

    $repeater.num_subs+= subs_to_add;

    if (index !== null) {
        repeater.updateSuffixes();
    }

    window.wpcf7cf.updateMultistepState(form.multistep);
    form.updateGroups();
    form.updateEventListeners();
    form.displayFields();

    repeater.updateButtons();

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

/** TODO: implement this */
Wpcf7cfRepeater.prototype.updateSuffixes = function() {

    // Loop trough all subs
    //  -- 1. update all fields, groups and repeaters names, id's, for's, ...
    //  -- 2. loop trough all repeaters
    //        -- update sub_html template for nested repeater
    //        -- call updateSuffixes() for nested repeater

    var $repeater = this.params.$repeater;
    var num_subs = this.params.$repeater.num_subs;
    var form = this.form;
    const orig_id = $repeater.attr('data-orig_data_id');
    const repeater_id = $repeater.attr('data-id');
    const repeater_suffix = repeater_id.replace(orig_id,'');

    let simplifiedDomArray = Object.values(wpcf7cf.get_simplified_dom_model(form.$form[0]));
    
    for (let i = 0; i < num_subs; i++) {

        const $sub = jQuery('> .wpcf7cf_repeater_sub', $repeater).eq(i);

        const newIndex = i+1;
        const currentSuffix = $sub.attr('data-repeater_sub_suffix');
        const newSuffix = repeater_suffix+'__'+newIndex;

        $sub.attr('data-repeater_sub_suffix', newSuffix); // update sub attr
        $sub.find('.wpcf7cf__'+orig_id).html(newIndex); // update {{r_index}} parts

        simplifiedDomArray.forEach(function(el) {

            if (el.suffix !== currentSuffix) return;

            // TODO: may need an extra check to verify that the element is inside the current repeater
            // (orig_id) . Otherwise problems may occur if there are repeaters on the same level.

            const newName = el.name.replace(currentSuffix, newSuffix);

            const pureElName = el.name.replace('[]','');
            const pureNewName = newName.replace('[]','');

            jQuery('[name="'+el.name+'"]', $sub).attr('name', newName);
            jQuery('[id="'+el.name+'"]', $sub).attr('id', newName);
            jQuery('label[for="'+el.name+'"]', $sub).attr('for', newName);
            const $nested_repeater = jQuery('[data-id="'+el.name+'"]', $sub);
            $nested_repeater.attr('data-id', newName);
            jQuery('.wpcf7-form-control-wrap.'+pureElName,$sub).removeClass(pureElName).addClass(pureNewName);

            if (el.type === 'repeater') {
                const nested_repeater = form.repeaters.find( function(repeater) {
                    return repeater.params.$repeater.get(0) === $nested_repeater.get(0);
                });

                if (!nested_repeater) return;

                nested_repeater.params.repeater_sub_html = wpcf7cf.updateRepeaterSubHTML(
                    nested_repeater.params.repeater_sub_html,
                    currentSuffix,
                    newSuffix,
                    nested_repeater.params.$repeater.parentRepeaters
                );

                nested_repeater.updateSuffixes();

            }

        });
    }

};

/**
 * Return the parent repeaters, order is not guaranteed.
 */
Wpcf7cfRepeater.prototype.getParentRepeaters = function() {
    const simplifiedDomArray = Object.values(wpcf7cf.get_simplified_dom_model(form.$form[0]));
    form.repeaters.map(repeater => {

    });
};

Wpcf7cfRepeater.prototype.removeSubs = function(subs_to_remove, index=null) {
    var $ = jQuery;
    var repeater = this;
    var params = repeater.params;
    var form = repeater.form;
    var $repeater = params.$repeater;

    if ($repeater.num_subs - subs_to_remove < $repeater.min) {
        subs_to_remove = $repeater.num_subs - $repeater.min;
    }

    if (index===null) {
        index = $repeater.num_subs-subs_to_remove;
    }
    $repeater.num_subs-= subs_to_remove;

    jQuery('> .wpcf7cf_repeater_sub',$repeater).finish(); // finish any currently running animations immediately.

    jQuery('> .wpcf7cf_repeater_sub',$repeater).slice(index,index+subs_to_remove).animate(wpcf7cf_hide_animation, {duration:params.wpcf7cf_settings.animation_intime, done:function() {
        var $this = jQuery(this);
        //remove the actual fields from the form
        $this.remove();
        params.$repeater.trigger('wpcf7cf_repeater_removed');
        window.wpcf7cf.updateMultistepState(form.multistep);
        form.updateGroups();
        form.updateEventListeners();
        form.displayFields();

        repeater.updateButtons();

        if (index !== null) {
            repeater.updateSuffixes();
        }
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
                <div class="step-title">${multistep.$steps.eq(i-1).attr('data-title')}</div>
            </div>
        `);
    }

    multistep.$btn_next.on('click.wpcf7cf_step', async function() {

        multistep.$btn_next.addClass('disabled').attr('disabled', true);
        
        var result = await multistep.validateStep(multistep.currentStep);
        if (result === 'success') {
            multistep.moveToStep(multistep.currentStep+1); 
        }

    });

    // If form is submitted (by pressing Enter for example), and if we are not on the last step,
    // then trigger click event on the $btn_next button instead.
    multistep.form.$form.on('submit.wpcf7cf_step', function(e) {

        if (multistep.currentStep !== multistep.numSteps) {
            multistep.$btn_next.trigger('click.wpcf7cf_step');

            e.stopImmediatePropagation();
            return false;
        }
    });

    multistep.$btn_prev.on( 'click', function() {
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
    var form  = multistep.form;

    $form.find('.wpcf7-response-output').addClass('wpcf7-display-none');

    return new Promise(resolve => {

        var fd = new FormData();

        // Make sure to add file fields to FormData
        jQuery.each($form.find('[data-id="step-'+step_index+'"] input[type="file"]'), function(index, el) {
            if (! el.files.length) return true; // = continue
            const file = el.files[0];
            const fieldName = el.name;
            fd.append(fieldName, file);
        });

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
            
            $multistep.find('.wpcf7-form-control-wrap .wpcf7-not-valid-tip').remove();
            $multistep.find('.wpcf7-not-valid').removeClass('wpcf7-not-valid');
            $multistep.find('.wpcf7-response-output').remove();
            $multistep.find('.wpcf7-response-output.wpcf7-validation-errors').removeClass('wpcf7-validation-errors');

            multistep.$btn_next.removeClass('disabled').attr('disabled', false);

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

                        var controlWrap = form.get('.wpcf7-form-control-wrap.' + index);
                        controlWrap.find('.wpcf7-form-control').addClass('wpcf7-not-valid');
                        controlWrap.find('span.wpcf7-not-valid-tip').remove();
                        controlWrap.append('<span role="alert" class="wpcf7-not-valid-tip">' + el.reason + '</span>');

                    }
                });

                resolve('failed');

                $multistep.parent().find('.wpcf7-response-output').removeClass('wpcf7-display-none').html(json.message);

                wpcf7.setStatus( $form, 'invalid' );
                multistep.$steps.trigger('wpcf7cf_step_invalid');

                // wpcf7.triggerEvent( data.into, 'invalid', detail );

            } else if (json.success) {

                wpcf7.setStatus( $form, 'init' );

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

    const formEl = multistep.form.$form[0];
    const topOffset = formEl.getBoundingClientRect().top;
    if (topOffset < 0 && previousStep > 0) {
        formEl.scrollIntoView({behavior: "smooth"});
    }

    multistep.form.updateSummaryFields();

    window.wpcf7cf.updateMultistepState(multistep);
};

Wpcf7cfMultistep.prototype.getFieldsInStep = function(step_index) {
    wpcf7cf_reload_dom(this.form.$form);
    var inStep = false;
    return Object.values(wpcf7cf_dom).filter(function(item, i) {
        if(item.type == 'step') {
            inStep = item.val == step_index+'';
        }
        return inStep && item.type == 'input';
    }).map(function(item) {
        return item.name;
    });
};

// END PRO ONLY

/**
 * @global
 * @namespace wpcf7cf
 */
window.wpcf7cf = {

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
            const f1 =  form.$form.get(0);
            const f2 =  $form.get(0);
            return form.$form.get(0) === $form.get(0);
        });
        if (matched_forms.length) {
            return matched_forms[0];
        }
        return false;
    },

    get_nested_conditions : function(conditions, $current_form) {
        //loop trough conditions. Then loop trough the dom, and each repeater we pass we should update all sub_values we encounter with __index
        wpcf7cf_reload_dom($current_form);
        var groups = Object.values(wpcf7cf_dom).filter(function(item, i) {
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
    
            const parentGroup = 'parent-group';
    
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
        
        Array.from(currentNode.children).forEach(childNode => {
            const dom = wpcf7cf.get_simplified_dom_model(childNode, simplified_dom, newParentGroups, newParentRepeaters);
            simplified_dom = {...dom, ...simplified_dom} ;
        });

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

    should_group_be_shown : function(condition) {

        var show_group = true;

        for (var and_rule_i = 0; and_rule_i < condition.and_rules.length; and_rule_i++) {

            var condition_ok = false;

            var condition_and_rule = condition.and_rules[and_rule_i];

            var inputField = wpcf7cf_getFieldByName(condition_and_rule.if_field);

            if (!inputField) continue; // field not found

            var if_val = condition_and_rule.if_value;
            var operator = condition_and_rule.operator;

            //backwards compat
            operator = operator === '≤' ? 'less than or equals' : operator;
            operator = operator === '≥' ? 'greater than or equals' : operator;
            operator = operator === '>' ? 'greater than' : operator;
            operator = operator === '<' ? 'less than' : operator;

            const $field = operator === 'function' && jQuery(`[name="${inputField.name}"]`).eq(0);

            condition_ok = this.isConditionTrue(inputField.val,operator,if_val, $field);

            show_group = show_group && condition_ok;
        }

        return show_group;

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

        var result = await multistep.validateStep(multistep.currentStep);
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
jQuery('document').ready(function() {
    wpcf7cf_forms.forEach(function(f){
        f.displayFields();
    });
});

// fix for exclusive checkboxes in IE (this will call the change-event again after all other checkboxes are unchecked, triggering the display_fields() function)
var old_wpcf7ExclusiveCheckbox = jQuery.fn.wpcf7ExclusiveCheckbox;
jQuery.fn.wpcf7ExclusiveCheckbox = function() {
    return this.find('input:checkbox').on('click', function() {
        var name = jQuery(this).attr('name');
        jQuery(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false).eq(0).change();
    });
};