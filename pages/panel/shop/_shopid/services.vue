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
            <span class="text-h5">{{ $t('titles.service_config') }}</span>
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text dark @click="dialog2 = true">
              {{ $t('actions.remove') }}
            </v-btn>
            <v-btn
              large
              dark
              text
              @click="saveService"
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
            <v-row>
              <v-col cols="12" xs="12" md="6">
                <v-text-field
                  v-model="fields.name"
                  :label="$t('fields.service_name')"
                  autocomplete="new-password"
                  :rules="rules.name"
                />
                <v-switch
                  v-model="fields.icon"
                  :label="$t('fields.service_icon')"
                />
                <v-text-field
                  v-if="fields.icon"
                  v-model="fields.iconUrl"
                  type="text"
                  :label="$t('fields.icon_url')"
                  autocomplete="new-password"
                  :rules="rules.iconUrl"
                />
                <v-select
                  v-model="fields.server"
                  item-text="serverName"
                  item-value="serverId"
                  :items="serversList"
                  :label="$t('fields.choose_server')"
                  :rules="rules.server"
                />
                <v-textarea
                  v-model="fields.commands"
                  :label="$t('fields.server_command_info')"
                  class="mb-2"
                />
                <TiptapEditor :editorcontent="fields.description" @content="fields.description=$event" />
              </v-col>
              <v-col cols="12" xs="12" md="6">
                <v-switch
                  v-model="fields.sms"
                  :label="$t('fields.sms_payment')"
                />
                <v-select
                  v-if="fields.sms"
                  v-model="fields.smsType"
                  item-text="name"
                  item-value="value"
                  :items="smsTypes"
                  :label="$t('fields.choose_sms')"
                  :rules="rules.smsType"
                />
                <v-switch
                  v-model="fields.przelew"
                  :label="$t('fields.transfer_payment')"
                />
                <v-text-field
                  v-if="fields.przelew"
                  v-model="fields.przelewCost"
                  type="number"
                  :label="$t('fields.transfer_cost')"
                  autocomplete="new-password"
                  :rules="rules.przelewCost"
                />
                <v-switch
                  v-model="fields.costSlider"
                  :label="$t('fields.cost_slider')"
                />

                <div v-if="fields.costSlider">
                  <v-alert
                    border="top"
                    colored-border
                    type="info"
                    elevation="2"
                  >
                    <i18n
                      path="misc.costslider_instruction"
                    >
                      <template #br>
                    </br>
                      </template>
                    </i18n>
                  </v-alert>
                  <v-select
                    v-model="multipleSMS"
                    item-text="name"
                    item-value="value"
                    :items="smsTypes"
                    :label="$t('fields.choose_smses')"
                    multiple
                    persistent-hint
                  />
                  <v-text-field
                    v-for="k in multipleSMS"
                    :key="k"
                    type="number"
                    :label="$t('fields.sms_service_amount').replace('{sms}',smsCost[k])"
                  />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <template
        v-for="serverServices in servicesList"
      >
        <v-col
          :key="serverServices.name"
          cols="12"
        >
          <strong v-if="servers[serverServices.name]">{{ servers[serverServices.name].serverName }} </strong>
          <strong v-else>
            {{ $t('misc.without_server') }}
          </strong>
        </v-col>
        <v-col
          v-for="service in serverServices.services"
          :key="service.serviceId"
          cols="12"
          lg="4"
          md="6"
        >
          <v-card elevation="10" min-height="170" @click="editService(service)">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h4 mb-3">
                  {{ service.name }}
                </v-list-item-title>
                <v-list-item-subtitle style="height:55px;">
                  <div v-if="service.sms || service.przelew">
                    <v-chip v-if="service.sms" small class="mb-1">
                      {{ $t('sms') }}: {{ smsCost[service.smsType] }}
                    </v-chip><br>
                    <v-chip v-if="service.przelew" small>
                      {{ $t('transfer') }}: {{ service.przelewCost }}zł
                    </v-chip>
                  </div>
                  <div v-else>
                    {{ $t('misc.no_payment_enabled') }}
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
      {{ $t('actions.new_service') }}
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
          {{ $t('misc.after_service_delete') }}
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
            @click="removeService"
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
  name: 'ShopServices',
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
      multipleSMS: [],
      dialog2: false,
      enable_sms_1: false,
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
        description: '',
        costSlider: false
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
          value => !!value || this.$t('formats.field_not_empty')
        ],
        iconUrl: [
          value => !!value || this.$t('formats.field_not_empty'),
          value => this.isURL(value) || this.$t('formats.wrong_format')
        ],
        smsType: [
          value => !!value || this.$t('formats.field_not_empty')
        ],
        przelewCost: [
          value => !!value || this.$t('formats.field_not_empty')
        ],
        server: [
          value => !!value || this.$t('formats.field_not_empty')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.services')
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
    },
    servicesList () {
      const result = []

      if (this.shop.services) {
        const servicesByServer = {}
        for (const serviceId in this.shop.services) {
          const service = Object.assign({}, this.shop.services[serviceId])
          service.serviceId = serviceId
          if (servicesByServer[service.server]) {
            servicesByServer[service.server].push(service)
          } else {
            servicesByServer[service.server] = [service]
          }
        }
        for (const serverId in servicesByServer) {
          result.push({
            name: serverId,
            services: servicesByServer[serverId]
          })
        }
      }
      return result.slice().reverse()
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
    removeService () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}/services/${this.serviceId}`).remove()
      this.dialog = false
      this.dialog2 = false
    },
    newService () {
      this.serviceId = `${Math.random().toString(36).replace('0.', '')}`
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
        description: this.$t('misc.default_description')
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
