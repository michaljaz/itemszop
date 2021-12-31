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
              :rules="rules.name"
              autocomplete="new-password"
            />
            <v-text-field
              v-model="serverIp"
              label="IP serwera"
              :rules="rules.ip"
              autocomplete="new-password"
            />
            <v-text-field
              v-model="serverPort"
              label="Port RCON"
              :rules="rules.port"
              autocomplete="new-password"
              type="number"
            />
            <v-text-field
              v-model="serverPassword"
              autocomplete="new-password"
              label="Hasło RCON"
              :rules="rules.password"
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
            rounded
            @click="dialog = false"
          >
            Anuluj
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            rounded
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
        v-for="server in servers"
        :key="server.serverId"
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
                {{ server.serverName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip>{{ server.serverIp }}:{{ server.serverPort }}</v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-spacer />
            <v-btn text rounded color="indigo" @click="consoleDialog(server)">
              RCON
            </v-btn>
            <v-btn text rounded color="blue" @click="editDialog(server)">
              Edytuj
            </v-btn>
            <v-btn text rounded color="red" @click="removeServer(server)">
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
      required: true
    },
    servers: {
      type: Array,
      required: true
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
      rules: {
        port: [
          value => !!value || 'Wpisz port'
        ],
        name: [
          value => !!value || 'Wpisz nazwę'
        ],
        ip: [
          value => !!value || 'Wpisz ip',
          v => /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/.test(v) || 'Nieprawidłowy format ip'
        ],
        password: [
          value => !!value || 'Wpisz hasło',
          value => (value && value.length >= 4) || 'Minimalnie 6 znaków'
        ]
      }
    }
  },
  head () {
    return {
      title: 'Serwery'
    }
  },
  methods: {
    applyServer (server) {
      this.serverId = server.serverId
      this.serverPort = server.serverPort
      this.serverName = server.serverName
      this.serverIp = server.serverIp
      this.serverPassword = server.serverPassword
    },
    consoleDialog (server) {
      this.applyServer(server)
      this.rconDialog = true
    },
    editDialog (server) {
      this.applyServer(server)
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
    removeServer (server) {
      const { shopid } = this.$route.params
      const { serverId } = server
      this.$fire.database.ref().child(`shops/${shopid}/servers/${serverId}`).remove()
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
