<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card class="pt-1 pb-4" elevation="10">
        <v-card-title class="headline">
          {{ $t('titles.shop_appearance') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            :label="$t('fields.shop_name')"
          />
          <v-switch
            v-model="shop_icon"
            class="mt-0"
            :label="$t('fields.shop_icon')"
          />
          <v-text-field
            v-if="shop_icon"
            v-model="shop_icon_url"
            :label="$t('fields.icon_url')"
            autocomplete="new-password"
            :rules="rules.icon_url"
          />
          <v-switch
            v-model="shop_background"
            class="mt-0"
            :label="$t('fields.shop_background')"
          />
          <v-text-field
            v-if="shop_background"
            v-model="shop_background_url"
            :label="$t('fields.shop_background_url')"
            autocomplete="new-password"
            :rules="rules.icon_url"
          />
          <v-switch
            v-model="enable_goal"
            class="mt-0"
            :label="$t('titles.monthly_goal')"
          />
          <div v-if="enable_goal">
            {{ $t('titles.monthly_goal') }} {{ goal }} zł
            <v-slider
              v-model="goal"
              min="1"
              max="500"
            />
          </div>
          <v-switch
            v-model="enable_theme"
            class="mt-0"
            :label="$t('fields.shop_theme')"
          />
          <v-color-picker
            v-if="enable_theme"
            v-model="theme"
            dot-size="17"
            hide-inputs
            mode="rgba"
            swatches-max-height="100"
          />

          <v-switch
            v-model="webhook"
            class="mt-0"
            :label="$t('fields.discord_webhook')"
          />

          <v-text-field
            v-if="webhook"
            v-model="webhookUrl"
            :label="$t('fields.webhook_url')"
            autocomplete="new-password"
            :rules="rules.webhook"
            append-icon="mdi-lan-connect"
            @click:append="testWebhook"
          />

          <v-switch
            v-model="dsc"
            class="mt-0"
            :label="$t('fields.discord_widget')"
          />

          <v-text-field
            v-if="dsc"
            v-model="dsc_id"
            :label="$t('fields.discord_server_id')"
            autocomplete="new-password"
            :rules="rules.dsc_id"
          />
        </v-card-text>
        <v-card-title class="headline">
          {{ $t('titles.additional_settings') }}
        </v-card-title>
        <v-card-text>
          {{ $t('fields.last_payments_amount') }} {{ maxservices }}
          <v-slider
            v-model="maxservices"
            min="1"
            max="60"
          />
          <v-select
            v-model="last_payments_type"
            item-text="name"
            item-value="value"
            :items="last_payments_type_list"
            label="Widżet ostatnich zakupów"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" outlined @click="save">
            {{ $t('actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-card class="pt-1 mt-4 pb-4" elevation="10">
      <v-card-title class="headline">
        {{ $t('titles.advanced_settings') }}
      </v-card-title>
      <v-card-text>
        <v-btn color="red" outlined class="mb-2" @click="removeHistory">
          {{ $t('actions.remove_payment_history') }}
        </v-btn>
        <br>
        <v-btn color="red" outlined class="mb-2" @click="removeDialog">
          {{ $t('actions.remove_shop') }}
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="550"
    >
      <v-card style="overflow:hidden;" elevation="10">
        <v-card-title class="text-h5">
          {{ $t('titles.are_you_sure') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            border="left"
            color="red"
            dark
          >
            {{ $t('misc.if_not_read') }}
          </v-alert>
          {{ $t('misc.after_shop_delete') }}
          <br>
          <div class="pt-2">
            <i18n
              path="misc.type_shopid_to_confirm"
            >
              <template #shopid>
                <strong>{{ $route.params.shopid }}</strong>
              </template>
            </i18n>
            <v-text-field v-model="cdel" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn color="green" text block @click="dialog=false">
                {{ $t('actions.cancel') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="red" :disabled="cdel===$route.params.shopid ? false : true" block @click="remove()">
                {{ $t('actions.remove_shop') }}
              </v-btn>
            </v-col>
          </v-row>
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
      theme: this.shop.theme,
      enable_theme: this.shop.theme,
      enable_goal: this.shop.goal,
      shop_background: this.shop.background,
      shop_background_url: this.shop.background,
      dsc: this.shop.dsc_id,
      dsc_id: this.shop.dsc_id,
      shop_icon: this.shop.icon,
      shop_icon_url: this.shop.icon,
      last_payments_type: this.shop.last_payments_type,
      last_payments_type_list: [
        { name: this.$t('fields.vertical_history'), value: 1 },
        { name: this.$t('fields.horizontal_history'), value: 2 }
      ],
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
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.dsc_webhook_url(v) || this.$t('formats.wrong_format')
        ],
        icon_url: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_url(v) || this.$t('formats.wrong_format')
        ],
        dsc_id: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.digits(v) || this.$t('formats.wrong_format')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.settings')
    }
  },
  methods: {
    save () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        this.$fire.database.ref().child(`shops/${shopid}`).update({
          name: this.name,
          goal: this.enable_goal ? this.goal : '',
          webhook: this.webhook ? this.webhookUrl : '',
          maxservices: this.maxservices,
          last_payments_type: this.last_payments_type,
          icon: this.shop_icon ? this.shop_icon_url : '',
          dsc_id: this.dsc ? this.dsc_id : '',
          background: this.shop_background ? this.shop_background_url : '',
          theme: this.enable_theme ? this.theme : ''
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
        content: this.$t('misc.test_message')
      })
    },
    removeHistory () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}/history`).remove()
    }
  }
}
</script>
