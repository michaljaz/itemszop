<template>
  <div>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="pt-1 pb-4">
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-card-title class="headline justify-center">
                Nowy sklep
              </v-card-title>
              <v-card-text>
                <v-text-field v-model="name" :rules="name_rules" label="Nazwa sklepu" />
                <v-text-field v-model="shopid" :rules="shopid_rules" label="Id sklepu" />
                <v-text-field v-model="url" label="Tak będzie wygladał link" disabled />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue" @click="submit">
                  Dalej
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'NewShop',
  data () {
    return {
      url: `${document.location.origin}/shop/`,
      name: '',
      shopid: '',
      valid: false,
      name_rules: [
        value => !!value || 'Wpisz nazwę sklepu'
      ],
      shopid_rules: [
        value => !!value || 'Wpisz id sklepu',
        value => (value && value.length >= 4) || 'Minimalnie 4 znaki',
        v => /^[A-Za-z0-9_]{4,}$/.test(v) || 'Id sklepu może zawierać tylko litery lub cyfry'
      ]
    }
  },
  head () {
    return {
      title: 'Nowy sklep'
    }
  },
  watch: {
    shopid () {
      this.url = `${document.location.origin}/shop/${this.shopid}`
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this
        const { uid } = this.$fire.auth.currentUser
        this.$fire.database.ref().child(`users/${uid}`)
          .update({ [shopid]: true })
          .then(() => {
            this.$router.push(`/panel/shop/${shopid}`)
          })
          .catch((e) => {
            // console.log(e)
          })
      }
    }
  }
}
</script>
