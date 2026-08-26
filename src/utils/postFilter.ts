import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * /daily/ 下是私人日记。旧站把它们放在独立 section、刻意不收进文章归档，
 * 迁移后保持同样的行为：文章页仍可访问，但不出现在首页、归档、标签和 RSS 里。
 */
export const isPublicPost = (post: CollectionEntry<"posts">) =>
  !post.id.startsWith("daily/");

/**
 * 这篇文章是否应该被生成为页面。
 *
 * 只看草稿与定时发布，**不看是否公开**——日记不进任何列表，但它的页面必须
 * 照常生成，否则旧地址 /daily/2021-4-28/ 的重定向会指向一个 404。
 * 路由的 getStaticPaths 应该用这个，而不是 postFilter。
 */
export function isRenderable({ data }: CollectionEntry<"posts">) {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
}

/**
 * Determines whether a post is eligible to be listed.
 *
 * - Excludes drafts always
 * - Excludes private diary entries (see `isPublicPost`)
 * - In production, excludes scheduled posts until `pubDatetime` minus the configured margin
 * - In dev, always shows non-draft posts to make authoring easier
 *
 * 用于列表、归档、标签、RSS、搜索索引；**不要**用于生成路由。
 */
export function postFilter(post: CollectionEntry<"posts">) {
  return isRenderable(post) && isPublicPost(post);
}
