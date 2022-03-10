<template>
  <div>
    <v-container>
      <center>
        <div class="display-2 mt-7">
          {{ $t('titles.payment_success') }}!
        </div>
        <v-btn :to="`${shopPath}/`" color="primary" class="mt-10" text>
          {{ $t('actions.back_to_servers_list') }}
        </v-btn>
      </center>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'PaymentSuccess',
  layout: 'shop',
  props: {
    shopPath: {
      type: String,
      required: true
    }
  },
  head () {
    return {
      title: this.$t('titles.payment_success')
    }
  },
  mounted () {
    this.$emit('breadcrumb', [{
      text: this.$t('titles.shop'),
      disabled: false,
      href: `${this.shopPath}/`
    },
    {
      text: this.$t('titles.payment_success'),
      disabled: true
    }])
  }
}
</script>
