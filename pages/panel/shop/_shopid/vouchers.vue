<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <v-card elevation="10" class="pt-1">
          <v-card-title class="headline">
            <span class="text-h5">Dodawanie voucherów</span>
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
                    label="Wybierz usługę"
                    hint="Wybierz jaką usługę będzie można aktywować voucherem."
                    persistent-hint
                    :items="services"
                    :rules="rules.service"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="amount"
                    label="Liczba kodów"
                    hint="Liczba kodów, które mają zostać wygenerowane. Ustawiając np. 20 stworzysz dwadzieścia różnych kodów na tę samą usługę."
                    persistent-hint
                    type="number"
                    :rules="rules.amount"
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
                        label="Termin działania voucherów"
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
                        Anuluj
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >
                        Zapisz
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
              @click="create"
            >
              Stwórz i pobierz plik
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card elevation="10" class="pt-1 mt-5">
          <v-card-title class="headline">
            <span class="text-h5">Usuwanie voucherów</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red"
              text
              rounded
              @click="del"
            >
              Usuń wszystkie vouchery
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
          value => !!value || 'Wybierz usługę'
        ],
        amount: [
          value => !!value || 'Wpisz liczbę kodów',
          value => this.isNaturalNumber(value) || 'Niepoprawna liczba kodów'
        ],
        date: [
          value => !!value || 'Wybierz termin działania'
        ]
      }
    }
  },
  head () {
    return {
      title: 'Vouchery'
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
    isNaturalNumber (n) {
      n = n.toString() // force the value incase it is not
      const n1 = Math.abs(n)
      const n2 = parseInt(n, 10)
      return !isNaN(n1) && n2 === n1 && n1.toString() === n
    },
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
      }
    }
  }
}
</script>
