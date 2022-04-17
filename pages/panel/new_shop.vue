<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pt-1 pb-4" elevation="2">
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
              <v-alert
                v-model="error"
                color="red"
                type="error"
                dismissible
                outlined
              >
                {{ $t('responses.shop_already_exist') }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" rounded text @click="submit">
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
      snackbar: false,
      url: `${document.location.origin}/shop/`,
      name: '',
      shopid: '',
      valid: false,
      error: false,
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
          history: {}
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
          this.error = true
        })
    }
  }
}
</script>
