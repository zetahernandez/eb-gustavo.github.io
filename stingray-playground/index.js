function showWidget(eventId, modal) {
    var options = {
        widgetType: 'checkout',
        eventId: eventId,
        onOrderComplete: function() {
            console.log('Order Completed');
        }
    };

    if (modal === 'on') {
        options['modal'] = true;
        options['modalTriggerElementId'] = 'modal-trigger';
    } else {
        options['iframeContainerId'] = 'checkout-widget';
    }

    EBWidgets.createWidget(options);
}

function buildWidgetContainer(eventId, modal) {
    if (modal === 'on') {
        var checkoutWidget = document.getElementById('checkout-widget')
        var button = document.createElement('button');
        var buttonLabel = document.createTextNode('Open modal');

        button.id = 'modal-trigger';
        button.appendChild(buttonLabel);
        checkoutWidget.appendChild(button);
    }

    showWidget(eventId, modal);
}

function decode(value, replaceRegex) {
    return decodeURIComponent(value.replace(replaceRegex, " "));
};

function parseUrlParams() {
    var replaceRegex = /\+/g;
    var searchRegex = /([^&=]+)=?([^&]*)/g;
    var query = window.location.search.substring(1);
    var match;
    var urlParams = {};

    while (match = searchRegex.exec(query)) {
        urlParams[decode(match[1], replaceRegex)] = decode(match[2], replaceRegex);
    }
    return urlParams;
}

function downloadWidgetJs(urlParams) {
    var scriptElement = document.createElement('script');
    var widgetUrlMap = {
        dev: 'https://www.evbdev.com/static/widgets/eb_widgets.js',
        qa: 'https://www.evbqa.com/static/widgets/eb_widgets.js',
        prod: 'https://www.eventbrite.com/static/widgets/eb_widgets.js'
    };

    scriptElement.type = 'text/javascript';
    scriptElement.src = widgetUrlMap[urlParams.env];
    scriptElement.addEventListener('load', buildWidgetContainer.bind(null, urlParams.eid, urlParams.modal))
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

function fillForm(urlParams) {
    document.getElementsByName('env')[0].value = urlParams.env;
    document.getElementsByName('eid')[0].value = urlParams.eid;
    document.getElementsByName('modal')[0].checked = urlParams.modal === 'on';
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
