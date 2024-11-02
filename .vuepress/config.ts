import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
export default defineUserConfig({
  title: "vuepress-theme-reco",
  description: "Just playing around",
  bundler: viteBundler(),
  // bundler: webpackBundler(),
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "潇蓝诺依",
    authorAvatar: "/avatar.jpg",
    docsRepo: "",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",
    // series 为原 sidebar
    series: {
      '/blogs/前端/面试/': [
        {
          text: '面试',
          children: [
            '2-类型转换',
            '3-调用堆栈',
            '4-this与作用域',
            '5-v8引擎相关',
            '6-算法',
            '原型',
            'set and map',
          ]
        },
      ],
      '/blogs/前端/Element-Plus 源码分析/': [
        {
          text: 'Element-Plus 源码分析',
          children: [
            'icon',
            'layout',
            'radio',
            'checkbox',
            'input',
            'input-number',
            'switch',
            'pagination',
            'rate'
          ]
        },
      ]
    },
    navbar: [
      { text: 'Home', link: '/' },
      // {
      //   text: 'notes',
      //   children: [
      //     { text: '面试', link: '/blogs/前端/面试/' },
      //     { text: 'Element-Plus 源码分析', link: '/blogs/前端/Element-Plus 源码分析/' }
      //   ]
      // },
      { text: 'TimeLine', link: '/timeline/', },
      {
        text: 'Contact',
        children: [
          { text: 'github', link: 'https://github.com/xiaolannuoyi/notes' },
          { text: 'csdn', icon: 'reco-csdn', link: 'https://blog.csdn.net/qq_31126175' }
        ]
      },
    ],
    // bulletin: {
    //   body: [
    //     {
    //       type: "text",
    //       content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "QQ 群",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li>QQ群1：1037296104</li>
    //         <li>QQ群2：1061561395</li>
    //         <li>QQ群3：962687802</li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "GitHub",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "buttongroup",
    //       children: [
    //         {
    //           text: "打赏",
    //           link: "/docs/others/donate.html",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true
});
