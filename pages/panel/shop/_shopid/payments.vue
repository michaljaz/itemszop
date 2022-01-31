<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pt-1 pb-4" elevation="10">
          <v-card-title class="headline">
            {{ $t('payments_config') }}
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-select
                v-model="select"
                :items="items"
                :label="$t('payment_operator')"
              />
              <v-text-field
                v-model="paymentsUserId"
                :label="$t('user_id')"
                autocomplete="new-password"
                :rules="rules.userId"
                type="number"
              />
              <v-row>
                <v-col>
                  <h1 class="display-1">
                    {{ $t('transfer') }}
                  </h1>
                  <v-text-field
                    v-model="paymentsPrzelewId"
                    type="number"
                    :label="$t('id_number')"
                    autocomplete="new-password"
                    :rules="rules.przelewId"
                  />
                  <v-text-field
                    v-model="paymentsHash"
                    :label="$t('hash')"
                    autocomplete="new-password"
                    :rules="rules.hash"
                  />
                </v-col>
                <v-col>
                  <h1 class="display-1">
                    SMS
                  </h1>
                  <v-text-field
                    v-model="paymentsShopId"
                    :label="$t('id_number')"
                    autocomplete="new-password"
                    :rules="rules.shopId"
                    type="number"
                  />
                  <v-text-field
                    v-model="paymentsSMS"
                    :label="$t('sms_content')"
                    autocomplete="new-password"
                    :rules="rules.SMS"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" rounded text @click="save">
              {{ $t('save') }}
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
      required: true
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
      rules: {
        userId: [
          value => !!value || this.$t('field_not_empty')
        ],
        przelewId: [
          value => !!value || this.$t('field_not_empty')
        ],
        hash: [
          value => !!value || this.$t('field_not_empty'),
          v => /^[A-Za-z0-9$*@]+$/.test(v) || this.$t('hash_format')
        ],
        shopId: [
          value => !!value || this.$t('field_not_empty')
        ],
        SMS: [
          value => !!value || this.$t('field_not_empty'),
          v => /^[A-Z.]+$/.test(v) || this.$t('sms_format')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('payments')
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
