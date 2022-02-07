<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  watch: {
    data () {
      this.$data._chart.destroy()
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
