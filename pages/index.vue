<template>
  <div>
    <v-app-bar height="70" :elevation="el" fixed :color="bg" light>
      <v-container class="pa-0 fill-height justify-space-between">
        <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer" />
        <v-toolbar-title style="cursor: pointer">
          {{ $t('brand') }}
          <v-btn icon @click="toggle_theme">
            <v-icon v-if="$vuetify.theme.dark">
              mdi-white-balance-sunny
            </v-icon>
            <v-icon v-if="!$vuetify.theme.dark">
              mdi-weather-night
            </v-icon>
          </v-btn>
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
    <div class="intro">
      <v-container>
        <div style="margin-top:200px;margin-left:40px;color:black;">
          <h1 class="display-3 font-weight-regular mb-4">
            {{ $t('brand') }}
          </h1>
          <h4 class="headline">
            {{ $t('homepage.title') }}
            <client-only>
              <div class="mt-3">
                <v-btn v-if="!loggedIn" to="/auth/signin" large color="primary" class="mt-1">
                  {{ $t('sign_in') }}
                </v-btn>
                <v-btn
                  v-if="!loggedIn"
                  to="/auth/signup"
                  large
                  color="secondary"
                  class="mt-1"
                >
                  {{ $t('sign_up') }}
                </v-btn>
                <v-btn v-if="loggedIn" to="/panel" large color="primary">
                  {{ $t('actions.go_to_panel') }}
                </v-btn>
              </div>
            </client-only>
          </h4>
        </div>
      </v-container>
    </div>
    <v-container>
      <center>
        <div class="headline mx-4 mt-3 mb-7 primary--text">
          {{ $t('homepage.comment') }}
        </div>
        <h1 class="display-1 mt-10 mb-13">
          {{ $t('homepage.why_best') }}
        </h1>
      </center>
      <v-row>
        <v-col cols="12" md="4" sm="6">
          <v-card height="100%">
            <v-card-title>
              <v-icon class="mr-4">
                mdi-cash
              </v-icon>
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
              <v-icon class="mr-4">
                mdi-book-open-variant
              </v-icon>
              {{ $t("homepage.card2_title") }}
            </v-card-title>
            <v-card-text>
              {{ $t("homepage.card2_content") }}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text to="/github">
                {{ $t('homepage.card2_button') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card height="100%">
            <v-card-title>
              <v-icon class="mr-4">
                mdi-airplane-cog
              </v-icon>
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
              <v-icon class="mr-4">
                mdi-account-group
              </v-icon>
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
              <v-icon class="mr-4">
                mdi-shield-check
              </v-icon>
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
              <v-icon class="mr-4">
                mdi-server-network
              </v-icon>
              {{ $t('homepage.card6_title') }}
            </v-card-title>
            <v-card-text>
              {{ $t('homepage.card6_content') }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <center>
        <h1 class="display-1 mt-15">
          {{ $t('homepage.supported_operators') }}
        </h1>
      </center>
      <VueSlickCarousel v-bind="settings">
        <div>
          <v-img
            contain
            height="200"
            class="mx-2"
            src="/microsms.webp"
          />
        </div>
        <div>
          <v-img
            contain
            height="200"
            class="mx-2"
            src="/lvlup.png"
          />
        </div>
        <div>
          <v-img
            contain
            height="200"
            class="mx-2"
            src="/paypal.webp"
          />
        </div>
      </VueSlickCarousel>
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
</template>

<script>
import { mapGetters } from 'vuex'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'IndexPage',
  components: { VueSlickCarousel },
  data () {
    return {
      drawer: false,
      bg: 'transparent',
      el: '0',
      settings: {
        dots: true,
        focusOnSelect: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        touchThreshold: 5
      }
    }
  },
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  mounted () {
    const theme = localStorage.getItem('dark')
    if (theme) {
      if (theme === 'true') {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    } else {
      localStorage.setItem('dark', 'true')
    }
    window.onscroll = () => {
      this.changeColor()
    }
  },
  methods: {
    toggle_theme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('dark', this.$vuetify.theme.dark.toString())
    },
    changeColor () {
      if (
        document.body.scrollTop > 0 ||
        document.documentElement.scrollTop > 0
      ) {
        this.bg = 'primary'
        this.el = '5'
      } else {
        this.bg = 'transparent'
        this.el = '0'
      }
    }
  }
}
</script>
<style>
.intro{
  background-image: url('/bg.webp');
  background-size: cover;
  background-position:center;
  height:700px;
}
</style>
