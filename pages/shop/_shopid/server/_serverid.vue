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
      Object.keys(this.shop.services).forEach((serviceId) => {
        if (this.shop.services[serviceId].server === serverid) {
          result.push(this.shop.services[serviceId])
        }
      })
      console.log(result)
      this.services = result
    }
  }
}
</script>
