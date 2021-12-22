export default function ({ store, redirect, route }) {
  const loginPages = ['auth-signin', 'auth-signup']
  const panelPages = ['panel', 'panel-new_shop', 'settings']
  if (panelPages.includes(route.name)) {
    if (!store.getters.loggedIn) {
      return redirect('/auth/signin')
    } else if (!store.getters.emailVerified) {
      return redirect('/auth/not_verified')
    }
  }
  if (loginPages.includes(route.name) && store.getters.loggedIn) {
    return redirect('/panel')
  }
  return true
}
