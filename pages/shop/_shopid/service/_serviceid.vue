<template>
  <div>
    <ServiceCard :service="service" />
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
  data () {
    return {
      service: {}
    }
  },
  watch: {
    shop () {
      this.updateService()
    }
  },
  mounted () {
    this.updateService()
  },
  methods: {
    updateService () {
      const { serviceid } = this.$route.params
      const service = Object.assign({}, this.shop.services[serviceid])
      service.serviceId = serviceid
      this.service = service
    }
  }
}
</script>
