<script>
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import CreateReservationProgressBar from "@/components/card/CreateReservationProgressBar.vue";
import Button from "@/components/buttons/button.vue";
import axios from "axios";
import ImageFlagGerman from "@/components/images/flag-german.vue";
import ImageFlagEnglish from "@/components/images/flag-english.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import UploadFieldArea from "@/components/forms/UploadDragAndDrop.vue";
import TextAreaField from "@/components/forms/TextAreaField.vue";
import CloseIcon from "@/components/icons/icon-close.vue";
import AlertIcon from "@/components/icons/icon-warning.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";

export default {
  components: {
    AsterixMarkIcon,
    AnimateCircleIcon,
    AlertIcon,
    CloseIcon,
    TextAreaField,
    UploadFieldArea,
    PlusIcon,
    ImageFlagEnglish,
    ImageFlagGerman, Button, CreateReservationProgressBar, DropdownArrow, Dropdown, InputField},
  data() {
    return {
      formDataCustomers: {
        customerOne: {
          fields: {
            birthPlace: {
              required: false,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtsstadt',
                en: 'Birth city'
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
            country: {
              required: true,
              value: '',
              valueType: 'text',
              valid: '',
              label: {
                de: 'Geburtsland',
                en: 'Birth country'
              }
            },
          }
        },
      },

      formPEP: {
        fields: {
          kindOfPosition: {
            required: true,
            value: "Beamter",
            valueType: "text",
            valid: "",
            label: {
              de: "Art der Position",
              en: "Kind of position"
            }
          },
          country: {
            required: true,
            value: "Deutschland",
            valueType: "text",
            valid: "",
            label: {
              de: "Das entsprechende Land",
              en: "Country"
            }
          },
        }
      },

      formPEPOthers: {
        fields: {
          firstname: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Vorname',
              en: 'Firstname'
            }
          },
          lastname: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Nachname',
              en: 'Lastname'
            }
          },
          street: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Straße + Nr.',
              en: 'Street and Nr.'
            }
          },
          zipcode: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Postleitzahl',
              en: 'Zipcode'
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
          country: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Land',
              en: 'Country'
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
          dateOfBirth: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Geburtsdatum',
              en: 'Birthdate.'
            }
          },
          kindOfPosition: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Art der Position',
              en: 'Kind of position'
            }
          },
          countryOfPosition: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Relevantes land',
              en: 'Relevant Country'
            }
          },
          relationship: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Beziehung zu Ihnen',
              en: 'Relationship'
            }
          },
        }
      },

      formPEPOthersAdditionalPerson: {
        fields: {
          firstname: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Vorname',
              en: 'Firstname'
            }
          },
          lastname: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Nachname',
              en: 'Lastname'
            }
          },
          street: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Straße + Nr.',
              en: 'Street and Nr.'
            }
          },
          zipcode: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Postleitzahl',
              en: 'Zipcode'
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
          country: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Land',
              en: 'Country'
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
          dateOfBirth: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Geburtsdatum',
              en: 'Birthdate.'
            }
          },
          kindOfPosition: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Art der Position',
              en: 'Kind of position'
            }
          },
          countryOfPosition: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Relevantes land',
              en: 'Relevant Country'
            }
          },
          relationship: {
            required: true,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Beziehung zu Ihnen',
              en: 'Relationship'
            }
          },
        }
      },

      formFinancial: {
        fields: {
          bankPercent: {
            required: true,
            value: '0',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Anteil in %',
              en: 'Percentage ownership %'
            }
          },
          bankSource: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Art der Mittelherkunft',
              en: 'Origine of your equity'
            }
          },
          bankSourceCountry: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Land der Mittelherkunft',
              en: 'Country of origin of the funds'
            }
          },
          ownMoneyPercent: {
            required: true,
            value: '0',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Anteil in %',
              en: 'Percentage ownership %'
            }
          },
          ownMoneySource: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Art der Mittelherkunft',
              en: 'Origine of your equity'
            }
          },
          ownMoneySourceCountry: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Land der Mittelherkunft',
              en: 'Country of origin of the funds'
            }
          },
          othersPercent: {
            required: true,
            value: '0',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Anteil in %',
              en: 'Percentage ownership %'
            }
          },
          othersSource: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Art der Mittelherkunft',
              en: 'Origine of your equity'
            }
          },
          othersSourceCountry: {
            required: false,
            value: '',
            valueType: 'text',
            valid: '',
            label: {
              de: 'Land der Mittelherkunft',
              en: 'Country of origin of the funds'
            }
          },
        }
      },
      financeInsertValueLeft: 100,
      financeStepValidation: {
        valid: true,
        msg: ''
      },

      uploads: {
        proofOfRepresentation: {
          checkbox: false,
          valid: true,
          label: {
            'de': 'Falls Sie Vertreter sind, Vertretungsnachweis (z.B. Vollmacht, Handelsregisterauszug, Auszug aus Genossenschaftsregister etc.)',
            'en': 'If you are a representative, proof of representation (e.g. power of attorney, extract from the commercial register, extract from the register of cooperatives, etc.)'
          },
          files: [],
        }
      },

      legalSourceOfFinance: {
        checkbox: false,
        valid: true,
      },
      notOnSanktionalLists: {
        checkbox: false,
        valid: true,
      },

      notCooperatedCountryCheckbox: {
        checkbox: false,
        valid: true,
      },
      notCooperatedCountryList: '',

      additionalInformations: '',

      pepValue: 'no',
      pepValueOthers: 'no',
      pepValueAdditionalPerson: false,
      kindOfPurchaser: 'privat',
      countOfPurchaser: 1,
      language: 'DEU',
      showSalutationDropdown: false,
      dropdownRelativePosition: false,
      showNationalityDropdown: false,
      showCountryDropdown: false,
      showMaritalStatusDropdown: false,
      showPropertystatusDropdown: false,
      showCapitalInvestDropdown: false,
      showKindOfPositionCountryDropdown: false,
      showPopOthersCountry: false,
      showPepOthersNationatlity: false,
      showPepPositionCountry: false,
      showPopOthersAdditionalCountry: false,
      showPopOthersAdditionalNationality: false,
      showPepPositionAdditionalCountry: false,
      showfinanceBankSourceCountry: false,
      showfinanceOwnMoneySourceCountry: false,
      showfinanceOthersSourceCountry: false,

      maxSteps: 8,
      currentStep: 1,
      currentStepValidator: true,

      apiError: '',
      apiResponseReservation: '',
      apiResponseCustomer: '',

      formAlreadySubmitted: false,
      noTokenFound: false,
      tokenValue: this.$route.query.token,

      toolTipContents: {
        0: {
          'de': 'Wirtschaftlich Berechtigter gemäß § 3 GWG ist insbesondere eine Person, auf deren Veranlassung eine Transaktion letztlich durchgeführt oder eine Geschäftsbeziehung letztlich begründet wird. Wird der Geschäftspartner als Treuhänder tätig, zählt der Treugeber als wirtschaftlich Berechtigter.',
          'en': 'The beneficial owner pursuant to Section 3 GWG is in particular a person at whose instigation a transaction is ultimately carried out or a business relationship is ultimately established. If the business partner acts as a trustee, the trustor counts as the beneficial owner.',
        },
        1: {
          'de': '<div><b>Nachfolgend sind die betroffenen Positionen aufgeführt:</b></div> <ol>\n' +
              '        <li>Staatschefs, Regierungschefs, Minister, Mitglieder der Europäischen Kommission, sowie deren Stellvertreter</li>\n' +
              '        <li>Minister und Staatssekretäre,</li>\n' +
              '        <li>Parlamentsabgeordnete und Mitglieder vergleichbarer Gesetzgebungsorgane,</li>\n' +
              '        <li>Mitglieder der Führungsgremien politischer Parteien,</li>\n' +
              '        <li>Mitglieder von obersten Gerichtshöfen, Verfassungsgerichtshöfen oder sonstigen hohen Gerichten, gegen deren Entscheidungen im Regelfall kein Rechtsmittel mehr eingelegt werden kann,</li>\n' +
              '        <li>Mitglieder der Leitungsorgane von Rechnungshöfen,</li>\n' +
              '        <li>Mitglieder der Leitungsorgane von Zentralbanken,</li>\n' +
              '        <li>Botschafter, Geschäftsträger und Militärattachés,</li>\n' +
              '        <li>Mitglieder der Verwaltungs-, Leitungs- und Aufsichtsorgane staatseigener Unternehmen,</li>\n' +
              '        <li>Direktoren, stellvertretende Direktoren, Mitglieder des Leitungsorgans oder sonstige Leiter mit vergleichbarer Funktion in einer zwischenstaatlichen, internationalen oder europäischen Organisation</li>\n' +
              '      </ol>',
          'en': '<div><b>The items affected are listed below:</b></div> <ol>\n' +
              '        <li>Heads of State, Heads of Government, Ministers, Members of the European Commission, and their alternates</li>\n' +
              '        <li>Ministers and Secretaries of State,</li>\n' +
              '        <li>Members of Parliament and members of comparable legislative bodies,</li>\n' +
              '        <li>Members of the governing bodies of political parties,</li>\n' +
              '        <li>Members of supreme courts, constitutional courts or other high courts, whose decisions are normally not subject to appeal,</li>\n' +
              '        <li>Members of the management bodies of SAIs,</li>\n' +
              '        <li>Members of the governing bodies of central banks,</li>\n' +
              '        <li>Ambassadors, business leaders and military attachés,</li>\n' +
              '        <li>Members of the administrative, management and supervisory bodies of state-owned enterprises,</li>\n' +
              '        <li>Directors, deputy directors, members of the governing body or other managers with a similar function in an intergovernmental, international or European organisation</li>\n' +
              '      </ol>',
        },
        2: {
          'de': '<div><b>Betroffene Personen: Direkte Familienmitglieder oder Personen, von denen bekannt ist, dass sie eng mit dem als PEP bezeichneten Geschäftspartner verbunden sind:</b></div> <ol>\n' +
              '        <li>Bekannten Ehegatte oder Lebenspartner</li>\n' +
              '        <li>Lebenspartner, der durch einen zivilen Solidaritätspakt oder durch einen nach ausländischem Recht registrierten Partnerschaftsvertrag gebunden ist,</li>\n' +
              '        <li>Direkte Verwandte, Angehörige in auf- oder absteigender Linie und verwandte Personen ersten Grades sowie deren Ehegatten, deren Lebenspartner, der durch einen zivilen Solidaritätspakt oder durch einen nach ausländischem Recht registrierten Partnerschaftsvertrag gebunden ist,</li>\n' +
              '        <li>Jede natürliche Person, von der bekannt ist, dass sie enge Geschäftsbeziehungen zu diesem Geschäftspartner unterhält</li>\n' +
              '      </ol>',
          'en': '<div><b>Persons concerned: Direct family members or persons known to be closely related to the business partner referred to as PEP:</b></div> <ol>\n' +
              '        <li>Known spouse or partner</li>\n' +
              '        <li>a life partner bound by a civil solidarity pact or by a partnership contract registered under foreign law</li>\n' +
              '        <li>Direct relatives, relatives in the ascending or descending line and first-degree relatives and their spouses, their life partners bound by a civil solidarity pact or by a partnership contract registered under foreign law</li>\n' +
              '        <li>Any natural person who is known to have close business relations with this business partner</li>\n' +
              '      </ol>',
        },
        3: {
          'de': 'S. hierzu z.B.: <a href="https://www.zoll.de/SharedDocs/Boxen/EN/Hintergrund/0016_list_of_embargoed_countries.html?nn=204200&faqCalledDoc=204200" target="_blank">https://www.zoll.de/SharedDocs/Boxen/EN/Hintergrund/0016_list_of_embargoed_countries.html?nn=204200&faqCalledDoc=204200</a>',
          'en': 'See for example: <a href="https://www.zoll.de/SharedDocs/Boxen/EN/Hintergrund/0016_list_of_embargoed_countries.html?nn=204200&faqCalledDoc=204200" target="_blank">https://www.zoll.de/SharedDocs/Boxen/EN/Hintergrund/0016_list_of_embargoed_countries.html?nn=204200&faqCalledDoc=204200</a>'
        }
      },

      showToolTips: false,
      currentToolTipContent: 0,

      submitHandler: {
        formSubmitted: false,
        message: '',
      },

      summaryRendering: '',

      isLoading: false,
    }
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    salutationSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.salutation.value = clickedText;
      this.showSalutationDropdown = false;
    },
    nationalitySelection(clickedText) {
      this.formDataCustomers.customerOne.fields.nationality.value = clickedText;
      this.showNationalityDropdown = false;
    },
    birthCountrySelection(clickedText) {
      this.formDataCustomers.customerOne.fields.country.value = clickedText;
      this.showCountryDropdown = false;
    },
    maritalStatusSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.maritalStatus.value = clickedText;
      this.showMaritalStatusDropdown = false;
    },
    propertyStatusSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.propertyStatus.value = clickedText;
      this.showPropertystatusDropdown = false;
    },
    capitalInvestSelection(clickedText) {
      this.formDataCustomers.customerOne.fields.capitalInvestor.value = clickedText;
      this.showCapitalInvestDropdown = false;
    },
    kindOfPositionSelection(clickedText) {
      this.formPEP.fields.country.value = clickedText;
      this.showKindOfPositionCountryDropdown = false;
    },
    popsOthersCountrySelection(clickedText) {
      this.formPEPOthers.fields.country.value = clickedText;
      this.showPopOthersCountry = false;
    },
    popsOthersAdditionalCountrySelection(clickedText) {
      this.formPEPOthersAdditionalPerson.fields.country.value = clickedText;
      this.showPopOthersAdditionalCountry = false;
    },
    popsOthersNationalitySelection(clickedText) {
      this.formPEPOthers.fields.nationality.value = clickedText;
      this.showPepOthersNationatlity = false;
    },
    popsOthersAdditonalNationalitySelection(clickedText) {
      this.formPEPOthersAdditionalPerson.fields.nationality.value = clickedText;
      this.showPopOthersAdditionalNationality = false;
    },
    popsOthersPositionCountrySelection(clickedText) {
      this.formPEPOthers.fields.countryOfPosition.value = clickedText;
      this.showPepPositionCountry = false;
    },
    popsOthersAdditionalPositionCountrySelection(clickedText) {
      this.formPEPOthersAdditionalPerson.fields.countryOfPosition.value = clickedText;
      this.showPepPositionAdditionalCountry = false;
    },
    popsFinanceBankSelection(clickedText) {
      this.formFinancial.fields.bankSourceCountry.value = clickedText;
      this.showfinanceBankSourceCountry = false;
    },
    popsFinanceOwnMoneySelection(clickedText) {
      this.formFinancial.fields.ownMoneySourceCountry.value = clickedText;
      this.showfinanceOwnMoneySourceCountry = false;
    },
    popsFinanceOthersSelection(clickedText) {
      this.formFinancial.fields.othersSourceCountry.value = clickedText;
      this.showfinanceOthersSourceCountry = false;
    },
    closeDropdowns() {
      this.showSalutationDropdown = false;
      this.dropdownRelativePosition = false;
      this.showNationalityDropdown = false;
      this.showCountryDropdown = false;
      this.showMaritalStatusDropdown = false;
      this.showPropertystatusDropdown = false;
      this.showCapitalInvestDropdown = false;
      this.showKindOfPositionCountryDropdown = false;
      this.showPopOthersCountry = false;
      this.showPepPositionCountry = false;
      this.showPopOthersAdditionalCountry = false;
      this.showPopOthersAdditionalNationality = false;
      this.showPepPositionAdditionalCountry = false;
      this.showfinanceBankSourceCountry = false;
      this.showfinanceOwnMoneySourceCountry = false;
      this.showfinanceOthersSourceCountry = false;
      this.showPepOthersNationatlity = false;
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
        let mail = this.$route.query.mail;
        await axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservationBasedOnTokenAndUsage?token='+token+'&formType=gwg&pub=true&mail='+mail)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiResponseReservation = response.data.response[0];
                    if ( this.apiResponseReservation.gwg_status && parseInt(this.apiResponseReservation.gwg_status) >= 1 ){
                      this.formAlreadySubmitted = true;
                    }
                  } else {
                    this.formAlreadySubmitted = true;
                  }
                }
            )
            .catch(
                (error) => {
                  this.apiError = error;
                  this.formAlreadySubmitted = true;
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
      this.showToolTips = false;

      // Validate form 3 step
      if (this.currentStep === 3) {
        Object.entries(this.formDataCustomers.customerOne.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === ''){
              this.formDataCustomers.customerOne.fields[key].valid = false;
              formValidation = false;
            } else {
              this.formDataCustomers.customerOne.fields[key].valid = true;
            }
          }
        });
      }

      // Validate form 4 step
      if (this.pepValue === 'yes' && this.currentStep === 4) {
        Object.entries(this.formPEP.fields).forEach(([key, field]) => {
          if ( field.required ){
            if ( field.value === undefined || field.value === ''){
              this.formPEP.fields[key].valid = false;
              formValidation = false;
            } else {
              this.formPEP.fields[key].valid = true;
            }
          }
        });
      }

      // Validate form 5 step
      if ( this.pepValueOthers === 'yes' && this.currentStep === 5) {
        Object.entries(this.formPEPOthers.fields).forEach(([key, field]) => {
          if (field.required) {
            if (field.value === undefined || field.value === '') {
              this.formPEPOthers.fields[key].valid = false;
              formValidation = false;
            } else {
              this.formPEPOthers.fields[key].valid = true;
            }
          }
        });

        if ( this.pepValueAdditionalPerson ) {
          Object.entries(this.formPEPOthersAdditionalPerson.fields).forEach(([key, field]) => {
            if (field.required) {
              if (field.value === undefined || field.value === '') {
                this.formPEPOthersAdditionalPerson.fields[key].valid = false;
                formValidation = false;
              } else {
                this.formPEPOthersAdditionalPerson.fields[key].valid = true;
              }
            }
          });
        }
      }

      // Validate form 6 step
      if ( this.currentStep === 6) {

        if ( this.formFinancial.fields.bankPercent.value > 0 ) {
          this.formFinancial.fields.bankSource.required = true;
          this.formFinancial.fields.bankSourceCountry.required = true;
        } else {
          this.formFinancial.fields.bankSource.required = false;
          this.formFinancial.fields.bankSourceCountry.required = false;
        }

        if ( this.formFinancial.fields.ownMoneyPercent.value > 0 ) {
          this.formFinancial.fields.ownMoneySource.required = true;
          this.formFinancial.fields.ownMoneySourceCountry.required = true;
        } else {
          this.formFinancial.fields.ownMoneySource.required = false;
          this.formFinancial.fields.ownMoneySourceCountry.required = false;
        }

        if (this.formFinancial.fields.othersPercent.value > 0 ) {
          this.formFinancial.fields.othersSource.required = true;
          this.formFinancial.fields.othersSourceCountry.required = true;
        } else {
          this.formFinancial.fields.othersSource.required = false;
          this.formFinancial.fields.othersSourceCountry.required = false;
        }

        if ( this.financeInsertValueLeft !== 0 ) {
          formValidation = false;
          this.financeStepValidation.valid = false;
          this.financeStepValidation.msg = ( this.language === 'DEU' ? 'Sie müssen die Finanzierung zu 100% angeben.' : 'You have to tell how you want to finance 100%' );
        } else {
          formValidation = true;
          this.financeStepValidation.valid = true;
          this.financeStepValidation.msg = '';
        }

        Object.entries(this.formFinancial.fields).forEach(([key, field]) => {
          if (field.required) {
            if (field.value === undefined || field.value === '') {
              this.formFinancial.fields[key].valid = false;
              formValidation = false;
            } else {
              this.formFinancial.fields[key].valid = true;
            }
          }
        });

      }

      // Validate form 7 step
      if ( this.currentStep === 7) {

        if ( this.uploads.proofOfRepresentation.checkbox ) {
          if (this.uploads.proofOfRepresentation.files.length > 0) {
            this.uploads.proofOfRepresentation.valid = true;
          } else {
            this.uploads.proofOfRepresentation.valid = false;
            formValidation = false;
          }
        }

        if ( this.legalSourceOfFinance.checkbox ) {
          this.legalSourceOfFinance.valid = true;
        } else {
          this.legalSourceOfFinance.valid = false;
          formValidation = false;
        }

        if ( this.notOnSanktionalLists.checkbox ){
          this.notOnSanktionalLists.valid = true;
        } else {
          this.notOnSanktionalLists.valid = false;
          formValidation = false;
        }

      }

      if ( this.currentStep === this.maxSteps-1 ) {
        this.renderSummary();
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

      Object.entries(this.formFinancial.fields).forEach(([key, field]) => {
        this.formFinancial.fields[key].label.de = '';
        this.formFinancial.fields[key].label.en = '';
      });

      let formData = new FormData();
      formData.append('token', this.tokenValue);
      formData.append('formCustomer', JSON.stringify(this.formDataCustomers.customerOne.fields));
      formData.append('formPEP', JSON.stringify(this.formPEP.fields));
      formData.append('formPOPOthers', JSON.stringify(this.formPEPOthers.fields));
      formData.append('formPEPOthersAdditionalPerson', JSON.stringify(this.formPEPOthersAdditionalPerson.fields));
      formData.append('formFinancial', JSON.stringify(this.formFinancial.fields));
      formData.append('additionalInformations', this.additionalInformations);
      formData.append('pepValue', this.pepValue);
      formData.append('pepValueOthers', this.pepValueOthers);
      formData.append('pepValueAdditionalPerson', this.pepValueAdditionalPerson ? 'true' : 'false');
      formData.append('notOnSanktionalLists', this.notOnSanktionalLists.checkbox);
      formData.append('legalSourceOfFinance', this.legalSourceOfFinance.checkbox);
      formData.append('kindOfPurchaser', this.kindOfPurchaser);
      formData.append('identityOfRepresentatorCheckbox', this.uploads.proofOfRepresentation.checkbox ? 'true' : 'false');
      formData.append('language', this.language);
      formData.append('gwgID', this.apiResponseReservation['id']);
      formData.append('notCooperatedCountryCheckbox', this.notCooperatedCountryCheckbox.checkbox);
      formData.append('notCooperatedCountryList', this.notCooperatedCountryList);

      let uploads = [];
      Object.entries(this.uploads).forEach(([key, field]) => {
        if ( field.files.length && field.files.length > 0 ) {
          uploads = [...uploads, ...field.files];
        }
      });
      Object.entries(uploads).forEach(([key, field]) => {
        formData.append(field.name, field);
      });

      axios.post(this.globalApiBaseUrl + '/reservations/submitGWGClientForm', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(
            (response) => {
              if ( response.data.status === 200 ) {
                this.submitHandler.formSubmitted = true;
                this.submitHandler.message = this.language === 'DEU' ? 'Ihre Daten sind bei uns erfolgreich eingetroffen.' : 'Your information are submitted';
              } else {
                this.submitHandler.message = this.language === 'DEU' ? 'Es ist ein Fehler aufgetreten..' : 'An error happend your information could not submitted';
              }
            }
        )
        .catch(
            (error) => {
              this.submitHandler.message = this.language === 'DEU' ? 'Es ist ein Fehler aufgetreten..' : 'An error happend your information could not submitted';
            }
        ).finally(() => {
          this.isLoading = false;
        })
    },
    updateFilesForConfirmationOfBank(files){
      this.uploads.confirmationOfBank.files = files;
    },
    updateFilesProofOfOwnRessources(files){
      this.uploads.proofOfOwnRessources.files = files;
    },
    updateFilesProofOfIdentity(files){
      this.uploads.proofOfIdentity.files = files;
    },
    updateFilesProofOfRepresentation(files){
      this.uploads.proofOfRepresentation.files = files;
    },
    renderToolTip(toolNr) {
      if (this.language === 'DEU') {
        return this.toolTipContents[toolNr]['de'];
      } else {
        return this.toolTipContents[toolNr]['en'];
      }
    },
    checkInputLength(event) {
      if ( !event.target.value || event.target.value === '' || event.target.value === '00' ) {
        event.target.value = 0;
        this.$data.formFinancial.fields[event.target.name].value = 0;
      }

      let val = parseInt(event.target.value);
      if (event.target.value.length > 3) {
        event.target.value = 100;
        this.$data.formFinancial.fields[event.target.name].value = 100;
      }
      if (val < 0) {
        event.target.value = 0;
        this.$data.formFinancial.fields[event.target.name].value = 0;
      }

      if (val > (this.financeInsertValueLeft +val )) {
        event.target.value = val + this.financeInsertValueLeft;
        this.$data.formFinancial.fields[event.target.name].value = val + this.financeInsertValueLeft;
      }

    },
    renderSummary() {

      let rendering = '';

      rendering += '<div class="gwg-summery-item customer-data">';
      rendering += '<div class="title">'+(this.language === 'DEU' ? 'Persönliche Angaben' : 'Personal informations')+'</div>';
      Object.entries(this.formDataCustomers.customerOne.fields).forEach(([key, field]) => {
        rendering += '<div>';
        if ( this.language === 'DEU' && typeof field.label.de !== "undefined" ){
          rendering += field.label.de + ' : ' + field.value;
        } else {
          if ( typeof field.label.en !== "undefined" ){
            rendering += field.label.en + ' : ' + field.value;
          }
        }
        rendering += '</div>';
      });
      rendering += '</div>';


      if ( this.pepValue !== 'no' ){
        rendering += '<div class="gwg-summery-item form-pep-data">';
        rendering += '<div class="title">'+(this.language === 'DEU' ? 'PEP Angaben' : 'PEP Data')+'</div>';
        Object.entries(this.formPEP.fields).forEach(([key, field]) => {
          rendering += '<div>';
          if ( this.language === 'DEU' && typeof field.label.de !== "undefined" ){
            rendering += field.label.de + ' : ' + field.value;
          } else {
            if ( typeof field.label.en !== "undefined" ){
              rendering += field.label.en + ' : ' + field.value;
            }
          }
          rendering += '</div>';
        });
        rendering += '</div>';
      }

      if ( this.pepValueOthers !== 'no' ) {
        rendering += '<div class="gwg-summery-item form-pep-others-data">';
        rendering += '<div class="title">' + (this.language === 'DEU' ? 'Externe PEP Angaben' : 'External PEP Data') + '</div>';
        Object.entries(this.formPEPOthers.fields).forEach(([key, field]) => {
          rendering += '<div>';
          if (this.language === 'DEU' && typeof field.label.de !== "undefined") {
            rendering += field.label.de + ' : ' + field.value;
          } else {
            if (typeof field.label.en !== "undefined") {
              rendering += field.label.en + ' : ' + field.value;
            }
          }
          rendering += '</div>';
        });
        rendering += '</div>';
      }

      if ( this.pepValueAdditionalPerson ){
        rendering += '<div class="gwg-summery-item form-pep-others-additional-data">';
        rendering += '<div class="title">'+(this.language === 'DEU' ? 'Externe PEP Angaben' : 'External PEP Data')+'</div>';
        Object.entries(this.formPEPOthersAdditionalPerson.fields).forEach(([key, field]) => {
          rendering += '<div>';
          if ( this.language === 'DEU' && typeof field.label.de !== "undefined" ){
            rendering += field.label.de + ' : ' + field.value;
          } else {
            if ( typeof field.label.en !== "undefined" ){
              rendering += field.label.en + ' : ' + field.value;
            }            }
          rendering += '</div>';
        });
        rendering += '</div>';
      }

      rendering += '<div class="gwg-summery-item form-financial-data">';
      rendering += '<div class="title">'+(this.language === 'DEU' ? 'Angabe zu Finanzen' : 'Data for finance')+'</div>';
      Object.entries(this.formFinancial.fields).forEach(([key, field]) => {
        if ( key === 'bankPercent' || key === 'ownMoneyPercent' || key === 'othersPercent' ) {
          rendering += '<div class="finance-item value-'+field.value+'">';
        }
        rendering += '<div>';
        if ( this.language === 'DEU' && typeof field.label.de !== "undefined" ){
          rendering += field.label.de + ' : ' + field.value;
        } else {
          if ( typeof field.label.en !== "undefined" ){
            rendering += field.label.en + ' : ' + field.value;
          }}
        rendering += '</div>';
        if ( key === 'bankSourceCountry' || key === 'ownMoneySourceCountry' || key === 'othersSourceCountry' ) {
          rendering += '</div>';
        }
      });

      if ( this.legalSourceOfFinance.checkbox ) {
        rendering += this.language === 'DEU' ? '<div>Die bei der Transaktion verwendeten Gelder stammen aus legalen Quellen: Korrekt</div>' : '<div>The funds used in the transaction come from legal sources: Correct</div>';
      } else {
        rendering += this.language === 'DEU' ? '<div>Die bei der Transaktion verwendeten Gelder stammen aus legalen Quellen: Nicht Korrekt</div>' : '<div>The funds used in the transaction come from legal sources: Not correct</div>';
      }

      if ( this.notOnSanktionalLists.checkbox ) {
        rendering += this.language === 'DEU' ? '<div>Ich bin nicht auf einer Sanktionsliste (EU, UN etc.): Korrekt</div>' : '<div>I am not on a sanctions list (EU, UN etc.): Correct</div>';
      } else {
        rendering += this.language === 'DEU' ? '<div>Ich bin nicht auf einer Sanktionsliste (EU, UN etc.): Nicht Korrekt</div>' : '<div>I am not on a sanctions list (EU, UN etc.): not correct</div>';
      }
      rendering += '</div>';

      this.summaryRendering = rendering;
    }
  },
  watch: {
    pepValue() {
      this.formPEP.fields.country.value = '';
      this.formPEP.fields.kindOfPosition.value = '';
    },
    apiResponseCustomer: function() {
      this.language = this.apiResponseCustomer.client_language;

      let countryList = this.countryList;
      if ( this.language === 'ENG' ) {
        countryList = this.countryListEN;
      }

      this.formDataCustomers.customerOne.fields.dateOfBirth.value = this.germanDateToEnglishDateFormat(this.apiResponseCustomer.client_birthday);
      this.formDataCustomers.customerOne.fields.nationality.value = this.apiResponseCustomer.client_nationality;
      this.formDataCustomers.customerOne.fields.streetAndNr.value = this.apiResponseCustomer.client_address;
      this.formDataCustomers.customerOne.fields.postalcode.value = this.apiResponseCustomer.client_postal_code;
      this.formDataCustomers.customerOne.fields.city.value = this.apiResponseCustomer.client_city;
      this.formDataCustomers.customerOne.fields.country.value = countryList[this.apiResponseCustomer.client_country];
    },
    formFinancial: {
      handler(val){
        let bank = this.formFinancial.fields.bankPercent.value;
        let own = this.formFinancial.fields.ownMoneyPercent.value;
        let others = this.formFinancial.fields.othersPercent.value;
        let maxVal = 100;

        this.financeInsertValueLeft = maxVal - parseInt(bank) - parseInt(own) - parseInt(others);
      },
      deep: true
    }

  },
}
</script>

<template>
  <div class="ndb-customer-view" @click="closeDropdowns">
    <form class="ndb-form">
      <div class="intro">
        <h2>{{ language === 'DEU' ? 'GWG Formular für den Erwerb einer Immobilie' : 'GWG information to purchase a real estate' }}</h2>
      </div>

      <div v-if="formAlreadySubmitted" class="missing-error-alert">
        {{ language === 'DEU' ? 'Ihr GWG wurde bereits erfolgreich abgesendet.' : 'Your GWG was already submitted.' }}
      </div>

      <div v-else-if="noTokenFound" class="missing-error-alert">
        {{ language === 'DEU' ? 'Es konnten keine Daten gefunden werden. Bitte kontaktieren Sie ihren Makler.' : 'No information found. Please contact you agent.' }}
      </div>

      <div class="webform-body-wrapper" v-else>
        <div class="progress-bar">
          <CreateReservationProgressBar :currentStep="currentStep" :maxSteps="maxSteps"></CreateReservationProgressBar>
        </div>

        <div class="page-1" v-if="currentStep === 1">
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

        <div class="page-2" v-if="currentStep === 2">
          <div class="fieldgroup-label">
            {{ language === 'DEU' ? 'Sind Sie eine natürliche Person und handeln im eigenen Namen und im eigenen wirtschaftlichen Interesse?' : 'Are you a natural person acting in your own name and in your own economic interest?' }}
            </div>
          <div class="step-fields">
            <label for="privatField" class="radio-wrapper">
              <InputField inputType="radio" id="privatField" inputName="kindOfPurchaser" value="privat" :inputValue="kindOfPurchaser" v-model="kindOfPurchaser"></InputField>
              {{ language === 'DEU' ? 'Ja' : 'Yes' }}
            </label>
            <label for="businessField" class="radio-wrapper">
              <InputField inputType="radio" id="businessField" inputName="kindOfPurchaser" value="business" :inputValue="kindOfPurchaser" v-model="kindOfPurchaser"></InputField>
              {{ language === 'DEU' ? 'Nein' : 'No' }}
            </label>
          </div>
          <div class="business-fields" v-if="kindOfPurchaser === 'business'">

            <span v-if="language === 'DEU'">
              <br><b>Wenn Sie nicht als natürliche Person oder nicht im eigenen Namen handeln stellen Sie sicher dass:</b><br><br>
              <ul>
                <li>Sie <b>Vertreter</b> im Namen einer anderen natürlichen Person oder einer juristischen Person oder</li>
                <li>zwar im eigenen Namen, aber für einen wirtschaftlich Berechtigten im Sinne von § 3 GWG, beantworten
                  Sie alle im Anschluss stehende Fragen dieses Formulars bitte für sich selbst und füllen zusätzlich das
                  passende Formular <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 0"><sup>i</sup></span></li>
                <li>für die von Ihnen vertretene natürliche/juristische Person und/oder</li>
                <li>für den wirtschaftlich Berechtigten aus (Formular für natürliche Personen und/oder Formular für juristische Personen).</li>
              </ul>
              <div>Fügen Sie für den Fall, dass sie als Vertreter handeln, bitte außerdem einen <b>Nachweis bei, aus dem sich Ihre Vertretungsberechtigung ergibt</b> (Vollmacht, Handelsregisterauszug).</div>
            </span>
            <span v-else>
              <br><b>If you are not a natural person or not acting on your own behalf, make sure that:</b><br><br>
              <ul>
                <li><b>a representative</b> a representative on behalf of another natural person or legal entity, or</li>
                <li><b>in his own name</b>, but for a <b>beneficial owner</b> within the meaning of Article 3 GWG, please fill in all questions of this form for yourself <b>and additionally</b> the appropriate form <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 0"><sup>i</sup></span></li>
                <li>for the natural/legal person represented by you and/or</li>
                <li>for the beneficial owner</li>
              </ul>
              <div>(form for natural persons <b>and/or</b> form for legal persons).</div>
              <div>If you are acting as a representative, please also enclose <b>proof that you are authorised to represent the company</b> (power of attorney, extract from the commercial register).</div>
            </span>
          </div>

<!--          <div class="business-fields" v-if="kindOfPurchaser === 'business'">-->

<!--            <div class="field-wrapper" :class="{'invalid': !formBusinessBuild.fields.legalBodyName.valid  && formBusinessBuild.fields.legalBodyName.valid !== '', 'valid': formBusinessBuild.fields.legalBodyName.valid  && formBusinessBuild.fields.legalBodyName.valid !== ''}">-->
<!--              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.legalBodyName.label)" inputName="LegalBodyName" :inputValue="formBusinessBuild.fields.legalBodyName.value" v-model="formBusinessBuild.fields.legalBodyName.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.legalBodyName.label) }}</label>-->
<!--            </div>-->

<!--            <div class="field-wrapper two-col">-->
<!--            <span :class="{'invalid': !formBusinessBuild.fields.saluationPersonal.valid  && formBusinessBuild.fields.saluationPersonal.valid !== '', 'valid': formBusinessBuild.fields.saluationPersonal.valid  && formBusinessBuild.fields.saluationPersonal.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.saluationPersonal.label)" inputName="SalutationPersonal" :inputValue="formBusinessBuild.fields.saluationPersonal.value" v-model="formBusinessBuild.fields.saluationPersonal.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.saluationPersonal.label) }}</label>-->
<!--            </span>-->
<!--              <span :class="{'invalid': !formBusinessBuild.fields.titlePersonal.valid && formBusinessBuild.fields.titlePersonal.valid !== '', 'valid': formBusinessBuild.fields.titlePersonal.valid && formBusinessBuild.fields.titlePersonal.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.titlePersonal.label)" inputName="TitlePersonal" :inputValue="formBusinessBuild.fields.titlePersonal.value" v-model="formBusinessBuild.fields.titlePersonal.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.titlePersonal.label) }}</label>-->
<!--            </span>-->
<!--            </div>-->

<!--            <div class="field-wrapper two-col">-->
<!--            <span :class="{'invalid': !formBusinessBuild.fields.firstnamePersonal.valid && formBusinessBuild.fields.firstnamePersonal.valid !== '', 'valid': formBusinessBuild.fields.firstnamePersonal.valid && formBusinessBuild.fields.firstnamePersonal.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.firstnamePersonal.label)" inputName="FirstnameOfPersonal" :inputValue="formBusinessBuild.fields.firstnamePersonal.value" v-model="formBusinessBuild.fields.firstnamePersonal.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.firstnamePersonal.label) }}</label>-->
<!--            </span>-->
<!--              <span :class="{'invalid': !formBusinessBuild.fields.lastnamePersonal.valid && formBusinessBuild.fields.lastnamePersonal.valid !== '', 'valid': formBusinessBuild.fields.lastnamePersonal.valid && formBusinessBuild.fields.lastnamePersonal.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.lastnamePersonal.label)" inputName="LastnameOfPersonal" :inputValue="formBusinessBuild.fields.lastnamePersonal.value" v-model="formBusinessBuild.fields.lastnamePersonal.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.lastnamePersonal.label) }}</label>-->
<!--            </span>-->
<!--            </div>-->
<!--            <div class="field-wrapper two-col">-->
<!--            <span :class="{'invalid': !formBusinessBuild.fields.phone.valid && formBusinessBuild.fields.phone.valid !== '', 'valid': formBusinessBuild.fields.phone.valid && formBusinessBuild.fields.phone.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.phone.label)" inputName="Phone" :inputValue="formBusinessBuild.fields.phone.value" v-model="formBusinessBuild.fields.phone.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.phone.label) }}</label>-->
<!--            </span>-->
<!--              <span :class="{'invalid': !formBusinessBuild.fields.mail.valid && formBusinessBuild.fields.mail.valid !== '', 'valid': formBusinessBuild.fields.mail.valid && formBusinessBuild.fields.mail.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.mail.label)" inputName="Mail" :inputValue="formBusinessBuild.fields.mail.value" v-model="formBusinessBuild.fields.mail.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.mail.label) }}</label>-->
<!--            </span>-->
<!--            </div>-->

<!--            <div class="field-wrapper" :class="{'invalid': !formBusinessBuild.fields.streetAndNr.valid && formBusinessBuild.fields.streetAndNr.valid !== '', 'valid': formBusinessBuild.fields.streetAndNr.valid && formBusinessBuild.fields.streetAndNr.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.streetAndNr.label)" inputName="StreetAndNr" :inputValue="formBusinessBuild.fields.streetAndNr.value" v-model="formBusinessBuild.fields.streetAndNr.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.streetAndNr.label) }}</label>-->
<!--            </div>-->

<!--            <div class="field-wrapper two-col">-->
<!--            <span :class="{'invalid': !formBusinessBuild.fields.postalcode.valid && formBusinessBuild.fields.postalcode.valid !== '', 'valid': formBusinessBuild.fields.postalcode.valid && formBusinessBuild.fields.postalcode.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.postalcode.label)" inputName="Postalcode" :inputValue="formBusinessBuild.fields.postalcode.value" v-model="formBusinessBuild.fields.postalcode.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.postalcode.label) }}</label>-->
<!--            </span>-->
<!--              <span :class="{'invalid': !formBusinessBuild.fields.city.valid && formBusinessBuild.fields.city.valid !== '', 'valid': formBusinessBuild.fields.city.valid && formBusinessBuild.fields.city.valid !== ''}">-->
<!--              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formBusinessBuild.fields.city.label)" inputName="City" :inputValue="formBusinessBuild.fields.city.value" v-model="formBusinessBuild.fields.city.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formBusinessBuild.fields.city.label) }}</label>-->
<!--            </span>-->
<!--            </div>-->

<!--          </div>-->
        </div>

<!--        <div class="page-3" v-if="currentStep === 3">-->
<!--          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Anzahl der Käufer:' : 'Count of buyer:' }}</div>-->
<!--          <div class="step-fields">-->
<!--            <label for="privatField" class="radio-wrapper">-->
<!--              <InputField inputType="radio" id="privatField" inputName="countofPurchaser" value="1" :inputValue="countOfPurchaser" v-model="countOfPurchaser"></InputField>-->
<!--              {{ language === 'DEU' ? '1 Käufer' : '1 Purchaser' }}-->
<!--            </label>-->
<!--            <label for="businessField" class="radio-wrapper">-->
<!--              <InputField inputType="radio" id="businessField" inputName="countofPurchaser" value="2" :inputValue="countOfPurchaser" v-model="countOfPurchaser"></InputField>-->
<!--              {{ language === 'DEU' ? '2 Käufer' : '2 Purchaser' }}-->
<!--            </label>-->
<!--          </div>-->
<!--        </div>-->

        <div class="page-3" v-if="currentStep === 3">
          <div class="fieldgroup-label">
            {{ language === 'DEU' ? 'Identifikation des Käufers / Vertreters / Geschäftspartners / wirtschaftlich Berechtigten' : 'Identification of the representative / business partner / beneficial owner' }}
          </div>
<!--          <div class="field-wrapper two-col">-->
<!--            <span :class="{'invalid': !formDataCustomers.customerOne.fields.salutation.valid  && formDataCustomers.customerOne.fields.salutation.valid !== '', 'valid': formDataCustomers.customerOne.fields.salutation.valid  && formDataCustomers.customerOne.fields.salutation.valid !== ''}">-->
<!--              <InputField class="dropdown-input" inputType="text" :inputPlaceholder="languageBasedlabel(formDataCustomers.customerOne.fields.salutation.label)" inputName="Salutation" :inputValue="formDataCustomers.customerOne.fields.salutation.value" v-model="formDataCustomers.customerOne.fields.salutation.value" @focus="setDropdownTop($event)" @click="showSalutationDropdown = true" @click.stop=""></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.salutation.label) }}</label>-->
<!--              <DropdownArrow class="dropdown-arrow"></DropdownArrow>-->
<!--              <Dropdown ref="dropdownSalutation" :class="{active: showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.salutationList" @dropdown-item-clicked="salutationSelection" @click.stop=""></Dropdown>-->
<!--            </span>-->
<!--              <span :class="{'invalid': !formDataCustomers.customerOne.fields.title.valid  && formDataCustomers.customerOne.fields.title.valid !== '', 'valid': formDataCustomers.customerOne.fields.title.valid  && formDataCustomers.customerOne.fields.title.valid !== ''}">-->
<!--              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.title.label) " inputName="Title" :inputValue="formDataCustomers.customerOne.fields.title.value" v-model="formDataCustomers.customerOne.fields.title.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.title.label) }}</label>-->
<!--            </span>-->
<!--          </div>-->

<!--          <div class="field-wrapper two-col">-->
<!--            <span :class="{'invalid': !formDataCustomers.customerOne.fields.firstName.valid  && formDataCustomers.customerOne.fields.firstName.valid !== '', 'valid': formDataCustomers.customerOne.fields.firstName.valid  && formDataCustomers.customerOne.fields.firstName.valid !== ''}">-->
<!--              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.firstName.label) " inputName="Firstname" :inputValue="formDataCustomers.customerOne.fields.firstName.value" v-model="formDataCustomers.customerOne.fields.firstName.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.firstName.label) }}</label>-->
<!--            </span>-->
<!--              <span :class="{'invalid': !formDataCustomers.customerOne.fields.lastName.valid  && formDataCustomers.customerOne.fields.lastName.valid !== '', 'valid': formDataCustomers.customerOne.fields.lastName.valid  && formDataCustomers.customerOne.fields.lastName.valid !== ''}">-->
<!--              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.lastName.label) " inputName="Lastname" :inputValue="formDataCustomers.customerOne.fields.lastName.value" v-model="formDataCustomers.customerOne.fields.lastName.value"></InputField>-->
<!--              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.lastName.label) }}</label>-->
<!--            </span>-->
<!--          </div>-->

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
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.dateOfBirth.valid  && formDataCustomers.customerOne.fields.dateOfBirth.valid !== '', 'valid': formDataCustomers.customerOne.fields.dateOfBirth.valid  && formDataCustomers.customerOne.fields.dateOfBirth.valid !== ''}">
              <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.dateOfBirth.label) " inputName="Dateofbirth" :inputValue="formDataCustomers.customerOne.fields.dateOfBirth.value" v-model="formDataCustomers.customerOne.fields.dateOfBirth.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.dateOfBirth.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.birthPlace.valid  && formDataCustomers.customerOne.fields.birthPlace.valid !== '', 'valid': formDataCustomers.customerOne.fields.birthPlace.valid  && formDataCustomers.customerOne.fields.birthPlace.valid !== ''}">
              <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.birthPlace.label) " inputName="Birthname" :inputValue="formDataCustomers.customerOne.fields.birthPlace.value" v-model="formDataCustomers.customerOne.fields.birthPlace.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.birthPlace.label) }}</label>
            </span>
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.country.valid  && formDataCustomers.customerOne.fields.country.valid !== '', 'valid': formDataCustomers.customerOne.fields.country.valid  && formDataCustomers.customerOne.fields.country.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.country.label) " inputName="BirthCountry" :inputValue="formDataCustomers.customerOne.fields.country.value" v-model="formDataCustomers.customerOne.fields.country.value" @focus="setDropdownTop($event)" @click="showCountryDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.country.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownBirthCountry" :class="{active: showCountryDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formDataCustomers.customerOne.fields.country.value" @dropdown-item-clicked="birthCountrySelection" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span :class="{'invalid': !formDataCustomers.customerOne.fields.nationality.valid  && formDataCustomers.customerOne.fields.nationality.valid !== '', 'valid': formDataCustomers.customerOne.fields.nationality.valid  && formDataCustomers.customerOne.fields.nationality.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formDataCustomers.customerOne.fields.nationality.label) " inputName="Nationality" :inputValue="formDataCustomers.customerOne.fields.nationality.value" v-model="formDataCustomers.customerOne.fields.nationality.value" @focus="setDropdownTop($event)" @click="showNationalityDropdown = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formDataCustomers.customerOne.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownNationality" :class="{active: showNationalityDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" :filterFor="formDataCustomers.customerOne.fields.nationality.value" @dropdown-item-clicked="nationalitySelection" @click.stop=""></Dropdown>
            </span>
          </div>

        </div>

        <div class="page-4" v-else-if="currentStep === 4">
          <div class="fieldgroup-label">
            {{ language === 'DEU' ? 'Politisch exponierte Personen (PEPs)' : 'Politically exposed persons (PEPs)' }}
            <div class="info" v-if="language === 'DEU'">Haben/Hatten Sie derzeit oder innerhalb des letzten Jahres eine wichtige politische, rechtliche oder administrative Position inne? <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 1"><sup>i</sup></span></div>
            <div class="info" v-else>Do you currently hold, or have you held within the last year, an important political, legal or administrative position? <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 1"><sup>i</sup></span></div>
          </div>
          <div class="field-wrapper" style="justify-content: center">
            <label for="pepValueYes" class="radio-wrapper">
              <InputField inputType="radio" id="pepValueYes" inputName="pepValue" value="yes" :inputValue="pepValue" v-model="pepValue"></InputField>
              {{ language === 'DEU' ? 'Ja' : 'Yes' }}
            </label>
            <label for="pepValueNo" class="radio-wrapper">
              <InputField inputType="radio" id="pepValueNo" inputName="pepValue" value="no" :inputValue="pepValue" v-model="pepValue"></InputField>
              {{ language === 'DEU' ? 'Nein' : 'No' }}
            </label>
          </div>
          <div class="field-wrapper" :class="{'invalid': !formPEP.fields.kindOfPosition.valid  && formPEP.fields.kindOfPosition.valid !== '', 'valid': formPEP.fields.kindOfPosition.valid  && formPEP.fields.kindOfPosition.valid !== ''}" v-if="pepValue === 'yes'">
            <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formPEP.fields.kindOfPosition.label)" inputName="AccountOwner" :inputValue="formPEP.fields.kindOfPosition.value" v-model="formPEP.fields.kindOfPosition.value"></InputField>
            <label class="ph">{{ languageBasedlabel(formPEP.fields.kindOfPosition.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
          </div>
          <div class="field-wrapper" :class="{'invalid': !formPEP.fields.country.valid  && formPEP.fields.country.valid !== '', 'valid': formPEP.fields.country.valid  && formPEP.fields.country.valid !== ''}" v-if="pepValue === 'yes'">
            <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEP.fields.country.label) " inputName="Nationality" :inputValue="formPEP.fields.country.value" v-model="formPEP.fields.country.value" @focus="setDropdownTop($event)" @click="showKindOfPositionCountryDropdown = true" @click.stop=""></InputField>
            <label class="ph">{{ languageBasedlabel(formPEP.fields.country.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown ref="dropdownNationality" :class="{active: showKindOfPositionCountryDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formPEP.fields.country.value" @dropdown-item-clicked="kindOfPositionSelection" @click.stop=""></Dropdown>
          </div>
        </div>

        <div class="page-5" v-else-if="currentStep === 5">
          <div class="fieldgroup-label">
            {{ language === 'DEU' ? 'Politisch exponierte Personen (PEPs)' : 'Politically exposed persons (PEPs)' }}
            <div class="info" v-if="language === 'DEU'">Hat/Hatte eine Ihnen nahestehende Person derzeit oder innerhalb des letzten Jahres eine wichtige politische, rechtliche oder administrative Position inne? <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 2"><sup>i</sup></span></div>
            <div class="info" v-else>Does a person close to you currently hold, or has it held within the last year, an important political, legal or administrative position? <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 2"><sup>i</sup></span></div>
          </div>

          <div class="field-wrapper" style="justify-content: center">
            <label for="pepValueYes" class="radio-wrapper">
              <InputField inputType="radio" id="pepValueYes" inputName="pepValue" value="yes" :inputValue="pepValueOthers" v-model="pepValueOthers"></InputField>
              {{ language === 'DEU' ? 'Ja' : 'Yes' }}
            </label>
            <label for="pepValueNo" class="radio-wrapper">
              <InputField inputType="radio" id="pepValueNo" inputName="pepValue" value="no" :inputValue="pepValueOthers" v-model="pepValueOthers"></InputField>
              {{ language === 'DEU' ? 'Nein' : 'No' }}
            </label>
          </div>

          <span v-if="pepValueOthers === 'yes'" style="display: block; margin-top: 25px;">
            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthers.fields.firstname.valid  && formPEPOthers.fields.firstname.valid !== '', 'valid': formPEPOthers.fields.firstname.valid  && formPEPOthers.fields.firstname.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.firstname.label) " inputName="Firstname" :inputValue="formPEPOthers.fields.firstname.value" v-model="formPEPOthers.fields.firstname.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.firstname.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
                <span :class="{'invalid': !formPEPOthers.fields.lastname.valid  && formPEPOthers.fields.lastname.valid !== '', 'valid': formPEPOthers.fields.lastname.valid  && formPEPOthers.fields.lastname.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.lastname.label) " inputName="lastname" :inputValue="formPEPOthers.fields.lastname.value" v-model="formPEPOthers.fields.lastname.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.lastname.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>
            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthers.fields.street.valid  && formPEPOthers.fields.street.valid !== '', 'valid': formPEPOthers.fields.street.valid  && formPEPOthers.fields.street.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.street.label) " inputName="Firstname" :inputValue="formPEPOthers.fields.street.value" v-model="formPEPOthers.fields.street.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.street.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
                <span :class="{'invalid': !formPEPOthers.fields.zipcode.valid  && formPEPOthers.fields.zipcode.valid !== '', 'valid': formPEPOthers.fields.zipcode.valid  && formPEPOthers.fields.zipcode.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.zipcode.label) " inputName="Lastname" :inputValue="formPEPOthers.fields.zipcode.value" v-model="formPEPOthers.fields.zipcode.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.zipcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>
            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthers.fields.city.valid  && formPEPOthers.fields.city.valid !== '', 'valid': formPEPOthers.fields.city.valid  && formPEPOthers.fields.city.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.city.label) " inputName="Firstname" :inputValue="formPEPOthers.fields.city.value" v-model="formPEPOthers.fields.city.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
              <span :class="{'invalid': !formPEPOthers.fields.country.valid  && formPEPOthers.fields.country.valid !== '', 'valid': formPEPOthers.fields.country.valid  && formPEPOthers.fields.country.valid !== ''}">
                <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.country.label) " inputName="Nationality" :inputValue="formPEPOthers.fields.country.value" v-model="formPEPOthers.fields.country.value" @focus="setDropdownTop($event)" @click="showPopOthersCountry = true" @click.stop=""></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.country.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showPopOthersCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formPEPOthers.fields.country.value" @dropdown-item-clicked="popsOthersCountrySelection" @click.stop=""></Dropdown>
              </span>
            </div>
            
            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthers.fields.dateOfBirth.valid  && formPEPOthers.fields.dateOfBirth.valid !== '', 'valid': formPEPOthers.fields.dateOfBirth.valid  && formPEPOthers.fields.dateOfBirth.valid !== ''}">
                <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.dateOfBirth.label) " inputName="dateOfBirth" :inputValue="formPEPOthers.fields.dateOfBirth.value" v-model="formPEPOthers.fields.dateOfBirth.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.dateOfBirth.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
              <span :class="{'invalid': !formPEPOthers.fields.nationality.valid  && formPEPOthers.fields.nationality.valid !== '', 'valid': formPEPOthers.fields.nationality.valid  && formPEPOthers.fields.nationality.valid !== ''}">
                <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.nationality.label) " inputName="Nationality" :inputValue="formPEPOthers.fields.nationality.value" v-model="formPEPOthers.fields.nationality.value" @focus="setDropdownTop($event)" @click="showPepOthersNationatlity = true" @click.stop=""></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showPepOthersNationatlity, relative: dropdownRelativePosition}" type="nationality" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" :filterFor="formPEPOthers.fields.nationality.value" @dropdown-item-clicked="popsOthersNationalitySelection" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthers.fields.kindOfPosition.valid  && formPEPOthers.fields.kindOfPosition.valid !== '', 'valid': formPEPOthers.fields.kindOfPosition.valid  && formPEPOthers.fields.kindOfPosition.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.kindOfPosition.label) " inputName="kindOfPositionOthers" :inputValue="formPEPOthers.fields.kindOfPosition.value" v-model="formPEPOthers.fields.kindOfPosition.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.kindOfPosition.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
              <span :class="{'invalid': !formPEPOthers.fields.countryOfPosition.valid  && formPEPOthers.fields.countryOfPosition.valid !== '', 'valid': formPEPOthers.fields.countryOfPosition.valid  && formPEPOthers.fields.countryOfPosition.valid !== ''}">
                <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.countryOfPosition.label) " inputName="Nationality" :inputValue="formPEPOthers.fields.countryOfPosition.value" v-model="formPEPOthers.fields.countryOfPosition.value" @focus="setDropdownTop($event)" @click="showPepPositionCountry = true" @click.stop=""></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.countryOfPosition.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showPepPositionCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formPEPOthers.fields.countryOfPosition.value" @dropdown-item-clicked="popsOthersPositionCountrySelection" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthers.fields.relationship.valid  && formPEPOthers.fields.relationship.valid !== '', 'valid': formPEPOthers.fields.relationship.valid  && formPEPOthers.fields.relationship.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthers.fields.relationship.label) " inputName="kindOfPositionOthers" :inputValue="formPEPOthers.fields.relationship.value" v-model="formPEPOthers.fields.relationship.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthers.fields.relationship.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>

            <div class="additional-person" @click="pepValueAdditionalPerson = !pepValueAdditionalPerson" style="display: block; margin-bottom: 25px;">
              <span v-if="language === 'DEU'">{{ !pepValueAdditionalPerson ? 'Weiter Person angeben' : 'Weiter Person ausblenden' }}</span>
              <span v-else>{{ !pepValueAdditionalPerson ? 'Add Person' : 'Hide Person' }}</span>
              <plusIcon></plusIcon>
            </div>

            <span class="additional-person-wrapper" v-if="pepValueAdditionalPerson">

              <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.firstname.valid  && formPEPOthersAdditionalPerson.fields.firstname.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.firstname.valid  && formPEPOthersAdditionalPerson.fields.firstname.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.firstname.label) " inputName="Firstname" :inputValue="formPEPOthersAdditionalPerson.fields.firstname.value" v-model="formPEPOthersAdditionalPerson.fields.firstname.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.firstname.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
                <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.lastname.valid  && formPEPOthersAdditionalPerson.fields.lastname.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.lastname.valid  && formPEPOthersAdditionalPerson.fields.lastname.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.lastname.label) " inputName="lastname" :inputValue="formPEPOthersAdditionalPerson.fields.lastname.value" v-model="formPEPOthersAdditionalPerson.fields.lastname.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.lastname.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>
            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.street.valid  && formPEPOthersAdditionalPerson.fields.street.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.street.valid  && formPEPOthersAdditionalPerson.fields.street.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.street.label) " inputName="Firstname" :inputValue="formPEPOthersAdditionalPerson.fields.street.value" v-model="formPEPOthersAdditionalPerson.fields.street.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.street.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
                <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.zipcode.valid  && formPEPOthersAdditionalPerson.fields.zipcode.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.zipcode.valid  && formPEPOthersAdditionalPerson.fields.zipcode.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.zipcode.label) " inputName="Lastname" :inputValue="formPEPOthersAdditionalPerson.fields.zipcode.value" v-model="formPEPOthersAdditionalPerson.fields.zipcode.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.zipcode.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>
            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.city.valid  && formPEPOthersAdditionalPerson.fields.city.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.city.valid  && formPEPOthersAdditionalPerson.fields.city.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.city.label) " inputName="Firstname" :inputValue="formPEPOthersAdditionalPerson.fields.city.value" v-model="formPEPOthersAdditionalPerson.fields.city.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.city.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.country.valid  && formPEPOthersAdditionalPerson.fields.country.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.country.valid  && formPEPOthersAdditionalPerson.fields.country.valid !== ''}">
                <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.country.label) " inputName="Nationality" :inputValue="formPEPOthersAdditionalPerson.fields.country.value" v-model="formPEPOthersAdditionalPerson.fields.country.value" @focus="setDropdownTop($event)" @click="showPopOthersAdditionalCountry = true" @click.stop=""></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.country.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showPopOthersAdditionalCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formPEPOthersAdditionalPerson.fields.country.value" @dropdown-item-clicked="popsOthersAdditionalCountrySelection" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.dateOfBirth.valid  && formPEPOthersAdditionalPerson.fields.dateOfBirth.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.dateOfBirth.valid  && formPEPOthersAdditionalPerson.fields.dateOfBirth.valid !== ''}">
                <InputField inputType="date" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.dateOfBirth.label) " inputName="dateOfBirth" :inputValue="formPEPOthersAdditionalPerson.fields.dateOfBirth.value" v-model="formPEPOthersAdditionalPerson.fields.dateOfBirth.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.dateOfBirth.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.nationality.valid  && formPEPOthersAdditionalPerson.fields.nationality.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.nationality.valid  && formPEPOthersAdditionalPerson.fields.nationality.valid !== ''}">
                <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.nationality.label) " inputName="Nationality" :inputValue="formPEPOthersAdditionalPerson.fields.nationality.value" v-model="formPEPOthersAdditionalPerson.fields.nationality.value" @focus="setDropdownTop($event)" @click="showPopOthersAdditionalNationality = true" @click.stop=""></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.nationality.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showPopOthersAdditionalNationality, relative: dropdownRelativePosition}" type="nationality" :renderingObject="language === 'DEU' ? this.nationalityList : this.nationalityListEN" :filterFor="formPEPOthersAdditionalPerson.fields.nationality.value" @dropdown-item-clicked="popsOthersAdditonalNationalitySelection" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.kindOfPosition.valid  && formPEPOthersAdditionalPerson.fields.kindOfPosition.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.kindOfPosition.valid  && formPEPOthersAdditionalPerson.fields.kindOfPosition.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.kindOfPosition.label) " inputName="kindOfPositionOthers" :inputValue="formPEPOthersAdditionalPerson.fields.kindOfPosition.value" v-model="formPEPOthersAdditionalPerson.fields.kindOfPosition.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.kindOfPosition.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.countryOfPosition.valid  && formPEPOthersAdditionalPerson.fields.countryOfPosition.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.countryOfPosition.valid  && formPEPOthersAdditionalPerson.fields.countryOfPosition.valid !== ''}">
                <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.countryOfPosition.label) " inputName="Nationality" :inputValue="formPEPOthersAdditionalPerson.fields.countryOfPosition.value" v-model="formPEPOthersAdditionalPerson.fields.countryOfPosition.value" @focus="setDropdownTop($event)" @click="showPepPositionAdditionalCountry = true" @click.stop=""></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.countryOfPosition.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownNationality" :class="{active: showPepPositionAdditionalCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formPEPOthersAdditionalPerson.fields.countryOfPosition.value" @dropdown-item-clicked="popsOthersAdditionalPositionCountrySelection" @click.stop=""></Dropdown>
              </span>
            </div>

            <div class="field-wrapper two-col">
              <span :class="{'invalid': !formPEPOthersAdditionalPerson.fields.relationship.valid  && formPEPOthersAdditionalPerson.fields.relationship.valid !== '', 'valid': formPEPOthersAdditionalPerson.fields.relationship.valid  && formPEPOthersAdditionalPerson.fields.relationship.valid !== ''}">
                <InputField inputType="text" :inputplaceholder=" languageBasedlabel(formPEPOthersAdditionalPerson.fields.relationship.label) " inputName="kindOfPositionOthers" :inputValue="formPEPOthersAdditionalPerson.fields.relationship.value" v-model="formPEPOthersAdditionalPerson.fields.relationship.value"></InputField>
                <label class="ph">{{ languageBasedlabel(formPEPOthersAdditionalPerson.fields.relationship.label) }} <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>

            </span>

          </span>
        </div>

        <div class="page-6" v-else-if="currentStep === 6">
          <div class="fieldgroup-label">
            <span v-if="language === 'DEU'">Angaben über die Herkunft der Mittel, mit denen Sie das Geschäft finanzieren – nur, wenn Sie in eigenem Namen handeln (z.B. potenzieller Käufer, Mieter)</span>
            <span v-else><b>Information about the origin of the funds you use to finance the transaction</b> - only if youare acting on your own behalf (e.g. potential buyer, tenant)</span>
          </div>
          <div class="fieldgroup-label subheadlines">
            {{ language === 'DEU' ? 'Bank-Finanzierung' : 'Bank financing' }}
          </div>
          <div class="field-wrapper finance three-col">
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.bankPercent.valid  && formFinancial.fields.bankPercent.valid !== '', 'valid': formFinancial.fields.bankPercent.valid  && formFinancial.fields.bankPercent.valid !== ''}">
              <InputField inputType="number" min="0" max="100" :inputPlaceholder="languageBasedlabel(formFinancial.fields.bankPercent.label)" inputName="bankPercent" :inputValue="formFinancial.fields.bankPercent.value" v-model="formFinancial.fields.bankPercent.value" @input="checkInputLength"></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.bankPercent.label) }}</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.bankSource.valid  && formFinancial.fields.bankSource.valid !== '', 'valid': formFinancial.fields.bankSource.valid  && formFinancial.fields.bankSource.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formFinancial.fields.bankSource.label)" inputName="AccountOwner" :inputValue="formFinancial.fields.bankSource.value" v-model="formFinancial.fields.bankSource.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.bankSource.label) }}</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.bankSourceCountry.valid  && formFinancial.fields.bankSourceCountry.valid !== '', 'valid': formFinancial.fields.bankSourceCountry.valid  && formFinancial.fields.bankSourceCountry.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder="languageBasedlabel(formFinancial.fields.bankSourceCountry.label)" inputName="BankSourceCountry" :inputValue="formFinancial.fields.bankSourceCountry.value" v-model="formFinancial.fields.bankSourceCountry.value" @focus="setDropdownTop($event)" @click="showfinanceBankSourceCountry = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.bankSourceCountry.label) }}</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownBankSourceCountry" :class="{active: showfinanceBankSourceCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formFinancial.fields.bankSourceCountry.value" @dropdown-item-clicked="popsFinanceBankSelection" @click.stop=""></Dropdown>
            </div>
          </div>

          <div class="fieldgroup-label subheadlines">
            {{ language === 'DEU' ? 'Eigenmittel' : 'Equity' }}
          </div>
          <div class="field-wrapper three-col">
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.ownMoneyPercent.valid  && formFinancial.fields.ownMoneyPercent.valid !== '', 'valid': formFinancial.fields.ownMoneyPercent.valid  && formFinancial.fields.ownMoneyPercent.valid !== ''}">
              <InputField inputType="number" min="0" max="100" :inputPlaceholder="languageBasedlabel(formFinancial.fields.ownMoneyPercent.label)" inputName="ownMoneyPercent" :inputValue="formFinancial.fields.ownMoneyPercent.value" v-model="formFinancial.fields.ownMoneyPercent.value" @input="checkInputLength"></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.ownMoneyPercent.label) }}</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.ownMoneySource.valid  && formFinancial.fields.ownMoneySource.valid !== '', 'valid': formFinancial.fields.ownMoneySource.valid  && formFinancial.fields.ownMoneySource.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formFinancial.fields.ownMoneySource.label)" inputName="AccountOwner" :inputValue="formFinancial.fields.ownMoneySource.value" v-model="formFinancial.fields.ownMoneySource.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.ownMoneySource.label) }}</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.ownMoneySourceCountry.valid  && formFinancial.fields.ownMoneySourceCountry.valid !== '', 'valid': formFinancial.fields.ownMoneySourceCountry  && formFinancial.fields.ownMoneySourceCountry.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formFinancial.fields.ownMoneySourceCountry.label) " inputName="OwnMoneySourceCountry" :inputValue="formFinancial.fields.ownMoneySourceCountry.value" v-model="formFinancial.fields.ownMoneySourceCountry.value" @focus="setDropdownTop($event)" @click="showfinanceOwnMoneySourceCountry = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.ownMoneySourceCountry.label) }}</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownOwnMoneySourceCountry" :class="{active: showfinanceOwnMoneySourceCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formFinancial.fields.ownMoneySourceCountry.value" @dropdown-item-clicked="popsFinanceOwnMoneySelection" @click.stop=""></Dropdown>
            </div>
          </div>

          <div class="fieldgroup-label subheadlines">
            {{ language === 'DEU' ? 'Sonstiges' : 'Others' }}
          </div>
          <div class="field-wrapper three-col">
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.othersPercent.valid  && formFinancial.fields.othersPercent.valid !== '', 'valid': formFinancial.fields.othersPercent.valid  && formFinancial.fields.othersPercent.valid !== ''}">
              <InputField inputType="number" min="0" max="100" :inputPlaceholder="languageBasedlabel(formFinancial.fields.othersPercent.label)" inputName="othersPercent" :inputValue="formFinancial.fields.othersPercent.value" v-model="formFinancial.fields.othersPercent.value" @input="checkInputLength"></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.othersPercent.label) }}</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.othersSource.valid  && formFinancial.fields.othersSource.valid !== '', 'valid': formFinancial.fields.othersSource.valid  && formFinancial.fields.othersSource.valid !== ''}">
              <InputField inputType="text" :inputPlaceholder="languageBasedlabel(formFinancial.fields.othersSource.label)" inputName="AccountOwner" :inputValue="formFinancial.fields.othersSource.value" v-model="formFinancial.fields.othersSource.value"></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.othersSource.label) }}</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !formFinancial.fields.othersSourceCountry.valid  && formFinancial.fields.othersSourceCountry.valid !== '', 'valid': formFinancial.fields.othersSourceCountry.valid  && formFinancial.fields.othersSourceCountry.valid !== ''}">
              <InputField class="dropdown-input" inputType="text" :inputplaceholder=" languageBasedlabel(formFinancial.fields.othersSourceCountry.label) " inputName="OthersSourceCountry" :inputValue="formFinancial.fields.othersSourceCountry.value" v-model="formFinancial.fields.othersSourceCountry.value" @focus="setDropdownTop($event)" @click="showfinanceOthersSourceCountry = true" @click.stop=""></InputField>
              <label class="ph">{{ languageBasedlabel(formFinancial.fields.othersSourceCountry.label) }}</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownOthersSourceCountry" :class="{active: showfinanceOthersSourceCountry, relative: dropdownRelativePosition}" type="country" :renderingObject="language === 'DEU' ? this.countryList : this.countryListEN" :filterFor="formFinancial.fields.othersSourceCountry.value" @dropdown-item-clicked="popsFinanceOthersSelection" @click.stop=""></Dropdown>
            </div>
            <span class="info" style="margin-top:15px;">
              {{ language === 'DEU' ? '* zum Beispiel Ersparnisse bei Banken oder Versicherungen, Schenkungen, Einkünfte, Erbschaften' : '* for example bank or insurance savings, donation, revenues of activities, inheritance' }}
            </span>
            <div class="info" style="flex-basis: 100%">
              {{ language === 'DEU' ? 'Teilen Sie uns mit wie Sie die Immobilie/n zu 100% finanzieren wollen:' : 'Tell us how you want to finance the property/s at 100%.' }}
              <b :class="{'invalid': !financeStepValidation.valid }">{{ language === 'DEU' ? 'Offene Finanzierung:' : 'Open funding' }} {{ financeInsertValueLeft }}%</b>
            </div>
          </div>

<!--          <div class="field-wrapper" :class="{'invalid': !uploads.confirmationOfBank.valid  && uploads.confirmationOfBank.valid !== '', 'valid': uploads.confirmationOfBank.valid  && uploads.confirmationOfBank.valid !== ''}">-->
<!--            <label :for="'confirmationBank'" class="option-wrapper">-->
<!--              <InputField inputType="checkbox" id="confirmationBank" inputName="confirmationBank" :inputValue="uploads.confirmationOfBank.checkbox" v-model="uploads.confirmationOfBank.checkbox"></InputField>-->
<!--              {{ languageBasedlabel(uploads.confirmationOfBank.label) }}-->
<!--            </label>-->
<!--          </div>-->
<!--          <div class="upload-fields" v-if="uploads.confirmationOfBank.checkbox">-->
<!--            <UploadFieldArea :defaultFiles="uploads.confirmationOfBank.files" :language="language" :maxFiles="5" @uploadedFiles="updateFilesForConfirmationOfBank"></UploadFieldArea>-->
<!--          </div>-->

<!--          <div class="field-wrapper" :class="{'invalid': !uploads.proofOfOwnRessources.valid  && uploads.proofOfOwnRessources.valid !== '', 'valid': uploads.proofOfOwnRessources.valid && uploads.proofOfOwnRessources.valid !== ''}">-->
<!--            <label :for="'proofOfOwnRessources'" class="option-wrapper">-->
<!--              <InputField inputType="checkbox" id="proofOfOwnRessources" inputName="confirmationBank" :inputValue="uploads.proofOfOwnRessources.checkbox" v-model="uploads.proofOfOwnRessources.checkbox"></InputField>-->
<!--              {{ languageBasedlabel(uploads.proofOfOwnRessources.label) }}-->
<!--            </label>-->
<!--          </div>-->
<!--          <div class="upload-fields" v-if="uploads.proofOfOwnRessources.checkbox">-->
<!--            <UploadFieldArea :defaultFiles="uploads.proofOfOwnRessources.files" :language="language" :maxFiles="5" @uploadedFiles="updateFilesProofOfOwnRessources"></UploadFieldArea>-->
<!--          </div>-->

          <div v-if="!financeStepValidation.valid" style="color: red; margin-top: 25px; text-align: center">
            <AlertIcon></AlertIcon>
            {{ financeStepValidation.msg }}
          </div>

        </div>

        <div class="page-7" v-else-if="currentStep === 7">

          <div class="fieldgroup-label subheadlines">
            {{ language === 'DEU' ? 'Weitere Angaben' : 'Attached evidence:' }}
          </div>
          <div class="field-wrapper" style="margin-bottom: 20px;">
            <label :for="'legalSources'" class="option-wrapper" :class="{'invalid': !legalSourceOfFinance.valid}">
              <input type="checkbox" id="legalSources" name="legalSources" v-model="legalSourceOfFinance.checkbox">
              <span v-if="language === 'DEU'">Die bei der Transaktion verwendeten Gelder stammen <span class="highlight-label-text">aus legalen Quellen</span></span>
              <span v-else>The funds used in the transaction come <span class="highlight-label-text">from legal sources</span></span>
            </label>
          </div>

          <div class="field-wrapper">
            <label :for="'Unsanctioned'" class="option-wrapper" :class="{'invalid': !notOnSanktionalLists.valid}">
              <input type="checkbox" id="Unsanctioned" name="Unsanctioned" v-model="notOnSanktionalLists.checkbox">
              <span v-if="language === 'DEU'" style="display: flex;">Ich werde <span class="highlight-label-text">nicht</span> auf einer Sanktionsliste geführt (EU, UN etc.) <span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 3"><sup style="top:0px;">i</sup></span></span>
              <span v-else>I am <span class="highlight-label-text">not</span> on a sanctions list (EU, UN etc.)<span class="tooltip-icon" @click="showToolTips = true; currentToolTipContent = 3"><sup style="top:0px;">i</sup></span></span>
            </label>
          </div>

          <div class="field-wrapper">
            <label :for="'notCooperatedCountry'" class="option-wrapper" :class="{'invalid': !notCooperatedCountryCheckbox.valid}">
              <input type="checkbox" id="notCooperatedCountry" name="notCooperatedCountry" v-model="notCooperatedCountryCheckbox.checkbox">
              <span v-if="language === 'DEU'" style="display: flex;">
                Ich bin in einem für Steuerzwecke nicht kooperativen Land, einem Risikoland im Sinne von § 15 Abs.
                2 oder 3 Nr. 2 GWG oder einem Land, das restriktiven Maßnahmen/Sanktionen des deutschen Staates
                bzw. der EU unterliegt ansässig, handel mit solchen Ländern oder habe dort
                sonstige wirtschaftliche Interessen</span>
              <span v-else>
                I am residing or having economic interests in a non-cooperative country for tax purposes, or in a
                risk country within the meaning of Section 15 (2) or (3) no. 2 GWG, or which is subject to restrictive
                measures/sanctions by the German state or the EU, or I am trading with such countries
              </span>
            </label>
          </div>

          <div class="field-wrapper" style="margin-top:25px;" v-if="notCooperatedCountryCheckbox.checkbox">
            <textAreaField id="notCooperatedCountriesText" inputName="notCooperatedCountriesText" :inputVal="notCooperatedCountryList" v-model="notCooperatedCountryList"></textAreaField>
            <label class="ph">
              {{ language === 'DEU' ? 'Geben Sie bitte diese Länder an' : 'Please indicate these countries' }}
            </label>
          </div>

          <b style="display: block; margin-top: 25px;">
            {{ language === 'DEU' ? 'Die Gesellschaft behält sich das Recht vor, zusätzliche Erklärungen und Informationen anzufordern.' : 'The Company reserves the right to request additional explanations and information.' }}
          </b>

          <div class="fieldgroup-label subheadlines">
            {{ language === 'DEU' ? 'Beizufügende Unterlagen – natürliche Person' : 'Documents to be attached - natural person' }}
          </div>

          <div class="field-wrapper" :class="{'invalid': !uploads.proofOfRepresentation.valid  && uploads.proofOfRepresentation.valid !== '', 'valid': uploads.proofOfRepresentation.valid && uploads.proofOfRepresentation.valid !== ''}">
            <label :for="'proofOfRepresentation'" class="option-wrapper">
              <input type="checkbox" id="proofOfRepresentation" name="proofOfRepresentation" v-model="uploads.proofOfRepresentation.checkbox">
              <span>
                  {{ language === 'DEU' ? 'Falls Sie Vertreter sind, Vertretungsnachweis (z.B. Vollmacht, Handelsregisterauszug, Auszug aus Genossenschaftsregister etc.)' : 'If you are a representative, proof of representation (e.g. power of attorney, extract from the commercial register, extract from the register of cooperatives, etc.)' }}
                </span>
            </label>
          </div>
          <div class="upload-fields" v-if="uploads.proofOfRepresentation.checkbox">
            <UploadFieldArea :defaultFiles="uploads.proofOfRepresentation.files" :language="language" :maxFiles="5" @uploadedFiles="updateFilesProofOfRepresentation"></UploadFieldArea>
          </div>

          <div class="field-wrapper" style="margin-top:50px;">
            <textAreaField id="proofOfRepresentation" inputName="additionalInformations" :inputVal="additionalInformations" v-model="additionalInformations"></textAreaField>
            <label class="ph">
              {{ language === 'DEU' ? 'Zusätzliche Informationen, die Sie uns mitteilen möchten' : 'Additional information that you would like to share with us' }}
            </label>
          </div>

        </div>

        <div class="page-8 summary" v-else-if="currentStep === 8">
          <div class="thank-you-page" v-if="submitHandler.formSubmitted === true && submitHandler.message !== ''">
            {{ submitHandler.message }}
          </div>
          <span v-else>
            <div class="fieldgroup-label">{{ language === 'DEU' ? 'Zusammenfassung:' : 'Summary:' }}</div>
            <span v-html="summaryRendering"></span>
          </span>
        </div>

        <div class="actions" :style="{ justifyContent: currentStep === 1 ? 'end' : '' }" v-if="!submitHandler.formSubmitted">

          <Button type="edit" v-if="currentStep > 1" @click="currentStep = currentStep-1; showToolTips = false;">{{ language === 'DEU' ? 'Zurück' : 'Back' }}</Button>
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

label:not(.radio-wrapper) {
  /*flex-basis: 100%;*/
  /*display: flex;*/
  text-align: left;
}

label.option-wrapper {
  flex-basis: 100%;
  display: flex;
}

label:not(.radio-wrapper) input {
  flex-basis: 25px !important;
  margin-right: 10px;
}

label:not(.radio-wrapper) span {
  flex-basis: 90%;
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

.invalid input {
  border-left: 5px solid red;
}

.info {
  font-size: 12px;
}

.additional-person {
  color: var(--blue);
  cursor: pointer;
  text-align: center;
  margin-top: 15px;
}

.three-col > div {
  flex-basis: 30%;
}

.three-col .field-wrapper {
  margin-top: 0;
}

.subheadlines {
  margin-top: 25px;
  margin-bottom: 10px;
}

.upload-fields {
  margin-bottom: 25px;
  margin-top: 15px;
}

.highlight-label-text {
  display: contents;
  font-weight: 700;
}

input[type="checkbox"] {
  top: 0;
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

sup {
  position: relative;
  top: 4px;
  background: var(--blue);
  width: 20px;
  display: inline-block;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: white;
  margin-left: 3px;
  font-weight: 700;
}


.field-wrapper.invalid + .upload-fields .dropzone-container {
  border: var(--red) 1px solid;
}

b.invalid {
  color: red;
}

.thank-you-page {
  text-align: center;
}

.three-col > .field-wrapper:nth-of-type(3) .dropdown {
  top: 40px;
}

@media (max-width: 767px) {
  .actions {
    flex-wrap: wrap;
  }

  .summary + .actions > .button + .button {
    margin-top: 15px;
  }
  .summary + .actions > .button  {
    flex-basis: 100% !important;
  }

  .three-col > div {
    flex-basis: 100%;
    margin-top: 15px;
  }
  .three-col > div:nth-of-type(3) {
    flex-basis: 100%;
    margin-top: 15px;
  }
  form {
    min-width: 50%;
    width: 100%;
  }
  .field-wrapper.two-col span {
    flex-basis: 100%;
  }
  .field-wrapper.two-col span {
    margin-left: 0;
    margin-top: 15px;
  }
  .field-wrapper.two-col span:first-of-type {
    margin-top: 0;
  }
  .three-col > div {
    flex-basis: 100%;
    margin-top: 15px !important;
  }
  label.radio-wrapper + label.radio-wrapper {
    margin-left: 15px;
  }
}

</style>
