<script>
import DropdownField from "./DropdownField.vue";
import { ref, reactive, nextTick, watch } from "vue";
import Swal from "sweetalert2";

export default {
  components: {
    name: "DropdownFilter",
    DropdownField,
  },

  props: {
    yearOptions: Array,
    monthOptions: Array,
    agentOptions: Array,
  },

  setup(props) {
    const yearInputModal = ref("");
    const monthInputModal = ref("");
    const agentInputModal = ref("");
    const clearDropdownsOnReset = ref(false);
    const monthData = ref([...props.monthOptions]);
    const selectedPeriod = ref("year");
    // const preSelectedYear = ref([]);

    return {
      yearInputModal,
      monthInputModal,
      agentInputModal,
      clearDropdownsOnReset,
      monthData,
      selectedPeriod,
      // preSelectedYear,
    };
  },

  data() {
    return {
      selectedYears: [],
      selectedMonths: [],
      selectedAgent: "",
    };
  },

  methods: {
    async onPeriodChange() {
      if (this.selectedPeriod !== "month") {
        this.selectedMonths = [];
        this.monthInputModal = "";
      }
      if (this.selectedPeriod === "month") {
        if (this.selectedYears[0].length > 2) {
          Swal.fire(
            "Warnung",
            "Sie haben die Grenze von 24 Auswahlmöglichkeiten überschritten. Bitte entfernen Sie einige Optionen.",
            "warning"
          );
          return;
        }
      }

      this.emitDataFetch();
    },

    emitDataFetch() {
      this.$emit("dataFetch", {
        period: this.selectedPeriod,
        years: this.selectedYears,
        months: this.selectedMonths,
        agent: this.selectedAgent,
      });
    },

    // checkLimit() {
    //   const yearCount = this.selectedYears.length || 1;
    //   const monthCount = this.selectedMonths.length || 1;

    //   if (
    //     this.selectedPeriod === "month" &&
    //     this.selectedMonths.length === 0 &&
    //     this.selectedYears.length > 2
    //   ) {
    //     alert(
    //       "You have exceeded the limit of 20 selections. Please remove some options."
    //     );
    //     this.selectedYears = this.selectedYears.slice(0, 2);
    //   } else if (yearCount * monthCount > 20) {
    //     alert(
    //       "You have exceeded the limit of 20 selections. Please remove some options."
    //     );
    //   }
    //   this.emitDataFetch();
    // },

    checkLimit(emitData) {
      this.monthInputModal = emitData.selected_titles;

      this.selectedMonths = emitData.selected_values.map((item) => item.value);

      // if (
      //   this.selectedPeriod === "month" &&
      //   this.selectedMonths.length === 0 &&
      //   this.selectedYears.length > 2
      // ) {
      //   alert(
      //     "You have exceeded the limit of 20 selections. Please remove some options."
      //   );
      //   this.selectedYears = this.selectedYears.slice(0, 2);
      // } else if (yearCount * monthCount > 20) {
      //   alert(
      //     "You have exceeded the limit of 20 selections. Please remove some options."
      //   );
      // }
      // if (
      //   this.selectedPeriod === "month" &&
      //   this.selectedMonths.length === 0 &&
      //   this.selectedYears.length > 1
      // ) {
      //   alert(
      //     "You have exceeded the limit of 20 selections. Please remove some options."
      //   );
      //   this.selectedYears = this.selectedYears.slice(0, 2);
      // }
      this.emitDataFetch();
    },

    reloadYearData(emitData) {
      if (
        this.selectedPeriod === "month" &&
        emitData.selected_values.length > 2
      ) {
        this.selectedYears = [];
        this.yearInputModal = emitData.selected_titles;

        this.selectedYears.push(
          emitData.selected_values.map((item) => {
            return item.value;
          })
        );
        Swal.fire(
          "Warnung",
          "Sie haben die Grenze von 24 Auswahlmöglichkeiten überschritten. Bitte entfernen Sie einige Optionen.",
          "warning"
        );
        return;
      } else {
        this.selectedYears = [];
        this.yearInputModal = emitData.selected_titles;

        this.selectedYears.push(
          emitData.selected_values.map((item) => {
            return item.value;
          })
        );
        this.emitDataFetch();
      }
    },

    reloadAgentData(emitData) {
      if (emitData.value === "all") {
        this.agentInputModal = emitData.title;
        this.selectedAgent = "";
      } else {
        this.agentInputModal = emitData.title;
        this.selectedAgent = emitData.value;
      }

      this.emitDataFetch();
    },
  },

  computed: {
    getSelectedMonthsText() {
      if (this.selectedMonths.length > 0) {
        return this.selectedMonths
          .map((monthValue) => {
            const month = this.monthOptions.find((m) => m.value === monthValue);
            return month ? month.name.substring(0, 3) : "";
          })
          .join(", ");
      }
      return "Wählen Sie das Monaten";
    },

    formattedYearInputModal() {
      if (typeof this.yearInputModal === "string") {
        const yearsArray = this.yearInputModal
          .split(",")
          .map((year) => year.trim());
        return yearsArray.join(", ").replace(/, ([^,]*)$/, "  $1");
      }
      return this.yearInputModal;
    },

    formattedMonthInputModal() {
      if (!this.monthInputModal || this.monthInputModal.trim() === "") {
        return "Alle ";
      }
      if (typeof this.monthInputModal === "string") {
        const monthsArray = this.monthInputModal
          .split(",")
          .map((month) => month.trim());
        return monthsArray.join(", ").replace(/, ([^,]*)$/, "  $1");
      }
      return this.monthInputModal;
    },

    monthText() {
      if (!this.monthInputModal || this.monthInputModal.trim() === "") {
        return "monate";
      }

      const monthsArray = this.monthInputModal
        .split(",")
        .map((month) => month.trim());

      return monthsArray.length === 2 ? "monat" : "monate";
    },

    formattedAgentsInputModal() {
      if (!this.agentInputModal || this.agentInputModal.trim() === "") {
        return "alle agenten";
      } else {
        return this.agentInputModal + " agent";
      }
    },
  },

  watch: {
    selectedPeriod(newValue) {
      if (newValue === "year" || newValue === "quarter") {
        this.monthData = [
          { title: "January", value: "1", selected: false },
          { title: "February", value: "2", selected: false },
          { title: "March", value: "3", selected: false },
          { title: "April", value: "4", selected: false },
          { title: "May", value: "5", selected: false },
          { title: "June", value: "6", selected: false },
          { title: "July", value: "7", selected: false },
          { title: "August", value: "8", selected: false },
          { title: "September", value: "9", selected: false },
          { title: "October", value: "10", selected: false },
          { title: "November", value: "11", selected: false },
          { title: "December", value: "12", selected: false },
        ];
      }
      this.onPeriodChange(newValue);
    },
  },

  mounted() {
    document.addEventListener("mousedown", this.handleClickOutside);

    this.preSelectedYear =
      this.yearOptions.find((option) => option.selected) || [];
  },

  beforeDestroy() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  },
};
</script>

<template>
  <div class="kpi-main-filters-container">
    <div class="filters-wrapper">
      <div class="kpi-right-filter-container">
        <div class="radio-group">
          <input
            type="radio"
            id="option1"
            name="options"
            value="year"
            v-model="selectedPeriod"
            class="radio-input"
          />
          <label for="option1" class="radio-label">Jahren</label>

          <input
            type="radio"
            id="option2"
            name="options"
            value="quarter"
            v-model="selectedPeriod"
            class="radio-input"
          />
          <label for="option2" class="radio-label">Quartalen</label>

          <input
            type="radio"
            id="option3"
            name="options"
            value="month"
            v-model="selectedPeriod"
            class="radio-input"
          />
          <label for="option3" class="radio-label">Monaten</label>
        </div>

        <div
          id="year-dropdown-container"
          style="margin-left: 28px; margin-right: 12px"
        >
          <DropdownField
            placeHolder="Jahr"
            :inputModal="yearInputModal"
            :items="yearOptions"
            :isMultiSelect="true"
            :preSelectedProject="preSelectedYear"
            :isModal="true"
            :clearOnReset="false"
            v-on:on-dropdown-change="reloadYearData"
          />
        </div>

        <div id="month-dropdown-container" v-if="selectedPeriod === 'month'">
          <DropdownField
            placeHolder="Alle"
            :inputModal="monthInputModal"
            :items="monthData"
            :isMultiSelect="true"
            :isModal="true"
            :clearOnReset="clearDropdownsOnReset"
            v-on:on-dropdown-change="checkLimit"
          />
        </div>
      </div>

      <div class="kpi-left-filter-container">
        <div id="agent-dropdown-container">
          <DropdownField
            placeHolder="Alle Agenten"
            :inputModal="agentInputModal"
            :items="agentOptions"
            :isMultiSelect="false"
            :isModal="true"
            :clearOnReset="false"
            v-on:on-dropdown-change="reloadAgentData"
          />
        </div>
      </div>
    </div>

    <h2 class="kpi-filter-text-container">
      {{ this.formattedYearInputModal }}:
      {{ this.formattedMonthInputModal }}
      {{ this.monthText }}
      details für {{ this.formattedAgentsInputModal }}
    </h2>
  </div>
</template>

<style scoped>
.kpi-main-filters-container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: 21px;
  margin-right: 36px;
  font-family: inherit;
}

.filters-wrapper {
  display: flex;
  width: 100%;
}

.kpi-right-filter-container {
  display: flex;
  margin-right: auto;
  margin-left: 0;
}

.kpi-left-filter-container {
  display: flex;
  margin-left: 0;
  margin-right: 0;
}

.kpi-filter-text-container {
  display: inline-flex;
  flex-direction: column;
  align-self: flex-start;
  flex-wrap: wrap;
  white-space: normal;
  width: auto;
  color: #22252d;
  margin-top: 20px;
  padding: 10px;
  margin-left: 15px;
  font-family: inherit;
  border-radius: 5px;
}

.radio-group {
  display: flex;
}

.radio-label {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22252d;
  width: 100px;
  height: 40px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  transition: background-color 0.3s, border-color 0.3s;
}

.radio-label:first-of-type {
  border-radius: 4px 0 0 4px;
}

.radio-label:last-of-type {
  border-radius: 0 4px 4px 0;
}

.radio-label:hover {
  border-color: rgba(78, 125, 239);
}

.radio-input {
  display: none;
}

.radio-input:checked + .radio-label {
  background-color: rgba(78, 125, 239);
  color: white;
  border-color: rgba(78, 125, 239);
}
</style>
