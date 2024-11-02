---
title: github actions自动部署
date: 2020-09-14
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - 项目
 - 部署
 - csdn
---


# 1.Personal access tokens

![WX20200914-114119@2x](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200914-114119@2x.png)



![image-20200914141019992](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20200914141019992.png)



> 将token复制下来，下一步会用到。

# 2.项目设置

![WX20200914-115913@2x](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200914-115913@2x.png)

> 将名字保存下，后面会用到

# 3. 配置项目路径

package.json 配置 homepage

```js
//"homepage": "https://[用户名].github.io/[仓库名称]",
"homepage": "https://xiaolannuoyi.github.io/vue-running/",
```

vue.config.js

```js
publicPath: process.env.NODE_ENV === "production" ? "/vue-running" : "/",
```



# 4. 配置文件

项目根目录下，新建 `.github/workflows/ci.yml`

文件内容如下，将  ` secrets.ACTION_TOKEN ` 中的`ACTION_TOKEN`替换成`第二步中的名字`。



文件参数：[阮一峰 GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

```js
# 工作流名称，不设置的话默认取配置文件名
name: Build and Deploy
# 指定触发 workflow 的条件
# 指定触发事件时，可以限定分支或标签
# 当前是 只有 master分支上触发 push 事件时才执行工作流任务
on: 
  push:
    branches:
      - master
# 工作流执行的一个或多个任务
jobs:
  # 任务名称
  build-and-deploy:
    # 任务运行的容器类型（虚拟机环境）
    runs-on: ubuntu-latest
    # 任务执行的步骤
    steps:
      # 步骤名称
      - name: Checkout 🛎️
        # 使用的操作 actions，可以使用公共仓库，本地仓库，别人的仓库的action
        # 拉取代码
        uses: actions/checkout@master

      - name: Build and Deploy
        # 构建发布 Github pages
        uses: JamesIves/github-pages-deploy-action@master
        # 该步骤所需的环境变量
        env:
          ACCESS_TOKEN: ${{ secrets.ACTION_TOKEN }}
          # 在部署前要checkout的基本分支，默认是master
          BASE_BRANCH: master # The branch the action should deploy from.
          # 指定部署的分支，默认是 gh-pages 分支
          BRANCH: gh-pages # The branch the action should deploy to.
          # 存储库中要部署的文件夹。
          # 该步骤会将项目中 FOLDER 指定文件夹下的文件推送到 BRANCH 分支，作为Github Pages 部署的内容。
          # Vue CLI默认打包到 dist 目录
          FOLDER: dist # The folder the action should deploy.
          # 在向 BRANCH 分支推送代码前，可以指定构建脚本
          BUILD_SCRIPT: npm install && npm run build # The build script the action should run prior to deploying.

```



# 最后

在master分支提交脚本后，等待工作流⌛️跑完（工作流流水线和日志可点击项目的`Actions`入口进入查看）。

![image-20200914141323552](https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20200914141323552.png)

