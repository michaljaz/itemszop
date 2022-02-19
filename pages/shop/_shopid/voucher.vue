<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <center class="mt-5">
          <h1>{{ $t('titles.redeem_voucher') }}</h1>
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
  layout: 'shop',
  props: {
    shopPath: {
      type: String,
      required: true
    },
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
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.voucher(v) || this.$t('formats.wrong_format_voucher')
        ],
        nick: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.nick(v) || this.$t('formats.wrong_format_nick')
        ]
      }
    }
  },
  mounted () {
    this.$emit('breadcrumb', [{
      text: this.$t('titles.shop'),
      disabled: false,
      href: `${this.shopPath}/`
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
            this.snackbarMessage = this.$t(`responses.${data.error}`)
          }
          this.snackbar = true
        })
      }
    }
  }
}
</script>
