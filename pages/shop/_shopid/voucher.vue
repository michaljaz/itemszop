<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <center class="mt-5">
          <h1>Sprawdź voucher</h1>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="code"
              class="mt-5"
              label="Kod"
              prepend-icon="mdi-ticket-percent"
              :rules="rules.code"
            />
            <v-text-field
              v-model="nick"
              class="mt-5"
              label="Nick"
              prepend-icon="mdi-account"
              :rules="rules.nick"
            />
          </v-form>
          <v-btn class="blue darken-4" large @click="check">
            Sprawdź
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
          value => !!value || 'Wpisz kod',
          v => /^[a-b0-9]{11}$/.test(v) || 'Nieprawidłowy format'
        ],
        nick: [
          value => !!value || 'Wpisz nick'
        ]
      }
    }
  },
  mounted () {
    this.$emit('breadcrumb', [{
      text: 'Sklep',
      disabled: false,
      href: `/shop/${this.$route.params.shopid}`
    },
    {
      text: 'Sprawdź voucher',
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
