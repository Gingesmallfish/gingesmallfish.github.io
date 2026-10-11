import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { resolve } from 'node:path'

import theme from './theme.js'
import aiSummaryPlugin from './plugins/ai-summary/index.js'

export default defineUserConfig({
  base: '/',

  head: [
    ['meta', { name: 'algolia-site-verification', content: '775E508DED4DF092' }],
  ],

  lang: 'zh-CN',

  locales: {
    '/': {
      lang: 'zh-CN',
      title: "Jiang's Blog",
      description: 'vuepress-theme-hope 的极客笔记',
    },
    '/en/': {
      lang: 'en-US',
      title: "Jiang's Blog",
      description: 'Geek notes powered by vuepress-theme-hope',
    },
  },

  theme,

  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          'vuepress-theme-hope/dist/client/blog': resolve(
              process.cwd(),
              'node_modules/vuepress-theme-hope/dist/client/blog.js',
          ),
        },
      },
    },
  }),

  // 直接传入插件对象，不要调用
  plugins: [aiSummaryPlugin],

  // shouldPrefetch: false,
})