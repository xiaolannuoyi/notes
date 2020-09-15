---
title: axios 封装及使用
date: 2020-04-10
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - vue
 - axios
 - csdn
---

# axios 封装使用

## 判断是否为`Promise`

`Axios.get() instanceof Promise`返回值是`true`

所以在封装axios时，不要在写成以下方式了

```js
getuser(params) {
    return new Promise((resolve, reject) => {
      axios
        .post("/user", {
          ...params
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          resolve(error);
        });
    });
  }
```



直接这样写就可以，没必要写一些冗余代码

```js
getuser(params) {
  return axios.post("/user", {...params})
}
```

## 项目封装

多axios实例项目

```js
import { interceptorsResponseS, interceptorsResponseE } from "./axios-config";
import axios from "axios";
import { devopsIP } from "../../static/http.js";
import qs from "qs";

//axios 实例
const service = axios.create({
  baseURL: "http://" + devopsIP
});

// 添加响应拦截器
service.interceptors.response.use(interceptorsResponseS, interceptorsResponseE);

class serviceManger {
  getuser(params) {
    return axios.post("/user", {...params})
  }
  ...
}
export default new serviceManger();
```

main.js全局引入

```js
import serviceManger from "@/server/index.js";
Vue.prototype.$serviceManger = serviceManger; // 其中$xx为新命的名。全局引入
```

使用时，调用

```js
this.$serviceManger.geruser(params).then((data)=>{
  ...
})
```



> axios的实例拦截器配置不会继承axios全局的拦截器
>
> 也就是说axios的service实例的拦截器配置时单独服务的，不会被全局拦截器影响。

## 拦截器

拦截器根据项目，有多种配置

```js
import { Message } from "element-ui";

//响应拦截的两个方法
export function interceptorsResponseS(response) {
  // 对响应数据做点什么
  const res = response.data;
  if (res.code !== "0") {
    Message({
      type: "error",
      message: res.msg,
      duration: 5 * 1000
    });
  } else {
    return response.data;
  }
}
export function interceptorsResponseE(error) {
  // 对响应错误做点什么
  Message({
    type: "error",
    message: error.message,
    duration: 5 * 1000
  });
}
```

