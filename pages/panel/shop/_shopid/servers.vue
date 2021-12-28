<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card elevation="10" outlined>
        <v-card-title>
          <span class="text-h5">Konfiguracja serwera</span>
        </v-card-title>
        <v-card-text>
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
          </v-form>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="rconDialog"
      max-width="600px"
    >
      <v-card elevation="10" outlined>
        <v-card-title>
          <span class="text-h5">Konsola RCON</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="rconCommand" label="Komenda" autocomplete="new-password" />
          <v-btn color="blue" @click="runRcon">
            Wyślij do serwera
          </v-btn>
          <!-- eslint-disable vue/no-v-html -->
          <div v-html="rconResponse" />
          <!--eslint-enable-->
        </v-card-text>
        <v-card-actions />
      </v-card>
    </v-dialog>
    <v-row>
      <v-col
        v-for="item in serversList"
        :key="item"
        cols="12"
        lg="4"
        md="6"
      >
        <v-card
          text
          class="mb-2"
          elevation="10"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ servers[item].serverName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <div>
                  IP serwera: {{ servers[item].serverIp }}
                </div>
                <div class="mt-2">
                  Port RCON: {{ servers[item].serverPort }}
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-spacer />
            <v-btn text rounded color="indigo" @click="consoleDialog(item)">
              RCON
            </v-btn>
            <v-btn text rounded color="blue" @click="editDialog(item)">
              Edytuj
            </v-btn>
            <v-btn text rounded color="red" @click="removeServer(item)">
              Usuń
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      large
      block
      text
      color="blue"
      class="mt-5"
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
      default: () => ({})
    }
  },
  data () {
    return {
      rconDialog: false,
      rconResponse: '',
      rconCommand: '',
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
  head () {
    return {
      title: 'Serwery'
    }
  },
  watch: {
    shop (newShop, oldShop) {
      if (JSON.stringify(newShop.servers) !== JSON.stringify(oldShop.servers)) {
        for (const server in newShop.servers) {
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
          this.updateServersList()
        })
    },
    updateServersList () {
      if (this.servers) {
        this.serversList = Object.keys(this.servers)
      } else {
        this.serversList = []
      }
    },
    applyServer (serverId) {
      const server = this.servers[serverId]
      this.serverId = serverId
      this.serverPort = server.serverPort
      this.serverName = server.serverName
      this.serverIp = server.serverIp
      this.serverPassword = server.serverPassword
    },
    consoleDialog (serverId) {
      this.applyServer(serverId)
      this.rconDialog = true
    },
    editDialog (serverId) {
      this.applyServer(serverId)
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
    removeServer (serverId) {
      const { shopid } = this.$route.params
      delete this.servers[serverId]
      this.updateServersList()
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
    sendRconCommand (host, port, password, command) {
      return this.$axios.get('/rcon', {
        params: { host, port, password, command }
      })
    },
    runRcon () {
      this.sendRconCommand(this.serverIp, this.serverPort, this.serverPassword, this.rconCommand).then((response) => {
        const { data } = response
        if (data.error === 'auth') {
          this.rconResponse = 'Nie udało się połączyć'
        } else {
          this.rconResponse = require('minecraft-text-js').default.toHTML(data.response).replaceAll('\n', '<br>')
        }
      })
    }
  }
}
</script>
