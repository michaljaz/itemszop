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
      servers: {},
      payments: {},
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
    payments () {
      this.$emit('payments', this.payments)
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
      this.createPaymentsListener(shopId)
      this.$fire.database.ref().child(`shops/${shopId}`)
        .on('value', (snapshot) => {
          if (snapshot.exists()) {
            const shop = snapshot.val() === null ? {} : snapshot.val()
            shop.loaded = true
            this.shop = shop
          } else if (this.loggedIn) {
            // console.log('shop not exist', shopId)
            this.$router.push('/')
          } else {
            window.top.location.href = process.env.baseUrl
          }
        })
    },
    createPaymentsListener (shopId) {
      if (!this.public) {
        this.$fire.database.ref().child(`payments/${shopId}`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              this.payments = snapshot.val() === null ? {} : snapshot.val()
            }
          })
      } else {
        this.$fire.database.ref().child(`payments/${shopId}/microsms_sms_text`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newPayments = Object.assign({}, this.payments)
              newPayments.microsms_sms_text = data
              this.payments = newPayments
            }
          })
        this.$fire.database.ref().child(`payments/${shopId}/lvlup`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newPayments = Object.assign({}, this.payments)
              newPayments.lvlup = data
              this.payments = newPayments
            }
          })
        this.$fire.database.ref().child(`payments/${shopId}/microsms`)
          .on('value', (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val() === null ? {} : snapshot.val()
              const newPayments = Object.assign({}, this.payments)
              newPayments.microsms = data
              this.payments = newPayments
            }
          })
      }
    },
    destroyListeners (shopId) {
      for (const serverId in this.listeningServers) {
        this.destroyServerListener(serverId)
      }
      this.$fire.database.ref().child(`shops/${shopId}`).off('value')
      this.$fire.database.ref().child(`payments/${shopId}`).off('value')
      this.$fire.database.ref().child(`payments/${shopId}/microsms_sms_text`).off('value')
      this.$fire.database.ref().child(`payments/${shopId}/lvlup`).off('value')
      this.$fire.database.ref().child(`payments/${shopId}/microsms`).off('value')
    }
  }
}
</script>
