<script>
import { ref, onMounted, watch, computed, nextTick } from "vue";

export default {
  props: {
    chartData: Array,
    chartOptions: Object,
    colors: {
      type: Array,
      default: () => ["#4BC0C0", "#FF9F40"],
    },
  },
  setup(props) {
    const pieChart = ref(null);
    const chartLegend = ref([]);
    const showPercentages = ref(false);
    const loading = ref(true);

    const noDataAvailable = computed(() => {
      const neubau = props.chartData.find((item) => item[0] === "Neubau");
      const bestand = props.chartData.find((item) => item[0] === "Bestand");
      return neubau && bestand && neubau[1] === 0 && bestand[1] === 0;
    });

    const loadGoogleCharts = () => {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined" && google.charts) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://www.gstatic.com/charts/loader.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        }
      });
    };

    const drawChart = () => {
      if (
        typeof google !== "undefined" &&
        google.visualization &&
        Array.isArray(props.chartData)
      ) {
        const data = google.visualization.arrayToDataTable(props.chartData);
        const chart = new google.visualization.PieChart(pieChart.value);

        const options = {
          ...props.chartOptions,
          colors: props.colors,
          backgroundColor: "transparent",
          width: "100%",
          height: "100%",
          chartArea: {
            width: "90%",
            height: "90%",
          },
          pieSliceText: showPercentages.value ? "percentage" : "value",
          pieSliceTextStyle: {
            fontSize: 12,
            color: "#FFFFFF",
            fontName: "Montserrat",
            fontWeight: 400,
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
        google.charts.load("current", { packages: ["corechart"] });

        google.charts.setOnLoadCallback(() => {
          if (props.chartData && props.chartData.length > 0) {
            nextTick(() => {
              drawChart();
              setTimeout(() => {
                drawChart();
              }, 100);
            });
          }
        });
      } catch (error) {
        console.error("Failed to load Google Charts", error);
      }
    });

    watch(showPercentages, drawChart);
    watch(() => props.chartData, drawChart);

    return {
      pieChart,
      chartLegend,
      showPercentages,
      loading,
      noDataAvailable,
    };
  },
};
</script>

<template>
  <div>
    <div class="section-header">
      <div class="section-title">
        <p>Neu Bau / Bestand Bau</p>
      </div>
      <div class="switch-container">
        <span
          class="switch-label-left"
          :class="showPercentages ? 'inactive' : 'active'"
          >Anzahl</span
        >
        <label class="switch">
          <input type="checkbox" v-model="showPercentages" />
          <span class="slider"></span>
        </label>
        <span
          class="switch-label-right"
          :class="showPercentages ? 'active' : 'inactive'"
          >Prozentsatz</span
        >
      </div>
    </div>

    <div
      class="chart-container"
      ref="pieChart"
      v-show="!loading && !noDataAvailable"
    ></div>

    <!-- Loading animation -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Laden von Daten...</p>
    </div>

    <div v-if="!loading && noDataAvailable" class="error-message-container">
      <div class="error-message">Daten nicht verfügbar.</div>
    </div>

    <div class="legend-container" v-if="!loading && !noDataAvailable">
      <table class="legend-table">
        <tbody>
          <tr
            v-for="(item, index) in chartLegend"
            :key="index"
            class="legend-item"
          >
            <td>
              <span
                class="legend-color"
                :style="{ backgroundColor: colors[index] }"
              ></span>
              <span class="legend-label">{{ item.label }}</span>
            </td>
            <td class="legend-value">
              {{ showPercentages ? item.percentage + "%" : item.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* .switch-container {
  position: absolute;
  top: -23px;
  right: 24px;
  display: flex;
  align-items: center;
} */

.switch-container {
  display: flex;
  /* width: 100%; */
  /* align-items: flex-start; */
  flex: 0 0 auto;
  max-width: 65%;
  gap: auto;
  /* background-color: green; */
  margin-right: 24px;
  /* justify-content: flex-end; */
}

.switch {
  position: relative;
  display: flex;
  width: 48px;
  height: 24px;
  /* width: 20%;
  height: 15%; */
  margin: 0 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  /* width: 100%;
  height: 100%; */
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #36a2eb;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  /* height: 70%; 
  width: 70%; 
  left: 15%; 
  bottom: 15%; */
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: white;
  transition: 0.4s;
  top: 2px;
  left: 2px;
}

/* .switch {
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
  background-color: #36a2eb;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: white;
  transition: 0.4s;
  top: 2px;
  left: 2px;
} */

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.switch-label-left,
.switch-label-right {
  font-size: 12px;
  transition: color 0.4s;
}

.switch-label-left.active,
.switch-label-right.active {
  color: #2196f3;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
}

.switch-label-left.inactive,
.switch-label-right.inactive {
  color: #b3b3b3;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
}

.chart-container {
  display: flex;
  top: 40px;
  height: 220px;
  width: 55%;
  position: absolute;
  z-index: 1;
  justify-content: center;
  align-items: center;
}

.legend-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 10px;
  top: 78px;
  width: 40%;
  gap: 10px;
  align-content: center;
  justify-content: center;
}

.legend-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Montserrat";
}

.legend-table th {
  text-align: left;
  /* padding: 8px; */
  font-size: 12px;
  color: #262a33;
  font-weight: 600;
  font-family: "Montserrat";
  align-content: center;
}

.legend-table td {
  padding: 5px 0px;
  font-size: 12px;
  color: #908e8e;
  line-height: 1.5;
}

.legend-item td {
  /* width: 150px; */
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
  color: #908e8e;
  font-family: "Montserrat";
  font-weight: 500;
  white-space: nowrap;
}

.legend-value {
  text-align: center;
  color: #908e8e;
  font-size: 12px;
  font-family: "Montserrat";
  font-weight: 500;
  width: 100px;
}

.legend-item .legend-value {
  width: auto;
}

.error-message-container {
  display: flex;
  height: 100%;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.error-message {
  padding-top: 80px;
  text-align: center;
  /* font-size: 16px;
  color: #333; */
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

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-top: 16px;
  padding-left: 16px;
  /* align-items: center; */
  flex-wrap: nowrap;
  /* width: 100%; */
}

.section-title {
  font-size: 14px;
  color: #353535;
  /* padding: 0 26px; */
  /* padding-top: 16px; */
  font-weight: 600;
  font-family: "Montserrat";
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
