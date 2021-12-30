'use strict';

function Cache () {
  let __cache = Object.create(null);

  this.set = (key, value, expire, timeoutCallback) => {
    if (typeof expire !== 'undefined' && (typeof expire !== 'number' || isNaN(expire) || expire <= 0)) {
      throw new Error('Cache timeout must be a positive number');
    } else if (typeof timeoutCallback !== 'undefined' && typeof timeoutCallback !== 'function') {
      throw new Error('Cache timeout callback must be a function');
    }

    const oldRecord = __cache[key];
    if (oldRecord) {
      if (oldRecord.timeout) {
        clearTimeout(oldRecord.timeout);
      }
    }

    let record = {
      value: (typeof value !== 'string') ? JSON.stringify(value) : value,
      expire: expire + Date.now()
    };

    if (!isNaN(record.expire)) {
      record.timeout = setTimeout(function() {
        this._del(key);
        if (timeoutCallback) {
          timeoutCallback(key, value);
        }
      }.bind(this), expire);
    }

    __cache[key] = record;

    return value;
  };

  this.del = (key) => {
    let canDelete = true;

    const oldRecord = __cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
      if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
        canDelete = false;
      }
    } else {
      canDelete = false;
    }

    if (canDelete) {
      this._del(key);
    }

    return canDelete;
  };

  this._del = (key) => {
    delete __cache[key];
  }

  this.flushAll = () => {
    for (let key in __cache) {
      clearTimeout(__cache[key].timeout);
    }
    __cache = Object.create({});
  };

  this.get = (key) => {
    const data = __cache[key];
    if (typeof data !== 'undefined') {
      if (isNaN(data.expire) || data.expire >= Date.now()) {
        return data.value;
      } else {
        // free some space
        delete __cache[key];
      }
    }
    return null;
  };

  this.size = () => Object.keys(__cache).length;

  this.values = () => Object.entries(__cache).map((o) => { delete o[1].timeout; return o; });

  this.keys = () => Object.keys(__cache);
  
  this.has = (key) => __cache.hasOwnProperty(key);

  this.ttl = (key) => {
    const oldRecord = __cache[key];
    if (typeof oldRecord !== 'undefined' && oldRecord.expire !== null && !isNaN(oldRecord.expire)) {
      return oldRecord.expire - Date.now();
    } return 0;
  }
}

const CacheProvider = () => {
  const cache = new Cache();  
  return {
    set: (cache.set),
    get: (cache.get),
    has: (cache.has),
    del: (cache.del),
    keys: (cache.keys),
    size: (cache.size),
    flushAll: (cache.flushAll),
    values: (cache.values),
    ttl: (cache.ttl)
  }
}

module.exports = CacheProvider;
