module.exports = {
  title: "潇蓝诺依",
  description: '相逢正遇素锦年华时，未晚',
  //   dest: "",//指定 vuepress build 的输出目录
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  base: '/notes/',
  theme: 'reco',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      { text: 'sidebar', link: '/views/前端/面试/' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },

    ],
    sidebar: {
      '/views/前端/面试/': [
        {
          title: '面试',
          collapsable: true,
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
      ]
    },
    type: 'blog',
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'tag' // 默认 “标签”
      }
    },
    logo: '/avatar.jpg',
    authorAvatar: '/avatar.jpg',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    subSidebar: 'auto',
    sidebarDepth: 4,
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: '潇蓝诺依',
    // 备案号
    record: 'xxxx',
    // 项目开始时间
    startYear: '2020',
    /**
     * 密钥 (if your blog is private)
     */
    // keyPage: {
    //     keys: ['e10adc3949ba59abbe56e057f20f883e'], // 1.3.0 版本后需要设置为密文
    //     color: '#42b983', // 登录页动画球的颜色
    //     lineColor: '#42b983' // 登录页动画线的颜色
    // }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    [
      require('@vuepress-reco/vuepress-plugin-kan-ban-niang'),
      {
        theme: ['wanko'],
      }
    ],
    [
      require('@vuepress-reco/vuepress-plugin-bgm-player'),
      {
        audios: [
          {
            name: '能够成家吗',
            artist: '咖啡少年',
            url: 'https://assets.smallsunnyfox.com/music/1.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/1.jpg'
          },
          {
            name: '江南地铁站4号出口',
            artist: 'Plastic / Fallin` Dild',
            url: 'https://assets.smallsunnyfox.com/music/2.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
          },
          {
            name: '用胳膊当枕头',
            artist: '최낙타',
            url: 'https://assets.smallsunnyfox.com/music/3.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/3.jpg'
          }
        ]
      }
    ]
  ]
}
