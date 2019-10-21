/**
 * @file
 * Created by zhangyatao on 2019/10/21.
 */
'use strict';
(function (global) {
    var defaultOpts = {
        // required opts
        Vue: null,
        appOptions: null,
        template: null,
    };


    function bootstrap(opts) {
        return Promise.resolve();
    }

    function mount(opts, mountedInstances) {
        var el = opts.appOptions.el;
        if (!el) {
            opts.notHasEl = true;
            var div = document.createElement('div');
            div.id = 'my-single-spa_' + Math.random().toString(36).slice(2);
            document.body.appendChild(div);
            opts.appOptions.el = '#' + div.id;
        }


        mountedInstances.instance = new opts.Vue(opts.appOptions);

        if (mountedInstances.instance.bind) {
            mountedInstances.instance = mountedInstances.instance.bind(mountedInstances.instance);
        }

        return Promise.resolve();

    }

    function unmount(opts, mountedInstances) {
        mountedInstances.instance.$destroy();
        mountedInstances.instance.$el.innerHTML = '';
        opts.notHasEl && (opts.appOptions.el = '');
        delete mountedInstances.instance;
        return Promise.resolve();

    }

    global.mySingleSpaVue = function (options) {
        if (typeof options !== 'object') {
            throw new Error('mySingleSpaVue options must be a object');
        }

        let opts = Object.assign({}, defaultOpts, options);

        if (!options.Vue) {
            throw new Error('mySingleSpaVue must be passed a Vue');
        }

        if (!options.appOptions) {
            throw new Error('mySingleSpaVue must be passed a appOptions');
        }

        let mountedInstances = {};

        return {
            bootstrap: bootstrap.bind(null, opts, mountedInstances),
            mount: mount.bind(null, opts, mountedInstances),
            unmount: unmount.bind(null, opts, mountedInstances)
        }
    };
}(window));
