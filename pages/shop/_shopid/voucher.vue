<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <center class="mt-5">
          <h1>Sprawdź voucher</h1>
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
      code: '',
      nick: '',
      rules: {
        code: [
          value => !!value || 'Wpisz kod',
          value => (value && value.length === 11) || 'Kod vouchera musi zawierać 11 znaków'
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
      const { code, nick } = this
      console.log(code, nick)
    }
  }
}
</script>
