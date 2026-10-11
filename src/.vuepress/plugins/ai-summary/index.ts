import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import OpenAI from "openai";
import type { Plugin } from "vuepress";

/** 读取项目根目录 .env.local 中的变量（不覆盖已存在的环境变量） */
function loadEnvFile(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

/** 去掉 HTML 标签，得到纯文本摘要 */
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

/** 归一化路径：去掉 .html / index / 末尾斜杠，便于客户端查表 */
function normalizePath(path: string): string {
  const result = path
    .replace(/index\.html$/u, "")
    .replace(/\.html$/u, "")
    .replace(/\/+$/u, "");

  return result || "/";
}

const aiSummaryPlugin: Plugin = {
  name: "ai-summary",

  async onPrepared(app) {
    loadEnvFile();

    /** 最终提供给客户端组件的摘要表：{ 归一化路径: 摘要文本 } */
    const summaries: Record<string, string> = {};
    /** 本次由 AI 生成的结果：{ 页面原始路径: 摘要文本 } */
    const generated = new Map<string, string>();

    // 1. 页面 Markdown 里手写的 excerpt 优先级最高
    for (const page of app.pages) {
      if (!page.filePath?.endsWith(".md") || page.frontmatter.home) continue;

      const excerpt = page.frontmatter.excerpt;
      if (typeof excerpt === "string" && excerpt.trim()) {
        summaries[normalizePath(page.path)] = stripHtml(excerpt);
      }
    }

    // 2. 为没有 excerpt 的文章调用 AI 生成
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      console.warn("[ai-summary] 未设置 AI_API_KEY，跳过生成");
    } else {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.deepseek.com",
      });

      const pages = app.pages.filter(
        (page) =>
          page.filePath?.endsWith(".md") &&
          !page.frontmatter.excerpt &&
          !page.frontmatter.home,
      );

      console.log(`[ai-summary] 准备为 ${pages.length} 个页面生成摘要...`);

      for (const page of pages) {
        const text = page.content;
        if (!text || text.trim().length < 100) continue;

        try {
          const response = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content:
                  "你是一个技术博客摘要生成器。请使用与原文相同的语言（中文文章用中文、英文文章用英文）总结文章的核心要点，控制在 150 字/词 以内。直接输出摘要内容，不要任何前缀或解释。",
              },
              { role: "user", content: text.slice(0, 4000) },
            ],
            temperature: 0.3,
          });

          const summary = response.choices[0]?.message?.content?.trim();
          if (summary) {
            generated.set(page.path, stripHtml(summary));
            page.frontmatter.excerpt = summary;
            console.log(`[ai-summary] ✓ ${page.path}`);
          }
        } catch (err) {
          console.error(
            `[ai-summary] ✗ ${page.path}:`,
            err instanceof Error ? err.message : err,
          );
        }
      }
    }

    // 3. 把生成结果补进摘要表
    for (const page of app.pages) {
      const key = normalizePath(page.path);
      const summary = generated.get(page.path);

      if (!summaries[key] && summary) summaries[key] = summary;
    }

    // 4. 写入临时目录，供客户端卡片组件在构建期直接内联（首屏即可见）
    await app.writeTemp(
      "ai-summary/summaries.json",
      `${JSON.stringify(summaries, null, 2)}\n`,
    );

    console.log(
      `[ai-summary] 共输出 ${Object.keys(summaries).length} 条摘要 → .vuepress/.temp/ai-summary/summaries.json`,
    );
  },
};

export default aiSummaryPlugin;
