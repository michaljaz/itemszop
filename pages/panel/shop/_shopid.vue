<template>
  <div>
    <nuxt-child v-if="shop.loaded" :shop="shop" :servers="servers" />
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
  name: 'ShopPage',
  data () {
    return {
      shop: {
        loaded: false
      },
      servers: {},
      listeningServers: {},
      shopid: null
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  },
  watch: {
    $route (newRoute, oldRoute) {
      if (newRoute.params.shopid !== oldRoute.params.shopid) {
        this.shopid = newRoute.params.shopid
        this.destroyListeners(oldRoute.params.shopid)
        this.createShopListener(newRoute.params.shopid)
      }
    }
  },
  mounted () {
    this.shopid = this.$route.params.shopid
    this.createShopListener(this.$route.params.shopid)
  },
  beforeDestroy () {
    this.destroyListeners(this.shopid)
  },
  methods: {
    destroyListeners (shopId) {
      if (this.listeningServers) {
        Object.keys(this.listeningServers).forEach((serverId) => {
          this.removeServerListener(serverId)
        })
      }
      this.removeShopListener(shopId)
    },
    updateServerListeners (servers) {
      // Remove old server listeners
      if (this.listeningServers) {
        Object.keys(this.listeningServers).forEach((serverId) => {
          if (!servers[serverId]) {
            this.removeServerListener(serverId)
          }
        })
      }
      // Add new server listeners
      if (servers) {
        Object.keys(servers).forEach((serverId) => {
          if (!this.listeningServers[serverId]) {
            this.createServerListener(serverId)
          }
        })
      }
    },
    createServerListener (serverId) {
      this.listeningServers[serverId] = true
      this.$fire.database.ref().child(`servers/${serverId}`)
        .on('value', (s) => {
          const newServers = Object.assign({}, this.servers)
          newServers[serverId] = s.val()
          this.servers = newServers
        })
    },
    removeServerListener (serverId) {
      delete this.listeningServers[serverId]
      const newServers = Object.assign({}, this.servers)
      delete newServers[serverId]
      this.servers = newServers
      this.$fire.database.ref().child(`servers/${serverId}`).off('value')
    },
    removeShopListener (shopId) {
      this.$fire.database.ref().child(`shops/${shopId}`).off('value')
    },
    createShopListener (shopId) {
      this.$fire.database.ref().child(`shops/${shopId}`)
        .on('value', (s) => {
          this.shop = s.val()
          this.shop.loaded = true
          this.updateServerListeners(this.shop.servers)
        })
    }
  }
}
</script>
