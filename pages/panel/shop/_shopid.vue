<template>
  <div>
    <v-navigation-drawer
      :color="$vuetify.theme.dark ? `#272727`: ''"
      permanent
      fixed
      app
      width="270"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mt-2">
            {{ shop.name }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="url">
            <a :href="url" target="_blank">{{ url }}</a>
          </v-list-item-subtitle>
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
          :active-class="isDashboard ? '' : `no-active`"
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
    <ShopListener @servers="servers=$event" @shop="shop=$event" @config="config=$event" />
    <nuxt-child
      v-if="shop.loaded"
      :shop="shop"
      :servers="servers"
      :config="config"
      :url="url"
    />
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
  name: 'ShopPage',
  data () {
    return {
      shop: {},
      servers: {},
      config: {}
    }
  },
  head () {
    return {
      titleTemplate: `${this.$route.params.shopid}: %s`
    }
  },
  computed: {
    url () {
      if (process.env.singleShopId) {
        if (this.$route.params.shopid !== process.env.singleShopId) {
          return ''
        } else {
          return `${document.location.origin}`
        }
      } else {
        return `${document.location.origin}/shop/${this.$route.params.shopid}`
      }
    },
    isDashboard () {
      return this.$route.path === `/panel/shop/${this.$route.params.shopid}/` || this.$route.path === `/panel/shop/${this.$route.params.shopid}`
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
