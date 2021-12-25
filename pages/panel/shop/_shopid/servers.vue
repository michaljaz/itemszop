<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Konfiguracja serwera</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="serverName" label="Nazwa serwera" />
          <v-text-field v-model="serverId" label="Id serwera" />
          <v-text-field v-model="serverIp" label="IP serwera" />
          <v-text-field v-model="serverPassword" label="Hasło RCON" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Anuluj
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="saveServer"
          >
            Zapisz
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="removeServer"
          >
            Usuń
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-for="item in servers"
      :key="item"
      large
      block
      text
      class="mb-2"
      @click="serverDialog(item)"
    >
      {{ item }}
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopServers',
  props: {
    shop: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      serverName: '',
      serverId: '',
      serverIdOld: '',
      serverIp: '',
      serverPassword: '',
      showPassword: false,
      dialog: false,
      servers: this.serversList()
    }
  },
  watch: {
    shop () {
      this.servers = this.serversList()
    }
  },
  methods: {
    serversList () {
      if (this.shop.servers) {
        return Object.keys(this.shop.servers)
      } else {
        return []
      }
    },
    serverDialog (serverId) {
      const server = this.shop.servers[serverId]
      this.serverId = serverId
      this.serverIdOld = serverId
      this.serverName = server.serverName
      this.serverIp = server.serverIp
      this.serverPassword = server.serverPassword
      this.dialog = true
    },
    saveServer () {
      const { shopid } = this.$route.params
      const { serverId, serverIdOld, serverName, serverIp, serverPassword } = this
      const serversRef = this.$fire.database.ref().child(`/shops/${shopid}/servers/`)
      serversRef.child(serverId).set({
        serverName,
        serverIp,
        serverPassword
      })
      if (serverId !== serverIdOld) {
        serversRef.child(serverIdOld).remove()
      }
      this.dialog = false
    },
    removeServer () {
      const { shopid } = this.$route.params
      const { serverIdOld } = this
      this.$fire.database.ref().child(`/shops/${shopid}/servers/${serverIdOld}`).remove()
      this.dialog = false
    }
  }
}
</script>
