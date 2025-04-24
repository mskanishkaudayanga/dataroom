<script>
import DropdownIcon from "../icons/icon-dropdown.vue";
import { ref, reactive } from "vue";

export default {
  name: "DropdownField",
  components: {
    DropdownIcon,
  },

  emits: {
    onDropDownInputClicked: null,
    onDropdownChange: null,
  },

  setup() {
    const isDropDownActive = ref(true);
    const dropDownClass = ref("kpl-dropdown-items");
    const inputValue = ref("");
    const selectedProjectsInMultiSelection = ref([]);

    return {
      isDropDownActive,
      dropDownClass,
      inputValue,
      selectedProjectsInMultiSelection,
    };
  },

  props: {
    placeHolder: {
      type: String,
      required: true,
      default: "",
    },

    inputModal: {
      type: String,
      required: true,
      default: "",
    },

    items: {
      type: Array,
      required: true,
      default: [],
    },

    isMultiSelect: {
      type: Boolean,
      required: true,
      default: false,
    },

    restrictedMultiSelectCount: {
      type: Number,
      required: false,
      default: 0,
    },

    preSelectedProject: {
      type: Object,
      required: false,
      default: null,
    },

    isModal: {
      type: Boolean,
      required: true,
      default: false,
    },

    clearOnReset: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      inputDataModal: "",
    };
  },

  methods: {
    reset() {
      if (this.clearOnReset) {
        this.inputValue = "";

        this.items.forEach((element) => {
          element.selected = false;
        });

        this.selectedProjectsInMultiSelection = [];
      }

      this.isDropDownActive = false;
      this.dropDownClass = "kpl-dropdown-items";
    },

    onClearManually() {
      this.inputValue = "";

      this.items.forEach((element) => {
        element.selected = false;
      });

      this.selectedProjectsInMultiSelection = [];
    },

    onDropDownInputClicked: function () {
      document
        .querySelectorAll(".kpl-dropdown-items.active")
        .forEach((element) => {
          element.classList.remove("active");
        });

      this.isDropDownActive = !this.isDropDownActive;
      return this.isDropDownActive
        ? (this.dropDownClass = "kpl-dropdown-items active")
        : (this.dropDownClass = "kpl-dropdown-items");
    },

    onDropdownChange: function (object) {
      if (this.isMultiSelect) {
        this.handleMultiSelections(object);

        return;
      }

      this.items.forEach((element) => {
        element.selected = false;
      });

      object.selected = true;
      this.inputValue = "";

      this.onDropDownInputClicked();

      let emitData = {
        title: object.title,
        value: object.value,
      };

      this.$emit("onDropdownChange", emitData);
    },

    onDropDownSearch: function (event) {
      this.isDropDownActive = true;
      this.dropDownClass = "kpl-dropdown-items active";
      let searchTerm = event.target.value;
      this.inputValue = searchTerm;
    },

    handleMultiSelections(object) {
      if (this.restrictedMultiSelectCount === 0) {
        if (object.selected) {
          let filteredIndex = this.selectedProjectsInMultiSelection.findIndex(
            (item) => item.value === object.value
          );
          object.selected = false;
          this.selectedProjectsInMultiSelection.splice(filteredIndex, 1);
        } else {
          object.selected = true;
          this.selectedProjectsInMultiSelection.push(object);
        }

        var selectedTitles = "";
        this.selectedProjectsInMultiSelection.forEach((element) => {
          selectedTitles = selectedTitles + element.title + ", ";
        });

        this.inputValue = "";

        let emitData = {
          selected_titles: selectedTitles,
          selected_values: this.selectedProjectsInMultiSelection,
        };

        this.$emit("onDropdownChange", emitData);
        return;
      } else {
        if (object.selected) {
          let filteredIndex = this.selectedProjectsInMultiSelection.findIndex(
            (item) => item.value === object.value
          );
          object.selected = false;
          this.selectedProjectsInMultiSelection.splice(filteredIndex, 1);
        } else {
          if (
            this.selectedProjectsInMultiSelection.length <
            this.restrictedMultiSelectCount
          ) {
            object.selected = true;
            this.selectedProjectsInMultiSelection.push(object);
          } else {
            return;
          }
        }

        if (
          this.selectedProjectsInMultiSelection.length <
          this.restrictedMultiSelectCount
        ) {
          let selectedTitles = "";
          this.selectedProjectsInMultiSelection.forEach((element) => {
            selectedTitles = selectedTitles + element.title + ", ";
          });

          this.inputValue = "";

          let emitData = {
            selected_titles: selectedTitles,
            selected_values: this.selectedProjectsInMultiSelection,
          };

          this.$emit("onDropdownChange", emitData);
          return;
        }

        let selectedTitles = "";
        this.selectedProjectsInMultiSelection.forEach((element) => {
          selectedTitles = selectedTitles + element.title + ", ";
        });

        this.inputValue = "";

        let emitData = {
          selected_titles: selectedTitles,
          selected_values: this.selectedProjectsInMultiSelection,
        };

        this.$emit("onDropdownChange", emitData);
        return;
      }
    },

    handlePreSelectedProject(object) {
      this.selectedProjectsInMultiSelection.push(object);

      let selectedTitles = "";
      this.selectedProjectsInMultiSelection.forEach((element) => {
        selectedTitles = selectedTitles + element.title + ", ";
      });

      this.inputValue = "";

      let emitData = {
        selected_titles: selectedTitles,
        selected_values: this.selectedProjectsInMultiSelection,
      };

      this.$emit("onDropdownChange", emitData);
      return;
    },
  },

  watch: {
    inputModal: function (newValue) {
      this.inputDataModal = newValue;
    },

    clearOnReset: function (newValue) {
      console.log("value", newValue);
      if (newValue === true) {
        this.reset();
      }
    },

    preSelectedProject: function (newValue) {
      if (newValue != null) {
        this.handlePreSelectedProject(newValue);
      }
    },
  },

  computed: {
    filterItems() {
      return this.items.filter((item) =>
        item.title.toLowerCase().includes(this.inputValue.toLowerCase())
      );
    },
  },

  mounted() {
    document.addEventListener("click", this.reset);
  },

  unmounted() {
    document.removeEventListener("click", this.reset);
  },
};
</script>

<template>
  <template v-if="isModal">
    <span>
      <input
        type="text"
        autocomplete="off"
        v-model="inputDataModal"
        :placeholder="placeHolder"
        :class="isModal ? 'kpl-dropdown-input-in-modal' : 'kpl-dropdown-input'"
        @click.stop="onDropDownInputClicked"
        @input="onDropDownSearch"
      />
      <i class="fa-solid fa-caret-down dropdown-arrow"></i>
    </span>
  </template>

  <template v-else>
    <span>
      <input
        type="text"
        autocomplete="off"
        v-model="inputDataModal"
        :placeholder="placeHolder"
        :class="isModal ? 'kpl-dropdown-input-in-modal' : 'kpl-dropdown-input'"
        @click.stop="onDropDownInputClicked"
        @input="onDropDownSearch"
      />
      <i class="fa-solid fa-caret-down dropdown-arrow"></i>
    </span>
  </template>

  <div :class="dropDownClass">
    <ul @click.stop>
      <li
        v-for="(object, index) in filterItems"
        v-on:click="onDropdownChange(object)"
        :class="object.selected ? 'selected' : ''"
      >
        <span>
          {{ object.title }}
        </span>
        <span style="color: #d94139; font-weight: bold">
          {{ object.is_parken == true ? " (P)" : "" }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.kpl-dropdown-input {
  width: 10%;
  padding: 10px 16px 10px 16px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  border-color: rgba(255, 255, 255, 0.06);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: start;
  outline: none;
}

.placeholder-container {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  color: var(--gray-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  top: -9px;
  left: 900px;
  z-index: 1;
}

.kpl-dropdown-input-in-modal {
  width: 100%;
  padding: 12px 23px 8px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
}

input::placeholder {
  color: var(--dark-gray) !important;
}

.dropdown-arrow {
  position: absolute;
  color: var(--dark-gray) !important;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.kpl-dropdown-items {
  position: absolute;
  max-height: 0px;
  left: 0;
  overflow: auto;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  z-index: -999;
  opacity: 0;
}

.kpl-dropdown-items.active {
  opacity: 1;
  z-index: 10;
  max-height: 150px;
}

.kpl-dropdown-items.align-right {
  left: unset;
  right: 0;
}

.kpl-dropdown-items.active.relative {
  position: relative;
  width: 100%;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  padding: 10px 25px;
  cursor: pointer;
  font-family: inherit;
}

li.selected {
  background-color: var(--blue);
  color: white;
}

li:hover {
  background-color: var(--light-light-gray);
  color: var(--gray-text);
}

li.selected:hover {
  background-color: rgba(78, 125, 239, 0.8);
  color: white;
}
</style>
