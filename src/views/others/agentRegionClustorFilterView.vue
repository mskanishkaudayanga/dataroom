<script>
import Navigation from "@/components/Navigation.vue";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import ArrowCircleIcon from "../../components/icons/icon-arrow-circle.vue";
import ArrowDownIcon from "../../components/icons/icon-arrow-down.vue";
import ArrowUpIcon from "../../components/icons/icon-arrow-up.vue";
import MapsMarkerIcon from "../../components/icons/icon-maps-marker.vue";
import InputField from "@/components/forms/InputField.vue";
import CloseIcon from "@/components/icons/icon-close.vue";
import SearchIcon from "@/components/icons/icon-search.vue";
import InfoIcon from "@/components/icons/icon-info.vue";
import Button from "@/components/buttons/button.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import MinusIcon from "@/components/icons/icon-minus.vue";
import NavigationsOptionsPage from "@/components/options/NavigationsOptionsPage.vue";
import { userRolesStore } from "@/stores/userRoleStore.js";
import router from "@/router";

export default {
  name: "AgentRegionAssignment",
  components: {
    NavigationsOptionsPage,
    Button,
    InfoIcon,
    SearchIcon,
    CloseIcon,
    InputField,
    MapsMarkerIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowCircleIcon,
    Navigation,
    PlusIcon,
    MinusIcon,
  },
  setup() {
    const API_BASE_URL = "http://staging.kld.azbowsrilanka.com/api";
    const AUTH_URL =
      "https://staging.cockpit.bestplace-living.de/wp-json/v1/auth";

    const isLoading = ref(false);
    const loadingError = ref(null);

    // Active tab
    const activeTab = ref("Agent Assign");
    const showRestorePopup = ref(false);
    const cityToRestore = ref("");
    const cityToRestoreId = ref(null);
    const regionToRestoreFromId = ref(null);
    const targetRegionId = ref(null);
    const showDeletePopup = ref(false);
    const cityToDelete = ref(null);
    const isAdmin = ref(false);

    // Region selection (for both tabs)
    const selectedRegion = ref(null);
    const availableRegions = ref([]);

    // Agent assignment data
    const regionAgentData = ref([]);

    // City assignment data
    const regionCityData = ref([]);

    // Selected cities for UI interaction
    const selectedCities = ref(new Set());

    // Show add popup state
    const showAddPopup = ref(false);
    const currentRegionId = ref(null);
    const newCityName = ref("");

    // Computed properties for easier data access
    const selectedRegionData = computed(() => {
      if (!selectedRegion.value) return null;
      return availableRegions.value.find(
        (region) => region.id === selectedRegion.value.id
      );
    });

    const selectedRegionAgentData = computed(() => {
      if (!selectedRegion.value)
        return { assigned_agents: [], unassigned_agents: [] };
      return (
        regionAgentData.value.find(
          (item) => item.region.id === selectedRegion.value.id
        ) || { assigned_agents: [], unassigned_agents: [] }
      );
    });

    const regionsWithCities = computed(() => {
      const result = {};
      regionCityData.value.forEach((item) => {
        result[item.region.id] = {
          region: item.region,
          assigned_cities: item.assigned_cities || [],
          removed_cities: item.removed_cities || [],
        };
      });
      return result;
    });

    const checkAuthorization = async () => {
      const store = userRolesStore();
      if (store.getUserRoles.includes("administrator")) {
        return true; // Only return true for administrator
      }
      return false; // Return false for all other roles
    };

    // Initialize data on component mount
    onMounted(async () => {
      isAdmin.value = await checkAuthorization();

      // Only proceed with loading data if user is admin
      if (isAdmin.value) {
        await fetchRegionsList();
        if (availableRegions.value.length > 0) {
          selectedRegion.value = availableRegions.value[0];
          await Promise.all([fetchAgentData(), fetchRegionCityData()]);
        }
      } else {
        // Optionally redirect or show access denied message
        loadingError.value =
          "Access denied. Administrator privileges required.";
      }

      await fetchRegionsList();
      if (availableRegions.value.length > 0) {
        selectedRegion.value = availableRegions.value[0];
        await Promise.all([fetchAgentData(), fetchRegionCityData()]);
      }
    });

    // Replace the existing deleteCity function with this improved version
    const deleteCity = async (city) => {
      cityToDelete.value = city;
      showDeletePopup.value = true;
    };

    // Fetch available regions list
    const fetchRegionsList = async () => {
      isLoading.value = true;
      loadingError.value = null;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/v2/bp-regions/getAllRegions`
        );
        if (response.data.status && response.data.data) {
          availableRegions.value = response.data.data;
          if (availableRegions.value.length > 0 && !selectedRegion.value) {
            selectedRegion.value = availableRegions.value[0];
          }
        } else {
          loadingError.value = "Failed to load regions data.";
        }
      } catch (error) {
        console.error("Error fetching regions list:", error);
        loadingError.value = "Failed to load regions. Please try again later.";
      } finally {
        isLoading.value = false;
      }
    };

    const confirmDeleteCity = async () => {
      if (!cityToDelete.value) return;

      const cityId = cityToDelete.value.id;
      isLoading.value = true;

      try {
        // Call the API to delete the city using the correct endpoint
        const response = await axios.get(
          `${API_BASE_URL}/v2/bp-cities/deleteCityById?id=${cityId}`
        );

        // Check if response has message property indicating success
        if (
          response.data &&
          response.data.message === "City deleted successfully"
        ) {
          // If successful, remove the city from UI data structures
          regionCityData.value.forEach((regionData) => {
            // Remove from assigned cities
            regionData.assigned_cities = regionData.assigned_cities.filter(
              (city) => city.id !== cityId
            );

            // Remove from removed cities
            if (regionData.removed_cities) {
              regionData.removed_cities = regionData.removed_cities.filter(
                (city) => city.id !== cityId
              );
            }

            // Remove from unassigned cities
            if (regionData.unassigned_cities) {
              regionData.unassigned_cities =
                regionData.unassigned_cities.filter(
                  (city) => city.id !== cityId
                );
            }
          });

          // Show success message using the message from the API
          alert(response.data.message);
        } else {
          alert("Failed to delete city. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting city:", error);
        alert("An error occurred while deleting the city. Please try again.");
      } finally {
        isLoading.value = false;
        showDeletePopup.value = false;
        cityToDelete.value = null;
      }
    };

    // Add this to handle closing the delete popup
    const closeDeletePopup = () => {
      showDeletePopup.value = false;
      cityToDelete.value = null;
    };

    // Fetch agent data from API
    const fetchAgentData = async () => {
      isLoading.value = true;
      loadingError.value = null;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/v2/bp-regions/getRegionsWithAgents`
        );
        if (response.data.status && response.data.data) {
          regionAgentData.value = response.data.data;
        } else {
          loadingError.value = "Failed to load agent data.";
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
        loadingError.value =
          "Failed to load agent data. Please try again later.";
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch region city data from API
    const fetchRegionCityData = async () => {
      isLoading.value = true;
      loadingError.value = null;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/v2/bp-regions/getRegionsWithCities`
        );
        if (response.data.status && response.data.data) {
          // Process each region individually without mixing up unassigned cities
          regionCityData.value = response.data.data.map((region) => {
            // Make a clean copy to avoid reference issues
            const removedCities = [...(region.removed_cities || [])];

            // Keep unassigned_cities separate (don't merge them into removed_cities)
            return {
              ...region,
              removed_cities: removedCities,
              // Ensure unassigned_cities exists but don't merge them
              unassigned_cities: region.unassigned_cities || [],
            };
          });
        } else {
          loadingError.value = "Failed to load region city data.";
        }
      } catch (error) {
        console.error("Error fetching region city data:", error);
        loadingError.value =
          "Failed to load region data. Please try again later.";
      } finally {
        isLoading.value = false;
      }
    };

    // Switch active tab
    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    // Select region
    const selectRegion = (region) => {
      selectedRegion.value = region;
    };

    // Agent assignments
    const toggleAgentAssignment = (agent) => {
      const regionData = regionAgentData.value.find(
        (item) => item.region.id === selectedRegion.value.id
      );
      if (!regionData) return;

      // Check if agent is in assigned list
      const assignedIndex = regionData.assigned_agents.findIndex(
        (a) => a.id === agent.id
      );
      if (assignedIndex >= 0) {
        // Move from assigned to unassigned
        const agentToMove = regionData.assigned_agents.splice(
          assignedIndex,
          1
        )[0];
        regionData.unassigned_agents.push(agentToMove);
      } else {
        // Check if agent is in unassigned list
        const unassignedIndex = regionData.unassigned_agents.findIndex(
          (a) => a.id === agent.id
        );
        if (unassignedIndex >= 0) {
          // Move from unassigned to assigned
          const agentToMove = regionData.unassigned_agents.splice(
            unassignedIndex,
            1
          )[0];
          regionData.assigned_agents.push(agentToMove);
        }
      }
    };

    const addAllAgents = () => {
      const regionData = regionAgentData.value.find(
        (item) => item.region.id === selectedRegion.value.id
      );
      if (!regionData) return;

      // Move all unassigned agents to assigned
      regionData.assigned_agents = [
        ...regionData.assigned_agents,
        ...regionData.unassigned_agents,
      ];
      regionData.unassigned_agents = [];
    };

    const deduplicatedUnassignedCities = computed(() => {
      const cityMap = new Map();

      // Process all region data
      regionCityData.value.forEach((regionData) => {
        if (
          regionData.unassigned_cities &&
          regionData.unassigned_cities.length > 0
        ) {
          // Only keep the first occurrence of each city ID
          regionData.unassigned_cities.forEach((city) => {
            if (!cityMap.has(city.id)) {
              cityMap.set(city.id, city);
            }
          });
        }
      });

      // Convert map values back to array
      return Array.from(cityMap.values());
    });

    // Computed property for deduplicated removed cities
    const deduplicatedRemovedCities = computed(() => {
      const cityMap = new Map();

      // Process all region data
      regionCityData.value.forEach((regionData) => {
        if (regionData.removed_cities && regionData.removed_cities.length > 0) {
          // Only keep the first occurrence of each city ID
          regionData.removed_cities.forEach((city) => {
            if (!cityMap.has(city.id)) {
              cityMap.set(city.id, {
                ...city,
                sourceRegionId: regionData.region.id, // Keep track of the source region
              });
            }
          });
        }
      });

      // Convert map values back to array
      return Array.from(cityMap.values());
    });

    const removeAllAgents = () => {
      const regionData = regionAgentData.value.find(
        (item) => item.region.id === selectedRegion.value.id
      );
      if (!regionData) return;

      // Move all assigned agents to unassigned
      regionData.unassigned_agents = [
        ...regionData.unassigned_agents,
        ...regionData.assigned_agents,
      ];
      regionData.assigned_agents = [];
    };

    // City management
    const toggleCity = (city) => {
      if (selectedCities.value.has(city.id)) {
        selectedCities.value.delete(city.id);
      } else {
        selectedCities.value.add(city.id);
      }
    };

    const removeCity = (regionId, city, event) => {
      event.stopPropagation();

      const regionData = regionCityData.value.find(
        (item) => item.region.id === regionId
      );
      if (!regionData) return;

      // Ensure removed_cities exists
      if (!regionData.removed_cities) {
        regionData.removed_cities = [];
      }

      // Remove from assigned cities
      const cityIndex = regionData.assigned_cities.findIndex(
        (c) => c.id === city.id
      );
      if (cityIndex >= 0) {
        const removedCity = regionData.assigned_cities.splice(cityIndex, 1)[0];
        regionData.removed_cities.push(removedCity);
      }

      if (selectedCities.value.has(city.id)) {
        selectedCities.value.delete(city.id);
      }
    };

    const restoreCity = (regionId, city) => {
      const regionData = regionCityData.value.find(
        (item) => item.region.id === regionId
      );
      if (!regionData) return;

      // Remove from removed cities
      const removedIndex = regionData.removed_cities.findIndex(
        (c) => c.id === city.id
      );
      if (removedIndex >= 0) {
        const cityToRestore = regionData.removed_cities.splice(
          removedIndex,
          1
        )[0];
        regionData.assigned_cities.push(cityToRestore);
      }
    };

    const openRestorePopup = (regionId, city) => {
      cityToRestore.value = city.display_name;
      cityToRestoreId.value = city.id;
      regionToRestoreFromId.value = regionId;
      targetRegionId.value = null;
      showRestorePopup.value = true;
    };

    const confirmRestore = () => {
      if (
        !targetRegionId.value ||
        !regionToRestoreFromId.value ||
        !cityToRestoreId.value
      ) {
        return;
      }

      const sourceRegion = regionCityData.value.find(
        (item) => item.region.id === regionToRestoreFromId.value
      );
      const targetRegion = regionCityData.value.find(
        (item) => item.region.id === targetRegionId.value
      );

      if (!sourceRegion || !targetRegion) {
        return;
      }

      // First check if the city is in removed_cities
      let cityIndex = sourceRegion.removed_cities.findIndex(
        (c) => c.id === cityToRestoreId.value
      );
      let sourceArray = "removed_cities";

      // If not found in removed_cities, check unassigned_cities
      if (cityIndex === -1) {
        cityIndex = sourceRegion.unassigned_cities.findIndex(
          (c) => c.id === cityToRestoreId.value
        );
        sourceArray = "unassigned_cities";
      }

      if (cityIndex >= 0) {
        // Remove from source region's array (either removed or unassigned)
        const cityToMove = sourceRegion[sourceArray].splice(cityIndex, 1)[0];

        // Add to target region's assigned cities
        targetRegion.assigned_cities.push(cityToMove);
      }

      showRestorePopup.value = false;
    };

    const openAddPopup = (regionId) => {
      showAddPopup.value = true;
      currentRegionId.value = regionId;
      newCityName.value = "";
    };

    const closeAddPopup = () => {
      showAddPopup.value = false;
    };

    const addNewCity = async () => {
      if (newCityName.value.trim() && currentRegionId.value) {
        try {
          // Make API call to create and assign the city
          const response = await axios.post(
            `${API_BASE_URL}/v2/bp-cities/createAndAssignCity`,
            {
              region_id: currentRegionId.value,
              city_name: newCityName.value.trim(),
            }
          );

          // Check if the response is successful
          if (response.data && response.data.status) {
            // Find the region data to update
            const regionData = regionCityData.value.find(
              (item) => item.region.id === currentRegionId.value
            );

            if (regionData) {
              // Add the new city to the assigned_cities array
              const newCity = response.data.data;
              regionData.assigned_cities.push(newCity);
            }

            // Show success message
            alert("City added successfully!");
          } else {
            // Handle error response
            alert("Failed to add city. Please try again.");
          }

          // Close the popup
          closeAddPopup();
        } catch (error) {
          console.error("Error adding new city:", error);
          // Show error message to user
          alert("An error occurred while adding the city. Please try again.");
        }
      }
    };

    const saveAgentChanges = async () => {
      isLoading.value = true;
      loadingError.value = null;

      try {
        // Create an array to store all update promises
        const updatePromises = [];

        // Loop through all regions that have agent data
        for (const regionData of regionAgentData.value) {
          // Create a promise for each region update
          const updatePromise = axios.post(
            `${API_BASE_URL}/v2/bp-regions/updateAgentsForRegion`,
            {
              region_id: regionData.region.id,
              assigned_agents: regionData.assigned_agents,
            }
          );

          // Add the promise to our array
          updatePromises.push(updatePromise);
        }

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        // Show success message
        alert("Agent assignments for all regions saved successfully!");
      } catch (error) {
        console.error("Error saving agent changes:", error);
        loadingError.value =
          "Failed to save agent changes. Please try again later.";
        alert("Failed to save changes. Please try again later.");
      } finally {
        isLoading.value = false;
      }
    };

    const saveCityChanges = async () => {
      isLoading.value = true;
      loadingError.value = null;

      try {
        // Save each region's city assignments
        for (const regionData of regionCityData.value) {
          await axios.post(
            `${API_BASE_URL}/v2/bp-regions/updateCitiesForRegion`,
            {
              region_id: regionData.region.id,
              assigned_cities: regionData.assigned_cities,
            }
          );
        }

        // Show success message
        alert("City assignments saved successfully!");
      } catch (error) {
        console.error("Error saving city changes:", error);
        loadingError.value =
          "Failed to save city changes. Please try again later.";
        alert("Failed to save changes. Please try again later.");
      } finally {
        isLoading.value = false;
      }
    };

    const saveChanges = async () => {
      if (activeTab.value === "Agent Assign") {
        await saveAgentChanges();
      } else if (activeTab.value === "Region Assign") {
        await saveCityChanges();
      }
    };

    return {
      activeTab,
      selectedRegion,
      availableRegions,
      regionAgentData,
      regionCityData,
      selectedCities,
      showAddPopup,
      currentRegionId,
      newCityName,
      isLoading,
      loadingError,
      showRestorePopup,
      cityToRestore,
      targetRegionId,
      selectedRegionAgentData,
      regionsWithCities,
      switchTab,
      selectRegion,
      toggleAgentAssignment,
      addAllAgents,
      removeAllAgents,
      toggleCity,
      removeCity,
      restoreCity,
      openRestorePopup,
      confirmRestore,
      openAddPopup,
      closeAddPopup,
      addNewCity,
      saveChanges,
      fetchAgentData,
      fetchRegionCityData,
      deleteCity,
      showDeletePopup,
      cityToDelete,
      confirmDeleteCity,
      closeDeletePopup,
      deduplicatedUnassignedCities,
      deduplicatedRemovedCities,
      checkAuthorization,
      isAdmin,
    };
  },
};
</script>

<template>
  <Navigation />

  <div v-if="isAdmin" class="main-container">
    <!-- Top navigation tabs -->
    <div class="tabs-container">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'Agent Assign' }"
        @click="switchTab('Agent Assign')"
      >
        Agent Cluster
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'Region Assign' }"
        @click="switchTab('Region Assign')"
      >
        Region Cluster
      </button>
    </div>

    <!-- Agent Assign Tab -->
    <div v-if="activeTab === 'Agent Assign'" class="agent-assign-container">
      <!-- Region Selection -->
      <div class="region-selection">
        <h2>Select Region</h2>
        <div class="region-buttons">
          <button
            v-for="region in availableRegions"
            :key="region.id"
            class="region-button"
            :class="{
              active: selectedRegion && selectedRegion.id === region.id,
            }"
            @click="selectRegion(region)"
          >
            {{ region.display_name }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading data...</p>
      </div>

      <div v-if="loadingError" class="error-message">
        {{ loadingError }}
        <button
          @click="
            activeTab === 'Agent Assign'
              ? fetchAgentData()
              : fetchRegionCityData()
          "
        >
          Try Again
        </button>
      </div>

      <!-- Agent Assignment Areas - Updated Layout -->
      <div class="assignment-container" v-if="selectedRegion">
        <!-- Assigned Agents -->
        <div class="agents-section">
          <h2>Assigned Agents</h2>
          <p class="drop-hint">Drop a user here to mark them as assigned.</p>

          <div class="agents-container assigned-box">
            <div class="agents-grid">
              <button
                v-for="agent in selectedRegionAgentData.assigned_agents"
                :key="`assigned-${agent.id}`"
                class="agent-button auto-width"
                @click="toggleAgentAssignment(agent)"
              >
                {{ agent.agent_name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Middle Transfer Controls -->
        <div class="transfer-controls">
          <button
            class="transfer-button right-to-left"
            @click="removeAllAgents"
            title="Move all to unassigned"
          >
            <!-- Left Arrow SVG -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button
            class="transfer-button left-to-right"
            @click="addAllAgents"
            title="Move all to assigned"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <!-- Right Arrow SVG -->
          </button>
        </div>

        <!-- Unassigned Agents -->
        <div class="agents-section">
          <h2>Unassigned Agents</h2>
          <p class="drop-hint">Drop a user here to mark them as unassigned.</p>

          <div class="agents-container unassigned-box">
            <div class="agents-grid">
              <button
                v-for="agent in selectedRegionAgentData.unassigned_agents"
                :key="`unassigned-${agent.id}`"
                class="agent-button auto-width"
                @click="toggleAgentAssignment(agent)"
              >
                {{ agent.agent_name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <button class="update-button" @click="saveChanges">Update</button>
    </div>

    <!-- Region Assign Tab -->

    <div
      v-else-if="activeTab === 'Region Assign'"
      class="region-assign-container"
    >
      <!-- Dynamic regions with assigned and removed cities -->
      <div
        v-for="regionData in regionCityData"
        :key="regionData.region.id"
        class="region-section"
      >
        <h2>{{ regionData.region.display_name }}</h2>

        <!-- Assigned Cities -->
        <h3>Assigned Cities</h3>
        <div class="city-grid">
          <button
            v-for="city in regionData.assigned_cities"
            :key="city.id"
            class="city-button"
            :class="{ active: selectedCities.has(city.id) }"
            @click="toggleCity(city)"
          >
            <span
              class="minus-icon"
              @click="removeCity(regionData.region.id, city, $event)"
            >
              -
            </span>
            {{ city.display_name }}
          </button>
          <button
            class="add-new-button"
            @click="openAddPopup(regionData.region.id)"
          >
            <span class="plus-icon">+</span>
            Add New
          </button>
        </div>
      </div>

      <div class="removed-cities-section">
        <h2>Removed Cities</h2>
        <div class="city-grid">
          <template v-for="region in regionCityData" :key="region.region.id">
            <template
              v-if="region.removed_cities && region.removed_cities.length > 0"
            >
              <div
                v-for="city in region.removed_cities"
                :key="`removed-${region.region.id}-${city.id}`"
                class="city-item"
              >
                <button
                  class="removed-city-button"
                  @click="openRestorePopup(region.region.id, city)"
                >
                  <span class="plus-icon">+</span>
                  {{ city.display_name }}
                </button>
                <button
                  class="bin-icon"
                  @click="deleteCity(city)"
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                    ></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </template>
          </template>
        </div>

        <div class="unassigned-cities-section">
          <h2>Unassigned Cities</h2>
          <div class="city-grid">
            <!-- Use the deduplicatedUnassignedCities computed property -->
            <div
              v-for="city in deduplicatedUnassignedCities"
              :key="`unassigned-${city.id}`"
              class="city-item"
            >
              <button
                class="removed-city-button unassigned-city"
                @click="openRestorePopup(null, city)"
              >
                <span class="plus-icon">+</span>
                {{ city.display_name }}
              </button>
              <button
                class="bin-icon unassigned-bin-icon"
                @click="deleteCity(city)"
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                  ></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
            <div
              v-if="deduplicatedUnassignedCities.length === 0"
              class="empty-state"
            >
              No unassigned cities available
            </div>
          </div>
        </div>
      </div>

      <!-- Update Button with loading state -->
      <div class="update-button-container">
        <button
          class="update-button"
          @click="saveChanges"
          :disabled="isLoading"
        >
          {{ isLoading ? "Saving..." : "Update" }}
        </button>
      </div>
    </div>

    <!-- Add New City Popup -->
    <div class="popup-overlay" v-if="showAddPopup">
      <div class="popup">
        <div class="popup-header">
          <h3>
            Add New City to
            {{
              availableRegions.find((r) => r.id === currentRegionId)
                ?.display_name
            }}
          </h3>
          <button class="close-button" @click="closeAddPopup">×</button>
        </div>
        <div class="popup-content">
          <label>
            City Name:
            <input
              type="text"
              v-model="newCityName"
              placeholder="Enter city name"
            />
          </label>
        </div>
        <div class="popup-footer">
          <button class="cancel-button" @click="closeAddPopup">Cancel</button>
          <button class="save-button" @click="addNewCity">Save</button>
        </div>
      </div>
    </div>

    <!-- Restore City Region Selection Popup -->
    <div class="popup-overlay" v-if="showRestorePopup">
      <div class="popup">
        <div class="popup-header">
          <h3>Restore "{{ cityToRestore }}" to Region</h3>
          <button class="close-button" @click="showRestorePopup = false">
            ×
          </button>
        </div>
        <div class="popup-content">
          <div class="radio-group">
            <label
              v-for="region in availableRegions"
              :key="region.id"
              class="radio-label"
            >
              <input type="radio" v-model="targetRegionId" :value="region.id" />
              {{ region.display_name }}
            </label>
          </div>
        </div>
        <div class="popup-footer">
          <button class="cancel-button" @click="showRestorePopup = false">
            Cancel
          </button>
          <button
            class="save-button"
            @click="confirmRestore"
            :disabled="!targetRegionId"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="access-denied">
    <h2>Access Denied</h2>
    <p>You need administrator privileges to access this page.</p>
  </div>

  <div class="popup-overlay" v-if="showDeletePopup">
    <div class="popup">
      <div class="popup-header">
        <h3>Confirm Delete</h3>
        <button class="close-button" @click="closeDeletePopup">×</button>
      </div>
      <div class="popup-content">
        <p>
          Are you sure you want to delete "<strong>{{
            cityToDelete ? cityToDelete.display_name : ""
          }}</strong
          >"?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      <div class="popup-footer">
        <button class="cancel-button" @click="closeDeletePopup">Cancel</button>
        <button class="delete-button" @click="confirmDeleteCity">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
}

.tab-button {
  padding: 12px 24px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #3d7bf9;
  cursor: pointer;
  font-size: 16px;
  min-width: 180px;
  transition: all 0.2s ease;
  color: #3d7bf9;
}

.tab-button.active {
  background-color: #3d7bf9;
  color: white;
}

/* Agent Assign Tab Styles */
.agent-assign-container {
  padding: 20px 0;
}

.region-selection {
  margin-bottom: 40px;
}

h2 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.region-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.region-button {
  padding: 16px 24px;
  border-radius: 8px;
  border: 1px solid #3d7bf9;
  background-color: white;
  color: #3d7bf9;
  font-size: 16px;
  cursor: pointer;
  min-width: 100px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.region-button.active {
  background-color: #3d7bf9;
  color: white;
}

.assignment-container {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.transfer-controls {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.transfer-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.transfer-button:hover {
  background-color: #e0e0e0;
  transform: scale(1.1);
}

.transfer-button .icon {
  width: 24px;
  height: 24px;
  color: #3d7bf9;
}

.transfer-button .icon.right {
  transform: rotate(180deg);
}

.transfer-controls {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.agents-section {
  flex: 1;
  width: 45%;
}

.drop-hint {
  color: #888;
  font-size: 14px;
  margin-bottom: 16px;
}

.assigned-box {
  border-color: #3d7bf9;
  background-color: rgba(61, 123, 249, 0.05);
}

.unassigned-box {
  border-color: #ccc;
  background-color: #f9f9f9;
}

.agents-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.agent-button.auto-width {
  width: auto;
  min-width: 100px;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.agent-button.auto-width:hover {
  border-color: #3d7bf9;
  box-shadow: 0 2px 8px rgba(61, 123, 249, 0.2);
}

.agents-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.agent-button {
  padding: 12px 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agent-button.active {
  background-color: #3d7bf9;
  color: white;
  border-color: #3d7bf9;
}

.circular-button {
  display: none;
}

.circular-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-button {
  background-color: #3d7bf9;
  color: white;
}

.add-button {
  background-color: #3d7bf9;
  color: white;
}

.icon {
  font-size: 24px;
  font-weight: bold;
}

/* Region Assign Tab Styles */
.region-assign-container {
  padding: 20px 0;
}

.region-section {
  margin-bottom: 40px;
}

.city-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.city-button {
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: default;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.city-button.active {
  background-color: white;
  color: #333;
  border-color: #ccc;
}

.minus-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background-color: #3d7bf9;
  color: white;
  border-radius: 50%;
  margin-right: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.minus-icon:hover {
  background-color: #2a5cd6;
  transform: scale(1.1);
  box-shadow: 0 0 5px rgba(61, 123, 249, 0.5);
}

.add-new-button {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #3d7bf9;
  background-color: white;
  color: #3d7bf9;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.plus-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #3d7bf9;
  color: white;
  border-radius: 50%;
  margin-right: 8px;
  font-size: 16px;
  font-weight: bold;
}

.removed-cities-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.removed-region {
  margin-bottom: 20px;
}

.removed-region h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #666;
}

.region-section h3 {
  font-size: 16px;
  color: #666;
  margin: 12px 0 8px;
  font-weight: 500;
}

.removed-cities-container {
  margin-top: 24px;
  margin-bottom: 32px;
  padding-top: 8px;
  border-top: 1px dashed #eee;
}

.unassigned-cities-section {
  margin-top: 40px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #ffd79b;
}

.city-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.removed-city-button {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ff6b6b;
  background-color: white;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.removed-city-button .plus-icon {
  background-color: #ff6b6b;
}
.update-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.update-button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background-color: #3d7bf9;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.popup-content {
  padding: 20px;
}

.popup-content label {
  margin-bottom: 8px;
}

.popup-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.cancel-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.save-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #3d7bf9;
  color: white;
  cursor: pointer;
}

.update-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.update-button:hover {
  background-color: #0056b3;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3d7bf9;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 16px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message button {
  background-color: #c62828;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.update-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.unassigned-city {
  border-color: #ff9800;
  color: #ff9800;
}

.unassigned-city .plus-icon {
  background-color: #ff9800;
}

.unassigned-bin-icon {
  background-color: #ff9800;
}

.unassigned-bin-icon:hover {
  background-color: #f57c00;
}

.bin-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  padding: 0;
  outline: none;
  flex-shrink: 0;
}

.bin-icon:hover {
  background-color: #e53935;
  transform: scale(1.1);
}

.bin-icon svg {
  width: 16px;
  height: 16px;
}

.city-item:has(.unassigned-city) .bin-icon {
  background-color: #ff9800;
}

.city-item:has(.unassigned-city) .bin-icon:hover {
  background-color: #f57c00;
}

.region-section h3 {
  font-size: 16px;
  color: #666;
  margin: 12px 0 8px;
  font-weight: 500;
}

.removed-cities-container {
  margin-top: 24px;
  margin-bottom: 32px;
  padding-top: 8px;
  border-top: 1px dashed #eee;
}

.unassigned-cities-section {
  margin-top: 40px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #ffd79b;
}

.city-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.removed-city-button {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ff6b6b;
  background-color: white;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.bin-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  padding: 0;
  outline: none;
  flex-shrink: 0;
}

.bin-icon:hover {
  background-color: #e53935;
  transform: scale(1.1);
}

.bin-icon svg {
  width: 16px;
  height: 16px;
}

/* Enhanced styling for the Removed and Unassigned sections */
.removed-cities-section,
.unassigned-cities-section {
  margin-top: 40px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.removed-cities-section {
  border: 1px solid #ffcdd2;
}

.unassigned-cities-section {
  border: 1px solid #ffd79b;
}

.removed-cities-section h2,
.unassigned-cities-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #555;
  font-size: 22px;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
}

/* Improved city item styling */
.city-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.removed-city-button {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ff6b6b;
  background-color: white;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 12px;
  flex-grow: 1;
  max-width: 200px;
}

.unassigned-city {
  border-color: #ff9800;
  color: #ff9800;
  transition: all 0.2s ease;
}

.empty-state {
  width: 100%;
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border: 1px dashed #ccc;
}

.bin-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  flex-shrink: 0;
}

.bin-icon:hover {
  background-color: #e53935;
  transform: scale(1.1);
  box-shadow: 0 0 5px rgba(229, 57, 53, 0.5);
}

.unassigned-bin-icon {
  background-color: #ff9800;
}

.unassigned-bin-icon:hover {
  box-shadow: 0 0 5px rgba(245, 124, 0, 0.5);
}

/* Make the regions visually distinct */
.region-section {
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e7ff;
}

.region-section h2 {
  color: #3d7bf9;
  margin-top: 0;
}

/* Make the "Add New" button more prominent */
.add-new-button {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #3d7bf9;
  color: #3d7bf9;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.add-new-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(61, 123, 249, 0.2);
}

/* Make the update button more prominent */
.update-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
  position: sticky;
  bottom: 20px;
  z-index: 100;
}

.update-button {
  padding: 14px 28px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(61, 123, 249, 0.3);
  transition: all 0.2s ease;
}

.update-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 123, 249, 0.4);
}

/* Add these styles to the scoped CSS section */

.warning-text {
  color: #f44336;
  font-weight: 500;
  margin-top: 12px;
}

.delete-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #f44336;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.popup {
  animation: popup-fade-in 0.2s ease-out;
}

.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  padding: 20px;
}

.access-denied h2 {
  color: #f44336;
  font-size: 24px;
  margin-bottom: 16px;
}

.access-denied p {
  color: #555;
  font-size: 16px;
  max-width: 500px;
}

@keyframes popup-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
