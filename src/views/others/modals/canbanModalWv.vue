<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";

  export default {
    name: "canbanModalWv",
    components: {
      AsterixMarkIcon,
      DropdownArrow, Dropdown, TextAreaField, AnimateCircleIcon, Button, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.id,
        typeOf: this.$route.params.type,
        selectedTime: {
          value: '',
          valid: true,
        },
        selectedCustomTime: {
          value: '',
          valid: true,
        },

        dropdownsEditUploads: {
          showAgentsDropdown: false,
        },
        dropdownRelativePosition: false,

        submitProcess: false,

        timeToSelect: [
          'Nach 1 Tag',
          'Nach 3 Tagen',
          'Nach 5 Tagen',
          'Nach 7 Tagen',
          'Nach 14 Tagen',
          'Festes Datum',
        ],
      }
    },
    methods: {
      closeDropdowns() {
        for (const index in this.dropdownsEditUploads) {
          this.dropdownsEditUploads[index] = false;
        }
        for (const index in this.dropdownsCancelReason) {
          this.dropdownsCancelReason[index] = false;
        }
      },
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
      closeModal(){
        this.$router.push({name: 'canbanTool'})
      },
      checkForValidation() {

        let validation = true;
        if ( typeof this.selectedTime.value !== undefined && this.selectedTime.value !== '' ) {
          this.selectedTime.valid = true;
        } else {
          this.selectedTime.valid = false;
          validation = false;
        }

        if ( this.selectedTime.value === 'Festes Datum' ) {
          if (  typeof this.selectedCustomTime.value !== undefined && this.selectedCustomTime.value !== '' ) {
            this.selectedCustomTime.valid = true;
          } else {
            this.selectedCustomTime.valid = false;
            validation = false;
          }
        }

        return validation;

      },
      submitLead() {

        if ( !this.checkForValidation() ) {
          return;
        }

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let leadData = {
          "activityId": this.activityId,
          "typeOfWv": this.typeOf,
          "selectedTime": this.selectedTime.value,
          "selectedCustomTime": this.selectedCustomTime.value,
        };

        axios.post(this.globalApiBaseUrl + '/canban/leadToWV', leadData)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Lead erfolgreich auf Wiedervorlage gelegt');
                  } else {
                    this.closeModal();
                    this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                }
            ).finally(
              () => {
                this.isLoading = false;
            })

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
      dropdownClick(field, clickedText) {
        this.$data[field].value = clickedText;
        this.closeDropdowns();
      },
    },
    watch: {
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Lead in Wiedervorlage</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form class="lead-data">

          <div style="margin-bottom: 25px">Wähle eine Zeit aus, bis wann der Lead auf Wiedervorlage gelegt werden soll. Nach der angegebenen Zeit springt der Lead automatisch zurück.</div>
          <div class="field-wrapper" :class="{'invalid': !selectedTime.valid, 'valid': selectedTime.valid}">
            <InputField class="dropdown-input" ref="Agent" inputType="text" inputPlaceholder="Agent" inputName="Agent" :inputValue="selectedTime.value" v-model="selectedTime.value" @focus="setDropdownTop($event)" @click="dropdownsEditUploads.showAgentsDropdown = !dropdownsEditUploads.showAgentsDropdown" @click.stop=""></InputField>
            <label class="ph">Zeit auswählen <AsterixMarkIcon></AsterixMarkIcon></label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown ref="dropdownAgent" :class="{active: dropdownsEditUploads.showAgentsDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="timeToSelect" :filterFor="selectedTime.value" @dropdown-item-clicked="dropdownClick('selectedTime', $event)" @click.stop=""></Dropdown>
          </div>

          <div class="field-wrapper" v-if="selectedTime.value === 'Festes Datum'" :class="{'invalid': !selectedCustomTime.valid, 'valid': selectedCustomTime.valid}">
            <InputField class="dropdown-input" ref="customTime" inputType="date" inputPlaceholder="customTime" inputName="customTime" :inputValue="selectedCustomTime.value" v-model="selectedCustomTime.value"></InputField>
            <label class="ph">Festes Datum <AsterixMarkIcon></AsterixMarkIcon></label>
          </div>

        </form>

        <div class="actions">
          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button type="report" @click="submitLead">Auf Wiedervorlage <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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

.radio-wrapper {
  cursor: pointer;
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

.field-wrapper.two-col {
  display: flex;
  justify-content: space-between;
}

.field-wrapper > span {
  flex-basis: 48%;
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
