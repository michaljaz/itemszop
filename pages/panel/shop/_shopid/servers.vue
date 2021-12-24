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
          <v-text-field v-model="server_name" label="Nazwa serwera" />
          <v-text-field v-model="server_id" label="Id serwera" />
          <v-text-field v-model="server_ip" label="IP serwera" />
          <v-text-field v-model="server_password" label="Hasło RCON" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
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
      {{ shop.servers[item].name }}
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopIndex',
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
      server_name: '',
      server_id: '',
      server_ip: '',
      server_password: '',
      showPassword: false,
      dialog: false,
      servers: this.serversList()
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
      this.server_id = serverId
      this.server_name = server.name
      this.server_ip = server.ip
      this.server_password = server.password
      this.dialog = true
    }
  }
}
</script>
