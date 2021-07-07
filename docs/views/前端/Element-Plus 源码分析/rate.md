---
title: rate
date: 2021-07-07
sidebar: 'auto'
sidebarDepth: 2
categories:
 - Element-Plus 源码分析
tags:
 - Element-Plus 源码分析
---

# rate

![image-20210705153521085](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210705153521085.png)


1. html

   ```html
   <template>
     <!-- 最外层 可以通过tab 进行切换，通过 上下左右键 进行数值的加减 -->
     <div
       class="el-rate"
       role="slider"
       :aria-valuenow="currentValue"
       :aria-valuetext="text"
       aria-valuemin="0"
       :aria-valuemax="max"
       tabindex="0"
       @keydown="handleKey"
     >
       <!-- v-for 每个星星上 通过 移动时/离开 控制加减 -->
       <!-- mouseleave 不会冒泡 -->
       <span
         v-for="(item, key) in max"
         :key="key"
         class="el-rate__item"
         :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
         @mousemove="setCurrentValue(item, $event)"
         @mouseleave="resetCurrentValue"
         @click="selectValue(item)"
       >
         <!-- hover样式 el-rate__icon.hover{ transform: scale(1.15)} -->
         <!-- classes[item - 1] 控制当前图标样式 -->
         <!-- getIconStyle(item) 控制当前图标颜色 -->
         <i
           :class="[classes[item - 1], { 'hover': hoverIndex === item }]"
           class="el-rate__icon"
           :style="getIconStyle(item)"
         >
           <!-- 小数图标显示 showDecimalIcon:true/false-->
           <i
             v-if="showDecimalIcon(item)"
             :class="decimalIconClass"
             :style="decimalStyle"
             class="el-rate__decimal"
           >
           </i>
         </i>
       </span>
       <!-- 显示辅助文字或者分数 -->
       <span v-if="showText || showScore" class="el-rate__text" :style="{ color: textColor }">{{ text }}</span>
     </div>
   </template>
   ```

   

2. `@keydown="handleKey"`

   ```js
   // ⬆️⬇️⬅️➡️
   function handleKey(e: KeyboardEvent) {
     if (rateDisabled.value) {
       return
     }
     let _currentValue = currentValue.value
     const code = e.code
     if (code === EVENT_CODE.up || code === EVENT_CODE.right) {
       //➕
       if (props.allowHalf) {
         _currentValue += 0.5
       } else {
         _currentValue += 1
       }
       e.stopPropagation()//禁止冒泡
       e.preventDefault()//禁止默认行为
     } else if (code === EVENT_CODE.left || code === EVENT_CODE.down) {
       //➖
       if (props.allowHalf) {
         _currentValue -= 0.5
       } else {
         _currentValue -= 1
       }
       e.stopPropagation()
       e.preventDefault()
     }
     //边界判断 0 max
     _currentValue = _currentValue < 0 ? 0 : _currentValue
     _currentValue = _currentValue > props.max ? props.max : _currentValue
     emit('update:modelValue', _currentValue)
     emit('change', _currentValue)
     return _currentValue //为什么要return出来，好像没有必要吧❓
   }
   ```

   

3. `@mousemove="setCurrentValue(item, $event)"`

   ![image-20210705155142922](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210705155142922.png)

   >通过移动来实现当前值的变化 但是不会修改值
   >
   >拿到target，并将target指向 `el-rate__icon`,通过 相对于`el-rate__item`的`offsetX`的位置来判断小数

   ```js
   //mousemove->绑定在el-rate__item 通过移动来实现当前值的变化 但是不会修改值
   function setCurrentValue(value: number, event: MouseEvent) {
     if (rateDisabled.value) {
       return
     }
     /* istanbul ignore if */
     if (props.allowHalf) {
       // target 变化前            target.clientWidth
       //左：el-rate__decimal 1     9
       //中：el-rate__icon    2     18
       //右：el-rate__item    3     24
       let target = event.target as HTMLElement
       if (hasClass(target, 'el-rate__item')) {//右侧 3
         target = target.querySelector('.el-rate__icon')
         // console.warn('target 3')
       }
       if (hasClass(target, 'el-rate__decimal')) {//左侧 1
         target = target.parentNode as HTMLElement
         // console.warn('target 1')
       }
       //target 变化后
       //左：el-rate__decimal 1  ==> el-rate__icon  18
       //中：el-rate__icon    2  ==> el-rate__icon  18
       //右：el-rate__item    3  ==> el-rate__icon  18
   
       //其实就是将target指向 el-rate__icon 其clientWidth=18(默认值 $--rate-icon-size)
       //
       pointerAtLeftHalf.value = event.offsetX * 2 <= target.clientWidth // 左半边指针 状态
       currentValue.value = pointerAtLeftHalf.value ? value - 0.5 : value
     } else {
       currentValue.value = value
     }
     hoverIndex.value = value
   }
   ```

4. `@mouseleave="resetCurrentValue"`

   ```js
   //mouseleave 鼠标离开时，当前值恢复成 modelValue
   function resetCurrentValue() {
     if (rateDisabled.value) {
       return
     }
     if (props.allowHalf) {
       pointerAtLeftHalf.value = props.modelValue !== Math.floor(props.modelValue)
     }
     currentValue.value = props.modelValue
     hoverIndex.value = -1
   }
   ```

5. `@click="selectValue(item)"`

   ```js
   //click 时，修改值
   function selectValue(value: number) {
     if (rateDisabled.value) {
       return
     }
     //区分更新modelValue 和 触发change 的时机
     //小数时，currentValue.value 是小数
     //整数时，currentValue.value === value
     if (props.allowHalf && pointerAtLeftHalf.value) {
       emit('update:modelValue', currentValue.value)
       if (props.modelValue !== currentValue.value) {
         emit('change', currentValue.value)
       }
     } else {
       emit('update:modelValue', value)
       if (props.modelValue !== value) {
         emit('change', value)
       }
     }
   }
   ```

6. 图标展示样式

   ```html
   <span>
     <!-- hover样式 el-rate__icon.hover{ transform: scale(1.15)} -->
     <!-- classes[item - 1] 控制当前图标样式 -->
     <!-- getIconStyle(item) 控制当前图标颜色 -->
     <i
        :class="[classes[item - 1], { 'hover': hoverIndex === item }]"
        class="el-rate__icon"
        :style="getIconStyle(item)"
        >
       <!-- 小数图标显示 showDecimalIcon:true/false-->
       <i
          v-if="showDecimalIcon(item)"
          :class="decimalIconClass"
          :style="decimalStyle"
          class="el-rate__decimal"
          >
       </i>
     </i>
   </span>
   ```

   >外侧 `<i class="el-rate__icon"></i>`
   >
   >如果是整数时，只显示外侧。

   ```js
   //classes 返回icon数组 active图标/空心图标
   const classes = computed(() => {
     let result = Array(props.max)
     let threshold = currentValue.value
     // fill(填充值，开始索引，结束索引) 如果索引值为小数，自动向下取整。
     result.fill(activeClass.value, 0, threshold)
     result.fill(voidClass.value, threshold, props.max)
     // ["el-icon-star-on", "el-icon-star-on", "el-icon-star-off", "el-icon-star-off", "el-icon-star-off"]
     // [⭐️,⭐️,☆,☆,☆]
     return result
   })
   
   //颜色填充
   function getIconStyle(item: number) {
     //空心色
     const voidColor = rateDisabled.value ? props.disabledVoidColor : props.voidColor
     return {
       color: item <= currentValue.value ? activeColor.value : voidColor,// 实心 or 空心
     }
   }
   ```

   >内侧 `<i class="el-rate__decimal"></i>`
   >
   >如果是小数时，显示内侧。
   >
   >比方2.5  外层[⭐️,⭐️,☆,☆,☆]
   >
   >第三个，此时外侧显示空心图标(`void-icon-class`绑定的图标)，内层通过`showDecimalIcon`判断是否显示小数。
   >
   >并通过`decimalIconClass` 和`decimalStyle`显示图标和样式。

   ```js
   //小数图标 - 根据当前值 返回对应的图标,
   //当currentValue变化时还是以props.modelValue的显示❓❓
   //我提出的issues https://github.com/element-plus/element-plus/issues/2465
   //个人认为 应该 props.modelValue ==修改成==> currentValue.value
   const decimalIconClass = computed(() => getValueFromMap(currentValue.value, classMap.value))
   
   //小数时的样式 —— 禁用时显示具体小数，非禁用50%
   const decimalStyle = computed(() => {
     let width = ''
     if (rateDisabled.value) {
       width = `${valueDecimal.value}%`
     } else if (props.allowHalf) {
       width = '50%'
     }
     return {
       color: activeColor.value,
       width,
     }
   })
   ```

   