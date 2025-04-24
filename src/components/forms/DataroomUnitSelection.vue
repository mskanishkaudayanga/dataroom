<script>
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import InputField from "@/components/forms/InputField.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import axios from "axios";
  import Seperator from "@/components/utility/Seperator.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";

  export default {
    name: "DataroomProjectSelection",
    components: {AnimateCircleIcon, Seperator, Dropdown, InputField, DropdownArrow},
    props: {
      selectedProjectData: {
        type: [Array, Object],
        default: [],
      },
      projectAndUnitDatalist: {
        type: [Array, Object],
        default: [],
      },
      searchCriteriaId: Number,
      searchCriteriaType: {
        type: String,
        default: '',
      },
    },
    emits: ['updateSelectedUnits'],
    data(){
      return {
        filteredProjectData: [],
        matchingRealEstates: {},
        selectedUnits: {},
        isLoading: true,
        selectedStammobjects: [],
      }
    },
    methods: {
      countObjectKeys(object){
        return Object.keys(object).length;
      },
      countSelectedUnits(units){
        let counts = 0;
        for(let key in units){
          if ( units[key].selected ) {
            counts += 1;
          }
        }
        return counts;
      },
      removeOnlyNessesaryProjects(itemData) {

        if ( this.type === 'selected' && itemData.selected ) {
          return true;
        }

        if ( this.type === 'new' && !itemData.selected ) {
          return true;
        }
      },
      getSearchCriteriaMatchingRealEstates() {

        if ( typeof this.searchCriteriaId === 'undefined' || this.searchCriteriaId === null ) {
          return;
        }

        this.isLoading = true;
        axios.get(this.globalApiMicroserviceBaseUrl + '/searchcriteria/' + this.searchCriteriaId + '/compare/real-estates' )
            .then(
                (response) => {
                  if ( response.status === 200 ){
                    this.updateMatchingProjects(response.data);

                    // Convert object values to an array and filter the array
                    const selectedProjectArray = Object.entries(this.selectedProjectData).filter(([key, item]) => typeof item.selected !== 'undefined' && item.selected);
                    for(let index in selectedProjectArray) {
                      let projectName = selectedProjectArray[index][0];
                      if ( this.isStammobjectInDataset(this.selectedProjectData[projectName].nr) ) {
                        // this.selectedStammobjects.push(projectName)
                        // this.addStammobject(projectName);
                      }
                    }

                  }
                }
            )
            .catch(
                (error) => {
                  this.matchingRealEstates = [];
                }
            ).finally(()=>{
              this.isLoading = false;
            })

      },
      updateMatchingProjects(data) {
        this.matchingRealEstates[this.searchCriteriaId] = data;

        // Remove all non matching real estates units from selection
        for (let projectName in this.matchingRealEstates[this.searchCriteriaId]) {
          let allMatchingUnits = [];
          let existingMatchingUnits = this.matchingRealEstates[this.searchCriteriaId][projectName].units;
          for ( let unitIndex in existingMatchingUnits ) {
            allMatchingUnits.push(existingMatchingUnits[unitIndex]['dataset']['nr'])
          }
          this.selectedProjectData[projectName]['nr'] = this.selectedProjectData[projectName]['nr'].filter(
              item => allMatchingUnits.includes(item) && !item.endsWith("WE00")
          );
        }


        this.localSelectedProjectData = this.selectedProjectData;

        const existingProjectNames = Object.keys(this.selectedProjectData);
        let matchingProjectNames = [];

        for (let index in this.matchingRealEstates[this.searchCriteriaId]) {

          matchingProjectNames = Object.keys(this.matchingRealEstates[this.searchCriteriaId]);

          for ( let index in matchingProjectNames ) {
            let projectName = matchingProjectNames[index];

            if ( projectName === '' ) {
              continue;
            }

            this.matchingRealEstates[this.searchCriteriaId][projectName].information_selection_all = false;

            if ( typeof this.localSelectedProjectData[projectName] === 'undefined' ) {
              this.localSelectedProjectData[projectName] = {};
            }

            if ( existingProjectNames.includes(projectName) ) {

              // if project is in current SC than add total count of matching data to it
              this.localSelectedProjectData[projectName].realEstateTotalCount = this.matchingRealEstates[this.searchCriteriaId][projectName].realEstateTotalCount;
            } else {
              // add all matching projects into SC but set to not selected

              if ( typeof this.matchingRealEstates[this.searchCriteriaId][projectName] !== 'undefined' ) {
                let realEstateNrs = this.matchingRealEstates[this.searchCriteriaId][projectName].units.map(function(unit) {
                  return unit.dataset.nr;
                });
                // Setze die Werte direkt in das Objekt
                this.localSelectedProjectData[projectName] = {
                  nr: typeof realEstateNrs === 'undefined' || realEstateNrs === '' ? [] : realEstateNrs,
                  information_selection_all: false,
                  selected: false,
                  realEstateTotalCount: this.matchingRealEstates[this.searchCriteriaId][projectName].realEstateTotalCount
                };
              }

            }

          }

          this.$parent.matchingRealEstates = this.matchingRealEstates;

        }
      },
      getRealEstateData(realEstateNr, key) {
        for( let projectName in this.projectAndUnitDatalist ) {
          for( let realEstates in this.projectAndUnitDatalist[projectName] ) {
            if ( this.projectAndUnitDatalist[projectName][realEstates].dataset.nr === realEstateNr ) {

              if ( key === 'floor' && typeof this.projectAndUnitDatalist[projectName][realEstates].dataset['floor_string'] !== 'undefined' ) {
                return this.projectAndUnitDatalist[projectName][realEstates].dataset['floor_string'];
              }

              if ( key === 'price' ) {
                if( !Number.isInteger(this.projectAndUnitDatalist[projectName][realEstates].dataset[key]) ) {
                  return Math.round(this.projectAndUnitDatalist[projectName][realEstates].dataset[key]);
                }
              }

              return this.projectAndUnitDatalist[projectName][realEstates].dataset[key]
            }
          }
        }
      },
      getFloorMapping(floor) {
        if ( floor > 0 ) {
          return floor + ' OG';
        } else if (floor === 0) {
          return 'HG';
        } else if (floor === -1) {
          return 'EG';
        } else if (floor === -2) {
          return 'ST';
        } else if (floor === -3) {
          return 'UG';
        } else if (floor === -3) {
          return 'KG';
        }

        if ( typeof floor === 'undefined' || floor === null || !floor ) {
          floor = '';
        }

        return floor;
      },
      checkIfIsSpainProject(projectName) {

        if ( typeof this.projectAndUnitDatalist[projectName] === 'undefined' ) {
          return;
        }

        let returnVal = false;
        for(let index in this.projectAndUnitDatalist[projectName]) {
          if(this.projectAndUnitDatalist[projectName][index].dataset.country === 'Spanien') {
            returnVal = true;
            break; // Leave the loop
          }
        }
        return returnVal;
      },
      addStammobject(projectName) {
        const getRealEstatesWithCheckedFloorplans = this.matchingRealEstates[this.searchCriteriaId][projectName].units.filter(item => item.dataset && item.dataset.real_estate_floor_checkbox === true);
        const nrs = getRealEstatesWithCheckedFloorplans.map(obj => obj.dataset.nr);
        const stammobject = this.matchingRealEstates[this.searchCriteriaId][projectName].units.filter(item => item.dataset && this.isStringStammobject(item.dataset.nr));
        if ( typeof stammobject[0] !== 'undefined' ) {
          nrs.push(stammobject[0].dataset.nr)
          this.selectedProjectData[projectName].nr = nrs;
        }
      },
      removeStammobject(projectName) {
        const stammobject = this.matchingRealEstates[this.searchCriteriaId][projectName].units.filter(item => item.dataset && this.isStringStammobject(item.dataset.nr));
        if ( typeof stammobject[0] !== 'undefined' ) {
          const filteredArray = this.selectedProjectData[projectName].nr.filter(item => item !== stammobject[0].dataset.nr);
          this.selectedProjectData[projectName].nr = filteredArray;
        }
      }
    },
    mounted() {
      this.getSearchCriteriaMatchingRealEstates();
    },
    watch: {
      searchCriteriaId: function(newVal, oldVal) {
        this.getSearchCriteriaMatchingRealEstates();
      },
      selectedProjectData: {
        handler: function(newVal, oldVal) {
          this.$emit('updateSelectedUnits', newVal)
        },
        deep:true
      },
      selectedStammobjects: function(newVal, oldVal) {
        // Items added to the array
        const addedItems = newVal.filter(item => !oldVal.includes(item));
        // Items removed from the array
        const removedItems = oldVal.filter(item => !newVal.includes(item));

        if ( !this.isEmpty(addedItems) ) {
          this.addStammobject(addedItems[0]);
        }
        if ( !this.isEmpty(removedItems) ) {
          this.removeStammobject(removedItems[0]);
        }
      }
    }
  }
</script>


<template>

  <div class="loading-screen" v-if="isLoading">
    <AnimateCircleIcon></AnimateCircleIcon>
  </div>

  <div class="selection" v-for="(itemData, projectName) in selectedProjectData" v-if="countObjectKeys(selectedProjectData) > 0 && typeof matchingRealEstates[searchCriteriaId] !== 'undefined'">

    <div v-if="checkIfIsSpainProject(projectName)">
      Für spanische Projekte können keine Einheiten ausgewählt werden.
    </div>
    <div class="field-wrapper" v-else-if="itemData.selected && typeof matchingRealEstates[searchCriteriaId][projectName] !== 'undefined'">
      <seperator>{{projectName}} {{ selectedProjectData[projectName].length }} Einheiten</seperator>

      <div class="units">

        <label :for="projectName.toLocaleLowerCase().replaceAll(' ', '_')+'-selected'">
          <input class="checkbox field" style="margin-right:10px;" type="checkbox" :id="projectName.toLocaleLowerCase().replaceAll(' ', '_')+'-selected'" :name="projectName.toLocaleLowerCase().replaceAll(' ', '_')+'-selected'" :value="projectName" v-model="selectedStammobjects">
          <span class="unit-label">
            <span>Nur Projekte mit Grundriss-Typen</span>
          </span>
        </label>

        <label :for="unitData.dataset.nr.toLocaleLowerCase()+'-selected'" :class="{'hide': unitData.dataset.stammobject, 'inactive': selectedStammobjects.includes(projectName) }" v-for="(unitData) in matchingRealEstates[searchCriteriaId][projectName].units">
          <input class="checkbox field" style="margin-right:10px;" type="checkbox" :id="unitData.dataset.nr.toLocaleLowerCase()+'-selected'" :name="unitData.dataset.nr.toLocaleLowerCase()+'-selected'" :value="unitData.dataset.nr" v-model="selectedProjectData[projectName].nr">
          <span class="unit-label">
            <span class="nr">{{unitData.dataset.nr}}</span>
            <span class="price">{{ this.numberWithComma(getRealEstateData(unitData.dataset.nr, 'price')) }} €</span>
            <span class="seperator">|</span>
            <span class="rooms">{{getRealEstateData(unitData.dataset.nr, 'rooms') }} Zimmer</span>
            <span class="seperator" v-if="!this.isEmpty(this.getFloorMapping( getRealEstateData(unitData.dataset.nr, 'floor') ))">|</span>
            <span class="floor" v-if="!this.isEmpty(this.getFloorMapping( getRealEstateData(unitData.dataset.nr, 'floor') ))">
               {{ this.getFloorMapping( getRealEstateData(unitData.dataset.nr, 'floor') ) }}
            </span>
          </span>
        </label>
      </div>
    </div>

  </div>
</template>


<style scoped>

.field-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.field-wrapper > span {
  display: flex;
}

label {
  cursor: pointer;
}

.project-name {
  color: black
}

.icon-wrapper.search {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.icon-wrapper i {
  font-size: 20px;
  cursor: pointer;
}

input {
  border: 1px solid #DDDEDF;
  border-radius: var(--border-radius);
  font-size: 14px;
  padding: 0 15px;
  width: 100%;
}

input[type="checkbox"],
input.dropdown-input {
  cursor: pointer;
}

::placeholder {
  color: var(--light-gray);
  opacity: 0; /* Firefox */
  font-style: italic;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: var(--light-gray);
  font-style: italic;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: var(--light-gray);
  font-style: italic;
}

input[name="search"] {
  padding-left:40px;
}

input[type="checkbox"] {
  border: solid 2px black;
  height: 20px;
  width: 20px;
  padding: 0;
}

input[type="checkbox"] {
  position: relative;
  top: 5px;
  margin-left: 10px;
}

label {
  color: black;
}

.loading-screen {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-screen .loading-animation {
  margin-left: 0;
  font-size: 40px;
}

.units {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-basis: 100%;
}

.units label {
  display: flex;
  flex-basis: 33%;
}

.hide, .units label.hide {
  display: none;
}

.unit-label > span {
  display: inline-block;
}

.unit-label .nr {
  width: 100%;
}

.unit-label .seperator {
  padding: 0 5px;
}

.inactive {
  opacity: 0.2;
  pointer-events: none;
}

@media (max-width: 767px) {
  .units label {
    flex-basis: 48%;
    margin-bottom: 15px;
  }
}

</style>
