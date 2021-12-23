<template>
  <div>
    <v-btn
      v-for="item in shop.servers"
      :key="item.name"
      large
      block
      text
      class="mb-2"
    >
      {{ item.name }}
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopIndex',
  props: {
    shop: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
