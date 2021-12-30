declare namespace SimpCache {
  type CallbackFunction = (key: string, value: string | string[]) => void;

  interface Options {
    /**
     * If enabled, all cache will be stored on disk.
     *
     * @type {boolean}
     * @memberof Options
     */
    persistence?: boolean,
    
    /**
     * The file location where our objects are stored.
     * @type {string}
     * @memberof Options
     */
    db?: string
  }
  
  interface SimpCacheProvider {
    /**
     * Add an object to cache.
     * @param key the cache key.
     * @param value the cache value.
     * @param expire the expiration time in miliseconds.
     * @param timeoutCallback Callback function (key, value).
     * @returns void
     */
    set(key: string, value: string, expire?: number, timeoutCallback?: CallbackFunction) : void;
  
    /**
     * Get an value from the cache.
     * @param key the key.
     * @returns string or null
     */
    get(key: string) : string;
  
    /**
     * Has key in the cache.
     * @param key the cache key.
     * @returns boolean
     */
    has(key: string) : boolean;
    
    /**
     * Delete data from the cache.
     * @param key the cache key.
     */
    del(key: string) : void;
  
    /**
     * Get all keys in the cache.
     * @returns An array of all keys
     */
    keys() : string[];
    
    /**
     * Get all entries value in the cache.
     * @returns An array of all keys
     */
    values() : object[];
  
    /**
     * Delete all objects from the cache.
     */
    flushAll() : void;
    
    /**
     * Time-to-live.
     * Returns the remaining time to live of a key that has a timeout.
     */
    ttl(key: string) : number;
  }
}

import SimpCacheProvider = SimpCache.SimpCacheProvider;
import Optional = SimpCache.Options;

/**
* Initalize our database.
* @param options Optional settings.
*/
declare function _SimpCacheInstance(options?: Optional): SimpCacheProvider;

export = _SimpCacheInstance;