<template>
  <div />
</template>
<script>
export default {
  name: 'ShopVouchers',
  props: {
    shop: {
      type: Object,
      default: () => ({})
    }
  },
  head () {
    return {
      title: 'Vouchery'
    }
  }
}
</script>
