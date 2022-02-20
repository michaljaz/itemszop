<template>
  <div>
    <v-row>
      <v-col cols="12" md="5" sm="6">
        <ServiceCard :service="service" :payments="payments" :shopid="shopId" />
      </v-col>
      <v-col cols="12" md="7" sm="6">
        <v-btn class="mb-3 pl-2" :to="`${shopPath}/server/${service.server}`">
          <v-icon>mdi-arrow-left-thin</v-icon>
          {{ $t('actions.back_to_services') }}
        </v-btn>
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="service.description" />
        <!--eslint-enable-->
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ServicePage',
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
    service () {
      const { serviceid } = this.$route.params
      const service = Object.assign({}, this.shop.services[serviceid])
      service.serviceId = serviceid
      return service
    },
    serverName () {
      return this.servers[this.service.server]
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
        text: this.serverName,
        disabled: false,
        href: `${this.shopPath}/server/${this.service.server}`
      },
      {
        text: this.service.name,
        disabled: true
      }])
    }
  }
}
</script>
