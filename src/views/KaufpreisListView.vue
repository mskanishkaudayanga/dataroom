<script>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from "../components/Navigation.vue"
import KaufpreisList from "../components/KaufpreisList.vue";

export default {
  components: {Navigation, KaufpreisList},
}
</script>

<template>
  <Navigation />
  <KaufpreisList />
</template>

<style scoped>
</style>
