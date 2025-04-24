<script>
import TextAreaField from "@/components/forms/TextAreaField.vue";
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import axios from "axios";

export default {
    name: "SearchCriteriaForm",
    components: {
      AsterixMarkIcon, DropdownArrow, Dropdown, InputField, TextAreaField
    },
    props: {
      activityId: String,
      customerDataSC: {
        type: [Array, Object],
        default: {}
      },
      triggerValidation: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        searchCriteria: {
          kind: {
            required: true,
            value: 'Kauf',
            valid: true,
          },
          timeOfPurchase: {
            required: false,
            value: '',
            valid: true,
          },
          purpose: {
            required: true,
            value: '',
            valid: true,
          },
          buyExperience: {
            required: true,
            value: '',
            valid: true,
          },
          typeOfUse: {
            required: true,
            value: '',
            valid: true,
          },
          rentStatus: {
            required: true,
            value: ['Alle'],
            valid: true,
          },
          moveInDate: {
            required: false,
            value: '',
            valid: true,
          },
          county: {
            required: true,
            value: 'Alle',
            valid: true,
          },
          city: {
            required: true,
            value: '',
            valid: true,
          },
          district: {
            required: false,
            value: ['Alle'],
            valid: true,
          },
          roomsFrom: {
            required: true,
            value: '',
            valid: true,
          },
          roomsTo: {
            required: true,
            value: '',
            valid: true,
          },
          squareMetresFrom: {
            required: true,
            value: '',
            valid: true,
          },
          squareMetresTo: {
            required: true,
            value: '',
            valid: true,
          },
          balcony: {
            required: false,
            value: 'false',
            valid: true,
          },
          terrace: {
            required: false,
            value: 'false',
            valid: true,
          },
          garden: {
            required: false,
            value: 'false',
            valid: true,
          },
          lift: {
            required: false,
            value: 'false',
            valid: true,
          },
          basement: {
            required: false,
            value: 'false',
            valid: true,
          },
          parkingSlot: {
            required: false,
            value: 'false',
            valid: true,
          },
          newOrExisting: {
            required: false,
            value: 'Beides',
            valid: true,
          },
          constructionYear: {
            required: false,
            value: '',
            valid: true,
          },
          maxBudget: {
            required: true,
            value: '',
            valid: true,
          },
          equityCapital: {
            required: false,
            value: '',
            valid: true,
          },
          kindOfFinance: {
            required: false,
            value: '',
            valid: true,
          },
          beachCategory: {
            required: false,
            value: '',
            valid: true,
          },
          approvedFinance: {
            required: false,
            value: '',
            valid: true,
          },
          notice: {
            required: false,
            value: '',
            valid: true,
          },
          // Alicante Fields
          realEstateType: {
            required: false,
            value: '',
            valid: true,
          },
          bedRooms: {
            required: false,
            value: '',
            valid: true,
          },
          bathRooms: {
            required: false,
            value: '',
            valid: true,
          },
          location: {
            required: false,
            value: '',
            valid: true,
          },
          oceanView: {
            required: false,
            value: 'false',
            valid: true,
          },
          pool: {
            required: false,
            value: 'false',
            valid: true,
          },
          privatGarden: {
            required: false,
            value: 'false',
            valid: true,
          },
          golf: {
            required: false,
            value: 'false',
            valid: true,
          },
          additionalWishes: {
            required: false,
            value: 'false',
            valid: true,
          },
          additionalWishesText: {
            required: false,
            value: '',
            valid: true,
          },
          needCredit: {
            required: false,
            value: '',
            valid: true,
          },
        },
        leadData: [],
        existingSearchCriteria: [],
        searchInputDistrict: '',
        searchInputCounty: '',
        searchInputCity: '',
        customerData: '',
        customerSearchCriterias: [],

        existingSearchCriteriaId: '',

        filteredCountiesDropdown: '',
        jumpToFilteringTool: true,
        isFocusedNotice: false,

        dropdowns: {
          purpose: false,
          timeOfPurchase: false,
          buyExperience: false,
          typeOfUse: false,
          rentStatus: false,
          district: false,
          newOrExisting: false,
          kindOfFinance: false,
          beachCategory: false,
          county: false,
          city: false,
          // Alicante
          realEstateType: false,
          needCredit: false,
          bedRooms: false,
          bathRooms: false,
          location: false,
        },

        dropdownContents: {
          purpose: [
            'Selbstnutzung',
            'Kapitalanlage'
          ],
          timeOfPurchase: [
            'Jetzt',
            'In den nächsten Jahren',
            'Nicht sicher'
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
            'Alle',
            'Vermietet',
            'Bezugsfrei / Bezugsfertig',
            'Im Bau'
          ],
          needCredit: [
              'Ja',
              'Nein'
          ],
          realEstateTypes: [
            'Wohnung',
            'Haus',
            'Egal'
          ],
          rooms: [
            '1',
            '2',
            '3',
            '4+',
            'Egal'
          ],
          location: [
            'Urban',
            'Ländlich',
            'Egal'
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
            'Bayern': ['München', 'Karlsfeld'],
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
          beachCategory: [
            '1.0 - At the sea',
            '2.0 - 400m - 600m from the sea',
            '3.0 - 700m - 900m from the sea',
            '4.0 - 1-3km from the sea',
            '5.0 - 4-6km from the sea',
            '6.0 - 7-9km from the sea',
            '7.0 - from 10km',
          ],
        },

        dropdownRelativePosition: false,
      }
    },
    methods: {
      closeDropdowns() {
        for (const index in this.dropdowns) {
          this.dropdowns[index] = false;
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
      checkIfIsKGCompany() {
        return this.customerDataSC.client_company === 'kg';
      },
      dropdownClick(field, clickedText) {
        this.searchInputDistrict = '';
        if ( field === 'district' || field === 'rentStatus' ){
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
            this.removeMultiFilterSelection('Alle', field);
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
      removeMultiFilterSelection(clickedText, field) {
        const index = this.$data['searchCriteria'][field].value.indexOf(clickedText);
        if (index !== -1) {
          this.$data['searchCriteria'][field].value.splice(index, 1);
        }

        if ( this.$data['searchCriteria'][field].value.length === 0 ){
          this.$data['searchCriteria'][field].value = field === 'city' ? [] : ['Alle'];
        }
      },
      getExistingSearchCriteria() {
        axios.get(this.globalApiMicroserviceBaseUrl + '/searchcriteria/all/' + this.customerData.id )
            .then(
                (response) => {
                  if ( response.status === 200 ){
                    this.customerSearchCriterias = response.data;
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
      getCustomerData() {
        axios.get(this.globalApiMicroserviceBaseUrl + '/address/single/'+this.customerDataSC.client_company + '/' + this.customerDataSC.client_id, {
          headers: { 'Authorization': 'Bearer '+import.meta.env.VITE_LOCAL_STORAGE_MICROSERVICE_AUTH_TOKEN }
        })
            .then(
                (response) => {
                  if ( response.status === 200 ){
                    this.customerData = response.data;
                    this.getExistingSearchCriteria();
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
      resetData() {
        let defaultSearch = {
          // kind: {
          //   required: true,
          //       value: 'Kauf',
          //       valid: true,
          // },
          timeOfPurchase: {
            required: false,
            value: '',
            valid: true,
          },
          purpose: {
            required: true,
            value: '',
            valid: true,
          },
          buyExperience: {
            required: true,
            value: '',
            valid: true,
          },
          typeOfUse: {
            required: true,
            value: '',
            valid: true,
          },
          rentStatus: {
            required: true,
            value: ['Alle'],
            valid: true,
          },
          moveInDate: {
            required: false,
            value: '',
            valid: true,
          },
          // county: {
          //   required: true,
          //       value: 'Alle',
          //       valid: true,
          // },
          // city: {
          //   required: true,
          //       value: '',
          //       valid: true,
          // },
          district: {
            required: false,
            value: ['Alle'],
            valid: true,
          },
          roomsFrom: {
            required: true,
            value: '',
            valid: true,
          },
          roomsTo: {
            required: true,
            value: '',
            valid: true,
          },
          squareMetresFrom: {
            required: true,
            value: '',
            valid: true,
          },
          squareMetresTo: {
            required: true,
            value: '',
            valid: true,
          },
          balcony: {
            required: false,
            value: 'false',
            valid: true,
          },
          terrace: {
            required: false,
            value: 'false',
            valid: true,
          },
          garden: {
            required: false,
            value: 'false',
            valid: true,
          },
          lift: {
            required: false,
            value: 'false',
            valid: true,
          },
          basement: {
            required: false,
            value: 'false',
            valid: true,
          },
          parkingSlot: {
            required: false,
            value: 'false',
            valid: true,
          },
          newOrExisting: {
            required: false,
            value: 'Beides',
            valid: true,
          },
          constructionYear: {
            required: false,
            value: '',
            valid: true,
          },
          maxBudget: {
            required: true,
            value: '',
            valid: true,
          },
          equityCapital: {
            required: false,
            value: '',
            valid: true,
          },
          kindOfFinance: {
            required: false,
            value: '',
            valid: true,
          },
          beachCategory: {
            required: false,
            value: '',
            valid: true,
          },
          approvedFinance: {
            required: false,
            value: '',
            valid: true,
          },
          notice: {
            required: false,
            value: '',
            valid: true,
          },
          // Alicante Fields
          realEstateType: {
            required: false,
            value: '',
            valid: true,
          },
          bedRooms: {
            required: false,
            value: '',
            valid: true,
          },
          bathRooms: {
            required: false,
            value: '',
            valid: true,
          },
          location: {
            required: false,
            value: '',
            valid: true,
          },
          oceanView: {
            required: false,
            value: 'false',
            valid: true,
          },
          pool: {
            required: false,
            value: 'false',
            valid: true,
          },
          privatGarden: {
            required: false,
            value: 'false',
            valid: true,
          },
          golf: {
            required: false,
            value: 'false',
            valid: true,
          },
          additionalWishes: {
            required: false,
            value: 'false',
            valid: true,
          },
          additionalWishesText: {
            required: false,
            value: '',
            valid: true,
          },
          needCredit: {
            required: false,
            value: '',
            valid: true,
          },
        };

        for ( const key in defaultSearch ) {
          if ( this.searchCriteria.hasOwnProperty(key) ) {
            this.searchCriteria[key] = defaultSearch[key];
          }
        }

        this.searchInputDistrict = '';
        this.searchInputCounty = '';
        this.searchInputCity = '';
      },
      updateExistingSearchCriteria() {
        let searchCriteria = JSON.parse(this.existingSearchCriteria.canban_searchcriteria);
        Object.entries(searchCriteria).forEach(([key, field]) => {
          if ( key === 'searchCriteriaId' ) {
            this.existingSearchCriteriaId = field;
          }
          if (typeof this.searchCriteria[key] !== 'undefined') {
            this.searchCriteria[key].value = field;
          }
        });
      },
      updateSearchCriteriaForAlicante() {
        if ( typeof this.customerData === 'undefined' || this.customerData === '' ) {
          return;
        }

        let fieldWhichHasIntValAndNotBool = [
            'bedRooms',
            'bathRooms',
        ];
        for ( const key in this.customerData ) {
          if ( key.includes('searchcriteria') ) {
            let searchCriteriaKey = this.toCamelCase(key.replaceAll('client_searchcriteria_', ''));
            if ( typeof this.searchCriteria[searchCriteriaKey] !== 'undefined' ) {
              if ( searchCriteriaKey === 'needCredit' ) {
                this.searchCriteria[searchCriteriaKey].value = this.customerData[key] === '1' ? 'Ja' : 'Nein';
              } else if ( searchCriteriaKey === 'timeOfPurchase' ) {
                if ( this.customerData[key] === 'In the next few years' ) {
                  this.searchCriteria[searchCriteriaKey].value = 'In den nächsten Jahren'
                } else if ( this.customerData[key] === 'Not sure' ) {
                  this.searchCriteria[searchCriteriaKey].value = 'Nicht sicher'
                } else if ( this.customerData[key] === 'Now' ) {
                  this.searchCriteria[searchCriteriaKey].value = 'Jetzt'
                }
              } else {
                this.searchCriteria[searchCriteriaKey].value = this.customerData[key] === '1' && !fieldWhichHasIntValAndNotBool.includes(searchCriteriaKey) ? true : this.customerData[key];
              }
            }
          }
        }
      },
      toCamelCase(str) {
        return str
            .split('_')
            .map((word, index) =>
                index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join('');
      }
    },
    computed: {
      checkIfIsCityAlicanteSelected() {
        if ( this.searchCriteria.city.value === 'Alicante' ){
          return true;
        }
        return false;
      },
    },
    mounted() {
      // if ( this.$route.name === 'canbanModalMakeEditSearchCriteria') {
        this.getCustomerData();
      // }
    },
    watch: {
      'searchCriteria.city.value': function(val) {
        this.jumpToFilteringTool = val !== 'Alicante';

        if ( val === 'Alicante' ) {
          if ( this.$route.name === 'canbanModalMakeEditSearchCriteria') {
            this.updateExistingSearchCriteria();
          }
          this.updateSearchCriteriaForAlicante();
          let fieldNamesToReset = [
            // "kind",
            // "timeOfPurchase",
            "purpose",
            "buyExperience",
            "typeOfUse",
            "rentStatus",
            "moveInDate",
            "county",
            // "city",
            "district",
            "roomsFrom",
            "roomsTo",
            "squareMetresFrom",
            "squareMetresTo",
            "balcony",
            "terrace",
            "garden",
            "lift",
            "basement",
            "parkingSlot",
            "newOrExisting",
            "constructionYear",
            // "maxBudget",
            "equityCapital",
            "kindOfFinance",
            "beachCategory",
            "approvedFinance",
            "notice",
            // "realEstateType",
            // "bedRooms",
            // "bathRooms",
            // "location",
            // "oceanView",
            // "pool",
            // "privatGarden",
            // "golf",
            // "additionalWishes",
            // "additionalWishesText",
            // "needCredit"
          ];
          // reset other fields and set to not required
          for (const key in this.searchCriteria) {
            if ( fieldNamesToReset.includes(key) ) {
              if ( key === 'county' ) {
                this.searchCriteria[key].value = 'Alle';
              } else if ( key === 'district' ) {
                this.searchCriteria[key].value = ['Alle'];
              } else {
                this.searchCriteria[key].value = '';
              }
              this.searchCriteria[key].required = false;
              this.searchCriteria[key].valid = true;
            }
          }
        } else {
          if ( this.existingSearchCriteriaId === '' ) {
            // reset never when search criteria was found
            this.resetData();
          }
        }

      },
      searchCriteria: {
        handler: function (val, oldVal) {
          this.$parent.searchCriteria = this.searchCriteria;
        },
        deep: true
      },
      triggerValidation: function() {
        if ( this.validateSubmit() ) {
          this.$emit('formValidated', true);
        }
      },
      'searchCriteria.county.value': function(val) {

        if ( val === 'Alle' || val === 'Mecklenburg-Vorpommern' ) {
          this.filteredCountiesDropdown = this.dropdownContents.countyWithCities;
          if ( this.searchCriteria.city.value !== 'Alicante' && this.searchCriteria.city.value !== 'Dubai' ) {
            this.searchCriteria.city.value = '';
          }
          this.searchCriteria.county.value = 'Alle';
        } else {
          this.filteredCountiesDropdown = this.dropdownContents.countyWithCities[val];
          // Preset city if only 1 value is
          if ( this.filteredCountiesDropdown.length === 1 ) {
            this.searchCriteria.city.value = this.filteredCountiesDropdown[0];
          }
        }
      },
      existingSearchCriteriaId: function() {
        this.$parent.existingSearchCriteriaId = this.existingSearchCriteriaId;
      },
      jumpToFilteringTool: function() {
        this.$parent.jumpToFilteringTool = this.jumpToFilteringTool;
      }
    }
  }
</script>


<template>

  <form>

<!--    <div class="field-wrapper radios" :class="{'invalid': !searchCriteria.kind.valid, 'valid': searchCriteria.kind.valid}">-->
<!--      <div class="fieldgroup-label">Woran ist Kunde interessiert?</div>-->
<!--      <label for="buySearchCriteria" class="radio-wrapper">-->
<!--        <InputField inputType="radio" id="buySearchCriteria" inputName="buySearchCriteria" value="Kauf" :inputValue="searchCriteria.kind.value" v-model="searchCriteria.kind.value"></InputField>-->
<!--        Kauf-->
<!--      </label>-->
<!--      <label for="rentSearchCriteria" class="radio-wrapper">-->
<!--        <InputField inputType="radio" id="rentSearchCriteria" inputName="rentSearchCriteria" value="Miete" :inputValue="searchCriteria.kind.value" v-model="searchCriteria.kind.value"></InputField>-->
<!--        Miete-->
<!--      </label>-->
<!--    </div>-->

    <div class="field-wrapper two-col" :class="{'invalid': !searchCriteria.city.valid, 'valid': searchCriteria.city.valid}">
      <!--            <div class="fieldgroup-label">In welchem Stadt?</div>-->
      <span>
        <div class="field-wrapper radios">
          <InputField class="dropdown-input" ref="inputCounty" inputType="text" inputName="County" :inputValue="searchCriteria.county.value" v-model="searchCriteria.county.value" @focus="setDropdownTop($event)" @click="dropdowns.county = !dropdowns.county" @keyup="searchDropdownVal($event, 'countyWithCities', 'searchInputCounty')" @click.stop=""></InputField>
          <label class="ph">Bundesland</label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownCounty" :class="{active: dropdowns.county, relative: dropdownRelativePosition}" type="districts" :renderingObject="dropdownContents.countyWithCities" :filterFor="searchInputDistrict" :activeItems="searchCriteria.county.value" @dropdown-item-clicked="dropdownClick('county', $event)" @click.stop=""></Dropdown>
        </div>
      </span>
      <span>
        <label for="cityAlicanteSearchCriteria" class="radio-wrapper" v-if="checkIfIsKGCompany()">
          <InputField inputType="radio" id="cityAlicanteSearchCriteria" inputName="cityAlicanteSearchCriteria" value="Alicante" :inputValue="searchCriteria.city.value" v-model="searchCriteria.city.value"></InputField>
          Alicante
        </label>
        <label for="cityDubaiSearchCriteria" class="radio-wrapper" v-if="checkIfIsKGCompany()">
          <InputField inputType="radio" id="cityDubaiSearchCriteria" inputName="cityDubaiSearchCriteria" value="Dubai" :inputValue="searchCriteria.city.value" v-model="searchCriteria.city.value"></InputField>
          Dubai
        </label>
      </span>
    </div>

    <span class="wrapper-dynamic-fields" v-if="!checkIfIsCityAlicanteSelected">
      <div class="field-wrapper" v-if="!searchCriteria.city.value.includes('Berlin') && searchCriteria.county.value !== 'Alle' && searchCriteria.county.value !== 'Mecklenburg-Vorpommern'">
        <InputField class="dropdown-input" ref="inputCity" inputType="text" inputName="City" :inputValue="searchCriteria.city.value" v-model="searchCriteria.city.value" @focus="setDropdownTop($event)" @click="dropdowns.city = !dropdowns.city" @keyup="searchDropdownVal($event, 'countyWithCities', 'searchInputCounty')" @click.stop=""></InputField>
        <label class="ph">In welcher Stadt?</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown ref="dropdownCity" :class="{active: dropdowns.city, relative: dropdownRelativePosition}" type="country" :renderingObject="filteredCountiesDropdown" :filterFor="searchInputCity" :activeItems="searchCriteria.city.value" @dropdown-item-clicked="dropdownClick('city', $event)" @click.stop=""></Dropdown>
      </div>

      <div class="field-wrapper test" v-if="searchCriteria.city.value === 'Berlin'">
        <InputField class="dropdown-input" ref="inputDistrict" inputType="text" inputName="District" :inputValue="searchCriteria.district.value" v-model="searchCriteria.district.value" @focus="setDropdownTop($event)" @click="dropdowns.district = !dropdowns.district" @keyup="searchDropdownVal($event, 'districtWithParts', 'searchInputDistrict')" @click.stop=""></InputField>
        <label class="ph">In welchem Bezirk?</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown ref="dropdownDistrict" :class="{active: dropdowns.district, relative: dropdownRelativePosition}" type="districts" :renderingObject="dropdownContents.districtWithParts" :filterFor="searchInputDistrict" :activeItems="searchCriteria.district.value" @dropdown-item-clicked="dropdownClick('district', $event)" @click.stop=""></Dropdown>
      </div>

      <div class="field-wrapper two-col">
              <span :class="{'invalid': !searchCriteria.purpose.valid, 'valid': searchCriteria.purpose.valid}">
                <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.purpose.value" v-model="searchCriteria.purpose.value" @focus="setDropdownTop($event)" @click="dropdowns.purpose = !dropdowns.purpose" @click.stop=""></InputField>
                <label class="ph">Zu welchem Zweck? <AsterixMarkIcon v-if="searchCriteria.purpose.required"></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.purpose, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.purpose" :filterFor="searchCriteria.purpose.value" :activeItems="searchCriteria.purpose.value" @dropdown-item-clicked="dropdownClick('purpose', $event)" @click.stop=""></Dropdown>
              </span>
        <span :class="{'invalid': !searchCriteria.buyExperience.valid, 'valid': searchCriteria.buyExperience.valid}">
          <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="searchCriteria.buyExperience.value" v-model="searchCriteria.buyExperience.value" @focus="setDropdownTop($event)" @click="dropdowns.buyExperience = !dropdowns.buyExperience" @click.stop=""></InputField>
          <label class="ph">Wieviel Kauferfahrung? <AsterixMarkIcon v-if="searchCriteria.buyExperience.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownSource" :class="{active: dropdowns.buyExperience, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.buyExperience" :filterFor="searchCriteria.buyExperience.value" :activeItems="searchCriteria.buyExperience.value" @dropdown-item-clicked="dropdownClick('buyExperience', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper two-col" v-if="!checkIfIsCityAlicanteSelected">
        <span :class="{'invalid': !searchCriteria.typeOfUse.valid, 'valid': searchCriteria.typeOfUse.valid}">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.typeOfUse.value" v-model="searchCriteria.typeOfUse.value" @focus="setDropdownTop($event)" @click="dropdowns.typeOfUse = !dropdowns.typeOfUse" @click.stop=""></InputField>
          <label class="ph">Welche Nutzungsart? <AsterixMarkIcon v-if="searchCriteria.typeOfUse.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.typeOfUse, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.typeOfUse" :filterFor="searchCriteria.typeOfUse.value" :activeItems="searchCriteria.typeOfUse.value" @dropdown-item-clicked="dropdownClick('typeOfUse', $event)" @click.stop=""></Dropdown>
        </span>
        <span :class="{'invalid': !searchCriteria.rentStatus.valid, 'valid': searchCriteria.rentStatus.valid}">
          <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="searchCriteria.rentStatus.value" v-model="searchCriteria.rentStatus.value" @focus="setDropdownTop($event)" @click="dropdowns.rentStatus = !dropdowns.rentStatus" @click.stop=""></InputField>
          <label class="ph">Welcher Wohnungsstatus? <AsterixMarkIcon v-if="searchCriteria.rentStatus.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownSource" :class="{active: dropdowns.rentStatus, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.rentStatus" :filterFor="searchCriteria.rentStatus.value" :activeItems="searchCriteria.rentStatus.value" @dropdown-item-clicked="dropdownClick('rentStatus', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper" v-if="searchCriteria.rentStatus.value === 'Frei'">
        <InputField class="dropdown-input" ref="inputSource" inputType="date" inputName="Source" :inputValue="searchCriteria.moveInDate.value" v-model="searchCriteria.moveInDate.value"></InputField>
        <label class="ph">Wunsch Einzugsdatum? <AsterixMarkIcon v-if="searchCriteria.moveInDate.required"></AsterixMarkIcon></label>
      </div>

      <div class="field-wrapper two-col">
              <span :class="{'invalid': !searchCriteria.roomsFrom.valid, 'valid': searchCriteria.roomsFrom.valid}">
                  <InputField inputType="number" min="1" step="0.5" inputplaceholder="" inputName="roomsFrom" :inputValue="searchCriteria.roomsFrom.value" v-model="searchCriteria.roomsFrom.value"></InputField>
                  <label class="ph">Zimmer ab <AsterixMarkIcon v-if="searchCriteria.roomsFrom.required"></AsterixMarkIcon></label>
              </span>
        <span :class="{'invalid': !searchCriteria.roomsTo.valid, 'valid': searchCriteria.roomsTo.valid}">
                  <InputField inputType="number" min="1" step="0.5" inputplaceholder="" inputName="roomsFrom" :inputValue="searchCriteria.roomsTo.value" v-model="searchCriteria.roomsTo.value"></InputField>
                  <label class="ph">Zimmer bis <AsterixMarkIcon v-if="searchCriteria.roomsTo.required"></AsterixMarkIcon></label>
              </span>
      </div>

      <div class="field-wrapper two-col">
                <span :class="{'invalid': !searchCriteria.squareMetresFrom.valid, 'valid': searchCriteria.squareMetresFrom.valid}">
                  <InputField inputType="number" inputplaceholder="" min="0" inputName="squareMetresFrom" :inputValue="searchCriteria.squareMetresFrom.value" v-model="searchCriteria.squareMetresFrom.value"></InputField>
                  <label class="ph">Fläche ab <AsterixMarkIcon v-if="searchCriteria.squareMetresFrom.required"></AsterixMarkIcon></label>
              </span>
        <span :class="{'invalid': !searchCriteria.squareMetresTo.valid, 'valid': searchCriteria.squareMetresTo.valid}">
                  <InputField inputType="number" inputplaceholder="" min="0" inputName="squareMetresTo" :inputValue="searchCriteria.squareMetresTo.value" v-model="searchCriteria.squareMetresTo.value"></InputField>
                  <label class="ph">Fläche bis <AsterixMarkIcon v-if="searchCriteria.squareMetresTo.required"></AsterixMarkIcon></label>
              </span>
      </div>

      <div class="field-wrapper features" v-if="!checkIfIsCityAlicanteSelected">
        <label for="Balcony" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Balcony" name="Balcony" v-model="searchCriteria.balcony.value">
          Balkon
        </label>
        <label for="Terrace" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Terrace" name="Terrace" v-model="searchCriteria.terrace.value">
          Terrasse
        </label>
        <label for="Garden" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Garden" name="Garden" v-model="searchCriteria.garden.value">
          Garten
        </label>
        <label for="Lift" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Lift" name="Lift" v-model="searchCriteria.lift.value">
          Aufzug
        </label>
        <label for="Basement" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Basement" name="Basement" v-model="searchCriteria.basement.value">
          Keller
        </label>
        <label for="ParkingSlot" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="ParkingSlot" name="ParkingSlot" v-model="searchCriteria.parkingSlot.value">
          Stellplatz
        </label>
      </div>

      <div class="field-wrapper two-col">
              <span>
                <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.newOrExisting.value" v-model="searchCriteria.newOrExisting.value" @focus="setDropdownTop($event)" @click="dropdowns.newOrExisting = !dropdowns.newOrExisting" @click.stop=""></InputField>
                <label class="ph">Neubau oder Bestand? <AsterixMarkIcon v-if="searchCriteria.newOrExisting.required"></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.newOrExisting, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.newOrExisting" :filterFor="searchCriteria.newOrExisting.value" :activeItems="searchCriteria.newOrExisting.value" @dropdown-item-clicked="dropdownClick('newOrExisting', $event)" @click.stop=""></Dropdown>
              </span>
        <span v-if="!checkIfIsCityAlicanteSelected">
                  <InputField inputType="text" inputplaceholder="" inputName="constructionYear" :inputValue="searchCriteria.constructionYear.value" v-model="searchCriteria.constructionYear.value"></InputField>
                  <label class="ph">Ab welchem Baujahr? <AsterixMarkIcon v-if="searchCriteria.constructionYear.required"></AsterixMarkIcon></label>
              </span>
        <span v-else>
                <InputField class="dropdown-input" ref="inputBeach" inputType="text" inputName="Beach" :inputValue="searchCriteria.beachCategory.value" v-model="searchCriteria.beachCategory.value" @focus="setDropdownTop($event)" @click="dropdowns.beachCategory = !dropdowns.beachCategory" @click.stop=""></InputField>
                <label class="ph">Strand-Kategorie <AsterixMarkIcon v-if="searchCriteria.beachCategory.required"></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownBeach" :class="{active: dropdowns.beachCategory, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.beachCategory" :filterFor="searchCriteria.beachCategory.value" @dropdown-item-clicked="dropdownClick('beachCategory', $event)" @click.stop=""></Dropdown>
              </span>
      </div>

      <div class="field-wrapper two-col">
              <span :class="{'invalid': !searchCriteria.maxBudget.valid, 'valid': searchCriteria.maxBudget.valid}">
                  <InputField inputType="text" inputplaceholder="" inputName="maxBudget" :inputValue="this.numberWithComma(searchCriteria.maxBudget.value)" v-model="searchCriteria.maxBudget.value"></InputField>
                  <label class="ph">Maximale Budget? <AsterixMarkIcon v-if="searchCriteria.maxBudget.required"></AsterixMarkIcon></label>
              </span>
        <span>
                <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.kindOfFinance.value" v-model="searchCriteria.kindOfFinance.value" @focus="setDropdownTop($event)" @click="dropdowns.kindOfFinance = !dropdowns.kindOfFinance" @click.stop=""></InputField>
                <label class="ph">Wie soll finanziert werden? <AsterixMarkIcon v-if="searchCriteria.kindOfFinance.required"></AsterixMarkIcon></label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.kindOfFinance, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.kindOfFinance" :filterFor="searchCriteria.kindOfFinance.value" :activeItems="searchCriteria.kindOfFinance.value" @dropdown-item-clicked="dropdownClick('kindOfFinance', $event)" @click.stop=""></Dropdown>
              </span>
      </div>

      <div class="field-wrapper radios" v-if="searchCriteria.kindOfFinance.value === 'Finanzierung'">
        <div class="fieldgroup-label">Finanzierung gesichert? <AsterixMarkIcon v-if="searchCriteria.approvedFinance.required"></AsterixMarkIcon></div>
        <label for="approvedTrueFinance" class="radio-wrapper">
          <InputField inputType="radio" id="approvedTrueFinance" inputName="approvedTrueFinance" value="true" :inputValue="searchCriteria.approvedFinance.value" v-model="searchCriteria.approvedFinance.value"></InputField>
          Ja
        </label>
        <label for="approvedFalseFinance" class="radio-wrapper">
          <InputField inputType="radio" id="approvedFalseFinance" inputName="approvedFalseFinance" value="false" :inputValue="searchCriteria.approvedFinance.value" v-model="searchCriteria.approvedFinance.value"></InputField>
          Nein
        </label>
      </div>
      <div class="field-wrapper radios" v-if="searchCriteria.kindOfFinance.value === 'Eigene Mittel'">
        <span>
            <InputField inputType="text" inputplaceholder="" inputName="maxBudget" :inputValue="this.numberWithComma(searchCriteria.equityCapital.value)" v-model="searchCriteria.equityCapital.value"></InputField>
            <label class="ph">Maximales Eigenkapital? <AsterixMarkIcon v-if="searchCriteria.equityCapital.required"></AsterixMarkIcon></label>
        </span>
      </div>

      <div class="field-wrapper">
        <TextAreaField inputplaceholder="" :style="!isFocusedNotice ? 'height: 40px' : 'height: 150px'" inputName="notice" :inputVal="searchCriteria.notice.value" v-model="searchCriteria.notice.value" @focusin="isFocusedNotice = true;" @focusout="isFocusedNotice = false"></TextAreaField>
        <label class="ph">Bemerkung <AsterixMarkIcon v-if="searchCriteria.notice.required"></AsterixMarkIcon></label>
      </div>

      <div class="field-wrapper">
      <label for="JumpToFilteringTool" class="checkbox-wrapper">
        <input class="checkbox field" type="checkbox" id="JumpToFilteringTool" name="JumpToFilteringTool" v-model="jumpToFilteringTool">
        Zum Suchprofil passende Immobilien sofort anzeigen
      </label>
    </div>
    </span>

    <span class="wrapper-dynamic-fields" v-else>

      <div class="field-wrapper two-col">
        <span :class="{'invalid': !searchCriteria.realEstateType.valid, 'valid': searchCriteria.realEstateType.valid}">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.realEstateType.value" v-model="searchCriteria.realEstateType.value" @focus="setDropdownTop($event)" @click="dropdowns.realEstateType = !dropdowns.realEstateType" @click.stop=""></InputField>
          <label class="ph">Welche Immobilie Sucht der Kunde? <AsterixMarkIcon v-if="searchCriteria.realEstateType.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.realEstateType, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.realEstateTypes" :filterFor="searchCriteria.realEstateType.value" :activeItems="searchCriteria.realEstateType.value" @dropdown-item-clicked="dropdownClick('realEstateType', $event)" @click.stop=""></Dropdown>
        </span>
        <span :class="{'invalid': !searchCriteria.timeOfPurchase.valid, 'valid': searchCriteria.timeOfPurchase.valid}">
          <InputField class="dropdown-input" ref="inputTimeOfPurchase" inputType="text" inputName="TimeOfPurchase" :inputValue="searchCriteria.timeOfPurchase.value" v-model="searchCriteria.timeOfPurchase.value" @focus="setDropdownTop($event)" @click="dropdowns.timeOfPurchase = !dropdowns.timeOfPurchase" @click.stop=""></InputField>
          <label class="ph">Geplanter Kaufzeitpunkt? <AsterixMarkIcon v-if="searchCriteria.timeOfPurchase.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimeOfPurchase" :class="{active: dropdowns.timeOfPurchase, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.timeOfPurchase" :filterFor="searchCriteria.timeOfPurchase.value" :activeItems="searchCriteria.timeOfPurchase.value" @dropdown-item-clicked="dropdownClick('timeOfPurchase', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper two-col">
        <span :class="{'invalid': !searchCriteria.bedRooms.valid, 'valid': searchCriteria.bedRooms.valid}">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.bedRooms.value" v-model="searchCriteria.bedRooms.value" @focus="setDropdownTop($event)" @click="dropdowns.bedRooms = !dropdowns.bedRooms" @click.stop=""></InputField>
          <label class="ph">Schlafzimmer min. <AsterixMarkIcon v-if="searchCriteria.bedRooms.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.bedRooms, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.rooms" :filterFor="searchCriteria.bedRooms.value" :activeItems="searchCriteria.bedRooms.value" @dropdown-item-clicked="dropdownClick('bedRooms', $event)" @click.stop=""></Dropdown>
        </span>
        <span :class="{'invalid': !searchCriteria.bathRooms.valid, 'valid': searchCriteria.bathRooms.valid}">
          <InputField class="dropdown-input" ref="inputTimeOfPurchase" inputType="text" inputName="TimeOfPurchase" :inputValue="searchCriteria.bathRooms.value" v-model="searchCriteria.bathRooms.value" @focus="setDropdownTop($event)" @click="dropdowns.bathRooms = !dropdowns.bathRooms" @click.stop=""></InputField>
          <label class="ph">Badezimmer min. <AsterixMarkIcon v-if="searchCriteria.bathRooms.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimeOfPurchase" :class="{active: dropdowns.bathRooms, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.rooms" :filterFor="searchCriteria.bathRooms.value" :activeItems="searchCriteria.bathRooms.value" @dropdown-item-clicked="dropdownClick('bathRooms', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper">
        <span :class="{'invalid': !searchCriteria.location.valid, 'valid': searchCriteria.location.valid}">
          <InputField class="dropdown-input" ref="inputTimeOfPurchase" inputType="text" inputName="TimeOfPurchase" :inputValue="searchCriteria.location.value" v-model="searchCriteria.location.value" @focus="setDropdownTop($event)" @click="dropdowns.location = !dropdowns.location" @click.stop=""></InputField>
          <label class="ph">Lage <AsterixMarkIcon v-if="searchCriteria.location.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimeOfPurchase" :class="{active: dropdowns.location, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.location" :filterFor="searchCriteria.location.value" :activeItems="searchCriteria.location.value" @dropdown-item-clicked="dropdownClick('location', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper features">
        <label for="OceanView" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="OceanView" name="OceanView" v-model="searchCriteria.oceanView.value">
          Meeresblick
        </label>
        <label for="Pool" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Pool" name="Pool" v-model="searchCriteria.pool.value">
          Pool
        </label>
        <label for="PrivatGarden" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="PrivatGarden" name="PrivatGarden" v-model="searchCriteria.privatGarden.value">
          Privatgarten
        </label>
        <label for="Golf" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="Golf" name="Golf" v-model="searchCriteria.golf.value">
          Golfplatz i.d.N.
        </label>
        <label for="AdditionalWishes" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="AdditionalWishes" name="AdditionalWishes" v-model="searchCriteria.additionalWishes.value">
          Weitere Wünsche
        </label>
        <span v-if="searchCriteria.additionalWishes.value === true" style="margin-top:25px;">
          <TextAreaField inputName="additionWishes" :inputValue="searchCriteria.notice.value" v-model="searchCriteria.notice.value"></TextAreaField>
          <label class="ph">Welche weiteren Wünsche? <AsterixMarkIcon v-if="searchCriteria.notice.required"></AsterixMarkIcon></label>
        </span>
      </div>

      <div class="field-wrapper two-col">
        <span :class="{'invalid': !searchCriteria.maxBudget.valid, 'valid': searchCriteria.maxBudget.valid}">
          <InputField inputType="text" inputplaceholder="" inputName="maxBudget" :inputValue="this.numberWithComma(searchCriteria.maxBudget.value)" v-model="searchCriteria.maxBudget.value"></InputField>
          <label class="ph">Maximales Budget? <AsterixMarkIcon v-if="searchCriteria.maxBudget.required"></AsterixMarkIcon></label>
        </span>
        <span :class="{'invalid': !searchCriteria.needCredit.valid, 'valid': searchCriteria.needCredit.valid}">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria.needCredit.value" v-model="searchCriteria.needCredit.value" @focus="setDropdownTop($event)" @click="dropdowns.needCredit = !dropdowns.needCredit" @click.stop=""></InputField>
          <label class="ph">Kredit benötigt? <AsterixMarkIcon v-if="searchCriteria.needCredit.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.needCredit, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.needCredit" :filterFor="searchCriteria.needCredit.value" :activeItems="searchCriteria.needCredit.value" @dropdown-item-clicked="dropdownClick('needCredit', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

    </span>

  </form>

</template>


<style scoped>
.title {
  font-size: 18px;
  font-weight: 700;
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

.wrapper-dynamic-fields {
  width: 100%;
  margin: 25px 0;
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
