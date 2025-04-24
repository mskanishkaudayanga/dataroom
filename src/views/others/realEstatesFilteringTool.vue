<script>
import Navigation from "@/components/Navigation.vue";
import InputField from "@/components/forms/InputField.vue";
import DropdownIcon from "@/components/icons/icon-dropdown.vue";
import axios from "axios";
import RealEstatesFilterView from "@/views/others/realEstatesFilterView.vue";
import GoogleMap from "@/components/googleMap/GoogleMap.vue";
import Button from "@/components/buttons/button.vue";
import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";
import CloseIcon from "@/components/icons/icon-close.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import FilterIcon from "@/components/icons/icon-filter.vue";
import FullScreenIcon from "@/components/icons/icon-full-screen.vue";
import MinusIcon from "@/components/icons/icon-minus.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import SortAlphabetIcon from "@/components/icons/icon-sort-alphabet.vue";
import SortNumericIcon from "@/components/icons/icon-sort-numeric.vue";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import blobStream from "blob-stream";
import {Buffer} from "buffer";
import ArrowLeftIcon from "@/components/icons/icon-arrow-left.vue";
import ArrowRightIcon from "@/components/icons/icon-arrow-right.vue";
import RemoveFilterIcon from "@/components/icons/icon-filter-slash.vue";
import MapMarkerIcon from "@/components/icons/icon-map-marker.vue";
import FloorplansIcon from "@/components/icons/icon-floorplan.vue";
import ImagesIcon from "@/components/icons/icon-images.vue";
import ExternalLinkIcon from "@/components/icons/icon-external-link.vue";
import {filterStore} from "@/stores/filterStore";
import ArrowCircleIcon from "@/components/icons/icon-arrow-circle.vue";
import PatchnotesIcon from "@/components/icons/icon-patchnote.vue";
import NonRenterIcon from "@/components/icons/icon-non-renter.vue";
import ToolTip from "@/components/utility/ToolTip.vue";

export default {
  name: 'realEstateFilteringTool',
  components: {
    ToolTip,
    NonRenterIcon,
    PatchnotesIcon,
    ArrowCircleIcon,
    ExternalLinkIcon,
    ImagesIcon,
    FloorplansIcon,
    MapMarkerIcon,
    RemoveFilterIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    SortNumericIcon,
    SortAlphabetIcon,
    PlusIcon,
    MinusIcon,
    FullScreenIcon,
    FilterIcon,
    AnimateCircleIcon,
    CloseIcon, CheckmarkIcon, Button, GoogleMap, RealEstatesFilterView, DropdownIcon, InputField, Navigation},
  data() {
    return {
      companySelection: 'all',
      projectSelection: [],
      selectedUnit: [],
      selectedUnitImages: [],

      filterFromSearchCriteria: {},

      toggleKgProjects: false,
      toggleLivingProjects: false,
      toggleAllProjects: false,

      allRealEstates: [],
      filteredRealEstates: [],
      allFilteredProjects: [],
      apiError: '',

      projectSearch: '',
      projectSearchResults: [],

      isLoading: {
        estates: false,
        images: false,
        unitFiltering: false,
        projectSearch: false,
      },

      isOpenModalImages: false,
      modalImagesTitel: 'Grundriss',
      imageToDisplayInPopup: '',
      imageBase64: '',

      selectedUnitActiveTab: {
        floorPlans: true,
        map: false,
        image: false,
      },

      activeFilters: {
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
      floorList: [],

      onlyUnitsForSorting: [],

      sortAlpha: '',
      sortNumeric: 'down',

      imageZoomFactor: 1,
      imageMove: {
        left: 0,
        top: 0,
      },
      pickOption: 'single',

      triggerFilterViewReset: '',

      collapsFirstCol: false,

      collaps: false,
    }
  },
  methods: {
    toggleSortIcons(data) {
      if (this.$data[data] === '') {
        this.$data[data] = 'up';
      } else if (this.$data[data] === 'up') {
        this.$data[data] = 'down';
      } else {
        this.$data[data] = '';
      }
    },
    getAllRealEstates(withoutCache = false) {

      this.isLoading.estates = true;

      axios.get(this.globalApiBaseUrl + '/onoffice/getAllRealEstate?rc='+withoutCache)
          .then(
              (response) => {
                if (response.data.status === 200) {
                  let notSortedKg = response.data.response.kg;
                  let sortedKG = Object.keys(notSortedKg)
                      .sort()
                      .reduce((acc, key) => ({
                        ...acc, [key]: notSortedKg[key]
                      }), {})
                  let notSortedLiving = response.data.response.living;
                  let sortedLiving = Object.keys(notSortedLiving)
                      .sort()
                      .reduce((acc, key) => ({
                        ...acc, [key]: notSortedLiving[key]
                      }), {})
                  response.data.response.kg = sortedKG;
                  response.data.response.living = sortedLiving;

                  response.data.response = this.userConditionsToFilterRealEstates(response.data.response);

                  this.allRealEstates = response.data.response;
                  this.filteredRealEstates = response.data.response;
                  this.filterUnits(this.activeFilters);
                }
              }
          ).catch(
          (error) => {
            this.apiError = error;
          }
      ).finally(
          () => {
            this.isLoading.estates = false;
          }
      )

    },
    userConditionsToFilterRealEstates(allRealEstates) {

      let returnVal = allRealEstates;
      let userConditions = this.userConditions[this.getUserMail()];

      if ( typeof userConditions === 'undefined' || !userConditions || userConditions === '' ) {
        return returnVal;
      }

      for ( const company in returnVal ) {
        for ( const projectname in returnVal[company] ) {
          if ( userConditions.projects.length > 0 && !userConditions.projects.includes(projectname.replaceAll('_', ' ')) ) {
            delete returnVal[company][projectname];
          }
          for ( const unitindex in returnVal[company][projectname] ) {
            if ( userConditions.city.length > 0) {
              returnVal[company][projectname] = returnVal[company][projectname].filter(function(entry) {
                return userConditions.city.includes(entry.real_estate_city);
              });
            }
          }
        }
      }

      return returnVal;
    },
    selectUnit(data) {
      let company = data.realEstate.real_estate_company;
      let projectName = data.realEstate.real_estate_project_name;
      for (const realEstate in this.allRealEstates[company][projectName]) {
        if (this.allRealEstates[company][projectName][realEstate].real_estate_sys_id === data.realEstate.real_estate_sys_id) {
          this.selectedUnit = this.allRealEstates[company][data.realEstate.real_estate_project_name][realEstate];
          this.getRealEstateImages(this.selectedUnit.real_estate_sys_id, this.selectedUnit.real_estate_company);
          break;
        }
      }
    },
    getRealEstateImages(realEstateSysId, company) {
      this.isLoading.images = true;
      this.selectedUnitImages = [];

      if (!realEstateSysId || realEstateSysId === '' || !company || company === '') {
        return false;
      }

      axios.get(this.globalApiBaseUrl + '/onoffice/getRealEstateImages?immoid=' + realEstateSysId + '&company=' + company)
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.selectedUnitImages = response.data.response;
                }
              }
          ).catch(
          (error) => {
            this.apiError = error;
          }
      ).finally(
          () => {
            this.isLoading.images = false;
          }
      )
    },
    resetView() {
      this.activeFilters = {
        usageKind: 'Wohnen',
        sellStatus: ['Verfügbar'],
        type: ['Alle'],
        condition: 'Beides',
        budget: {
          from: '',
          to: ''
        },
        rentStatus: ['Bezugsfrei / Bezugsfertig', 'Im Bau'],
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
      let dataToSubmit = {
        filters: this.activeFilters,
        alreadyFiltered: false
      };
      this.triggerFilterViewReset = this.makeid(50);
      this.getSelectedFilters(dataToSubmit);
    },
    makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    },
    getSelectedFilters(submitedFilters) {
      this.activeFilters = submitedFilters.filters;
      if (!submitedFilters.alreadyFiltered) {
        this.filterUnits(submitedFilters.filters);
      }
      this.companySelection = 'all';
      this.selectedUnit = [];
      this.projectSelection = [];
      this.toggleKgProjects = false;
      this.toggleLivingProjects = false;
    },
    filterUnits(filters) {
      this.isLoading.unitFiltering = true;
      this.isLoading.estates = true;
      let allData = this.allRealEstates;
      let realEstatesfilteredData = {};
      let methodFilterSingleUnit = this.filterSingleRealEstate;

      Object.keys(allData).forEach(function (company) {
        realEstatesfilteredData[company] = {};
        Object.keys(allData[company]).forEach(function (projectname) {
          let noMatch = false;

          Object.keys(allData[company][projectname]).forEach(function (unit) {
            if (typeof realEstatesfilteredData[company][projectname] === "undefined") {
              realEstatesfilteredData[company][projectname] = [];
            }
            if (methodFilterSingleUnit(allData[company][projectname][unit], filters)) {
              realEstatesfilteredData[company][projectname].push(allData[company][projectname][unit]);
            }
          });
        });
      });

      Object.keys(realEstatesfilteredData).forEach(function (company) {
        Object.keys(realEstatesfilteredData[company]).forEach(function (projectname) {
          if (realEstatesfilteredData[company][projectname].length <= 0) {
            delete realEstatesfilteredData[company][projectname];
          }
        });
      });

      this.isLoading.estates = false;
      this.isLoading.unitFiltering = false;
      this.filteredRealEstates = realEstatesfilteredData;

    },
    filterSingleRealEstate(realEstate, filter) {

      let filterRangeOfNumbers = this.filterRangeOfNumbers;
      let filterRangeOfObject = this.filterRangeOfObject;

      const debugRealEstateId = 'EIS-WE29';
      if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
        console.log(filter);
        console.log(realEstate);
      }

      // Detect if given real estate matches the filter and return true if it does
      if (typeof realEstate === "undefined" || realEstate.length === 0 || typeof filter === "undefined" || filter.length === 0) {
        // console.log('wrong input');
        return false;
      }

      let rentArray = []
      let isRenterProtectionNo = false;
      for( const index in filter.rentStatus ) {
        if ( filter.rentStatus[index] === 'Bezugsfrei / Bezugsfertig' ) {
          rentArray.push('Unvermietet', 'Frei', 'Bezugsfrei', 'Bezugsfertig', 'Vermietet');
          isRenterProtectionNo = true;
        } else {
          rentArray.push(filter.rentStatus[index]);
        }
      }

      if (filter.usageKind !== 'Alle') {
        if (filter.usageKind === 'Wohnen' && realEstate.real_estate_usage_kind !== 'Wohnen') {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('flat1');
          }
          // Remove real estate which have Parken in it
          return false;
        } else if (filter.usageKind === 'Gewerbe' && realEstate.real_estate_usage_kind !== 'Gewerbe') {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('flat2');
          }
          // Remove real estate which have Parken in it
          if (realEstate.real_estate_object_type === 'Parken') {
            if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
              console.log('flat3');
            }
            return false;
          }
          return false;
        } else if (filter.usageKind === 'Parken' && realEstate.real_estate_object_type !== 'Parken' && (realEstate.real_estate_usage_kind !== 'Gewerbe' || realEstate.real_estate_usage_kind !== 'Wohnen')) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('flat4');
          }
          return false;
        }

        // In wohnen and gewerbe no parken object_type parken should be displayed
        if (filter.usageKind === 'Wohnen' || filter.usageKind === 'Gewerbe') {
          if (realEstate.real_estate_object_type === 'Parken') {
            return false;
          }
        }

      }


      if (filter.sellStatus.length > 0) {
        if (!filter.sellStatus.includes('Alle') && !filter.sellStatus.includes(realEstate.real_estate_sell_status)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log(filter.sellStatus);
            console.log(realEstate.real_estate_sell_status);
            console.log('false sell status 1');
          }
          return false;
        }
      }

      if (filter.condition !== 'Beides' && realEstate.real_estate_condition !== '' && typeof realEstate.real_estate_condition !== 'undefined') {
        if (!filter.condition.includes(realEstate.real_estate_condition)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false sell status 2');
          }
          return false;
        }
      }

      if (filter.type.length > 0) {
        if (!filter.type.includes('Alle') && !filter.type.includes(realEstate.real_estate_object_kind)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false object type');
          }
          return false;
        }
      }

      if (!filterRangeOfNumbers(filter.budget, realEstate.real_estate_price, false)) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false budget');
        }
        return false;
      }

      if ((!filter.rentStatus.includes('Alle') && filter.rentStatus !== '') && !rentArray.includes(realEstate.real_estate_rent_state)) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false rentStatus');
        }
        return false;
      }

      if ( filter.rooms.to !== '' ) {
        filter.rooms.to = parseFloat(filter.rooms.to);
      }
      if ( filter.rooms.from !== '' ) {
        filter.rooms.from = parseFloat(filter.rooms.from);
      }
      if (!filterRangeOfNumbers(filter.rooms, realEstate.real_estate_rooms, false)) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false rooms');
        }
        return false;
      }

      if ( filter.squareMeter.to !== '' ) {
        filter.squareMeter.to = parseFloat(filter.squareMeter.to);
      }
      if ( filter.squareMeter.from !== '' ) {
        filter.squareMeter.from = parseFloat(filter.squareMeter.from);
      }
      if (!filterRangeOfNumbers(filter.squareMeter, realEstate.real_estate_living_area)) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false squareMeter');
        }
        return false;
      }

      if (!filterRangeOfObject(filter.floor, realEstate.real_estate_floor) ) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false floor');
        }
        return false;
      }

      if (filter.balcony && filter.balcony !== realEstate.real_estate_balcony) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false balcony');
        }
        return false;
      }

      if (filter.terrace && filter.terrace !== realEstate.real_estate_terrace) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false terrace');
        }
        return false;
      }

      if (filter.garden && filter.garden !== realEstate.real_estate_garden) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false garden');
        }
        return false;
      }

      if (filter.lift && filter.lift !== realEstate.real_estate_lift) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false lift');
        }
        return false;
      }

      if (filter.basement && filter.basement !== realEstate.real_estate_has_basement) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false basement');
        }
        return false;
      }

      if (filter.parkingSlot && (filter.parkingSlot !== realEstate.real_estate_parking || realEstate.real_estate_parking_included === 'Nein')) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false parkingSlot');
        }
        return false;
      }

      if (!filterRangeOfNumbers(filter.constructionYear, realEstate.real_estate_construction_year)) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false constructionYear');
        }
        return false;
      }

      if (!filterRangeOfNumbers(filter.yield, realEstate.real_estate_yield)) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false yield');
        }
        return false;
      }

      if (filter.commissionFree && filter.commissionFree !== realEstate.real_estate_commissionfree) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false commissionFree');
        }
        return false;
      }

      if ( realEstate.real_estate_buy_by_renter === null ) {
        realEstate.real_estate_buy_by_renter = false;
      }

      if ( isRenterProtectionNo && !filter.noRenterProtection && realEstate.real_estate_buy_by_renter) {
        // When is selected Bezugsfrei / Bezugsfertig
        // and Kein Mieterschutz is not checked
        // and real estate buy by renter is true
        // filter real estate out
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false commissionFree test 1');
        }
        return false;
      }

      if ( !isRenterProtectionNo ) {
        // Only filter which is negated
        if (filter.noRenterProtection && filter.noRenterProtection === realEstate.real_estate_buy_by_renter) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false noRenterProtection');
          }
          return false;
        }
      }

      // Only filter for avaible date of real estate
      if (filter.availableFrom ) {
        if ( realEstate.real_estate_available_from === '' ) {
          return false;
        }
        let parsedDate1 = new Date(filter.availableFrom);
        let parsedDate2 = new Date(realEstate.real_estate_available_from);
        if(parsedDate1.getTime() <= parsedDate2.getTime()) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false daterange');
          }
          return false;
        }
      }

      if ((filter.searchArea === 'only berlin' && realEstate.real_estate_city !== 'Berlin') || (filter.searchArea === 'only potsdam' && realEstate.real_estate_city !== 'Potsdam') || (filter.searchArea === 'only hessen' && realEstate.real_estate_state !== 'Hessen') || (filter.searchArea === 'only brandenburg' && realEstate.real_estate_state !== 'Brandenburg')) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false searchArea');
        }
        return false;
      }

      // Filter for state
      if ((filter.searchArea === 'only brandenburg' && realEstate.real_estate_state !== 'Brandenburg')) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false searchArea 2');
        }
        return false;
      }

      let excludeRealEstateFromSpecialFilters = false;
      if ( realEstate.real_estate_city !== 'Berlin' ) {
        excludeRealEstateFromSpecialFilters = true;
      }

      if (filter.roughSearchArea.length > 0 && !excludeRealEstateFromSpecialFilters) {
        if (!filter.roughSearchArea.includes('Alles andere') && !filter.roughSearchArea.includes(realEstate.real_estate_search_area)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false roughSearchArea');
          }
          return false;
        }
      }

      if (filter.district.length > 0 && !excludeRealEstateFromSpecialFilters) {
        const found = filter.district.some(value => realEstate.real_estate_city_area.includes(value));
        if (!filter.district.includes('Alle') && !found) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false district');
          }
          return false;
        }
      }

      if (filter.localPart.length > 0 && !excludeRealEstateFromSpecialFilters) {
        if (!filter.localPart.includes('Alle') && !filter.localPart.includes(realEstate.real_estate_city_part)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false localPart');
          }
          return false;
        }
      }

      if (filter.inTrainArea && filter.inTrainArea !== realEstate.real_estate_in_train_area && !excludeRealEstateFromSpecialFilters) {
        if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
          console.log('false inTrainArea');
        }
        return false;
      }

      // Filter for county and city only for external agents
      if (filter.county.length > 0) {
        if (!filter.county.includes('Alle') && !filter.county.includes(realEstate.real_estate_state)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false state');
          }
          return false;
        }
      }

      if (filter.city.length > 0) {
        if ( realEstate.real_estate_city === 'Frankfurt am Main' ) {
          realEstate.real_estate_city = 'Frankfurt a.M.';
        }
        if (!filter.city.includes('Alle') && !filter.city.includes(realEstate.real_estate_city)) {
          if ( debugRealEstateId && realEstate.real_estate_id === debugRealEstateId ) {
            console.log('false city');
          }
          return false;
        }
      }

      return true;
    },
    filterRangeOfNumbers(rangeObject, realEstateValue, debug = false) {

      let valueToCheck = parseFloat(realEstateValue);
      let validator = {
        from: false,
        to: false,
      };

      if (!rangeObject.from && !rangeObject.to) {
        return true;
      }

      if (debug) {
        console.log(rangeObject);
      }

      let filterFrom = rangeObject.from;
      let filterTo = rangeObject.to;
      if (typeof filterFrom === 'string') {
        filterFrom = filterFrom.replace('.', '');
      }
      if (typeof filterTo === 'string') {
        filterTo = filterTo.replace('.', '');
      }

      if (filterFrom !== 0 && filterFrom !== '') {
        filterFrom = parseFloat(filterFrom);
        if (filterFrom <= valueToCheck) {
          validator.from = true;
        } else {
          validator.from = false;
        }
      } else {
        delete validator.from;
      }


      if (filterTo !== 0 && filterTo !== '') {
        filterTo = parseFloat(filterTo);
        if (filterTo >= valueToCheck) {
          validator.to = true;
        } else {
          validator.to = false;
        }
      } else {
        delete validator.to;
      }

      if (debug) {
        console.log(filterFrom, filterTo, validator);
      }

      Object.keys(validator).forEach(function (ele) {
        if (validator[ele] === false) {
          validator = false;
        }
      });

      return validator;

    },
    filterRangeOfObject(rangeObject, realEstateValue, debug = false) {

      if (debug) {
        // console.log(rangeObject);
      }

      if (!rangeObject.from && !rangeObject.to) {
        return true;
      }

      let floors = this.floorList;

      let fromCounter;
      let toCounter;
      let searchFloorPosition;

      let validator = {
        from: false,
        to: false,
      };

      let counter = 0;

      let fromValue = rangeObject.from
      let toValue = rangeObject.to
      if ( realEstateValue && realEstateValue.includes('+') ) {
        let splitRealEstateValue = realEstateValue.replace(/\s/g, '');
        splitRealEstateValue = splitRealEstateValue.split('+');
        realEstateValue = splitRealEstateValue;
      }

      if ( fromValue && fromValue.includes('+') ) {
        let splitFrom = fromValue.replace(/\s/g, '');
        splitFrom = fromValue.split('+');
        fromValue = splitFrom[0];
      }

      if ( toValue && toValue.includes('+') ) {
        let splitTo = toValue.replace(/\s/g, '');
        splitTo = toValue.split('+');
        toValue = splitTo[splitFrom.length-1];
      }

      if ( debug ) {
        console.log(realEstateValue);
        console.log(fromValue);
        console.log(toValue);
      }


      Object.keys(floors).forEach(function (item) {
        if (fromValue !== '' && fromValue === item) {
          fromCounter = counter;
        }
        if (toValue !== '' && toValue === item) {
          toCounter = counter;
        }
        if (item.includes(realEstateValue)) {
          searchFloorPosition = counter;
        }

        if ( Array.isArray(realEstateValue) && typeof searchFloorPosition === 'undefined' ) {
          if ( item.includes(realEstateValue[0]) || item.includes(realEstateValue[1]) ) {
            searchFloorPosition = counter;
          }
        }
        counter = counter + 1;
      });

      if ( debug ) {
        console.log(searchFloorPosition);
        console.log(fromCounter);
        console.log(toCounter);
      }

      if (typeof fromCounter !== 'undefined') {
        if (searchFloorPosition >= fromCounter) {
          validator.from = true;
        }
      } else {
        validator.from = true;
      }

      if (typeof toCounter !== 'undefined') {
        if (searchFloorPosition <= toCounter) {
          validator.to = true;
        }
      } else {
        validator.to = true;
      }

      let returnVal = true;
      Object.keys(validator).forEach(function (ele) {
        if (validator[ele] === false) {
          returnVal = false;
        }
      });

      // console.log('search for'+searchFloorPosition);
      // console.log(returnVal);

      return returnVal;

    },
    formatRoomNumber(data) {
      let rooms = parseFloat(data);
      return rooms % 1 === 0 ? rooms : rooms.toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
    },
    format2TwoDezimalNumber(data) {
      let rooms = parseFloat(data);
      return rooms % 1 === 0 ? rooms : rooms.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    loadImagePopup(imageToLoad) {
      this.isOpenModalImages = true;
      this.imageToDisplayInPopup = this.selectedUnitImages[imageToLoad];
      this.modalImagesTitel = imageToLoad;
    },
    zoomImage(zoom) {
      if (zoom === 'in') {
        this.imageZoomFactor += 0.1;
      } else {
        if (this.imageZoomFactor > 1) {
          this.imageZoomFactor -= 0.1;
        } else {
          this.imageMove.left = 0;
          this.imageMove.top = 0;
        }
      }
    },
    startDrag(event) {
      if (this.imageZoomFactor <= 1) {
        return;
      }
      const img = this.$refs.floorImage;
      const startX = event.clientX;
      const startY = event.clientY;

      const moveImage = (event) => {
        this.imageMove.left = (this.imageMove.left + event.clientX - startX) / 2;
        this.imageMove.top = (this.imageMove.top + event.clientY - startY) / 2;
      };

      img.addEventListener("mousemove", moveImage);

      img.addEventListener("mouseup", () => {
        img.removeEventListener("mousemove", moveImage);
      });
    },
    checkClassForMetaData(data) {
      let returnClass = '';
      const allowedGreenData = ['Unvermietet', 'Frei', 'Bezugsfrei', 'Bezugsfertig', 'Verfügbar', 'Im Bau'];
      if ( allowedGreenData.includes(data) ) {
        returnClass = 'green';
      } else if (data === 'Reserviert' || data === 'Vermietet') {
        returnClass = 'orange';
      } else if (data === 'Verkauft') {
        returnClass = 'red';
      } else if (data === 'Vertriebsstopp') {
        returnClass = 'red';
      }
      return returnClass;
    },
    projectFoundRealEstatesCounter(searchedProjectName) {
      let allData = this.filteredRealEstates;
      let countOfRealEstates = 0;
      Object.keys(allData).forEach(function (company) {
        if (allData[company].hasOwnProperty(searchedProjectName)) {
          countOfRealEstates = allData[company][searchedProjectName].length;
        }
      });
      return countOfRealEstates;
    },
    createPDFKitImage(type = 'floorImage') {
      let doc = new PDFDocument(
          {
            size: [600, 450]
          }
      );
      let stream = doc.pipe(blobStream());
      let base64Image = this.imageBase64;

      // draw some text
      doc.image(new Buffer(base64Image.replace('data:image/png;base64,', ''), 'base64'), 0, 15, {fit: [600, 500]})

      // end and display the document in the iframe to the right
      doc.end();

      let iframe = this.$refs[type];
      let floorPlanLink = this.$refs['floorplan-new-tab-url'];
      stream.on('finish', function () {
        let src = stream.toBlobURL('application/pdf');
        if (typeof src !== 'undefined') {
          iframe.src = src + '#view=fit';
          floorPlanLink.href = src + '#view=fit';
        }
      });
    },
    getBase64Image(urlToGet) {
      this.isLoading.images = true;

      let dataToSubmit = {
        'url': urlToGet,
      }

      axios.post(this.globalApiBaseUrl + '/onoffice/getImageBase64', dataToSubmit)
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.imageBase64 = response.data.response;

                  if (response.data.response === this.imageBase64) {
                    let type;
                    if ( this.selectedUnitActiveTab.floorPlans ){
                      type = 'floorImage';
                    } else if ( this.selectedUnitActiveTab.image ) {
                      type = 'flatImage';
                    }
                    this.createPDFKitImage(type);
                  }

                }
              }
          ).catch(
          (error) => {
            this.imageBase64 = error;
          }
      ).finally(
          () => {
            this.isLoading.images = false;
          }
      )
    },
    toggleFirstCol() {
      this.collaps = !this.collaps;
      this.collapsFirstCol = this.collaps;
    },
    sortLowestPriceFirst(filteredData) {
      let allData = filteredData;
      let realEstatesfilteredData = [];
      Object.keys(allData).forEach(function (company) {
        Object.keys(allData[company]).forEach(function (projectname) {
          Object.keys(allData[company][projectname]).forEach(function (unit) {
            realEstatesfilteredData.push(allData[company][projectname][unit]);
          });
        });
      });
      let order = 'DESC';
      this.onlyUnitsForSorting = this.sortArray(realEstatesfilteredData, 'real_estate_price', order);
    },
    checkForFilterFromSearchCriteria() {

      /**
       * get filter which was set in show search criteria "modal
       */
      const filterData = this.getFilter();

      /**
       * if the filter was used once clear the stored filter
       */
      let keys = Object.keys(filterData);
      if ( keys.length === 0 ) {
        this.filterFromSearchCriteria = {};
        return;
      }

      /**
       * Format districts from double nested array to simple array
       */
      filterData.district = filterData.district[0];

      /**
       * set active filter so real estates get after success api call
       * set filter to give it in component for filter modal
       */
      this.activeFilters = filterData;
      this.filterFromSearchCriteria = filterData;

      /**
       * reset search criteria filter when it was used once
       */
      const store = filterStore();
      store.setFilter({});

    }
  },
  computed: {
    filteredData() {

      this.isLoading.unitFiltering = true;
      let filteredData;

      let realEstateData = this.filteredRealEstates;

      let wholeRealEstatesCount = 0;
      Object.keys(realEstateData).forEach(function(company) {
        Object.keys(realEstateData[company]).forEach(function(projectname) {
          wholeRealEstatesCount += realEstateData[company][projectname].length;
        });
      });

      // Company Filter
      let companySelection = this.companySelection;

      if ( companySelection === 'kg' ){
        filteredData = {kg: realEstateData.kg};
      } else if( companySelection === 'living' ){
        filteredData = {living: realEstateData.living};
      } else {
        filteredData = realEstateData;
      }

      let projectSelection = this.projectSelection;
      if ( projectSelection.length > 0 && companySelection !== 'all' ){
        let filteredProjects = Object.fromEntries(Object.entries(filteredData[companySelection]).filter(([key]) => projectSelection.includes(key)));
        filteredData[companySelection] = filteredProjects;
      }

      if ( projectSelection.length > 0 && companySelection === 'all' ){
        // let allRawData = this.allRealEstates;
        let filteredProjectsKG = Object.fromEntries(Object.entries(filteredData.kg).filter(([key]) => projectSelection.includes(key)));
        let filteredProjectsLiving = Object.fromEntries(Object.entries(filteredData.living).filter(([key]) => projectSelection.includes(key)));
        filteredData = {
          kg: filteredProjectsKG,
          living: filteredProjectsLiving,
          all: {...filteredProjectsKG, ...filteredProjectsLiving}
        }
      }

      let count = 0;
      Object.keys(filteredData).forEach(function(company) {
        if ( company !== 'all' ){
          Object.keys(filteredData[company]).forEach(function(projectname) {
            count += filteredData[company][projectname].length;
          });
        }
      });

      this.isLoading.unitFiltering = false;

      this.sortLowestPriceFirst(filteredData);

      return {data: filteredData, count:count, countRawRealEstates: wholeRealEstatesCount };

    },
    checkIfIsFiltered() {
      let standardFilter = {
        usageKind: 'Wohnen',
        sellStatus: ['Verfügbar'],
        type: ['Alle'],
        budget: {
          from: '',
          to: ''
        },
        rentStatus: ['Bezugsfrei / Bezugsfertig', 'Im Bau'],
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
        searchArea: 'only berlin',
        roughSearchArea: [],
        district: ['Alle'],
        localPart: ['Alle'],
        inTrainArea: false,
      };
      if ( JSON.stringify(this.activeFilters) === JSON.stringify(standardFilter) ) {
        return false;
      } else {
        return true;
      }
    },
    selectedUnitCityArea() {
      if ( this.selectedUnit.real_estate_city_part !== '' ) {
        return this.selectedUnit.real_estate_city_part;
      }
      return '';
    }
  },
  mounted() {
    this.checkForFilterFromSearchCriteria();
    this.getAllRealEstates();
  },
  watch: {
    projectSearch: async function() {
      if ( this.timeout !== null ){
        clearTimeout(this.timeout);
      }

      // Reset projectsearch
      if ( this.projectSearch.length === 0 ){
        this.projectSearchResults = [];
      }

      // At least 3 letter to search
      if ( this.projectSearch.length < 3 ){
        return false;
      }

      this.isLoading.projectSearch = true;

      let searchTerm = this.projectSearch.toLowerCase();

      searchTerm = searchTerm.replace(/[ ]/g, "_");

      await new Promise(r => this.timeout = setTimeout(r, 1000));

      let allData = this.filteredRealEstates;
      let results = [];
      Object.keys(allData).forEach(function(company) {
        Object.keys(allData[company]).forEach(function(projectname) {
          let projectNameLowerCase = projectname.toLowerCase();
          if ( projectNameLowerCase.indexOf(searchTerm) !== -1 ) {
            results.push(projectname);
          }
        });
      });
      this.projectSearchResults = results;
      this.companySelection = 'all';
      this.toggleKgProjects = false;
      this.toggleLivingProjects = false;
      this.isLoading.projectSearch = false;
    },
    sortAlpha: function(newVal) {
      if ( newVal !== '' ){
        let allData = this.filteredData.data;
        this.sortNumeric = '';
        let realEstatesfilteredData = [];
        Object.keys(allData).forEach(function (company) {
          Object.keys(allData[company]).forEach(function (projectname) {
            Object.keys(allData[company][projectname]).forEach(function (unit) {
              realEstatesfilteredData.push(allData[company][projectname][unit]);
            });
          });
        });
       let order = newVal === 'up' ? 'ASC' : 'DESC';
       this.onlyUnitsForSorting = this.sortArray(realEstatesfilteredData, 'real_estate_id', order);
      } else {
        this.onlyUnitsForSorting = [];
      }
    },
    sortNumeric: function(newVal) {
      if ( newVal !== '' ){
        let allData = this.filteredData.data;
        this.sortAlpha = '';
        let realEstatesfilteredData = [];
        Object.keys(allData).forEach(function (company) {
          Object.keys(allData[company]).forEach(function (projectname) {
            Object.keys(allData[company][projectname]).forEach(function (unit) {
              realEstatesfilteredData.push(allData[company][projectname][unit]);
            });
          });
        });
        let order = newVal === 'up' ? 'ASC' : 'DESC';
        this.onlyUnitsForSorting = this.sortArray(realEstatesfilteredData, 'real_estate_price', order);
      } else {
        this.onlyUnitsForSorting = [];
      }
    },
    selectedUnitImages: {
      deep: true,
      handler: function(newValue, oldValue) {
        if ( this.selectedUnitActiveTab.floorPlans && this.selectedUnitImages['Grundriss'] ) {
          this.getBase64Image(this.selectedUnitImages['Grundriss'][0])
        } else if ( this.selectedUnitActiveTab.image && this.selectedUnitImages['Titelbild'] ) {
          this.getBase64Image(this.selectedUnitImages['Titelbild'][0])
        }
      }
    },
    imageBase64: function() {
      let type;
      if ( this.selectedUnitActiveTab.floorPlans ){
        type = 'floorImage';
      } else if ( this.selectedUnitActiveTab.image ) {
        type = 'flatImage';
      }
      this.createPDFKitImage(type);
    },
    'selectedUnitActiveTab.floorPlans': function(newVal) {
      if ( newVal === true && this.selectedUnitActiveTab.floorPlans && this.selectedUnitImages['Grundriss'] ) {
        this.getBase64Image(this.selectedUnitImages['Grundriss'][0])
      }
    },
    'selectedUnitActiveTab.image': function(newVal) {
      if ( newVal === true && this.selectedUnitActiveTab.image && this.selectedUnitImages['Titelbild'] ) {
        this.getBase64Image(this.selectedUnitImages['Titelbild'][0])
      }
    },
    filteredRealEstates: function(newVal) {
      let projects = {...newVal.kg, ...newVal.living};
      let sortedProjects = Object.keys(projects)
          .sort()
          .reduce((acc, key) => ({
            ...acc, [key]: projects[key]
          }), {})
      this.allFilteredProjects = sortedProjects;
    },
    projectSelection: function(){
      let sortData = {
        kind: false,
        value: false,
      };
      if ( typeof this.sortNumeric !== 'undefined' && this.sortNumeric !== '') {
        sortData.kind = 'real_estate_price';
        sortData.value = this.sortNumeric;
      }
      if ( typeof this.sortAlpha !== 'undefined' && this.sortAlpha !== '') {
        sortData.kind = 'real_estate_id';
        sortData.value = this.sortAlpha;
      }

      if ( sortData.kind && sortData.kind !== '' ){
        let allData = this.filteredData.data;
        this.sortAlpha = '';
        let realEstatesfilteredData = [];
        Object.keys(allData).forEach(function (company) {
          if ( company === 'all' ){
            return;
          }
          Object.keys(allData[company]).forEach(function (projectname) {
            Object.keys(allData[company][projectname]).forEach(function (unit) {
              realEstatesfilteredData.push(allData[company][projectname][unit]);
            });
          });
        });
        let order = sortData.value === 'up' ? 'ASC' : 'DESC';
        this.onlyUnitsForSorting = this.sortArray(realEstatesfilteredData, sortData.kind, order);
      } else {
        this.onlyUnitsForSorting = [];
      }
    }
  }
}

</script>

<template>
  <Navigation/>

  <div class="aft" :class="{'unit-selected': selectedUnit.length !== 0, 'collapsed': collapsFirstCol}">

    <div class="top-bar">
      <div class="top-bar-inner-wrapper">
        <FilterIcon></FilterIcon>
        <span>IMMOBILIEN&shy;FILTER</span>
      </div>

      <div class="top-bar-buttons">
        <div class="top-bar-item patch-notes">
          <Button type="edit" @click="this.patchNotesInit">
            <PatchnotesIcon></PatchnotesIcon>
            Patch notes
          </Button>
        </div>

        <div class="top-bar-item cache-reload" v-if="this.getUserRole() >= 3">
          <Button type="edit" @click="getAllRealEstates(true)">
            <ArrowCircleIcon></ArrowCircleIcon>
            Cache neuladen
          </Button>
        </div>
      </div>
    </div>

    <div class="loading-overlay" v-if="this.isLoading.estates">
      <div class="animation-content">
        <AnimateCircleIcon></AnimateCircleIcon>
        <span>Daten werden geladen</span>
      </div>
    </div>

    <div class="collaps-filtertool-first-col" @click="toggleFirstCol">
      <ArrowLeftIcon v-if="!collaps"></ArrowLeftIcon>
      <ArrowRightIcon v-else></ArrowRightIcon>
    </div>

    <div class="projects-col" v-show="!collapsFirstCol">

      <router-link :to="{name: 'realEstatesFilterView'}" class="main-filter-link">
        <Button type="create reservation" class="main-filter">Filter</Button>
      </router-link>
      <div class="reset-all-filters" @click="resetView" v-if="checkIfIsFiltered"><RemoveFilterIcon></RemoveFilterIcon> Alle Filter zurücksetzen</div>

      <form>

        <div class="field-wrapper product-search">
          <InputField inputType="text" inputPlaceholder="Suche ..." inputName="projectSearch" :inputValue="projectSearch" v-model="projectSearch" ></InputField>
          <AnimateCircleIcon v-if="isLoading.projectSearch"></AnimateCircleIcon>
          <label class="ph">Projektsuche</label>
        </div>

        <div class="field-wrapper pick-option">
          <label for="singleOption" class="radio-wrapper">
            <InputField inputType="radio" id="singleOption" inputName="singleOption" value="single" :inputValue="pickOption" v-model="pickOption" @click="projectSelection = []; selectedUnit = []"></InputField>
            Einzelne Projekte auswählen
          </label>
        </div>
        <div class="field-wrapper pick-option">
          <label for="multiOption" class="radio-wrapper">
            <InputField inputType="radio" id="multiOption" inputName="multiOption" value="multi" :inputValue="pickOption" v-model="pickOption" @click="projectSelection = []; selectedUnit = []"></InputField>
            Mehrere Projekte auswählen
          </label>
        </div>

        <div class="field-wrapper product-search-results" v-if="projectSearchResults.length > 0">
          <div>Gefundene Projekte:</div>
          <label :for="'search-'+indexProjects" v-for="(valProjects, indexProjects) in projectSearchResults" :key="'search-'+indexProjects">
            <InputField :inputType="pickOption === 'multi' ? 'checkbox' : 'radio'" :id="'search-'+indexProjects" :inputName="'search-'+valProjects" :value="valProjects" :inputValue="projectSelection" v-model="projectSelection"></InputField>
            {{ valProjects.replace(/[_]/g, " ") }}
            <span class="unit-count-projects">({{ projectFoundRealEstatesCounter(valProjects) }})</span>
          </label>
        </div>

        <div class="field-wrapper">
          <label for="allProject" class="radio-wrapper">
            <InputField inputType="radio" id="allProject" inputName="allProject" value="all" :inputValue="companySelection" v-model="companySelection" @click="toggleKgProjects = false; toggleLivingProjects = false; projectSelection = []; selectedUnit = []"></InputField>
            Alle Projekte
          </label>
          <div class="dropdown-arrow-button" @click="toggleAllProjects = !toggleAllProjects; toggleLivingProjects = false; toggleKgProjects = false; companySelection = 'all';"><DropdownIcon></DropdownIcon></div>
          <div class="list-of-projects all-projects" v-show="toggleAllProjects">
             <label :for="'all-'+indexProjects" v-for="(valProjects, indexProjects) in allFilteredProjects" :key="'all-'+indexProjects">
              <InputField :inputType="pickOption === 'multi' ? 'checkbox' : 'radio'" :inputName="'all-'+indexProjects" :id="'all-'+indexProjects" :value="indexProjects" :inputValue="projectSelection" v-model="projectSelection"></InputField>
              {{ indexProjects.replace(/[_]/g, " ") }} <span class="unit-count-projects">({{ projectFoundRealEstatesCounter(indexProjects) }})</span>
            </label>
          </div>
        </div>
        <div class="field-wrapper">
          <label for="kg" class="radio-wrapper">
            <InputField inputType="radio" id="kg" inputName="kg" value="kg" :inputValue="companySelection" v-model="companySelection" @click="toggleKgProjects = true; toggleLivingProjects = false; projectSelection = []; selectedUnit = []"></InputField>
            KG Projekte
          </label>
          <div class="dropdown-arrow-button" @click="toggleKgProjects = !toggleKgProjects; toggleLivingProjects = false; companySelection = 'kg';"><DropdownIcon></DropdownIcon></div>
          <div class="list-of-projects" v-show="toggleKgProjects">
            <label :for="indexProjects" v-for="(valProjects, indexProjects) in filteredRealEstates.kg" :key="indexProjects">
              <InputField :inputType="pickOption === 'multi' ? 'checkbox' : 'radio'" :inputName="indexProjects" :id="indexProjects" :value="indexProjects" :inputValue="projectSelection" v-model="projectSelection"></InputField>
              {{ indexProjects.replace(/[_]/g, " ") }} <span class="unit-count-projects">({{ projectFoundRealEstatesCounter(indexProjects) }})</span>
            </label>
          </div>
        </div>
        <div class="field-wrapper">
          <label for="living" class="radio-wrapper">
            <InputField inputType="radio" id="living" inputName="living" value="living" :inputValue="companySelection" v-model="companySelection" @click="toggleKgProjects = false; toggleLivingProjects = true; projectSelection = []; selectedUnit = []"></InputField>
            Living Projekte
          </label>
          <div class="dropdown-arrow-button" @click="toggleLivingProjects = !toggleLivingProjects; toggleKgProjects = false; companySelection = 'living'"><DropdownIcon></DropdownIcon></div>
          <div class="list-of-projects" v-show="toggleLivingProjects">
            <label :for="indexProjects" v-for="(valProjects, indexProjects) in filteredRealEstates.living" :key="indexProjects">
              <InputField :inputType="pickOption === 'multi' ? 'checkbox' : 'radio'" :inputName="indexProjects" :id="indexProjects" :value="indexProjects" :inputValue="projectSelection" v-model="projectSelection"></InputField>
              {{ indexProjects.replace(/[_]/g, " ") }} <span class="unit-count-projects">({{ projectFoundRealEstatesCounter(indexProjects) }})</span>
            </label>
          </div>
        </div>
      </form>
    </div>

    <div class="units-col">

      <div class="unit-col-top">
        <div class="total-count">Gefundene Einheiten: <b>{{ filteredData.count }}</b></div>
        <div class="sort-action">
          <SortAlphabetIcon :class="{ active: sortAlpha !== '' }" :direction="sortAlpha" @click="toggleSortIcons('sortAlpha')"></SortAlphabetIcon>
          <sortNumericIcon :class="{ active: sortNumeric !== '' }"  :direction="sortNumeric" @click="toggleSortIcons('sortNumeric')"></sortNumericIcon>
        </div>
      </div>
      <div class="unit-items-company" :class="indexCompany" v-for="(valCompany, indexCompany) in filteredData.data" :key="indexCompany" v-if="onlyUnitsForSorting.length <= 0">

          <div class="unit-items-project" v-for="(valProjects, indexProjects) in valCompany" :key="indexProjects">
            <div class="unit-item" :class="{ 'active': realEstate.real_estate_sys_id === selectedUnit.real_estate_sys_id }" v-for="realEstate in valProjects" :key="realEstate.real_estate_sys_id" @click="selectUnit({realEstate})">

              <div class="unit-id">
                {{ realEstate.real_estate_id }}
                <span class="project-name">{{ realEstate.real_estate_project_name.replace(/[_]/g, " ") }}</span>
              </div>
              <div class="price"><span>{{ this.numberWithComma(realEstate.real_estate_price) }} €</span></div>

              <div class="meta-data" v-if="realEstate.real_estate_object_type !== 'Parken'">{{ formatRoomNumber(realEstate.real_estate_rooms) + ' Zimmer' }}{{ ' | '+ Math.round(parseFloat(realEstate.real_estate_living_area)) + ' m&sup2;' }}{{ ' | '+ realEstate.real_estate_floor }}</div>
              <div class="meta-data" v-else>{{ realEstate.real_estate_parking_type.length > 0 ? realEstate.real_estate_parking_type[0] : '' }}</div>

              <div class="unit-filters">
                <div class="meta-marker" :class="checkClassForMetaData(realEstate.real_estate_sell_status)" v-if="realEstate.real_estate_sell_status">{{ realEstate.real_estate_sell_status }}</div>
                <div class="meta-marker" :class="checkClassForMetaData(realEstate.real_estate_rent_state)" v-if="realEstate.real_estate_rent_state">{{ realEstate.real_estate_rent_state }}</div>
              </div>

            </div>
        </div>
      </div>
      <div class="unit-items-company" v-else>

        <div class="unit-items-project">
          <div class="unit-item" :class="{ 'active': realEstate.real_estate_sys_id === selectedUnit.real_estate_sys_id }" v-for="realEstate in onlyUnitsForSorting" :key="realEstate.real_estate_sys_id+realEstate.real_estate_id" @click="selectUnit({realEstate})">

            <div class="unit-id">
              {{ realEstate.real_estate_id }}
              <span class="project-name">{{ realEstate.real_estate_project_name.replace(/[_]/g, " ") }}</span>
            </div>
            <div class="price">{{ this.numberWithComma(realEstate.real_estate_price) }} €</div>


            <div class="meta-data" v-if="realEstate.real_estate_object_type !== 'Parken'">{{ formatRoomNumber(realEstate.real_estate_rooms) + ' Zimmer' }}{{ ' | '+ Math.round(parseFloat(realEstate.real_estate_living_area)) + ' m&sup2;' }}{{ ' | '+ realEstate.real_estate_floor }}</div>
            <div class="meta-data" v-else>{{ realEstate.real_estate_parking_type.length > 0 ? (realEstate.real_estate_parking_type[0] === 'Tiefgarage' ? 'TE' : realEstate.real_estate_parking_type[0]) : '' }} {{ realEstate.real_estate_parking_law }}</div>

            <div class="unit-filters">
              <div class="meta-marker" :class="checkClassForMetaData(realEstate.real_estate_sell_status)" v-if="realEstate.real_estate_sell_status">{{ realEstate.real_estate_sell_status }}</div>

              <div class="meta-marker" :class="checkClassForMetaData(realEstate.real_estate_rent_state)" v-if="realEstate.real_estate_rent_state">
                {{ realEstate.real_estate_rent_state }}
              </div>
              <span style="margin-left:5px; color: var(--red);" v-if="['Vermietet'].includes(realEstate.real_estate_rent_state) && !realEstate.real_estate_buy_by_renter">
                <ToolTip hoverText="NonRenterIcon" content="Kein Mieterschutz"></ToolTip>
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div class="unit-detail-col" v-if="selectedUnit.length !== 0">

      <div class="tab-content">
        <div class="tabs">
          <div :class="{'active': selectedUnitActiveTab.floorPlans}" @click="selectedUnitActiveTab.floorPlans = true; selectedUnitActiveTab.map = false; selectedUnitActiveTab.image = false" ><floorplansIcon></floorplansIcon> <span>Grundriss</span></div>
          <div :class="{'active': selectedUnitActiveTab.map}" @click="selectedUnitActiveTab.floorPlans = false; selectedUnitActiveTab.map = true; selectedUnitActiveTab.image = false" ><mapMarkerIcon></mapMarkerIcon> <span>Karte</span></div>
          <div :class="{'active': selectedUnitActiveTab.image}" @click="selectedUnitActiveTab.floorPlans = false; selectedUnitActiveTab.map = false; selectedUnitActiveTab.image = true" ><imagesIcon></imagesIcon> <span>Bild</span></div>
          <div class="open-floorplans-new-tab"><a ref="floorplan-new-tab-url" target="_blank"><externalLinkIcon></externalLinkIcon> <span>Grundriss in neuem Tab öffnen</span></a></div>
        </div>
        <div class="tab-view">
          <div class="floorplans" v-if="selectedUnitActiveTab.floorPlans">
            <div class="animation-content-floorplans" v-if="isLoading.images">
              <AnimateCircleIcon></AnimateCircleIcon>
            </div>
            <span :class="{'in-zoom': imageZoomFactor > 1}" style="width:100%;" v-if="selectedUnitImages['Grundriss']">
              <iframe ref="floorImage"></iframe>
            </span>
            <span class="no-found" v-show="!selectedUnitImages['Grundriss'] && !isLoading.images">
              Es konnten keine Grundrisse gefunden werden.
            </span>
          </div>
          <div class="map" v-show="selectedUnitActiveTab.map">
            <GoogleMap :lat="parseFloat(selectedUnit.real_estate_lat)" :lng="parseFloat(selectedUnit.real_estate_lng)"></GoogleMap>
          </div>
          <div class="images" v-if="selectedUnitActiveTab.image">
            <img :src="selectedUnitImages['Titelbild']" @click="loadImagePopup('Titelbild')">
          </div>
        </div>
      </div>

      <div class="real-estate-meta">

        <div class="meta-item object">
          <div class="meta-item-title">Objekt</div>
          <div class="address">{{ selectedUnit.real_estate_street }}, {{ selectedUnit.real_estate_zipcode }} {{ selectedUnit.real_estate_city +' '+ selectedUnitCityArea }}</div>
          <div class="in-train-area"><span class="label">im S-Bahn-Ring:</span> <CheckmarkIcon v-if="selectedUnit.real_estate_in_train_area"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="building-part"><span class="label">Gebäudeteil:</span> {{ selectedUnit.real_estate_building_part ? selectedUnit.real_estate_building_part : '-' }}</div>
          <div class="floor"><span class="label">Geschoss:</span> {{ selectedUnit.real_estate_floor }}</div>
          <div class="kind-of-use"><span class="label">Nutzungsart:</span> {{ selectedUnit.real_estate_usage_kind }}</div>
          <div class="rooms"><span class="label">Zimmer:</span> {{ formatRoomNumber(selectedUnit.real_estate_rooms) }}</div>
          <div class="living-area"><span class="label">Fläche:</span> {{ Math.round(parseFloat(selectedUnit.real_estate_living_area)) }} m&sup2;</div>
          <div class="condition"><span class="label">Neubau / Bestand:</span> {{ selectedUnit.real_estate_condition }}</div>
          <div class="condition"><span class="label">Fertig / Leer:</span> {{ selectedUnit.real_estate_available_from !== '' ? selectedUnit.real_estate_available_from : 'Keine Angabe' }}</div>
        </div>
        <div class="meta-item features">
          <div class="meta-item-title">Ausstattung</div>
          <div class="balcony"><span class="label">Balkon:</span>  <CheckmarkIcon v-if="selectedUnit.real_estate_balcony"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="terrace"><span class="label">Terrasse:</span> <CheckmarkIcon v-if="selectedUnit.real_estate_terrace"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="garden"><span class="label">Garten:</span> <CheckmarkIcon v-if="selectedUnit.real_estate_garden"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="basement"><span class="label">Keller:</span> <CheckmarkIcon v-if="selectedUnit.real_estate_has_basement"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="lift"><span class="label">Aufzug:</span> <CheckmarkIcon v-if="selectedUnit.real_estate_lift"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="parking" style="flex-wrap: wrap;">
            <span class="label">Stellplatz:</span>
            <CheckmarkIcon v-if="selectedUnit.real_estate_parking"></CheckmarkIcon><closeIcon v-else></closeIcon>
            <span style="flex-basis: 100%; font-size: 12px;" v-if="selectedUnit.real_estate_parking && selectedUnit.real_estate_parking_included !== 'Nein'">({{ selectedUnit.real_estate_parking_included.replaceAll('Ja, ', '') }})</span>
          </div>
        </div>

        <div class="meta-item finance">
          <div class="meta-item-title">Finanzen</div>
          <div class="price"><span class="label">Kaufpreis:</span> {{ this.numberWithComma(selectedUnit.real_estate_price) }} €</div>
          <div class="price-squaremetres"><span class="label">Kaufpreis / m&sup2;:</span> {{ format2TwoDezimalNumber(selectedUnit.real_estate_price_squaremetres) }} €</div>
          <div class="rent-per-month"><span class="label">Grundmiete:</span> {{ format2TwoDezimalNumber(selectedUnit.real_estate_rent_per_month) }} €</div>
          <div class="net-cold-rent"><span class="label">JNKM:</span> {{ format2TwoDezimalNumber(selectedUnit.real_estate_net_cold_rent) }} €</div>
          <div class="house-money"><span class="label">Hausgeld:</span> ca. {{ format2TwoDezimalNumber(selectedUnit.real_estate_housemoney) }} €</div>
          <div class="yield"><span class="label">Rendite:</span> {{ format2TwoDezimalNumber(selectedUnit.real_estate_yield) }} %</div>
          <div class="renter-protection"><span class="label">Mieterschutz:</span> <CheckmarkIcon v-if="selectedUnit.real_estate_buy_by_renter"></CheckmarkIcon><closeIcon v-else></closeIcon></div>
          <div class="renter-protection"><span class="label">Provision:</span>{{ selectedUnit.real_estate_commission ? selectedUnit.real_estate_commission : 'Nein' }}</div>
        </div>
        </div>

    </div>

  </div>

  <RealEstatesFilterView @submitFilters="getSelectedFilters" @resetFilter="resetView" :resetTrigger="triggerFilterViewReset" :countedUnits="filteredData.countRawRealEstates" :searchCriteriaFilter="filterFromSearchCriteria"></RealEstatesFilterView>

  <div class="modal-wrapper images" :class="{ active: isOpenModalImages, isLoading: isLoading }" v-if="isOpenModalImages">
    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <span class="title">{{ modalImagesTitel }}
        </span>
        <CloseIcon @click="isOpenModalImages = false;"></CloseIcon>
      </div>

      <div class="modal-body">
        <img :src="imageToDisplayInPopup">
      </div>

    </div>
  </div>

</template>

<style scoped>

.aft {
  background-color: #eeeeee;
  align-items:flex-start;
  align-content:flex-start;
}

.aft, .list-of-projects, .units-col, .unit-filters, .unit-item, .top-bar,
.unit-col-top {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
}

.aft.collapsed .units-col {
  padding-left: 5px
}

.aft.collapsed .unit-detail-col {
  flex-basis: 75%;
}

.top-bar {
  background: var(--dark-gray);
  color: white;
  padding: 30px;
  font-size: 20px;
  justify-content: space-between;
  align-items: center;
}

.top-bar .top-bar-inner-wrapper i {
  margin-right: 15px;
}

.loading-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99999;
}

.loading-overlay:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.8;
}

.animation-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.cache-reload {
  cursor: pointer;
}

.animation-content .loading-animation, .animation-content-floorplans .loading-animation {
  font-size: 60px;
  margin: 0 0 15px;
  text-align: center;
}

.animation-content-floorplans .loading-animation {
  font-size: 40px;
}

.projects-col, .units-col {
  flex-basis: 15%;
  padding: 25px;
  overflow-y: scroll;
  max-height: 100vh;
  max-width: 350px;
}

.projects-col {
  flex-basis: 20%;
}

.projects-col > a {
  position: sticky;
  top: 0;
  z-index: 9;
}

.units-col {
  padding: 0;
}

.units-col {
  flex-basis: 25%;
  align-items:flex-start;
  align-content:flex-start;
}

.tab-content .tabs > div {
  padding: 10px 35px;
  background-color: var(--blue);
  color: white;
  text-align: center;
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-bottom: 25px;
}

.tabs > div:not(.active) {
  background-color: white;
  color: gray;
  border-bottom: none;
}

.unit-filters > div {
  display: flex;
  flex-basis: 45%;
  align-items: center;
  justify-content: center;
}

.unit-filters {
  justify-content: space-between;
  align-items: center;
}

.unit-item {
  padding: 25px;
  border-top: solid 1px black;
}

.unit-filters {
  padding: 15px 0 0;
}

.projects-col form .radio-wrapper {
  display: flex;
  align-items: center;
}

.projects-col form .radio-wrapper > input {
  flex-basis: 35px;
  width: 35px;
}

.projects-col form .field-wrapper {
  position: relative;
  margin-bottom: 25px;
}

.dropdown-arrow-button {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--blue);
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.list-of-projects.all-projects > span {
  display: flex;
  flex-wrap: wrap;
}

.list-of-projects label {
  flex-basis: 100%;
  cursor: pointer;
  margin-top: 15px;
  padding-left: 10px;
}

.unit-count-projects {
  font-size: 12px;
}

.unit-item .unit-id{
  flex-basis: 50%;
}

.unit-item {
  justify-content: space-between;
}

.unit-item.active, .unit-item:hover {
  background: #eaeaea;
  cursor: pointer;
}

.unit-items-company {
  flex-basis: 100%;
  background-color: white;
}

.unit-items-company .price > span {
  display: inline-block;
  margin-bottom: 15px;
}

.unit-detail-col {
  flex-basis: 50%;
  padding: 25px;
  overflow-y: scroll;
  max-height: 100vh;
  flex-grow: 1;
}

.tab-content .tabs {
  display: flex;
  flex-wrap: wrap;
}

.tab-content .tabs > div {
  margin-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.tab-content .tabs > div + div {
  margin-left: 15px;
}

.tab-content .tabs > div + div.open-floorplans-new-tab {
  align-self: auto;
  margin-left: auto;
}

.tab-view {
  height: 40vw;
  padding: 10px;
  background-color: white;
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  margin-bottom: 20px;
}

.tab-view * {
  height: 100%;
  width: 100%;
}

.floorplans, .map, .images {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.floorplans {
  position: relative;
  width: 100%;
  height: 100%;
}

.in-zoom {
  overflow: hidden;
  width: 100%;
}

.floorplans img {
  position: absolute;
  top: 0;
  left: 0;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.floorplans .in-zoom img {
  cursor: grab;
}

.img-actions > div {
  cursor: pointer;
}

.floorplans > span.no-found {
  flex-basis: 100%;
  cursor: auto;
}

.floorplans img, .images img {
  max-width: 100%;
}

.real-estate-meta > div .label {
  flex-basis: 30%;
  font-weight: 700;
}

.real-estate-meta > div i {
  cursor: auto;
}

.total-count {
  text-align: left;
  margin-top: 35px;
  font-style: italic;
  margin-bottom: 25px;
}

.modal-wrapper.images .modal-inner-wrapper {
  min-width: 90%;
  max-width: 90%;
}

.modal-wrapper.images .modal-inner-wrapper img {
  max-width: 100%;
}

.modal-wrapper.images .modal-body {
  text-align: center;
}

.unit-items-project .unit-id {
  font-size: 18px;
}

.unit-items-project .price {
  font-size: 26px;
}

.unit-items-project .unit-id, .meta-item-title {
  font-weight: 700;
}

.unit-items-project .unit-id .project-name {
  display: block;
  margin-bottom: 25px;
}

.unit-items-project .meta-data {
  width: 100%;
  text-align: center;
}

.unit-filters .meta-marker {
  padding: 3px 0;
  border-radius: 15px;
  font-weight: 700;
}

.unit-filters .meta-marker.green {
  background-color: rgba(69, 158, 77, 0.1);
  color: var(--green);
}

.unit-filters .meta-marker.orange {
  background-color: rgba(242, 144, 39, 0.1);
  color: var(--orange);
}

.unit-filters .meta-marker.red {
  background-color: rgba(217, 65, 57, 0.1);
  color: var(--red);
}

.unit-filters .meta-marker.yellow {
  background-color: rgba(255, 255, 207, 0.1);
  color: var(--orange);
}

.real-estate-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.real-estate-meta > div {
  flex-basis: 37.5%;
  padding: 15px 10px;
  background: white;
  border-radius: var(--border-radius);
}

.real-estate-meta > div.features{
  flex-basis: 20%;
}

.meta-item-title {
  font-size: 20px;
}

.meta-item > div {
  display: flex;
}

.meta-item.features > div, .meta-item.finance > div {
  display: flex;
  justify-content: space-between;
}

.meta-item > div .label {
  flex-basis: 50%;
}

.meta-item > div + div {
  margin-top: 5px;
}

.meta-item > div.meta-item-title + div {
  margin-top: 15px;
}

input[name="projectSearch"] + .ph {
  background: transparent;
}

input[name="projectSearch"]:not(:placeholder-shown)~label, input[name="projectSearch"]:focus~label {
  top: -15px;
}

.product-search .loading-animation {
  position: absolute;
  right: 10px;
  top: 5px;
}

.projects-col form .field-wrapper.product-search-results {
  margin-bottom: 50px;
}

.projects-col form .field-wrapper.product-search-results label {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
}

.projects-col form .field-wrapper.product-search-results label input {
  flex-basis: auto;
  width: 20px;
  height: 20px;
  top: 0;
  margin-right: 5px;
  margin-left: 0;
}

.projects-col form .field-wrapper.product-search-results label {
  margin-top: 15px;
}

.projects-col form .field-wrapper.product-search-results .unit-count-projects {
  margin-left: 5px;
}

input[type="checkbox"] {
  border: solid 2px black;
  height: 20px;
  width: 20px;
  padding: 0;
}

.img-actions {
  position: absolute;
  right: 35px;
  bottom: 25px;
  height: auto;
  font-size: 18px;
  background: white;
  color: var(--dark-gray);
  padding: 10px;
}

.img-actions > div + div {
  margin-top: 10px;
}

.unit-col-top {
  justify-content: space-between;
  align-items: center;
}

.sort-action {
  font-size: 30px;
}

.sort-action i {
  cursor: pointer;
  padding: 5px;
}

.sort-action i.active {
  background: #D7D7D7FF;
  border-radius: 5px;
}

.sort-action i + i{
  margin-left: 10px;
}

.pick-option + .pick-option {
  border-bottom: solid 1px var(--light-gray);
  padding-bottom: 25px;
}

.list-of-projects input.radio {
  position: relative;
  top: 5px;
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.collaps-filtertool-first-col {
  position: fixed;
  bottom: 5px;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--dark-gray);
  color: white;
  z-index: 5;
}

.reset-all-filters {
  color: var(--red);
  cursor: pointer;
  text-align: center;
}

.main-filter-link + .reset-all-filters {
  margin-bottom: 35px;
  margin-top: 15px;
}

.main-filter-link + form {
  margin-top: 50px;
}

.patch-notes, .cache-reload {
  font-size:14px;
  color: white;
}

.patch-notes .button.blue.border, .cache-reload .button.blue.border {
  color: white;
  border-color: white;
}

.top-bar-buttons {
  display: flex;
  flex-wrap: wrap;
}

.top-bar-buttons .top-bar-item + .top-bar-item {
  margin-left: 15px;
}

@media (max-width: 1520px) {
  .open-floorplans-new-tab a > span {
    display: none;
  }
}

@media (max-width: 1400px){
  .projects-col {
    flex-basis: 25%;
  }
  .units-col {
    flex-basis: 25%;
  }
  .unit-detail-col {
    flex-basis: 50%;
  }
  .real-estate-meta > .meta-item, .real-estate-meta > div.features {
    flex-basis: 47%;
  }
  .real-estate-meta > .meta-item.finance {
    flex-basis: 100%;
    margin-top: 25px;
  }
}

@media (max-width:1180px) {
  .projects-col, .units-col, .unit-detail-col {
    padding: 10px;
  }
  .unit-items-project .price {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .unit-item {
    justify-content: center;
  }
  .unit-items-project .unit-id .project-name {
    margin-bottom: 10px;
  }
  .unit-item .unit-id {
    flex-basis: 100%;
    text-align: center;
  }
  .unit-col-top {
    justify-content: center;
  }
  .total-count {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .sort-action {
    margin-bottom: 15px;
  }
  .tabs > div > span {
    display: none;
  }
}

@media (max-width: 1024px){
  .projects-col, .units-col {
    flex-basis: 50%;
    max-height: 100vh;
    transition: max-height 0.2s;
    max-width: unset;
  }
  .aft.unit-selected .projects-col, .aft.unit-selected .units-col {
    max-height: 50vh;
  }
  .unit-detail-col {
    border-top: solid 1px;
    flex-basis: 100%;
    overflow-y: unset;
    max-height: unset;
  }
  .tab-view {
    height: 55vh;
  }
}

@media (max-width: 767px) {
  .aft {
    max-width: 100%;
  }

  .projects-col, .units-col, .unit-detail-col, .real-estate-meta > div, .real-estate-meta > div.features,
  .real-estate-meta > .meta-item, .real-estate-meta > div.features {
    flex-basis: 100%;
  }

  .meta-item.object > div {
    justify-content: space-between;
  }

  .real-estate-meta .meta-item + .meta-item {
    margin-top: 15px;
  }

}

</style>
