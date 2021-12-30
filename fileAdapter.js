'use strict';

const fs = require('fs');

function Cache(root) {
  let __cache = Object.create({});
  
  this._read = () => {
    if (fs.existsSync(root)) {
      try {
        fs.accessSync(root, fs.constants.R_OK | fs.constants.W_OK);
      } catch (_) {
        throw new Error('File can be read and written');
      }

      const data = fs.readFileSync(root, { encoding: 'utf-8' });
      try {
        __cache = JSON.parse(data) || {};
      } catch (_) {}
    } else {
      fs.writeFileSync(root, JSON.stringify(__cache), { encoding: 'utf-8' });
    }
    return __cache;
  }

  this._save = () => fs.writeFileSync(root, JSON.stringify(__cache), { encoding: 'utf-8' });
  
  this._read();

  this.get = (key) => {
    const item = __cache[key];
    if (typeof item !== 'undefined') {
      if (isNaN(item.expire) || item.expire === null || item.expire >= Date.now()) {
        return item.value;
      } else {
        this.del(key);
      }
    }
    return null;
  }

  this.set = (key, value, expire, timeoutCallback) => {
    if (typeof expire !== 'undefined' && (typeof expire !== 'number' || isNaN(expire) || expire <= 0)) {
      throw new Error('Cache timeout must be a positive number');
    } else if (typeof timeoutCallback !== 'undefined' && typeof timeoutCallback !== 'function') {
      throw new Error('Cache timeout callback must be a function');
    }

    const record = {
      value: (typeof value !== 'string') ? JSON.stringify(value) : value,
      expire: expire + Date.now()
    };
    
    __cache[key] = record;
    this._save();

    if (typeof record.expire !== 'undefined' && !isNaN(record.expire)) {
      setTimeout(function() {
        this.del(key);
        if (timeoutCallback) {
          timeoutCallback(key, value);
        }
      }.bind(this), expire);
    }
    return value;
  }

  this.del = (key) => {
    delete __cache[key];
    this._save();
  }

  this.flushAll = () => {
    __cache = Object.create({});
    fs.unlinkSync(root);
  }

  this.keys = () => Object.keys(__cache);

  this.values = () => Object.entries(__cache).map((o) => { delete o[1].timeout; return o; });
  
  this.size = () => Object.keys(__cache).length;

  this.has = (key) => __cache.hasOwnProperty(key);
 
  this.ttl = (key) => {
    const oldRecord = __cache[key];
    if (typeof oldRecord !== 'undefined' && oldRecord.expire !== null && !isNaN(oldRecord.expire)) {
      return oldRecord.expire - Date.now();
    } return 0;
  }
}

const CacheProvider = (root) => {
  const cache = new Cache(root);
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
  };
}

module.exports = root => CacheProvider(root);
