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
import { mapGetters } from 'vuex'

export default {
  name: 'PanelPage',
  layout: 'PanelLayout',
  head () {
    return {
      title: 'Panel'
    }
  },
  computed: {
    ...mapGetters([
      'shops'
    ])
  }
}
</script>
