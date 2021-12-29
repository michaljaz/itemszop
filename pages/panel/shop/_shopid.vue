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
      listeningServers: {}
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
        this.changeShopListener(newRoute.params.shopid, oldRoute.params.shopid)
      }
    }
  },
  mounted () {
    this.createShopListener(this.$route.params.shopid)
  },
  methods: {
    updateServerListeners (servers) {
      // Add new servers
      Object.keys(servers).forEach((serverId) => {
        if (!this.listeningServers[serverId]) {
          this.createServerListener(serverId)
        }
      })
      // Remove old server listeners
      Object.keys(this.listeningServers).forEach((serverId) => {
        if (!servers[serverId]) {
          this.removeServerListener(serverId)
        }
      })
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
    changeShopListener (oldShopId, newShopId) {
      this.removeShopListener(oldShopId)
      this.createShopListener(newShopId)
    },
    removeShopListener (oldShopId) {
      this.$fire.database.ref().child(`shops/${oldShopId}`).off('value')
    },
    createShopListener (newShopId) {
      this.$fire.database.ref().child(`shops/${newShopId}`)
        .on('value', (s) => {
          this.shop = s.val()
          this.shop.loaded = true
          this.updateServerListeners(this.shop.servers)
        })
    }
  }
}
</script>
