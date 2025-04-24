<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";

  export default {
    name: "canbanModalDeleteAppointment",
    components: {AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.id,
        deleteProcess: false,

        typeOfDelete: 'denieAppointment',

        denieReason: {
          required: true,
          value: '',
          valid: true,
        },

        dropdownContents: {
          reason: [
            'Kunde nicht erreichbar',
            'Kunde hat kein Interesse mehr',
            'Kunde ist Mietinteressent',
            'Kunde hat unrealistische Vorstellungen',
            'Keine adäquate Leerwohnung verfügbar',
            'Einheit nicht mehr verfügbar',
            'Kunde hat kein Interesse und möchte aus der Datenbank gelöscht werden'
          ],
        },

        dropdowns: {
          reason: false,
        },

        dropdownRelativePosition: false,

      }
    },
    methods: {
      submitLeadDelete() {

        if ( this.typeOfDelete === 'denieLead' && (typeof this.denieReason.value === 'undefined' || this.denieReason.value === '') ) {
          this.denieReason.valid = false;
          return false;
        } else {
          this.denieReason.valid = true;
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
        };

        if ( this.typeOfDelete === 'denieLead' ) {
          dataToSend['denieReason'] = this.denieReason.value;
        }

        axios.post(this.globalApiBaseUrl + '/canban/denieAppointment', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Lead erfolgreich geändert');
                  } else {
                    this.notificationBannerInit('warning', 'Lead konnte nicht geändert werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Lead konnte nicht geändert werden');
                }
            ).finally(
              () => {
                this.isLoading = false;
            })
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
        this.deleteProcess = false;
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
      dropdownClick(field, clickedText) {
        this.$data[field].value = clickedText;
        this.closeDropdowns();
      },
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Lead bearbeiten</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <div class="field-wrapper radios" style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: solid 1px var(--light-light-gray)">
          <label for="typeOfDelete" class="radio-wrapper">
            <InputField inputType="radio" id="typeOfDelete" inputName="typeOfDelete" value="denieAppointment" :inputValue="typeOfDelete" v-model="typeOfDelete"></InputField>
            Termin absagen
          </label>
          <label for="typeOfDelete1" class="radio-wrapper">
            <InputField inputType="radio" id="typeOfDelete1" inputName="typeOfDelete1" value="denieLead" :inputValue="typeOfDelete" v-model="typeOfDelete"></InputField>
            Lead entfernen
          </label>
        </div>

        <div class="field-wrapper" :class="{'invalid': !denieReason.valid, 'valid': denieReason.valid }" v-if="typeOfDelete === 'denieLead'">
            <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="denieReason.value" v-model="denieReason.value" @focus="setDropdownTop($event)" @click="dropdowns.reason = !dropdowns.reason" @click.stop=""></InputField>
            <label class="ph">Grund</label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown ref="dropdownSource" :class="{active: dropdowns.reason, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.reason" :filterFor="denieReason.value" @dropdown-item-clicked="dropdownClick('denieReason', $event)" @click.stop=""></Dropdown>
        </div>

        <div class="actions">
          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button :type="!deleteProcess ? 'edit' : 'report'" @click="submitLeadDelete">{{ !deleteProcess ? (typeOfDelete === 'denieAppointment' ? 'Termin absagen' : 'Lead entfernen') : 'Bestätigen' }} <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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
