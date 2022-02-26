<template>
  <div>
    <div v-if="!issub">
      <v-app-bar height="70" elevation="4" fixed>
        <v-container class="pa-0 fill-height justify-space-between">
          <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer" />
          <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
            {{ $t('brand') }}
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
                {{ $t('sign_in') }}
              </v-btn>
              <v-btn v-if="!loggedIn" text to="/auth/signup">
                {{ $t('sign_up') }}
              </v-btn>
              <v-btn v-if="loggedIn" text to="/panel">
                {{ $t('actions.go_to_panel') }}
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
      <v-parallax src="/bg.webp" jumbotron height="550">
        <v-container>
          <v-row>
            <v-col md="1" />
            <v-col md="6">
              <h1 class="display-2 font-weight-thick mb-4">
                {{ $t('homepage.title') }}
              </h1>
              <h4 class="headline">
                {{ $t('homepage.subtitle') }}
                <client-only>
                  <div class="mt-3">
                    <v-btn v-if="!loggedIn" to="/auth/signin" large color="indigo" class="mt-1">
                      {{ $t('sign_in') }}
                    </v-btn>
                    <v-btn v-if="!loggedIn" to="/auth/signup" large color="info" class="mt-1">
                      {{ $t('sign_up') }}
                    </v-btn>
                    <v-btn v-if="loggedIn" to="/panel" large color="indigo">
                      {{ $t('actions.go_to_panel') }}
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
          {{ $t('homepage.why_best') }}
        </h1>
        <v-row>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                {{ $t("homepage.card1_title") }}
              </v-card-title>
              <v-card-text>
                {{ $t("homepage.card1_content") }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                {{ $t("homepage.card2_title") }}
              </v-card-title>
              <v-card-text>
                {{ $t("homepage.card2_content") }}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue" text to="/github">
                  {{ $t('homepage.card2_button') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                {{ $t('homepage.card3_title') }}
              </v-card-title>
              <v-card-text>
                {{ $t('homepage.card3_content') }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                {{ $t('homepage.card4_title') }}
              </v-card-title>
              <v-card-text>
                {{ $t('homepage.card4_content') }}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn to="/discord" color="indigo" text>
                  {{ $t('homepage.card4_button') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                {{ $t('homepage.card5_title') }}
              </v-card-title>
              <v-card-text>
                {{ $t('homepage.card5_content') }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card height="100%">
              <v-card-title>
                {{ $t('homepage.card6_title') }}
              </v-card-title>
              <v-card-text>
                {{ $t('homepage.card6_content') }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-parallax src="/footerbg.webp" jumbotron height="450" class="mt-7">
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h1 class="text-h4 font-weight-thick mb-4">
              {{ $t('homepage.used_services') }}
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
      <v-container class="mb-10">
        <center>
          <h1 class="display-1 mt-15 mb-7">
            {{ $t('homepage.supported_operators') }}
          </h1>
          <v-img
            class="mt-4"
            src="/microsms.webp"
            width="300"
          />
          <v-img
            class="mt-4"
            src="/lvlup.png"
            width="300"
          />
        </center>
      </v-container>

      <v-navigation-drawer v-model="drawer" fixed temporary app>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="/favicon.ico" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ $t('brand') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <client-only>
          <v-list-item v-if="loggedIn" link to="/panel">
            {{ $t('actions.go_to_panel') }}
          </v-list-item>
          <v-list-item v-if="!loggedIn" link to="/auth/signin">
            {{ $t('sign_in') }}
          </v-list-item>
          <v-list-item v-if="!loggedIn" link to="/auth/signup">
            {{ $t('sign_up') }}
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
    this.$vuetify.theme.dark = true
    const hostname = window.location.hostname
    this.issub = /^[a-zA-Z0-9][a-zA-Z0-9-]+\.itemszop\.ga$/.test(hostname)
    this.sub = hostname.split('.')[0]
    this.src = `/shop/${this.sub}`
    if (this.issub) {
      document.querySelector('html').style.overflow = 'hidden'
    }
  }
}
</script>
