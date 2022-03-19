<template>
  <div>
    <v-row>
      <v-col v-for="server in serversList" :key="server.serverId">
        <v-card :to="`${shopPath}/server/${server.serverId}`" class="pa-3" elevation="5" height="100%">
          <v-card-text class="headline">
            <center>
              {{ server.serverName }}
            </center>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <center v-if="!serversList.length">
      <div class="display-1 mt-7">
        {{ $t('titles.no_server_available') }}
      </div>
    </center>
  </div>
</template>

<script>
export default {
  name: 'ShopPage',
  layout: 'shop',
  props: {
    shopPath: {
      type: String,
      required: true
    },
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Object,
      required: true
    }
  },
  head () {
    return {
      title: this.$t('titles.servers')
    }
  },
  computed: {
    serversList () {
      const result = []
      for (const serverId in this.servers) {
        result.push({
          serverId,
          serverName: this.servers[serverId]
        })
      }
      return result
    }
  },
  mounted () {
    if (this.shop.servers && Object.keys(this.shop.servers).length === 1) {
      const path = process.env.singleShopId ? `/server/${Object.keys(this.shop.servers)[0]}` : `/shop/${this.$route.params.shopid}/server/${Object.keys(this.shop.servers)[0]}`
      this.$router.push(path)
    }
    this.$emit('breadcrumb', [{
      text: this.$t('titles.shop'),
      disabled: false,
      href: this.$route.path
    },
    {
      text: this.$t('titles.servers'),
      disabled: true
    }])
  }
}
</script>
