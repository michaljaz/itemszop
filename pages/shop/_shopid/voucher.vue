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
              :label="$t('code')"
              prepend-icon="mdi-ticket-percent"
              :rules="rules.code"
            />
            <v-text-field
              v-model="nick"
              class="mt-5"
              :label="$t('nick')"
              prepend-icon="mdi-account"
              :rules="rules.nick"
            />
          </v-form>
          <v-btn class="blue darken-4" large @click="check">
            {{ $t('check_voucher') }}
          </v-btn>
        </center>
      </v-col>
    </v-row>
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
      valid: false,
      code: '',
      nick: '',
      rules: {
        code: [
          value => !!value || this.$t('field_not_empty'),
          v => /^[a-z0-9]{6,}$/.test(v) || this.$t('wrong_format')
        ],
        nick: [
          value => !!value || this.$t('field_not_empty'),
          v => /^[a-zA-Z0-9_]{2,16}$/.test(v) || this.$t('wrong_format')
        ]
      }
    }
  },
  mounted () {
    this.$emit('breadcrumb', [{
      text: this.$t('shop'),
      disabled: false,
      href: `/shop/${this.$route.params.shopid}`
    },
    {
      text: this.$t('check_voucher'),
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
          console.log(data)
        })
      }
    }
  }
}
</script>
