<template>
  <div>
    <v-row>
      <v-col v-for="service in services" :key="service.serviceId" cols="12" md="4">
        <ServiceCard :service="service" :link="`/shop/${$route.params.shopid}/service/${service.serviceId}`" />
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
    },
    servers: {
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
    },
    servers () {
      this.updateBreadCrumb()
    }
  },
  mounted () {
    this.updateServices()
    this.updateBreadCrumb()
  },
  methods: {
    updateBreadCrumb () {
      this.$emit('breadcrumb', [{
        text: 'Sklep',
        disabled: false,
        href: `/shop/${this.$route.params.shopid}`
      },
      {
        text: this.servers[this.$route.params.serverid],
        disabled: false,
        href: this.$route.path
      },
      {
        text: 'Usługi',
        disabled: true
      }])
    },
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
