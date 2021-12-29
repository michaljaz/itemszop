<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        Email nie został jeszcze potwierdzony
      </v-card-title>
      <v-card-text>
        Sprawdź swoją skrzynkę mailową lub poproś o wysłanie maila jeszcze raz.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green" @click="reload">
          Odśwież stronę
        </v-btn>
        <v-btn color="blue" @click="signOut">
          Wyloguj się
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotVerified',
  head () {
    return {
      title: 'Nie zweryfikowano maila'
    }
  },
  computed: {
    ...mapGetters([
      'emailVerified',
      'loggedIn'
    ])
  },
  watch: {
    emailVerified (newVal, oldVal) {
      if (newVal) {
        this.$router.push('/panel')
      }
    }
  },
  mounted () {
    if (this.loggedIn) {
      if (this.emailVerified) {
        this.$router.push('/panel')
      }
    } else {
      this.$router.push('/auth/signin')
    }
  },
  methods: {
    reload () {
      document.location.reload()
    },
    signOut () {
      this.$fire.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
