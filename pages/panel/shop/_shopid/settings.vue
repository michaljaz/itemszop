<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pt-1 pb-4" elevation="10">
          <v-card-title class="headline">
            {{ $t('settings') }}
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field v-model="name" label="Nazwa sklepu" />
              Ilość wyświetlanych ostatnich zakupów w sklepie {{ maxservices }}
              <v-slider
                v-model="maxservices"
                min="1"
                max="10"
              />
              {{ $t('monthly_goal') }} {{ goal }} zł
              <v-slider
                v-model="goal"
                min="1"
                max="500"
              />
              <v-switch v-model="webhook" class="mt-0" label="Webhook discordowy" />

              <v-text-field
                v-if="webhook"
                v-model="webhookUrl"
                :label="$t('webhook_url')"
                autocomplete="new-password"
                :rules="rules.webhook"
              />
              <v-btn v-if="webhook" color="indigo" rounded @click="testWebhook">
                Przetestuj webhooka
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" rounded text @click="save">
              {{ $t('save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="pt-1 mt-4 pb-4" elevation="10">
          <v-card-title class="headline">
            {{ $t('advanced_settings') }}
          </v-card-title>
          <v-card-text>
            <v-btn color="red" @click="removeDialog">
              {{ $t('remove_shop') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('are_you_sure') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            border="left"
            color="red"
            dark
          >
            {{ $t('if_not_read') }}
          </v-alert>
          {{ $t('after_shop_delete') }}
          <br>
          <div class="pt-2">
            {{ $t('write') }} <strong>{{ $route.params.shopid }}</strong> {{ $t('to_confirm') }}
            <v-text-field v-model="cdel" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" text rounded @click="dialog=false">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="red" :disabled="cdel===$route.params.shopid ? false : true" @click="remove()">
            {{ $t('remove_shop') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'ShopSettings',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      maxservices: this.shop.maxservices,
      valid: false,
      webhook: this.shop.webhook,
      webhookUrl: this.shop.webhook,
      cdel: '',
      goal: this.shop.goal,
      name: this.shop.name,
      dialog: false,
      rules: {
        webhook: [
          value => !!value || this.$t('field_not_empty'),
          v => /^https:\/\/discord(?:app)?\.com\/api\/webhooks\//.test(v) || this.$t('wrong_format')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('settings')
    }
  },
  methods: {
    save () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        this.$fire.database.ref().child(`shops/${shopid}`).update({
          name: this.name,
          goal: this.goal,
          webhook: this.webhook ? this.webhookUrl : '',
          maxservices: this.maxservices
        })
      }
    },
    removeDialog () {
      this.dialog = true
    },
    remove () {
      if (this.shop.servers) {
        let deleted = 0
        for (const serverId in this.shop.servers) {
          this.$fire.database.ref().child(`servers/${serverId}`).remove().then(() => {
            deleted++
            if (deleted === Object.keys(this.shop.servers).length) {
              this.removeShop()
            }
          })
        }
      } else {
        this.removeShop()
      }
    },
    removeShop () {
      const { shopid } = this.$route.params
      const { uid } = this.$fire.auth.currentUser
      this.$fire.database.ref().child(`shops/${shopid}`).remove().then(() => {
        this.$fire.database.ref().child(`users/${uid}/${shopid}`).remove()
      })
    },
    testWebhook () {
      this.$axios.post(this.webhookUrl, {
        content: this.$t('test_message')
      })
    }
  }
}
</script>
