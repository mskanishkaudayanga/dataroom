<script>
  export default {
    name: "TextAreaField",
    props: {
      inputPlaceholder: String,
      inputName: String,
      inputVal: '',
      value: '',
    },
  }
</script>


<template>

  <textarea :placeholder="inputPlaceholder" :name="inputName" :value="inputVal" @input="$emit('update:modelValue', $event.target.value)" autocomplete="off" rows="5">

  </textarea>

</template>


<style scoped>

textarea {
  border: 1px solid #DDDEDF;
  border-radius: var(--border-radius);
  font-size: 14px;
  padding: 15px;
  width: 100%;
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

</style>
