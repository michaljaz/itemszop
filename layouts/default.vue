<template>
  <v-app dark :style="$vuetify.theme.dark ? '' : `background:#eee`">
    <v-main>
      <nuxt v-if="!$slots.default" />
      <slot />
    </v-main>
    <v-footer v-if="!inframe" class="justify-center">
      <span>
        &copy; {{ new Date().getFullYear() }}
        <a :href="mainUrl">ItemSzop</a>
        <template v-if="shopName && $route.fullPath.substring(1, 6) !== 'panel'">
          | {{ shopName }} nie jest w żaden sposób powiązany z firmą Mojang AB.
        </template>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      mainUrl: process.env.mainUrl,
      oldShopId: false,
      shopName: false
    }
  },
  computed: {
    shopId () {
      if (process.env.singleShopId) {
        return process.env.singleShopId
      } else if (this.$route.params.shopid) {
        return this.$route.params.shopid
      } else {
        return false
      }
    },
    inframe () {
      try {
        return window.self !== window.top
      } catch (e) {
        return true
      }
    }
  },
  watch: {
    shopId () {
      this.updateShopNameListener()
    }
  },
  mounted () {
    this.updateShopNameListener()
  },
  methods: {
    updateShopNameListener () {
      if (this.oldShopId) {
        this.$fire.database.ref().child(`shops/${this.oldShopId}/name`).off('value')
      }
      if (this.shopId) {
        this.$fire.database.ref().child(`shops/${this.shopId}/name`).on('value', (snapshot) => {
          this.shopName = snapshot.val()
        })
      } else {
        this.shopName = false
      }
      this.oldShopId = this.shopId
    }
  }
}
</script>
