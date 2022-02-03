<template>
  <div>
    <v-container>
      <center>
        <div class="display-2 mt-7">
          {{ $t('titles.payment_success') }}!
        </div>
        <v-btn :to="`/shop/${$route.params.shopid}`" color="blue" class="mt-10" text>
          {{ $t('actions.back_to_servers_list') }}
        </v-btn>
      </center>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'PaymentSuccess',
  mounted () {
    this.$emit('breadcrumb', [{
      text: this.$t('titles.shop'),
      disabled: false,
      href: `/shop/${this.$route.params.shopid}`
    },
    {
      text: this.$t('titles.payment_success'),
      disabled: true
    }])
  }
}
</script>
