<script>
export default {
  name: "RlNavigationbar",
  components: {},
  setup() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },

    items: {
      type: Object,
      required: true,
    },
  },
  methods: {
    navigate(page) {
      this.$emit("navigate", page);
    },
  },
};
</script>

<template>
  <div>
    <nav class="navbar-container">
      <ul class="navbar-menu">
        <li class="nav-bar-item" @click="navigate('FileDownloadModal')">
          Activity
        </li>
        <li class="nav-bar-item" @click="navigate('FileDownloadModal')">
          Files
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>
<style scooped>
.header {
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
}

.top-header-container {
  display: flex;
  margin-bottom: 25px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-gray);
}

.close-button {
  width: 36px;
  height: 36px;
  background-color: #f8f8f8;
  border: none;
  border-radius: 18px;
}

.navbar-container {
  background-color: white;
  border-bottom: "black";
}

.navbar-menu {
  list-style-type: none;
  display: flex;
  margin-bottom: 10px;
}

.nav-bar-item {
  display: inline;
  color: black;
  font-family: inherit;
  font-size: 16px;
  border-radius: 5px;
  text-align: center;
  padding: 14px 16px;
}

.nav-bar-item:hover {
  background-color: #ddd;
  color: black;
}
</style>
