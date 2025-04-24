<script>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from "../components/Navigation.vue"
import ReservationList from "../components/ReservationList.vue";

export default {
  components: {Navigation, ReservationList},
}
</script>

<template>
  <Navigation />
  <ReservationList />
</template>

<style scoped>
</style>