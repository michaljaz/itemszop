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
            <v-alert
              v-if="success"
              color="success"
              type="success"
              dismissible
              outlined
            >
              {{ success }}
            </v-alert>
            <v-alert
              v-if="error"
              color="red"
              type="error"
              dismissible
              outlined
            >
              {{ error }}
            </v-alert>
          </v-form>
          <v-btn :color="shop.theme ? shop.theme : 'blue darken-4'" large :loading="loadingButton" @click="check">
            {{ $t('actions.check_voucher') }}
          </v-btn>
        </center>
      </v-col>
    </v-row>
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
      loadingButton: false,
      error: false,
      success: false,
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
  head () {
    return {
      title: this.$t('titles.redeem_voucher')
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
        this.loadingButton = true
        const { code, nick } = this
        const shopid = this.$route.params.shopid ? this.$route.params.shopid : process.env.singleShopId
        this.$axios.get('/voucher', {
          params: { vouchercode: code, nick, shopid }
        }).then(({ data }) => {
          this.loadingButton = false
          this.error = false
          this.success = false
          if (data.success) {
            this.success = this.$t('titles.voucher_success')
          } else {
            this.error = this.$t(`responses.${data.error}`)
          }
        })
      }
    }
  }
}
</script>
