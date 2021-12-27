<template>
  <div>
    <nuxt-child :shop="shop" />
  </div>
</template>
<script>
export default {
  name: 'ShopPage',
  data () {
    return {
      shop: {
        payments: {
          paymentsUserId: '',
          paymentsPrzelewId: '',
          paymentsHash: '',
          paymentsShopId: '',
          paymentsSMS: ''
        }
      },
      listener: false
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
      if (this.listener !== false) {
        this.$fire.database.ref().child(`shops/${oldShopId}`).off('value', this.listener)
      }
    },
    createListener (newShopId) {
      this.listener = this.$fire.database.ref().child(`shops/${newShopId}`)
        .on('value', (s) => {
          this.shop = s.val()
        })
    }
  }
}
</script>
