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
          <v-text-field
            v-model="fields.name"
            label="Nazwa usługi"
            autocomplete="new-password"
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
          />
          <v-select
            v-model="fields.server"
            item-text="serverName"
            item-value="serverId"
            :items="servers"
            label="Wybierz serwer"
          />
          <v-textarea
            label="Komendy do wywołania na serwerze"
            value="say [nick] kupil cos tam"
          />
          <Editor @content="fields.description=$event" />
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
      <v-col
        v-for="service in services"
        :key="service.title"
        cols="12"
        lg="4"
        md="6"
      >
        <v-card max-width="344" elevation="10">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ service.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                SMS:
                <br>
                Przelew:
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            />
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
      default: () => ({})
    },
    servers: {
      type: Array,
      default: () => ([])
    },
    services: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      serviceId: '',
      fields: {
        name: '',
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
        { name: '71480 - 1zł (1.23 z VAT)', value: 0 },
        { name: '72480 - 2zł (2.46 z VAT)', value: 1 },
        { name: '73480 - 3zł (3.69 z VAT)', value: 2 },
        { name: '74480 - 4zł (4.92 z VAT)', value: 3 },
        { name: '75480 - 5zł (6.15 z VAT)', value: 4 },
        { name: '76480 - 6zł (7.38 z VAT)', value: 5 },
        { name: '79480 - 9zł (11.07 z VAT)', value: 6 },
        { name: '91400 - 14zł (17.22 z VAT)', value: 7 },
        { name: '91900 - 19zł (23.37 z VAT)', value: 8 },
        { name: '92022 - 20zł (24.60 z VAT)', value: 9 },
        { name: '92550 - 25zł (30.75 z VAT)', value: 10 }
      ]
    }
  },
  head () {
    return {
      title: 'Usługi'
    }
  },
  methods: {
    editService (service) {
      this.serviceId = service.serviceId
      const newService = Object.assign({}, service)
      delete newService.serviceId
      this.fields = newService
      this.dialog = true
    },
    removeService (service) {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`/shops/${shopid}/services/${service.serviceId}`).remove()
    },
    newService () {
      this.serviceId = `service_${(Math.random() + 1).toString(36).substring(7)}`
      this.fields = {
        name: '',
        sms: false,
        smsType: 0,
        przelew: false,
        przelewCost: 0,
        server: '',
        commands: '',
        description: ''
      }
      this.dialog = true
    },
    saveService () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`/shops/${shopid}/services/${this.serviceId}`).set(this.fields)
      this.dialog = false
    }
  }
}
</script>
