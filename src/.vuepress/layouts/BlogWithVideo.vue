<script lang="ts">
declare const __VUEPRESS_BASE__: string;
</script>

<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/dist/client/blog";
import { useFrontmatter } from "vuepress/client";
import { computed, onMounted, onUnmounted, ref } from "vue";

const withBase = (url: string): string => {
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return __VUEPRESS_BASE__ + url.replace(/^\/?/, "");
};

const isVideo = (url: string | null | undefined): url is string =>
  !!url && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

const frontmatter = useFrontmatter();
const raw = frontmatter.value as Record<string, unknown>;
const interval = Number(raw.bgInterval) || 5000;

const bgImages = computed<string[]>(() => {
  const list = raw.bgImages;
  if (Array.isArray(list))
    return list.filter((u): u is string => typeof u === "string").map(withBase);
  const single = raw.bgImage;
  if (typeof single === "string") return [withBase(single)];
  return [];
});

const current = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const next = () => {
  current.value = bgImages.value.length
    ? (current.value + 1) % bgImages.value.length
    : 0;
};

const go = (index: number) => {
  current.value = index;
  resetTimer();
};

const resetTimer = () => {
  if (timer) clearInterval(timer);
  if (bgImages.value.length > 1)
    timer = setInterval(next, interval);
};

onMounted(() => resetTimer());
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <Blog>
    <template #heroBg v-if="bgImages.length">
      <div class="vp-blog-mask hero-carousel-mask">
        <div v-for="(img, index) in bgImages" :key="img" class="hero-carousel-item"
          :class="{ active: index === current }" :style="{ backgroundImage: `url(${img})` }" />

        <div v-if="bgImages.length > 1" class="hero-carousel-dots">
          <span v-for="(_, index) in bgImages" :key="index" :class="{ active: index === current }" @click="go(index)" />
        </div>
      </div>
    </template>

    <template #articleCover="{ cover }">
      <video v-if="isVideo(cover)" class="vp-article-cover" :src="withBase(cover)" autoplay muted loop playsinline />
      <img v-else-if="cover" class="vp-article-cover" :src="withBase(cover)" loading="lazy" alt="" />
    </template>
  </Blog>
</template>

<style scoped>
.hero-carousel-mask {
  background: transparent;
}

.hero-carousel-mask::after {
  background: var(--vp-c-grey-soft);
}

.hero-carousel-item {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.hero-carousel-item.active {
  opacity: 1;
}

.hero-carousel-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 0.5rem;
  transform: translateX(-50%);
}

.hero-carousel-dots span {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.hero-carousel-dots span.active {
  background: #fff;
}
</style>
