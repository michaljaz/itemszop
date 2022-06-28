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
      max-width="900"
    >
      <v-stepper v-model="e1">
        <v-stepper-header class="elevation-0">
          <div class="headline font-weight-bold mt-5 ml-4">
            {{ service.name }}
          </div>
          <v-btn
            class="float-right mt-5 mr-4"
            icon
            dark
            @click="dialog=false;$emit('blur', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-stepper-header>
        <v-stepper-header class="elevation-0">
          <v-stepper-step
            :complete="e1 > 1"
            step="1"
          >
            {{ $t('titles.buy_service_1') }}
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="e1 > 2"
            step="2"
          >
            {{ $t('titles.buy_service_2') }}
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="e1 > 3"
            step="3"
          >
            {{ $t('titles.buy_service_3') }}
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="4">
            {{ $t('titles.buy_service_4') }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <center>
              <v-img :src="service.icon ? service.iconUrl : `/item.png`" max-height="150" contain class="mb-2" />
              <div class="headline font-weight-bold">
                {{ service.name }}
              </div>
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="mt-2 mx-auto mb-3"
                v-html="service.description"
              />
              <!--eslint-enable-->
              <span class="float-right mt-10">
                <v-btn text @click="dialog=false;$emit('blur', false)">
                  {{ $t('actions.cancel') }}
                </v-btn>
                <v-btn
                  color="success"
                  @click="e1 = 2"
                >
                  {{ $t('actions.next') }}
                </v-btn>
              </span>
            </center>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="ma-2">
              <v-form
                ref="form"
                v-model="valid"
              >
                <v-text-field v-model="nick" :label="$t('fields.nick')" :rules="rules.nick" />

                <v-radio-group v-model="type" :rules="rules.type">
                  <template #label>
                    {{ $t('fields.choose_payment_method') }}
                  </template>
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
                  <div v-if="type == 'microsms_transfer' || type == 'lvlup' || type=='paypal_p24'">
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
                <span class="headline">
                  {{ $t('misc.price') }}: {{ price }}zł
                </span>
                <span class="float-right">
                  <v-btn text @click="e1 = 1">
                    {{ $t('actions.go_back') }}
                  </v-btn>
                  <v-btn
                    :disabled="!valid"
                    color="success"
                    @click="e1=3"
                  >
                    {{ $t('actions.next') }}
                  </v-btn>
                </span>
              </v-form>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-simple-table
              class="mb-3"
              tile
              style="background:#505050;"
            >
              <template #default>
                <tbody>
                  <tr>
                    <td>
                      Nick na serwerze
                    </td>
                    <td>
                      {{ nick }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Ilość produktów
                    </td>
                    <td>
                      <template v-if="service.costslider">
                        <template v-if="type==='microsms_sms'">
                          {{ smsList[costslider_sms][1] }}
                        </template>
                        <template v-else>
                          {{ costslider }}
                        </template>
                      </template>
                      <template v-else>
                        1
                      </template>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Kwota
                    </td>
                    <td>
                      {{ price }} zł
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Sposób płatności
                    </td>
                    <td>
                      <template v-if="type==='microsms_sms'">
                        {{ $t('sms') }}
                      </template>
                      <template v-else-if="type==='paypal_p24'">
                        {{ $t('przelewy24') }}
                      </template>
                      <template v-else-if="type==='microsms_transfer'">
                        {{ $t('transfer') }}
                      </template>
                      <template v-else-if="type==='lvlup'">
                        {{ $t('transfer_psc') }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <span class="float-right">
              <v-btn text @click="e1 = 2">
                {{ $t('actions.go_back') }}
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="success"
                @click="e1=4;initPaypal()"
              >
                {{ $t('actions.next') }}
              </v-btn>
            </span>
          </v-stepper-content>

          <v-stepper-content step="4">
            <div class="ma-2">
              <div v-if="type=='microsms_sms'">
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
                <span class="float-right">
                  <v-btn text @click="e1 = 3">
                    {{ $t('actions.go_back') }}
                  </v-btn>
                  <v-btn
                    :disabled="!valid2"
                    color="success"
                    @click="checkSMS"
                  >
                    {{ $t('actions.next') }}
                  </v-btn>
                </span>
              </div>
              <div v-else-if="type=='microsms_transfer' || type=='lvlup'">
                <h1 class="h1 mb-5">
                  {{ $t('misc.click_to_pay_by_link') }}
                </h1>
                <span class="float-right">
                  <v-btn text @click="e1 = 3">
                    {{ $t('actions.go_back') }}
                  </v-btn>
                  <v-btn
                    color="success"
                    :loading="loadingButton"
                    @click="next"
                  >
                    {{ $t('actions.next') }}
                  </v-btn>
                </span>
              </div>
              <div v-else-if="type=='paypal_p24'">
                <div id="p24_container" />
                <span class="float-right">
                  <v-btn text @click="e1 = 3">
                    {{ $t('actions.go_back') }}
                  </v-btn>
                </span>
              </div>
              <div v-else>
                <span class="float-right">
                  <v-btn text @click="e1 = 3">
                    {{ $t('actions.go_back') }}
                  </v-btn>
                </span>
              </div>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>
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
      e1: 1,
      p24: false,
      loadingButton: null,
      costslider_sms: 0,
      costslider: 1,
      buy_more: false,
      snackbar: false,
      snackbarMessage: '',
      code: '',
      valid2: false,
      valid: false,
      nick: localStorage.getItem('nick'),
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
        result.sort((a, b) => a - b)
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
    nick () {
      localStorage.setItem('nick', this.nick)
    }
  },
  methods: {
    initPaypal () {
      if (this.type === 'paypal_p24') {
        document.querySelector('#p24_container').innerHTML = ''
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
                  value: (+(Math.round(this.price + 'e+2') + 'e-2')).toFixed(2)
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
        }).render('#p24_container')
      }
    },
    next () {
      this.$refs.form.validate()
      if (this.valid) {
        this.loadingButton = 'loading'
        this.redirectLink(this.type)
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
          params: {
            smscode: code,
            nick,
            shopid,
            serviceid: this.service.serviceId,
            amount: this.costslider_sms + 1
          }
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
