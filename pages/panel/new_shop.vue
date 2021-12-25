<template>
  <div>
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
        v => /^[A-Za-z0-9_]{4,}$/.test(v) || 'Id sklepu może zawierać tylko litery, cyfry lub "_"'
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
        this.createNewShop()
      }
    },
    createNewShop () {
      const { shopid, name } = this
      const { uid } = this.$fire.auth.currentUser
      this.$fire.database.ref().child(`shops/${shopid}`)
        .set({
          icon: '',
          owner: uid,
          cel: 100,
          name,
          pages: {
            page1: {
              title: 'Regulamin',
              content: '<h1>Treść</h1>'
            }
          },
          history: {},
          payments: {
            paymentsUserId: '',
            paymentsPrzelewId: '',
            paymentsHash: '',
            paymentsShopId: '',
            paymentsSMS: ''
          },
          servers: {
            '1_17': {
              serverIp: 'localhost:25575',
              serverName: 'Server 1.17',
              serverPassword: 'password'
            }
          },
          services: {
            vip: {
              commands: 'say [nick] kupił VIP',
              description: 'OPIS',
              icon: '/img/vip.png',
              payments: {
                SMS: { active: false },
                przelew: { active: false },
                PSC: { active: false }
              },
              server: '1_17',
              title: 'VIP'
            }
          },
          zebrane: 0
        })
        .then(() => {
          this.$fire.database.ref().child(`users/${uid}`)
            .update({ [shopid]: true })
            .then(() => {
              this.$router.push(`/panel/shop/${shopid}`)
            })
            .catch((e) => {
              // console.log(e)
            })
        })
        .catch(() => {
          // console.log('nie masz uprawnień')
        })
    }
  }
}
</script>
