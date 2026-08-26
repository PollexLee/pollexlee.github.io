import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * Returns posts that are eligible to be shown to users, sorted by publish date
 * descending.
 *
 * 主题原本按 `modDatetime ?? pubDatetime`（最后更新）排序。本站文章的
 * modDatetime 全部来自旧站的批量构建时间戳而非真实修改时间，按它排序会打乱
 * 与旧站一致的文章顺序，因此固定按发布时间排序。
 *
 * Note: filtering respects drafts and scheduled posts via `postFilter()`.
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
    );
}
