---
title: vue3源码学习 —— 响应式reactive
date: 2020-08-13
sidebar: 'auto'
sidebarDepth: 3
categories:
 - 前端
tags:
 - vue
 - vue3
 - csdn
prev: false
next: ./vue3源码学习—computed
---

# 拦截

## 基础版

原理

> 如何监听数据变化的？
>
> Proxy、Reflect

```js
function reactive(target) {
    return new Proxy(target, handle)
}
const handle = { get, set };

function get(target, propKey, receiver) {
    // console.log('get');
    // return target[propKey]
    return Reflect.get(target, propKey, receiver)
}
function set(target, propKey, value, receiver) {
    // console.log('set')
    // return target[propKey] = value
    return Reflect.set(target, propKey, value, receiver)
}
```

测试

```js
let obj = reactive({a:1});
console.log(obj.a)//触发get方法
obj.a = 2//触发set方法
```



## 避免对象重复proxy

测试代码

```js
let obj = {
  a: '111'
}
//同一个对象，返回同一个proxy
let rec1 = reactive(obj)
let rec2 = reactive(obj)

console.warn(rec1 == rec2)//false
```

修改

```js
//WeakMap 的key 必须是对象

// objectList 避免对象重复proxy
const objectList = new WeakMap()//key: target, value: proxy

function reactive(target) {
    let proxy = objectList.get(target);
    //如果存在，即返回
    if (proxy !== void 0) {
        return proxy
    }

    proxy = new Proxy(target, handle)
    objectList.set(target, proxy)
    
    return proxy
}
...
```

修改后测试

```js
console.warn(rec1 == rec2)//true
```



## 避免proxy对象再次被proxy

测试

```js
let rec1 = reactive(obj)
let rec2 = reactive(rec1)

console.log(rec1 == rec2) //false
```

修改

```js
// objectList 避免对象重复proxy
const objectList = new WeakMap()//key: target, value: proxy

// proxyList 避免proxy对象再次被proxy
const proxyList = new WeakMap()//key: proxy, value: target

function reactive(target) {
    let proxy = objectList.get(target);
    //如果存在，即返回
    if (proxy !== void 0) {
        return proxy
    }
    // 如果target是proxy
    if(proxyList.has(target)){
        return target
    }

    proxy = new Proxy(target, handle)
    objectList.set(target, proxy)
    proxyList.set(proxy,target)

    return proxy

}
...
```

修改后测试

```js
console.warn(rec1 == rec2)//true
```

## 对象中对象

测试

```js
let obj = {
  a: '111',
  b: [1, 2, 3],
  c: {
    d: {
      e: '123'
    }
  }
}
let rec1 = reactive(obj)

rec1.a = 1;//set
rec1.b.push(4)//get
rec1.c.d.e='===='//get
```

> 数组和对象的改变没有触发set

修改

```js
function get(target, propKey, receiver) {
    console.log('get')
    let proxy = Reflect.get(target, propKey, receiver)
    return isObject(proxy) ? reactive(proxy) : proxy;
    //实现多层代理，若为对象，需要递归
}
function isObject(val) {
    return typeof val === 'object' && val !== null;
}
```

修改后测试

```js
rec1.b.push(4)
// get  [ get(obj,'b') ]
// get  [ get(obj.b,'push') ]
// get  [ get(obj.b,'length') ]
// set  [ set(obj.b, 3) ]
// set  [ set(obj.b,'length') ]

rec1.c.d.e='===='
// get
// get
// set
```

上述文件存放于`reactive.js`

# 监听

> 监听数据变化
>
> 当获取数据时（get）,要收集——track方法
>
> 当更新数据时（set）,要在收集里找到并更新到页面——trigger方法



## 监听函数

> 首先我们先写一个监听函数，一旦数据发生变化，便执行此方法。

测试代码

```js
let obj = {
  a: '111',
}
let rec1 = reactive(obj);
// effect方法：响应式副作用，默认先执行一次，依赖数据变了再执行
// 相当于一个监听函数
effect(()=>{
  console.log('监听函数',rec1.a);
})

```



>执行过程 ： effect->fn->get->track ，
>
>track时要将fn方法收集
>
>但是，track和effect是两个方法，effect中的fn如何在track时，存入到`targetMap`？
>
>思路：
>
>`effect`在调用时，会立即触发(调用)一次。
>
>触发时，将fn存入到一个临时变量中缓存，在track时，将其取出。

代码

```js
// reactive.js
function get(target, propKey, receiver) {
    // console.log('get')

    track(target, 'get', propKey)

    return Reflect.get(target, propKey, receiver)
}
```

```js
// effect.js

let targetMap = new WeakMap()//所有依赖 key:obj

//get 时 收集依赖
function track(target, type, key) {
    console.log('track-收集依赖', type, target, key)

    let depsMap = targetMap.get(target);
    //targetMap无target对象，则新建
    if (depsMap === void 0) {
        console.log('无depsMap')
        targetMap.set(target, (depsMap = new Map()))
    }
    //depsMap无有key这个属性，则新建
    let dep = depsMap.get(key)
    if (dep === void 0) {
        console.log('无key')
        depsMap.set(key, (dep = new Set()))
    }
    // 放入依赖
    if (!dep.has(effectFn)) {
        console.log('无effect，并放入effect')
        dep.add(effectFn)
    }
}


//临时存放 effect中的fn参数
let  effectFn = null;

function effect(fn){
    effectFn=fn;
    fn();
}
```

代码执行过程

```js
effect(()=>{
  console.log('监听函数1',rec1.a)
})
effect(()=>{
  console.log('监听函数2',rec1.a)
})
//执行过程 ： effect->fn->get->track
当执行完track时，依赖 `effect中的fn`已经放入`targetMap`对应位置

targetMap:{     //WeakMap
  key: {a:'111'},//对象
  value:{        //Map
    key：'a',
    value：{
      0: ()=>{ console.log('监听函数1',rec1.a) }
      1: ()=>{ console.log('监听函数2',rec1.a) }
      //如果有多个effect，此处会存放多个方法。
    }//Set
  }
}
```

 问题

> effectFn 临时变量，当track时，放入`targetMap`中后，effectFn就没有用了，应该置空。
>
> 如果不置空，会产生的问题，当在`effect`后`get`时，get->track ,时，会将`effectFn`放入`targetMap`的`b`中
>
> ```js
> //使用测试
> let obj = {
>   a: '111',
>   b: 'bbb'
> }
> let rec1 = reactive(obj);
> 
> effect(() => {
>   console.log('监听函数1', rec1.a)
> })
> effect(() => {
>   console.log('监听函数2', rec1.a)
> })
> 
> console.log('普通get时', rec1.b)
> 
> ```
>
> 所以，
>
> 1. track时，有`effectFn`,才通过`targetMap`建立依赖关系。
> 2. 及时清除`effectFn 临时变量`

```js
function track(target, type, key) {
    console.log('track-收集依赖', type, target, key)

    if (effectFn) {
        ...
        // 放入依赖 effect就是依赖
        if (!dep.has(effectFn)) {
            dep.add(effectFn)
            effectFn = null//这是一种方式
        }
    }
}

//或者
//比上面 effectFn = null 要好一些
//防止由于报错而不继续执行
function effect(fn) {
    try {
        effectFn = fn;
        fn();
    } finally {
        effectFn = null;
    }
}

```



## set时，触发依赖中的方法。

测试代码

```js
effect(()=>{
  console.log('监听函数',rec1.a)
})
rec1.a='222';
```

代码

```js
// reactive.js
function set(target, propKey, value, receiver) {
    let proxy = Reflect.set(target, propKey, value, receiver)
    trigger(target, 'set', propKey)//trigger 之前要set，否则执行监听中方法，获取的值是变化前的数据。
    return proxy
}
```



```js
// effect.js
function trigger(target, type, key) {
    console.log('trigger-触发依赖', type)

    let depsMap = targetMap.get(target)

    if (depsMap) {
        let deps = depsMap.get(key)
        if (deps) {
            //将当前key对应的effect一次执行
            deps.forEach(effect => {
                effect()
            })
        }
    }
}
```

完善

> 当是 数组发生变化时，会触发多次set。
>
> ```js
> function set(target, propKey, value, receiver) {
>     const oldvalue = target[propKey];
> 
>     let proxy = Reflect.set(target, propKey, value, receiver)
>     // 当是新增的属性 或者 数据变化时 ,trigger
>     if (!target.hasOwnProperty(propKey)) {
>         trigger(target, 'add', propKey)
>     } else if (oldvalue !== value) {
>         trigger(target, 'set', propKey)
>     }
>     return proxy
> }
> ```

## 删除补充完整

```js
// reactive.js
function deleteProperty(target, propKey) {
    console.log('删除')
    let proxy = Reflect.deleteProperty(target, propKey)
    trigger(target, 'delete', propKey)
    return proxy
}
//effect.js

function trigger(target, type, key) {
    console.log('trigger-触发依赖', type,key)

    let depsMap = targetMap.get(target)

    if (depsMap) {
        let deps = depsMap.get(key)
        if (deps) {
            //将当前key对应的effect一次执行
            deps.forEach(effect => {
                effect()
            })
            // 删除
            if(type == 'delete'){
                console.log('delete')
                depsMap.delete(key)
            }
        }
        
    }
}
```



# 完整代码

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>打开控制台，进行调试</h1>
    <h2></h2>
    <button onclick="change()">Click me</button>
    <script src="./reactive.js"></script>
    <script src="./effect.js"></script>
    <script>

        //使用测试
        let obj = {
            a: '111',
            b: 'bbb',
            c: [1,2,3]
        }
        let rec1 = reactive(obj);
        effect(() => {
            document.getElementsByTagName('h2')[0].innerText = rec1.a
        })
        function change(){
            console.log('change')
            rec1.a = Math.random()
        }

    </script>
</body>

</html>
```



```js
// reactive.js
//WeakMap 的key 必须是对象

// objectList 避免对象重复proxy
const objectList = new WeakMap()//key: target, value: proxy

// proxyList 避免proxy对象再次被proxy
const proxyList = new WeakMap()//key: proxy, value: target

function reactive(target) {
    let proxy = objectList.get(target);
    //如果存在，即返回
    if (proxy !== void 0) {
        return proxy
    }
    // 如果target是proxy
    if (proxyList.has(target)) {
        return target
    }
    // 如果是基本类型，直接返回
    if (!isObject(target)) {
        return target
    }
    proxy = new Proxy(target, handle)
    objectList.set(target, proxy)
    proxyList.set(proxy, target)

    return proxy;

}
const handle = { get, set, deleteProperty };

function get(target, propKey, receiver) {
    console.log('get')
    let proxy = Reflect.get(target, propKey, receiver);
    track(target, 'get', propKey)
    return isObject(proxy) ? reactive(proxy) : proxy;
    //实现多层代理，若为对象，需要递归
}
function set(target, propKey, value, receiver) {
    const oldvalue = target[propKey];

    let proxy = Reflect.set(target, propKey, value, receiver)
    // 当是新增的属性 或者 数据变化时 ,trigger
    if (!target.hasOwnProperty(propKey)) {
        trigger(target, 'add', propKey)
    } else if (oldvalue !== value) {
        trigger(target, 'set', propKey)
    }
    return proxy
}
function deleteProperty(target, propKey) {
    console.log('删除')
    let proxy = Reflect.deleteProperty(target, propKey)
    trigger(target, 'delete', propKey)
    return proxy
}

//方法
function isObject(val) {
    return typeof val === 'object' && val !== null;
}

```



```js
//effect.js

//收集依赖
let targetMap = new WeakMap()//所有依赖 key:obj


//get 时 收集依赖
function track(target, type, key) {
    console.log('track-收集依赖', type, target, key)

    if (effectFn) {
        let depsMap = targetMap.get(target);
        //targetMap无target对象，则新建
        if (depsMap === void 0) {
            console.log('无depsMap')
            targetMap.set(target, (depsMap = new Map()))
        }
        //depsMap无有key这个属性，则新建
        let dep = depsMap.get(key)
        if (dep === void 0) {
            console.log('无key')
            depsMap.set(key, (dep = new Set()))
        }
        // 放入依赖 effect就是依赖
        if (!dep.has(effectFn)) {
            console.log('无effect，并放入effect')
            dep.add(effectFn)
        }
    }
}

//set 时更新
function trigger(target, type, key) {
    console.log('trigger-触发依赖', type,key)

    let depsMap = targetMap.get(target)

    if (depsMap) {
        let deps = depsMap.get(key)
        if (deps) {
            //将当前key对应的effect一次执行
            deps.forEach(effect => {
                effect()
            })
            // 删除
            if(type == 'delete'){
                console.log('delete')
                depsMap.delete(key)
            }
        }
        
    }
}
//临时存放 effect中的fn参数
let effectFn = null;

function effect(fn) {
    try {
        console.log('try')
        effectFn = fn;
        fn();
    } finally {
        console.log('finally')
        effectFn = null;
    }
}

```

