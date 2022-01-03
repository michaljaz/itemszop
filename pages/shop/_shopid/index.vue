<template>
  <div>
    <v-row>
      <v-col v-for="server in serversList" :key="server.serverId">
        <v-card :to="`/shop/${$route.params.shopid}/server/${server.serverId}`" class="pa-3" elevation="5">
          <v-card-text class="d-flex justify-center headline">
            {{ server.serverName }}
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
  },
  methods: {
    updateServersList () {
      const result = []
      Object.keys(this.servers).forEach((serverId) => {
        result.push({
          serverId,
          serverName: this.servers[serverId]
        })
      })
      this.serversList = result
    }
  }
}
</script>
