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
              {{ $t('actions.new_shop') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="name"
                :rules="rules.name"
                :label="$t('fields.shop_name')"
              />
              <v-text-field
                v-model="shopid"
                :rules="rules.shopid"
                :label="$t('fields.shop_id')"
                :prefix="url"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue" rounded text @click="submit">
                {{ $t('actions.next') }}
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
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        shopid: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.min_4_chars(v) || this.$t('formats.min_4_chars'),
          v => this.$regex.normal_string(v) || this.$t('formats.shop_id_format')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('actions.new_shop')
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
          last_payments_type: 1,
          name,
          pages: {
            page1: {
              title: 'Regulamin',
              content: '<h1>Treść</h1>'
            }
          },
          history: {},
          services: {
            vip: {
              name: 'VIP',
              microsms_sms: false,
              microsms_sms_type: 0,
              microsms_transfer: false,
              microsms_transfer_cost: 0,
              lvlup: false,
              lvlup_cost: 0,
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
