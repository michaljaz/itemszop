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
  if (process.env.singleShopId) {
    return shopRoutes(defaultRoutes)
  } else {
    return defaultRoutes
  }
}

function shopRoutes (defaultRoutes) {
  const newRoutes = []
  for (let i = 0; i < defaultRoutes.length; i++) {
    if ((defaultRoutes[i].name && !defaultRoutes[i].name.includes('index')) || !defaultRoutes[i].name) {
      defaultRoutes[i].path = defaultRoutes[i].path.replace('/shop/:shopid/', '/').replace('/shop/:shopid', '/')
      newRoutes.push(defaultRoutes[i])
    }
  }
  return newRoutes
}
