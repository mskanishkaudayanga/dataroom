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
  import CanbanReservationForm from "@/components/forms/CanbanReservationForm.vue";
  import SearchCriteriaForm from "@/components/forms/SearchCriteriaForm.vue";
  import NewDataRoomTool from "../newDataRoomTool.vue";

  export default {
    name: "canbanModalMakeLeadQualified",
    components: {
      NewDataRoomTool,
      SearchCriteriaForm,
      CanbanReservationForm,
      TextAreaField,
      AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.id,
        customerSysId: this.$route.params.customerSysId,
        submitProcess: false,
        dropdownRelativePosition: false,
        isEditModus: false,
        existingSearchCriteriaId: '',
        isFocusedNotice: false,
        apiUsersResponse: [],
        apiUsersResponseTranformedNewDataroom: {
          dataset: {}
        },
        searchInputDistrict: '',
        searchInputCounty: '',
        searchInputCity: '',

        filteredCountiesDropdown: '',

        typeOfQualified: '',

        jumpToFilteringTool: true,

        searchCriteria: {
        },

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
          selectedOfficeLocation: {
            required: true,
            value: 'Büro Berlin Unter den Linden',
            valid: true,
          },
          customerNotification: true,
        },

        dropdownContents: {
          purpose: [
              'Selbstnutzung',
              'Kapitalanlage'
          ],
          timeOfPurchase: [
              'Jetzt',
              'In den kommenden Jahren',
              'Unklar'
          ],
          buyExperience: [
            'Erstkäufer',
            'Fortgeschrittener',
            'Profi-Käufer'
          ],
          typeOfUse: [
            'Wohnen',
            'Gewerbe',
            'Parken'
          ],
          rentStatus: [
            'Vermietet',
            'Bezugsfrei',
            'Bezugsfertig',
            'Im Bau',
            'Egal',
          ],
          districtWithParts: {
            'Alle': ['Alle'],
            'Mitte': [
              'Mitte',
              'Moabit',
              'Hansaviertel',
              'Tiergarten',
              'Wedding',
              'Gesundbrunnen'
            ],
            'Friedrichshain-Kreuzberg': [
              'Friedrichshain',
              'Kreuzberg'
            ],
            'Pankow': [
              'Prenzlauer-Berg',
              'Weißensee',
              'Blankenburg',
              'Heinersdorf',
              'Karow',
              'Stadtrandsiedlung-Malchow',
              'Pankow',
              'Blankenfelde',
              'Buch',
              'Französisch-Buchholz',
              'Niederschönhausen',
              'Rosenthal',
              'Wilhelmsruh',
            ],
            'Charlottenburg-Wilmersdorf': [
              'Charlottenburg',
              'Wilmersdorf',
              'Schmargendorf',
              'Grunewald',
              'Westend',
              'Charlottenburg-Nord',
              'Halensee',
            ],
            'Spandau': [
              'Spandau',
              'Haselhorst',
              'Siemensstadt',
              'Staaken',
              'Gatow',
              'Kladow',
              'Hakenfelde',
              'Falkenhagener-Feld',
              'Wilhelmstadt'
            ],
            'Steglitz-Zehlendorf': [
              'Steglitz',
              'Lichterfelde',
              'Lankwitz',
              'Zehlendorf',
              'Dahlem',
              'Nikolassee',
              'Wannsee',
              'Schlachtensee'
            ],
            'Tempelhof-Schöneberg': [
              'Schöneberg',
              'Friedenau',
              'Tempelhof',
              'Mariendorf',
              'Marienfelde',
              'Lichtenrade'
            ],
            'Neukölln': [
              'Neukölln',
              'Britz',
              'Buckow',
              'Rudow',
              'Gropiusstadt'
            ],
            'Treptow-Köpenick': [
              'Alt-Treptow',
              'Plänterwald',
              'Baumschulenweg',
              'Johannisthal',
              'Niederschöneweide',
              'Altglienicke',
              'Adlershof',
              'Bohnsdorf',
              'Oberschöneweide',
              'Köpenick',
              'Friedrichshagen',
              'Rahnsdorf',
              'Grünau',
              'Müggelheim',
              'Schmöckwitz'
            ],
            'Marzahn-Hellersdorf': [
              'Marzahn',
              'Biesdorf',
              'Kaulsdorf',
              'Mahlsdorf',
              'Hellersdorf'
            ],
            'Lichtenberg': [
              'Friedrichsfelde',
              'Karlshorst',
              'Lichtenberg',
              'Falkenberg',
              'Malchow',
              'Wartenberg',
              'Neu-Hohenschönhausen',
              'Alt-Hohenschönhausen',
              'Fennpfuhl',
              'Rummelsburg',
            ],
            'Reinickendorf': [
              'Reinickendorf',
              'Tegel',
              'Konradshöhe',
              'Heiligensee',
              'Frohnau',
              'Hermsdorf',
              'Waidmannslust',
              'Lübars',
              'Wittenau',
              'Märkisches-Viertel',
              'Borsigwalde',
            ],
          },
          countyWithCities: {
            'Alle': [],
            'Berlin': [],
            'Berlin/Brandenburg': [],
            'Bayern': ['München'],
            'Brandenburg': [
              'Falkensee',
              'Potsdam',
              'Lynchen',
              'Vogelsdorf',
            ],
            'Hessen': [
              'Frankfurt a.M.',
              'Hattersheim',
              'Wiesbaden',
            ],
            'Mecklenburg-Vorpommern': [],
          },
          newOrExisting: [
              'Neubau',
              'Bestand',
              'Beides'
          ],
          kindOfFinance: [
              'Eigene Mittel',
              'Finanzierung',
          ],
          approvedFinance: [
              'Ja',
              'Nein',
          ],
          appointmentKind: [
              'Besichtigung',
              'Treffen im Showroom UdL',
              'Treffen im Projekt-Showroom',
              'Bürotermin',
              'Telefontermin'
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
          beachCategory: [
            '1.0 - At the sea',
            '2.0 - 400m - 600m from the sea',
            '3.0 - 700m - 900m from the sea',
            '4.0 - 1-3km from the sea',
            '5.0 - 4-6km from the sea',
            '6.0 - 7-9km from the sea',
            '7.0 - from 10km',
          ],
          appointmentOfficeLocation: [
            'Büro Berlin Unter den Linden',
            'Büro München Max-Joseph-Straße',
            'Büro Spanien / Alicante',
          ],
        },

        dropdowns: {
          approvedFinance: false,
          appointmentKind: false,
          appointmentDuration: false,
          appointmentOfficeLocation: false,
        },

        triggerSearchCriteriaValidation: '',

      }
    },
    methods: {
      submitLead(validForm = false) {

        if ( this.typeOfQualified === 'searchCriteria' && !validForm ) {
          this.validateSubmit();
          return;
        }

        if ( this.typeOfQualified === 'appointment' && !this.validateAppointmentForm() ) {
          return;
        }

        if (this.isLoading) {
          return;
        }

        this.isLoading = true;

        // if ( this.typeOfQualified === 'searchCriteria' ) {
        //   let dataToSend = {
        //     'activityId': this.activityId,
        //     'searchCriteria': this.searchCriteria,
        //     'agentOoUsername': this.getUserOoUsername(),
        //     'searchCriteriaExistingId': this.existingSearchCriteriaId
        //   };
        //
        //   const removedNotNeededData = {};
        //   Object.entries(this.searchCriteria).forEach(([key, index]) => {
        //     removedNotNeededData[key] = index.value
        //   });
        //
        //     axios.post(this.globalApiBaseUrl + '/canban/leadToQualified', dataToSend)
        //       .then(
        //           (response) => {
        //             if (response.data.status === 200) {
        //               this.triggerCanbanReload();
        //               this.closeModal();
        //               this.notificationBannerInit('success', 'Lead erfolgreich qualifiziert');
        //               if ( this.jumpToFilteringTool ) {
        //                 this.jumpToFilterinTool(removedNotNeededData);
        //               }
        //             } else {
        //               this.notificationBannerInit('warning', 'Lead konnte nicht qualifiziert werden');
        //             }
        //           }
        //       )
        //       .catch(
        //           (error) => {
        //             console.log(error);
        //             this.notificationBannerInit('warning', 'Lead konnte nicht qualifiziert werden');
        //           }
        //       ).finally(
        //       () => {
        //         this.isLoading = false;
        //       })
        // } else
          if( this.typeOfQualified === 'appointment' ) {

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
        }

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
        this.isOpenModal = false;
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
          this.$data['searchCriteria'][field].value = field === 'city' ? [] : ['Alle'];
        }
      },
      dropdownClick(field, clickedText) {
        this.searchInputDistrict = '';
        if ( field === 'district' || field === 'city' ){
          if (this.$data['searchCriteria'][field].value.includes(clickedText)){
            this.removeMultiFilterSelection(clickedText, field);
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
        } else if ( field === 'county' ) {
          if ( clickedText === 'Berlin' || clickedText === 'Berlin/Brandenburg' ) {
            this.$data['searchCriteria']['city'].value = clickedText;
          } else {
            this.$data['searchCriteria']['city'].value = '';
          }
          this.$data['searchCriteria'][field].value = clickedText;
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
        this.triggerSearchCriteriaValidation = this.makeid(30);
      },
      checkIfIsCityAlicanteSelected() {
        if ( this.searchCriteria.city.value === 'Alicante' ){
          return true;
        }
        return false;
      },
      // searchDistrictVal(event) {
      //
      //   let inputVal = event.target.value;
      //
      //   Object.entries(this.dropdownContents.districtWithParts).forEach(([key, field]) => {
      //     inputVal = inputVal.replaceAll(key, '');
      //     inputVal = inputVal.replaceAll(',', '');
      //     // remove all whitespaces before first character
      //     inputVal = inputVal.replace(/^\s+/, '');
      //   });
      //
      //   this.searchInputDistrict = inputVal;
      // },
      // searchCountyVal(event) {
      //
      //   let inputVal = event.target.value;
      //
      //   Object.entries(this.dropdownContents.countyWithCities).forEach(([key, field]) => {
      //     inputVal = inputVal.replaceAll(key, '');
      //     inputVal = inputVal.replaceAll(',', '');
      //     // remove all whitespaces before first character
      //     inputVal = inputVal.replace(/^\s+/, '');
      //   });
      //
      //   this.searchInputCounty= inputVal;
      // },
      searchDropdownVal(event, dropdownProperty, searchInputProperty) {
        let inputVal = event.target.value;

        Object.entries(this.dropdownContents[dropdownProperty]).forEach(([key, field]) => {
          inputVal = inputVal.replaceAll(key, '');
          inputVal = inputVal.replaceAll(',', '');
          // remove all whitespaces before first character
          inputVal = inputVal.replace(/^\s+/, '');
        });

        this.$data[searchInputProperty] = inputVal;
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
                  if ( response.data.status === 200 ) {
                    this.apiUsersResponse = response.data.response;
                    if ( typeof this.apiUsersResponse.client_company === 'undefined' || this.apiUsersResponse.client_company === null || this.apiUsersResponse.client_company === '' ) {
                      this.apiUsersResponse.client_company = company;
                    }

                    for (let key in this.apiUsersResponse) {
                      if (this.apiUsersResponse.hasOwnProperty(key)) {
                        let newKey = key.replace(/^client_/, 'address_');
                        this.apiUsersResponseTranformedNewDataroom.dataset[newKey] = this.apiUsersResponse[key];
                      }
                    }
                  } else {
                    this.apiUsersResponseTranformedNewDataroom = {dataset: {}};
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
      pushCardToQualified(data) {

          let dataToSend = {
            'activityId': this.activityId,
            'agentOoUsername': this.getUserOoUsername(),
          };

          axios.post(this.globalApiBaseUrl + '/canban/leadToQualifiedByMicroserviceSC', dataToSend)
              .then(
                  (response) => {
                    if (response.data.status === 200) {
                      if ( data.jumpToFilter && typeof data.transformedObject !== 'undefined' && data.transformedObject !== null ) {
                        this.jumpToFilterinTool(data.transformedObject);
                      } else {
                        this.triggerCanbanReload();
                        this.closeModal();
                      }
                      this.notificationBannerInit('success', 'Lead erfolgreich qualifiziert');
                    } else {
                      this.notificationBannerInit('warning', 'Lead konnte nicht qualifiziert werden');
                    }
                  }
              )
              .catch(
                  (error) => {
                    console.log(error);
                    this.notificationBannerInit('warning', 'Lead konnte nicht qualifiziert werden');
                  }
              ).finally(
              () => {
                this.isLoading = false;
              })
      }
    },
    watch: {
      'searchCriteria.maxBudget.value': function(val) {
        if ( typeof this.searchCriteria.maxBudget.value === 'number' ) {
          this.searchCriteria.maxBudget.value = this.searchCriteria.maxBudget.value.toString();
        }
        if ( this.searchCriteria.maxBudget.value.includes('.') ) {
          this.searchCriteria.maxBudget.value = this.searchCriteria.maxBudget.value.replaceAll('.', '')
        }
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

        if ( val === 'Alicante' || val === 'Dubai' ) {
          this.searchCriteria.county.value = ['Alle'];
        }
      },
    },
    mounted() {
      if ( this.$route.name === 'canbanModalMakeEditSearchCriteria') {
        this.isEditModus = true;
        this.typeOfQualified = 'searchCriteria';
      }
      this.searchCustomers();
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Lead als qualifiziert markieren</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <div class="field-wrapper radios" style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: solid 1px var(--light-light-gray)" v-if="!isEditModus">
          <div class="fieldgroup-label">Suchprofil, Termin oder Reservierung anlegen?</div>
          <label for="typeOfQualified" class="radio-wrapper">
            <InputField inputType="radio" id="typeOfQualified" inputName="typeOfQualified" value="searchCriteria" :inputValue="typeOfQualified" v-model="typeOfQualified"></InputField>
            Suchprofil
          </label>
          <label for="typeOfQualified1" class="radio-wrapper">
            <InputField inputType="radio" id="typeOfQualified1" inputName="typeOfQualified1" value="appointment" :inputValue="typeOfQualified" v-model="typeOfQualified"></InputField>
            Termin
          </label>
          <label for="typeOfQualified2" class="radio-wrapper">
            <InputField inputType="radio" id="typeOfQualified2" inputName="typeOfQualified2" value="reservation" :inputValue="typeOfQualified" v-model="typeOfQualified"></InputField>
            Reservierung
          </label>
        </div>

        <NewDataRoomTool :customerDatas="apiUsersResponseTranformedNewDataroom" :showOnlySearchCriterias="true" @finished="pushCardToQualified" v-if="typeOfQualified === 'searchCriteria' && Object.keys(apiUsersResponseTranformedNewDataroom.dataset).length > 0"></NewDataRoomTool>

<!--        <SearchCriteriaForm v-if="typeOfQualified === 'searchCriteria'" :customerDataSC="apiUsersResponse" :activityId="activityId" :triggerValidation="triggerSearchCriteriaValidation" @formValidated="submitLead(true)"></SearchCriteriaForm>-->

        <form v-if="typeOfQualified === 'appointment'">

          <div class="field-wrapper">
            <span :class="{'invalid': !appointment.kind.valid, 'valid': appointment.kind.valid }">
              <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="appointment.kind.value" v-model="appointment.kind.value" @focus="setDropdownTop($event)" @click="dropdowns.appointmentKind = !dropdowns.appointmentKind" @click.stop=""></InputField>
              <label class="ph">Terminart</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.appointmentKind, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.appointmentKind" :filterFor="appointment.kind.value" @dropdown-item-clicked="dropdownClickAppointment('kind', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper" v-if="appointment.kind.value === 'Bürotermin'">
            <span :class="{'invalid': !appointment.selectedOfficeLocation.valid, 'valid': appointment.selectedOfficeLocation.valid }">
              <InputField class="dropdown-input" ref="Kind" inputType="text" inputName="Kind" :inputValue="appointment.selectedOfficeLocation.value" v-model="appointment.selectedOfficeLocation.value" @focus="setDropdownTop($event)" @click="dropdowns.appointmentOfficeLocation = !dropdowns.appointmentOfficeLocation" @click.stop=""></InputField>
              <label class="ph">Büro</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownKind" :class="{active: dropdowns.appointmentOfficeLocation, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.appointmentOfficeLocation" :activeItems="appointment.selectedOfficeLocation.value" @dropdown-item-clicked="dropdownClickAppointment('selectedOfficeLocation', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

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

        <CanbanReservationForm v-if="typeOfQualified === 'reservation'" @reloadCanban="this.triggerCanbanReload"></CanbanReservationForm>

        <div class="actions" v-if="typeOfQualified !== 'reservation'">
          <Button type="delete" :style="typeOfQualified === '' || typeOfQualified === 'searchCriteria' ? 'flex-basis: 100%' : ''" @click="closeModal">Schließen</Button>
          <Button type="report" v-if="typeOfQualified !== 'searchCriteria' && typeOfQualified !== ''" @click="submitLead()">{{ typeOfQualified === 'appointment' ? 'Termin anlegen' : (isEditModus ? 'Suchprofil bearbeiten' : 'Suchprofil anlegen') }} <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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
