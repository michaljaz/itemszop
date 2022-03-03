<template>
  <div>
    <v-app-bar
      height="70"
      elevation="4"
      fixed
      app
      :color="$vuetify.theme.dark ? '' : 'light-blue darken-4'"
      dark
    >
      <v-container class="pa-0 fill-height justify-space-between">
        <v-toolbar-title style="cursor: pointer" class="hidden-sm-and-down mr-3" @click="$router.push('/panel')">
          {{ $t('brand') }}
        </v-toolbar-title>

        <v-menu
          offset-y
          right
        >
          <template #activator="{ on, attrs }">
            <v-toolbar-items>
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="hidden-md-and-up">
                  mdi-cart
                </v-icon>
                <span class="hidden-sm-and-down">
                  <span v-if="!$route.params.shopid">
                    {{ $t('titles.shops') }}
                  </span>
                  <span v-else>
                    {{ $route.params.shopid }}
                  </span>
                </span>
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
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text to="/panel/new_shop" color="blue">
            {{ $t('actions.new_shop') }}
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-title style="cursor: pointer" class="hidden-md-and-up" @click="$router.push('/panel')">
          {{ $t('brand') }}
        </v-toolbar-title>
        <v-spacer class="hidden-sm-and-down" />
        <v-btn icon @click="toggle_theme">
          <v-icon v-if="$vuetify.theme.dark">
            mdi-white-balance-sunny
          </v-icon>
          <v-icon v-if="!$vuetify.theme.dark">
            mdi-weather-night
          </v-icon>
        </v-btn>
        <!-- <v-switch v-model="" class="mt-5" /> -->
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
                <v-icon class="hidden-md-and-up">
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
  data () {
    return {
      shops: []
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
