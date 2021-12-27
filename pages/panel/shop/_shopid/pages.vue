<template>
  <div />
</template>
<script>
export default {
  name: 'ShopPages',
  props: {
    shop: {
      type: Object,
      default: () => ({})
    }
  },
  head () {
    return {
      title: 'Strony'
    }
  }
}
</script>
