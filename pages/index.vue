<template>
  <div>
    <v-app-bar height="70" :elevation="el" fixed :color="bg">
      <v-container class="pa-0 fill-height justify-space-between">
        <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer" />
        <v-toolbar-title style="cursor: pointer">
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
    <div class="intro">
      <v-container>
        <div style="margin-top:200px;margin-left:60px;">
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
                  color="primary"
                  outlined
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
      <h1 class="display-1 mt-10 mb-7">
        {{ $t('homepage.why_best') }}
      </h1>
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
              <v-btn color="blue" text to="/github">
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
        <v-img
          class="mt-4"
          src="/paypal.webp"
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  data () {
    return {
      drawer: false,
      bg: 'transparent',
      el: '0'
    }
  },
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  mounted () {
    this.$vuetify.theme.dark = true
    window.onscroll = () => {
      this.changeColor()
    }
  },
  methods: {
    changeColor () {
      if (
        document.body.scrollTop > 0 ||
        document.documentElement.scrollTop > 0
      ) {
        this.bg = ''
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
  background: url('/bg.webp') no-repeat top center fixed;
  height:550px;
}
</style>
