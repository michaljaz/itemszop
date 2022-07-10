<template>
  <default-layout>
    <div v-if="background" class="background" :style="`background:url(${backgroundUrl}) no-repeat top center fixed;`" />
    <ShopListener public @servers="servers=$event" @shop="shop=$event" @config="config=$event" />
    <v-container v-if="shop.loaded">
      <div class="justify-center justify-md-start d-flex">
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
      </div>
      <v-app-bar
        :color="shop.theme ? shop.theme : 'blue darken-4'"
        elevation="4"
        rounded
        filled
      >
        <v-toolbar-items>
          <v-btn text :to="`${shopUrl}/`" active-class="no-active">
            {{ $t('titles.shop') }}
          </v-btn>
          <v-btn v-for="k in pages" :key="k.pageId" text :to="`${shopPath}/page/${k.pageId}`">
            {{ k.name }}
          </v-btn>
        </v-toolbar-items>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text :to="`${shopPath}/voucher`">
            <span class="hidden-sm-and-down">
              {{ $t('titles.redeem_voucher') }}
            </span>
            <v-icon class="hidden-md-and-up">
              mdi-ticket-percent
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <div class="mt-3">
        <v-row>
          <v-col md="8" sm="12" xs="12" cols="12">
            <v-alert
              v-if="shop.announcement"
              :color="shop.theme ? shop.theme : 'blue darken-4'"
              dismissible
              colored-border
              border="left"
              prominent
              type="info"
            >
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="mt-2 overflow-y-auto"
                v-html="shop.announcement"
              />
              <!--eslint-enable-->
            </v-alert>
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
                  :config="config"
                  :shop-id="shopId"
                  @breadcrumb="breadCrumbs=$event"
                  @blur="blur=$event"
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
                      <v-img class="rounded-lg" :src="`https://crafthead.net/helm/${k.nick}/32`" />
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
                          :src="`https://crafthead.net/helm/${k.nick}/32.png`"
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
              v-if="shop.dsc"
              style="z-index:100;position: relative;"
              class="mt-5"
              :src="`https://discord.com/widget?id=${shop.dsc}&theme=dark`"
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
      blur: false,
      background: false,
      backgroundUrl: '',
      shop: {},
      servers: {},
      config: {},
      breadCrumbs: []
    }
  },
  head () {
    return {
      titleTemplate: this.titleTemplate,
      link: [
        {
          hid: 'icon',
          rel: 'icon',
          type: 'image/x-icon',
          href: this.shop.icon ? this.shop.icon : '/favicon.ico'
        }
      ]
    }
  },
  computed: {
    shopUrl () {
      if (this.shop.servers && Object.keys(this.shop.servers).length === 1) {
        return `${this.shopPath}/server/${Object.keys(this.shop.servers)[0]}`
      } else {
        return this.shopPath
      }
    },
    pages () {
      const result = []
      for (const pageId in this.shop.pages) {
        const page = Object.assign({}, this.shop.pages[pageId])
        page.pageId = pageId
        result.push(page)
      }
      return result
    },
    titleTemplate () {
      return this.shop.name ? `${this.shop.name}: %s` : this.$t('titles.loading')
    },
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
    blur () {
      const main = document.querySelector('.v-main__wrap')
      const state = this.blur ? 'blur(3px)' : ''
      main.style.filter = state
      main.style['-webkit-filter'] = state
      main.style['-ms-filter'] = state
    },
    shop () {
      if (this.shop.background) {
        this.background = true
        this.backgroundUrl = this.shop.background
      } else {
        this.background = false
      }
      if (this.shop.gid) {
        const { gid } = this.shop
        const script = document.createElement('script')
        script.onload = function () {
          window.dataLayer = window.dataLayer || []
          function gtag () { window.dataLayer.push(arguments) }
          gtag('js', new Date())

          gtag('config', gid)
        }
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gid}`
        document.head.appendChild(script)
      }
    }
  },
  beforeCreate () {
    this.blur = false
  }
}
</script>
<style>
.v-btn--active.no-active:not(:focus):not(:hover)::before
{
  opacity: 0 !important;
}
.background {
  position:fixed;
  z-index:0;
  top:0px;
  left:0px;
  width:100vw;
  height:100vh;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

</style>
