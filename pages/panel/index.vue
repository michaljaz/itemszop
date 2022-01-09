<template>
  <div>
    <strong>
      Sklepy
    </strong>
    <v-row class="mt-3">
      <v-col
        v-for="shop in shops"
        :key="shop"
        cols="12"
        lg="4"
        md="6"
      >
        <v-card
          text
          class="mb-2"
          elevation="10"
          :to="`/panel/shop/${shop}`"
        >
          <v-card-text class="headline">
            <center>
              {{ shop }}
            </center>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'PanelPage',
  props: {
    shops: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  head () {
    return {
      title: 'Panel'
    }
  }
}
</script>
