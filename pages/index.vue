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
      <h1 class="display-1 mt-10 mb-7">
        Dlaczego Itemszop jest najlepszy?
      </h1>
      <v-row>
        <v-col cols="12" md="4">
          <v-card height="100%">
            <v-card-title>
              Bezpłatny
            </v-card-title>
            <v-card-text>
              Nie ma tutaj żadnych planów cenowych.
              Nie ma także żadnych limitów na liczbę usług, liczbę sklepów, czy liczbę serwerów.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card height="100%">
            <v-card-title>
              Otwarty kod źródłowy
            </v-card-title>
            <v-card-text>
              Kod źródłowy jest publicznie dostępny na githubie.
              Każdy może zostać współtwórcą tego projektu.
              Dzięki temu ItemSzop może szybciej się rozwijać.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue" text to="/github">
                Zobacz kod źródłowy
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card height="100%">
            <v-card-title>
              Technologia
            </v-card-title>
            <v-card-text>
              ItemSzop jest zbudowany przy użyciu najnowszych technologii
              takich jak statyczna strona, serverless'owe funkcje lub baza danych w chmurze.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-btn to="/discord" block class="mt-7 indigo lighten-1" large>
        Dołącz do serwera discordowego
      </v-btn>
    </v-container>
    <v-parallax src="/bg.png" jumbotron height="450" class="mt-7">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="text-h4 font-weight-thick mb-4">
            Użyte serwisy i frameworki
          </h1>
          <v-container>
            <v-row class="ma-2">
              <v-col>
                <center>
                  <v-img
                    src="/vercel.png"
                    width="100"
                    height="100"
                  />
                  Vercel
                </center>
              </v-col>
              <v-col>
                <center>
                  <v-img
                    src="/nuxt.png"
                    width="100"
                    height="100"
                  />
                  Nuxt
                </center>
              </v-col>
              <v-col>
                <center>
                  <v-img
                    src="/vuetify.png"
                    width="100"
                    height="100"
                  />
                  Vuetify
                </center>
              </v-col>
              <v-col>
                <center>
                  <v-img
                    src="/firebase.png"
                    width="100"
                    height="100"
                  />
                  Firebase
                </center>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container>
      <h1 class="display-1 mt-15 mb-7">
        Wspierane bramki płatności
      </h1>
      <v-row class="ma-2">
        <v-col>
          <v-img
            src="/microsms.png"
            width="300"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer v-model="drawer" fixed temporary app>
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
