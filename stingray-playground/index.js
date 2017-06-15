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
        urlParams = {},
        replaceRegex = /\+/g, // Regex for replacing addition symbol with a space
        searchRegex = /([^&=]+)=?([^&]*)/g,
        decode = function(s) {
            return decodeURIComponent(s.replace(replaceRegex, " "));
        },
        query = window.location.search.substring(1);

    while (match = searchRegex.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
}

function downloadWidgetJs(urlParams) {
    var scriptElement = document.createElement('script'),
        widgetUrlMap = {
            dev: 'https://www.evbdev.com/static/widgets/eb_widgets.js',
            qa: 'https://www.evbqa.com/static/widgets/eb_widgets.js',
            prod: 'https://www.eventbrite.com/static/widgets/eb_widgets.js'
        };

    scriptElement.type = 'text/javascript';
    scriptElement.src = widgetUrlMap[urlParams.env];
    scriptElement.addEventListener('load', showWidget.bind(null, urlParams.eid))
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

function fillForm(urlParams) {
    document.getElementsByName('env')[0].value = urlParams.env;
    document.getElementsByName('eid')[0].value = urlParams.eid;
}

function initApp() {
    var urlParams = parseUrlParams();

    if (!Object.keys(urlParams).length) {
        return;
    }

    fillForm(urlParams);
    downloadWidgetJs(urlParams);
}

if (window.addEventListener) {
    window.addEventListener('load', initApp, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initApp);
} else {
    window.onload = initApp;
}
