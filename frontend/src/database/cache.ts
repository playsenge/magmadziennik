import { devMsg } from "../utils";

interface CacheItem<T> {
    data: T;
    expiry: number;
}

type CacheStore = {
    [key: string]: CacheItem<unknown>;
};

const cache: CacheStore = {};

export const setCache = <T>(key: string, data: T, ttl: number = 300000): void => {
    cache[key] = {
        data,
        expiry: Date.now() + ttl,
    };
};

export const getCache = <T>(key: string): T | undefined => {
    const cachedItem = cache[key] as CacheItem<T> | undefined;
    if (cachedItem && cachedItem.expiry > Date.now()) {
        devMsg(`Returned ${key} from cache`);
        return cachedItem.data;
    } else {
        devMsg(`No ${key} found in cache`);
        delete cache[key];
        return undefined;
    }
};

// const clearCache = (key: string): void => {
//     delete cache[key];
// };