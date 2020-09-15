---
title: 通过router配置多级导航菜单
date: 2019-05-19
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - 项目
 - elementUI
 - csdn
prev: ./多级导航菜单
next: false
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190519121209611.gif)
>#  Sidebar 调用
```html
<template>
  <div>
    <el-menu
      :default-active="$route.path"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      mode="vertical"
      router
      :collapse="isCollapse"
    >
      <sidebar-item :menu="getrouters" />
    </el-menu>
  </div>
</template>

<script>
import { asyncRouterMap, commontRouterMap } from "@/router";
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["getsidebar"]),
    isCollapse() {//是否折叠
      return !this.getsidebar.opened;
    },
    getrouters() { //路由表
      return commontRouterMap.concat(asyncRouterMap);
    }
  }
};
</script>
<style></style>

```
 ># SidebarItem 组件
```html
<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="!item.children && !item.hidden"
        :key="item.path"
        :index="parent ? parent + '/' + item.path : item.path"
      >
        <i :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu
        v-if="item.children && !item.hidden"
        :key="item.path"
        :index="parent ? parent + '/' + item.path : item.path"
      >
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span> {{ item.meta.title }}</span>
        </template>
        <!-- 递归 -->
        <sidebar-item
          :menu="item.children"
          :parent="parent ? parent + '/' + item.path : item.path"
        />
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: ["menu", "parent"],
  data() {
    return {};
  }
};
</script>

<style></style>


```

> # router.js
`hidden 是否在slider中显示`
`title 标题`
`icon 图标`
```js
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/views/layout/layout";

//如首页和登录页和一些不用权限的公用页面
export const commontRouterMap = [{
    path: "/login",
    hidden: true, //不在slider显示
    component: () =>
        import("@/views/login/index")
},
{
    path: "/",
    component: Layout,
    redirect: "/home",
    name: "Home",
    hidden: true,
    children: [{
        path: "home",
        component: () =>
            import("@/views/Home")
    }]
}
];


//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [{
    path: "/home",
    component: Layout,
    meta: { title: "Home", icon: "el-icon-menu" }
},
{
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    meta: {
        title: "多级菜单",
        icon: "el-icon-news"
    },
    children: [{
        path: "menu1",
        component: () =>
            import("@/views/nested/menu1/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "Menu1" },
        children: [{
            path: "menu1-1",
            component: () =>
                import("@/views/nested/menu1/menu1-1/index"),
            name: "Menu1-1",
            meta: { title: "Menu1-1" }
        },
        {
            path: "menu1-2",
            component: () =>
                import("@/views/nested/menu1/menu1-2/index"),
            name: "Menu1-2",
            meta: { title: "Menu1-2" },
            children: [{
                path: "menu1-2-1",
                component: () =>
                    import("@/views/nested/menu1/menu1-2/menu1-2-1/index"),
                name: "Menu1-2-1",
                meta: { title: "Menu1-2-1" }
            },
            {
                path: "menu1-2-2",
                component: () =>
                    import("@/views/nested/menu1/menu1-2/menu1-2-2/index"),
                name: "Menu1-2-2",
                meta: { title: "Menu1-2-2" }
            }
            ]
        },
        {
            path: "menu1-3",
            component: () =>
                import("@/views/nested/menu1/menu1-3/index"),
            name: "Menu1-3",
            meta: { title: "Menu1-3" }
        }]

    },
    {
        path: "menu2",
        component: () =>
            import("@/views/nested/menu2/index"),
        meta: { title: "menu2" }
    }
    ]
}
];


//实例化vue的时候只挂载commontRouterMap
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: commontRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router;

```
# 权限决定不同路由
>role 控制路由存不存在路由表中(可不可以访问到)
>hidden 控制显不显示

在上面的export const asyncRouterMap中添加
```js
{
    path: "/userpower1",
    component: Layout,
    redirect: "/userpower1/1-1",
    name: "userpower1",
    meta: { title: "权限测试1", icon: "el-icon-tickets", role: ['0', '1', '2'] },
    children: [{
        path: "1-1",
        name: "1-1",
        component: () =>
            import("@/views/userpower1/1-1"),
        meta: { title: "1-1", role: ['0'] },
    },
    {
        path: "1-2",
        name: "1-2",
        component: () =>
            import("@/views/userpower1/1-2"),
        hidden: ['0'],//用户角色为0时，隐藏
        meta: { title: "1-2", role: ['0', '1', '2'] }//role 有0，可以通过某页跳转到这个路由
    },
    {
        path: "1-3",
        name: "1-3",
        component: () =>
            import("@/views/userpower1/1-3"),
        meta: { title: "1-1", role: ['0'] },
        hidden: true,//不在sidebar显示，由sidebar中的某路由跳转到这个页面,本例由1-2跳转，因此role与1-2同
        meta: { title: "1-3", role: ['0', '1', '2'] }
    }

    ]
},
{
    path: "/userpower2",
    component: Layout,
    redirect: "/userpower2/tree",
    name: "userpower2",
    meta: { title: "权限测试2", icon: "el-icon-tickets", role: ['0', '1'] },
    children: [{
        path: "2-1",
        name: "2-1",
        component: () =>
            import("@/views/userpower2/2-1"),
        meta: { title: "2-1", role: ['0'] }
    },
    {
        path: "2-2",
        name: "2-2",
        component: () =>
            import("@/views/userpower2/2-2"),
        hidden: ['0'],//用户角色为0时，隐藏
        meta: { title: "2-2", role: ['0', '1'] }
    }]
},    
```

>切换用户时，须清除cookie,或者使用退出登录

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190519121658363.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)

## 角色0
>可访问路由
>1-1 --> 1-2 --> 1-3
>2-1 --> 2-2
```
标题1
    1-1
标题2
	2-1
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190519122309898.gif)

## 角色1
>可访问路由
>1-2 --> 1-3
>2-2
```
标题1
    1-2
标题2
	2-2
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190519121315707.gif)
## 角色2
>可访问路由 
>1-2 -->1-3
```
标题1
    1-2
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190519122959743.gif)

路由处理

```js

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return route.meta.role.includes(roles)
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }

    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      if (tmp.hidden && typeof tmp.hidden !== 'boolean') {
        tmp.hidden = tmp.hidden.includes(roles) ? true : false;
      }
      res.push(tmp)
    }
  })

  return res
}
```
[git项目地址](https://github.com/xiaolannuoyi/my-vue-template.git)
[演示地址](https://xiaolannuoyi.github.io/my-vue-template/)


