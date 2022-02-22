<template>
  <div>
    <v-data-table
      :headers="data_headers"
      :items="serversList"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ $t('titles.servers') }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-btn
            color="green"
            @click="newServer"
          >
            {{ $t('actions.new_server') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-dialog
          v-model="dialog"
          max-width="500"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              @click="applyServer(item)"
              v-on="on"
            >
              mdi-pencil
            </v-icon>
          </template>
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
        <v-dialog
          v-model="dialog2"
          max-width="400"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              small
              v-bind="attrs"
              v-on="on"
            >
              mdi-delete
            </v-icon>
          </template>
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
                @click="removeServer(item)"
              >
                {{ $t('actions.remove') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
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
      data_headers: [
        {
          text: this.$t('fields.server_name'),
          align: 'start',
          value: 'serverName'
        },
        {
          text: this.$t('fields.server_ip'),
          value: 'serverIp'
        },
        {
          text: this.$t('fields.actions'),
          value: 'actions',
          sortable: false
        }
      ],
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
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        name: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        ip: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.ip(v) || this.$t('formats.wrong_format')
        ],
        password: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.min_6_chars(v) || this.$t('formats.min_6_chars')
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
