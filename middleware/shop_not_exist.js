export default function ({ store, redirect, route }) {
  if (route.params.shopid && !Object.values(store.getters.shops).includes(route.params.shopid)) {
    return redirect('/panel')
  }
  return true
}
