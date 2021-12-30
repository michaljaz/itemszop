<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pt-1 pb-4" elevation="10">
          <v-card-title class="headline">
            Konfiguracja płatności
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-select
                v-model="select"
                :items="items"
                label="Dostawca płatności"
              />
              <v-text-field
                v-model="paymentsUserId"
                label="ID użytkownika"
                autocomplete="new-password"
                :rules="rulesUserId"
                type="number"
              />
              <v-row>
                <v-col>
                  <h1 class="display-1">
                    Przelew
                  </h1>
                  <v-text-field
                    v-model="paymentsPrzelewId"
                    type="number"
                    label="Numer ID"
                    autocomplete="new-password"
                    :rules="rulesPrzelewId"
                  />
                  <v-text-field
                    v-model="paymentsHash"
                    label="Hash"
                    autocomplete="new-password"
                    :rules="rulesHash"
                  />
                </v-col>
                <v-col>
                  <h1 class="display-1">
                    SMS
                  </h1>
                  <v-text-field
                    v-model="paymentsShopId"
                    label="Numer ID"
                    autocomplete="new-password"
                    :rules="rulesShopId"
                    type="number"
                  />
                  <v-text-field
                    v-model="paymentsSMS"
                    label="Treść SMS"
                    autocomplete="new-password"
                    :rules="rulesSMS"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" rounded text @click="save">
              Zapisz
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ShopPayments',
  props: {
    shop: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      valid: false,
      select: 'MicroSMS',
      items: ['MicroSMS'],
      paymentsUserId: this.shop.payments.paymentsUserId,
      paymentsPrzelewId: this.shop.payments.paymentsPrzelewId,
      paymentsHash: this.shop.payments.paymentsHash,
      paymentsShopId: this.shop.payments.paymentsShopId,
      paymentsSMS: this.shop.payments.paymentsSMS,
      rulesUserId: [
        value => !!value || 'Wpisz ID użytkownika'
      ],
      rulesPrzelewId: [
        value => !!value || 'Wpisz id przelewu'
      ],
      rulesHash: [
        value => !!value || 'Wpisz hash',
        v => /^[A-Za-z0-9$*@]+$/.test(v) || 'Hash może zawierać litery, cyfry oraz @,*,$'
      ],
      rulesShopId: [
        value => !!value || 'Wpisz id sklepu'
      ],
      rulesSMS: [
        value => !!value || 'Wpisz treść SMS',
        v => /^[A-Z.]+$/.test(v) || 'Treść sms może zawierać tylko wielkie litery i kropki'
      ]
    }
  },
  head () {
    return {
      title: 'Płatności'
    }
  },
  methods: {
    save () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        const { paymentsUserId, paymentsPrzelewId, paymentsHash, paymentsShopId, paymentsSMS } = this
        this.$fire.database.ref().child(`shops/${shopid}/payments/`).set({
          paymentsUserId,
          paymentsPrzelewId,
          paymentsHash,
          paymentsShopId,
          paymentsSMS
        })
      }
    }
  }
}
</script>
