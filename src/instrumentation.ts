import { registerOTel } from "@vercel/otel";

export function register(): void {
    registerOTel({ serviceName: "pam-stillingsok" });

    if (process.env.NEXT_RUNTIME === "nodejs") {
        require("pino");

        require("next-logger"); // full console-patching
    }
}
