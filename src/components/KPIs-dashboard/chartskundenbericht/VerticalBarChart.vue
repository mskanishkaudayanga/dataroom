<script>
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { GChart } from 'vue-google-charts';

export default defineComponent({
  components: {
    GChart
  },
  props: {
    chartData: {
      type: Array,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const showPercentages = ref(false);
    const loading = ref(true);
    const textStyle = {
      fontSize: 12,
      fontName: 'Montserrat, sans-serif',
      bold: true
    };

    const defaultOptions = {
      hAxis: {
        textStyle: textStyle,
        titleTextStyle: {
          ...textStyle,
          fontSize: 14
        }
      },
      vAxis: {
        minValue: 0,
        textStyle: textStyle,
        titleTextStyle: {
          ...textStyle,
          fontSize: 14
        }
      },
      height: 1000,
      chartArea: {
        width: '90%',
        height: '80%',
        left: '10%',
        top: '10%',
        backgroundColor: 'none'
      },
      backgroundColor: 'none',
      legend: { position: 'none' } // Hide legend
    };

    // toggle for percentages
    const formattedChartData = computed(() => {
      if (!showPercentages.value) {
        return props.chartData;
      }

      // Compute percentages
      const total = props.chartData.reduce((sum, row, index) => {
        if (index === 0) return sum;
        return sum + row[1];
      }, 0);

      // Convert to percentage
      return props.chartData.map((row, index) => {
        if (index === 0) return row;
        return [row[0], (row[1] / total) * 100];
      });
    });

    const computedChartOptions = computed(() => {
      const baseWidth = 800;

      const barCount = Array.isArray(props.chartData) ? props.chartData.length - 1 : 0;

      const chartWidth = barCount > 11 ? baseWidth : baseWidth;

      return {
        ...defaultOptions,
        ...props.chartOptions,
        chartArea: {
          left: '0%',
          top: '10%',
          width: '90%',
          height: '80%',
          backgroundColor: 'none'
        },
        hAxis: {
          textStyle: {
            fontSize: 12,
            fontName: 'Montserrat'
          },
          titleTextStyle: {
            fontSize: 12,
            fontName: 'Montserrat'
          },
          title: props.chartOptions.hAxis?.title || 'X Axis Title',
        },
        vAxis: {
          textStyle: {
            fontSize: 12,
            fontName: 'Montserrat'
          },
          titleTextStyle: {
            fontSize: 12,
            fontName: 'Montserrat'
          },
          title: showPercentages.value ? 'Prozentsatz' : 'Anzahl',
        },
        width: chartWidth,
        height: 270,
        chartArea: {
          width: '80%',
          height: '70%',
          left: '8%',
          top: '10%',
          bottom: '15%',
          backgroundColor: 'none'
        }
      };
    });
    onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 200);
    });
    return {
      showPercentages,
      computedChartOptions,
      formattedChartData,
      loading
    };
  }
});
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
    <div class="chart-container">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Laden von Daten...</p>
      </div>
      <GChart type="ColumnChart" :data="formattedChartData" :options="computedChartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 90%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  position: absolute;
  top: -10px;
  padding: 20px;
  background-color: none;
  box-shadow: none;
  left: 60px;
}

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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: #555;
  top: 20px;

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
