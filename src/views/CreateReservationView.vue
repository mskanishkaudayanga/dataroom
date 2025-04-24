<script>
  import axios from "axios";
  import CardTitle from "../components/card/CardTitle.vue";
  import CloseIcon from "../components/icons/icon-close.vue";
  import SearchIcon from "../components/icons/icon-search.vue";
  import AnimateCircleIcon from "../components/icons/icon-animate-loading-circle.vue";
  import RealEstateList from "../components/card/RealEstateList.vue";
  import Button from "../components/buttons/button.vue";
  import CreateReservationProgressBar from "../components/card/CreateReservationProgressBar.vue";
  import InputField from "../components/forms/InputField.vue";
  import Dropdown from "../components/forms/Dropdown.vue";
  import DropdownArrow from "../components/icons/icon-dropdown.vue";
  import AlertMessage from "../components/card/AlertMessage.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Seperator from "@/components/utility/Seperator.vue";

  export default {
    name: "createReservationsModal",
    components: {
      Seperator,
      AsterixMarkIcon,
      AlertMessage, InputField, Button, RealEstateList, CardTitle, CloseIcon, CreateReservationProgressBar, Dropdown, SearchIcon, AnimateCircleIcon, DropdownArrow},
    data() {
      return {
        isOpenModal: false,
        isLoading: false,
        isPdfLoading: false,
        maxSteps: 5,
        currentStep: 1,
        realEstateInputs: {
          searchString: '',
          price: '',
          fee: '',
          rent: false,
          object: '',
          address: '',
          projectName: '',
          name: '',
          onofficeSystemId: '',
          commission: '',
        },
        realEstateObject: {},
        realEstateApiStatus: 404,
        selectedRealEstates: [],
        showRealEstateDropdown: false,
        inputValue: '',
        alertMessage: '',
        alertStatus: '',
        customerSearchString: '',
        customerData: {
          customerNr: '',
          title: '',
          salutation: '',
          firstname: '',
          lastname: '',
          phone: '',
          mail: '',
          nationality: '',
          language: '',
          birthday: '',
          customerAddress: {
            street: '',
            city: '',
            zipcode: '',
            country: '',
          },
          bankData: {
            iban: '',
            bic: '',
            bankName: '',
          }
        },
        optionWebformToCustomer: true,
        optionUseMaklerMailInsteadOfCustomers: false,
        customerFoundObject: '',
        customerApiStatus: 404,
        showCustomerDropdown: false,
        showCountryDropdown: false,
        previewLink: '',
        createApiResponse: false,
        editViewReservationApiResponse: '',
        editViewCustomerApiResponse: '',
        editViewRealEstateApiResponse: '',
        isCreateView: false, // if false it will be edit view
        dropdownTopPositions: {
          realEstates: 0,
          customers: 0,
          country: 0,
          nationality: 0,
          language: 0,
        },
        dropdownRelativePosition: false,
        showSalutationDropdown: false,
        showNationalityDropdown: false,
      }
    },
    watch: {
      $route(to, from){

        // Exec only when this router child component is requested
        this.isCreateView = true;
        if ( to.name === 'createReservationView' || to.name === 'editReservationView' ){
          this.isOpenModal = true;
          this.currentStep = 1;
        } else {
          this.isOpenModal = false;
        }

        if ( to.name === 'editReservationView' ){
          this.getApisData(this.$route.params.id);
          this.getReservationsRealEstates(this.$route.params.id);
          this.selectedRealEstates = [];
          this.isCreateView = false;
        }

      },
      alertMessage: function(newVal, oldVal) {
        if ( newVal !== '' ){
          setTimeout(() => this.alertMessage = '', 3000);
        }
      },
      createApiResponse: function(newVal, oldVal) {
        if ( newVal === true ){
          this.$emit('createReservationResponse', true);
        }
      },
      editViewRealEstateApiResponse: function(newVal, oldVal) {
        for (const realEstate of newVal){
          let realEstateToAdd = {
            'estate_sys_id': realEstate.real_estate_sys_id,
            'estate_nr': realEstate.estate_nr,
            'estate_price': realEstate.estate_price,
            'estate_fee': realEstate.estate_fee,
          };
          this.selectedRealEstates.push(realEstateToAdd);
        }
      },
      editViewCustomerApiResponse: function(newVal, oldVal) {
        this.customerData = {
          customerNr: newVal.client_id,
          title: newVal.client_title,
          salutation: newVal.client_salutation,
          firstname: newVal.client_first_name,
          lastname: newVal.client_last_name,
          phone: newVal.client_phone,
          mail: newVal.client_email,
          nationality: newVal.client_nationality,
          language: newVal.client_language,
          birthday: newVal.client_birthday,
          customerAddress: {
            street: newVal.client_address,
            city: newVal.client_city,
            zipcode: newVal.client_postal_code,
            country: newVal.client_country,
          },
          bankData: {
            iban: newVal.client_iban,
            bic: newVal.client_bic,
            bankName: newVal.client_credit_institution,
          }
        };
        this.customerSearchString = newVal.client_email;
      },
      optionWebformToCustomer: function(newVal) {
        this.optionUseMaklerMailInsteadOfCustomers = !newVal;
      },
      optionUseMaklerMailInsteadOfCustomers: function(newVal) {
        this.optionWebformToCustomer = !newVal;
      },
    },
    methods: {
      resetData() {
        this.isOpenModal = false;
        this.isLoading = false;
        this.isPdfLoading = false;
        this.maxSteps = 5;
        this.currentStep = 1;
        this.realEstateInputs = {
          searchString: '',
          price: '',
          fee: '',
          rent: false,
          object: '',
          address: '',
          projectName: '',
          name: '',
          onofficeSystemId: '',
          commission: '',
        };
        this.realEstateObject = [];
        this.realEstateApiStatus = 404;
        this.selectedRealEstates = [];
        this.showRealEstateDropdown = false;
        this.inputValue = '';
        this.alertMessage = '';
        this.alertStatus = '';
        this.customerSearchString = '';
        this.customerData = {
          customerNr: '',
          title: '',
          salutation: '',
          firstname: '',
          lastname: '',
          phone: '',
          mail: '',
          nationality: '',
          language: '',
          birthday: '',
          customerAddress: {
            street: '',
            city: '',
            zipcode: '',
            country: '',
          },
          bankData: {
            iban: '',
            bic: '',
            bankName: '',
          }
        };
        this.optionWebformToCustomer = true;
        this.optionUseMaklerMailInsteadOfCustomers = false;
        this.customerFoundObject = '';
        this.customerApiStatus = 404;
        this.showCustomerDropdown = false;
        this.showCountryDropdown = false;
        this.previewLink = '';
        this.createApiResponse = false;
        this.editViewReservationApiResponse = '';
        this.editViewCustomerApiResponse = '';
        this.editViewRealEstateApiResponse = '';
        this.isCreateView = false; // if false it will be edit view
        this.dropdownTopPositions = {
          realEstates: 0,
          customers: 0,
          country: 0,
          nationality: 0,
          language: 0,
        };
        this.dropdownRelativePosition = false;
        this.showSalutationDropdown = false;
        this.showNationalityDropdown = false;
      },
      closeModal(){
        this.apiResponseStatus = false;
        this.isOpenModal = false;
        this.apiResponseCustomer = '';
        this.redirectToHomeView();
      },
      searchRealEstate() {
        if ( this.realEstateInputs.searchString && this.realEstateInputs.searchString.length >= 3 ){

          this.isLoading = true;

          axios.get(this.globalApiBaseUrl + '/onoffice/getRealEstate?searchString='+this.realEstateInputs.searchString)
            .then(
                (response) => {

                  const realEstateArray = Array.isArray(response.data.response.real_estates)
                      ? response.data.response.real_estates
                      : Object.values(response.data.response.real_estates); // Convert object to array if needed

                  this.realEstateObject = realEstateArray;
                  this.realEstateApiStatus = response.data.status
                  this.showRealEstateDropdown = true;
                  this.isLoading = false;
                }
            )
            .catch(
                (error) => {
                  this.isLoading = false;
                }
            )
        }
      },
      realEstateDropdownClick(clickedText) {
        for (const realEstate of this.realEstateObject){
          if ( realEstate.real_estate_id === clickedText ){
            this.realEstateInputs.searchString = realEstate.real_estate_id;
            this.realEstateInputs.price = realEstate.real_estate_price;
            this.realEstateInputs.fee = realEstate.real_estate_fee;
            this.realEstateInputs.rent = realEstate.real_estate_rented;
            this.realEstateInputs.name = realEstate.real_estate_id;
            this.realEstateInputs.onofficeSystemId = realEstate.real_estate_sys_id;
            this.realEstateInputs.commission = realEstate.real_estate_commission !== '' ? realEstate.real_estate_commission : '0%';
            this.alertMessage = '';
            break;
          }
        }
        this.showRealEstateDropdown = false;
      },
      customerDropdownClick(clickedText) {

        const clickedTextRemovedWhiitespace = clickedText.replace(/\s+/g, "");
        const arr = clickedTextRemovedWhiitespace.split("|"); // split the string by " | " delimiter
        const clickedMail = arr[0];

        for (const customer of this.customerFoundObject){
          if ( customer.client_email === clickedMail ){
            this.customerData.customerNr = customer.client_id;
            this.customerData.title = customer.client_title;
            this.customerData.salutation = customer.client_salutation;
            this.customerData.firstname = customer.client_first_name;
            this.customerData.lastname = customer.client_last_name;
            this.customerData.phone = customer.client_phone;
            this.customerData.mail = customer.client_email;
            this.customerData.nationality = customer.client_nationality;
            this.customerData.birthday = this.germanDateToEnglishDateFormat(customer.client_birthday);
            this.customerData.language = customer.client_language;
            this.customerData.customerAddress.street = customer.client_address;
            this.customerData.customerAddress.city = customer.client_city;
            this.customerData.customerAddress.zipcode = customer.client_postal_code;
            this.customerData.customerAddress.country = customer.client_country;
            this.customerData.bankData.iban = customer.client_iban;
            this.customerData.bankData.bic = customer.client_bic;
            this.customerData.bankData.bankName = customer.client_credit_institution;
            this.alertMessage = '';

            this.customerSearchString = customer.client_email;
            break;
          }
        }
        this.showCustomerDropdown = false;
      },
      addRealEstateToSummary() {

        // Check if real estate exists in api response
        let checker = true;
        if ( this.realEstateApiStatus === 200 && this.realEstateObject ){
          for (const realEstate of this.realEstateObject){
            if ( realEstate.real_estate_id === this.realEstateInputs.searchString ){
              checker = true;
              break;
            } else {
              checker = false;
            }
          }
        } else {
          checker = false;
        }
        if ( !checker ){
          this.alertMessage = 'Diese Immobilie konnte nicht gefunden werden';
          this.alertStatus = 'warning';
          return;
        }


        // Check if real estate is already in this.selectedRealEstates
        for (const realEstate of this.selectedRealEstates){
          if ( realEstate.estate_nr === this.realEstateInputs.name ){
            this.alertMessage = 'Diese Immobilie wurde bereits hinzugefügt';
            this.alertStatus = 'warning';
            return;
          }
        }

        if ( this.realEstateInputs.price === '' || parseInt(this.realEstateInputs.price) === 0 ){
          this.alertMessage = 'Der Preis der Immobilie darf nicht leer oder 0 sein';
          this.alertStatus = 'warning';
          return;
        }

        let realEstateToAdd = {
          'estate_sys_id': this.realEstateInputs.onofficeSystemId,
          'estate_nr': this.realEstateInputs.name,
          'estate_price': this.realEstateInputs.price,
          'estate_fee': this.realEstateInputs.fee,
          'estate_commission': this.realEstateInputs.commission,
        }
        this.selectedRealEstates.push(realEstateToAdd);
        this.alertMessage = '';
      },
      removeRealEstateFromSummary(realEstateNrToRemove){
        let i = 0;
        for ( const realEstates of this.selectedRealEstates ) {
          if ( realEstates.estate_nr === realEstateNrToRemove ){
            this.selectedRealEstates.splice(i, 1);
          }
          i += 1;
        }
      },
      searchCustomer() {

        if ( this.customerSearchString && this.customerSearchString !== '' ){

          this.isLoading = true;

          let onlySearchForCustomerNr = false;
          let company = 'living';
          if ( !isNaN(this.customerSearchString) ) {
            // is a number
            onlySearchForCustomerNr = true;
          }

          axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.customerSearchString+'&company='+company+'&onlyCustomerNrSearch='+onlySearchForCustomerNr)
              .then(
                  (response) => {
                    this.customerFoundObject = response.data.response.client_data;
                    this.customerApiStatus = response.data.status;
                    this.showCustomerDropdown = true;
                    this.isLoading = false;
                  }
              )
              .catch(
                  (error) => {
                    console.log(error);
                    this.isLoading = false;
                  }
              )
        }
      },
      countrySelection(clickedText) {
        this.customerData.customerAddress.country = clickedText;
        this.showCountryDropdown = false;
      },
      salutationSelection(clickedText) {
        this.customerData.salutation = clickedText;
        this.showSalutationDropdown = false;
      },
      nationalitySelection(clickedText) {
        this.customerData.nationality = clickedText;
        this.showNationalityDropdown = false;
      },
      preview() {

        if ( this.isPdfLoading ){
          return;
        }

        let dataToSubmit = {
          'customerData': this.customerData,
          'selectedRealEstates': this.selectedRealEstates,
        }

        this.isPdfLoading = true;

        axios.post(this.globalApiBaseUrl + '/reservations/renderReservationPreviewPdf', dataToSubmit )
          .then(
              (response) => {
                if ( response.data.response && response.data.response !== '' ){
                  window.open(response.data.response, '_blank').focus();
                } else {
                  this.notificationBannerInit('warning', 'Vorschau konnte nicht geladen werden')
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
                this.isPdfLoading = false;
              })
      },
      resetCustomerData() {

        this.customerData = {
          customerNr: '',
          title: '',
          salutation: '',
          firstname: '',
          lastname: '',
          phone: '',
          mail: '',
          nationality: '',
          language: '',
          birthday: '',
          customerAddress: {
            street: '',
            city: '',
            zipcode: '',
            country: '',
          },
          bankData: {
            iban: '',
            bic: '',
            bankName: '',
          }
        }

      },
      nextStep() {
        // Check if real estates are selected
        if ( this.currentStep === 1 ) {
          if ( this.selectedRealEstates.length === 0 ) {
            this.alertMessage = 'Bitte fügen Sie mindestens eine Immobilie hinzu';
            this.alertStatus = 'warning';
            return;
          }
        } else if ( this.currentStep === 2 ) {
          if ( this.customerData.mail === '' && !this.isValidEmail(this.customerSearchString) ) {
            this.alertMessage = 'Bitte fügen Sie einen Kunden hinzu oder erstellen Sie einen indem Sie mindestens eine korrekte E-Mail angeben';
            this.alertStatus = 'warning';
            return;
          }
          if ( this.customerData.mail === '' && this.isValidEmail(this.customerSearchString) ) {
            this.customerData.mail = this.customerSearchString;
            this.customerData.salutation = 'Herr';
          }
        } else if ( this.currentStep === 3 ) {
          if ( this.customerData.customerAddress.country === '' ) {
            this.alertMessage = 'Bitte geben Sie das Land des Kunden an';
            this.alertStatus = 'warning';
            return;
          }
        }
        this.currentStep = this.currentStep + 1;
      },
      backStep() {
        this.currentStep = this.currentStep - 1;
      },
      closeDropdowns() {
        this.showCountryDropdown = false;
        this.showCustomerDropdown = false;
        this.showRealEstateDropdown = false;
        this.showSalutationDropdown = false;
        this.showNationalityDropdown = false;
      },
      submitReservation() {

        if ( this.isLoading ) {
          return;
        }

        if ( this.customerData.nationality !== '' && this.customerData.nationality !== undefined && this.customerData.nationality !== false ){
          for (let k in this.nationalityList){
            if (this.nationalityList.hasOwnProperty(k)) {
              if ( this.nationalityList[k] === this.customerData.nationality ){
                this.customerData.nationality = k;
                break;
              }
            }
          }
          for (let k in this.nationalityListEN){
            if (this.nationalityListEN.hasOwnProperty(k)) {
              if ( this.nationalityListEN[k] === this.customerData.nationality ){
                this.customerData.nationality = k;
                break;
              }
            }
          }
        }

        if ( this.customerData.customerAddress.country !== '' && this.customerData.customerAddress.country !== undefined && this.customerData.customerAddress.country !== false ){
          for (let k in this.countryList){
            if (this.countryList.hasOwnProperty(k)) {
              if ( this.countryList[k] === this.customerData.customerAddress.country ){
                this.customerData.customerAddress.country = k;
                break;
              }
            }
          }
          for (let k in this.countryListEN){
            if (this.countryListEN.hasOwnProperty(k)) {
              if ( this.countryListEN[k] === this.customerData.customerAddress.country ){
                this.customerData.customerAddress.country = k;
                break;
              }
            }
          }
        }

        let customerDataApiFormat = {
          'client_id': this.customerData.customerNr,
          'client_salutation': this.customerData.salutation,
          'client_title': this.customerData.title,
          'client_first_name': this.customerData.firstname,
          'client_last_name': this.customerData.lastname,
          'client_mail': this.customerData.mail,
          'client_phone': this.customerData.phone,
          'client_address': this.customerData.customerAddress.street,
          'client_postal_code': this.customerData.customerAddress.zipcode,
          'client_city': this.customerData.customerAddress.city,
          'client_birthday': this.customerData.birthday,
          'client_country': this.customerData.customerAddress.country,
          'client_nationality': this.customerData.nationality,
          'client_iban': this.customerData.bankData.iban,
          'client_bic': this.customerData.bankData.bic,
          'client_credit_institution': this.customerData.bankData.bankName,
        }

        let dataToSubmit = {
          'customerData': customerDataApiFormat,
          'selectedRealEstates': this.selectedRealEstates,
          'reservationOptions': {
            'optionWebformToCustomer': this.optionWebformToCustomer,
            'optionUseMaklerMailInsteadOfCustomers': this.optionUseMaklerMailInsteadOfCustomers,
          }
        }
        let apiRoute = 'createNewReservation';
        if ( !this.isCreateView ) {
          dataToSubmit.reservationId = this.$route.params.id;
          apiRoute = 'updateReservation';
        }

        this.isLoading = true;
        axios.post(this.globalApiBaseUrl + '/reservations/' + apiRoute, dataToSubmit )
          .then(
              (response) => {
                if ( response.data.status === 200 ) {
                  this.createApiResponse = true;
                  this.notificationBannerInit('success', 'DIE RESERVIERUNG WURDE ANGELEGT')
                  this.redirectToHomeView();
                  this.resetData();
                  this.$emit('createReservationResponse', true);
                } else {
                  this.notificationBannerInit('warning', 'Reservierung konnte nicht angelegt werden')
                  this.redirectToHomeView();
                }
              }
          ).catch(
                (error) => {
                  this.notificationBannerInit('warning', 'Reservierung konnte nicht angelegt werden')
                  console.log(error);
                }
            ).finally(
            () => {
              this.isLoading = false;
            })
      },
      async getApisData( reservationId ) {

        this.isLoading = true;
        // Get single reservation via api
        await axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservation?reservationId='+reservationId)
            .then(
                (response) => {
                  this.editViewReservationApiResponse = response.data.response[0];
                }
            )
            .catch(
                (error) => {
                  this.editViewReservationApiResponse = error;
                }
            )

        // Get single customer data via api
        await axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.editViewReservationApiResponse.customer_kdnr+'&company='+this.editViewReservationApiResponse.company+'&onlyCustomerNrSearch=true')
            .then(
                (response) => {
                  this.editViewCustomerApiResponse = response.data.response.client_data[0];
                  this.isLoading = false;
                }
            )
            .catch(
                (error) => {
                  this.editViewCustomerApiResponse = error;
                }
            )
      },
      getReservationsRealEstates( reservationId ) {

        let data = JSON.stringify({
          "reservationId": reservationId
        });

        axios({ method: 'post', url: this.globalApiBaseUrl + '/reservations/getReservationsRealEstate', data: data })
          .then(
              (response) => {
                this.editViewRealEstateApiResponse = response.data.response;
              }
          )
          .catch(
              (error) => {
                this.editViewRealEstateApiResponse = error;
              }
          )
      },
      backToReservationSingleView() {
        this.$router.go(-1);
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
      }
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal, isLoading: isLoading }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">
          Reservierung {{ $route.name === 'createReservationView' ? 'erstellen' : 'bearbeiten' }} <span>- Schritt {{ this.currentStep }}/{{ this.maxSteps }}</span>
        </div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <CreateReservationProgressBar :currentStep="currentStep" :maxSteps="maxSteps"></CreateReservationProgressBar>

        <div class="setup-estates" v-if="currentStep === 1">

          <div class="fieldgroup-label">Zu reservierende Einheit(en)</div>

          <form class="real-estate-insert">
            <div class="field-wrapper">
              <InputField ref="inputRealEstates" inputType="text" inputPlaceholder="Straße oder Immo-Nr." inputName="RealEstates" :inputValue="realEstateInputs.searchString" v-model="realEstateInputs.searchString" @input="searchRealEstate" @focus="setDropdownTop($event)" @click.stop=""></InputField>
              <label class="ph">Straße oder Immo-Nr. <AsterixMarkIcon></AsterixMarkIcon></label>
              <Dropdown ref="dropdownRealEstates" :class="{active: showRealEstateDropdown, relative: dropdownRelativePosition}" type="realEstate" :renderingObject="realEstateObject" @dropdown-item-clicked="realEstateDropdownClick" @click.stop=""></Dropdown>
            </div>
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="Preis" inputName="realEstatePrice" :inputValue="this.numberWithComma(realEstateInputs.price)" v-model="realEstateInputs.price" ></InputField>
              <label class="ph">Preis <AsterixMarkIcon></AsterixMarkIcon></label>
            </div>
            <div class="field-wrapper">
              <span>
                <InputField inputType="text" inputPlaceholder="Gebühr" inputName="realEstateFee" :inputValue="this.numberWithComma(realEstateInputs.fee)" v-model="realEstateInputs.fee"></InputField>
                <label class="ph">Gebühr</label>
              </span>
              <span>
                <InputField inputType="text" inputPlaceholder="Provision" inputName="realEstateProvision" :inputValue="realEstateInputs.commission" readonly></InputField>
                <label class="ph">Provision</label>
              </span>
<!--              <span>-->
<!--                <label :for="'realEstateFee'" class="fee-wrapper">-->
<!--                  Vermietet-->
<!--                  <InputField inputType="checkbox" inputName="realEstateFee" :inputValue="realEstateInputs.rent" v-model="realEstateInputs.rent"></InputField>-->
<!--                </label>-->
<!--              </span>-->
            </div>
            <Button type="edit" @click="addRealEstateToSummary()">Einheit hinzufügen</Button>
          </form>

          <div class="real-estates-list">
            <RealEstateList :showEditFunctions="{edit: false, delete: true}" :realEstateObject="selectedRealEstates" @realEstateDelete="removeRealEstateFromSummary"></RealEstateList>
          </div>

        </div>

        <div class="setup-customer" v-if="currentStep === 2">

          <div class="fieldgroup-label">Kundendaten:</div>

          <form class="customer-data">
            <div class="field-wrapper">
              <InputField ref="inputCustomer" inputType="text" inputPlaceholder="Kundennummer oder E-Mail" inputName="Customer" :inputValue="customerSearchString" @focus="setDropdownTop($event)" v-model="customerSearchString" @input="resetCustomerData"></InputField>
              <label class="ph">Kundennummer oder E-Mail <AsterixMarkIcon></AsterixMarkIcon></label>
              <Button type="report" @click="searchCustomer()" @click.stop=""><SearchIcon></SearchIcon></Button>
              <Dropdown ref="dropdownCustomer" :class="{active: showCustomerDropdown, relative: dropdownRelativePosition}" type="customerData" :renderingObject="customerFoundObject" @dropdown-item-clicked="customerDropdownClick" @click.stop=""></Dropdown>
            </div>
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="Kundenummer" inputName="customerNr" :inputValue="customerData.customerNr" readonly></InputField>
              <label class="ph">Kundenummer</label>
            </div>
          </form>

        </div>

        <div class="setup-customer-personal" v-if="currentStep === 3">

          <div class="fieldgroup-label">Personendaten:</div>

          <form class="customer-address-data">
            <div class="field-wrapper">
              <span>
                <InputField class="dropdown-input" ref="inputSalutation" inputType="text" inputPlaceholder="Anrede" inputName="Salutation" :inputValue="customerData.salutation" v-model="customerData.salutation" @focus="setDropdownTop($event)" @click="showSalutationDropdown = true" @click.stop=""></InputField>
                <label class="ph">Anrede <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownSalutation" :class="{active: showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.salutationList" :filterFor="customerData.salutation" @dropdown-item-clicked="salutationSelection" @click.stop=""></Dropdown>
              </span>
              <span>
                <InputField inputType="text" inputPlaceholder="Titel" inputName="Title" :inputValue="customerData.title" v-model="customerData.title"></InputField>
                <label class="ph">Titel</label>
              </span>
            </div>

            <div class="field-wrapper">
              <span>
                <InputField inputType="text" inputPlaceholder="Vorname" inputName="Firstname" :inputValue="customerData.firstname" v-model="customerData.firstname"></InputField>
                <label class="ph">Vorname</label>
              </span>
              <span>
                <InputField inputType="text" inputPlaceholder="Nachname" inputName="Lastname" :inputValue="customerData.lastname" v-model="customerData.lastname"></InputField>
                <label class="ph">Nachname</label>
              </span>
            </div>

            <div class="field-wrapper">
              <span>
                <InputField inputType="date" inputPlaceholder="Geburtsdatum" inputName="Birthday" :inputValue="customerData.birthday" v-model="customerData.birthday"></InputField>
                <label class="ph">Geburtstag</label>
              </span>
              <span>
                <InputField class="dropdown-input" ref="inputNationality" inputType="text" inputPlaceholder="Nationality" inputName="Nationality" :inputValue="customerData.nationality" v-model="customerData.nationality" @focus="setDropdownTop($event)" @click="showNationalityDropdown = true" @click.stop=""></InputField>
                <label class="ph">Nationalität</label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showNationalityDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.nationalityList" :filterFor="customerData.nationality" @dropdown-item-clicked="nationalitySelection" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="Straße & Hausnummer" inputName="customerStreet" :inputValue="customerData.customerAddress.street" v-model="customerData.customerAddress.street"></InputField>
              <label class="ph">Straße & Hausnummer</label>
            </div>
            <div class="field-wrapper">
              <span>
                <InputField inputType="text" inputPlaceholder="PLZ" inputName="customerZipcode" :inputValue="customerData.customerAddress.zipcode" v-model="customerData.customerAddress.zipcode"></InputField>
                <label class="ph">PLZ</label>
              </span>
              <span>
                <InputField inputType="text" inputPlaceholder="Stadt" inputName="customerCity" :inputValue="customerData.customerAddress.city" v-model="customerData.customerAddress.city"></InputField>
                <label class="ph">Stadt</label>
              </span>
            </div>

            <div class="field-wrapper">
              <InputField class="dropdown-input" ref="inputCountry" inputType="text" inputPlaceholder="Land" inputName="Country" :inputValue="customerData.customerAddress.country" v-model="customerData.customerAddress.country" @focus="setDropdownTop($event)" @click="showCountryDropdown = true" @click.stop=""></InputField>
              <label class="ph">Land <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownCountry" :class="{active: showCountryDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.countryList" :filterFor="customerData.customerAddress.country" @dropdown-item-clicked="countrySelection" @click.stop=""></Dropdown>
            </div>
          </form>

        </div>

        <div class="setup-customer-contact-bank-data" v-if="currentStep === 4">

          <div class="fieldgroup-label">Kontaktdaten:</div>

          <form class="customer-contact-data">
            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="Telefon" inputName="customerPhone" :inputValue="customerData.phone" v-model="customerData.phone"></InputField>
              <label class="ph">Telefon</label>
            </div>
            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="E-Mail" inputName="customerMail" :inputValue="customerData.mail" v-model="customerData.mail"></InputField>
              <label class="ph">E-Mail <AsterixMarkIcon></AsterixMarkIcon></label>
            </div>
          </form>

          <div class="fieldgroup-label">Bankverbindung:</div>

          <form class="customer-bank-data">
            <div class="field-wrapper">
              <InputField inputType="text" inputPlaceholder="IBAN" inputName="customerIban" :inputValue="customerData.bankData.iban" v-model="customerData.bankData.iban"></InputField>
              <label class="ph">IBAN</label>
            </div>
            <div class="field-wrapper">
              <span>
                <InputField inputType="text" inputPlaceholder="BIC" inputName="customerBic" :inputValue="customerData.bankData.bic" v-model="customerData.bankData.bic"></InputField>
                <label class="ph">BIC</label>
              </span>
              <span>
                <InputField inputType="text" inputPlaceholder="Kreditinstitut" inputName="customerBankname" :inputValue="customerData.bankData.bankName" v-model="customerData.bankData.bankName"></InputField>
                <label class="ph">Kreditinstitut</label>
              </span>
            </div>
          </form>

        </div>

        <div class="setup-options" v-if="currentStep === 5 && !createApiResponse">

          <div class="fieldgroup-label">Optionen:</div>

          <form class="options">
            <label :for="'optionWebformToCustomer'" class="option-wrapper">
              <span>Reservierungsformular & Yousign an <u>Kunden</u> senden:</span>
<!--              <InputField inputType="checkbox" inputName="optionWebformToCustomer" :inputValue="optionWebformToCustomer" v-model="optionWebformToCustomer"></InputField>-->
              <input class="checkbox field" type="checkbox" name="optionWebformToCustomer" :value="optionWebformToCustomer" v-model="optionWebformToCustomer">
            </label>

            <Seperator>oder</Seperator>

            <label :for="'optionUseMaklerMailInsteadOfCustomers'" class="option-wrapper">
              <span>Reservierungsformular & Yousign an <u>Makler</u> senden:</span>
<!--              <InputField inputType="checkbox" inputName="optionUseMaklerMailInsteadOfCustomers" :inputValue="optionUseMaklerMailInsteadOfCustomers" v-model="optionUseMaklerMailInsteadOfCustomers"></InputField>-->
              <input class="checkbox field" type="checkbox" name="optionUseMaklerMailInsteadOfCustomers" :value="optionUseMaklerMailInsteadOfCustomers" v-model="optionUseMaklerMailInsteadOfCustomers">
            </label>
          </form>

        </div>

        <div class="button-actions" :class="{ 'two-buttons': currentStep > 1 }" v-if="!createApiResponse">
          <Button class="preview-button" type="delete" v-if="!isCreateView" @click="backToReservationSingleView">Abbrechen</Button>
          <Button class="preview-button" type="edit" v-if="currentStep === maxSteps" @click="preview">{{ isPdfLoading ? 'Wird geladen' : 'Vorschau' }} <AnimateCircleIcon v-if="isPdfLoading"></AnimateCircleIcon></Button>
          <div class="inner-button-wrapper">
            <Button class="prev-button" type="edit" v-if="currentStep > 1" @click="backStep">Zurück</Button>
            <Button class="next-button" type="report" v-if="currentStep < maxSteps" @click="nextStep">Weiter</Button>
            <Button class="finish-button" type="report" v-if="currentStep === maxSteps" @click="submitReservation">Reservierung {{ $route.name === 'createReservationView' ? 'erstellen' : 'bearbeiten' }} <AnimateCircleIcon v-if="isLoading && currentStep === maxSteps"></AnimateCircleIcon></Button>
          </div>
        </div>

        <AlertMessage :alertStatus="alertStatus" :alertText="alertMessage"></AlertMessage>

      </div>

    </div>

  </div>

</template>


<style scoped>

.title {
  font-size: 18px;
  font-weight: 700;
  color: #040D14;
  text-transform: uppercase;
}

.title span {
  font-size: 18px;
  font-weight: 500;
  color: var(--light-gray);
}

.steps-wrapper,
[class^="setup-"] {
  margin-top: 25px;
}

[class^="setup-"] {
  display: flex;
  flex-wrap: wrap;
  border-top: solid 1px var(--light-light-gray);
  padding-top: 50px;
}

.fieldgroup-label, form {
  flex-basis: 100%;
}

form input + input,
form .button, .field-wrapper + input {
  margin-top: 15px;
}

form.real-estate-insert > input:nth-last-of-type(1), form.real-estate-insert .fee-wrapper {
  flex-basis: 50%;
}

form.real-estate-insert .fee-wrapper {
  text-align: right;
}

form.real-estate-insert .button {
  width: 100%;
}

.real-estates-list {
  margin-top: 25px;
  width: 100%;
}

.button-actions, .alert-message {
  margin-top: 25px;
}

.button-actions.two-buttons .inner-button-wrapper {
  display: flex;
  justify-content: space-between;
}

.button-actions > .button {
  flex-basis: 100%;
}

.button-actions.two-buttons .inner-button-wrapper .button{
  flex-basis: 48%;
}

.customer-data .inner-field-wrapper {
 display: flex;
}

.customer-data > .field-wrapper:first-of-type .button {
  margin-top: 0;
  margin-left: 15px;
}

.field-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.field-wrapper.two-col input, .field-wrapper > span {
  flex-basis: 49%;
}

.field-wrapper > span {
  display: flex;
  justify-content: end;
  position: relative;
}

input, .field-wrapper {
  margin-top: 15px;
}

.field-wrapper input {
  margin-top: 0;
}

.customer-contact-data + .fieldgroup-label {
  margin-top: 40px;
  border-top: dotted 1px var(--light-gray);
  padding-top: 25px;
}

.option-wrapper {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  padding: 25px 0;
  border-top: dotted 1px var(--light-gray);
  border-bottom: dotted 1px var(--light-gray);
}

.option-wrapper:first-of-type {
  border-bottom: unset;
}

.option-wrapper:last-of-type {
  border-top: unset;
}

.option-wrapper .checkbox {
  flex-basis: auto;
  top: 0;
  margin-top: 0;
}

.preview-button {
  margin-bottom: 20px;
}

input[name="Customer"] {
  flex-basis: 75%;
}

input[name="Customer"] + .ph +.button {
  flex-basis: 20%;
}

/* Mobile */
@media (max-width: 767px){
  input[name="Customer"] {
    flex-basis: 70%;
  }

  .field-wrapper > span, input[name="Customer"], input[name="Customer"] + .ph +.button {
    flex-basis: 100%;
  }

  input[name="Customer"] + .ph +.button {
    margin-left: 0 !important;
    margin-top: 10px !important;
  }

  .field-wrapper > span + span {
    margin-top: 15px;
  }

  .preview-button {
    margin-bottom: 10px;
  }
}

</style>
