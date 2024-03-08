import { CacheHandler } from '@neshca/cache-handler';
import createLruHandler from '@neshca/cache-handler/local-lru';
import createRedisHandler from '@neshca/cache-handler/redis-strings';
import { createClient } from 'redis';

CacheHandler.onCreation(async () => {
    // always create a Redis client inside the `onCreation` callback
    const client = createClient({
        url: process.env.REDIS_URI_CACHE ?? 'redis://localhost:6379',
        username: process.env.REDIS_USERNAME_CACHE ?? '',
        password: process.env.REDIS_PASSWORD_CACHE ?? '',
    });

    client.on('error', () => {});

    let redisHandler;

    if (process.env.REDIS_AVAILABLE) {
        await client.connect();

        redisHandler = await createRedisHandler({
            client,
        });
    }

    const localHandler = createLruHandler();

    return {
        handlers: [redisHandler, localHandler],
    };
});

export default CacheHandler;