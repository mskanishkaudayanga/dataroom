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
  name: "DataroomProjectSelectionV2",
  components: {
    InfoIcon,
    ToolTip,
    AlertIcon,
    AnimateCircleIcon,
    Seperator,
    Dropdown,
    InputField,
    DropdownArrow,
  },
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
      default: [],
    },
  },
  emits: ["updateSelectedProjects"], // Declare the custom event
  data() {
    return {
      filteredProjectData: [],
      projectImages: {},
      projectDetails: {},
      matchingRealEstates: {},
      isUpdateMatchingProjectsProcess: false,
      localSelectedProjectData: [],
      isLoading: false, // Set to false by default
      searchCriteriaCountry: "Deutschland",
      countOfMatchingProjects: 0,
    };
  },
  created() {
    this.fetchProjectData();
  },

  methods: {
    
    countObjectKeys(object) {
      return Object.keys(object).length;
    },
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Counts the number of projects that are marked as selected within the given object.
     *
     * @param {Object} object - The object containing project data where each key represents
     *                          a project and its value is an object with a 'selected' property.
     * @returns {number} The count of projects that have been selected (i.e., where 'selected' is true).
     */

    /*******  0a492656-cf9e-44de-957f-a71d2eda096d  *******/
    countSelectedProjects(object) {
      let counts = 0;
      for (let key in object) {
        if (object[key].selected) {
          counts += 1;
        }
      }
      return counts;
    },
    removeOnlyNessesaryProjects(itemData) {
      if (this.type === "selected" && itemData.selected) {
        return true;
      }

      if (this.type === "new" && !itemData.selected) {
        return true;
      }
    },
    async getSearchCriteriaMatchingRealEstates() {
      if (
        this.isEmpty(this.searchCriteriaIds) ||
        this.searchCriteriaIds.length === 0
      ) {
        this.isLoading = false;
        return;
      }

      let searchCriteriaData = this.getSearchCriteriaData(
        this.customerSearchCriteria
      );
      if (this.isEmpty(searchCriteriaData)) {
        this.isLoading = false;
        return;
      }

      if (this.$parent.projectImages) {
        this.projectImages = this.$parent.projectImages;
      }
      
      this.searchCriteriaCountry = searchCriteriaData.country;

      this.isLoading = true;
      if (
        typeof this.searchCriteriaId === "undefined" ||
        this.searchCriteriaId === null ||
        typeof this.matchingRealEstates[this.searchCriteriaId] !==
          "undefined" ||
        !this.isEmpty(this.matchingRealEstates[this.searchCriteriaId])
      ) {
        this.isLoading = false;
        if (
          typeof this.matchingRealEstates[this.searchCriteriaId] !== "undefined"
        ) {
          this.updateMatchingProjects(
            this.matchingRealEstates[this.searchCriteriaId]
          );
        }

        return;
      }
      this.getAllOtherSerchCriteriaMatchings();
    },

    async getAllOtherSerchCriteriaMatchings() {
      for (let index in this.searchCriteriaIds) {
        let searchCriteriaId = this.searchCriteriaIds[index];
        try {
          this.isLoading = true;
          const response = await axios.get(
            this.globalApiMicroserviceBaseUrl +
              "/searchcriteria/" +
              searchCriteriaId +
              "/compare/real-estates"
          );
          if (searchCriteriaId === this.searchCriteriaId) {
            if (
              typeof response !== "undefined" &&
              typeof response.data !== "undefined"
            ) {
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

      for (let projectName in this.localSelectedProjectData) {
        if (
          typeof this.localSelectedProjectData[projectName].selected ===
            "undefined" ||
          !this.localSelectedProjectData[projectName].selected
        ) {
          delete this.localSelectedProjectData[projectName];
        }
      }

      const existingProjectNames = Object.keys(this.selectedProjectData);
      let matchingProjectNames = [];

      for (let index in this.matchingRealEstates[this.searchCriteriaId]) {
        matchingProjectNames = Object.keys(
          this.matchingRealEstates[this.searchCriteriaId]
        );

        for (let index in matchingProjectNames) {
          let projectName = matchingProjectNames[index];

          if (projectName === "") {
            continue;
          }

          this.matchingRealEstates[this.searchCriteriaId][
            projectName
          ].information_selection_all = false;

          if (
            typeof this.localSelectedProjectData[projectName] === "undefined"
          ) {
            this.localSelectedProjectData[projectName] = {};
          }

          if (existingProjectNames.includes(projectName)) {
            // if project is in current SC than add total count of matching data to it
            this.localSelectedProjectData[projectName].realEstateTotalCount =
              this.matchingRealEstates[this.searchCriteriaId][
                projectName
              ].realEstateTotalCount;
            this.localSelectedProjectData[
              projectName
            ].matchingRealEstateTotalCount =
              this.matchingRealEstates[this.searchCriteriaId][
                projectName
              ].matchingRealEstateTotalCount;
          } else {
            // add all matching projects into SC but set to not selected

            if (
              typeof this.matchingRealEstates[this.searchCriteriaId][
                projectName
              ] !== "undefined"
            ) {
              let realEstateNrs = this.matchingRealEstates[
                this.searchCriteriaId
              ][projectName].units.map(function (unit) {
                return unit.dataset.nr;
              });
              this.localSelectedProjectData = {
                ...this.localSelectedProjectData,
                [projectName]: {
                  nr:
                    typeof realEstateNrs === "undefined" || realEstateNrs === ""
                      ? []
                      : realEstateNrs,
                  information_selection_all: false,
                  selected: false,
                  realEstateTotalCount:
                    this.matchingRealEstates[this.searchCriteriaId][projectName]
                      .realEstateTotalCount,
                  matchingRealEstateTotalCount:
                    this.matchingRealEstates[this.searchCriteriaId][projectName]
                      .matchingRealEstateTotalCount,
                },
              };
            }
          }
        }

        let projects = this.localSelectedProjectData;
        projects = Object.keys(projects)
          .sort()
          .reduce((result, key) => {
            result[key] = projects[key];
            return result;
          }, {});

        this.localSelectedProjectData = projects;

        this.isLoading = false;
      }
      this.$parent.matchingRealEstates[this.searchCriteriaId] =
        this.matchingRealEstates[this.searchCriteriaId];
    },
    checkIfProjectGotMatchingRealEstates(projectName) {
      let debug = false;
      if (debug) {
        console.log("matchingRealEstates:", this.matchingRealEstates);
      }

      if (!this.matchingRealEstates) {
        if (debug) {
          console.log("matchingRealEstates is undefined.");
        }
        return false;
      }

      const searchCriteriaData =
        this.matchingRealEstates[this.searchCriteriaId];
      if (!searchCriteriaData) {
        if (debug) {
          console.log(
            `No data found for searchCriteriaId "${this.searchCriteriaId}".`
          );
        }
        return false;
      }

      const projectData = searchCriteriaData[projectName];
      if (!projectData) {
        if (debug) {
          console.log(
            `No data found for projectName "${projectName}" within searchCriteriaId "${this.searchCriteriaId}".`
          );
        }
        return false;
      }

      const unitsOrNr = projectData.units || projectData.nr;
      if (debug) {
        console.log("Units or Nr for projectName:", unitsOrNr);
      }

      if (!unitsOrNr) {
        if (debug) {
          console.log(`No units or nr found for projectName "${projectName}".`);
        }
        return false;
      }

      if (Array.isArray(unitsOrNr) && unitsOrNr.length > 0) {
        if (this.countOfMatchingProjects === 0) {
          this.countOfMatchingProjects += 1;
        }
        return true;
      }
      return false;
    },
    countMatchingUnits(itemData) {
      let searchCriteriaData = this.getSearchCriteriaData(
        this.customerSearchCriteria
      );

      if (searchCriteriaData.type === "Wohnen") {
        if (
          itemData.realEstateTotalCount ===
          itemData.matchingRealEstateTotalCount
        ) {
          if (itemData?.nr !== undefined) {
            itemData.realEstateTotalCount = Object.keys(itemData.nr).length;
            itemData.matchingRealEstateTotalCount = Object.keys(
              itemData.nr
            ).length;
          }
        }
      }
      return itemData.matchingRealEstateTotalCount;
    },

    async fetchProjectData() {
      try {
        const response = await fetch('https://ms.p.bestplace.tools/api/realestate/projects');
        const data = await response.json();
        
        // Process the project data
        this.processProjectData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    },
    
    processProjectData(data) {
      // Loop through all projects in the response
      for (const projectName in data) {
        if (data[projectName] && data[projectName].length > 0) {
          // Get the first real estate item for each project
          const firstItem = data[projectName][0];
          
          // Extract image if available
          if (firstItem.dataset && 
              firstItem.dataset.images && 
              firstItem.dataset.images.Foto_gross && 
              firstItem.dataset.images.Foto_gross.length > 0) {
            
            const imagePath = firstItem.dataset.images.Foto_gross[0];
            this.projectImages[projectName] = `https://ms.sc.bestplace.tools${imagePath}`;
          }
          
          // Extract location details
          if (firstItem.dataset) {
            const street = firstItem.dataset.street || '';
            const housenumber = firstItem.dataset.housenumber || '';
            const postalcode = firstItem.dataset.postalcode || '';
            const city = firstItem.dataset.city || '';
            
            // Create location string
            let location = '';
            if (postalcode && city) {
              location = `${postalcode} ${city}`;
            }
            
            // Extract room information if available
            let roomInfo = '';
            if (firstItem.dataset.minRooms && firstItem.dataset.maxRooms) {
              roomInfo = `${firstItem.dataset.minRooms}-${firstItem.dataset.maxRooms} Rooms`;
            }
            
            // Store project details
            this.projectDetails[projectName] = {
              location: location,
              rooms: roomInfo
            };
          }
        }
      }
    }
  },
  mounted() {
    this.getSearchCriteriaMatchingRealEstates();
  },
  watch: {
    searchCriteriaId: function (newVal, oldVal) {
      this.getSearchCriteriaMatchingRealEstates();
      this.countOfMatchingProjects = 0;
    },
    localSelectedProjectData: {
      handler: function (newVal, oldVal) {
        this.$emit("updateSelectedProjects", newVal, this.searchCriteriaId);
      },
      deep: true,
    },
  },
};
</script>

<template>
  <div
    class="loading-screen"
    v-if="
      isLoading && !isEmpty(searchCriteriaIds) && searchCriteriaIds.length > 0
    "
  >
    <AnimateCircleIcon></AnimateCircleIcon>
  </div>

  <div
    v-if="isEmpty(searchCriteriaIds) || searchCriteriaIds.length === 0"
    class="empty-state"
  >
    <p>
      Keine Suchprofile vorhanden. Bitte erstellen Sie zuerst ein Suchprofil.
    </p>
  </div>

  <div
    class="info-text-missing-projects"
    v-if="!isLoading && countOfMatchingProjects === 0"
  >
    <span><InfoIcon></InfoIcon></span>
    <span>Optimiere das Suchprofil um weitere Projekte zu finden.</span>
  </div>

  <seperator>Im Suchprofil ausgewählte Projekte</seperator>

  <div class="project-selection-grid">
    <div
      v-for="(itemData, projectName) in localSelectedProjectData"
      v-if="countObjectKeys(localSelectedProjectData) > 0"
      :key="projectName"
      class="project-card"
      :class="{
        'not-matching-anymore':
          !checkIfProjectGotMatchingRealEstates(projectName),
      }"
    >
      <!-- Project Logo Circle with Initial -->
      <div class="project-logo" v-if="!projectImages[projectName]">
        <div class="logo-circle">{{ projectName.charAt(0) }}</div>
      </div>
      
      <!-- Project Image (if available) -->
      <div class="project-image" v-if="projectImages[projectName]">
        <img 
          :src="projectImages[projectName]" 
          :alt="projectName"
        >
      </div>

      <!-- Project Name and Selection -->
      <div class="project-header">
        <div class="checkbox-container">
          <input
            class="checkbox"
            type="checkbox"
            :id="projectName.toLocaleLowerCase() + '-selected'"
            :name="projectName.toLocaleLowerCase() + '-selected'"
            v-model="itemData.selected"
          />
          <label :for="projectName.toLocaleLowerCase() + '-selected'" class="project-name">
            {{ projectName }}
            <span
              v-if="!checkIfProjectGotMatchingRealEstates(projectName)"
              class="alert-icon"
            >
              <ToolTip
                content="Projekt passt nicht mehr zum Suchprofil"
                hoverText="⚠️"
              ></ToolTip>
            </span>
          </label>
        </div>
      </div>

      <!-- Location Information -->
      <div class="project-location" v-if="projectDetails[projectName] && projectDetails[projectName].location">
        {{ projectDetails[projectName].location }}
      </div>
      
      <!-- Project Stats (Units and Rooms) -->
      <div class="project-stats">
        <div class="stat-item units">
          <span class="stat-icon">📦</span>
          <span class="stat-value">{{ itemData.realEstateTotalCount }} Units</span>
        </div>
        
        <div class="stat-item rooms" v-if="projectDetails[projectName] && projectDetails[projectName].rooms">
          <span class="stat-icon">🚪</span>
          <span class="stat-value">{{ projectDetails[projectName].rooms }}</span>
        </div>
      </div>

      <!-- Matching Units Information -->
      <div class="matching-units-info" v-if="searchCriteriaCountry !== 'Spanien'">
        <div class="matching-units-badge">
          {{ countMatchingUnits(itemData) }} von {{ itemData.realEstateTotalCount }} Einheiten passend
        </div>
      </div>

      <!-- Document Selection Radio Options -->
      <div class="document-options" v-if="searchCriteriaCountry !== 'Spanien'">
        <div class="radio-option">
          <input
            type="radio"
            :id="projectName.toLocaleLowerCase() + '-onlyExpose'"
            :name="projectName.toLocaleLowerCase() + '-docSelection'"
            :value="false"
            v-model="itemData.information_selection_all"
          />
          <label :for="projectName.toLocaleLowerCase() + '-onlyExpose'">
            Nur Broschüre / Exposés
          </label>
        </div>
        
        <div class="radio-option">
          <input
            type="radio"
            :id="projectName.toLocaleLowerCase() + '-all'"
            :name="projectName.toLocaleLowerCase() + '-docSelection'"
            :value="true"
            v-model="itemData.information_selection_all"
          />
          <label :for="projectName.toLocaleLowerCase() + '-all'">
            Alle Unterlagen
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modern Card Layout Styles */
.project-selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.project-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Project Logo/Image Styles */
.project-logo {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.logo-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #555;
}

.project-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Project Header Styles */
.project-header {
  padding: 16px 16px 8px 16px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
}

.checkbox {
  margin-top: 3px;
  margin-right: 10px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

.alert-icon {
  margin-left: 8px;
  color: #f44336;
}

/* Project Location Styles */
.project-location {
  padding: 0 16px 8px 16px;
  color: #757575;
  font-size: 14px;
}

/* Project Stats Styles */
.project-stats {
  display: flex;
  padding: 8px 16px;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 16px;
}

.stat-value {
  font-size: 14px;
  color: #555;
}

/* Matching Units Styles */
.matching-units-info {
  padding: 0 16px 16px 16px;
}

.matching-units-badge {
  display: inline-block;
  padding: 8px 12px;
  background-color: #e3f2fd;
  border-radius: 4px;
  font-size: 14px;
  color: #1976d2;
  width: 100%;
  text-align: center;
}

/* Document Options Styles */
.document-options {
  border-top: 1px solid #eeeeee;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-option input {
  margin: 0;
}

.radio-option label {
  font-size: 14px;
  color: #555;
}

/* Not Matching Card Styles */
.project-card.not-matching-anymore {
  border-color: #ffcdd2;
  background-color: #fff8f8;
}

/* Loading Screen & Info Messages */
.loading-screen {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-text-missing-projects {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 16px;
  color: #f44336;
  gap: 8px;
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #757575;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .project-selection-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .project-selection-grid {
    grid-template-columns: 1fr;
  }
}
</style>