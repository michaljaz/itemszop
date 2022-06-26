<template>
  <div>
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
          <v-card elevation="2" min-height="170" @click="editService(service)">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h4 mb-3">
                  {{ service.name }}
                </v-list-item-title>
                <v-list-item-subtitle style="height:100px;">
                  <div v-if="service.microsms_sms || service.microsms_transfer || service.lvlup || service.paypal_p24">
                    <v-chip v-if="service.microsms_sms && config.microsms" small class="mb-1">
                      {{ $t('sms') }}: {{ smsCost[service.microsms_sms_type] }}
                    </v-chip>
                    <v-chip v-if="service.microsms_transfer && config.microsms" small class="mb-1">
                      {{ $t('transfer') }}: {{ service.microsms_transfer_cost }}zł
                    </v-chip>
                    <v-chip v-if="service.paypal_p24 && config.paypal" small class="mb-1">
                      {{ $t('przelewy24') }}: {{ service.paypal_p24_cost }}zł
                    </v-chip>
                    <v-chip v-if="service.lvlup && config.lvlup" small class="mb-1">
                      {{ $t('transfer_psc') }}: {{ service.lvlup_cost }}zł
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
      block
      outlined
      large
      color="primary"
      class="mt-5"
      @click="newService"
    >
      {{ $t('actions.new_service') }}
    </v-btn>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      scrollable
    >
      <v-card tile flat>
        <v-app-bar
          max-height="70"
          dark
          color="primary"
          class="mb-4"
        >
          <v-container class="d-flex justify-space-between">
            <v-toolbar-title>
              <v-btn
                icon
                dark
                @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <span class="text-h5">{{ $t('titles.service_config') }}</span>
            </v-toolbar-title>
            <v-toolbar-items>
              <v-btn text dark @click="dialogDelete = true">
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
          </v-container>
        </v-app-bar>
        <v-card-text>
          <v-container>
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
                  <v-text-field
                    v-model="serviceId"
                    :label="$t('fields.service_id')"
                    autocomplete="new-password"
                    :rules="rules.service_id"
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
                    v-model="fields.costslider"
                    :label="$t('fields.cost_slider')"
                  />
                  <div v-if="fields.costslider">
                    <v-row v-if="fields.microsms_transfer || fields.lvlup">
                      <v-col>
                        <v-text-field
                          v-model="fields.min_amount"
                          :label="$t('fields.min_amount')"
                          type="number"
                          :rules="rules.min_amount"
                        />
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="fields.max_amount"
                          :label="$t('fields.max_amount')"
                          type="number"
                          :rules="rules.max_amount"
                        />
                      </v-col>
                    </v-row>
                    <v-alert
                      text
                      type="warning"
                      elevation="2"
                    >
                      {{ $t('misc.costslider_instruction_placeholder') }}
                    </v-alert>
                    <v-alert
                      v-if="fields.microsms_transfer || fields.lvlup || fields.microsms_sms"
                      text
                      type="info"
                      elevation="2"
                    >
                      <div v-if="fields.microsms_sms">
                        {{ $t('misc.costslider_instruction_sms') }}
                      </div>
                      <div v-if="fields.microsms_transfer || fields.lvlup">
                        {{ $t('misc.costslider_instruction_transfer') }}
                      </div>
                    </v-alert>
                  </div>

                  <div v-if="config.microsms">
                    <v-switch
                      v-model="fields.microsms_sms"
                      :label="`${$t('fields.sms_payment')} (microsms.pl)`"
                    />
                    <v-select
                      v-if="fields.microsms_sms && !fields.costslider"
                      v-model="fields.microsms_sms_type"
                      item-text="name"
                      item-value="value"
                      :items="smsTypes"
                      :label="$t('fields.choose_sms')"
                      :rules="rules.microsms_sms_type"
                    />
                    <v-select
                      v-if="fields.microsms_sms && fields.costslider"
                      v-model="multipleSMS"
                      item-text="name"
                      item-value="value"
                      :items="smsTypes"
                      :label="$t('fields.choose_smses')"
                      multiple
                      persistent-hint
                      :rules="rules.multiple_sms"
                    />
                    <div v-if="fields.microsms_sms && fields.costslider">
                      <v-text-field
                        v-for="k in multipleSMS"
                        :key="k"
                        v-model="multipleSMSMap[`sms${k}`]"
                        type="number"
                        :label="$t('fields.sms_service_amount').replace('{sms}',smsCost[k])"
                        :rules="rules.sms_amount"
                      />
                    </div>
                    <v-switch
                      v-model="fields.microsms_transfer"
                      :label="`${$t('fields.transfer_payment')} (microsms.pl)`"
                    />
                    <v-text-field
                      v-if="fields.microsms_transfer"
                      v-model="fields.microsms_transfer_cost"
                      type="number"
                      :label="$t('fields.transfer_cost')"
                      autocomplete="new-password"
                      :rules="rules.microsms_transfer_cost"
                    />
                  </div>
                  <div v-if="config.lvlup">
                    <v-switch
                      v-model="fields.lvlup"
                      :label="`${$t('transfer_psc')} (lvlup.pro)`"
                    />
                    <v-text-field
                      v-if="fields.lvlup"
                      v-model="fields.lvlup_cost"
                      type="number"
                      :label="$t('fields.transfer_cost')"
                      autocomplete="new-password"
                      :rules="rules.microsms_transfer_cost"
                    />
                  </div>
                  <div v-if="config.paypal">
                    <v-switch
                      v-model="fields.paypal_p24"
                      :label="`${$t('przelewy24')} (paypal.com)`"
                    />
                    <v-text-field
                      v-if="fields.paypal_p24"
                      v-model="fields.paypal_p24_cost"
                      type="number"
                      :label="$t('fields.transfer_cost')"
                      autocomplete="new-password"
                      :rules="rules.microsms_transfer_cost"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      max-width="400"
    >
      <v-card outlined>
        <v-card-title class="text-h5">
          {{ $t('titles.are_you_sure') }}
        </v-card-title>
        <v-card-text>
          {{ $t('misc.after_service_delete') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            text
            @click="dialogDelete = false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="error"
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
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      multipleSMSMap: {
        sms1: 0,
        sms2: 0,
        sms3: 0,
        sms4: 0,
        sms5: 0,
        sms6: 0,
        sms7: 0,
        sms8: 0,
        sms9: 0,
        sms10: 0,
        sms11: 0
      },
      multipleSMS: [],
      dialogDelete: false,
      oldServiceId: '',
      serviceId: '',
      valid: false,
      defaultFields: {
        name: '',
        icon: false,
        iconUrl: '',
        min_amount: 1,
        max_amount: 30,
        costslider: false,
        microsms_sms: false,
        microsms_sms_type: 0,
        microsms_sms_list: '',
        microsms_transfer: false,
        microsms_transfer_cost: 0,
        lvlup: false,
        lvlup_cost: 0,
        paypal_p24: false,
        paypal_p24_cost: 0,
        server: '',
        commands: '',
        description: this.$t('misc.default_description')
      },
      fields: {},
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
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        iconUrl: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_url(v) || this.$t('formats.wrong_format')
        ],
        microsms_sms_type: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        microsms_transfer_cost: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        server: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        sms_amount: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_natural_number(v) || this.$t('formats.wrong_format')
        ],
        min_amount: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_natural_number(v) || this.$t('formats.wrong_format')
        ],
        max_amount: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_natural_number(v) || this.$t('formats.wrong_format'),
          v => parseFloat(this.fields.min_amount) <= parseFloat(v) || this.$t('formats.must_be_greater')
        ],
        multiple_sms: [
          v => v.length > 0 || this.$t('formats.field_not_empty')
        ],
        service_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.normal_string(v) || this.$t('formats.wrong_format_serviceid')
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
    },
    smsList () {
      let result = ''
      for (const i in this.multipleSMS) {
        result += `${this.multipleSMS[i]}=${this.multipleSMSMap[`sms${this.multipleSMS[i]}`]}|`
      }
      return result
    }
  },
  methods: {
    initializeSmsList (microsmsSmsList) {
      if (microsmsSmsList) {
        const l = microsmsSmsList.split('|')
        l.pop()
        const result = []
        for (const i in l) {
          const [type, amount] = l[i].split('=')
          result.push(parseFloat(type))
          this.multipleSMSMap[`sms${type}`] = parseFloat(amount)
        }
        result.sort((a, b) => a - b)
        this.multipleSMS = result
      } else {
        this.multipleSMS = []
        for (let i = 1; i <= 11; i++) {
          this.multipleSMSMap[`sms${i}`] = '0'
        }
      }
    },
    editService (service) {
      this.serviceId = service.serviceId
      this.oldServiceId = service.serviceId
      const newService = Object.assign(Object.assign({}, this.defaultFields), service)
      this.initializeSmsList(service.microsms_sms_list)
      this.fields = newService
      this.fields.server = this.servers[this.fields.server] ? this.fields.server : ''
      this.dialog = true
    },
    removeService () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}/services/${this.serviceId}`).remove()
      this.dialog = false
      this.dialogDelete = false
    },
    newService () {
      this.serviceId = `${Math.random().toString(36).replace('0.', '')}`
      this.fields = Object.assign({}, this.defaultFields)
      this.dialog = true
    },
    saveService () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        this.fields.microsms_sms_list = this.smsList
        // this.fields.microsms_transfer_cost = parseFloat(this.fields.microsms_transfer_cost)
        this.fields.lvlup_cost = parseFloat(this.fields.lvlup_cost)
        this.fields.paypal_p24_cost = parseFloat(this.fields.paypal_p24_cost)
        this.$fire.database.ref().child(`/shops/${shopid}/services/${this.serviceId}`).set(this.fields)
        if (this.serviceId !== this.oldServiceId && this.oldServiceId !== '') {
          this.$fire.database.ref().child(`/shops/${shopid}/services/${this.oldServiceId}`).remove()
        }
        this.dialog = false
      }
    }
  }
}
</script>
