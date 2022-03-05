import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter (ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options
  return new Router({
    ...options,
    routes: fixRoutes(options.routes)
  })
}

function fixRoutes (defaultRoutes) {
  if (process.env.SINGLE_SHOP) {
    return shopRoutes(defaultRoutes)
  } else {
    return defaultRoutes
  }
}

function shopRoutes (defaultRoutes) {
  for (const i in defaultRoutes) {
    defaultRoutes[i].path = defaultRoutes[i].path.replace('/shop/:shopid/', '/').replace('/shop/:shopid', '/')
  }
  return defaultRoutes
}
