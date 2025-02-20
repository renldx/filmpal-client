import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig(() => {
    return {
        build: {
            outDir: "build",
        },
        plugins: [react(), eslint()],
        server: {
            proxy: {
                "/api": "http://localhost:8080",
            },
        },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: "./src/tests/setupTests.js",
        },
    };
});
