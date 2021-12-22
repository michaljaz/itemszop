<template>
  <div>
    <v-btn
      v-for="item in shops"
      :key="item"
      block
      large
      text
      class="mb-2"
      :to="`/panel/shop/${item}`"
    >
      {{ item }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'PanelPage',
  props: {
    shops: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  head () {
    return {
      title: 'Panel'
    }
  }
}
</script>
