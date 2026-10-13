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
  locales: {
    '/': {
      lang: 'en-US',
      title: "Jiang's Blog",
      description: 'Geek notes powered by vuepress-theme-hope',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: "Jiang's Blog",
      description: 'vuepress-theme-hope 的极客笔记',
    },
  },
  theme, // 主题配置
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
  plugins: [aiSummaryPlugin],
})