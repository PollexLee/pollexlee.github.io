import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 与旧 Hugo 站点 urlize 规则一致：小写 + 空格转连字符，中文原样保留。
 * 必须保持一致，否则 /tags/data-binding/ 这类旧链接会失效。
 */
export const slugify = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-');

export type Post = CollectionEntry<'blog'>;

export const byDateDesc = (a: Post, b: Post) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/**
 * /daily/ 下是私人日记。旧站把它们放在独立 section、刻意不收进文章归档，
 * 这里保持同样的行为：页面仍然可访问，但不出现在首页、归档和 RSS 里。
 */
export const isPublicPost = (post: Post) => !post.id.startsWith('daily/');

/** 对外展示用的文章列表（已排除日记、按时间倒序） */
export async function publicPosts() {
	return (await getCollection('blog')).filter(isPublicPost).sort(byDateDesc);
}

/** 收集某个分类维度下的 slug -> { name, posts } */
export async function groupBy(field: 'tags' | 'categories') {
	const posts = (await getCollection('blog')).sort(byDateDesc);
	const map = new Map<string, { name: string; posts: Post[] }>();
	for (const post of posts) {
		for (const name of post.data[field] ?? []) {
			const slug = slugify(name);
			if (!map.has(slug)) map.set(slug, { name, posts: [] });
			map.get(slug)!.posts.push(post);
		}
	}
	return map;
}
