<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Zarządzanie serwerem</span>
          <v-tabs
            v-model="tab"
          >
            <v-tab>
              Konfiguracja
            </v-tab>
            <v-tab>
              RCON
            </v-tab>
          </v-tabs>
        </v-card-title>
        <v-card-text>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-form
                ref="form"
                v-model="valid"
              >
                <v-text-field
                  v-model="serverName"
                  label="Nazwa serwera"
                  :rules="rulesName"
                  autocomplete="new-password"
                />
                <v-text-field
                  v-model="serverIp"
                  label="IP serwera"
                  :rules="rulesIp"
                  autocomplete="new-password"
                />
                <v-text-field
                  v-model="serverPort"
                  label="Port RCON"
                  :rules="rulesPort"
                  autocomplete="new-password"
                  type="number"
                />
                <v-text-field
                  v-model="serverPassword"
                  autocomplete="new-password"
                  label="Hasło RCON"
                  :rules="rulesPassword"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                />
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
              </v-form>
            </v-tab-item>
            <v-tab-item>
              <v-text-field v-model="rconCommand" label="Komenda" autocomplete="new-password" />
              <v-btn color="blue" @click="runRcon">
                Wyślij do serwera
              </v-btn>
              <div v-html="rconResponse" />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-actions />
      </v-card>
    </v-dialog>
    <v-btn
      v-for="item in serversList"
      :key="item"
      large
      block
      text
      class="mb-2"
      @click="serverDialog(item)"
    >
      <span v-if="servers[item]">
        {{ servers[item].serverName }}
      </span>
    </v-btn>
    <v-btn
      large
      block
      text
      color="green"
      class="mb-2"
      @click="newServer"
    >
      Nowy serwer
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
      rconResponse: '',
      rconCommand: '',
      tab: null,
      valid: false,
      serverPort: '',
      serverName: '',
      serverId: '',
      serverIp: '',
      serverPassword: '',
      showPassword: false,
      dialog: false,
      servers: {},
      serversList: [],
      rulesPort: [
        value => !!value || 'Wpisz port'
      ],
      rulesName: [
        value => !!value || 'Wpisz nazwę'
      ],
      rulesIp: [
        value => !!value || 'Wpisz ip',
        v => /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/.test(v) || 'Nieprawidłowy format ip'
      ],
      rulesPassword: [
        value => !!value || 'Wpisz hasło',
        value => (value && value.length >= 4) || 'Minimalnie 6 znaków'
      ]
    }
  },
  watch: {
    shop (newShop, oldShop) {
      if (JSON.stringify(newShop.servers) !== JSON.stringify(oldShop.servers)) {
        for (const server in this.shop.servers) {
          if (!this.servers[server]) {
            this.addServerListener(server)
          }
        }
      }
    }
  },
  mounted () {
    for (const server in this.shop.servers) {
      this.addServerListener(server)
    }
  },
  methods: {
    addServerListener (serverId) {
      this.$fire.database.ref().child(`servers/${serverId}`)
        .on('value', (s) => {
          this.servers[serverId] = s.val()
          this.serversList = this.getServersList()
        })
    },
    getServersList () {
      if (this.servers) {
        return Object.keys(this.servers)
      } else {
        return []
      }
    },
    serverDialog (serverId) {
      const server = this.servers[serverId]
      this.serverId = serverId
      this.serverPort = server.serverPort
      this.serverName = server.serverName
      this.serverIp = server.serverIp
      this.serverPassword = server.serverPassword
      this.dialog = true
    },
    saveServer () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        const { serverId, serverName, serverIp, serverPassword, serverPort } = this
        this.$fire.database.ref().child(`/servers/${serverId}`).set({
          owner: this.$fire.auth.currentUser.uid,
          serverName,
          serverIp,
          serverPassword,
          serverPort
        })
        this.$fire.database.ref().child(`/shops/${shopid}/servers/`).update({ [serverId]: true })
        this.dialog = false
      }
    },
    removeServer () {
      const { shopid } = this.$route.params
      const { serverId } = this
      delete this.servers[serverId]
      this.serversList = this.getServersList()
      this.$fire.database.ref().child(`shops/${shopid}/servers/${serverId}`).remove()
      this.$fire.database.ref().child(`servers/${serverId}`).off('value')
      this.$fire.database.ref().child(`servers/${serverId}`).remove()
      this.dialog = false
    },
    newServer () {
      this.serverName = 'A Minecraft Server'
      this.serverIp = 'localhost'
      this.serverPassword = 'password'
      this.serverPort = '25575'
      this.serverId = `server_${(Math.random() + 1).toString(36).substring(7)}`
      this.dialog = true
    },
    sendRcon (host, port, password, command) {
      return this.$axios.get('/rcon', {
        params: { host, port, password, command }
      })
    },
    runRcon () {
      this.sendRcon(this.serverIp, this.serverPort, this.serverPassword, this.rconCommand).then((response) => {
        const { data } = response
        if (data.error === 'auth') {
          this.rconResponse = 'Nie udało się połączyć'
        } else {
          this.rconResponse = require('minecraft-text-js').toHTML(data.response).replaceAll('\n', '<br>')
        }
      })
    }
  }
}
</script>
