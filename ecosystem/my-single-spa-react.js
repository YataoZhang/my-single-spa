/**
 * @file
 * Created by zhangyatao on 2019/10/22.
 */
'use strict';

/**
 * @file
 * Created by zhangyatao on 2019/10/21.
 */
'use strict';
(function (global) {

    var defaultOpts = {
        React: null,
        ReactDOM: null,
        rootComponent: null,
        container: null
    };

    function getContainer(container) {
        if (typeof container === 'string') {
            return document.querySelector(container);
        }
        if (typeof container === 'function') {
            return container()
        }
        throw new Error('mySingleSpaReact passed container must be a string or function');
    }

    function bootstrap(opts) {
        return Promise.resolve();
    }

    function mount(opts, instance, props) {
        return new Promise(function (resolve, reject) {
            var element = opts.React.createElement(opts.rootComponent, props);
            instance.ref = opts.ReactDOM.render(element, getContainer(opts.container), resolve);
        });
    }

    function unmount(opts, instance, props) {
        var reactDOM = opts.ReactDOM;
        if (instance.ref) {
            reactDOM.unmountComponentAtNode(reactDOM.findDOMNode(instance.ref).parentNode);
        } else {
            reactDOM.unmountComponentAtNode(getContainer(opts.container));
        }

        return Promise.resolve();
    }

    global.mySingleSpaReact = function (options) {
        if (typeof options !== 'object') {
            throw new Error('mySingleSpaReact options must be a object');
        }

        let opts = Object.assign({}, defaultOpts, options);

        if (!options.React) {
            throw new Error('mySingleSpaReact must be passed a React');
        }

        if (!options.ReactDOM) {
            throw new Error('mySingleSpaReact must be passed a ReactDOM');
        }

        if (!options.rootComponent) {
            throw new Error('mySingleSpaReact must be passed a rootComponent');
        }

        if (!options.container) {
            throw new Error('mySingleSpaReact must be passed a container');
        }

        let instance = {};

        return {
            bootstrap: bootstrap.bind(null, opts, instance),
            mount: mount.bind(null, opts, instance),
            unmount: unmount.bind(null, opts, instance)
        }
    };
}(window));
