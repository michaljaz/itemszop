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
      default: () => {}
    }
  }
}
</script>
