<script>
export default {
  name: "star-icon",
  props: {
    isFavored: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <i class="fa-star" :class="{'fa-regular': !isFavored, 'fa-solid': isFavored}"></i>
</template>

<style scoped>

</style>
