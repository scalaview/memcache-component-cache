# memcache-component-cache
[Nuxt](https://nuxtjs.org) module to cache components in memcache.

## Setup

* Add the memcache-component-cache package to your dependencies with npm or yarn:

```bash
# With npm
npm install memcache-component-cache --save
# With yarn
yarn add memcache-component-cache
```

* Add the module to your ```nuxt.config.js``` and configure the memcache connection:

```javascript
{
  modules: [
    // Simple usage, memcache at localhost:6379, TTL at 15 minutes
    'memcache-component-cache',

    // With custom TTL: 60 minutes
    ['memcache-component-cache', { ttl: 1000 * 60 * 60 }],

    //With custom memcache connection
    ['memcache-component-cache', {
      server: '192.168.0.102:11211'
    }],

    //With custom memcache connection and TTL
    ['memcache-component-cache', {
      server: '192.168.0.102:11211',
      ttl: 1000 * 60 * 60
    }],
  ]
}
```

This module uses [memcached](https://github.com/3rd-Eden/memcached), and is compatible with all the memcached connection modes (TLS, sentinel...).

This means, the ```memcache``` module option takes the same parameters as the ```memcached``` object.
Follow the [memcached connection documentation](https://github.com/3rd-Eden/memcached) to know more about the possible options.

## Cache a component

To cache a component, you need only 2 things:

* Your component must have a unique name
* Your component must have a ```serverCacheKey``` function

Example:

```javascript
<template>
  <div>
    <p>{{ item.message }}</p>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',
  serverCacheKey: (props) => props.item.id + '::' + props.item.last_updated,
  props: ['item']
}
</script>
```

Follow the [Vue.js SSR Component Level Caching documentation](https://ssr.vuejs.org/en/caching.html#component-level-caching) for more informations about when cacheing your components.