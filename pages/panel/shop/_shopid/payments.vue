<template>
  <div>
    <v-card class="pt-1 pb-4" elevation="10">
      <v-card-title class="headline">
        {{ $t('titles.payments_config') }}
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-switch v-model="fields.microsms" :label="$t('fields.microsms')" />
          <div v-if="fields.microsms">
            <v-text-field
              v-model="fields.microsms_user_id"
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
                  v-model="fields.microsms_transfer_id"
                  type="number"
                  :label="$t('fields.id_number')"
                  autocomplete="new-password"
                  :rules="rules.microsms_transfer_id"
                />
                <v-text-field
                  v-model="fields.microsms_transfer_hash"
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
                  v-model="fields.microsms_sms_id"
                  :label="$t('fields.id_number')"
                  autocomplete="new-password"
                  :rules="rules.microsms_sms_id"
                  type="number"
                />
                <v-text-field
                  v-model="fields.microsms_sms_text"
                  :label="$t('fields.sms_content')"
                  autocomplete="new-password"
                  :rules="rules.microsms_sms_text"
                />
              </v-col>
            </v-row>
          </div>
          <v-switch v-model="fields.lvlup" :label="$t('fields.lvlup')" />
          <div v-if="fields.lvlup">
            <v-text-field
              v-model="fields.lvlup_api"
              :label="$t('fields.lvlup_api')"
              autocomplete="new-password"
              :rules="rules.lvlup_api"
            />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green" rounded text @click="save">
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
    payments: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      valid: false,
      select: 'MicroSMS',
      items: ['MicroSMS'],
      fields: {
        microsms: false,
        microsms_user_id: '',
        microsms_transfer_id: '',
        microsms_transfer_hash: '',
        microsms_sms_id: '',
        microsms_sms_text: '',
        lvlup: false,
        lvlup_api: ''
      },
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
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.payments')
    }
  },
  mounted () {
    this.fields.microsms = this.payments.microsms
    this.fields.microsms_user_id = this.payments.microsms_user_id
    this.fields.microsms_transfer_id = this.payments.microsms_transfer_id
    this.fields.microsms_transfer_hash = this.payments.microsms_transfer_hash
    this.fields.microsms_sms_id = this.payments.microsms_sms_id
    this.fields.microsms_sms_text = this.payments.microsms_sms_text
    this.fields.lvlup = this.payments.lvlup
    this.fields.lvlup_api = this.payments.lvlup_api
  },
  methods: {
    save () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        this.$fire.database.ref().child(`payments/${shopid}`).set(this.fields)
      }
    }
  }
}
</script>
