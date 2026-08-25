// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// 旧 Hugo 站点遗留的地址。这些 URL 在站外可能已被引用或被搜索引擎收录，
// 迁移后必须继续可达，否则就是死链。
// - /posts/flutter/2月N日/ 与 /2月17日/ 是旧构建产生的重复地址，指回正规地址
// - /test/、/daily/ 下的文章已并入 /posts/
// - /page/N/ 是旧的首页分页
const legacyRedirects = {
	'/posts/flutter/2月10日': '/posts/2月10日/',
	'/posts/flutter/2月11日': '/posts/2月11日/',
	'/posts/flutter/2月12日': '/posts/2月12日/',
	'/posts/flutter/2月13日': '/posts/2月13日/',
	'/posts/flutter/2月14日': '/posts/2月14日/',
	'/2月17日': '/posts/2月17日/',
	'/test/2月16日': '/posts/从产品和运营的角度来看待技术转变/',
	'/daily/2021-4-28': '/posts/daily/2021-04-28/',
	'/daily/2021-5-20': '/posts/daily/2021-05-20/',
	'/test': '/posts/',
	'/daily': '/posts/',
	'/readme': '/about/',
	'/page/1': '/',
	'/page/2': '/posts/',
	'/page/3': '/posts/',
	'/page/4': '/posts/',
	'/page/5': '/posts/',
	'/page/6': '/posts/',
};

// https://astro.build/config
export default defineConfig({
	site: 'https://pollexlee.github.io',
	integrations: [mdx(), sitemap()],
	redirects: legacyRedirects,
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
