<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn class="mb-2 pl-2" to="/" text>
          <v-icon>mdi-arrow-left-thin</v-icon>
          {{ $t('actions.back_to_homepage') }}
        </v-btn>
        <nuxt-child />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BaseAuth',
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  mounted () {
    const authPages = ['auth-signin', 'auth-signup']
    if (authPages.includes(this.$route.name) && this.loggedIn) {
      this.$router.push('/panel')
    }
  }
}
</script>
