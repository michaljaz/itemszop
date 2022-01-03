<template>
  <div>
    <v-row>
      <v-col v-for="server in servers" :key="server">
        <v-card :to="`/shop/${$route.params.shopid}/server/123`" class="pa-3" elevation="5">
          <v-card-text class="d-flex justify-center headline">
            {{ server }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ShopPage',
  props: {
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Object,
      required: true
    }
  }
}
</script>
