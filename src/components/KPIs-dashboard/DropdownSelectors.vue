<script>
import Multiselect from 'vue-multiselect'; // Ensure the multiselect component is imported

export default {
  components: {
    Multiselect, // Register the multiselect component
  },
  props: {
    selectedViewType: {
      type: String,
      required: true,
    },
    selectedYears: {
      type: Array,
      required: true,
    },
    selectedMonths: {
      type: Array,
      required: true,
    },
    agentOptions: {
      type: Array,
      required: true,
    },
    selectedAgentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localSelectedViewType: this.selectedViewType,
      localSelectedYears: [...this.selectedYears],
      localSelectedMonths: [...this.selectedMonths],
      localSelectedAgentId: this.selectedAgentId,
    };
  },
  computed: {
    yearOptions() {
      const startYear = 2018;
      const endYear = 2024;
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push({ name: year.toString(), value: year });
      }
      return years;
    },
    monthOptions() {
      return [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' },
      ];
    },
  },
  methods: {
    updateViewType() {
      this.$emit('update:selectedViewType', this.localSelectedViewType);
    },
    updateSelectedYears() {
      this.$emit('update:selectedYears', this.localSelectedYears);
    },
    updateSelectedMonths() {
      this.$emit('update:selectedMonths', this.localSelectedMonths);
    },
    updateAgent() {
      this.$emit('update:selectedAgentId', this.localSelectedAgentId);
    },
  },
};
</script>

<template>
  <div>
    <!-- Dropdown for View Type -->
    <label for="view-type">Select View:</label>
    <select id="view-type" v-model="localSelectedViewType" @change="updateViewType">
      <option value="yearly">Yearly</option>
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
    </select>

    <!-- Conditionally Rendered Multiselect for Year -->
    <div v-if="localSelectedViewType !== 'yearly'">
      <label for="year-select">Select Year(s):</label>
      <multiselect v-model="localSelectedYears" :options="yearOptions" :multiple="true" :close-on-select="false"
        placeholder="Select Year(s)" track-by="value" label="name" @input="updateSelectedYears" />
    </div>

    <!-- Conditionally Rendered Multiselect for Month -->
    <div v-if="localSelectedViewType === 'monthly'">
      <label for="month-select">Select Month(s):</label>
      <multiselect v-model="localSelectedMonths" :options="monthOptions" :multiple="true" :close-on-select="false"
        placeholder="Select Month(s)" track-by="value" label="name" @input="updateSelectedMonths" />
    </div>

    <!-- Dropdown for Single Agent Selection -->
    <label for="agent-dropdown">Select Agent:</label>
    <select id="agent-dropdown" v-model="localSelectedAgentId" @change="updateAgent">
      <option v-for="agent in agentOptions" :key="agent.id" :value="agent.id">
        {{ agent.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
