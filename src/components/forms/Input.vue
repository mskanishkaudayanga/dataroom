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
      tester: '',
    },
    computed: {
      classCheck() {
        return this.inputType !== 'submit' ? this.inputType + ' field' : this.inputType
      },
    }
  }
</script>


<template>
  <div class="field-wrapper">
    <span class="icon-wrapper" :class="inputName" v-if="inputName === 'search'">
      <SearchIcon></SearchIcon>
    </span>

    <label :for="inputName" v-if="inputType === 'checkbox'">
      {{ labelText }}
    </label>

    <input :class="classCheck" :type="inputType" :placeholder="inputPlaceholder" :name="inputName" :value="tester" v-model="tester">

  </div>
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
  height: 100%;
  width: 100%;
}

::placeholder {
  color: var(--light-gray);
  opacity: 1; /* Firefox */
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

label + input[type="checkbox"] {
  position: relative;
  top: 5px;
  margin-left: 10px;
}

label {
  color: black;
}

</style>
