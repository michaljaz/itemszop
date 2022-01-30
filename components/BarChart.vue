<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['data', 'options'],
  mounted () {
    console.log(this.renderChart)
    this.renderChart(this.data, this.options)
  }
}
</script>
