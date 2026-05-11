import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true, // Needed for cleanup https://github.com/testing-library/vue-testing-library/issues/296
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        server: {
            deps: {
                inline: ["@navikt/arbeidsplassen-react"],
            },
        },
        exclude: ["**/node_modules/**", "**/dist/**"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
