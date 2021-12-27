<template>
  <div>
    <v-card
      max-width="344"
      elevation="10"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Pakiet VIP
          </v-list-item-title>
          <v-list-item-subtitle>
            SMS: 10zł
            <br>
            Przelew: 10zł
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar
          tile
          size="80"
          color="grey"
        />
      </v-list-item>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="blue">
          Edytuj
        </v-btn>
        <v-btn text color="red">
          Usuń
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'ShopServices',
  props: {
    shop: {
      type: Object,
      default: () => ({})
    }
  },
  head () {
    return {
      title: 'Usługi'
    }
  }
}
</script>
