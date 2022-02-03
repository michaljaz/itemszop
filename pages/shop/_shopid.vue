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
            {{ $t('titles.shop') }}
          </v-btn>
        </v-toolbar-items>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text :to="`/shop/${$route.params.shopid}/voucher`">
            {{ $t('titles.redeem_voucher') }}
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <div class="mt-3">
        <v-row>
          <v-col md="8" sm="12" xs="12" cols="12">
            <v-card>
              <v-card-text>
                <v-breadcrumbs :items="breadCrumbs" class="pt-2 pl-2">
                  <template #item="{ item }">
                    <v-breadcrumbs-item
                      :to="item.href"
                      class="text-subtitle-1 crumb-item"
                      :disabled="item.disabled"
                      exact
                    >
                      {{ item.text }}
                    </v-breadcrumbs-item>
                  </template>
                </v-breadcrumbs>
                <nuxt-child :shop="shop" :servers="servers" @breadcrumb="breadCrumbs=$event" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="4" sm="12" xs="12" cols="12">
            <v-card>
              <v-card-title class="headline justify-center">
                {{ $t('titles.monthly_goal') }}
              </v-card-title>
              <v-card-text>
                <v-progress-linear :value="collected" />
                <h1 class="mt-4 d-flex headline justify-center">
                  „{{ $t('titles.server_maintenance') }}”
                </h1>
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-title class="headline justify-center">
                {{ $t('titles.latest_payments') }}
              </v-card-title>
              <v-card-text>
                <v-list flat>
                  <v-list-item v-for="k in history" :key="k.date" two-line>
                    <v-list-item-avatar
                      tile
                      size="40"
                    >
                      <v-img :src="`https://minotar.net/helm/${k.nick}/32.png`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ k.nick }}</v-list-item-title>
                      <v-list-item-subtitle>{{ k.service }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
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
      servers: {},
      breadCrumbs: []
    }
  },
  computed: {
    collected () {
      return this.shop.collected / this.shop.goal * 100
    },
    history () {
      const history = Object.values(this.shop.history)
      history.sort((x, y) => {
        if (x.date > y.date) {
          return -1
        }
        if (x.date < y.date) {
          return 1
        }
        return 0
      })
      return history.slice(0, this.shop.maxservices)
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
