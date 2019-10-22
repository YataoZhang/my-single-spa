/**
 * @file
 * Created by zhangyatao on 2019/10/20.
 */
'use strict';
const DEFAULT_TIMEOUTS = {
    bootstrap: {
        // 超时毫秒数
        milliseconds: 3000,
        // 当超时，是否
        rejectWhenTimeout: false
    },
    mount: {
        // 超时毫秒数
        milliseconds: 3000,
        // 当超时，是否
        rejectWhenTimeout: false
    },
    unmount: {
        // 超时毫秒数
        milliseconds: 3000,
        // 当超时，是否
        rejectWhenTimeout: false
    },
    unload: {
        // 超时毫秒数
        milliseconds: 3000,
        // 当超时，是否
        rejectWhenTimeout: false
    }
};

export function setBootstrapMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
        throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }
    DEFAULT_TIMEOUTS.bootstrap = {milliseconds, rejectWhenTimeout};
}


export function setMountMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
        throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }
    DEFAULT_TIMEOUTS.mount = {milliseconds, rejectWhenTimeout};
}

export function setUnmountMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
        throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }
    DEFAULT_TIMEOUTS.unmount = {milliseconds, rejectWhenTimeout};
}

export function setUnloadMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
        throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }
    DEFAULT_TIMEOUTS.unload = {milliseconds, rejectWhenTimeout};
}

export function ensureAppTimeouts(timeouts = {}) {
    return {
        ...DEFAULT_TIMEOUTS,
        ...timeouts
    }
}

export function reasonableTime(promise, description, timeouts) {
    return new Promise((resolve, reject) => {
        let finished = false;

        promise.then(data => {
            finished = true;
            resolve(data);
        }).catch(e => {
            finished = true;
            reject(e);
        });


        setTimeout(() => maybeTimeout(), timeouts.milliseconds);

        function maybeTimeout() {
            if (finished) {
                return;
            }
            let error = `${description} did not resolve or reject for ${timeouts.milliseconds} milliseconds`;
            if (timeouts.rejectWhenTimeout) {
                reject(new Error(error));
            } else {
                console.error(error);
            }
        }

    });
}
