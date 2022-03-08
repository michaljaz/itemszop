<template>
  <div>
    <ShopListener @servers="servers=$event" @shop="shop=$event" @config="config=$event" />
    <nuxt-child
      v-if="shop.loaded"
      :shop="shop"
      :servers="servers"
      :config="config"
      :url="url"
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
      config: {}
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  },
  computed: {
    url () {
      if (process.env.singleShopId) {
        if (this.$route.params.shopid !== process.env.singleShopId) {
          return ''
        } else {
          return `${document.location.origin}`
        }
      } else {
        return `${document.location.origin}/shop/${this.$route.params.shopid}`
      }
    }
  }
}
</script>
<style>
.v-list-item--active.no-active:not(:focus):not(:hover)::before
{
  opacity: 0 !important;
}
</style>
