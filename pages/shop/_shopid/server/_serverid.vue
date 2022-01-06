<template>
  <div>
    <v-row>
      <v-col v-for="service in services" :key="service.serviceId" cols="12" md="4">
        <ServiceCard :service="service" :shopid="$route.params.shopid" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ShopServer',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      services: []
    }
  },
  watch: {
    shop () {
      this.updateServices()
    }
  },
  mounted () {
    this.updateServices()
  },
  methods: {
    updateServices () {
      const result = []
      const { serverid } = this.$route.params
      for (const serviceId in this.shop.services) {
        if (this.shop.services[serviceId].server === serverid) {
          const service = Object.assign({}, this.shop.services[serviceId])
          service.serviceId = serviceId
          result.push(service)
        }
      }
      this.services = result
    }
  }
}
</script>
