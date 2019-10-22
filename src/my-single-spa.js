/**
 * @file
 * Created by zhangyatao on 2019/10/20.
 */
'use strict';
export {setBootstrapMaxTime, setMountMaxTime, setUnloadMaxTime, setUnmountMaxTime} from './applications/timeouts';
export {registerApplication, getAppNames, getAppStatus, getRawApps} from './applications/apps'
export {start} from './start';
export {mountSystemService, getSystemService} from './services';
export {
    NOT_LOADED,
    LOAD_RESOURCE_CODE,
    NOT_BOOTSTRAPPED,
    BOOTSTRAPPING,
    NOT_MOUNTED,
    MOUNTED,
    UNMOUNTING,
    LOAD_ERROR,
    SKIP_BECAUSE_BROKEN
} from './applications/app.helper'
