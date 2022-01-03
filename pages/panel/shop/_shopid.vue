<template>
  <div>
    <ShopListener @servers="servers=$event" @shop="shop=$event" />
    <nuxt-child
      v-if="shop.loaded"
      :shop="shop"
      :servers="serversList"
      :services="servicesList"
      :serversmap="servers"
    />
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
      shop: {},
      servicesList: [],
      serversList: [],
      servers: {}
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  },
  watch: {
    servers () {
      this.updateServersList()
    },
    shop () {
      this.updateServicesList()
    }
  },
  methods: {
    updateServicesList () {
      const result = []
      if (this.shop.services) {
        const servicesByServer = {}
        Object.keys(this.shop.services).forEach((serviceId) => {
          const service = Object.assign({}, this.shop.services[serviceId])
          service.serviceId = serviceId
          if (servicesByServer[service.server]) {
            servicesByServer[service.server].push(service)
          } else {
            servicesByServer[service.server] = [service]
          }
        })
        Object.keys(servicesByServer).forEach((serverId) => {
          result.push({
            name: serverId,
            services: servicesByServer[serverId]
          })
        })
      }
      this.servicesList = result.slice().reverse()
    },
    updateServersList () {
      const result = []
      Object.keys(this.servers).forEach((serverId) => {
        if (this.servers[serverId]) {
          const server = Object.assign({}, this.servers[serverId])
          server.serverId = serverId
          result.push(server)
        }
      })
      this.serversList = result
    }
  }
}
</script>
