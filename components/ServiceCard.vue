<template>
  <div>
    <v-card elevation="5" height="100%" :to="link">
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
            SMS
          </v-col>
          <v-col cols="12" xs="6" sm="6" md="6" class="text-right pb-0">
            <template v-if="service.sms">
              {{ smsCost[service.smsType] }} zł
            </template>
            <template v-else>
              X
            </template>
          </v-col>
          <v-col cols="12" xs="6" sm="6" md="6" class="pt-1">
            Przelew
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
      <v-card-actions v-if="!link">
        <v-dialog
          v-model="dialog"
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
              Kupuję
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
                    label="Przelew"
                    value="przelew"
                  />
                  <v-radio
                    v-if="service.sms"
                    label="SMS"
                    value="sms"
                  />
                </v-radio-group>
                <v-text-field v-model="nick" label="Wprowadź swój nick" :rules="rules.nick" />
              </v-form>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="next"
              >
                Dalej
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
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
      baseUrl: process.env.baseUrl,
      valid: false,
      nick: '',
      type: '',
      dialog: false,
      smsCost: {
        1: '1.23',
        2: '2.46',
        3: '3.69',
        4: '4.92',
        5: '6.15',
        6: '7.38',
        7: '11.07',
        8: '17.22',
        9: '23.37',
        10: '24.60',
        11: '30.75'
      },
      rules: {
        type: [
          value => !!value || 'Wybierz rodzaj płatności'
        ],
        nick: [
          value => !!value || 'Wpisz nick',
          v => /^[a-zA-Z0-9_]{2,16}$/.test(v) || 'Nieprawidłowy format'
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
        returl_url: `${this.baseUrl}/shop/${this.shopid}/payment_success`,
        returl_urlc: `${this.baseUrl}/api/przelew`
      })
      const url = `https://microsms.pl/api/bankTransfer/?${params}`
      document.location.href = url
    },
    buySMS () {

    }
  }
}
</script>
