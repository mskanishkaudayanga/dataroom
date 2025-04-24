<script>
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import InputField from "@/components/forms/InputField.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import axios from "axios";
  import Seperator from "@/components/utility/Seperator.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import AlertIcon from "@/components/icons/icon-warning.vue";
  import ToolTip from "@/components/utility/ToolTip.vue";
  import InfoIcon from "@/components/icons/icon-info.vue";

  export default {
    name: "DataroomProjectSelection",
    components: {InfoIcon, ToolTip, AlertIcon, AnimateCircleIcon, Seperator, Dropdown, InputField, DropdownArrow},
    props: {
      selectedProjectData: {
        type: [Array, Object],
        default: [],
      },
      customerSearchCriteria: {
        type: [Array, Object],
        default: [],
      },
      searchCriteriaId: Number,
      searchCriteriaIds: {
        type: Array,
        default: []
      }
    },
    emits: ['updateSelectedProjects'], // Declare the custom event
    data(){
      return {
        filteredProjectData: [],
        matchingRealEstates: {},
        isUpdateMatchingProjectsProcess: false,
        localSelectedProjectData: [],
        isLoading: true,
        searchCriteriaCountry: 'Deutschland',
        countOfMatchingProjects: 0,
      }
    },
    methods: {
      countObjectKeys(object){
        return Object.keys(object).length;
      },
      countSelectedProjects(object){
        let counts = 0;
        for(let key in object){
          if ( object[key].selected ) {
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
      async getSearchCriteriaMatchingRealEstates() {

        let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriteria);
        this.searchCriteriaCountry = searchCriteriaData.country

        this.isLoading = true;
        if (typeof this.searchCriteriaId === 'undefined' || this.searchCriteriaId === null || typeof this.matchingRealEstates[this.searchCriteriaId] !== 'undefined' || !this.isEmpty(this.matchingRealEstates[this.searchCriteriaId])) {
          this.isLoading = false;
          if (typeof this.matchingRealEstates[this.searchCriteriaId] !== 'undefined') {
              this.updateMatchingProjects(this.matchingRealEstates[this.searchCriteriaId]);
          }

          return;
        }

        // let response = await this.getSearchCriteriaMatchings()
        this.getAllOtherSerchCriteriaMatchings()
        // if ( typeof response !== 'undefined' && typeof response.data !== 'undefined' ) {
        //   console.log('all other test');
        //   this.updateMatchingProjects(response.data);
        // }

      },
      // async getSearchCriteriaMatchings(){
      //
      //   try {
      //     this.isLoading = true;
      //     const response = await axios.get(this.globalApiMicroserviceBaseUrl + '/searchcriteria/' + this.searchCriteriaId + '/compare/real-estates' )
      //     return response;
      //   } catch (error) {
      //     console.log(error);
      //     return {data:[]};
      //   } finally {
      //     this.isLoading = false;
      //   }
      //
      // },
      async getAllOtherSerchCriteriaMatchings() {
        for ( let index in this.searchCriteriaIds ) {
          let searchCriteriaId = this.searchCriteriaIds[index];
          try {
            this.isLoading = true;
            const response = await axios.get(this.globalApiMicroserviceBaseUrl + '/searchcriteria/' + searchCriteriaId + '/compare/real-estates' )
            if ( searchCriteriaId === this.searchCriteriaId ) {
              if ( typeof response !== 'undefined' && typeof response.data !== 'undefined' ) {
                this.updateMatchingProjects(response.data);
              }
            }
            this.$parent.matchingRealEstates[searchCriteriaId] = response.data;
          } catch (error) {
            this.$parent.matchingRealEstates[searchCriteriaId] = {};
            console.log(error);
          }
        }
        this.isLoading = false;
      },
      updateMatchingProjects(data) {

        this.isUpdateMatchingProjectsProcess = true;
        this.matchingRealEstates[this.searchCriteriaId] = data;

        this.localSelectedProjectData = this.selectedProjectData;

        for( let projectName in this.localSelectedProjectData ) {
          if ( typeof this.localSelectedProjectData[projectName].selected === 'undefined' || !this.localSelectedProjectData[projectName].selected ) {
            delete(this.localSelectedProjectData[projectName]);
          }
        }

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
              this.localSelectedProjectData[projectName].matchingRealEstateTotalCount = this.matchingRealEstates[this.searchCriteriaId][projectName].matchingRealEstateTotalCount
            } else {
              // add all matching projects into SC but set to not selected

              if ( typeof this.matchingRealEstates[this.searchCriteriaId][projectName] !== 'undefined' ) {
                let realEstateNrs = this.matchingRealEstates[this.searchCriteriaId][projectName].units.map(function(unit) {
                  return unit.dataset.nr;
                });
                this.localSelectedProjectData = { ...this.localSelectedProjectData, [projectName]: {
                    nr: typeof realEstateNrs === 'undefined' || realEstateNrs === '' ? [] : realEstateNrs,
                    information_selection_all: false,
                    selected: false,
                    realEstateTotalCount: this.matchingRealEstates[this.searchCriteriaId][projectName].realEstateTotalCount,
                    matchingRealEstateTotalCount: this.matchingRealEstates[this.searchCriteriaId][projectName].matchingRealEstateTotalCount
                  }
                };
              }

            }

          }

          let projects = this.localSelectedProjectData
          projects = Object.keys(projects)
              .sort()
              .reduce((result, key) => {
                result[key] = projects[key];
                return result;
              }, {});

          this.localSelectedProjectData = projects;

          this.isLoading = false;

        }
        this.$parent.matchingRealEstates[this.searchCriteriaId] = this.matchingRealEstates[this.searchCriteriaId];
      },
      checkIfProjectGotMatchingRealEstates(projectName) {
        let debug = false;
        if ( debug ) {
          console.log("matchingRealEstates:", this.matchingRealEstates);
        }

        if (!this.matchingRealEstates) {
          if ( debug ) {
            console.log("matchingRealEstates is undefined.");
          }
          return false;
        }

        const searchCriteriaData = this.matchingRealEstates[this.searchCriteriaId];
        if (!searchCriteriaData) {
          if ( debug ) {
            console.log(`No data found for searchCriteriaId "${this.searchCriteriaId}".`);
          }
          return false;
        }

        const projectData = searchCriteriaData[projectName];
        if (!projectData) {
          if ( debug ) {
            console.log(`No data found for projectName "${projectName}" within searchCriteriaId "${this.searchCriteriaId}".`);
          }
          return false;
        }

        const unitsOrNr = projectData.units || projectData.nr;
        if ( debug ) {
          console.log("Units or Nr for projectName:", unitsOrNr);
        }

        if (!unitsOrNr) {
          if ( debug ) {
            console.log(`No units or nr found for projectName "${projectName}".`);
          }
          return false;
        }

        if (Array.isArray(unitsOrNr) && unitsOrNr.length > 0) {
          if ( this.countOfMatchingProjects === 0 ) {
            this.countOfMatchingProjects += 1;
          }
          return true;
        }
        return false;
      },
      countMatchingUnits(itemData) {

        let searchCriteriaData = this.getSearchCriteriaData(this.customerSearchCriteria);

        if ( searchCriteriaData.type === 'Wohnen' ) {
          if ( itemData.realEstateTotalCount === itemData.matchingRealEstateTotalCount ) {
            if ( itemData?.nr !== undefined ) {
              itemData.realEstateTotalCount = Object.keys(itemData.nr).length;
              itemData.matchingRealEstateTotalCount = Object.keys(itemData.nr).length;
            }
          }
        }
        return itemData.matchingRealEstateTotalCount;

      }
    },
    mounted() {
      this.getSearchCriteriaMatchingRealEstates();
    },
    watch: {
      searchCriteriaId: function(newVal, oldVal) {
        this.getSearchCriteriaMatchingRealEstates();
        this.countOfMatchingProjects = 0;
      },
      localSelectedProjectData: {
        handler: function(newVal, oldVal) {
          this.$emit('updateSelectedProjects', newVal, this.searchCriteriaId);
        },
        deep:true
      }
    }
  }
</script>


<template>

  <div class="loading-screen" v-if="isLoading">
    <AnimateCircleIcon></AnimateCircleIcon>
  </div>

  <div class="info-text-missing-projects" v-if="!isLoading && countOfMatchingProjects === 0">
    <span><InfoIcon></InfoIcon></span>
    <span>Optimiere das Suchprofil um weitere Projekte zu finden.</span>
  </div>

  <seperator>Im Suchprofil ausgewählte Projekte</seperator>

  <div class="selection" v-for="(itemData, projectName) in localSelectedProjectData" v-if="countObjectKeys(localSelectedProjectData) > 0">

    <div class="field-wrapper" v-if="itemData.selected" :class="{'not-matching-anymore': !checkIfProjectGotMatchingRealEstates(projectName)}">
      <div class="project-name">

        <label :for="projectName.toLocaleLowerCase()+'-selected'">
          <input class="checkbox field" style="margin-right:10px;" type="checkbox" :id="projectName.toLocaleLowerCase()+'-selected'" :name="projectName.toLocaleLowerCase()+'-selected'" v-model="itemData.selected" checked>
          <span>
            <span>{{projectName}}</span>
            <ToolTip content="Projekt passt nicht mehr zum Suchprofil" hoverText="<AlertIcon>" style="margin-left:5px" v-if="!checkIfProjectGotMatchingRealEstates(projectName)"></ToolTip>
            <span v-else>
              <span v-if="searchCriteriaCountry !== 'Spanien'">({{countMatchingUnits(itemData)}} von {{itemData.realEstateTotalCount}} Einheiten passend)</span>
            </span>
          </span>

        </label>
      </div>
      <span v-if="searchCriteriaCountry !== 'Spanien'">
        <label :for="projectName.toLocaleLowerCase()+'-onlyExpose'" class="radio-wrapper">
          <InputField inputType="radio" :id="projectName.toLocaleLowerCase()+'-onlyExpose'" :inputName="projectName.toLocaleLowerCase()+'-onlyExpose'" value="false" :inputValue="itemData.information_selection_all" v-model="itemData.information_selection_all"></InputField>
          Nur Broschüre / Exposés
        </label>
        <label :for="projectName.toLocaleLowerCase()+'-all'" class="radio-wrapper">
          <InputField inputType="radio" :id="projectName.toLocaleLowerCase()+'-all'" :inputName="projectName.toLocaleLowerCase()+'-all'" value="true" :inputValue="itemData.information_selection_all" v-model="itemData.information_selection_all"></InputField>
          Alle Unterlagen
        </label>
      </span>
    </div>

  </div>

  <seperator>Passende Projekte</seperator>

  <div class="selection" v-for="(itemData, projectName) in localSelectedProjectData" v-if="localSelectedProjectData && countSelectedProjects(localSelectedProjectData) < 5">

    <div class="field-wrapper" v-if="!itemData.selected && checkIfProjectGotMatchingRealEstates(projectName)">
      <div class="project-name">
        <label :for="projectName.toLocaleLowerCase()+'-selected-matches'">
          <input class="checkbox field" style="margin-right:10px;" type="checkbox" :id="projectName.toLocaleLowerCase()+'-selected-matches'" :name="projectName.toLocaleLowerCase()+'-selected-matches'" v-model="localSelectedProjectData[projectName].selected">
          <span>
            <span>{{projectName}}</span>
            <span v-if="searchCriteriaCountry !== 'Spanien'"> ({{ countMatchingUnits(itemData) }} von {{itemData.realEstateTotalCount}} Einheiten passend)</span>
          </span>
        </label>
      </div>
      <span>
        <label :for="projectName.toLocaleLowerCase()+'-onlyExpose-matches'" class="radio-wrapper">
          <InputField inputType="radio" :id="projectName.toLocaleLowerCase()+'-onlyExpose-matches'" :inputName="projectName.toLocaleLowerCase()+'-onlyExpose-matches'" value="false" :inputValue="localSelectedProjectData[projectName].information_selection_all" v-model="localSelectedProjectData[projectName].information_selection_all"></InputField>
          Nur Broschüre / Exposés
        </label>
        <label :for="projectName.toLocaleLowerCase()+'-all-matches'" class="radio-wrapper">
          <InputField inputType="radio" :id="projectName.toLocaleLowerCase()+'-all-matches'" :inputName="projectName.toLocaleLowerCase()+'-all-matches'" value="true" :inputValue="localSelectedProjectData[projectName].information_selection_all" v-model="localSelectedProjectData[projectName].information_selection_all"></InputField>
          Alle Unterlagen
        </label>
      </span>
    </div>

  </div>

    <div v-else>
      <div v-if="countSelectedProjects(localSelectedProjectData) >= 5">
        Maximum von 5 Projekten ausgewählt. Entferne ausgewählte Projekte um neue hinzuzufügen.
      </div>
      <div v-else>
        Aktuell sind keine Projekte für dieses Suchprofil im Datenraum hinterlegt.
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
  color: black;
}

.project-name,
.project-name + span {
  flex-basis: 49%;
}

.project-name + span > label {
  text-align: center;
}

.project-name label {
  display: flex;
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
  background: rgba(255, 255, 255);
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

.not-matching-anymore span,
.not-matching-anymore .tooltip,
.info-text-missing-projects i,  .info-text-missing-projects {
  color: red;
}

.info-text-missing-projects {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  background-color: var(--light-light-gray);
  padding: 10px 15px;
}

.info-text-missing-projects i {
  margin-right: 5px;
}

</style>
