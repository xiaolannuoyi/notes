---
title: 微前端qiankun入门-vue
date: 2020-09-23
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - 项目
 - csdn
---



## qiankuan

👉[qiankun介绍](https://qiankun.umijs.org/zh/guide)

##  搭建vue项目

用脚手架搭建两个项目，主应用（main）和子应用（one）

> 我用的是最新的脚手架4.5.6
>
> vue版本是3.x（版本不会影响qiankun的演示）
>
> 内部主要安装了`router`、`vuex`



<img src="https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200923-155128.png" alt="WX20200923-155128" style="zoom:50%;" />

## 主应用配置

### 基本修改

> App.vue 子应用放置的位置的`id` 下面会用到。和子应用跳转的路由`/one`

<img src="https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20200923162517785.png" alt="image-20200923162517785" style="zoom:50%;" />



### 安装qiankun

```powershell
yarn add qiankun # 或者 npm i qiankun -S
```

### 修改main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
// 👆未做改动，👇是新增
// 微应用
import { registerMicroApps, start } from 'qiankun';
registerMicroApps([
  {
    name: 'one',//子应用名称
    entry: "//localhost:3333", //子应用启动端口
    container: '#MicroApplication',//子应用 展示位置 id
    activeRule: '/one',//子应用路由
  }
]);
start();
```



## 子应用配置

### App.vue

删除App.vue中关于`#app`的样式

### main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

function render(props = {}) {
    const { container } = props;
    createApp(App).use(store).use(router).mount(
        container ? container.querySelector("#app") : "#app"
    )
}

// 作为子应用运行
if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

// 生命周期
export async function bootstrap() {
    console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
    console.log('[vue] props from main framework', props);
    render(props);
}
export async function unmount() {
    console.log('[vue] unmount');
    //vue 注销
}
```

### router/index.js

```js
const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? "/one" : "/"),
  routes
})
```

### vue.config.js

```js
module.exports = {
    devServer: {
        port: 3333,//与主应用中 配置名称一致。对应->entry的端口
        headers:{
            "Access-Control-Allow-Origin":'*'
        }
    }
}
```

## 运行

![WX20200923-214212@2x](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200923-214212@2x.png)

 主应用运行

<img src="https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/2020-09-23 21-46-03.2020-09-23 21_46_38.gif" alt="" style="zoom:50%;" />

子应用运行

<img src="https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/2020-09-23 21-44-08.2020-09-23 21_45_37.gif" alt="" style="zoom:50%;" />


##  nginx部署

两个项目分别打包。

micro.conf

```

    server {
      listen	8000;
      server_name localhost;
      
      location / {
        root  /Users/liujinyuan/code/other/micro-demo/main/dist ;
        index index.html;
        
        try_files $uri $uri/ /index.html;
      }
    }
     server {
      listen	3333;
      server_name localhost;
      
      # 配置跨域访问，此处是通配符，严格生产环境的话可以指定为主应用 192.168.2.192:8000
      add_header Access-Control-Allow-Origin *;
      add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
      add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
      
      location / {
        root  /Users/liujinyuan/code/other/micro-demo/one/dist ;
        index index.html;
        
        try_files $uri $uri/ /index.html;
      }
    }
```

