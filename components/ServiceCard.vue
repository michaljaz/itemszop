<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card :elevation="hover ? 15 : 5" height="100%">
        <center>
          <v-img :src="service.icon ? service.iconUrl : `/item.png`" max-height="120" contain />
        </center>
        <v-card-title class="justify-center text-no-wrap">
          {{ service.name }}
        </v-card-title>
        <v-divider class="mx-4" />
        <v-card-text>
          <center>
            <h1>{{ miniPrice }} zł</h1>
          </center>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="success" outlined @click="dialog=true;$emit('blur', true);initPaypal()">
            {{ $t('actions.buy_now') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="800"
    >
      <v-card elevation="2" outlined>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6" class="hidden-md-and-down my-auto py-8">
              <v-img :src="service.icon ? service.iconUrl : `/item.png`" max-height="150" contain class="mb-2" />
              <center>
                <div class="headline font-weight-bold">
                  {{ service.name }}
                </div>
              </center>
              <!-- eslint-disable vue/no-v-html -->
              <div
                style="max-height: 200px"
                class="mt-2 overflow-y-auto"
                v-html="service.description"
              />
              <!--eslint-enable-->
            </v-col>
            <v-col cols="12" lg="6">
              <v-card-title class="headline">
                <div class="hidden-lg-and-up">
                  <div class="d-inline-flex">
                    <v-img :src="service.icon ? service.iconUrl : `/item.png`" width="50" height="50" contain />
                    <span class="mt-3 ml-3">
                      {{ service.name }}
                    </span>
                  </div>
                </div>
                <v-spacer />
                <v-btn
                  icon
                  dark
                  @click="dialog=false;$emit('blur', false)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                >
                  <!-- eslint-disable vue/no-v-html -->
                  <div
                    style="max-height: 200px"
                    class="mt-2 overflow-y-auto hidden-lg-and-up"
                    v-html="service.description"
                  />
                  <!--eslint-enable-->
                  <v-text-field v-model="nick" :label="$t('fields.nick')" :rules="rules.nick" />
                  <v-radio-group v-model="type" :rules="rules.type">
                    <v-radio
                      v-if="service.microsms_sms && config.microsms"
                      :label="service.costslider ? `${$t('sms')}` : `${$t('sms')} (${smsCost[service.microsms_sms_type][1]} zł ${$t('misc.per_item')})`"
                      value="microsms_sms"
                    />
                    <v-radio
                      v-if="service.microsms_transfer && config.microsms"
                      :label="`${$t('transfer')} (${service.microsms_transfer_cost} zł ${$t('misc.per_item')})`"
                      value="microsms_transfer"
                    />
                    <v-radio
                      v-if="service.lvlup && config.lvlup"
                      :label="`${$t('transfer_psc')} (${service.lvlup_cost} zł ${$t('misc.per_item')})`"
                      value="lvlup"
                    />
                    <v-radio
                      v-if="service.paypal_p24 && config.paypal"
                      :label="`${$t('przelewy24')} (${service.paypal_p24_cost} zł ${$t('misc.per_item')})`"
                      value="paypal_p24"
                    />
                  </v-radio-group>
                  <div v-if="type && service.costslider">
                    <div v-if="(type == 'microsms_transfer' || type == 'lvlup')">
                      <i18n
                        path="misc.costslider_amount"
                      >
                        <template #amount>
                          {{ costslider }}
                        </template>
                      </i18n>
                      <v-slider

                        v-model="costslider"
                        :min="service.min_amount"
                        :max="service.max_amount"
                        thumb-label
                      />
                    </div>
                    <div v-else>
                      <i18n
                        path="misc.costslider_amount"
                      >
                        <template #amount>
                          {{ smsList[costslider_sms][1] }}
                        </template>
                      </i18n>
                      <v-slider
                        v-model="costslider_sms"
                        :min="0"
                        :max="smsList.length-1"
                        thumb-label
                      >
                        <template #thumb-label="{ value }">
                          {{ smsList[value][1] }}
                        </template>
                      </v-slider>
                    </div>
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col>
                    <span class="headline">
                      {{ $t('misc.price') }}: {{ price }}zł
                    </span>
                  </v-col>
                  <v-col>
                    <div
                      v-show="type==='paypal_p24' && valid"
                      :id="`p24-${service.serviceId}`"
                      style="width:100%"
                    />
                    <v-btn
                      v-show="type!=='paypal_p24' || !valid"
                      :disabled="!valid"
                      color="success"
                      block
                      :loading="loadingButton"
                      @click="next"
                    >
                      {{ $t('actions.next') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogSMS"
      persistent
      width="500"
    >
      <v-card elevation="2" outlined>
        <v-card-title class="headline">
          {{ service.name }}
          <v-spacer />
          <v-btn
            icon
            dark
            @click="dialogSMS = false;$emit('blur', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <center>
            <i18n
              path="misc.sms_send_instruction"
            >
              <template #netto>
                {{ smsCost[smsType][0] }}
              </template>
              <template #brutto>
                {{ smsCost[smsType][1] }}
              </template>
              <template #sms>
                <b>{{ config.microsms_sms_text }}</b>
              </template>
              <template #number>
                <b>{{ smsCost[smsType][2] }}</b>
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
            color="success"
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
    paypalLoaded: {
      type: Boolean,
      default: () => (false)
    },
    config: {
      type: Object,
      default: () => ({})
    },
    service: {
      type: Object,
      required: true
    },
    shopid: {
      type: String,
      default: () => ('')
    }
  },
  data () {
    return {
      p24: false,
      loadingButton: null,
      costslider_sms: 0,
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
        1: [1, 1.23, '71480'],
        2: [2, 2.46, '72480'],
        3: [3, 3.69, '73480'],
        4: [4, 4.92, '74480'],
        5: [5, 6.15, '75480'],
        6: [6, 7.38, '76480'],
        7: [9, 11.07, '79480'],
        8: [14, 17.22, '91400'],
        9: [19, 23.37, '91900'],
        10: [20, 24.60, '92022'],
        11: [25, 30.75, '92550']
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
  computed: {
    price () {
      if (this.type === 'microsms_transfer') {
        return this.service.microsms_transfer_cost * this.costslider
      } else if (this.type === 'lvlup') {
        return this.service.lvlup_cost * this.costslider
      } else if (this.type === 'microsms_sms') {
        if (this.service.costslider) {
          return this.smsCost[this.smsList[this.costslider_sms][0]][1]
        } else {
          return this.smsCost[this.service.microsms_sms_type][1]
        }
      } else if (this.type === 'paypal_p24') {
        return this.service.paypal_p24_cost * this.costslider
      } else {
        return 0
      }
    },
    miniPrice () {
      let price = Infinity
      if (this.config.microsms) {
        if (this.service.microsms_sms) {
          price = Math.min(price, this.smsCost[this.service.microsms_sms_type][1])
        }
        if (this.service.microsms_transfer) {
          price = Math.min(price, this.service.microsms_transfer_cost)
        }
      }
      if (this.config.lvlup && this.service.lvlup) {
        price = Math.min(price, this.service.lvlup_cost)
      }
      if (this.config.paypal && this.service.paypal_p24) {
        price = Math.min(price, this.service.paypal_p24_cost)
      }
      return price
    },
    smsList () {
      if (this.service.microsms_sms_list) {
        const l = this.service.microsms_sms_list.split('|')
        l.pop()
        const result = []
        for (const i in l) {
          const [type, amount] = l[i].split('=')
          result.push([parseFloat(type), parseFloat(amount)])
        }
        result.sort()
        return result
      } else {
        return []
      }
    },
    smsType () {
      if (this.service.microsms_sms) {
        if (this.service.costslider) {
          return this.smsList[this.costslider_sms][0]
        } else {
          return this.service.microsms_sms_type
        }
      } else {
        return 1
      }
    }
  },
  watch: {
    paypalLoaded () {
      console.log('paypal loaded')
    }
  },
  methods: {
    initPaypal () {
      if (!this.p24 && this.service.paypal_p24 && this.config.paypal) {
        setTimeout(() => {
          window.paypal.Buttons({
            fundingSource: window.paypal.FUNDING.P24,
            style: {
              label: 'pay'
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency: 'PLN',
                    value: (+(Math.round(this.service.paypal_p24_cost + 'e+2') + 'e-2')).toFixed(2)
                  }
                }]
              })
            },
            onApprove (data, actions) {
              // see #5. Capture the transaction
            },
            onCancel (data, actions) {
              console.log(`Order Canceled - ID: ${data.orderID}`)
            },
            onError (err) {
              console.error(err)
            }
          }).render(`#p24-${this.service.serviceId}`)
        }, 1000)
        this.p24 = true
      }
    },
    next () {
      this.$refs.form.validate()
      if (this.valid) {
        if (this.type === 'microsms_sms') {
          this.dialog = false
          this.dialogSMS = true
        } else {
          this.loadingButton = 'loading'
          this.redirectLink(this.type)
        }
      }
    },
    redirectLink (paymenttype) {
      const { nick, shopid } = this
      this.$axios.get('/payment_link', {
        params: {
          nick,
          shopid,
          serviceid: this.service.serviceId,
          amount: this.costslider,
          paymenttype
        }
      }).then(({ data }) => {
        this.loadingButton = null
        if (data.success) {
          window.top.location.href = data.data
        } else {
          this.snackbarMessage = this.$t(`responses.${data.error}`)
          this.snackbar = true
        }
      })
    },
    checkSMS () {
      this.$refs.form2.validate()
      if (this.valid2) {
        const { code, nick, shopid } = this
        this.$axios.get('/microsms_sms', {
          params: { smscode: code, nick, shopid, serviceid: this.service.serviceId }
        }).then(({ data }) => {
          if (data.success) {
            this.$emit('blur', false)
            if (this.$route.params.shopid) {
              this.$router.push(`/shop/${shopid}/payment_success`)
            } else {
              this.$router.push('/payment_success')
            }
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
