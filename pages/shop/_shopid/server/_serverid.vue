<template>
  <div>
    <v-row>
      <v-col
        v-for="service in services"
        :key="service.serviceId"
        cols="12"
        sm="6"
        md="6"
        lg="4"
        xl="4"
      >
        <ServiceCard
          :paypal-loaded="paypalLoaded"
          :service="service"
          :config="config"
          :shopid="shopId"
          style="height:100%;"
          @blur="$emit('blur',$event)"
        />
      </v-col>
    </v-row>
    <center v-if="!services.length">
      <div class="display-1 mt-7">
        {{ $t('titles.no_service_available') }}
      </div>
      <v-btn :to="`${shopPath}/`" color="primary" class="mt-10" text>
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
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return { paypalLoaded: false }
  },
  head () {
    return {
      title: this.$t('titles.services')
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
    if (this.config.paypal) {
      const script = document.createElement('script')
      script.onload = () => {
        this.paypalLoaded = true
      }
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.paypal_id}&components=buttons,marks&enable-funding=p24&currency=PLN`
      document.head.appendChild(script)
    }
  },
  methods: {
    updateBreadCrumb () {
      this.$emit('breadcrumb', [{
        text: this.$t('titles.shop'),
        disabled: Object.keys(this.servers).length === 1,
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
