<template>
  <div />
</template>
<script>
import { mapGetters } from 'vuex'

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
      shopid: this.$route.params.shopid ? this.$route.params.shopid : process.env.singleShopId
    }
  },
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  watch: {
    $route (newRoute, oldRoute) {
      if (this.$route.params.shopid) {
        if (newRoute.params.shopid !== oldRoute.params.shopid) {
          this.shopid = newRoute.params.shopid
          this.destroyListeners(oldRoute.params.shopid)
          this.createShopListener(newRoute.params.shopid)
        }
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
    if (this.$route.params.shopid) {
      this.createShopListener(this.$route.params.shopid)
    } else {
      this.createShopListener(process.env.singleShopId)
    }
  },
  beforeDestroy () {
    this.destroyListeners(this.shopid)
  },
  methods: {
    updateServerListeners (servers) {
      if (servers !== undefined) {
        for (const serverId in this.listeningServers) {
          if (!servers[serverId]) {
            this.destroyServerListener(serverId)
          }
        }
      }

      for (const serverId in servers) {
        if (!this.listeningServers[serverId]) {
          this.createServerListener(serverId)
        }
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
          } else if (this.loggedIn) {
            console.log('shop not exist', shopId)
            this.$router.push('/')
          } else {
            window.top.location.href = process.env.baseUrl
          }
        })
    },
    destroyListeners (shopId) {
      for (const serverId in this.listeningServers) {
        this.destroyServerListener(serverId)
      }
      this.$fire.database.ref().child(`shops/${shopId}`).off('value')
    }
  }
}
</script>
