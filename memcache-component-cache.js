'use strict'

module.exports = MemcacheComponentCache;
var Memcached = require('memcached');
const {serialize, deserialize} = require('./serializer');

const hasSymbol = typeof Symbol === 'function';
var makeSymbol;
if (hasSymbol) {
  makeSymbol = function (key) {
    return Symbol.for(key);
  }
} else {
  makeSymbol = function (key) {
    return '_' + key;
  }
}

var MEMCACHE = makeSymbol('memcache');
var TTL = makeSymbol('ttl');
var ISDEV = makeSymbol('isDev');

function MemcacheComponentCache (options) {
  if (!(this instanceof MemcacheComponentCache)) {
    return new MemcacheComponentCache(options);
  }

  this[MEMCACHE] = new Memcached(options.server, options.options);
  this[TTL] = options.ttl || 3600;
  this[ISDEV] = options.isDev || false;
}

MemcacheComponentCache.prototype.set = function (key, val) {
  var isDev = this[ISDEV]
  if(isDev){
    console.log("set key: ", key, " cache: ", `${JSON.stringify(val).slice(0, 30)}...`);
  }
  this[MEMCACHE].set(key, serialize(val), this[TTL], function(err){
    if(err && isDev){
      console.error(err)
    }
  });
}

MemcacheComponentCache.prototype.get = function (key, cb) {
  var isDev = this[ISDEV]
  this[MEMCACHE].get(key, function (err, res) {
    if(err){
      throw error;
    }

    if(isDev){
      console.log("get key: ", key, " cache: ", `${JSON.stringify(res).slice(0, 30)}...`);
    }
    cb(deserialize(res));
  })
}

MemcacheComponentCache.prototype.has = function (key, cb) {
  this[MEMCACHE].append(key, '', function (err) {
    cb(err === undefined);
  });
}