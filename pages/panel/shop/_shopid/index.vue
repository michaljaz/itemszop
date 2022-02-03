<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ shop.name }}
    </h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-3">
          <v-card-title>
            {{ $t('titles.payment_methods') }}
          </v-card-title>
          <v-card-text>
            <PieChart :data="pieChartData" :options="pieChartOptions" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-3">
          <v-card-title>
            {{ $t('titles.most_common_services') }}
          </v-card-title>
          <v-card-text>
            <PieChart :data="pieChartData2" :options="pieChartOptions2" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-alert
      border="top"
      colored-border
      type="info"
      elevation="2"
    >
      {{ $t('misc.shop_url') }} <a :href="url">{{ url }}</a>
    </v-alert>
    <v-row>
      <v-col cols="12" md="6">
        <v-textarea
          :label="$t('fields.shop_html')"
          filled
          :value="`<iframe style=&quot;z-index:99999999;border:0px;position:fixed;width:100%;height:100%;top:0px;left:0px;&quot; src=&quot;${url}&quot; />`"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>

export default {
  name: 'ShopIndex',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      url: `${document.location.origin}/shop/${this.$route.params.shopid}`,
      pieChartData: this.getData1(),
      pieChartOptions: {},
      pieChartData2: this.getData2(),
      pieChartOptions2: {}
    }
  },
  head () {
    return {
      title: this.$t('titles.dashboard')
    }
  },
  methods: {
    getData1 () {
      let countSms = 0
      let countPrzelew = 0
      let countOthers = 0
      const { history } = this.shop
      for (const i in history) {
        const { type } = history[i]
        if (type === 'sms') {
          countSms++
        } else if (type === 'przelew') {
          countPrzelew++
        } else {
          countOthers++
        }
      }
      return {
        labels: [
          this.$t('sms'),
          this.$t('transfer'),
          this.$t('misc.other')
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [countSms, countPrzelew, countOthers],
          backgroundColor: [
            '#52b69a',
            '#76c893',
            '#99d98c',
            '#b5e48c',
            '#d9ed92'
          ],
          borderColor: 'rgba(0,0,0,0)',
          hoverOffset: 4
        }]
      }
    },
    getData2 () {
      let other = 0
      const countServices = {}
      const { history } = this.shop
      for (const i in history) {
        let { serviceid } = history[i]
        if (serviceid) {
          serviceid = this.shop.services[serviceid].name
          if (countServices[serviceid]) {
            countServices[serviceid]++
          } else {
            countServices[serviceid] = 1
          }
        } else {
          other++
        }
      }
      console.log(countServices, other)

      return {
        labels: [...Object.keys(countServices), this.$t('misc.other')],
        datasets: [{
          label: 'My First Dataset',
          data: [...Object.values(countServices), other],
          backgroundColor: [
            '#005f73',
            '#0a9396',
            '#94d2bd',
            '#e9d8a6',
            '#ee9b00',
            '#ca6702',
            '#bb3e03'
          ],
          borderColor: 'rgba(0,0,0,0)',
          hoverOffset: 4
        }]
      }
    }
  }
}
</script>
