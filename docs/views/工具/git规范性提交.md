---
title: git规范性提交
date: 2020-09-22
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 工具
tags:
 - 工具
---



## [Commitizen](https://github.com/commitizen/cz-cli)

全局安装

```js
npm install -g commitizen
```



## cz-conventional-changelog

项目内安装

```js
commitizen init cz-conventional-changelog --save --save-exact
```



> 如果当前已经有其他适配器被使用，则会报以下错误，此时可以加上`--force`选项进行再次初始化。
>
> ```js
> Error: A previous adapter is already configured. Use --force to override
> ```



::: details

初始化命令主要进行了3件事情

1. 在项目中安装**cz-conventional-changelog** 适配器依赖
2. 将适配器依赖保存到`package.json`的`devDependencies`字段信息
3. 在`package.json`中新增`config.commitizen`字段信息，主要用于配置cz工具的适配器路径：

```js
"devDependencies": {
 "cz-conventional-changelog": "^2.1.0"
},
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
}
```

:::



## [cz-customizable](https://github.com/leoforfree/cz-customizable)

```js
npm install cz-customizable --save-dev
```

修改package.json

```js
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
```

项目根目录下添加 `.cz-config.js` 文件，[官方demo](https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js)

个人中文配置如下：

::: details

```js
module.exports = {
  // type 类型
  types: [
    { value: 'feat', name: 'feat:     新增产品功能' },
    { value: 'fix', name: 'fix:      修复 bug' },
    { value: 'docs', name: 'docs:     文档的变更' },
    {
      value: 'style',
      name:
        'style:    不改变代码功能的变动(如删除空格、格式化、去掉末尾分号等)',
    },
    {
      value: 'refactor',
      name: 'refactor: 重构代码。不包括 bug 修复、功能新增',
    },
    {
      value: 'perf',
      name: 'perf:     性能优化',
    },
    { value: 'test', name: 'test:     添加、修改测试用例' },
    {
      value: 'build',
      name: 'build:    构建流程、外部依赖变更，比如升级 npm 包、修改 webpack 配置'
    },
    { value: 'ci', name: 'ci:       修改了 CI 配置、脚本' },
    {
      value: 'chore',
      name: 'chore:    对构建过程或辅助工具和库的更改,不影响源文件、测试用例的其他操作',
    },
    { value: 'revert', name: 'revert:   回滚 commit' },

  ],

  // scope 类型，针对 React 项目
  scopes: [
    ['components', '组件相关'],
    ['hooks', 'hook 相关'],
    ['hoc', 'HOC'],
    ['utils', 'utils 相关'],
    ['antd', '对 antd 主题的调整'],
    ['element-ui', '对 element-ui 主题的调整'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['auth', '对 auth 修改'],
    ['other', '其他修改'],
    // 如果选择 custom ,后面会让你再输入一个自定义的 scope , 也可以不设置此项， 把后面的 allowCustomScopes 设置为 true
    ['custom', '以上都不是？我要自定义'],
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    };
  }),

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  // 可以设置 scope 的类型跟 type 的类型匹配项，例如: 'fix'
  /*
    scopeOverrides: {
      fix: [
        { name: 'merge' },
        { name: 'style' },
        { name: 'e2eTest' },
        { name: 'unitTest' }
      ]
    },
   */
  // 覆写提示的信息
  messages: {
    type: "请确保你的提交遵循了原子提交规范！\n选择你要提交的类型:",
    scope: '\n选择一个 scope (可选):',
    // 选择 scope: custom 时会出下面的提示
    customScope: '请输入自定义的 scope:',
    subject: '填写一个简短精炼的描述语句:\n',
    body: '添加一个更加详细的描述，可以附上新增功能的描述或 bug 链接、截图链接 (可选)。使用 "|" 换行:\n',
    breaking: '列举非兼容性重大的变更 (可选):\n',
    footer: '列举出所有变更的 ISSUES CLOSED  (可选)。 例如.: #31, #34:\n',
    confirmCommit: '确认提交?',
  },

  // 是否允许自定义填写 scope ，设置为 true ，会自动添加两个 scope 类型 [{ name: 'empty', value: false },{ name: 'custom', value: 'custom' }]
  // allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  // skipQuestions: [],

  // subject 限制长度
  subjectLimit: 100,
  // breaklineChar: '|', // 支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
};
```

:::

## 提交

```js
git cz
```

<img src="https://gitee.com/xiaolannuoyi/my_drawing_bed/raw/master/image/image-20200922101939197.png" alt="image-20200922101939197" style="zoom:50%;" />



[参考文章](https://juejin.im/post/6844903831893966856)

