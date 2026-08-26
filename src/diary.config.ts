/**
 * 私人日记的验证配置。
 *
 * 问题与提示都以 Base64 原样显示在页面上——想进来的人得先自己认出这是
 * Base64 并解开它，这层门槛是刻意的。答案则用明文输入。
 *
 * 答案本身不在仓库里：日记明文放在 diary-src/（已 gitignore），
 * 由 scripts/encrypt-diary.mjs 加密成 src/data/diary/ 下的密文后提交。
 * 因此构建过程不需要答案，CI 也不必配置任何 secret。
 */

/** 页面上原样显示。Base64("我女儿的名字？") */
export const DIARY_QUESTION = "5oiR5aWz5YS/55qE5ZCN5a2X77yf";

/** 页面上原样显示。Base64("答案是两个字，直接输入中文") */
export const DIARY_HINT = "562U5qGI5piv5Lik5Liq5a2X77yM55u05o6l6L6T5YWl5Lit5paH";
