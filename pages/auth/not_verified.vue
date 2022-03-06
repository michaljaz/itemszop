<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        {{ $t('titles.email_not_verified') }}
      </v-card-title>
      <v-card-text>
        {{ $t('misc.check_mailbox_again') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click="reload">
          {{ $t('actions.reload') }}
        </v-btn>
        <v-btn color="primary" @click="signOut">
          {{ $t('actions.logout') }}
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
      title: this.$t('titles.email_not_verified')
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
