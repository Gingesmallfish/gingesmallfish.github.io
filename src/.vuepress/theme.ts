import { hopeTheme } from "vuepress-theme-hope";

import { navbarZh, navbarEn } from "./navbar.js";
import { sidebarZh, sidebarEn } from "./sidebar.js";

export default hopeTheme({
  // 自定义域名
  hostname: "https://gingesmallfish.github.io",

  author: {
    name: "姜小鱼",
    url: "https://github.com/Gingesmallfish",
  },

  // logo: "https://theme-hope-assets.vuejs.press/logo.svg",

  // 长裤配置
  repo: "git@github.com:Gingesmallfish/gingesmallfish.github.io.git",

  docsDir: "src",

  // 页脚
  displayFooter: true,

  // 显示最后更新时间
  lastUpdated: true,
  contributors: true,

  // 博客相关（各语言共享）
  blog: {
    intro: "/zh/about/homepage.html",
    medias: {
      GitHub: "https://github.com/Gingesmallfish",
      Email: "1847535232@qq.com",
    },
  },

  // 多语言配置：导航栏、侧边栏、博客文案按语言区分
  locales: {
    "/zh/": {
      navbar: navbarZh,
      sidebar: sidebarZh,
      footer: "© 2026 姜小鱼",

      blog: {
        description: "姜小鱼的博客 - 我很懒，所以没有写简介",
        timeline: "时间轴",
      },

      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },

    "/en/": {
      navbar: navbarEn,
      sidebar: sidebarEn,
      footer: "© 2026 Jiang",

      blog: {
        timeline: "Timeline",
      },

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    markmap: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        // oxlint-disable-next-line typescript/consistent-return
        replacer: ({ tag }) => {
          if (tag === "em") {
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
          }
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,

    // 取消注释它们如果你需要 TeX 支持
    // math: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 @mathjax/src
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    revealjs: {
      plugins: ["highlight", "math", "search", "notes", "zoom"],
    },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    docsearch: {
      appId: "PAXT7KU86W",
      apiKey: "2447233fd15fec98c4aaaf08a0e52d7e",
      indexName: "gingesmallfish_pages",
      placeholder: "搜索笔记...",
      searchParameters: {
        facetFilters: [] // 强制清空语言过滤
      }
    },


    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    // 启用之前需安装 @vuepress/plugin-comment2
    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      prefix: "fa6-solid:",
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
}, { custom: true });