import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

// 旧 Hugo 站点遗留的地址。这些 URL 站外可能已被引用或被搜索引擎收录，
// 迁移后必须继续可达，否则就是死链。
// - /posts/flutter/2月N日/ 与 /2月17日/ 是旧构建产生的重复地址，指回正规地址
// - /test/、/daily/ 下的文章已并入 /posts/
// - /page/N/ 是旧的首页分页
const legacyRedirects = {
  "/posts/flutter/2月10日": "/posts/2月10日/",
  "/posts/flutter/2月11日": "/posts/2月11日/",
  "/posts/flutter/2月12日": "/posts/2月12日/",
  "/posts/flutter/2月13日": "/posts/2月13日/",
  "/posts/flutter/2月14日": "/posts/2月14日/",
  "/2月17日": "/posts/2月17日/",
  "/test/2月16日": "/posts/从产品和运营的角度来看待技术转变/",
  "/daily/2021-4-28": "/posts/daily/2021-04-28/",
  "/daily/2021-5-20": "/posts/daily/2021-05-20/",
  "/test": "/posts/",
  "/daily": "/posts/",
  "/readme": "/about/",
  "/page/1": "/",
  "/page/2": "/posts/",
  "/page/3": "/posts/",
  "/page/4": "/posts/",
  "/page/5": "/posts/",
  "/page/6": "/posts/",
};

export default defineConfig({
  site: config.site.url,
  redirects: legacyRedirects,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        (config.features?.showArchives !== false ||
          !page.endsWith("/archives/")) &&
        // /daily/ 下是私人日记，页面可直接访问但不主动提交给搜索引擎
        !page.includes("/posts/daily/"),
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
