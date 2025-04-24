<script>
import axios from "axios";
import Navigation from "@/components/Navigation.vue";
import CreateReservationProgressBar from "@/components/card/CreateReservationProgressBar.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import Seperator from "@/components/utility/Seperator.vue";
import Button from "@/components/buttons/button.vue";
import ErrorView from "@/views/ErrorView.vue";
import SearchCriteriaForm from "@/components/forms/SearchCriteriaFormForDataroom.vue";
import CryptoJS from "crypto-js";
import SearchIcon from "@/components/icons/icon-search.vue";
import DataroomProjectSelection from "@/components/forms/DataroomProjectSelection.vue";
import DataroomUnitSelection from "@/components/forms/DataroomUnitSelection.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import TextAreaField from "@/components/forms/TextAreaField.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import DeleteIcon from "../../components/icons/icon-delete.vue";
import EditIcon from "@/components/icons/icon-edit.vue";
import InfoIcon from "@/components/icons/icon-info.vue";
import {Tooltip} from "floating-vue";
import ToolTip from "@/components/utility/ToolTip.vue";
import FilesIcon from "@/components/icons/icon-files.vue";
import CloseIcon from "@/components/icons/icon-close.vue";

const encryptKey = import.meta.env.VITE_LOCAL_STORAGE_ENCRYPT_KEY;

export default {
  name: 'newDataRoomTool',
  components: {
    CloseIcon,
    FilesIcon,
    ToolTip,
    Tooltip,
    InfoIcon,
    EditIcon,
    DeleteIcon,
    AsterixMarkIcon,
    TextAreaField,
    DropdownArrow,
    PlusIcon,
    DataroomUnitSelection,
    DataroomProjectSelection,
    SearchIcon,
    SearchCriteriaForm,
    ErrorView,
    Button,
    Seperator,
    Dropdown, InputField, AnimateCircleIcon,
    CreateReservationProgressBar,
    Navigation
  },
  emits: ['finished', 'currentStep'], // Declare the custom event
  props: {
    customerDatas: {
      type: [Array, Object],
      default: {},
    },
    showOnlySearchCriterias: {
      type: Boolean,
      default: false,
    },
    compareSearchCriteria: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentStep: this.showOnlySearchCriterias ? 2 : 1,
      maxSteps: this.showOnlySearchCriterias ? 2 : 7,
      isLoading: false,
      isSearchCriteriaLoading: false,
      activeSearchCriteriaIndex: 0,
      initAddAdditionalInformationsToRealEstatesDone: false,
      isLoadingAttachment: false,
      customerSearchInput: '',
      customerData: {},
      customerDataMicroservice: {},
      cancelTokenCustomerSearch: null,
      company: 'kg',
      searchedLivingCustomerFinal: false,
      customerSearchCriterias: [],
      searchCriteriaToSubmit: [],
      searchCriteriaFormsFromApiFetch: [],
      searchCriteriaToMatchFormsFromApiFetch: [],
      deleteSCIndexForSearchCriteriaCompontent: '',
      activeCustomerSearchCriteriaData: [],

      currentUsedSearchCriteriaCombinations: [],

      isNameChangeActive: false,

      searchCriteriaIds: [],

      mergedData: {},
      mergedDataFinished: {},

      matchingRealEstates: [],

      triggerSearchCriteriaDeleteProcess: '',
      triggerSearchCriteriaAddProcess: '',
      projectAndUnitDatalist: {},

      emailPdfExposeResponse: {},

      currentFormStepValid: true,
      currentFormStepErrorMsg: '',

      isEmailSubmitApiResponse: false,
      isEmailSubmitLoading: false,
      jumpToFilteringTool: true,

      foundCustomersList: [],

      dropdownsShow: {
        showCustomerDropdown: false,
        showEmailLanguageDropdown: false,
      },

      automaticSearchCriteriaToolTipText: 'Dies ist ein automatisches ausgefülltes Suchprofil. Es besteht aus Daten von Immobilien die der Kunde angefragt hat. Es kann nach belieben geändert werden.',

      iframeLoaded: false,

      dropdownContent: {
        emailContent: [
            'Deutsch',
            'Englisch',
            'Französisch',
            'Polnisch',
            'Niederländisch',
            'Spanisch'
        ]
      },

      emailLanguage: 'Englisch',
      emailTemplate: 'de',
      emailSubject: 'Ihre Anfrage bei Best Place',
      emailContent: '',
      emailContentModified: '',
      emailContentFixed: '',
      emailTemplateAPI: '',
      dropdownRelativePosition: false,

      isValidProjectSelection: true,

      typeOfMail: 'link',

      validSearchCriterias: {},

      agentActionLogs: [],
      isAgentActionLogsLoding: false,
      showAllAgentActionLogs: false,

      showInformationsOnCustomerDataroom: 'agent',

      isSpainUser: false,
    }
  },
  methods: {
    getActiveSelectedSearchCriteriaProjects() {
      let projectNames = [];
      for (let index in this.customerSearchCriterias) {
        let searchCriteria = this.getSearchCriteriaData(this.customerSearchCriterias[index]);
        if ( searchCriteria?.data === undefined || searchCriteria.data?.project_addresses === undefined ) {
          continue;
        }
        for (let projectName in searchCriteria.data.project_addresses) {
          if ( searchCriteria.data.project_addresses[projectName].selected ) {
            projectNames.push(projectName)
          }
        }
      }

      return projectNames;
    },
    editSearchCriterianame(index) {
      this.isNameChangeActive = index;
    },
    async getExistingSearchCriteria() {

      this.isSearchCriteriaLoading = true;

      let dataToSend = {
        'data': {
          id: this.customerDataMicroservice.id
        }
      };

      try {
        const response = await axios.post(this.globalApiMicroserviceBaseUrl + '/searchcriteria/all', dataToSend );
        if ( response.status === 200 ) {

          let filteredData = this.filterOnlyImportantSearchCriteria(response.data);

          this.updateExistingSearchCriteria(filteredData.searchCriterias);
          this.searchCriteriaToMatchFormsFromApiFetch = filteredData.searchCriteriaToMerge;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isSearchCriteriaLoading = false;
      }
    },
    async searchCustomers(dataToSendPredefined = false) {

      // dataToSendPredefined is used only when data comes in from dataroom

      if ( !dataToSendPredefined ) {
        if ( this.isLoading || this.customerSearchInput.length < 3 ) {
          return;
        }
      }

      this.isLoading = true;

      let dataToSend = {};
      if ( !dataToSendPredefined ) {
        dataToSend = {
          data: {
            customer_email: this.customerSearchInput,
          }
        };
      } else {
        dataToSend = dataToSendPredefined;
      }

      axios.post(this.globalApiMicroserviceBaseUrl + '/address/single', dataToSend,
   {
            cancelToken: new axios.CancelToken((cancel) => {
              this.cancelTokenCustomerSearch = cancel;
            }),
          }
        )
        .then(
            (response) => {
              if ( response.status === 200 ){
                this.customerDataMicroservice = response.data;

                if ( !dataToSendPredefined ){
                  if ( !this.isEmpty(response.data) ) {
                    this.foundCustomersList = response.data;
                    this.dropdownsShow.showCustomerDropdown = true;
                  } else {
                    this.foundCustomersList = [];
                    this.dropdownsShow.showCustomerDropdown = false;
                  }
                } else {
                  // Do this only when data comes in from dataroom
                  if ( !this.isEmpty(response.data) ) {
                    this.customerData = response.data;
                  }
                }

                this.isLoading = false;
              }
            }
        )
        .catch(
            (error) => {
              this.foundCustomersList = [];
              this.dropdownsShow.showCustomerDropdown = true;

              if ( !axios.isCancel(error) ) {
                this.isLoading = false;
              }
            }
        )
    },
    updateExistingSearchCriteria(newFetchedSearchCriteria) {
      this.customerSearchCriterias = newFetchedSearchCriteria;
    },
    getAllDataForProjectsUnits() {

      let array = [];
      for (let index in this.customerSearchCriterias) {
        let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[index]);
        if ( searchCriteriaData.data?.project_addresses !== undefined ) {
          for ( let projectName of Object.keys(searchCriteriaData.data.project_addresses) ) {
            array.push(projectName);
          }
        }
      }
      if ( !this.isEmpty(array) ) {
        this.getProjectUnitsData(array)
      }
    },
    getProjectUnitsData(projectNames) {
      let dataToSend = {
        data: {
          project_names: projectNames,
          company: this.company,
          filter: {sell_status: ['Verfügbar']}
        }
      };

      axios.post(this.globalApiMicroserviceBaseUrl + '/realestate/projects', dataToSend )
      .then(
            (response) => {
              if ( response.status === 200 ){
                this.projectAndUnitDatalist = response.data;
              }
            }
        )
        .catch(
            (error) => {
              console.log(error)
            }
        )
    },
    restartCustomerSearch  () {
      if (this.cancelTokenCustomerSearch) {
        this.isLoading = false;
        this.cancelTokenCustomerSearch();
      }
      this.searchCustomers();
    },
    setDropdownTop($event) {
      const eleName = $event.target.name;
      const additionalSpace = 5;
      if (this.$refs['input' + eleName] !== undefined) {
        this.$refs['dropdown' + eleName].$el.style.top = this.$refs['input' + eleName].$el.clientHeight + additionalSpace + 'px';
      }
      if (!this.isInViewport(this.$refs['dropdown' + eleName].$el)) {
        this.dropdownRelativePosition = true;
        this.$refs['dropdown' + eleName].$el.style.top = '0px';
      } else {
        this.dropdownRelativePosition = false;
      }
    },
    dropdownClick(field, clickedText) {
      let selectedId = null;
      if ( typeof clickedText === 'object' ) {
        let eventObject = clickedText;
        clickedText = eventObject.target.innerText;
        selectedId = parseInt(eventObject.target.dataset.id);
      }

      if (field === 'mail') {
        const clickedTextRemovedWhitespace = clickedText.replace(/\s+/g, "");
        const arr = clickedTextRemovedWhitespace.split("|"); // split the string by " | " delimiter
        const clickedMail = arr[0];
        let isAlreadySet = false;
        Object.entries(this.foundCustomersList).forEach(([index, value]) => {
          let dataset = value.dataset;
          if ( !isAlreadySet ) {
            if ( typeof selectedId !== 'undefined' && selectedId !== null ) {
              if ( value.id === selectedId ) {
                this.customerData = value;
                this.customerDataMicroservice = value;
                isAlreadySet = true;
              }
            } else if (dataset.address_email === clickedMail && dataset.address_phone[0] !== '' && dataset.address_phone[0] === arr[1] ) {
              this.customerData = value;
              this.customerDataMicroservice = value;
              isAlreadySet = true;
            }
          }
        });
        this.customerSearchInput = clickedMail;
      } else {
        this.$data[field] = clickedText;
      }
      this.closeDropdowns();
    },
    closeDropdowns() {
      for (const index in this.dropdownsShow) {
        this.dropdownsShow[index] = false;
      }
    },
    async validateStep() {

      this.iframeLoaded = false;

      if ( this.currentStep === 1 ) {
        if ( this.customerData && Object.keys(this.customerData).length > 0 ) {
          this.currentFormStepValid = true;
        } else {
          this.currentFormStepValid = false;
          this.notificationBannerInit(
              "warning",
              "Bitte Kunden auswählen"
          );
        }
        if ( this.typeOfMail === 'mail' ) {

          if ( this.isSpainUser ) {
            await this.sendSpainDummySearchCriteria();
            this.currentStep = this.maxSteps - 2; // Move to preview
          } else {
            this.currentStep = this.maxSteps - 1; // Move to mails
          }

          return;
        }
      } else if ( this.currentStep === 2 || this.currentStep === 3 || this.currentStep === 4 ) {
        let allFinished = true;
        let mergedSearchCriteriaIds = [];
        if ( typeof this.mergedData !== 'undefined' && Object.keys(this.mergedData).length > 0 ) {
          for (let index in this.mergedData) {
            let searchCriteriaIdIsValid = true;
            for(let index2 in this.mergedData[index]) {
              if (typeof this.mergedData[index][index2].mergeStatus !== 'undefined' && this.mergedData[index][index2].mergeStatus === null) {
                allFinished = false;
                searchCriteriaIdIsValid = false;
              }
            }
            if ( searchCriteriaIdIsValid ) {
              mergedSearchCriteriaIds.push(this.mergedData[index].searchCriteriaId);
            }
          }
        }

        if ( !allFinished ) {
          this.notificationBannerInit(
              "warning",
              "Es gibt Kundenwünsche die noch nicht bearbeitet wurde. Überprüfe alle Suchprofile"
          );
          return
        }

        if ( !this.isEmpty(mergedSearchCriteriaIds) ) {
          const mergedUpdateAPIResponse = await this.sendMergedSearchCriteriasToUpdate(mergedSearchCriteriaIds);
        }

        const allSuccessfullySubmitted = await this.sendSearchCriterias();

        this.currentFormStepValid = allSuccessfullySubmitted;
        if ( allSuccessfullySubmitted ) {
          await this.getExistingSearchCriteria();
        }

        if ( this.currentStep === 2 ) {
          if ( typeof Object.keys(this.searchCriteriaToSubmit).length === 'undefined' || Object.keys(this.searchCriteriaToSubmit).length === 0 ) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
                "warning",
                "Kein Suchprofil gefunden"
            );
          }
        }
        if ( this.currentStep === 3 ) {
          let allSearchCriteriaGotProjects = [];
          let isNonMatchingSelectedProjectActive = false;
          for(let index in this.customerSearchCriterias) {
            let status = false;

            let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[index]);
            let searchCriteriaMatchingProjects = this.matchingRealEstates[searchCriteriaData.searchCriteriaId];

            if ( Object.keys(searchCriteriaMatchingProjects).length === 0 ) {
              isNonMatchingSelectedProjectActive = true;
            }

            if ( searchCriteriaData.data?.project_addresses !== undefined && Object.keys(searchCriteriaData.data.project_addresses).length > 0 ) {
              for (let projectName in searchCriteriaData.data.project_addresses ) {
                if ( searchCriteriaMatchingProjects?.[projectName] === undefined ) {
                  isNonMatchingSelectedProjectActive = true;
                }
                if ( searchCriteriaData.data.project_addresses[projectName].selected ) {
                  status = true;
                }
              }
            } else {
              status = false;
            }
            allSearchCriteriaGotProjects.push(status);
          }

          if ( allSearchCriteriaGotProjects.includes(false) || isNonMatchingSelectedProjectActive ) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
              "warning",
                "Jedes Suchprofil braucht mind. 1 Projekt"
            );
          }

          if ( !this.isValidProjectSelection ) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
              "warning",
                "Projekte die nicht mehr passen (rot markiert) müssen abgewählt werden."
            );
          }
        }
        if ( this.currentStep === 4 ) {
          let allSearchCriteriaGotUnits = [];
          for(let index in this.customerSearchCriterias) {
            let status = false;

            let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[index]);
            if ( searchCriteriaData.data?.project_addresses !== undefined && Object.keys(searchCriteriaData.data.project_addresses).length > 0 ) {
              for (let projectName in searchCriteriaData.data.project_addresses ) {
                if ( searchCriteriaData.data.project_addresses[projectName].selected && searchCriteriaData.data.project_addresses[projectName].nr.length > 0 ) {
                  status = true;
                }
              }
            } else {
              status = false;
            }
            allSearchCriteriaGotUnits.push(status);
          }
          if ( allSearchCriteriaGotUnits.includes(false) ) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
                "warning",
                "Jedes Suchprofil braucht mind. 1 ausgewählte Einheit"
            );
          }
        }
      } else if ( this.currentStep === 5 ) {
        // this.getPdfExpose();
        this.getEmailTemplate();
      }

      if ( !this.currentFormStepValid ) {
        return;
      }

      if ( (this.currentStep+1) === this.maxSteps) {
        // trigger page before last page
        await this.sendEmail();

        this.updateCustomerData();

        if ( !this.isEmailSubmitApiResponse ) {
          return;
        }

      }

      this.getAllDataForProjectsUnits();

      this.currentStep += 1;

    },
    async saveSearchCriterias() {

      this.isLoading = true;

      const allSuccessfullySubmitted = await this.sendSearchCriterias();

      this.currentFormStepValid = allSuccessfullySubmitted;
      if ( allSuccessfullySubmitted ) {
        let transformedObject = {};
        if ( this.jumpToFilteringTool && this.showOnlySearchCriterias ) {

          for (let key in this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex]) {
            if (this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].hasOwnProperty(key)) {
              transformedObject[key] = this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex][key].value;
            }
          }

        }
        this.$emit('finished', {status:true, jumpToFilter: this.jumpToFilteringTool, transformedObject});
      }
    },
    navBack() {
      if ( this.currentStep === this.maxSteps ) {
        window.location.reload();
      } else {
        if ( this.typeOfMail === 'mail' ) {
          this.currentStep = 1;
        } else {
          this.currentStep -= 1;
        }
      }
    },
    addAdditionalInformationsToRealEstates() {
      for (const index in this.customerSearchCriterias) {
        if ( !this.isEmpty(this.customerSearchCriterias[index]) ){
          let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[index]);
          let projectAddresses = this.customerSearchCriterias[index].search_criteria[searchCriteriaData.country][searchCriteriaData.city][searchCriteriaData.type]['project_addresses'];
          for (const projectName in projectAddresses) {
            if (typeof projectAddresses[projectName]['information_selection_all'] === 'undefined' ) {
              projectAddresses[projectName] = { ...projectAddresses[projectName], information_selection_all: false };
            }
            if (typeof projectAddresses[projectName]['selected'] === 'undefined' ) {
              projectAddresses[projectName] = { ...projectAddresses[projectName], selected: true };
            }
          }
        }
      }
    },
    prepareSearchCriteriaToSubmit(searchCriteriaIndex) {

      for ( let key in this.searchCriteriaToSubmit[searchCriteriaIndex] ) {
        if ( this.searchCriteriaToSubmit[searchCriteriaIndex][key].required ) {
          if ( this.isEmpty(this.searchCriteriaToSubmit[searchCriteriaIndex][key].value) ) {
            return false;
          }
        }
      }

      let country = this.searchCriteriaToSubmit[searchCriteriaIndex].country.value;
      let city = this.searchCriteriaToSubmit[searchCriteriaIndex].city.value;
      let usageType = this.searchCriteriaToSubmit[searchCriteriaIndex].usageType.value;

      if (this.isEmpty(country) || this.isEmpty(city) || this.isEmpty(usageType)) {
        return false;
      }

      let data = {
        [country]: {
          [city]: {
            [usageType]: {
            }
          }
        }
      }

      let searchCriteriaData = {};
      let keys = Object.keys(this.searchCriteriaToSubmit[searchCriteriaIndex]);
      for (let i = 0; i < keys.length; i++) {

        let key = keys[i];

        let value = this.searchCriteriaToSubmit[searchCriteriaIndex][key].value;
        if ( typeof value === 'string' && value === 'false' ) {
          value = false;
        } else if ( typeof value === 'string' && value === 'true' ) {
          value = true;
        }

        if ( typeof value === 'undefined' || value === null ) {
          continue;
        }

        let snakeCaseKey = this.toSnakeCase(key);
        if ( snakeCaseKey === 'parking_space' ) {
          snakeCaseKey = 'parking_slot';
        }

        if ( snakeCaseKey === 'pool' ) {
          snakeCaseKey = 'swimmingpool';
        }

        if ( snakeCaseKey === 'near_golf' ) {
          snakeCaseKey = 'golf';
        }

        if ( snakeCaseKey === 'real_estate_type' ) {
          snakeCaseKey = 'object_type';
          value = value === 'Alle' || value === false || value.includes('Alle') ? null : value;
        }

        if (snakeCaseKey === 'rent_status') {
          if (value.includes('Alle')) {
            value = null;
          } else if (value.includes('Bezugsfrei / Bezugsfertig')) {
            // Entferne "Bezugsfrei / Bezugsfertig" aus dem Array
            value = value.filter(item => item !== 'Bezugsfrei / Bezugsfertig');
            // Füge "Bezugsfrei" und "Bezugsfertig" hinzu
            value.push('Bezugsfrei', 'Bezugsfertig');
          }
        }

        if ( snakeCaseKey === 'district' || snakeCaseKey === 'local_area' ) {
          value = value === 'Alle' || value === false || value.includes('Alle') ? [null] : value;
        }

        searchCriteriaData[snakeCaseKey] = value;

        if (!searchCriteriaData['rooms']) {
          searchCriteriaData['rooms'] = {};
        }
        if ( snakeCaseKey === 'rooms_from' ) {
          searchCriteriaData['rooms']['from'] = value === '' ? null : parseFloat(parseFloat(value).toFixed(2));
        }
        if ( snakeCaseKey === 'rooms_to' ) {
          searchCriteriaData['rooms']['to'] =value === '' ? null : parseFloat(parseFloat(value).toFixed(2));
        }

        if (!searchCriteriaData['bathrooms']) {
          searchCriteriaData['bathrooms'] = {};
        }
        if ( snakeCaseKey === 'bath_rooms_from' ) {
          searchCriteriaData['bathrooms']['from'] = value === '' ? null : parseFloat(parseFloat(value).toFixed(2));
        }
        if ( snakeCaseKey === 'bath_rooms_to' ) {
          searchCriteriaData['bathrooms']['to'] =value === '' ? null : parseFloat(parseFloat(value).toFixed(2));
        }

        if (!searchCriteriaData['square_meters']) {
          searchCriteriaData['square_meters'] = {};
        }
        if ( snakeCaseKey === 'square_metres_from' ) {
          searchCriteriaData['square_meters']['from'] = value === '' ? null : parseFloat(parseFloat(value).toFixed(2));
        }
        if ( snakeCaseKey === 'square_metres_to' ) {
          searchCriteriaData['square_meters']['to'] = value === '' ? null : parseFloat(parseFloat(value).toFixed(2));
        }

        if (!searchCriteriaData['year_of_construction']) {
          searchCriteriaData['year_of_construction'] = {};
        }
        if ( snakeCaseKey === 'year_of_construction' ) {
          searchCriteriaData[snakeCaseKey] = {to: value === '' ? '' : parseFloat(parseFloat(value).toFixed(2))};
        }

        if (!searchCriteriaData['price']) {
          searchCriteriaData['price'] = {};
        }
        if ( snakeCaseKey === 'max_budget' ) {
          if ( typeof value === 'string' ) {
            value = value.replaceAll('.', '')
          }
          searchCriteriaData['price']['to'] = parseFloat(parseFloat(value).toFixed(2));
        }
        if ( snakeCaseKey === 'price_deviation' ) {
          searchCriteriaData['price']['price_deviation'] = value === '' ? '' : parseFloat(parseFloat(value).toFixed(2));
        }
      }

      let searchCriteriaId = searchCriteriaData.id;
      data[country][city][usageType] = this.removeUnwantedKeys(searchCriteriaData);

      return {'searchCriteria': data, 'searchCriteriaId': searchCriteriaId};
    },
    async sendSearchCriterias() {
      let allSuccessfullySubmitted = true;
      this.isSearchCriteriaLoading = true;

      if (typeof Object.keys(this.searchCriteriaToSubmit).length === 'undefined' || Object.keys(this.searchCriteriaToSubmit).length === 0) {
        this.notificationBannerInit(
            "warning",
            "Es ist ein Fehler aufgetreten"
        );
        this.isSearchCriteriaLoading = false;
        return false;
      }

      let dataToSend = { data: [] };

      for (let index in this.searchCriteriaToSubmit) {

        let searchCriteriaData = this.prepareSearchCriteriaToSubmit(index);

        if (!searchCriteriaData) {
          this.notificationBannerInit(
              "warning",
              "Im Suchprofil " + (parseInt(index) + 1) + " ist ein Fehler aufgetreten"
          );
          this.isSearchCriteriaLoading = false;
          return false;
        }

        let customerAddressId = this.customerDataMicroservice.id;
        let company = this.getUserCompany();

        let dataToSet = {
          "address_id": customerAddressId,
          "company": company,
          "agent_onoffice_id_or_username": this.getUserOoUsername(),
          "search_criteria": searchCriteriaData.searchCriteria,
          "category": "agent",
        }

        if ( !this.isEmpty(this.customerSearchCriterias[index].name) ) {
          dataToSet.name = this.customerSearchCriterias[index].name;
        }

        if ( typeof searchCriteriaData.searchCriteriaId !== 'undefined' && searchCriteriaData.searchCriteriaId ) {
          dataToSet['search_criteria_id'] = searchCriteriaData.searchCriteriaId;
        }

        dataToSend.data.push(dataToSet);
      }

      try {
        const response = await axios.post(this.globalApiMicroserviceBaseUrl + '/searchcriteria/update', dataToSend);
        if (response.status !== 200) {
          allSuccessfullySubmitted = false;
        }
      } catch (error) {
        allSuccessfullySubmitted = false;
        console.log(error);
      } finally {
        this.isSearchCriteriaLoading = false;
      }

      return allSuccessfullySubmitted;
    },
    async sendSpainDummySearchCriteria() {

      const defaultDummySpainSearchCriteria = {"Spanien": {"Alle": {"Wohnen": {"city": "", "golf": false, "lift": false, "floor": {"to": null, "from": null}, "price": {"to": null, "from": null, "price_deviation": null}, "rooms": {"to": null, "from": null}, "sauna": false, "county": "", "loggia": false, "balcony": false, "country": "Spanien", "terrace": false, "basement": false, "bedrooms": {"to": null, "from": null}, "district": [], "bathrooms": {"to": null, "from": null}, "free_from": null, "near_city": false, "local_area": [], "ocean_view": false, "usage_type": "Wohnen", "object_kind": "", "object_type": "", "rent_status": [], "sell_status": "", "tram_circle": false, "spain_region": false, "swimmingpool": false, "square_meters": {"to": null, "from": null}, "winter_garden": false, "type_of_garden": "", "project_addresses": {}, "year_of_construction": {"to": null, "from": null}, "price_per_square_meter":{"to": null, "from": null}}}}}

      let dataToSend = {
        "data" : [
          {
            "address_id": this.customerDataMicroservice.id,
            "company": this.company,
            "agent_onoffice_id_or_username": this.getUserOoUsername(),
            "search_criteria": defaultDummySpainSearchCriteria,
            "category": "agent",
          }
        ]
      }

      try {
        const response = await axios.post(this.globalApiMicroserviceBaseUrl + '/searchcriteria/update', dataToSend);
      } catch (error) {
        console.log(error);
      }

    },
    async sendMergedSearchCriteriasToUpdate(ids) {

      let response;

      let dataToSend = {
        data: {
          'search_criteria_ids': ids
        }
      };

      try {
        response = await axios.post(this.globalApiMicroserviceBaseUrl + '/searchcriteria/merge/update', dataToSend);
      } catch (error) {
        console.log(error);
      } finally {
        this.isSearchCriteriaLoading = false;
      }

      return response;
    },
    updateSelectedProjects(projectDataToUpdate, searchCriteriaId) {

      if ( this.isEmpty(projectDataToUpdate) ) {
        return;
      }

      const allSearchCriterias = this.customerSearchCriterias;
      for( let index in allSearchCriterias ) {
        if ( allSearchCriterias[index].id === searchCriteriaId ) {
          const getSearchCriteriaData = this.getSearchCriteriaData(allSearchCriterias[index]);
          if ( getSearchCriteriaData.data?.project_addresses === undefined || this.isEmpty(getSearchCriteriaData.data.project_addresses) ) {
            getSearchCriteriaData.data.project_addresses = projectDataToUpdate;
          } else {
            for (let projectName in projectDataToUpdate) {
              if ( typeof getSearchCriteriaData.data.project_addresses[projectName] !== 'undefined' ) {
                getSearchCriteriaData.data.project_addresses[projectName] = projectDataToUpdate[projectName];
              } else {
                getSearchCriteriaData.data.project_addresses = { ...getSearchCriteriaData.data.project_addresses, [projectName]: projectDataToUpdate[projectName]};
              }
            }
          }

          this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].projectAddresses = {};
          this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].projectAddresses.value = getSearchCriteriaData.data.project_addresses;

        }
      }
    },
    updateSelectedUnits(unitsData) {
      if ( typeof this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].projectAddresses === 'undefined' || typeof this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].projectAddresses.value === 'undefined' ) {
        this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].projectAddresses = {};
      }
      this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex].projectAddresses.value = unitsData;
    },
    mapLanguage(data, modifier = 'dataToLanguage') {

      const languageMap = {
        'DEU': 'Deutsch',
        'FRA': 'Französisch',
        'NLD': 'Niederländisch',
        'POL': 'Polnisch',
        'ENG': 'Englisch',
        'ESP': 'Spanisch'
      };

      const reverseLanguageMap = {
        'Deutsch': 'DEU',
        'Französisch': 'FRA',
        'Niederländisch': 'NLD',
        'Polnisch': 'POL',
        'Englisch': 'ENG',
        'Spanisch': 'ESP'
      };

      if ( modifier === 'dataToLanguage' ) {
        return languageMap[data] || 'Englisch';
      }
      if ( modifier === 'languageToData' ) {
        return reverseLanguageMap[data] || '';
      }
    },
    updateCustomerData() {

      let dataToSend = {
        client_company: this.customerData.dataset.address_company,
        client_mail: this.customerData.dataset.address_email,
        client_id: this.customerData.dataset.address_id,
        client_language: this.mapLanguage(this.emailLanguage, 'languageToData'),
      }

      axios.post(this.globalApiBaseUrl + '/onoffice/sendCustomerData', dataToSend )
          .then(
              (response) => {
              }
          )
          .catch(
              (error) => {
                console.log(error)
              }
          )

    },
    getEmailTemplate() {

      let dataToSend = {};

      axios.post(this.globalApiBaseUrl + '/system/dataroomEmailTemplates', dataToSend )
          .then(
              (response) => {
                if ( response.status === 200 ){
                  this.emailTemplateAPI = response.data.response;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error)
              }
          )

    },
    getPdfExpose() {

      let data = [];
      for(let index in this.customerSearchCriterias) {
        let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[index]);
        if ( searchCriteriaData.data?.project_addresses !== undefined && Object.keys(searchCriteriaData.data.project_addresses).length > 0 ) {
          for (let projectName in searchCriteriaData.data.project_addresses ) {
            if ( searchCriteriaData.data.project_addresses[projectName].selected && searchCriteriaData.data.project_addresses[projectName].nr.length > 0 ) {
              let projectData = {
                'project_name': projectName,
                'estate_list': []
              }
              if ( typeof projectData[projectName] === 'undefined' ) {
                for( let index in searchCriteriaData.data.project_addresses[projectName].nr ) {
                  projectData.estate_list.push(
                      {
                        'resource_id': searchCriteriaData.data.project_addresses[projectName].nr[index],
                        'selected': true
                      }
                  )
                }
              }
              data.push(projectData);
            }
          }
        }
      }

      let dataToSend = {
        'data': {
          'projects': data,
          'company': this.getUserCompany(),
          'agentusername': this.getUserOoUsername(),
        }
      };

      this.isLoadingAttachment = true;

      axios.post(this.globalApiMicroserviceBaseUrl + '/export/create/expose', dataToSend )
          .then(
              (response) => {
                if ( response.status === 200 ){
                  this.emailPdfExposeResponse = response.data;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error)
              }
          ).finally(() => {
            this.isLoadingAttachment = false;
          })
    },
    async sendEmail() {
      this.isEmailSubmitLoading = true;

      let dataToSend = {
        data: {
          recipient: this.customerData.dataset.address_email,
          fromEmail: this.getUserMail(),
          emailData: {
            subject: this.emailSubject,
            body: this.emailContentModified + this.emailContentFixed
          },
          projectList: this.getActiveSelectedSearchCriteriaProjects(),
          addressMsId: this.customerData.id,
        }
      };

      if ( this.emailPdfExposeResponse?.publicUrl !== undefined ) {
        dataToSend.data.attachmentSource = this.emailPdfExposeResponse.url;
      }

      try {
        const response = await axios.post(this.globalApiMicroserviceBaseUrl + '/mail/send', dataToSend);
        this.isEmailSubmitApiResponse = response.status === 200;
        this.$emit('finished', true);
        if (response.status !== 200) {
          this.notificationBannerInit(
              "warning",
              "E-Mail konnte nicht versendet werden"
          );
        }
      } catch (error) {
        console.log(error);
        this.isEmailSubmitApiResponse = false;
      } finally {
        this.isEmailSubmitLoading = false;
      }
    },
    renderEmailTemplate() {
      if ( typeof this.emailLanguage !== 'undefined' && !this.isEmpty(this.emailTemplateAPI )  ) {

        let template = this.emailTemplateAPI[ this.emailTemplate ][ this.mapLanguage(this.emailLanguage, 'languageToData') ]

        if ( template.includes('{{link_to_dataroom_start}}') ) {
          template = template.replaceAll('{{link_to_dataroom_start}}', '<a href="'+this.iFrameUrl+'" target="_blank">');
        }

        if ( template.includes('{{link_to_dataroom_end}}') ) {
          template = template.replaceAll('{{link_to_dataroom_end}}', '</a>');
        }

        if ( this.typeOfMail !== 'link' && !this.isSpainUser ) {
          template = template.replace(/<p>{{show_when_is_datenraum_link_start}}.*?{{show_when_is_datenraum_link_end}}<\/p>/s, '');
        } else {
          if ( template.includes('{{show_when_is_datenraum_link_start}}') ) {
            template = template.replaceAll('{{show_when_is_datenraum_link_start}}', '');
          }
          if ( template.includes('{{show_when_is_datenraum_link_end}}') ) {
            template = template.replaceAll('{{show_when_is_datenraum_link_end}}', '');
          }
        }

        this.emailContentFixed = template;

      }

      if ( this.emailLanguage === 'Deutsch' ) {
        this.emailSubject = 'Ihre Anfrage bei Best Place';
      } else if ( this.emailLanguage === 'Polnisch' ) {
        this.emailSubject = 'Twoje zapytanie do Best Place';
      } else if ( this.emailLanguage === 'Französisch' ) {
        this.emailSubject = 'Votre demande à Best Place';
      } else if ( this.emailLanguage === 'Niederländisch' ) {
        this.emailSubject = 'Uw vraag bij Best Place';
      } else if ( this.emailLanguage === 'Spanisch' ) {
        this.emailSubject = 'Su consulta a Best Place';
      } else {
        this.emailSubject = 'Your enquiry with Best Place';
      }

    },
    addBreaksToTextareaString() {
      this.emailContentModified = this.emailContent.replace(/\n/g, '<br>')
    },
    deleteSearchCriteria(index) {

      let response = confirm('Suchprofil wirklich löschen?');
      if (response !== true) {
        return;
      }

      if ( typeof this.customerSearchCriterias[index] !== 'undefined' && typeof this.customerSearchCriterias[index].id !== 'undefined' ) {

        axios.delete(this.globalApiMicroserviceBaseUrl + '/searchcriteria/'+this.customerSearchCriterias[index].id)
          .then(
            (response) => {
              if ( response.status === 200 ) {
                this.notificationBannerInit('success', 'Erfolgreich gelöscht');

                if ( typeof this.customerSearchCriterias[index] !== 'undefined' ) {
                  this.customerSearchCriterias.splice(index, 1);
                }

                this.deleteSCIndexForSearchCriteriaCompontent = index;
                if ( Object.entries(this.searchCriteriaToSubmit).length >= 1 ) {
                  this.activeSearchCriteriaIndex = 0;
                } else {
                  this.activeSearchCriteriaIndex = index - 1;
                }

                this.triggerSearchCriteriaDeleteProcess = this.makeid(20);

              } else {
                this.notificationBannerInit('warning', 'Konnte nicht gelöscht werden')
              }
            })
          .catch(
            (error) => {
              this.notificationBannerInit('warning', 'Konnte nicht gelöscht werden Fehlermeldung:'+error.response.data.message)
            }
        )
      }

      if ( typeof this.customerSearchCriterias[index] !== 'undefined' ) {
        this.activeSearchCriteriaIndex = index - 1;
        this.deleteSCIndexForSearchCriteriaCompontent = index;
        this.triggerSearchCriteriaDeleteProcess = this.makeid(20);
        this.customerSearchCriterias = this.customerSearchCriterias.splice(index, 1)
      }

    },
    addSearchCriteria() {
      this.triggerSearchCriteriaAddProcess = this.makeid(20);
      this.customerSearchCriterias.push({})
    },
    handleIframeBubbleEvent() {
      const vm = this;
      window.addEventListener('message', function (event) {
        if ( event.data === 'dataroomLoaded' ) {
          vm.iframeLoaded = true;
        }
      });
    },
    handleDeleteAttachment() {
      let response = confirm('Anhang wirklich löschen?');
      if (response !== true) {
        return;
      }
      this.emailPdfExposeResponse = {};
    },
    isUserSpainCustomer() {
      const userEmail = this.getUserMail();
      this.isSpainUser = this.spainAgents.includes(userEmail);

      if ( this.isSpainUser ) {
        this.typeOfMail = 'mail';
      }
    }
  },
  computed: {
    getSearchCriteriaActiveProjects() {
      let projects = {};
      if ( typeof this.customerSearchCriterias[this.activeSearchCriteriaIndex] !== 'undefined' ) {
        const searchCriteria = this.getSearchCriteriaData(this.customerSearchCriterias[this.activeSearchCriteriaIndex]);
        if ( searchCriteria.data?.project_addresses !== undefined ) {
          projects = searchCriteria.data.project_addresses;
        }
      }
      return projects;
    },
    getSelectedUnits() {
      let count = 0;
      if ( typeof this.activeCustomerSearchCriteriaData !== 'undefined' && this.activeCustomerSearchCriteriaData.data?.project_addresses !== undefined ) {
        for (let projectName in this.activeCustomerSearchCriteriaData.data.project_addresses) {
          if ( typeof this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr !== 'undefined' && this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr.length > 0 && typeof this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].selected !== 'undefined' && this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].selected ) {
            // if ( this.isStammobjectInDataset(this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr) ) {
            //   count += this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr.length;
            // } else {
              count += this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr.length;
            // }
          }
        }
      }
      return count;
    },
    getMatchingUnitsCount() {
      let count = 0;
      if ( typeof this.matchingRealEstates !== 'undefined' && typeof this.matchingRealEstates[this.activeCustomerSearchCriteriaData.searchCriteriaId] !== 'undefined' ) {
        for (let projectName in this.activeCustomerSearchCriteriaData.data.project_addresses) {
          if ( typeof this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].selected !== 'undefined' && this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].selected ) {
            if ( typeof this.matchingRealEstates[this.activeCustomerSearchCriteriaData.searchCriteriaId][projectName] !== 'undefined' && typeof this.matchingRealEstates[this.activeCustomerSearchCriteriaData.searchCriteriaId][projectName].units.length !== 'undefined' )
              count += this.matchingRealEstates[this.activeCustomerSearchCriteriaData.searchCriteriaId][projectName].units.length;
          }
        }
      }
      return count;
    },
    iFrameUrl() {

      let template = 'mixed-project-new';
      if ( this.isSpainUser ) {
        template = 'mixed-project-spain'
      }

      return this.dataroomUrl+'/'+template+'/?token=' + this.customerDataMicroservice.static_identifier_token;
    }
  },
  watch: {
    customerSearchCriterias: {
      handler: function (val, oldVal) {
        this.searchCriteriaIds = [];
        if ( !this.initAddAdditionalInformationsToRealEstatesDone ) {
          this.addAdditionalInformationsToRealEstates();
          this.initAddAdditionalInformationsToRealEstatesDone = true;
        }

        if ( !this.isEmpty(this.customerSearchCriterias[this.activeSearchCriteriaIndex]) ) {
          this.activeCustomerSearchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[this.activeSearchCriteriaIndex]);
        }
        for ( let index in val ) {
          if ( !this.searchCriteriaIds.includes(val[index].id) ) {
            this.searchCriteriaIds.push(val[index].id);
          }
        }
      },
      deep: true
    },
    searchCriteriaToSubmit: {
      handler: function (val, oldVal) {

        let currentUsedSearchCriteriaCombinations = {};

        for ( let index in val ) {

          let city = val[index].city.value;
          let usageType = val[index].usageType.value;

          if ( currentUsedSearchCriteriaCombinations?.[city] === undefined ) {
            currentUsedSearchCriteriaCombinations[city] = [usageType];
          } else {
            if ( !currentUsedSearchCriteriaCombinations[city].includes(usageType) ) {
              currentUsedSearchCriteriaCombinations[city].push(usageType);
            }
          }
        }

        this.currentUsedSearchCriteriaCombinations = currentUsedSearchCriteriaCombinations;

      },
      deep: true
    },
    activeSearchCriteriaIndex: function(newVal, oldVal) {
      this.activeCustomerSearchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[this.activeSearchCriteriaIndex]);
    },
    customerData: {
      handler: function (val, oldVal) {
        let language = 'Englisch';
        if ( val.dataset?.address_language !== undefined && !this.isEmpty(val.dataset.address_language) ) {
          language = this.mapLanguage(val.dataset.address_language)
        }
        this.emailLanguage = language;
      },
      deep: true
    },
    customerDataMicroservice : {
      handler: function (val, oldVal) {
        this.renderEmailTemplate();
      },
      deep: true
    },
    emailLanguage: function(newVal) {
      this.renderEmailTemplate();
    },
    emailTemplate: function(newVal) {
      this.renderEmailTemplate();
    },
    currentStep: function(newVal) {
      this.$emit('currentStep', newVal);
      if ( newVal === this.maxSteps - 1 ) {
        this.renderEmailTemplate();
      }
    },
  },
  mounted() {
    this.getEmailTemplate();
    this.isUserSpainCustomer();
    if ( Object.keys(this.customerDatas).length > 0 ) {

      // Do this only when data comes in from dataroom
      let dataToSend = {
        data: {
          customer_nr: this.customerDatas.dataset.address_id,
          company: this.customerDatas.dataset.address_company,
        }
      }

      console.log(dataToSend)

      this.searchCustomers(dataToSend)

    }
    this.handleIframeBubbleEvent();

    if ( !this.getUserRole() === 4 && !this.agentsForNewDataroom.includes(this.getUserMail()) ) {
      this.$router.push({ name: 'dataRoomTool' });
    }

  },
}

</script>

<template>
  <Navigation @click="isNameChangeActive = false" v-if="Object.keys(customerDatas).length === 0"/>

  <div class="multistep-form dataroom" @click="closeDropdowns; isNameChangeActive = false">
    <div class="headline" v-if="!showOnlySearchCriterias">
      <b style="color:black;">DATENRAUM</b> - SCHRITT {{ currentStep }}/{{ maxSteps }}
    </div>
    <CreateReservationProgressBar
        :currentStep="currentStep"
        :maxSteps="maxSteps"
        v-if="!showOnlySearchCriterias"
    />

    <div class="steps" :style=" currentStep === 5 ? 'width: 100%;' : '' ">

      <div class="loading-screen" v-if="isEmailSubmitLoading">
        <AnimateCircleIcon></AnimateCircleIcon>
      </div>

      <div :class="'step-'+currentStep" v-if="currentStep === 1">

        <div class="step-title">
          E-Mail-Art wählen
        </div>

        <div class="title" v-if="Object.keys(this.customerDatas).length === 0">
          <Seperator>Kundensuche</Seperator>
        </div>

        <div class="field-wrapper search" v-if="Object.keys(this.customerDatas).length === 0">
          <InputField ref="inputRealEstates" inputType="text" inputName="Customers" :inputValue="customerSearchInput" v-model="customerSearchInput" @input="restartCustomerSearch()" @focus="setDropdownTop($event)"></InputField>
          <label class="ph">Kundensuche nach E-Mail oder Telefon</label>
          <Dropdown ref="dropdownCustomers" :class="{active: dropdownsShow.showCustomerDropdown, relative: dropdownRelativePosition}" type="customerData" :renderingObject="foundCustomersList" @dropdown-item-clicked="dropdownClick('mail', $event)" emitType="event" @click.stop=""></Dropdown>
          <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
        </div>

        <div class="sperator"></div>

        <div class="customer-summary" v-if="Object.keys(customerData).length > 0">
          <div class="inner-wrapper">

            <div class="title">
              <Seperator>Ausgewählter Kunde</Seperator>
            </div>

            <div class="data-wrapper">
              <div class="item" v-if="customerData?.onoffice_ids_kg !== undefined && customerData.onoffice_ids_kg.length > 0">
                <div>KdNr{{customerData.onoffice_ids_kg.length > 1 ? 's' : ''}} KG:</div>
                <div>{{ customerData.onoffice_ids_kg.join(', ') }}</div>
              </div>
              <div class="item" v-if="customerData?.onoffice_ids_living !== undefined && customerData.onoffice_ids_living.length > 0">
                <div>KdNr{{customerData.onoffice_ids_living.length > 1 ? 's' : ''}} Living:</div>
                <div>{{ customerData.onoffice_ids_living.join(', ') }}</div>
              </div>
              <div class="item" v-if="customerData?.id !== undefined">
                <div>KdNr Microservice:</div>
                <div>{{ customerData.id }}</div>
              </div>
              <div class="item">
                <div>Name:</div>
                <div>{{ customerData.dataset.address_salutation }} {{ customerData.dataset.address_first_name }} {{ customerData.dataset.address_last_name }}</div>
              </div>
              <div class="item">
                <div>E-Mail:</div>
                <div>{{ customerData.dataset.address_email }}</div>
              </div>
              <div class="item">
                <div>Telefon:</div>
                <div>{{ customerData.dataset?.address_phone[0] ? customerData.dataset?.address_phone[0] : '-' }}</div>
              </div>
            </div>

          </div>
        </div>

        <div class="email-type-wrapper" v-if="!isSpainUser">

          <div class="title">
            <Seperator>Wahl der E-Mail-Art an den Kunden</Seperator>
          </div>

          <div class="field-wrapper radios">
            <label for="dataroomLink" class="radio-wrapper">
              <InputField inputType="radio" id="dataroomLink" inputName="dataroomLink" value="link" :inputValue="typeOfMail" v-model="typeOfMail"></InputField>
              Versand von Datenraum-link
            </label>
            <label for="customMail" class="radio-wrapper">
              <InputField inputType="radio" id="customMail" inputName="customMail" value="mail" :inputValue="typeOfMail" v-model="typeOfMail"></InputField>
              Freie E-Mail
            </label>
          </div>

        </div>

      </div>

      <div :class="'step-'+currentStep" v-else-if="currentStep === 2">

        <div class="step-title" v-if="customerData?.dataset !== undefined">
          Suchprofil eingeben für {{ customerData.dataset.address_first_name }} {{ customerData.dataset.address_last_name }}
        </div>

        <div class="searchcriteria-toggler-wrapper" @click.stop="">
          <div class="searchcriteria-toggler"
               :class="{'active':index === activeSearchCriteriaIndex}"
               v-for="(criteria, index) in customerSearchCriterias"
               @click="activeSearchCriteriaIndex = index;">
            <div class="searchcriteria-toggler-button">
              <SearchIcon></SearchIcon>
              <ToolTip :content="automaticSearchCriteriaToolTipText" hoverText="<AutomaticSearchcriteria>" style="margin-left:5px" v-if="criteria.category === 'automatic'"></ToolTip>
              <InputField v-if="isNameChangeActive === index" inputType="text" inputplaceholder="" inputName="searchCriteriaName" :inputValue="customerSearchCriterias[index].name" v-model="customerSearchCriterias[index].name"></InputField>
              <span class="search-criteria-name" v-else>
                {{ !this.isEmpty(customerSearchCriterias[index].name) ? customerSearchCriterias[index].name : 'Suchprofil ' + (index+1) }}
              </span>
            </div>

            <div class="action-button">
              <EditIcon @click.stop="editSearchCriterianame(index)" v-if="Object.keys(customerSearchCriterias[index]).length > 0 || Object.keys(customerSearchCriterias).length > 1 || customerSearchCriterias.length > 0"></EditIcon>
              <DeleteIcon @click.stop="deleteSearchCriteria(index)" v-if="Object.keys(customerSearchCriterias[index]).length > 0 || Object.keys(customerSearchCriterias).length > 1 || customerSearchCriterias.length > 0"></DeleteIcon>
            </div>

          </div>
          <div class="searchcriteria-toggler add" @click="addSearchCriteria(); activeSearchCriteriaIndex = customerSearchCriterias.length - 1" v-if="customerSearchCriterias.length < 3">
            <PlusIcon></PlusIcon>
          </div>
        </div>

        <SearchCriteriaForm :customerDataSC="customerData" :activeSC="activeSearchCriteriaIndex" :microserviceCustomerData="customerDataMicroservice" :existingSearchCriteriaFromParent="searchCriteriaFormsFromApiFetch" :indexToDelete="deleteSCIndexForSearchCriteriaCompontent" :triggerDeleteProcess="triggerSearchCriteriaDeleteProcess" :triggerAddSCProcess="triggerSearchCriteriaAddProcess" :showCustomerSearchCriteria="showOnlySearchCriterias" :currentUsedSearchCriteriaCombos="currentUsedSearchCriteriaCombinations" v-if="activeSearchCriteriaIndex >= 0 && Object.keys(customerData).length > 0"></SearchCriteriaForm>

      </div>

      <div :class="'step-'+currentStep" v-else-if="currentStep === 3">

        <div class="step-title">
          {{ activeCustomerSearchCriteriaData.data?.project_addresses !== undefined ? Object.entries(activeCustomerSearchCriteriaData.data.project_addresses).filter(([key, value]) => value.selected).length : '0'}}
          von
          5
          Projekten ausgewählt für
          {{ customerData.dataset.address_first_name }} {{ customerData.dataset.address_last_name }}
        </div>

        <div class="searchcriteria-toggler-wrapper" @click.stop="">
          <div class="searchcriteria-toggler"
               :class="{'active':index === activeSearchCriteriaIndex}"
               v-for="(criteria, index) in customerSearchCriterias"
               @click="activeSearchCriteriaIndex = index;">
            <div class="searchcriteria-toggler-button">
              <SearchIcon></SearchIcon>
              <ToolTip :content="automaticSearchCriteriaToolTipText" hoverText="<AutomaticSearchcriteria>" style="margin-left:5px" v-if="criteria.category === 'automatic'"></ToolTip>
              {{ !this.isEmpty(customerSearchCriterias[index].name) ? customerSearchCriterias[index].name : 'Suchprofil ' + (index+1) }}
            </div>
          </div>
        </div>

        <DataroomProjectSelection ref="child" :searchCriteriaIds="searchCriteriaIds" :selectedProjectData="getSearchCriteriaActiveProjects" :customerSearchCriteria="customerSearchCriterias[activeSearchCriteriaIndex]" :searchCriteriaId="activeCustomerSearchCriteriaData.searchCriteriaId" @updateSelectedProjects="updateSelectedProjects"></DataroomProjectSelection>

      </div>

      <div :class="'step-'+currentStep" v-else-if="currentStep === 4">

        <div class="step-title">
          {{ getSelectedUnits }}
          von
          {{ getMatchingUnitsCount }}
          Einheiten ausgewählt für
          {{ customerData.dataset.address_first_name }} {{ customerData.dataset.address_last_name }}
        </div>

        <div class="searchcriteria-toggler-wrapper" @click.stop="">
          <div class="searchcriteria-toggler"
               :class="{'active':index === activeSearchCriteriaIndex}"
               v-for="(criteria, index) in customerSearchCriterias"
               @click="activeSearchCriteriaIndex = index;">
            <div class="searchcriteria-toggler-button">
              <SearchIcon></SearchIcon>
              <ToolTip :content="automaticSearchCriteriaToolTipText" hoverText="<AutomaticSearchcriteria>" style="margin-left:5px" v-if="criteria.category === 'automatic'"></ToolTip>
              {{ !this.isEmpty(customerSearchCriterias[index].name) ? customerSearchCriterias[index].name : 'Suchprofil ' + (index+1) }}
            </div>
          </div>
        </div>

        <DataroomUnitSelection :selectedProjectData="getSearchCriteriaActiveProjects" :searchCriteriaId="activeCustomerSearchCriteriaData.searchCriteriaId" :projectAndUnitDatalist="projectAndUnitDatalist" :searchCriteriaType="activeCustomerSearchCriteriaData.type" @updateSelectedUnits="updateSelectedUnits"></DataroomUnitSelection>

      </div>

      <div :class="'step-'+currentStep" v-else-if="currentStep === 5">

        <div class="step-title">
          Link für {{ customerData.dataset.address_first_name }} {{ customerData.dataset.address_last_name }} prüfen
        </div>
        <div class="iframe-wrapper">
          <div class="loading-screen" v-if="!iframeLoaded">
            <AnimateCircleIcon></AnimateCircleIcon>
          </div>
          <div class="watermark-wrapper">
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
          </div>
          <iframe class="preview-customerlink" :src="iFrameUrl"></iframe>
        </div>

      </div>

      <div :class="'step-'+currentStep" v-else-if="currentStep === 6">

        <div class="step-title">
          E-Mail erstellen für {{ customerData.dataset.address_first_name }} {{ customerData.dataset.address_last_name }}
        </div>

        <div class="field-wrapper two-col">
            <div class="field-wrapper">
              <InputField ref="inputRealEstates" inputType="text" inputName="EmailLanguage" :inputValue="emailLanguage" v-model="emailLanguage" @focus="setDropdownTop($event)" @click="dropdownsShow.showEmailLanguageDropdown = !dropdownsShow.showEmailLanguageDropdown" @click.stop=""></InputField>
              <label class="ph">Sprache</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownEmailLanguage" :class="{active: dropdownsShow.showEmailLanguageDropdown, relative: dropdownRelativePosition}" type="county" :renderingObject="dropdownContent.emailContent" :activeItems="emailLanguage" @dropdown-item-clicked="dropdownClick('emailLanguage', $event)" @click.stop=""></Dropdown>
            </div>
            <div class="field-wrapper radios">
              <label for="emailTemplateDe" class="radio-wrapper">
                <InputField inputType="radio" id="emailTemplateDe" inputName="emailTemplateDe" value="de" :inputValue="emailTemplate" v-model="emailTemplate"></InputField>
                Vorlage Deutschland
              </label>
<!--              <label for="emailTemplateEs" class="radio-wrapper">-->
<!--                <InputField inputType="radio" id="emailTemplateEs" inputName="emailTemplateEs" value="es" :inputValue="emailTemplate" v-model="emailTemplate"></InputField>-->
<!--                Vorlage Spanien-->
<!--              </label>-->
            </div>
        </div>

        <div class="email-render">
          <div class="subject">
            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="EmailSubject" inputName="EmailSubject" :inputValue="emailSubject" v-model="emailSubject"></InputField>
              <label class="ph">E-Mail Betreff</label>
            </div>
          </div>
          <div class="body">
            <div class="field-wrapper">
              <TextAreaField maxlength="2000" :inputVal="emailContent" v-model="emailContent" @input="addBreaksToTextareaString()"></TextAreaField>
              {{emailContent.length}} von 2000 Zeichen
              <label class="ph">E-Mail Inhalt</label>
            </div>
          </div>
        </div>

        <div class="email-preview">
          <AnimateCircleIcon v-if="isLoadingAttachment"></AnimateCircleIcon>
          <div class="attachments" v-if="emailPdfExposeResponse?.publicUrl !== undefined">
            <span>Anhang: </span>
            <a :href="emailPdfExposeResponse.publicUrl" target="_blank">
              <div class="attachment">
                <span>Expose</span>
                <div class="delete" @click.stop.prevent="handleDeleteAttachment()"><DeleteIcon></DeleteIcon></div>
              </div>
            </a>
          </div>
          <div class="sendto">An: {{customerData.dataset.address_email}}</div>
          <div class="subject">Betreff: {{emailSubject}}</div>
          <div v-html="emailContentModified"></div>
          <div class="fixed-content" v-html="emailContentFixed"></div>
        </div>

      </div>

      <div :class="'step-'+currentStep" v-else-if="currentStep === maxSteps">

        <div class="step-title">
          E-Mail wurde erfolgreich versendet.
        </div>

      </div>

      <div class="action" :style="currentStep === 1 ? 'justify-content: end;' : ''" v-if="currentStep !== maxSteps">

        <Button type="edit" @click="navBack()" v-if="currentStep !== 1 && !showOnlySearchCriterias">{{ currentStep === maxSteps ? 'Zurück zur Startseite' : 'Zurück' }}</Button>

        <Button type="report" @click="validateStep()" v-if="currentStep !== maxSteps">{{ currentStep === maxSteps-1 ? 'Email Senden' : 'Weiter' }}</Button>

      </div>

      <div class="action" style="justify-content: center" v-else>

        <Button type="edit" @click="navBack()" v-if="currentStep !== 1 && !showOnlySearchCriterias">{{ currentStep === maxSteps ? 'Zurück zur Startseite' : 'Zurück' }}</Button>

        <Button type="report" style="flex-basis: 100%;" @click="saveSearchCriterias()" v-if="$route.name !== 'dataRoomToolNew'">Suchprofile Speichern <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon></Button>

      </div>
    </div>

  </div>
</template>

<style scoped>

.multistep-form {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.multistep-form .steps {
  width: 100%;
}

.multistep-form  .steps-wrapper {
  flex-basis: 100%;
}

.navigation + .multistep-form .steps {
  width: 50%;
  margin-bottom: 100px;
}

.step-5 + .action {
  width: 50%;
  margin: 25px auto;
}

.navigation + .multistep-form  .steps-wrapper {
  flex-basis: 51%;
}

.headline {
  flex-basis: 50%;
  margin-top: 25px;
  margin-bottom: 25px;
  font-size: 18px;
}

.step-title {
  font-size: 20px;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

.title, .customer-summary .data-wrapper .item > div:first-of-type {
  font-weight: bolder
}

.customer-summary .data-wrapper .item {
  display: flex;
}

.customer-summary .data-wrapper .item > div:first-of-type {
  min-width: 150px;
}

.field-wrapper.radios {
  display: flex;
  justify-content: space-between;
}

.field-wrapper.radios * {
  cursor: pointer;
  text-align: center;
}

.seperator {
  z-index: 0;
}

.action {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  margin-top: 50px;
}

.searchcriteria-toggler-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 50px;
  cursor: pointer;
}

.searchcriteria-toggler .searchcriteria-toggler-button,
.action-button, .searchcriteria-toggler.add {
  padding: 10px 25px;
  background-color: var(--light-light-gray);
}

.searchcriteria-toggler {
  margin-right: 15px;
  margin-bottom: 10px;
}

.searchcriteria-toggler.add {
  display: flex;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
}

.action-button i + i, .search-criteria-name {
  margin-left: 15px;
}

.search-criteria-name {
  max-width: 250px;
}

.searchcriteria-toggler.active .searchcriteria-toggler-button {
  color: white;
  background-color: var(--blue);
  transition: all .2s;
}

.searchcriteria-toggler-button {
  align-items: center;
}

.searchcriteria-toggler, .searchcriteria-toggler-button {
  display: flex;
}

.searchcriteria-toggler-button input {
  margin-left: 5px;
  padding: 5px 10px;
}

.preview-customerlink {
  width: 100%;
  height: 60vh;
  margin-top: 25px;
}

.field-wrapper.two-col {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.field-wrapper.two-col > div{
  flex-basis: 45%;
}

.email-render {
  margin-top: 50px;
}

.email-render > div + div {
  margin-top: 25px;
}

.email-preview {
  margin-top: 25px;
  padding: 25px;
  border-radius: 5px;
  background-color: var(--light-light-gray)
}

.email-preview .sendto,
.email-preview .subject {
  font-weight: 700;
  margin-bottom: 15px;
}

.loading-screen {
  background-color: rgba(255,255,255, 0.5);
  z-index: 9;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-screen .loading-animation, .iframe-wrapper .loading-animation {
  margin: 0;
  font-size: 40px;
}

.iframe-wrapper .loading-screen {
  background-color: rgba(255, 255, 255, 0.9);
}

.watermark-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  height: 100%;
  overflow: hidden;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
}

.watermark {
  transform: rotate(-45deg);
  white-space: nowrap;
  font-size: 2vw;
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  user-select: none;
}

.attachments {
  margin-bottom: 25px;
}

.attachments, .attachments a {
  display: flex;
  align-items: center;
  font-weight: 700;
}

.attachment {
  display: flex;
  padding: 5px 10px;
  border: solid 2px;
  margin-left: 10px;
  align-items: center;
}

.attachment .fa-trash {
  margin-left: 15px;
}

.attachment i {
  margin-right: 5px;
}

@media (max-width: 1400px) {

  .navigation + .multistep-form .steps {
    width: 90%;
  }

  .headline,
  .navigation + .multistep-form  .steps-wrapper{
    flex-basis: 90%;
  }

}


</style>
