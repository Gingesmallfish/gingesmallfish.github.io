import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import OpenAI from "openai";
import type { App, Plugin } from "vuepress";

/* -------------------------------------------------------------------------- */
/*                                  配置                                       */
/* -------------------------------------------------------------------------- */

interface AiSummaryConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxInputTokens: number;
  temperature: number;
  concurrency: number;
  maxRetries: number;
  cacheFile: string;
}

function loadConfig(appDir: string): AiSummaryConfig {
  loadEnvFile();

  const maxInputTokens = Number(process.env.AI_MAX_INPUT_TOKENS ?? 6000);
  const concurrency = Number(process.env.AI_CONCURRENCY ?? 3);
  const maxRetries = Number(process.env.AI_MAX_RETRIES ?? 3);

  return {
    apiKey: process.env.AI_API_KEY ?? "",
    baseURL: process.env.AI_BASE_URL ?? "https://api.deepseek.com",
    model: process.env.AI_MODEL ?? "deepseek-chat",
    maxInputTokens: Number.isFinite(maxInputTokens) ? maxInputTokens : 6000,
    temperature: Number(process.env.AI_TEMPERATURE ?? 0.3),
    concurrency: concurrency > 0 ? concurrency : 3,
    maxRetries: maxRetries >= 0 ? maxRetries : 3,
    cacheFile: resolve(appDir, "ai-summary.json"),
  };
}

/** 读取项目根目录 .env.local（不覆盖已存在的环境变量） */
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

/* -------------------------------------------------------------------------- */
/*                                内容处理                                     */
/* -------------------------------------------------------------------------- */

/** 从 Markdown 中提取干净的正文文本 */
function extractProse(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\s*/u, "") // YAML frontmatter
    .replace(/```[\s\S]*?```/gu, " ") //  fenced code blocks
    .replace(/`[^`]*`/gu, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/gu, "$1") // links → keep text
    .replace(/<[^>]+>/gu, " ") // HTML tags
    .replace(/^#{1,6}\s+/gmu, "") // heading markers
    .replace(/[>*_~-]+/gu, " ") // markdown emphasis
    .replace(/\s+/gu, " ")
    .trim();
}

/** 粗略估算 token 数（中文约 1.5 字符/token，英文约 4 字符/token） */
function estimateTokens(text: string): number {
  const cjk = (text.match(/[\u4e00-\u9fa5]/gu) ?? []).length;
  const other = text.length - cjk;
  return Math.ceil(cjk / 1.5 + other / 4);
}

/** 按 token 预算截断文本，尽量在句子边界断开 */
function truncateByTokens(text: string, maxTokens: number): string {
  if (estimateTokens(text) <= maxTokens) return text;

  const sentences = text.split(/(?<=[。！？.!?])\s*/u);
  let result = "";
  let tokens = 0;

  for (const sentence of sentences) {
    const t = estimateTokens(sentence);
    if (tokens + t > maxTokens) break;
    result += sentence;
    tokens += t;
  }

  return result || text.slice(0, maxTokens * 3);
}

function contentHash(text: string): string {
  return createHash("sha1").update(text).digest("hex").slice(0, 16);
}

/** 归一化路径：去掉 .html / index / 末尾斜杠 */
function normalizePath(path: string): string {
  const result = path
    .replace(/index\.html$/u, "")
    .replace(/\.html$/u, "")
    .replace(/\/+$/u, "");
  return result || "/";
}

/* -------------------------------------------------------------------------- */
/*                                  缓存                                       */
/* -------------------------------------------------------------------------- */

interface CacheEntry {
  hash: string;
  summary: string;
}

type SummaryCache = Record<string, CacheEntry>;

function readCache(path: string): SummaryCache {
  try {
    if (!existsSync(path)) return {};
    return JSON.parse(readFileSync(path, "utf8")) as SummaryCache;
  } catch {
    return {};
  }
}

function writeCache(path: string, cache: SummaryCache): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

/* -------------------------------------------------------------------------- */
/*                                并发控制                                     */
/* -------------------------------------------------------------------------- */

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const current = items[cursor++];
      await worker(current);
    }
  });
  await Promise.all(runners);
}

/* -------------------------------------------------------------------------- */
/*                              AI 调用 + 重试                                 */
/* -------------------------------------------------------------------------- */

async function generateSummary(
  client: OpenAI,
  config: AiSummaryConfig,
  text: string,
): Promise<string> {
  const prompt = truncateByTokens(text, config.maxInputTokens);

  let lastError: unknown;
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: "system",
            content:
              "You are a technical blog summarizer. Summarize the core points in the same language as the source (Chinese → Chinese, English → English). Keep it under 150 words/characters. Output only the summary, no prefixes or explanations.",
          },
          { role: "user", content: prompt },
        ],
        temperature: config.temperature,
      });

      const summary = response.choices[0]?.message?.content?.trim();
      if (summary) return summary;
      throw new Error("Empty response from model");
    } catch (err) {
      lastError = err;
      if (attempt < config.maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 8000);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Generation failed");
}

/* -------------------------------------------------------------------------- */
/*                                  插件                                       */
/* -------------------------------------------------------------------------- */

const aiSummaryPlugin: Plugin = {
  name: "ai-summary",

  async onPrepared(app) {
    const config = loadConfig(app.dir.cache());
    const summaries: Record<string, string> = {};

    // 1. 收集所有需要处理的 Markdown 页面
    const mdPages = app.pages.filter(
      (p) => p.filePath?.endsWith(".md") && !p.frontmatter.home,
    );

    // 2. 手写 excerpt 优先级最高，直接写入结果表
    const remaining = mdPages.filter((page) => {
      const excerpt = page.frontmatter.excerpt;
      if (typeof excerpt === "string" && excerpt.trim()) {
        summaries[normalizePath(page.path)] = excerpt
          .replace(/<[^>]+>/gu, " ")
          .replace(/\s+/gu, " ")
          .trim();
        return false;
      }
      return true;
    });

    if (!config.apiKey) {
      console.warn("[ai-summary] AI_API_KEY 未设置，仅使用手写 excerpt");
      await writeOutput(app, summaries);
      return;
    }

    // 3. 读取缓存，跳过内容未变的页面
    const cache = readCache(config.cacheFile);
    const cacheHits: string[] = [];
    const toGenerate = remaining.filter((page) => {
      const prose = extractProse(page.content);
      const hash = contentHash(prose);
      const key = normalizePath(page.path);
      const entry = cache[key];

      if (entry && entry.hash === hash) {
        summaries[key] = entry.summary;
        cacheHits.push(page.path);
        return false;
      }
      return true;
    });

    if (cacheHits.length) {
      console.log(`[ai-summary] 缓存命中 ${cacheHits.length} 篇，跳过生成`);
    }

    if (toGenerate.length === 0) {
      await writeOutput(app, summaries);
      writeCache(config.cacheFile, cache);
      return;
    }

    // 4. 并发调用 AI 生成摘要
    const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });
    const generated = new Map<string, { hash: string; summary: string }>();
    let success = 0;
    let failed = 0;

    console.log(
      `[ai-summary] 开始生成 ${toGenerate.length} 篇摘要 ` +
        `(model=${config.model}, concurrency=${config.concurrency})`,
    );

    await runWithConcurrency(toGenerate, config.concurrency, async (page) => {
      const prose = extractProse(page.content);
      if (prose.length < 100) return;

      const hash = contentHash(prose);
      try {
        const summary = await generateSummary(client, config, prose);
        generated.set(normalizePath(page.path), { hash, summary });
        summaries[normalizePath(page.path)] = summary;
        success++;
        console.log(`[ai-summary] ✓ ${page.path}`);
      } catch (err) {
        failed++;
        console.error(
          `[ai-summary] ✗ ${page.path}:`,
          err instanceof Error ? err.message : err,
        );
      }
    });

    // 5. 回写缓存（合并新旧条目，保留未变页面）
    for (const [key, value] of generated) {
      cache[key] = value;
    }
    writeCache(config.cacheFile, cache);

    console.log(
      `[ai-summary] 完成：成功 ${success}，失败 ${failed}，缓存 ${cacheHits.length}`,
    );

    await writeOutput(app, summaries);
  },
};

async function writeOutput(
  app: App,
  summaries: Record<string, string>,
): Promise<void> {
  await app.writeTemp(
    "ai-summary/summaries.json",
    `${JSON.stringify(summaries, null, 2)}\n`,
  );
  console.log(
    `[ai-summary] 输出 ${Object.keys(summaries).length} 条摘要 → .temp/ai-summary/summaries.json`,
  );
}

export default aiSummaryPlugin;