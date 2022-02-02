<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card elevation="10" outlined>
        <v-card-title>
          <span class="text-h5">{{ $t('titles.server_config') }}</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="serverName"
              :label="$t('fields.server_name')"
              :rules="rules.name"
              autocomplete="new-password"
            />
            <v-text-field
              v-model="serverIp"
              :label="$t('fields.server_ip')"
              :rules="rules.ip"
              autocomplete="new-password"
            />
            <v-text-field
              v-model="serverPort"
              :label="$t('fields.rcon_port')"
              :rules="rules.port"
              autocomplete="new-password"
              type="number"
            />
            <v-text-field
              v-model="serverPassword"
              autocomplete="new-password"
              :label="$t('fields.rcon_password')"
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
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            rounded
            @click="saveServer"
          >
            {{ $t('actions.save') }}
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
          <span class="text-h5">{{ $t('titles.rcon_console') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="rconCommand" :label="$t('fields.command')" autocomplete="new-password" />
          <v-btn color="blue" @click="runRcon">
            {{ $t('actions.send_to_server') }}
          </v-btn>
          <!-- eslint-disable vue/no-v-html -->
          <div v-html="rconResponse" />
          <!--eslint-enable-->
        </v-card-text>
        <v-card-actions />
      </v-card>
    </v-dialog>
    <strong>
      {{ $t('titles.servers') }}
    </strong>
    <v-row class="mt-3">
      <v-col
        v-for="server in serversList"
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
              <v-list-item-title class="text-h5 mb-3">
                {{ server.serverName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip>
                  <v-icon small>
                    mdi-server
                  </v-icon>{{ server.serverIp }}:{{ server.serverPort }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-spacer />
            <v-btn text rounded color="indigo" @click="consoleDialog(server)">
              {{ $t('actions.rcon') }}
            </v-btn>
            <v-btn text rounded color="blue" @click="editDialog(server)">
              {{ $t('actions.edit') }}
            </v-btn>
            <v-btn text rounded color="red" @click="removeServer(server)">
              {{ $t('actions.remove') }}
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
      {{ $t('actions.new_server') }}
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopServers',
  props: {
    servers: {
      type: Object,
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
          value => !!value || this.$t('formats.field_not_empty')
        ],
        name: [
          value => !!value || this.$t('formats.field_not_empty')
        ],
        ip: [
          value => !!value || this.$t('formats.field_not_empty'),
          v => /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/.test(v) || this.$t('formats.wrong_format')
        ],
        password: [
          value => !!value || this.$t('formats.field_not_empty'),
          value => (value && value.length >= 4) || this.$t('formats.min_6_chars')
        ]
      }
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
        if (this.servers[serverId]) {
          const server = Object.assign({}, this.servers[serverId])
          server.serverId = serverId
          result.push(server)
        }
      }
      return result
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
        this.$fire.database.ref().child(`servers/${serverId}`).set({
          owner: this.$fire.auth.currentUser.uid,
          serverName,
          serverIp,
          serverPassword,
          serverPort
        })
        this.$fire.database.ref().child(`shops/${shopid}/servers`).update({ [serverId]: true })
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
      this.serverId = `${Math.random().toString(36).replace('0.', '')}`
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
          this.rconResponse = this.$t('responses.unable_to_connect')
        } else {
          this.rconResponse = require('minecraft-text-js').default.toHTML(data.response).replaceAll('\n', '<br>')
        }
      })
    }
  }
}
</script>
