<template>
  <div>
    <v-navigation-drawer
      v-if="$route.params.shopid"
      v-model="drawer"
      elevation="2"
      :color="$vuetify.theme.dark ? `#272727`: ''"
      fixed
      app
      width="300"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mt-0">
            <v-menu
              offset-y
              right
            >
              <template #activator="{ on, attrs }">
                <v-toolbar-items>
                  <v-btn
                    large
                    class="py-3"
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $route.params.shopid }}
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </template>

              <v-list>
                <v-list-item
                  v-for="item in shops"
                  :key="item"
                  link
                  :to="`/panel/shop/${item}`"
                >
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item
                  link
                  to="/panel/new_shop"
                >
                  <v-list-item-title>{{ $t('actions.new_shop') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon class="mt-5 mr-1">
          <v-btn :href="url" target="_blank" rounded text>
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
      <v-divider />
      <v-subheader>{{ $t('titles.main_page') }}</v-subheader>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/`"
        :active-class="isDashboard ? '' : `no-active`"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.dashboard') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/preview`"
      >
        <v-list-item-icon>
          <v-icon>mdi-eye</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.preview') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/settings`"
      >
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.settings') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>{{ $t('titles.modules') }}</v-subheader>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/pages`"
      >
        <v-list-item-icon>
          <v-icon>mdi-file</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.pages') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/servers`"
      >
        <v-list-item-icon>
          <v-icon>mdi-server</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.servers') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/services`"
      >
        <v-list-item-icon>
          <v-icon>mdi-cart</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.services') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/payments`"
      >
        <v-list-item-icon>
          <v-icon>mdi-credit-card-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.payments') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>{{ $t('titles.additional_modules') }}</v-subheader>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/vouchers`"
      >
        <v-list-item-icon>
          <v-icon>mdi-ticket-percent</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.vouchers') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :to="`/panel/shop/${$route.params.shopid}/temp`"
      >
        <v-list-item-icon>
          <v-icon>mdi-bullhorn</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('titles.temp_announcement') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar
      dark
      color="accent"
      elevation="2"
      fixed
      app
      flat
    >
      <v-container class="pa-0 fill-height justify-space-between">
        <v-app-bar-nav-icon v-if="$route.params.shopid" class="hidden-lg-and-up" @click.stop="drawer = !drawer" />
        <nuxt-link to="/panel" style="text-decoration: none; color: inherit;">
          <v-toolbar-title class="mr-3 ml-3">
            {{ $t('brand') }}
          </v-toolbar-title>
        </nuxt-link>
        <v-btn icon @click="toggle_theme">
          <v-icon v-if="$vuetify.theme.dark">
            mdi-white-balance-sunny
          </v-icon>
          <v-icon v-if="!$vuetify.theme.dark">
            mdi-weather-night
          </v-icon>
        </v-btn>

        <v-spacer class="hidden-sm-and-down" />

        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text to="/panel/new_shop" color="primary">
            {{ $t('actions.new_shop') }}
          </v-btn>
        </v-toolbar-items>
        <v-menu
          offset-y
          left
        >
          <template #activator="{ on, attrs }">
            <v-toolbar-items>
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="hidden-lg-and-up">
                  mdi-account
                </v-icon>
                <span class="hidden-sm-and-down">

                  <span v-if="$store.state.user">
                    {{ $store.state.user.displayName }}
                  </span>
                  <span v-else>
                    {{ $t('titles.account') }}
                  </span>
                </span>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </v-toolbar-items>
          </template>

          <v-list>
            <v-list-item to="/panel/settings">
              <v-list-item-title>{{ $t('titles.settings') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="signOut"
            >
              <v-list-item-title>{{ $t('actions.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>
    <v-container v-if="preview!=='preview'">
      <nuxt-child :shops="shops" />
    </v-container>
    <template v-else>
      <nuxt-child :shops="shops" />
    </template>
  </div>
</template>
<script>
export default {
  name: 'BasePanel',
  middleware ({ store, redirect }) {
    if (!store.getters.loggedIn) {
      return redirect('/auth/signin')
    } else if (!store.getters.emailVerified) {
      return redirect('/auth/not_verified')
    }
  },
  data () {
    return {
      shops: [],
      drawer: true
    }
  },
  computed: {
    isDashboard () {
      return this.$route.path === `/panel/shop/${this.$route.params.shopid}/` || this.$route.path === `/panel/shop/${this.$route.params.shopid}`
    },
    url () {
      if (process.env.singleShopId) {
        if (this.$route.params.shopid !== process.env.singleShopId) {
          return ''
        } else {
          return `${document.location.origin}`
        }
      } else {
        return `${document.location.origin}/shop/${this.$route.params.shopid}`
      }
    },
    preview () {
      const xd = this.$route.path.split('/')
      return xd[xd.length - 1]
    }
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
    if (this.$route.params.shopid) {
      this.tabs = true
    } else {
      this.tabs = false
    }
    this.loadShops()
  },
  methods: {
    signOut () {
      this.$fire.auth.signOut()
      this.shops = []
      this.$router.push('/')
    },
    toggle_theme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('dark', this.$vuetify.theme.dark.toString())
    },
    loadShops () {
      const { uid } = this.$fire.auth.currentUser
      this.$fire.database.ref(`users/${uid}`).on('value', (s) => {
        const val = s.val()
        if (val == null) {
          this.shops = []
          if (this.$route.params.shopid) {
            this.$router.push('/panel')
          }
        } else {
          const shops = Object.keys(s.val())
          if (this.$route.params.shopid && !shops.includes(this.$route.params.shopid)) {
            this.$router.push('/panel')
          }
          this.shops = shops
        }
      })
    }
  }
}
</script>
