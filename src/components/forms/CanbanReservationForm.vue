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

  export default {
    name: "CanbanReservationForm",
    components: {
      DeleteIcon,
      RealEstateList,
      AlertMessage,
      Button, TextAreaField, DropdownArrow, Dropdown, AsterixMarkIcon, InputField, AnimateCircleIcon, CloseIcon},
    props: {
      realEstateNrProp: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingRealEstate: false,
        activityId: this.$route.params.id,
        realEstateNr: this.realEstateNrProp === '' ? this.$route.params.realEstateNr : this.realEstateNrProp,

        typeOfQualified: '',

        search: '',
        selectedRealEstateNr: '',
        foundRealEstates: [],

        selectedPrice: 0,
        selectedFee: 0,

        realEstatesSummary: [],

        dropdownsShow: {
          showRealEstateDropdown: false,
          appointmentKind: false,
          appointmentDuration: false,
        },

        dropdownRelativePosition: false,
        showErrorMsg: false,

        appointment: {
          kind: {
            required: true,
            value: '',
            valid: true,
          },
          dateTime: {
            required: true,
            value: '',
            valid: true,
          },
          duration: {
            required: true,
            value: '',
            valid: true,
          },
        },

        dropdownContents: {
          appointmentKind: [
            'Besichtigung',
            'Treffen im Showroom UdL',
            'Treffen im Projekt-Showroom',
            'Bürotermin',
          ],
          appointmentDuration: [
            '15 Min.',
            '30 Min.',
            '45 Min.',
            '60 Min.',
            '75 Min.',
            '90 Min.',
            '120 Min.',
            '150 Min.',
            '180 Min.',
          ],
        },

      }
    },
    methods: {
      closeDropdowns() {
        for (const index in this.dropdownsShow) {
          this.dropdownsShow[index] = false;
        }
      },
      closeModal() {
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
      searchRealEstateAndSetAsDefault() {
        let realEstateNrFormated = this.realEstateNr.toLowerCase();
        if ( realEstateNrFormated.includes('anfrage') ) {
          return;
        }
        this.search = this.realEstateNr;
        this.searchRealEstate(true);
      },
      submitLead() {

        if (this.isLoading || this.realEstatesSummary.length === 0) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          'activityId': this.activityId,
          'company': this.activityId.includes('kg_') ? 'kg' : 'living',
          'realEstatesSummary': this.realEstatesSummary,
        };

        axios.post(this.globalApiBaseUrl + '/canban/leadToReservation', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Reservierung erstellt');
                    this.$emit('reloadCanban', this.makeid(30));
                  } else {
                    if ( response.data.msg === 'Reservation for this lead already exists' ) {
                      this.notificationBannerInit('warning', 'Dieser Lead hat bereits eine Reservierung');
                    } else {
                      this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
                    }
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
      dropdownClickAppointment(field, clickedText) {
        this.$data['appointment'][field].value = clickedText;
        this.closeDropdowns();
      },
      submitLeadAppointment() {

        if ( !this.validateAppointmentForm() ) {
          return;
        }

        if (this.isLoading) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          'activityId': this.activityId,
          'appointmentData': this.appointment,
        };

        axios.post(this.globalApiBaseUrl + '/canban/leadToAppointment', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Lead erfolgreich terminiert');
                  } else {
                    this.notificationBannerInit('warning', 'Lead konnte nicht terminiert werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Lead konnte nicht terminiert werden');
                }
            ).finally(
            () => {
              this.isLoading = false;
            })

      },
      validateAppointmentForm() {
        let formValidation = true;
        Object.entries(this.appointment).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === ''){
              this.appointment[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'email' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.appointment[key].valid = true;
                } else {
                  this.appointment[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.appointment[key].valid = true;
              }
            }
          }
        });
        return formValidation;
      },
    },
    mounted() {
      this.searchRealEstateAndSetAsDefault();
    }
  }
</script>


<template>

  <form class="reservation-data">

    <div class="field-wrapper search">
      <InputField ref="inputRealEstates" inputType="text" inputPlaceholder="Straße oder Immo-Nr." inputName="RealEstates" :inputValue="search" v-model="search" @input="searchRealEstate()" @focus="setDropdownTop($event)"></InputField>
      <label class="ph">Suchen nach Straße oder Immo-Nr. <AsterixMarkIcon></AsterixMarkIcon></label>
      <Dropdown ref="dropdownRealEstates" :class="{active: dropdownsShow.showRealEstateDropdown, relative: dropdownRelativePosition}" type="realEstate" :renderingObject="foundRealEstates" @dropdown-item-clicked="dropdownClick('realEstatesSummary', $event)" @click.stop=""></Dropdown>
      <AnimateCircleIcon v-if="isLoadingRealEstate"></AnimateCircleIcon>
    </div>

    <div class="field-wrapper two-col">
       <span>
        <InputField inputType="text" inputName="CustomerTitle" :inputValue="this.numberWithComma(selectedPrice)" v-model="selectedPrice"></InputField>
        <label class="ph">Reservierungspreis</label>
      </span>
      <span>
        <InputField inputType="text" inputName="CustomerTitle" :inputValue="this.numberWithComma(selectedFee)" v-model="selectedFee"></InputField>
        <label class="ph">Reservierungsgebühr</label>
      </span>
    </div>

    <div class="actions" style="flex-basis: 100%;">
      <Button style="flex-basis: 100%;" type="edit" @click="addRealEstateToSummary" data-cy="add-unit">Einheit hinzufügen</Button>
    </div>

    <div class="real-estates-list" style="flex-basis: 100%;">
      <div v-if="realEstatesSummary.length === 0" style="text-align: center;">Füge mindestens eine Einheit hinzu</div>
      <TransitionGroup name="fadein">
        <div class="real-estate-list-item" :class="{ 'show-edit-actions': false }" v-for="realEstate in realEstatesSummary" :key="realEstate.real_estate_id">

          <div class="row-wrapper">

            <div class="row">
              <div class="real-estate-nr">{{ realEstate.real_estate_id }}</div>
              <div style="display: flex;">
                <div class="real-estate-rent-status">{{ (realEstate.real_estate_rented === '0' || !realEstate.real_estate_rented || realEstate.real_estate_rented === 'false') ? 'frei' : 'vermietet' }}</div>
              </div>
            </div>

            <div class="row">
              <div class="real-estate-price">
                <span style="display: inline-block;">{{ this.numberWithComma(realEstate.real_estate_reservationprice) }} {{ this.$currency }}</span>
              </div>
              <div class="real-estate-fee">{{ this.numberWithComma(realEstate.real_estate_fee) }} {{ this.$currency }}</div>
            </div>

          </div>

          <div class="edit-actions">
            <DeleteIcon @click="removeRealEstateFromSummary(realEstate.real_estate_id)"></DeleteIcon>
          </div>

        </div>
      </TransitionGroup>
    </div>

  </form>

  <div class="error-message" v-if="showErrorMsg && typeOfQualified === 'reservation'">
    <AlertMessage :alertText="showErrorMsg" alertStatus="warning"></AlertMessage>
  </div>

  <div class="actions">
    <Button type="delete" @click="closeModal">Schließen</Button>
    <Button type="report" :class="{'grayout': realEstatesSummary.length === 0}" @click="submitLead" data-cy="submit">Reservierung erstellen <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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
  flex-wrap: wrap;
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

.radio-wrapper {
  cursor: pointer;
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
