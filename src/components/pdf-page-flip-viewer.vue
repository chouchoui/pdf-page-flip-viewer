<template>
  <div class="flip-book invisible mx-auto w-full"></div>
</template>
<script lang="ts" setup>
import { PageFlip } from "page-flip";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

const props = withDefaults(
  defineProps<{
    url: string;
    width: number;
    height: number;
    page?: number | string;
  }>(),
  {
    page: 1,
  },
);

const pageValue = computed(() => {
  let page = 1;
  if (typeof props.page === "number") {
    page = props.page;
  } else if (typeof props.page === "string") {
    page = parseInt(props.page);
  }
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  return page;
});

const emit = defineEmits<{
  (e: "flip", val: number): void;
  (e: "update:page", val: number): void;
}>();

pdfjs.GlobalWorkerOptions.workerSrc = "./pdfjs-dist/build/pdf.worker.js";

const pdfInit = async () => {
  const pdfContainer = document.querySelector(".flip-book") as HTMLDivElement;
  if (!pdfContainer) {
    return;
  }
  const loadingTask = pdfjs.getDocument({
    url: props.url,
  });
  const pdf = await loadingTask.promise;
  const container = document.querySelector(".flip-book") as HTMLDivElement;

  for (let index = 0; index < pdf.numPages; index++) {
    const page = await pdf.getPage(index + 1);
    const viewport = page.getViewport({ scale: 1 });
    const divPage = document.createElement("div");
    divPage.classList.add("page");
    const divPageContent = document.createElement("div");
    divPageContent.classList.add("page-content");
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    divPageContent.appendChild(canvas);
    divPage.appendChild(divPageContent);
    container.appendChild(divPage);
  }
};

const pageFlip = ref<PageFlip>();

const pageFlipInit = () => {
  const viewer = document.querySelector(".flip-book") as HTMLDivElement;
  if (!viewer) {
    return;
  }
  pageFlip.value = new PageFlip(viewer, {
    width: props.width, // base page width
    height: props.height, // base page height
  });
  pageFlip.value.loadFromHTML(document.querySelectorAll(".flip-book .page"));
  viewer.classList.remove("invisible");

  if (props.page) {
    pageFlip.value.flip(pageValue.value - 1);
  }

  pageFlip.value.on("flip", (e) => {
    const currentPage = (e.data as number) + 1;
    emit("flip", currentPage);
    emit("update:page", currentPage);
  });
  return Promise.resolve();
};

watch(
  () => pageValue.value,
  (v) => {
    if (v) {
      pageFlip.value?.flip(v - 1);
    }
  },
);

const nextPage = () => {
  pageFlip.value?.flipNext();
};
const prevPage = () => {
  pageFlip.value?.flipPrev();
};
const goPage = (page: number) => {
  pageFlip.value?.flip(page);
};

const init = async () => {
  const loading = ElLoading.service({
    fullscreen: true,
    text: "文档加载中...",
  });
  await pdfInit();
  await pageFlipInit();
  loading.close();
};

tryOnMounted(async () => {
  init();
});

defineExpose({
  nextPage,
  prevPage,
  goPage,
});
</script>
<style scoped lang="scss">
.flip-book {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
  display: none;
  background-size: cover;

  ::v-deep(.page) {
    background-color: white;
    padding: 20px;
    border: solid 1px rgb(187, 187, 187);
    overflow: hidden;

    .page-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: stretch;

      canvas {
        position: static;
      }
    }

    &.--left {
      // for left page (property will be added automatically)
      border-right: 0;
      box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4);
    }

    &.--right {
      // for right page (property will be added automatically)
      border-left: 0;
      box-shadow: inset 7px 0 30px -7px rgba(0, 0, 0, 0.4);

      .page-footer {
        text-align: right;
      }
    }
  }
}
</style>
