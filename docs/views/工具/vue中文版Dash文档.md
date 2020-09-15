---
title: vue中文版Dash文档
date: 2019-12-03
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 工具
tags:
 - 工具
 - csdn
---

# 准备

`node`环境 

`homebrew`[homebrew地址]https://brew.sh/index_zh-cn

`brew install wget`

`wget --mirror -p --convert-links -P [本地路径] [要扒的网址]`

# 开始 

新建一个目录,用来存放本项目,并用vscode打开.

初始化项目

`npm init`

修改`packgae.json`

```js
{
  "name": "DashDocument",
  "version": "1.0.0",
  "description": "",
  "main": "build.js",
  "scripts": {
    "build": "node build-vue.js",
  },
  "dependencies": {
    "cheerio": "^0.22.0",
    "sqlite-sync": "^0.3.8",
    "sync-exec": "^0.6.2"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```



新建文件夹`Documents`,到此目录下,爬取网页

![](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/截屏2019-12-0311.31.47.png)

```
wget --mirror -p --convert-links -P ./ https://cn.vuejs.org 
```

爬取成功后,会在`Documents`生成一个`cn.vuejs.org `的文件夹

在根目录下,创建`buld-vue.js`(所有创建的过程都放在这里了)[build-vue.js](https://github.com/xiaolannuoyi/DashDocument/blob/master/build-vue.js)

`npm install`

`npm run build`

会在`docset`下生成一个`VueJS.docset`,将其导入到`Dash`中

# 导入

![](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/截屏2019-12-0311.46.24.png)



![](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/截屏2019-12-0311.47.49.png)



![](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/截屏2019-12-0311.56.47.png)

参考文章

[使用NodeJS 生成Vue中文版 docSet 离线文档](https://juejin.im/post/5c34a8fb6fb9a049f23cef68)

[kapeli.com/docsets官方制作教程](https://kapeli.com/docsets#dashDocset)



