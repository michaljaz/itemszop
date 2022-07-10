<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ shop.name }}
    </h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-alert
          v-if="url"
          text
          color="accent"
          elevation="2"
        >
          {{ $t('misc.shop_url') }} <a :href="url" target="_blank">{{ url }}</a>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>
<script>

export default {
  name: 'ShopIndex',
  props: {
    shop: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return { }
  },
  head () {
    return {
      title: this.$t('titles.dashboard')
    }
  }
}
</script>
