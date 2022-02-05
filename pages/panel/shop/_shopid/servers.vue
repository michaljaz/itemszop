<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      scrollable
    >
      <v-card tile flat>
        <v-toolbar
          max-height="80"
          dark
          color="primary"
          class="mb-4"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            <span class="text-h5">{{ $t('titles.server_config') }}</span>
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text dark @click="dialog2=true">
              {{ $t('actions.remove') }}
            </v-btn>
            <v-btn
              large
              dark
              text
              @click="saveServer"
            >
              {{ $t('actions.save') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
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
          min-height="170"
          text
          class="mb-2"
          elevation="10"
          @click="serverDialog(server)"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h4 mb-3">
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
    <v-dialog
      v-model="dialog2"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('titles.are_you_sure') }}
        </v-card-title>
        <v-card-text>
          {{ $t('misc.after_server_delete') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="dialog2 = false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="red"
            text
            @click="removeServer"
          >
            {{ $t('actions.remove') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      dialog2: false,
      dialog: false,
      valid: false,
      serverPort: '',
      serverName: '',
      serverId: '',
      serverIp: '',
      serverPassword: '',
      showPassword: false,
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
    serverDialog (server) {
      this.serverId = server.serverId
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
    removeServer () {
      const { shopid } = this.$route.params
      const { serverId } = this
      this.$fire.database.ref().child(`shops/${shopid}/servers/${serverId}`).remove()
      this.$fire.database.ref().child(`servers/${serverId}`).remove()
      this.dialog = false
      this.dialog2 = false
    },
    newServer () {
      this.serverName = 'A Minecraft Server'
      this.serverIp = 'localhost'
      this.serverPassword = 'password'
      this.serverPort = '25575'
      this.serverId = `${Math.random().toString(36).replace('0.', '')}`
      this.dialog = true
    }
  }
}
</script>
