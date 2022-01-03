<template>
  <div>
    <li v-for="server in servers" :key="server">
      {{ server }}
    </li>
  </div>
</template>

<script>
export default {
  name: 'ShopPage',
  props: {
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Object,
      required: true
    }
  }
}
</script>
