import { CacheHandler } from "@neshca/cache-handler";
import createLruHandler from "@neshca/cache-handler/local-lru";
import createRedisHandler from "@neshca/cache-handler/redis-strings";
import { createClient } from "@valkey/client";
import winston, { format } from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(format.errors({ stack: true }), winston.format.json()),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

CacheHandler.onCreation(async () => {
    let client;

    console.info("VALKEY_URI_STILLINGSOK: ", process.env.VALKEY_URI_STILLINGSOK);
    console.info("VALKEY_USERNAME_STILLINGSOK: ", process.env.VALKEY_USERNAME_STILLINGSOK);
    console.info("VALKEY_PASSWORD_STILLINGSOK: ", process.env.VALKEY_PASSWORD_STILLINGSOK);
    try {
        client = createClient({
            url: process.env.VALKEY_URI_STILLINGSOK ?? "redis://localhost:6379",
            username: process.env.VALKEY_USERNAME_STILLINGSOK ?? "",
            password: process.env.VALKEY_PASSWORD_STILLINGSOK ?? "",
            disableOfflineQueue: true,
            pingInterval: 1000 * 60, // 30 seconds
        });

        client.on("error", (err) => logger.error("Valkey Client Error", err));
    } catch (error) {
        logger.error("Failed to create Valkey client:", error);
    }

    console.info("VALKEY_AVAILABLE: ", process.env.VALKEY_AVAILABLE);
    console.info("client: ", client);
    if (process.env.VALKEY_AVAILABLE && client) {
        try {
            logger.info("Connecting Valkey client...");

            // Wait for the client to connect.
            // Caveat: This will block the server from starting until the client is connected.
            // And there is no timeout. Make your own timeout if needed.
            await client.connect();
            logger.info("Valkey client connected.");
        } catch (error) {
            logger.warn("Failed to connect Valkey client:", error);

            logger.warn("Disconnecting the Valkey client...");
            // Try to disconnect the client to stop it from reconnecting.
            client
                .disconnect()
                .then(() => {
                    logger.info("Valkey client disconnected.");
                })
                .catch(() => {
                    logger.warn("Failed to quit the Valkey client after failing to connect.");
                });
        }
    }

    let handler;

    console.info("client?.isReady: ", client?.isReady);
    if (client?.isReady) {
        // Create the `redis-stack` Handler if the client is available and connected.
        handler = await createRedisHandler({
            client,
            keyPrefix: "prefix:",
            timeoutMs: 1000,
        });
    } else {
        // Fallback to LRU handler if Valkey client is not available.
        // The application will still work, but the cache will be in memory only and not shared.
        handler = createLruHandler();
        logger.warn("Falling back to LRU handler because Valkey client is not available.");
    }

    return {
        handlers: [handler],
        ttl: {
            defaultStaleAge: 3600,
            estimateExpireAge: (staleAge) => staleAge,
        },
    };
});

export default CacheHandler;
