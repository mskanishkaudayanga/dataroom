<script>

export default {
  name: 'Loading',
  components: {

  },

  props: {
    loadingText: {
      type: String,
      required: true,
      default: 'Daten laden',
    },
  },

  methods: {

  },
}
</script>

<template>
  <div id="loading" class="loading-container">
    <span class="loading-spinner"></span>
    <h4>{{ loadingText }}</h4>
  </div>
</template>

<style scoped>
.loading-container {
  z-index: 10000000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 250px;
  height: 150px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: fixed;
  margin: auto;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  text-align: center;
}

.loading-spinner {
  border: 4px solid #FFFFFF;
  /* Light grey */
  border-top: 4px solid var(--dark-gray);
  /* Blue */
  border-radius: 50%;
  margin: auto;
  width: 40px;
  height: 40px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  animation: spin 2s linear infinite;
  z-index: 10000000;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}</style>