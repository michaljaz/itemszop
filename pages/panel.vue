<template>
  <div>
    <v-app-bar
      height="70"
      elevation="4"
      fixed
      app
    >
      <v-container class="pa-0 fill-height justify-space-between">
        <v-toolbar-title style="cursor: pointer" class="hidden-sm-and-down mr-3" @click="$router.push('/panel')">
          ItemSzop
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
                    Sklepy
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
              <v-list-item-title>Nowy sklep</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text to="/panel/new_shop" color="blue">
            Nowy sklep
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-title style="cursor: pointer" class="hidden-md-and-up" @click="$router.push('/panel')">
          ItemSzop
        </v-toolbar-title>
        <v-spacer class="hidden-sm-and-down" />
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
                    Konto
                  </span>
                </span>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </v-toolbar-items>
          </template>

          <v-list>
            <v-list-item to="/panel/settings">
              <v-list-item-title>Ustawienia</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="signOut"
            >
              <v-list-item-title>Wyloguj się</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
      <template v-if="tabs" #extension>
        <v-container>
          <v-tabs
            show-arrows
            background-color="rgb(0, 0, 0, 0)"
          >
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/`">
              Kokpit
            </v-tab>
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/servers`">
              Serwery
            </v-tab>
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/services`">
              Usługi
            </v-tab>
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/payments`">
              Płatności
            </v-tab>
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/vouchers`">
              Vouchery
            </v-tab>
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/pages`">
              Strony
            </v-tab>
            <v-tab nuxt :to="`/panel/shop/${$route.params.shopid}/settings`">
              Ustawienia
            </v-tab>
          </v-tabs>
        </v-container>
      </template>
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
      tabs: false,
      shops: []
    }
  },
  watch: {
    $route (to, from) {
      if (to.params.shopid) {
        this.tabs = true
      } else {
        this.tabs = false
      }
    }
  },
  mounted () {
    if (this.$route.params.shopid) {
      this.tabs = true
    } else {
      this.tabs = false
    }
    const { uid } = this.$fire.auth.currentUser
    const ref = this.$fire.database.ref(`users/${uid}`)
    ref.on('value', (s) => {
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
    }
  }
}
</script>
