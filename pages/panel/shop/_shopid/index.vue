<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ shop.name }}
    </h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-alert
          border="top"
          colored-border
          type="info"
          elevation="2"
        >
          {{ $t('misc.shop_url') }} <a :href="url">{{ url }}</a>
        </v-alert>
        <v-textarea
          :label="$t('fields.shop_html')"
          filled
          :value="`<iframe style=&quot;z-index:99999999;border:0px;position:fixed;width:100%;height:100%;top:0px;left:0px;&quot; src=&quot;${url}&quot; />`"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-3">
          <v-card-title>
            <v-select
              v-model="selectedChart"
              :items="charts"
              item-text="name"
              item-value="id"
              solo
            />
          </v-card-title>
          <v-card-text>
            <PieChart :data="pieChartData" :options="pieChartOptions" :height="200" />
          </v-card-text>
          </v-card-text>
        </v-card>
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
      selectedChart: 1,
      charts: [
        { name: this.$t('titles.payment_methods'), id: 1 },
        { name: this.$t('titles.most_common_services'), id: 2 }
      ],
      url: `${document.location.origin}/shop/${this.$route.params.shopid}`,
      pieChartData: this.getData1(),
      pieChartOptions: {}
    }
  },
  head () {
    return {
      title: this.$t('titles.dashboard')
    }
  },
  watch: {
    selectedChart (newData, oldData) {
      if (newData === 1) {
        this.pieChartData = this.getData1()
      } else {
        this.pieChartData = this.getData2()
      }
    }
  },
  methods: {
    getData1 () {
      let countSms = 0
      let countPrzelew = 0
      const { history } = this.shop
      for (const i in history) {
        const { type } = history[i]
        if (type === 'sms') {
          countSms++
        } else if (type === 'przelew') {
          countPrzelew++
        }
      }
      const labels = []
      const data = []
      if (countSms > 0) {
        labels.push(this.$t('sms'))
        data.push(countSms)
      }
      if (countPrzelew > 0) {
        labels.push(this.$t('transfer'))
        data.push(countPrzelew)
      }

      return {
        labels,
        datasets: [{
          label: 'My First Dataset',
          data,
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
    },
    getData2 () {
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
        }
      }

      return {
        labels: Object.keys(countServices),
        datasets: [{
          label: 'My First Dataset',
          data: Object.values(countServices),
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
