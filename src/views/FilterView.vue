<script>
  import CloseIcon from "../components/icons/icon-close.vue";
  import Button from "../components/buttons/button.vue";
  import InputField from "../components/forms/InputField.vue";
  import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";
  import DeleteIcon from "@/components/icons/icon-delete.vue";

  export default {
    name: "FilterView",
    components: {DeleteIcon, CheckmarkIcon, InputField, Button, CloseIcon},
    data() {
      return {
        isOpenModal: false,
        isLoading: false,
        filters: [],
        selectedFilters: {},
        togglers: {
          'filter-internalGwgStatus': true,
          'filter-agent' : true,
          'filter-real-estates' : true,
          'filter-reservationStatus' : true,
          'filter-ndbStatus' : true,
          'filter-externalGwgStatus' : true,
          'filter-financeStatus' : true,
          'filter-kvStatus' : true,
          'filter-saleStatus' : true,
        },

        reservationStatus: ['Angelegt', 'Gemeldet', 'Bestätigt', 'Gebühr eingegangen', 'Reservierung'],
        ndbStatus: ['Angefragt', 'Ausgefüllt', 'Bestätigt', 'Gesendet an Covivio', 'An Essen gesendet', 'An Berlin gesendet'],
        abwicklungStatus: ['Angefragt', 'Ausgefüllt', 'Bestätigt'],
        kvStatus: ['An Kunden geschickt', 'Final hochgeladen', '14 Tage Countdown'],
        saleStatus: ['Eingereicht', 'Bestätigt', 'Abgeschlossen', 'Von Covivio unterschrieben'],
      }
    },
    methods: {
      closeModal(){
        this.apiResponseStatus = false;
        this.isOpenModal = false;
        this.redirectToHomeView();
      },
      detectFilters() {
        let allReservations = this.$parent.apiResponse;
        let allRealEstates = this.$parent.realEstateList;

        // Agentname filter & Status
        let reservationStatus = [];
        let agentsNames = [];
        for (const reservation of allReservations){
          agentsNames.push(reservation.real_estate_agent);
          reservationStatus.push(reservation.reservation_status);
        }
        let uniqueAgentNames = agentsNames.filter(onlyUnique);
        uniqueAgentNames = this.sortArrayAlphabetically(uniqueAgentNames);
        reservationStatus.sort(function(a,b){return a - b;});

        // Real estate filter
        let realEstates = [];
        for (const realEstate of allRealEstates){
          realEstates.push(realEstate);
        }
        let uniqueRealEstates = realEstates.filter(onlyUnique);
        uniqueRealEstates = this.sortArrayAlphabetically(uniqueRealEstates);

        // Card type filters
        let uniqueTypes = ['Reservierungen', 'Verkaufsmeldungen'];

        this.filters = {
          'agentNames': uniqueAgentNames,
          'realEstates': uniqueRealEstates,
          'reservationStatus': this.reservationStatus,
          'abwicklungStatus': this.abwicklungStatus,
          'ndbStatus': this.ndbStatus,
          'kvStatus': this.kvStatus,
          'saleStatus': this.saleStatus,
          'cardTypes': uniqueTypes,
        }

        let i = 0;
        for ( const index of uniqueAgentNames  ){
          this.selectedFilters['filter-agent-'+i] = {'selected': false, 'content': index};
          i += 1;
        }

        let a = 0;
        for ( const index of uniqueRealEstates  ){
          this.selectedFilters['filter-real-estates-'+a] = {'selected': false, 'content': index};
          a += 1;
        }

        let z = 0;
        for ( const index of this.filters.reservationStatus  ){
          this.selectedFilters['filter-reservationStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        z = 0;
        for ( const index of this.filters.ndbStatus  ){
          this.selectedFilters['filter-ndbStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        z = 0;
        for ( const index of this.filters.abwicklungStatus  ){
          this.selectedFilters['filter-externalGwgStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        z = 0;
        for ( const index of this.filters.abwicklungStatus  ){
          this.selectedFilters['filter-internalGwgStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        z = 0;
        for ( const index of this.filters.abwicklungStatus  ){
          this.selectedFilters['filter-financeStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        z = 0;
        for ( const index of this.filters.kvStatus  ){
          this.selectedFilters['filter-kvStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        z = 0;
        for ( const index of this.filters.saleStatus  ){
          this.selectedFilters['filter-saleStatus-'+z] = {'selected': false, 'content': index};
          z += 1;
        }

        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
      },
      setActiveFilters() {
        for ( const activeFilter of this.$parent.activeFilters ){
          this.selectedFilters[Object.keys(activeFilter)[0]].selected = true;
        }
      },
      resetFilters() {
        let allFilters = this.selectedFilters;
        for (const singleFilter in allFilters){
          this.selectedFilters[singleFilter].selected = false;
        }
        this.$parent.activeFilters = [];
      },
      executeFilters() {
        let allFilters = this.selectedFilters;
        let activeFilters = [];
        for (const singleFilter in allFilters){
          if ( this.selectedFilters[singleFilter].selected === true ){
            let obj = {};
            obj[singleFilter] = this.selectedFilters[singleFilter];
            activeFilters.push(obj);
          }
        }
        this.$parent.activeFilters = activeFilters;
        this.redirectToHomeView();
        this.isOpenModal = false;

      },
      selectAllFilters(filterCategory, filterRendering) {
        Object.entries(this.filters[filterRendering]).forEach(([index, value]) => {
          this.selectedFilters[filterCategory+'-'+index]['selected'] = this.togglers[filterCategory];
        });
        this.togglers[filterCategory] = !this.togglers[filterCategory];
      },
      formatAgentShortnameToReadableText(shortname) {
        let returnVal = this.getAgentsDataByShortname(shortname);
        if ( typeof returnVal === 'object' && ( typeof returnVal.user_Vorname !== 'undefined' || typeof returnVal.user_Nachname !== 'undefined' ) ){
          returnVal = returnVal.user_Vorname + ' ' + returnVal.user_Nachname;
        }
        return returnVal;
      }
    },
    watch: {
      $route(to, from){
        if ( to.name === 'filterView' ) {
          this.isOpenModal = true;
          this.isLoading = false;
          this.detectFilters();
          this.setActiveFilters();
        }
      }
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal, isLoading: isLoading }" v-if="isOpenModal">
    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <span class="title">Filter</span>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form class="all-filter">

          <div class="customer-filter">
            <span><b>Maklernamen:</b>
              <span style="cursor: pointer; margin-left: 5px;" :style="togglers['filter-agent'] ? 'color: var(--blue)' : 'color: var(--red)'"
                  @click="selectAllFilters('filter-agent', 'agentNames')">
                <CheckmarkIcon v-if="togglers['filter-agent']"></CheckmarkIcon>
                <CloseIcon v-else></CloseIcon>
                {{ togglers['filter-agent'] ? 'Alle' : 'Keine' }}
              </span>
            </span>
            <div class="field-wrapper" v-for="(name, index) in filters.agentNames">
              <input class="checkbox field" type="checkbox" :ref="'allCheckbox'" :id="'filter-agent-'+index" :name="'filter-agent-'+index" :value="selectedFilters['filter-agent-'+index]['selected']" v-model="selectedFilters['filter-agent-'+index]['selected']">
              <label :for="'filter-agent-'+index">
                {{ formatAgentShortnameToReadableText(name) }}
              </label>
            </div>
          </div>

          <div class="real-estates-filter">
            <span><b>Immobilien:</b>
              <span style="cursor: pointer; margin-left: 5px;" :style="togglers['filter-real-estates'] ? 'color: var(--blue)' : 'color: var(--red)'"
                    @click="selectAllFilters('filter-real-estates', 'realEstates')">
                <CheckmarkIcon v-if="togglers['filter-real-estates']"></CheckmarkIcon>
                <CloseIcon v-else></CloseIcon>
                {{ togglers['filter-real-estates'] ? 'Alle' : 'Keine' }}
              </span>
            </span>
            <div class="field-wrapper" v-for="(realEstateNr, index) in filters.realEstates">
              <input class="checkbox field" type="checkbox" :ref="'allCheckbox'" :id="'filter-real-estates-'+index" :name="'filter-real-estates-'+index" :value="selectedFilters['filter-real-estates-'+index]['selected']" v-model="selectedFilters['filter-real-estates-'+index]['selected']">
              <label :for="'filter-real-estates-'+index">{{ realEstateNr }}</label>
            </div>
          </div>

        </form>

        <div class="button-actions two-buttons">
          <div class="inner-button-wrapper">
            <Button type="edit" @click="resetFilters">Filter zurücksetzen</Button>
            <Button type="create reservation" @click="executeFilters">Filter anwenden</Button>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>


<style scoped>

.title {
  font-size: 18px;
  font-weight: 700;
}

.all-filter {
  margin: 25px 0;
}

.all-filter > div + div {
  margin-top: 20px;
}

.all-filter > div:nth-of-type(2) {
  margin-top: 0;
}

.button-actions.two-buttons .inner-button-wrapper {
  display: flex;
  justify-content: space-between;
}

.button-actions > .button {
  flex-basis: 100%;
}

.button-actions.two-buttons .inner-button-wrapper .button{
  flex-basis: 48%;
}

form {
  justify-content: space-between;
}

label {
  cursor: pointer;
}

.all-filter > div {
  flex-basis: 48%;
}

/* Mobile */
@media (max-width: 767px){
  .all-filter > div {
    flex-basis: 100%;
  }

  .all-filter > div + div, .all-filter > div:nth-of-type(2) {
    margin-top: 20px;
  }
}

</style>
