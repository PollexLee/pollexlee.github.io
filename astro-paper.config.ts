import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://pollexlee.github.io/",
    title: "Pollex's blog",
    description: "移动端、工程实践与技术管理的记录。",
    author: "PollexLee",
    profile: "https://github.com/PollexLee",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    // 旧站首页每页 10 篇，沿用
    perPage: 10,
    perIndex: 10,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    // 源码仓库是私有工作流，不放"编辑此页"入口
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/PollexLee" },
    { name: "mail", url: "mailto:l6376751@gmail.com" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=推荐一篇文章&body=" },
  ],
});
