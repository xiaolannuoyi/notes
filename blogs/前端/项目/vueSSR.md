---
title: 根据官网例子一步步实现vueSSR(详细)
date: 2019-07-12
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - 项目
 - vue
 - csdn
---

根据 [官网例子](https://ssr.vuejs.org/zh/guide/)一步步实现vue ssr
标题对应官网标题

# 基本用法
1. 新建一个文件夹 ssr
`cd ssr`
`npm init -y`
`npm install vue vue-server-renderer express --save` 或者`yarn add vue vue-server-renderer  express --save`

2. 新建文件server.js
server.js
```js
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello World</div>`
})
// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()
// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
})
// 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
renderer.renderToString(app).then(html => {
  console.log(html)
}).catch(err => {
  console.error(err)
})
```
运行命令`node server.js`,控制台会输出两行`<div data-server-rendered="true">Hello World</div>`

3. 修改server.js
```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
        <meta charset="utf-8">
        <title>vue ssr</title>
        </head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080,()=>{
    console.log('已监听 localhost:8080')
})
```
运行命令`node server.js`,控制台会输出`已监听 localhost:8080`
浏览器打开 localhost:8080
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190711150810894.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)

4. 使用页面模版,新建文件 index.template.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>vue ssr</title>
</head>

<body>
    <!--vue-ssr-outlet-->
</body>

</html>
```
修改server.js,并运行,结果不变.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190710175011994.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)

## 模版插值
修改 index.template.html 和 server.js ,结果不变
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ meta }}}
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>
</head>

<body>
    <!--vue-ssr-outlet-->
</body>

</html>
```
```js
const context = {
    title: 'vue ssr',
    meta: `
    <meta charset="utf-8">
    `
  }
renderer.renderToString(app,context, (err, html) => {
   ...
   res.end(html)
 })
```

# 源码结构
将server.js 拆分为app.js 和 server.js
app.js
```js
const Vue = require('vue')

module.exports = function createApp (context) {
  return new Vue({
    data: {
      url: context.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
}
```

server.js
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190710180143493.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
运行`node server.js`,结果不变.

>简单来说就是 server.js 将vue代码注入到模版html中 ,并返回
>这里是基本用法,源码在官网[Vue SSR 指南](https://ssr.vuejs.org/zh/guide/)中都有注解,先将前面弄懂在看下面。
# 使用 webpack 的源码结构(vue-cli3)
# 
另起一个项目,使用vue-cli3脚手架搭建,根据自己需求选择
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190710180840774.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190710180901268.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
项目结构( `+`是新增文件,`*`是修改文件 )
```js
.
├── README.md
├── babel.config.js
├── node_modules
│   └──...
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue 
│   ├── assets
│   ├── components
│   ├── entry-client.js  +
│   ├── entry-server.js  +
│   ├── main.js *
│   ├── router.js
│   ├── store.js
│   └── views
├── package.json  *
├── vue.config.js +
└── yarn.lock
```

>这是一个vue-cli3搭建完成后的前端项目
>
>
>`暂时先不考虑路由的问题`
>

1. main.js
main.js 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。main.js 简单地使用 export 导出一个 createApp 函数：
```js
import Vue from 'vue'
import App from './App.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app }
}
```
2. entry-client.js:
客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：
功能相当于未改动之前的main.js
```js
import { createApp } from './main'

// 客户端特定引导逻辑……

const { app } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app')
```
3. entry-server.js:
服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。
```js
import { createApp } from './main'

export default context => {
  const { app } = createApp()
  return app
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190711135853624.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
>过程简述
>entry-server.js构建后成为 vue-ssr-server-bundle.json文件(vue代码)
>server.js将  vue-ssr-server-bundle.json (vue代码)注入到模版文件中,并输出
>暂时未用到 entry-client.js

# 构建配置
安装 cross-env
安装 webpack-node-externals
安装 vue-server-renderer
`yarn add cross-env webpack-node-externals vue-server-renderer --save-dev`

vue.config.js(文件配置参考[官网 Vue SSR 指南 构建配置](https://ssr.vuejs.org/zh/guide/build-config.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE-server-config),官网里面有注解,这里就不加注解了)

>调整 webpack 配置最简单的方式就是在 vue.config.js 中的 configureWebpack 选项提供一个对象,
该对象将会被 webpack-merge 合并入最终的 webpack 配置。

```js
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
module.exports = {
    configureWebpack: () => {
        if (process.env.WEBPACK_TARGET === 'node') {
            return {
                entry: './src/entry-server.js',
                target: 'node',
                devtool: 'source-map',
                output: {
                    libraryTarget: 'commonjs2'
                },
                externals: nodeExternals({
                    whitelist: /\.css$/
                }),
                plugins: [
                    new VueSSRServerPlugin()
                ]
            }
        } else {
            return {
                entry: './src/entry-client.js',
                plugins: [
                    new VueSSRClientPlugin()
                ]
            }
        }

    },
}
```

修改package.json
```js
"scripts": {
    ...
    "build:client": "vue-cli-service build",
    "build:server": "cross-env WEBPACK_TARGET=node vue-cli-service build --mode server",
    "build:win": "npm run build:server && move dist\\vue-ssr-server-bundle.json bundle && npm run build:client && move bundle dist\\vue-ssr-server-bundle.json",
    "build:mac": "npm run build:server && mv dist/vue-ssr-server-bundle.json bundle && npm run build:client && mv bundle dist/vue-ssr-server-bundle.json"
  },
```
根据自己系统运行 `yarn run build:win` 或者`yarn run build:mac`,会在根目录下生成dist文件夹
```js
.
├── css
│   └── ...
├── favicon.ico
├── index.html
├── js
│   └── ....
├── vue-ssr-client-manifest.json
└── vue-ssr-server-bundle.json
```
## 服务端
在当前项目内 或者 新建一个文件夹 ,放置文件内容如下
```js
.
├── ...
├── dist
├── index.template.html
└── server.js
```
安装express
`yarn add express --save-dev`

index.template.html 代码在上面[代码构建](#_91)
server.js(根据上面的js略作修改,使用了createBundleRenderer,详情看[Bundle Renderer 指引](https://ssr.vuejs.org/zh/guide/bundle-renderer.html#%E4%BD%BF%E7%94%A8%E5%9F%BA%E6%9C%AC-ssr-%E7%9A%84%E9%97%AE%E9%A2%98))
```js
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const server = require('express')()
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle,{
    template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

server.get('*', (req, res) => {
  const context = {
    title: 'ssr demo',
    meta: `
    <meta charset="utf-8">
    `
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080,()=>{
    console.log('已监听 localhost:8080')
})
```
运行`node server.js`,并打开浏览器(因为还未用到router,所以home|about不可跳转路由)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190711150354873.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
# 路由和代码分割
[路由和代码分割](https://ssr.vuejs.org/zh/guide/routing.html#%E4%BD%BF%E7%94%A8-vue-router-%E7%9A%84%E8%B7%AF%E7%94%B1)
1. router.js
类似于 createApp，我们也需要给每个请求一个新的 router 实例，所以文件导出一个 createRouter 函数
```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('./views/Home.vue') },
      { path: '/about', component: () => import('./views/About.vue') }
    ]
  })
}
```

2. main.js
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190711154644301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)

3. entry-server.js
```js
import { createApp } from './main'

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app)
    }, reject)
  })
}
```

4. entry-client.js
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190711155001829.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)

5. 重新构建,`yarn run build:win` 或者`yarn run build:mac`,生成新的dist
6. index.template.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```
7. 修改server.js

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190712112243231.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
>url 会传给 entry-server.js

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190712112349593.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
>此时点击home|about,页面均是从服务端发送过来的

## 图片未加载,引入静态文件.
1. `app.use(express.static(path.resolve(__dirname, './dist')))`(全部引入,不可取)

```js
const express = require('express')
const app = express()
const { createBundleRenderer } = require('vue-server-renderer')
const path = require("path");


const template = require('fs').readFileSync('./index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')

const renderer = createBundleRenderer(serverBundle, {
  template,
})
//引入静态文件  否则运行报错
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', (req, res) => {
  const context = {
    title: 'ssr demo====',
    url: req.url
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })

})
app.listen(8080, () => {
  console.log('已监听 localhost:8080')
})
```
运行node server.js
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190712100555578.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
这里你会发现,你在服务端设置模版了(index.template.html),并设置了title为`ssr demo====`,但是他的显示不是这样,他所显示的是public文件夹下的index.html(若是删掉他,它会通过webpack配置自动生成一个index.html ,title为`Vue App`)
点击about标签,你会发现并没有发送请求.点击浏览器的刷新按钮,他才发送请求.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190712103032770.gif)

这里需要注意的是 静态文件的引入 `app.use(express.static(path.resolve(__dirname, './dist')))` 所以连dist中的index.html也一并引入了,此index.html使用了main.js ,所以点击about走的是路由而不是服务端渲染.

>测试
>在entry-client.js 加入测试
>```js
>router.onReady(() => {
>  console.log('entry-client.js');
 >   app.$mount('#app')
>})
>```
>重新打包,并运行,浏览器控制台会显示 `entry-client.js`


2. 
  * 要么将dist/index.html 删除
  * 或者将`app.use(express.static(path.resolve(__dirname, './dist')))`替换成
```js
app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
app.use('/img', express.static(path.resolve(__dirname, './dist/img')))
app.use('/css', express.static(path.resolve(__dirname, './dist/css')))
```
也就是说不引入 dist/index.html
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019071211040164.gif)
这回浏览器的标题变成了`ssr demo====`,点击about,也是从服务请求的.

# 按需服务端渲染
之前的是所有的请求都是服务端渲染`app.get('*' (req, res)`

改成只`/`服务端渲染
```js
app.get('/' (req, res) => {
...
})
```
这时,除`/`其他路由页面 会显示`Cannot GET /about`,
要想要about也展示,须使用`entry-client.js`打包生成的`vue-ssr-client-manifest.json`
```js
const clientManifest = require("./dist/vue-ssr-client-manifest.json");

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template,
  clientManifest
})
```
这时,页面还是有问题,`Internal Server Error`
须修改`vue.config.js`
```js
module.exports = {
	...
    css: {
        extract: false
      },
}
```
打包后,再次运行
现在已经达到目的.
也可以写成数据形式.
```js
app.get(['/','/about'], (req, res) => {
...
})
```

注:有的地方没有粘贴代码,而是使用的图片,主要是突出变化

未完待续...
