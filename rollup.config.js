/**
 * @file
 * Created by zhangyatao on 2019/10/21.
 */
'use strict';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve'

export default {
    input: './src/my-single-spa.js',
    output: {
        file: './lib/umd/my-single-spa.js',
        format: 'umd',
        name: 'mySingleSpa',
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        }),
        process.env.SERVE ? serve({
            open: true,
            contentBase: '',
            openPage: '/toutrial/quick/index.html',
            host: 'localhost',
            port: 10001
        }) : null
    ]
}
