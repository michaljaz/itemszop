<template>
  <default-layout>
    <div v-if="background" class="background_blur" :style="`background:url(${backgroundUrl}) no-repeat center center fixed;`" />
    <ShopListener public @servers="servers=$event" @shop="shop=$event" @payments="payments=$event" />
    <v-container v-if="shop.loaded">
      <div class="d-inline-flex mt-4 mb-5">
        <v-img
          v-if="shop.icon"
          contain
          :src="shop.icon"
          width="50"
          height="50"
          class="mr-2"
        />
        <h1 class="display-1 mt-2" style="z-index:10;">
          {{ shop.name }}
        </h1>
      </div>
      <v-app-bar
        :color="shop.theme ? shop.theme : 'blue darken-4'"
        elevation="4"
        rounded
        filled
      >
        <v-toolbar-items>
          <v-btn text :to="`${shopPath}/`" active-class="no-active">
            {{ $t('titles.shop') }}
          </v-btn>
        </v-toolbar-items>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text :to="`${shopPath}/voucher`">
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
                <nuxt-child
                  :shop="shop"
                  :servers="servers"
                  :shop-path="shopPath"
                  :payments="payments"
                  :shop-id="shopId"
                  @breadcrumb="breadCrumbs=$event"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="4" sm="12" xs="12" cols="12">
            <v-card v-if="shop.goal" class="mb-5">
              <v-card-title class="headline justify-center">
                {{ $t('titles.monthly_goal') }}
              </v-card-title>
              <v-card-text>
                <v-progress-linear :value="collected" :color="shop.theme ? shop.theme : 'blue darken-4'" />
                <h1 class="mt-4 d-flex headline justify-center">
                  „{{ $t('titles.server_maintenance') }}”
                </h1>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title class="headline justify-center">
                {{ $t('titles.latest_payments') }}
              </v-card-title>
              <v-card-text>
                <v-list v-if="shop.last_payments_type===1" flat>
                  <v-list-item v-for="k in history" :key="k.date" two-line>
                    <v-list-item-avatar
                      tile
                      size="40"
                    >
                      <v-img class="rounded-lg" :src="`https://minotar.net/helm/${k.nick}/32.png`" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ k.nick }}</v-list-item-title>
                      <v-list-item-subtitle>{{ k.service }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-row v-if="shop.last_payments_type===2">
                  <v-col
                    v-for="k in history"
                    :key="k.date"
                    cols="2"
                    xs="1"
                    sm="1"
                    md="3"
                    lg="2"
                    class="pa-2"
                  >
                    <v-tooltip top color="black">
                      <template #activator="{ on, attrs }">
                        <v-img
                          v-bind="attrs"
                          class="p-0 m-0 rounded-lg"
                          :src="`https://minotar.net/helm/${k.nick}/32.png`"
                          v-on="on"
                        />
                      </template>
                      <span>{{ k.nick }} {{ $t('misc.bought') }} {{ k.service }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <iframe
              v-if="shop.dsc_id"
              style="z-index:100;position: relative;"
              class="mt-5"
              :src="`https://discord.com/widget?id=${shop.dsc_id}&theme=dark`"
              width="100%"
              height="400"
              allowtransparency="true"
              frameborder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
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
  </default-layout>
</template>
<script>
import DefaultLayout from '~/layouts/default.vue'

export default {
  name: 'ShopLayout',
  components: {
    DefaultLayout
  },
  data () {
    return {
      background: false,
      backgroundUrl: '',
      shop: {},
      servers: {},
      payments: {},
      breadCrumbs: []
    }
  },
  computed: {
    shopId () {
      return this.$route.params.shopid ? this.$route.params.shopid : process.env.singleShopId
    },
    shopPath () {
      return this.$route.params.shopid ? `/shop/${this.$route.params.shopid}` : ''
    },
    collected () {
      return this.shop.collected / this.shop.goal * 100
    },
    history () {
      if (this.shop.history) {
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
      } else {
        return []
      }
    }
  },
  watch: {
    shop () {
      const favicon = document.querySelector("link[rel~='icon']")
      if (this.shop.icon) {
        favicon.href = this.shop.icon
      } else {
        favicon.href = '/favicon.ico'
      }
      if (this.shop.background) {
        this.background = true
        this.backgroundUrl = this.shop.background
      } else {
        this.background = false
      }
    }
  }
}
</script>
<style>
.v-btn--active.no-active:not(:focus):not(:hover)::before
{
  opacity: 0 !important;
}
.background_blur {
  position:fixed;
  z-index:0;
  top:0px;
  left:0px;
  width:100%;
  height:100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  -webkit-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
</style>
