<template>
  <div>
    <v-container v-if="shop.loaded">
      <h1 class="display-1 mb-5 mt-4">
        {{ shop.name }}
      </h1>
      <v-app-bar height="70" elevation="4" rounded>
        <v-container class="pa-0 fill-height justify-space-between">
          <v-toolbar-items>
            <v-btn text>
              Sklep
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn text>
              Zrealizuj voucher
            </v-btn>
          </v-toolbar-items>
        </v-container>
      </v-app-bar>
      <div class="mt-3">
        <v-row>
          <v-col md="8" sm="12" xs="12" cols="12">
            <v-card>
              <v-card-text>
                <nuxt-child :shop="shop" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="4" sm="12" xs="12" cols="12">
            <v-card>
              <v-card-title class="headline justify-center">
                Utrzymanie serwera
              </v-card-title>
              <v-card-text>
                Utrzymanie serwera
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <div v-else class="d-flex mt-5 justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShopidRoute',
  data () {
    return {
      shop: {
        loaded: false
      },
      shopid: null
    }
  },
  mounted () {
    this.shopid = this.$route.params.shopid
    this.createShopListener()
  },
  beforeDestroy () {
    this.removeShopListener()
  },
  methods: {
    createShopListener () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}`)
        .on('value', (snapshot) => {
          if (snapshot.exists()) {
            const shop = snapshot.val()
            shop.loaded = true
            this.shop = shop
          } else {
            this.$router.push('/')
          }
        })
    },
    removeShopListener () {
      this.$fire.database.ref().child(`shops/${this.shopid}`).off('value')
    }
  }
}
</script>
