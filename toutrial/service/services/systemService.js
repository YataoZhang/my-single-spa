/**
 * @file
 * Created by zhangyatao on 2019/10/22.
 */
'use strict';
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, global.globalService = factory());
}(this, function () {
    'use strict';

    let context = {
        id: 'system-service-toutrial',
        container: null,
        width: 100,
    };

    return {
        bootstrap: function (props) {
            if (!document.querySelector('#' + context.id)) {
                var div = document.createElement('div');
                div.id = context.id;
                document.body.appendChild(div);
                context.container = div;
            }
            return Promise.resolve();
        },
        mount: function (props) {
            context.container.innerHTML += '<strong>我来自系统服务：我是系统服务，我对任何人开放</strong><br><button>我会自动变长哦</button>';

            return Promise.resolve();
        },
        unmount: function (props) {
            document.getElementById('app').innerHTML = '';
            context.container.innerHTML = '';
            return Promise.resolve();
        },
        update: function (props) {
            // 可以在这里做一些内部状态的更新
            context.container.querySelector('button').style.width = (context.width += 10) + 'px';
            return Promise.resolve();
        }
    };
}));
