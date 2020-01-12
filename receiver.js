$(() => {
    setTimeout(() => {
        const context = cast.framework.CastReceiverContext.getInstance();
        context.addCustomMessageListener('urn:x-cast:message', function(customEvent) {
            if (customEvent.data.type == 'message') {
                document.getElementById('message').innerHTML = customEvent.data.text;
            }
        });
        context.start();

        $('.loader').fadeOut('fast', () => $('.application').fadeIn());
    }, 3000);
});
