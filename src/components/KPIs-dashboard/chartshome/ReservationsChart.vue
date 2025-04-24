<script>
import { defineComponent, computed, ref, onMounted } from "vue";
import { GChart } from "vue-google-charts";

export default defineComponent({
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
      default: () => ({}),
    },
  },
  setup(props) {
    const loading = ref(true); // Track loading state

    const textStyle = {
      fontSize: 12,
      fontName: "Montserrat",
      bold: true,
    };

    const defaultOptions = {
      hAxis: {
        textStyle: textStyle,
        titleTextStyle: {
          ...textStyle,
          fontSize: 12,
        },
      },
      vAxis: {
        title: "Price",
        minValue: 0,
        textStyle: textStyle,
        titleTextStyle: {
          ...textStyle,
          fontSize: 14,
        },
      },
      width: "100%",
      height: 400,
      chartArea: {
        width: "90%",
        height: "80%",
        left: "10%",
        top: "10%",
        backgroundColor: "none",
      },
      annotations: {
        alwaysOutside: true,
        textStyle: {
          fontSize: 12,
          auraColor: "none",
          color: "#555",
        },
      },
      backgroundColor: "none",
      legend: { position: "none" },
    };

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
    const computedChartOptions = computed(() => {
      const baseWidth = 580;
      const maxWidth = 1200;
      // const maxValue = Math.max(
      //   ...props.chartData.slice(1).map((row) => row[1])
      // );
      // const stepSize = 1;
      // const adjustedMax = Math.ceil(maxValue / stepSize) * stepSize + stepSize;

      const barCount = Array.isArray(props.chartData)
        ? props.chartData.length - 1
        : 0;
      const chartWidth = barCount > 11 ? maxWidth : baseWidth;

      return {
        ...defaultOptions,
        ...props.chartOptions,
        // chartArea: {
        //   left: "0%",
        //   top: "10%",
        //   width: "90%",
        //   height: "80%",
        //   backgroundColor: "none",
        // },
        hAxis: {
          textStyle: {
            fontSize: 10,
            fontName: "Montserrat",
          },
          titleTextStyle: {
            fontSize: 12,
            fontName: "Montserrat",
          },
          title: props.chartOptions.hAxis?.title || "",

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
          title: props.chartOptions.vAxis?.title || "",
          // maxValue: adjustedMax,
        },
        width: "100%",
        height: 450,
        chartArea: {
          width: "100%",
          height: "70%",
          left: "10%",
          right: "5%",
          top: "10%",
          backgroundColor: "none",
        },
        annotations: {
          alwaysOutside: true,
          textStyle: {
            fontSize: 12,
            auraColor: "none",
            color: "#555",
          },
        },
      };
    });

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
  /* top: 10px; */
  padding: 20px;
  background-color: none;
  box-shadow: none;
  margin-right: 10px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: #555;
  /* top: 200px; */
  right: 50px;
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
