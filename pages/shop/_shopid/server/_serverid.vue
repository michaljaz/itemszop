<template>
  <div>
    <v-row>
      <v-col v-for="service in services" :key="service.serviceId" cols="12" md="6" xl="4">
        <ServiceCard :service="service" :payments="payments" :shopid="shopId" :link="`${shopPath}/service/${service.serviceId}`" />
      </v-col>
    </v-row>
    <center v-if="!services.length">
      <div class="display-1 mt-7">
        {{ $t('titles.no_service_available') }}
      </div>
      <v-btn :to="`${shopPath}/`" color="blue" class="mt-10" text>
        {{ $t('actions.back_to_servers_list') }}
      </v-btn>
    </center>
  </div>
</template>
<script>
export default {
  name: 'ShopServer',
  layout: 'shop',
  props: {
    shopId: {
      type: String,
      required: true
    },
    shopPath: {
      type: String,
      required: true
    },
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Object,
      required: true
    },
    payments: {
      type: Object,
      required: true
    }
  },
  computed: {
    services () {
      const result = []
      const { serverid } = this.$route.params
      for (const serviceId in this.shop.services) {
        if (this.shop.services[serviceId].server === serverid) {
          const service = Object.assign({}, this.shop.services[serviceId])
          service.serviceId = serviceId
          result.push(service)
        }
      }
      return result
    }
  },
  watch: {
    servers () {
      this.updateBreadCrumb()
    }
  },
  mounted () {
    this.updateBreadCrumb()
  },
  methods: {
    updateBreadCrumb () {
      this.$emit('breadcrumb', [{
        text: this.$t('titles.shop'),
        disabled: false,
        href: `${this.shopPath}/`
      },
      {
        text: this.servers[this.$route.params.serverid],
        disabled: false,
        href: this.$route.path
      },
      {
        text: this.$t('titles.services'),
        disabled: true
      }])
    }
  }
}
</script>
