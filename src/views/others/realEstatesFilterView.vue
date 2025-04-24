<script>
import CloseIcon from "@/components/icons/icon-close.vue";
import Button from "@/components/buttons/button.vue";
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";

export default {
  name: "realEstatesFilterView",
  components: {AnimateCircleIcon, InputField, Button, CloseIcon, Dropdown, DropdownArrow},
  props: {
    countedUnits: {
      type: Number,
      default: 0
    },
    resetTrigger: {
      type: String,
      default: ''
    },
    searchCriteriaFilter: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isOpenModal: false,
      isLoading: false,

      isLoadingFiltering: false,
      alreadyFiltered: false,

      searchInputDistrict: '',
      searchInputCityPart: '',

      searchInputCounty: '', // external agents only
      searchInputCity: '', // external agents only

      selectedFilters: {
        usageKind: 'Wohnen',
        sellStatus: ['Verfügbar'],
        type: ['Alle'],
        budget: {
          from: '',
          to: ''
        },
        rentStatus: ['Bezugsfrei / Bezugsfertig', 'Im Bau'],
        condition: 'Beides',
        rooms: {
          from: '',
          to: ''
        },
        squareMeter: {
          from: '',
          to: ''
        },
        floor: {
          from: '',
          to: ''
        },
        balcony: false,
        terrace: false,
        garden: false,
        lift: false,
        basement: false,
        parkingSlot: false,
        constructionYear: {
          from: '',
          to: ''
        },
        yield: {
          from: '',
          to: ''
        },
        commissionFree: false,
        noRenterProtection: false,
        searchArea: 'all',
        roughSearchArea: [],
        district: ['Alle'],
        localPart: ['Alle'],
        inTrainArea: false,
        county: ['Alle'], // only external agents
        city: ['Alle'], // only external agents
        availableFrom: '',
      },

      dropdownRelativePosition: false,
      showDropdowns: {
        usageKind: false,
        sellStatus: false,
        type: false,
        rentStatus: false,
        district: false,
        floorFrom: false,
        floorTo: false,
        districtPart: false,
        condition: false,
        county: false, // only external agents
        city: false, // only external agents
      },

      dropdownLists: {
        floor: {
          'KG': 'KG',
          'UG': 'UG',
          'SOUT': 'SOUT',
          'EG': 'EG',
          'HOCH': 'HOCH',
          '1.OG': '1.OG',
          '2.OG': '2.OG',
          '3.OG': '3.OG',
          '4.OG': '4.OG',
          '5.OG': '5.OG',
          '6.OG': '6.OG',
          '7.OG': '7.OG',
          '8.OG': '8.OG',
          '9.OG': '9.OG',
          '10.OG': '10.OG',
        },
        usageKindList: {
          'Alle': 'Alle',
          'Wohnung': 'Wohnen',
          'Haus': 'Gewerbe',
          'Parken': 'Parken',
        },
        sellStatus: {
          'Alle': 'Alle',
          'Verfügbar': 'Verfügbar',
          'Reserviert': 'Reserviert',
          'Verkauft': 'Verkauft',
          'Vertriebsstopp': 'Vertriebsstopp',
        },
        realEstateType: {
          'Alle': 'Alle',
          'Rohdachboden': 'Rohdachboden',
          'Hochparterre-Wohnung': 'Hochparterre-Wohnung',
          'DG-Wohnung': 'DG-Wohnung',
          'Maisonette': 'Maisonette',
          'Loft/Studio/Atelier': 'Loft/Studio/Atelier',
          'Penthouse': 'Penthouse',
          'Terrassen-Wohnung ': 'Terrassen-Wohnung',
          'Etagenwohnung': 'Etagenwohnung',
          'EG-Wohnung': 'EG-Wohnung',
          'Souterrain': 'Souterrain',
          'Reihenhaus': 'Reihenhaus',
          'Doppelhaushälfte': 'Doppelhaushälfte',
          'Einfamilienhaus': 'Einfamilienhaus',
        },
        rentStatus: {
          'Alle': 'Alle',
          'Vermietet': 'Vermietet',
          'Bezugsfrei / Bezugsfertig': 'Bezugsfrei / Bezugsfertig',
          'Im Bau': 'Im Bau',
        },
        condition: {
          'Beides': 'Beides',
          'Neubau': 'Neubau',
          'Bestand': 'Bestand',
        },
        districtWithParts: {
          'Alle': ['Alle'],
          'Mitte': [
            'Mitte',
            'Moabit',
            'Hansaviertel',
            'Tiergarten',
            'Wedding',
            'Gesundbrunnen'
          ],
          'Friedrichshain-Kreuzberg': [
            'Friedrichshain',
            'Kreuzberg'
          ],
          'Pankow': [
            'Prenzlauer-Berg',
            'Weißensee',
            'Blankenburg',
            'Heinersdorf',
            'Karow',
            'Stadtrandsiedlung-Malchow',
            'Pankow',
            'Blankenfelde',
            'Buch',
            'Französisch-Buchholz',
            'Niederschönhausen',
            'Rosenthal',
            'Wilhelmsruh',
          ],
          'Charlottenburg-Wilmersdorf': [
            'Charlottenburg',
            'Wilmersdorf',
            'Schmargendorf',
            'Grunewald',
            'Westend',
            'Charlottenburg-Nord',
            'Halensee',
          ],
          'Spandau': [
            'Spandau',
            'Haselhorst',
            'Siemensstadt',
            'Staaken',
            'Gatow',
            'Kladow',
            'Hakenfelde',
            'Falkenhagener-Feld',
            'Wilhelmstadt'
          ],
          'Steglitz-Zehlendorf': [
            'Steglitz',
            'Lichterfelde',
            'Lankwitz',
            'Zehlendorf',
            'Dahlem',
            'Nikolassee',
            'Wannsee',
            'Schlachtensee'
          ],
          'Tempelhof-Schöneberg': [
            'Schöneberg',
            'Friedenau',
            'Tempelhof',
            'Mariendorf',
            'Marienfelde',
            'Lichtenrade'
          ],
          'Neukölln': [
            'Neukölln',
            'Britz',
            'Buckow',
            'Rudow',
            'Gropiusstadt'
          ],
          'Treptow-Köpenick': [
            'Alt-Treptow',
            'Plänterwald',
            'Baumschulenweg',
            'Johannisthal',
            'Niederschöneweide',
            'Altglienicke',
            'Adlershof',
            'Bohnsdorf',
            'Oberschöneweide',
            'Köpenick',
            'Friedrichshagen',
            'Rahnsdorf',
            'Grünau',
            'Müggelheim',
            'Schmöckwitz'
          ],
          'Marzahn-Hellersdorf': [
            'Marzahn',
            'Biesdorf',
            'Kaulsdorf',
            'Mahlsdorf',
            'Hellersdorf'
          ],
          'Lichtenberg': [
            'Friedrichsfelde',
            'Karlshorst',
            'Lichtenberg',
            'Falkenberg',
            'Malchow',
            'Wartenberg',
            'Neu-Hohenschönhausen',
            'Alt-Hohenschönhausen',
            'Fennpfuhl',
            'Rummelsburg',
          ],
          'Reinickendorf': [
            'Reinickendorf',
            'Tegel',
            'Konradshöhe',
            'Heiligensee',
            'Frohnau',
            'Hermsdorf',
            'Waidmannslust',
            'Lübars',
            'Wittenau',
            'Märkisches-Viertel',
            'Borsigwalde',
          ],
        },
        countiesAndCities: {
          'Alle': ['Alle'],
          'Bayern': [
            'München',
            'Karlsfeld'
          ],
          'Berlin': [
            'Berlin',
          ],
          'Brandenburg': [
            'Falkensee',
            'Potsdam',
            'Vogelsdorf'
          ],
          'Hessen': [
            'Frankfurt a.M.',
            'Wiesbaden',
            'Hattersheim'
          ],
          'Mecklenburg-Vorpommern': [
            'Sassnitz'
          ],
        }
      },

      timeout: null,
    }
  },
  methods: {
    closeModal(){
      this.apiResponseStatus = false;
      this.isOpenModal = false;
      this.redirectToFilterToolView();
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
    closeDropdowns() {
      for (const [key, value] of Object.entries(this.showDropdowns)) {
        this.showDropdowns[`${key}`] = false;
      }
    },
    dropdownSelectClickUsage(clickedText) {
      this.selectedFilters.usageKind = clickedText;
      this.closeDropdowns();
    },
    dropdownSelectClicksellStatus(clickedText) {
      if ( clickedText === 'Alle' ){
        this.selectedFilters.sellStatus = ['Alle'];
      } else if (this.selectedFilters.sellStatus.includes(clickedText)){
        this.removeMultiFilterSelection(clickedText, 'sellStatus');
      } else {
        this.selectedFilters.sellStatus.push(clickedText);
        this.selectedFilters.sellStatus = [...new Set(this.selectedFilters.sellStatus)]
        let counter = 0;
        for (const item of this.selectedFilters.sellStatus){
          if ( item === 'Alle' ){
            this.selectedFilters.sellStatus.splice(counter, 1)
          }
          counter += 1;
        }
      }
      this.closeDropdowns();
    },
    dropdownSelectClickType(clickedText) {

      if ( clickedText === 'Hochparterre-Wohnung' ){
        clickedText = 'Hochparterre';
      } else if( clickedText === 'DG-Wohnung' ){
        clickedText = 'Dachgeschoss';
      } else if( clickedText === 'Terrassen-Wohnung' ){
        clickedText = 'Terrasse';
      } else if( clickedText === 'EG-Wohnung' ){
        clickedText = 'Erdgeschoss';
      }

      if ( clickedText === 'Alle' ){
        this.selectedFilters.type = ['Alle'];
      } else if (this.selectedFilters.type.includes(clickedText)){
        this.removeMultiFilterSelection(clickedText, 'type');
      } else {
        this.selectedFilters.type.push(clickedText);
        this.selectedFilters.type = [...new Set(this.selectedFilters.type)]
        let counter = 0;
        for (const item of this.selectedFilters.type){
          if ( item === 'Alle' ){
            this.selectedFilters.type.splice(counter, 1)
          }
          counter += 1;
        }
      }
      this.closeDropdowns();
    },
    dropdownSelectClickRentStatus(clickedText) {

      if ( clickedText === 'Alle' ){
        this.selectedFilters.rentStatus = ['Alle'];
      } else if (this.selectedFilters.rentStatus.includes(clickedText)) {
        this.removeMultiFilterSelection(clickedText, 'rentStatus');
      } else {
        this.selectedFilters.rentStatus.push(clickedText);
        this.selectedFilters.rentStatus = [...new Set(this.selectedFilters.rentStatus)]
        let counter = 0;
        for (const item of this.selectedFilters.rentStatus){
          if ( item === 'Alle' ){
            this.selectedFilters.rentStatus.splice(counter, 1)
          }
          counter += 1;
        }
      }
      this.closeDropdowns();
    },
    // dropdownSelectClickRentStatus(clickedText) {
    //   this.selectedFilters.rentStatus = clickedText;
    //   this.closeDropdowns();
    // },
    dropdownSelectClickCondition(clickedText) {
      this.selectedFilters.condition = clickedText;
      this.closeDropdowns();
    },
    dropdownSelectClickFloorFrom(clickedText) {
      this.selectedFilters.floor.from = clickedText;
      this.closeDropdowns();
    },
    dropdownSelectClickFloorTo(clickedText) {
      this.selectedFilters.floor.to = clickedText;
      this.closeDropdowns();
    },
    dropdownSelectClickDistrict(clickedText) {
      if ( clickedText === 'Alle' ){
        this.selectedFilters.district = ['Alle'];
      } else if (this.selectedFilters.district.includes(clickedText)){
        this.removeMultiFilterSelection(clickedText, 'district');
      } else {
        if ( Array.isArray(this.selectedFilters.district) ){
          this.selectedFilters.district.push(clickedText);
          this.selectedFilters.district = [...new Set(this.selectedFilters.district)]
          let counter = 0;
          for (const item of this.selectedFilters.district){
            if ( item === 'Alle' ){
              this.selectedFilters.district.splice(counter, 1)
            }
            counter += 1;
          }
        } else {
          let existingDistricts = [clickedText];
          let currentVal = this.selectedFilters.district;
          Object.entries(this.dropdownLists.districtWithParts).forEach(([key, field]) => {
            if ( currentVal.includes(key) ){
              existingDistricts.push(key);
            }
          });
          this.selectedFilters.district = existingDistricts;
        }
        this.searchInputDistrict = '';
      }
      this.closeDropdowns();
    },
    dropdownSelectClickCounty(clickedText) {
      if ( clickedText === 'Alle' ){
        this.selectedFilters.county = ['Alle'];
      } else if (this.selectedFilters.county.includes(clickedText)){
        this.removeMultiFilterSelection(clickedText, 'county');
      } else {
        if ( Array.isArray(this.selectedFilters.county) ){
          this.selectedFilters.county.push(clickedText);
          this.selectedFilters.county = [...new Set(this.selectedFilters.county)]
          let counter = 0;
          for (const item of this.selectedFilters.county){
            if ( item === 'Alle' ){
              this.selectedFilters.county.splice(counter, 1)
            }
            counter += 1;
          }
        } else {
          let existingDistricts = [clickedText];
          let currentVal = this.selectedFilters.county;
          Object.entries(this.dropdownLists.countiesAndCities).forEach(([key, field]) => {
            if ( currentVal.includes(key) ){
              existingDistricts.push(key);
            }
          });
          this.selectedFilters.county = existingDistricts;
        }
        this.searchInputCounty = '';

        let citiesNotToDelete = {};
        for (let i = 0; i < this.selectedFilters.county.length; i++) {
          let breaker = false;
          let countyCities = this.dropdownLists.countiesAndCities[this.selectedFilters.county[i]];
          for (let t = 0; t < this.selectedFilters.city.length; t++) {
            citiesNotToDelete[this.selectedFilters.city[t]] = false;
            if ( countyCities.includes(this.selectedFilters.city[t]) ) {
              citiesNotToDelete[this.selectedFilters.city[t]] = true;
              breaker = true;
              break;
            }
          }
          if ( breaker ) {
            break;
          }
        }

        if ( Object.keys(citiesNotToDelete).length !== 0 && citiesNotToDelete.constructor === Object) {
          Object.entries(citiesNotToDelete).forEach(([key, field]) => {
            if ( !field ) {
              let index = this.selectedFilters.city.indexOf(key);
              if (index !== -1) {
                this.selectedFilters.city.splice(index, 1);
              }
            }
          });
        }

        if ( this.selectedFilters.city.length === 0 ) {
          this.selectedFilters.city = ['Alle']
        }
      }
      this.closeDropdowns();
    },
    dropdownSelectClickDistrictParts(clickedText) {
      if ( clickedText === 'Alle' ){
        this.selectedFilters.localPart = ['Alle'];
      } else if (this.selectedFilters.localPart.includes(clickedText)){
        this.removeMultiFilterSelection(clickedText, 'localPart');
      } else {
        if ( Array.isArray(this.selectedFilters.localPart) ){
          this.selectedFilters.localPart.push(clickedText);
          this.selectedFilters.localPart = [...new Set(this.selectedFilters.localPart)]
        } else {
          let existingCityParts = [clickedText];
          let currentVal = this.selectedFilters.localPart;
          Object.entries(this.onlyPreSelectedCityParts).forEach(([key, field]) => {
            Object.entries(field).forEach(([key1, field1]) => {
              if ( currentVal.includes(field1) ){
                existingCityParts.push(field1);
              }
            });
          });
          this.selectedFilters.localPart = existingCityParts;
        }
        this.searchInputCityPart = '';

        let counter = 0;
        for (const item of this.selectedFilters.localPart){
          if ( item === 'Alle' ){
            this.selectedFilters.localPart.splice(counter, 1)
          }
          counter += 1;
        }

      }
      this.closeDropdowns();
    },
    dropdownSelectClickCity(clickedText) {
      if ( clickedText === 'Alle' ){
        this.selectedFilters.city = ['Alle'];
      } else if (this.selectedFilters.city.includes(clickedText)){
        this.removeMultiFilterSelection(clickedText, 'city');
      } else {
        if ( Array.isArray(this.selectedFilters.city) ){
          this.selectedFilters.city.push(clickedText);
          this.selectedFilters.city = [...new Set(this.selectedFilters.city)]
        } else {
          let existingCityParts = [clickedText];
          let currentVal = this.selectedFilters.city;
          Object.entries(this.onlyPreSelectedCities).forEach(([key, field]) => {
            Object.entries(field).forEach(([key1, field1]) => {
              if ( currentVal.includes(field1) ){
                existingCityParts.push(field1);
              }
            });
          });
          this.selectedFilters.city = existingCityParts;
        }
        this.searchInputCity = '';

        let counter = 0;
        for (const item of this.selectedFilters.city){
          if ( item === 'Alle' ){
            this.selectedFilters.city.splice(counter, 1)
          }
          counter += 1;
        }

      }
      this.closeDropdowns();
    },
    submitFilters() {
      this.redirectToFilterToolView();
      this.isOpenModal = false;
      let dataToSubmit = {
        filters: this.selectedFilters,
        alreadyFiltered: this.alreadyFiltered
      };
      this.$emit('submitFilters', dataToSubmit);
    },
    async startFiltering() {

      this.isLoadingFiltering = true;
      this.alreadyFiltered = false;

      if ( this.timeout !== null ){
        clearTimeout(this.timeout);
      }

      await new Promise(r => this.timeout = setTimeout(r, 3000));

      let dataToSubmit = {
        filters: this.selectedFilters,
        alreadyFiltered: false
      };

      this.$emit('submitFilters', dataToSubmit);

      this.isLoadingFiltering = false;
      this.alreadyFiltered = true;
    },
    resetFilter() {
      this.selectedFilters = {
        usageKind: ['Wohnen'],
        sellStatus: ['Verfügbar'],
        type: ['Alle'],
        budget: {
          from: '',
          to: ''
        },
        rentStatus: ['Bezugsfrei / Bezugsfertig', 'Im Bau'],
        condition: 'Beides',
        rooms: {
          from: '',
          to: ''
        },
        squareMeter: {
          from: '',
          to: ''
        },
        floor: {
          from: '',
          to: ''
        },
        balcony: false,
        terrace: false,
        garden: false,
        lift: false,
        basement: false,
        parkingSlot: false,
        constructionYear: {
          from: '',
          to: ''
        },
        yield: {
          from: '',
          to: ''
        },
        commissionFree: false,
        noRenterProtection: false,
        searchArea: 'all',
        roughSearchArea: [],
        district: ['Alle'],
        localPart: ['Alle'],
        inTrainArea: false,
        county: ['Alle'], // only external agents
        city: ['Alle'], // only external agents
        availableFrom: '',
      };
      this.redirectToFilterToolView();
      this.isOpenModal = false;
      this.$emit('resetFilter');
    },
    resetFilterOnlyView() {
      this.selectedFilters = {
        usageKind: ['Alle'],
        sellStatus: ['Alle'],
        type: ['Alle'],
        condition: 'Beides',
        budget: {
          from: '',
          to: ''
        },
        rentStatus: ['Alle'],
        rooms: {
          from: '',
          to: ''
        },
        squareMeter: {
          from: '',
          to: ''
        },
        floor: {
          from: '',
          to: ''
        },
        balcony: false,
        terrace: false,
        garden: false,
        lift: false,
        basement: false,
        parkingSlot: false,
        constructionYear: {
          from: '',
          to: ''
        },
        yield: {
          from: '',
          to: ''
        },
        commissionFree: false,
        noRenterProtection: false,
        searchArea: 'all',
        roughSearchArea: [],
        district: ['Alle'],
        localPart: ['Alle'],
        inTrainArea: false,
        county: ['Alle'], // only external agents
        city: ['Alle'], // only external agents
        availableFrom: '',
      };
    },
    removeMultiFilterSelection(clickedText, selection) {
      const index = this.$data.selectedFilters[selection].indexOf(clickedText);
      if (index !== -1) {
        this.$data.selectedFilters[selection].splice(index, 1);
      }

      if ( selection === 'county' ) {
        let removedCounty = this.dropdownLists.countiesAndCities[clickedText];
        for (let i = 0; i < removedCounty.length; i++) {
          let indexOfItem = this.selectedFilters.city.indexOf(removedCounty[i]);
          if (indexOfItem !== -1) {
            this.selectedFilters.city.splice(indexOfItem, 1);
          }
        }
        if ( this.selectedFilters.city.length === 0 ) {
          this.selectedFilters.city = ['Alle']
        }
      }

      if ( this.$data.selectedFilters[selection].length === 0 ){
        this.$data.selectedFilters[selection] = ['Alle'];
      }
    },
    checkInputforNegativ(event, data, fromTo = '') {
      if (event.target.value < 0 && data !== 'budget') {
        event.target.value = 0;
        if ( fromTo !== '' ){
          this.$data['selectedFilters'][data][fromTo] = 0;
        } else {
          this.$data['selectedFilters'][data] = 0;
        }
      }
      if (data === 'constructionYear' && event.target.value.length > 4){
        event.target.value = event.target.value.slice(0, 4);
        if ( fromTo !== '' ){
          this.$data['selectedFilters'][data][fromTo] = event.target.value;
        } else {
          this.$data['selectedFilters'][data] = event.target.value;
        }
      }
    },
    checkForFilterFromSearchCriteria() {
      let keys = Object.keys(this.searchCriteriaFilter);
      if ( keys.length > 0 ) {
        this.selectedFilters = this.searchCriteriaFilter;
      }
    },
    searchDistrictVal(event) {

      let inputVal = event.target.value;

      Object.entries(this.dropdownLists.districtWithParts).forEach(([key, field]) => {
        inputVal = inputVal.replaceAll(key, '');
        inputVal = inputVal.replaceAll(',', '');
        // remove all whitespaces before first character
        inputVal = inputVal.replace(/^\s+/, '');
      });

      this.searchInputDistrict = inputVal;
    },
    searchCountyVal(event) {

      let inputVal = event.target.value;

      Object.entries(this.dropdownLists.countiesAndCities).forEach(([key, field]) => {
        inputVal = inputVal.replaceAll(key, '');
        inputVal = inputVal.replaceAll(',', '');
        // remove all whitespaces before first character
        inputVal = inputVal.replace(/^\s+/, '');
      });

      this.searchInputCounty = inputVal;
    },
    searchCityPartVal(event) {

      let inputVal = event.target.value;

      Object.entries(this.onlyPreSelectedCities).forEach(([key, field]) => {
        Object.entries(field).forEach(([key1, field1]) => {
          inputVal = inputVal.replaceAll(field1, '');
          inputVal = inputVal.replaceAll(',', '');
          // remove all whitespaces before first character
          inputVal = inputVal.replace(/^\s+/, '');
        });
      });

      this.searchInputCity = inputVal;
    },
    searchCity(event) {

      let inputVal = event.target.value;

      Object.entries(this.onlyPreSelectedCityParts).forEach(([key, field]) => {
        Object.entries(field).forEach(([key1, field1]) => {
          inputVal = inputVal.replaceAll(field1, '');
          inputVal = inputVal.replaceAll(',', '');
          // remove all whitespaces before first character
          inputVal = inputVal.replace(/^\s+/, '');
        });
      });

      this.searchInputCityPart = inputVal;
    }
  },
  computed: {
    onlyPreSelectedCityParts() {
      if ( this.selectedFilters.district.includes('Alle') ){
        return this.dropdownLists.districtWithParts;
      }

      let selection = this.selectedFilters.district;
      let dropdownList = this.dropdownLists.districtWithParts;
      return (Object.fromEntries(Object.entries(dropdownList).filter(
              ([key]) => selection.includes(key)))
      );

    },
    onlyPreSelectedCities() {
      if ( this.selectedFilters.county.includes('Alle') ){
        return this.dropdownLists.countiesAndCities;
      }

      let selection = this.selectedFilters.county;
      let dropdownList = this.dropdownLists.countiesAndCities;
      return (Object.fromEntries(Object.entries(dropdownList).filter(
              ([key]) => selection.includes(key)))
      );

    },
  },
  watch: {
    $route(to, from){
      if ( to.name === 'realEstatesFilterView' ) {
        this.isOpenModal = true;
        this.isLoading = false;
        this.checkForFilterFromSearchCriteria();
      }
    },
    selectedFilters: {
      deep: true,
      handler: function(newValue, oldValue) {
        this.startFiltering();
      }
    },
    'selectedFilters.usageKind': function(newVal) {
      if ( newVal === 'Gewerbe' || newVal === 'Parken' ) {
        this.selectedFilters.type = ['Alle'];
      }
    },
    resetTrigger() {
      this.selectedFilters = {
        usageKind: 'Wohnen',
        sellStatus: ['Verfügbar'],
        type: ['Alle'],
        budget: {
          from: '',
          to: ''
        },
        rentStatus: ['Bezugsfrei / Bezugsfertig', 'Im Bau'],
        condition: 'Beides',
        rooms: {
          from: '',
          to: ''
        },
        squareMeter: {
          from: '',
          to: ''
        },
        floor: {
          from: '',
          to: ''
        },
        balcony: false,
        terrace: false,
        garden: false,
        lift: false,
        basement: false,
        parkingSlot: false,
        constructionYear: {
          from: '',
          to: ''
        },
        yield: {
          from: '',
          to: ''
        },
        commissionFree: false,
        noRenterProtection: false,
        searchArea: 'all',
        roughSearchArea: [],
        district: ['Alle'],
        localPart: ['Alle'],
        inTrainArea: false,
        county: ['Alle'], // only external agents
        city: ['Alle'], // only external agents
        availableFrom: '',
      }
    }
  },
  mounted() {
    this.$parent.floorList = this.dropdownLists.floor;
    if ( this.$route.name === 'realEstatesFilterView' ) {
      if ( !this.isOpenModal ) {
        this.redirectToFilterToolView();
      }
    }
  }
}
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal, isLoading: isLoading }" v-if="isOpenModal" @click="closeDropdowns">
    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <span class="title">Filter
          <div class="reset-on-view" @click="resetFilterOnlyView">Alles zurücksetzen</div>
        </span>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form>

          <div class="field-wrapper">

            <div class="field-wrapper" :class="{'three-col': selectedFilters.usageKind === 'Alle' || selectedFilters.usageKind === 'Wohnen', 'two-col': selectedFilters.usageKind === 'Gewerbe' || selectedFilters.usageKind === 'Parken' }">
              <span>
                <InputField class="dropdown-input" inputType="text" inputName="UsageKind" :inputValue="selectedFilters.usageKind" v-model="selectedFilters.usageKind" @focus="setDropdownTop($event)" @click="showDropdowns.usageKind = !showDropdowns.usageKind" @click.stop=""></InputField>
                <label class="ph">Nutzungsart</label>
                <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.usageKind}"></DropdownArrow>
                <Dropdown ref="dropdownUsageKind" :class="{active: showDropdowns.usageKind, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.usageKindList" :filterFor="selectedFilters.usageKind" :activeItems="selectedFilters.usageKind" @dropdown-item-clicked="dropdownSelectClickUsage" @click.stop=""></Dropdown>
              </span>
              <span v-if="this.getUserRole() !== -1">
                <InputField class="dropdown-input" inputType="text" inputName="SellStatus" :inputValue="selectedFilters.sellStatus" v-model="selectedFilters.sellStatus" @focus="setDropdownTop($event)" @click="showDropdowns.sellStatus = !showDropdowns.sellStatus" @click.stop=""></InputField>
                <label class="ph">Verkaufsstatus</label>
                <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.sellStatus}"></DropdownArrow>
                <Dropdown ref="dropdownSellStatus" :class="{active: showDropdowns.sellStatus, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.sellStatus" :filterFor="selectedFilters.sellStatus" :activeItems="selectedFilters.sellStatus" @dropdown-item-clicked="dropdownSelectClicksellStatus" @click.stop=""></Dropdown>
              </span>
              <span v-show="selectedFilters.usageKind === 'Alle' || selectedFilters.usageKind === 'Wohnen'">
                <InputField class="dropdown-input" inputType="text" inputName="RealEstateType" :inputValue="selectedFilters.type" v-model="selectedFilters.type" @focus="setDropdownTop($event)" @click="showDropdowns.type = !showDropdowns.type" @click.stop=""></InputField>
                <label class="ph">Immobilientyp</label>
                <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.type}"></DropdownArrow>
                <Dropdown ref="dropdownRealEstateType" :class="{active: showDropdowns.type, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.realEstateType" :filterFor="selectedFilters.type" :activeItems="selectedFilters.type" @dropdown-item-clicked="dropdownSelectClickType" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper three-col budget">
                <span class="fieldgroup-label subheadline">Budget</span>
                <span>
                  <InputField inputType="text" inputName="BudgetFrom" :inputValue="this.numberWithComma(selectedFilters.budget.from)" v-model="selectedFilters.budget.from"></InputField>
                  <label class="ph">Ab</label>
                </span>

                <span>
                  <InputField inputType="text" inputName="BudgetTo" :inputValue="this.numberWithComma(selectedFilters.budget.to)" v-model="selectedFilters.budget.to"></InputField>
                  <label class="ph">Bis</label>
                </span>

                <span class="commisionfree">
                  <label for="CommissionFree" class="checkbox-wrapper">
                    <input class="checkbox field" type="checkbox" id="CommissionFree" name="CommissionFree" v-model="selectedFilters.commissionFree">
                    Provisionsfrei
                  </label>
                </span>
            </div>

            <div class="field-wrapper three-col rooms">
              <span class="field-inner-wrapper two-col">
                <span class="fieldgroup-label subheadline">Zimmer</span>
                <span>
                  <InputField inputType="number" min="0" step="0.5" inputName="BudgetFrom" :inputValue="selectedFilters.rooms.from" v-model="selectedFilters.rooms.from" @input="(event) => checkInputforNegativ(event, 'rooms', 'from')"></InputField>
                  <label class="ph">Ab</label>
                </span>
                 <span>
                  <InputField inputType="number" min="0" step="0.5" inputName="BudgetTo" :inputValue="selectedFilters.rooms.to" v-model="selectedFilters.rooms.to" @input="(event) => checkInputforNegativ(event, 'rooms', 'to')"></InputField>
                  <label class="ph">Bis</label>
                </span>
              </span>

              <span class="field-inner-wrapper two-col">
                <span class="fieldgroup-label subheadline">Wohnfläche</span>
                <span>
                  <InputField inputType="number" min="0" inputName="squareMetersFrom" :inputValue="selectedFilters.squareMeter.from" v-model="selectedFilters.squareMeter.from" @input="(event) => checkInputforNegativ(event, 'squareMeter', 'from')"></InputField>
                  <label class="ph">Ab</label>
                </span>
                 <span>
                  <InputField inputType="number" min="0" inputName="squareMetersTo" :inputValue="selectedFilters.squareMeter.to" v-model="selectedFilters.squareMeter.to" @input="(event) => checkInputforNegativ(event, 'squareMeter', 'to')"></InputField>
                  <label class="ph">Bis</label>
                </span>
              </span>

              <span class="field-inner-wrapper two-col">
                <span class="fieldgroup-label subheadline">Geschoss</span>
                <span>
                  <InputField class="dropdown-input" inputType="text" inputName="FloorFrom" :inputValue="selectedFilters.floor.from" v-model="selectedFilters.floor.from" @focus="setDropdownTop($event)" @click="showDropdowns.floorFrom = !showDropdowns.floorFrom" @click.stop=""></InputField>
                  <label class="ph">Ab</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.floorFrom}"></DropdownArrow>
                  <Dropdown ref="dropdownFloorFrom" :class="{active: showDropdowns.floorFrom, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.floor" :filterFor="selectedFilters.floor.from" :activeItems="selectedFilters.floor.from" @dropdown-item-clicked="dropdownSelectClickFloorFrom" @click.stop=""></Dropdown>
                </span>
                <span>
                  <InputField class="dropdown-input" inputType="text" inputName="FloorTo" :inputValue="selectedFilters.floor.to" v-model="selectedFilters.floor.to" @focus="setDropdownTop($event)" @click="showDropdowns.floorTo = !showDropdowns.floorTo" @click.stop=""></InputField>
                  <label class="ph">Bis</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.floorTo}"></DropdownArrow>
                  <Dropdown ref="dropdownFloorTo" :class="{active: showDropdowns.floorTo, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.floor" :filterFor="selectedFilters.floor.to" :activeItems="selectedFilters.floor.to" @dropdown-item-clicked="dropdownSelectClickFloorTo" @click.stop=""></Dropdown>
                </span>
              </span>

            </div>

            <div class="field-wrapper features">
               <span class="fieldgroup-label">Ausstattung</span>
               <label for="Balcony" class="checkbox-wrapper">
                 <input class="checkbox field" type="checkbox" id="Balcony" name="Balcony" v-model="selectedFilters.balcony">
                   Balkon
                </label>
                <label for="Terrace" class="checkbox-wrapper">
                  <input class="checkbox field" type="checkbox" id="Terrace" name="Terrace" v-model="selectedFilters.terrace">
                   Terrasse
                </label>
                <label for="Garden" class="checkbox-wrapper">
                  <input class="checkbox field" type="checkbox" id="Garden" name="Garden" v-model="selectedFilters.garden">
                   Garten
                </label>
                <label for="Lift" class="checkbox-wrapper">
                  <input class="checkbox field" type="checkbox" id="Lift" name="Lift" v-model="selectedFilters.lift">
                   Aufzug
                </label>
                <label for="Basement" class="checkbox-wrapper">
                  <input class="checkbox field" type="checkbox" id="Basement" name="Basement" v-model="selectedFilters.basement">
                   Keller
                </label>
                <label for="ParkingSlot" class="checkbox-wrapper">
                  <input class="checkbox field" type="checkbox" id="ParkingSlot" name="ParkingSlot" v-model="selectedFilters.parkingSlot">
                   Stellplatz
                </label>
            </div>

            <div class="field-wrapper three-col">
              <span class="fieldgroup-label">Merkmal</span>
              <span class="field-inner-wrapper" style="align-items: stretch;">
                <span class="fieldgroup-label subheadline condition">Zustand</span>
                <span class="field-inner-wrapper condition">
                  <label for="RenterProtection" class="checkbox-wrapper" style="justify-content: center">
                  <input class="checkbox field" type="checkbox" id="RenterProtection" name="RenterProtection" v-model="selectedFilters.noRenterProtection">
                   Kein Mieterschutz
                </label>
                  <span style="margin-top: 32px;">
                    <InputField inputType="date" inputName="AvailableFrom" :inputValue="selectedFilters.availableFrom" v-model="selectedFilters.availableFrom"></InputField>
                    <label class="ph">Fertig / leer ab <span style="font-size:10px;"></span></label>
                  </span>
                </span>
              </span>
              <span class="field-inner-wrapper">
                <span class="fieldgroup-label subheadline">Rendite</span>
                <span>
                  <InputField inputType="number" min="0" step="0.1" inputName="YieldFrom" :inputValue="selectedFilters.yield.from" v-model="selectedFilters.yield.from" @input="(event) => checkInputforNegativ(event, 'yield', 'from')"></InputField>
                  <label class="ph">Ab <span style="font-size:10px;">(in %)</span></label>
                </span>
                <span>
                  <InputField inputType="number" min="0" step="0.1" inputName="YieldTo" :inputValue="selectedFilters.yield.to" v-model="selectedFilters.yield.to" @input="(event) => checkInputforNegativ(event, 'yield', 'to')"></InputField>
                  <label class="ph">Bis <span style="font-size:10px;">(in %)</span></label>
                </span>
              </span>
              <span class="field-inner-wrapper">
                <span class="fieldgroup-label subheadline">Vermietung</span>
<!--                <span>-->
<!--                  <InputField class="dropdown-input" inputType="text" inputName="RentStatus" :inputValue="selectedFilters.rentStatus" v-model="selectedFilters.rentStatus" @focus="setDropdownTop($event)" @click="showDropdowns.rentStatus = !showDropdowns.rentStatus" @click.stop=""></InputField>-->
<!--                  <label class="ph">Wohnungsstatus</label>-->
<!--                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.rentStatus}"></DropdownArrow>-->
<!--                  <Dropdown ref="dropdownRentStatus" :class="{active: showDropdowns.rentStatus, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.rentStatus" :filterFor="selectedFilters.rentStatus" :activeItems="selectedFilters.rentStatus" @dropdown-item-clicked="dropdownSelectClickRentStatus" @click.stop=""></Dropdown>-->
<!--                </span>-->
                <span>
                  <InputField class="dropdown-input" inputType="text" inputName="RentStatus" :inputValue="selectedFilters.rentStatus" v-model="selectedFilters.rentStatus" @focus="setDropdownTop($event)" @click="showDropdowns.rentStatus = !showDropdowns.rentStatus" @click.stop=""></InputField>
                  <label class="ph">Wohnungsstatus</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.rentStatus}"></DropdownArrow>
                  <Dropdown ref="dropdownRentStatus" :class="{active: showDropdowns.rentStatus, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.rentStatus" :filterFor="selectedFilters.rentStatus" :activeItems="selectedFilters.rentStatus" @dropdown-item-clicked="dropdownSelectClickRentStatus" @click.stop=""></Dropdown>
                </span>
                <span>
                    <InputField class="dropdown-input" inputType="text" inputName="Condition" :inputValue="selectedFilters.condition" v-model="selectedFilters.condition" @focus="setDropdownTop($event)" @click="showDropdowns.condition = !showDropdowns.condition" @click.stop=""></InputField>
                    <label class="ph">Neubau oder Bestand</label>
                    <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.condition}"></DropdownArrow>
                    <Dropdown ref="dropdownCondition" :class="{active: showDropdowns.condition, relative: dropdownRelativePosition}" :renderingObject="dropdownLists.condition" :filterFor="selectedFilters.condition" :activeItems="selectedFilters.condition" @dropdown-item-clicked="dropdownSelectClickCondition" @click.stop=""></Dropdown>
                  </span>
              </span>
            </div>

            <div class="field-wrapper search-area">
              <span class="fieldgroup-label">Suchgebiet</span>

              <span class="field-inner-wrapper full-width county-city">
                 <span>
                  <InputField class="dropdown-input" inputType="text" inputName="County" :inputValue="selectedFilters.county" v-model="selectedFilters.county" @focus="setDropdownTop($event)" @click="showDropdowns.county = !showDropdowns.county" @keyup="searchCountyVal" @click.stop=""></InputField>
                  <label class="ph">Bundesland</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.county}"></DropdownArrow>
                  <Dropdown ref="dropdownCounty" :class="{active: showDropdowns.county, relative: dropdownRelativePosition}" type="districts" :renderingObject="dropdownLists.countiesAndCities" :filterFor="searchInputCounty" :activeItems="selectedFilters.county" @dropdown-item-clicked="dropdownSelectClickCounty" @click.stop=""></Dropdown>
                </span>

                <span>
                  <InputField class="dropdown-input" inputType="text" inputName="City" :inputValue="selectedFilters.city" v-model="selectedFilters.city" @focus="setDropdownTop($event)" @click="showDropdowns.city = !showDropdowns.city" @keyup="searchCityPartVal" @click.stop=""></InputField>
                  <label class="ph">Stadt</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.city}"></DropdownArrow>
                  <Dropdown ref="dropdownCity" :class="{active: showDropdowns.city, relative: dropdownRelativePosition}" type="districtParts" :renderingObject="onlyPreSelectedCities" :filterFor="searchInputCity" :activeItems="selectedFilters.city" @dropdown-item-clicked="dropdownSelectClickCity" @click.stop=""></Dropdown>
                </span>
              </span>

            </div>

            <div class="field-wrapper destrict" v-if="selectedFilters.searchArea === 'only berlin' || selectedFilters.county.includes('Berlin') || selectedFilters.city.includes('Berlin') ">
              <span class="fieldgroup-label subheadline">Berliner Bezirke und Ortsteile</span>
              <span class="field-inner-wrapper">
                 <span>
                  <InputField class="dropdown-input" inputType="text" inputName="District" :inputValue="selectedFilters.district" v-model="selectedFilters.district" @focus="setDropdownTop($event)" @click="showDropdowns.district = !showDropdowns.district" @keyup="searchDistrictVal" @click.stop=""></InputField>
                  <label class="ph">Berliner Bezirke</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.district}"></DropdownArrow>
                  <Dropdown ref="dropdownDistrict" :class="{active: showDropdowns.district, relative: dropdownRelativePosition}" type="districts" :renderingObject="dropdownLists.districtWithParts" :filterFor="searchInputDistrict" :activeItems="selectedFilters.district" @dropdown-item-clicked="dropdownSelectClickDistrict" @click.stop=""></Dropdown>
                </span>

                <span>
                  <InputField class="dropdown-input" inputType="text" inputName="DistrictParts" :inputValue="selectedFilters.localPart" v-model="selectedFilters.localPart" @focus="setDropdownTop($event)" @click="showDropdowns.districtPart = !showDropdowns.districtPart" @keyup="searchCityPartVal" @click.stop=""></InputField>
                  <label class="ph">Berliner Ortsteile</label>
                  <DropdownArrow class="dropdown-arrow" :class="{active: showDropdowns.districtPart}"></DropdownArrow>
                  <Dropdown ref="dropdownDistrictParts" :class="{active: showDropdowns.districtPart, relative: dropdownRelativePosition}" type="districtParts" :renderingObject="onlyPreSelectedCityParts" :filterFor="searchInputCityPart" :activeItems="selectedFilters.localPart" @dropdown-item-clicked="dropdownSelectClickDistrictParts" @click.stop=""></Dropdown>
                </span>
              </span>

              <span>
                <label for="OnlyTrainArea" class="checkbox-wrapper">
                  <input class="checkbox field" type="checkbox" id="OnlyTrainArea" name="OnlyTrainArea" v-model="selectedFilters.inTrainArea">
                   nur innerhalb vom S-Bahn-Ring
                </label>
              </span>
            </div>

          </div>

        </form>

        <div class="button-actions two-buttons">
          <div class="inner-button-wrapper">
            <Button type="edit" @click="resetFilter">Filter zurücksetzen</Button>
            <Button type="create reservation" @click="submitFilters">
              <AnimateCircleIcon v-if="this.isLoadingFiltering"></AnimateCircleIcon>
              <span v-else>({{ countedUnits }} Treffer)</span>
              Filtern
            </Button>
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

.button-actions {
  margin-top: 25px;
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

.field-wrapper, .field-inner-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.field-inner-wrapper.full-width {
  flex-basis: 100%;
}

.field-wrapper + .field-wrapper {
  margin-top: 25px;
}

.field-wrapper.three-col > span {
  flex-basis: 30%;
}

.fieldgroup-label, .field-wrapper.three-col > span.fieldgroup-label, .rooms .fieldgroup-label.subheadline{
  flex-basis: 100%;
  margin-bottom: 10px;
  font-weight: 700;
}

.fieldgroup-label.subheadline {
  font-weight: 500;
}

.subheadline.condition {
  margin-bottom: 0;
}

.field-inner-wrapper.condition {
  margin-top: 0;
  height: 70px;
  flex-basis: 100%;
}

.field-inner-wrapper.condition > span {
  width: 100%;
}

.field-wrapper > span {
  width: 45%;
}

.field-inner-wrapper.two-col.budget > span + span {
  flex-basis: 45%;
}

.field-wrapper.two-col {
  align-items: end;
}

.field-inner-wrapper > span + span {
  margin-top: 15px;
}

.field-inner-wrapper.county-city span {
  margin-top: 0;
}

.field-inner-wrapper.county-city > span{
  flex-basis: 48%;
}

.radio-wrapper {
  text-align: center;
}

input[type="checkbox"],
input.dropdown-input {
  cursor: pointer;
}

input[type="checkbox"] {
  border: solid 2px black;
  height: 20px;
  width: 20px;
  padding: 0;
}

input[type="checkbox"] {
  position: relative;
  margin-left: 10px;
}

.checkbox-wrapper {
  display: flex;
}

.checkbox-wrapper input{
  flex-basis: auto;
  margin-right: 15px;
}

.loading-animation {
  color: white;
  display: inline;
  margin-right: 10px;
}

.reset-on-view {
  font-size: 14px;
  font-weight: 500;
  color: var(--blue);
  cursor: pointer;
  margin-top: 5px;
}

.features label {
  flex-basis: 33%;
}

.features label:first-of-type {
  margin-bottom: 10px;
}

.dropdown-arrow {
  pointer-events: none;
}

.dropdown-arrow.active {
  pointer-events: none;
  transform: translateY(-50%) rotate(180deg);
}

input[name="ConstructionYearFrom"]::-webkit-outer-spin-button,
input[name="ConstructionYearFrom"]::-webkit-inner-spin-button,
input[name="ConstructionYearTo"]::-webkit-outer-spin-button,
input[name="ConstructionYearTo"]::-webkit-inner-spin-button{
  -webkit-appearance: none;
  margin: 0;
}

input[name="ConstructionYearFrom"][type=number],
input[name="ConstructionYearTo"][type=number]{
  -moz-appearance: textfield;
}

.modal-header {
  margin-bottom: 25px;
}

.commisionfree {
  display: flex; align-items: center; justify-content: end;
}

@media (max-width: 1500px){
  .modal-wrapper .modal-inner-wrapper {
    min-width: 60vw;
    max-width: 60vw;
  }
}

@media (max-width: 991px){
  .modal-wrapper .modal-inner-wrapper {
    min-width: 80vw;
    max-width: 80vw;
  }
}

/* Mobile */
@media (max-width: 767px){
  .all-filter > div {
    flex-basis: 100%;
  }
  .all-filter > div + div, .all-filter > div:nth-of-type(2) {
    margin-top: 20px;
  }
  .modal-wrapper .modal-inner-wrapper {
    min-width: 90vw;
    max-width: 90vw;
  }
  .field-wrapper.three-col > span {
    flex-basis: 100%;
  }
  .field-wrapper.three-col.budget > span:nth-of-type(2), .field-wrapper.three-col.budget > span:nth-of-type(3) {
    flex-basis: 45%;
  }
  .field-wrapper.three-col > span + span {
    margin-top: 15px;
  }
  .commisionfree {
    justify-content: start;
  }
  .field-inner-wrapper.condition {
    margin-top: 25px;
    height: 40px;
  }
}

@media (max-width: 525px){
  .field-wrapper.three-col.budget > span:nth-of-type(2), .field-wrapper.three-col.budget > span:nth-of-type(3),
  .field-inner-wrapper.two-col > span,
  .field-inner-wrapper > span,
  .destrict > span {
    flex-basis: 100%;
  }

  [for="RenterProtection"],
  .destrict > span:last-of-type {
    margin-top: 15px;
  }
  .search-area .field-inner-wrapper > label,
  .rough-search-area .field-inner-wrapper > label{
    flex-basis: 50%;
  }
  .rough-search-area .field-inner-wrapper > label:first-of-type {
    margin-bottom: 15px;
  }
}

</style>
