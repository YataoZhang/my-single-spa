/**
 * @file
 * Created by zhangyatao on 2019/10/20.
 */
'use strict';

import * as mySingleSpa from '../my-single-spa';

export function getProps(app) {
    const result = {
        ...app.customProps,
        name: app.name,
        ctx: mySingleSpa
    };

    return result;
}

export function smellLikeAPromise(promise) {
    if (promise instanceof Promise) {
        return true;
    }
    return typeof promise === 'function' && promise.then === 'function' && promise.catch === 'function';
}

export function validateLifeCyclesFn(fn) {
    if (typeof fn === 'function') {
        return true;
    }
    if (Array.isArray(fn)) {
        return fn.filter(item => typeof item !== 'function').length === 0;
    }
    return false;
}

export function flattenFnArray(fns, description) {
    if (!Array.isArray(fns)) {
        fns = [fns];
    }

    if (fns.length === 0) {
        fns = [() => Promise.resolve()];
    }

    return function (props) {
        return new Promise((resolve, reject) => {
            waitForPromises(0);

            function waitForPromises(index) {
                let fn = fns[index](props);
                if (!smellLikeAPromise(fn)) {
                    reject(`${description} at index ${index} did not return a promise`);
                    return;
                }
                fn.then(() => {
                    if (index === fns.length - 1) {
                        resolve();
                    } else {
                        waitForPromises(index++);
                    }
                }).catch((e)=>{
                    reject(e);
                });
            }

        });
    }
}
