<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ shop.name }}
    </h1>
    <v-alert
      border="top"
      colored-border
      type="info"
      elevation="2"
    >
      {{ $t('shop_url') }} <a :href="url">{{ url }}</a>
    </v-alert>
    <v-row>
      <v-col cols="12" md="6">
        <v-textarea
          :label="$t('shop_html')"
          filled
          value="<iframe style=&quot;z-index:99999999;border:0px;position:fixed;width:100%;height:100%;top:0px;left:0px;&quot; src=&quot;https://itemszop.vercel.app/#/shop/gitcraft&quot; />"
        />
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
