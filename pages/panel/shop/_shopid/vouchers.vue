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
                    item-text="name"
                    item-value="value"
                    label="Wybierz usługę"
                    hint="Wybierz jaką usługę będzie można aktywować voucherem."
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Liczba kodów"
                    hint="Liczba kodów, które mają zostać wygenerowane. Ustawiając np. 20 stworzysz dwadzieścia różnych kodów na tę samą usługę."
                    persistent-hint
                    type="number"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    item-text="name"
                    item-value="value"
                    label="Ważność kodów"
                    hint="Liczba dni, po których voucher wygasa, jeśli nie zostanie użyty"
                    persistent-hint
                  />
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
    }
  },
  head () {
    return {
      title: 'Vouchery'
    }
  },
  methods: {
    create () {

    }
  }
}
</script>
