export default function ({ store, redirect, route }) {
  if (route.fullPath.split('/')[1] === 'panel') {
    if (!store.getters.loggedIn) {
      return redirect('/auth/signin')
    } else if (!store.getters.emailVerified) {
      return redirect('/auth/not_verified')
    }
  }
  return true
}
