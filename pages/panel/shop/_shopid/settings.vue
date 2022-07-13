<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ $t('titles.settings') }}
      <v-btn color="primary" class="float-right" large :loading="loadingButton" @click="save">
        {{ $t('actions.save') }}
      </v-btn>
    </h1>
    <v-select
      v-model="properties"
      item-text="name"
      item-value="value"
      label="Używane moduły"
      multiple
      :items="properties_items"
      chips
    />
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row v-if="properties">
        <v-col cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.shop_name') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.name"
                :label="$t('fields.shop_name')"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('icon')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.shop_icon') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.icon"
                :label="$t('fields.icon_url')"
                autocomplete="new-password"
                :rules="rules.icon_url"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('background')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.shop_background') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.background"
                :label="$t('fields.shop_background_url')"
                autocomplete="new-password"
                :rules="rules.icon_url"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('goal')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('titles.monthly_goal') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.goal"
                :rules="rules.goal"
                type="number"
                :label="`${$t('titles.monthly_goal')} (zł)`"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('theme')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.shop_theme') }}
            </v-card-title>
            <v-card-text>
              <v-color-picker
                v-model="fields.theme"
                dot-size="17"
                hide-inputs
                mode="rgba"
                swatches-max-height="100"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('webhook')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.discord_webhook') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.webhook"
                :label="$t('fields.webhook_url')"
                autocomplete="new-password"
                :rules="rules.webhook"
                append-icon="mdi-lan-connect"
                @click:append="testDiscordWebhook"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('dsc')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.discord_widget') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.dsc"
                :label="$t('fields.discord_server_id')"
                autocomplete="new-password"
                :rules="rules.dsc_id"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('hist')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              Ostatnie zakupy w sklepie
            </v-card-title>
            <v-card-text>
              {{ $t('fields.last_payments_amount') }} {{ fields.hist.max }}
              <v-slider
                v-model="fields.hist.max"
                min="1"
                max="60"
              />
              <v-select
                v-model="fields.hist.type"
                item-text="name"
                item-value="value"
                :items="last_payments_type_list"
                label="Widżet ostatnich zakupów"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="properties.includes('gid')" cols="12" md="4" sm="6">
          <v-card>
            <v-card-title>
              {{ $t('fields.google_analytics') }}
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fields.gid"
                :label="$t('fields.gid')"
                autocomplete="new-password"
                :rules="rules.gid"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <h1 class="display-1 mt-3 mb-5">
      {{ $t('titles.advanced_settings') }}
    </h1>

    <v-btn color="error" outlined class="mb-3" block @click="removeHistory">
      {{ $t('actions.remove_payment_history') }}
    </v-btn>
    <v-btn color="error" outlined block @click="dialog = true">
      {{ $t('actions.remove_shop') }}
    </v-btn>
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
              <v-btn color="error" :disabled="cdel===$route.params.shopid ? false : true" block @click="removeShop()">
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
      loadingButton: false,
      properties: [],
      properties_items: [
        { name: this.$t('fields.shop_icon'), value: 'icon' },
        { name: this.$t('fields.shop_background'), value: 'background' },
        { name: 'Ostatnie zakupy w sklepie', value: 'hist' },
        { name: this.$t('titles.monthly_goal'), value: 'goal' },
        { name: this.$t('fields.shop_theme'), value: 'theme' },
        { name: this.$t('fields.discord_webhook'), value: 'webhook' },
        { name: this.$t('fields.discord_widget'), value: 'dsc' },
        { name: this.$t('fields.google_analytics'), value: 'gid' }
      ],
      fields: {
        name: this.shop.name,
        gid: this.shop.gid,
        theme: this.shop.theme,
        goal: this.shop.goal,
        background: this.shop.background,
        dsc: this.shop.dsc,
        icon: this.shop.icon,
        webhook: this.config.webhook,
        hist: {
          max: this.shop.hist ? this.shop.hist.max : 1,
          type: this.shop.hist ? this.shop.hist.type : 1
        }
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
        ],
        goal: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.is_natural_number(v) || this.$t('formats.wrong_format')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.settings')
    }
  },
  mounted () {
    for (const i in this.properties_items) {
      const { value } = this.properties_items[i]
      if (this.shop[value]) {
        this.properties.push(value)
      }
    }
  },
  methods: {
    async save () {
      this.loadingButton = true
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        await this.$fire.database.ref().child(`shops/${shopid}`).update({
          name: this.fields.name,
          hist: this.properties.includes('hist') ? this.fields.hist : '',
          goal: this.properties.includes('goal') ? this.fields.goal : '',
          icon: this.properties.includes('icon') ? this.fields.icon : '',
          dsc: this.properties.includes('dsc') ? this.fields.dsc : '',
          background: this.properties.includes('background') ? this.fields.background : '',
          theme: this.properties.includes('theme') ? this.fields.theme : '',
          gid: this.properties.includes('gid') ? this.fields.gid : ''
        })
        await this.$fire.database.ref().child(`config/${shopid}`).update({
          webhook: this.properties.includes('webhook') ? this.fields.webhook : ''
        })
        this.loadingButton = false
      }
    },
    removeShop () {
      const { shopid } = this.$route.params
      const { uid } = this.$fire.auth.currentUser
      const { servers } = this.shop
      if (servers) {
        for (const serverId in servers) {
          this.$fire.database.ref().child(`servers/${serverId}`).remove()
        }
      }
      this.$fire.database.ref().child(`shops/${shopid}`).remove()
      this.$fire.database.ref().child(`users/${uid}/${shopid}`).remove()
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
