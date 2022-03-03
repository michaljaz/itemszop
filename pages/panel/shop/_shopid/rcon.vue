<template>
  <div>
    <v-card class="pt-1 pb-4" elevation="10">
      <v-card-title class="headline">
        {{ $t('titles.rcon_console') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-select
            v-model="server"
            item-text="serverName"
            item-value="serverId"
            :items="serversList"
            :label="$t('fields.choose_server')"
            :rules="rules.server"
          />
          <v-text-field
            v-model="command"
            :label="$t('fields.command')"
            autocomplete="new-password"
            @keydown.enter.prevent="submit"
          />
          <v-alert
            v-if="rconResponse"
            border="left"
            color="#2A3B4D"
            dark
          >
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="rconResponse" />
            <!--eslint-enable-->
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'RconView',
  props: {
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      rconResponse: '',
      valid: false,
      server: null,
      command: '',
      rules: {
        server: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ]
      }
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
    submit () {
      this.$refs.form.validate()
      if (this.valid) {
        const { command } = this
        if (command) {
          this.sendCommand(command)
          this.command = ''
        }
      }
    },
    sendCommand (command) {
      const { serverIp, serverPort, serverPassword } = this.servers[this.server]
      this.$axios.get('/rcon', {
        params: {
          host: serverIp,
          port: serverPort,
          password: serverPassword,
          command: this.command
        }
      }).then(({ data }) => {
        if (data.success) {
          this.rconResponse = require('minecraft-text-js').default.toHTML(data.data).replaceAll('\n', '<br>')
        } else {
          this.rconResponse = this.$t('responses.unable_to_connect')
        }
      })
    }
  }
}
</script>
