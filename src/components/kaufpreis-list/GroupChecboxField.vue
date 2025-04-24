<script>
import { ref, reactive } from "vue"

export default {
    name: 'GroupCheckboxField',
    emits: {
        onCheckboxChange: null,
    },

    setup() {
        const selectedItemsInMultiSelection = ref([]);

        return {
            selectedItemsInMultiSelection,
        };
    },

    props: {
        items: {
            type: Array,
            required: true,
            default: [],
        },
    },

    methods: {
        onCheckboxChange(object) {

            if (object.selected) {
                    let filteredIndex = this.selectedItemsInMultiSelection.findIndex(item => item.value === object.value);
                    object.selected = false;
                    this.selectedItemsInMultiSelection.splice(filteredIndex, 1);
                } else {
                    object.selected = true;
                    this.selectedItemsInMultiSelection.push(object);
                }

                var selectedTitles = '';
                this.selectedItemsInMultiSelection.forEach(element => {
                    selectedTitles = selectedTitles + element.title + ', '
                });
                
                let emitData = {
                    'selected_titles': selectedTitles,
                    'selected_values': this.selectedItemsInMultiSelection,
                }

                this.$emit('onCheckboxChange', emitData);
                return;
        },
    },
};
</script>
<template>
      <div style="text-align: left;">
        <template v-for="(object, index) in items" :key="index">
            <!-- <template v-if="index == 9">
                <br>
                <div class="custom-checkbox-unit" :class="{ 'custom-checkbox-unit-selected': object.selected }" @click="toggleCheckbox(object)">
                    <label :class="{ 'selected': object.selected }">{{ object.title }}</label>
                </div>
            </template> -->

            <!-- <template v-else> -->
                <div class="custom-checkbox-unit" :class="{ 'custom-checkbox-unit-selected': object.selected }" @click="onCheckboxChange(object)">
                    <label :class="{ 'selected': object.selected }">{{ object.title }}</label>
                </div>
            <!-- </template> -->
        </template>
      </div>
</template>
  
<style scoped>
.custom-checkbox-unit {
  display: inline-block;
  width: 70px;
  padding: 8.5px 12px;
  border-top: 1px solid #c2c2c2;
  border-bottom: 1px solid #c2c2c2;
  cursor: pointer;
  text-align: center;
}

.custom-checkbox-unit:nth-child(even) {
    border-left: 0.5px solid #c2c2c2;
    border-right: 0.5px solid #c2c2c2;
}

.custom-checkbox-unit:nth-child(odd) {
    border-left: 0.5px solid #c2c2c2;
    border-right: 0.5px solid #c2c2c2;
}

.custom-checkbox-unit:first-child {
    border-left: 0.5px solid #c2c2c2;
    border-right: 0.5px solid #c2c2c2;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.custom-checkbox-unit:last-child {
    border-left: 0.5px solid #c2c2c2;
    border-right: 0.5px solid #c2c2c2;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.custom-checkbox-unit-selected {
  background-color: var(--blue);
  color: white;
}

label {
  color: #22252d;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

label.selected {
  color: white;
}
</style>