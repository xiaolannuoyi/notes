---
title: switch
date: 2021-04-14
sidebar: 'auto'
sidebarDepth: 2
categories:
 - Element-Plus 源码分析
tags:
 - Element-Plus 源码分析
---
# switch

1. 结构

   ```html
   <div class="el-switch">
     <input class="el-switch__input">
     <!-- 前面文字描述 -->
     <span></span>
     <!-- 开关 -->
     <span class="el-switch__core"></span>
     <!-- 后面文字描述 -->
     <span></span>
   </div>
   ```

   

   开关部分

   ```html
   <span ref="core" class="el-switch__core" :style="{ 'width': (width || 40) + 'px' }">
     <div class="el-switch__action">
       <i v-if="loading" class="el-icon-loading"></i>
     </div>
   </span>
   
   //el-switch__core 外层的椭圆
   .el-switch__core {
       margin: 0;
       display: inline-block;
       position: relative; //相对定位
       width: 40px;
       height: 20px;
       border: 1px solid #dcdfe6;
       outline: none;
       border-radius: 10px;
       box-sizing: border-box;
       background: #dcdfe6;
       cursor: pointer;
       transition: border-color .3s,background-color .3s;
       vertical-align: middle;
   }
   //el-switch__action 圆形滑块 这是关闭的状态
   .el-switch__core .el-switch__action {
       position: absolute; //绝对定位
       top: 1px; //椭圆有1px的border
       left: 1px;
       border-radius: 100%;
       transition: all .3s;//滑块动画时间以及背景颜色变化的时间
       width: 16px;
       height: 16px;
       background-color: #fff;
       display: flex;
       justify-content: center;
       align-items: center;
       color: #dcdfe6;
   }
   //圆形滑块 这是激活的状态
   .el-switch.is-checked .el-switch__core .el-switch__action {
       left: 100%;
       margin-left: -17px;//圆形的宽及椭圆的1px的border
       color: #409eff;
   }
   ```

   

   ```css
   //input 隐藏
   .el-switch__input {
       position: absolute;
       width: 0;
       height: 0;
       opacity: 0;
       margin: 0;
   }
   ```

   Input 被隐藏了，且没有大小。所以input 上的事件时无法触发的。那这个input 有什么用呢？❓

   ![image-20210414155719583](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210414155719583.png)

   最外层div 作用，使其是一个整体，点击，可以切换状态`@click.prevent="switchValue"`

   ```js
   const handleChange = (): void => {
     console.warn('switch==handleChange');
     ...
   }
   
   const switchValue = (): void => {
     console.warn('switchValue');
     !switchDisabled.value && handleChange()
   }
   ```

   > 所以开关切换 是，触发`div 上的@click.prevent="switchValue" `
   >
   > 再由`switchValue`调用`handleChange`
   >
   > 所以根本不会触发input上的`@change="handleChange" @keydown.enter="switchValue"`事件
   >
   > ![](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/2021-04-14%2016-02-37.2021-04-14%2016_07_11.gif)
   >
   > 或者删除掉`input`代码，及js 中的`input.value.checked = checked.value` ,也完全不影响使用。

   

   将input上的`el-switch__input`的class 去掉。且将div 上的``@click.prevent="switchValue"``删掉，input有占位可以出发input上的事件。

   ![2021-04-14 15-49-14.2021-04-14 15_55_15](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/2021-04-14%2015-49-14.2021-04-14%2015_55_15.gif)

   ---------------

   更：

   使用input的原因，是在使用form时，可以通过label来控制开关。

   ```html
   <el-form  :model="form" label-width="80px">
     <el-form-item label="即时配送" prop='delivery'>
       <el-switch v-model="form.delivery" id='delivery'></el-switch>
     </el-form-item>
   </el-form>
   ```

   ![image-20210414180829672](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210414180829672.png)

   ![2021-04-14 18-08-38.2021-04-14 18_13_08](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/2021-04-14%2018-08-38.2021-04-14%2018_13_08.gif)

2. `~`按位非

   ```js
   //按位非后变为0，再！后变为1，为true，则进if
   //[props.activeValue, props.inactiveValue].indexOf(actualValue.value) === -1
   if (!~[props.activeValue, props.inactiveValue].indexOf(actualValue.value)) {
    ...
   }
   ```

   

3. 

