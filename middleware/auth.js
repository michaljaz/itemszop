export default function ({ store, redirect, route }) {
  const authPages = ['auth-signin', 'auth-signup']
  if (route.fullPath.split('/')[1] === 'panel') {
    if (!store.getters.loggedIn) {
      return redirect('/auth/signin')
    } else if (!store.getters.emailVerified) {
      return redirect('/auth/not_verified')
    }
  }
  if (authPages.includes(route.name) && store.getters.loggedIn) {
    return redirect('/panel')
  }
  return true
}
