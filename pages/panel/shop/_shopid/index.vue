<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ shop.name }}
    </h1>
    <BarChart :data="barChartData" :options="barChartOptions" :height="100" />
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
      barChartData: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      barChartOptions: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.dashboard')
    }
  }
}
</script>
