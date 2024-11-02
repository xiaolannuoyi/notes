---
title: this与作用域
---

# 概述

> **变量查找通过作用域，this查找通过调用**
>
> 作用域与this无必然联系。

# 作用域与作用域链

全局作用域

函数作用域

块级作用域

> JavaScript 是词法作用域，也就是说，`函数的作用域在函数定义的时候就决定了`

查找值

# this



* 严格模式及不同环境下（node -->global，浏览器-->window）

* 隐式绑定（this绑定到对象上）

  隐式丢失

  * 使用另一个变量来给函数取别名
  * 将函数作为参数传递时会被隐式赋值，回调函数丢失this绑定

* 显示绑定（apply，call，bind）

* new构造函数

>`this` 永远指向最后调用它的那个对象 
>
>匿名函数的`this`永远指向`window`
>
>使用`.call()`或者`.apply()`的函数是会直接执行的，`bind()`是创建一个新的函数，需要手动调用才会执行
>
>如果`call、apply、bind`接收到的第一个参数是空或者`null、undefined`的话，则会忽略这个参数
>
>`forEach、map、filter`函数的第二个参数也是能显式绑定`this`的

* 箭头函数 (无this，需查找作用域链)

>* 它里面的`this`是由外层作用域来决定的，且指向函数定义时的`this`而非执行时
>* 字面量创建的对象，作用域是`window`，如果里面有箭头函数属性的话，`this`指向的是`window`
>* 构造函数创建的对象，作用域是可以理解为是这个构造函数，且这个构造函数的`this`是指向新建的对象的，因此`this`指向这个对象。
>* 箭头函数的`this`是无法通过`bind、call、apply`来**直接**修改，但是可以通过改变作用域中`this`的指向来间接修改。
>
>⚠️箭头函数，避免在`对象、原型、构造函数、回调函数`中使用（this）。
>
>



## this总结

>`this ` `运行时绑定`。this`的上下文基于`函数调用`的情况。和函数在哪定义无关，而和函数怎么调用有关。
>
>`fun(),匿名函数，全局函数setTimeout等 —— window`
>
>`obj.fun() —— obj`
>
>`fun.call(obj)/apply、bind——obj`
>
>`构造函数 —— 实例` 
>
>特例`箭头函数  —— 外层作用域，call/apply/bind无效`

# setTimeout

> setTimeout 调用为window，this指向window，变量查找时 正常函数调用时沿着定义时的作用域向上查找的。



# [练习及参考](https://juejin.im/post/5e6358256fb9a07cd80f2e70#heading-9)

