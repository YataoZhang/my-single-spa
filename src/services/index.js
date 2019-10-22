/**
 * @file
 * Created by zhangyatao on 2019/10/22.
 */


'use strict';

import {flattenFnArray, smellLikeAPromise, validateLifeCyclesFn} from "../lifecycles/helper";
import {
    LOAD_RESOURCE_CODE,
    MOUNTED,
    NOT_BOOTSTRAPPED,
    SKIP_BECAUSE_BROKEN
} from '../applications/app.helper';
import {ensureAppTimeouts} from "../applications/timeouts";
import {toBootstrapPromise} from '../lifecycles/bootstrap';
import {toMountPromise} from '../lifecycles/mount';
import {toUnmountPromise} from '../lifecycles/unmount';
import {toUpdatePromise} from '../lifecycles/update';


let serviceIndex = 0;

const systemService = {services: {}};

/**
 * 挂载系统服务
 * @return {{mount(): Promise, unmount(): Promise, update(Object): Promise, getStatus(): string}}
 */
export function mountSystemService() {
    return mountService.apply(systemService, arguments);
}

/**
 * 根据名称获取系统服务
 * @param {string} serviceName 系统服务名称
 * @return {*|null}
 */
export function getSystemService(serviceName) {
    return systemService[serviceName] || {};
}

/**
 * 挂载服务
 * @param {Object|Function<Promise>} config 服务配置或加载函数
 * @param {Object} props 传入服务的属性
 * @return {{mount(): Promise, unmount(): Promise, update(Object): Promise, getStatus(): string}}
 */
export function mountService(config, props = {}) {
    if (!config || !/^(object|function)$/.test(typeof config)) {
        throw new Error('cannot mount services without config or config load function');
    }

    const context = this;
    serviceIndex++;

    let loadServicePromise = typeof config === 'function' ? config() : () => Promise.resolve(config);

    if (!smellLikeAPromise(loadServicePromise)) {
        throw new Error('config load function must be a promise or thenable');
    }

    const service = {
        id: serviceIndex,
        // service 可以嵌套 service
        services: {},
        status: LOAD_RESOURCE_CODE,
        props,
        context
    };


    loadServicePromise = loadServicePromise.then(serviceConfig => {
        let errorMsg = [];
        const name = `service_${service.id}`;

        if (typeof serviceConfig !== 'object') {
            errorMsg.push(`service load function dose not export anything`);
        }

        ['bootstrap', 'mount', 'unmount', 'update'].forEach(lifecycle => {
            // update是可选的
            if (lifecycle === 'update' && !serviceConfig[lifecycle]) {
                return;
            }
            if (!validateLifeCyclesFn(serviceConfig[lifecycle])) {
                errorMsg.push(`service dost not export ${lifecycle} as a function or function array`);
            }
        });

        if (errorMsg.length) {
            service.status = SKIP_BECAUSE_BROKEN;
            throw new Error(errorMsg.toString());
        }

        service.name = name;
        service.status = NOT_BOOTSTRAPPED;
        service.bootstrap = flattenFnArray(serviceConfig.bootstrap, `service bootstrap functions`);
        service.mount = flattenFnArray(serviceConfig.mount, `service mount functions`);
        service.unmount = flattenFnArray(serviceConfig.unmount, `service unmount functions`);
        service.timeouts = ensureAppTimeouts(serviceConfig.timeouts);

        if (serviceConfig.update) {
            service.update = flattenFnArray(serviceConfig.update, 'service update functions');
        }

    });

    loadServicePromise = loadServicePromise.then(() => toBootstrapPromise(service));

    let actions = {
        mount() {
            return loadServicePromise.then(() => {
                context.services[service.name] = service;
                return toMountPromise(service);
            }).then(() => {
                if (service.status !== MOUNTED) {
                    delete context.services[service.name];
                }
            });
        },
        unmount() {
            return toUnmountPromise(service).then(() => {
                delete context.services[service.name];
            });
        },
        update(props = {}) {
            service.props = props;
            return toUpdatePromise(service)
        },
        getStatus() {
            return service.status;
        },
        getRawData() {
            return {...service};
        }
    };

    service.unmountSelf = actions.unmount;
    service.mountSelf = actions.mount;
    service.updateSelf = actions.update;

    return actions;

}
