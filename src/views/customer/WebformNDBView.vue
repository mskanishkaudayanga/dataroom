<script>
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import CreateReservationProgressBar from "@/components/card/CreateReservationProgressBar.vue";
import Button from "@/components/buttons/button.vue";
import axios from "axios";
import ImageFlagGerman from "@/components/images/flag-german.vue";
import ImageFlagEnglish from "@/components/images/flag-english.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import UploadFieldArea from "@/components/forms/UploadDragAndDrop.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import CloseIcon from "@/components/icons/icon-close.vue";

export default {
  components: {
    CloseIcon,
    AsterixMarkIcon,
    UploadFieldArea,
    AnimateCircleIcon,
    ImageFlagEnglish,
    ImageFlagGerman, Button, CreateReservationProgressBar, DropdownArrow, Dropdown, InputField},
  data() {
    return {
      formDataCustomers: {
        customerOne: {
          fields: {
            capitalInvestor: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Kapitalanlage',
                en: 'Investment'
              }
            },
            salutation: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Anrede',
                en: 'Salutation'
              }
            },
            title: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Titel',
                en: 'Title'
              }
            },
            firstName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Vorname',
                en: 'Firstname'
              }
            },
            lastName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nachname',
                en: 'Lastname'
              }
            },
            birthName: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtsname',
                en: 'Birthname'
              }
            },
            dateOfBirth: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtstag',
                en: 'Date of birth'
              }
            },
            nationality: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nationalität',
                en: 'Nationality'
              }
            },
            maritalStatus: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Familienstand',
                en: 'Marital Status'
              }
            },
            propertyStatus: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Güterstand',
                en: 'Property Status'
              }
            },
            taxId: {
              required: true,
              value: '',
              valueType: 'tax',
              valid: '',
              label: {
                de: 'Steuer-ID',
                en: 'Tax id'
              }
            },
            occupation: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Beruf',
                en: 'Occupation'
              }
            },
            streetAndNr: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Straße und Nr.',
                en: 'Street and nr.'
              }
            },
            postalcode: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Postleitzahl',
                en: 'Postalcode'
              }
            },
            city: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Stadt',
                en: 'City'
              }
            },
            landlinePhone: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Festnetznummer',
                en: 'Landline phone'
              }
            },
            mobilePhone: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Handynummer',
                en: 'Mobile phone'
              }
            },
            mail: {
              required: true,
              value: '',
              valueType: 'email',
              valid: '',
              label: {
                de: 'E-Mail',
                en: 'Mail'
              }
            },
            personalIdentificationFile: {
              required: true,
              value: [],
              valueType: 'files',
              valid: '',
              label: {
                de: 'Hochladen von Personalausweis oder Reisepass',
                en: 'Upload your identity card or passport'
              }
            }
          }
        },
        customerTwo: {
          fields: {
            capitalInvestor: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Kapitalanlage',
                en: 'Investment'
              }
            },
            salutation: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Anrede',
                en: 'Salutation'
              }
            },
            title: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Titel',
                en: 'Title'
              }
            },
            firstName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Vorname',
                en: 'Firstname'
              }
            },
            lastName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nachname',
                en: 'Lastname'
              }
            },
            birthName: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtsname',
                en: 'Birthname'
              }
            },
            dateOfBirth: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtstag',
                en: 'Date of birth'
              }
            },
            nationality: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nationalität',
                en: 'Nationality'
              }
            },
            maritalStatus: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Familienstand',
                en: 'Marital Status'
              }
            },
            propertyStatus: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Güterstand',
                en: 'Property Status'
              }
            },
            taxId: {
              required: true,
              value: '',
              valueType: 'tax',
              valid: '',
              label: {
                de: 'Steuer-ID',
                en: 'Tax id'
              }
            },
            occupation: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Beruf',
                en: 'Occupation'
              }
            },
            streetAndNr: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Straße und Nr.',
                en: 'Street and nr.'
              }
            },
            postalcode: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Postleitzahl',
                en: 'Postalcode'
              }
            },
            city: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Stadt',
                en: 'City'
              }
            },
            landlinePhone: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Festnetznummer',
                en: 'Landline phone'
              }
            },
            mobilePhone: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Handynummer',
                en: 'Mobile phone'
              }
            },
            mail: {
              required: true,
              value: '',
              valueType: 'email',
              valid: '',
              label: {
                de: 'E-Mail',
                en: 'Mail'
              }
            },
            personalIdentificationFile: {
              required: true,
              value: [],
              valueType: 'files',
              valid: '',
              label: {
                de: 'Hochladen von Personalausweis oder Reisepass',
                en: 'Upload your identity card or passport'
              }
            }
          }
        },
        customerThree: {
          fields: {
            capitalInvestor: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Kapitalanlage',
                en: 'Investment'
              }
            },
            salutation: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Anrede',
                en: 'Salutation'
              }
            },
            title: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Titel',
                en: 'Title'
              }
            },
            firstName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Vorname',
                en: 'Firstname'
              }
            },
            lastName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nachname',
                en: 'Lastname'
              }
            },
            birthName: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtsname',
                en: 'Birthname'
              }
            },
            dateOfBirth: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtstag',
                en: 'Date of birth'
              }
            },
            nationality: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nationalität',
                en: 'Nationality'
              }
            },
            maritalStatus: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Familienstand',
                en: 'Marital Status'
              }
            },
            propertyStatus: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Güterstand',
                en: 'Property Status'
              }
            },
            taxId: {
              required: true,
              value: '',
              valueType: 'tax',
              valid: '',
              label: {
                de: 'Steuer-ID',
                en: 'Tax id'
              }
            },
            occupation: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Beruf',
                en: 'Occupation'
              }
            },
            streetAndNr: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Straße und Nr.',
                en: 'Street and nr.'
              }
            },
            postalcode: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Postleitzahl',
                en: 'Postalcode'
              }
            },
            city: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Stadt',
                en: 'City'
              }
            },
            landlinePhone: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Festnetznummer',
                en: 'Landline phone'
              }
            },
            mobilePhone: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Handynummer',
                en: 'Mobile phone'
              }
            },
            mail: {
              required: true,
              value: '',
              valueType: 'email',
              valid: '',
              label: {
                de: 'E-Mail',
                en: 'Mail'
              }
            },
            personalIdentificationFile: {
              required: true,
              value: [],
              valueType: 'files',
              valid: '',
              label: {
                de: 'Hochladen von Personalausweis oder Reisepass',
                en: 'Upload your identity card or passport'
              }
            }
          }
        },
        customerFour: {
          fields: {
            capitalInvestor: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Kapitalanlage',
                en: 'Investment'
              }
            },
            salutation: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Anrede',
                en: 'Salutation'
              }
            },
            title: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Titel',
                en: 'Title'
              }
            },
            firstName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Vorname',
                en: 'Firstname'
              }
            },
            lastName: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nachname',
                en: 'Lastname'
              }
            },
            birthName: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtsname',
                en: 'Birthname'
              }
            },
            dateOfBirth: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtstag',
                en: 'Date of birth'
              }
            },
            nationality: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Nationalität',
                en: 'Nationality'
              }
            },
            maritalStatus: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Familienstand',
                en: 'Marital Status'
              }
            },
            propertyStatus: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Güterstand',
                en: 'Property Status'
              }
            },
            taxId: {
              required: true,
              value: '',
              valueType: 'tax',
              valid: '',
              label: {
                de: 'Steuer-ID',
                en: 'Tax id'
              }
            },
            occupation: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Beruf',
                en: 'Occupation'
              }
            },
            streetAndNr: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Straße und Nr.',
                en: 'Street and nr.'
              }
            },
            postalcode: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Postleitzahl',
                en: 'Postalcode'
              }
            },
            city: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Stadt',
                en: 'City'
              }
            },
            landlinePhone: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Festnetznummer',
                en: 'Landline phone'
              }
            },
            mobilePhone: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Handynummer',
                en: 'Mobile phone'
              }
            },
            mail: {
              required: true,
              value: '',
              valueType: 'email',
              valid: '',
              label: {
                de: 'E-Mail',
                en: 'Mail'
              }
            },
            personalIdentificationFile: {
              required: true,
              value: [],
              valueType: 'files',
              valid: '',
              label: {
                de: 'Hochladen von Personalausweis oder Reisepass',
                en: 'Upload your identity card or passport'
              }
            }
          }
        },
      },
      formBusinessBuild: {
        fields: {
          legalBodyName: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Name der juristischen Person',
              en: 'Name of legal entity'
            }
          },
          saluationPersonal: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Anrede des Vertreters',
              en: 'Salutation of the representative'
            }
          },
          titlePersonal: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Titel des Vertreters',
              en: 'Title of the representative'
            }
          },
          firstnamePersonal: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Vorname des Vertreters',
              en: 'Firstname of the representative'
            }
          },
          lastnamePersonal: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Nachname des Vertreters',
              en: 'Surname of the representative'
            }
          },
          phone: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Telefonnummer',
              en: 'Phone'
            }
          },
          mail: {
            required: true,
            value: '',
            valueType: 'email',
            valid: '',
            label: {
              de: 'E-Mail',
              en: 'Mail'
            }
          },
          streetAndNr: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Straße und Nr.',
              en: 'Street and Nr.'
            }
          },
          postalcode: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Postleitzahl',
              en: 'Postalcode'
            }
          },
          city: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Stadt',
              en: 'City'
            }
          },
        }
      },
      formBankBuild: {
        fields: {
          accountOwner: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Kontoinhaber',
              en: 'Account owner'
            }
          },
          bank: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Kreditinstitut',
              en: 'Bankname'
            }
          },
          iban: {
            required: true,
            value: '',
            valueType: 'iban',
            valid: '',
            label: {
              de: 'IBAN',
              en: 'IBAN'
            }
          },
          bic: {
            required: true,
            value: '',
            valueType: 'bic',
            valid: '',
            label: {
              de: 'BIC',
              en: 'BIC'
            }
          },
        }
      },
      kindOfPurchaser: 'privat',
      countOfPurchaser: 1,
      language: 'DEU',
      dropdownRelativePosition: false,
      showSalutationDropdown: false,
      showNationalityDropdown: false,
      showMaritalStatusDropdown: false,
      showPropertystatusDropdown: false,
      showCapitalInvestDropdown: false,

      maxSteps: 6,
      currentStep: 1,
      currentStepValidator: true,

      apiError: '',
      apiResponseReservation: '',
      apiResponseCustomer: '',

      ndbAlreadySubmitted: false,
      noTokenFound: false,
      tokenValue: this.$route.query.token,

      submitHandler: {
        formSubmitted: false,
        message: '',
      },

      toolTipContents: {
        0: {
          'de': 'Ihre Steuer-ID finden Sie in der Regel in dem Schreiben der Bundeszentralamt für Steuern. Das Format variiert je nach Bundesland, in dem Sie leben, hat aber meistens 11 Ziffern zum Beispiel 133/8150/8159. Bitte verwechseln Sie Ihre Steuer-ID nicht mit Ihrer Sozialversicherungsnummer.',
          'en': 'You can usually find your tax number in the letter from the Federal Central Tax Office. The format varies depending on the federal state you live in, but usually has 11 digits in the following 133/8150/8159. Please do not confuse your tax number with your national insurance number.',
        },
      },

      showToolTips: false,
      currentToolTipContent: 0,

      isLoading: false,
    }
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    dropdownClick(customer, propertyToUpdate, clickedText) {
      this.formDataCustomers[customer].fields[propertyToUpdate].value = clickedText;
      this.closeDropdowns();
    },
    salutationSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.salutation.value = clickedText;
      this.showSalutationDropdown = false;
    },
    salutationSecondCustomerSelection(clickedText) {
      this.formDataCustomers.customerTwo.fields.salutation.value = clickedText;
      this.showSalutationDropdown = false;
    },
    nationalitySelection(clickedText) {
      this.formDataCustomers.customerOne.fields.nationality.value = clickedText;
      this.showNationalityDropdown = false;
    },
    nationalitySecondCustomerSelection(clickedText) {
      this.formDataCustomers.customerTwo.fields.nationality.value = clickedText;
      this.showNationalityDropdown = false;
    },
    maritalStatusSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.maritalStatus.value = clickedText;
      this.showMaritalStatusDropdown = false;
    },
    maritalStatusSecondCustomerSelection(clickedText) {
      this.formDataCustomers.customerTwo.fields.maritalStatus.value = clickedText;
      this.showMaritalStatusDropdown = false;
    },
    propertyStatusSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.propertyStatus.value = clickedText;
      this.showPropertystatusDropdown = false;
    },
    propertyStatusSecondCustomerSelection(clickedText) {
      this.formDataCustomers.customerTwo.fields.propertyStatus.value = clickedText;
      this.showPropertystatusDropdown = false;
    },
    capitalInvestSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.capitalInvestor.value = clickedText;
      this.showCapitalInvestDropdown = false;
    },
    capitalInvestSecondCustomerSelection(clickedText) {
      this.formDataCustomers.customerTwo.fields.capitalInvestor.value = clickedText;
      this.showCapitalInvestDropdown = false;
    },
    renderToolTip(toolNr) {
      if (this.language === 'DEU') {
        return this.toolTipContents[toolNr]['de'];
      } else {
        return this.toolTipContents[toolNr]['en'];
      }
    },
    closeDropdowns() {
      this.showSalutationDropdown = false;
      this.showNationalityDropdown = false;
      this.showMaritalStatusDropdown = false;
      this.showPropertystatusDropdown = false;
      this.showCapitalInvestDropdown = false;
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
    async checkToken() {
      this.isLoading = true;
      if ( this.$route.query.token ) {
        let token = this.$route.query.token;
        await axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservationBasedOnTokenAndUsage?token='+token+'&formType=ndb&pub=true&pub=true')
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiResponseReservation = response.data.response[0];
                    if ( this.apiResponseReservation.reservation_status && parseInt(this.apiResponseReservation.reservation_status) >= 5 ){
                      this.ndbAlreadySubmitted = true;
                    }
                  } else {
                    this.ndbAlreadySubmitted = true;
                  }
                }
            )
            .catch(
                (error) => {
                  this.apiError = error;
                }
            )

        await axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.apiResponseReservation.customer_kdnr+'&company='+this.apiResponseReservation.company+'&onlyCustomerNrSearch=true&pub=true')
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiResponseCustomer = response.data.response.client_data[0];
                  }
                }
            )
            .catch(
                (error) => {
                  this.apiError = error;
                }
            )
      } else {
        this.noTokenFound = true;
      }
      this.isLoading = false;
    },
    checkIfStepIsValid() {
      let formValidation = true;

      if ( this.currentStep === 2 ){
        if ( !this.kindOfPurchaser || this.kindOfPurchaser === '' ) {
          formValidation = false;
        }

        if ( this.kindOfPurchaser === 'business' ){
          Object.entries(this.formBusinessBuild.fields).forEach(([key, field]) => {
            if ( field.required ){
              if ( field.value === undefined || field.value === ''){
                this.formBusinessBuild.fields[key].valid = false;
                formValidation = false;
              } else {
                if (  field.valueType === 'email' ) {
                  if ( this.isValidEmail(field.value) ) {
                    this.formBusinessBuild.fields[key].valid = true;
                  } else {
                    this.formBusinessBuild.fields[key].valid = false;
                    formValidation = false;
                  }
                } else {
                  this.formBusinessBuild.fields[key].valid = true;
                }
              }
            }
          });
        }
      }

      if (this.currentStep === 4) {
        Object.entries(this.formDataCustomers.customerOne.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === '' || field.value === []){
              this.formDataCustomers.customerOne.fields[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'email' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.formDataCustomers.customerOne.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerOne.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'files') {
                if ( field.value.length > 0 ) {
                  this.formDataCustomers.customerOne.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerOne.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'tax') {
                if ( this.isValidSteuerId(field.value) ) {
                  this.formDataCustomers.customerOne.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerOne.fields[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.formDataCustomers.customerOne.fields[key].valid = true;
              }
            }
          }
        });
      }

      if (parseInt(this.countOfPurchaser) >= 2 && this.currentStep === 5) {
        Object.entries(this.formDataCustomers.customerTwo.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === '' || field.value === []){
              this.formDataCustomers.customerTwo.fields[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'email' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.formDataCustomers.customerTwo.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerTwo.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'files') {
                if ( field.value.length > 0 ) {
                  this.formDataCustomers.customerTwo.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerTwo.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'tax') {
                if ( this.isValidSteuerId(field.value) ) {
                  this.formDataCustomers.customerOne.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerOne.fields[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.formDataCustomers.customerTwo.fields[key].valid = true;
              }
            }
          }
        });
      }

      if (parseInt(this.countOfPurchaser) >= 3 && this.currentStep === 6) {
        Object.entries(this.formDataCustomers.customerThree.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === '' || field.value === []){
              this.formDataCustomers.customerThree.fields[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'email' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.formDataCustomers.customerThree.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerThree.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'files') {
                if ( field.value.length > 0 ) {
                  this.formDataCustomers.customerThree.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerThree.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'tax') {
                if ( this.isValidSteuerId(field.value) ) {
                  this.formDataCustomers.customerOne.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerOne.fields[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.formDataCustomers.customerThree.fields[key].valid = true;
              }
            }
          }
        });
      }

      if ( parseInt(this.countOfPurchaser) >= 4 && this.currentStep === 7 ) {
        Object.entries(this.formDataCustomers.customerFour.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === '' || field.value === []){
              this.formDataCustomers.customerFour.fields[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'email' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.formDataCustomers.customerFour.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerFour.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'files') {
                if ( field.value.length > 0 ) {
                  this.formDataCustomers.customerFour.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerFour.fields[key].valid = false;
                  formValidation = false;
                }
              } else if (field.valueType === 'tax') {
                if ( this.isValidSteuerId(field.value) ) {
                  this.formDataCustomers.customerOne.fields[key].valid = true;
                } else {
                  this.formDataCustomers.customerOne.fields[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.formDataCustomers.customerFour.fields[key].valid = true;
              }
            }
          }
        });
      }

      if ( this.currentStep === (parseInt(this.countOfPurchaser) + 4) ) {
        Object.entries(this.formBankBuild.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === ''){
              this.formBankBuild.fields[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'bic' ) {
                if ( this.isValidBIC(field.value) ) {
                  this.formBankBuild.fields[key].valid = true;
                } else {
                  this.formBankBuild.fields[key].valid = false;
                  formValidation = false;
                }
              } else if ( field.valueType === 'iban' ) {
                if ( this.isValidIBANNumber(field.value) ) {
                  this.formBankBuild.fields[key].valid = true;
                } else {
                  this.formBankBuild.fields[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.formBankBuild.fields[key].valid = true;
              }
            }
          }
        });
      } else if( this.currentStep === (parseInt(this.countOfPurchaser) + 5)){
        Object.entries(this.formBankBuild.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === ''){
              this.formBankBuild.fields[key].valid = false;
              formValidation = false;
            } else {
              if (  field.valueType === 'bic' ) {
                if ( this.isValidBIC(field.value) ) {
                  this.formBankBuild.fields[key].valid = true;
                } else {
                  this.formBankBuild.fields[key].valid = false;
                  formValidation = false;
                }
              } else if ( field.valueType === 'iban' ) {
                if ( this.isValidIBANNumber(field.value) ) {
                  this.formBankBuild.fields[key].valid = true;
                } else {
                  this.formBankBuild.fields[key].valid = false;
                  formValidation = false;
                }
              } else {
                this.formBankBuild.fields[key].valid = true;
              }
            }
          }
        });
      }

      if ( !formValidation ) {
        this.currentStepValidator = formValidation;
      } else {
        this.currentStep += 1;
      }
    },
    languageBasedlabel(fieldData){
      if (this.language === 'DEU'){
        return fieldData.de;
      } else {
        return fieldData.en;
      }
    },
    submitData() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;

      let dataToSubmit = {
        'formDataCustomers': this.formDataCustomers,
      }

      if ( parseInt(this.countOfPurchaser) === 1 ) {
        delete dataToSubmit.formDataCustomers.customerTwo;
        delete dataToSubmit.formDataCustomers.customerThree;
        delete dataToSubmit.formDataCustomers.customerFour;
      } else if ( parseInt(this.countOfPurchaser) === 2 ) {
        delete dataToSubmit.formDataCustomers.customerThree;
        delete dataToSubmit.formDataCustomers.customerFour;
      } else if ( parseInt(this.countOfPurchaser) === 3 ) {
        delete dataToSubmit.formDataCustomers.customerFour;
      }

      let formData = new FormData();
      formData.append('token', this.tokenValue);
      formData.append('formDataCustomers', JSON.stringify(dataToSubmit.formDataCustomers));
      formData.append('formBankBuild', JSON.stringify(this.formBankBuild));

      if ( this.kindOfPurchaser !== 'privat' ) {
        formData.append('formBusinessBuild', JSON.stringify(this.formBusinessBuild));
      }

      Object.entries(dataToSubmit.formDataCustomers).forEach(([key, field]) => {
        let l = 0;
        for( const index of field.fields.personalIdentificationFile.value ) {
          formData.append(key+'[]', index);
          l += 1;
        }
      });

      axios.post(this.globalApiBaseUrl + '/reservations/submitNDBClientForm', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(
            (response) => {
              if ( response.data.status === 200 ) {
                this.submitHandler.formSubmitted = true;
                this.submitHandler.message = 'Ihre Daten sind bei uns erfolgreich eingetroffen.';
              } else {
                this.submitHandler.message = 'Es ist ein Fehler aufgetreten.';
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
        })
    },
    updateFileOfIdentitiy(customer, files) {
      this.formDataCustomers[customer].fields.personalIdentificationFile.value = files;
    }
  },
  watch: {
    apiResponseCustomer: function() {
      this.language = this.apiResponseCustomer.client_language;
      this.formDataCustomers.customerOne.fields.salutation.value = this.apiResponseCustomer.client_salutation;
      this.formDataCustomers.customerOne.fields.title.value = this.apiResponseCustomer.client_title;
      this.formDataCustomers.customerOne.fields.firstName.value = this.apiResponseCustomer.client_first_name;
      this.formDataCustomers.customerOne.fields.lastName.value = this.apiResponseCustomer.client_last_name;
      if ( typeof this.apiResponseCustomer.client_birthday !== 'undefined' && this.apiResponseCustomer.client_birthday !== '' ) {
        this.formDataCustomers.customerOne.fields.dateOfBirth.value = this.germanDateToEnglishDateFormat(this.apiResponseCustomer.client_birthday);
      } else {
        this.formDataCustomers.customerOne.fields.dateOfBirth.value = '';
      }
      // this.formDataCustomers.customerOne.fields.nationality.value = this.apiResponseCustomer.client_nationality;
      this.formDataCustomers.customerOne.fields.streetAndNr.value = this.apiResponseCustomer.client_address;
      this.formDataCustomers.customerOne.fields.postalcode.value = this.apiResponseCustomer.client_postal_code;
      this.formDataCustomers.customerOne.fields.city.value = this.apiResponseCustomer.client_city;
      this.formDataCustomers.customerOne.fields.mobilePhone.value = this.apiResponseCustomer.client_phone;
      this.formDataCustomers.customerOne.fields.mail.value = this.apiResponseCustomer.client_email;
      this.formBankBuild.fields.bank.value = this.apiResponseCustomer.client_credit_institution;
      this.formBankBuild.fields.bic.value = this.apiResponseCustomer.client_bic;
      this.formBankBuild.fields.iban.value = this.apiResponseCustomer.client_iban;

    },
    'formDataCustomers.customerOne.fields.firstName.value': function(newVal) {
      let data = newVal;
      if (this.formDataCustomers.customerOne.fields.lastName.value && this.formDataCustomers.customerOne.fields.lastName.value !== '') {
        data += ' '+this.formDataCustomers.customerOne.fields.lastName.value;
      }
      this.formBankBuild.fields.accountOwner.value = data;
    },
    'formDataCustomers.customerOne.fields.lastName.value': function(newVal) {
      let data = '';
      if (this.formDataCustomers.customerOne.fields.firstName.value && this.formDataCustomers.customerOne.fields.firstName.value !== '') {
        data += this.formDataCustomers.customerOne.fields.firstName.value;
      }
      this.formBankBuild.fields.accountOwner.value = data+' '+newVal;
    },
    countOfPurchaser(newVal) {
      this.maxSteps = 6;
      let newValue= parseInt(newVal);
      this.maxSteps = 6 + (newValue - 1);
    },
    'formDataCustomers.customerOne.fields.maritalStatus.value': function(newVal) {
      if ( typeof newVal !== 'undefined' && newVal !== '' ) {
        this.formDataCustomers.customerOne.fields.propertyStatus.valid = '';
        this.formDataCustomers.customerOne.fields.propertyStatus.value = '';
        if ( newVal.includes('married') || newVal.includes('verheiratet') ) {
          this.formDataCustomers.customerOne.fields.propertyStatus.required = true;
        } else {
          this.formDataCustomers.customerOne.fields.propertyStatus.required = false;
        }
      }
    },
    'formDataCustomers.customerTwo.fields.maritalStatus.value': function(newVal) {
      if ( typeof newVal !== 'undefined' && newVal !== '' ) {
        this.formDataCustomers.customerTwo.fields.propertyStatus.valid = '';
        this.formDataCustomers.customerTwo.fields.propertyStatus.value = '';
        if ( newVal.includes('married') || newVal.includes('verheiratet') ) {
          this.formDataCustomers.customerTwo.fields.propertyStatus.required = true;
        } else {
          this.formDataCustomers.customerTwo.fields.propertyStatus.required = false;
        }
      }
    },
    'formDataCustomers.customerThree.fields.maritalStatus.value': function(newVal) {
      if ( typeof newVal !== 'undefined' && newVal !== '' ) {
        this.formDataCustomers.customerThree.fields.propertyStatus.valid = '';
        this.formDataCustomers.customerThree.fields.propertyStatus.value = '';
        if ( newVal.includes('married') || newVal.includes('verheiratet') ) {
          this.formDataCustomers.customerThree.fields.propertyStatus.required = true;
        } else {
          this.formDataCustomers.customerThree.fields.propertyStatus.required = false;
        }
      }
    },
    'formDataCustomers.customerFour.fields.maritalStatus.value': function(newVal) {
      if ( typeof newVal !== 'undefined' && newVal !== '' ) {
        this.formDataCustomers.customerFour.fields.propertyStatus.valid = '';
        this.formDataCustomers.customerFour.fields.propertyStatus.value = '';
        if ( newVal.includes('married') || newVal.includes('verheiratet') ) {
          this.formDataCustomers.customerFour.fields.propertyStatus.required = true;
        } else {
          this.formDataCustomers.customerFour.fields.propertyStatus.required = false;
        }
      }
    }
  },
  computed: {
    renderSummary() {
      let rendering = this.language === 'DEU' ? '<div class="summary-item"><b>Erster Käufer:</b>' : '<b>First Purchaser:</b>';
      Object.entries(this.formDataCustomers.customerOne.fields).forEach(([key, field]) => {
        rendering += '<div>';
        if ( this.language === 'DEU' ){
          rendering += field.label.de + ': ' + (typeof field.value === 'object' ? 'vorhanden' : field.value);
        } else {
          rendering += field.label.en + ': ' + (typeof field.value === 'object' ? 'uploaded' : field.value);
        }
        rendering += '</div>';
      });
      rendering += '</div>';

      if ( parseInt(this.countOfPurchaser) >= 2 ){
        rendering += '<div class="summary-item">';
        rendering += this.language === 'DEU' ? '<b>Zweiter Käufer:</b>' : '<b>Second purchaser:</b>';
        Object.entries(this.formDataCustomers.customerTwo.fields).forEach(([key, field]) => {
          rendering += '<div>';
          if ( this.language === 'DEU' ){
            rendering += field.label.de + ': ' + (typeof field.value === 'object' ? 'vorhanden' : field.value);
          } else {
            rendering += field.label.en + ': ' + (typeof field.value === 'object' ? 'uploaded' : field.value);
          }
          rendering += '</div>';
        });
        rendering += '</div>';
      }

      if ( parseInt(this.countOfPurchaser) >= 3 ){
        rendering += '<div class="summary-item">';
        rendering += this.language === 'DEU' ? '<b>Dritter Käufer:</b>' : '<b>Third purchaser:</b>';
        Object.entries(this.formDataCustomers.customerThree.fields).forEach(([key, field]) => {
          rendering += '<div>';
          if ( this.language === 'DEU' ){
            rendering += field.label.de + ': ' + (typeof field.value === 'object' ? 'vorhanden' : field.value);
          } else {
            rendering += field.label.en + ': ' + (typeof field.value === 'object' ? 'uploaded' : field.value);
          }
          rendering += '</div>';
        });
        rendering += '</div>';
      }

      if ( parseInt(this.countOfPurchaser) >= 4 ){
        rendering += '<div class="summary-item">';
        rendering += this.language === 'DEU' ? '<b>Vierter Käufer:</b>' : '<b>Fourth purchaser:</b>';
        Object.entries(this.formDataCustomers.customerFour.fields).forEach(([key, field]) => {
          rendering += '<div>';
          if ( this.language === 'DEU' ){
            rendering += field.label.de + ': ' + (typeof field.value === 'object' ? 'vorhanden' : field.value);
          } else {
            rendering += field.label.en + ': ' + (typeof field.value === 'object' ? 'uploaded' : field.value);
          }
          rendering += '</div>';
        });
        rendering += '</div>';
      }

      rendering += '<div class="summary-item">';
      rendering += this.language === 'DEU' ? '<b>Bankverbindung:</b>' : '<b>Bankinformations:</b>';
      Object.entries(this.formBankBuild.fields).forEach(([key, field]) => {
        rendering += '<div>';
        if ( this.language === 'DEU' ){
          rendering += field.label.de + ': ' + field.value;
        } else {
          rendering += field.label.en + ': ' + field.value;
        }
        rendering += '</div>';
      });
      rendering += '</div>';

      return rendering;
    }
  }
}
</script>

<template>
  <div class="ndb-customer-view" @click="closeDropdowns">
    <form class="ndb-form">
      <div class="intro">
        <h2>{{ language === 'DEU' ? 'NDB Formular für den Erwerb einer Immobilie' : 'NDB information to purchase a real estate' }}</h2>
      </div>

      <div v-if="ndbAlreadySubmitted" class="missing-error-alert">
        Ihr NDB wurde bereits erfolgreich abgesendet.
      </div>

      <div v-else-if="noTokenFound" class="missing-error-alert">
        Es konnten keine Daten gefunden werden. Bitte kontaktieren Sie ihren Makler.
      </div>

      <div class="webform-body-wrapper" v-else>
        <div class="progress-bar">
          <CreateReservationProgressBar :currentStep="currentStep" :maxSteps="maxSteps"></CreateReservationProgressBar>
        </div>

        <div :class="'page-'+currentStep" v-if="currentStep === 1">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Sprache:' : 'Language:' }}</div>
          <div class="step-fields">
            <label for="languageDeu" class="radio-wrapper">
              <InputField inputType="radio" id="languageDeu" inputName="Language" value="DEU" :inputValue="language" v-model="language"></InputField>
              <imageFlagGerman></imageFlagGerman>
            </label>
            <label for="languageEng" class="radio-wrapper">
              <InputField inputType="radio" id="languageEng" inputName="Language" value="ENG" :inputValue="language" v-model="language"></InputField>
              <imageFlagEnglish></imageFlagEnglish>
            </label>
          </div>
        </div>

        <div :class="'page-'+currentStep" v-if="currentStep === 2">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Privat- oder Geschäftskunde:' : 'Private or Business customer:' }}</div>
          <div class="step-fields">
            <label for="privatField" class="radio-wrapper">
              <InputField inputType="radio" id="privatField" inputName="kindOfPurchaser" value="privat" :inputValue="kindOfPurchaser" v-model="kindOfPurchaser"></InputField>
              {{ language === 'DEU' ? 'Privatkunde' : 'Privat' }}
            </label>
            <label for="businessField" class="radio-wrapper">
              <InputField inputType="radio" id="businessField" inputName="kindOfPurchaser" value="business" :inputValue="kindOfPurchaser" v-model="kindOfPurchaser"></InputField>
              {{ language === 'DEU' ? 'Geschäftskunde' : 'Business' }}
            </label>
          </div>


          <div class="business-fields" v-if="kindOfPurchaser === 'business'">

            <div class="field-wrapper" :class="{'invalid': !formBusinessBuild.fields.legalBodyName.valid  && formBusinessBuild.fields.legalBodyName.valid !== '', 'valid': formBusinessBuild.fields.legalBodyName.valid  && formBusinessBuild.fields.legalBodyName.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.legalBodyName.label)" inputName="LegalBodyName" :inputValue="formBusinessBuild.fields.legalBodyName.value" v-model="formBusinessBuild.fields.legalBodyName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.legalBodyName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </div>

            <div class="field-wrapper two-col">
            <span :class="{'invalid': !formBusinessBuild.fields.saluationPersonal.valid  && formBusinessBuild.fields.saluationPersonal.valid !== '', 'valid': formBusinessBuild.fields.saluationPersonal.valid  && formBusinessBuild.fields.saluationPersonal.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.saluationPersonal.label)" inputName="SalutationPersonal" :inputValue="formBusinessBuild.fields.saluationPersonal.value" v-model="formBusinessBuild.fields.saluationPersonal.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.saluationPersonal.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formBusinessBuild.fields.titlePersonal.valid && formBusinessBuild.fields.titlePersonal.valid !== '', 'valid': formBusinessBuild.fields.titlePersonal.valid && formBusinessBuild.fields.titlePersonal.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.titlePersonal.label)" inputName="TitlePersonal" :inputValue="formBusinessBuild.fields.titlePersonal.value" v-model="formBusinessBuild.fields.titlePersonal.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.titlePersonal.label) }}</label>
            </span>
            </div>

            <div class="field-wrapper two-col">
            <span :class="{'invalid': !formBusinessBuild.fields.firstnamePersonal.valid && formBusinessBuild.fields.firstnamePersonal.valid !== '', 'valid': formBusinessBuild.fields.firstnamePersonal.valid && formBusinessBuild.fields.firstnamePersonal.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.firstnamePersonal.label)" inputName="FirstnameOfPersonal" :inputValue="formBusinessBuild.fields.firstnamePersonal.value" v-model="formBusinessBuild.fields.firstnamePersonal.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.firstnamePersonal.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formBusinessBuild.fields.lastnamePersonal.valid && formBusinessBuild.fields.lastnamePersonal.valid !== '', 'valid': formBusinessBuild.fields.lastnamePersonal.valid && formBusinessBuild.fields.lastnamePersonal.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.lastnamePersonal.label)" inputName="LastnameOfPersonal" :inputValue="formBusinessBuild.fields.lastnamePersonal.value" v-model="formBusinessBuild.fields.lastnamePersonal.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.lastnamePersonal.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            </div>

            <div class="field-wrapper two-col">
            <span :class="{'invalid': !formBusinessBuild.fields.phone.valid && formBusinessBuild.fields.phone.valid !== '', 'valid': formBusinessBuild.fields.phone.valid && formBusinessBuild.fields.phone.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.phone.label)" inputName="Phone" :inputValue="formBusinessBuild.fields.phone.value" v-model="formBusinessBuild.fields.phone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.phone.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formBusinessBuild.fields.mail.valid && formBusinessBuild.fields.mail.valid !== '', 'valid': formBusinessBuild.fields.mail.valid && formBusinessBuild.fields.mail.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.mail.label)" inputName="Mail" :inputValue="formBusinessBuild.fields.mail.value" v-model="formBusinessBuild.fields.mail.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.mail.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            </div>

            <div class="field-wrapper" :class="{'invalid': !formBusinessBuild.fields.streetAndNr.valid && formBusinessBuild.fields.streetAndNr.valid !== '', 'valid': formBusinessBuild.fields.streetAndNr.valid && formBusinessBuild.fields.streetAndNr.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.streetAndNr.label)" inputName="StreetAndNr" :inputValue="formBusinessBuild.fields.streetAndNr.value" v-model="formBusinessBuild.fields.streetAndNr.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.streetAndNr.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </div>

            <div class="field-wrapper two-col">
            <span :class="{'invalid': !formBusinessBuild.fields.postalcode.valid && formBusinessBuild.fields.postalcode.valid !== '', 'valid': formBusinessBuild.fields.postalcode.valid && formBusinessBuild.fields.postalcode.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.postalcode.label)" inputName="Postalcode" :inputValue="formBusinessBuild.fields.postalcode.value" v-model="formBusinessBuild.fields.postalcode.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.postalcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formBusinessBuild.fields.city.valid && formBusinessBuild.fields.city.valid !== '', 'valid': formBusinessBuild.fields.city.valid && formBusinessBuild.fields.city.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.city.label)" inputName="City" :inputValue="formBusinessBuild.fields.city.value" v-model="formBusinessBuild.fields.city.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            </div>

          </div>
        </div>

        <div :class="'page-'+currentStep" v-if="currentStep === 3">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Anzahl der Käufer:' : 'Count of buyer:' }}</div>
          <div class="step-fields">
            <label for="customer1" class="radio-wrapper">
              <InputField inputType="radio" id="customer1" inputName="customer1" value="1" :inputValue="countOfPurchaser" v-model="countOfPurchaser"></InputField>
              {{ language === 'DEU' ? '1 Käufer' : '1 Purchaser' }}
            </label>
            <label for="customer2" class="radio-wrapper">
              <InputField inputType="radio" id="customer2" inputName="customer2" value="2" :inputValue="countOfPurchaser" v-model="countOfPurchaser"></InputField>
              {{ language === 'DEU' ? '2 Käufer' : '2 Purchaser' }}
            </label>
            <label for="customer3" class="radio-wrapper">
              <InputField inputType="radio" id="customer3" inputName="customer3" value="3" :inputValue="countOfPurchaser" v-model="countOfPurchaser"></InputField>
              {{ language === 'DEU' ? '3 Käufer' : '3 Purchaser' }}
            </label>
            <label for="customer4" class="radio-wrapper">
              <InputField inputType="radio" id="customer4" inputName="customer4" value="4" :inputValue="countOfPurchaser" v-model="countOfPurchaser"></InputField>
              {{ language === 'DEU' ? '4 Käufer' : '4 Purchaser' }}
            </label>
          </div>
        </div>
        
        <div :class="'page-'+currentStep" v-if="currentStep === 4">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Erster Käufer - Informationen' : 'First purchaser informations:' }}</div>
          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.salutation.valid  && formDataCustomers.customerOne.fields.salutation.valid !== '', 'valid': formDataCustomers.customerOne.fields.salutation.valid  && formDataCustomers.customerOne.fields.salutation.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formDataCustomers.customerOne.fields.salutation.label)" inputName="Salutation" :inputValue="formDataCustomers.customerOne.fields.salutation.value" v-model="formDataCustomers.customerOne.fields.salutation.value" @focus="setDropdownTop($event)" @click="showSalutationDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.salutation.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSalutation" :class="{active: showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.salutationList : this.salutationListEN" :filterFor="formDataCustomers.customerOne.fields.salutation.value" @dropdown-item-clicked="dropdownClick('customerOne', 'salutation', $event)" @click.stop=""></Dropdown>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerOne.fields.title.valid  && formDataCustomers.customerOne.fields.title.valid !== '', 'valid': formDataCustomers.customerOne.fields.title.valid  && formDataCustomers.customerOne.fields.title.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.title.label) " inputName="Title" :inputValue="formDataCustomers.customerOne.fields.title.value" v-model="formDataCustomers.customerOne.fields.title.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.title.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.firstName.valid  && formDataCustomers.customerOne.fields.firstName.valid !== '', 'valid': formDataCustomers.customerOne.fields.firstName.valid  && formDataCustomers.customerOne.fields.firstName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.firstName.label) " inputName="Firstname" :inputValue="formDataCustomers.customerOne.fields.firstName.value" v-model="formDataCustomers.customerOne.fields.firstName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.firstName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerOne.fields.lastName.valid  && formDataCustomers.customerOne.fields.lastName.valid !== '', 'valid': formDataCustomers.customerOne.fields.lastName.valid  && formDataCustomers.customerOne.fields.lastName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.lastName.label) " inputName="Lastname" :inputValue="formDataCustomers.customerOne.fields.lastName.value" v-model="formDataCustomers.customerOne.fields.lastName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.lastName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.birthName.valid  && formDataCustomers.customerOne.fields.birthName.valid !== '', 'valid': formDataCustomers.customerOne.fields.birthName.valid  && formDataCustomers.customerOne.fields.birthName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.birthName.label) " inputName="Birthname" :inputValue="formDataCustomers.customerOne.fields.birthName.value" v-model="formDataCustomers.customerOne.fields.birthName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.birthName.label) }} </label>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerOne.fields.dateOfBirth.valid  && formDataCustomers.customerOne.fields.dateOfBirth.valid !== '', 'valid': formDataCustomers.customerOne.fields.dateOfBirth.valid  && formDataCustomers.customerOne.fields.dateOfBirth.valid !== ''}">
              <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.dateOfBirth.label) " inputName="Dateofbirth" :inputValue="formDataCustomers.customerOne.fields.dateOfBirth.value" v-model="formDataCustomers.customerOne.fields.dateOfBirth.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.dateOfBirth.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.nationality.valid  && formDataCustomers.customerOne.fields.nationality.valid !== '', 'valid': formDataCustomers.customerOne.fields.nationality.valid  && formDataCustomers.customerOne.fields.nationality.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.nationality.label) " inputName="Nationality" :inputValue="formDataCustomers.customerOne.fields.nationality.value" v-model="formDataCustomers.customerOne.fields.nationality.value" @focus="setDropdownTop($event)" @click="showNationalityDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownNationality" :class="{active: showNationalityDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" :filterFor="formDataCustomers.customerOne.fields.nationality.value" @dropdown-item-clicked="dropdownClick('customerOne', 'nationality', $event)" @click.stop=""></Dropdown>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerOne.fields.maritalStatus.valid  && formDataCustomers.customerOne.fields.maritalStatus.valid !== '', 'valid': formDataCustomers.customerOne.fields.maritalStatus.valid  && formDataCustomers.customerOne.fields.maritalStatus.valid !== ''}">
               <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.maritalStatus.label) " inputName="Maritalstatus" :inputValue="formDataCustomers.customerOne.fields.maritalStatus.value" v-model="formDataCustomers.customerOne.fields.maritalStatus.value" @focus="setDropdownTop($event)" @click="showMaritalStatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.maritalStatus.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownMaritalstatus" :class="{active: showMaritalStatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.maritalStatusList : this.maritalStatusListEN" @dropdown-item-clicked="dropdownClick('customerOne', 'maritalStatus', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.propertyStatus.valid  && formDataCustomers.customerOne.fields.propertyStatus.valid !== '', 'valid': formDataCustomers.customerOne.fields.propertyStatus.valid  && formDataCustomers.customerOne.fields.propertyStatus.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.propertyStatus.label) " inputName="Propertystatus" :inputValue="formDataCustomers.customerOne.fields.propertyStatus.value" v-model="formDataCustomers.customerOne.fields.propertyStatus.value" @focus="setDropdownTop($event)" @click="showPropertystatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.propertyStatus.label) }} <AsterixMarkIcon v-if="formDataCustomers.customerOne.fields.propertyStatus.required"></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownPropertystatus" :class="{active: showPropertystatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.propertyStatusList : this.propertyStatusListEN" @dropdown-item-clicked="dropdownClick('customerOne', 'propertyStatus', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.capitalInvestor.valid  && formDataCustomers.customerOne.fields.capitalInvestor.valid !== '', 'valid': formDataCustomers.customerOne.fields.capitalInvestor.valid  && formDataCustomers.customerOne.fields.capitalInvestor.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.capitalInvestor.label) " inputName="CapitalInvest" :inputValue="formDataCustomers.customerOne.fields.capitalInvestor.value" v-model="formDataCustomers.customerOne.fields.capitalInvestor.value" @focus="setDropdownTop($event)" @click="showCapitalInvestDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.capitalInvestor.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownCapitalInvest" :class="{active: showCapitalInvestDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? {'Ja': 'Ja', 'Nein': 'Nein'} : {'Yes': 'Yes', 'No': 'No'}" @dropdown-item-clicked="dropdownClick('customerOne', 'capitalInvestor', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col ">
          <span class="tooltip" :class="{'invalid': !formDataCustomers.customerOne.fields.taxId.valid  && formDataCustomers.customerOne.fields.taxId.valid !== '', 'valid': formDataCustomers.customerOne.fields.taxId.valid  && formDataCustomers.customerOne.fields.taxId.valid !== ''}">
            <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.taxId.label) " inputName="Taxid" :inputValue="formDataCustomers.customerOne.fields.taxId.value" v-model="formDataCustomers.customerOne.fields.taxId.value"></InputField>
            <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 0"><sup>i</sup></span>
            <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.taxId.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </span>
          <span :class="{'invalid': !formDataCustomers.customerOne.fields.occupation.valid  && formDataCustomers.customerOne.fields.occupation.valid !== '', 'valid': formDataCustomers.customerOne.fields.occupation.valid  && formDataCustomers.customerOne.fields.occupation.valid !== ''}">
            <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.occupation.label) " inputName="Occupation" :inputValue="formDataCustomers.customerOne.fields.occupation.value" v-model="formDataCustomers.customerOne.fields.occupation.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.occupation.label) }}</label>
          </span>
          </div>

          <div class="field-wrapper two-col">
          <span :class="{'invalid': !formDataCustomers.customerOne.fields.streetAndNr.valid  && formDataCustomers.customerOne.fields.streetAndNr.valid !== '', 'valid': formDataCustomers.customerOne.fields.streetAndNr.valid  && formDataCustomers.customerOne.fields.streetAndNr.valid !== ''}">
            <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.streetAndNr.label) " inputName="Streetandnr" :inputValue="formDataCustomers.customerOne.fields.streetAndNr.value" v-model="formDataCustomers.customerOne.fields.streetAndNr.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.streetAndNr.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </span>
          <span :class="{'invalid': !formDataCustomers.customerOne.fields.postalcode.valid  && formDataCustomers.customerOne.fields.postalcode.valid !== '', 'valid': formDataCustomers.customerOne.fields.postalcode.valid  && formDataCustomers.customerOne.fields.postalcode.valid !== ''}">
            <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.postalcode.label) " inputName="Postcode" :inputValue="formDataCustomers.customerOne.fields.postalcode.value" v-model="formDataCustomers.customerOne.fields.postalcode.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.postalcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerOne.fields.city.valid  && formDataCustomers.customerOne.fields.city.valid !== '', 'valid': formDataCustomers.customerOne.fields.city.valid  && formDataCustomers.customerOne.fields.city.valid !== ''}">
            <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.city.label) " inputName="City" :inputValue="formDataCustomers.customerOne.fields.city.value" v-model="formDataCustomers.customerOne.fields.city.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </span>
          <span :class="{'invalid': !formDataCustomers.customerOne.fields.landlinePhone.valid  && formDataCustomers.customerOne.fields.landlinePhone.valid !== '', 'valid': formDataCustomers.customerOne.fields.landlinePhone.valid  && formDataCustomers.customerOne.fields.landlinePhone.valid !== ''}">
            <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.landlinePhone.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerOne.fields.landlinePhone.value" v-model="formDataCustomers.customerOne.fields.landlinePhone.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.landlinePhone.label) }}</label>
          </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerOne.fields.mobilePhone.valid  && formDataCustomers.customerOne.fields.mobilePhone.valid !== '', 'valid': formDataCustomers.customerOne.fields.mobilePhone.valid  && formDataCustomers.customerOne.fields.mobilePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.mobilePhone.label) " inputName="Mobilephone" :inputValue="formDataCustomers.customerOne.fields.mobilePhone.value" v-model="formDataCustomers.customerOne.fields.mobilePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.mobilePhone.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.mail.valid  && formDataCustomers.customerOne.fields.mail.valid !== '', 'valid': formDataCustomers.customerOne.fields.mail.valid  && formDataCustomers.customerOne.fields.mail.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.mail.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerOne.fields.mail.value" v-model="formDataCustomers.customerOne.fields.mail.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.mail.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>
          <div class="field-wrapper">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.personalIdentificationFile.valid  && formDataCustomers.customerOne.fields.personalIdentificationFile.valid !== ''}" style="flex-basis: 100%;">
              <div class="fieldgroup-label" style="margin-bottom: 10px;">{{languageBasedlabel(formDataCustomers.customerOne.fields.personalIdentificationFile.label) }} <AsterixMarkIcon></AsterixMarkIcon> :</div>
              <UploadFieldArea :defaultFiles="formDataCustomers.customerOne.fields.personalIdentificationFile.value" :language="language" :maxFiles="5" @uploadedFiles="updateFileOfIdentitiy('customerOne', $event)"></UploadFieldArea>
            </span>
          </div>
        </div>

        <div :class="'page-'+currentStep" v-if="parseInt(countOfPurchaser) >= 2 && currentStep === 5">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Zweiter Käufer - Informationen' : 'Second purchaser informations:' }}</div>
          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.salutation.valid  && formDataCustomers.customerTwo.fields.salutation.valid !== '', 'valid': formDataCustomers.customerTwo.fields.salutation.valid  && formDataCustomers.customerTwo.fields.salutation.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formDataCustomers.customerTwo.fields.salutation.label)" inputName="Salutation" :inputValue="formDataCustomers.customerTwo.fields.salutation.value" v-model="formDataCustomers.customerTwo.fields.salutation.value" @focus="setDropdownTop($event)" @click="showSalutationDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.salutation.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSalutation" :class="{active: showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.salutationList : this.salutationListEN" @dropdown-item-clicked="dropdownClick('customerTwo', 'salutation', $event)" @click.stop=""></Dropdown>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.title.valid  && formDataCustomers.customerTwo.fields.title.valid !== '', 'valid': formDataCustomers.customerTwo.fields.title.valid  && formDataCustomers.customerTwo.fields.title.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.title.label) " inputName="Title" :inputValue="formDataCustomers.customerTwo.fields.title.value" v-model="formDataCustomers.customerTwo.fields.title.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.title.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.firstName.valid  && formDataCustomers.customerTwo.fields.firstName.valid !== '', 'valid': formDataCustomers.customerTwo.fields.firstName.valid  && formDataCustomers.customerTwo.fields.firstName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.firstName.label) " inputName="Firstname" :inputValue="formDataCustomers.customerTwo.fields.firstName.value" v-model="formDataCustomers.customerTwo.fields.firstName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.firstName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.lastName.valid  && formDataCustomers.customerTwo.fields.lastName.valid !== '', 'valid': formDataCustomers.customerTwo.fields.lastName.valid  && formDataCustomers.customerTwo.fields.lastName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.lastName.label) " inputName="Lastname" :inputValue="formDataCustomers.customerTwo.fields.lastName.value" v-model="formDataCustomers.customerTwo.fields.lastName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.lastName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.birthName.valid  && formDataCustomers.customerTwo.fields.birthName.valid !== '', 'valid': formDataCustomers.customerTwo.fields.birthName.valid  && formDataCustomers.customerTwo.fields.birthName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.birthName.label) " inputName="Birthname" :inputValue="formDataCustomers.customerTwo.fields.birthName.value" v-model="formDataCustomers.customerTwo.fields.birthName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.birthName.label) }} <span class="not-requiered-labeltext">(optional)</span></label>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.dateOfBirth.valid  && formDataCustomers.customerTwo.fields.dateOfBirth.valid !== '', 'valid': formDataCustomers.customerTwo.fields.dateOfBirth.valid  && formDataCustomers.customerTwo.fields.dateOfBirth.valid !== ''}">
              <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.dateOfBirth.label) " inputName="Dateofbirth" :inputValue="formDataCustomers.customerTwo.fields.dateOfBirth.value" v-model="formDataCustomers.customerTwo.fields.dateOfBirth.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.dateOfBirth.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.nationality.valid  && formDataCustomers.customerTwo.fields.nationality.valid !== '', 'valid': formDataCustomers.customerTwo.fields.nationality.valid  && formDataCustomers.customerTwo.fields.nationality.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.nationality.label) " inputName="Nationality" :inputValue="formDataCustomers.customerTwo.fields.nationality.value" v-model="formDataCustomers.customerTwo.fields.nationality.value" @focus="setDropdownTop($event)" @click="showNationalityDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownNationality" :class="{active: showNationalityDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" @dropdown-item-clicked="dropdownClick('customerTwo', 'nationality', $event)" @click.stop=""></Dropdown>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.maritalStatus.valid  && formDataCustomers.customerTwo.fields.maritalStatus.valid !== '', 'valid': formDataCustomers.customerTwo.fields.maritalStatus.valid  && formDataCustomers.customerTwo.fields.maritalStatus.valid !== ''}">
               <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.maritalStatus.label) " inputName="Maritalstatus" :inputValue="formDataCustomers.customerTwo.fields.maritalStatus.value" v-model="formDataCustomers.customerTwo.fields.maritalStatus.value" @focus="setDropdownTop($event)" @click="showMaritalStatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.maritalStatus.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownMaritalstatus" :class="{active: showMaritalStatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.maritalStatusList : this.maritalStatusListEN" @dropdown-item-clicked="dropdownClick('customerTwo', 'maritalStatus', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.propertyStatus.valid  && formDataCustomers.customerTwo.fields.propertyStatus.valid !== '', 'valid': formDataCustomers.customerTwo.fields.propertyStatus.valid  && formDataCustomers.customerTwo.fields.propertyStatus.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.propertyStatus.label) " inputName="Propertystatus" :inputValue="formDataCustomers.customerTwo.fields.propertyStatus.value" v-model="formDataCustomers.customerTwo.fields.propertyStatus.value" @focus="setDropdownTop($event)" @click="showPropertystatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.propertyStatus.label) }} <AsterixMarkIcon v-if="formDataCustomers.customerTwo.fields.propertyStatus.required"></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownPropertystatus" :class="{active: showPropertystatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.propertyStatusList : this.propertyStatusListEN" @dropdown-item-clicked="dropdownClick('customerTwo', 'propertyStatus', $event)" @click.stop=""></Dropdown>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.capitalInvestor.valid  && formDataCustomers.customerTwo.fields.capitalInvestor.valid !== '', 'valid': formDataCustomers.customerTwo.fields.capitalInvestor.valid  && formDataCustomers.customerTwo.fields.capitalInvestor.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.capitalInvestor.label) " inputName="CapitalInvest" :inputValue="formDataCustomers.customerTwo.fields.capitalInvestor.value" v-model="formDataCustomers.customerTwo.fields.capitalInvestor.value" @focus="setDropdownTop($event)" @click="showCapitalInvestDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.capitalInvestor.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownCapitalInvest" :class="{active: showCapitalInvestDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="{'Ja': 'Ja', 'Nein': 'Nein'}" @dropdown-item-clicked="dropdownClick('customerTwo', 'capitalInvestor', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span class="tooltip" :class="{'invalid': !formDataCustomers.customerTwo.fields.taxId.valid  && formDataCustomers.customerTwo.fields.taxId.valid !== '', 'valid': formDataCustomers.customerTwo.fields.taxId.valid  && formDataCustomers.customerTwo.fields.taxId.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.taxId.label) " inputName="Taxid" :inputValue="formDataCustomers.customerTwo.fields.taxId.value" v-model="formDataCustomers.customerTwo.fields.taxId.value"></InputField>
              <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 0"><sup>i</sup></span>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.taxId.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.occupation.valid  && formDataCustomers.customerTwo.fields.occupation.valid !== '', 'valid': formDataCustomers.customerTwo.fields.occupation.valid  && formDataCustomers.customerTwo.fields.occupation.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.occupation.label) " inputName="Occupation" :inputValue="formDataCustomers.customerTwo.fields.occupation.value" v-model="formDataCustomers.customerTwo.fields.occupation.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.occupation.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.streetAndNr.valid  && formDataCustomers.customerTwo.fields.streetAndNr.valid !== '', 'valid': formDataCustomers.customerTwo.fields.streetAndNr.valid  && formDataCustomers.customerTwo.fields.streetAndNr.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.streetAndNr.label) " inputName="Streetandnr" :inputValue="formDataCustomers.customerTwo.fields.streetAndNr.value" v-model="formDataCustomers.customerTwo.fields.streetAndNr.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.streetAndNr.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
              <span :class="{'invalid': !formDataCustomers.customerTwo.fields.postalcode.valid  && formDataCustomers.customerTwo.fields.postalcode.valid !== '', 'valid': formDataCustomers.customerTwo.fields.postalcode.valid  && formDataCustomers.customerTwo.fields.postalcode.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.postalcode.label) " inputName="Postcode" :inputValue="formDataCustomers.customerTwo.fields.postalcode.value" v-model="formDataCustomers.customerTwo.fields.postalcode.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.postalcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerTwo.fields.city.valid  && formDataCustomers.customerTwo.fields.city.valid !== '', 'valid': formDataCustomers.customerTwo.fields.city.valid  && formDataCustomers.customerTwo.fields.city.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.city.label) " inputName="City" :inputValue="formDataCustomers.customerTwo.fields.city.value" v-model="formDataCustomers.customerTwo.fields.city.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.landlinePhone.valid  && formDataCustomers.customerTwo.fields.landlinePhone.valid !== '', 'valid': formDataCustomers.customerTwo.fields.landlinePhone.valid  && formDataCustomers.customerTwo.fields.landlinePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.landlinePhone.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerTwo.fields.landlinePhone.value" v-model="formDataCustomers.customerTwo.fields.landlinePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.landlinePhone.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerTwo.fields.mobilePhone.valid  && formDataCustomers.customerTwo.fields.mobilePhone.valid !== '', 'valid': formDataCustomers.customerTwo.fields.mobilePhone.valid  && formDataCustomers.customerTwo.fields.mobilePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.mobilePhone.label) " inputName="Mobilephone" :inputValue="formDataCustomers.customerTwo.fields.mobilePhone.value" v-model="formDataCustomers.customerTwo.fields.mobilePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.mobilePhone.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.mail.valid  && formDataCustomers.customerTwo.fields.mail.valid !== '', 'valid': formDataCustomers.customerTwo.fields.mail.valid  && formDataCustomers.customerTwo.fields.mail.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerTwo.fields.mail.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerTwo.fields.mail.value" v-model="formDataCustomers.customerTwo.fields.mail.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerTwo.fields.mail.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>
          <div class="field-wrapper">
            <span :class="{'invalid': !formDataCustomers.customerTwo.fields.personalIdentificationFile.valid  && formDataCustomers.customerTwo.fields.personalIdentificationFile.valid !== ''}" style="flex-basis: 100%;">
              <div class="fieldgroup-label" style="margin-bottom: 10px;">{{languageBasedlabel(formDataCustomers.customerTwo.fields.personalIdentificationFile.label) }} <AsterixMarkIcon></AsterixMarkIcon> :</div>
              <UploadFieldArea :defaultFiles="formDataCustomers.customerTwo.fields.personalIdentificationFile.value" :language="language" :maxFiles="5" @uploadedFiles="updateFileOfIdentitiy('customerTwo', $event)"></UploadFieldArea>
            </span>
          </div>
        </div>

        <div :class="'page-'+currentStep" v-if="parseInt(countOfPurchaser) >= 3 && currentStep === 6">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Dritter Käufer - Informationen' : 'Third purchaser informations:' }}</div>
          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.salutation.valid  && formDataCustomers.customerThree.fields.salutation.valid !== '', 'valid': formDataCustomers.customerThree.fields.salutation.valid  && formDataCustomers.customerThree.fields.salutation.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formDataCustomers.customerThree.fields.salutation.label)" inputName="Salutation" :inputValue="formDataCustomers.customerThree.fields.salutation.value" v-model="formDataCustomers.customerThree.fields.salutation.value" @focus="setDropdownTop($event)" @click="showSalutationDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.salutation.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSalutation" :class="{active: showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.salutationList : this.salutationListEN" @dropdown-item-clicked="dropdownClick('customerThree', 'salutation', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.title.valid  && formDataCustomers.customerThree.fields.title.valid !== '', 'valid': formDataCustomers.customerThree.fields.title.valid  && formDataCustomers.customerThree.fields.title.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.title.label) " inputName="Title" :inputValue="formDataCustomers.customerThree.fields.title.value" v-model="formDataCustomers.customerThree.fields.title.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.title.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.firstName.valid  && formDataCustomers.customerThree.fields.firstName.valid !== '', 'valid': formDataCustomers.customerThree.fields.firstName.valid  && formDataCustomers.customerThree.fields.firstName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.firstName.label) " inputName="Firstname" :inputValue="formDataCustomers.customerThree.fields.firstName.value" v-model="formDataCustomers.customerThree.fields.firstName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.firstName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.lastName.valid  && formDataCustomers.customerThree.fields.lastName.valid !== '', 'valid': formDataCustomers.customerThree.fields.lastName.valid  && formDataCustomers.customerThree.fields.lastName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.lastName.label) " inputName="Lastname" :inputValue="formDataCustomers.customerThree.fields.lastName.value" v-model="formDataCustomers.customerThree.fields.lastName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.lastName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.birthName.valid  && formDataCustomers.customerThree.fields.birthName.valid !== '', 'valid': formDataCustomers.customerThree.fields.birthName.valid  && formDataCustomers.customerThree.fields.birthName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.birthName.label) " inputName="Birthname" :inputValue="formDataCustomers.customerThree.fields.birthName.value" v-model="formDataCustomers.customerThree.fields.birthName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.birthName.label) }} <span class="not-requiered-labeltext">(optional)</span></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.dateOfBirth.valid  && formDataCustomers.customerThree.fields.dateOfBirth.valid !== '', 'valid': formDataCustomers.customerThree.fields.dateOfBirth.valid  && formDataCustomers.customerThree.fields.dateOfBirth.valid !== ''}">
              <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.dateOfBirth.label) " inputName="Dateofbirth" :inputValue="formDataCustomers.customerThree.fields.dateOfBirth.value" v-model="formDataCustomers.customerThree.fields.dateOfBirth.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.dateOfBirth.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.nationality.valid  && formDataCustomers.customerThree.fields.nationality.valid !== '', 'valid': formDataCustomers.customerThree.fields.nationality.valid  && formDataCustomers.customerThree.fields.nationality.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.nationality.label) " inputName="Nationality" :inputValue="formDataCustomers.customerThree.fields.nationality.value" v-model="formDataCustomers.customerThree.fields.nationality.value" @focus="setDropdownTop($event)" @click="showNationalityDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownNationality" :class="{active: showNationalityDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" @dropdown-item-clicked="dropdownClick('customerThree', 'nationality', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.maritalStatus.valid  && formDataCustomers.customerThree.fields.maritalStatus.valid !== '', 'valid': formDataCustomers.customerThree.fields.maritalStatus.valid  && formDataCustomers.customerThree.fields.maritalStatus.valid !== ''}">
               <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.maritalStatus.label) " inputName="Maritalstatus" :inputValue="formDataCustomers.customerThree.fields.maritalStatus.value" v-model="formDataCustomers.customerThree.fields.maritalStatus.value" @focus="setDropdownTop($event)" @click="showMaritalStatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.maritalStatus.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownMaritalstatus" :class="{active: showMaritalStatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.maritalStatusList : this.maritalStatusListEN" @dropdown-item-clicked="dropdownClick('customerThree', 'maritalStatus', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.propertyStatus.valid  && formDataCustomers.customerThree.fields.propertyStatus.valid !== '', 'valid': formDataCustomers.customerThree.fields.propertyStatus.valid  && formDataCustomers.customerThree.fields.propertyStatus.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.propertyStatus.label) " inputName="Propertystatus" :inputValue="formDataCustomers.customerThree.fields.propertyStatus.value" v-model="formDataCustomers.customerThree.fields.propertyStatus.value" @focus="setDropdownTop($event)" @click="showPropertystatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.propertyStatus.label) }} <AsterixMarkIcon v-if="formDataCustomers.customerThree.fields.propertyStatus.required"></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownPropertystatus" :class="{active: showPropertystatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.propertyStatusList : this.propertyStatusListEN" @dropdown-item-clicked="dropdownClick('customerThree', 'propertyStatus', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.capitalInvestor.valid  && formDataCustomers.customerThree.fields.capitalInvestor.valid !== '', 'valid': formDataCustomers.customerThree.fields.capitalInvestor.valid  && formDataCustomers.customerThree.fields.capitalInvestor.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.capitalInvestor.label) " inputName="CapitalInvest" :inputValue="formDataCustomers.customerThree.fields.capitalInvestor.value" v-model="formDataCustomers.customerThree.fields.capitalInvestor.value" @focus="setDropdownTop($event)" @click="showCapitalInvestDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.capitalInvestor.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownCapitalInvest" :class="{active: showCapitalInvestDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="{'Ja': 'Ja', 'Nein': 'Nein'}" @dropdown-item-clicked="dropdownClick('customerThree', 'capitalInvestor', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span class="tooltip" :class="{'invalid': !formDataCustomers.customerThree.fields.taxId.valid  && formDataCustomers.customerThree.fields.taxId.valid !== '', 'valid': formDataCustomers.customerThree.fields.taxId.valid  && formDataCustomers.customerThree.fields.taxId.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.taxId.label) " inputName="Taxid" :inputValue="formDataCustomers.customerThree.fields.taxId.value" v-model="formDataCustomers.customerThree.fields.taxId.value"></InputField>
              <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 0"><sup>i</sup></span>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.taxId.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.occupation.valid  && formDataCustomers.customerThree.fields.occupation.valid !== '', 'valid': formDataCustomers.customerThree.fields.occupation.valid  && formDataCustomers.customerThree.fields.occupation.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.occupation.label) " inputName="Occupation" :inputValue="formDataCustomers.customerThree.fields.occupation.value" v-model="formDataCustomers.customerThree.fields.occupation.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.occupation.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.streetAndNr.valid  && formDataCustomers.customerThree.fields.streetAndNr.valid !== '', 'valid': formDataCustomers.customerThree.fields.streetAndNr.valid  && formDataCustomers.customerThree.fields.streetAndNr.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.streetAndNr.label) " inputName="Streetandnr" :inputValue="formDataCustomers.customerThree.fields.streetAndNr.value" v-model="formDataCustomers.customerThree.fields.streetAndNr.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.streetAndNr.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.postalcode.valid  && formDataCustomers.customerThree.fields.postalcode.valid !== '', 'valid': formDataCustomers.customerThree.fields.postalcode.valid  && formDataCustomers.customerThree.fields.postalcode.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.postalcode.label) " inputName="Postcode" :inputValue="formDataCustomers.customerThree.fields.postalcode.value" v-model="formDataCustomers.customerThree.fields.postalcode.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.postalcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerThree.fields.city.valid  && formDataCustomers.customerThree.fields.city.valid !== '', 'valid': formDataCustomers.customerThree.fields.city.valid  && formDataCustomers.customerThree.fields.city.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.city.label) " inputName="City" :inputValue="formDataCustomers.customerThree.fields.city.value" v-model="formDataCustomers.customerThree.fields.city.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.landlinePhone.valid  && formDataCustomers.customerThree.fields.landlinePhone.valid !== '', 'valid': formDataCustomers.customerThree.fields.landlinePhone.valid  && formDataCustomers.customerThree.fields.landlinePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.landlinePhone.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerThree.fields.landlinePhone.value" v-model="formDataCustomers.customerThree.fields.landlinePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.landlinePhone.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerThree.fields.mobilePhone.valid  && formDataCustomers.customerThree.fields.mobilePhone.valid !== '', 'valid': formDataCustomers.customerThree.fields.mobilePhone.valid  && formDataCustomers.customerThree.fields.mobilePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.mobilePhone.label) " inputName="Mobilephone" :inputValue="formDataCustomers.customerThree.fields.mobilePhone.value" v-model="formDataCustomers.customerThree.fields.mobilePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.mobilePhone.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.mail.valid  && formDataCustomers.customerThree.fields.mail.valid !== '', 'valid': formDataCustomers.customerThree.fields.mail.valid  && formDataCustomers.customerThree.fields.mail.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerThree.fields.mail.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerThree.fields.mail.value" v-model="formDataCustomers.customerThree.fields.mail.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerThree.fields.mail.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>
          <div class="field-wrapper">
            <span :class="{'invalid': !formDataCustomers.customerThree.fields.personalIdentificationFile.valid  && formDataCustomers.customerThree.fields.personalIdentificationFile.valid !== ''}" style="flex-basis: 100%;">
              <div class="fieldgroup-label" style="margin-bottom: 10px;">{{languageBasedlabel(formDataCustomers.customerThree.fields.personalIdentificationFile.label) }} <AsterixMarkIcon></AsterixMarkIcon> :</div>
              <UploadFieldArea :defaultFiles="formDataCustomers.customerThree.fields.personalIdentificationFile.value" :language="language" :maxFiles="5" @uploadedFiles="updateFileOfIdentitiy('customerThree', $event)"></UploadFieldArea>
            </span>
          </div>
        </div>

        <div :class="'page-'+currentStep" v-if="parseInt(countOfPurchaser) >= 4 && currentStep === 7">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Vierter Käufer - Informationen' : 'Fourth purchaser informations:' }}</div>
          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.salutation.valid  && formDataCustomers.customerFour.fields.salutation.valid !== '', 'valid': formDataCustomers.customerFour.fields.salutation.valid  && formDataCustomers.customerFour.fields.salutation.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formDataCustomers.customerFour.fields.salutation.label)" inputName="Salutation" :inputValue="formDataCustomers.customerFour.fields.salutation.value" v-model="formDataCustomers.customerFour.fields.salutation.value" @focus="setDropdownTop($event)" @click="showSalutationDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.salutation.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSalutation" :class="{active: showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.salutationList : this.salutationListEN" @dropdown-item-clicked="dropdownClick('customerFour', 'salutation', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.title.valid  && formDataCustomers.customerFour.fields.title.valid !== '', 'valid': formDataCustomers.customerFour.fields.title.valid  && formDataCustomers.customerFour.fields.title.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.title.label) " inputName="Title" :inputValue="formDataCustomers.customerFour.fields.title.value" v-model="formDataCustomers.customerFour.fields.title.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.title.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.firstName.valid  && formDataCustomers.customerFour.fields.firstName.valid !== '', 'valid': formDataCustomers.customerFour.fields.firstName.valid  && formDataCustomers.customerFour.fields.firstName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.firstName.label) " inputName="Firstname" :inputValue="formDataCustomers.customerFour.fields.firstName.value" v-model="formDataCustomers.customerFour.fields.firstName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.firstName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.lastName.valid  && formDataCustomers.customerFour.fields.lastName.valid !== '', 'valid': formDataCustomers.customerFour.fields.lastName.valid  && formDataCustomers.customerFour.fields.lastName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.lastName.label) " inputName="Lastname" :inputValue="formDataCustomers.customerFour.fields.lastName.value" v-model="formDataCustomers.customerFour.fields.lastName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.lastName.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.birthName.valid  && formDataCustomers.customerFour.fields.birthName.valid !== '', 'valid': formDataCustomers.customerFour.fields.birthName.valid  && formDataCustomers.customerFour.fields.birthName.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.birthName.label) " inputName="Birthname" :inputValue="formDataCustomers.customerFour.fields.birthName.value" v-model="formDataCustomers.customerFour.fields.birthName.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.birthName.label) }} <span class="not-requiered-labeltext">(optional)</span></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.dateOfBirth.valid  && formDataCustomers.customerFour.fields.dateOfBirth.valid !== '', 'valid': formDataCustomers.customerFour.fields.dateOfBirth.valid  && formDataCustomers.customerFour.fields.dateOfBirth.valid !== ''}">
              <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.dateOfBirth.label) " inputName="Dateofbirth" :inputValue="formDataCustomers.customerFour.fields.dateOfBirth.value" v-model="formDataCustomers.customerFour.fields.dateOfBirth.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.dateOfBirth.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.nationality.valid  && formDataCustomers.customerFour.fields.nationality.valid !== '', 'valid': formDataCustomers.customerFour.fields.nationality.valid  && formDataCustomers.customerFour.fields.nationality.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.nationality.label) " inputName="Nationality" :inputValue="formDataCustomers.customerFour.fields.nationality.value" v-model="formDataCustomers.customerFour.fields.nationality.value" @focus="setDropdownTop($event)" @click="showNationalityDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownNationality" :class="{active: showNationalityDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" @dropdown-item-clicked="dropdownClick('customerFour', 'nationality', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.maritalStatus.valid  && formDataCustomers.customerFour.fields.maritalStatus.valid !== '', 'valid': formDataCustomers.customerFour.fields.maritalStatus.valid  && formDataCustomers.customerFour.fields.maritalStatus.valid !== ''}">
               <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.maritalStatus.label) " inputName="Maritalstatus" :inputValue="formDataCustomers.customerFour.fields.maritalStatus.value" v-model="formDataCustomers.customerFour.fields.maritalStatus.value" @focus="setDropdownTop($event)" @click="showMaritalStatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.maritalStatus.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownMaritalstatus" :class="{active: showMaritalStatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.maritalStatusList : this.maritalStatusListEN" @dropdown-item-clicked="dropdownClick('customerFour', 'maritalStatus', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.propertyStatus.valid  && formDataCustomers.customerFour.fields.propertyStatus.valid !== '', 'valid': formDataCustomers.customerFour.fields.propertyStatus.valid  && formDataCustomers.customerFour.fields.propertyStatus.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.propertyStatus.label) " inputName="Propertystatus" :inputValue="formDataCustomers.customerFour.fields.propertyStatus.value" v-model="formDataCustomers.customerFour.fields.propertyStatus.value" @focus="setDropdownTop($event)" @click="showPropertystatusDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.propertyStatus.label) }} <AsterixMarkIcon v-if="formDataCustomers.customerFour.fields.propertyStatus.required"></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownPropertystatus" :class="{active: showPropertystatusDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.propertyStatusList : this.propertyStatusListEN" @dropdown-item-clicked="dropdownClick('customerFour', 'propertyStatus', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.capitalInvestor.valid  && formDataCustomers.customerFour.fields.capitalInvestor.valid !== '', 'valid': formDataCustomers.customerFour.fields.capitalInvestor.valid  && formDataCustomers.customerFour.fields.capitalInvestor.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.capitalInvestor.label) " inputName="CapitalInvest" :inputValue="formDataCustomers.customerFour.fields.capitalInvestor.value" v-model="formDataCustomers.customerFour.fields.capitalInvestor.value" @focus="setDropdownTop($event)" @click="showCapitalInvestDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.capitalInvestor.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownCapitalInvest" :class="{active: showCapitalInvestDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="{'Ja': 'Ja', 'Nein': 'Nein'}" @dropdown-item-clicked="dropdownClick('customerFour', 'capitalInvestor', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span class="tooltip" :class="{'invalid': !formDataCustomers.customerFour.fields.taxId.valid  && formDataCustomers.customerFour.fields.taxId.valid !== '', 'valid': formDataCustomers.customerFour.fields.taxId.valid  && formDataCustomers.customerFour.fields.taxId.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.taxId.label) " inputName="Taxid" :inputValue="formDataCustomers.customerFour.fields.taxId.value" v-model="formDataCustomers.customerFour.fields.taxId.value"></InputField>
              <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 0"><sup>i</sup></span>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.taxId.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.occupation.valid  && formDataCustomers.customerFour.fields.occupation.valid !== '', 'valid': formDataCustomers.customerFour.fields.occupation.valid  && formDataCustomers.customerFour.fields.occupation.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.occupation.label) " inputName="Occupation" :inputValue="formDataCustomers.customerFour.fields.occupation.value" v-model="formDataCustomers.customerFour.fields.occupation.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.occupation.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.streetAndNr.valid  && formDataCustomers.customerFour.fields.streetAndNr.valid !== '', 'valid': formDataCustomers.customerFour.fields.streetAndNr.valid  && formDataCustomers.customerFour.fields.streetAndNr.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.streetAndNr.label) " inputName="Streetandnr" :inputValue="formDataCustomers.customerFour.fields.streetAndNr.value" v-model="formDataCustomers.customerFour.fields.streetAndNr.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.streetAndNr.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.postalcode.valid  && formDataCustomers.customerFour.fields.postalcode.valid !== '', 'valid': formDataCustomers.customerFour.fields.postalcode.valid  && formDataCustomers.customerFour.fields.postalcode.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.postalcode.label) " inputName="Postcode" :inputValue="formDataCustomers.customerFour.fields.postalcode.value" v-model="formDataCustomers.customerFour.fields.postalcode.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.postalcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerFour.fields.city.valid  && formDataCustomers.customerFour.fields.city.valid !== '', 'valid': formDataCustomers.customerFour.fields.city.valid  && formDataCustomers.customerFour.fields.city.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.city.label) " inputName="City" :inputValue="formDataCustomers.customerFour.fields.city.value" v-model="formDataCustomers.customerFour.fields.city.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.landlinePhone.valid  && formDataCustomers.customerFour.fields.landlinePhone.valid !== '', 'valid': formDataCustomers.customerFour.fields.landlinePhone.valid  && formDataCustomers.customerFour.fields.landlinePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.landlinePhone.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerFour.fields.landlinePhone.value" v-model="formDataCustomers.customerFour.fields.landlinePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.landlinePhone.label) }}</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
           <span :class="{'invalid': !formDataCustomers.customerFour.fields.mobilePhone.valid  && formDataCustomers.customerFour.fields.mobilePhone.valid !== '', 'valid': formDataCustomers.customerFour.fields.mobilePhone.valid  && formDataCustomers.customerFour.fields.mobilePhone.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.mobilePhone.label) " inputName="Mobilephone" :inputValue="formDataCustomers.customerFour.fields.mobilePhone.value" v-model="formDataCustomers.customerFour.fields.mobilePhone.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.mobilePhone.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.mail.valid  && formDataCustomers.customerFour.fields.mail.valid !== '', 'valid': formDataCustomers.customerFour.fields.mail.valid  && formDataCustomers.customerFour.fields.mail.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerFour.fields.mail.label) " inputName="LandlinePhone" :inputValue="formDataCustomers.customerFour.fields.mail.value" v-model="formDataCustomers.customerFour.fields.mail.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerFour.fields.mail.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>
          <div class="field-wrapper">
            <span :class="{'invalid': !formDataCustomers.customerFour.fields.personalIdentificationFile.valid  && formDataCustomers.customerFour.fields.personalIdentificationFile.valid !== ''}" style="flex-basis: 100%;">
              <div class="fieldgroup-label" style="margin-bottom: 10px;">{{languageBasedlabel(formDataCustomers.customerFour.fields.personalIdentificationFile.label) }} <AsterixMarkIcon></AsterixMarkIcon> :</div>
              <UploadFieldArea :defaultFiles="formDataCustomers.customerFour.fields.personalIdentificationFile.value" :language="language" :maxFiles="5" @uploadedFiles="updateFileOfIdentitiy('customerFour', $event)"></UploadFieldArea>
            </span>
          </div>
        </div>

        <div :class="'page-'+currentStep" v-else-if="currentStep === (4+parseInt(countOfPurchaser))">
          <div class="field-wrapper" :class="{'invalid': !formBankBuild.fields.accountOwner.valid  && formBankBuild.fields.accountOwner.valid !== '', 'valid': formBankBuild.fields.accountOwner.valid  && formBankBuild.fields.accountOwner.valid !== ''}">
            <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBankBuild.fields.accountOwner.label)" inputName="AccountOwner" :inputValue="formBankBuild.fields.accountOwner.value" v-model="formBankBuild.fields.accountOwner.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formBankBuild.fields.accountOwner.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </div>
          <div class="field-wrapper" :class="{'invalid': !formBankBuild.fields.bank.valid  && formBankBuild.fields.bank.valid !== '', 'valid': formBankBuild.fields.bank.valid  && formBankBuild.fields.bank.valid !== ''}">
            <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBankBuild.fields.bank.label)" inputName="Bank" :inputValue="formBankBuild.fields.bank.value" v-model="formBankBuild.fields.bank.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formBankBuild.fields.bank.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </div>
          <div class="field-wrapper" :class="{'invalid': !formBankBuild.fields.iban.valid  && formBankBuild.fields.iban.valid !== '', 'valid': formBankBuild.fields.iban.valid  && formBankBuild.fields.iban.valid !== ''}">
            <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBankBuild.fields.iban.label)" inputName="Iban" :inputValue="formBankBuild.fields.iban.value" v-model="formBankBuild.fields.iban.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formBankBuild.fields.iban.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </div>
          <div class="field-wrapper" :class="{'invalid': !formBankBuild.fields.bic.valid  && formBankBuild.fields.bic.valid !== '', 'valid': formBankBuild.fields.bic.valid  && formBankBuild.fields.bic.valid !== ''}">
            <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBankBuild.fields.bic.label)" inputName="Bic" :inputValue="formBankBuild.fields.bic.value" v-model="formBankBuild.fields.bic.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formBankBuild.fields.bic.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </div>
        </div>

        <div class="page-last" v-else-if="currentStep === (5+parseInt(countOfPurchaser))">
          <div class="thank-you-page" v-if="submitHandler.formSubmitted === true && submitHandler.message !== ''">
            {{ submitHandler.message }}
          </div>
          <span v-else>
            <div class="fieldgroup-label">{{ language === 'DEU' ? 'Zusammenfassung:' : 'Summary:' }}</div>
            <span v-html="renderSummary"></span>
          </span>
        </div>

        <div class="actions" :style="{ justifyContent: currentStep === 1 ? 'end' : '' }" v-if="!submitHandler.formSubmitted">

          <Button type="edit" v-if="currentStep > 1" @click="currentStep = currentStep-1">{{ language === 'DEU' ? 'Zurück' : 'Back' }}</Button>
          <Button type="create reservation" v-if="currentStep !== maxSteps" @click="checkIfStepIsValid">{{ language === 'DEU' ? 'Weiter' : 'Next' }}</Button>
          <Button type="create reservation" v-else @click="submitData">
            {{ language === 'DEU' ? 'Informationen einreichen' : 'Submit information' }}
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>
      </div>

    </form>

    <div class="tooltips" :class="{'active': showToolTips}" v-show="showToolTips">
      <div class="tooltips-inner-wrapper">
        <div class="header"><CloseIcon @click="showToolTips = false;"></CloseIcon></div>
        <span v-html="renderToolTip(currentToolTipContent)"></span>
      </div>
    </div>

  </div>
</template>

<style scoped>

.intro {
  width: 100%;
  text-align: center;
  margin-bottom: 25px;
}

.missing-error-alert {
  width: 100%;
  text-align: center;
}

form {
  min-width: 500px;
  width: 50%;
  background: white;
  border-radius: 5px;
  padding: 50px;
  height: fit-content;
}

.ndb-customer-view {
  display: flex;
  flex-basis: 100%;
  justify-content: center;
  min-height: 100vh;
  padding-top: 50px;
  background: radial-gradient(circle, rgba(21,71,109,1) 0%, rgba(15,40,60,1) 100%);
}

[class^="page-"],
.webform-body-wrapper {
  width: 100%;
}

.field-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.field-wrapper > span + span {
  margin-left: 15px;
}

.field-wrapper.two-col span {
  flex-basis: 48%;
}

.field-wrapper + .field-wrapper {
  margin-top: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  margin-top: 25px;
  flex-wrap: wrap;
}

.progress-bar {
  flex-basis: 100%;
  margin-bottom: 50px;
}

.step-fields {
  display: flex;
  justify-content: center;
}

label {
  cursor: pointer;
  text-align: center;
}

/* page 1 */
input[name="Language"] {
  display:none !important;
}

input[name="Language"] + img {
  width: 50px;
  filter: grayscale(100%);
  cursor: pointer;
}

input[modelvalue="DEU"][value="DEU"] + img,
input[modelvalue="ENG"][value="ENG"] + img {
  filter: unset;
}

label[for="languageEng"] {
  margin-left: 25px;
}

.invalid input, .invalid .dropzone-container {
  border-left: 5px solid red;
}

.thank-you-page {
  text-align: center;
}

.tooltips {
  position: fixed;
  bottom: -200vh;
  padding: 50px;
  background: white;
  font-size: 18px;
  line-height: 1.5em;
  width: 100%;
}

.tooltips.active {
  bottom: 0;
}

.tooltips .header {
  text-align: right;
}

.tooltip-icon {
  font-weight: 900;
  cursor: pointer;
  display: contents;
}

.tooltip {
  display: flex;
}

.field-wrapper.two-col .tooltip-icon {
  display: flex;
  flex-basis: 5%;
  justify-content: center;
  align-items: center;
}

.tooltip-icon sup {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 30px;
  height: 30px;
  background: var(--blue);
  border-radius: 50%;
  color: white;
}

@media (max-width: 767px) {
  .field-wrapper.two-col span {
    flex-basis: 100%;
  }
  .field-wrapper span + span {
    margin-left: 0;
    margin-top: 15px;
  }
  .actions .button + .button{
    margin-top: 15px;
  }
  .page-last + .actions > .button  {
    flex-basis: 100% !important;
  }
  form {
    min-width: 50%;
    width: 100%;
  }
  label.radio-wrapper + label.radio-wrapper {
    margin-left: 15px;
  }
}

</style>
