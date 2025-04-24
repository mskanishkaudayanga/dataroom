<script>
  import axios from "axios"
  import Card from './card/Card.vue'
  import TopActionBar from './topactionbar/TopActionBar.vue'
  import SingleReservationView from '../views/GetSingleReservationView.vue'
  import SingleVerkaufsmeldungView from '../views/GetSingleVerkaufsmeldungView.vue';
  import CreateReservationView from '../views/CreateReservationView.vue'
  import FilterView from "../views/FilterView.vue";
  import AlertMessage from "./card/AlertMessage.vue";

  export default {
    name: "Dashboard",
    components: {AlertMessage, FilterView, Card, TopActionBar, SingleReservationView, SingleVerkaufsmeldungView, CreateReservationView},
    data(){
      return {
        apiResponse: [],
        apiArchivedResponse: [],
        apiResponseFiltered: '',
        apiResponseMessage: false,
        realEstateList: [],
        activeFilters: [],
        sortingOption: {
          objectPropToSort: 'create_date',
          order: 'ASC'
        },
        statusFilter: 'Alle',
        searchInput: '',
        timeout: null,
        searchResults: [],

      }
    },
    methods: {
      getAllCardData() {
        this.apiResponse = [];
        axios.get(this.globalApiBaseUrl + '/reservations/getAllReservations')
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    for ( const item in response.data.response.response ){
                      let favData = response.data.response.response[item].favoured_userids;
                      if ( typeof favData !== 'undefined' && favData !== '' && favData !== 'null' && favData !== null){
                        response.data.response.response[item].favoured_userids = JSON.parse(favData)
                      }

                      this.apiResponse.push(response.data.response.response[item]);
                    }
                    this.apiResponse = this.sortArray(this.apiResponse, this.sortingOption.objectPropToSort,this.sortingOption.order);
                    this.apiResponse = this.sortArrayForFav(this.apiResponse);
                    this.filterReservationForStatus('Alle');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            );
      },
      getArchivedCardData() {
        this.apiArchivedResponse = [];
        axios.get(this.globalApiBaseUrl + '/reservations/getAllArchivedReservations')
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    for ( const item in response.data.response.response ){
                      this.apiArchivedResponse.push(response.data.response.response[item]);
                    }
                    this.apiArchivedResponse = this.sortArray(this.apiArchivedResponse, this.sortingOption.objectPropToSort,this.sortingOption.order);
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            );
      },
      removeCardFromDashboard(reservationId) {
        let allCards = this.apiResponse;
        let i = 0;
        setTimeout(() => {
          for (const card of allCards) {
            if ( card.reservation_id === reservationId ){
              this.apiResponse[i].reservation_id = false;
              break;
            }
            i += 1;
          }
        }, 500);
      },
      getRealEstatesNr(data) {
        let currentRealEstateList = this.realEstateList;
        for (const realEstate of data ){
          if ( realEstate.estate_nr ){
            currentRealEstateList.push(realEstate.estate_nr);
          }
        }
        this.realEstateList = currentRealEstateList;
      },
      closeDropdown() {
        this.$refs.topActionBar.setDropdownShowValue(false);
      },
      updateReservationBasedOnFavAction(data) {
        let cardFavData = this.apiResponse;
        if ( typeof this.apiResponseFiltered === 'object' && this.apiResponseFiltered.length > 0 ) {
          cardFavData = this.apiResponseFiltered;
        }

        let indexOfReserveration = 0;
        // find reservation index
        for (const index in cardFavData ) {
          if ( cardFavData[index].reservation_id === data.reservationId ) {
            indexOfReserveration = index;
          }
        }

        if ( data.enable ) {
          if ( typeof cardFavData[indexOfReserveration].favoured_userids !== 'undefined' && cardFavData[indexOfReserveration].favoured_userids && cardFavData[indexOfReserveration].favoured_userids.length > 0 ){
            cardFavData[indexOfReserveration].favoured_userids.push(this.getUserId()+'');
          } else {
            cardFavData[indexOfReserveration].favoured_userids = [this.getUserId()+''];
          }
        } else {
          if ( typeof cardFavData[indexOfReserveration].favoured_userids !== 'undefined' && cardFavData[indexOfReserveration].favoured_userids && cardFavData[indexOfReserveration].favoured_userids.length > 0 ){
            cardFavData[indexOfReserveration].favoured_userids = cardFavData[indexOfReserveration].favoured_userids.filter(item => item !== this.getUserId()+'');
          }
        }
        if ( !data.enable ) {
          cardFavData = this.sortArray(cardFavData, this.sortingOption.objectPropToSort,this.sortingOption.order);
        }
        cardFavData = this.sortArrayForFav( cardFavData );
      },
      checkIfDBValExists(val) {
        if ( val !== null && val !== '' && val !== undefined ) {
          return true;
        } else {
          return false;
        }
      },
      filterReservationForStatus(currentStatus) {
        let allReservationData = this.apiResponse;
        if ( currentStatus === 'Archivierte') {
          allReservationData = this.apiArchivedResponse;
        }

        let newArray = [];
        // if ( newVal === 'Alle' ){
        //   newArray = allReservationData;
        // } else {
        newArray = allReservationData.filter(function (el) {
          if ( currentStatus === 'Abgeschlossene Verkäufe' && el['kv_signed_by_covivio'] !== undefined && el['kv_signed_by_covivio'] !== null && el['kv_signed_by_covivio'] !== '' ) {
            return true;
          } else if (currentStatus === 'Archivierte' && parseInt(el['reservation_status']) === -2) {
            return true;
          } else if ( currentStatus === 'Alle' && ( parseInt(el['reservation_status']) !== -2 && (el['kv_signed_by_covivio'] === undefined || el['kv_signed_by_covivio'] === null || el['kv_signed_by_covivio'] === '') ) ) {
            return true;
          }
        });
        // }

        if ( newArray.length === 0 ){
          this.apiResponseMessage = 'Keine Reservierung mit ausgewählten Filtern gefunden!';
        } else {
          this.apiResponseMessage = false;
        }

        this.apiResponseFiltered = newArray;
      }
    },
    mounted() {
      this.getAllCardData();
      this.getArchivedCardData();
    },
    watch: {
      activeFilters: function(newVal) {
        let allReservationData = this.apiResponse;
        let arrayOfFilters = {};
        for ( const activeFilter in newVal ){
          let key = Object.keys(newVal[activeFilter])[0];

          let arr = key.split('-');
          let keyValue = arr[1];

          if ( key.includes('agent') ){
            if ( arrayOfFilters['agentFilter'] === undefined ){
              arrayOfFilters['agentFilter'] = [];
            }
            arrayOfFilters['agentFilter'].push(newVal[activeFilter][key].content);
          } else if ( key.includes('real-estates') ){
            if ( arrayOfFilters['realEstates'] === undefined ){
              arrayOfFilters['realEstates'] = [];
            }
            arrayOfFilters['realEstates'].push(newVal[activeFilter][key].content);
          } else if ( key.includes('agents') ){
            if ( arrayOfFilters['agents'] === undefined ){
              arrayOfFilters['agents'] = [];
            }
            arrayOfFilters['agents'].push(newVal[activeFilter][key].content);
          } else if ( key.includes('Status') ){
            if ( arrayOfFilters[keyValue] === undefined ){
              arrayOfFilters[keyValue] = [];
            }
            arrayOfFilters[keyValue].push(this.FilterTextToStatusInt(keyValue.toLowerCase(), newVal[activeFilter][key].content));
          }  else if ( key.includes('type') ){
            if ( arrayOfFilters['type'] === undefined ){
              arrayOfFilters['type'] = [];
            }
            arrayOfFilters['type'].push(newVal[activeFilter][key].content);
          }
        }

        let newArray = allReservationData.filter(function (el) {

          let searchedProperty;
          let detector = [];
          let keyCount = Object.keys(arrayOfFilters).length;

          if ( Object.keys(arrayOfFilters).length > 0 ) {

            for ( const filterName in arrayOfFilters ){

              if ( filterName === 'agentFilter' ){
                searchedProperty = 'real_estate_agent';
              }
              if ( filterName === 'agents' ){
                searchedProperty = 'real_estate_agent';
              }

              // Filter for agents
              if ( filterName === 'agentFilter' || filterName === 'agents' ) {
                if ( !arrayOfFilters[filterName].includes(el[searchedProperty]) ) {
                  return false;
                } else {
                  detector.push(true);
                }
              }

              // Filter for real estates
              if ( filterName === 'realEstates' ){
                searchedProperty = 'estate_nrs';
                for ( const singleRealEstateFilter in arrayOfFilters[filterName] ){
                  if ( el[searchedProperty].includes(arrayOfFilters[filterName][singleRealEstateFilter]) ) {
                    detector.push(true);
                    break;
                  }
                }
              }

              // Filter for status
              let filterNameToLowerCases = filterName.toLowerCase();
              if ( filterNameToLowerCases.includes('reservationstatus') ){
                searchedProperty = 'reservation_status';

                if ( arrayOfFilters[filterName].includes(parseInt(el[searchedProperty])) ) {
                  detector.push(true);
                }

                // Get also all reservation > 4 means all after reservation
                if ( arrayOfFilters[Object.keys(arrayOfFilters)[0]].includes(4) ) {
                  if ( parseInt(el[searchedProperty]) > 4 ) {
                    detector.push(true);
                  }
                }

              } else if ( filterNameToLowerCases.includes('ndbstatus') ) {
                searchedProperty = 'reservation_status';
                if ( arrayOfFilters[filterName].includes(parseInt(el[searchedProperty])) ) {
                  detector.push(true);
                }

                // Check if ndb was sent to essen
                if (arrayOfFilters[filterName].includes('an essen gesendet') ) {
                  searchedProperty = 'kv_data_send_to_lawyers';
                  if ( el[searchedProperty] !== null && el[searchedProperty] !== '' && typeof el[searchedProperty] !== 'undefined' ) {
                    detector.push(true);
                  }
                }

                // Check if ndb was sent to berlin
                if (arrayOfFilters[filterName].includes('an berlin gesendet') ) {
                  searchedProperty = 'kv_data_send_from_lawyers_to_berlin';
                  if ( el[searchedProperty] !== null && el[searchedProperty] !== '' && typeof el[searchedProperty] !== 'undefined' ) {
                    detector.push(true);
                  }
                }
              } else if ( filterNameToLowerCases.includes('externalgwgstatus') ) {
                searchedProperty = 'gwg_status';
                if ( typeof el[searchedProperty] !== undefined && el[searchedProperty] !== null ) {
                  let arrayOfStatus = el[searchedProperty].split(',');
                  for ( const gwgStatus of arrayOfStatus ) {
                    if ( arrayOfFilters[filterName].includes(parseInt(gwgStatus)) ) {
                      detector.push(true);
                      break;
                    }
                  }
                }

                if ( arrayOfFilters[filterName].includes('check mail send') ) {
                  searchedProperty = 'gwg_send_webform_invitation';
                  if ( typeof el[searchedProperty] !== undefined && el[searchedProperty] !== null ) {
                    let arrayOfStatus = el[searchedProperty].split(',');
                    for ( const gwgSendMail of arrayOfStatus ) {
                      if ( parseInt(gwgSendMail) === 1 ) {
                        detector.push(true);
                        break;
                      }
                    }
                  }
                }
              } else if ( filterNameToLowerCases.includes('internalgwgstatus') ) {
                searchedProperty = 'gwgintern_process';
                if ( arrayOfFilters[filterName].includes(parseInt(el[searchedProperty])) ) {
                  detector.push(true);
                }
              } else if ( filterNameToLowerCases.includes('financestatus') ) {
                searchedProperty = 'finance_process';
                if ( arrayOfFilters[filterName].includes(parseInt(el[searchedProperty])) ) {
                  detector.push(true);
                }
                if ( arrayOfFilters[filterName].includes('check mail send') ) {
                  searchedProperty = 'finance_submitted_webform_invitation';
                  if ( parseInt(el[searchedProperty]) === 1 ) {
                    detector.push(true);
                  }
                }
              } else if ( filterNameToLowerCases.includes('kvstatus') ) {
                searchedProperty = 'kv_process';
                if ( arrayOfFilters[filterName].includes(parseInt(el[searchedProperty])) ) {
                  detector.push(true);
                }
              } else if ( filterNameToLowerCases.includes('salestatus') ) {
                searchedProperty = 'sale_status';
                if ( typeof el[searchedProperty] !== undefined && el[searchedProperty] !== null ) {
                  let arrayOfStatus = el[searchedProperty].split(',');
                  for ( const saleStatus of arrayOfStatus ) {
                    if ( arrayOfFilters[filterName].includes(parseInt(saleStatus)) ) {
                      detector.push(true);
                      break;
                    }
                  }
                }

                if ( arrayOfFilters[filterName].includes('von covivio unterschrieben') ) {
                  searchedProperty = 'kv_signed_by_covivio';
                  if ( typeof el[searchedProperty] !== undefined && el[searchedProperty] !== null && el[searchedProperty] !== '' ) {
                    detector.push(true);
                  }
                }
              }

              // Filter for types
              // if ( filterName === 'type' ) {
              //   if ( arrayOfFilters[Object.keys(arrayOfFilters)].includes('Reservierungen') && el.hasOwnProperty('reservation_id') ){
              //     detector.push(true);
              //   }
              //   if ( arrayOfFilters[Object.keys(arrayOfFilters)].includes('Verkaufsmeldungen') && el.hasOwnProperty('verkaufsmeldung_id') ){
              //     detector.push(true);
              //   }
              // }

            }
          }

          // if ( el.reservation_id === '574' ) {
          //   console.log(detector.length, keyCount);
          // }

          // check if this reservation matched the filters
          if ( detector.length === keyCount ){
            return true;
          }

        });
        if ( newArray.length === 0 ){
          this.apiResponseMessage = 'Keine Reservierung mit ausgewählten Filtern gefunden!';
        } else {
          this.apiResponseMessage = false;
        }

        this.apiResponseFiltered = newArray;

      },
      sortingOption: function() {
        this.apiResponse = this.sortArray(this.apiResponse, this.sortingOption.objectPropToSort,this.sortingOption.order);
        if ( this.apiResponseFiltered.length > 0 ){
          this.apiResponseFiltered = this.sortArray(this.apiResponseFiltered, this.sortingOption.objectPropToSort, this.sortingOption.order);
        }
      },
      searchInput: async function() {
        if ( this.timeout !== null ){
          clearTimeout(this.timeout);
        }

        let searchTerm = this.searchInput.toLowerCase();

        await new Promise(r => this.timeout = setTimeout(r, 2000));

        if ( searchTerm.length >= 1 ){
            if ( this.apiResponseFiltered && this.apiResponseFiltered.length > 0 ) {
              this.searchResults = this.apiResponseFiltered.filter( (t) => (!!(t.client_full_name && t.client_full_name.toLowerCase().includes(searchTerm)) || !!(t.customer_name && t.customer_name.toLowerCase().includes(searchTerm)) || !!(t.client_email && t.client_email.toLowerCase().includes(searchTerm)) || !!(t.customer_kdnr && t.customer_kdnr.toLowerCase().includes(searchTerm)) || !!(t.reservation_id && t.reservation_id.toLowerCase().includes(searchTerm)) || !!(t.estate_nrs && t.estate_nrs.toLowerCase().includes(searchTerm)) ) );
            } else {
              this.searchResults = this.apiResponse.filter( (t) => (!!(t.client_full_name && t.client_full_name.toLowerCase().includes(searchTerm)) || !!(t.customer_name && t.customer_name.toLowerCase().includes(searchTerm)) || !!(t.client_email && t.client_email.toLowerCase().includes(searchTerm)) || !!(t.customer_kdnr && t.customer_kdnr.toLowerCase().includes(searchTerm)) ) || !!(t.reservation_id && t.reservation_id.toLowerCase().includes(searchTerm)) || !!(t.estate_nrs && t.estate_nrs.toLowerCase().includes(searchTerm)) );
            }
            if ( this.searchResults.length === 0 ){
              this.notificationBannerInit('info', 'Suche konnte keine Daten finden');
            }
        } else {
          this.searchResults = [];
        }
      },
      statusFilter: function(newVal) {
        this.filterReservationForStatus(newVal);
      },
    }
  }
</script>

<template>

  <div class="dashboard" @click="closeDropdown" v-if="this.getUserCompany() === 'living' || this.getUserId() === 32 || this.kgAgentsForCockpit.includes(this.getUserMail())">

      <div class="dashboard-header">
        <TopActionBar ref="topActionBar"></TopActionBar>
      </div>

      <div class="dashboard-body">

        <div class="cards" v-if="searchResults && searchResults.length > 0">

          <TransitionGroup name="fadein">

            <Card :singleCardData="value" v-for="(value, key) in searchResults" :key="key" @apiRealEstates="getRealEstatesNr" @favSuccessful="updateReservationBasedOnFavAction" :statusViewChange="statusFilter"></Card>

          </TransitionGroup>

        </div>

        <div class="cards" v-else-if="apiResponseFiltered && apiResponseFiltered.length > 0">

            <TransitionGroup name="fadein">

              <Card :singleCardData="value" v-for="(value, key) in apiResponseFiltered" :key="key" @apiRealEstates="getRealEstatesNr" @favSuccessful="updateReservationBasedOnFavAction" :statusViewChange="statusFilter"></Card>

            </TransitionGroup>

        </div>

        <div class="cards" v-else-if="apiResponseMessage">

          <TransitionGroup name="fadein">

            <AlertMessage :alertText="apiResponseMessage" alertStatus="info"></AlertMessage>

          </TransitionGroup>

        </div>

        <div class="cards" v-else>

          <TransitionGroup name="fadein">

            <Card :singleCardData="value" v-for="(value, key) in apiResponse" :key="key" @apiRealEstates="getRealEstatesNr" @favSuccessful="updateReservationBasedOnFavAction" :statusViewChange="statusFilter"></Card>

          </TransitionGroup>

        </div>

      </div>

  </div>

  <SingleReservationView @deletedReservation="removeCardFromDashboard" @detectCompleteReload="getAllCardData"></SingleReservationView>
  <CreateReservationView @createReservationResponse="getAllCardData"></CreateReservationView>

  <SingleVerkaufsmeldungView @updateVerkaufsmeldungen="getAllCardData"></SingleVerkaufsmeldungView>

  <FilterView></FilterView>

</template>


<style scoped>

.dashboard {
  flex-basis: 100%;
  padding: 10px;
  overflow-x: hidden;
}

.dashboard-body .cards {
  display: flex;
  flex-wrap: wrap;
}

.dashboard-body .cards > div {
  flex-basis: 20%;
  padding: 5px;
}

.dashboard-body .cards > div.remove {
  display: none;
}

@media (max-width: 1600px){
  .dashboard-body .cards > div {
    flex-basis: 25%;
  }
}

@media (max-width: 1300px){
  .dashboard-body .cards > div {
    flex-basis: 33%;
  }
}

@media (max-width: 991px){
  .dashboard-body .cards > div {
    flex-basis: 50%;
  }
}

@media (max-width: 767px){
  .dashboard-body .cards > div {
    flex-basis: 100%;
  }
}

</style>
