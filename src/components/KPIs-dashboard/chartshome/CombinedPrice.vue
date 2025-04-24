<script>
import { defineComponent, computed, ref, onMounted } from "vue";
import { GChart } from "vue-google-charts";

export default defineComponent({
  name: "CombinedPrice",
  components: {
    GChart,
  },
  props: {
    chartData: {
      type: Array,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true);

    const preprocessChartData = (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      if (data.length === 1) {
        const defaultRow = new Array(data[0].length).fill(0);
        data.push(defaultRow);
      }

      return data.map((row, rowIndex) => {
        if (!Array.isArray(row)) {
          return [];
        }

        return row.map((value, colIndex) => {
          if (rowIndex === 0) {
            return value;
          }
          return value == null ? 0 : value;
        });
      });
    };

    const computedChartOptions = computed(() => ({
      ...props.chartOptions,
      backgroundColor: "transparent",
      chartArea: {
        width: "100%",
        height: "75%",
        left: "8%",
        right: "3%",
        top: "2%",
        backgroundColor: "none",
      },
      colors: ["#36A2EB", "#4BC0C0", "#F76767"],
      hAxis: {
        textStyle: {
          fontSize: 10,
          fontName: "Montserrat",
        },
        titleTextStyle: {
          fontSize: 12,
          fontName: "Montserrat",
        },
        title: props.chartOptions.hAxis?.title || "X Axis Title",
        gridlines: {
          color: "transparent",
        },
        baselineColor: "transparent",
      },
      vAxis: {
        textStyle: {
          fontSize: 10,
          fontName: "Montserrat",
        },
        titleTextStyle: {
          fontSize: 12,
          fontName: "Montserrat",
        },
        title: props.chartOptions.vAxis?.title || "Y Axis Title",
      },
      width: "100%",
      height: 460,
      legend: {
        position: "top",
        alignment: "center",
        textStyle: {
          fontSize: 10,
          fontName: "Montserrat",
        },
      },
    }));

    onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 2000);
    });

    return {
      computedChartOptions,
      loading,
      preprocessChartData,
    };
  },
});
</script>

<template>
  <div class="chart-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Laden von Daten...</p>
    </div>
    <GChart
      v-else
      type="ColumnChart"
      :data="preprocessChartData(chartData)"
      :options="computedChartOptions"
      style="width: 100%"
    />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  /* padding: 20px; */
  background-color: none;
  box-shadow: none;
  /* margin-right: 10px; */
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: #555;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #666666;
  animation: spin 1s ease infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
