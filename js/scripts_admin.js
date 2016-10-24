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

})( jQuery );
