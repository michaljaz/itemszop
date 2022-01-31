<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pt-1 pb-4" elevation="10">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-card-title class="headline justify-center">
              {{ $t('new_shop') }}
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="name" :rules="rules.name" label="Nazwa sklepu" />
              <v-text-field
                v-model="shopid"
                :rules="rules.shopid"
                label="Id sklepu"
                :prefix="url"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue" rounded text @click="submit">
                {{ $t('next') }}
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
      rules: {
        name: [
          value => !!value || this.$t('field_not_empty')
        ],
        shopid: [
          value => !!value || this.$t('field_not_empty'),
          value => (value && value.length >= 4) || this.$t('min_4_chars'),
          v => /^[A-Za-z0-9_]{4,}$/.test(v) || this.$t('shop_id_format')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('new_shop')
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
          collected: 0,
          goal: 100,
          maxservices: 5,
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
          services: {
            vip: {
              name: 'VIP',
              sms: false,
              smsType: 0,
              przelew: false,
              przelewCost: 0,
              server: '1_17',
              commands: 'say [nick] kupił VIP',
              description: 'OPIS'
            }
          }
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
