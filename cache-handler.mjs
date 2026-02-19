import { CacheHandler } from "@fortedigital/nextjs-cache-handler";
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import { createClient } from "redis";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants.js";
import { appLogger } from "./src/app/_common/logging/appLogger.ts";

// Code example copied and modified from README of the @fortedigital/nextjs-cache-handler package
CacheHandler.onCreation(() => {
    // Important - It's recommended to use global scope to ensure only one Redis connection is made
    // This ensures only one instance get created
    if (global.cacheHandlerConfig) {
        return global.cacheHandlerConfig;
    }

    // Important - It's recommended to use global scope to ensure only one Redis connection is made
    // This ensures new instances are not created in a race condition
    if (global.cacheHandlerConfigPromise) {
        return global.cacheHandlerConfigPromise;
    }

    // Avoid creating a Valkey cache in development mode, as cache handlers are not used in development mode
    if (process.env.NODE_ENV === "development") {
        const lruCache = createLruHandler();
        return { handlers: [lruCache] };
    }

    // Main promise initializing the handler
    global.cacheHandlerConfigPromise = (async () => {
        let client = null;

        if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
            const settings = {
                url: process.env.REDIS_URI_STILLINGSOK ?? "redis://localhost:6379",
                username: process.env.REDIS_USERNAME_STILLINGSOK ?? "",
                password: process.env.REDIS_PASSWORD_STILLINGSOK ?? "",
                disableOfflineQueue: true,
                pingInterval: 1000 * 60, // 30 seconds
            };

            try {
                client = createClient(settings);
                client.on("error", (e) => {
                    if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
                        appLogger.warnWithCause("Valkey error", e);
                    }
                    global.cacheHandlerConfig = null;
                    global.cacheHandlerConfigPromise = null;
                });
            } catch (error) {
                appLogger.errorWithCause("Failed to create Valkey client:", error);
            }
        }

        if (client) {
            try {
                appLogger.info("Connecting Valkey client...");
                await client.connect();
                appLogger.info("Valkey client connected.");
            } catch (error) {
                appLogger.errorWithCause("Failed to connect Valkey client:", error);
                await client
                    .disconnect()
                    .catch(() => appLogger.warn("Failed to quit the Valkey client after failing to connect."));
            }
        }

        const lruCache = createLruHandler();

        if (!client?.isReady) {
            appLogger.error("Failed to initialize Valkey caching layer, falling back to LRU cache.");
            global.cacheHandlerConfigPromise = null;
            global.cacheHandlerConfig = { handlers: [lruCache] };
            return global.cacheHandlerConfig;
        }

        const cacheHandler = createRedisHandler({
            client: client,
            keyPrefix: "nextjs:",
            timeoutMs: 1000,
        });

        global.cacheHandlerConfigPromise = null;
        global.cacheHandlerConfig = {
            handlers: [cacheHandler],
            ttl: {
                defaultStaleAge: 3600,
                estimateExpireAge: (staleAge) => staleAge,
            },
        };

        return global.cacheHandlerConfig;
    })();

    return global.cacheHandlerConfigPromise;
});

export default CacheHandler;
