import { sidebar } from "vuepress-theme-hope";

export const sidebarZh = sidebar({
  "/zh/": [
    "",
    {
      text: "笔记",
      icon: "pen-to-square",
      prefix: "notes/",
      collapsible: true,
      children: [
        {
          text: "前端基础",
          icon: "code",
          prefix: "frontend/",
          collapsible: true,
          children: [
            { text: "HTML", link: "html" },
            { text: "CSS", link: "css" },
            { text: "JavaScript", link: "javascript" },
            { text: "Vue", link: "vue" },
            { text: "框架学习", link: "framework" },
          ],
        },
      ],
    },
    {
      text: "项目",
      icon: "folder-open",
      link: "/zh/project/",
    },
    {
      text: "部署",
      icon: "rocket",
      link: "/zh/deploy/",
    },
    {
      text: "时间轴",
      icon: "clock",
      link: "/zh/timeline/",
    },
  ],

  "/zh/notes/": [
    {
      text: "前端基础",
      icon: "code",
      prefix: "frontend/",
      collapsible: true,
      children: [
        { text: "HTML", link: "html" },
        { text: "CSS", link: "css" },
        { text: "JavaScript", link: "javascript" },
        { text: "Vue", link: "vue" },
        { text: "框架学习", link: "framework" },
      ],
    },
  ],

  "/zh/about/": [
    {
      text: "关于本站",
      icon: "circle-info",
      collapsible: true,
      children: [
        { text: "个人主页", icon: "user", link: "homepage" },
        { text: "联系作者", icon: "envelope", link: "contact" },
        { text: "友情链接", icon: "link", link: "links" },
        { text: "工作装备", icon: "laptop-code", link: "equipment" },
      ],
    },
  ],
});

export const sidebarEn = sidebar({
  "/en/": [
    "",
    {
      text: "Notes",
      icon: "pen-to-square",
      prefix: "notes/",
      collapsible: true,
      children: [
        {
          text: "Frontend Basics",
          icon: "code",
          prefix: "frontend/",
          collapsible: true,
          children: [
            { text: "HTML", link: "html" },
            { text: "CSS", link: "css" },
            { text: "JavaScript", link: "javascript" },
            { text: "Vue", link: "vue" },
            { text: "Frameworks", link: "framework" },
          ],
        },
      ],
    },
    {
      text: "Projects",
      icon: "folder-open",
      link: "/en/project/",
    },
    {
      text: "Deploy",
      icon: "rocket",
      link: "/en/deploy/",
    },
    {
      text: "Timeline",
      icon: "clock",
      link: "/en/timeline/",
    },
  ],

  "/en/notes/": [
    {
      text: "Frontend Basics",
      icon: "code",
      prefix: "frontend/",
      collapsible: true,
      children: [
        { text: "HTML", link: "html" },
        { text: "CSS", link: "css" },
        { text: "JavaScript", link: "javascript" },
        { text: "Vue", link: "vue" },
        { text: "Frameworks", link: "framework" },
      ],
    },
  ],

  "/en/about/": [
    {
      text: "About",
      icon: "circle-info",
      collapsible: true,
      children: [
        { text: "Homepage", icon: "user", link: "homepage" },
        { text: "Contact Me", icon: "envelope", link: "contact" },
        { text: "Links", icon: "link", link: "links" },
        { text: "My Gear", icon: "laptop-code", link: "equipment" },
      ],
    },
  ],
});