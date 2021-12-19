export default function ({ store, redirect, route }) {
  if (route.name === 'panel') {
    return redirect('/auth/signin')
  }
  return true
}
