<script>

import Navigation from "@/components/Navigation.vue";
import CanbanCard from "@/components/card/CanbanCard.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import axios from "axios";
import {leadsStore} from "@/stores/leadsStore";
import Button from "@/components/buttons/button.vue";
import FilterIcon from "@/components/icons/icon-filter.vue";
import CloseIcon from "@/components/icons/icon-close.vue";
import {userRolesStore} from "@/stores/userRoleStore";
import {leadsQualifiedStore} from "@/stores/leadsQualifiedStore";
import SearchIcon from "@/components/icons/icon-search.vue";
import InputField from "@/components/forms/InputField.vue";
import DeleteIcon from "@/components/icons/icon-delete.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import {leadsFilterStore} from "@/stores/leadsFilterStore";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import PatchnotesIcon from "@/components/icons/icon-patchnote.vue";

export default {
  name: 'canbanTool',
  components: {
    Dropdown, DropdownArrow, AsterixMarkIcon,
    AnimateCircleIcon,
    DeleteIcon, InputField, SearchIcon, CloseIcon, FilterIcon, Button, PlusIcon, CanbanCard, Navigation, PatchnotesIcon},
  data() {
    return {
      apiAllLeadData: [],
      apiSearchedLeadData: [],
      colorCode: [],

      userRole: 4,
      canbanWidth: window.innerWidth,
      isLoading: false,

      navHeight: 80,

      showSearchInput: true,
      searchInput: '',
      searchInputTimeout: null,
      searchIsLoading: false,

      triggerNoticeReload: '',
      triggerReloadCustomerData: {
        trigger: '',
        customerSysId: '',
      },

      customerWithOpenMergesRequests: [],

      initDefaultFilters: {
        company: this.getUserRole() === 4 || this.kgAgentsForCockpit.includes(this.getUserMail()) ? 'all' : this.getUserCompany(),
        agents: [],
        projects: [],
        source: [],
      },

      defaultFilters: {
        company: this.getUserRole() === 4 || this.kgAgentsForCockpit.includes(this.getUserMail()) ? 'all' : this.getUserCompany(),
        agents: [],
        projects: [],
        source: [],
      },

      timeRangeSelectionInDays: 'Alle',
      timeRanges: [
        'letzte 7 Tage',
        'letzte 14 Tage',
        'letzte 30 Tage',
        'Alle',
      ],

      isInitialLoad: true,

      dropdowns: {
        timerange: false,
      },
      dropdownRelativePosition: false,

      leadInitCount: {
        leads: 0,
        followup: 0,
        wv: 0,
      },

      filtersIsActive: false,

    }
  },
  methods: {
    getAllLeads(loadMore = false) {

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;

      const storeFilters = leadsFilterStore();
      let offset = storeFilters.getOffset;

      if ( loadMore ) {
        offset += 1;
        storeFilters.setOffset(offset);
      }

      let allFilters = this.getAllLeadsFilterData();

      let dataToSend = {
        filters: allFilters,
        offset: offset,
      }

      this.checkIfFiltersActive();

      if ( typeof this.searchInput !== 'undefined' && this.searchInput !== null && this.searchInput !== '' ) {
        dataToSend.searchInput = this.searchInput;
      }

      axios.post(this.globalApiBaseUrl + '/canban/filterAllLeads', dataToSend)
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  const store = leadsStore();
                  if ( !loadMore ) {
                    store.setAllLeads(response.data.response);
                    this.apiAllLeadData = response.data.response;
                    this.globalStoreQualifiedLeads(this.getLeadsForQualified);
                    if ( this.isInitialLoad ) {
                      store.setInitialLeads(response.data.response);
                    }
                  } else {
                    // merge incoming data with existing data
                    store.setAllLeads([...store.getAllLeads, ...response.data.response] );
                    this.apiAllLeadData = [...this.apiAllLeadData, ...response.data.response];
                    this.globalStoreQualifiedLeads(this.getLeadsForQualified, true);
                    this.notificationBannerInit('success', 'Es wurden <u>' + response.data.response.length + '</u> Leads nachgeladen.');
                  }
                  // this.checkIfCustomerSearchCriteriaMergeOpen();
                } else {
                  this.notificationBannerInit('warning', !loadMore ? 'Keine Leads gefunden' : 'Keine weiteren Leads gefunden');
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Ein Problem ist aufgetreten: '+error);
              }
          ).finally(
          () => {
            this.isInitialLoad = false;
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
      const appWindow = document.body;
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
        // console.log(scrollLeft - walk);
        appWindow.scrollLeft = scrollLeft - walk;
        window.scrollBy(scrollLeft - walk, 0);
      });
    },
    checkForAppointment(object) {
      if ( typeof object.termin !== 'undefined' && object.termin !== null  && object.termin !== '' ) {
        let date = object.termin.split(" ")[0];
        let dateSplit = date.split(".");
        let dateENFormat = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0] + ' ' + object.termin.split(" ")[1];
        let formatedDate = new Date(dateENFormat);
        const currentDate = new Date();
        if (formatedDate < currentDate) {
          //The date is in the past
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    checkForTimeRange(object) {
      const targetDate = new Date(object.datum_letzte_aenderung);

      const currentDate = new Date();

      if ( this.timeRangeSelectionInDays === 'Alle' ) {
        return true;
      } else {
        let timeRangeInt = parseInt(this.timeRangeSelectionInDays.replace(/\D/g, ''));
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - timeRangeInt);

        if (targetDate >= sevenDaysAgo) {
          return true;
        }
        return false;
      }

    },
    checkIfIsOnWV(object) {
      if ( typeof object.canban_wv_datetime === 'undefined' || object.canban_wv_datetime === '' || object.canban_wv_datetime === null ) {
        return false;
      }
      return true;
    },
    checkIfIsNotaryAppointment(object) {
      if ( typeof object['cockpit_reservation_data'] !== 'undefined' && object['cockpit_reservation_data'] !== null ) {
        // Check for cockpit reservations
        if (object['cockpit_reservation_data']['kv_notartermin_date'] !== '' && object['cockpit_reservation_data']['kv_notartermin_date'] !== null ) {
          return true;
        }
      } else if ( typeof object['canban_temp_reservation_id'] !== 'undefined' && object['canban_temp_reservation_id'] !== null && object['canban_temp_reservation_id'] !== '') {
        // Check for temp reservations
        if (object['notary_appointment_ids'] !== '' && object['notary_appointment_ids'] !== null ) {
          return true;
        }
      }
      return false;
    },
    checkIfIsReserved(object) {
      if ( typeof object['canban_temp_reservation_id'] !== 'undefined' && object['canban_temp_reservation_id'] !== null && object['canban_temp_reservation_id'] !== '') {
          return true;
      }
      return false;
    },
    checkIfWVisInFuture (object) {
      if ( object.canban_wv_datetime !== 'undefined' && object.canban_wv_datetime !== '' ) {
        let date = object.canban_wv_datetime + ' 00:00';
        let formatedDate = new Date(date);
        const currentDate = new Date();
        if (formatedDate < currentDate) {
          //The date is in the past
          return false;
        } else {
          return true;
        }
      }
    },
    calcCanbanWidth() {
      let width = 0;
      for (let i = 1; i < 8; i++) {
        if ( typeof this.$refs['col-'+i] !== undefined ) {
          width += this.$refs['col-'+i].offsetWidth;
        }
      }
      this.canbanWidth = width;
    },
    globalStoreQualifiedLeads(leads, mergeData = false) {
      if ( leads === 'undefined' || leads.length === 0 ) {
        return;
      }
      const store = leadsQualifiedStore();
      let ids = [];
      if ( mergeData ) {
        ids = store.getQualifiedLeadsCustomerSysIds
      }
      leads.forEach(lead => {
        ids.push(lead.adresse_id);
      });
      let uniqueIds = [...new Set(ids)];
      store.setQualifiedLeadsCustomerSysIds(uniqueIds);
    },
    navHeightCalc(data) {
      this.navHeight = data;
    },
    triggerReloadNotice() {
      this.triggerNoticeReload = this.makeid(20);
    },
    triggerReloadCustomer(data) {
      this.triggerReloadCustomerData.trigger = this.makeid(20);
      this.triggerReloadCustomerData.customerSysId = data;
    },
    resetFilters() {
      let store = leadsFilterStore();
      store.setLeadFilter(this.initDefaultFilters);
      store.setOffset(0);
      this.checkIfFiltersActive();
      this.getAllLeads();
    },
    dropdownClick(field, clickedText) {
      this.$data[field] = clickedText;
      this.closeDropdowns();
    },
    closeDropdowns() {
      for( const dropdown in this.dropdowns ) {
        this.dropdowns[dropdown] = false;
      }
    },
    setDropdownTop($event) {
      const eleName = $event.target.name;
      const additionalSpace = 5;
      if ( this.$refs['input'+eleName] !== undefined ) {
        this.$refs['dropdown'+eleName].$el.style.top = this.$refs['input'+eleName].$el.clientHeight + additionalSpace + 'px';
      }
      if ( !this.isInViewport(this.$refs['dropdown'+eleName].$el) ) {
        this.dropdownRelativePosition = true;
        this.$refs['dropdown'+eleName].$el.style.top = '0px';
      } else {
        this.dropdownRelativePosition = false;
      }
    },
    checkIfFiltersActive() {
      const store = leadsFilterStore();
      let allFilters = store.getLeadFilter;
      this.filtersIsActive = JSON.stringify(this.initDefaultFilters) !== JSON.stringify(allFilters)
    },
    checkIfCustomerSearchCriteriaMergeOpen() {

      const store = leadsStore();
      const allLeads = store.getAllLeads;

      if ( typeof allLeads === 'undefined' || this.isEmpty(allLeads) ) {
        return;
      }

      let addressData = [];
      let existingIds = [];
      for ( let i in allLeads ) {

        const id = parseInt(allLeads[i].adresse_customer_nr)

        if ( existingIds.includes(id) ) {
          continue;
        }

        existingIds.push(id)

        addressData.push({
          company: allLeads[i].unternehmen,
          addressCustomerNr: parseInt(id),
        });

      }

      let dataToSend = {
        data: {
          address_data: addressData
        }
      }

      console.log(dataToSend)

      axios.post(this.globalApiMicroserviceBaseUrl + '/searchcriteria/open-merges/all', dataToSend)
          .then(
              (response) => {
                if ( response.status === 200 ){
                  this.customerWithOpenMergesRequests = response.data;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          )
    }
  },
  computed: {
    getLeadsWithStatus0() {
      let leads = this.apiAllLeadData.filter(obj => parseInt(obj['canban_status']) === 0 && !this.checkForAppointment(obj) && !this.checkIfIsUnqualifiedLeadLead(obj) );
      this.leadInitCount.leads = leads.length;
      leads = leads.filter(obj => this.checkForTimeRange(obj));
      return leads;
    },
    getLeadsForFollowUpCol() {
      let leads = this.apiAllLeadData.filter(obj => ( parseInt(obj['canban_status']) === 1 && !this.checkIfIsUnqualifiedLeadLead(obj) && ((obj['canban_wv_datetime'] === '' || obj['canban_wv_datetime'] === null) && !this.checkForAppointment(obj)) && !this.checkIfIsReserved(obj) ));
      this.leadInitCount.followup = leads.length;
      leads = leads.filter(obj => this.checkForTimeRange(obj));
      return leads;
    },
    getLeadsWithAppointment() {
      return this.apiAllLeadData.filter(obj => ( this.checkForAppointment(obj) && !this.checkIfIsUnqualifiedLeadLead(obj) ));
    },
    getLeadsForQualified() {
      return this.apiAllLeadData.filter(obj => ( parseInt(obj['canban_status']) === 2 && !this.checkForAppointment(obj) && !this.checkIfIsOnWV(obj) && !this.checkIfIsUnqualifiedLeadLead(obj) && !this.checkIfIsReserved(obj) ));
    },
    getLeadsWithReservation() {
      return this.apiAllLeadData.filter(obj => ( !this.checkIfIsNotaryAppointment(obj) && this.checkIfIsReserved(obj) ));
    },
    getLeadsWithNotartermin() {
      return this.apiAllLeadData.filter(obj => ( this.checkIfIsNotaryAppointment(obj) && (parseInt(obj['temp_reservation_status']) !== 2) ));
    },
    getLeadsWithSale() {
      return this.apiAllLeadData.filter(obj => ( (parseInt(obj['temp_reservation_status']) >= 2) ));
    },
    getLeadsForWV() {
      let leads = this.apiAllLeadData.filter(obj => (  parseInt(obj['canban_status']) !== 3 && obj['canban_wv_datetime'] !== '' && obj['canban_wv_datetime'] !== null && this.checkIfWVisInFuture(obj) && !this.checkIfIsUnqualifiedLeadLead(obj) ));
      this.leadInitCount.wv = leads.length;
      leads = leads.filter(obj => this.checkForTimeRange(obj));
      return leads;
    },
  },
  beforeMount() {
    this.getColorSchema();
  },
  mounted() {
    this.dragToScroll();
    this.userRole = this.getUserRole();

    // Set filter to user settings on mount so we can detect roles
    const store = leadsFilterStore();
    const userStore = userRolesStore();
    if ( userStore.getUserRoles.includes('administrator_kg') ) {
      this.defaultFilters.company = 'kg';
      this.defaultFilters.agents = [userStore.getUserOoUsername];
    } else if ( userStore.getUserRoles.includes('administrator_living') ) {
      this.defaultFilters.company = 'living';
      this.defaultFilters.agents = [userStore.getUserOoUsername];
    } else if ( userStore.getUserRoles.includes('administrator') ) {
      this.defaultFilters.company = 'all';
      this.defaultFilters.agents = [userStore.getUserOoUsername];
    } else {
      this.defaultFilters.company = userStore.getUserCompany;
    }

    // For double agents
    if ( this.CanbanDoubleCompanyAgent.includes(userStore.getUserOoUsername) || this.kgAgentsForCockpit.includes(this.getUserMail()) ) {
      this.defaultFilters.company = 'all';
      this.initDefaultFilters.company = 'all';
    }

    store.setLeadFilter(this.defaultFilters);
    this.checkIfFiltersActive();
    this.getAllLeads();
  },
  watch: {
    apiAllLeadData: {
      handler: function (val, oldVal) {
        this.calcCanbanWidth();
      },
      deep: true
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

  <Navigation @navigationHeight="navHeightCalc"/>

  <div class="canban-wrapper" :style="{ '--pseudoMarginTop':navHeight+'px'}">

    <div class="action-bar-top">

      <div class="action-bar-top-inner-wrapper">
        <router-link class="filter" :to="{name: 'canbanModalFilters'}">
          <span><FilterIcon></FilterIcon> Filter</span>
        </router-link>
        <router-link class="create" :to="{name: 'canbanModalCreateLead'}" data-cy="create-lead">
          <span><PlusIcon></PlusIcon> Lead erstellen</span>
        </router-link>
        <router-link class="filter" :to="{name: 'canbanToolDeniedLeads'}" v-if="userRole >= 4">
          <span><CloseIcon></CloseIcon> Verweigerte Leads</span>
        </router-link>
        <router-link class="filter" :to="{name: 'canbanToolUnqualifiedLeads'}">
          <span><CloseIcon></CloseIcon> Unqualifizierte Leads</span>
        </router-link>
        <div class="single-top-menu-item">
          <span @click="showSearchInput === true ? searchInput = '' : ''; showSearchInput = !showSearchInput">
            <SearchIcon v-if="!showSearchInput"></SearchIcon>
            <CloseIcon v-else></CloseIcon>
            <span>{{ !showSearchInput ? 'Suchen' : 'Schließen'}}</span>
          </span>
          <div class="field-wrapper canban-search" :class="{'active': showSearchInput}">
            <InputField inputName="searchInput" placeholder="Kundenname oder Nr. eingeben" inputType="text" :inputValue="searchInput" v-model="searchInput" v-if="showSearchInput && !isLoading"></InputField>
            <InputField inputName="searchInput" placeholder="Kundenname oder Nr. eingeben" inputType="text" :inputValue="searchInput" v-model="searchInput" disabled v-else></InputField>
            <AnimateCircleIcon v-if="showSearchInput && isLoading"></AnimateCircleIcon>
          </div>
        </div>
      </div>
      <div class="timerange-selection">
        <div class="field-wrapper">
          <Button type="create reservation" @click="this.getAllLeads(true)">mehr leads</Button>
        </div>
      </div>
      <div class="timerange-selection">
        <div class="field-wrapper">
          <InputField class="dropdown-input" ref="Timerange" inputType="text" inputPlaceholder="Timerange" inputName="Timerange" :inputValue="timeRangeSelectionInDays" v-model="timeRangeSelectionInDays" @focus="setDropdownTop($event)" @click="dropdowns.timerange = !dropdowns.timerange" @click.stop=""></InputField>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimerange" :class="{active: dropdowns.timerange, relative: dropdownRelativePosition}" type="country" :renderingObject="timeRanges" @dropdown-item-clicked="dropdownClick('timeRangeSelectionInDays', $event)" @click.stop=""></Dropdown>
        </div>
      </div>
      <div class="patch-notes">
        <Button type="edit" @click="this.patchNotesInit">
          <PatchnotesIcon></PatchnotesIcon>
          Patch notes
        </Button>
      </div>
      <div class="remove-active-filters" @click="resetFilters" v-if="filtersIsActive">
        <span>
          <CloseIcon></CloseIcon>
          Filter zurücksetzen
        </span>
      </div>
    </div>

    <div class="canban-inner-wrapper">

      <div class="loading-screen" v-if="isLoading">
        <AnimateCircleIcon></AnimateCircleIcon>
      </div>

      <div class="column" ref="col-1" data-cy="col-leads">
        <div class="column-title">
          Leads <span class="col-count">({{ getLeadsWithStatus0.length }} / {{leadInitCount.leads}}) </span>
        </div>
        <TransitionGroup name="fadein">
          <CanbanCard type="lead" v-for="lead in getLeadsWithStatus0" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests" @reloadCanban="getAllLeads()"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-2" data-cy="col-followup">
        <div class="column-title">Nachfassen <span class="col-count">({{ getLeadsForFollowUpCol.length }} / {{leadInitCount.followup}}) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="lead" v-for="lead in getLeadsForFollowUpCol" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-3" data-cy="col-appointment">
        <div class="column-title">Termine <span class="col-count">({{ getLeadsWithAppointment.length }} / {{ getLeadsWithAppointment.length }}) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="appointment" v-for="lead in getLeadsWithAppointment" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-4" data-cy="col-qualified">
        <div class="column-title">Qualifiziert <span class="col-count">({{ getLeadsForQualified.length }} / {{ getLeadsForQualified.length }}) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="qualified" v-for="lead in getLeadsForQualified" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-5" data-cy="col-reservation">
        <div class="column-title">Reservierung <span class="col-count">({{ getLeadsWithReservation.length }} / {{ getLeadsWithReservation.length }}) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="reserved" v-for="lead in getLeadsWithReservation" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-6" data-cy="col-notaryappointment">
        <div class="column-title">Notartermin <span class="col-count">({{ getLeadsWithNotartermin.length }} / {{ getLeadsWithNotartermin.length }} ) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="notaryappointment" v-for="lead in getLeadsWithNotartermin" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-7" data-cy="col-notaryappointment">
        <div class="column-title">Verkäufe <span class="col-count">({{ getLeadsWithSale.length }} / {{ getLeadsWithSale.length }}) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="sale" v-for="lead in getLeadsWithSale" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadNotices="triggerNoticeReload" :triggerReloadCustomerData="triggerReloadCustomerData" :notificationsForSearchCriteriaMerge="customerWithOpenMergesRequests"></CanbanCard>
        </TransitionGroup>
      </div>
      <div class="column" ref="col-8" data-cy="col-wv">
        <div class="column-title">Wiedervorlage <span class="col-count">({{ getLeadsForWV.length }} / {{ leadInitCount.wv }}) </span></div>
        <TransitionGroup name="fadein">
          <CanbanCard type="wv" v-for="lead in getLeadsForWV" :leadData="lead" :key="lead.aktivititaet_id" :colorSchema="colorCode" :triggerReloadCustomerData="triggerReloadCustomerData"></CanbanCard>
        </TransitionGroup>
      </div>
    </div>
  </div>

  <RouterView @reloadCanban="getAllLeads()" @reloadNotice="triggerReloadNotice" @reloadCustomerData="triggerReloadCustomer"/>

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

.action-bar-top {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
  align-items: center;
  padding: 25px;
  background-color: var(--dark-gray);
  border-bottom: solid 1px rgba(255,255,255,0.2);
}

.column-title {
  position: sticky;
  top: 90px;
  background-color: var(--dark-gray);
  padding: 10px 30px 30px;
  text-align: center;
  font-size: 16px;
  color: white;
  min-width: 220px;
  z-index: 1;
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

.remove-active-filters {
  flex-basis: 100%;
  color: var(--red);
  cursor: pointer;
}

.loading-screen {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999999;
  background: rgba(255,255,255,.9);
}

.loading-screen .loading-animation {
  position: fixed;
  left: 50%;
  top: 50%;
  font-size: 50px;
}

.timerange-selection {
  margin-left: 10px;
}

.timerange-selection + .timerange-selection {
  margin-left: 25px;
}

.timerange-selection .title {
  color: white;
}

.patch-notes .button.blue.border, .cache-reload .button.blue.border {
  color: white;
  border-color: white;
  margin-left: 15px;
  padding: 8px 25px;
}

@media (max-width: 767px) {
  .canban-wrapper {
    margin-top: var(--pseudoMarginTop);
  }
}

</style>
