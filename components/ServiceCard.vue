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
            SMS
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
      <v-card-actions v-if="link">
        <v-btn
          color="info"
          large
          outlined
          block
          :to="link"
        >
          Opis
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
                @click="dialog=false"
              >
                Anuluj
              </v-btn>
              <v-btn
                color="green"
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
            Ta usługa kosztuje <b>{{ smsCost[service.smsType][0] }}zł netto ({{ smsCost[service.smsType][1] }}zł z vat)</b>.
            <br>
            Aby zakupić tą usługę wyślij SMS o treści <b>{{ payments.paymentsSMS }}</b> pod numer <b>{{ smsCost[service.smsType][2] }}</b>.
            <br>W odpowiedzi otrzymasz SMS z kodem, który wpisz poniżej.
          </center>
          <v-form
            ref="form2"
            v-model="valid2"
          >
            <v-text-field v-model="code" label="Wpisz kod z sms'a" :rules="rules.code" />
          </v-form>
          <center>
            Płatności zapewnia firma <a href="http://microsms.pl/">MicroSMS</a>. <br>
            Korzystanie z serwisu jest jednozanczne z akceptacją <a href="http://microsms.pl/partner/documents/">regulaminów</a>.<br>
            Jeśli nie dostałeś kodu zwrotnego w ciągu 30 minut skorzystaj z <a href="http://microsms.pl/customer/complaint/">formularza reklamacyjnego</a><br><br>
          </center>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialogSMS=false"
          >
            Anuluj
          </v-btn>
          <v-btn
            color="green"
            text
            @click="checkSMS"
          >
            Dalej
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
          Zamknij
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
      baseUrl: process.env.baseUrl,
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
          value => !!value || 'Wybierz rodzaj płatności'
        ],
        nick: [
          value => !!value || 'Wpisz nick',
          v => /^[a-zA-Z0-9_]{2,16}$/.test(v) || 'Nieprawidłowy format'
        ],
        code: [
          value => !!value || 'Wpisz kod',
          v => /^[A-Za-z0-9]{8}$/.test(v) || 'Nieprawidłowy format'
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
      window.top.location.href = url
    },
    buySMS () {
      this.dialog = false
      this.dialogSMS = true
    },
    checkSMS () {
      this.$refs.form2.validate()
      if (this.valid2) {
        const { code, nick } = this
        const { shopid, serviceid } = this.$route.params
        console.log('ready to check SMS', code, nick)
        this.$axios.get('/sms', {
          params: { code, nick, shopid, serviceid }
        }).then(({ data }) => {
          console.log(data)
          if (data.success) {
            this.$router.push(`/shop/${shopid}/payment_success`)
          } else {
            const errors = {
              'wrong-format': 'Nieprawidłowy format',
              'payments-not-exist': 'Płatność nie została skonfigurowana',
              'service-not-exist': 'Usługa nie istnieje',
              'server-not-exist': 'Serwer nie istnieje',
              'wrong-code': 'Nieprawidłowy kod',
              'command-error': 'Nie udało się wywołać komendy na serwerze minecraftowym',
              'auth-error': 'Nie udało się połączyć z serwerem minecraftowym',
              'history-error': 'Nie można zapisać płatności w historii',
              'monthly-goal-error': 'Nie udało się zaktualizować celu miesięcznego'
            }
            this.snackbarMessage = errors[data.error]
            this.snackbar = true
          }
        })
      }
    }
  }
}
</script>
