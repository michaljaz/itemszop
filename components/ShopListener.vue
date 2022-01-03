<template>
  <div />
</template>
<script>
export default {
  name: 'ShopListener',
  props: {
    public: {
      type: Boolean,
      default: () => (false)
    }
  },
  data () {
    return {
      shop: {},
      listeningServers: {},
      servers: {},
      shopid: this.$route.params.shopid
    }
  },
  watch: {
    $route (newRoute, oldRoute) {
      if (newRoute.params.shopid !== oldRoute.params.shopid) {
        this.shopid = newRoute.params.shopid
        this.destroyListeners(oldRoute.params.shopid)
        this.createShopListener(newRoute.params.shopid)
      }
    },
    servers () {
      this.$emit('servers', this.servers)
    },
    shop () {
      this.updateServerListeners(this.shop.servers)
      this.$emit('shop', this.shop)
    }
  },
  mounted () {
    this.createShopListener(this.$route.params.shopid)
  },
  beforeDestroy () {
    this.destroyListeners(this.shopid)
  },
  methods: {
    updateServerListeners (servers) {
      if (this.listeningServers && servers !== undefined) {
        Object.keys(this.listeningServers).forEach((serverId) => {
          if (!servers[serverId]) {
            this.destroyServerListener(serverId)
          }
        })
      }
      if (servers) {
        Object.keys(servers).forEach((serverId) => {
          if (!this.listeningServers[serverId]) {
            this.createServerListener(serverId)
          }
        })
      }
    },
    destroyServerListener (serverId) {
      delete this.listeningServers[serverId]
      const newServers = Object.assign({}, this.servers)
      delete newServers[serverId]
      this.servers = newServers
      this.$fire.database.ref().child(`servers/${serverId}`).off('value')
    },
    createServerListener (serverId) {
      this.listeningServers[serverId] = true
      const serverPath = this.public ? `servers/${serverId}/serverName` : `servers/${serverId}`
      this.$fire.database.ref().child(serverPath)
        .on('value', (s) => {
          const newServers = Object.assign({}, this.servers)
          newServers[serverId] = s.val()
          this.servers = newServers
        })
    },
    createShopListener (shopId) {
      this.$fire.database.ref().child(`shops/${shopId}`)
        .on('value', (snapshot) => {
          if (snapshot.exists()) {
            const shop = snapshot.val() === null ? {} : snapshot.val()
            shop.loaded = true
            this.shop = shop
          } else {
            this.$router.push('/')
          }
        })
    },
    destroyListeners (shopId) {
      if (this.listeningServers) {
        Object.keys(this.listeningServers).forEach((serverId) => {
          this.destroyServerListener(serverId)
        })
      }
      this.$fire.database.ref().child(`shops/${shopId}`).off('value')
    }
  }
}
</script>
