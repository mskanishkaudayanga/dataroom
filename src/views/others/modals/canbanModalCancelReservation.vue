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
  import {leadsStore} from "@/stores/leadsStore";

  export default {
    name: "canbanModalCancelReservation",
    components: {
      TextAreaField,
      AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.id,
        reservationId: this.$route.params.reservationId,
        deleteProcess: false,

        apiResponseCockpitReservation: {},
        apiResponseCockpitReservationRealEstates: {},

        cancelReason: {
          required: true,
          value: '',
          valid: true,
        },

        cancelFreeText: {
          required: false,
          value: '',
          valid: true,
        },

        leadHandling: {
          required: true,
          value: 'true',
          valid: true,
        },

        realEstateDataObject: [],

        dropdownsContent: {
          cancelReasons: {
            'Finanzierung nicht möglich': 'Finanzierung nicht möglich',
            'Finanzierungsrate für Kunden zu teuer': 'Finanzierungsrate für Kunden zu teuer',
            'Für anderes Objekt bei Best Place entschieden': 'Für anderes Objekt bei Best Place entschieden',
            'Für Konkurrenzprodukt entschieden': 'Für Konkurrenzprodukt entschieden',
            'Kaufpreis zu hoch': 'Kaufpreis zu hoch',
            'Immobilie unpassend': 'Immobilie unpassend',
            'Lage unpassend': 'Lage unpassend',
            'Absage von Best Place': 'Absage von Best Place',
            'Sonstiges': 'Sonstiges',
            'Unbekannt': 'Unbekannt'
          },
        },

        dropdowns: {
          reason: false,
          cancelReason: false,
        },

        dropdownRelativePosition: false,

      }
    },
    methods: {
      submitReservationCancel() {

        if ( this.activityId.includes('kg_') || parseInt(this.apiResponseCockpitReservation.reservation_status) < 4 ){
          if ( this.cancelReason.value === '' || this.cancelReason.value === false ) {
            this.cancelReason.valid = false;
            return;
          } else {
            this.cancelReason.valid = true;
          }

          if ( this.cancelReason.value === 'Sonstiges' && (this.cancelFreeText.value === '' || typeof this.cancelFreeText.value === 'undefined') ) {
            this.cancelFreeText.valid = false;
            return;
          } else {
            this.cancelFreeText.valid = true;
          }
        } else {

          let validator = false;
          Object.entries(this.realEstateDataObject).forEach(([index, value]) => {
            if (value.selected) {
              validator = true;
              return;
            }
          });

          Object.entries(this.realEstateDataObject).forEach(([index, value]) => {
            if ( value.selected && value.reason !== '' ) {
              this.realEstateDataObject[index].reasonValid = true;
            } else {
              this.realEstateDataObject[index].reasonValid = false;
            }
          });

          if (!validator) {
            return;
          }

        }

        if ( !this.deleteProcess ) {
          this.deleteProcess = true;
          return;
        }

        if (this.isLoading) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          'activityId': this.activityId,
          'cancelReason': this.cancelReason.value,
          'reservationId': this.reservationId,
          'realEstatesData': this.realEstateDataObject
        };

        if ( this.cancelReason.value === 'Für anderes Objekt bei Best Place entschieden' ) {
          dataToSend['markLeadAsUnqualified'] = this.leadHandling.value;
        }

        if ( this.cancelReason.value === 'Absage von Best Place' || this.cancelReason.value === 'Für Konkurrenzprodukt entschieden' ) {
          dataToSend['markLeadAsUnqualified'] = false;
        }

        if ( this.cancelReason.value === 'Sonstiges' ) {
          dataToSend['cancelFreeText'] = this.cancelFreeText.value;
        }

        Object.entries(this.realEstateDataObject).forEach(([index, value]) => {
          if ( value.selected && value.reason !== '' ) {
            if ( value.reason === 'Absage von Best Place' || value.reason === 'Für Konkurrenzprodukt entschieden' ){
              dataToSend['markLeadAsUnqualified'] = false;
            }
          }
        });

        Object.entries(this.realEstateDataObject).forEach(([index, value]) => {
          if ( value.selected && value.reason !== '' ) {
            if ( value.reason === 'Für anderes Objekt bei Best Place entschieden'){
              dataToSend['markLeadAsUnqualified'] = this.leadHandling.value;
            }
          }
        });

        axios.post(this.globalApiBaseUrl + '/canban/cancelReservation', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Reservierung erfolgreich bearbeitet');
                  } else {
                    this.notificationBannerInit('warning', 'Reservierung konnte nicht bearbeitet werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Reservierung konnte nicht bearbeitet werden');
                }
            ).finally(
              () => {
                this.isLoading = false;
            })
      },
      getSingleReservationRealEstatesOfCockpit() {

        /**
         * Only for living reservations
         */
        if ( this.activityId.includes('kg_') ) {
          return;
        }

        let dataToSend = JSON.stringify({
          "reservationId": this.reservationId,
        });

        axios.post(this.globalApiBaseUrl + '/reservations/getReservationsRealEstate', dataToSend)
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  this.apiResponseCockpitReservationRealEstates = response.data.response;
                  this.createRealEstateObject();
                }
              }
          ).catch(
              (error) => {
                console.log(error);
              }
          )
      },
      getSingleReservationOfCockpit() {

        /**
         * Only for living reservations
         */
        if ( this.activityId.includes('kg_') ) {
          return;
        }

        axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservation?reservationId='+ this.reservationId)
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  this.apiResponseCockpitReservation = response.data.response[0];
                }
              }
          ).catch(
              (error) => {
                console.log(error);
              }
          )
      },
      createRealEstateObject() {
        for (let step = 0; step <= this.apiResponseCockpitReservationRealEstates.length - 1; step++) {
          this.dropdowns['dynamic-'+step] = false;

          this.realEstateDataObject.push({
            selected: false,
            immoNr: this.apiResponseCockpitReservationRealEstates[step].estate_nr,
            immoSysId: this.apiResponseCockpitReservationRealEstates[step].real_estate_sys_id,
            freeTextValid: true,
            freeText: '',
            reasonValid: true,
            reason: '',
          });
        }
      },
      closeDropdowns() {
        for (const index in this.dropdowns) {
          this.dropdowns[index] = false;
        }
      },
      resetData() {
        Object.assign(this.$data, this.$options.data.call(this));
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
        if ( eleName.includes('Dynamic') ) {
          if ( !this.isInViewport(this.$refs['dropdown'+eleName][0].$el) ) {
            this.dropdownRelativePosition = true;
            this.$refs['dropdown'+eleName].$el.style.top = '0px';
          } else {
            this.dropdownRelativePosition = false;
          }
        } else {
          if ( !this.isInViewport(this.$refs['dropdown'+eleName].$el) ) {
            this.dropdownRelativePosition = true;
            this.$refs['dropdown'+eleName].$el.style.top = '0px';
          } else {
            this.dropdownRelativePosition = false;
          }
        }

      },
      dropdownClick(field, clickedText, index = false) {
        if ( index === false ) {
          this.$data[field].value = clickedText;
        } else {
          this.$data[field][index].reason = clickedText;
        }
        this.closeDropdowns();
      },
    },
    computed: {
      checkForHoldLeadForLiving() {
        if ( this.activityId.includes('living') ) {
          let validator = true;
          let reasonValidator = false;
          Object.entries(this.realEstateDataObject).forEach(([index, value]) => {
            if ( !value.selected ) {
              validator = false;
            }
            if ( value.reason === 'Für anderes Objekt bei Best Place entschieden' ) {
              reasonValidator = true;
            }
          });

          if ( validator && reasonValidator ) {
            return true;
          } else {
            return false;
          }
          }
      }
    },
    mounted() {
      this.getSingleReservationRealEstatesOfCockpit();
      this.getSingleReservationOfCockpit();
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Reservierung bearbeiten</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <div v-if="activityId.includes('kg_') || parseInt(apiResponseCockpitReservation.reservation_status) < 4">
          <div :class="{'invalid': !this.cancelReason.valid, 'valid': this.cancelReason.valid}">

                <InputField class="dropdown-input" inputType="text" inputName="CancelReason"
                            :inputValue="(cancelReason.value === false || cancelReason.value === '' || typeof cancelReason.value === 'undefined') ? 'Grund auswählen' : cancelReason.value"
                            :class="{'invalid': !cancelReason.valid }"
                            @click="dropdowns.cancelReason = true"
                            @focus="setDropdownTop($event)"
                            @click.stop=""></InputField>
                <label class="ph">Grund der Stornierung</label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown :ref="'dropdownCancelReason'"
                  :renderingObject="dropdownsContent.cancelReasons"
                  :class="{active: dropdowns.cancelReason, relative: dropdownRelativePosition}"
                  @dropdown-item-clicked="dropdownClick('cancelReason', $event)"
                  @click.stop=""
                  :filterFor="cancelReason.value"></Dropdown>
          </div>

          <div class="field-wrapper" style="margin-top: 25px;" v-if="cancelReason.value === 'Sonstiges'" :class="{'invalid': !this.cancelFreeText.valid, 'valid': this.cancelFreeText.valid}">
            <TextAreaField inputName="leadmsg" :inputVal="cancelFreeText.value" v-model="cancelFreeText.value"></TextAreaField>
            <label class="ph">Bemerkung</label>
          </div>
        </div>
        <div v-else-if="realEstateDataObject.length > 0">

          <div v-for="(val, index) in realEstateDataObject">
            <label :for="'realEstate-'+index" style="cursor:pointer; display: inline-block; margin-bottom: 25px;">
              <InputField inputType="checkbox" :id="'realEstate-'+index" :inputName="'realEstate-'+index" :inputValue="realEstateDataObject[index].selected"
                          v-model="realEstateDataObject[index].selected"></InputField>
              {{val.immoNr}}
            </label>
            <div :class="{'invalid': !realEstateDataObject[index].reasonValid, 'valid': realEstateDataObject[index].reasonValid}" style="margin-bottom: 25px;" v-if="realEstateDataObject[index].selected">

              <InputField class="dropdown-input" inputType="text" :inputName="'Dynamic-'+index"
                          :inputValue="(realEstateDataObject[index].reason === false || realEstateDataObject[index].reason === '' || typeof realEstateDataObject[index].reason === 'undefined') ? 'Grund auswählen' : realEstateDataObject[index].reason"
                          :class="{'invalid': !realEstateDataObject[index].reasonValid }"
                          @click="dropdowns['dynamic-'+index] = true"
                          @focus="setDropdownTop($event)"
                          @click.stop=""></InputField>
              <label class="ph">Grund der Stornierung</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown :ref="'dropdownDynamic-'+index"
                        :renderingObject="dropdownsContent.cancelReasons"
                        :class="{active: dropdowns['dynamic-'+index], relative: dropdownRelativePosition}"
                        @dropdown-item-clicked="dropdownClick('realEstateDataObject', $event, index)"
                        @click.stop=""
                        :filterFor="realEstateDataObject[index].reason"></Dropdown>
            </div>

            <div class="field-wrapper" v-if="realEstateDataObject[index].reason === 'Sonstiges' && realEstateDataObject[index].selected" :class="{'invalid': !realEstateDataObject[index].freeTextValid, 'valid': realEstateDataObject[index].freeTextValid}">
              <TextAreaField inputName="leadmsg" :inputVal="realEstateDataObject[index].freeText" v-model="realEstateDataObject[index].freeText"></TextAreaField>
              <label class="ph">Bemerkung</label>
            </div>
          </div>

        </div>

        <div class="field-wrapper radios" style="margin-top: 25px;" v-if="cancelReason.value === 'Für anderes Objekt bei Best Place entschieden' || checkForHoldLeadForLiving">
          <label for="holdLeadYes" class="radio-wrapper">
            <InputField inputType="radio" id="holdLeadYes" inputName="holdLeadYes" value="true" :inputValue="leadHandling.value" v-model="leadHandling.value"></InputField>
            Lead behalten
          </label>
          <label for="holdLeadNo" class="radio-wrapper">
            <InputField inputType="radio" id="holdLeadNo" inputName="holdLeadNo" value="false" :inputValue="leadHandling.value" v-model="leadHandling.value"></InputField>
            Lead entfernen
          </label>
        </div>

        <div class="actions">
          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button :type="!deleteProcess ? 'edit' : 'report'" @click="submitReservationCancel">Stornieren <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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

.field-wrapper {
  display: flex;
  justify-content: center;
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

.invalid textarea {
  border-left: 5px solid red;
}

.option-wrapper .checkbox {
  flex-basis: auto;
  top: 0;
  margin-top: 0;
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
