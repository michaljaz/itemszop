<template>
  <div>
    <v-card elevation="10" class="pt-1">
      <v-card-title class="headline">
        <span class="text-h5">{{ $t('titles.adding_vouchers') }}</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="service"
                item-text="name"
                item-value="value"
                :label="$t('fields.choose_service')"
                :hint="$t('fields.choose_service_hint')"
                persistent-hint
                :items="services"
                :rules="rules.service"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="amount"
                :label="$t('fields.codes_amount')"
                :hint="$t('fields.codes_amount_hint')"
                persistent-hint
                type="number"
                :rules="rules.amount"
                max="100"
                min="0"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    :label="$t('fields.voucher_deadline')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date"
                  light
                  color="blue"
                  range
                  no-title
                  scrollable
                  :rules="rules.date"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    {{ $t('actions.cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    {{ $t('actions.save') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="green darken-1"
          text
          rounded
          @click="create"
        >
          {{ $t('actions.create_and_download') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card elevation="10" class="pt-1 mt-5">
      <v-card-title class="headline">
        <span class="text-h5">{{ $t('titles.removing_vouchers') }}</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          text
          rounded
          @click="del"
        >
          {{ $t('actions.remove_all_vouchers') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'ShopVouchers',
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
      valid: false,
      date: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      menu: false,
      service: '',
      amount: 0,
      rules: {
        service: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        amount: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_natural_number(v) || this.$t('formats.wrong_codes_number'),
          v => this.$regex.max_100(v) || this.$t('formats.max_100_vouchers')
        ],
        date: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.vouchers')
    }
  },
  computed: {
    services () {
      const result = []
      for (const serviceId in this.shop.services) {
        const service = this.shop.services[serviceId]
        const server = this.servers[service.server] ? this.servers[service.server].serverName : ''
        result.push({
          name: `${service.name} (${server})`,
          value: serviceId
        })
      }
      return result
    }
  },
  methods: {
    download (text, filename) {
      const blob = new Blob([text], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    },
    del () {
      this.$fire.database.ref().child(`vouchers/${this.$route.params.shopid}`).remove()
    },
    create () {
      this.$refs.form.validate()
      if (this.valid) {
        const { date, service, amount } = this
        const codes = []
        const voucher = {
          service,
          start: date[0]
        }
        if (date[1]) {
          voucher.end = date[1]
        }
        for (let i = 0; i < amount; i++) {
          const code = Math.random().toString(36).replace('0.', '')
          codes.push(code)
          this.$fire.database.ref().child(`vouchers/${this.$route.params.shopid}/${code}`).set(voucher)
        }
        const result = codes.join('\n')
        this.download(result, `vouchers-${service}.txt`)
        this.amount = 0
        this.service = ''
      }
    }
  }
}
</script>
