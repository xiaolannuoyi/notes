---
title: vue-cli3图片路径
date: 2019-08-14
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - 项目
 - vue
 - csdn
---

# 引入图片的方式
>图片路径用  ******* 代替
```html
  <template>
    <div>
      1.<img src="*******" alt="">
      2.<img :src="img" alt="">
      3. <div class="box imgurl"></div>
      4. <div class="box" style="background: url(*******);"></div>
    </div>
  </template>

  <script>
  export default {
    data(){
      return {
        img:`*******`
      }
    }
  }
  </script>

  <style scoped>
  .box{
    height: 200px;
    width: 200px;
    display: inline-block;
  }
  .imgurl{
  background: url(*******);
  }
  </style>
```

# 项目目录
```
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── static
│       └──  logo.png   图片
├── src
│   ├── App.vue
│   ├── assets
│   │  └── logo.png     图片
│   └── views
│       ├── Home.vue
│       └── practice-center
│           └── test
│               └── index.vue   测试
└── yarn.lock
```
vue.config.js配置
```js
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? '/my-vue-admin/' : "/"
};
```
# public/static  `绝对路径`引用
## 1. 使用相对路径`static/logo.png` 

* 本地测试  , 部署测试 , 1、2、4 好使，3 不好使（会报错,测试须将其注释掉）。
---
## 2. 使用绝对路径`/static/logo.png`
* 本地测试 ，均好使。
* 部署测试 
  +  根目录下,均好使;
  + 非根目录下,均不好使;
  + 非根目录下,须这样使用
	```js
	data () {
	  return {
	    publicPath: process.env.BASE_URL
	  }
	}
	```
	然后：
	
	```html
	<img :src="`${publicPath}my-image.png`">
	```

## 何时使用 public 文件夹

>你需要在构建输出中指定一个文件的名字。
你有上千个图片，需要动态引用它们的路径。
有些库可能和 webpack 不兼容，这时你除了将其用一个独立的 `<script>`标签引入没有别的选择。




# src/assets `相对路径`引用

## 1.  相对路径 `../../../assets/logo.png` 
* 本地测试,部署测试 1,3 好使
* 2 、4修改成

	```html
	<template>
	  <div>
	    2.<img :src="img" alt="">
	    4. <div class="box" :style="{background: 'url(' + img + ')' }"></div>
	  </div>
	</template>
	
	<script>
	import imgurl from '../../../assets/logo.png'
	export default {
	  data(){
	    return {
	      img:imgurl
	    }
	  }
	}
	</script>
	```
	或者
	```js
	data(){
	    return {
	      img:require('../../../assets/logo.png')
	    }
	  }
    ```

---
## 2. 相对路径 `@/assets/logo.png` 或者`~@/assets/logo.png` 

```js
//vue.config.js
module.exports = {
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"));
    },
};
```
* 1、3 只能使用`~@/assets/logo.png` 
* 2、4 只能使用`@/assets/logo.png` 
```html
<template>
  <div>
    1.<img src="~@/assets/logo.png" alt="">
    2.<img :src="img" alt="">
    3. <div class="box imgurl"></div>
    4. <div class="box" :style="{background: 'url(' + img + ')' }"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      img:require('@/assets/logo.png')
    }
  }
}
</script>

<style scoped>
.box{
  height: 200px;
  width: 200px;
  display: inline-block;
}
.imgurl{
 background: url('~@/assets/logo.png');
}
</style>
```

vue推荐使用功能`assets`


	

 