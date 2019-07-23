const memcacheComponentCache = require('./memcache-component-cache')

module.exports = function nuxtMemcacheComponnetCache (options) {
  if (this.options.render.ssr === false) {
    // SSR Disabled
    return
  }

  // Create empty bundleRenderer object if not defined
  if (typeof this.options.render.bundleRenderer !== 'object' || this.options.render.bundleRenderer === null) {
    this.options.render.bundleRenderer = {}
  }

  // Disable if cache explicitly provided in project
  if (this.options.render.bundleRenderer.cache) {
    return
  }

  this.options.render.bundleRenderer.cache = memcacheComponentCache(Object.assign({
    server: 'localhost:11211',
    options: {},
    ttl: 1000 * 60 * 15
  }, options))
}