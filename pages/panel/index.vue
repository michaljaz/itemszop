<template>
  <div>
    <v-container>
      <v-btn
        v-for="item in shops"
        :key="item"
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
  computed: {
    ...mapGetters([
      'shops'
    ])
  }
}
</script>
