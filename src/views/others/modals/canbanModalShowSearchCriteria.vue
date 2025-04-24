<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import {filterStore} from "@/stores/filterStore";
  import {userRolesStore} from "@/stores/userRoleStore";

  export default {
    name: "canbanModalShowSearchCriteria",
    components: {
      TextAreaField,
      AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    props: {
      searchCriteria: {
        type: Object,
        default: []
      },
    },
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.activityId,

        leadData: [],
      }
    },
    methods: {
      getSingleLeadData() {
        this.isLoading = true;
        axios.get(this.globalApiBaseUrl + '/canban/getSingleLead?activityId='+this.activityId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.leadData = response.data.response[0];
                    if ( typeof this.leadData.canban_searchcriteria !== 'undefined' && this.leadData.canban_searchcriteria !== '' ) {
                      this.leadData.canban_searchcriteria = JSON.parse(this.leadData.canban_searchcriteria);
                    }
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
      resetData() {
        this.isOpenModal = true;
        this.isLoading = false;
        this.activityId = this.$route.params.id;
        this.submitProcess = false;
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
      closeModal(){
        this.resetData();
        this.$router.push({name: 'canbanTool'})
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
      mappingOfFieldNames(string) {

        let returnVal = string;
        if ( string === 'kind' ) {
          returnVal = 'Kunden interessiert in'
        } else if ( string === 'purpose' ) {
          returnVal = 'Zweck'
        } else if ( string === 'buyExperience' ) {
          returnVal = 'Kauferfahrung'
        } else if ( string === 'typeOfUse' ) {
          returnVal = 'Nutzungsart'
        } else if ( string === 'rentStatus' ) {
          returnVal = 'Wohnungsstatus'
        } else if ( string === 'moveInDate' ) {
          returnVal = 'Einzugsdatum'
        } else if ( string === 'county' ) {
          returnVal = 'Bundesland'
        } else if ( string === 'city' ) {
          returnVal = 'Stadt'
        } else if ( string === 'district' ) {
          returnVal = 'Bezirke'
        } else if ( string === 'roomsFrom' ) {
          returnVal = 'Zimmer ab'
        } else if ( string === 'roomsTo' ) {
          returnVal = 'Zimmer bis'
        } else if ( string === 'squareMetresFrom' ) {
          returnVal = 'Wohnfläche ab'
        } else if ( string === 'squareMetresTo' ) {
          returnVal = 'Wohnfläche bis'
        } else if ( string === 'newOrExisting' ) {
          returnVal = 'Neubau oder Bestand'
        } else if ( string === 'constructionYear' ) {
          returnVal = 'Baujahr ab'
        } else if ( string === 'maxBudget' ) {
          returnVal = 'Max. Budget'
        } else if ( string === 'kindOfFinance' ) {
          returnVal = 'Finanzierungsart'
        } else if ( string === 'approvedFinance' ) {
          returnVal = 'Finanzierungszusage'
        } else if ( string === 'notice' ) {
          returnVal = 'Notiz'
        } else if ( string === 'balcony' ) {
          returnVal = 'Balkon'
        } else if ( string === 'terrace' ) {
          returnVal = 'Terrasse'
        } else if ( string === 'garden' ) {
          returnVal = 'Garten'
        } else if ( string === 'lift' ) {
          returnVal = 'Aufzug'
        } else if ( string === 'basement' ) {
          returnVal = 'Keller'
        } else if ( string === 'parkingSlot' ) {
          returnVal = 'Parkplatz'
        } else if ( string === 'realEstateType' ) {
          returnVal = 'Immobilientyp'
        } else if ( string === 'location' ) {
          returnVal = 'Lage'
        } else if ( string === 'bedRooms' ) {
          returnVal = 'Schlafzimmer'
        } else if ( string === 'bathRooms' ) {
          returnVal = 'Badezimmer'
        } else if ( string === 'oceanView' ) {
          returnVal = 'Meeresblick'
        } else if ( string === 'pool' ) {
          returnVal = 'Pool'
        } else if ( string === 'privatGarden' ) {
          returnVal = 'Garten'
        } else if ( string === 'additionalWishes' ) {
          returnVal = 'Sonstige Wünsche'
        } else if ( string === 'needCredit' ) {
          returnVal = 'Kredit benötigt'
        } else if ( string === 'timeOfPurchase' ) {
          returnVal = 'Zeitpunkt des Kaufes'
        } else if ( string === 'county' ) {
          returnVal = 'Bundesland'
        } else if ( string === 'golf' ) {
          returnVal = 'Golf'
        }

        return returnVal;

      },
      mappingOfFieldValue(string) {

        let returnVal = string;
        if ( string === 'true' || string === true ) {
          returnVal = 'Ja'
        } else if ( string === 'false' ) {
          returnVal = 'Nein'
        } else if ( typeof string === 'object' && string !== null ) {
          returnVal = string.join(', ')
        }

        return returnVal;

      },
      editSearchProfile() {
        this.$router.push({name: 'canbanModalMakeEditSearchCriteria', params: {id: this.activityId}})
      },
      createSearchCriteriaPDF() {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          'activityId': this.activityId
        };

        axios.post(this.globalApiBaseUrl + '/canban/createSearchCriteriaPDF', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    window.open(response.data.response, '_blank').focus();
                  } else {
                    this.notificationBannerInit('warning', 'PDF konnte nicht erstellt werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'PDF konnte nicht erstellt werden');
                }
            ).finally(
            () => {
              this.isLoading = false;
            })
      }
    },
    computed: {
      isAlicanteCity() {

        if ( typeof this.leadData === 'undefined' || this.leadData === '' || this.leadData.length === 0 ) {
          return false;
        }

        if ( this.leadData.canban_searchcriteria.hasOwnProperty('city') && this.leadData.canban_searchcriteria.city === 'Alicante' ) {
          return true;
        }
        return false;
      }
    },
    mounted() {
      this.getSingleLeadData();
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Suchprofil des Leads</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <div class="searchcriteria-summary">
          <span class="searchcriteria-item" v-for="(val, index) in leadData.canban_searchcriteria">
            <span v-if="index !== 'agentSysId' && index !== 'addressId' && val !== '' && index !== 'searchCriteriaId'">
              <span>{{mappingOfFieldNames(index)}}:</span>
              <span v-if="index !== 'maxBudget'">{{mappingOfFieldValue(val)}}</span>
              <span v-else>{{this.numberWithComma(mappingOfFieldValue(val))}} €</span>
            </span>
          </span>
        </div>

        <div class="actions">
          <Button type="edit" @click="createSearchCriteriaPDF()" v-if="isAlicanteCity">Suchprofil drucken <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon></Button>
          <Button type="report" @click="editSearchProfile">Suchprofil bearbeiten</Button>
          <Button type="report" :class="{'full-width': isAlicanteCity}" @click="this.jumpToFilterinTool(leadData.canban_searchcriteria)">Nach Immobilien suchen</Button>
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

.searchcriteria-summary {
  display: flex;
  flex-wrap: wrap;
}

.searchcriteria-item {
  flex-basis: 100%;
}

.searchcriteria-item > span {
  display: flex;
  margin-bottom: 5px;

}
.searchcriteria-item > span > span:first-of-type {
  flex-basis: 40%;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

.process-tabs-wrapper, .real-estates-list, .modal-body {
  margin-top: 40px;
}

.verkaufsmeldung-data:first-of-type > div:last-of-type {
  text-align: right;
}

.verkaufsmeldung-data > div {
  flex-basis: 48%;
}

.customer-data a {
  color: var(--blue);
}

.fieldgroup-label {
  flex-basis: 100%;
  margin-bottom: 10px;
}

.process-tabs-wrapper .processtab {
  flex-basis: 32%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 40px;
}

.actions > .button, .actions > a {
  flex-basis: 48%;
  margin-bottom: 15px;
}

.actions .button.full-width {
  flex-basis: 100%;
}

textarea {
  transition: height 0.2s;
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

.radios, .radio-wrapper{
  text-align: center;
}

.field-wrapper {
  flex-wrap: wrap;
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

label {
  cursor: pointer;
}

.radio-wrapper {
  display: inline-block;
}

/* Medium Mobile */
@media (max-width: 500px){
  .verkaufsmeldung-data {
    flex-wrap: wrap;
  }
  .verkaufsmeldung-data > div {
    flex-basis: 100%;
  }
  .verkaufsmeldung-data:last-of-type {
    display:none;
  }
  .additional + .additional {
    margin-top: 10px;
  }
  .real-estate-list-item .row {
    flex-wrap: wrap;
  }
  .real-estate-list-item .row > div {
    flex-basis: 100%;
  }
  .verkaufsmeldung-data > div b {
    display: block;
  }
}


</style>
