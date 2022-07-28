<template>
  <div>
    <v-card class="pt-1 pb-4" elevation="2">
      <v-card-title class="headline">
        {{ $t('titles.payments_config') }}
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-switch v-model="paysafecard" :label="$t('paysafecard_manual')" />
          <v-switch v-model="microsms" :label="$t('fields.microsms')" />
          <div v-if="microsms">
            <v-text-field
              v-model="microsms_user_id"
              :label="$t('fields.user_id')"
              autocomplete="new-password"
              :rules="rules.microsms_user_id"
              type="number"
            />
            <v-row>
              <v-col>
                <h1 class="display-1">
                  {{ $t('transfer') }}
                </h1>
                <v-text-field
                  v-model="microsms_transfer_id"
                  type="number"
                  :label="$t('fields.id_number')"
                  autocomplete="new-password"
                  :rules="rules.microsms_transfer_id"
                />
                <v-text-field
                  v-model="microsms_transfer_hash"
                  :label="$t('fields.hash')"
                  autocomplete="new-password"
                  :rules="rules.microsms_transfer_hash"
                />
              </v-col>
              <v-col>
                <h1 class="display-1">
                  SMS
                </h1>
                <v-text-field
                  v-model="microsms_sms_id"
                  :label="$t('fields.id_number')"
                  autocomplete="new-password"
                  :rules="rules.microsms_sms_id"
                  type="number"
                />
                <v-text-field
                  v-model="microsms_sms_text"
                  :label="$t('fields.sms_content')"
                  autocomplete="new-password"
                  :rules="rules.microsms_sms_text"
                />
              </v-col>
            </v-row>
          </div>
          <v-switch v-model="lvlup" :label="$t('fields.lvlup')" />
          <div v-if="lvlup">
            <v-text-field
              v-model="lvlup_api"
              :label="$t('fields.lvlup_api')"
              autocomplete="new-password"
              :rules="rules.lvlup_api"
            />
          </div>
          <v-switch v-model="paypal" :label="$t('fields.paypal')" />
          <div v-if="paypal">
            <v-text-field
              v-model="paypal_id"
              :label="$t('fields.paypal_id')"
              autocomplete="new-password"
              :rules="rules.paypal_id"
            />
            <v-text-field
              v-model="paypal_secret"
              :label="$t('fields.paypal_secret')"
              autocomplete="new-password"
              :rules="rules.paypal_secret"
            />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="save">
          {{ $t('actions.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'ShopPayments',
  props: {
    shop: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      valid: false,
      select: 'MicroSMS',
      items: ['MicroSMS'],
      microsms: this.config.microsms,
      microsms_user_id: this.config.microsms_user_id,
      microsms_transfer_id: this.config.microsms_transfer_id,
      microsms_transfer_hash: this.config.microsms_transfer_hash,
      microsms_sms_id: this.config.microsms_sms_id,
      microsms_sms_text: this.config.microsms_sms_text,
      lvlup: this.config.lvlup,
      lvlup_api: this.config.lvlup_api,
      paypal: this.config.paypal,
      paypal_id: this.config.paypal_id,
      paypal_secret: this.config.paypal_secret,
      paysafecard: false,
      rules: {
        microsms_user_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        microsms_transfer_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        microsms_transfer_hash: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.microsms_hash(v) || this.$t('formats.hash_format')
        ],
        microsms_sms_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        microsms_sms_text: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.sms_text(v) || this.$t('formats.sms_format')
        ],
        lvlup_api: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.lvlup_api(v) || this.$t('formats.wrong_format_api_key')
        ],
        paypal_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        paypal_secret: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.payments')
    }
  },
  methods: {
    save () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        this.$fire.database.ref().child(`config/${shopid}`).update({
          microsms: !!this.microsms,
          microsms_user_id: this.microsms ? this.microsms_user_id : '',
          microsms_transfer_id: this.microsms ? this.microsms_transfer_id : '',
          microsms_transfer_hash: this.microsms ? this.microsms_transfer_hash : '',
          microsms_sms_id: this.microsms ? this.microsms_sms_id : '',
          microsms_sms_text: this.microsms ? this.microsms_sms_text : '',
          lvlup: !!this.lvlup,
          lvlup_api: this.lvlup ? this.lvlup_api : '',
          paypal: !!this.paypal,
          paypal_id: this.paypal ? this.paypal_id : '',
          paypal_secret: this.paypal ? this.paypal_secret : ''
        })
      }
    }
  }
}
</script>
