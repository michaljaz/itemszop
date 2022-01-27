<template>
  <div>
    <div v-if="!issub">
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
        <v-container>
          <v-row>
            <v-col md="1" />
            <v-col md="6">
              <h1 class="display-2 font-weight-thick mb-4">
                Darmowy sklep serwera minecraftowego
              </h1>
              <h4 class="headline">
                Zacznij zarabiać na swoim serwerze już teraz!
                <client-only>
                  <div class="mt-3">
                    <v-btn v-if="!loggedIn" to="/auth/signin" large color="indigo">
                      Zaloguj się
                    </v-btn>
                    <v-btn v-if="!loggedIn" to="/auth/signup" large color="info">
                      Zarejestruj się
                    </v-btn>
                    <v-btn v-if="loggedIn" to="/panel" large color="indigo">
                      Przejdź do panelu
                    </v-btn>
                  </div>
                </client-only>
              </h4>
            </v-col>
            <v-col md="5" />
          </v-row>
        </v-container>
      </v-parallax>
      <v-container>
        <h1 class="display-1 mt-10 mb-7">
          Dlaczego Itemszop jest najlepszy?
        </h1>
        <v-row>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                Cena
              </v-card-title>
              <v-card-text>
                Nie ma tutaj żadnych planów cenowych.
                Nie ma także żadnych limitów na liczbę usług, liczbę sklepów, czy liczbę serwerów.
                ItemSzop jest kompletnie za darmo, przez co tworzy sporą konkurencję dla innych sklepów serwerów.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                Open-source
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
          <v-col cols="12" md="4" sm="6">
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
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                Społeczność
              </v-card-title>
              <v-card-text>
                Utworzyliśmy serwer discordowy, na którym można zadawać pytania odnośnie ItemSzopu.
                Można również składać propozycje lub zgłaszać problemy techniczne.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn to="/discord" color="indigo" text>
                  Dołącz do serwera dc
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                Bezpieczeństwo
              </v-card-title>
              <v-card-text>
                Wszystkie dane dotyczące sklepu znajdują się w bazie danych w chmurze.
                Żadna osoba niepowołana nie posiada dostępu do całej bazy.
                Otrzymuje dostęp jedynie do skrawku, w którym nie może nic zniszczyć.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                Architektura SaaS
              </v-card-title>
              <v-card-text>
                Cały sklep jest hostowany u nas.
                Nie musisz się martwić o stronę techniczną.
                Jest również możliwość "postawienia" swojego sklepu, lecz zalecamy używanie domyślnego.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
          Wspierani operatorzy płatności
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
    <div v-else>
      <iframe style="position:fixed;top:0px;left:0px;width:100%;height:100%;border:0px" :src="src" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  data () {
    return {
      drawer: false,
      issub: true,
      sub: '',
      src: ''
    }
  },
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  mounted () {
    const hostname = window.location.hostname
    this.issub = /^[a-zA-Z0-9][a-zA-Z0-9-]+\.pgrok\.me$/.test(hostname)
    this.sub = hostname.split('.')[0]
    this.src = `/shop/${this.sub}`
    if (this.issub) {
      document.querySelector('html').style.overflow = 'hidden'
    }
  }
}
</script>
