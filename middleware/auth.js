export default function ({ store, redirect, route }) {
  if (route.name === 'panel' && store.state.user == null) {
    return redirect('/auth/signin')
  }
  return true
}
