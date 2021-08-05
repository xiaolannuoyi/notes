(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{565:function(s,a,t){"use strict";t.r(a);var n=t(4),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"_1-personal-access-tokens"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-personal-access-tokens"}},[s._v("#")]),s._v(" 1.Personal access tokens")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200914-114119@2x.png",alt:"WX20200914-114119@2x"}})]),s._v(" "),t("p",[t("img",{attrs:{src:"https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20200914141019992.png",alt:"image-20200914141019992"}})]),s._v(" "),t("blockquote",[t("p",[s._v("将token复制下来，下一步会用到。")])]),s._v(" "),t("h1",{attrs:{id:"_2-项目设置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-项目设置"}},[s._v("#")]),s._v(" 2.项目设置")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/WX20200914-115913@2x.png",alt:"WX20200914-115913@2x"}})]),s._v(" "),t("blockquote",[t("p",[s._v("将名字保存下，后面会用到")])]),s._v(" "),t("h1",{attrs:{id:"_3-配置项目路径"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-配置项目路径"}},[s._v("#")]),s._v(" 3. 配置项目路径")]),s._v(" "),t("p",[s._v("package.json 配置 homepage")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v('//"homepage": "https://[用户名].github.io/[仓库名称]",')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"homepage"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://xiaolannuoyi.github.io/vue-running/"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("p",[s._v("vue.config.js")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[s._v("publicPath"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" process"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("env"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("NODE_ENV")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"production"')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/vue-running"')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("h1",{attrs:{id:"_4-配置文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-配置文件"}},[s._v("#")]),s._v(" 4. 配置文件")]),s._v(" "),t("p",[s._v("项目根目录下，新建 "),t("code",[s._v(".github/workflows/ci.yml")])]),s._v(" "),t("p",[s._v("文件内容如下，将  "),t("code",[s._v("secrets.ACTION_TOKEN")]),s._v(" 中的"),t("code",[s._v("ACTION_TOKEN")]),s._v("替换成"),t("code",[s._v("第二步中的名字")]),s._v("。")]),s._v(" "),t("p",[s._v("文件参数："),t("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("阮一峰 GitHub Actions 入门教程"),t("OutboundLink")],1)]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[s._v("# 工作流名称，不设置的话默认取配置文件名\nname"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Build and Deploy\n# 指定触发 workflow 的条件\n# 指定触发事件时，可以限定分支或标签\n# 当前是 只有 master分支上触发 push 事件时才执行工作流任务\non"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" \n  push"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("\n    branches"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" master\n# 工作流执行的一个或多个任务\njobs"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("\n  # 任务名称\n  build"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("and"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("deploy"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("\n    # 任务运行的容器类型（虚拟机环境）\n    runs"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("on"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ubuntu"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("latest\n    # 任务执行的步骤\n    steps"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("\n      # 步骤名称\n      "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" name"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Checkout 🛎️\n        # 使用的操作 actions，可以使用公共仓库，本地仓库，别人的仓库的action\n        # 拉取代码\n        uses"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" actions"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("checkout@master\n\n      "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" name"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" Build and Deploy\n        # 构建发布 Github pages\n        uses"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" JamesIves"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("github"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("pages"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("deploy"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("action@master\n        # 该步骤所需的环境变量\n        env"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("\n          "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("ACCESS_TOKEN")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" $"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" secrets"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("ACTION_TOKEN")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n          # 在部署前要checkout的基本分支，默认是master\n          "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("BASE_BRANCH")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" master # The branch the action should deploy "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("from")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n          # 指定部署的分支，默认是 gh"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("pages 分支\n          "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("BRANCH")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" gh"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("pages # The branch the action should deploy to"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n          # 存储库中要部署的文件夹。\n          # 该步骤会将项目中 "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("FOLDER")]),s._v(" 指定文件夹下的文件推送到 "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("BRANCH")]),s._v(" 分支，作为Github Pages 部署的内容。\n          # Vue "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("CLI")]),s._v("默认打包到 dist 目录\n          "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("FOLDER")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" dist # The folder the action should deploy"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n          # 在向 "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("BRANCH")]),s._v(" 分支推送代码前，可以指定构建脚本\n          "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("BUILD_SCRIPT")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" npm install "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" npm run build # The build script the action should run prior to deploying"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br"),t("span",{staticClass:"line-number"},[s._v("35")]),t("br"),t("span",{staticClass:"line-number"},[s._v("36")]),t("br"),t("span",{staticClass:"line-number"},[s._v("37")]),t("br"),t("span",{staticClass:"line-number"},[s._v("38")]),t("br"),t("span",{staticClass:"line-number"},[s._v("39")]),t("br"),t("span",{staticClass:"line-number"},[s._v("40")]),t("br")])]),t("h1",{attrs:{id:"最后"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#最后"}},[s._v("#")]),s._v(" 最后")]),s._v(" "),t("p",[s._v("在master分支提交脚本后，等待工作流⌛️跑完（工作流流水线和日志可点击项目的"),t("code",[s._v("Actions")]),s._v("入口进入查看）。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20200914141323552.png",alt:"image-20200914141323552"}})])])}),[],!1,null,null,null);a.default=e.exports}}]);