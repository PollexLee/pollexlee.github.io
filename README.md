# Pollex's blog

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题的静态博客，
由 GitHub Actions 自动部署到 <https://pollexlee.github.io/>。

## 写一篇新文章

在 `src/content/posts/` 下建一个 `.md` 文件，文件路径决定文章地址：

| 文件 | 地址 |
| --- | --- |
| `src/content/posts/我的新文章.md` | `/posts/我的新文章/` |
| `src/content/posts/flutter/某主题.md` | `/posts/flutter/某主题/` |

内容格式：

```markdown
---
title: "文章标题"
description: "一句话摘要，会出现在列表、搜索结果和 RSS 里"
pubDatetime: 2026-08-25T10:00:00+08:00
tags: ["Flutter", "Android"]
categories: ["移动端"]
---

正文从这里开始，标准 Markdown。
```

注意几点：

- `title`、`description`、`pubDatetime` 必填。
- **`pubDatetime` 不要加引号** —— schema 要的是 YAML 时间戳，加了引号会变字符串导致构建失败。
- `tags`、`categories` 可选，写了就自动出现在 `/tags/` 和 `/categories/` 页面。
- 想暂时不发布，加 `draft: true`。
- 想置顶到首页「精选」，加 `featured: true`。

图片放 `public/images/`，正文里用 `/images/xxx.png` 引用。**不要用外链图床** ——
本站有 8 张图就是因为图床和外部仓库消失而永久丢失的。

写完提交推送到 `main`，Actions 会自动构建部署，约 1-2 分钟后生效。

## 本地开发

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` 包含类型检查和 Pagefind 搜索索引生成。**不要用 `npx astro build` 代替** ——
那会跳过搜索索引，导致线上搜索为空。搜索功能在 `npm run dev` 下不可用，要
`npm run build && npm run preview` 才能验证。

## 私人日记（/diary/）

**本仓库是公开的，所以日记明文一行都不进仓库。** 分工是这样的：

| 位置 | 内容 | 是否入库 |
| --- | --- | --- |
| `diary-src/*.md` | 日记明文 | ❌ 已 gitignore，只在本机 |
| `src/data/diary/*.json` | 加密后的密文 | ✅ 入库 |
| `.env` 的 `DIARY_ANSWER` | 答案 | ❌ 已 gitignore |

加密方式：答案经 PBKDF2（SHA-256，25 万次迭代）派生密钥，AES-256-GCM 加密。
**验证 = 解密**：答对才能在浏览器里解出来，答错就是 GCM 完整性校验失败。页面上
没有答案、也没有答案的哈希，因此没有任何可反推答案的东西。

问题和答案都以 Base64 形式呈现：页面上直接显示 `5oiR5aWz5YS/55qE5ZCN5a2X77yf`，
输入框里填的也是答案的 Base64。这层门槛是刻意的 —— 得先自己认出这是 Base64。

因为密文是本地生成后提交的，**构建过程不需要知道答案，CI 也不用配任何 secret**。

### 写一篇新日记

```bash
# 1. 在 diary-src/ 下新建 <日期>.md，front matter 只要 title 和 pubDatetime
# 2. 加密（答案从 .env 读）
node scripts/encrypt-diary.mjs
# 3. 提交 src/data/diary/ 的变更即可，明文不会被提交
```

注意：**不要给日记写 `description`** —— 那个字段会进 HTML meta，等于明文泄露。
改答案或改内容后都要重跑加密脚本，因为密文是用旧答案加的。

日记不进首页、归档、标签、RSS、搜索索引和 sitemap。验证通过后答案存在
sessionStorage，关掉标签页即失效。

> 历史遗留：这两篇日记在 Hugo 时代（`/daily/2021-4-28/`）曾长期公开可访问，
> 早期提交里也有明文。上述机制只保证「从现在起不再公开」，git 历史未做清理。

## 本站对主题做了哪些改动

主题是上游 AstroPaper，为了迁移兼容和中文适配改了这些地方，升级主题时要留意：

| 文件 | 改动原因 |
| --- | --- |
| `src/utils/slugify.ts` | 整体替换为旧站 Hugo 的 urlize 规则。上游对非拉丁字符用 `lodash.kebabcase`，会把 `30天学习打卡` 变成 `30-天学习打卡`，打断旧标签地址 |
| `src/utils/getSortedPosts.ts` | 改为按 `pubDatetime` 排序。上游按「最后更新」排序，而本站文章的修改时间全是旧站的批量构建时间戳 |
| `src/utils/postFilter.ts` | 增加 `isPublicPost`，把 `/daily/` 下的私人日记排除在列表、RSS、搜索之外 |
| `src/content.config.ts` | 加 `categories` 字段（上游只有 tags）；`tags` 默认值由 `["others"]` 改为空数组，避免凭空多出 `/tags/others/` |
| `src/components/Datetime.astro` | 日期格式由 `D MMM, YYYY` 改为中文 |
| `src/components/TableOfContents.astro` | 新增。上游的 remark-toc 要求每篇文章手写 `## Table of contents` 标题，侵入正文；改为从 headings 自动生成 |
| `src/pages/categories/` | 新增，对应旧站的 8 个分类地址 |
| `src/i18n/lang/zh-CN.ts` | 新增中文语言包 |
| `astro.config.ts` | 加 `legacyRedirects` 重定向表和 zh-CN locale |

## 迁移备忘

本站由旧 Hugo 站点迁移而来（更早还用过 Hexo），两代源码均已丢失，62 篇文章是从
构建产物反解回 Markdown 的。迁移时保证了：

- 旧站 **131 个 URL 全部可达**，无法直接复原的重复地址走 `astro.config.ts` 的重定向表
- `/tags/`、`/categories/` 的地址规则与旧站 Hugo 的 urlize 一致（42 + 8 个地址逐一核对）
- 25 篇在 Hexo→Hugo 迁移中丢失日期的文章，发布时间从 git 历史里的 Hexo 产物快照逐篇比对恢复
- `/daily/` 下的私人日记保持旧站行为：页面可访问，但不进首页、归档、搜索和 RSS

`scripts/import-from-hugo.mjs` 是当时的一次性导入脚本，已完成使命，仅作存档。

主题基于 [AstroPaper](https://github.com/satnaing/astro-paper)（MIT），见 `LICENSE`。
