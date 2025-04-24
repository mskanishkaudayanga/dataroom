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

  export default {
    name: "canbanModalEditCustomerData",
    components: {
      AlertMessage,
      Button, TextAreaField, DropdownArrow, Dropdown, AsterixMarkIcon, InputField, AnimateCircleIcon, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingCustomer: false,
        activityId: this.$route.params.id,
        customerSysId: this.$route.params.customerSysId,

        errorMsg: '',

        apiUsersResponse: [],

        leadForm: {
          language: '',
          country: '',
          customerNr: '',

          mail: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          salutation: {
            required: false,
            valid: true,
            value: 'Herr',
            label: {
              de: ''
            }
          },
          title: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          firstname: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          lastname: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          phone: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          streetAndNr: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          zipcode: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          city: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
        },

        dropdownsShow: {
          showLanguageDropdown: false,
          showCountryDropdown: false,
        },

        dropdownContents: {
          language: [
            'Deutsch',
            'Englisch',
            'Französisch',
            'Niederländisch',
            'Spanisch',
            'Polnisch',
            'Ukrainisch'
          ]
        },

        dropdownRelativePosition: false,
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
        this.$emit('reloadCustomerData', this.customerSysId);
      },
      searchCustomers() {

        this.isLoadingCustomer = true;

        let company = 'kg';
        if ( this.activityId.includes('living_') ) {
          company = 'living';
        }

        axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerDataBySysId?company='+company+'&system_id='+this.customerSysId)
          .then(
              (response) => {
                console.log(response);
                if ( response.data.status === 200 ) {
                  this.apiUsersResponse = response.data.response;
                  this.updateCustomer(this.apiUsersResponse);
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
              this.isLoadingCustomer = false;
            })
      },
      submitLead() {

        if (this.isLoading ) {
          return;
        }

        if ( this.leadForm.mail.value === '' || typeof this.leadForm.mail.value === 'undefined' || typeof this.leadForm.mail.value === null || !this.isValidEmail(this.leadForm.mail.value) ) {
          this.leadForm.mail.valid = false;
          return;
        } else {
          this.leadForm.mail.valid = true;
        }

        this.isLoading = true;

        let company = 'kg';
        if ( this.activityId.includes('living_') ) {
          company = 'living';
        }

        let dataToSend = {};

        dataToSend['client_company'] = company;

        dataToSend['client_mail'] = this.leadForm.mail.value;

        if (this.leadForm.salutation.value !== '') {
          dataToSend['client_salutation'] = this.leadForm.salutation.value;
        }

        if (this.leadForm.title.value !== '') {
          dataToSend['client_title'] = this.leadForm.title.value;
        }

        if (this.leadForm.firstname.value !== '') {
          dataToSend['client_first_name'] = this.leadForm.firstname.value;
        }

        if (this.leadForm.lastname.value !== '') {
          dataToSend['client_last_name'] = this.leadForm.lastname.value;
        }

        if (this.leadForm.phone.value !== '') {
          dataToSend['client_phone'] = this.leadForm.phone.value;
        }

        if (this.leadForm.customerNr !== '') {
          dataToSend['client_id'] = this.leadForm.customerNr;
        }

        if (this.leadForm.language === 'Französisch') {
          dataToSend['client_language'] = 'FRA';
        } else if (this.leadForm.language === 'Englisch') {
          dataToSend['client_language'] = 'ENG';
        } else if (this.leadForm.language === 'Niederländisch') {
          dataToSend['client_language'] = 'NLD';
        } else if (this.leadForm.language === 'Spanisch') {
          dataToSend['client_language'] = 'ESP';
        } else if (this.leadForm.language === 'Polnisch') {
          dataToSend['client_language'] = 'POL';
        } else if (this.leadForm.language === 'Ukrainisch') {
          dataToSend['client_language'] = 'CHE';
        } else {
          dataToSend['client_language'] = 'DEU';
        }

        if (this.leadForm.streetAndNr.value !== '') {
          dataToSend['client_address'] = this.leadForm.streetAndNr.value;
        }

        if (this.leadForm.zipcode.value !== '') {
          dataToSend['client_postal_code'] = this.leadForm.zipcode.value;
        }

        if (this.leadForm.city.value !== '') {
          dataToSend['client_city'] = this.leadForm.city.value;
        }

        if (this.leadForm.country.value !== '') {
          dataToSend['client_country'] = this.leadForm.country;
        }

        axios.post(this.globalApiBaseUrl + '/onoffice/sendCustomerData', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.submitLeadDBUpdate();
                  } else {
                    this.closeModal();
                    this.notificationBannerInit('warning', 'Es ist ein fehler aufgetreten');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Es ist ein fehler aufgetreten');
                }
            )
      },
      submitLeadDBUpdate() {

        let dataToSend = {};
        dataToSend['customerSysId'] = this.customerSysId;

        let completeName = this.leadForm.salutation.value;
        if ( this.leadForm.firstname.value !== '' ) {
          completeName += ' '+this.leadForm.firstname.value;
        }
        if ( this.leadForm.lastname.value !== '' ) {
          completeName += ' '+this.leadForm.lastname.value;
        }

        dataToSend['completeNameWithSalutation'] = completeName;

        axios.post(this.globalApiBaseUrl + '/canban/updateCustomerDataInLV', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Kundendaten aktualisiert');
                  } else {
                    this.closeModal();
                    this.notificationBannerInit('warning', 'Es ist ein fehler aufgetreten');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Es ist ein fehler aufgetreten');
                }
            )
      },
      dropdownClick(field, clickedText) {
        if ( field === 'salutation' ) {
          this.leadForm[field].value = clickedText;

        } else {
          this.leadForm[field] = clickedText;
        }
        this.closeDropdowns();
      },
      updateCustomer(data) {

        if (typeof data.client_id !== 'undefined' && data.client_id !== '') {
          this.leadForm.customerNr = data.client_id
        }
        if (typeof data.client_salutation !== 'undefined' && data.client_salutation !== '') {
          this.leadForm.salutation.value = data.client_salutation
        }
        if (typeof data.client_email !== 'undefined' && data.client_email !== '') {
          this.leadForm.mail.value = data.client_email
        }
        if (typeof data.client_first_name !== 'undefined' && data.client_first_name !== '') {
          this.leadForm.firstname.value = data.client_first_name
        }
        if (typeof data.client_last_name !== 'undefined' && data.client_last_name !== '') {
          this.leadForm.lastname.value = data.client_last_name
        }
        if (typeof data.client_title !== 'undefined' && data.client_title !== '') {
          this.leadForm.title.value = data.client_title
        }
        if (typeof data.client_phone !== 'undefined' && data.client_phone !== '') {
          this.leadForm.phone.value = data.client_phone
        }
        if (typeof data.client_language !== 'undefined' && data.client_language !== '') {
          if ( data.client_language === 'ENG' ) {
            this.leadForm.language = 'Englisch';
          } else if ( data.client_language === 'FRA' ) {
            this.leadForm.language = 'Französisch';
          } else if ( data.client_language === 'NLD' ) {
            this.leadForm.language = 'Niederländisch';
          } else if ( data.client_language === 'ESP' ) {
            this.leadForm.language = 'Spanisch';
          } else if ( data.client_language === 'CHE' ) {
            this.leadForm.language = 'Ukrainisch';
          } else {
            this.leadForm.language = 'Deutsch';
          }
        }

        if (typeof data.client_address !== 'undefined' && data.client_address !== '') {
          this.leadForm.streetAndNr.value = data.client_address
        }
        if (typeof data.client_postal_code !== 'undefined' && data.client_postal_code !== '') {
          this.leadForm.zipcode.value = data.client_postal_code
        }
        if (typeof data.client_city !== 'undefined' && data.client_city !== '') {
          this.leadForm.city.value = data.client_city
        }
        if (typeof data.client_country !== 'undefined' && data.client_country !== '') {
          if ( data.client_country.length <= 3 ) {
            let countryListFlipped = this.countryList
            this.leadForm.country = countryListFlipped[data.client_country]
          } else {
            this.leadForm.country = data.client_country
          }
        }

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
    },
    mounted() {
      this.searchCustomers();
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Kundendaten bearbeiten</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form class="lead-data">

          <div class="title-seperator"><span>Kundendaten</span></div>

          <div class="field-wrapper two-col">
            <span>
                <InputField class="dropdown-input" ref="inputSalutation" inputType="text" inputPlaceholder="Anrede" inputName="Salutation" :inputValue="leadForm.salutation.value" v-model="leadForm.salutation.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showSalutationDropdown = true" @click.stop=""></InputField>
                <label class="ph">Anrede</label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownSalutation" :class="{active: dropdownsShow.showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.salutationList" :filterFor="leadForm.salutation.value" @dropdown-item-clicked="dropdownClick('salutation', $event)" @click.stop=""></Dropdown>
              </span>
            <span>
              <InputField inputType="text" inputName="CustomerTitle" :inputValue="leadForm.title.value" v-model="leadForm.title.value"></InputField>
              <label class="ph">Titel</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField inputType="text" inputName="Firstname" :inputValue="leadForm.firstname.value" v-model="leadForm.firstname.value"></InputField>
              <label class="ph">Vorname</label>
            </span>
            <span :class="{'invalid': !leadForm.lastname.valid, 'valid': leadForm.lastname.valid}">
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.lastname.value" v-model="leadForm.lastname.value"></InputField>
              <label class="ph">Nachname</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField inputType="text" inputName="Firstname" :inputValue="leadForm.phone.value" v-model="leadForm.phone.value"></InputField>
              <label class="ph">Telefon</label>
            </span>
            <span :class="{'invalid': !leadForm.mail.valid, 'valid': leadForm.mail.valid}">
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.mail.value" v-model="leadForm.mail.value"></InputField>
              <label class="ph">E-Mail <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="leadForm.language" v-model="leadForm.language" @focus="setDropdownTop($event)" @click="dropdownsShow.showLanguageDropdown = true" @click.stop=""></InputField>
              <label class="ph">Sprache</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownLanguage" :class="{active: dropdownsShow.showLanguageDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.language" :filterFor="leadForm.language" @dropdown-item-clicked="dropdownClick('language', $event)" @click.stop=""></Dropdown>
            </span>
            <span>
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.streetAndNr.value" v-model="leadForm.streetAndNr.value"></InputField>
              <label class="ph">Straße & Hausnr. </label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.zipcode.value" v-model="leadForm.zipcode.value"></InputField>
              <label class="ph">PLZ</label>
            </span>
            <span>
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.city.value" v-model="leadForm.city.value"></InputField>
              <label class="ph">Ort</label>
            </span>
          </div>

          <div class="field-wrapper">
            <span>
              <InputField class="dropdown-input" ref="inputCountry" inputType="text" inputName="Country" :inputValue="leadForm.country" v-model="leadForm.country" @focus="setDropdownTop($event)" @click="dropdownsShow.showCountryDropdown = true" @click.stop=""></InputField>
              <label class="ph">Land</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownCountry" :class="{active: dropdownsShow.showCountryDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.countryList" :filterFor="leadForm.country" @dropdown-item-clicked="dropdownClick('country', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

        </form>

        <div class="error-message" v-if="errorMsg">
          <AlertMessage :alertText="errorMsg" alertStatus="warning"></AlertMessage>
        </div>

        <div class="actions">

          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button type="report" @click="submitLead" data-cy="submit">Bearbeiten <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>

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
