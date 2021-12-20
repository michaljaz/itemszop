<template>
  <v-app dark>
    <v-main>
      <v-app-bar
        height="70"
        elevation="4"
      >
        <v-container class="pa-0 fill-height justify-space-between">
          <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer" />
          <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
            ItemSzop
          </v-toolbar-title>

          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn
              text
              to="/github"
            >
              <v-icon>
                mdi-github
              </v-icon>
            </v-btn>
            <client-only>
              <v-btn
                v-if="!loggedIn"
                text
                to="/auth/signin"
              >
                Zaloguj się
              </v-btn>
              <v-btn
                v-if="!loggedIn"
                text
                to="/auth/signup"
              >
                Zarejestruj się
              </v-btn>
              <v-btn
                v-if="loggedIn"
                text
                to="/panel"
              >
                Przejdź do panelu
              </v-btn>
            </client-only>
          </v-toolbar-items>
          <v-app-bar-nav-icon class="hidden-md-and-up" to="/github">
            <v-icon>mdi-github</v-icon>
          </v-app-bar-nav-icon>
        </v-container>
      </v-app-bar>
      <v-container>
        <Nuxt />
      </v-container>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="/favicon.ico" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>ItemSzop</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <client-only>
          <v-list-item v-if="loggedIn" link to="/panel">
            Panel
          </v-list-item>
          <v-list-item v-if="!loggedIn" link to="/auth/signin">
            Zaloguj się
          </v-list-item>
          <v-list-item v-if="!loggedIn" link to="/auth/signup">
            Zarejestruj się
          </v-list-item>
        </client-only>
      </v-navigation-drawer>
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} ItemSzop</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  data () {
    return {
      drawer: false
    }
  }
}
</script>
