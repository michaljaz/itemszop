<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['data', 'options'],
  watch: {
    data () {
      console.log('xd')
      this._chart.destroy()
      this.renderPieChart()
    }
  },
  mounted () {
    this.renderPieChart()
  },
  methods: {
    renderPieChart () {
      this.renderChart(this.data, this.options)
    }
  }
}
</script>
