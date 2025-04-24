<script>
export default {
  name: "animate-circle-icon",
}
</script>

<template>
  <div class="loading-animation">
    <i class="fa-solid fa-circle-notch fa-spin"></i>
  </div>
</template>


<style scoped>

.loading-animation {
  margin-top: 5px;
  margin-left: 20px;
  font-size: 20px;
  color: var(--blue);
  z-index: 1
}

</style>
