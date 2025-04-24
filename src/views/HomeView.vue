<script>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from "../components/Navigation.vue";
import Dashboard from "../components/Dashboard.vue";

export default {
  components: {Navigation, Dashboard},
}
</script>

<template>
  <Navigation />
  <Dashboard />
</template>

<style scoped>
</style>
