<script>

export default {
  name: "TextField",
  components: {

  },
  
  props: {
    inputType: {
      type: String,
      required: true,
      default: '',
    },

    inputPlaceholder: {
      type: String,
      required: true,
      default: '',
    },

    inputValue: {
      type: String,
      required: false,
      default: '',
    },
  },

  methods: {
    onEnterPress: function (event) {
      let immoNumber = event.target.value;

      let emitData = {
        'immo_number': immoNumber
      }
      this.$emit('onEnterPress', emitData);
    }
  }
}
</script>

<template>
  <input class="kpl-input-field" :type="inputType" :placeholder="inputPlaceholder" :value="inputValue"
    v-on:keyup.enter="onEnterPress">
</template>

<style scoped>
.kpl-input-field {
  width: 100%;
  padding: 10px 16px 10px 16px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  border-color: rgba(255, 255, 255, 0.06);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: start;
  outline: none;
}

input::placeholder {
  font-size: 12px;
  font-weight: 500;
  color: white;
}
</style>