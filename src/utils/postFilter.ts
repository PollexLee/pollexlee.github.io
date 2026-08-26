import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * /daily/ 下是私人日记。旧站把它们放在独立 section、刻意不收进文章归档，
 * 迁移后保持同样的行为：文章页仍可访问，但不出现在首页、归档、标签和 RSS 里。
 */
export const isPublicPost = (post: CollectionEntry<"posts">) =>
  !post.id.startsWith("daily/");

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - Excludes drafts always
 * - Excludes private diary entries (see `isPublicPost`)
 * - In production, excludes scheduled posts until `pubDatetime` minus the configured margin
 * - In dev, always shows non-draft posts to make authoring easier
 */
export function postFilter(post: CollectionEntry<"posts">) {
  const { data } = post;
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return (
    !data.draft &&
    isPublicPost(post) &&
    (import.meta.env.DEV || isPublishTimePassed)
  );
}
