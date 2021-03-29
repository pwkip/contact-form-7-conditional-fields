// ------------------------------------
//    DISMISS NOTICES
// ------------------------------------

jQuery(document).ready(function($) {

    $('.notice-dismiss,.notice-dismiss-alt', '.wpcf7cf-admin-notice').click(function () {
        wpcf7cf_dismiss_notice(
            $(this).closest('.wpcf7cf-admin-notice').data('noticeId')
        );
    });

    function wpcf7cf_dismiss_notice(noticeId) {

        if (noticeId === '') {
            $('input[name="wpcf7cf_options[notice_dismissed]"]').val('true');
        }

        $.post(ajaxurl, { action:'wpcf7cf_dismiss_notice', noticeId:noticeId }, function(response) {
            // nothing to do. dismiss_notice option should be set to TRUE server side by now.
        });

    }

});