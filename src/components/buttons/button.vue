<script>
  import FilterIcon from '../icons/icon-filter.vue'
  import DropdownIcon from '../icons/icon-dropdown.vue'
  import SearchIcon from "@/components/icons/icon-search.vue";

  export default {
    name: "Button",
    components: {SearchIcon, FilterIcon, DropdownIcon},
    props: {
      type: String
    }
  }
</script>


<template>


  <div class="button blue full" v-if="type === 'create reservation'">

    <span><slot></slot></span>

  </div>

  <div class="button blue border" v-else-if="type === 'filter'">

    <span><span class="text"><slot></slot></span> <span class="mobile"><FilterIcon></FilterIcon></span></span>

  </div>

  <div class="button blue border" v-else-if="type === 'sort'">

    <span><span class="text"><slot></slot></span> <DropdownIcon></DropdownIcon></span>

  </div>

  <div class="button blue border" v-else-if="type === 'search'">

    <span><slot></slot> <SearchIcon></SearchIcon></span>

  </div>

  <div class="button red border" v-else-if="type === 'delete'">

    <span><slot></slot></span>

  </div>

  <div class="button blue border" v-else-if="type === 'edit'">

    <span><slot></slot></span>

  </div>

  <div class="button blue full" v-else-if="type === 'report'">

    <span><slot></slot></span>

  </div>

  <div class="button red full" v-else-if="type === 'delete full'">

    <span><slot></slot></span>

  </div>

</template>


<style scoped>

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  border-radius: var(--border-radius);
  padding: 10px 25px;
  font-weight: 700;
  text-align: center;
}

.button.full {
  color: white;
}

.button.border {
  background-color: transparent;
  border-width: 1px;
  border-style: solid;
}

.button.blue.full {
  background-color: var(--blue);
}

.button.red.full {
  background-color: var(--red);
}

.button.blue.border {
  border-color: var(--blue);
  color: var(--blue);
}

.button.red.border {
  border-color: var(--red);
  color: var(--red);
}

.button span i {
  margin-left:10px;
}

.button.green.full {
  background-color: var(--green);
}

.button.dark-green.full {
  background-color: var(--dark-green);
}

/* Tablet */
@media (max-width: 991px){
  .button.blue.border span.text {
    display: none;
  }
  .button.blue.border span i {
    margin-left: 0;
  }
}


</style>
