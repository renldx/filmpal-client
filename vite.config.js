import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
    return {
        build: {
            outDir: "build",
        },
        plugins: [react()],
        server: {
            proxy: {
                "/api": "http://localhost:8080",
            },
        },
    };
});
