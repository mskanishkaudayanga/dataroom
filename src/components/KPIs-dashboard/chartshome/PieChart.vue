<script>
import axios from "axios";
import { GChart } from "vue-google-charts";

export default {
  components: {
    GChart,
  },
  props: {
    chartData: Object,
  },
  data() {
    return {
      // chartData: [],
      state: "initial",
      loading: true,
      showPercentage: false,
      chartLegend: [],
      stateColors: {
        initial: ["#FF6384", "#36A2EB"],
        work: ["#078de8", "#07578c", "#024878", "#FF6384"],
        both: ["#078de8", "#07578c", "#024878", "#d67287", "#e83158"],
      },
      legendColors: [],
      chartStateButtonLabel: "▶",
      intervalId: null,
      chartDataInternal: this.chartData,
    };
  },
  methods: {
    fetchData() {
      this.loading = true;

      try {
        const data = this.chartData;

        if (this.chartDataInternal) {
          this.chartDataInternal = data[this.state]?.data;

          this.legendColors = this.stateColors[this.state];
          this.updateLegend(data[this.state]?.data);
          this.$nextTick(() => {
            this.drawChart();
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    updateLegend(data) {
      const total = data?.slice(1).reduce((acc, cur) => acc + cur[1], 0);
      this.chartLegend = data?.slice(1).map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1),
      }));
    },
    async drawChart() {
      await this.loadGoogleCharts();
      const google = window?.google;
      const chartContainer = this.$refs.pieChart;

      const chart = new google.visualization.PieChart(chartContainer);

      const options = {
        title:
          this.state === "initial"
            ? "Initial Chart"
            : this.state === "work"
            ? "Work Chart"
            : "Both Chart",

        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        chartArea: {
          width: "90%",
          height: "90%",
        },
        pieSliceTextStyle: {
          fontSize: 12,
          color: "#FFFFFF",
          fontName: "Montserrat",
          fontWeight: 400,
        },
        legend: "none",
        colors: this.legendColors,
      };

      const chartDataTable = google.visualization?.arrayToDataTable(
        this.chartDataInternal
      );
      chart.draw(chartDataTable, options);

      google.visualization.events.addListener(
        chart,
        "click",
        this.cycleChartState
      );
    },
    cycleChartState() {
      this.state =
        this.state === "initial"
          ? "work"
          : this.state === "work"
          ? "both"
          : "initial";
      this.fetchData();
    },
    loadGoogleCharts() {
      return new Promise((resolve) => {
        const google = window.google;
        google?.charts.load("current", { packages: ["corechart"] });
        google?.charts.setOnLoadCallback(resolve);
      });
    },
    toggleChart() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.chartStateButtonLabel = "▶";
      } else {
        this.cycleChartState();
        this.intervalId = setInterval(this.cycleChartState, 2000);
        this.chartStateButtonLabel = "❚❚";
      }
    },
  },
  watch: {
    chartData(newVal) {
      this.chartDataInternal = newVal;

      this.fetchData();
    },
  },

  computed: {
    noDataAvailable() {
      const vermietet = this.chartData?.initial?.data.find(
        (item) => item[0] === "Vermietet"
      );
      const unVermietet = this.chartData?.initial?.data.find(
        (item) => item[0] === "UnVermietet"
      );
      return (
        vermietet && unVermietet && vermietet[1] === 0 && unVermietet[1] === 0
      );
    },
  },

  async mounted() {
    await this.loadGoogleCharts();
    this.fetchData();
  },
};
</script>

<template>
  <div>
    <div class="section-header">
      <div class="section-title">
        <p>Vermietet vs. UnVermietet</p>
      </div>
      <div class="switch-container">
        <span
          class="switch-label-left"
          :class="state === 'initial' ? 'active' : ''"
          >Anzahl</span
        >
        <label class="switch">
          <input type="checkbox" v-model="showPercentage" />
          <span class="slider"></span>
        </label>
        <span
          class="switch-label-right"
          :class="state === 'work' ? 'active' : ''"
          >Prozentsatz</span
        >
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Laden von Daten...</p>
    </div>

    <div v-if="!loading && noDataAvailable" class="error-message-container">
      <div class="error-message">Daten nicht verfügbar.</div>
    </div>

    <!-- Chart container -->
    <div
      class="chart-container"
      v-if="!loading && !noDataAvailable"
      ref="pieChart"
    ></div>

    <!-- Chart legend -->
    <div class="chart-legend" v-if="!loading && !noDataAvailable">
      <div
        class="legend-item"
        v-for="(item, index) in chartLegend"
        :key="index"
      >
        <div
          class="legend-color"
          :style="{ backgroundColor: legendColors[index] }"
        ></div>
        <div class="legend-name">{{ item.name }}</div>
        <div class="legend-value">
          {{ showPercentage ? item.percentage + "%" : item.value }}
        </div>
      </div>
    </div>

    <button @click="toggleChart">{{ chartStateButtonLabel }}</button>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  height: 220px;
  width: 55%;
  top: 40px;
  position: absolute;
  z-index: 1;
  justify-content: center;
  align-items: center;
}

.legend-item {
  display: flex;
  width: 100%;
  justify-content: normal;
  align-items: center;
  margin: 1px 0;
  padding-left: 5px;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
  color: #908e8e;
}

.legend-color {
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  display: inline-block;
}

.legend-name {
  width: auto;
  font-weight: 500;
  font-size: 12px;
  font-family: "Montserrat";
}

.legend-value {
  font-weight: 500;
  width: auto;
  margin-left: auto;
  margin-right: 20px;
}

.legend-item span {
  margin-left: auto;
  padding-left: 40px;
}

:deep(.legend-color) {
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 2px;
  display: inline-block;
}

.chart-legend {
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
/* .switch-container {
  position: absolute;
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
} */

/* .slider {
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

/*  the new button style */
button {
  position: absolute;
  top: 0px;
  right: 215px;
  padding: 10px 20px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #36a2eb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  z-index: 100;
}

button:hover {
  background-color: #2a8ab6;
}

button:hover {
  background-color: #2a8ab6;
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
  padding: 0 26px;
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
