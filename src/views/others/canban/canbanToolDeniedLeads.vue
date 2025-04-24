<script>

import Navigation from "@/components/Navigation.vue";
import CanbanCard from "@/components/card/CanbanCard.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import axios from "axios";

export default {
  name: 'canbanToolDeniedLeads',
  components: {PlusIcon, CanbanCard, Navigation},
  data() {
    return {
      apiAllLeadData: [],
      colorCode: [],
      isLoading: false,
    }
  },
  methods: {
    getAllLeads() {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      axios.get(this.globalApiBaseUrl + '/canban/getAllLeads?options=onlyDenied')
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                 this.apiAllLeadData = response.data.response;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    getColorSchema() {

      axios.get('https://leads.bestplace-immobilien.de/wp-json/api/v2/getColorSchema')
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  this.colorCode = response.data.response;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          )
    },
    dragToScroll() {
      const appWindow = document.querySelector('#app');
      let isDown = false;
      let startX;
      let scrollLeft;

      appWindow.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - appWindow.offsetLeft;
        scrollLeft = appWindow.scrollLeft;
      });
      appWindow.addEventListener('mouseleave', () => {
        isDown = false;
      });
      appWindow.addEventListener('mouseup', () => {
        isDown = false;
      });
      appWindow.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - appWindow.offsetLeft;
        const walk = (x - startX); //scroll-fast
        appWindow.scrollLeft = scrollLeft - walk;
      });
    }
  },
  computed: {
    getLeadsWithStatusDenied() {
      return this.apiAllLeadData.filter(obj => parseInt(obj['canban_status']) === -1);
    },
  },
  beforeMount() {
    this.getColorSchema();
  },
  mounted() {
    this.getAllLeads();
    this.dragToScroll();
  },
  watch: {
    $route(to, from) {
      if ( to.name === 'canbanToolDeniedLeads' ) {
        this.getAllLeads();
      }
    },
  }
}

</script>

<template>
  <Navigation/>

  <div class="canban-wrapper">
    <div class="canban-inner-wrapper">

      <div class="column">
        <div class="column-title">
          Verweigerte Leads <span class="col-count">({{ getLeadsWithStatusDenied.length }}) </span>
        </div>
        <CanbanCard type="denied" v-for="lead in getLeadsWithStatusDenied" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>
    </div>
  </div>

  <RouterView @reloadCanban="getAllLeads" />

</template>

<style scoped>

.canban-wrapper , .canban-inner-wrapper {
  display: flex;
  min-width: 100%;
  cursor: grab;
}

.column {
  flex-basis: 100%;
}

.column-title {
  background-color: var(--dark-gray);
  padding: 30px;
  text-align: center;
  font-size: 16px;
  color: white;
}

</style>
