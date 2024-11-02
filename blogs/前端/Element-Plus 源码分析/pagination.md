---
title: pagination
date: 2021-07-03
sidebar: 'auto'
sidebarDepth: 2
categories:
 - Element-Plus 源码分析
tags:
 - Element-Plus 源码分析
---

# pagination

分页组件是有多个组件组成的

```
sizes`, `prev`, `pager`, `next`, `jumper`, `->`, `total`, `slot
```

![image-20210630100734403](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210630100734403.png)

除了`->` 、`slot` 其余都是组件

`->`的使用，使其右浮动。

```js
<el-pagination
    background
    layout="prev, ->, pager, next"
    :total="1000"
  />
```

![image-20210629171020012](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210629171020012.png)

# render函数

```js
render() {
    const layout = this.layout

    if (!layout) return null
    if (
      this.hideOnSinglePage &&
      (!this.internalPageCount || this.internalPageCount === 1)
    )
      return null
    //<div class="el-pagination is-background ..."></div>
    const rootNode = h('div', {
      class: [
        'el-pagination',
        {
          'is-background': this.background,
          'el-pagination--small': this.small,
        },
      ],
    })
    const rootChildren = []
    const rightWrapperChildren = []
    //右侧间距 -> 在layout中使用‘->’ 其右侧的内容 会靠右侧对齐 float：right
    const rightWrapperRoot = h('div', { class: 'el-pagination__rightwrapper' }, rightWrapperChildren)
    const TEMPLATE_MAP = {
      prev: h(Prev, {
        disabled: this.disabled,
        currentPage: this.internalCurrentPage,
        prevText: this.prevText,
        onClick: this.prev,
      }),
      jumper: h(Jumper),
      pager: h(Pager, {
        currentPage: this.internalCurrentPage,
        pageCount: this.internalPageCount,
        pagerCount: this.pagerCount,
        onChange: this.handleCurrentChange,
        disabled: this.disabled,
      }),
      next: h(Next, {
        disabled: this.disabled,
        currentPage: this.internalCurrentPage,
        pageCount: this.internalPageCount,
        nextText: this.nextText,
        onClick: this.next,
      }),
      sizes: h(Sizes, {
        pageSize: this.pageSize,
        pageSizes: this.pageSizes,
        popperClass: this.popperClass,
        disabled: this.disabled,
      }),
      slot: this.$slots?.default?.() ?? null,
      total: h(Total, { total: this.total }),
    }

    const components = layout.split(',').map((item: string) => item.trim())

    let haveRightWrapper = false
    //遍历components , 遇到->后 让后面的组件都放入到rightWrapperChildren中
    components.forEach((c: keyof typeof TEMPLATE_MAP | '->') => {
      if (c === '->') {
        haveRightWrapper = true
        return
      }
      if (!haveRightWrapper) {
        rootChildren.push(TEMPLATE_MAP[c])
      } else {
        rightWrapperChildren.push(TEMPLATE_MAP[c])
      }
    })
    // 当有 -> 标识时，且rightWrapperChildren > 0
    if (haveRightWrapper && rightWrapperChildren.length > 0) {
      rootChildren.unshift(rightWrapperRoot)//push 也可以吧
    }

    return h(rootNode, {}, rootChildren)
  },
```

# 结构

1. `pre` 和`next`组件，

   内部没有操作事件，`@click.self.prevent`只会阻止对元素自身的点击。

   设置了其自身的`disabled`状态

   `pre` 当前是第一页时禁止点击

   `next` 当前是最后一页时禁止点击（等于总页数时）

2. `pager`

   | 参数        | 说明                                     | 类型   | 可选值                          | 默认值 |
   | :---------- | :--------------------------------------- | :----- | :------------------------------ | :----- |
   | pager-count | 页码按钮的数量，当总页数超过该值时会折叠 | number | 大于等于 5 且小于等于 21 的奇数 | 7      |

   ![image-20210630110615098](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20210630110615098.png)

   ```html
   <ul class="el-pager" @click="onPagerClick">
       <!-- 第一页 -->
       <li
         v-if="pageCount > 0"
         :class="{ active: currentPage === 1, disabled }"
         class="number"
       >
         1
       </li>
       <!-- showPrevMore  mouseenter时展示⬅️，mouseleave时展示•••-->
       <li
         v-if="showPrevMore"
         class="el-icon more btn-quickprev"
         :class="[quickprevIconClass, { disabled }]"
         @mouseenter="onMouseenter('left')"
         @mouseleave="quickprevIconClass = 'el-icon-more'"
       >
       </li>
       <!-- 遍历 -->
       <li
         v-for="pager in pagers"
         :key="pager"
         :class="{ active: currentPage === pager, disabled }"
         class="number"
       >
         {{ pager }}
       </li>
       <!-- showNextMore  mouseenter时展示➡️，mouseleave时展示•••-->
       <li
         v-if="showNextMore"
         class="el-icon more btn-quicknext"
         :class="[quicknextIconClass, { disabled }]"
         @mouseenter="onMouseenter('right')"
         @mouseleave="quicknextIconClass = 'el-icon-more'"
       >
       </li>
       <!-- 最后一页 -->
       <li
         v-if="pageCount > 1"
         :class="{ active: currentPage === pageCount, disabled }"
         class="number"
       >
         {{ pageCount }}
       </li>
     </ul>
   ```

   > `@click="onPagerClick"` 绑定到了最外层`ul` 使用了事件代理（冒泡机制）
   >
   >重点是 pagers 的计算过程

   ```js
   const pagers = computed(() => {
         const pagerCount = props.pagerCount //页码按钮个数
         const halfPagerCount = (pagerCount - 1) / 2 //pagerCount 为奇数的目的是 用于判断 当前页所在的区间范围
         const currentPage = Number(props.currentPage)
         const pageCount = Number(props.pageCount)//总页数
   
         let showPrevMore = false
         let showNextMore = false
         //总页数 > 页码按钮数量
         if (pageCount > pagerCount) {
           //判断当前页在 哪个区间
           // 当前页 和 前区间（pagerCount 按钮数量 - halfPagerCount）比较
           if (currentPage > pagerCount - halfPagerCount) {
             showPrevMore = true
             console.warn('pre')
           }
           // 当前页 和 后区间（pageCount 总页数- halfPagerCount）比较
           if (currentPage < pageCount - halfPagerCount) {
             showNextMore = true
             console.warn('next')
           }
         }
         const array = []
         // 四种情况
         // ✅pre  ❌next
         // ❌pre  ✅next
         // ✅pre  ✅next
         // ❌pre  ❌next
         if (showPrevMore && !showNextMore) {
           // 1 ••• 5 6 7 8 9 10
           //array 5 6 7 8 9
           const startPage = pageCount - (pagerCount - 2)//2 为首页，尾页
           for (let i = startPage; i < pageCount; i++) {
             array.push(i)
           }
         } else if (!showPrevMore && showNextMore) {
           //1 2 3 4 5 6 ••• 10
           //array 2 3 4 5 6
           for (let i = 2; i < pagerCount; i++) {
             array.push(i)
           }
         } else if (showPrevMore && showNextMore) {
           //1 ••• 3 4 5 6 7 ••• 10
           //1 ••• 4 5 6 7 8 ••• 10
           //【-offset ， offset】
           const offset = Math.floor(pagerCount / 2) - 1
           for (let i = currentPage - offset; i <= currentPage + offset; i++) {
             array.push(i)
           }
         } else {
           for (let i = 2; i < pageCount; i++) {
             array.push(i)
           }
         }
   
         return array
       })
   
   ```

   

3. `jumper`

   > `El-input` 上绑定的`:model-value="innerValue"` innerValue 是通过计算属性来的，
   >
   > 引用新变量

   ```js
    const userInput = ref<Nullable<number>>(null)
    //:model-value="innerValue"
    const innerValue = computed(() => userInput.value ?? currentPage.value)
    //input
    function handleInput(val: number | string) {
      userInput.value = Number(val)
    }
   //仅在输入框失去焦点或用户按下回车时触发
   function handleChange(val: number | string) {
     pagination?.changeEvent(Number(val))
     userInput.value = null
   }
   
   ```

   

4. 

# 问题

1. 什么时候使用props，什么时候使用 provide/inject？

   >`sizes组件中`既有props，又有inject，当时props中的部分属性（disabled），inject中也有，为什么不都用inject的呢？

   props可以通过 绑定传递给自组件。调用时绑定传递 给组件

   provide/inject 适合多层级的传递。在中间层级的组件都可以使用

2. userChangePageSize 暂时没有感觉这个值是需要的。

   ```js
   // Pager组件中 触发
   // if (newPage !== currentPage) {
   //   emit('change', newPage)
   // }
   // 已经对 是否同一页 做了处理，所以能触发 必是 internalCurrentPage.value !== lastEmittedPage.value
   // userChangePageSize.value  好像是没有必要的。
   function handleCurrentChange(val: number) {
     internalCurrentPage.value = getValidCurrentPage(val)
     userChangePageSize.value = true
     emitChange()
   }
   //sizes 组件中  修改了每页条数触发 但不会触发emitChange
   function handleSizesChange(val: number) {
     userChangePageSize.value = true
     internalPageSize.value = val
     emit('update:pageSize', val)
     emit('size-change', val)
   }
   ```

   

欢迎帮忙解答，谢谢。

