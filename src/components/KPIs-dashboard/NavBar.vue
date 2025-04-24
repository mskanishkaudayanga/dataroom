<script>
export default {
  name: "NavBar",
};
</script>

<template>
  <div>
    <!-- Horizontal Navbar -->
    <nav class="horizontal-navbar">
      <div class="navbar-container">
        <ul class="navbar-menu">
          <li class="navbar-item">
            <router-link to="/KPIs-dashboard" active-class="active-link">Verkaufsbericht</router-link>
          </li>
          <!-- <li class="navbar-item">
            <router-link to="/kundenbericht" active-class="active-link">Kundenbericht</router-link>
          </li> -->
        </ul>
      </div>
    </nav>

    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
/* Horizontal Navbar */
.horizontal-navbar {
  display: flex;
  height: 80px;
  background: var(--dark-gray);
  padding: 21px 20px;
  border-color: #bcbfc6;
  z-index: 2;
}

.navbar-container {
  display: flex;
  align-items: center;
  height: 100%;
  background-color: transparent;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 20px;
  margin-left: 16px;
  padding: 0;
}

.navbar-item a {
  color: #fff;
  font-size: 12px;
  text-decoration: none;
  padding: 10px 16px;
  border: 1px solid transparent;
  transition: color, border-color, background-color 0.3s;
  border-radius: 4px;
  font-family: "Montserrat", sans-serif;
  border-color: #bcbfc6;
}

.navbar-item a:hover,
.navbar-item a.active-link {
  color: #22252d;
  background-color: white;
}

/* Vertical Navbar */
.vertical-navbar {
  background-color: #262a33;
  width: 100px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 80px;
  z-index: 10;
}

.vertical-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.vertical-item {
  padding: 10px;
}

.vertical-item a {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  display: block;
  text-align: center;
  transition: background-color 0.3s;
}

.vertical-item a:hover,
.vertical-item a.active-link {
  background-color: white;
  color: #22252d;
}
</style>
