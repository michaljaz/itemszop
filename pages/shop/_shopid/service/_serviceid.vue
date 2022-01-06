<template>
  <div>
    <v-row>
      <v-col cols="12" md="5" sm="6">
        <ServiceCard :service="service" />
      </v-col>
      <v-col cols="12" md="7" sm="6">
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
  props: {
    shop: {
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
    }
  }
}
</script>
