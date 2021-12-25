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
                <v-text-field v-model="serverName" label="Nazwa serwera" :rules="rulesName" autocomplete="new-password" />
                <v-text-field v-model="serverId" label="Id serwera" :rules="rulesId" autocomplete="new-password" />
                <v-text-field v-model="serverIp" label="IP serwera" :rules="rulesIp" autocomplete="new-password" />
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
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-actions />
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
      {{ shop.servers[item].serverName }}
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
      tab: null,
      valid: false,
      isNew: false,
      serverName: '',
      serverId: '',
      serverIdOld: '',
      serverIp: '',
      serverPassword: '',
      showPassword: false,
      dialog: false,
      servers: this.serversList(),
      rulesName: [
        value => !!value || 'Wpisz nazwę'
      ],
      rulesId: [
        value => !!value || 'Wpisz id serwera',
        value => (value && value.length >= 4) || 'Minimalnie 4 znaki',
        v => /^[A-Za-z0-9_]{4,}$/.test(v) || 'Id serwera może zawierać tylko litery, cyfry lub "_"'
      ],
      rulesIp: [
        value => !!value || 'Wpisz ip',
        v => /^(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])(:[0-9]+)?$/.test(v) || 'Nieprawidłowy format ip'
      ],
      rulesPassword: [
        value => !!value || 'Wpisz hasło',
        value => (value && value.length >= 4) || 'Minimalnie 6 znaków'
      ]
    }
  },
  watch: {
    shop () {
      this.servers = this.serversList()
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
      this.isNew = false
      const server = this.shop.servers[serverId]
      this.serverId = serverId
      this.serverIdOld = serverId
      this.serverName = server.serverName
      this.serverIp = server.serverIp
      this.serverPassword = server.serverPassword
      this.dialog = true
    },
    saveServer () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        const { serverId, serverIdOld, serverName, serverIp, serverPassword } = this
        const serversRef = this.$fire.database.ref().child(`/shops/${shopid}/servers/`)
        serversRef.child(serverId).set({
          serverName,
          serverIp,
          serverPassword
        })
        if (serverId !== serverIdOld && !this.isNew) {
          serversRef.child(serverIdOld).remove()
        }
        this.isNew = false
        this.dialog = false
      }
    },
    removeServer () {
      const { shopid } = this.$route.params
      const { serverIdOld } = this
      this.$fire.database.ref().child(`/shops/${shopid}/servers/${serverIdOld}`).remove()
      this.dialog = false
    },
    newServer () {
      this.isNew = true
      this.serverName = 'A Minecraft Server'
      this.serverIp = 'localhost:25575'
      this.serverPassword = 'password'
      this.serverId = `id_${(Math.random() + 1).toString(36).substring(7)}`
      this.dialog = true
    }
  }
}
</script>
