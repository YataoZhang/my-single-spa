/**
 * @file
 * Created by zhangyatao on 2019/10/22.
 */


'use strict';

import {MOUNTED, SKIP_BECAUSE_BROKEN, UPDATING} from "../applications/app.helper";
import {reasonableTime} from "../applications/timeouts";
import {getProps} from './helper';

export function toUpdatePromise(service) {
    if (service.status !== MOUNTED) {
        return Promise.resolve(service);
    }

    service.status = UPDATING;
    return reasonableTime(service.update(getProps(service)), `service: ${service.name} updating`, service.timeouts.mount).then(() => {
        service.status = MOUNTED;
        return service;
    }).catch(e => {
        console.log(e);
        service.status = SKIP_BECAUSE_BROKEN;
        return service;
    });
}
