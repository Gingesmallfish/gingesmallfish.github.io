import { defineClientConfig } from "vuepress/client";
import { h } from "vue";
import { Docsearch } from "@vuepress/plugin-docsearch/client";

import ThemeLayout from "vuepress-theme-hope/layouts/base/Layout";
import AiSummaryCard from "./components/AiSummaryCard.vue";
import BlogWithVideo from "./layouts/BlogWithVideo.vue";

/** 在主题 Layout 的正文顶部插入 AI 摘要卡片 */
const LayoutWithAiSummary = (
  props: Record<string, unknown>,
  { slots }: { slots: Record<string, (() => unknown) | undefined> },
): unknown =>
  h(ThemeLayout, props, {
    ...slots,
    contentBefore: () => h(AiSummaryCard),
  });

export default defineClientConfig({
  layouts: {
    BlogWithVideo,
    Layout: LayoutWithAiSummary,
  },
  enhance({ app }) {
    app.component("SearchBox", Docsearch);
  },
});
