/**
 * Slug 规则必须与旧 Hugo 站点的 urlize 保持一致：小写 + 空格转连字符，
 * 其余字符（含中文）原样保留。
 *
 * 主题原本对含非拉丁字符的串走 lodash.kebabcase，会把「30天学习打卡」变成
 * 「30-天学习打卡」——在数字与中文之间插入连字符，这会打断旧站
 * /tags/30天学习打卡/ 这个覆盖 27 篇文章的标签地址。故整体替换为旧站规则。
 */
export const slugifyStr = (str: string): string =>
  str.toLowerCase().trim().replace(/\s+/g, "-");

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
