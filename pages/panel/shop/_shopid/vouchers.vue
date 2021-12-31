<template>
  <div>
    <v-btn color="blue" text block large>
      Nowy voucher
    </v-btn>
  </div>
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
