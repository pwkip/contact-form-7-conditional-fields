/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/scripts_es6.js":
/*!***************************!*\
  !*** ./js/scripts_es6.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__);








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var cf7signature_resized = 0; // for compatibility with contact-form-7-signature-addon

var wpcf7cf_timeout;
var wpcf7cf_change_time_ms = 100;

if (window.wpcf7cf_running_tests) {
  jQuery('input[name="_wpcf7cf_options"]').each(function (e) {
    var $input = jQuery(this);
    var opt = JSON.parse($input.val());
    opt.settings.animation_intime = 0;
    opt.settings.animation_outtime = 0;
    $input.val(JSON.stringify(opt));
  });
  wpcf7cf_change_time_ms = 0;
}

var wpcf7cf_show_animation = {
  "height": "show",
  "marginTop": "show",
  "marginBottom": "show",
  "paddingTop": "show",
  "paddingBottom": "show"
};
var wpcf7cf_hide_animation = {
  "height": "hide",
  "marginTop": "hide",
  "marginBottom": "hide",
  "paddingTop": "hide",
  "paddingBottom": "hide"
};
var wpcf7cf_show_step_animation = {
  "opacity": "show"
};
var wpcf7cf_hide_step_animation = {
  "opacity": "hide"
};
var wpcf7cf_change_events = 'input.wpcf7cf paste.wpcf7cf change.wpcf7cf click.wpcf7cf propertychange.wpcf7cf';
var wpcf7cf_forms = [];
window.wpcf7cf_dom = {};

var wpcf7cf_reload_dom = function wpcf7cf_reload_dom($form) {
  wpcf7cf_dom = wpcf7cf.get_simplified_dom_model($form[0]);
};

var wpcf7cf_getFieldsByOriginalName = function wpcf7cf_getFieldsByOriginalName(originalName) {
  return Object.values(wpcf7cf_dom).filter(function (inputField) {
    return inputField.original_name === originalName || inputField.original_name === originalName + '[]';
  });
};

var wpcf7cf_getFieldByName = function wpcf7cf_getFieldByName(name) {
  return wpcf7cf_dom[name] || wpcf7cf_dom[name + '[]'];
}; // endsWith polyfill


if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }

    return this.substring(this_len - search.length, this_len) === search;
  };
} // Object.values polyfill


if (!Object.values) Object.values = function (o) {
  return Object.keys(o).map(function (k) {
    return o[k];
  });
}; // Array.from polyfill

if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;

    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };

    var toInteger = function toInteger(value) {
      var number = Number(value);

      if (isNaN(number)) {
        return 0;
      }

      if (number === 0 || !isFinite(number)) {
        return number;
      }

      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };

    var maxSafeInteger = Math.pow(2, 53) - 1;

    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    }; // The length property of the from method is 1.


    return function from(arrayLike
    /*, mapFn, thisArg */
    ) {
      // 1. Let C be the this value.
      var C = this; // 2. Let items be ToObject(arrayLike).

      var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      } // 4. If mapfn is undefined, then let mapping be false.


      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;

      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        } // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


        if (arguments.length > 2) {
          T = arguments[2];
        }
      } // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).


      var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).

      var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

      var k = 0; // 17. Repeat, while k < len… (also steps a - h)

      var kValue;

      while (k < len) {
        kValue = items[k];

        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }

        k += 1;
      } // 18. Let putStatus be Put(A, "length", len, true).


      A.length = len; // 20. Return A.

      return A;
    };
  }();
}

var Wpcf7cfForm = function Wpcf7cfForm($form) {
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
  form.conditions = form_options['conditions']; // Wrapper around jQuery(selector, form.$form)

  form.get = function (selector) {
    // TODO: implement some caching here.
    return jQuery(selector, form.$form);
  }; // compatibility with conditional forms created with older versions of the plugin ( < 1.4 )


  for (var i = 0; i < form.conditions.length; i++) {
    var condition = form.conditions[i];

    if (!('and_rules' in condition)) {
      condition.and_rules = [{
        'if_field': condition.if_field,
        'if_value': condition.if_value,
        'operator': condition.operator
      }];
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
  form.displayFields(); // bring form in initial state if the reset event is fired on it.

  form.$form.on('reset.wpcf7cf', form, function (e) {
    var form = e.data;
    setTimeout(function () {
      form.displayFields();
      form.resetRepeaters();

      if (form.multistep != null) {
        form.multistep.moveToStep(1);
      }
    }, 200);
  }); // PRO ONLY

  form.get('.wpcf7cf_repeater:not(.wpcf7cf_repeater .wpcf7cf_repeater)').each(function () {
    form.repeaters.push(new Wpcf7cfRepeater(jQuery(this), form));
  });
  form.$input_repeaters.val(JSON.stringify(form.repeaters.map(function (item) {
    return item.params.$repeater.id;
  })));
  var $multistep = form.get('.wpcf7cf_multistep');

  if ($multistep.length) {
    form.multistep = new Wpcf7cfMultistep($multistep, form); // window.wpcf7cf.updateMultistepState(form.multistep);
  } // END PRO ONLY

};
/**
 * reset initial number of subs for each repeater.
 * (does not clear values)
 */


Wpcf7cfForm.prototype.resetRepeaters = function () {
  var form = this;
  form.repeaters.forEach(function (repeater) {
    repeater.updateSubs(repeater.params.$repeater.initial_subs);
  });
};

Wpcf7cfForm.prototype.displayFields = function () {
  var form = this;
  var wpcf7cf_conditions = this.conditions;
  var wpcf7cf_settings = this.settings; //for compatibility with contact-form-7-signature-addon

  if (cf7signature_resized === 0 && typeof signatures !== 'undefined' && signatures.constructor === Array && signatures.length > 0) {
    for (var i = 0; i < signatures.length; i++) {
      if (signatures[i].canvas.width === 0) {
        var $sig_canvas = jQuery(".wpcf7-form-control-signature-body>canvas");
        var $sig_wrap = jQuery(".wpcf7-form-control-signature-wrap");
        $sig_canvas.eq(i).attr('width', $sig_wrap.width());
        $sig_canvas.eq(i).attr('height', $sig_wrap.height());
        cf7signature_resized = 1;
      }
    }
  }

  form.$groups.addClass('wpcf7cf-hidden');
  wpcf7cf_reload_dom(form.$form);

  for (var i = 0; i < wpcf7cf_conditions.length; i++) {
    var condition = wpcf7cf_conditions[i];
    var show_group = window.wpcf7cf.should_group_be_shown(condition, form);

    if (show_group) {
      form.get('[data-id="' + condition.then_field + '"]').removeClass('wpcf7cf-hidden');
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
        $inputs.each(function () {
          var $this = jQuery(this);
          $this.val(this.defaultValue);
          $this.prop('checked', this.defaultChecked);
        });
        jQuery('option', $group).each(function () {
          this.selected = this.defaultSelected;
        });
        jQuery('select', $group).each(function () {
          var $select = jQuery(this);

          if ($select.val() === null) {
            $select.val(jQuery("option:first", $select).val());
          }
        });
        $inputs.change(); //display_fields();
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

Wpcf7cfForm.prototype.updateSummaryFields = function () {
  var form = this;
  var $summary = form.get('.wpcf7cf-summary');
  if ($summary.length == 0 || !$summary.is(':visible')) return;
  var fd = new FormData();
  var formdata = form.$form.serializeArray();
  jQuery.each(formdata, function (key, input) {
    fd.append(input.name, input.value);
  }); // Make sure to add file fields to FormData

  jQuery.each(form.$form.find('input[type="file"]'), function (index, el) {
    if (!el.files.length) return true; // continue

    var fieldName = el.name;
    fd.append(fieldName, new Blob(), Array.from(el.files).map(function (file) {
      return file.name;
    }).join(', '));
  }); // add file fields to form-data

  jQuery.ajax({
    url: wpcf7cf_global_settings.ajaxurl + '?action=wpcf7cf_get_summary',
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function success(json) {
      $summary.html(json.summaryHtml);
    }
  });
};

Wpcf7cfForm.prototype.updateHiddenFields = function () {
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

Wpcf7cfForm.prototype.updateGroups = function () {
  var form = this;
  form.$groups = form.$form.find('[data-class="wpcf7cf_group"]');
  form.conditions = window.wpcf7cf.get_nested_conditions(form.initial_conditions, form.$form);
};

Wpcf7cfForm.prototype.updateEventListeners = function () {
  var form = this; // monitor input changes, and call displayFields() if something has changed

  form.get('input, select, textarea, button').not('.wpcf7cf_add, .wpcf7cf_remove').off(wpcf7cf_change_events).on(wpcf7cf_change_events, form, function (e) {
    var form = e.data;
    clearTimeout(wpcf7cf_timeout);
    wpcf7cf_timeout = setTimeout(function () {
      form.displayFields();
    }, wpcf7cf_change_time_ms);
  }); // PRO ONLY

  form.get('.wpcf7cf-togglebutton').off('click.toggle_wpcf7cf').on('click.toggle_wpcf7cf', function () {
    var $this = jQuery(this);

    if ($this.text() === $this.attr('data-val-1')) {
      $this.text($this.attr('data-val-2'));
      $this.val($this.attr('data-val-2'));
    } else {
      $this.text($this.attr('data-val-1'));
      $this.val($this.attr('data-val-1'));
    }
  }); // END PRO ONLY
}; // PRO ONLY


function Wpcf7cfRepeater($repeater, form) {
  var $ = jQuery;
  var repeater = this;
  var wpcf7cf_settings = form.settings;
  repeater.form = form;
  $repeater.parentRepeaters = Array.from($repeater.parents('.wpcf7cf_repeater').map(function () {
    return this.getAttribute('data-id');
  })).reverse();
  $repeater.num_subs = 0;
  $repeater.id = $repeater.attr('data-id');
  $repeater.orig_id = $repeater.attr('data-orig_data_id');
  $repeater.min = typeof $repeater.attr('data-min') !== 'undefined' ? parseInt($repeater.attr('data-min')) : 1;
  $repeater.max = typeof $repeater.attr('data-max') !== 'undefined' ? parseInt($repeater.attr('data-max')) : 200;
  $repeater.initial_subs = typeof $repeater.attr('data-initial') !== 'undefined' ? parseInt($repeater.attr('data-initial')) : $repeater.min;
  if ($repeater.initial_subs > $repeater.max) $repeater.initial_subs = $repeater.max;
  var $repeater_sub = $repeater.children('.wpcf7cf_repeater_sub').eq(0);
  var $repeater_controls = $repeater.children('.wpcf7cf_repeater_controls').eq(0);
  var $repeater_sub_clone = $repeater_sub.clone();
  $repeater_sub_clone.find('.wpcf7cf_repeater_sub').addBack('.wpcf7cf_repeater_sub').each(function () {
    var $this = jQuery(this);
    var prev_suffix = $this.attr('data-repeater_sub_suffix');
    var new_suffix = prev_suffix + '__{{repeater_sub_suffix}}';
    $this.attr('data-repeater_sub_suffix', new_suffix);
  });
  $repeater_sub_clone.find('[name]').each(function () {
    var $this = jQuery(this);
    var prev_name = $this.attr('name');
    var new_name = repeater.getNewName(prev_name);
    var orig_name = $this.attr('data-orig_name') != null ? $this.attr('data-orig_name') : prev_name;
    $this.attr('name', new_name);
    $this.attr('data-orig_name', orig_name);
    $this.closest('.wpcf7-form-control-wrap').addClass(new_name.replace('[]', ''));
  });
  $repeater_sub_clone.find('.wpcf7cf_repeater,[data-class="wpcf7cf_group"]').each(function () {
    var $this = jQuery(this);
    var prev_data_id = $this.attr('data-id');
    var orig_data_id = $this.attr('data-orig_data_id') != null ? $this.attr('data-orig_data_id') : prev_data_id;
    var new_data_id = repeater.getNewName(prev_data_id);

    if (prev_data_id.endsWith('_count')) {
      new_data_id = prev_data_id.replace('_count', '__{{repeater_sub_suffix}}_count');
    }

    $this.attr('data-id', new_data_id);
    $this.attr('data-orig_data_id', orig_data_id);
  });
  $repeater_sub_clone.find('[id]').each(function () {
    var $this = jQuery(this);
    var prev_id = $this.attr('id');
    var orig_id = $this.attr('data-orig_id') != null ? $this.attr('data-orig_id') : prev_id;
    var new_id = repeater.getNewName(prev_id);
    $this.attr('id', new_id);
    $this.attr('data-orig_id', orig_id);
  });
  $repeater_sub_clone.find('[for]').each(function () {
    var $this = jQuery(this);
    var prev_for = $this.attr('for');
    var orig_for = $this.attr('data-orig_for') != null ? $this.attr('data-orig_for') : prev_for;
    var new_for = repeater.getNewName(prev_for);
    $this.attr('for', new_for);
    $this.attr('data-orig_for', orig_for);
  });
  var repeater_sub_html = $repeater_sub_clone[0].outerHTML;
  var $repeater_count_field = $repeater.find('[name=' + $repeater.id + '_count]').eq(0);
  var $button_add = $repeater_controls.find('.wpcf7cf_add').eq(0);
  var $button_remove = $repeater_controls.find('.wpcf7cf_remove').eq(0);
  var params = {
    $repeater: $repeater,
    $repeater_count_field: $repeater_count_field,
    repeater_sub_html: repeater_sub_html,
    $repeater_controls: $repeater_controls,
    $button_add: $button_add,
    $button_remove: $button_remove,
    wpcf7cf_settings: wpcf7cf_settings
  };
  this.params = params;
  $button_add.on('click', null, repeater, function (e) {
    var repeater = e.data;
    repeater.updateSubs(params.$repeater.num_subs + 1);
  });
  $button_remove.on('click', null, repeater, function (e) {
    var repeater = e.data;
    repeater.updateSubs(params.$repeater.num_subs - 1);
  });
  jQuery('> .wpcf7cf_repeater_sub', params.$repeater).eq(0).remove(); // remove the first sub, it's just a template.

  repeater.updateSubs($repeater.initial_subs);
  repeater.updateButtons();
}

Wpcf7cfRepeater.prototype.getNewName = function (previousName) {
  var prev_parts = previousName.split('[');
  previousName = prev_parts[0];
  var prev_suff = prev_parts.length > 1 ? '[' + prev_parts.splice(1).join('[') : '';
  var newName = previousName + '__{{repeater_sub_suffix}}' + prev_suff;

  if (previousName.endsWith('_count')) {
    newName = previousName.replace('_count', '__{{repeater_sub_suffix}}_count');
  }

  return newName;
};

Wpcf7cfRepeater.prototype.updateButtons = function () {
  var repeater = this;
  var params = repeater.params;
  var num_subs = params.$repeater.num_subs;
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
};

Wpcf7cfRepeater.prototype.updateSubs = function (subs_to_show) {
  var repeater = this;
  var params = repeater.params; // make sure subs_to_show is a valid number

  subs_to_show = subs_to_show < params.$repeater.min ? params.$repeater.min : subs_to_show;
  subs_to_show = subs_to_show > params.$repeater.max ? params.$repeater.max : subs_to_show;
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


Wpcf7cfRepeater.prototype.addSubs = function (subs_to_add) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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

  for (var i = 1; i <= subs_to_add; i++) {
    var sub_suffix = $repeater.num_subs + i;
    html_str += params.repeater_sub_html.replace(/\{\{repeater_sub_suffix\}\}/g, sub_suffix).replace(new RegExp('\{\{' + $repeater.orig_id + '_index\}\}', 'g'), '<span class="wpcf7cf-index wpcf7cf__' + $repeater.orig_id + '">' + sub_suffix + '</span>');
  }

  var $html = jQuery(html_str);
  jQuery('> .wpcf7cf_repeater_sub', $repeater).finish(); // finish any currently running animations immediately.
  // Add the newly created fields to the form

  if (index === null) {
    $html.hide().insertBefore($repeater_controls).animate(wpcf7cf_show_animation, params.wpcf7cf_settings.animation_intime).trigger('wpcf7cf_repeater_added');
  } else {
    $html.hide().insertBefore(jQuery('> .wpcf7cf_repeater_sub', $repeater).eq(index)).animate(wpcf7cf_show_animation, params.wpcf7cf_settings.animation_intime).trigger('wpcf7cf_repeater_added');
  }

  jQuery('.wpcf7cf_repeater', $html).each(function () {
    form.repeaters.push(new Wpcf7cfRepeater(jQuery(this), form));
  });
  form.$input_repeaters.val(JSON.stringify(form.repeaters.map(function (item) {
    return item.params.$repeater.id;
  })));
  $repeater.num_subs += subs_to_add;

  if (index !== null) {
    repeater.updateSuffixes();
  }

  window.wpcf7cf.updateMultistepState(form.multistep);
  form.updateGroups();
  form.updateEventListeners();
  form.displayFields();
  repeater.updateButtons(); // Exclusive Checkbox

  $html.on('click', '.wpcf7-exclusive-checkbox input:checkbox', function () {
    var name = $(this).attr('name');
    $html.find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false);
  }); //basic compatibility with material-design-for-contact-form-7

  if (typeof window.cf7mdInit === "function") {
    window.cf7mdInit();
  }

  return false;
};
/** TODO: implement this */


Wpcf7cfRepeater.prototype.updateSuffixes = function () {
  // Loop trough all subs
  //  -- 1. update all fields, groups and repeaters names, id's, for's, ...
  //  -- 2. loop trough all repeaters
  //        -- update sub_html template for nested repeater
  //        -- call updateSuffixes() for nested repeater
  var $repeater = this.params.$repeater;
  var num_subs = this.params.$repeater.num_subs;
  var form = this.form;
  var orig_id = $repeater.attr('data-orig_data_id');
  var repeater_id = $repeater.attr('data-id');
  var repeater_suffix = repeater_id.replace(orig_id, '');
  var simplifiedDomArray = Object.values(wpcf7cf.get_simplified_dom_model(form.$form[0]));

  var _loop = function _loop(i) {
    var $sub = jQuery('> .wpcf7cf_repeater_sub', $repeater).eq(i);
    var newIndex = i + 1;
    var currentSuffix = $sub.attr('data-repeater_sub_suffix');
    var newSuffix = repeater_suffix + '__' + newIndex;
    $sub.attr('data-repeater_sub_suffix', newSuffix); // update sub attr

    $sub.find('.wpcf7cf__' + orig_id).html(newIndex); // update {{r_index}} parts

    simplifiedDomArray.forEach(function (el) {
      if (el.suffix !== currentSuffix) return; // TODO: may need an extra check to verify that the element is inside the current repeater
      // (orig_id) . Otherwise problems may occur if there are repeaters on the same level.

      var newName = el.name.replace(currentSuffix, newSuffix);
      var pureElName = el.name.replace('[]', '');
      var pureNewName = newName.replace('[]', '');
      jQuery('[name="' + el.name + '"]', $sub).attr('name', newName);
      jQuery('[id="' + el.name + '"]', $sub).attr('id', newName);
      jQuery('label[for="' + el.name + '"]', $sub).attr('for', newName);
      var $nested_repeater = jQuery('[data-id="' + el.name + '"]', $sub);
      $nested_repeater.attr('data-id', newName);
      jQuery('.wpcf7-form-control-wrap.' + pureElName, $sub).removeClass(pureElName).addClass(pureNewName);

      if (el.type === 'repeater') {
        var nested_repeater = form.repeaters.find(function (repeater) {
          return repeater.params.$repeater.get(0) === $nested_repeater.get(0);
        });
        if (!nested_repeater) return;
        nested_repeater.params.repeater_sub_html = wpcf7cf.updateRepeaterSubHTML(nested_repeater.params.repeater_sub_html, currentSuffix, newSuffix, nested_repeater.params.$repeater.parentRepeaters);
        nested_repeater.updateSuffixes();
      }
    });
  };

  for (var i = 0; i < num_subs; i++) {
    _loop(i);
  }
};
/**
 * Return the parent repeaters, order is not guaranteed.
 */


Wpcf7cfRepeater.prototype.getParentRepeaters = function () {
  var simplifiedDomArray = Object.values(wpcf7cf.get_simplified_dom_model(form.$form[0]));
  form.repeaters.map(function (repeater) {});
};

Wpcf7cfRepeater.prototype.removeSubs = function (subs_to_remove) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var $ = jQuery;
  var repeater = this;
  var params = repeater.params;
  var form = repeater.form;
  var $repeater = params.$repeater;

  if ($repeater.num_subs - subs_to_remove < $repeater.min) {
    subs_to_remove = $repeater.num_subs - $repeater.min;
  }

  if (index === null) {
    index = $repeater.num_subs - subs_to_remove;
  }

  $repeater.num_subs -= subs_to_remove;
  jQuery('> .wpcf7cf_repeater_sub', $repeater).finish(); // finish any currently running animations immediately.

  jQuery('> .wpcf7cf_repeater_sub', $repeater).slice(index, index + subs_to_remove).animate(wpcf7cf_hide_animation, {
    duration: params.wpcf7cf_settings.animation_intime,
    done: function done() {
      var $this = jQuery(this); //remove the actual fields from the form

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
    }
  });
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
    multistep.$dots.append("\n            <div class=\"dot\" data-step=\"".concat(i, "\">\n                <div class=\"step-index\">").concat(i, "</div>\n                <div class=\"step-title\">").concat(multistep.$steps.eq(i - 1).attr('data-title'), "</div>\n            </div>\n        "));
  }

  multistep.$btn_next.on('click.wpcf7cf_step', /*#__PURE__*/_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee() {
    var result;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            multistep.$btn_next.addClass('disabled').attr('disabled', true);
            _context.next = 3;
            return multistep.validateStep(multistep.currentStep);

          case 3:
            result = _context.sent;

            if (result === 'success') {
              multistep.moveToStep(multistep.currentStep + 1);
            }

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))); // If form is submitted (by pressing Enter for example), and if we are not on the last step,
  // then trigger click event on the $btn_next button instead.

  multistep.form.$form.on('submit.wpcf7cf_step', function (e) {
    if (multistep.currentStep !== multistep.numSteps) {
      multistep.$btn_next.trigger('click.wpcf7cf_step');
      e.stopImmediatePropagation();
      return false;
    }
  });
  multistep.$btn_prev.on('click', function () {
    multistep.moveToStep(multistep.currentStep - 1);
  });
  multistep.moveToStep(1);
}

jQuery(document).ajaxComplete(function (e, xhr, settings) {
  if (xhr.hasOwnProperty('responseJSON') && xhr.responseJSON != null && xhr.responseJSON.hasOwnProperty('status') && xhr.responseJSON.hasOwnProperty('into') && xhr.responseJSON.status === "mail_success") {
    jQuery(xhr.responseJSON.into).trigger('reset.wpcf7cf');
  }
});

Wpcf7cfMultistep.prototype.validateStep = function (step_index) {
  var multistep = this;
  var $multistep = multistep.$multistep;
  var $form = multistep.form.$form;
  var form = multistep.form;
  $form.find('.wpcf7-response-output').addClass('wpcf7-display-none');
  return new Promise(function (resolve) {
    var fd = new FormData(); // Make sure to add file fields to FormData

    jQuery.each($form.find('[data-id="step-' + step_index + '"] input[type="file"]'), function (index, el) {
      if (!el.files.length) return true; // = continue

      var file = el.files[0];
      var fieldName = el.name;
      fd.append(fieldName, file);
    });
    var formdata = $form.serializeArray();
    jQuery.each(formdata, function (key, input) {
      fd.append(input.name, input.value);
    });
    jQuery.ajax({
      url: wpcf7cf_global_settings.ajaxurl + '?action=wpcf7cf_validate_step',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      dataType: 'json'
    }).done(function (json) {
      $multistep.find('.wpcf7-form-control-wrap .wpcf7-not-valid-tip').remove();
      $multistep.find('.wpcf7-not-valid').removeClass('wpcf7-not-valid');
      $multistep.find('.wpcf7-response-output').remove();
      $multistep.find('.wpcf7-response-output.wpcf7-validation-errors').removeClass('wpcf7-validation-errors');
      multistep.$btn_next.removeClass('disabled').attr('disabled', false);

      if (!json.success) {
        var checkError = 0;
        jQuery.each(json.invalid_fields, function (index, el) {
          if ($multistep.find('input[name="' + index + '"]').length || $multistep.find('input[name="' + index + '[]"]').length || $multistep.find('select[name="' + index + '"]').length || $multistep.find('select[name="' + index + '[]"]').length || $multistep.find('textarea[name="' + index + '"]').length || $multistep.find('textarea[name="' + index + '[]"]').length) {
            checkError = checkError + 1;
            var controlWrap = form.get('.wpcf7-form-control-wrap.' + index);
            controlWrap.find('.wpcf7-form-control').addClass('wpcf7-not-valid');
            controlWrap.find('span.wpcf7-not-valid-tip').remove();
            controlWrap.append('<span role="alert" class="wpcf7-not-valid-tip">' + el.reason + '</span>');
          }
        });
        resolve('failed');
        $multistep.parent().find('.wpcf7-response-output').removeClass('wpcf7-display-none').html(json.message);
        wpcf7.setStatus($form, 'invalid');
        multistep.$steps.trigger('wpcf7cf_step_invalid'); // wpcf7.triggerEvent( data.into, 'invalid', detail );
      } else if (json.success) {
        wpcf7.setStatus($form, 'init');
        resolve('success');
        return false;
      }
    }).fail(function () {
      resolve('error');
    }).always(function () {// do nothing
    });
  });
};

Wpcf7cfMultistep.prototype.moveToStep = function (step_index) {
  var multistep = this;
  var previousStep = multistep.currentStep;
  multistep.currentStep = step_index > multistep.numSteps ? multistep.numSteps : step_index < 1 ? 1 : step_index; // ANIMATION DISABLED FOR NOW cause it's ugly
  // multistep.$steps.animate(wpcf7cf_hide_step_animation, multistep.form.settings.animation_outtime);
  // multistep.$steps.eq(multistep.currentStep-1).animate(wpcf7cf_show_step_animation, multistep.form.settings.animation_intime);

  multistep.$multistep.attr('data-current_step', multistep.currentStep);
  multistep.$steps.hide();
  multistep.$steps.eq(multistep.currentStep - 1).show().trigger('wpcf7cf_change_step', [previousStep, multistep.currentStep]);
  var formEl = multistep.form.$form[0];
  var topOffset = formEl.getBoundingClientRect().top;

  if (topOffset < 0 && previousStep > 0) {
    formEl.scrollIntoView({
      behavior: "smooth"
    });
  }

  multistep.form.updateSummaryFields();
  window.wpcf7cf.updateMultistepState(multistep);
};

Wpcf7cfMultistep.prototype.getFieldsInStep = function (step_index) {
  wpcf7cf_reload_dom(this.form.$form);
  var inStep = false;
  return Object.values(wpcf7cf_dom).filter(function (item, i) {
    if (item.type == 'step') {
      inStep = item.val == step_index + '';
    }

    return inStep && item.type == 'input';
  }).map(function (item) {
    return item.name;
  });
}; // END PRO ONLY

/**
 * @global
 * @namespace wpcf7cf
 */


window.wpcf7cf = {
  updateRepeaterSubHTML: function updateRepeaterSubHTML(html, oldSuffix, newSuffix, parentRepeaters) {
    var oldIndexes = oldSuffix.split('__');
    oldIndexes.shift(); // remove first empty element

    var newIndexes = newSuffix.split('__');
    newIndexes.shift(); // remove first empty element

    var returnHtml = html;

    if (oldIndexes && newIndexes && oldIndexes.length === parentRepeaters.length && newIndexes.length === parentRepeaters.length) {
      var parentRepeatersInfo = parentRepeaters.map(function (repeaterId, i) {
        return _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()({}, repeaterId.split('__')[0], [oldIndexes[i], newIndexes[i]]);
      });
      var length = parentRepeatersInfo.length;
      var replacements = oldIndexes.map(function (oldIndex, i) {
        return ['__' + oldIndexes.slice(0, length - i).join('__'), '__' + newIndexes.slice(0, length - i).join('__')];
      });

      for (var i = 0; i < length; i++) {
        var id = Object.keys(parentRepeatersInfo[i])[0];
        var find = parentRepeatersInfo[i][id][0];
        var repl = parentRepeatersInfo[i][id][1];
        replacements.push(["<span class=\"wpcf7cf-index wpcf7cf__".concat(id, "\">").concat(find, "<\\/span>"), "<span class=\"wpcf7cf-index wpcf7cf__".concat(id, "\">").concat(repl, "</span>")]);
      }

      replacements.forEach(function (_ref3) {
        var _ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_ref3, 2),
            oldSuffix = _ref4[0],
            newSuffix = _ref4[1];

        returnHtml = returnHtml.replace(new RegExp(oldSuffix, 'g'), newSuffix);
      });
    }

    return returnHtml;
  },
  // keep this for backwards compatibility
  initForm: function initForm($forms) {
    $forms.each(function () {
      var $form = jQuery(this); // only add form is its class is "wpcf7-form" and if the form was not previously added

      if ($form.hasClass('wpcf7-form') && !wpcf7cf_forms.some(function (form) {
        return form.$form.get(0) === $form.get(0);
      })) {
        wpcf7cf_forms.push(new Wpcf7cfForm($form));
      }
    });
  },
  getWpcf7cfForm: function getWpcf7cfForm($form) {
    var matched_forms = wpcf7cf_forms.filter(function (form) {
      var f1 = form.$form.get(0);
      var f2 = $form.get(0);
      return form.$form.get(0) === $form.get(0);
    });

    if (matched_forms.length) {
      return matched_forms[0];
    }

    return false;
  },
  get_nested_conditions: function get_nested_conditions(conditions, $current_form) {
    //loop trough conditions. Then loop trough the dom, and each repeater we pass we should update all sub_values we encounter with __index
    wpcf7cf_reload_dom($current_form);
    var groups = Object.values(wpcf7cf_dom).filter(function (item, i) {
      return item.type === 'group';
    });
    var sub_conditions = [];

    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      var relevant_conditions = conditions.filter(function (condition, i) {
        return condition.then_field === g.original_name;
      });
      var relevant_conditions = relevant_conditions.map(function (item, i) {
        return {
          then_field: g.name,
          and_rules: item.and_rules.map(function (and_rule, i) {
            return {
              if_field: and_rule.if_field + g.suffix,
              if_value: and_rule.if_value,
              operator: and_rule.operator
            };
          })
        };
      });
      sub_conditions = sub_conditions.concat(relevant_conditions);
    }

    return sub_conditions;
  },
  get_simplified_dom_model: function get_simplified_dom_model(currentNode) {
    var simplified_dom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var parentGroups = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var parentRepeaters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var type = currentNode.classList && currentNode.classList.contains('wpcf7cf_repeater') ? 'repeater' : currentNode.dataset["class"] == 'wpcf7cf_group' ? 'group' : currentNode.className == 'wpcf7cf_step' ? 'step' : currentNode.hasAttribute('name') ? 'input' : false;

    var newParentRepeaters = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(parentRepeaters);

    var newParentGroups = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(parentGroups);

    if (type) {
      var name = type === 'input' ? currentNode.getAttribute('name') : currentNode.dataset.id;

      if (type === 'repeater') {
        newParentRepeaters.push(name);
      }

      if (type === 'group') {
        newParentGroups.push(name);
      } // skip _wpcf7 hidden fields


      if (name.substring(0, 6) === '_wpcf7') return {};
      var original_name = type === 'repeater' || type === 'group' ? currentNode.dataset.orig_data_id : type === 'input' ? currentNode.getAttribute('data-orig_name') || name : name;
      var nameWithoutBrackets = name.replace('[]', '');
      var originalNameWithoutBrackets = original_name.replace('[]', '');
      var val = type === 'step' ? [currentNode.dataset.id.substring(5)] : [];
      var parentGroup = 'parent-group';
      var suffix = nameWithoutBrackets.replace(originalNameWithoutBrackets, '');

      if (!simplified_dom[name]) {
        // init entry
        simplified_dom[name] = {
          name: name,
          type: type,
          original_name: original_name,
          suffix: suffix,
          val: val,
          parentGroups: parentGroups,
          parentRepeaters: parentRepeaters
        };
      }

      if (type === 'input') {
        // skip unchecked checkboxes and radiobuttons
        if ((currentNode.type === 'checkbox' || currentNode.type === 'radio') && !currentNode.checked) return {}; // if multiselect, make sure to add all the values

        if (currentNode.multiple && currentNode.options) {
          simplified_dom[name].val = Object.values(currentNode.options).filter(function (o) {
            return o.selected;
          }).map(function (o) {
            return o.value;
          });
        } else {
          simplified_dom[name].val.push(currentNode.value);
        }
      }
    }

    Array.from(currentNode.children).forEach(function (childNode) {
      var dom = wpcf7cf.get_simplified_dom_model(childNode, simplified_dom, newParentGroups, newParentRepeaters);
      simplified_dom = _objectSpread(_objectSpread({}, dom), simplified_dom);
    });
    return simplified_dom;
  },
  updateMultistepState: function updateMultistepState(multistep) {
    if (multistep == null) return; // update hidden input field

    var stepsData = {
      currentStep: multistep.currentStep,
      numSteps: multistep.numSteps,
      fieldsInCurrentStep: multistep.getFieldsInStep(multistep.currentStep)
    };
    multistep.form.$input_steps.val(JSON.stringify(stepsData)); // update Buttons

    multistep.$btn_prev.removeClass('disabled').attr('disabled', false);
    multistep.$btn_next.removeClass('disabled').attr('disabled', false);

    if (multistep.currentStep == multistep.numSteps) {
      multistep.$btn_next.addClass('disabled').attr('disabled', true);
    }

    if (multistep.currentStep == 1) {
      multistep.$btn_prev.addClass('disabled').attr('disabled', true);
    } // replace next button with submit button on last step.
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
    } // update dots


    var $dots = multistep.$dots.find('.dot');
    $dots.removeClass('active').removeClass('completed');

    for (var step = 1; step <= multistep.numSteps; step++) {
      if (step < multistep.currentStep) {
        $dots.eq(step - 1).addClass('completed');
      } else if (step == multistep.currentStep) {
        $dots.eq(step - 1).addClass('active');
      }
    }
  },
  should_group_be_shown: function should_group_be_shown(condition) {
    var show_group = true;

    for (var and_rule_i = 0; and_rule_i < condition.and_rules.length; and_rule_i++) {
      var condition_ok = false;
      var condition_and_rule = condition.and_rules[and_rule_i];
      var inputField = wpcf7cf_getFieldByName(condition_and_rule.if_field);
      if (!inputField) continue; // field not found

      var if_val = condition_and_rule.if_value;
      var operator = condition_and_rule.operator; //backwards compat

      operator = operator === '≤' ? 'less than or equals' : operator;
      operator = operator === '≥' ? 'greater than or equals' : operator;
      operator = operator === '>' ? 'greater than' : operator;
      operator = operator === '<' ? 'less than' : operator;
      var $field = operator === 'function' && jQuery("[name=\"".concat(inputField.name, "\"]")).eq(0);
      condition_ok = this.isConditionTrue(inputField.val, operator, if_val, $field);
      show_group = show_group && condition_ok;
    }

    return show_group;
  },
  isConditionTrue: function isConditionTrue(values, operator) {
    var testValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var $field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : jQuery();

    if (!Array.isArray(values)) {
      values = [values];
    }

    var condition_ok = false; // start by assuming that the condition is not met
    // Considered EMPTY:       []     ['']          [null]        ['',null]    [,,'']
    // Considered NOT EMPTY:   [0]    ['ab','c']    ['',0,null]

    var valuesAreEmpty = values.length === 0 || values.every(function (v) {
      return !v && v !== 0;
    }); // 0 is not considered empty
    // special cases: [] equals '' => TRUE; [] not equals '' => FALSE

    if (operator === 'equals' && testValue === '' && valuesAreEmpty) {
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

    var testValueNumber = isFinite(parseFloat(testValue)) ? parseFloat(testValue) : NaN;

    if (operator === 'not equals' || operator === 'not equals (regex)') {
      // start by assuming that the condition is met
      condition_ok = true;
    }

    if (operator === 'function' && typeof window[testValue] == 'function' && window[testValue]($field) // here we call the actual user defined function
    ) {
        condition_ok = true;
      }

    var regex_patt = /.*/i; // fallback regex pattern

    var isValidRegex = true;

    if (operator === 'equals (regex)' || operator === 'not equals (regex)') {
      try {
        regex_patt = new RegExp(testValue, 'i');
      } catch (e) {
        isValidRegex = false;
      }
    }

    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      var valueNumber = isFinite(parseFloat(value)) ? parseFloat(value) : NaN;
      var valsAreNumbers = !isNaN(valueNumber) && !isNaN(testValueNumber);

      if (operator === 'equals' && value === testValue || operator === 'equals (regex)' && regex_patt.test(value) || operator === 'greater than' && valsAreNumbers && valueNumber > testValueNumber || operator === 'less than' && valsAreNumbers && valueNumber < testValueNumber || operator === 'greater than or equals' && valsAreNumbers && valueNumber >= testValueNumber || operator === 'less than or equals' && valsAreNumbers && valueNumber <= testValueNumber) {
        condition_ok = true;
        break;
      } else if (operator === 'not equals' && value === testValue || operator === 'not equals (regex)' && regex_patt.test(value)) {
        condition_ok = false;
        break;
      }
    }

    return condition_ok;
  },
  getFormObj: function getFormObj($form) {
    if (typeof $form === 'string') {
      $form = jQuery($form).eq(0);
    }

    return wpcf7cf.getWpcf7cfForm($form);
  },
  getRepeaterObj: function getRepeaterObj($form, repeaterDataId) {
    var form = wpcf7cf.getFormObj($form);
    var repeater = form.repeaters.find(function (repeater) {
      return repeater.params.$repeater.attr('data-id') === repeaterDataId;
    });
    return repeater;
  },
  getMultiStepObj: function getMultiStepObj($form) {
    var form = wpcf7cf.getFormObj($form);
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
  repeaterAddSub: function repeaterAddSub($form, repeaterDataId) {
    var repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
    repeater.updateSubs(repeater.params.$repeater.num_subs + 1);
  },

  /**
   * Insert a new sub-entry at the given `index` of the repeater with the name `repeaterDataId` inside the form `$form`
   * @memberof wpcf7cf
   * @param {String|JQuery} $form - JQuery object or css-selector representing the form
   * @param {String} repeaterDataId - *data-id* attribute of the repeater.
   * @param {Number} index - position where to insert the new sub-entry within the repeater
   */
  repeaterAddSubAtIndex: function repeaterAddSubAtIndex($form, repeaterDataId, index) {
    var repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
    repeater.addSubs(1, index);
  },

  /**
   * Remove the sub-entry at the given `index` of the repeater with the *data-id* attribute of `repeaterDataId` inside the form `$form`
   * @memberof wpcf7cf
   * @param {String|JQuery} $form - JQuery object or css-selector representing the form
   * @param {String} repeaterDataId - *data-id* attribute of the repeater.
   * @param {Number} index - position where to insert the new sub-entry within the repeater
   */
  repeaterRemoveSubAtIndex: function repeaterRemoveSubAtIndex($form, repeaterDataId, index) {
    var repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
    repeater.removeSubs(1, index);
  },

  /**
   * Remove the last sub-entry from the repeater with the *data-id* attribute of `repeaterDataId` inside the form `$form`
   * @memberof wpcf7cf
   * @param {String|JQuery} $form - JQuery object or css-selector representing the form
   * @param {String} repeaterDataId - *data-id* attribute of the repeater.
   * @param {Number} index - position where to insert the new sub-entry within the repeater
   */
  repeaterRemoveSub: function repeaterRemoveSub($form, repeaterDataId) {
    var repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
    repeater.updateSubs(repeater.params.$repeater.num_subs - 1);
  },

  /**
   * Set the number of subs for the repeater with the *data-id* attribute of `repeaterDataId` inside the form `$form`.
   * Subs are either appended to or removed from the end of the repeater.
   * @memberof wpcf7cf
   * @param {String|JQuery} $form - JQuery object or css-selector representing the form
   * @param {String} repeaterDataId - *data-id* attribute of the repeater.
   * @param {Number} numberOfSubs - position where to insert the new sub-entry within the repeater
   */
  repeaterSetNumberOfSubs: function repeaterSetNumberOfSubs($form, repeaterDataId, numberOfSubs) {
    var repeater = wpcf7cf.getRepeaterObj($form, repeaterDataId);
    repeater.updateSubs(numberOfSubs);
  },

  /**
   * Move to step number `step`, ignoring any validation.
   * @memberof wpcf7cf
   * @param {String|JQuery} $form - JQuery object or css-selector representing the form
   * @param {*} step 
   */
  multistepMoveToStep: function multistepMoveToStep($form, step) {
    var multistep = wpcf7cf.getMultiStepObj($form);
    multistep.moveToStep(step);
  },

  /**
   * Validate the current step, and move to step number `step` if validation passes.
   * @memberof wpcf7cf
   * @param {String|JQuery} $form - JQuery object or css-selector representing the form
   * @param {Number} step 
   */
  multistepMoveToStepWithValidation: function multistepMoveToStepWithValidation($form, step) {
    return _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee2() {
      var multistep, result;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              multistep = wpcf7cf.getMultiStepObj($form);
              _context2.next = 3;
              return multistep.validateStep(multistep.currentStep);

            case 3:
              result = _context2.sent;

              if (result === 'success') {
                multistep.moveToStep(step);
              }

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }
};
jQuery('.wpcf7-form').each(function () {
  wpcf7cf_forms.push(new Wpcf7cfForm(jQuery(this)));
}); // Call displayFields again on all forms
// Necessary in case some theme or plugin changed a form value by the time the entire page is fully loaded.

jQuery('document').ready(function () {
  wpcf7cf_forms.forEach(function (f) {
    f.displayFields();
  });
}); // fix for exclusive checkboxes in IE (this will call the change-event again after all other checkboxes are unchecked, triggering the display_fields() function)

var old_wpcf7ExclusiveCheckbox = jQuery.fn.wpcf7ExclusiveCheckbox;

jQuery.fn.wpcf7ExclusiveCheckbox = function () {
  return this.find('input:checkbox').on('click', function () {
    var name = jQuery(this).attr('name');
    jQuery(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false).eq(0).change();
  });
};

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js");

var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime/helpers/nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles */ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");

var iterableToArray = __webpack_require__(/*! ./iterableToArray */ "./node_modules/@babel/runtime/helpers/iterableToArray.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread */ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");

/***/ }),

/***/ "./node_modules/es6-promise-promise/index.js":
/*!***************************************************!*\
  !*** ./node_modules/es6-promise-promise/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! es6-promise */ "./node_modules/es6-promise/dist/es6-promise.js").Promise;

/***/ }),

/***/ "./node_modules/es6-promise/dist/es6-promise.js":
/*!******************************************************!*\
  !*** ./node_modules/es6-promise/dist/es6-promise.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   3.3.1
 */
(function (global, factory) {
  ( false ? undefined : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
})(this, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || _typeof(x) === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;

  if (!Array.isArray) {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;
  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;

    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]'; // test for web worker but not in IE10

  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined'; // node

  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  } // vertx


  function useVertxTimer() {
    return function () {
      vertxNext(flush);
    };
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {
      characterData: true
    });
    return function () {
      node.data = iterations = ++iterations % 2;
    };
  } // web worker


  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);

  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = __webpack_require__(/*! vertx */ 1);
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined; // Decide what async method to use to triggering processing of queued callbacks:

  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;
    var parent = this;
    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }
  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */


  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && _typeof(object) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);

    _resolve(promise, object);

    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }

        sealed = true;

        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }

        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;

        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._state = REJECTED;
    promise._result = reason;
    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;
    parent._onerror = null;
    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());

        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {// noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;

  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;
      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;

        this._enumerate();

        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  ;

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);

        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;
    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };
  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */


  function all(entries) {
    return new Enumerator(this, entries).promise;
  }
  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */


  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;

        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }
  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */


  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);

    _reject(promise, reason);

    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }
  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */


  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;
  Promise.prototype = {
    constructor: Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
    
      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
    
      Chaining
      --------
    
      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
    
      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
    
      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
    
      Assimilation
      ------------
    
      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
    
      If the assimliated promise rejects, then the downstream promise will also reject.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
    
      Simple Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let result;
    
      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
    
      Advanced Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let author, books;
    
      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
    
      function foundBooks(books) {
    
      }
    
      function failure(reason) {
    
      }
    
      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
    
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
    
      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
    
      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
    
      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
    
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;

      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {// silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  }

  polyfill(); // Strange compat..

  Promise.polyfill = polyfill;
  Promise.Promise = Promise;
  return Promise;
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;

      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };

  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? undefined : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function () {};

    module.paths = []; // module.parent = undefined by default

    if (!module.children) module.children = [];
    Object.defineProperty(module, "loaded", {
      enumerable: true,
      get: function get() {
        return module.l;
      }
    });
    Object.defineProperty(module, "id", {
      enumerable: true,
      get: function get() {
        return module.i;
      }
    });
    module.webpackPolyfill = 1;
  }

  return module;
};

/***/ }),

/***/ 0:
/*!*****************************************************!*\
  !*** multi es6-promise-promise ./js/scripts_es6.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! es6-promise-promise */"./node_modules/es6-promise-promise/index.js");
module.exports = __webpack_require__(/*! ./js/scripts_es6.js */"./js/scripts_es6.js");


/***/ }),

/***/ 1:
/*!***********************!*\
  !*** vertx (ignored) ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=scripts.js.map