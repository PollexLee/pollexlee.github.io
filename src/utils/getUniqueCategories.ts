import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Category = {
  category: string;
  categoryName: string;
};

/**
 * Builds a de-duplicated, sorted category list from posts.
 *
 * 分类是旧 Hugo 站点的一个维度（8 个分类），AstroPaper 原生只有 tags，
 * 这里按 getUniqueTags 的同样形状补出来，以保住 /categories/ 下的旧地址。
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  const categories: Category[] = posts
    .filter(postFilter)
    .flatMap(post => post.data.categories)
    .map(category => ({
      category: slugifyStr(category),
      categoryName: category,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex(c => c.category === value.category) === index
    )
    .sort((a, b) => a.category.localeCompare(b.category));

  return categories;
}
