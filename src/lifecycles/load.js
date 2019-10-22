/**
 * @file
 * Created by zhangyatao on 2019/10/20.
 */


'use strict';
import {
    LOAD_ERROR,
    LOAD_RESOURCE_CODE,
    NOT_LOADED,
    SKIP_BECAUSE_BROKEN,
    NOT_BOOTSTRAPPED
} from '../applications/app.helper';

import {getProps, smellLikeAPromise, validateLifeCyclesFn, flattenFnArray} from './helper';

import {ensureAppTimeouts} from '../applications/timeouts';

export function toLoadPromise(app) {
    // 状态不满足需要被load
    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
        return Promise.resolve(app);
    }

    app.status = LOAD_RESOURCE_CODE;

    const loadPromise = app.loadApp(getProps(app));

    if (!smellLikeAPromise(loadPromise)) {
        console.log('app loadFunction must return a promise');
        app.status = SKIP_BECAUSE_BROKEN;
        return Promise.resolve(app);
    }

    return loadPromise.then(module => {
        let errorMsg = [];

        if (typeof module !== 'object') {
            errorMsg.push(`app:${app.name} dose not export anything`);
        }

        ['bootstrap', 'mount', 'unmount'].forEach(lifecycle => {
            if (!validateLifeCyclesFn(module[lifecycle])) {
                errorMsg.push(`app:${app.name} dost not export ${lifecycle} as a function or function array`);
            }
        });

        if (errorMsg.length) {
            console.log(errorMsg);
            app.status = SKIP_BECAUSE_BROKEN;
            return app;
        }

        app.status = NOT_BOOTSTRAPPED;
        app.bootstrap = flattenFnArray(module.bootstrap, `app:${app.name} bootstrap functions`);
        app.mount = flattenFnArray(module.mount, `app:${app.name} mount functions`);
        app.unmount = flattenFnArray(module.unmount, `app:${app.name} unmount functions`);
        app.unload = flattenFnArray(module.unload ? module.unload : [], `app:${app.name} unload functions`);
        app.timeouts = ensureAppTimeouts(module.timeouts);


        return app;

    }).catch(e => {
        console.log(e);
        app.status = LOAD_ERROR;
        return app;
    });

}
