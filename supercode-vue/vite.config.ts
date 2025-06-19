import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
    plugins: [
        vue(),
        viteMockServe({
            mockPath: "mock",
            enable: false,
        }),
    ],
    server: {
        port: 5173,  // 指定端口为5173
    },
});
