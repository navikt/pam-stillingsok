import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true, // Needed for cleanup https://github.com/testing-library/vue-testing-library/issues/296
        environment: "jsdom",
        setupFiles: "./vitest.setup.js",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
