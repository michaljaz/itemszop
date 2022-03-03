<template>
  <div>
    <v-row>
      <v-col cols="12" lg="3" md="4" sm="12">
        <v-card
          width="100%"
          class="mx-auto"
        >
          <v-navigation-drawer permanent :color="$vuetify.theme.dark ? `#272727`: ''" width="100%">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mt-2">
                  {{ shop.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list
              nav
              dense
            >
              <v-divider class="mb-1" />
              <v-list-item
                link
                :to="`/panel/shop/${$route.params.shopid}/`"
                active-class="no-active"
              >
                <v-list-item-icon>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t('titles.dashboard') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                :to="`/panel/shop/${$route.params.shopid}/servers`"
              >
                <v-list-item-icon>
                  <v-icon>mdi-server</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('titles.servers') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                :to="`/panel/shop/${$route.params.shopid}/services`"
              >
                <v-list-item-icon>
                  <v-icon>mdi-cart</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('titles.services') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                :to="`/panel/shop/${$route.params.shopid}/payments`"
              >
                <v-list-item-icon>
                  <v-icon>mdi-credit-card-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('titles.payments') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                :to="`/panel/shop/${$route.params.shopid}/settings`"
              >
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('titles.settings') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mb-1" />
              <v-list-group
                :value="true"
                no-action
              >
                <template #activator>
                  <v-list-item-icon>
                    <v-icon>mdi-view-grid-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('titles.additional_modules') }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item
                  link
                  :to="`/panel/shop/${$route.params.shopid}/vouchers`"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-ticket-percent</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('titles.vouchers') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  :to="`/panel/shop/${$route.params.shopid}/pages`"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('titles.pages') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  :to="`/panel/shop/${$route.params.shopid}/rcon`"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-lan-connect</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('titles.rcon') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col cols="12" lg="9" md="8" sm="12">
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
      payments: {}
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  }
}
</script>
<style>
.v-list-item--active.no-active:not(:focus):not(:hover)::before
{
  opacity: 0 !important;
}
</style>
