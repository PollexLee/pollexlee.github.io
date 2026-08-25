// 从旧 Hugo 构建产物反解出 Markdown 源文件。
// 用法: node scripts/import-from-hugo.mjs <产物目录> [--dry]
import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const SRC = process.argv[2];
const DRY = process.argv.includes('--dry');
const OUT = path.join(process.cwd(), 'src/content/blog');

const td = new TurndownService({
	headingStyle: 'atx',
	codeBlockStyle: 'fenced',
	bulletListMarker: '-',
	emDelimiter: '*',
});
td.use(gfm);

// chroma 的代码块已在预处理阶段还原成 <pre><code class="language-x">，
// turndown 默认规则能正确处理，这里只补上它认不出的裸 <pre>。
td.addRule('bareP re', {
	filter: (node) => node.nodeName === 'PRE' && !node.querySelector('code'),
	replacement: (content, node) => '\n```\n' + node.textContent.replace(/\n$/, '') + '\n```\n',
});

const unescape = (s) =>
	s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#34;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');

/** 取出 <div class="post-body">…</div> 的内容（按 div 配对，不能用贪婪匹配） */
function postBody(html) {
	const m = /<div class="post-body[^"]*"[^>]*>/.exec(html);
	if (!m) return '';
	const start = m.index + m[0].length;
	let depth = 1;
	const re = /<\/?div\b[^>]*>/g;
	re.lastIndex = start;
	let mm;
	while ((mm = re.exec(html))) {
		depth += mm[0].startsWith('</') ? -1 : 1;
		if (depth === 0) return html.slice(start, mm.index);
	}
	return html.slice(start);
}

/** Hugo chroma 代码块 -> 干净的 <pre><code class="language-x"> */
function normalizeCodeBlocks(html) {
	return html.replace(/<div class="highlight">[\s\S]*?<\/div>\s*<\/div>/g, (block) => {
		const lang = (/data-lang="([^"]*)"/.exec(block) || [, ''])[1];
		// 带行号时代码在第二个 <td class="lntd"> 里；不带行号时直接取 <code>
		const tds = block.match(/<td class="lntd">[\s\S]*?<\/td>/g);
		const scope = tds && tds.length > 1 ? tds[tds.length - 1] : block;
		const codeEl = /<code[^>]*>([\s\S]*?)<\/code>/.exec(scope);
		if (!codeEl) return block;
		const code = unescape(codeEl[1].replace(/<[^>]+>/g, ''));
		return `<pre><code class="language-${lang}">${code
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')}</code></pre>`;
	});
}

function clean(html) {
	return normalizeCodeBlocks(html)
		// 标题上的锚点链接（内含 svg 图标）
		.replace(/<a href="#[^"]*" class="anchor-link">[\s\S]*?<\/a>/g, '')
		.replace(/<svg[\s\S]*?<\/svg>/g, '')
		// Hugo 给外链加的属性，markdown 里不需要
		.replace(/ target="_blank" rel="noopener"/g, '');
}

// 归档页收录的 59 篇 + 散落在 /test/、/daily/ 下未进归档的 3 篇。
// 后者的 out 字段指定落盘路径（其旧 URL 由 astro.config 的 redirects 承接）。
const EXTRA_OUT = {
	'/test/2月16日/': '从产品和运营的角度来看待技术转变',
	'/daily/2021-4-28/': 'daily/2021-04-28',
	'/daily/2021-5-20/': 'daily/2021-05-20',
};
const meta = [
	...JSON.parse(fs.readFileSync('/tmp/meta.json', 'utf8')),
	...JSON.parse(fs.readFileSync('/tmp/meta_extra.json', 'utf8')),
];
// 25 篇文章在 Hexo->Hugo 迁移时丢了 date（被写成 Unix 纪元 1969-07-20）。
// 这里的日期是从仓库 git 历史中 Hexo 时代的产物快照里逐篇比对恢复的。
const dateFix = JSON.parse(fs.readFileSync('/tmp/date_fix.json', 'utf8'));
const yamlStr = (s) => `'${String(s).replace(/'/g, "''")}'`;

let ok = 0;
const report = [];
for (const m of meta) {
	const rel = EXTRA_OUT[m.uri] ?? decodeURIComponent(m.uri).replace(/^\/posts\//, '').replace(/\/$/, '');
	const file = path.join(OUT, rel + '.md');
	const html = fs.readFileSync(path.join(SRC, decodeURIComponent(m.uri).replace(/^\//, ''), 'index.html'), 'utf8');
	const body = clean(postBody(html));
	const md = td.turndown(body).trim();

	const desc = md
		.replace(/```[\s\S]*?```/g, '')      // 代码块
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接只留文字，丢掉 URL
		.replace(/<[^>]+>/g, '')
		.replace(/[#>*_`|-]/g, '')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 80)
		.trim();

	const pubDate = dateFix[m.uri] || m.date.slice(0, 10);
	const updated = m.lastmod?.slice(0, 10);

	const fm = [
		'---',
		`title: ${yamlStr(m.title)}`,
		`description: ${yamlStr(desc)}`,
		`pubDate: ${yamlStr(pubDate)}`,
		// 修正过日期的文章，其 lastmod 是当年迁移的时间戳而非真实修改时间，丢弃
		updated && !dateFix[m.uri] && updated !== pubDate ? `updatedDate: ${yamlStr(updated)}` : null,
		m.tags.length ? `tags: [${m.tags.map(yamlStr).join(', ')}]` : null,
		m.cats.length ? `categories: [${m.cats.map(yamlStr).join(', ')}]` : null,
		'---',
	].filter((l) => l !== null).join('\n') + '\n\n';

	if (!DRY) {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, fm + md + '\n');
	}
	ok++;
	report.push({ rel, date: pubDate, chars: md.length, code: (md.match(/```/g) || []).length / 2, table: (md.match(/^\|/gm) || []).length });
}

console.log(`转换 ${ok}/${meta.length} 篇${DRY ? '（dry run，未写盘）' : ` -> ${OUT}`}`);
console.table(report.filter((r) => r.code || r.table).slice(0, 12));
const empty = report.filter((r) => r.chars < 20);
if (empty.length) console.log('正文过短，需人工确认:', empty.map((e) => e.rel));
