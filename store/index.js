export const state = () => ({
  user: null,
  errorCodes: {
    'auth/invalid-email': 'Email jest źle sformatowany.',
    'auth/wrong-password': 'Złe hasło.',
    'auth/network-request-failed': 'Brak połączenia z internetem.',
    'auth/user-not-found': 'Nie znaleziono użytkownika o podanym mailu.',
    'auth/too-many-requests':
    'Dostęp do konta został tymczasowo zablokowany ze względu na dużą liczbę nieudanych prób logowań. Możesz od razu je odblokować resetując hasło.',
    'auth/email-already-in-use': 'Email jest już w użyciu.',
    'auth/weak-password': 'Zbyt słabe hasło (powinno mieć co najmniej 6 znaków).',
    'auth/missing-email': 'Nie wpisałeś adresu email.'
  }
})

export const getters = {
  loggedIn: (state) => {
    return state.user !== null
  },
  errorCodes: (state) => {
    return state.errorCodes
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
        emailVerified: authUser.emailVerified
      }
    } else {
      state.user = null
    }
  }
}
