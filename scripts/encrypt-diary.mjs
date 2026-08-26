// 把 diary-src/ 下的日记明文加密成 src/data/diary/ 下的密文，供构建使用。
//
// 为什么要有这一步：本仓库是公开的，日记明文一旦入库，网站上的加密门帘就
// 形同虚设。所以明文只留在本地（diary-src/ 已 gitignore），仓库里只放密文。
// 这样构建过程完全不需要知道答案，CI 也不必配置任何 secret。
//
// 用法：DIARY_ANSWER=... node scripts/encrypt-diary.mjs
//   （答案也可以写在 .env 里，见下方读取逻辑）
//
// 改答案或改日记内容后都要重跑本脚本，然后提交 src/data/diary/ 的变更。
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { marked } from "marked";

const SRC = "diary-src";
const OUT = "src/data/diary";

// 与 src/components/DiaryGate.astro 的浏览器端解密必须严格一致
const PBKDF2_ITERATIONS = 250_000;

function readAnswer() {
  if (process.env.DIARY_ANSWER) return process.env.DIARY_ANSWER;
  // 退回读 .env，省得每次手输
  try {
    const env = fs.readFileSync(".env", "utf8");
    const m = /^DIARY_ANSWER=(.*)$/m.exec(env);
    if (m) return m[1].trim();
  } catch {
    /* .env 不存在就算了 */
  }
  return "";
}

/** 与构建端/浏览器端一致的答案规范化 */
const normalizeAnswer = s => s.replace(/[\s　]/g, "");

function encrypt(plaintext, answer) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(
    normalizeAnswer(answer),
    salt,
    PBKDF2_ITERATIONS,
    32,
    "sha256"
  );
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return {
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    // GCM 认证标签拼在密文尾部，浏览器端 subtle.decrypt 正是这个约定
    data: Buffer.concat([encrypted, cipher.getAuthTag()]).toString("base64"),
    iterations: PBKDF2_ITERATIONS,
  };
}

const answer = readAnswer();
if (!answer) {
  console.error("缺少 DIARY_ANSWER（环境变量或 .env）。未做任何改动。");
  process.exit(1);
}

if (!fs.existsSync(SRC)) {
  console.error(`找不到 ${SRC}/，未做任何改动。`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
// 先清掉旧密文，避免删掉某篇日记后残留
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith(".json")) fs.unlinkSync(path.join(OUT, f));
}

const entries = [];
for (const file of fs.readdirSync(SRC).sort()) {
  if (!file.endsWith(".md")) continue;
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(SRC, file), "utf8");

  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  const body = fm ? raw.slice(fm[0].length) : raw;
  const meta = fm?.[1] ?? "";
  const title = (/^title:\s*['"]?(.*?)['"]?\s*$/m.exec(meta)?.[1] ?? slug).trim();
  const dateStr = /^pubDatetime:\s*(.*)$/m.exec(meta)?.[1]?.trim();
  const date = dateStr ? new Date(dateStr) : new Date(`${slug}T00:00:00+08:00`);

  const html = marked.parse(body);
  fs.writeFileSync(
    path.join(OUT, `${slug}.json`),
    JSON.stringify(encrypt(html, answer), null, 1)
  );
  entries.push({ slug, title, date });
  console.log(`  加密 ${file} -> ${OUT}/${slug}.json`);
}

// 列表页的标题与日期同样加密，避免泄露"哪天写过日记"
entries.sort((a, b) => b.date - a.date);
const listing = entries.map(e => ({
  url: `/diary/${e.slug}/`,
  title: e.title,
  date: e.date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }),
}));
fs.writeFileSync(
  path.join(OUT, "_index.json"),
  JSON.stringify(encrypt(JSON.stringify(listing), answer), null, 1)
);

console.log(`\n完成：${entries.length} 篇日记 + 列表，已写入 ${OUT}/`);
console.log("请提交 src/data/diary/ 的变更（明文不会入库）。");
