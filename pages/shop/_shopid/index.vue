<template>
  <div>
    <v-row>
      <v-col v-for="server in serversList" :key="server.serverId">
        <v-card :to="`/shop/${$route.params.shopid}/server/${server.serverId}`" class="pa-3" elevation="5" height="100%">
          <v-card-text class=" headline">
            <center>
              {{ server.serverName }}
            </center>
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
  },
  data () {
    return {
      serversList: []
    }
  },
  watch: {
    servers () {
      this.updateServersList()
    }
  },
  mounted () {
    this.updateServersList()
    this.$emit('breadcrumb', [{
      text: 'Sklep',
      disabled: false,
      href: this.$route.path
    },
    {
      text: 'Serwery',
      disabled: true
    }])
  },
  methods: {
    updateServersList () {
      const result = []
      for (const serverId in this.servers) {
        result.push({
          serverId,
          serverName: this.servers[serverId]
        })
      }
      this.serversList = result
    }
  }
}
</script>
