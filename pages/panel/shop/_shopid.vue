<template>
  <div>
    <nuxt-child v-if="shop.loaded" :shop="shop" />
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
      shop: {
        loaded: false
      }
    }
  },
  watch: {
    $route (newRoute, oldRoute) {
      if (newRoute.params.shopid !== oldRoute.params.shopid) {
        this.removeListener(oldRoute.params.shopid)
        this.createListener(newRoute.params.shopid)
      }
    }
  },
  mounted () {
    this.createListener(this.$route.params.shopid)
  },
  methods: {
    removeListener (oldShopId) {
      this.$fire.database.ref().child(`shops/${oldShopId}`).off('value')
    },
    createListener (newShopId) {
      this.$fire.database.ref().child(`shops/${newShopId}`)
        .on('value', (s) => {
          this.shop = s.val()
          this.shop.loaded = true
        })
    }
  }
}
</script>
