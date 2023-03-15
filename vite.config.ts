/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";
  const isProduction = mode === "production";
  const env = loadEnv(mode, process.cwd());
  const outDir = () => {
    let dir = "";
    switch (mode) {
      case "development":
        dir = "dev";
        break;
      case "staging":
        dir = "staging";
        break;
      default:
        dir = "";
        break;
    }

    return dir ? `dist-${dir}` : "dist";
  };
  const options: UserConfig = {
    server: {
      port: 8734,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: pathResolve("src"),
        },
      ],
    },
    build: {
      outDir: outDir(),
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/.pnpm/")) {
              return id.split("node_modules/.pnpm/")[1].split("/")[0].toString().replace(/@/g, "_");
            } else if (id.includes("node_modules/")) {
              return id.split("node_modules/")[1].split("/")[0].toString().replace(/@/g, "_");
            }
          },
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue\??/, // .vue
        ],
        imports: [
          "vue",
          "vue-router",
          "@vueuse/core",
          { "element-plus/es": ["ElLoading", "ElMessage", "ElMessageBox"] },
        ],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        dts: true,
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: "icon",
            enabledCollections: ["mdi", "ep"],
          }),
        ],
      }),
      Icons({
        autoInstall: true,
        scale: 1,
        defaultClass: "icon mdi icon-mdi",
        compiler: "vue3",
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_TITLE,
          },
        },
      }),
    ],
  };

  return options;
});
