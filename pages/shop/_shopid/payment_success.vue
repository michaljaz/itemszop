<template>
  <div>
    <v-container>
      <center>
        <div class="display-2 mt-7">
          Płatność została zrealizowana pomyślnie!
        </div>
        <v-btn :to="`/shop/${$route.params.shopid}`" color="blue" class="mt-10" text>
          Przejdź do strony głównej
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
      text: 'Sklep',
      disabled: false,
      href: `/shop/${this.$route.params.shopid}`
    },
    {
      text: 'Płatność zakończona pomyślnie',
      disabled: true
    }])
  }
}
</script>
