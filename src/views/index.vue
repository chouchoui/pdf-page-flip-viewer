<template>
  <div class="p-5">
    <div class="mb-5 flex items-center justify-center">
      <div>
        <span>当前是第：</span>
        <el-input v-model="page" class="mx-10 w-20"></el-input>
        <span>页</span>
      </div>
    </div>
    <div class="mb-5 flex items-center justify-center">
      <el-button type="primary" @click="viewerRef?.prevPage">上一页</el-button>
      <el-button type="primary" @click="viewerRef?.nextPage">下一页</el-button>
    </div>
    <pdf-page-flip-viewer
      ref="viewerRef"
      v-model:page="page"
      :url="viewerConfig.url"
      :width="viewerConfig.width"
      :height="viewerConfig.height"
    ></pdf-page-flip-viewer>
  </div>
</template>
<script lang="ts" setup>
import pdfPageFlipViewer from "@/components/pdf-page-flip-viewer.vue";

const viewerRef = ref<InstanceType<typeof pdfPageFlipViewer>>();
const viewerConfig = ref({
  url: "/敬語の指針.pdf",
  width: 420,
  height: 594,
});

const page = ref<number>();
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
