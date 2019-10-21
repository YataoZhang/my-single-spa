/**
 * @file
 * Created by zhangyatao on 2019/10/21.
 */
'use strict';

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, global.app2 = factory());
}(this, function () {
    'use strict';
    return {
        container: null,
        bootstrap: async (props) => {
            this.container = document.getElementById('app');
            this.container.innerHTML = 'bootstrapping'
        },
        mount: async (props) => {
            this.container.innerHTML = 'hello my-single-spa; <br> this content made for app2!';
        },
        unmount: async (props) => {
            this.container.innerHTML = '';
        },
        unload: async (props) => {
            delete this.container;
        }
    };
}));
