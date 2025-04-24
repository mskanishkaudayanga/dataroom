<script>
import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    chartData: Array,
    chartOptions: Object,
    colors: {
      type: Array,
      default: () => ['#FF9F40', '#9966FF', '#FF6384', '#FFCD56', '#36A2EB', '#4BC0C0'],
    },
  },
  setup(props) {
    const pieChart = ref(null);
    const chartLegend = ref([]);
    const showPercentages = ref(false);
    const loading = ref(true);

    const loadGoogleCharts = () => {
      return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.charts) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = 'https://www.gstatic.com/charts/loader.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        }
      });
    };

    const drawChart = () => {
      if (typeof google !== 'undefined' && google.visualization) {
        const data = google.visualization.arrayToDataTable(props.chartData);
        const chart = new google.visualization.PieChart(pieChart.value);

        const options = {
          ...props.chartOptions,
          colors: props.colors,
          backgroundColor: "transparent",
          pieHole: 0.5,
          width: 257,
          height: 257,
          chartArea: {
            width: "90%",
            height: "90%",
          },
          pieSliceText: showPercentages.value ? 'percentage' : 'value', // Show percentage or value
          pieSliceTextStyle: {
            fontSize: 12,
            color: '#FFFFFF',
            fontName: 'Montserrat',
            fontWeight: 500,
          },
        };

        chart.draw(data, options);

        const rows = props.chartData.slice(1);
        const totalValue = rows.reduce((sum, row) => sum + row[1], 0);

        chartLegend.value = rows.map(([label, value]) => {
          const percentage = ((value / totalValue) * 100).toFixed(2);
          return {
            label,
            value,
            percentage,
          };
        });


        loading.value = false;
      }
    };

    // Load Google Charts
    onMounted(async () => {
      try {
        await loadGoogleCharts();
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
      } catch (error) {
        console.error('Failed to load Google Charts', error);
      }
    });

    watch(showPercentages, drawChart);
    watch(() => props.chartData, drawChart);

    return {
      pieChart,
      chartLegend,
      showPercentages,
      loading,
    };
  },
};
</script>

<template>
  <div>
    <div class="switch-container">
      <span class="switch-label-left" :class="showPercentages ? 'inactive' : 'active'">Anzahl</span>
      <label class="switch">
        <input type="checkbox" v-model="showPercentages" />
        <span class="slider"></span>
      </label>
      <span class="switch-label-right" :class="showPercentages ? 'active' : 'inactive'">Prozentsatz</span>
    </div>

    <div class="chart-container" ref="pieChart" v-show="!loading"></div>

    <!-- Loading animation -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Laden von Daten...</p>
    </div>

    <div class="legend-container" v-if="!loading">
      <table class="legend-table">
        <tbody>
          <tr v-for="(item, index) in chartLegend" :key="index" class="legend-item">
            <td>
              <span class="legend-color" :style="{ backgroundColor: colors[index] }"></span>
              <span class="legend-label">{{ item.label }}</span>
            </td>
            <td class="legend-value">
              {{ showPercentages ? item.percentage + '%' : item.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.switch-container {
  position: absolute;
  top: -24px;
  right: 24px;
  display: flex;
  align-items: center;
}



.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin: 0 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #36A2EB;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: white;
  transition: .4s;
  top: 2px;
  left: 2px;
}

input:checked+.slider {
  background-color: #2196F3;
}

input:checked+.slider:before {
  transform: translateX(24px);
}

.switch-label-left,
.switch-label-right {
  font-size: 12px;
  transition: color 0.4s;
}

.switch-label-left.active,
.switch-label-right.active {
  color: #2196F3;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 12px;
}

.switch-label-left.inactive,
.switch-label-right.inactive {
  color: #b3b3b3;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 12px;
}


.chart-container {
  margin-top: 12px;
  margin-left: 40px;
  position: absolute;
}

.legend-container {
  position: absolute;
  top: 30px;
  right: 32px;
  display: flex;
  align-items: center;
}

.legend-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

.legend-table th {
  text-align: left;
  padding: 8px;
  font-size: 12px;
  color: #262A33;
  font-weight: 600;
  font-family: Arial, sans-serif;
  align-content: center;
}

.legend-table td {
  padding: 5px 10px;
  font-size: 12px;
  color: #908E8E;
  line-height: 1.5;
}

.legend-item td {
  width: 150px;
  padding: 4px;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  border-radius: 2px;
  vertical-align: middle;
}

.legend-label {
  vertical-align: middle;
  font-size: 12px;
  color: #908E8E;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  white-space: nowrap;
  /* Ensure the text stays on a single line */
}

.legend-value {
  text-align: center;
  /* Center the values */
  color: #908E8E;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  width: 100px;
  /* Add width to control the layout */
}

.legend-item td {
  width: 150px;
  /* Set a fixed width for the label column */
}

.legend-item .legend-value {
  width: auto;
  /* Ensure the value cell doesn't stretch too wide */
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 222.22px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #555;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
