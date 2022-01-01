<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card elevation="10" outlined>
        <v-card-title>
          <span class="text-h5">Konfiguracja usługi</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="fields.name"
              label="Nazwa usługi"
              autocomplete="new-password"
              :rules="rules.name"
            />
            <v-switch
              v-model="fields.icon"
              label="Ikona usługi"
            />
            <v-text-field
              v-if="fields.icon"
              v-model="fields.iconUrl"
              type="text"
              label="Adres url do ikony"
              autocomplete="new-password"
              :rules="rules.iconUrl"
            />
            <v-switch
              v-model="fields.sms"
              label="Płatność SMS'em"
            />
            <v-select
              v-if="fields.sms"
              v-model="fields.smsType"
              item-text="name"
              item-value="value"
              :items="smsTypes"
              label="Wybierz sms"
              :rules="rules.smsType"
            />
            <v-switch
              v-model="fields.przelew"
              label="Płatność przelewem"
            />
            <v-text-field
              v-if="fields.przelew"
              v-model="fields.przelewCost"
              type="number"
              label="Koszt (w zł)"
              autocomplete="new-password"
              :rules="rules.przelewCost"
            />
            <v-select
              v-model="fields.server"
              item-text="serverName"
              item-value="serverId"
              :items="servers"
              label="Wybierz serwer"
              :rules="rules.server"
            />
            <v-textarea
              v-model="fields.commands"
              label="Komendy do wywołania na serwerze"
              value="say [nick] kupil cos tam"
            />
          </v-form>
          <Editor :editorcontent="fields.description" @content="fields.description=$event" />
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
            @click="saveService"
          >
            Zapisz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <template
        v-for="serverServices in services"
      >
        <v-col
          :key="serverServices.name"
          cols="12"
        >
          <strong v-if="serversmap[serverServices.name]">{{ serversmap[serverServices.name].serverName }} </strong>
          <strong v-else>
            Bez serwera
          </strong>
        </v-col>
        <v-col
          v-for="service in serverServices.services"
          :key="service.serviceId"
          cols="12"
          lg="4"
          md="6"
        >
          <v-card elevation="10">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h4 mb-3">
                  {{ service.name }}
                </v-list-item-title>
                <v-list-item-subtitle style="height:55px;">
                  <div v-if="service.sms || service.przelew">
                    <v-chip v-if="service.sms" small class="mb-1">
                      SMS: {{ smsCost[service.smsType] }}
                    </v-chip><br>
                    <v-chip v-if="service.przelew" small>
                      Przelew: {{ service.przelewCost }}zł
                    </v-chip>
                  </div>
                  <div v-else>
                    Nie włączono żadnej płatności!
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar
                v-if="service.icon"
                tile
                size="80"
              >
                <v-img :src="service.iconUrl" />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-spacer />
              <v-btn text color="blue" rounded @click="editService(service)">
                Edytuj
              </v-btn>
              <v-btn text color="red" rounded @click="removeService(service)">
                Usuń
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <v-btn
      large
      block
      text
      color="blue"
      class="mt-5"
      @click="newService"
    >
      Nowa usługa
    </v-btn>
  </div>
</template>
<script>
import Editor from '~/components/TiptapEditor'

export default {
  name: 'ShopServices',
  components: {
    Editor
  },
  props: {
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Array,
      required: true
    },
    serversmap: {
      type: Object,
      required: true
    },
    services: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      serviceId: '',
      valid: false,
      fields: {
        name: '',
        icon: false,
        iconUrl: '',
        sms: false,
        smsType: 0,
        przelew: false,
        przelewCost: 0,
        server: '',
        commands: '',
        description: ''
      },
      dialog: false,
      sms: false,
      przelew: false,
      smsTypes: [
        { name: '71480 - 1zł (1.23 z VAT)', value: 1 },
        { name: '72480 - 2zł (2.46 z VAT)', value: 2 },
        { name: '73480 - 3zł (3.69 z VAT)', value: 3 },
        { name: '74480 - 4zł (4.92 z VAT)', value: 4 },
        { name: '75480 - 5zł (6.15 z VAT)', value: 5 },
        { name: '76480 - 6zł (7.38 z VAT)', value: 6 },
        { name: '79480 - 9zł (11.07 z VAT)', value: 7 },
        { name: '91400 - 14zł (17.22 z VAT)', value: 8 },
        { name: '91900 - 19zł (23.37 z VAT)', value: 9 },
        { name: '92022 - 20zł (24.60 z VAT)', value: 10 },
        { name: '92550 - 25zł (30.75 z VAT)', value: 11 }
      ],
      smsCost: {
        1: '1zł (1.23 z VAT)',
        2: '2zł (2.46 z VAT)',
        3: '3zł (3.69 z VAT)',
        4: '4zł (4.92 z VAT)',
        5: '5zł (6.15 z VAT)',
        6: '6zł (7.38 z VAT)',
        7: '9zł (11.07 z VAT)',
        8: '14zł (17.22 z VAT)',
        9: '19zł (23.37 z VAT)',
        10: '20zł (24.60 z VAT)',
        11: '25zł (30.75 z VAT)'
      },
      rules: {
        name: [
          value => !!value || 'Wpisz nazwę usługi'
        ],
        iconUrl: [
          value => !!value || 'Wpisz adres URL',
          value => this.isURL(value) || 'Adres URL nie jest prawidłowy'
        ],
        smsType: [
          value => !!value || 'Wpisz typ sms\'a'
        ],
        przelewCost: [
          value => !!value || 'Wpisz cenę usługi'
        ],
        server: [
          value => !!value || 'Wybierz serwer'
        ]
      }
    }
  },
  head () {
    return {
      title: 'Usługi'
    }
  },
  methods: {
    isURL (str) {
      let url
      try {
        url = new URL(str)
      } catch (_) {
        return false
      }
      return url.protocol === 'http:' || url.protocol === 'https:'
    },
    editService (service) {
      this.serviceId = service.serviceId
      const newService = Object.assign({}, service)
      delete newService.serviceId
      this.fields = newService
      this.dialog = true
    },
    removeService (service) {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}/services/${service.serviceId}`).remove()
    },
    newService () {
      this.serviceId = `service_${(Math.random() + 1).toString(36).substring(7)}`
      this.fields = {
        name: '',
        icon: false,
        iconUrl: '',
        sms: false,
        smsType: 0,
        przelew: false,
        przelewCost: 0,
        server: '',
        commands: '',
        description: '<h1>Opis super usługi!</h1><p>Tutaj możesz zamieścić opis usługi używając super tagów!</p>'
      }
      this.dialog = true
    },
    saveService () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        this.$fire.database.ref().child(`/shops/${shopid}/services/${this.serviceId}`).set(this.fields)
        this.dialog = false
      }
    }
  }
}
</script>
