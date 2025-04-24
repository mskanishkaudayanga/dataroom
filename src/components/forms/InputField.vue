<script>
  import SearchIcon from '../icons/icon-search.vue'

  export default {
    name: "InputField",
    components: {SearchIcon},
    props: {
      inputType: String,
      inputPlaceholder: String,
      inputName: String,
      inputValue: '',
    },
    computed: {
      classCheck() {
        return this.inputType !== 'submit' ? this.inputType + ' field' : this.inputType
      },
    },
    methods: {
      checkupRadiobuttonsSelection() {
        if ( this.inputValue === this.$refs[this.inputName].value || this.inputValue+'' === this.$refs[this.inputName].value ) {
          this.$refs[this.inputName].checked = true;
        } else {
          this.$refs[this.inputName].checked = false;
        }
      },
    },
    updated() {
      if ( this.inputType === 'radio' ){
        this.checkupRadiobuttonsSelection()
      }
    },
    mounted() {
      if ( this.inputType === 'radio' ){
        this.checkupRadiobuttonsSelection()
      }
    }
  }
</script>


<template>

  <input v-if="inputType !== 'radio'" :class="classCheck" :type="inputType" :placeholder="inputPlaceholder" :name="inputName" :value="inputValue" @input="$emit('update:modelValue', $event.target.value)" autocomplete="off">
  <input v-else-if="inputType === 'radio'" :class="classCheck" :type="inputType" :ref="inputName" :name="inputName" @input="$emit('update:modelValue', $event.target.value)">

</template>


<style scoped>

.field-wrapper {
  position: relative;
}

.icon-wrapper.search {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.icon-wrapper i {
  font-size: 20px;
  cursor: pointer;
}

input {
  border: 1px solid #DDDEDF;
  border-radius: var(--border-radius);
  font-size: 14px;
  padding: 0 15px;
  width: 100%;
}

input[type="checkbox"],
input.dropdown-input {
  cursor: pointer;
}

::placeholder {
  color: var(--light-gray);
  opacity: 0; /* Firefox */
  font-style: italic;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: var(--light-gray);
  font-style: italic;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: var(--light-gray);
  font-style: italic;
}

input[name="search"] {
  padding-left:40px;
}

input[type="checkbox"] {
  border: solid 2px black;
  height: 20px;
  width: 20px;
  padding: 0;
}

input[type="checkbox"] {
  position: relative;
  top: 5px;
  margin-left: 10px;
}

label {
  color: black;
}

</style>
