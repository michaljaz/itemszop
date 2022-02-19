<template>
  <div>
    <ShopListener @servers="servers=$event" @shop="shop=$event" @payments="payments=$event" />
    <nuxt-child
      v-if="shop.loaded"
      :shop="shop"
      :servers="servers"
      :payments="payments"
    />
    <div v-else class="d-flex mt-5 justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShopPage',
  data () {
    return {
      shop: {},
      servers: {},
      payments: {}
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  }
}
</script>
