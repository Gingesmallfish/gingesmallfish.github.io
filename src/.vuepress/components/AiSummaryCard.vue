<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { RouteLink, useRoute } from "vuepress/client";

import summaries from "../.temp/ai-summary/summaries.json";

/**
 * AI 实时生成接口（Cloudflare Worker 代理）。
 * 部署 ai-summary-proxy/worker.js 后，把地址填到这里即可启用
 * 「生成本文简介」按钮，例如：
 *   const AI_ENDPOINT = "https://ai-summary.xxx.workers.dev";
 * 留空时按钮不显示，卡片只展示构建期生成的摘要。
 */
const AI_ENDPOINT = "";

const route = useRoute();
const copied = ref(false);
const loading = ref(false);
const liveSummary = ref("");
const error = ref("");

/** 与构建期插件保持一致的路径归一化规则 */
const normalizePath = (path: string): string =>
  path.replace(/index\.html$/u, "").replace(/\.html$/u, "").replace(/\/+$/u, "") ||
  "/";

const storedSummary = computed(
  () => (summaries as Record<string, string>)[normalizePath(route.path)],
);

/** 展示优先级：实时生成结果 > 构建期生成结果 */
const summary = computed(() => liveSummary.value || storedSummary.value);

const isEnglish = computed(() => route.path.startsWith("/en/"));

const links = computed(() =>
  isEnglish.value
    ? [
        { text: "Home", icon: "lucide:home", url: "/en/" },
        { text: "Categories", icon: "lucide:folder", url: "/en/category/" },
        { text: "Tags", icon: "lucide:tag", url: "/en/tag/" },
      ]
    : [
        { text: "前往主页", icon: "lucide:home", url: "/zh/" },
        { text: "全部分类", icon: "lucide:folder", url: "/zh/category/" },
        { text: "所有标签", icon: "lucide:tag", url: "/zh/tag/" },
      ],
);

const generateSummary = async (): Promise<void> => {
  if (!AI_ENDPOINT || loading.value) return;

  const article = document.querySelector<HTMLElement>(
    "#main-content [vp-content]",
  );
  const text = article?.innerText ?? "";

  if (!text || text.trim().length < 100) {
    error.value = isEnglish.value
      ? "Article content is too short to generate a summary."
      : "正文内容过短，无法生成摘要。";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 4000) }),
    });

    const data = (await response.json()) as { summary?: string; error?: string };

    if (data.summary) liveSummary.value = data.summary;
    else throw new Error(data.error || "Generation failed");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "生成失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};

const copySummary = async (): Promise<void> => {
  if (!summary.value) return;

  try {
    await navigator.clipboard.writeText(summary.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // 剪贴板不可用时忽略
  }
};
</script>

<template>
  <div v-if="summary || AI_ENDPOINT" class="ai-summary-card">
    <div class="ai-summary-header">
      <Icon class="ai-summary-header-icon" icon="lucide:sparkles" />
      <span class="ai-summary-title">{{ isEnglish ? "AI Summary" : "AI-摘要" }}</span>
      <span class="ai-summary-brand">DeepSeek</span>
    </div>

    <div v-if="summary" class="ai-summary-body">{{ summary }}</div>

    <div v-else-if="error" class="ai-summary-body ai-summary-error">
      {{ error }}
    </div>

    <div v-else class="ai-summary-body ai-summary-placeholder">
      {{ isEnglish ? "Click the button below to generate a summary." : "点击下方按钮，为本文生成 AI 摘要。" }}
    </div>

    <div class="ai-summary-actions">
      <button
        v-if="AI_ENDPOINT"
        type="button"
        class="ai-summary-btn ai-summary-btn-primary"
        :disabled="loading"
        @click="generateSummary"
      >
        <Icon class="ai-summary-svg" :icon="loading ? 'lucide:loader-circle' : 'lucide:wand-sparkles'" />
        {{ loading ? (isEnglish ? "Generating…" : "生成中…") : isEnglish ? "Generate Summary" : "生成本文简介" }}
      </button>

      <RouteLink
        v-for="link in links"
        :key="link.url"
        class="ai-summary-btn"
        :to="link.url"
      >
        <Icon class="ai-summary-svg" :icon="link.icon" />
        {{ link.text }}
      </RouteLink>

      <button type="button" class="ai-summary-btn" @click="copySummary">
        <Icon class="ai-summary-svg" :icon="copied ? 'lucide:check' : 'lucide:copy'" />
        {{ copied ? (isEnglish ? "Copied" : "已复制") : isEnglish ? "Copy Summary" : "复制摘要" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ai-summary-card {
  margin: 1rem 0 1.5rem;
  padding: 1rem 1.125rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
}

.ai-summary-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text);
}

.ai-summary-header-icon {
  width: 1rem;
  height: 1rem;
  color: var(--vp-c-accent);
}

.ai-summary-brand {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: var(--vp-c-accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
}

.ai-summary-body {
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--vp-c-text);
}

.ai-summary-error {
  color: var(--vp-c-danger, #e53935);
}

.ai-summary-placeholder {
  color: var(--vp-c-text-mute, #909399);
}

.ai-summary-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.875rem;
}

/* Iconify 图标：尺寸统一，颜色随文字 */
.ai-summary-svg {
  width: 0.9375rem;
  height: 0.9375rem;
  flex: none;
}

.ai-summary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 999px;
  background: var(--vp-c-accent);
  color: #fff;
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.6;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.25s, opacity 0.25s;
}

.ai-summary-btn:hover {
  background: var(--vp-c-accent-hover);
  color: #fff;
}

.ai-summary-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

/* 生成中图标旋转动画 */
.ai-summary-btn:disabled .ai-summary-svg {
  animation: ai-summary-spin 1s linear infinite;
}

@keyframes ai-summary-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>