# ⚡️ simpcache

![simpcache](https://socialify.git.ci/bayungrh/simpcache/image?description=1&descriptionEditable=A%20simple%20in-memory%20cache%20library%20for%20NodeJS&font=KoHo&forks=1&language=1&name=1&owner=1&pattern=Charlie%20Brown&pulls=1&stargazers=1&theme=Dark)

A simple in-memory cache library for NodeJS

# Installation
`npm install simpcache --save`

# Example
## Initialize
without options
```javascript
const cache = require('simpcache');
```
with options
```javascript
const cache = require('simpcache')({
  persistence: true
});
```

### Options
- `persistence`: (*default*: `false`) If enabled, all cache will be stored on disk.
- `db`: (*default*: `cache.json`) if `persistence` is enabled cache will be stored on `cache.json` file.

## Example Code
```javascript
const cache = require('simpcache')({
  persistence: false // set `false` to use in-memory cache
});

// without expire time
cache.set('foo', 'bar');
console.log('foo', cache.get('foo'));
// @returns 'bar'

// with expire time 10sec, time in ms
cache.set('foo2', 'bar2', 10000);
console.log('foo2', cache.get('foo2'));
// @returns 'bar2'

// with timeout callback
cache.set('foo3', 'bar3', 10000, function (key, value) {
  console.log('foo3 deleted from cache');
});
// @returns 'foo3 deleted from cache' after cache expired.

// check cache exists
cache.has('foo');
// @returns true

// delete cache key
cache.del('foo');

// clear all cache
cache.flushAll();

// get keys from the cache
console.log('keys', cache.keys());
// @returns ['foo', 'foo2']
```

## Methods
- **set(key, value, expire, timeoutCallback)** `void`, set a new entry and value, and you can set the expiration time.
- **get(key)** `string` or `null`, get the entry's value from a given key.
- **has(key)** `boolean`, check key exists from cache.
- **del(key)** `void`, remove a given key from the cache.
- **keys()** `array`, returns the keys from the cache.
- **flushAll()** `void`, remove all data from cache.