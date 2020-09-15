---
title: 滚动到指定位置
date: 2020-09-14
sidebar: 'auto'
categories:
 - 前端
tags:
 - vue
 - csdn
---


```js
<div class="box1">
  <div v-for="i in 50" :key="'a' + i" :ref="'a' + i">{{ i }}</div>
</div>
```

> ⚠️ refs 当与v-for使用时，要加[0]

## 1.Element.scrollIntoView

[MDN scrollIntoView](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)

```js
scroll(pos) {
  // 不受定位影响 ，但是水平及垂直方向无法自定义数值，只能 "start", "center", "end", 或 "nearest"之一
  //document.getElementById("idName").scrollIntoView();
  //或者
  // document.querySelector("#idName").scrollIntoView();
  this.$refs[pos][0].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest"
  });
}
```

## 2.window.scrollTo

[MDN scrollTo](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollTo)

```js
scroll(pos) {
  window.scrollTo({
    //滚动到元素位置
    //top: this.$refs[pos][0].offsetTop,//offsetTop 相对于offsetparent 定位,当有定位时，不准确。
    top: this.$refs[pos][0].getBoundingClientRect().top + window.scrollY,//推荐使用。getBoundingClientRect 相对于当前视口的位置
    //top: 400//滚动到指定距离
    //top: 0,//滚动到顶部
    //top: document.documentElement.scrollHeight,//滚动到底部
    behavior: "smooth" // 平滑滚动
  });
}
```

[MDN getBoundingClientRect](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)

[MDN offsetTop](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetTop)