---
title: input
date: 2021-04-12
sidebar: 'auto'
sidebarDepth: 2
categories:
 - Element-Plus 源码分析
tags:
 - Element-Plus 源码分析
---

# input

1. 结构

   ```html
   <template>
     <div ...>
       <!-- 非textarea  -->
       <template v-if="type !== 'textarea'">
         <!-- 前置元素 -->
         <div class="el-input-group__prepend" v-if="$slots.prepend">
           <slot name="prepend"></slot>
         </div>
         
         <!--主体input-->
         <input ...>
         
         <!-- 前置内容 -->
         <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
          ...
         </span>
         <!-- 后置内容 -->
         <span
           ...
         </span>
         <!-- 后置元素 -->
         <div class="el-input-group__append" v-if="$slots.append">
          ...
         </div>
       </template>
       <!-- textarea -->
       <textarea v-else>
       </textarea>
       <!-- textarea 字数限制 -->
       <span></span>
     </div>
   </template>
   ```

   ![:Users:liujinyuan:Desktop:WeChat33ea189d9107bc7e775d49213f1e2c3d](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/:Users:liujinyuan:Desktop:WeChat33ea189d9107bc7e775d49213f1e2c3d.png)

   >中间的`input`是自适应大小的,使用了`table布局`
   >
   >```css
   >.el-input-group{
   >    display: inline-table;
   >    width: 100%;
   >}
   >
   >prepend,input,append
   >{
   >    display: table-cell;
   >}
   >
   >prefix-icon，suffix-icon 正好放在input的左右padding中
   >{
   >  position:absolute;
   >}
   >```
   >
   >

2. 计算图标的偏移

   >`prefix-icon`，`suffix-icon` 的位置受`prepend` 、 `append` 的影响

   ```js
   const PENDANT_MAP = {
     suffix: 'append',
     prefix: 'prepend',
   }
   // 计算图标偏移
   const calcIconOffset = place => {
     const { el } = instance.vnode
     const elList: HTMLSpanElement[] = Array.from(el.querySelectorAll(`.el-input__${place}`))
     const target = elList.find(item => item.parentNode === el)
   
     if (!target) return
   
     const pendant = PENDANT_MAP[place]
   
     if (ctx.slots[pendant]) {
       target.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)`
     } else {
       target.removeAttribute('style')
     }
   }
   
   const updateIconOffset = () => {
     calcIconOffset('prefix')
     calcIconOffset('suffix')
   }
   ```

   

3. hovering

   ```js
   const hovering = ref(false)//hover 状态，用于判断是否显示 清空图标.状态修改的事件 为 onMouseLeave,onMouseEnter
   
   const onMouseLeave = e => {
     hovering.value = false
     ctx.emit('mouseleave', e)
   }
   
   const onMouseEnter = e => {
     hovering.value = true
     ctx.emit('mouseenter', e)
   }
   // 显示清空图标按钮
   const showClear = computed(() => {
     // 是否传递了 clearable
     // 是否被禁用了
     // 是否只读
     // 是否聚焦或者 hover 状态
     return props.clearable &&
       !inputDisabled.value &&
       !props.readonly &&
       nativeInputValue.value &&
       (focused.value || hovering.value)
   })
   ```

   

4. focus

   ```js
   const focused = ref(false)// focus 状态，用于判断 清空图标的显示、密码查看图标。状态修改的事件 为 focus,blur
   
   // 是否显示 清空图标按钮
   const showClear = computed(() => {
     ...👆
   })
   // 是否显示 密码查看图标
   const showPwdVisible = computed(() => {
     return props.showPassword &&
       !inputDisabled.value &&
       !props.readonly &&
       (!!nativeInputValue.value || focused.value)
   })
   
   const handleFocus = event => {
     focused.value = true //状态修改
     ctx.emit('focus', event)
   }
   
   const handleBlur = event => {
     focused.value = false //状态修改
     ctx.emit('blur', event)
     if (props.validateEvent) {
       elFormItem.formItemMitt?.emit('el.form.blur', [props.modelValue])
     }
   }
   ```

   

5. isComposing

   ```js
   const isComposing = ref(false)//正在输入 状态，用于中文输入时，正在输入，但文本未确认时。此时也触发input事件，但是此时不应该修改v-model值
   // 状态改变的事件 input
   // ☞ compositionstart  文字输入之前触发 
   // ☞ compositionupdate 输入过程中每次敲击键盘触发 
   // ☞ compositionend 选择字词完成时触发
   
   // 注册这三个事件的原因在于实现中文输入法下，仅在选词后触发 input 事件。由于在输入拼音的时输入框不是立即获得输入的值，而是要确实后才能获取到。
   //
   // 触发compositionstart时，文本框会填入待确认文本，同时触发 input 事件；如果不想触发 input ，需设置一个变量来控制。
   const handleCompositionStart = () => {
     //正在输入
     isComposing.value = true
   }
   
   const handleCompositionUpdate = event => {
     // 获取敲击键盘的值（不含当前输入）
     const text = event.target.value
     // 敲击中的最后一个（不含当前输入）
     const lastCharacter = text[text.length - 1] || ''
     isComposing.value = !isKorean(lastCharacter)
   }
   
   const handleCompositionEnd = event => {
     if (isComposing.value) {
       isComposing.value = false
       handleInput(event)
     }
   }
   ```

   

6. `Input `没有通过`v-model`或`:value`进行值的绑定，通过ref dom设置value。所以当value变化时，也要及时调用`setNativeInputValue`更新当前组件的value。

   ```html
   <input
          v-if="type !== 'textarea'"
          ref="input"
          class="el-input__inner"
          v-bind="attrs"
          :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
          :disabled="inputDisabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :tabindex="tabindex"
          :aria-label="label"
          :placeholder="placeholder"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
          >
   ```

   

   ```js
   const input = ref(null)
   const textarea = ref (null)
   const inputOrTextarea = computed(() => input.value || textarea.value)//dom
   
   // v-model 的值 modelValue
   const nativeInputValue = computed(() => (props.modelValue === null || props.modelValue === undefined) ? '' : String(props.modelValue))
   //通过dom设置input value
   const setNativeInputValue = () => {
     const input = inputOrTextarea.value//dom value
     if (!input || input.value === nativeInputValue.value) return
     input.value = nativeInputValue.value
   }
   
   const handleInput = event => {
     const { value } = event.target
   
     // should not emit input during composition
     // see: https://github.com/ElemeFE/element/issues/10516
     // 如果正在输入就不触发 input 事件
     if (isComposing.value) return
   
     // hack for https://github.com/ElemeFE/element/issues/8548
     // should remove the following line when we don't support IE
     if (value === nativeInputValue.value) return
   
     ctx.emit(UPDATE_MODEL_EVENT, value)
     ctx.emit('input', value)
   
     // ensure native input value is controlled
     // see: https://github.com/ElemeFE/element/issues/12850
     nextTick(setNativeInputValue)
   }
   
   // native input value is set explicitly
   // do not use v-model / :value in template
   // see: https://github.com/ElemeFE/element/issues/14521
   watch(nativeInputValue, () => {
     setNativeInputValue()
   })
   
   // when change between <input> and <textarea>,
   // update DOM dependent value and styles
   // https://github.com/ElemeFE/element/issues/14857
   watch(() => props.type, () => {
     nextTick(() => {
       setNativeInputValue()
       resizeTextarea()
       updateIconOffset()
     })
   })
   
   onMounted(() => {
     setNativeInputValue()
     updateIconOffset()
     nextTick(resizeTextarea)
   })
   ```

   

7. Show password

   ```html
   <input 
   :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
   />
   
    <el-input  v-model="input" show-password >
    </el-input>
   ```

   > show-password 显示密码，可省略type='password'

   ```js
   const passwordVisible = ref(false)//是否显示密码 用于input type 的切换,事件触发 click 密码查看图标
   // 密码显示与隐藏
   const handlePasswordVisible = () => {
     passwordVisible.value = !passwordVisible.value
     focus()//当切换时，光标位置置于最后
   }
   const focus = () => {
     // see: https://github.com/ElemeFE/element/issues/18573
     // 密码显示与隐藏的切换 使光标位置置后 使用nextTick,页面更新 在聚焦（显示密码后在聚焦，焦点在文字后面）
     nextTick(() => {
       inputOrTextarea.value.focus()
     })
   }
   ```

   

8. `$attrs`与`attrs`

   >包含了父作用域中不作为组件 [props](https://vue3js.cn/docs/zh/api/options-data.html#props) 或[自定义事件](https://vue3js.cn/docs/zh/api/options-data.html#emits)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 `v-bind="$attrs"` 传入内部组件——在创建高阶的组件时非常有用。

   ```html
   <div
       :class="[
        ...
         $attrs.class
       ]"
       :style="$attrs.style"
     >
   
   <input v-bind="attrs">
   <textarea v-bind="attrs"></textarea>
   ```

   > attrs 是element-plus 自己写的，主要是返回 **除了**`class`、`style`及其他事件的属性。

   ```js
   const attrs = useAttrs()
   
   // useAttrs
   import {
     getCurrentInstance,
     reactive,
     shallowRef,
     watchEffect,
   } from 'vue'
   import { entries } from '@element-plus/utils/util'
   
   interface Params {
     excludeListeners?: boolean
     excludeKeys?: string[]
   }
   
   const DEFAULT_EXCLUDE_KEYS = ['class', 'style']//默认排除的key
   const LISTENER_PREFIX = /^on[A-Z]/  //侦听器前缀
   
   export default (params: Params = {}) => {
     const { excludeListeners = false, excludeKeys = [] } = params
     const instance = getCurrentInstance()
     const attrs = shallowRef({})
     const allExcludeKeys = excludeKeys.concat(DEFAULT_EXCLUDE_KEYS)//排除key的数组
   
     // Since attrs are not reactive, make it reactive instead of doing in `onUpdated` hook for better performance
     instance.attrs = reactive(instance.attrs)//使其变成响应式，可监听变化
   
     // entries 返回 二维数组 [ [key,value],[key,value] ]
     //根据变化 修改attrs
     watchEffect(() => {
       const res = entries(instance.attrs)
         .reduce((acm, [key, val]) => {
           if (
             !allExcludeKeys.includes(key) &&
             !(excludeListeners && LISTENER_PREFIX.test(key))
           ) {
             acm[key] = val
           }
   
           return acm
         }, {})
   
       attrs.value = res
     })
   
     return attrs
   }
   
   ```

   

9. Textarea 自适应高度

   ```js
   //textarea的高度自适应
   const resizeTextarea = () => {
     const { type, autosize } = props
     // isServer  typeof window === 'undefined' 是否运行于服务器 （服务器渲染）
     if (isServer || type !== 'textarea') return
   
     if (autosize) {
       const minRows = isObject(autosize) ? autosize.minRows : void 0 //void 0 代替undefined,主要原因在于避免 undefined 值被重写带来的风险
       const maxRows = isObject(autosize) ? autosize.maxRows : void 0
       _textareaCalcStyle.value = calcTextareaHeight(textarea.value, minRows, maxRows)
     } else {
       _textareaCalcStyle.value = {
         minHeight: calcTextareaHeight(textarea.value).minHeight,
       }
     }
   }
   ```

   >calcTextareaHeight方法 主要用于 计算textarea 的高度和最小高度
   >
   >1. 创建`隐藏样式的textarea`
   >
   >   创建`textarea` 并添加到`body`上，并设置行内样式及隐藏样式
   >
   >2. 获取真实高度
   >
   >   获取此`隐藏textarea`的`scrollHeight`，并通过`boxSizing`是`border-box`或者`content-box`,来获取`真实的height`
   >
   >3. 计算单行高度
   >
   >   通过清空内容 获取单行高度
   >
   >4. 通过minRows和maxRows，得到`minHeight 和 height`
   >
   >5. 移除hiddenTextarea 并重置null

   ```js
   let hiddenTextarea
   // 隐藏的样式
   const HIDDEN_STYLE = `
     height:0 !important;
     visibility:hidden !important;
     overflow:hidden !important;
     position:absolute !important;
     z-index:-1000 !important;
     top:0 !important;
     right:0 !important;
   `
   //内容样式
   const CONTEXT_STYLE = [
     'letter-spacing',
     'line-height',
     'padding-top',
     'padding-bottom',
     'font-family',
     'font-weight',
     'font-size',
     'text-rendering',
     'text-transform',
     'width',
     'text-indent',
     'padding-left',
     'padding-right',
     'border-width',
     'box-sizing',
   ]
   
   type NodeStyle = {
     contextStyle: string
     boxSizing: string
     paddingSize: number
     borderSize: number
   }
   
   type TextAreaHeight = {
     height: string
     minHeight?: string
   }
   
   function calculateNodeStyling(targetElement): NodeStyle {
     const style = window.getComputedStyle(targetElement)
   
     const boxSizing = style.getPropertyValue('box-sizing')
   
     const paddingSize = (
       parseFloat(style.getPropertyValue('padding-bottom')) +
       parseFloat(style.getPropertyValue('padding-top'))
     )
   
     const borderSize = (
       parseFloat(style.getPropertyValue('border-bottom-width')) +
       parseFloat(style.getPropertyValue('border-top-width'))
     )
   
     const contextStyle = CONTEXT_STYLE
       .map(name => `${name}:${style.getPropertyValue(name)}`)
       .join(';')
   
     return { contextStyle, paddingSize, borderSize, boxSizing }
     // {
     //   "contextStyle": "letter-spacing:normal;line-height:21px;padding-top:5px;padding-bottom:5px;font-family:monospace;font-weight:400;font-size:14px;text-rendering:auto;text-transform:none;width:1227px;text-indent:0px;padding-left:15px;padding-right:15px;border-width:1px;box-sizing:border-box",
     //   "paddingSize": 10,
     //   "borderSize": 2,
     //   "boxSizing": "border-box"
     // }
   }
   
   export default function calcTextareaHeight(
     targetElement,
     minRows = 1,
     maxRows = null,
   ): TextAreaHeight {
     //hiddenTextarea不存在则创建 隐藏的textarea append到body中
     if (!hiddenTextarea) {
       hiddenTextarea = document.createElement('textarea')
       document.body.appendChild(hiddenTextarea)
     }
   
     const {
       paddingSize,
       borderSize,
       boxSizing,
       contextStyle,
     } = calculateNodeStyling(targetElement)
   
     //给创建的hiddenTextarea添加行内样式和隐藏样式，并赋值value或palceholder,无则''
     hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`)
     hiddenTextarea.value = targetElement.value || targetElement.placeholder || ''
   
     let height = hiddenTextarea.scrollHeight//hiddenTextarea 内容高度(含padding，不含border和margin)
     const result = {} as TextAreaHeight
     //真实高度计算
     // border-box 的 height = content+padding+border
     // content-box 的 height = content
     if (boxSizing === 'border-box') {
       height = height + borderSize
     } else if (boxSizing === 'content-box') {
       height = height - paddingSize
     }
     
     //清空内容 用于获取单行高度
     hiddenTextarea.value = ''
     //单行高度 计算最小高度
     const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize
     
     // 最小行存在 默认minRows = 1
     if (minRows !== null) {
       let minHeight = singleRowHeight * minRows
       if (boxSizing === 'border-box') {
         minHeight = minHeight + paddingSize + borderSize
       }
       height = Math.max(minHeight, height)
       result.minHeight = `${ minHeight }px`
     }
     //最大行存在 计算最大高度
     if (maxRows !== null) {
       let maxHeight = singleRowHeight * maxRows
       if (boxSizing === 'border-box') {
         maxHeight = maxHeight + paddingSize + borderSize
       }
       height = Math.min(maxHeight, height)
     }
     result.height = `${ height }px`
     // 移除hiddenTextarea
     hiddenTextarea.parentNode?.removeChild(hiddenTextarea)
     hiddenTextarea = null
   
     return result
     //{minHeight: "33px", height: "33px"}
   }
   
   ```

   

10. [探索el-input使用v-model.trim后无法输入空格的问题](https://darknesschaser.github.io/2020/12/06/%E6%8E%A2%E7%B4%A2el-input%E4%BD%BF%E7%94%A8v-model.trim%E5%90%8E%E6%97%A0%E6%B3%95%E8%BE%93%E5%85%A5%E7%A9%BA%E6%A0%BC%E7%9A%84%E9%97%AE%E9%A2%98/)

   > trim修饰符作用在v-model上的时候会导致数据层数据和dom层value不一致的情况，所以就需要一个机制来把数据层trim后的值重新和dom层同步。原生dom是在blur上，component需要自己处理。因为elementui在处理的时候用的是父组件trim后的值，所以会导致空格无法输入。

11. 

