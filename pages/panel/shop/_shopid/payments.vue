<template>
  <div>
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
      <v-btn color="green" @click="save">
        Zapisz
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  name: 'ShopPayments',
  props: {
    shop: {
      type: Object,
      default: () => {
        return {}
      }
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
