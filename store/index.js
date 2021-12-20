export const state = () => ({
  user: null
})
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (authUser) {
      state.user = {
        uid: authUser.uid,
        displayName: authUser.displayName,
        emailVerified: authUser.emailVerified
      }
    } else {
      state.user = null
    }
  }
}
