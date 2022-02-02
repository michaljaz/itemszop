<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <center class="mt-5">
          <h1>{{ $t('check_voucher') }}</h1>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="code"
              class="mt-5"
              :label="$t('fields.code')"
              prepend-icon="mdi-ticket-percent"
              :rules="rules.code"
            />
            <v-text-field
              v-model="nick"
              class="mt-5"
              :label="$t('fields.nick')"
              prepend-icon="mdi-account"
              :rules="rules.nick"
            />
          </v-form>
          <v-btn class="blue darken-4" large @click="check">
            {{ $t('actions.check_voucher') }}
          </v-btn>
        </center>
      </v-col>
    </v-row>
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
          {{ $t('actions.cancel') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'VoucherPage',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      snackbarMessage: '',
      snackbar: false,
      valid: false,
      code: '',
      nick: '',
      rules: {
        code: [
          value => !!value || this.$t('formats.field_not_empty'),
          v => /^[a-z0-9]{6,}$/.test(v) || this.$t('formats.wrong_format_voucher')
        ],
        nick: [
          value => !!value || this.$t('formats.field_not_empty'),
          v => /^[a-zA-Z0-9_]{2,16}$/.test(v) || this.$t('formats.wrong_format_nick')
        ]
      }
    }
  },
  mounted () {
    this.$emit('breadcrumb', [{
      text: this.$t('titles.shop'),
      disabled: false,
      href: `/shop/${this.$route.params.shopid}`
    },
    {
      text: this.$t('titles.redeem_voucher'),
      disabled: true
    }])
  },
  methods: {
    check () {
      this.$refs.form.validate()
      if (this.valid) {
        const { code, nick } = this
        const { shopid } = this.$route.params
        this.$axios.get('/voucher', {
          params: { code, nick, shopid }
        }).then(({ data }) => {
          if (data.success) {
            this.snackbarMessage = 'Pomyślnie użyto vouchera'
          } else {
            this.snackbarMessage = ({
              'wrong-format-voucher': this.$t('responses.wrong_format_voucher'),
              'wrong-format-nick': this.$t('responses.wrong_format_nick'),
              'wrong-format-shopid': this.$t('responses.wrong_format_shopid'),
              'voucher-not-exist': this.$t('responses.voucher_not_exist'),
              'voucher-expired': this.$t('responses.voucher_expired'),
              'service-not-exist': this.$t('responses.service_not_exist'),
              'server-not-exist': this.$t('responses.server_not_exist'),
              'command-error': this.$t('responses.command_error'),
              'auth-error': this.$t('responses.auth_error')
            })[data.error]
          }
          this.snackbar = true
        })
      }
    }
  }
}
</script>
