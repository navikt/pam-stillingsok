import { CacheHandler } from '@neshca/cache-handler';
import createLruHandler from '@neshca/cache-handler/local-lru';
import createRedisHandler from '@neshca/cache-handler/redis-strings';
import { createClient } from 'redis';
import winston, { format } from 'winston';

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(format.errors({ stack: true }), winston.format.json()),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

CacheHandler.onCreation(async () => {
    let client;

    try {
        client = createClient({
            url: process.env.REDIS_URI_CACHE ?? 'redis://localhost:6379',
            username: process.env.REDIS_USERNAME_CACHE ?? '',
            password: process.env.REDIS_PASSWORD_CACHE ?? '',
            disableOfflineQueue: true,
            pingInterval: 1000*60, // 30 seconds
        });

        client.on('error', err => logger.error('Redis Client Error', err));
    } catch (error) {
        logger.error('Failed to create Redis client:', error);
    }

    if (process.env.REDIS_AVAILABLE && client) {
        try {
            logger.info('Connecting Redis client...');

            // Wait for the client to connect.
            // Caveat: This will block the server from starting until the client is connected.
            // And there is no timeout. Make your own timeout if needed.
            await client.connect();
            logger.info('Redis client connected.');
        } catch (error) {
            logger.warn('Failed to connect Redis client:', error);

            logger.warn('Disconnecting the Redis client...');
            // Try to disconnect the client to stop it from reconnecting.
            client
                .disconnect()
                .then(() => {
                    logger.info('Redis client disconnected.');
                })
                .catch(() => {
                    logger.warn('Failed to quit the Redis client after failing to connect.');
                });
        }
    }

    let handler;

    if (client?.isReady) {
        // Create the `redis-stack` Handler if the client is available and connected.
        handler = await createRedisHandler({
            client,
            keyPrefix: 'prefix:',
            timeoutMs: 1000,
        });
    } else {
        // Fallback to LRU handler if Redis client is not available.
        // The application will still work, but the cache will be in memory only and not shared.
        handler = createLruHandler();
        logger.warn('Falling back to LRU handler because Redis client is not available.');
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