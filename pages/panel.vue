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
          <v-list-item-subtitle v-if="url">
            <v-icon dense>
              mdi-link-variant
            </v-icon>
            <a :href="url" target="_blank">{{ url }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list
        nav
        dense
      >
        <v-divider class="mb-1" />
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
          :to="`/panel/shop/${$route.params.shopid}/payments`"
        >
          <v-list-item-icon>
            <v-icon>mdi-credit-card-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('titles.payments') }}</v-list-item-title>
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
        <v-list-group
          :value="true"
          no-action
        >
          <template #activator>
            <v-list-item-icon>
              <v-icon>mdi-view-grid-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('titles.additional_modules') }}</v-list-item-title>
            </v-list-item-content>
          </template>

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
            :to="`/panel/shop/${$route.params.shopid}/rcon`"
          >
            <v-list-item-icon>
              <v-icon>mdi-lan-connect</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('titles.rcon') }}</v-list-item-title>
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
              <v-list-item-title>{{ $t('titles.temp_announcements') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      height="70"
      elevation="2"
      fixed
      app
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
          <v-btn text to="/panel/new_shop" color="blue">
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
    <v-container>
      <nuxt-child :shops="shops" />
    </v-container>
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
    }
  },
  async mounted () {
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
    try {
      this.idToken = await this.$fire.messaging.getToken({ vapidKey: 'BLE3ZYv0CC7JZIuTKk2EhQcIPi4eSKcS1iqgpweC290f6e1aHsmPYdJwaZOIq1mVe9U6sNrYbx9a-E72jsJlgSI' })
      console.log(this.idToken)
    } catch (e) {
      console.error('Error : ', e)
    }
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
    }
  }
}
</script>
