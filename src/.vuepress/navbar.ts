import { navbar } from "vuepress-theme-hope";

export const navbarZh = navbar([
  "/zh/",

  {
    text: "笔记",
    icon: "pen-to-square",
    prefix: "/zh/notes/",
    children: [
      {
        text: "前端基础",
        icon: "code",
        prefix: "frontend/",
        children: [
          { text: "HTML", icon: "code", link: "html" },
          { text: "CSS", icon: "code", link: "css" },
          { text: "JavaScript", icon: "code", link: "javascript" },
          { text: "Vue", icon: "code", link: "vue" },
          { text: "框架学习", icon: "code", link: "framework" },
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
    text: "探索",
    icon: "magnifying-glass",
    children: [
      { text: "全部分类", icon: "folder-tree", link: "/zh/category/" },
      { text: "所有标签", icon: "tag", link: "/zh/tag/" },
      { text: "时间轴", icon: "clock", link: "/zh/timeline/" },
    ],
  },

  {
    text: "关于本站",
    icon: "circle-info",
    children: [
      { text: "个人主页", icon: "user", link: "/zh/about/homepage" },
      { text: "联系作者", icon: "envelope", link: "/zh/about/contact" },
      { text: "友情链接", icon: "link", link: "/zh/about/links" },
      { text: "工作装备", icon: "laptop-code", link: "/zh/about/equipment" },
      { text: "GitHub 主页", icon: "github", link: "https://github.com/gingesmallfish" },
    ],
  },
]);

export const navbarEn = navbar([
  "/en/",

  {
    text: "Notes",
    icon: "pen-to-square",
    prefix: "/en/notes/",
    children: [
      {
        text: "Frontend Basics",
        icon: "code",
        prefix: "frontend/",
        children: [
          { text: "HTML", icon: "code", link: "html" },
          { text: "CSS", icon: "code", link: "css" },
          { text: "JavaScript", icon: "code", link: "javascript" },
          { text: "Vue", icon: "code", link: "vue" },
          { text: "Frameworks", icon: "code", link: "framework" },
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
    text: "Explore",
    icon: "magnifying-glass",
    children: [
      { text: "Categories", icon: "folder-tree", link: "/en/category/" },
      { text: "Tags", icon: "tag", link: "/en/tag/" },
      { text: "Timeline", icon: "clock", link: "/en/timeline/" },
    ],
  },

  {
    text: "About",
    icon: "circle-info",
    children: [
      { text: "Homepage", icon: "user", link: "/en/about/homepage" },
      { text: "Contact Me", icon: "envelope", link: "/en/about/contact" },
      { text: "Links", icon: "link", link: "/en/about/links" },
      { text: "My Gear", icon: "laptop-code", link: "/en/about/equipment" },
      { text: "GitHub", icon: "github", link: "https://github.com/gingesmallfish" },
    ],
  },
]);