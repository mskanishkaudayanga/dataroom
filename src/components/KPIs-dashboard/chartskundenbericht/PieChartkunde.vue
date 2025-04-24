<script>
import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    chartData: Array,
    chartOptions: Object,
    colors: {
      type: Array,
      default: () => ['#FF6384', '#36A2EB', '#FF9F40'],
    },
  },
  setup(props) {
    const pieChart = ref(null);
    const chartLegend = ref([]);
    const showPercentages = ref(false); // Toggle state for showing percentages
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
          backgroundColor: 'transparent',
          width: 257,
          height: 257,
          chartArea: {
            left: '5%',
            top: '5%',
            width: '90%',
            height: '90%',
          },
          pieSliceText: 'value',
          pieSliceText: showPercentages.value ? 'percentage' : 'value',
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


        chartLegend.value = rows
          .map(([label, value]) => {
            const percentage = ((value / totalValue) * 100).toFixed(2);
            return {
              label,
              value,
              percentage,
            };
          })
        // .sort((a, b) => b.value - a.value); // Sort in discending order by value
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
    // Redraw chart when chartData changes
    watch(() => props.chartData, drawChart);

    return {
      pieChart,
      chartLegend,
      showPercentages,
      loading
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

    <div class="chart-legend-container">
      <div class="chart-container" ref="pieChart" v-show="!loading"></div>

      <!-- Loading animation -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Laden von Daten...</p>
      </div>
      <div class="legend-container">
        <table>
          <tbody>
            <tr v-for="(item, index) in chartLegend" :key="index" class="legend-item">
              <td>
                <span class="legend-color" :style="{ backgroundColor: colors[index] }"></span>
                <span class="legend-label">{{ item.label }}</span>
              </td>
              <td class="legend-value">
                <!-- Toggle between value and percentage -->
                {{ showPercentages ? item.percentage + '%' : item.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch-container {
  position: absolute;
  top: 16px;
  left: 80px;
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
  margin-top: 70px;
  margin-left: -180px;
}

.legend-container {
  margin-top: -160px;
  margin-left: 80px;
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
}

.legend-value {
  text-align: center;
  color: #908E8E;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  width: 100px;
}

.legend-item td {
  width: 150px;
}

.legend-item .legend-value {
  width: auto;
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
