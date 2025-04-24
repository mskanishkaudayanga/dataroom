<script>
import Chart from 'chart.js/auto';

export default {
  name: "BarChart",
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
    legendLabel: {
      type: String,
      default: 'Legend',
    },
    indexAxis: {
      type: String,
      default: 'y',
    }
  },
  data() {
    return {
      uniqueId: this.makeid(20),
    }
  },
  methods: {
    renderGraph() {
      const ctx = document.getElementById('bar-chart-'+this.uniqueId);

      let datasets = [{
        label: this.legendLabel,
        data: this.data,
        borderWidth: 1,
      }];

      if ( !this.isEmpty(this.colors) ) {
        datasets[0]['backgroundColor'] = this.colors
      }

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: datasets
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          indexAxis: this.indexAxis,
        },
      });
    }
  },
  mounted() {
    this.renderGraph();
  }
}
</script>

<template>

  <div class="bar-chart">
    <div class="title">
      <slot></slot>
    </div>
    <canvas :id="'bar-chart-'+this.uniqueId"></canvas>
  </div>

</template>

<style scoped>

.title {
  font-size:20px;
  text-align: center;
  color: var(--dark-gray);
}

</style>
