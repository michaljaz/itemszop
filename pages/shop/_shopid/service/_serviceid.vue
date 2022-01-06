<template>
  <div>
    {{ service.name }}
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
      this.updateServices()
    }
  },
  mounted () {
    this.updateServices()
  },
  methods: {
    updateServices () {
      const { serviceid } = this.$route.params
      this.service = this.shop.services[serviceid]
    }
  }
}
</script>
