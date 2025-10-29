// ------------------------------------
//    DISMISS NOTICES
// ------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Delegated click handler covers notices added later, too
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest(
            '.wpcf7cf-admin-notice .notice-dismiss, .wpcf7cf-admin-notice .notice-dismiss-alt'
        );
        if (!trigger) return;

        event.preventDefault();

        const noticeEl = trigger.closest('.wpcf7cf-admin-notice');
        if (!noticeEl) return;

        const noticeId = noticeEl.dataset.noticeId || '';
        const nonce = noticeEl.dataset.nonce || '';

        // Update hidden input when noticeId is empty (parity with original)
        if (noticeId === '') {
            const input = document.querySelector('input[name="wpcf7cf_options[notice_dismissed]"]');
            if (input) input.value = 'true';
        }

        // Fire AJAX (needs admin `ajaxurl`; front-end must localize it)
        if (typeof ajaxurl !== 'undefined') {
            const params = new URLSearchParams();
            params.append('action', 'wpcf7cf_dismiss_notice');
            params.append('noticeId', noticeId);
            params.append('nonce', nonce);

            fetch(ajaxurl, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
                cache: 'no-cache'
            }).then((response) => {
                if (response.ok) {
                    // Remove notice from DOM on success
                    noticeEl.remove();
                }
            }).catch(() => {
                // Silently fail
            });
        }
    });
});