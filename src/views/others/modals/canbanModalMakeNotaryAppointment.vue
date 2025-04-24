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

  export default {
    name: "canbanModalMakeNotaryAppointment",
    components: {
      TextAreaField,
      AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingCancel: false,
        activityId: this.$route.params.id,
        reservationId: this.$route.params.reservationId,
        tempReservationStatus: this.$route.params.tempReservationStatus,
        submitProcess: false,
        dropdownRelativePosition: false,
        editMode: this.$route.name === 'canbanModalEditNotaryAppointment',

        appointment: {
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
          customerNotification: true,
        },

        dropdownContents: {
          appointmentDuration: [
            '45 Min.',
            '60 Min.',
            '75 Min.',
            '90 Min.',
            '120 Min.',
            '150 Min.',
            '180 Min.',
          ],
        },

        dropdowns: {
          appointmentDuration: false,
        },

      }
    },
    methods: {
      submitLead(isCanceled = false) {

        if (this.isLoading || this.isLoadingCancel) {
          return;
        }

        if ( !isCanceled ) {
          if ( !this.validateAppointmentForm() ) {
            return;
          }
        }

        if ( isCanceled ) {
          this.isLoadingCancel = true;
        } else {
          this.isLoading = true;
        }

        let dataToSend = {
          'activityId': this.activityId,
          'tempReservationId': this.reservationId,
          'notaryStartDate': this.appointment.dateTime.value,
          'notaryDuration': this.appointment.duration.value,
          'editNotaryAppointment': this.editMode,
          'isCanceled': isCanceled,
          'customerNotification': this.appointment.customerNotification,
        };

        axios.post(this.globalApiBaseUrl + '/canban/createNotaryAppointment', dataToSend)
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
              this.isLoadingCancel = false;
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
      closeDropdowns() {
        for (const index in this.dropdowns) {
          this.dropdowns[index] = false;
        }
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
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
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
      removeMultiFilterSelection(clickedText, field) {
        const index = this.$data['searchCriteria'][field].value.indexOf(clickedText);
        if (index !== -1) {
          this.$data['searchCriteria'][field].value.splice(index, 1);
        }

        if ( this.$data['searchCriteria'][field].value.length === 0 ){
          this.$data['searchCriteria'][field].value = ['Alle'];
        }
      },
      dropdownClick(field, clickedText) {
        this.searchInputDistrict = '';
        if ( field === 'district' ){
          if (this.$data['searchCriteria'][field].value.includes(clickedText)){
            this.removeMultiFilterSelection(clickedText, 'district');
          } else if (clickedText === 'Alle') {
            this.$data['searchCriteria'][field].value = ['Alle'];
          } else {
            if ( Array.isArray(this.$data['searchCriteria'][field].value) ){
              this.$data['searchCriteria'][field].value.push(clickedText);
            } else {
              let existingDistricts = [clickedText];
              let currentVal = this.$data['searchCriteria'][field].value;
              Object.entries(this.dropdownContents.districtWithParts).forEach(([key, field]) => {
                 if ( currentVal.includes(key) ){
                   existingDistricts.push(key);
                  }
              });
              this.$data['searchCriteria'][field].value = existingDistricts;
            }
            this.$data['searchCriteria'][field].value = [...new Set(this.$data['searchCriteria'][field].value)];
            this.removeMultiFilterSelection('Alle', 'district');
          }
        } else {
          this.$data['searchCriteria'][field].value = clickedText;
        }
        this.closeDropdowns();
      },
      dropdownClickAppointment(field, clickedText) {
        this.$data['appointment'][field].value = clickedText;
        this.closeDropdowns();
      },
      validateSubmit() {
        let validationChecker = true;
        Object.entries(this.searchCriteria).forEach(([key, field]) => {
          if ( typeof field.required !== 'undefined' && field.required ){
            if ( field.value === undefined || field.value === ''){
              this.searchCriteria[key].valid = false;
              validationChecker = false;
            } else {
              this.searchCriteria[key].valid = true;
            }
          }
        });
        return validationChecker;
      },
      checkIfIsKGCompany() {
        if ( this.activityId.includes('kg_') ){
          return true;
        }
        return false;
      },
      checkIfIsCityAlicanteSelected() {
        if ( this.searchCriteria.city.value === 'Alicante' ){
          return true;
        }
        return false;
      },
      searchDistrictVal(event) {

        let inputVal = event.target.value;

        Object.entries(this.dropdownContents.districtWithParts).forEach(([key, field]) => {
          inputVal = inputVal.replaceAll(key, '');
          inputVal = inputVal.replaceAll(',', '');
          // remove all whitespaces before first character
          inputVal = inputVal.replace(/^\s+/, '');
        });

        this.searchInputDistrict = inputVal;
      }
    },
    watch: {
      'searchCriteria.maxBudget.value': function(val) {
        this.searchCriteria.maxBudget.value = this.searchCriteria.maxBudget.value.replaceAll('.', '')
      },
      'searchCriteria.kindOfFinance.value': function(val) {
        this.searchCriteria.approvedFinance.value = '';
        this.searchCriteria.equityCapital.value = '';
      },
      'searchCriteria.city.value': function(val) {
        if ( val === 'Alicante' ) {
          this.searchCriteria.buyExperience.required = false;
          this.searchCriteria.typeOfUse.required = false;
          this.searchCriteria.rentStatus.required = false;
          this.searchCriteria.roomsTo.required = false;
          this.searchCriteria.squareMetresTo.required = false;
          this.searchCriteria.squareMetresFrom.required = false;
          this.searchCriteria.timeOfPurchase.required = true;
        } else {
          this.searchCriteria.buyExperience.required = true;
          this.searchCriteria.typeOfUse.required = true;
          this.searchCriteria.rentStatus.required = true;
          this.searchCriteria.roomsTo.required = true;
          this.searchCriteria.squareMetresTo.required = true;
          this.searchCriteria.squareMetresFrom.required = true;
          this.searchCriteria.timeOfPurchase.required = false;
          this.searchCriteria.timeOfPurchase.value = '';
        }
        this.searchCriteria.buyExperience.valid = true;
        this.searchCriteria.typeOfUse.valid = true;
        this.searchCriteria.rentStatus.valid = true;
        this.searchCriteria.roomsTo.valid = true;
        this.searchCriteria.squareMetresTo.valid = true;
        this.searchCriteria.squareMetresFrom.valid = true;
        this.searchCriteria.timeOfPurchase.valid = true;
        this.searchCriteria.district.value = ['Alle'];
      }
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Notartermin {{ editMode ? 'bearbeiten' : 'erstellen' }}</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form>

          <div class="field-wrapper two-col">
             <span :class="{'invalid': !appointment.dateTime.valid, 'valid': appointment.dateTime.valid }">
                <InputField inputType="datetime-local" inputplaceholder="" inputName="appointmentTime" :inputValue="appointment.dateTime.value" v-model="appointment.dateTime.value"></InputField>
                <label class="ph">Datum und Uhrzeit</label>
            </span>
            <span :class="{'invalid': !appointment.duration.valid, 'valid': appointment.duration.valid }">
              <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="appointment.duration.value" v-model="appointment.duration.value" @focus="setDropdownTop($event)" @click="dropdowns.appointmentDuration = !dropdowns.appointmentDuration" @click.stop=""></InputField>
            <label class="ph">Termindauer</label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.appointmentDuration, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.appointmentDuration" :filterFor="appointment.duration.value" @dropdown-item-clicked="dropdownClickAppointment('duration', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper">
             <span>
                <input class="checkbox field" type="checkbox" id="customerNotification" :value="appointment.customerNotification" v-model="appointment.customerNotification">
                <label for="customerNotification">Kunden benachrichtigen</label>
            </span>
          </div>

        </form>

        <div class="actions">
          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button type="report" @click="submitLead(false)">Notartermin {{ editMode ? 'bearbeiten' : 'erstellen' }} <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>

          <div class="seperator" v-if="editMode && parseInt(tempReservationStatus) >= 1">
            <span>
              ODER
            </span>
          </div>

          <Button type="delete full" style="flex-basis: 100%" @click="submitLead(true)" v-if="editMode && parseInt(tempReservationStatus) >= 1">Notartermin absagen<AnimateCircleIcon v-if="this.isLoadingCancel"></AnimateCircleIcon></Button>

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

.features label {
  flex-basis: 33%;
}

.checkbox-wrapper {
  display: flex;
}

.checkbox-wrapper input{
  flex-basis: auto;
  margin-right: 15px;
}

.features label:first-of-type {
  margin-bottom: 10px;
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

#customerNotification + [for="customerNotification"] {
  top: -5px;
  font-size: 14px !important;
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
