$(() => {
    setTimeout(() => {
        initializeCastApi = function() {
            cast.framework.CastContext.getInstance().setOptions({
                receiverApplicationId: '984F9B77',
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
            });
        };

        window['__onGCastApiAvailable'] = function(isAvailable) {
            if (isAvailable) {
                initializeCastApi();
            }
        };

        function send() {
            var textEl = document.getElementById('text');
            sendText(textEl.value);
        }

        function sendText(txt) {
            var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
            if (castSession) {
                castSession.sendMessage('urn:x-cast:message', {
                    type: 'message',
                    text: txt
                });
            }
        }

        $('.loader').fadeOut('fast', () => $('.application').fadeIn());
    }, 3000);
});
