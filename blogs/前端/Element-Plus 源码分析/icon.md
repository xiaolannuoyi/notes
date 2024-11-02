---
title: icon
date: 2021-06-30
sidebar: 'auto'
sidebarDepth: 2
categories:
 - Element-Plus 源码分析
tags:
 - Element-Plus 源码分析
---

[toc]

# icon

```html
<el-icon name="edit" />
<!-- 相当于 -->
<i class="el-icon-edit"></i>
```

# el-icon-loading

```css
.el-icon-loading {
    animation: rotating 2s linear infinite;
}
```

```css
// 顺时针
@keyframes rotating {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

```

此动画可主动添加到其他图标中，使其动起来。

> `<el-icon name="refresh-right" class="el-icon-loading" />`

