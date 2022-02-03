<template>
  <div>
    <v-card elevation="5" height="100%">
      <center>
        <template v-if="service.icon">
          <v-img :src="service.iconUrl" max-height="120" contain />
        </template>
        <template v-else>
          <v-img src="/item.png" max-height="120" contain />
        </template>
      </center>
      <v-card-text>
        <v-row>
          <v-col cols="12" xs="6" sm="6" md="6" class="pb-0">
            {{ $t('sms') }}
          </v-col>
          <v-col cols="12" xs="6" sm="6" md="6" class="text-right pb-0">
            <template v-if="service.sms">
              {{ smsCost[service.smsType][1] }} zł
            </template>
            <template v-else>
              X
            </template>
          </v-col>
          <v-col cols="12" xs="6" sm="6" md="6" class="pt-1">
            {{ $t('transfer') }}
          </v-col>
          <v-col cols="12" xs="6" sm="6" md="6" class="text-right pt-1">
            <template v-if="service.przelew">
              {{ service.przelewCost }} zł
            </template>
            <template v-else>
              X
            </template>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="mx-4" />
      <v-card-title class="justify-center">
        {{ service.name }}
      </v-card-title>
      <v-card-actions v-if="link">
        <v-btn
          color="info"
          large
          outlined
          block
          :to="link"
        >
          {{ $t('actions.description') }}
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-dialog
          v-model="dialog"
          persistent
          width="500"
        >
          <template v-if="service.sms || service.przelew" #activator="{ on, attrs }">
            <v-btn
              color="green"
              large
              outlined
              block
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('actions.buy') }}
            </v-btn>
          </template>

          <v-card elevation="5" outlined>
            <v-card-title class="headline">
              {{ service.name }}
            </v-card-title>

            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
              >
                <v-radio-group v-model="type" :rules="rules.type">
                  <v-radio
                    v-if="service.przelew"
                    :label="$t('transfer')"
                    value="przelew"
                  />
                  <v-radio
                    v-if="service.sms"
                    :label="$t('sms')"
                    value="sms"
                  />
                </v-radio-group>
                <v-text-field v-model="nick" :label="$t('fields.nick')" :rules="rules.nick" />
              </v-form>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="dialog=false"
              >
                {{ $t('actions.cancel') }}
              </v-btn>
              <v-btn
                color="green"
                text
                @click="next"
              >
                {{ $t('actions.next') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="dialogSMS"
      persistent
      width="500"
    >
      <v-card elevation="5" outlined>
        <v-card-title class="headline">
          {{ service.name }}
        </v-card-title>

        <v-card-text>
          <center>
            <i18n
              path="misc.sms_send_instruction"
            >
              <template #netto>
                {{ smsCost[service.smsType][0] }}
              </template>
              <template #brutto>
                {{ smsCost[service.smsType][1] }}
              </template>
              <template #sms>
                <b>{{ payments.paymentsSMS }}</b>
              </template>
              <template #number>
                <b>{{ smsCost[service.smsType][2] }}</b>
              </template>
              <template #br>
              </br>
              </template>
            </i18n>
          </center>
          <v-form
            ref="form2"
            v-model="valid2"
          >
            <v-text-field v-model="code" label="Wpisz kod z sms'a" :rules="rules.code" />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialogSMS=false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="green"
            text
            @click="checkSMS"
          >
            {{ $t('actions.next') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarMessage }}
      <template #action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $t('actions.cancel') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'ServiceCard',
  props: {
    payments: {
      type: Object,
      default: () => ({})
    },
    service: {
      type: Object,
      required: true
    },
    link: {
      type: String,
      default: () => ('')
    },
    shopid: {
      type: String,
      default: () => ('')
    }
  },
  data () {
    return {
      snackbar: false,
      snackbarMessage: '',
      code: '',
      dialogSMS: false,
      valid2: false,
      valid: false,
      nick: '',
      type: '',
      dialog: false,
      smsCost: {
        0: ['', '', ''],
        1: ['1', '1.23', '71480'],
        2: ['2', '2.46', '72480'],
        3: ['3', '3.69', '73480'],
        4: ['4', '4.92', '74480'],
        5: ['5', '6.15', '75480'],
        6: ['6', '7.38', '76480'],
        7: ['9', '11.07', '79480'],
        8: ['14', '17.22', '91400'],
        9: ['19', '23.37', '91900'],
        10: ['20', '24.60', '92022'],
        11: ['25', '30.75', '92550']
      },
      rules: {
        type: [
          value => !!value || this.$t('formats.field_not_empty')
        ],
        nick: [
          value => !!value || this.$t('formats.field_not_empty'),
          v => /^[a-zA-Z0-9_]{2,16}$/.test(v) || this.$t('formats.wrong_format')
        ],
        code: [
          value => !!value || this.$t('formats.field_not_empty'),
          v => /^[A-Za-z0-9]{8}$/.test(v) || this.$t('formats.wrong_format')
        ]
      }
    }
  },
  methods: {
    next () {
      this.$refs.form.validate()
      if (this.valid) {
        if (this.type === 'przelew') {
          this.buyPrzelew()
        } else {
          this.buySMS()
        }
      }
    },
    buyPrzelew () {
      const params = new URLSearchParams({
        shopid: this.payments.paymentsPrzelewId,
        amount: this.service.przelewCost,
        signature: require('md5')(`${this.payments.paymentsPrzelewId}${this.payments.paymentsHash}${this.service.przelewCost}`),
        description: `${this.service.name} dla ${this.nick}`,
        control: `${this.shopid}|${this.service.serviceId}|${this.nick}`,
        returl_url: `${process.env.apiBaseUrl}/shop/${this.shopid}/payment_success`,
        returl_urlc: `${process.env.apiBaseUrl}/api/przelew`
      })
      const url = `https://microsms.pl/api/bankTransfer/?${params}`
      window.top.location.href = url
    },
    buySMS () {
      this.dialog = false
      this.dialogSMS = true
    },
    checkSMS () {
      this.$refs.form2.validate()
      if (this.valid2) {
        const { code, nick, shopid } = this
        this.$axios.get('/sms', {
          params: { code, nick, shopid, serviceid: this.service.serviceId }
        }).then(({ data }) => {
          if (data.success) {
            this.$router.push(`/shop/${shopid}/payment_success`)
          } else {
            this.snackbarMessage = this.$t(`responses.${data.error}`)
            this.snackbar = true
          }
        })
      }
    }
  }
}
</script>
