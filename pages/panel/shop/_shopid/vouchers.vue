<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <v-card elevation="10" class="pt-1">
          <v-card-title class="headline">
            <span class="text-h5">Dodawanie vouchera</span>
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
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="amount"
                    label="Liczba kodów"
                    hint="Liczba kodów, które mają zostać wygenerowane. Ustawiając np. 20 stworzysz dwadzieścia różnych kodów na tę samą usługę."
                    persistent-hint
                    type="number"
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
              Stwórz
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
      services: [],
      date: [],
      menu: false,
      service: '',
      amount: 0
    }
  },
  head () {
    return {
      title: 'Vouchery'
    }
  },
  watch: {
    shop () {
      this.updateServices()
    },
    servers () {
      this.updateServices()
    }
  },
  mounted () {
    this.updateServices()
  },
  methods: {
    updateServices () {
      const result = []
      for (const serviceId in this.shop.services) {
        const service = this.shop.services[serviceId]
        const server = this.servers[service.server] ? this.servers[service.server].serverName : ''
        result.push({
          name: `${service.name} (${server})`,
          value: serviceId
        })
      }
      this.services = result
    },
    create () {
      const { date, service, amount } = this
      console.log(date[0], date[1], service, amount)
    }
  }
}
</script>
