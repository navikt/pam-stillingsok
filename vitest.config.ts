import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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
        exclude: ["**/node_modules/**", "**/dist/**", "**/playwright/**"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
