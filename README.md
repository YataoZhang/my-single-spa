# 简单的微前端框架

![demo](https://github.com/yataoZhang/my-single-spa/raw/master/demo.gif)

## 具体实现思路
[手把手带你写微前端框架](https://github.com/YataoZhang/my-single-spa/issues/4)

## 前提
```shell
$ npm i
```

## 快速开始
```shell
$ npm run watch
```
然后在浏览器中访问： http://localhost:10001/toutrial/quick/index.html

当前已支持：
1. 简单的快速上手
2. systemjs
3. Vuejs

## 开发模式
```shell
$ npm run build:dev
```

## ecosystem

仅支持两种：

1. [vue](https://github.com/YataoZhang/my-single-spa/blob/master/ecosystem/my-single-spa-vue.js)
2. [React](https://github.com/YataoZhang/my-single-spa/blob/master/ecosystem/my-single-spa-react.js)


## 待续
1. 支持Vue、React混合部署（未完成）
2. 除目前支持的路由级别的app隔离外，还支持功能（Feature）级隔离（已完成）
