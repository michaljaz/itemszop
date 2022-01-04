<template>
  <div>
    <ShopListener public @servers="servers=$event" @shop="shop=$event" />
    <v-container v-if="shop.loaded">
      <h1 class="display-1 mb-5 mt-4">
        {{ shop.name }}
      </h1>
      <v-app-bar
        class="blue darken-4"
        elevation="4"
        rounded
        filled
      >
        <v-toolbar-items>
          <v-btn text :to="`/shop/${$route.params.shopid}`" active-class="no-active">
            Sklep
          </v-btn>
        </v-toolbar-items>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text>
            Zrealizuj voucher
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <div class="mt-3">
        <v-row>
          <v-col md="8" sm="12" xs="12" cols="12">
            <v-card>
              <v-card-text>
                <nuxt-child :shop="shop" :servers="servers" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="4" sm="12" xs="12" cols="12">
            <v-card>
              <v-card-title class="headline justify-center">
                Utrzymanie serwera
              </v-card-title>
              <v-card-text>
                <v-progress-linear value="15" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <div v-else class="d-flex mt-5 justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShopidRoute',
  data () {
    return {
      shop: {},
      servers: {}
    }
  }
}
</script>
<style>
.v-btn--active.no-active:not(:focus):not(:hover)::before
{
  opacity: 0 !important;
}
</style>
