'use strict'

module.exports = MemcacheComponentCache;
var Memcached = require('memcached');

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
  if(this[ISDEV]){
    console.log("set key: ", key, " cache: ", JSON.stringify(val).slice(0, 30));
  }
  this[MEMCACHE].set(key, JSON.stringify(val), this[TTL], function(err){
    if(err && this[isDev]){
      console.error(err)
    }
  });
}

MemcacheComponentCache.prototype.get = function (key, cb) {
  this[MEMCACHE].get(key, function (err, res) {
    if(err){
      if(this[ISDEV]){
        console.error(err);
      }
      cd();
      return;
    }
    try{
      if(this[ISDEV]){
        console.log("get key: ", key, " cache: ", res ? `${res.slice(0, 30)}...` : "");
      }
      cb(JSON.parse(res));
    }catch(e){
      console.error(e);
      cb();
    }
  })
}

MemcacheComponentCache.prototype.has = function (key, cb) {
  this[MEMCACHE].append(key, '', function (err) {
    cb(err === undefined);
  });
}