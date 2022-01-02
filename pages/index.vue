<template>
  <div>
    <v-app-bar height="70" elevation="4" fixed>
      <v-container class="pa-0 fill-height justify-space-between">
        <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer" />
        <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
          ItemSzop
        </v-toolbar-title>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text to="/github">
            <v-icon>
              mdi-github
            </v-icon>
          </v-btn>
          <v-btn text to="/discord">
            <v-icon>
              mdi-discord
            </v-icon>
          </v-btn>
          <client-only>
            <v-btn v-if="!loggedIn" text to="/auth/signin">
              Zaloguj się
            </v-btn>
            <v-btn v-if="!loggedIn" text to="/auth/signup">
              Zarejestruj się
            </v-btn>
            <v-btn v-if="loggedIn" text to="/panel">
              Przejdź do panelu
            </v-btn>
          </client-only>
        </v-toolbar-items>
        <div class="hidden-md-and-up">
          <v-app-bar-nav-icon to="/github">
            <v-icon>mdi-github</v-icon>
          </v-app-bar-nav-icon>
          <v-app-bar-nav-icon to="/discord">
            <v-icon>mdi-discord</v-icon>
          </v-app-bar-nav-icon>
        </div>
      </v-container>
    </v-app-bar>
    <v-parallax src="/bg.jpg" jumbotron height="550">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="text-h4 font-weight-thick mb-4">
            ItemSzop
          </h1>
          <h4 class="subheading">
            Darmowy sklep serwera minecraftowego
          </h4>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container>
      <v-row class="ma-2">
        <v-col>
          <v-img
            src="/vercel.png"
            width="200"
            height="200"
          />
        </v-col>
        <v-col>
          <v-img
            src="/nuxt.png"
            width="200"
            height="200"
          />
        </v-col>
        <v-col>
          <v-img
            src="/vuetify.png"
            width="200"
            height="200"
          />
        </v-col>
        <v-col>
          <v-img
            src="/firebase.png"
            width="200"
            height="200"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer v-model="drawer" absolute temporary>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  }
}
</script>
