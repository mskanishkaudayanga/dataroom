<script>
import DropdownIcon from "../icons/icon-dropdown.vue";
import { ref, reactive } from "vue";

export default {
  name: "TableDropdownField",
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
    const inputModel = ref("");
    const inputValue = ref("");
    const selectedProjectsInMultiSelection = ref([]);

    return {
      isDropDownActive,
      dropDownClass,
      inputModel,
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

    isModal: {
      type: Boolean,
      required: true,
      default: false,
    },

    clearOnReset: {
      type: Boolean,
      required: true,
      clearOnReset: false,
    },
  },

  methods: {
    reset() {
      if (this.clearOnReset) {
        this.inputModel = "";
        this.inputValue = "";

        this.items.forEach((element) => {
          element.selected = false;
        });

        this.selectedProjectsInMultiSelection = [];
      }

      this.isDropDownActive = false;
      this.dropDownClass = "kpl-dropdown-items";
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
      this.inputModel = object.selection_label;
      this.inputValue = "";

      this.onDropDownInputClicked();

      let emitData = {
        selection_label: object.selection_label,
        selection_value: object.selection_value,
      };

      this.$emit("onDropdownChange", emitData);
    },

    onDropDownSearch: function (event) {
      let searchTerm = event.target.value;
      this.inputValue = searchTerm;
    },

    handleMultiSelections(object) {
      if (object.selected) {
        object.selected = false;
        this.selectedProjectsInMultiSelection.splice(object, 1);
      } else {
        object.selected = true;
        this.selectedProjectsInMultiSelection.push(object);
      }

      this.inputModel = "";
      this.selectedProjectsInMultiSelection.forEach((element) => {
        this.inputModel = this.inputModel + element.selection_label + ", ";
      });

      this.inputValue = "";

      let emitData = {
        selected_projects: this.selectedProjectsInMultiSelection,
      };

      this.$emit("onDropdownChange", emitData);
    },
  },

  computed: {
    filterItems() {
      return this.items.filter((item) =>
        item.selection_label
          .toLowerCase()
          .includes(this.inputValue.toLowerCase())
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
  <span class=".dropdown-container">
    <input
      type="text"
      autocomplete="off"
      v-model="inputModel"
      :placeholder="placeHolder"
      :class="isModal ? 'kpl-dropdown-input-in-modal' : 'kpl-dropdown-input'"
      @click.stop="onDropDownInputClicked"
      @input="onDropDownSearch"
      :style="{ paddingRight: '20px' }"
    />
    <i class="fa-solid fa-caret-down dropdown-arrow"></i>
  </span>

  <div :class="dropDownClass">
    <ul @click.stop>
      <li
        v-for="(object, index) in filterItems"
        v-on:click="onDropdownChange(object)"
        :class="object.selected ? 'selected' : ''"
      >
        <span>
          {{ object.selection_label }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
}

.kpl-dropdown-input {
  white-space: nowrap;
  background-color: inherit;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  max-width: 140px;
}

.kpl-dropdown-input-in-modal {
  white-space: nowrap;
  background-color: inherit;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

input::placeholder {
  color: var(--dark-gray) !important;
}

.dropdown-arrow {
  position: absolute;
  color: var(--dark-gray) !important;
  right: 5px;
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
  z-index: 1;
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
