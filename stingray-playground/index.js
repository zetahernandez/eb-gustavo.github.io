function showWidget(eventId) {
    EBWidgets.createWidget({
        widgetType: 'checkout',
        eventId: eventId,
        iframeContainerId: 'checkout_widget',
        onOrderComplete: function() {
            console.log('Order Completed');
        }
    });
}

function parseUrlParams() {
    var match,
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function(s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
}

function downloadWidgetJs(urlParams) {
    var widgetUrlMap = {
        dev: 'https://www.evbdev.com/static/widgets/eb_widgets.js',
        qa: 'https://www.evbqa.com/static/widgets/eb_widgets.js',
        prod: 'https://www.eventbrite.com/static/widgets/eb_widgets.js'
    };
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = widgetUrlMap[urlParams.env];
    scriptElement.addEventListener('load', showWidget.bind(null, urlParams.eid))
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

function initApp() {
    var urlParams = parseUrlParams();
    downloadWidgetJs(urlParams);
}

if (window.addEventListener) {
    window.addEventListener('load', initApp, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initApp);
} else {
    window.onload = initApp;
}
