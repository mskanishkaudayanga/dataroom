<script>
import Navigation from "@/components/Navigation.vue";
import axios from "axios";
import ArrowCircleIcon from "../../components/icons/icon-arrow-circle.vue";
import ArrowDownIcon from "../../components/icons/icon-arrow-down.vue";
import ArrowUpIcon from "../../components/icons/icon-arrow-up.vue";
import MapsMarkerIcon from "../../components/icons/icon-maps-marker.vue";
import InputField from "@/components/forms/InputField.vue";
import CloseIcon from "@/components/icons/icon-close.vue";
import SearchIcon from "@/components/icons/icon-search.vue";
import InfoIcon from "@/components/icons/icon-info.vue";
import Button from "@/components/buttons/button.vue";
import NavigationsOptionsPage from "@/components/options/NavigationsOptionsPage.vue";

export default {
  name: "agentFilter",
  components: {
    NavigationsOptionsPage,
    Button,
    InfoIcon,
    SearchIcon, CloseIcon,
    InputField,
    MapsMarkerIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowCircleIcon,
    Navigation,
  },
  data() {
    return {
      companies: [
          'Living',
          'Kg'
      ],
      selectedAgents: [],
      selectedCompany: 'Living',
      searchQuery: "",
      loading: true,
      agents: [],
    };
  },
  computed: {
    filteredAgents() {
      const inputValue = this.searchQuery.toLowerCase();
      return this.agents.filter(agent =>
          agent.dataset_living.agent_first_name.toLowerCase() === inputValue
      );
    }
  },
  mounted() {
    this.getAllAgents();
  },
  watch: {
    activeCity(newCity, oldCity) {
      if (newCity) {
        this.getAgentsForCity(newCity, this.activeCountry);
      }
    },
    activeCountry(newCountry, oldCountry) {
      if (this.activeCity) {
        this.getAgentsForCity(this.activeCity, newCountry);
      }
    },
  },
  methods: {
    matchesSearch(agent) {
      if (!this.searchQuery) return true; // Show all agents if search query is empty

      let firstName = '';
      let lastName = '';


      if ( agent?.dataset_living !== undefined && !this.isEmpty(agent.dataset_living) && agent.dataset_living?.agent_first_name !== undefined ) {
        firstName = agent.dataset_living?.agent_first_name;
      }
      if ( agent?.dataset_kg !== undefined && !this.isEmpty(agent.dataset_kg) && agent.dataset_kg?.agent_first_name !== undefined ) {
        firstName = agent.dataset_kg?.agent_first_name;
      }

      if ( agent?.dataset_living !== undefined && !this.isEmpty(agent.dataset_living) && agent.dataset_living?.agent_last_name !== undefined ) {
        lastName = agent.dataset_living?.agent_last_name;
      }
      if ( agent?.dataset_kg !== undefined && !this.isEmpty(agent.dataset_kg) && agent.dataset_kg?.agent_last_name !== undefined ) {
        lastName = agent.dataset_kg?.agent_last_name;
      }

      const stringToCheck = firstName + ' ' + lastName;

      return stringToCheck.toLowerCase().includes(this.searchQuery);
    },
    isSelected(agent) {
      return typeof agent.selected_companies !== 'undefined' && agent.selected_companies !== null && agent.selected_companies.includes(this.selectedCompany);
    },
    async getAllAgents() {
      try {
        const requestData = [];
        const response = await axios.post(this.globalApiMicroserviceBaseUrl + "/agent/all", requestData);
        this.agents = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error making request:", error);
      }
    },
    async getAgentsForCity(city, country) {
      this.loading = true;
      let requestData = null;
      try {
        if (city === country) {
          requestData = {
            data: {
              "agent_country": [city],
            }
          };
        } else {
          requestData = {
            data: {
              "agent_city": [city],
            }
          };
        }
        const response = await axios.post(this.globalApiMicroserviceBaseUrl + "/agent/selection", requestData);
        this.selectedAgents = response.data;
        return response.data;
      } catch (error) {
        this.loading = false;
        console.error("Error making request:", error);
      }

    },
    async updateAgent(agent, event) {

      try {
        let isAddAction = event.target.checked; // true for add false for remove

        if ( typeof agent.selected_companies === 'undefined' || agent.selected_companies === null ) {
          agent.selected_companies = [];
        }

        if ( isAddAction ) {
          agent.selected_companies.push(this.selectedCompany);
        } else {
          const index = agent.selected_companies.indexOf(this.selectedCompany);
          if (index > -1) {
            agent.selected_companies.splice(index, 1);
          }
        }

        const sendDataToApi = {
          data: {
            agent_id: agent.id,
            selected_companies: agent.selected_companies
          }
        };

        axios.post(this.globalApiMicroserviceBaseUrl+'/agent/update', sendDataToApi);
      } catch (error) {
        console.log(error);
      }

    },
  },
};
</script>

<template>
  <Navigation/>
  <div class="container">

    <NavigationsOptionsPage></NavigationsOptionsPage>

    <div class="inner-container">
      <div class="countries-wrapper">
        <!-- Country and City Lists -->
        <ul class="countries">
          <!-- Loop through each country -->
          <li v-for="(company) in companies" :key="company">
            <div class="country" @click="selectedCompany = company"
                 :class="{'is-active': selectedCompany === company }">
              {{company}}
            </div>
          </li>
        </ul>
      </div>

      <div class="agent-wrapper" >
        <div class="field-wrapper search">
          <InputField inputName="searchInput" placeholder="Maklersuche..." inputType="text" :inputValue="searchQuery"
                      v-model="searchQuery"></InputField>
          <label class="ph">MAKLERSUCHE...</label>
        </div>
        <div class="agents-display">
          <div v-if="loading" class="loading">Loading...</div>
          <div v-for="agent in agents" :key="agent.id" class="agent" :class="{ hidden: !matchesSearch(agent) }">
            <label>
              <input type="checkbox" class="mark-box" :checked="isSelected(agent)" @change="updateAgent(agent, $event)"/>
              <span v-if="agent.dataset_kg">
                {{ agent.dataset_kg.agent_first_name }} {{agent.dataset_kg.agent_last_name}}
              </span>
              <span v-else>{{ agent.dataset_living.agent_first_name }} {{ agent.dataset_living.agent_last_name }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.hidden {
  display: none !important;
}

.container {
  display: flex;
  flex-wrap: wrap;
}

.inner-container {
  display: flex;
}

.countries-wrapper {
  background-color: #ffffff;
  width: 20vw;
}

.agent-wrapper {
  width: 100%;
}

.loading {
  font-size: 18px;
  color: #4E7DEE;
}

/* Styling the main container */
.countries {
  list-style: none;
  padding: 20px;
  margin: 0;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

/* Country styling */
.country {
  font-weight: bold;
  color: #999999;
  margin-top: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
}

.country:hover {
  text-decoration: none;
}

/* Flag styling */
.flag img {
  width: 20px;
  height: auto;
  margin-right: 5px;
}

/* City container */
.city-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* City name styling */
.city-name {
  cursor: pointer;
  margin-right: 10px;
  color: #999999;
}


.city-name:hover {
  text-decoration: underline;
  text-decoration-color: #007bff; /* Set underline color */
  text-decoration-thickness: 2px; /* Adjust underline thickness */
  text-underline-offset: 2px; /* Adjust underline position */
  color: inherit; /* Ensure text color remains unchanged */
}

.mark-box {
  width: 16px; /* Size of the checkbox */
  height: 16px;
  accent-color: #007bff; /* Change the color of the checkbox */
  cursor: pointer; /* Add a pointer cursor on hover */
  margin-right: 5px;
}


/* Agents display */
/* Agents display */
.agents-display {
  display: flex;
  flex-wrap: wrap;
  padding-right: 25px;
  margin: 50px 0;
}

.agent {
  background-color: #FFFFFF;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-left: 5px;
  cursor: pointer;
}

.agent:hover {
  background-color: #4E7DEF;
  color: white;
}

.agent label {
  display: flex;
  padding: 15px 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-bar input {
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.city-container.is-active .city-name, .country.is-active {
  font-weight: 700;
  color: var(--blue);
}

.field-wrapper.search {
  margin-top: 30px;
  width: 250px;
}

.city-name i {
  margin-right:10px;
}

ul.cities {
  padding-left: 20px;
  padding-top: 10px;
}

.top-navigation {
  padding: 25px;
}

@media (max-width: 1024px) {
  .countries-wrapper {
    flex-basis: 40%
  }
}

@media (max-width: 767px) {
  .countries-wrapper {
    flex-basis: 100%
  }

  .countries-wrapper ul.cities {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
  }

  .agent-wrapper {
    padding: 0 15px;
  }

  .field-wrapper.search {
    width: 100%;
  }
}

</style>
