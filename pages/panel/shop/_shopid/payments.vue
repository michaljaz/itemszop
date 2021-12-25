<template>
  <div>
    <v-select
      v-model="select"
      :items="items"
      label="Standard"
    />
    <v-text-field label="ID Użytkownika" autocomplete="new-password" />
    <v-text-field label="Numer ID (Przelew)" autocomplete="new-password" />
    <v-text-field label="Hash (Przelew)" autocomplete="new-password" />
    <v-text-field label="Numer ID (SMS)" autocomplete="new-password" />
    <v-text-field label="Treść SMS" autocomplete="new-password" />
  </div>
</template>
<script>
export default {
  name: 'ShopPayments',
  data () {
    return {
      select: 'MicroSMS',
      items: ['MicroSMS']
    }
  }
}
</script>
