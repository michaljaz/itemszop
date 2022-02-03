<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ shop.name }}
    </h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-3">
          <v-card-title>
            Metody płatności
          </v-card-title>
          <v-card-text>
            <PieChart :data="pieChartData" :options="pieChartOptions" :height="200" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-3">
          <v-card-title>
            Ostatnie zakupy
          </v-card-title>
          <v-card-text />
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
      pieChartData: {
        labels: [
          'SMS',
          'Przelew',
          'Inne'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: this.getData(),
          backgroundColor: [
            '#ff3333',
            '#1976d2',
            'rgb(255, 205, 86)'
          ],
          borderColor: 'rgba(0,0,0,0)',
          hoverOffset: 4
        }]
      },
      pieChartOptions: {}
    }
  },
  head () {
    return {
      title: this.$t('titles.dashboard')
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
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
      return [countSms, countPrzelew, countOthers]
    }
  }
}
</script>
