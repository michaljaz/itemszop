<template>
  <div />
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
          result.push(this.shop.services[serviceId])
        }
      }
      this.services = result
    }
  }
}
</script>
