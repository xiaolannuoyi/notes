---
title: el-popover弹出框,不放在body中
date: 2020-04-07
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - elementUI
 - csdn
---

# 1. 不放在body中
`el-popover`默认将弹窗放到body中，但是在此项目中，当`el-popover`的高度超出了父级div的宽度时，会造成body的滚动，而不是其父级的滚动。

所以要将`el-popover`放入到父级div中

```html
<el-popover
    class="add-step-popover"
    ref="add-step-popover"
    placement="bottom"
    width="212"
    trigger="click"
    @show="show"
    :append-to-body="false"
    :popper-options="{
      positionFixed: true
    }"
  >
  </el-popover>
```
[github-issue](https://github.com/ElemeFE/element/issues/8981)

* 根据项目需求，要注意`z-index`的使用

原来

```html
<div style="position: relative;z-index:1" >
   <el-popover ...>
     <span style="position: absolute;z-index:2" slot="reference">+</span>
   </el-popover>
</div>

```

<img src="https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/20200402164604.png" style="zoom:50%;" />

解决

```html
<el-popover ...>
  <div style="position: relative;z-index:1"  >
    <span style="position: absolute;z-index:2" >+</span>
  </div>
</el-popover>
```