import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter (ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options
  let hostname = ssrContext ? ssrContext.req.headers.host : location.host
  hostname = hostname.split(':')[0]
  return new Router({
    ...options,
    routes: fixRoutes(options.routes, hostname)
  })
}

function fixRoutes (defaultRoutes, hostname) {
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]+\.itemszop\.ga$/.test(hostname)) {
    const shopid = hostname.split('.')[0]
    return shopRoutes(defaultRoutes, shopid)
  }
  return defaultRoutes
}

function shopRoutes (defaultRoutes, shopid) {
  const route = defaultRoutes[5]
  route.path = '/'
  return [route, defaultRoutes[6]]
}
