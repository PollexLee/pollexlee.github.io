# Pollex's blog

Astro 驱动的静态博客，构建产物由 GitHub Actions 自动部署到 <https://pollexlee.github.io/>。

## 写一篇新文章

在 `src/content/blog/` 下建一个 `.md` 文件，文件路径决定文章地址：

| 文件 | 地址 |
| --- | --- |
| `src/content/blog/我的新文章.md` | `/posts/我的新文章/` |
| `src/content/blog/flutter/某主题.md` | `/posts/flutter/某主题/` |

内容格式：

```markdown
---
title: '文章标题'
description: '一句话摘要，会出现在首页列表和 RSS 里'
pubDate: '2026-08-25'
tags: ['Flutter', 'Android']
categories: ['移动端']
---

正文从这里开始，标准 Markdown。
```

`title`、`description`、`pubDate` 必填；`tags`、`categories` 可选，写了就会自动出现在
`/tags/` 和 `/categories/` 页面里，无需额外配置。

图片放 `public/images/`，正文里用 `/images/xxx.png` 引用。**不要用外链图床** ——
本站有 9 张图就是因为图床和外部仓库消失而永久丢失的。

写完提交推送到 `main`，Actions 会自动构建部署，约 1-2 分钟后生效。

## 本地预览

```bash
npm run dev
```

## 目录结构

```
src/
  content/blog/     文章 Markdown（唯一需要日常改动的地方）
  pages/            路由：首页、/posts/、/tags/、/categories/、/about/、RSS
  components/       Header / Footer / 日期等公共组件
  utils/taxonomy.ts 标签与分类的聚合逻辑，含旧站 slug 兼容规则
  consts.ts         站点标题、作者、邮箱等
astro.config.mjs    站点配置 + 旧站遗留 URL 的重定向表
scripts/            从旧 Hugo 产物导入文章的一次性脚本（已完成使命，留作存档）
```

## 迁移备忘

本站由旧的 Hugo 站点迁移而来（更早还用过 Hexo），源码已丢失，62 篇文章是从
构建产物反解回 Markdown 的。迁移时保证了：

- 旧站 131 个 URL 全部可达，无法直接复原的重复地址走 `astro.config.mjs` 里的重定向表
- `/tags/`、`/categories/` 的地址规则与旧站 Hugo 的 urlize 一致（小写 + 空格转连字符）
- 25 篇在 Hexo→Hugo 迁移中丢失日期的文章，发布时间从 git 历史里的 Hexo 产物中逐篇比对恢复
- `/daily/` 下的私人日记保持旧站行为：页面可访问，但不进首页、归档和 RSS

主题基于 Astro 官方 blog 模板（源自 [Bear Blog](https://github.com/HermanMartinus/bearblog/)）。
