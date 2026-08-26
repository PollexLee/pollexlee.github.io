/**
 * 私人日记的验证配置。
 *
 * 问题与答案都以 Base64 字符串的形式呈现：页面上直接显示 Base64，
 * 输入框里要填的也是答案的 Base64。也就是说，能进来的人得先自己
 * 意识到这是 Base64 并解开它——这层门槛是刻意的。
 *
 * 答案本身不在仓库里：日记明文放在 diary-src/（已 gitignore），
 * 由 scripts/encrypt-diary.mjs 加密成 src/data/diary/ 下的密文后提交。
 * 因此构建过程不需要答案，CI 也不必配置任何 secret。
 */

/** 页面上原样显示的问题（Base64("我女儿的名字？")） */
export const DIARY_QUESTION = "5oiR5aWz5YS/55qE5ZCN5a2X77yf";

/** 输入提示，别把答案说漏 */
export const DIARY_HINT = "答案同样是 Base64";
