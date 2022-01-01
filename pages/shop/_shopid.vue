<template>
  <div>
    <v-container>
      <h1 class="display-1 mb-5 mt-4">
        gitcraft.eu
      </h1>
      <v-app-bar height="70" elevation="4" rounded>
        <v-container class="pa-0 fill-height justify-space-between">
          <v-toolbar-items>
            <v-btn text>
              Sklep
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn text>
              Zrealizuj voucher
            </v-btn>
          </v-toolbar-items>
        </v-container>
      </v-app-bar>
      <div class="mt-3">
        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <nuxt-child />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="headline justify-center">
                Utrzymanie serwera
              </v-card-title>
              <v-card-text>
                Utrzymanie serwera
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'ShopidRoute'
}
</script>
