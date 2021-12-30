<template>
  <div>
    {{ shop.name }}
  </div>
</template>
<script>
export default {
  name: 'ShopIndex',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  head () {
    return {
      title: 'Kokpit'
    }
  }
}
</script>
