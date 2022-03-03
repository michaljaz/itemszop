<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <v-card
          height="450"
          width="256"
          class="mx-auto"
        >
          <v-navigation-drawer permanent>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ shop.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list
              dense
              nav
            >
              <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to="`/panel/shop/${$route.params.shopid}/${item.link}`"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <ShopListener @servers="servers=$event" @shop="shop=$event" @payments="payments=$event" />
        <nuxt-child
          v-if="shop.loaded"
          :shop="shop"
          :servers="servers"
          :payments="payments"
        />
        <div v-else class="d-flex mt-5 justify-center">
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ShopPage',
  data () {
    return {
      shop: {},
      servers: {},
      payments: {},
      items: [
        { title: this.$t('titles.dashboard'), icon: 'mdi-view-dashboard', link: '' },
        { title: this.$t('titles.servers'), icon: 'mdi-server', link: 'servers' },
        { title: this.$t('titles.services'), icon: 'mdi-cart', link: 'services' },
        { title: this.$t('titles.payments'), icon: 'mdi-credit-card-plus', link: 'payments' },
        { title: this.$t('titles.vouchers'), icon: 'mdi-ticket-percent', link: 'vouchers' },
        { title: this.$t('titles.pages'), icon: 'mdi-file', link: 'pages' },
        { title: this.$t('titles.rcon'), icon: 'mdi-lan-connect', link: 'rcon' },
        { title: this.$t('titles.settings'), icon: 'mdi-cog', link: 'settings' }
      ],
      right: null
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  }
}
</script>
