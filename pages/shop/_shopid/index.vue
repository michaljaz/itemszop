<template>
  <div>
    {{ shop.name }}
  </div>
</template>

<script>
export default {
  name: 'ShopPage',
  props: {
    shop: {
      type: Object,
      required: true
    }
  }
}
</script>
