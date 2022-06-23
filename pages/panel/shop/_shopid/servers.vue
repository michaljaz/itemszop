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
            color="success"
            @click="newServer"
          >
            {{ $t('actions.new_server') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          class="mr-2"
          @click="applyServer(item);dialog=true"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          class="mr-2"
          @click="sendTest(item)"
        >
          mdi-test-tube
        </v-icon>
        <v-icon
          class="mr-2"
          @click="clearCommands(item)"
        >
          mdi-autorenew-off
        </v-icon>
        <v-icon
          class="mr-2"
          @click="dialogDelete=true;currentItem=item"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="500"
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
            <v-text-field
              v-model="triggerIp"
              :label="$t('fields.trigger_ip')"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="success"
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
          text: this.$t('fields.trigger_ip'),
          align: 'start',
          value: 'triggerIp'
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
      triggerIp: '',
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
    serversList () {
      const result = []
      for (const serverId in this.servers) {
        if (this.servers[serverId]) {
          const server = Object.assign({}, this.servers[serverId])
          server.serverId = serverId
          if (this.servers[serverId].commands) {
            server.commandsInQueue = Object.keys(this.servers[serverId].commands).length
          } else {
            server.commandsInQueue = 0
          }

          result.push(server)
        }
      }
      return result
    }
  },
  methods: {
    applyServer (server) {
      this.serverId = server.serverId
      this.oldServerId = server.serverId
      this.serverName = server.serverName
      this.triggerIp = server.triggerIp
    },
    saveServer () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        const { serverId, serverName, triggerIp } = this
        this.$fire.database.ref().child(`servers/${serverId}`).set({
          owner: this.$fire.auth.currentUser.uid,
          serverName,
          triggerIp
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
      this.serverId = `${Math.random().toString(36).replace('0.', '')}`
      this.oldServerId = this.serverId
      this.dialog = true
    },
    sendTest (server) {
      this.$fire.database.ref().child(`servers/${server.serverId}/commands`).update({
        [Math.random().toString(36).replace('0.', '')]: 'say ItemSzop test'
      })
    },
    clearCommands (server) {
      this.$fire.database.ref().child(`servers/${server.serverId}/commands`).remove()
    }
  }
}
</script>
