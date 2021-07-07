---
title: input-number
date: 2021-04-14
sidebar: 'auto'
sidebarDepth: 2
categories:
 - Element-Plus 源码分析
tags:
 - Element-Plus 源码分析
---


# input-number

1. 结构

   ```html
   <div class='el-input-number'>
       <!-- 减号 -->
       <span class="el-input-number__decrease"></span>
       <!-- 加号 -->
       <span class="el-input-number__increase"></span>
       <!-- el-input -->
       <el-input></el-input>
   </div>
   ```

   > el-input 左右padding 50px，用来放加减号，加减号通过绝对定位`left:1px(right:1px)`来确定具体的位置
   >
   > `left:1px(right:1px)`留出最外面边框的位置

   >当`controls-position="right"`
   >
   >```css
   >  @include when(controls-right) {
   >    .#{$namespace}-input__inner {
   >      padding-left: 15px;
   >      padding-right: #{$--input-height + 10};
   >    }
   >
   >    @include e((increase, decrease)) {
   >      height: auto;
   >      line-height: #{($--input-height - 2) / 2};
   >      
   >    }
   >
   >    @include e(decrease) {
   >      right: 1px;
   >      bottom: 1px;
   >      top: auto;
   >      left: auto;
   >      border-right: none;
   >      border-left: $--border-base;
   >      border-radius: 0 0 $--border-radius-base 0;
   >    }
   >}
   >```
   >
   >`top: auto;left: auto;` 是为了覆盖原来的`top:1px,left:1px`的样式，使其重新计算

2. `@dragstart.prevent`

   > 禁止数字拖拽

   ![2021-04-13 14-03-56.2021-04-13 14_05_31](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/2021-04-13%2014-03-56.2021-04-13%2014_05_31.gif)

3. 加减事件

   ```html
    <!-- 减号 -->
   <span
         v-repeat-click="decrease"
         @keydown.enter="decrease"
         ...>
    ...
   </span>
   ```

   `@keydown.enter="decrease"`...❓ 不知道什么作用。

   

   自定义指令 v-repeat-click="decrease"

   ![image-20210413151618820](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210413151618820.png)

   ```js
   // v-repeat-click 重复点击
   export default {
     beforeMount(el, binding) {
       let interval = null//定时器
       let startTime: number//计时开始时间
       const handler = () => binding.value && binding.value()// 获取表达式内容（v-repeat-click="decrease" 拿到decrease方法）
   
       const clear = () => {
         // 如果当前时间距离开始时间少于 100ms，执行 handler
         if (Date.now() - startTime < 100) {
           handler()
         }
         clearInterval(interval)
         interval = null
       }
       // 绑定鼠标按下的事件
       on(el, 'mousedown', e => {
         if ((e as any).button !== 0) return//e.button
         startTime = Date.now()
         //监听鼠标抬起事件，只监听一次。
         // 监听的主体是document，而不是el，因为在点击的过程中，鼠标可能移除el区域在抬起。
         // 用once不用on的原因 是用on就会一直监听，在el外点击鼠标 也会执行clear函数。
         once(document as any, 'mouseup', clear)
         clearInterval(interval)
         interval = setInterval(handler, 100)
       })
     },
   } as ObjectDirective
   
   // e.button 一个数值，代表按下的鼠标按键：
   
   // 0：主按键，通常指鼠标左键或默认值（译者注：如document.getElementById('a').click()这样触发就会是默认值）
   // 1：辅助按键，通常指鼠标滚轮中键
   // 2：次按键，通常指鼠标右键
   // 3：第四个按钮，通常指浏览器后退按钮
   // 4：第五个按钮，通常指浏览器的前进按钮
   // 对于配置为左手使用的鼠标，按键操作将正好相反。此种情况下，从右至左读取值。
   
   ```

   

   ```js
   /* 添加事件监听 */
   export const on = function(
     element: HTMLElement | Document | Window,
     event: string,
     handler: EventListenerOrEventListenerObject,
     useCapture = false,
   ): void {
     if (element && event && handler) {
       element.addEventListener(event, handler, useCapture)
     }
   }
   
   /* 移除事件监听 */
   export const off = function(
     element: HTMLElement | Document | Window,
     event: string,
     handler: EventListenerOrEventListenerObject,
     useCapture = false,
   ): void {
     if (element && event && handler) {
       element.removeEventListener(event, handler, useCapture)
     }
   }
   /* once */
   export const once = function(
     el: HTMLElement,
     event: string,
     fn: EventListener,
   ): void {
     const listener = function(...args: unknown[]) {
       if (fn) {
         fn.apply(this, args)
       }
       off(el, event, listener)
     }
     on(el, event, listener)
   }
   ```

   执行过程

   ![:Users:liujinyuan:Desktop:WeChat85484fcc7a51bac48d5998e59c338c58](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/:Users:liujinyuan:Desktop:WeChat85484fcc7a51bac48d5998e59c338c58.png)

4. 精度

   都知道js `0.1+0.2=0.30000000000000004`

   如何解决精度问题(将小数转换成整数计算，在除以位数)

   ```js
   const decrease = () => {
     if (inputNumberDisabled.value || minDisabled.value) return
     const value = props.modelValue || 0
     const newVal = _decrease(value)//获取计算后的准确值
     setCurrentValue(newVal)//更新值
   }
   
   const _decrease = val => {
     if (typeof val !== 'number' && val !== undefined) return data.currentValue
     const precisionFactor = Math.pow(10, numPrecision.value)// 10的几次方 用于将小数转换成整数用
     // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
     //将结果 转换成 对应精度的数值
     return toPrecision(
       (precisionFactor * val - precisionFactor * props.step) / precisionFactor,
     )
   }
   
   const setCurrentValue = newVal => {
     const oldVal = data.currentValue
     //handleInputChange 输入的数值超出精度时，重新计算值
     if (
       typeof newVal === 'number' &&
       props.precision !== undefined
     ) {
       newVal = toPrecision(newVal, props.precision)
     }
     if (newVal !== undefined && newVal >= props.max) newVal = props.max
     if (newVal !== undefined && newVal <= props.min) newVal = props.min
     if (oldVal === newVal) return
     data.userInput = null 
     emit('update:modelValue', newVal)
     emit('input', newVal)
     emit('change', newVal, oldVal)
     data.currentValue = newVal
   }
   ```

   

5. 显示-当数值的精度(0.1)小于设置的精度(precision=4)

   ```js
   <el-input
         :model-value="displayValue"
       />
   
   //输入框显示的值
   const displayValue = computed(() => {
     if (data.userInput !== null) {
       return data.userInput
     }
     let currentValue = data.currentValue
     if (typeof currentValue === 'number') {
       if (props.precision !== undefined) {
         currentValue = currentValue.toFixed(props.precision)
       }
     }
     return currentValue
   })
   ```

   

6. 

