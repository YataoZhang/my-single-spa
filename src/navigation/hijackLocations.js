/**
 * @file
 * Created by zhangyatao on 2019/10/21.
 */

'use strict';

// onhashchange onpopstate history.pushState() history.replaceState()

import {invoke} from "./invoke";

const HIJACK_EVENTS_NAME = /^(hashchange|popstate)$/i;
const EVENTS_POOL = {
    hashchange: [],
    popstate: []
};

function reroute() {
    invoke([], arguments);
}

window.addEventListener('hashchange', reroute);
window.addEventListener('popstate', reroute);

// 拦截所有注册的事件，以便确保这里的事件总是第一个执行
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;
window.addEventListener = function (eventName, handler, args) {
    if (eventName && HIJACK_EVENTS_NAME.test(eventName) && typeof handler === 'function') {
        EVENTS_POOL[eventName].indexOf(handler) === -1 && EVENTS_POOL[eventName].push(handler);
    }
    return originalAddEventListener.apply(this, arguments);
};

window.removeEventListener = function (eventName, handler) {
    if (eventName && HIJACK_EVENTS_NAME.test(eventName) && typeof handler === 'function') {
        let eventList = EVENTS_POOL[eventName];
        eventList.indexOf(handler) > -1 && (EVENTS_POOL[eventName] = eventList.filter(fn => fn !== handler));
    }
    return originalRemoveEventListener.apply(this, arguments);
};


// 拦截history的方法，因为pushState和replaceState方法并不会触发onpopstate事件，所以我们即便在onpopstate时执行了reroute方法，也要在这里执行下reroute方法。
const originalHistoryPushState = window.history.pushState;
const originalHistoryReplaceState = window.history.replaceState;
window.history.pushState = function (state, title, url) {
    let result = originalHistoryPushState.apply(this, arguments);
    reroute(mockPopStateEvent(state));
    return result;
};
window.history.replaceState = function (state, title, url) {
    let result = originalHistoryReplaceState.apply(this, arguments);
    reroute(mockPopStateEvent(state));
    return result;
};

function mockPopStateEvent(state) {
    return new PopStateEvent('popstate', {state});
}

export function callCapturedEvents(eventArgs) {
    if (!eventArgs) {
        return;
    }
    if (Array.isArray(eventArgs)) {
        eventArgs = eventArgs[0];
    }
    let name = eventArgs.type;
    if (!HIJACK_EVENTS_NAME.test(name)) {
        return;
    }
    EVENTS_POOL[name].forEach(handler => handler.apply(window, eventArgs));
}

