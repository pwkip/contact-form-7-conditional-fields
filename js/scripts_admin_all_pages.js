// ------------------------------------
//    DISMISS NOTICES
// ------------------------------------

jQuery(document).ready(function($) {

    $('.notice-dismiss,.notice-dismiss-alt', '.wpcf7cf-admin-notice').click(function () {
        const $noticeEl = $(this).closest('.wpcf7cf-admin-notice');
        wpcf7cf_dismiss_notice( $noticeEl.data('noticeId'), $noticeEl.data('nonce') );
    });

    function wpcf7cf_dismiss_notice(noticeId, nonce) {

        if (noticeId === '') {
            $('input[name="wpcf7cf_options[notice_dismissed]"]').val('true');
        }

        $.post(ajaxurl, { action:'wpcf7cf_dismiss_notice', noticeId:noticeId, nonce:nonce }, function (response) {
            // nothing to do. dismiss_notice option should be set to TRUE server side by now.
        });

    }

});