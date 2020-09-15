---
title: vue3源码学习 —— computed
date: 2020-08-17
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - vue
 - vue3
 - csdn
prev: ./vue3源码学习—响应式reactive
next: false
---

> `computed`是在上篇文章的基础上实现的，请先看[vue3源码学习——响应式reactive](./vue3源码学习——响应式reactive)



# vue3源码学习——computed

## 基础

基本html代码

```html
    <h1>打开控制台，进行调试</h1>
    <h2></h2>
    <button onclick="change()">Click me</button>

    <script src="./reactive.js"></script>
    <script src="./effect.js"></script>
    <script src="./computed.js"></script>
    <script>

         // 1. 响应式数据
        const data = reactive({ count: 1 });
        // 2. 计算属性
        const double = computed(() => {
            return data.count * 2
        });
        // 3. 依赖收集
        effect(() => {
            console.warn("effect");
            document.getElementsByTagName('h2')[0].innerText = double.value//double.value会触发
        });
        // 4. 触发上面的effect重新执行
        const change = () => {
            data.count++;
        };
    </script>
```



> `computed`其实也就相当于在执行一个函数，并进行监听，前面已经写了`effect`,现在只需要两者进行关联即可。

```js
//computed.js

function computed(fn){
    //lazy 不会立即执行
    const runner = effect(fn,{
        lazy:true
    })
    return {
        get value(){
            return runner()
        },
    }
}
```

> 先进行关联，关联时不会立即执行。在get时，执行。
>
> 所以关联时，要返回一个已经关联的方法。

```js
//effect.js
//原来的
function effect(fn) {
    try {
        effectFn = fn;
        fn();
    } finally {
        effectFn = null;
    }
}
```



## 修改effect 函数

```js
//添加options 参数
//lazy为true 时，不执行。

function effect(fn,options) {
    
  let effect = createReactiveEffect(fn)//①要返回一个方法②将fn进行缓存
  if (!options.lazy) {
    effect();
  }
   return effect
}
```

>`let effect = createReactiveEffect(fn)//①要返回一个方法②将fn进行缓存`

```js
function createReactiveEffect(fn) {
    const bbeffect = function(){
        try{
            effectFn = bbeffect;
            return fn();
        }finally{
            effectFn = null
        }
    }
    return bbeffect
}

```

>bbEffect是一个闭包函数，闭包函数的作用
>一个是前面提到的可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。
>这里是将`bbeffect,fn`始终保存在内存中

将fn缓存并运行，运行完后，将其清除。

唯一的差别就是运行函数的结果要返回。否则没有返回值就是undefined。



执行过程。

![WX20200819-163949@2x](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200819-163949@2x.png)

> ①当执行到
>
> ```js
> const  = computed(() => {
>     console.warn('computed')
>     return data.count * 2;
> });
> ```
>
> runner = bbEffect闭包函数（`bbEffect、fn`存放在内存中）
>
> 等待get时，运行。
>
> `为了方便描述，这里的fn命名为fn1，下面的为fn2`
>
> ②当执行到
>
> ```js
> effect(() => {
>     console.warn("effect");
>     document.getElementsByTagName('h2')[0].innerText = double.value//double.value会触发
> });
> ```
>
> * 存储成闭包函数，并执行。
> * effectFn缓存当前闭包（fn2），并执行fn2。
>   * double.value 触发computed 的get函数，执行runner。
>   * effectFn缓存runner（fn1）闭包，并执行fn1。  ⚠️此时effectFn（fn2）被覆盖了
>   * data.count 触发reactive 的get`（执行track，将effectFn（此时是fn1的闭包）保存到targetMap中与count进行关联。）`
>   * effectFn=null
> * effectFn=null ⚠️ 即使effectFn（fn2）没有被覆盖，他也没有进行进行关联（track）



## 解决问题

* 用栈和变量解决覆盖问题。

  （`effectFn ——> effectStack`）

  （`activeEffect`——当前依赖）

  ```js
  //收集依赖
  ...
  //get 时 收集依赖
  function track(target, type, key) {
     
      if (activeEffect) {
          ...
          // 放入依赖 effect就是依赖
          if (!dep.has(activeEffect)) {
              console.log('无effect，并放入effect')
              dep.add(activeEffect)
          }
      }
  }
  //set 时更新
  ...
  //临时存放 effect中的fn参数
  let effectStack = [];
  let activeEffect；
  //响应式副作用
  ...
  function createReactiveEffect(fn) {
      const bbeffect = function(){
          try {
              effectStack.push(bbeffect);
              activeEffect = bbeffect
              return fn();
          } finally {
              effectStack.pop();
              activeEffect = effectStack[effectStack.length - 1]
          }
      }
      return bbeffect
  }
  
  ```

  

* 使用双向绑定依赖

  ```js
  function createReactiveEffect(fn) {
      const bbeffect = function(){
          ...
      }
      bbeffect.deps=[];//存放依赖
      return bbeffect
  }
  
  function track(target, type, key) {
     
      if (activeEffect) {
          ...
          // 放入依赖 effect就是依赖
          if (!dep.has(activeEffect)) {
              console.log('无effect，并放入effect')
              dep.add(activeEffect)
              activeEffect.deps.push(dep) //放入依赖，形成双向依赖
          }
      }
  }
  
  ```

  

  当执行完computed的get函数时，执行完runner后，activeEffect对应fn2，应将其存入依赖。

  

  ```js
  const computed={
    get value() {
      let value = runner();
      //手动添加依赖
      for (let i = 0; i < runner.deps.length; i++) {
        const dep = runner.deps[i];
        dep.add(activeEffect);
      }
  
      return value;
    },
  }
  ```

  此时依赖存放完后的target是

  

![执行后targetMap](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/执行后targetMap.png)

![WX20200819-174857@2x](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200819-174857@2x.png)