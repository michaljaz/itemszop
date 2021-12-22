<template>
  <div>
    <v-container>
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
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'PanelPage',
  props: ['shops'],
  head () {
    return {
      title: 'Panel'
    }
  }
}
</script>
