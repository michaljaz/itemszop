<template>
  <div>
    <v-alert
      border="top"
      colored-border
      type="info"
      elevation="2"
    >
      Twój sklep jest dostępny pod adresem <a :href="url">{{ url }}</a>
    </v-alert>
  </div>
</template>
<script>
export default {
  name: 'ShopIndex',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      url: `${document.location.origin}/shop/${this.$route.params.shopid}`
    }
  },
  head () {
    return {
      title: 'Kokpit'
    }
  }
}
</script>
