---
title: vue3-study
date: 2020-09-03
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - vue
 - vue3
keys:
 - 'e10adc3949ba59abbe56e057f20f883e'
---

# vue-next
## 安装

使用vite初始化vue-next

```js
$ yarn create vite-app <project-name>
$ cd <project-name>
$ yarn
$ yarn dev
```

安装`vue-router@next  vuex@next`

```js
yarn add vue-router@next vuex@next
```

```js
yarn add axios
```



vite.config.js配置

```js
const path = require("path");

module.exports = {
    // 导入别名
    // 这些条目可以是精确的请求->请求映射*（精确，无通配符语法）
    // 也可以是请求路径-> fs目录映射。 *使用目录映射时
    // 键**必须以斜杠开头和结尾**
    alias: {
        '/@/': path.resolve(__dirname, './src')
    },
  }
```

Main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import store from '/@/store'
import router from '/@/router'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')

```



router

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // route -> routes
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: 'home' */ '/@/views/home.vue'),
        },
    ],
})
export default router
```



store/index.js

```js
import { createStore } from 'vuex'

import user from "./modules/user";

export default createStore({
  modules: {
    user
  }
});
```



## 生命周期

- `beforeCreate` -> 使用 `setup()`
- `created` -> 使用 `setup()`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeDestroy` -> `onBeforeUnmount`
- `destroyed` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`

