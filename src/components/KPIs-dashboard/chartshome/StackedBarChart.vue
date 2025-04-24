<script>
import { GChart } from 'vue-google-charts';

export default {
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [],
      rawData: [
        ['2017', 1030, 540, 350, 500, 600, 200, 200, 100],
        // Add more data as needed
      ],
      legendLabels: ['Reservierungen', 'Reservierungsgebur', 'NDB', 'KV-Entwuf an Kunden gesendet', 'Externes GWG', 'Internes GWG', 'Finanzierung', 'Notartermin'],
      customTexts: [
        'Reservierungen: from “reservation bestatigt”',
        '<pr>Custom text for Reservierungsgebur<br>: from “reservation gebucht</pr>”',
        'Custom text for NDB: from “New Database”',
        'Custom text for KV-Entwuf an Kunden gesendet: from “Kunden KV”',
        'Custom text for Externes GWG: from “External GWG”',
        'Custom text for Internes GWG: from “Internal GWG”',
        'Custom text for Finanzierung: from “Financing Details”',
        'Custom text for Notartermin: from “Notary Appointment”'
      ],
      colors: ['#36A2EB', '#29D3D2', '#9BD75D', '#D2E855', '#FCF751', '#F8D11E', '#F533FF', '#FF8C33', '#33FF8C'],
      chartOptions: {
        backgroundColor: 'transparent',
        isStacked: true,
        height: 350,
        // width: 1150,
        colors: ['#36A2EB', '#29D3D2', '#9BD75D', '#D2E855', '#FCF751', '#F8D11E', '#F533FF', '#FF8C33', '#33FF8C'],
        legend: { position: 'none' },
        bar: { groupWidth: '15%' },
        hAxis: {
          title: 'Total',
          minValue: 0,
        },
        vAxis: {
          title: 'Year',
        },
        chartArea: {
          top: 50,
          bottom: 100,
          width: '80%',
          height: '80%',
        },
        tooltip: {
          isHtml: true,
          textStyle: {
            fontSize: 12,
            color: '#000',
          },
          showColorCode: true,
        },
        annotations: {
          alwaysOutside: false,
          textStyle: {
            fontSize: 10,
            bold: true,
            color: 'black',
            auraColor: 'none',
          },
          stem: {
            length: 0,
          },
          highContrast: true,
        },
      },
      availableYears: [],
      selectedOption: 'units',
    };
  },
  methods: {
    createCustomTooltip(year, label, value, units, percentage, customText) {
      return `
        <div style="padding:5px; font-size: 12px; color: #000;">
          <b>Year:</b> ${year}<br>
          <b>${label}:</b> ${value} ${units} <span style="color: #000;">(${percentage})</span><br>
          <b>Details:</b> ${customText}
        </div>
      `;
    },
    prepareChartData() {
      const header = [
        'Year',
        'Reservierungen', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'Reservierungsgebur', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'NDB', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'KV-Entwuf an Kunden gesendet', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'Externes GWG', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'Internes GWG', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'Finanzierung', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
        'Notartermin', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'annotation' },
      ];

      const data = this.rawData.map(row => {
        const year = row[0];
        const values = row.slice(1);
        const total = values.reduce((sum, val) => sum + val, 0);

        return [
          year,
          ...values.flatMap((value, index) => {
            const percentage = ((value / total) * 100).toFixed(2);
            const customText = this.customTexts[index];
            const displayValue = this.selectedOption === 'percentage' ? parseFloat(percentage) : value;
            return [displayValue, this.createCustomTooltip(year, this.legendLabels[index], displayValue, this.selectedOption === 'percentage' ? '' : 'units', percentage + '%', customText), displayValue];
          })
        ];
      });

      this.chartData = [header, ...data];
    },
    updateChartData() {
      this.prepareChartData();
    },
    populateAvailableYears() {
      this.availableYears = [...new Set(this.rawData.map(row => row[0]))];
    }
  },
  created() {
    this.populateAvailableYears();
    this.prepareChartData();
  },
};
</script>

<template>
  <div class="chart-wrapper">
    <div class="dropdown-container">
      <select v-model="selectedOption" @change="updateChartData" class="dropdown-select">
        <option value="units">Anzahl der Einheiten</option>
        <option value="percentage">Percentage</option>
        <option value="percentage">Price</option>
      </select>
    </div>
    <div class="chart-container">
      <GChart type="BarChart" :data="chartData" :options="chartOptions" />
    </div>
    <div class="custom-legend">
      <div v-for="(item, index) in legendLabels" :key="index" class="legend-item">
        <div class="legend-color" :style="{ backgroundColor: colors[index] }"></div>
        <div class="legend-label">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
}

.dropdown-container {
  position: absolute;
  right: 32px;
  top: -20px;
  /* Adjust this value to position the dropdown as needed */
  z-index: 1000;

}

.dropdown-select {
  width: 184px !important;
  /* Set width directly on the dropdown select element */
  max-width: 184px;
  min-width: 184px;
  height: 39.6px;
}

.chart-container {
  position: absolute;
  left: 32px;
  right: 32px;
  top: 45px;
  background-color: #FFFFFF;
  border-radius: 8px;
}

.custom-legend {
  position: absolute;
  left: 268.68px;
  top: 375px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2px;
  width: calc(130% - 900px);
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 11.38px;
  height: 11.38px;
  margin-right: 5px;
}

.legend-label {
  font-size: 12px;
}
</style>
