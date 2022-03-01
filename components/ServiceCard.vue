<template>
  <div>
    <v-card elevation="5" height="100%">
      <center>
        <template v-if="service.icon">
          <v-img :src="service.iconUrl" max-height="120" contain />
        </template>
        <template v-else>
          <v-img src="/item.png" max-height="120" contain />
        </template>
      </center>
      <v-card-text>
        <div v-if="payments.microsms" class="d-flex justify-center mb-1">
          {{ $t('sms') }}
          <v-spacer />
          <span v-if="service.microsms_sms">
            {{ smsCost[service.microsms_sms_type][1] }} zł
          </span>
          <span v-else>
            X
          </span>
        </div>
        <div v-if="payments.microsms" class="d-flex justify-center mb-1">
          {{ $t('transfer') }}
          <v-spacer />
          <template v-if="service.microsms_transfer">
            {{ service.microsms_transfer_cost }} zł
          </template>
          <template v-else>
            X
          </template>
        </div>
        <div v-if="payments.lvlup" class="d-flex justify-center mb-1">
          {{ $t('transfer_psc') }}
          <v-spacer />
          <template v-if="service.lvlup">
            {{ service.lvlup_cost }} zł
          </template>
          <template v-else>
            X
          </template>
        </div>
      </v-card-text>
      <v-divider class="mx-4" />
      <v-card-title class="justify-center">
        {{ service.name }}
      </v-card-title>
      <v-card-actions v-if="link">
        <v-btn
          color="info"
          large
          outlined
          block
          :to="link"
        >
          {{ $t('actions.description') }}
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-dialog
          v-model="dialog"
          persistent
          width="500"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="!((payments.microsms && (service.microsms_sms || service.microsms_transfer)) || (service.lvlup && payments.lvlup))"
              color="green"
              large
              outlined
              block
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('actions.buy') }}
            </v-btn>
          </template>

          <v-card elevation="5" outlined>
            <v-card-title class="headline">
              {{ service.name }}
            </v-card-title>

            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
              >
                <v-radio-group v-model="type" :rules="rules.type">
                  <v-radio
                    v-if="service.microsms_sms && payments.microsms"
                    :label="`${$t('sms')} (${smsCost[service.microsms_sms_type][1]} zł)`"
                    value="microsms_sms"
                  />
                  <v-radio
                    v-if="service.microsms_transfer && payments.microsms"
                    :label="`${$t('transfer')} (${service.microsms_transfer_cost} zł)`"
                    value="microsms_transfer"
                  />
                  <v-radio
                    v-if="service.lvlup && payments.lvlup"
                    :label="`${$t('transfer_psc')} (${service.lvlup_cost} zł)`"
                    value="lvlup"
                  />
                </v-radio-group>
                <v-text-field v-model="nick" :label="$t('fields.nick')" :rules="rules.nick" />
                <v-checkbox
                  v-model="buy_more"
                  :label="$t('fields.buy_more_once')"
                />
                <i18n
                  v-if="buy_more"
                  path="misc.costslider_amount"
                >
                  <template #amount>
                    {{ costslider }}
                  </template>
                </i18n>
                <v-slider
                  v-if="buy_more"
                  v-model="costslider"
                  hint="Im a hint"
                  min="1"
                  max="50"
                  thumb-label
                />
              </v-form>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green"
                text
                @click="dialog=false"
              >
                {{ $t('actions.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="next"
              >
                {{ $t('actions.next') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="dialogSMS"
      persistent
      width="500"
    >
      <v-card elevation="5" outlined>
        <v-card-title class="headline">
          {{ service.name }}
        </v-card-title>

        <v-card-text>
          <center>
            <i18n
              path="misc.sms_send_instruction"
            >
              <template #netto>
                {{ smsCost[service.microsms_sms_type][0] }}
              </template>
              <template #brutto>
                {{ smsCost[service.microsms_sms_type][1] }}
              </template>
              <template #sms>
                <b>{{ payments.microsms_sms_text }}</b>
              </template>
              <template #number>
                <b>{{ smsCost[service.microsms_sms_type][2] }}</b>
              </template>
              <template #br>
              </br>
              </template>
            </i18n>
          </center>
          <v-form
            ref="form2"
            v-model="valid2"
          >
            <v-text-field v-model="code" label="Wpisz kod z sms'a" :rules="rules.code" />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialogSMS=false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="green"
            text
            @click="checkSMS"
          >
            {{ $t('actions.next') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarMessage }}
      <template #action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $t('actions.cancel') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'ServiceCard',
  props: {
    payments: {
      type: Object,
      default: () => ({})
    },
    service: {
      type: Object,
      required: true
    },
    link: {
      type: String,
      default: () => ('')
    },
    shopid: {
      type: String,
      default: () => ('')
    }
  },
  data () {
    return {
      costslider: 1,
      buy_more: false,
      snackbar: false,
      snackbarMessage: '',
      code: '',
      dialogSMS: false,
      valid2: false,
      valid: false,
      nick: '',
      type: '',
      dialog: false,
      smsCost: {
        0: ['', '', ''],
        1: ['1', '1.23', '71480'],
        2: ['2', '2.46', '72480'],
        3: ['3', '3.69', '73480'],
        4: ['4', '4.92', '74480'],
        5: ['5', '6.15', '75480'],
        6: ['6', '7.38', '76480'],
        7: ['9', '11.07', '79480'],
        8: ['14', '17.22', '91400'],
        9: ['19', '23.37', '91900'],
        10: ['20', '24.60', '92022'],
        11: ['25', '30.75', '92550']
      },
      rules: {
        type: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        nick: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.nick(v) || this.$t('formats.wrong_format')
        ],
        code: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.sms_code(v) || this.$t('formats.wrong_format')
        ]
      }
    }
  },
  methods: {
    next () {
      this.$refs.form.validate()
      if (this.valid) {
        if (this.type === 'microsms_transfer') {
          this.buyMicrosmsTransfer()
        } else if (this.type === 'lvlup') {
          this.buyLvlup()
        } else {
          this.buyMicrosmsSms()
        }
      }
    },
    buyLvlup () {
      const { nick, shopid } = this
      this.$axios.get('/lvlup', {
        params: { nick, shopid, serviceid: this.service.serviceId }
      }).then(({ data }) => {
        if (data.success) {
          window.top.location.href = data.data
        } else {
          console.log(data.error)
        }
      })
    },
    buyMicrosmsTransfer () {
      const { nick, shopid } = this
      this.$axios.get('/microsms_transfer', {
        params: { nick, shopid, serviceid: this.service.serviceId }
      }).then(({ data }) => {
        if (data.success) {
          window.top.location.href = data.data
        } else {
          console.log(data.error)
        }
      })
    },
    buyMicrosmsSms () {
      this.dialog = false
      this.dialogSMS = true
    },
    checkSMS () {
      this.$refs.form2.validate()
      if (this.valid2) {
        const { code, nick, shopid } = this
        this.$axios.get('/microsms_sms', {
          params: { code, nick, shopid, serviceid: this.service.serviceId }
        }).then(({ data }) => {
          if (data.success) {
            this.$router.push(`/shop/${shopid}/payment_success`)
          } else {
            this.snackbarMessage = this.$t(`responses.${data.error}`)
            this.snackbar = true
          }
        })
      }
    }
  }
}
</script>
