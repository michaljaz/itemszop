<template>
  <div>
    <v-row>
      <v-col v-for="service in services" :key="service.serviceId" cols="12" md="4">
        <v-card elevation="5" height="100%" :to="`/shop/${$route.params.shopid}/service/${service.serviceId}`">
          <center>
            <template v-if="service.icon">
              <v-img :src="service.iconUrl" max-height="120" contain />
            </template>
            <template v-else>
              <v-img src="/item.png" max-height="120" contain />
            </template>
          </center>
          <v-card-text>
            <v-row>
              <v-col cols="12" xs="6" md="6" class="pb-0">
                SMS
              </v-col>
              <v-col cols="12" xs="6" md="6" class="text-right pb-0">
                <template v-if="service.sms">
                  {{ smsCost[service.smsType] }} zł
                </template>
                <template v-else>
                  X
                </template>
              </v-col>
              <v-col cols="12" xs="6" md="6" class="pt-1">
                Przelew
              </v-col>
              <v-col cols="12" xs="6" md="6" class="text-right pt-1">
                <template v-if="service.przelew">
                  {{ service.przelewCost }} zł
                </template>
                <template v-else>
                  X
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4" />
          <v-card-title class="justify-center">
            {{ service.name }}
          </v-card-title>
        </v-card>
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
      services: [],
      smsCost: {
        1: '1.23',
        2: '2.46',
        3: '3.69',
        4: '4.92',
        5: '6.15',
        6: '7.38',
        7: '11.07',
        8: '17.22',
        9: '23.37',
        10: '24.60',
        11: '30.75'
      }
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
