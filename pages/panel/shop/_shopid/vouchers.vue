<template>
  <div />
</template>
<script>
export default {
  name: 'ShopVouchers',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  head () {
    return {
      title: 'Vouchery'
    }
  }
}
</script>
