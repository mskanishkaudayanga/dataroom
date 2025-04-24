<script>
  import DropdownIcon from '../icons/icon-dropdown.vue';
  import { ref, reactive } from "vue"

export default {
  name: 'DropdownFieldData',
  components: {
        DropdownIcon
  },

  emits:{

  },

  setup(){
    const isDropDownActive = ref(true);
    const dropDownClass = ref('kpl-dropdown-items');

    return {
      isDropDownActive,
      dropDownClass
    }

  },

  props: {

    items: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }

  },

  methods: {

    onDropDownChange(selectedItem) { 
      this.items.forEach(item => {
        item.selected = (item.title == selectedItem.title)    
      });

      this.$emit('update:modelValue', selectedItem.value);
      this.$emit('onDropDownChange', selectedItem); 
    }
  }

};
</script>

<template>
  <div v-if="items.length > 0" class="dropdown">
    <div class="dropdown-item"
    
      v-for="item in items"
      :class="{ 'selected': item.selected }"
      :key="item.value"
      @click="onDropDownChange(item)"
    >
      {{ item.title }}
   
    </div>
  </div>
</template>

<style scoped>

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
  position: absolute;
  top: 100%;
  left: 0;
  width: 60%;
  background-color: white;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 60%;
  background-color: white;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* z-index: 1000; */
}

.dropdown-item:hover {
  background: lightgray;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}
.dropdown-item.selected {
  background-color: var(--blue);
  color: white;
}
</style>