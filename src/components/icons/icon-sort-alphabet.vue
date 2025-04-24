<script>
export default {
  name: "sort-alphabet-icon",
  props: {
    direction: String
  }
}
</script>

<template>
  <i class="fa-regular fa-arrow-down-a-z" v-if="direction === 'down'"></i>
  <i class="fa-regular fa-arrow-down-z-a" v-else></i>
</template>


<style scoped>

i {
  cursor: pointer;
}

</style>
