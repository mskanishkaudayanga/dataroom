<script>
import TextAreaField from "@/components/forms/TextAreaField.vue";
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import axios from "axios";
import SearchIcon from "@/components/icons/icon-search.vue";
import Seperator from "@/components/utility/Seperator.vue";
import SearchCriteriaFormMatchingHandler from "./SearchCriteriaFormMatchingHandler.vue";
import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";
import DeleteIcon from "@/components/icons/icon-delete.vue";

export default {
    name: "SearchCriteriaForm",
    components: {
      DeleteIcon,
      CheckmarkIcon,
      SearchCriteriaFormMatchingHandler,
      Seperator,
      SearchIcon,
      AsterixMarkIcon, DropdownArrow, Dropdown, InputField, TextAreaField
    },
    props: {
      activityId: String,
      customerDataSC: {
        type: [Array, Object],
        default: {}
      },
      microserviceCustomerData: {
        type: [Array, Object],
        default: {}
      },
      activeSC: {
        type: Number,
        default: 0
      },
      triggerValidation: {
        type: String,
        default: ''
      },
      indexToDelete: {
        type: [Number, String],
        default: ''
      },
      triggerDeleteProcess: String,
      triggerAddSCProcess: String,
      showCustomerSearchCriteria: {
        type: Boolean,
        default: false,
      },
      existingSearchCriteriaFromParent: {
        type: [Array, Object],
        default: []
      },
      currentUsedSearchCriteriaCombos: {
        type: [Array, Object],
        default: []
      }
    },
    data() {
      return {
        searchCriteria: {},
        isFormValid: [],
        leadData: [],
        existingSearchCriteria: [],
        searchInputDistrict: '',
        searchInputCounty: '',
        searchInputCity: '',
        customerData: '',
        customerSearchCriterias: [],
        customerSearchCriteriasMergedData: [],
        existingSearchCriteriaId: '',
        searchCriteriaToMerge: [],
        filteredCountiesDropdown: '',
        jumpToFilteringTool: true,
        isFocusedNotice: false,

        mergedData: {},
        mergedDataFinished: false,
        acceptAllMerged: false,
        rejectAllMerged: false,

        dropdowns: {
          purpose: false,
          timeOfPurchase: false,
          buyExperience: false,
          usageType: false,
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
          location: false,
          spainRegion: false,
          localArea: false,
          priceDeviation: false,
        },

        dropdownContents: {
          priceDeviation: [
            '5%',
            '10%',
            '15%',
            '20%',
          ],
          usageAfterBuy: [
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
          usageType: [
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
          realEstateTypeDe: {
            'Wohnen': [
              'Alle',
              'Rohdachboden',
              'Hochparterre',
              'Dachgeschoss',
              'Maisonette',
              'Loft/Studio/Atelier',
              'Penthouse',
              'Terrasse',
              'Etagenwohnung',
              'Erdgeschoss',
              'Souterrain',
              'Reihenhaus',
              'Doppelhaushälfte',
              'Einfamilienhaus',
            ],
            'Gewerbe': [
                'Alle',
                'Büro/Praxen',
                'Laden/Einzelhandel',
                'Gastgewerbe',
                'Sonstige'
            ]
          },
          realEstateTypeEs: [
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
              'Alle',
              'Mitte',
              'Moabit',
              'Hansaviertel',
              'Tiergarten',
              'Wedding',
              'Gesundbrunnen'
            ],
            'Friedrichshain-Kreuzberg': [
              'Alle',
              'Friedrichshain',
              'Kreuzberg'
            ],
            'Pankow': [
              'Alle',
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
              'Alle',
              'Charlottenburg',
              'Wilmersdorf',
              'Schmargendorf',
              'Grunewald',
              'Westend',
              'Charlottenburg-Nord',
              'Halensee',
            ],
            'Spandau': [
              'Alle',
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
              'Alle',
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
              'Alle',
              'Schöneberg',
              'Friedenau',
              'Tempelhof',
              'Mariendorf',
              'Marienfelde',
              'Lichtenrade'
            ],
            'Neukölln': [
              'Alle',
              'Neukölln',
              'Britz',
              'Buckow',
              'Rudow',
              'Gropiusstadt'
            ],
            'Treptow-Köpenick': [
              'Alle',
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
              'Alle',
              'Marzahn',
              'Biesdorf',
              'Kaulsdorf',
              'Mahlsdorf',
              'Hellersdorf'
            ],
            'Lichtenberg': [
              'Alle',
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
              'Alle',
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
            'Berlin': [],
            'Berlin/Brandenburg': [],
            'Bayern': [
                'München',
                'Karlsfeld',
                'Ismaning',
                'Icking',
                'Eching',
                'Erding',
                'Berg'
            ],
            'Brandenburg': [
              'Falkensee',
              'Potsdam',
              'Lychen',
              'Vogelsdorf',
              'Stahnsdorf',
              'Storkow',
              'Glienicke/Nordbahn'
            ],
            'Hessen': [
              'Frankfurt am Main',
              'Hattersheim',
              'Wiesbaden',
            ],
            'Mecklenburg-Vorpommern': ['Sassnitz'],
          },
          countyWithCitiesEs: [
            'Los Balcones',
            'LOMAS DE CABO',
            'Alicante',
            'San Miguel de Salinas',
            'Moraira',
            'Torrevieja',
            'Lo Ferro, Murcia',
            'Pilar de la Horadada',
            'Daya Nueva',
            'Partida Tosal de la Cometa',
            'Residencial Navale',
            'el Gran Alacant',
            'Finestrat',
            'Denia',
            'Alhama de Murcia',
            'Torre de la Horadada',
            'San Pedro del Pinatar',
            'La Manga del Mar Menor',
            'Villamartin',
            'Villajoyosa',
            'Calpe',
            'Los Almendros',
            'Torre-Pacheco Murcia',
            'San Javier',
            'Algorfa',
            'Santa Pola',
            'Punta Prima',
            'Vera',
            'El Raso',
            'Balsicas Murcia',
            'Quesada'
          ],
          spainRegion: [
            'Costa Blanca ',
            'Costa del Sol '
          ],
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
        if ( field === 'district' || field === 'rentStatus' || field === 'localArea' ){
          if (this.$data['searchCriteria'][this.activeSC][field].value.includes(clickedText)){

            if ( field === 'district' ) {
              this.removeLocationParts(clickedText);
            }

            this.removeMultiFilterSelection(clickedText, field);
          } else if (clickedText === 'Alle') {
            this.$data['searchCriteria'][this.activeSC][field].value = ['Alle'];
            if ( field === 'district' ) {
              this.$data['searchCriteria'][this.activeSC].localArea.value = ['Alle'];
            }
          } else {
            if ( Array.isArray(this.$data['searchCriteria'][this.activeSC][field].value) ){
              this.$data['searchCriteria'][this.activeSC][field].value = this.$data['searchCriteria'][this.activeSC][field].value.filter(item => item !== null);
              this.$data['searchCriteria'][this.activeSC][field].value.push(clickedText);
            } else {
              let existingDistricts = [clickedText];
              let currentVal = this.$data['searchCriteria'][this.activeSC][field].value;
              Object.entries(this.dropdownContents.districtWithParts).forEach(([key, field]) => {
                if ( currentVal.includes(key) ){
                  existingDistricts.push(key);
                }
              });
              this.$data['searchCriteria'][this.activeSC][field].value = existingDistricts;
            }
            this.$data['searchCriteria'][this.activeSC][field].value = [...new Set(this.$data['searchCriteria'][this.activeSC][field].value)];
            this.removeMultiFilterSelection('Alle', field);
          }
        } else if ( field === 'county' ) {
          if ( clickedText === 'Berlin' || clickedText === 'Berlin/Brandenburg' ) {
            this.$data['searchCriteria'][this.activeSC]['city'].value = clickedText;
          } else {
            let city = this.searchCriteria[this.activeSC].city.value;
            if ( !this.dropdownContents.countyWithCities[clickedText].includes(city) ) {
              if ( city !== '' && clickedText !== city ) {
                this.searchCriteria[this.activeSC].city.value = '';
              }
            }
          }
          this.$data['searchCriteria'][this.activeSC][field].value = clickedText;
        } else {
          this.$data['searchCriteria'][this.activeSC][field].value = clickedText;
        }

        if ( field === 'city' && clickedText !== 'Berlin' ) {
          // reset district and local area
          this.$data['searchCriteria'][this.activeSC]['district'].value = ['Alle'];
          this.$data['searchCriteria'][this.activeSC]['localArea'].value = ['Alle'];
          this.$data['searchCriteria'][this.activeSC]['tramCircle'].value = false;
        }

        this.closeDropdowns();
      },
      removeMultiFilterSelection(clickedText, field) {
        const index = this.$data['searchCriteria'][this.activeSC][field].value.indexOf(clickedText);
        if (index !== -1) {
          this.$data['searchCriteria'][this.activeSC][field].value.splice(index, 1);
        }

        if ( this.$data['searchCriteria'][this.activeSC][field].value.length === 0 ){
          this.$data['searchCriteria'][this.activeSC][field].value = field === 'city' ? [] : ['Alle'];
        }
      },
      removeLocationParts(removedDistrict) {
        let localAreasToRemove = this.dropdownContents.districtWithParts[removedDistrict];
        localAreasToRemove = localAreasToRemove.filter(location => location !== "Alle");

        let currentSelectedLocalAreas = this.$data['searchCriteria'][this.activeSC].localArea.value;
        currentSelectedLocalAreas = currentSelectedLocalAreas.filter(location => !localAreasToRemove.includes(location) );

        if ( this.isEmpty(currentSelectedLocalAreas) ) {
          currentSelectedLocalAreas = ['Alle'];
        }
        this.$data['searchCriteria'][this.activeSC].localArea.value = currentSelectedLocalAreas;
      },
      getExistingSearchCriteria() {

        let dataToSend = {
          'data': {
            id: this.customerData.id
          }
        };
        axios.post(this.globalApiMicroserviceBaseUrl + '/searchcriteria/all', dataToSend )
            .then(
                (response) => {
                  if ( response.status === 200 ){
                    if ( typeof response.data === 'undefined' || response.data.length === 0 ) {
                      this.searchCriteria[0] = this.defaultSearchCriteriaData();
                      this.customerSearchCriterias.push({});
                    } else {

                      // let filteredData = this.filterOnlyImportantSearchCriteria(response.data);
                      // this.customerSearchCriterias = filteredData.searchCriterias;

                      let filteredData = '';
                      if ( typeof this.customerSearchCriterias === 'undefined' || this.isEmpty(this.customerSearchCriterias) ) {
                        filteredData = this.filterOnlyImportantSearchCriteria(response.data);
                      } else {
                        filteredData = response.data;
                      }

                      if ( filteredData.searchCriterias ) {
                        this.$parent.searchCriteriaFormsFromApiFetch = filteredData.searchCriterias;
                      }

                      this.updateExistingSearchCriteria(filteredData.searchCriterias);
                      this.customerSearchCriteriasMergedData = filteredData.searchCriteriaToMerge;

                      // set init form validation object
                      for (let key in this.customerSearchCriterias) {
                        this.searchCriteria[key] = this.defaultSearchCriteriaData();
                        this.updateSearchCriteria(key);
                      }

                      this.detectMergesToChange()

                      if ( filteredData.searchCriteriaToMerge ) {
                        this.$parent.searchCriteriaToMatchFormsFromApiFetch = filteredData.searchCriteriaToMerge;
                      }

                    }
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
      detectMergesToChange() {
        for ( let i in this.customerSearchCriterias ) {
          let existingSearchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[i]);
          for ( let index in this.customerSearchCriteriasMergedData ) {
            if ( this.customerSearchCriteriasMergedData[index].category === 'customer' && this.customerSearchCriteriasMergedData[index].search_criteria_id_to_merge === this.customerSearchCriterias[i].id ) {
              let matchingSearchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriteriasMergedData[index]);
                this.findDifferences(existingSearchCriteriaData, matchingSearchCriteriaData, i)
            }
          }
        }
      },
      findDifferences(obj1, obj2, searchCriteriaIndex, parentKey = '') {
        let changes = {};

        obj1.data.local_area = obj1.data.local_area.length === 0 ? ['Alle'] : obj1.data.local_area;
        obj1.data.district = obj1.data.district.length === 0 ? ['Alle'] : obj1.data.district;
        obj1.data.rent_status = obj1.data.rent_status.length === 0 ? ['Alle'] : obj1.data.rent_status;

        if ( obj2.category === 'customer' ) {
          obj2.data.local_area = obj2.data.local_area.length === 0 ? ['Alle'] : obj2.data.local_area;
          obj2.data.district = obj2.data.district.length === 0 ? ['Alle'] : obj2.data.district;
          obj2.data.rent_status = obj2.data.rent_status.length === 0 ? ['Alle'] : obj2.data.rent_status;
        }
        console.log(obj1)
        console.log(obj2)

        function compareObjects(o1, o2, path, country, city) {
          const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);
          keys.forEach(key => {
            let newPath = path ? `${path}.${key}` : key;
            newPath = newPath.replaceAll('data.', '');
            newPath = newPath.replaceAll('.', '_');
            newPath = newPath
                .split('_')
                .map((word, index) =>
                    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join('');
            if (typeof o1[key] === 'object' && typeof o2[key] === 'object' && o1[key] && o2[key]) {
              compareObjects(o1[key], o2[key], newPath);
            } else if (o1[key] !== o2[key]) {
              let formattedKey = newPath.split('.').slice(-1)[0];
              if ( formattedKey.includes('district') || formattedKey.includes('localArea') ) {
                formattedKey = formattedKey.includes('localArea') ? 'localArea' : 'district';
                if ( changes[formattedKey]?.value !== undefined ) {
                  if ( typeof o2[key] !== 'undefined' && o2[key] !== null ) {
                    changes[formattedKey].value.push(o2[key])
                  }
                } else {
                  if ( typeof o2[key] !== 'undefined' && o2[key] !== null ) {
                    changes[formattedKey] = {
                      value: [o2[key]],
                      mergeStatus: null
                    };
                  }
                }

              } else {
                changes[formattedKey] = {
                  value: o2[key],
                  mergeStatus: null
                };
              }
            }
          });
        }

        compareObjects(obj1, obj2, '');

        if ( changes?.searchCriteriaId !== undefined ) {
          delete changes.searchCriteriaId
        }
        if ( changes?.category !== undefined ) {
          delete changes.category
        }

        if ( changes?.priceTo !== undefined ) {
          changes['price'] = changes.priceTo;
          delete changes.priceTo
        } else  if ( changes?.priceFrom !== undefined ) {
          changes['price'] = changes.priceFrom;
          delete changes.priceFrom
        }

        if ( changes?.objectType !== undefined ) {
          changes['realEstateType'] = changes.objectType;
          delete changes.objectType
        }

        for ( let index in changes ) {
          if ( changes[index].value === undefined || changes[index].value === null ) {
            delete changes[index]
          }
        }

        if ( changes?.squareMetersFrom !== undefined ) {
          changes.squareMetresFrom = changes.squareMetersFrom;
          delete changes.squareMetersFrom;
        }

        if ( changes?.squareMetersTo !== undefined ) {
          changes.squareMetresTo = changes.squareMetersTo;
          delete changes.squareMetersTo;
        }

        if ( changes?.pricePriceDeviation !== undefined ) {
          changes.priceDeviation = changes.pricePriceDeviation;
          delete changes.pricePriceDeviation;
        }

        if ( changes?.rentStatus0 !== undefined ) {
          const rentStatusChanges = [];

          // Iterate over object keys
          for (const key in changes) {
            if (changes.hasOwnProperty(key) && key.startsWith('rentStatus')) {
              if ( changes[key].value === 'Bezugsfrei' || changes[key].value === 'Bezugsfertig' ) {
                changes[key].value = 'Bezugsfrei / Bezugsfertig'
              }
              rentStatusChanges.push(changes[key].value); // Collect the values
              delete changes[key]; // Optionally remove the original key
            }
          }

          // Merge the collected values into a new key
          if (rentStatusChanges.length > 0) {
            changes.rentStatus = {
              value: [...new Set(rentStatusChanges)],
              mergeStatus: null
            };
          }
        }

        console.log(changes)
        changes = this.removeUnmatchableChanges(changes, searchCriteriaIndex);
        console.log(changes);

        this.mergedData[searchCriteriaIndex] = changes;
        this.mergedData[searchCriteriaIndex].searchCriteriaId = obj1.searchCriteriaId;
      },
      removeUnmatchableChanges(changes, searchCriteriaIndex) {

        let country = this.searchCriteria[searchCriteriaIndex].country.value
        let city = this.searchCriteria[searchCriteriaIndex].city.value

        let allowedKeysToMerge = [];

        if ( country === 'Spanien' ) {

          allowedKeysToMerge = [
            'country',
            'spainRegion',
            'city',
            'realEstateType',
            'location',
            'roomsFrom',
            'roomsTo',
            'bathRoomsFrom',
            'bathRoomsTo',
            'rentStatus',
            'oceanView',
            'pool',
            'privatGarden',
            'golf',
            'additionalWishes',
            'notice',
            'maxBudget',
            'priceDeviation',
          ]

        } else if ( country === 'Deutschland' ) {

          allowedKeysToMerge = [
            'country',
            'county',
            'city',
            'district',
            'localArea',
            'tramCircle',
            'usageType',
            'realEstateType',
            'rentStatus',
            'roomsFrom',
            'roomsTo',
            'squareMetresFrom',
            'squareMetresTo',
            'rentStatus',
            'freeFrom',
            'balcony',
            'terrace',
            'garden',
            'lift',
            'basement',
            'parkingSlot',
            'price',
            'priceDeviation',
          ]

          if ( city !== 'Berlin' ) {
            // remove special fields from cities like munich
            let keysToRemove = [
                'district',
                'localArea',
                'tramCircle'
            ]
            allowedKeysToMerge = allowedKeysToMerge.filter(item => !keysToRemove.includes(item));
          }

        }

        const filteredData = Object.keys(changes)
            .filter(key => allowedKeysToMerge.includes(key))
            .reduce((acc, key) => ({ ...acc, [key]: changes[key] }), {});


        let searchCriteria = this.searchCriteria[searchCriteriaIndex];
        for ( let index in filteredData ) {
          let value = searchCriteria?.[index]?.value;
          value = value === 'false' ? false : value;

          if ( value !== undefined && value === filteredData[index].value ) {
            delete filteredData[index];
          }
        }

        return filteredData;

      },
      updateExistingSearchCriteria(newFetchedSearchCriteria) {
        if ( typeof this.customerSearchCriterias === 'undefined' || this.customerSearchCriterias === null || this.isEmpty(this.customerSearchCriterias) ) {
          this.customerSearchCriterias = newFetchedSearchCriteria;
          return;
        }

        for (let existingSCs in this.customerSearchCriterias) {
          for (let newScs in newFetchedSearchCriteria) {
            if (this.customerSearchCriterias[existingSCs].id === newFetchedSearchCriteria[newScs].id) {
              this.customerSearchCriterias[existingSCs] = newFetchedSearchCriteria[newScs]; // Update existing sc with new fetched sc data
            }
          }
        }
      },
      getCustomerData() {

        this.customerData = this.customerDataSC;
        this.getExistingSearchCriteria();
        // let dataToSend = {
        //   'data': {
        //     customer_nr: this.customerDataSC.client_id,
        //     company: this.customerDataSC.client_company
        //   }
        // };
        // axios.post(this.globalApiMicroserviceBaseUrl + '/address/single', dataToSend)
        //     .then(
        //         (response) => {
        //           if ( response.status === 200 ){
        //             // console.log(response.data)
        //             this.customerData = response.data;
        //             this.getExistingSearchCriteria();
        //           }
        //         }
        //     )
        //     .catch(
        //         (error) => {
        //           console.log(error);
        //         }
        //     ).finally(
        //     () => {
        //       this.isLoading = false;
        //     }
        // )
      },
      updateValidTypeOfSearchCriteriaByCountry() {
          this.searchCriteria[this.activeSC].county.required = this.searchCriteria[this.activeSC].country.value !== 'Spanien';
          // this.searchCriteria[this.activeSC].spainRegion.required = this.searchCriteria[this.activeSC].country.value === 'Spanien';

          this.searchCriteria[this.activeSC].county.valid = true;
          // this.searchCriteria[this.activeSC].spainRegion.valid = true;
      },
      checkFormValidation() {

        this.updateValidTypeOfSearchCriteriaByCountry();
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
        // let defaultSearch = {
        //   // object_kind: {
        //   //   required: true,
        //   //       value: 'Kauf',
        //   //       valid: true,
        //   // },
        //   timeOfPurchase: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   usageAfterBuy: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   buyExperience: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   usageType: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   rentStatus: {
        //     required: true,
        //     value: ['Alle'],
        //     valid: true,
        //   },
        //   moveInDate: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   // county: {
        //   //   required: true,
        //   //       value: 'Alle',
        //   //       valid: true,
        //   // },
        //   // city: {
        //   //   required: true,
        //   //       value: '',
        //   //       valid: true,
        //   // },
        //   district: {
        //     required: false,
        //     value: ['Alle'],
        //     valid: true,
        //   },
        //   roomsFrom: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   roomsTo: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   squareMetresFrom: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   squareMetresTo: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   balcony: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   terrace: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   garden: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   lift: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   basement: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   parkingSlot: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   newOrExisting: {
        //     required: false,
        //     value: 'Beides',
        //     valid: true,
        //   },
        //   yearOfConstruction: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   maxBudget: {
        //     required: true,
        //     value: '',
        //     valid: true,
        //   },
        //   equityCapital: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   kindOfFinance: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   beachCategory: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   approvedFinance: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   notice: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   // Alicante Fields
        //   realEstateType: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   bedRooms: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   bathRooms: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   location: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   oceanView: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   pool: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   privatGarden: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   golf: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   additionalWishes: {
        //     required: false,
        //     value: 'false',
        //     valid: true,
        //   },
        //   additionalWishesText: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        //   needCredit: {
        //     required: false,
        //     value: '',
        //     valid: true,
        //   },
        // };
        //
        // for ( const key in defaultSearch ) {
        //   if ( this.searchCriteria[this.activeSC].hasOwnProperty(key) ) {
        //     this.searchCriteria[key] = defaultSearch[key];
        //   }
        // }
        //
        // this.searchInputDistrict = '';
        // this.searchInputCounty = '';
        // this.searchInputCity = '';
      },
      updateSearchCriteria(index = false) {

        let id = this.activeSC;
        if ( index ) {
          id = index;
        }

        if ( this.isEmpty(this.customerSearchCriterias[id]) ) {
          Object.assign(this.searchCriteria[id], this.$options.data.call(this).searchCriteria[id]);
          return
        }

        let debug = this.customerSearchCriterias[id].id === 'xxx';

        let allSearchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriterias[id]);
        let existingSearchCriteriaData = allSearchCriteriaData.data

        let serchriteriaId = this.customerSearchCriterias[id]['id'];

        if ( this.isEmpty(existingSearchCriteriaData) ){
          Object.assign(this.searchCriteria[id], this.$options.data.call(this).searchCriteria[id]);
          return;
        }

        existingSearchCriteriaData.lift = typeof existingSearchCriteriaData.lift !== 'undefined' && (existingSearchCriteriaData.lift.length > 0 || existingSearchCriteriaData.lift === true);
        if ( existingSearchCriteriaData?.real_estate_type !== undefined ) {
          delete existingSearchCriteriaData.real_estate_type;
        }

        let keys = Object.keys(existingSearchCriteriaData);

        if ( debug ) {
          console.log(existingSearchCriteriaData);
        }

        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let camelCasedKey = this.toCamelCase(key);

          // if ( debug ) {
          //   console.log(key, existingSearchCriteriaData[key])
          // }

          if ( existingSearchCriteriaData[key] === null || typeof existingSearchCriteriaData[key] === 'undefined' ){
            existingSearchCriteriaData[key] = '';
          }

          if (typeof this.searchCriteria[id][camelCasedKey] !== 'undefined') {
            this.searchCriteria[id][camelCasedKey].value = existingSearchCriteriaData[key];
            if ( debug ) {
              console.log(camelCasedKey, this.searchCriteria[id][camelCasedKey])
            }
          }

          if ( camelCasedKey === 'county' && existingSearchCriteriaData[camelCasedKey] !== '' ) {
            this.filteredCountiesDropdown = this.dropdownContents.countyWithCities[existingSearchCriteriaData[camelCasedKey]];
          }

          if ( key === 'rent_status' && (existingSearchCriteriaData[key] === '' || existingSearchCriteriaData[key] === null ) ) {
            this.searchCriteria[id][camelCasedKey].value =  ['Alle'];
          } else if (key === 'rent_status' && (existingSearchCriteriaData[key].includes('Bezugsfrei') || existingSearchCriteriaData[key].includes('Bezugsfertig'))) {
           if ( typeof existingSearchCriteriaData[key] === 'string' ) {
             existingSearchCriteriaData[key] = [existingSearchCriteriaData[key]];
           }
            // Entferne 'Bezugsfrei' und 'Bezugsfertig' aus dem Array
            existingSearchCriteriaData[key] = existingSearchCriteriaData[key].filter(item => item !== 'Bezugsfrei' && item !== 'Bezugsfertig');
            // Füge 'Bezugsfrei / Bezugsfertig' hinzu
            existingSearchCriteriaData[key].push('Bezugsfrei / Bezugsfertig');
            // Aktualisiere den Wert in searchCriteria
            this.searchCriteria[id][camelCasedKey].value = existingSearchCriteriaData[key];
          }

          if ( key === 'rooms' ) {
            this.searchCriteria[id].roomsFrom.value = existingSearchCriteriaData[key].from
            this.searchCriteria[id].roomsTo.value = existingSearchCriteriaData[key].to
          }

          if ( key === 'square_meters' ) {
            this.searchCriteria[id].squareMetresFrom.value = existingSearchCriteriaData[key].from
            this.searchCriteria[id].squareMetresTo.value = existingSearchCriteriaData[key].to
          }

          if ( key === 'price' ) {
            if ( existingSearchCriteriaData[key].to ) {
              this.searchCriteria[id].maxBudget.value = existingSearchCriteriaData[key].to;
            } else if ( existingSearchCriteriaData[key].from ) {
              this.searchCriteria[id].maxBudget.value = existingSearchCriteriaData[key].from;
            }
            if ( existingSearchCriteriaData[key].price_deviation ) {
              this.searchCriteria[id].priceDeviation.value = existingSearchCriteriaData[key].price_deviation + '%'
            } else {
              this.searchCriteria[id].priceDeviation.value = '20 %'
            }
          }

          if ( key === 'year_of_construction' ) {
            if ( existingSearchCriteriaData[key].to ) {
              this.searchCriteria[id].yearOfConstruction.value = existingSearchCriteriaData[key].to;
            } else if ( existingSearchCriteriaData[key].from ) {
              this.searchCriteria[id].yearOfConstruction.value = existingSearchCriteriaData[key].from;
            }
          }

          if ( key === 'object_type' ) {
            this.searchCriteria[id].realEstateType.value = typeof existingSearchCriteriaData[key] === 'undefined' || this.isEmpty(existingSearchCriteriaData[key]) ? 'Alle' : existingSearchCriteriaData[key];
          }

          if ( key === 'free_from' && !this.isEmpty(existingSearchCriteriaData[key]) ) {
            existingSearchCriteriaData[key] = existingSearchCriteriaData[key].replace(/undefined-/g, '');
            this.searchCriteria[id][camelCasedKey].value = existingSearchCriteriaData[key];
          }

          if ( (key === 'local_area' || key === 'district') && Array.isArray(existingSearchCriteriaData[key]) ) {
            let filtered = existingSearchCriteriaData[key].filter(item => item !== null);
            this.searchCriteria[id][camelCasedKey].value = [...new Set(filtered)];
          }

        }

        if ( debug ) {
          console.log(this.searchCriteria[id]['localArea'].value.length)
          console.log(this.searchCriteria[id]['district'].value.length)
        }

        if ( this.searchCriteria[id]['localArea'].value.length === 0 || this.searchCriteria[id]['localArea'].value === false ) {
          this.searchCriteria[id]['localArea'].value = ['Alle'];
        }

        if ( this.searchCriteria[id]['district'].value.length === 0 ) {
          this.searchCriteria[id]['district'].value = ['Alle'];
        }

        if ( typeof this.customerSearchCriterias[id].category !== 'undefined' && this.customerSearchCriterias[id].category === 'agent' ) {
          this.searchCriteria[id].id.value = serchriteriaId
        }

        if ( this.searchCriteria[id].usageType.value === '' ) {
          this.searchCriteria[id].usageType.value = allSearchCriteriaData.type;
        }

        if ( this.searchCriteria[id].country.value === 'Spanien' ) {
          this.searchCriteria[id].county.required = false;
        } else {
          this.searchCriteria[id].county.required = true;
        }

        if ( debug ) {
          console.log(this.searchCriteria[id]);
        }

        this.$parent.searchCriteria = this.searchCriteria;

      },
      getSearchCriteriaContent(obj) {

        let searchCriteria = obj['search_criteria'];

        if ( typeof searchCriteria === 'undefined' || searchCriteria === null || Object.keys(searchCriteria).length === 0 ) {
          return {};
        }

        let objectKeysLevel1 = Object.keys(searchCriteria);
        let objectKeysLevel2 = Object.keys(searchCriteria[objectKeysLevel1[0]]);
        let objectKeysLevel3 = Object.keys(searchCriteria[objectKeysLevel1[0]][objectKeysLevel2[0]]);

       return searchCriteria[objectKeysLevel1[0]][objectKeysLevel2[0]][objectKeysLevel3[0]];
      },
      deleteSC() {
        if ( typeof this.indexToDelete === 'number' && this.indexToDelete >= 0 && typeof this.searchCriteria[this.indexToDelete] !== 'undefined' ) {
          delete this.searchCriteria[this.indexToDelete];
          // delete this.customerSearchCriterias[this.indexToDelete];
        }

        const array = Object.values(this.searchCriteria);

        // Reindex the array to ensure sequential keys
        this.searchCriteria = array.reduce((acc, item, index) => {
          acc[index] = item;
          return acc;
        }, {});
      },
      addSearchCriteria() {
        if ( this.isEmpty(this.searchCriteria) ) {
          this.searchCriteria[0] = this.defaultSearchCriteriaData();
        }
      },
      validateSubmit() {
        let validationChecker = true;
        Object.entries(this.searchCriteria[this.activeSC]).forEach(([key, field]) => {

          if ( typeof this.searchCriteria[this.activeSC][key] !== 'undefined' ) {
            if ( typeof field.required !== 'undefined' && field.required ){
              if ( field.value === undefined || field.value === ''){
                this.searchCriteria[this.activeSC][key].valid = false;
                validationChecker = false;
              } else {
                this.searchCriteria[this.activeSC][key].valid = true;
              }
            }
          }

        });
        return validationChecker;
      },
      clearCityByCountryChange(event) {

        if ( typeof this.searchCriteria[this.activeSC].country.value === 'undefined' ) {
          return;
        }

        if ( this.searchCriteria[this.activeSC].country.value !== event.target.value ) {
          this.searchCriteria[this.activeSC].city.value = [];
        }
      },
      triggerMergeAll(type) {
        let randomId = this.makeid(20);
        if ( type ) {
          this.acceptAllMerged = randomId;
        } else {
          this.rejectAllMerged = randomId;
        }
      },
      checkRoomsAndSquareMetresValidation() {

        let roomsFrom = this.searchCriteria[this.activeSC].roomsFrom.value
        let roomsTo = this.searchCriteria[this.activeSC].roomsTo.value
        let squareMetresFrom = this.searchCriteria[this.activeSC].squareMetresFrom.value
        let squareMetresTo = this.searchCriteria[this.activeSC].squareMetresTo.value

        if ( !this.isEmpty(roomsFrom) ) {
          roomsFrom = parseInt(roomsFrom);
          if ( roomsFrom < 1 ) {
            this.searchCriteria[this.activeSC].roomsFrom.value = 1
          }
        }

        if ( !this.isEmpty(roomsTo) && !this.isEmpty(roomsFrom) ) {
          roomsTo = parseInt(roomsTo);
          if ( roomsTo < roomsFrom ) {
            this.searchCriteria[this.activeSC].roomsTo.value = roomsFrom
          }
        }

      },
      observeInputValue(fieldName, $event) {

        if ( fieldName === 'roomsFrom' ) {

          if ( parseInt($event.target.value) < 1 ) {
            $event.target.value = ''+1;
            this.searchCriteria[this.activeSC][fieldName].value = 1;
          }

          if ( parseInt($event.target.value) > parseInt(this.searchCriteria[this.activeSC].roomsTo.value) ) {
            $event.target.value = ''+this.searchCriteria[this.activeSC].roomsTo.value;
            this.searchCriteria[this.activeSC].roomsFrom.value = this.searchCriteria[this.activeSC].roomsTo.value;
          }

        } else if ( fieldName === 'roomsTo' ) {

          if ( parseInt($event.target.value) < 1 ) {
            $event.target.value = ''+1;
            this.searchCriteria[this.activeSC].roomsTo.value = 1;
          }

          if ( parseInt($event.target.value) < parseInt(this.searchCriteria[this.activeSC].roomsFrom.value) ) {
            $event.target.value = ''+this.searchCriteria[this.activeSC].roomsFrom.value;
            this.searchCriteria[this.activeSC].roomsTo.value = this.searchCriteria[this.activeSC].roomsFrom.value;
          }

        }else if ( fieldName === 'squareMetresFrom' ) {
          if ( parseInt($event.target.value) < 0 ) {
            $event.target.value = '0';
            this.searchCriteria[this.activeSC][fieldName].value = 0;
          } else if ( parseInt($event.target.value) > parseInt(this.searchCriteria[this.activeSC].squareMetresTo.value) ) {
            $event.target.value = ''+this.searchCriteria[this.activeSC].squareMetresTo.value;
            this.searchCriteria[this.activeSC][fieldName].value = this.searchCriteria[this.activeSC].squareMetresTo.value;
          }

        } else if ( fieldName === 'squareMetresTo' ) {

          if ( parseInt($event.target.value) < 20  ) {
            $event.target.value = '20';
            this.searchCriteria[this.activeSC][fieldName].value = 20;
          } else if ( parseInt($event.target.value) < parseInt(this.searchCriteria[this.activeSC].squareMetresFrom.value ) ) {
            $event.target.value = ''+this.searchCriteria[this.activeSC].squareMetresFrom.value;
            this.searchCriteria[this.activeSC][fieldName].value = this.searchCriteria[this.activeSC].squareMetresFrom.value;
          }

        }

      },
      handleClickOutside() {
        for ( let index in this.dropdowns ) {
          if ( this.dropdowns[index] ) {
            this.dropdowns[index] = false;
          }
        }
      },
      handleDropdownOpening(dropdownName) {
        for ( let index in this.dropdowns ) {
          if ( index !== dropdownName ) {
            this.dropdowns[index] = false;
          } else {
            this.dropdowns[index] = !this.dropdowns[index];
          }
        }
      },
      countyChangeDetect(value) {

        let city = this.searchCriteria[this.activeSC].city.value;
        if ( !this.dropdownContents.countyWithCities[value].includes(city) ) {
          if ( city !== '' && value !== city ) {
            this.searchCriteria[this.activeSC].city.value = '';
          }
        }

      }
    },
    computed: {
      checkIfIsCityAlicanteSelected() {
        if ( this.searchCriteria[this.activeSC].city.value === 'Alicante' ){
          return true;
        }
        return false;
      },
      localAreaParts() {
        let districts = this.searchCriteria[this.activeSC].district.value;
        let returnVal = {};
        let isAllStringSet = false;
        for(let index in districts) {

          let districtParts = this.dropdownContents.districtWithParts[districts[index]];
          // the first loop will add isAllStringSet to true if found than filter out of the other loops
          if ( isAllStringSet ) {
            districtParts = districtParts.filter(item => item !== "Alle");
          }

          returnVal[districts[index]] = districtParts

          if ( districtParts.includes('Alle') ) {
            isAllStringSet = true;
          }

        }

        return returnVal
      },
      isMergesLeftToHandle() {
        for ( let index in this.mergedData[this.activeSC] ) {
          if ( index !== 'searchCriteriaId' ) {
            if ( this.mergedData[this.activeSC][index]?.mergeStatus === undefined || this.mergedData[this.activeSC][index].mergeStatus === null ) {
              return true
            }
          }
        }
        return false
      },
      dropdownContentDynamicChangeUsageType() {

        let val = this.currentUsedSearchCriteriaCombos;

        if ( this.searchCriteria[this.activeSC]?.city?.value === undefined ) {
          return [];
        }

        let activeSearchCriteriaCity = this.searchCriteria[this.activeSC].city.value;

        let defaultUsageTypes = [
          'Wohnen',
          'Gewerbe',
          'Parken'
        ];

        this.dropdownContents.usageType = defaultUsageTypes

        let returnVal = defaultUsageTypes;
        for ( let city in val ) {
          if ( activeSearchCriteriaCity === city ) {
            let usageTypes = val[city];
            returnVal = defaultUsageTypes.filter(item => !usageTypes.includes(item));
          }
        }

        return returnVal;
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside);
      this.getCustomerData();
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleClickOutside);
    },
    watch: {
      searchCriteria: {
        handler: function (val, oldVal) {
          if ( typeof this.searchCriteria[this.activeSC] !== 'undefined' && typeof this.searchCriteria[this.activeSC].county !== 'undefined' && typeof this.searchCriteria[this.activeSC].county.value !== 'undefined' ) {
            this.filteredCountiesDropdown = this.dropdownContents.countyWithCities[this.searchCriteria[this.activeSC].county.value];
          }
          if ( this.searchCriteria[this.activeSC].country.value === 'Spanien' ) {
            this.searchCriteria[this.activeSC].usageType.value = 'Wohnen';
            this.searchCriteria[this.activeSC].county.required = false;
          } else {
            this.searchCriteria[this.activeSC].county.required = true;
          }

          let city = this.searchCriteria[this.activeSC].city.value;
          for (const region in this.dropdownContents.countyWithCities) {
            if (this.dropdownContents.countyWithCities[region].includes(city)) {
              if ( this.searchCriteria[this.activeSC].county.value !== region ) {
                this.searchCriteria[this.activeSC].county.value = region;
                if ( typeof this.mergedData[0] === 'object' && this.mergedData[0]?.county !== undefined ) {
                  this.mergedData[0].county.mergeStatus = true;
                }
              }
            }
          }

          this.validateSubmit()
          this.$parent.searchCriteriaToSubmit = this.searchCriteria
        },
        deep: true
      },
      customerSearchCriterias: {
        handler: function (val, oldVal) {
          this.$parent.customerSearchCriterias = this.customerSearchCriterias;
        },
        deep: true
      },
      triggerValidation: function() {
        if ( this.validateSubmit() ) {
          this.$emit('formValidated', true);
        }
      },
      existingSearchCriteriaId: function() {
        this.$parent.existingSearchCriteriaId = this.existingSearchCriteriaId;
      },
      jumpToFilteringTool: function() {
        this.$parent.jumpToFilteringTool = this.jumpToFilteringTool;
      },
      activeSC: function(newVal) {
        for( let index in this.dropdowns ) {
          this.dropdowns[index] = false;
        }
        if ( typeof this.searchCriteria[newVal] === 'undefined' ) {
          this.searchCriteria[newVal] = this.defaultSearchCriteriaData();
        }
        this.updateSearchCriteria();
      },
      triggerDeleteProcess: function(newVal) {
        this.deleteSC();
      },
      triggerAddSCProcess: function(newVal) {
        this.addSearchCriteria();
      },
      mergedData: {
        handler: function (val, oldVal) {
          this.$parent.mergedData = val;
        },
        deep: true
      },
    }
  }
</script>


<template>

  <form v-if="searchCriteria !== {} && typeof searchCriteria[activeSC] !== 'undefined' && Object.keys(searchCriteria[activeSC]).length > 0">

    <div class="merge-actions" v-if="isMergesLeftToHandle">
      <div class="accept" @click="triggerMergeAll(true)">Alle Kundenwünsche akzeptieren <CheckmarkIcon></CheckmarkIcon></div>
      <div class="reject" @click="triggerMergeAll(false)">Alle Kundenwünsche ablehnen <DeleteIcon></DeleteIcon></div>
    </div>

    <seperator>Suchgebiet</seperator>

    <div class="field-wrapper radios" style="text-align: center" :class="{'invalid': !searchCriteria[activeSC].country.valid, 'valid': searchCriteria[activeSC].country.valid}">
      <span>
        <label for="countryDe" class="radio-wrapper">
          <InputField inputType="radio" id="countryDe" inputName="countryDe" value="Deutschland" :inputValue="searchCriteria[activeSC].country.value" v-model="searchCriteria[activeSC].country.value" @click="clearCityByCountryChange($event)"></InputField>
          Deutschland
        </label>
<!--        <label for="countryEs" class="radio-wrapper">-->
<!--          <InputField inputType="radio" id="countryEs" inputName="countryEs" value="Spanien" :inputValue="searchCriteria[activeSC].country.value" v-model="searchCriteria[activeSC].country.value" @click="clearCityByCountryChange($event)"></InputField>-->
<!--          Spanien-->
<!--        </label>-->
      </span>
      <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="country" fieldToCheck="country" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
    </div>

    <div class="field-wrapper two-col">
      <span v-if="searchCriteria[activeSC].country.value !== 'Spanien'" :class="{'invalid': !searchCriteria[activeSC].county.valid, 'valid': searchCriteria[activeSC].county.valid}">
        <div class="field-wrapper radios">
          <InputField class="dropdown-input" ref="inputCounty" inputType="text" inputName="County" :inputValue="searchCriteria[activeSC].county.value" v-model="searchCriteria[activeSC].county.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('county')" @click.stop="" readonly></InputField>
          <label class="ph">Bundesland <AsterixMarkIcon v-if="searchCriteria[activeSC].county.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownCounty" :class="{active: dropdowns.county, relative: dropdownRelativePosition}" type="districts" :renderingObject="dropdownContents.countyWithCities" :filterFor="searchInputDistrict" :activeItems="searchCriteria[activeSC].county.value" @dropdown-item-clicked="dropdownClick('county', $event)" @click.stop=""></Dropdown>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="county" :debug="false" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged" @watchCountyChange="countyChangeDetect"></SearchCriteriaFormMatchingHandler>
        </div>
      </span>
      <span v-else>
        <div class="field-wrapper" :class="{'invalid': !searchCriteria[activeSC].spainRegion.valid, 'valid': searchCriteria[activeSC].spainRegion.valid}">
          <InputField class="dropdown-input" ref="inputCounty" inputType="text" inputName="County" :inputValue="searchCriteria[activeSC].spainRegion.value" v-model="searchCriteria[activeSC].spainRegion.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('spainRegion')" readonly @click.stop=""></InputField>
          <label class="ph">Region <AsterixMarkIcon v-if="searchCriteria[activeSC].spainRegion.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownCounty" :class="{active: dropdowns.spainRegion, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.spainRegion" :activeItems="searchCriteria[activeSC].spainRegion.value" @dropdown-item-clicked="dropdownClick('spainRegion', $event)" @click.stop=""></Dropdown>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="spainRegion" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </div>
      </span>

      <span :class="{'invalid': !searchCriteria[activeSC].city.valid, 'valid': searchCriteria[activeSC].city.valid}">
        <div class="field-wrapper">
          <InputField class="dropdown-input" ref="inputCity" inputType="text" inputName="City" :inputValue="searchCriteria[activeSC].city.value" v-model="searchCriteria[activeSC].city.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('city')" readonly @click.stop=""></InputField>
          <label class="ph">Stadt <AsterixMarkIcon v-if="searchCriteria[activeSC].city.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownCity" :class="{active: dropdowns.city, relative: dropdownRelativePosition}" type="country" :renderingObject="searchCriteria[activeSC].country.value !== 'Spanien' ? (filteredCountiesDropdown === '' ? {} : filteredCountiesDropdown) : dropdownContents.countyWithCitiesEs" :filterFor="searchInputCity" :activeItems="searchCriteria[activeSC].city.value" @dropdown-item-clicked="dropdownClick('city', $event)" @click.stop=""></Dropdown>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="city" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </div>
      </span>

    </div>

    <div class="field-wrapper two-col" v-if="searchCriteria[activeSC].city.value === 'Berlin'">
      <span>
        <div class="field-wrapper">
          <InputField class="dropdown-input" ref="inputDistrict" inputType="text" inputName="District" :inputValue="searchCriteria[activeSC].district.value" v-model="searchCriteria[activeSC].district.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('district')" readonly @click.stop=""></InputField>
          <label class="ph">Bezirk</label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownDistrict" :class="{active: dropdowns.district, relative: dropdownRelativePosition}" type="districts" :renderingObject="dropdownContents.districtWithParts" :filterFor="searchInputDistrict" :activeItems="searchCriteria[activeSC].district.value" @dropdown-item-clicked="dropdownClick('district', $event)" @click.stop=""></Dropdown>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="district" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </div>
      </span>
      <span>
        <div class="field-wrapper">
          <InputField class="dropdown-input" ref="inputlocalArea" inputType="text" inputName="localArea" :inputValue="searchCriteria[activeSC].localArea.value" v-model="searchCriteria[activeSC].localArea.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('localArea')" readonly @click.stop=""></InputField>
          <label class="ph">Ortsteil</label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownlocalArea" :class="{active: dropdowns.localArea, relative: dropdownRelativePosition}" type="districtParts" :renderingObject="localAreaParts" :activeItems="searchCriteria[activeSC].localArea.value" @dropdown-item-clicked="dropdownClick('localArea', $event)" @click.stop=""></Dropdown>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="localArea" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </div>
      </span>
    </div>

    <div class="field-wrapper" v-if="searchCriteria[activeSC].city.value === 'Berlin'">
      <label for="tramCircle" class="checkbox-wrapper">
        <input class="checkbox field" type="checkbox" id="tramCircle" name="tramCircle" v-model="searchCriteria[activeSC].tramCircle.value">
        Innerhalb S-Bahn-Ring
      </label>
      <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="tramCircle" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
    </div>

    <seperator>Immobilie</seperator>

    <span class="wrapper-dynamic-fields">

      <div class="field-wrapper two-col" v-if="searchCriteria[activeSC].country.value !== 'Spanien'">
        <span :class="{'invalid': !searchCriteria[activeSC].usageType.valid, 'valid': searchCriteria[activeSC].usageType.valid}">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria[activeSC].usageType.value" v-model="searchCriteria[activeSC].usageType.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('usageType')" @click.stop="" readonly></InputField>
          <label class="ph">Nutzungsart <AsterixMarkIcon v-if="searchCriteria[activeSC].usageType.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.usageType, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContentDynamicChangeUsageType" :activeItems="searchCriteria[activeSC].usageType.value" @dropdown-item-clicked="dropdownClick('usageType', $event)" @click.stop=""></Dropdown>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="usageType" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
         <span :class="{'invalid': !searchCriteria[activeSC].realEstateType.valid, 'valid': searchCriteria[activeSC].realEstateType.valid}" v-if="searchCriteria[activeSC].usageType.value !== ''">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria[activeSC].realEstateType.value" v-model="searchCriteria[activeSC].realEstateType.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('realEstateType')" @click.stop="" readonly></InputField>
          <label class="ph">Immobilientyp <AsterixMarkIcon v-if="searchCriteria[activeSC].realEstateType.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.realEstateType, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.realEstateTypeDe[searchCriteria[activeSC].usageType.value]" :activeItems="searchCriteria[activeSC].realEstateType.value" @dropdown-item-clicked="dropdownClick('realEstateType', $event)" @click.stop=""></Dropdown>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="realEstateType" :debug="false" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
       </span>
      </div>

      <div class="field-wrapper two-col" v-else>
        <span :class="{'invalid': !searchCriteria[activeSC].realEstateType.valid, 'valid': searchCriteria[activeSC].realEstateType.valid}">
          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria[activeSC].realEstateType.value" v-model="searchCriteria[activeSC].realEstateType.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('realEstateType')" @click.stop=""></InputField>
          <label class="ph">Immobilientyp <AsterixMarkIcon v-if="searchCriteria[activeSC].realEstateType.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.realEstateType, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.realEstateTypeEs" :filterFor="searchCriteria[activeSC].realEstateType.value" :activeItems="searchCriteria[activeSC].realEstateType.value" @dropdown-item-clicked="dropdownClick('realEstateType', $event)" @click.stop=""></Dropdown>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="realEstateType" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
         <span :class="{'invalid': !searchCriteria[activeSC].location.valid, 'valid': searchCriteria[activeSC].location.valid}">
          <InputField class="dropdown-input" ref="inputTimeOfPurchase" inputType="text" inputName="TimeOfPurchase" :inputValue="searchCriteria[activeSC].location.value" v-model="searchCriteria[activeSC].location.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('location')" @click.stop=""></InputField>
          <label class="ph">Lage <AsterixMarkIcon v-if="searchCriteria[activeSC].location.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimeOfPurchase" :class="{active: dropdowns.location, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.location" :filterFor="searchCriteria[activeSC].location.value" :activeItems="searchCriteria[activeSC].location.value" @dropdown-item-clicked="dropdownClick('location', $event)" @click.stop=""></Dropdown>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="location" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
         </span>
    </div>

      <div class="field-wrapper two-col">
        <span class="two-col-in-two-col">
          <span>Zimmer:</span>
            <div class="field-wrapper" :class="{'invalid': !searchCriteria[activeSC].roomsFrom.valid, 'valid': searchCriteria[activeSC].roomsFrom.valid}">
              <InputField inputType="number" min="1" step="0.5" inputplaceholder="" inputName="roomsFrom" :inputValue="searchCriteria[activeSC].roomsFrom.value" v-model="searchCriteria[activeSC].roomsFrom.value" @input="observeInputValue('roomsFrom', $event)"></InputField>
              <label class="ph">Ab <AsterixMarkIcon v-if="searchCriteria[activeSC].roomsFrom.required"></AsterixMarkIcon></label>
              <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="roomsFrom" fieldToCheck="rooms" fieldKeyToCheck="from" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
            </div>
            <div class="field-wrapper" :class="{'invalid': !searchCriteria[activeSC].roomsTo.valid, 'valid': searchCriteria[activeSC].roomsTo.valid}">
              <InputField inputType="number" min="1" step="0.5" inputplaceholder="" inputName="roomsFrom" :inputValue="searchCriteria[activeSC].roomsTo.value" v-model="searchCriteria[activeSC].roomsTo.value" @input="observeInputValue('roomsTo', $event)"></InputField>
              <label class="ph">Bis <AsterixMarkIcon v-if="searchCriteria[activeSC].roomsTo.required"></AsterixMarkIcon></label>
              <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="roomsTo" fieldToCheck="rooms" fieldKeyToCheck="to" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
            </div>
        </span>
        <span class="two-col-in-two-col">
          <span> {{ searchCriteria[activeSC].country.value !== 'Spanien' ? 'Fläche' : 'Bäder' }}:</span>
            <div class="field-wrapper two-col" v-if="searchCriteria[activeSC].country.value !== 'Spanien'">
              <span :class="{'invalid': !searchCriteria[activeSC].squareMetresFrom.valid, 'valid': searchCriteria[activeSC].squareMetresFrom.valid}">
                <InputField inputType="number" inputplaceholder="" min="1" inputName="squareMetresFrom" :inputValue="searchCriteria[activeSC].squareMetresFrom.value" v-model="searchCriteria[activeSC].squareMetresFrom.value" @blur="observeInputValue('squareMetresFrom', $event)"></InputField>
                <label class="ph">Ab <AsterixMarkIcon v-if="searchCriteria[activeSC].squareMetresFrom.required"></AsterixMarkIcon></label>
                <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="squareMetresFrom" fieldToCheck="squareMetresFrom" fieldKeyToCheck="from" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
              </span>
              <span :class="{'invalid': !searchCriteria[activeSC].squareMetresTo.valid, 'valid': searchCriteria[activeSC].squareMetresTo.valid}">
                <InputField inputType="number" inputplaceholder="" min="1" inputName="squareMetresTo" :inputValue="searchCriteria[activeSC].squareMetresTo.value" v-model="searchCriteria[activeSC].squareMetresTo.value" @blur="observeInputValue('squareMetresTo', $event)"></InputField>
                <label class="ph">Bis <AsterixMarkIcon v-if="searchCriteria[activeSC].squareMetresTo.required"></AsterixMarkIcon></label>
                <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="squareMetresTo" fieldToCheck="squareMetresTo" fieldKeyToCheck="to" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
              </span>
            </div>

            <div class="field-wrapper two-col" v-else>
               <span :class="{'invalid': !searchCriteria[activeSC].bathRoomsFrom.valid, 'valid': searchCriteria[activeSC].bathRoomsFrom.valid}">
                <InputField inputType="number" inputplaceholder="" min="0" inputName="bathRoomsFrom" :inputValue="searchCriteria[activeSC].bathRoomsFrom.value" v-model="searchCriteria[activeSC].bathRoomsFrom.value"></InputField>
                <label class="ph">Ab <AsterixMarkIcon v-if="searchCriteria[activeSC].bathRoomsFrom.required"></AsterixMarkIcon></label>
                 <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="bathRoomsFrom" fieldToCheck="bathRoomsFrom" fieldKeyToCheck="from" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
               </span>
              <span :class="{'invalid': !searchCriteria[activeSC].bathRoomsTo.valid, 'valid': searchCriteria[activeSC].bathRoomsTo.valid}">
                <InputField inputType="number" inputplaceholder="" min="0" inputName="bathRoomsTo" :inputValue="searchCriteria[activeSC].bathRoomsTo.value" v-model="searchCriteria[activeSC].bathRoomsTo.value"></InputField>
                <label class="ph">Bis <AsterixMarkIcon v-if="searchCriteria[activeSC].bathRoomsTo.required"></AsterixMarkIcon></label>
                 <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="bathRoomsFrom" fieldToCheck="bathRoomsFrom" fieldKeyToCheck="to" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
              </span>
            </div>
        </span>
      </div>
      <div class="field-wrapper two-col" v-if="!showCustomerSearchCriteria">
        <span>
          <div class="field-wrapper" :class="{'invalid': !searchCriteria[activeSC].rentStatus.valid, 'valid': searchCriteria[activeSC].rentStatus.valid}">
            <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="searchCriteria[activeSC].rentStatus.value" v-model="searchCriteria[activeSC].rentStatus.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('rentStatus')" @click.stop="" readonly></InputField>
            <label class="ph">Wohnungsstatus <AsterixMarkIcon v-if="searchCriteria[activeSC].rentStatus.required"></AsterixMarkIcon></label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown ref="dropdownSource" :class="{active: dropdowns.rentStatus, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.rentStatus" :filterFor="searchCriteria[activeSC].rentStatus.value" :activeItems="searchCriteria[activeSC].rentStatus.value" @dropdown-item-clicked="dropdownClick('rentStatus', $event)" @click.stop=""></Dropdown>
            <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="rentStatus" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
          </div>
        </span>
        <span v-if="searchCriteria[activeSC].country.value !== 'Spanien'">
          <InputField inputType="date" inputplaceholder="" inputName="freeFrom" :inputValue="searchCriteria[activeSC].freeFrom.value" v-model="searchCriteria[activeSC].freeFrom.value"></InputField>
          <label class="ph">Fertig / leer ab (tt.mm.jj) <AsterixMarkIcon v-if="searchCriteria[activeSC].freeFrom.required"></AsterixMarkIcon></label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="freeFrom" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
      </div>

      <div class="field-wrapper features" v-if="searchCriteria[activeSC].country.value !== 'Spanien'">
        <span>
          <label for="Balcony" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="Balcony" name="Balcony" v-model="searchCriteria[activeSC].balcony.value">
            Balkon
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="balcony" @click.stop="" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span>
          <label for="Terrace" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="Terrace" name="Terrace" v-model="searchCriteria[activeSC].terrace.value">
            Terrasse
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="terrace" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span>
          <label for="Garden" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="Garden" name="Garden" v-model="searchCriteria[activeSC].garden.value">
            Garten
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="garden" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span>
          <label for="Lift" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="Lift" name="Lift" v-model="searchCriteria[activeSC].lift.value">
            Aufzug
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="lift" :debug="false" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span>
          <label for="Basement" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="Basement" name="Basement" v-model="searchCriteria[activeSC].basement.value">
            Keller
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="basement" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span>
          <label for="ParkingSlot" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="ParkingSlot" name="ParkingSlot" v-model="searchCriteria[activeSC].parkingSlot.value">
            Stellplatz
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="parkingSlot" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
      </div>

       <div class="field-wrapper features" v-else>

         <span>
           <label for="OceanView" class="checkbox-wrapper">
              <input class="checkbox field" type="checkbox" id="OceanView" name="OceanView" v-model="searchCriteria[activeSC].oceanView.value">
              Meeresblick
            </label>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="oceanView" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
         </span>
         <span>
           <label for="pool" class="checkbox-wrapper">
              <input class="checkbox field" type="checkbox" id="pool" name="pool" v-model="searchCriteria[activeSC].pool.value">
              Pool
            </label>
           <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="pool" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
         </span>
        <span>
          <label for="PrivatGarden" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="PrivatGarden" name="PrivatGarden" v-model="searchCriteria[activeSC].privatGarden.value">
            Privatgarten
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="privatGarden" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span>
           <label for="Golf" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="Golf" name="Golf" v-model="searchCriteria[activeSC].golf.value">
            Golfplatz i.d.N.
          </label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="golf" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
       <span>
         <label for="AdditionalWishes" class="checkbox-wrapper">
            <input class="checkbox field" type="checkbox" id="AdditionalWishes" name="AdditionalWishes" v-model="searchCriteria[activeSC].additionalWishes.value">
            Weitere Wünsche
         </label>
         <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="additionalWishes" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
       </span>
        <span v-if="searchCriteria[activeSC].additionalWishes.value === true" style="margin-top:25px;">
          <TextAreaField inputName="additionWishes" :inputValue="searchCriteria[activeSC].notice.value" v-model="searchCriteria[activeSC].notice.value"></TextAreaField>
          <label class="ph">Welche weiteren Wünsche? <AsterixMarkIcon v-if="searchCriteria[activeSC].notice.required"></AsterixMarkIcon></label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" fieldToCheck="notice" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
      </div>

       <div class="field-wrapper property-status" v-if="showCustomerSearchCriteria">
         <seperator>Geben Sie den bevorzugten Status der Immobilien an (Mehrfachauswahl möglich)</seperator>
        <label for="propertyStatus1" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="propertyStatus1" name="propertyStatus1" value="Im Bau befindliche Immobilie" v-model="searchCriteria[activeSC].propertyStatus.value">
          Im Bau befindliche Immobilie
        </label>
        <label for="propertyStatus2" class="checkbox-wrapper">
          <input class="checkbox field" type="checkbox" id="propertyStatus2" name="propertyStatus2" value="Bezugsfertige Neubau-Immobilie" v-model="searchCriteria[activeSC].propertyStatus.value">
          Bezugsfertige Neubau-Immobilie
        </label>
        <label for="propertyStatus3" class="checkbox-wrapper" v-if="searchCriteria[activeSC].country.value !== 'Spanien'">
          <input class="checkbox field" type="checkbox" id="propertyStatus3" name="propertyStatus3" value="Bezugsfreie Bestandsimmobilie" v-model="searchCriteria[activeSC].propertyStatus.value">
          Bezugsfreie Bestandsimmobilie
        </label>
        <label for="propertyStatus4" class="checkbox-wrapper" v-if="searchCriteria[activeSC].country.value !== 'Spanien'">
          <input class="checkbox field" type="checkbox" id="propertyStatus4" name="propertyStatus4" value="Vermietete Bestandsimmobilie" v-model="searchCriteria[activeSC].propertyStatus.value">
          Vermietete Bestandsimmobilie
        </label>
      </div>

      <div class="field-wrapper" v-if="showCustomerSearchCriteria && searchCriteria[activeSC].country.value !== 'Spanien'">
        <span v-if="searchCriteria[activeSC].moveInDate.value !== 'Spanien'">
          <InputField inputType="date" inputplaceholder="" inputName="moveInDarte" :inputValue="searchCriteria[activeSC].moveInDate.value" v-model="searchCriteria[activeSC].moveInDate.value"></InputField>
          <label class="ph">Einzugsdatum <AsterixMarkIcon v-if="searchCriteria[activeSC].moveInDate.required"></AsterixMarkIcon></label>
        </span>
      </div>

      <seperator>Budget</seperator>

      <div class="field-wrapper two-col">
        <span :class="{'invalid': !searchCriteria[activeSC].maxBudget.valid, 'valid': searchCriteria[activeSC].maxBudget.valid}">
          <InputField inputType="text" inputplaceholder="" inputName="maxBudget" :inputValue="this.numberWithComma(searchCriteria[activeSC].maxBudget.value)" v-model="searchCriteria[activeSC].maxBudget.value"></InputField>
          <label class="ph">Maximale Budget <AsterixMarkIcon v-if="searchCriteria[activeSC].maxBudget.required"></AsterixMarkIcon></label>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="maxBudget" fieldToCheck="price" fieldKeyToCheck="from" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
        <span :class="{'invalid': !searchCriteria[activeSC].priceDeviation.valid, 'valid': searchCriteria[activeSC].priceDeviation.valid}">
          <InputField class="dropdown-input" ref="inputTimeOfPurchase" inputType="text" inputName="TimeOfPurchase" :inputValue="searchCriteria[activeSC].priceDeviation.value" v-model="searchCriteria[activeSC].priceDeviation.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('priceDeviation')" @click.stop="" readonly></InputField>
          <label class="ph">Budget Plus <AsterixMarkIcon v-if="searchCriteria[activeSC].priceDeviation.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimeOfPurchase" :class="{active: dropdowns.priceDeviation, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.priceDeviation" :activeItems="searchCriteria[activeSC].priceDeviation.value" @dropdown-item-clicked="dropdownClick('priceDeviation', $event)" @click.stop=""></Dropdown>
          <SearchCriteriaFormMatchingHandler :activeSearchCriteria="searchCriteria[activeSC]" :changes="mergedData[activeSC]" activeSearchCriteriaField="priceDeviation" fieldToCheck="price" fieldKeyToCheck="priceDeviation" :acceptAllMerged="acceptAllMerged" :rejectAllMerged="rejectAllMerged"></SearchCriteriaFormMatchingHandler>
        </span>
      </div>

      <div class="field-wrapper two-col radios" v-if="showCustomerSearchCriteria && searchCriteria[activeSC].country.value !== 'Spanien'">
        <span>
          <span class="subtitle">Sind Sie bereits Immobilieneigentümer?</span>
          <span>
            <label for="realEstateOwnerYes" class="radio-wrapper">
              <InputField inputType="radio" id="realEstateOwnerYes" inputName="realEstateOwnerYes" :value="true" :inputValue="searchCriteria[activeSC].realestateOwner.value" v-model="searchCriteria[activeSC].realestateOwner.value"></InputField>
              Ja
            </label>
            <label for="realEstateOwnerNo" class="radio-wrapper">
              <InputField inputType="radio" id="realEstateOwnerNo" inputName="realEstateOwnerNo" value="false" :inputValue="searchCriteria[activeSC].realestateOwner.value" v-model="searchCriteria[activeSC].realestateOwner.value"></InputField>
              Nein
            </label>
          </span>
        </span>
        <span>
          <span class="subtitle">Warum möchten Sie die Immobilie erwerben?</span>
          <span>
            <label for="usageAfterBuySelbstnutzer" class="radio-wrapper">
              <InputField inputType="radio" id="usageAfterBuySelbstnutzer" inputName="usageAfterBuySelbstnutzer" value="Selbstnutzer" :inputValue="searchCriteria[activeSC].usageAfterBuy.value" v-model="searchCriteria[activeSC].usageAfterBuy.value"></InputField>
              Selbstnutzung
            </label>
            <label for="usageAfterBuyKapitalanlage" class="radio-wrapper">
              <InputField inputType="radio" id="usageAfterBuyKapitalanlage" inputName="usageAfterBuyKapitalanlage" value="Kapitalanlage" :inputValue="searchCriteria[activeSC].usageAfterBuy.value" v-model="searchCriteria[activeSC].usageAfterBuy.value"></InputField>
              Kapitalanlage
            </label>
          </span>
        </span>

      </div>


      <div class="field-wrapper" v-if="showCustomerSearchCriteria && searchCriteria[activeSC].country.value === 'Spanien'">
        <span :class="{'invalid': !searchCriteria[activeSC].timeOfPurchase.valid, 'valid': searchCriteria[activeSC].timeOfPurchase.valid}">
          <InputField class="dropdown-input" ref="inputTimeOfPurchase" inputType="text" inputName="TimeOfPurchase" :inputValue="searchCriteria[activeSC].timeOfPurchase.value" v-model="searchCriteria[activeSC].timeOfPurchase.value" @focus="setDropdownTop($event)" @click="handleDropdownOpening('timeOfPurchase')" @click.stop=""></InputField>
          <label class="ph">Kaufzeitpunkt <AsterixMarkIcon v-if="searchCriteria[activeSC].priceDeviation.required"></AsterixMarkIcon></label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownTimeOfPurchase" :class="{active: dropdowns.timeOfPurchase, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.timeOfPurchase" :activeItems="searchCriteria[activeSC].timeOfPurchase.value" @dropdown-item-clicked="dropdownClick('timeOfPurchase', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

<!--      <div class="field-wrapper radios" v-if="searchCriteria[activeSC].kindOfFinance.value === 'Finanzierung'">-->
<!--        <div class="fieldgroup-label">Finanzierung gesichert? <AsterixMarkIcon v-if="searchCriteria[activeSC].approvedFinance.required"></AsterixMarkIcon></div>-->
<!--        <label for="approvedTrueFinance" class="radio-wrapper">-->
<!--          <InputField inputType="radio" id="approvedTrueFinance" inputName="approvedTrueFinance" value="true" :inputValue="searchCriteria[activeSC].approvedFinance.value" v-model="searchCriteria[activeSC].approvedFinance.value"></InputField>-->
<!--          Ja-->
<!--        </label>-->
<!--        <label for="approvedFalseFinance" class="radio-wrapper">-->
<!--          <InputField inputType="radio" id="approvedFalseFinance" inputName="approvedFalseFinance" value="false" :inputValue="searchCriteria[activeSC].approvedFinance.value" v-model="searchCriteria[activeSC].approvedFinance.value"></InputField>-->
<!--          Nein-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="field-wrapper radios" v-if="searchCriteria[activeSC].kindOfFinance.value === 'Eigene Mittel'">-->
<!--        <span>-->
<!--            <InputField inputType="text" inputplaceholder="" inputName="maxBudget" :inputValue="this.numberWithComma(searchCriteria[activeSC].equityCapital.value)" v-model="searchCriteria[activeSC].equityCapital.value"></InputField>-->
<!--            <label class="ph">Maximales Eigenkapital? <AsterixMarkIcon v-if="searchCriteria[activeSC].equityCapital.required"></AsterixMarkIcon></label>-->
<!--        </span>-->
<!--      </div>-->

      <div class="field-wrapper" v-if="showCustomerSearchCriteria">
        <TextAreaField inputplaceholder="" :style="!isFocusedNotice ? 'height: 40px' : 'height: 150px'" inputName="notice" :inputVal="searchCriteria[activeSC].furtherComments.value" v-model="searchCriteria[activeSC].furtherComments.value" @focusin="isFocusedNotice = true;" @focusout="isFocusedNotice = false"></TextAreaField>
        <label class="ph">Weitere Anmerkungen / Fragen <AsterixMarkIcon v-if="searchCriteria[activeSC].furtherComments.required"></AsterixMarkIcon></label>
      </div>

      <div class="field-wrapper" v-if="showCustomerSearchCriteria">
      <label for="JumpToFilteringTool" class="checkbox-wrapper">
        <input class="checkbox field" type="checkbox" id="JumpToFilteringTool" name="JumpToFilteringTool" v-model="jumpToFilteringTool">
        Zu diesem Suchprofil passende Immobilien sofort anzeigen
      </label>
    </div>
    </span>

<!--    <span class="wrapper-dynamic-fields">-->

<!--       <seperator>Budget</seperator>-->

<!--      <div class="field-wrapper two-col">-->
<!--        <span :class="{'invalid': !searchCriteria[activeSC].maxBudget.valid, 'valid': searchCriteria[activeSC].maxBudget.valid}">-->
<!--          <InputField inputType="text" inputplaceholder="" inputName="maxBudget" :inputValue="this.numberWithComma(searchCriteria[activeSC].maxBudget.value)" v-model="searchCriteria[activeSC].maxBudget.value"></InputField>-->
<!--          <label class="ph">Maximales Budget? <AsterixMarkIcon v-if="searchCriteria[activeSC].maxBudget.required"></AsterixMarkIcon></label>-->
<!--        </span>-->
<!--        <span :class="{'invalid': !searchCriteria[activeSC].needCredit.valid, 'valid': searchCriteria[activeSC].needCredit.valid}">-->
<!--          <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="searchCriteria[activeSC].needCredit.value" v-model="searchCriteria[activeSC].needCredit.value" @focus="setDropdownTop($event)" @click="dropdowns.needCredit = !dropdowns.needCredit" @click.stop=""></InputField>-->
<!--          <label class="ph">Kredit benötigt? <AsterixMarkIcon v-if="searchCriteria[activeSC].needCredit.required"></AsterixMarkIcon></label>-->
<!--          <DropdownArrow class="dropdown-arrow"></DropdownArrow>-->
<!--          <Dropdown ref="dropdownLanguage" :class="{active: dropdowns.needCredit, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.needCredit" :filterFor="searchCriteria[activeSC].needCredit.value" :activeItems="searchCriteria[activeSC].needCredit.value" @dropdown-item-clicked="dropdownClick('needCredit', $event)" @click.stop=""></Dropdown>-->
<!--        </span>-->
<!--      </div>-->

<!--    </span>-->

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

.radios .subtitle {
  width: 100%;
  display: block;
  margin-bottom: 15px;
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

.field-wrapper:not(.two-col).features > span {
  flex-basis: 33%;
}

label {
  cursor: pointer;
}

.radio-wrapper {
  display: inline-block;
}

.checkbox-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-wrapper .wrapper-merge-view {
  flex-basis: 100%;
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

.seperator {
  z-index: 0;
}

.field-wrapper.radios.invalid label:first-of-type {
  border-left: solid 5px red;
}

.two-col-in-two-col {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.two-col-in-two-col .field-wrapper {
  margin-left: 20px;
  margin-top: 0;
}

.property-status label {
  flex-basis: 50%;
  margin-bottom: 10px;
}

.merge-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.merge-actions > div {
  padding: 10px 20px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: var(--light-light-gray);
  color: black;
  cursor: pointer;
}

.merge-actions > div:hover {
  color: white;
  transition: all 0.2s;
}

.merge-actions > div.accept i {
  color: var(--green);
}

.merge-actions > div.reject i {
  color: var(--red);
}

.merge-actions > div.accept:hover {
  background-color: var(--green);
}

.merge-actions > div.reject:hover {
  background-color: var(--red);
}

.merge-actions > div:hover i {
  color: white;
}

.merge-actions > div + div {
  margin-left: 25px;
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
