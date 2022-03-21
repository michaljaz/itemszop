<template>
  <div>
    <v-card elevation="5" height="100%" @click="dialog=true">
      <center>
        <v-img :src="service.icon ? service.iconUrl : `/item.png`" max-height="120" contain />
      </center>
      <v-card-text>
        <div v-if="config.microsms" class="d-flex justify-center mb-1">
          {{ $t('sms') }}
          <v-spacer />
          <span v-if="service.microsms_sms">
            {{ smsCost[service.microsms_sms_type][1] }} zł
          </span>
          <span v-else>
            X
          </span>
        </div>
        <div v-if="config.microsms" class="d-flex justify-center mb-1">
          {{ $t('transfer') }}
          <v-spacer />
          <template v-if="service.microsms_transfer">
            {{ service.microsms_transfer_cost }} zł
          </template>
          <template v-else>
            X
          </template>
        </div>
        <div v-if="config.lvlup" class="d-flex justify-center mb-1">
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
      <v-card-title class="justify-center text-no-wrap">
        {{ service.name }}
      </v-card-title>
    </v-card>
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
                  @click="dialog = false"
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
                <span class="headline">
                  {{ $t('misc.price') }}: {{ price }}zł
                </span>
                <v-spacer />
                <v-btn
                  color="success"
                  :loading="loadingButton"
                  @click="next"
                >
                  {{ $t('actions.next') }}
                </v-btn>
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
            @click="dialogSMS = false"
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
      } else {
        return 0
      }
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
      if (this.service.costslider) {
        return this.smsList[this.costslider_sms][0]
      } else {
        return this.service.microsms_sms_type
      }
    }
  },
  methods: {
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
    redirectLink (path) {
      const { nick, shopid } = this
      this.$axios.get(`/${path}`, {
        params: {
          nick,
          shopid,
          serviceid: this.service.serviceId,
          amount: this.costslider
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
