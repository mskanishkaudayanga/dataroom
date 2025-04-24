<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import InputField from "@/components/forms/InputField.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import Button from "@/components/buttons/button.vue";
  import AlertMessage from "@/components/card/AlertMessage.vue";
  import RealEstateList from "@/components/card/RealEstateList.vue";
  import DeleteIcon from "@/components/icons/icon-delete.vue";
  import EditIcon from "@/components/icons/icon-edit.vue";
  import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";

  export default {
    name: "canbanModalLeadToSale",
    components: {
      CheckmarkIcon,
      EditIcon,
      DeleteIcon,
      RealEstateList,
      AlertMessage,
      Button, TextAreaField, DropdownArrow, Dropdown, AsterixMarkIcon, InputField, AnimateCircleIcon, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingRealEstate: false,
        activityId: this.$route.params.id,

        search: '',
        selectedRealEstateNr: '',
        foundRealEstates: [],

        selectedPrice: 0,
        selectedFee: 0,

        realEstatesSummary: [],

        dropdownsShow: {
          showRealEstateDropdown: false,
        },

        dropdownRelativePosition: false,
        showErrorMsg: false,

        submitProcess: false,

        editModeOfRealEstates: {},
        editRealEstatePrice: '',
      }
    },
    methods: {
      closeDropdowns() {
        for (const index in this.dropdownsShow) {
          this.dropdownsShow[index] = false;
        }
      },
      closeModal(force = false) {
        if ( this.submitProcess && !force ) {
          this.submitProcess = false;
          return;
        }

        this.$router.push({name: 'canbanTool'});
        this.resetData();
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
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
      searchRealEstate(initSet = false) {
        if (this.search && this.search.length >= 3) {

          if (this.isLoadingRealEstate) {
            return;
          }

          this.isLoadingRealEstate = true;

          let company = this.activityId.includes('kg_') ? 'kg' : 'living';

          axios.get(this.globalApiBaseUrl + '/onoffice/getRealEstate?searchString=' + this.search + '&company='+company+'&allowStammobject=false')
              .then(
                  (response) => {
                    this.foundRealEstates = response.data.response.real_estates;
                    this.selectedRealEstateSysId = response.data.response.real_estate_sys_id;
                    if ( !initSet ) {
                      this.dropdownsShow.showRealEstateDropdown = true;
                    } else {
                      this.search = response.data.response.real_estates[0].real_estate_id;
                      this.selectedRealEstateNr = response.data.response.real_estates[0].real_estate_id;
                      this.selectedPrice = response.data.response.real_estates[0].real_estate_price;
                      this.selectedFee = response.data.response.real_estates[0].real_estate_fee;
                    }
                  }
              )
              .catch(
                  (error) => {
                  }
              ).finally( () => {
                this.isLoadingRealEstate = false;
              })
        }
      },
      getAllReservationRealEstates() {
        axios.get(this.globalApiBaseUrl + '/canban/getTempReservationData?activityId=' + this.activityId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.realEstatesSummary = response.data.response[0].real_estates;
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally( () => {
          this.isLoadingRealEstate = false;
        })
      },
      searchRealEstateAndSetAsDefault() {
        let realEstateNrFormated = this.realEstateNr.toLowerCase();
        if ( realEstateNrFormated.includes('anfrage') ) {
          return;
        }
        this.search = this.realEstateNr;
        this.searchRealEstate(true);
      },
      submitLead() {

        Object.entries(this.editModeOfRealEstates).forEach( ([key, value]) => {
          this.editModeOfRealEstates[key].editMode = false;
        });

        if ( !this.submitProcess ) {
          this.submitProcess = true;
          return;
        }

        if (this.isLoading || this.realEstatesSummary.length === 0) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          'activityId': this.activityId,
          'realEstatesSummary': this.realEstatesSummary,
        };

        axios.post(this.globalApiBaseUrl + '/canban/createSale', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal(true);
                    this.notificationBannerInit('success', 'Verkauf gemeldet');
                  } else {
                    this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally( () => {
              this.isLoading = false;
            })
      },
      dropdownClick(field, clickedText) {
        if (field === 'realEstatesSummary') {
          Object.entries(this.foundRealEstates).forEach(([index, value]) => {
            if (value.real_estate_id === clickedText) {
              this.search = value.real_estate_id;
              this.selectedRealEstateNr = value.real_estate_id;
              this.selectedPrice = value.real_estate_price;
              this.selectedFee = value.real_estate_fee;
            }
          });
        } else {
          this.leadForm[field].value = clickedText;
        }
        this.closeDropdowns();
      },
      addRealEstateToSummary(){

        if ( this.foundRealEstates.length === 0 ) {
          this.showErrorMsg = 'Keine Immobilie gefunden oder bereits reserviert.';
          return;
        } else {
          this.showErrorMsg = '';
        }

        Object.entries(this.foundRealEstates).forEach(([index, value]) => {
          if (value.real_estate_id === this.selectedRealEstateNr) {
            let checkIfSelectedAlready = false;
            Object.entries(this.realEstatesSummary).forEach(([index, value]) => {
              if ( value.real_estate_id === this.search ) {
                checkIfSelectedAlready = true;
              }
            });
            if ( checkIfSelectedAlready ) {
              return;
            }

            value.real_estate_reservationprice = this.selectedPrice;
            value.real_estate_fee = this.selectedFee;

            this.realEstatesSummary.push(value);

            this.search = '';
            this.selectedPrice = 0;
            this.selectedFee = 0;
          }
        });
      },
      resetData() {
        Object.assign(this.$data, this.$options.data.call(this));
      },
      validateSubmit() {
        let validationChecker = true;
        Object.entries(this.leadForm).forEach(([key, field]) => {
          if ( typeof field.required !== 'undefined' && field.required ){
            if ( field.value === undefined || field.value === ''){
              this.leadForm[key].valid = false;
              validationChecker = false;
            } else {
              if (  field === 'mail' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.leadForm[key].valid = true;
                } else {
                  this.leadForm[key].valid = false;
                  validationChecker = false;
                }
              } else {
                this.leadForm[key].valid = true;
              }
            }
          }
        });
        return validationChecker;
      },
      removeRealEstateFromSummary(realEstateNrToRemove){
        let i = 0;
        for ( const realEstates of this.realEstatesSummary ) {
          if ( realEstates.real_estate_id === realEstateNrToRemove ){
            this.realEstatesSummary.splice(i, 1);
          }
          i += 1;
        }
      },
      realEstatePriceEdit(realEstateNr) {

        this.editModeOfRealEstates[realEstateNr].editMode = !this.editModeOfRealEstates[realEstateNr].editMode;

        for ( const realEstates of this.realEstatesSummary ) {
          if ( realEstates.real_estate_id === realEstateNr ){
            this.editRealEstatePrice = realEstates.real_estate_reservationprice;
          }
        }

      },
      saveNewRealEstatePrice(realEstateNr) {
        for ( const realEstates of this.realEstatesSummary ) {
          if ( realEstates.real_estate_id === realEstateNr ){
            realEstates.real_estate_reservationprice = this.editRealEstatePrice;
            this.editModeOfRealEstates[realEstateNr].editMode = false;
          }
        }
      }
    },
    watch: {
      realEstatesSummary: {
        handler(val){
          let arrayUnit = {};
          for ( const realEstates of val ) {
            arrayUnit[realEstates.real_estate_id] = {editMode: false};
          }
          this.editModeOfRealEstates = arrayUnit;
        },
        deep: true,
      },
    },
    mounted() {
      this.getAllReservationRealEstates();
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Verkauf erstellen</div>
        <CloseIcon @click="closeModal(true)"></CloseIcon>
      </div>

      <div class="modal-body">

        <form class="reservation-data">

          <div class="field-wrapper search" v-if="!submitProcess">
            <InputField ref="inputRealEstates" inputType="text" inputPlaceholder="Straße oder Immo-Nr." inputName="RealEstates" :inputValue="search" v-model="search" @input="searchRealEstate()" @focus="setDropdownTop($event)"></InputField>
            <label class="ph">Suchen nach Straße oder Immo-Nr. <AsterixMarkIcon></AsterixMarkIcon></label>
            <Dropdown ref="dropdownRealEstates" :class="{active: dropdownsShow.showRealEstateDropdown, relative: dropdownRelativePosition}" type="realEstate" :renderingObject="foundRealEstates" @dropdown-item-clicked="dropdownClick('realEstatesSummary', $event)" @click.stop=""></Dropdown>
            <AnimateCircleIcon v-if="isLoadingRealEstate"></AnimateCircleIcon>
          </div>

          <div class="field-wrapper" v-if="!submitProcess">
             <span>
              <InputField inputType="text" inputName="CustomerTitle" :inputValue="this.numberWithComma(selectedPrice)" v-model="selectedPrice"></InputField>
              <label class="ph">Beurkundeter Kaufpreis:</label>
            </span>
          </div>

          <div class="actions" style="flex-basis: 100%;" v-if="!submitProcess">
            <Button style="flex-basis: 100%;" type="edit" @click="addRealEstateToSummary" data-cy="add-unit">Einheit hinzufügen</Button>
          </div>

          <div class="summary-intro" v-if="submitProcess">
            <h3>Zusammenfassung des Verkaufs</h3><br>
            Bitte kontrolliere alle Immobilien und Preise:
          </div>

          <div class="real-estates-list" style="flex-basis: 100%;">
            <div v-if="realEstatesSummary.length === 0" style="text-align: center;">Füge mindestens eine Einheit hinzu</div>

            <TransitionGroup name="fadein">
              <div class="real-estate-list-item" :class="{ 'show-edit-actions': false }" v-for="realEstate in realEstatesSummary" :key="realEstate.real_estate_id">

                <div class="row-wrapper">

                  <div class="row">
                    <div class="real-estate-nr">{{ realEstate.real_estate_id }}</div>
                    <div style="display: flex;">
                      <span style="display: inline-block; margin-right: 10px;" v-if="!editModeOfRealEstates[realEstate.real_estate_id].editMode">
                        Beurkundeter Kaufpreis:
                        <b>
                          {{ this.numberWithComma(realEstate.real_estate_reservationprice) }} {{ this.$currency }}
                        </b>
                      </span>
                      <span v-else>
                        <InputField inputType="text" inputName="RealEstatePrice" :inputValue="this.numberWithComma(editRealEstatePrice)" v-model="editRealEstatePrice"></InputField>
                      </span>
                    </div>
                  </div>

                </div>

                <div class="edit-actions" v-if="!editModeOfRealEstates[realEstate.real_estate_id].editMode">
                  <EditIcon @click="realEstatePriceEdit(realEstate.real_estate_id)"></EditIcon>
                  <DeleteIcon @click="removeRealEstateFromSummary(realEstate.real_estate_id)"></DeleteIcon>
                </div>
                <div class="edit-actions" v-else>
                  <CheckmarkIcon @click="saveNewRealEstatePrice(realEstate.real_estate_id)"></CheckmarkIcon>
                  <CloseIcon @click="editModeOfRealEstates[realEstate.real_estate_id].editMode = false"></CloseIcon>
                </div>

              </div>
            </TransitionGroup>
          </div>

        </form>

        <div class="error-message" v-if="showErrorMsg">
          <AlertMessage :alertText="showErrorMsg" alertStatus="warning"></AlertMessage>
        </div>

        <div class="actions">

          <Button type="delete" @click="closeModal(false)">{{!submitProcess ? 'Schließen' : 'Abbrechen'}}</Button>
          <Button type="report" :class="{'grayout': realEstatesSummary.length === 0}" @click="submitLead" data-cy="submit">{{!submitProcess ? 'Verkauf melden' : 'Bestätigen'}} <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>

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

.verkaufsmeldung-data, .process-tabs-wrapper {
  display: flex;
  justify-content: space-between;
}

.meta-data-top {
  margin-bottom: 25px;
  font-size: 12px;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
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

.real-estate-list-item:last-of-type {
  border-bottom: none;
}

.fee-conditional {
  margin-bottom: 15px;
}

.button.blue.full.grayout {
  background-color: var(--gray-text);
}

.loading-icon-offers .loading-animation {
  display: inline;
  font-size: 16px;
  margin-left: 5px;
}

.edit-actions i {
  cursor: pointer;
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
