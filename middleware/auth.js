export default function ({ store, redirect, route }) {
  const loginPages = ['auth-signin', 'auth-signup']
  const panelPages = ['panel']
  if (panelPages.includes(route.name) && !store.getters.loggedIn) {
    return redirect('/auth/signin')
  }
  if (loginPages.includes(route.name) && store.getters.loggedIn) {
    return redirect('/panel')
  }
  return true
}
