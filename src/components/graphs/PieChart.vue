<script>
import Chart from 'chart.js/auto';

export default {
  name: "PieChart",
  props: {
    labels: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    colors: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      uniqueId: this.makeid(20),
    }
  },
  methods: {
    renderGraph() {
      const ctx = document.getElementById('pie-chart-'+this.uniqueId);

      let datasets = [{
        data: this.data,
        hoverOffset: 4
      }];

      if ( !this.isEmpty(this.colors) ) {
        datasets[0]['backgroundColor'] = this.colors
      }

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.labels,
          datasets: datasets
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  mounted() {
    this.renderGraph();
  }
}
</script>

<template>

  <div class="pie-chart">
    <div class="title">
      <slot></slot>
    </div>
    <canvas :id="'pie-chart-'+this.uniqueId"></canvas>
  </div>

</template>

<style scoped>

.title {
  font-size:20px;
  text-align: center;
  color: var(--dark-gray);
}

</style>
