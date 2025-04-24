<script>
import Button from "@/components/buttons/button.vue";

export default {
  name: "NavigationsOptionsPage",
  components: {Button},
  data() {
    return {
      currentRouterName: ''
    };
  },
  methods: {

  },
  computed: {

  }
}
</script>

<template>
  <div class="top-navigation">
    <router-link :to="{name: 'agentFilterView'}">
      <Button :type="this.$route.name === 'agentFilterView' ? 'create reservation' : 'edit'">Makler Regionen</Button>
    </router-link>
    <router-link :to="{name: 'agentOptionsCompanyView'}">
      <Button :type="this.$route.name === 'agentOptionsCompanyView' ? 'create reservation' : 'edit'">Makler Unternehmen</Button>
    </router-link>
  </div>
</template>

<style scoped>
.top-navigation {
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
  width: 100%;
}

.top-navigation a + a {
  margin-left: 15px;
}
</style>
