/**
 * @file
 * Created by zhangyatao on 2019/10/20.
 */

'use strict';

import {
    NOT_LOADED,
    notSkipped,
    withoutLoadError,
    isntLoaded,
    shouldBeActive,
    shouldntBeActive,
    isLoaded,
    isntActive,
    isActive
} from './app.helper';
import {invoke} from '../navigation/invoke';

const APPS = [];


/**
 * 获取满足加载条件的app
 * 1、没有加载中断
 * 2、没有加载错误
 * 3、没有被加载过
 * 4、满足app.activityWhen()
 * @return {*[]}
 */
export function getAppsToLoad() {
    return APPS.filter(notSkipped).filter(withoutLoadError).filter(isntLoaded).filter(shouldBeActive);
}

/**
 * 需要mount的app
 * 1、没有加载中断
 * 2、加载过的
 * 3、当前没有mounted的
 * 4、需要被mounted的
 */
export function getAppsToMount() {
    return APPS.filter(notSkipped).filter(isLoaded).filter(isntActive).filter(shouldBeActive);
}

/**
 * 需要被unmount的app
 * 1、没有加载中断
 * 2、正在挂载的
 * 3、需要卸载的
 */
export function getAppsToUnmount() {
    return APPS.filter(notSkipped).filter(isActive).filter(shouldntBeActive);
}

/**
 * 获取所有的App名称
 * @return {string[]}
 */
export function getAppNames() {
    return APPS.map(function (item) {
        return item.name;
    });
}

export function getAppStatus(name) {
    if (!name) {
        return APPS.map(item => item.status);
    }
    let app = APPS.find(item => item.name === name);
    return app ? app.status : null;
}

export function getRawApps() {
    return [...APPS];
}

export function getMountedApps() {
    return APPS.filter(isActive).map(item => item.name);
}

/**
 * 注册application
 * @param {string} appName application名称
 * @param {Object|Function<Promise>} applicationOrLoadFunction app配置或app异步加载函数
 * @param {Function<Boolean>} activityWhen 判断是否应该被挂载
 * @param {Object} customProps 自定义配置
 * @return {Promise}
 */
export function registerApplication(appName, applicationOrLoadFunction, activityWhen, customProps = {}) {
    if (!appName || typeof appName !== 'string') {
        throw new Error('the app name must be a non-empty string');
    }
    if (getAppNames().indexOf(appName) !== -1) {
        throw new Error('There is already an app declared with name ' + appName);
    }
    if (typeof customProps !== 'object' || Array.isArray(customProps)) {
        throw new Error('the customProps must be a pure object');
    }

    if (!applicationOrLoadFunction) {
        throw new Error('the application or load function is required');
    }

    if (typeof activityWhen !== 'function') {
        throw new Error('the activityWhen must be a function');
    }

    if (typeof applicationOrLoadFunction !== 'function') {
        applicationOrLoadFunction = () => Promise.resolve(applicationOrLoadFunction);
    }

    APPS.push({
        name: appName,
        loadApp: applicationOrLoadFunction,
        activityWhen,
        customProps,
        status: NOT_LOADED,
        services: {}
    });

    return invoke();
}
