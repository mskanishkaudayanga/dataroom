<script>

import Navigation from "@/components/Navigation.vue";
import CanbanCard from "@/components/card/CanbanCard.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import axios from "axios";
import CloseIcon from "@/components/icons/icon-close.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import SearchIcon from "@/components/icons/icon-search.vue";
import FilterIcon from "@/components/icons/icon-filter.vue";
import InputField from "@/components/forms/InputField.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import Button from "@/components/buttons/button.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";

export default {
  name: 'canbanToolUnqualifiedLeads',
  components: {
    AnimateCircleIcon,
    Button,
    DropdownArrow,
    InputField,
    FilterIcon,
    SearchIcon,
    Dropdown,
    CloseIcon,
    PlusIcon, CanbanCard, Navigation},
  data() {
    return {
      apiAllLeadData: [],
      colorCode: [],
      isLoading: false,

      showSearchInput: true,
      searchInput: '',
      offset: 0,
    }
  },
  methods: {
    getAllLeads(loadMore = false) {
      if (this.isLoading) {
        return;
      }

      if ( !loadMore ) {
        this.offset = 0;
      }

      let dataToSend = {
        offset: this.offset,
        options: 'onlyUnqualified'
      }

      if ( typeof this.searchInput !== 'undefined' && this.searchInput !== null && this.searchInput !== '' ) {
        dataToSend.searchInput = this.searchInput;
      }

      this.isLoading = true;
      axios.post(this.globalApiBaseUrl + '/canban/filterAllLeads', dataToSend)
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  if ( !loadMore ) {
                    this.apiAllLeadData = response.data.response;
                  } else {
                    this.apiAllLeadData = [...this.apiAllLeadData, ...response.data.response];
                    this.notificationBannerInit('success', 'Es wurden <u>' + response.data.response.length + '</u> unqualifizierten Leads nachgeladen.');
                  }
                  this.offset = this.offset+1;
                } else {
                  this.notificationBannerInit('warning', 'Keine unqualifizierten Leads gefunden');
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten: '+error);
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
    },
    calcCanbanTitleHeight() {
      let height = 0;
      let unit = '';
      for (const key in this.$refs) {
        if (key.startsWith("title-")) {
          if ( height < this.$refs[key].offsetHeight ) {
            height = this.$refs[key].offsetHeight;
            unit = 'px';
          }
        }
      }

      if ( height === 0 ) {
        height = 'auto';
      }

      return {
        '--pseudoHeight': height + unit,
      }
    }
  },
  computed: {
    getLeadsWithStatusUnqualifiedCol1() {
      return this.apiAllLeadData.filter(obj => ( (obj['canban_remove_reason'] === 'undefined' || obj['canban_remove_reason'] === null || obj['canban_remove_reason'] === 'Kunde nicht erreichbar') ))
    },
    getLeadsWithStatusUnqualifiedCol2() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Kunde hat kein Interesse mehr');
    },
    getLeadsWithStatusUnqualifiedCol3() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Kunde ist Mietinteressent');
    },
    getLeadsWithStatusUnqualifiedCol4() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Kunde hat unrealistische Vorstellungen');
    },
    getLeadsWithStatusUnqualifiedCol5() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Keine adäquate Leerwohnung verfügbar');
    },
    getLeadsWithStatusUnqualifiedCol6() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Einheit nicht mehr verfügbar');
    },
    getLeadsWithStatusUnqualifiedCol7() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Kunde hat kein Interesse und möchte aus der Datenbank gelöscht werden');
    },
    getLeadsWithStatusUnqualifiedCol8() {
      return this.apiAllLeadData.filter(obj => obj['canban_remove_reason'] === 'Bearbeitungszeit abgelaufen');
    },
  },
  beforeMount() {
    this.getColorSchema();
  },
  mounted() {
    this.getAllLeads();
    this.dragToScroll();
    this.calcCanbanTitleHeight();
  },
  watch: {
    $route(to, from) {
      if ( to.name === 'canbanToolDeniedLeads' ) {
        this.getAllLeads();
      }
    },
    searchInput: function (val, oldVal) {

      if ( !this.showSearchInput ) {
        this.getAllLeads();
        this.searchIsLoading = false;
        return;
      }

      if ( val === '' ) {
        /**
         * Reset search
         */
        this.searchIsLoading = false;
        this.apiAllLeadData = this.getAllLeadsData();
      }

      this.searchIsLoading = true;
      if ( this.searchInputTimeout === null ) {
        this.searchInputTimeout = setTimeout(() => {
          /**
           * Search
           */
          this.getAllLeads();
          this.searchIsLoading = false;
        },2000);
      } else {
        window.clearTimeout(this.searchInputTimeout);
        this.searchInputTimeout = setTimeout(() => {
          /**
           * Search
           */
          this.getAllLeads();
          this.searchIsLoading = false;
        },2000);
      }
    },
  }
}

</script>

<template>
  <Navigation/>

  <div class="canban-wrapper">

    <div class="action-bar-top">
      <div class="action-bar-top-inner-wrapper">
        <div class="single-top-menu-item">
          <div class="field-wrapper canban-search" :class="{'active': showSearchInput}">
            <InputField inputName="searchInput" placeholder="Kundenname oder Nr. eingeben" inputType="text" :inputValue="searchInput" v-model="searchInput" v-if="showSearchInput && !isLoading"></InputField>
            <InputField inputName="searchInput" placeholder="Kundenname oder Nr. eingeben" inputType="text" :inputValue="searchInput" v-model="searchInput" disabled v-else></InputField>
            <AnimateCircleIcon v-if="searchInput !== '' && isLoading"></AnimateCircleIcon>
          </div>
        </div>
        <div class="load-more">
          <div class="field-wrapper">
            <Button type="create reservation" @click="this.getAllLeads(true)">mehr leads</Button>
          </div>
        </div>
      </div>
    </div>

    <div class="canban-inner-wrapper" :style="calcCanbanTitleHeight()">

      <div class="column">
        <div class="column-title" ref="title-1">
          Kunde nicht erreichbar <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol1.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol1" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title"  ref="title-2">
          Kunde hat kein Interesse mehr <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol2.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol2" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title" ref="title-3">
          Kunde ist Mietinteressent <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol3.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol3" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title" ref="title-4">
          Kunde hat unrealistische Vorstellungen <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol4.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol4" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title" ref="title-5">
          Keine adäquate Leerwohnung verfügbar <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol5.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol5" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title" ref="title-6">
          Einheit nicht mehr verfügbar <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol6.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol6" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title" ref="title-7">
          Kunde hat kein Interesse und möchte aus der Datenbank gelöscht werden <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol7.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol7" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

      <div class="column">
        <div class="column-title" ref="title-7">
          Bearbeitungszeit abgelaufen <span class="col-count">({{ getLeadsWithStatusUnqualifiedCol8.length }}) </span>
        </div>
        <CanbanCard type="unqualified" v-for="lead in getLeadsWithStatusUnqualifiedCol8" :leadData="lead" :colorSchema="colorCode"></CanbanCard>
      </div>

    </div>
  </div>

  <RouterView @reloadCanban="getAllLeads()" />

</template>

<style scoped>

.canban-wrapper {
  flex-wrap: wrap;
}

.canban-wrapper , .canban-inner-wrapper {
  display: flex;
  min-height: 100vh;
  cursor: grab;
}

.column {
  flex-basis: 25%;
  min-width: 400px;
}


.column-title {
  background-color: var(--dark-gray);
  padding: 30px;
  text-align: center;
  font-size: 16px;
  color: white;
  min-height: var(--pseudoHeight);
}

.action-bar-top {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
  align-items: center;
  padding: 15px 25px;
  background-color: var(--dark-gray);
  border-bottom: solid 1px rgba(255,255,255,0.2);
}

.action-bar-top {
  position:sticky;
  top:0;
  z-index: 2;
}

.action-bar-top-inner-wrapper {
  display: flex;
  color: white;
}

.action-bar-top-inner-wrapper a,
.action-bar-top-inner-wrapper a > span {
  display: flex;
  align-items: center;
}

a {
  cursor: pointer;
}

.action-bar-top-inner-wrapper a + a {
  margin-left: 35px;
}

.action-bar-top-inner-wrapper i {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  background: var(--blue);
  border-radius: 50%;
  text-align: center;
  margin-right: 10px;
}

.action-bar-top-inner-wrapper a.filter i {
  font-size: 12px;
}

.single-top-menu-item {
  display: flex;
  margin-left: 35px;
  cursor: pointer;
}

.single-top-menu-item > span {
  display: flex;
  align-items: center;
}

.single-top-menu-item .field-wrapper {
  margin-left:15px;
}

.single-top-menu-item .field-wrapper input {
  width: 0;
  padding: 12px 0;
  border-width: 0;
  transition: width 0.2s, padding 0.2s;
}

.single-top-menu-item .field-wrapper.active input {
  width: 300px;
  padding: 12px 10px;
}

::placeholder {
  color: var(--light-gray);
  opacity: 1; /* Firefox */
}

.ph {
  background: transparent;
}

.canban-search .loading-animation {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  margin-top: 0;
  color: white;
}

.load-more {
  margin-left: 25px;
}

</style>
