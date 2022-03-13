<template>
  <div>
    <strong>
      {{ $t('titles.shops') }}
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
          class="mb-2 pt-5 pb-5"
          elevation="2"
          :to="`/panel/shop/${shop}`"
          :color="checkShop(shop) ? 'primary' : ''"
        >
          <v-card-text class="headline">
            <center>
              {{ shop }}
            </center>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      large
      block
      text
      color="primary"
      class="mt-5"
      to="/panel/new_shop"
    >
      {{ $t('actions.new_shop') }}
    </v-btn>
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
      title: this.$t('titles.panel')
    }
  },
  methods: {
    checkShop (shop) {
      return shop === process.env.singleShopId
    }
  }
}
</script>
