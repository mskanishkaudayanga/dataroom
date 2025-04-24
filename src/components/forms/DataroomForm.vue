<script>
  import axios from "axios";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import InputField from "@/components/forms/InputField.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import Button from "@/components/buttons/button.vue";
  import CopyIcon from "@/components/icons/icon-copy.vue";

  export default {
    name: "DataroomForm",
    components: {
      CopyIcon,
      Button, DropdownArrow, Dropdown, AnimateCircleIcon, AsterixMarkIcon, InputField, TextAreaField},
    props: {
      activityIdOrCompany: {
        type: [String],
        default: ''
      },
      customerSysId: {
        type: [String, Number],
        default: ''
      },
      projectName: {
        type: [String, Object],
        default: ''
      },
      triggerDropdownClose: {
        type: String,
        default: ''
      },
      showButtons: {
        type: Object,
        default: {linkGenerate: true, save: true}
      },
      leadData: {
        type: [String, Object],
        default: ''
      }
    },
    data() {
      return {
        isLoadingSubmitData: false,
        isLoadingDataroom: true,
        isLoadingDataroomRealEstates: true,
        apiUsersResponse: [],
        apiAllRealEstates: [],
        routerName: this.$route.name,
        general: '',
        budget: '',
        livingStatus: '',
        latestRealEstateChangeRealEstateNr: '',
        latestRealEstateChangeProjectName: '',
        rooms: {
          rooms1: false,
          rooms2: false,
          rooms3: false,
          rooms4: false,
          rooms5Plus: false,
        },
        floor: '',
        docsAfterReservation: false,

        dataroomAPIDataFinished: false,

        dropdownContents: {
          general: [
            'Wohnungstypen',
            'Nur gefilterte Einheiten',
            'Keine Einzelexposés zeigen',
            'Gewerbeeinheiten',
          ],
          livingStatus: [
            'Unvermietete und vermietete Einheiten',
            'Vermietete Einheiten',
            'Unvermietete Einheiten'
          ],
          floor: [
            'Alle Etagen inklusive EG',
            'Nur Erdgeschoss',
            'Alle Etagen außer EG'
          ],
        },

        dropdowns: {
          general: false,
          livingStatus: false,
          floor: false,
        },
        dropdownRelativePosition: false,

        renderedLink: '',

        generatedCustomerToken: '',
        realEstateCountry: '',

      }
    },
    methods: {
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
      dropdownClick(field, clickedText) {
        this.$data[field] = clickedText;
        this.closeDropdowns();
      },
      closeDropdowns() {
        for (const index in this.dropdowns) {
          this.dropdowns[index] = false;
        }
      },
      renderRoomLabe(string) {
        let returnVal = string;
        if ( string === 'rooms1' ) {
          returnVal = '1 Zimmer';
        } else if ( string === 'rooms2' ) {
          returnVal = '2 Zimmer';
        } else if ( string === 'rooms3' ) {
          returnVal = '3 Zimmer';
        } else if ( string === 'rooms4' ) {
          returnVal = '4 Zimmer';
        } else if ( string === 'rooms5Plus' ) {
          returnVal = '5+ Zimmer';
        }
        return returnVal;
      },
      submitDataroomData() {

        if ( this.isLoadingSubmitData ) {
          return;
        }

        let dataToSend = {
          'data': {
            'client_id': this.apiUsersResponse.client_id,
            'client_title': this.apiUsersResponse.client_title, // Send also title otherwise it will be updated to empty val
            'client_company': this.activityIdOrCompany.includes('kg_') ? 'kg' : 'living',
            'client_mail': this.apiUsersResponse.client_email,
            'client_dataroom_general': this.general,
            'client_dataroom_max_budget': this.budget,
            'client_dataroom_room1': this.rooms.rooms1,
            'client_dataroom_room2': this.rooms.rooms2,
            'client_dataroom_room3': this.rooms.rooms3,
            'client_dataroom_room4': this.rooms.rooms4,
            'client_dataroom_room5plus': this.rooms.rooms5Plus,
            'client_dataroom_floor': this.floor,
            'client_dataroom_living_status': this.livingStatus,
            'client_dataroom_doc_after_reservation': this.docsAfterReservation,
          }
        };

        this.isLoadingSubmitData = true;
        axios.post(this.globalApiBaseUrl + '/dataroom/updateCustomerDataroomData', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.notificationBannerInit('success', 'Daten aktualisiert');
                  } else {
                    this.notificationBannerInit('warning', 'Daten konnten nicht aktualisiert');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Daten konnten nicht aktualisiert');
                }
            ).finally(
            () => {
              this.isLoadingSubmitData = false;
            }
        )

      },
      getDataroomData() {

        this.isLoadingDataroom = true;
        let company = this.activityIdOrCompany.includes('kg_') ? 'kg' : 'living';
        axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerDataBySysId?company='+company+'&system_id='+this.customerSysId)
          .then(
              (response) => {
                if ( response.data.status === 200 ) {
                  this.apiUsersResponse = response.data.response;
                  this.updateDataRoom(this.apiUsersResponse);
                } else {
                  this.apiUsersResponse = [];
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.apiUsersResponse = [];
              }
          ).finally(
          () => {
            this.dataroomAPIDataFinished = true;
            this.isLoadingDataroom = false;
          })

      },
      updateDataRoom(data) {

        if ( data.client_dataroom_general !== '' ) {
          this.general = data.client_dataroom_general;
        } else {
          this.general = 'Wohnungstypen';
        }

        if ( data.client_dataroom_max_budget !== '' ) {
          this.budget = data.client_dataroom_max_budget;
        }
        if ( data.client_dataroom_room1 === '1' ) {
          this.rooms.rooms1 = true;
        }
        if ( data.client_dataroom_room2 === '1' ) {
          this.rooms.rooms2 = true;
        }
        if ( data.client_dataroom_room3 === '1' ) {
          this.rooms.rooms3 = true;
        }
        if ( data.client_dataroom_room4 === '1' ) {
          this.rooms.rooms4 = true;
        }
        if ( data.client_dataroom_room5 === '1' ) {
          this.rooms.rooms5Plus = true;
        }
        if ( data.client_dataroom_status !== '' ) {
          this.livingStatus = data.client_dataroom_status;
        }
        if ( data.client_dataroom_floor !== '' ) {
          this.floor = data.client_dataroom_floor;
        }
        if ( data.client_dataroom_doc_after_reservation === '1' ) {
          this.docsAfterReservation = true;
        }

      },
      getAllProjects() {

        this.isLoadingDataroomRealEstates = true;

        axios.get(this.globalApiBaseUrl + '/dataroom/getDataroomProjects')
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiAllRealEstates = response.data.response;
                  } else {
                    this.apiAllRealEstates = [];
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally(() => {
              this.isLoadingDataroomRealEstates = false;
            })
      },
      initLinkGeneration() {

        if ( this.isLoadingDataroomRealEstates ) {
          return;
        }

        let company = this.activityIdOrCompany.includes('kg_') ? 'kg' : 'living';

        this.getRealEstateChanges();

        /**
         * Loop all agents and return first one with matching data
         * workaround for external agents where user name is existing multiple times
         */
        let agentId = '';
        let allAgents = this.getAgentsData();
        let agentUsername = this.getUserOoUsername();
        for (let index in allAgents[company]['list_of_all_users_data']) {
          let agent = allAgents[company]['list_of_all_users_data'][index];
          if (agent.user_Name === agentUsername && typeof agent.user_id !== 'undefined' ){
            agentId = agent.user_id;
            break;
          }
        }

        let countryIsocode = this.realEstateCountry;

        let realEstate = this.latestRealEstateChangeProjectName;

        if ( typeof this.latestRealEstateChangeRealEstateNr !== 'undefined' && this.latestRealEstateChangeRealEstateNr !== null && this.latestRealEstateChangeRealEstateNr !== '' ) {
          realEstate = this.latestRealEstateChangeRealEstateNr;
        }

        let dataToSend = {
          template: countryIsocode !== 'ESP' ? 'MIXED' : 'COUNTRY', // MIXED, COUNTRY
          company: company.toUpperCase(), // KG, LIVING
          userName: agentUsername,
          userId: agentId,
          country: countryIsocode, // ESP OR OTHER ISOCODE ALPHA 3
          userEmail: this.getUserMail(),
          userType: ( this.getUserMail().includes('@bestplace') || this.getUserMail().includes('@eck3') || this.getUserMail().includes('@azbow') ) ? 'INTERNAL' : 'EXTERNAL', // EXTERNAL, INTERNAL
          immoNrs: typeof realEstate === 'string' ? [realEstate] : realEstate,
          kdNr: this.apiUsersResponse.client_id,
          addressEmail: this.apiUsersResponse.client_email
        }

        this.isLoadingGenerationToken = true;

        if ( !realEstate.endsWith('WE00') || (realEstate.endsWith('WE00') && this.realEstateCountry === 'ESP') ) {
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
          // Project view
          dataToSend = {
            'customerMail': this.apiUsersResponse.client_email,
            'customerId': this.apiUsersResponse.client_id,
            'company': this.activityIdOrCompany.includes('kg_') ? 'kg' : 'living'
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

        let baseUrl = '';
        for( const realEstate in this.apiAllRealEstates ) {
          if ( this.apiAllRealEstates[realEstate].post_title === this.latestRealEstateChangeProjectName ) {
            baseUrl = this.apiAllRealEstates[realEstate].guid;
            break;
          }
        }

        if ( this.realEstateCountry !== 'ESP' && (typeof baseUrl === 'undefined' || baseUrl === null || baseUrl === '') ) {
          this.notificationBannerInit('warning', 'Immobilie nicht vorhanden. Link kann nicht erstellt werden.');
          return;
        }

        if ( this.latestRealEstateChangeRealEstateNr.endsWith('WE00') && this.realEstateCountry !== 'ESP' ) {
          //Project view

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

          if ( this.getUserMail().includes('@bestplace') || this.getUserMail().includes('@eck3') ) {
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
          this.renderedLink = 'http://3.70.135.138/template?token='+this.generatedCustomerToken;
        }

        this.copyLinkToClipboard();

      },
      copyLinkToClipboard() {
        let text = this.renderedLink;
        navigator.clipboard.writeText(`${text}`);
        this.notificationBannerInit('success', 'Link wurde in die Zwischenablage kopiert.');
      },
      checkNumberContent(event) {
        let inputVal = event.target.value;
        if ( inputVal === '' || inputVal === 'NaN' ) {
          this.budget = '0';
        }
      },
      getRealEstateChanges() {
        if ( this.leadData.canban_changed_real_estate !== undefined && this.leadData.canban_changed_real_estate !== null && this.leadData.canban_changed_real_estate !== ''){
          this.leadData.canban_changed_real_estate = typeof this.leadData.canban_changed_real_estate === 'string' ? JSON.parse(this.leadData.canban_changed_real_estate) : this.leadData.canban_changed_real_estate;
          let keys = Object.keys(this.leadData.canban_changed_real_estate);
          this.latestRealEstateChangeTimestamp = keys[keys.length -1]
          let dataOfChange =  this.leadData.canban_changed_real_estate[keys[keys.length - 1]]
          this.latestRealEstateChangeRealEstateNr = dataOfChange.real_estate_id;
          this.latestRealEstateChangeProjectName = dataOfChange.real_estate_project_name;
        } else {
          this.latestRealEstateChangeRealEstateNr = this.leadData.immo_nr;
          this.latestRealEstateChangeProjectName = this.projectName;
        }
      },
      getRealEstateCountry() {
        let countryIsocode = 'DEU';
        this.getRealEstateChanges();
        let foundRealEstate = this.apiAllRealEstates.filter(item => ( (this.latestRealEstateChangeProjectName === item.post_title || this.latestRealEstateChangeProjectName.includes(item.post_title)) && item.post_title !== '' ) );

        // Overwrite default when projectname is alicante
        if ( this.latestRealEstateChangeProjectName === 'Alicante' ) {
          foundRealEstate = [
            {country: 'ESP'}
          ]
        }

        if ( typeof foundRealEstate.length === 'undefined' || foundRealEstate.length < 1 ) {
          this.notificationBannerInit(
              "warning",
              "Die Immobilie "+this.latestRealEstateChangeProjectName+" konnte nicht im Dataroom gefunden werden."
          );
          return;
        }

        if ( typeof foundRealEstate[0].country !== 'undefined' && foundRealEstate[0].country !== null && foundRealEstate[0].country !== '' ) {
          countryIsocode = foundRealEstate[0].country;
        }
        return countryIsocode;
      }
    },
    computed: {
      isOnlyFilteredUnitSelected() {
        return this.general === 'Nur gefilterte Einheiten';
      },
    },
    watch: {
      customerSysId(val) {
        this.getDataroomData();
      },
      triggerDropdownClose() {
        this.closeDropdowns();
      },
      general(val) {
        if ( val === 'Nur gefilterte Einheiten' && this.dataroomAPIDataFinished ) {
          this.rooms.rooms1 = false;
          this.rooms.rooms2 = false;
          this.rooms.rooms3 = false;
          this.rooms.rooms4 = false;
          this.rooms.rooms5Plus = false;
          this.floor = '';
          this.livingStatus = '';
        }
      },
      isLoadingDataroom(val) {
        if ( !this.isLoadingDataroom && !this.isLoadingDataroomRealEstates ) {
          this.realEstateCountry = this.getRealEstateCountry();
          if ( this.realEstateCountry === 'ESP' ) {
            this.initLinkGeneration();
          }
        }
      },
      isLoadingDataroomRealEstates(val) {
        if ( !this.isLoadingDataroom && !this.isLoadingDataroomRealEstates ) {
          this.realEstateCountry = this.getRealEstateCountry();
          if ( this.realEstateCountry === 'ESP' ) {
            this.initLinkGeneration();
          }
        }
      },
    },
    mounted() {
      if ( this.$route.name === 'dataRoomTool' ) {
        this.getDataroomData();
      }
      this.getAllProjects();
    }
  }
</script>


<template>

  <div class="seperator" style="margin-bottom: 25px;" v-if="routerName === 'canbanModalEditLead'">
        <span>Datenraum</span>
  </div>

  <div class="load-screen" v-if="isLoadingDataroom || isLoadingDataroomRealEstates">
    <AnimateCircleIcon></AnimateCircleIcon>
  </div>

  <form class="dataroom-data" @click="closeDropdowns" style="margin-top: 25px;">

    <div class="field-wrapper two-col" v-if="realEstateCountry !== 'ESP'">
      <span>
        <InputField class="dropdown-input" ref="inputGeneral" inputType="text" inputName="General" :inputValue="general" v-model="general" @focus="setDropdownTop($event)" @click="dropdowns.general = !dropdowns.general" @click.stop=""></InputField>
        <label class="ph">Allgemein</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown ref="dropdownGeneral" :class="{active: dropdowns.general, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.general" :filterFor="general" @dropdown-item-clicked="dropdownClick('general', $event)" @click.stop=""></Dropdown>
      </span>
      <span v-if="!isOnlyFilteredUnitSelected">
        <InputField ref="inputRealEstates" inputType="text" inputName="RealEstates" :inputValue="this.numberWithComma(budget)" v-model="budget" @keyup="checkNumberContent($event)"></InputField>
        <label class="ph">Max. Budget</label>
      </span>
      <span v-else>
        <InputField class="dropdown-input" ref="inputLivingStatus" inputType="text" inputName="LivingStatus" :inputValue="livingStatus" v-model="livingStatus" @focus="setDropdownTop($event)" @click="dropdowns.livingStatus = !dropdowns.livingStatus" @click.stop=""></InputField>
        <label class="ph">Wohnungsstatus</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown ref="dropdownLivingStatus" :class="{active: dropdowns.livingStatus, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.livingStatus" :filterFor="livingStatus" @dropdown-item-clicked="dropdownClick('livingStatus', $event)" @click.stop=""></Dropdown>
      </span>
    </div>

    <div class="field-wrapper" v-if="isOnlyFilteredUnitSelected && realEstateCountry !== 'ESP'">
      <InputField ref="inputRealEstates" inputType="text" inputName="RealEstates" :inputValue="this.numberWithComma(budget)" v-model="budget" @keyup="checkNumberContent($event)"></InputField>
      <label class="ph">Max. Budget</label>
    </div>

    <div class="field-wrapper checkboxes" v-if="isOnlyFilteredUnitSelected && realEstateCountry !== 'ESP'">
      <span v-for="(val, index) in rooms">
        <input class="checkbox field" type="checkbox" :id="'rooms-'+index" :value="rooms[index]" v-model="rooms[index]">
        <label :for="'rooms-'+index" style="left:5px; cursor: pointer;">
          {{ renderRoomLabe(index) }}
        </label>
      </span>
    </div>

    <div class="field-wrapper two-col" v-if="realEstateCountry !== 'ESP'">
      <span v-if="isOnlyFilteredUnitSelected">
        <InputField class="dropdown-input" ref="inputFloor" inputType="text" inputName="Floor" :inputValue="floor" v-model="floor" @focus="setDropdownTop($event)" @click="dropdowns.floor = !dropdowns.floor" @click.stop=""></InputField>
        <label class="ph">Erdgeschoss</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown ref="dropdownFloor" :class="{active: dropdowns.floor, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.floor" :filterFor="floor" @dropdown-item-clicked="dropdownClick('floor', $event)" @click.stop=""></Dropdown>
      </span>
      <span>
        <input class="checkbox field" type="checkbox" :id="'docsAfterReservation'" :value="docsAfterReservation" v-model="docsAfterReservation">
        <label :for="'docsAfterReservation'" style="left:5px; cursor: pointer;">
          Dokument nach Reservierung
        </label>
      </span>
    </div>

    <div class="rendered-link" @click="copyLinkToClipboard" v-if="renderedLink">
      <a :href="renderedLink" style="line-break: anywhere;" target="_blank">{{renderedLink}}</a>
      <div class="copy-icon"><CopyIcon></CopyIcon></div>
    </div>

  </form>

  <div class="actions" v-if="realEstateCountry !== 'ESP'">
    <Button :style="!showButtons.save ? 'flex-basis:100%' : ''" v-if="showButtons.linkGenerate" type="edit" @click="initLinkGeneration" data-cy="generate-dataroom-link">Link generieren</Button>
    <Button :style="!showButtons.linkGenerate ? 'flex-basis:100%' : ''" v-if="showButtons.save" :type="routerName === 'canbanModalEditLead' ? 'edit' : 'report'" @click="submitDataroomData" data-cy="save-dataroom">Filter Speichern <AnimateCircleIcon v-if="this.isLoadingSubmitData"></AnimateCircleIcon></Button>
  </div>

  <div class="seperator" style="height: 1px;" v-if="routerName === 'canbanModalEditLead'">
  </div>

</template>


<style scoped>

.title {
  font-size: 18px;
  font-weight: 700;
}

.verkaufsmeldung-data, .process-tabs-wrapper {
  display: flex;
  justify-content: space-between;
}

.meta-data-top {
  margin-bottom: 25px;
  font-size: 12px;
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

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

.seperator {
  position: relative;
  width: 100%;
  text-align: center;
  margin: 25px 0;
}

.seperator > span {
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 10px 15px;
}

.seperator:after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 1px;
  background-color: var(--light-light-gray);
}

.radios, .radio-wrapper{
  text-align: center;
}

.field-wrapper + .field-wrapper {
  margin-top: 25px;
}

.field-wrapper:not(.search)  {
  display: flex;
  justify-content: space-between;
}

.field-wrapper.radios {
  justify-content: center;
}

.field-wrapper > span {
  flex-basis: 48%;
}

.field-wrapper:not(.two-col) > span {
  flex-basis: 100%;
}

.radio-wrapper {
  display: inline-block;
}

.load-screen {
  position: absolute;
  width: 100%;
  height: 110%;
  background-color: rgba(255,255,255,0.9);
  top: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.load-screen .loading-animation {
  margin: 0;
  font-size: 40px;
}

.process-tabs-wrapper, .real-estates-list, .modal-body {
  margin-top: 40px;
}

.verkaufsmeldung-data:first-of-type > div:last-of-type {
  text-align: right;
}
input[type="checkbox"] {
  position: relative;
  top: 5px;
  border: solid 2px black;
  height: 20px;
  width: 20px;
  padding: 0;
}
.verkaufsmeldung-data > div {
  flex-basis: 48%;
}

.customer-data a {
  color: var(--blue);
}

.process-tabs-wrapper .processtab {
  flex-basis: 32%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 40px;
  flex-basis: 100%;
}

.actions > .button, .actions > a {
  flex-basis: 48%;
  margin-bottom: 15px;
}

.actions .button.full-width {
  flex-basis: 100%;
}

.actions.delete-init .button:last-of-type,
.actions.report-init .button:last-of-type,
.actions.approve-init .button:last-of-type{
  flex-basis: 48%;
  margin-bottom: 15px;
}

iframe {
  width: 100%;
  height: 70vh;
}

.iframe-view .actions.approve-init .button:last-of-type {
  flex-basis: 100%;
}

.actions.approve-init.reject-init .button:last-of-type {
  flex-basis: 48%;
}

.option-wrapper {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  padding: 25px 0;
  border-top: dotted 1px var(--light-gray);
  border-bottom: dotted 1px var(--light-gray);
}

.option-wrapper + .option-wrapper {
  border-top: none;
  margin-top: 0;
}

.option-wrapper .checkbox {
  flex-basis: auto;
  top: 0;
  margin-top: 0;
}

.title-seperator {
  position: relative;
  flex-basis: 100%;
  margin: 25px 0;
  text-align: center;
  z-index: 0;
}

.title-seperator span {
  position: relative;
  padding: 0 15px;
  background: white;
  z-index: 2;
}

.title-seperator:after {
  content: '';
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--light-light-gray);
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
}

.real-estates-list {
  height: auto;
  margin-bottom: 25px;
}

.real-estate-list-item {
  border-bottom: none;
}

.fee-conditional {
  margin-bottom: 15px;
}

.loading-icon-offers .loading-animation {
  display: inline;
  font-size: 16px;
  margin-left: 5px;
}


</style>
