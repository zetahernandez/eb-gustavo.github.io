const replaceRegex = /\+/g; // Regex for replacing addition symbol with a space
const searchRegex = /([^&=]+)=?([^&]*)/g;
const widgetUrlMap = {
    dev: 'https://www.evbdev.com/static/widgets/eb_widgets.js',
    qa: 'https://www.evbqa.com/static/widgets/eb_widgets.js',
    prod: 'https://www.eventbrite.com/static/widgets/eb_widgets.js'
};

const initApp = () => {
    let urlParams = parseUrlParams();

    if (!Object.keys(urlParams).length) {
        return;
    }

    fillForm(urlParams);
    downloadWidgetJs(urlParams);
};

const parseUrlParams = () => {
    let match;
    let query = window.location.search.substring(1);

    let urlParams = {};
    while (match = searchRegex.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
};

const decode = (value) => (
    decodeURIComponent(value.replace(replaceRegex, ' '));
);

const fillForm = (urlParams) => {
    document.getElementsByName('env')[0].value = urlParams.env;
    document.getElementsByName('eid')[0].value = urlParams.eid;
};

const downloadWidgetJs = (urlParams) => {
    let scriptElement = document.createElement('script');

    scriptElement.type = 'text/javascript';
    scriptElement.src = widgetUrlMap[urlParams.env];
    scriptElement.addEventListener('load', showWidget.bind(null, urlParams.eid))
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
};

const showWidget = (eventId) => {
    EBWidgets.createWidget({
        widgetType: 'checkout',
        eventId: eventId,
        iframeContainerId: 'checkout_widget',
        onOrderComplete: function() {
            console.log('Order Completed');
        }
    });
};

if (window.addEventListener) {
    window.addEventListener('load', initApp, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initApp);
} else {
    window.onload = initApp;
}
