<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card class="pt-1 pb-4" elevation="2">
        <v-card-title class="headline">
          {{ $t('titles.shop_appearance') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="fields.name"
            :label="$t('fields.shop_name')"
          />
          <v-switch
            v-model="switches.icon"
            class="mt-0"
            :label="$t('fields.shop_icon')"
          />
          <v-text-field
            v-if="switches.icon"
            v-model="fields.icon"
            :label="$t('fields.icon_url')"
            autocomplete="new-password"
            :rules="rules.icon_url"
          />
          <v-switch
            v-model="switches.background"
            class="mt-0"
            :label="$t('fields.shop_background')"
          />
          <v-text-field
            v-if="switches.background"
            v-model="fields.background"
            :label="$t('fields.shop_background_url')"
            autocomplete="new-password"
            :rules="rules.icon_url"
          />
          <v-switch
            v-model="switches.goal"
            class="mt-0"
            :label="$t('titles.monthly_goal')"
          />
          <v-text-field
            v-if="switches.goal"
            v-model="fields.goal"
            type="number"
            :label="`${$t('titles.monthly_goal')} (zł)`"
          />
          <v-switch
            v-model="switches.theme"
            class="mt-0"
            :label="$t('fields.shop_theme')"
          />
          <v-color-picker
            v-if="switches.theme"
            v-model="fields.theme"
            dot-size="17"
            hide-inputs
            mode="rgba"
            swatches-max-height="100"
          />

          <v-switch
            v-model="switches.webhook"
            class="mt-0"
            :label="$t('fields.discord_webhook')"
          />

          <v-text-field
            v-if="switches.webhook"
            v-model="fields.webhook"
            :label="$t('fields.webhook_url')"
            autocomplete="new-password"
            :rules="rules.webhook"
            append-icon="mdi-lan-connect"
            @click:append="testDiscordWebhook"
          />

          <v-switch
            v-model="switches.dsc"
            class="mt-0"
            :label="$t('fields.discord_widget')"
          />

          <v-text-field
            v-if="switches.dsc"
            v-model="fields.dsc"
            :label="$t('fields.discord_server_id')"
            autocomplete="new-password"
            :rules="rules.dsc_id"
          />

          {{ $t('fields.last_payments_amount') }} {{ fields.maxservices }}
          <v-slider
            v-model="fields.maxservices"
            min="1"
            max="60"
          />
          <v-select
            v-model="fields.last_payments_type"
            item-text="name"
            item-value="value"
            :items="last_payments_type_list"
            label="Widżet ostatnich zakupów"
          />
          <v-switch
            v-model="switches.gid"
            class="mt-0"
            :label="$t('fields.google_analytics')"
          />

          <v-text-field
            v-if="switches.gid"
            v-model="fields.gid"
            :label="$t('fields.gid')"
            autocomplete="new-password"
            :rules="rules.gid"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="save">
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
        <v-btn color="error" class="mb-2" @click="removeHistory">
          {{ $t('actions.remove_payment_history') }}
        </v-btn>
        <br>
        <v-btn color="error" class="mb-2" @click="dialog = true">
          {{ $t('actions.remove_shop') }}
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="550"
    >
      <v-card style="overflow:hidden;" outlined>
        <v-card-title class="text-h5">
          {{ $t('titles.are_you_sure') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            border="left"
            color="error"
            dark
            text
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
              <v-btn color="primary" text block @click="dialog=false">
                {{ $t('actions.cancel') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="error" :disabled="cdel===$route.params.shopid ? false : true" block @click="removeAll()">
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
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      switches: {
        icon: !!this.shop.icon,
        background: !!this.shop.background,
        goal: !!this.shop.goal,
        theme: !!this.shop.theme,
        webhook: !!this.shop.webhook,
        dsc: !!this.shop.dsc,
        gid: !!this.shop.gid
      },
      fields: {
        name: this.shop.name,
        gid: this.shop.gid,
        theme: this.shop.theme,
        goal: this.shop.goal,
        background: this.shop.background,
        dsc: this.shop.dsc,
        icon: this.shop.icon,
        webhook: this.config.webhook,
        maxservices: this.shop.maxservices,
        last_payments_type: this.shop.last_payments_type
      },
      last_payments_type_list: [
        { name: this.$t('fields.vertical_history'), value: 1 },
        { name: this.$t('fields.horizontal_history'), value: 2 }
      ],
      valid: false,
      cdel: '',
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
        ],
        gid: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.gid(v) || this.$t('formats.wrong_format_gid')
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
          name: this.fields.name,
          maxservices: this.fields.maxservices,
          last_payments_type: this.fields.last_payments_type,
          goal: this.switches.goal ? this.fields.goal : '',
          icon: this.switches.icon ? this.fields.icon : '',
          dsc: this.switches.dsc ? this.fields.dsc : '',
          background: this.switches.background ? this.fields.background : '',
          theme: this.switches.theme ? this.fields.theme : '',
          gid: this.switches.gid ? this.fields.gid : ''
        })
        this.$fire.database.ref().child(`config/${shopid}`).update({
          webhook: this.switches.webhook ? this.fields.webhook : ''
        })
      }
    },
    removeAll () {
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
    testDiscordWebhook () {
      this.$axios.post(this.fields.webhook, {
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
