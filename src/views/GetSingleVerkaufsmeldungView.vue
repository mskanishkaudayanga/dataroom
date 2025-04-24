<script>
  import axios from "axios";
  import CardTitle from "../components/card/CardTitle.vue";
  import CloseIcon from "../components/icons/icon-close.vue";
  import ProcessTab from "../components/card/ProcessTabs.vue";
  import RealEstateList from "../components/card/RealEstateList.vue";
  import Button from "../components/buttons/button.vue";
  import InputField from "../components/forms/InputField.vue";
  import UploadFieldArea from "../components/forms/UploadDragAndDrop.vue";
  import AlertMessage from "../components/card/AlertMessage.vue";
  import ProcessTabContent from "../components/card/ProcessTabsContent.vue";
  import TextAreaField from "../components/forms/TextAreaField.vue";
  import AnimateCircleIcon from "../components/icons/icon-animate-loading-circle.vue";
  import DropdownArrow from "../components/icons/icon-dropdown.vue";
  import Dropdown from "../components/forms/Dropdown.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";

  export default {
    name: "getSingleVerkaufsmeldungModal",
    components: {
      AsterixMarkIcon,
      AnimateCircleIcon, TextAreaField, ProcessTabContent, UploadFieldArea, InputField, Button, RealEstateList, ProcessTab, CardTitle, CloseIcon, AlertMessage, DropdownArrow, Dropdown},
    data() {
      return {
        verkaufsmeldungsId: '',
        apiResponse: '',
        apiResponseRealEstate: '',
        apiResponseCustomer: '',
        isOpenModal: false,
        isLoading: false,
        notarterminNotOccuredPorcess: false,
        notarterminOccuredProcess: false,
        submitProcess: false,
        rejectProcess: false,
        rejectReason: '',
        editProcess: false,
        documents: {
          gwgExternal: false,
          gwgInternal: false,
          fee: false,
        },
        additionalNotification: '',
        investmentKind: '',
        showInvestmentDropdown: false,
        dropdownRelativePosition: false,
        investementKindList: {
          0: 'Kapitalanlage',
          1: 'Selbstnutzer',
          2: 'Mieterkauf'
        },
        isDateInFuture: false,
        cardFeedbackMessage: '',
        editRealEstatePrice: 0,
        realEstateBeurkundetPrice: 0,
        realEstateLieferPrice: 0,

        disableGif: true,

        formValidation: {
          gwgExternal: true,
          investmentKind: true,
        }
      }
    },
    methods: {
      async getSingleCardData() {

        this.isLoading = true;
        await axios.get(this.globalApiBaseUrl + '/verkaufsmeldung/getSingleVerkaufsmeldung?verkaufsmeldungId='+this.verkaufsmeldungsId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiResponse = response.data.response[0];
                    this.isDateInFuture = this.checkIfDateInFuture(this.apiResponse.notartermin_date);
                    this.updateData(this.apiResponse);
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            )

        await axios.get(this.globalApiBaseUrl + '/onoffice/getSingleRealEstate?systemid='+this.apiResponse.real_estate_sys_id)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.apiResponseRealEstate = response.data.response.real_estates[0];
                    if ( !this.apiResponse.saleprice || this.apiResponse.saleprice === 0 || this.apiResponse.saleprice === '0' ){
                      this.apiResponse.saleprice = this.apiResponseRealEstate.real_estate_price;
                      this.editRealEstatePrice = this.apiResponseRealEstate.real_estate_price;
                    } else {
                      this.editRealEstatePrice = this.apiResponse.saleprice;
                    }

                    this.realEstateBeurkundetPrice = this.apiResponseRealEstate.real_estate_beurkundeter_price;
                    this.realEstateLieferPrice = this.apiResponseRealEstate.real_estate_delivery_price;

                    this.apiResponse.fee = parseInt(this.apiResponseRealEstate.real_estate_fee);

                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            );

        await axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.apiResponse.customer_kdnr+'&company='+this.apiResponse.company+'&onlyCustomerNrSearch=true')
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.apiResponseCustomer = response.data.response.client_data[0];
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            );
        this.isLoading = false;
      },
      updateNotarterminOccured(handler) {

        if ( typeof handler !== 'boolean' ){
          this.cardFeedbackMessage = 'Es ist ein Fehler aufgetreten.';
          return;
        }

        this.isLoading = true;
        let dataToSend = {
          'notarterminId': this.apiResponse.onoffice_activity_id,
          'notarterminOccur': handler
        }

        axios.post(this.globalApiBaseUrl + '/verkaufsmeldung/updateNotarterminOccur', dataToSend )
          .then(
              (response) => {
                if ( response.data.status === 200) {
                  this.$emit('updatedVerkaufsmeldung', true);
                  if ( !handler ){
                    this.redirectToHomeView();
                    this.isOpenModal = false;
                    this.resetData();
                  } else {
                    this.getSingleCardData();
                  }
                }
                this.isLoading = false;
              }
          )
          .catch(
              (error) => {
                this.cardFeedbackMessage = 'Es ist ein Fehler aufgetreten.';
                this.isLoading = false;
              }
          )
      },
      reject() {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;
        let dataToSend = {
          'verkaufsmeldungId': this.verkaufsmeldungsId,
          'notarterminRejectReason': this.rejectReason
        }

        axios.post(this.globalApiBaseUrl + '/verkaufsmeldung/rejectVerkaufsmeldung', dataToSend )
            .then(
                (response) => {
                  if ( response.data.status === 200) {
                    this.$emit('updateVerkaufsmeldungen', true);
                    this.redirectToHomeView();
                    this.isOpenModal = false;
                    this.resetData();
                  }
                  this.isLoading = false;
                }
            )
            .catch(
                (error) => {
                  this.cardFeedbackMessage = 'Es ist ein Fehler aufgetreten.';
                  this.isLoading = false;
                }
            )
      },
      submitVerkaufsmeldungAsAgent() {

        this.formValidation.investmentKind = true;
        this.formValidation.gwgExternal = true;

        if ( !this.investmentKind || this.investmentKind.length === 0 ){
          this.alertMessage = 'Investmentart muss ausgewählt werden';
          this.formValidation.investmentKind = false;
        }

        if ( !this.documents.gwgExternal ){
          this.alertMessage += '<br> GWG External muss ausgewählt werden';
          this.formValidation.gwgExternal = false;
        }

        if ( !this.formValidation.investmentKind || !this.formValidation.gwgExternal ) {
          return false;
        }

        let customerName = '';

        if ( this.apiResponseCustomer.client_salutation && this.apiResponseCustomer.client_salutation !== '' ){
          customerName = this.apiResponseCustomer.client_salutation;
        }

        if ( this.apiResponseCustomer.client_first_name && this.apiResponseCustomer.client_first_name !== '' ){
          if ( this.apiResponseCustomer.client_salutation && this.apiResponseCustomer.client_salutation !== '' ) {
            customerName += ' ' + this.apiResponseCustomer.client_first_name;
          } else {
            customerName += this.apiResponseCustomer.client_first_name;
          }
        }

        if ( this.apiResponseCustomer.client_last_name && this.apiResponseCustomer.client_last_name !== '' ){
          customerName += ' ' + this.apiResponseCustomer.client_last_name;
        }

        let dataToSubmit = {
          "verkaufsmeldungId": this.apiResponse.verkaufsmeldung_id,
          "realEstateSaleprice": this.apiResponse.saleprice,
          "verkaufsformFeevalue": this.apiResponse.fee,
          "verkaufsformGwgcustomer": this.documents.gwgExternal,
          "verkaufsformGwginternal": this.documents.gwgInternal,
          "verkaufsformFeecheckbox": this.documents.fee,
          "verkaufsformNotice": this.additionalNotification,
          "verkaufsformInvestmentkind": this.investmentKind,
          'verkaufsformCreatedate': this.apiResponse.create_date,
          'verkaufsformCustomername': customerName,
          'verkaufsformOcurdate': this.englishDateWithTimeToGermanDate(this.apiResponse.notartermin_date),
          'realEstateSysId': this.apiResponseRealEstate.real_estate_sys_id,
          'realEstateBasementnr': this.apiResponseRealEstate.real_estate_basement_nr,
          "realEstateProjectname": this.apiResponseRealEstate.real_estate_project_name,
          "realEstateAddress": this.apiResponseRealEstate.real_estate_street + ', ' + this.apiResponseRealEstate.real_estate_zipcode + ' ' + this.apiResponseRealEstate.real_estate_city,
          "realEstateUnit": this.apiResponseRealEstate.real_estate_number,
          "realEstateObjectkind": this.apiResponseRealEstate.real_estate_object_type,
          "approval": false
        }

        this.isLoading = true;
        axios.post(this.globalApiBaseUrl + '/verkaufsmeldung/submitVerkaufsmeldungForm', dataToSubmit )
            .then(
                (response) => {
                  if ( response.data.status === 200) {
                    this.$emit('updateVerkaufsmeldungen', true);
                    this.resetData();
                    this.redirectToHomeView();
                  }
                  this.isLoading = false;
                }
            )
            .catch(
                (error) => {
                  this.alertMessage = 'Verakufsmeldung konnt nicht eingereicht werden';
                }
            )
            .finally(
            () => {
              this.isLoading = false;
            }
            )

      },
      submitFinalVerkaufsmeldung() {

        this.isLoading = true;

        let customerName = '';

        if ( this.apiResponseCustomer.client_salutation && this.apiResponseCustomer.client_salutation !== '' ){
          customerName = this.apiResponseCustomer.client_salutation;
        }

        if ( this.apiResponseCustomer.client_first_name && this.apiResponseCustomer.client_first_name !== '' ){
          if ( this.apiResponseCustomer.client_salutation && this.apiResponseCustomer.client_salutation !== '' ) {
            customerName += ' ' + this.apiResponseCustomer.client_first_name;
          } else {
            customerName += this.apiResponseCustomer.client_first_name;
          }
        }

        if ( this.apiResponseCustomer.client_last_name && this.apiResponseCustomer.client_last_name !== '' ){
          customerName += ' ' + this.apiResponseCustomer.client_last_name;
        }

        let data = {
          "verkaufsmeldungId": this.apiResponse.verkaufsmeldung_id,
          "realEstateSaleprice": this.apiResponse.saleprice,
          "verkaufsformFeevalue": this.apiResponse.fee,
          "verkaufsformGwgcustomer": this.documents.gwgExternal,
          "verkaufsformGwginternal": this.documents.gwgInternal,
          "verkaufsformFeecheckbox": this.documents.fee,
          "verkaufsformNotice": this.additionalNotification,
          "verkaufsformInvestmentkind": this.investmentKind,
          'verkaufsformCreatedate': this.apiResponse.create_date,
          'verkaufsformCustomername': customerName,
          'verkaufsformOcurdate': this.englishDateWithTimeToGermanDate(this.apiResponse.notartermin_date),
          'realEstateSysId': this.apiResponseRealEstate.real_estate_sys_id,
          'realEstateBasementnr': this.apiResponseRealEstate.real_estate_basement_nr,
          "realEstateProjectname": this.apiResponseRealEstate.real_estate_project_name,
          "realEstateAddress": this.apiResponseRealEstate.real_estate_street + ', ' + this.apiResponseRealEstate.real_estate_zipcode + ' ' + this.apiResponseRealEstate.real_estate_city,
          "realEstateUnit": this.apiResponseRealEstate.real_estate_number,
          "realEstateObjectkind": this.apiResponseRealEstate.real_estate_object_type,
          "approval": true,
        }

        axios.post(this.globalApiBaseUrl + '/verkaufsmeldung/submitVerkaufsmeldungForm', data )
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.$emit('updateVerkaufsmeldungen', true);
                    this.resetData();
                    this.redirectToHomeView();
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
      closeModal(){
        this.isOpenModal = false;
        this.redirectToHomeView();
      },
      resetData() {
        this.verkaufsmeldungsId = '';
        this.apiResponse = '';
        this.disableGif = true;
        this.isOpenModal = false;
        this.apiResponseRealEstate = '';
        this.apiResponseCustomer = '';
        this.isLoading = false;
        this.notarterminNotOccuredPorcess = false;
        this.notarterminOccuredProcess = false;
        this.submitProcess = false;
        this.rejectProcess = false;
        this.rejectReason = '';
        this.editProcess = false;
        this.documents = {
          gwgExternal: false,
          gwgInternal: false,
          fee: false,
        };
        this.additionalNotification = '';
        this.investmentKind = '';
        this.showInvestmentDropdown = false;
        this.dropdownRelativePosition = false;
        this.investementKindList = {
          0: 'Kapitalanlage',
          1: 'Selbstnutzer',
          2: 'Mieterkauf'
        };
        this.isDateInFuture = false;
        this.cardFeedbackMessage = '';
        this.editRealEstatePrice = 0;
        this.formValidation = {
          gwgExternal: true,
          investmentKind: true,
        };
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
      investementKindSelection(clickedText) {
        this.investmentKind = clickedText;
        this.showInvestmentDropdown = false;
      },
      closeDropdowns() {
        this.showInvestmentDropdown = false;
      },
      updateSalesPrice(){
        if ( typeof this.editRealEstatePrice === 'number'){
          this.apiResponse.saleprice = this.editRealEstatePrice;
        } else {
          if ( this.editRealEstatePrice.includes('.') ){
            this.apiResponse.saleprice = this.editRealEstatePrice.replace(/\./g, '')
          }
        }
      },
      updateData(data) {
        if ( data.documents ){
          if ( data.documents.gwg_customer ){
            this.documents.gwgExternal = data.documents.gwg_customer;
          }
          if ( data.documents.gwg_internal ){
            this.documents.gwgInternal = data.documents.gwg_internal;
          }
          if ( data.documents.fee ){
            this.documents.fee = data.documents.fee;
          }
        }
        if ( data.investment_kind ){
          this.investmentKind = data.investment_kind;
        }
        if ( data.additional_notice ){
          this.additionalNotification = data.additional_notice;
        }
      },
      async checkIfGifShow(status) {
        if ( status === 1 ){
          this.disableGif = false;
        }
        // reset gif after 3 secs
        await new Promise(r => this.timeout = setTimeout(r, 5000));
        this.disableGif = true;
      }
    },
    watch: {
      $route(to, from){
        // Exec only when this router child component is requested
        if ( to.name === 'singleVerkaufsmeldungView' ){
          // this.isLoading = true;
          this.verkaufsmeldungsId = this.$route.params.id;
          this.getSingleCardData();
          this.isOpenModal = true;
        }

        if ( to.name !== 'singleVerkaufsmeldungView' ){
          this.resetData();
        }
      },
      'apiResponse.notartermin_status': function(newVal) {
        if ( newVal && parseInt(newVal) === 1 ){
          this.checkIfGifShow(parseInt(newVal));
        }
      }
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal, isLoading: isLoading }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <CardTitle :reservationId="verkaufsmeldungsId" :cardCreateDate="apiResponse.create_date" :displayOptionsIcon="false" titleType="verkaufsmeldung"></CardTitle>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body" v-if="!disableGif">
        <div class="gif" style="pointer-events: none;">
          <div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/KWGL8JEkrjXRC" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>
        </div>
      </div>

      <div class="modal-body" v-else>

        <div class="verkaufsmeldung-occur" v-if="parseInt(apiResponse.notartermin_status) === 0">
          <span v-if="!isDateInFuture">Bevor eine Verkaufsmeldung eingesehen werden kann. Muss bestätigt werden, dass der Notartermin stattgefunden hat.</span>
          <span v-else>Der Notartermin liegt in der Zukunft und konnte noch nicht stattfinden. Warten Sie bitte bis dieser stattfinden konnte.<br><br>
          <b>Datum des Notartermins:</b> {{ this.englishDateWithTimeToGermanDate(apiResponse.notartermin_date) }}</span>
        </div>

        <div class="real-estates-list" v-if="parseInt(apiResponse.notartermin_status) > 0 && !rejectProcess">
          <div class="real-estate-list-item">

            <div class="row-wrapper">

              <div class="row">
                <div class="real-estate-projectname">{{ apiResponseRealEstate.real_estate_project_name }}</div>
                <div class="real-estate-nr">{{ apiResponseRealEstate.real_estate_id }}</div>
              </div>
              <div class="row">
                <div class="real-estate-street">{{ apiResponseRealEstate.real_estate_street }}</div>
                <div class="real-estate-type" v-if="apiResponseRealEstate.real_estate_object_type">Type: {{ this.uppercaseFirstLetter(apiResponseRealEstate.real_estate_object_type) }}</div>
                <div class="real-estate-type" v-else>Type: -</div>
              </div>

              <div class="row">
                <div class="real-estate-price" v-if="apiResponseRealEstate.real_estate_basement_nr">Keller: {{ apiResponseRealEstate.real_estate_basement_nr }}</div>
                <div class="real-estate-price" v-else>Keller: -</div>

                <div class="real-estate-price" v-if="apiResponse.saleprice">{{ this.numberWithComma(apiResponse.saleprice) }} {{ this.$currency }}</div>
                <div class="real-estate-price" v-else>-</div>
              </div>

            </div>

          </div>
        </div>

        <div class="verkaufsmeldung-data" v-if="parseInt(apiResponse.notartermin_status) > 0 && !rejectProcess">
          <div>
            <Transition name="fadein">
              <div v-if="apiResponse.create_date"><b>Datum:</b> {{ this.englishDateWithTimeToGermanDate(apiResponse.create_date) }}</div>
            </Transition>
            <Transition name="fadein">
              <div><b>Kunde:</b> {{ apiResponseCustomer.client_salutation }} {{ apiResponseCustomer.client_first_name }} {{ apiResponseCustomer.client_last_name }}</div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponse.notartermin_date">
                <b>Beurkundung am: </b>
                <span v-if="!apiResponse.notartermin_date">Keine Angabe</span>
                <span v-else>{{ this.englishDateWithTimeToGermanDate(apiResponse.notartermin_date) }}</span>
              </div>
            </Transition>
          </div>
          <div>
            <Transition name="fadein">
              <div>
                <b>Vertriebs­kaufpreis: </b>
                <span v-if="apiResponse.saleprice">{{ this.numberWithComma(apiResponse.saleprice) }} {{ this.$currency }}</span>
                <span v-else>Keine Angaben</span>
              </div>
            </Transition>
            <Transition name="fadein">
              <div>
                <b>Beurkundeter Kaufpreis: </b>
                <span v-if="realEstateBeurkundetPrice">{{ this.numberWithComma(realEstateBeurkundetPrice) }} {{ this.$currency }}</span>
                <span v-else>Keine Angaben</span>
              </div>
            </Transition>
            <Transition name="fadein">
              <div v-if="this.getUserRole() >= 2">
                <b>Lieferpreis aktuell: </b>
                <span v-if="realEstateLieferPrice">{{ parseInt(realEstateLieferPrice).toLocaleString("de-DE") }} {{ this.$currency }}</span>
                <span v-else>Keine Angaben</span>
              </div>
            </Transition>
          </div>

        </div>

        <div class="verkaufsmeldung-data" v-if="parseInt(apiResponse.notartermin_status) > 0 && !rejectProcess && !editProcess">

          <form class="documents">
            <label for="gwgExternal" class="option-wrapper" :class="{'invalid': !formValidation.gwgExternal}">
              GWG-Kundenfragebogen liegt vor:
              <InputField inputType="checkbox" inputName="gwgExternal" :inputValue="documents.gwgExternal" v-model="documents.gwgExternal"></InputField>
            </label>

            <label for="gwgInternal" class="option-wrapper">
              GWG-Internfragenbogen liegt vor:
              <InputField inputType="checkbox" inputName="gwgInternal" :inputValue="documents.gwgInternal" v-model="documents.gwgInternal"></InputField>
            </label>

            <label for="fee" class="option-wrapper">
              Reservierungsgebühr:
              <InputField inputType="checkbox" inputName="fee" :inputValue="documents.fee" v-model="documents.fee"></InputField>
            </label>
          </form>

        </div>

        <div class="verkaufsmeldung-data" v-if="parseInt(apiResponse.notartermin_status) > 0 && !rejectProcess && !editProcess">

          <div class="additional">
            <form>
              <div class="field-wrapper">
                <TextAreaField inputPlaceholder="Weitere Besonderheiten" :inputVal="additionalNotification" inputName="additionalNotification" v-model="additionalNotification"></TextAreaField>
                <label class="ph">Weitere Besonderheiten</label>
              </div>
            </form>
          </div>

          <div class="additional">
            <form>
              <div class="field-wrapper fee-conditional" v-if="documents.fee">
                <InputField inputType="text" inputPlaceholder="Gebühr" inputName="realEstateFee" :inputValue="this.numberWithComma(this.apiResponse.fee)" v-model="this.apiResponse.fee" ></InputField>
                <label class="ph">Gebühr</label>
              </div>
              <div class="field-wrapper" :class="{'invalid': !formValidation.investmentKind}">
                <InputField class="dropdown-input field" ref="inputInvestmentKind" inputType="text" inputPlaceholder="Investementart" inputName="InvestmentKind" :inputValue="investmentKind" v-model="investmentKind" @focus="setDropdownTop($event)" @click="showInvestmentDropdown = true" @click.stop=""></InputField>
                <label class="ph">Investmentart <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownInvestmentKind" :class="{active: showInvestmentDropdown, relative: dropdownRelativePosition}" :renderingObject="this.investementKindList" @dropdown-item-clicked="investementKindSelection" @click.stop=""></Dropdown>
              </div>
            </form>
          </div>

        </div>

        <div class="verkaufsmeldun-data" v-if="rejectProcess">
          <div>
            <form class="reject">
              <div class="field-wrapper">
                <TextAreaField inputPlaceholder="Grund der Ablehnung" inputName="rejectReason" :inputVal="rejectReason" v-model="rejectReason"></TextAreaField>
                <label class="ph">Grund der Ablehnung</label>
              </div>
            </form>
          </div>
        </div>

        <div class="edit-real-estate" v-if="editProcess">
          <div class="field-wrapper">
            <InputField inputType="text" inputPlaceholder="Preis" inputName="realEstateSalesprice" :inputValue="this.numberWithComma(editRealEstatePrice)" v-model="editRealEstatePrice" ></InputField>
            <label class="ph">Preis</label>
          </div>
        </div>

        <div class="actions" v-if="parseInt(apiResponse.notartermin_status) === 0 && !isDateInFuture">

          <Button type="delete" @click="notarterminNotOccuredPorcess = true" v-if="!notarterminNotOccuredPorcess && !notarterminOccuredProcess">Nicht stattgefunden</Button>
          <Button type="delete" @click="notarterminNotOccuredPorcess = false" v-if="notarterminNotOccuredPorcess">abbrechen</Button>
          <Button type="delete full" @click="updateNotarterminOccured(false)" v-if="notarterminNotOccuredPorcess">bestätigen</Button>

          <Button type="create reservation" @click="notarterminOccuredProcess = true" v-if="!notarterminNotOccuredPorcess && !notarterminOccuredProcess">Notartermin Stattgefunden</Button>
          <Button type="delete" @click="notarterminOccuredProcess = false" v-if="notarterminOccuredProcess">abbrechen</Button>
          <Button type="create reservation" @click="updateNotarterminOccured(true)" v-if="notarterminOccuredProcess">bestätigen</Button>
        </div>

        <div class="actions" v-if="parseInt(apiResponse.notartermin_status) === 1">

          <router-link :to="{name: 'singleReservationView', params:{ id: parseInt(apiResponse.reservation_id) }}" v-if="!submitProcess">
            <Button type="delete">Zurück</Button>
          </router-link>

          <Button type="delete" @click="submitProcess = false" v-if="submitProcess">abbrechen</Button>
          <Button type="create reservation" @click="submitVerkaufsmeldungAsAgent(); submitProcess = false" v-if="submitProcess">Bestätigen</Button>

          <Button type="create reservation" @click="submitProcess = true" v-if="!submitProcess && !editProcess">
            Einreichen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions">

          <router-link :to="{name: 'singleReservationView', params:{ id: parseInt(apiResponse.reservation_id) }}" v-if="!rejectProcess && !editProcess && !submitProcess && parseInt(apiResponse.notartermin_status) === 2" :style="{'flex-basis': parseInt(apiResponse.notartermin_status) === 3 ? '100%': ''}">
            <Button type="delete">Zurück</Button>
          </router-link>

          <Button type="delete full" @click="rejectProcess = true" v-if="!rejectProcess && !submitProcess && !editProcess && parseInt(apiResponse.notartermin_status) === 2">Ablehnen</Button>
          <Button type="delete" @click="rejectProcess = false" v-if="rejectProcess && parseInt(apiResponse.notartermin_status) === 2">abbrechen</Button>
          <Button type="delete full" @click="reject" v-if="rejectProcess && parseInt(apiResponse.notartermin_status) === 2">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="delete" @click="editProcess = false" v-if="editProcess && parseInt(apiResponse.notartermin_status) === 2">abbrechen</Button>
          <Button type="create reservation" @click="editProcess = false; updateSalesPrice()" v-if="editProcess && parseInt(apiResponse.notartermin_status) === 2">
            Speichern
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
          <Button type="create reservation" @click="editProcess = true" v-if="!editProcess && !rejectProcess && !submitProcess && parseInt(apiResponse.notartermin_status) === 2" style="flex-basis: 100%;">Verkaufspreis bearbeiten</Button>

          <Button type="create reservation" class="full-width" @click="submitProcess = true" v-if="!rejectProcess && !submitProcess && !editProcess && parseInt(apiResponse.notartermin_status) === 2">Akzeptieren</Button>
          <Button type="delete" @click="submitProcess = false" v-if="submitProcess && parseInt(apiResponse.notartermin_status) === 2">abbrechen</Button>

          <Button type="create reservation" @click="submitFinalVerkaufsmeldung" v-if="submitProcess && parseInt(apiResponse.notartermin_status) === 2">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

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
