/**
 * @file
 * Created by zhangyatao on 2019/10/21.
 */


'use strict';

import {MOUNTED, NOT_MOUNTED, SKIP_BECAUSE_BROKEN} from "../applications/app.helper";
import {reasonableTime} from "../applications/timeouts";
import {getProps} from "./helper";
import {toUnmountPromise} from './unmount';

export function toMountPromise(app) {
    if (app.status !== NOT_MOUNTED) {
        return Promise.resolve(app);
    }

    return reasonableTime(app.mount(getProps(app)), `app: ${app.name} mounting`, app.timeouts.mount).then(() => {
        app.status = MOUNTED;
    }).catch(e => {
        console.log(e);
        app.status = MOUNTED;

        return toUnmountPromise(app).then(() => {
            app.status = SKIP_BECAUSE_BROKEN;
            return app;
        }).catch(e => {
            console.log(e);
            app.status = SKIP_BECAUSE_BROKEN;
            return app;
        });
    })


}
