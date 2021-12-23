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
      shop: {}
    }
  },
  mounted () {
    const { shopid } = this.$route.params
    this.$fire.database.ref().child(`shops/${shopid}`)
      .on('value', (s) => {
        this.shop = s.val()
      })
  }
}
</script>
