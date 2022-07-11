<template>
  <div />
</template>
<script>
import { mapGetters } from 'vuex'

let captured = false
const WebSocketClone = WebSocket
WebSocket = function (...data) {
  if (!captured) {
    WebSocket._firebaseWebsocketUrl = data[0]
    captured = true
  }

  return new WebSocketClone(...data)
}

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
      servers: {},
      config: {},
      listeningServers: {},
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
    },
    config () {
      this.$emit('config', this.config)
    }
  },
  mounted () {
    this.createShopListener(this.shopid)
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
      this.createConfigListener(shopId)
      this.$fire.database.ref().child(`shops/${shopId}`)
        .on('value', (snapshot) => {
          if (snapshot.exists()) {
            const shop = snapshot.val() === null ? {} : snapshot.val()
            shop.loaded = true
            this.shop = shop
          } else if (this.loggedIn) {
            this.$router.push('/')
          } else {
            window.top.location.href = process.env.baseUrl
          }
        })
    },
    createConfigListener (shopId) {
      if (!this.public) {
        this.$fire.database.ref().child(`config/${shopId}`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              this.config = snapshot.val() === null ? {} : snapshot.val()
            }
          })
      } else {
        this.$fire.database.ref().child(`config/${shopId}/microsms_sms_text`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newConfig = Object.assign({}, this.config)
              newConfig.microsms_sms_text = data
              this.config = newConfig
            }
          })
        this.$fire.database.ref().child(`config/${shopId}/lvlup`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newConfig = Object.assign({}, this.config)
              newConfig.lvlup = data
              this.config = newConfig
            }
          })
        this.$fire.database.ref().child(`config/${shopId}/microsms`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newConfig = Object.assign({}, this.config)
              newConfig.microsms = data
              this.config = newConfig
            }
          })
        this.$fire.database.ref().child(`config/${shopId}/paypal`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newConfig = Object.assign({}, this.config)
              newConfig.paypal = data
              this.config = newConfig
            }
          })
        this.$fire.database.ref().child(`config/${shopId}/paypal_id`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newConfig = Object.assign({}, this.config)
              newConfig.paypal_id = data
              this.config = newConfig
            }
          })
      }
    },
    destroyListeners (shopId) {
      for (const serverId in this.listeningServers) {
        this.destroyServerListener(serverId)
      }
      this.$fire.database.ref().child(`shops/${shopId}`).off('value')
      this.$fire.database.ref().child(`config/${shopId}`).off('value')
      this.$fire.database.ref().child(`config/${shopId}/microsms_sms_text`).off('value')
      this.$fire.database.ref().child(`config/${shopId}/lvlup`).off('value')
      this.$fire.database.ref().child(`config/${shopId}/microsms`).off('value')
    }
  }
}
</script>
