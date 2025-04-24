<script>
export default {
  name: "sort-numeric-icon",
  props: {
    direction: String
  }
}
</script>

<template>
  <i class="fa-regular fa-arrow-down-1-9" v-if="direction === 'down'"></i>
  <i class="fa-regular fa-arrow-down-9-1" v-else></i>
</template>


<style scoped>

i {
  cursor: pointer;
}

</style>
