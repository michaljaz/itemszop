export const state = () => ({
  user: null
})

export const getters = {
  loggedIn: (state) => {
    return state.user !== null
  },
  emailVerified: (state) => {
    if (state.user == null) {
      return false
    } else {
      return state.user.emailVerified
    }
  }
}

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (authUser) {
      state.user = {
        uid: authUser.uid,
        displayName: authUser.displayName,
        emailVerified: authUser.emailVerified,
        email: authUser.email
      }
    } else {
      state.user = null
    }
  }
}
