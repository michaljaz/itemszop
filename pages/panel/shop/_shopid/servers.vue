<template>
  <div>
    <v-data-table
      :headers="data_headers"
      :items="serversList"
      :items-per-page="5"
      class="elevation-2"
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
            dark
            color="primary"
            @click="newServer"
          >
            {{ $t('actions.new_server') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn color="primary" @click="applyServer(item);dialog=true;currentItem=item">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn color="error" @click="dialogDelete=true;currentItem=item">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
    >
      <v-card tile flat outlined>
        <v-card-title class="text-h5">
          {{ $t('titles.server_config') }}
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
              v-model="serverId"
              :label="$t('fields.server_id')"
              :rules="rules.server_id"
              autocomplete="new-password"
            />
            <v-alert
              v-model="error"
              color="red"
              type="error"
              dismissible
              outlined
            >
              {{ $t('responses.server_already_exist') }}
            </v-alert>
            <template v-if="serverAlreadyExists">
              <v-text-field
                v-model="pluginKey"
                class="mt-5"
                :label="$t('fields.plugin_secret')"
                readonly
              />

              <v-btn color="primary" outlined block @click="regeneratePluginSecret(currentItem)">
                {{ $t("actions.generate_new_key") }}
              </v-btn>
              <v-btn color="accent" class="mt-1" block @click="clearCommands(currentItem)">
                {{ $t("actions.reset_stack") }}
              </v-btn>
            </template>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="accent"
            text
            @click="dialog = false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="saveServer"
          >
            {{ $t('actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
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
            color="primary"
            text
            @click="dialogDelete=false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            text
            @click="removeServer(currentItem)"
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
      data_headers: [
        {
          text: this.$t('fields.server_name'),
          align: 'start',
          value: 'serverName'
        },
        {
          text: this.$t('fields.server_id'),
          align: 'start',
          value: 'serverId'
        },
        {
          text: this.$t('fields.commands_in_queue'),
          align: 'start',
          value: 'commandsInQueue'
        },
        {
          text: this.$t('fields.actions'),
          value: 'actions',
          sortable: false
        }
      ],
      currentItem: null,
      dialogDelete: false,
      dialog: false,
      valid: false,
      serverName: '',
      serverId: '',
      oldServerId: '',
      error: false,
      rules: {
        name: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        server_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.normal_string(v) || this.$t('formats.wrong_format_serverid')
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
    serverAlreadyExists () {
      return !!this.servers[this.serverId]
    },
    serversList () {
      const result = []
      for (const serverId in this.servers) {
        if (this.servers[serverId]) {
          const server = Object.assign({}, this.servers[serverId])
          server.serverId = serverId
          if (this.servers[serverId].commands && this.servers[serverId].commands[server.secret]) {
            server.commandsInQueue = Object.keys(this.servers[serverId].commands[server.secret]).length
          } else {
            server.commandsInQueue = 0
          }

          result.push(server)
        }
      }
      return result
    },
    pluginKey () {
      if (this.serverId && this.servers[this.serverId] && this.servers[this.serverId].secret) {
        return btoa(`${this.servers[this.serverId].secret}@${WebSocket._firebaseWebsocketUrl}@${this.serverId}`)
      } else {
        return false
      }
    }
  },
  methods: {
    applyServer (server) {
      this.serverId = server.serverId
      this.oldServerId = server.serverId
      this.serverName = server.serverName
    },
    saveServer () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        const { serverId, serverName } = this
        this.$fire.database.ref().child(`servers/${serverId}`).update({
          owner: this.$fire.auth.currentUser.uid,
          serverName
        }).then(() => {
          this.$fire.database.ref().child(`shops/${shopid}/servers`).update({ [serverId]: true })
          if (this.serverId !== this.oldServerId) {
            this.$fire.database.ref().child(`servers/${this.oldServerId}`).remove()
            this.$fire.database.ref().child(`shops/${shopid}/servers/${this.oldServerId}`).remove()
          }
          this.dialog = false
        }).catch((e) => {
          this.error = true
        })
      }
    },
    removeServer (server) {
      const { shopid } = this.$route.params
      const { serverId } = server
      this.$fire.database.ref().child(`shops/${shopid}/servers/${serverId}`).remove()
      this.$fire.database.ref().child(`servers/${serverId}`).remove()
      this.dialog = false
      this.dialogDelete = false
    },
    newServer () {
      this.serverName = 'A Minecraft Server'
      this.serverId = this.randomString()
      this.oldServerId = this.serverId
      this.dialog = true
    },
    clearCommands (server) {
      this.$fire.database.ref().child(`servers/${server.serverId}/commands`).remove()
    },
    regeneratePluginSecret (server) {
      this.secret = this.randomString()
      this.clearCommands(server)
      this.$fire.database.ref().child(`servers/${server.serverId}/secret`).set(this.secret)
    },
    randomString () {
      return Math.random().toString(36).replace('0.', '')
    }
  }
}
</script>
