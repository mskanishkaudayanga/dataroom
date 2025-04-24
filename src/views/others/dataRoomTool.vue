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
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import CopyIcon from "@/components/icons/icon-copy.vue";
import DataroomForm from "@/components/forms/DataroomForm.vue";
import DownloadIcon from "@/components/icons/icon-download.vue";
import PatchnotesIcon from "@/components/icons/icon-patchnote.vue";

export default {
  name: 'dataRoomTool',
  components: {
    PatchnotesIcon,
    DownloadIcon,
    DataroomForm,
    CopyIcon,
    DropdownArrow,
    Dropdown,
    InputField,
    AsterixMarkIcon,
    AnimateCircleIcon,
    CloseIcon, FilterIcon, Button, PlusIcon, CanbanCard, Navigation},
  data() {
    return {
      isLoading: false,
      isLoadingProjects: false,
      isLoadingGenerationToken: false,
      isLoadingUnits: false,
      userRole: '',
      userCompany: '',

      selectedType: 'project',

      searchCustomerValue: '',
      apiAllCustomers: [],
      apiFetchedUnits: {},
      selectedCustomer: {
        value: '',
        valid: true,
      },
      selectedCountry: {
        value: 'Spanien',
        valid: true,
      },
      selectedUnits: {
        value: [],
        valid: true,
      },

      generatedCustomerToken: '',

      renderedLink: '',

      selectedProjects: {
        value: [],
        displayValue: []
      },
      selectedProjectValid: true,
      apiAllRealEstates: [],

      cancelToken: null,
      searchedLivingFinal: false,

      dropdownsShow: {
        showRealEstatesDropdown: false,
        showUnitsDropdown: false,
        showCountryDropdown: false,
        showCustomerDropdown: false,
      },

      dropdownRelativePosition: false,
      triggerDropdownClose: '',
    }
  },
  methods: {

    getAllProjects() {

      if (this.isLoadingProjects) {
        return;
      }

      this.isLoadingProjects = true;

      axios.get(this.globalApiBaseUrl + '/dataroom/getDataroomProjects')
          .then(
              (response) => {
                // console.log(response);
                if ( response.data.status === 200 ) {
                  this.apiAllRealEstates = this.userConditionsToDataroom(response.data.response);
                  this.dropdownsShow.showRealEstateDropdown = true;
                } else {
                  this.apiAllRealEstates = [];
                  this.dropdownsShow.showRealEstateDropdown = false;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          ).finally(
          () => {
            this.isLoadingProjects = false;
          })
    },
    userConditionsToDataroom(allRealEstates) {

      let returnVal = allRealEstates;
      let userConditions = this.userConditions[this.getUserMail()];

      if ( typeof userConditions === 'undefined' || !userConditions || userConditions === '' ) {
        return returnVal;
      }

      if ( userConditions.projects.length > 0 ) {
        returnVal = returnVal.filter(item => userConditions.projects.includes(item.post_title))
      }
      if ( userConditions.city.length > 0 ) {
        returnVal = returnVal.filter(item => userConditions.city.includes(item.place))
      }

      return returnVal;
    },
    restartCustomerSearch() {
      if (this.cancelToken) {
        this.cancelToken();
      }
      this.searchCustomers();
    },
    async searchCustomers(company = 'kg') {

      company = this.getUserCompany();

      if ( company === 'kg' ) {
        this.searchedLivingFinal = false;
      }

      if ( company === 'living' ) {
        this.searchedLivingFinal = true;
      }

      axios.interceptors.request.use((config) => {
        // Update isLoading data property
        if ( config.url.includes('getCustomerData') && !config.url.includes('getCustomerDataBySysId') ) {
          this.isLoading = true;
        }
        return config;
      }, (error) => {
        // Handle request error
        this.isLoading = false;
        this.apiAllCustomers = [];
        this.dropdownsShow.showCustomerDropdown = false;
        return Promise.reject(error);
      });

      this.apiAllCustomers = [];

      if (this.searchCustomerValue && this.searchCustomerValue.length >= 3) {
        axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString=' + this.searchCustomerValue + '&company=' + company + '&searchForPhone=true', {
          cancelToken: new axios.CancelToken((cancel) => {
            this.cancelToken = cancel;
          }),
          }).then(
                (response) => {
                  if (response.data.status === 200) {
                    this.apiAllCustomers = response.data.response.client_data;
                  } else {
                    // if ( !this.searchedLivingFinal ){
                    //   this.searchCustomers(company);
                    // }
                    this.apiAllCustomers = [];
                  }
                  this.dropdownsShow.showCustomerDropdown = true;
                  this.isLoading = false;
                }
            )
            .catch(
                (error) => {
                  this.apiAllCustomers = [];
                  this.dropdownsShow.showCustomerDropdown = false;
                  if ( error.message !== 'canceled' ) {
                    this.isLoading = false;
                  }
                }
            )
      }
    },
    generateLink() {

      if ( this.selectedCustomer.value.length === 0 || this.selectedCustomer.value === '' ) {
        this.selectedCustomer.valid = false;
        return;
      } else {
        this.selectedCustomer.valid = true;
      }

      if ( this.selectedType === 'project' ) {
        if ( this.selectedProjects.length === 0 || this.selectedProjects === '' ) {
          this.selectedProjectValid = false;
          return;
        } else {
          this.selectedProjectValid = true;
        }
      }

      if ( this.selectedUnits.value.length === 0 && this.selectedType === 'units' ) {
        this.notificationBannerInit('warning', 'Bitte wählen Sie mindestens eine Einheit aus.');
        return;
      }

      if ( this.isLoadingGenerationToken ) {
        return;
      }

      /**
       * Loop all agents and return first one with matching data
       * workaround for external agents where user name is existing multiple times
       */
      let agentId = '';
      let allAgents = this.getAgentsData();
      let agentUsername = this.getUserOoUsername();
      for (let index in allAgents[this.getUserCompany()]['list_of_all_users_data']) {
        let agent = allAgents[this.getUserCompany()]['list_of_all_users_data'][index];
        if (agent.user_Name === agentUsername && typeof agent.user_id !== 'undefined' ){
          agentId = agent.user_id;
          break;
        }
      }

     let countryIsocode = '';
      for (const key in this.countryList) {
        if (this.countryList[key] === this.selectedCountry.value[0]) {
          countryIsocode = key;
          break; // Exit the loop once we find the key
        }
      }

      let dataToSend = {
        template: this.selectedType === 'units' ? 'MIXED' : 'COUNTRY', // MIXED, COUNTRY
        company: this.getUserCompany().toUpperCase(), // KG, LIVING
        userName: agentUsername,
        userId: agentId,
        country: countryIsocode, // ESP OR OTHER ISOCODE ALPHA 3
        userEmail: this.getUserMail(),
        userType: ( this.getUserMail().includes('@bestplace') || this.getUserMail().includes('@eck3') || this.getUserMail().includes('@azbow') ) ? 'INTERNAL' : 'EXTERNAL', // EXTERNAL, INTERNAL
        immoNrs: this.selectedUnits.value,
        kdNr: this.selectedCustomer.value.client_id,
        addressEmail: this.selectedCustomer.value.client_email
      }

      this.isLoadingGenerationToken = true;

      if ( this.selectedType !== 'project' ) {
        axios.post(this.globalApiBaseUrl + '/dataroom/generateCustomerToken', dataToSend )
            .then(
                (response) => {
                  if ( typeof response.data.response.data !== 'undefined' && typeof response.data.response.data.token !== 'undefined' && response.data.response.data.token !== '' ) {
                    this.generatedCustomerToken = response.data.response.data.token;
                    this.renderLink();
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
            }
        ).finally(() => {
          this.isLoadingGenerationToken = false;
        })
      } else {
        dataToSend = {
          'customerMail': this.selectedCustomer.value.client_email,
          'customerId': this.selectedCustomer.value.client_id,
          'company': this.getUserCompany()
        }
        axios.post(this.globalApiBaseUrl + '/dataroom/generateCustomerTokenOldAPI', dataToSend )
            .then(
                (response) => {
                  if ( typeof response.data !== 'undefined' && typeof response.data.response.data.token !== 'undefined' && response.data.response.data.token !== '' ) {
                    this.generatedCustomerToken = response.data.response.data.token;
                    this.renderLink();
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
            }
        ).finally(() => {
          this.isLoadingGenerationToken = false;
        })
      }

    },
    renderLink() {

      if (this.selectedType === 'project') {
        let baseUrl = '';
        for( const realEstate in this.apiAllRealEstates ) {
          if ( this.apiAllRealEstates[realEstate].post_title === this.selectedProjects.value || this.apiAllRealEstates[realEstate].post_title === this.selectedProjects.value[0] ) {
            baseUrl = this.apiAllRealEstates[realEstate].guid;
            break;
          }
        }

        let agentId = '';
        let allAgents = this.getAgentsData();
        let agentUsername = this.getUserOoUsername();
        for (let index in allAgents[this.getUserCompany()]['list_of_all_users_data']) {
          let agent = allAgents[this.getUserCompany()]['list_of_all_users_data'][index];
          if (agent.user_Name === agentUsername && typeof agent.user_id !== 'undefined' ){
            agentId = agent.user_id;
            break;
          }
        }

        let agentCompany = this.getUserCompany();
        agentCompany = agentCompany.toUpperCase();
        if ( this.getUserMail().includes('@bestplace') || this.getUserMail().includes('@eck3') || this.getUserMail().includes('@azbow') ) {
          // Is internal agent
          baseUrl += '?id='+agentCompany+'_'+agentId;
        } else {
          // Is external agent
          baseUrl += '?id='+agentCompany+'_'+btoa(this.getUserMail());
        }
        baseUrl += '&user='+agentUsername;
        baseUrl += '&token='+this.generatedCustomerToken;

        this.renderedLink = baseUrl;
      } else {
        this.renderedLink = 'https://dataroom.bestplace-immobilien.de/template?token='+this.generatedCustomerToken;
      }

      this.copyLinkToClipboard();

    },
    dropdownClick(property, clickedData, isArrayMerge = false) {
      if ( isArrayMerge ) {
        if ( this.$data[property].value.includes(clickedData) ) {
          this.$data[property].value = this.$data[property].value.filter(item => item !== clickedData);
        } else {
          this.$data[property].value.push(clickedData);
          this.$data[property].value = [...new Set(this.$data[property].value)]
        }
        if ( this.$data[property].displayValue.includes(clickedData) ) {
          this.$data[property].displayValue = this.$data[property].displayValue.filter(item => item !== clickedData);
        } else {
          this.$data[property].displayValue.push(clickedData);
          this.$data[property].displayValue = [...new Set(this.$data[property].displayValue)]
        }
      } else {
        if ( this.$data[property].hasOwnProperty('displayValue') ) {
          this.$data[property].displayValue = clickedData;
          if ( property === 'selectedProjects' ) {
            this.$data[property].displayValue = [clickedData];
          }
        }
        if ( this.$data[property].hasOwnProperty('value') && clickedData ) {
          if ( property === 'selectedProjects' ) {
            this.$data[property].value = [clickedData];
          } else {
            this.$data[property].value = clickedData;
          }
        } else {
          this.$data[property].value = clickedData;
        }
        this.closeDropdowns();
      }

      // this.searchForCountry = '';
      // this.searchForCity = '';
      // this.searchForRealEstate = '';
    },
    closeDropdowns() {
      this.triggerDropdownClose = this.makeid(30);
      for (const index in this.dropdownsShow) {
        this.dropdownsShow[index] = false;
      }
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
    copyLinkToClipboard() {
      let text = this.renderedLink;
      navigator.clipboard.writeText(`${text}`);
      this.notificationBannerInit('success', 'Link wurde in die Zwischenablage kopiert.');
    },
    getAllCustomerDataBasedOnSelection(customerKdNr) {

      if (typeof customerKdNr === 'object' && customerKdNr !== null) {
        return;
      }
      let customerClickedDatasetArray = customerKdNr.split('|');
      let customerId = parseInt(customerClickedDatasetArray[0].replaceAll(' ', ''));
      let foundCustomer = this.apiAllCustomers.filter(item => item.client_id === customerId);

      this.searchCustomerValue = foundCustomer[0].client_email;
      this.selectedCustomer.value = foundCustomer[0];

    },
    renderCatName(string) {
      let returnVal = string;

      if ( returnVal === 'sales_contract' ) {
        returnVal = 'Kaufvertrag';
      } else if (returnVal === 'declaration_of_division') {
        returnVal = 'Teilungserklärung';
      } else if (returnVal === 'business_plan') {
        returnVal = 'Wirtschaftsplan';
      } else if (returnVal === 'specifications') {
        returnVal = 'Baubeschreibung';
      } else if (returnVal === 'etagenplane') {
        returnVal = 'Etagenpläne';
      } else if (returnVal === 'wohnflachenberechnung') {
        returnVal = 'Wohnflächenberechnung';
      } else if (returnVal === 'pitch_assignment') {
        returnVal = 'Teilungserklärung UVZ';
      }

      return returnVal;
    },
    getProjectUnits() {

      // when select project in projectview it is set as single string
      if ( typeof this.selectedProjects.value === 'string' ) {
        this.selectedProjects.value = [this.selectedProjects.value];
      }

      for ( const index in this.selectedProjects.value) {
        if ( typeof this.apiFetchedUnits[this.selectedProjects.value[index]] !== 'undefined' && this.apiFetchedUnits[this.selectedProjects.value[index]] !== null ) {
          // allready fetched
          continue;
        }
        this.isLoadingUnits = true;
        axios.get(this.globalApiBaseUrl + '/onoffice/getRealEstate?searchString='+this.selectedProjects.value[index]+'&company=all&allowStammobject=false&searchForProjectname=true')
          .then(
              (response) => {
                if ( response.data.status === 200 ) {

                  if ( typeof response.data.response !== 'undefined' && response.data.response !== null && response.data.response['real_estates'].length > 0 ){
                    response.data.response['real_estates'].sort((a, b) => {
                      // Extracting the numeric part of the real_estate_id
                      const numA = parseInt(a.real_estate_id.match(/\d+$/)[0], 10);
                      const numB = parseInt(b.real_estate_id.match(/\d+$/)[0], 10);

                      return numA - numB; // Sorting in ascending order
                    });
                    this.apiFetchedUnits[this.selectedProjects.value[index]] = response.data.response['real_estates'];
                  } else {
                    this.apiFetchedUnits[this.selectedProjects.value[index]] = [];
                    this.notificationBannerInit('warning', 'Keine Einheiten für '+this.selectedProjects.value[index]+' gefunden.');
                  }

                } else {
                  this.apiFetchedUnits[this.selectedProjects.value[index]] = [];
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          ).finally(
          () => {
            this.isLoadingUnits = false;
          })
      }
    },
    getCheckboxVal(event) {

      if ( this.selectedUnits.value.includes(event.target.value) ) {
        // console.log(event.target.value);
        this.selectedUnits.value = this.selectedUnits.value.filter(item => item !== event.target.value);
      } else {
        this.selectedUnits.value.push(event.target.value)
      }

    }
  },
  computed: {
    projectDropdown() {

      let projectDropdown = [];
      Object.entries(this.apiAllRealEstates).forEach(([key, value]) => {
        if ( value.post_title !== '' && value.post_title !== null && value.post_title !== 'undefined' ) {
          if ( value.country === 'DEU' ) {
            projectDropdown.push(value.post_title);
          }
        }
      });

      projectDropdown = this.sortArrayAlphabetically(projectDropdown)

      if ( projectDropdown.length > 0 ) {
        return projectDropdown;
      }
      return [];
    },
    projectCountries() {

      // todo deactiveted for now only spain avaible
      // let projectCountries = [];
      // Object.entries(this.apiAllRealEstates).forEach(([key, value]) => {
      //   if ( this.selectedProjects.value.includes(value.post_title) ) {
      //     if ( value.country !== '' && value.country !== null && typeof value.country !== 'undefined' ) {
      //       if ( typeof this.countryList[value.country] !== 'undefined' ) {
      //         projectCountries.push(this.countryList[value.country]);
      //       } else {
      //         projectCountries.push(value.country);
      //       }
      //     }
      //   }
      // });
      //
      // projectCountries = [...new Set(projectCountries)];
      // projectCountries = this.sortArrayAlphabetically(projectCountries)
      //
      // if ( projectCountries.length === 1 ) {
      //   this.selectedCountry.value = [projectCountries[0]];
      // } else {
      //   this.selectedCountry.value = '';
      // }
      //
      // if ( projectCountries.length > 0 ) {
      //   return projectCountries;
      // }
      return ['Spanien'];
    },
    renderFiles() {

      let returnVal = [];
      Object.entries(this.apiAllRealEstates).forEach(([key, value]) => {
        if ( value.post_title !== '' && value.post_title === this.selectedProjects && typeof value.dataroom_files !== 'undefined' ) {
          returnVal = value;
        }
      });

      return returnVal;
    }
  },
  mounted() {
    this.userRole = this.getUserRole();
  },
  beforeMount() {
    this.getAllProjects();
  },
  watch: {
    'selectedProjects.value': function(newVal) {
      this.renderedLink = '';
      if (this.selectedType === 'units') {
        this.getProjectUnits();
      }
    },
    'selectedCustomer.value': function(newVal) {
      this.getAllCustomerDataBasedOnSelection(newVal);
      this.renderedLink = '';
    },
    selectedType: function(newVal) {
      this.renderedLink = '';
      if ( newVal === 'units' && this.selectedProjects.value.length > 0 ) {
        this.apiFetchedUnits = {};
        this.getProjectUnits();
      } else if ( newVal === 'project' && this.selectedProjects.value.length > 1 ) {
        this.selectedProjects.value = [];
      }
    }
  }
}

</script>

<template>

  <Navigation/>

  <div class="dataroom-wrapper"  @click="closeDropdowns">

    <div class="fixed-icons">
      <Button type="edit" @click="this.patchNotesInit">
        <PatchnotesIcon></PatchnotesIcon>
        Patch notes
      </Button>
    </div>

    <form>

      <div class="field-wrapper checkboxes">
        <span>
          <input class="checkbox field" type="radio" id="project" value="project" v-model="selectedType">
          <label for="project">
            Projekte
          </label>
        </span>
        <span>
          <input class="checkbox field" type="radio" id="units" value="units" v-model="selectedType">
          <label for="units">
            Einheiten
          </label>
        </span>
        <span>
          <input class="checkbox field" type="radio" id="country" value="country" v-model="selectedType">
          <label for="country">
            Spain
          </label>
        </span>
      </div>

      <div class="field-wrapper" style="z-index:2;" :class="{'invalid': !selectedProjectValid, 'valid': selectedProjectValid}" v-if="selectedType !== 'country'">
        <InputField class="dropdown-input" ref="inputProject" inputType="text" inputName="Project" :inputValue="selectedProjects.value" v-model="selectedProjects.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showRealEstatesDropdown = true" @click.stop=""></InputField>
        <label class="ph">Projekt wählen <AsterixMarkIcon></AsterixMarkIcon></label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown ref="dropdownProject" :class="{active: dropdownsShow.showRealEstatesDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="projectDropdown" :filterFor="selectedProjects.value" :activeItems="selectedProjects.value" @dropdown-item-clicked="dropdownClick('selectedProjects', $event, selectedType === 'units')" @click.stop=""></Dropdown>
      </div>
      <AnimateCircleIcon style="margin-bottom: 5px;" v-if="isLoadingUnits && Object.keys(apiFetchedUnits).length === 0"></AnimateCircleIcon>

      <div class="field-wrapper" v-if="selectedType === 'units' && Object.keys(apiFetchedUnits).length > 0">
        <div class="loading-units" v-if="isLoadingUnits"><AnimateCircleIcon ></AnimateCircleIcon></div>
        <div class="project-unit-selection" v-for="(units, projectname) in apiFetchedUnits" :key="projectname" v-show="selectedProjects.value.includes(projectname)">
          <div class="title"> {{projectname}} </div>
          <span v-for="(unit) in units" :key="unit.real_estate_id" v-if="units.length > 0">
            <InputField inputType="checkbox" :id="unit.real_estate_id" :inputName="unit.real_estate_id" :value="unit.real_estate_id" @change="getCheckboxVal"></InputField>
            <label :for="unit.real_estate_id" class="checkbox-wrapper">
              {{ unit.real_estate_id }}
            </label>
          </span>
          <span style="flex-basis:100%; text-align:center" v-else>
            Keine Einheiten gefunden
          </span>
        </div>
      </div>

<!--      <div class="field-wrapper" :class="{'invalid': !selectedCountry.valid, 'valid': selectedCountry.valid}" v-if="selectedType === 'country'">-->
<!--        <InputField class="dropdown-input" ref="inputCountry" inputType="text" inputName="Country" :inputValue="selectedCountry.value" v-model="selectedCountry.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showCountryDropdown = true" @click.stop=""></InputField>-->
<!--        <label class="ph">Land wählen <AsterixMarkIcon></AsterixMarkIcon></label>-->
<!--        <DropdownArrow class="dropdown-arrow"></DropdownArrow>-->
<!--        <Dropdown ref="dropdownCountry" :class="{active: dropdownsShow.showCountryDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="projectCountries" :activeItems="selectedCountry.value" @dropdown-item-clicked="dropdownClick('selectedCountry', $event)" @click.stop=""></Dropdown>-->
<!--      </div>-->

      <div class="field-wrapper search" :class="{'invalid': !selectedCustomer.valid, 'valid': selectedCustomer.valid}">
        <InputField ref="inputRealEstates" inputType="text" inputPlaceholder="Straße oder Immo-Nr." inputName="Customers" :inputValue="searchCustomerValue" v-model="searchCustomerValue" @input="restartCustomerSearch" @focus="setDropdownTop($event)"></InputField>
        <label class="ph" v-if="selectedType !== 'country'">Kundensuche nach E-Mail oder Telefon <AsterixMarkIcon></AsterixMarkIcon></label>
        <label class="ph" v-else>Customer search by email or phone <AsterixMarkIcon></AsterixMarkIcon></label>

        <Dropdown ref="dropdownCustomers" :class="{active: dropdownsShow.showCustomerDropdown, relative: dropdownRelativePosition}" type="customerDataDataroom" :renderingObject="apiAllCustomers" @dropdown-item-clicked="dropdownClick('selectedCustomer', $event)" @click.stop=""></Dropdown>
        <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
      </div>

      <DataroomForm v-if="selectedCustomer.value !== '' && selectedType !== 'country'" :activityIdOrCompany="this.getUserCompany()+'_'" :customerSysId="selectedCustomer.value.client_sys_id" :projectName="selectedProjects.value[0]" :triggerDropdownClose="triggerDropdownClose" :showButtons="{linkGenerate: false, save: true}"></DataroomForm>

      <div class="actions" style="width: 100%;">
        <Button type="report" @click="generateLink" v-if="selectedType !== 'country'">
          Link generieren
          <AnimateCircleIcon v-if="isLoadingGenerationToken"></AnimateCircleIcon>
        </Button>
        <Button type="report" @click="generateLink" v-else>
          Generate Link
          <AnimateCircleIcon v-if="isLoadingGenerationToken"></AnimateCircleIcon>
        </Button>
      </div>

      <div class="customer-information" v-if="renderedLink">
        <span v-if="selectedType !== 'country'">
          Link für folgenden Kunden: <br><b>{{selectedCustomer.value.client_first_name}} {{selectedCustomer.value.client_last_name}} <br>KdNr: {{selectedCustomer.value.client_id}} <br>E-Mail: {{selectedCustomer.value.client_email}}</b>
        </span>
        <span v-else>
          Link for the following customer: <br><b>{{selectedCustomer.value.client_first_name}} {{selectedCustomer.value.client_last_name}} <br>Customer Nr: {{selectedCustomer.value.client_id}} <br>Email: {{selectedCustomer.value.client_email}}</b>
        </span>
      </div>

      <div class="rendered-link" @click="copyLinkToClipboard" v-if="renderedLink">
        <a :href="renderedLink" style="line-break: anywhere;" target="_blank">{{renderedLink}}</a>
        <div class="copy-icon"><CopyIcon></CopyIcon></div>
      </div>

      <h3 class="" style="margin-top:50px; text-align: center; width: 100%" v-if="typeof renderFiles.dataroom_files !== 'undefined' && renderFiles.dataroom_files.length > 0">Downloads</h3>
      <div class="project-documents" v-if="typeof renderFiles.dataroom_files !== 'undefined' && renderFiles.dataroom_files.length > 0">
        <div v-for="(keyCat, indexCat) of renderFiles.dataroom_files">
          <div class="item" v-for="(key, index) in renderFiles.dataroom_files[indexCat]">
            <a :href="key.url" target="_blank">
                <span v-if="indexCat">{{ renderCatName(indexCat) }}</span>
                <span v-else>{{ key.url }}</span>
                <span><DownloadIcon></DownloadIcon></span>
              </a>
          </div>
        </div>
      </div>

    </form>

  </div>

</template>

<style scoped>

.dataroom-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 50px 0;
}

form {
  width: 50%;
  max-width: 550px;
  margin-top: 30vh;
}

.field-wrapper + .field-wrapper, .actions {
  margin-top: 25px;
}

.checkboxes {
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.checkboxes * {
  cursor: pointer;
}

.checkboxes label {
  left: 0;
}

.rendered-link {
  position: relative;
  margin-top: 25px;
  width: 100%;
  padding: 15px;
  background-color: var(--light-light-gray);
  color: var(--blue);
  text-align: center;
  border-radius: var(--border-radius);
}

.copy-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: -15px;
  right: -15px;
  z-index: 999;
  background: var(--blue);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.customer-information {
  width: 100%;
  margin-top: 25px;
  text-align :center;
}

.project-documents {
  background: var(--light-light-gray);
  margin-top: 10px;
  width: 100%;
}

.project-documents .item a {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px;
}

.project-documents > div + div .item {
  border-top: solid 1px white;
}

.project-documents .item a > span:first-letter{
  text-transform: capitalize;
}

.project-documents .item a:hover {
  background: var(--blue);
  color: white;
}

.project-documents .item a:hover i {
  color: white;
}

.project-documents i {
  color: var(--blue);
}

.project-unit-selection {
  display: flex;
  flex-wrap: wrap;
}

.project-unit-selection .title {
  flex-basis: 100%;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
  border-bottom: solid 1px var(--light-light-gray);
}

.project-unit-selection label {
  left: 0;
}

.project-unit-selection > span {
  flex-basis: 33%;
}

.project-unit-selection >span * {
  cursor: pointer;
}

.project-unit-selection + .project-unit-selection {
  margin-top: 25px;
}

.loading-units {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255,255,255,.7);
  z-index: 1;
}

.loading-units .loading-animation {
  margin: 0;
  font-size: 30px;
}

.fixed-icons {
  position: absolute;
  top: 25px;
  right: 30px;
}

@media (max-width: 767px) {
  .dataroom-wrapper {
    margin-top: 50px;
  }

  form {
    width: 100%;
    max-width: 90%;
  }
}

</style>
