<script>
import axios from "axios";
import Navigation from "@/components/Navigation.vue";
import CreateReservationProgressBar from "@/components/card/CreateReservationProgressBar.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import Seperator from "@/components/utility/Seperator.vue";
import Button from "@/components/buttons/button.vue";
import ErrorView from "@/views/ErrorView.vue";
import SearchCriteriaForm from "@/components/forms/SearchCriteriaFormForDataroomV2.vue";
import SearchIcon from "@/components/icons/icon-search.vue";
import DataroomProjectSelection from "@/components/forms/DataroomProjectSelectionV2.vue";
import DataroomUnitSelection from "@/components/forms/DataroomUnitSelectionV2.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import TextAreaField from "@/components/forms/TextAreaField.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import DeleteIcon from "../../components/icons/icon-delete.vue";
import EditIcon from "@/components/icons/icon-edit.vue";
import InfoIcon from "@/components/icons/icon-info.vue";
import { Tooltip } from "floating-vue";
import ToolTip from "@/components/utility/ToolTip.vue";
import FilesIcon from "@/components/icons/icon-files.vue";
import CloseIcon from "@/components/icons/icon-close.vue";


import berlinImg from '@/assets/images/berlin.png';
import munichImg from '@/assets/images/munich.png';
import frankfurtImg from '@/assets/images/frankfurt.png';

// Import new components
import RegionSelection from "@/components/RegionSelection.vue";

export default {
  name: "newDataRoomToolV2",
  components: {
    // Original components
    CloseIcon,
    FilesIcon,
    ToolTip,
    Tooltip,
    InfoIcon,
    EditIcon,
    DeleteIcon,
    AsterixMarkIcon,
    TextAreaField,
    DropdownArrow,
    PlusIcon,
    SearchCriteriaForm,
    ErrorView,
    Button,
    Seperator,
    Dropdown,
    InputField,
    AnimateCircleIcon,
    CreateReservationProgressBar,
    Navigation,
    SearchIcon,
    CloseIcon,
    FilesIcon,
    ToolTip,
    Tooltip,
    InfoIcon,
    EditIcon,
    DeleteIcon,
    AsterixMarkIcon,
    TextAreaField,
    DropdownArrow,
    PlusIcon,
    DataroomUnitSelection,
    DataroomProjectSelection,
    SearchIcon,
    SearchCriteriaForm,
    ErrorView,
    Button,
    Seperator,
    Dropdown,
    InputField,
    AnimateCircleIcon,
    CreateReservationProgressBar,
    Navigation,

    // New components
    RegionSelection,
  },
  emits: ["finished", "currentStep"],
  props: {
    customerDatas: {
      type: [Array, Object],
      default: {},
    },
    showOnlySearchCriterias: {
      type: Boolean,
      default: false,
    },
    compareSearchCriteria: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    maxSteps: {
      type: Number,
      default: 3,
    },
    // Add defaults for any arrays that might be causing the issue
    someArray: {
      type: Array,
      default: () => [],
    },
    showSearchCriteriaFormFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

      

      currentStep: this.showOnlySearchCriterias ? 2 : 1,
      maxSteps: 3,
      isLoading: false,
      isSearchCriteriaLoading: false,
      activeSearchCriteriaIndex: 0,
      initAddAdditionalInformationsToRealEstatesDone: false,
      isLoadingAttachment: false,
      customerSearchInput: "",
      customerData: {},
      customerDataMicroservice: {},
      cancelTokenCustomerSearch: null,
      company: "kg",
      searchedLivingCustomerFinal: false,
      customerSearchCriterias: [],
      searchCriteriaToSubmit: [],
      searchCriteriaFormsFromApiFetch: [],
      searchCriteriaToMatchFormsFromApiFetch: [],
      deleteSCIndexForSearchCriteriaCompontent: "",
      activeCustomerSearchCriteriaData: [],

      // Original data continues...
      currentUsedSearchCriteriaCombinations: [],
      isNameChangeActive: false,
      searchCriteriaIds: [],
      mergedData: {},
      mergedDataFinished: {},
      matchingRealEstates: [],

      emailPdfExposeResponse: {},
      currentFormStepValid: true,
      currentFormStepErrorMsg: "",
      isEmailSubmitApiResponse: false,
      isEmailSubmitLoading: false,
      jumpToFilteringTool: true,
      foundCustomersList: [],
      dropdownsShow: {
        showCustomerDropdown: false,
        showEmailLanguageDropdown: false,
      },
      automaticSearchCriteriaToolTipText:
        "Dies ist ein automatisches ausgefülltes Suchprofil. Es besteht aus Daten von Immobilien die der Kunde angefragt hat. Es kann nach belieben geändert werden.",
      iframeLoaded: false,
      dropdownContent: {
        emailContent: [
          "Deutsch",
          "Englisch",
          "Französisch",
          "Polnisch",
          "Niederländisch",
          "Spanisch",
        ],
      },
      emailLanguage: "Englisch",
      emailTemplate: "de",
      emailSubject: "Ihre Anfrage bei Best Place",
      emailContent: "",
      emailContentModified: "",
      emailContentFixed: "",
      emailTemplateAPI: "",
      dropdownRelativePosition: false,
      isValidProjectSelection: true,
      typeOfMail: "link",
      validSearchCriterias: {},
      agentActionLogs: [],
      isAgentActionLogsLoding: false,
      showAllAgentActionLogs: false,
      showInformationsOnCustomerDataroom: "agent",
      isSpainUser: false,

      // New data properties for updated UI
      selectedRegions: [],
      showAdvancedFiltering: false,
      projectsLoading: false,
      unitsLoading: false,
      showProjectSelection: false,
      showUnitSelection: false,
      selectedProjectsByCity: {},
      selectedUnits: {},
      showOnlyWithFloorplans: {},
      dataroomUrl: "https://staging.dataroom.bestplace-immobilien.de", // This should come from your environment
      isProjectsLoading: false,
      isUnitsLoading: false,
      projectsLoaded: false,
      unitsLoaded: false,

      // Sample regions and projects data
      regions: [
  { name: "Berlin", image: berlinImg },
  { name: "Munich", image: munichImg },
  { name: "Frankfurt", image: frankfurtImg },
],
      showSearchCriteriaFormFlag: true,
      preloadUnits: true, // Whether to preload units for existing profiles on initial load
      autoLoadProjects: true, // Whether to auto-load projects when switching profiles
      autoLoadUnits: true,
    };
  },
  methods: {
    showSearchCriteriaForm() {
      // Add a new empty search criteria
      this.addSearchCriteria();

      // Set flag to show the form even without existing data
      this.showSearchCriteriaFormFlag = true;

      // Set active index to the new item
      this.activeSearchCriteriaIndex = this.customerSearchCriterias.length - 1;
    },
    getSearchCriteriaActiveProjects() {
      let projects = {};
      if (
        typeof this.customerSearchCriterias[this.activeSearchCriteriaIndex] !==
        "undefined"
      ) {
        const searchCriteria = this.getSearchCriteriaData(
          this.customerSearchCriterias[this.activeSearchCriteriaIndex]
        );
        if (searchCriteria.data?.project_addresses !== undefined) {
          projects = searchCriteria.data.project_addresses;
        }
      }
      return projects;
    },
    getSelectedUnits() {
      let count = 0;
      if (
        typeof this.activeCustomerSearchCriteriaData !== "undefined" &&
        this.activeCustomerSearchCriteriaData.data?.project_addresses !==
          undefined
      ) {
        for (let projectName in this.activeCustomerSearchCriteriaData.data
          .project_addresses) {
          if (
            typeof this.activeCustomerSearchCriteriaData.data.project_addresses[
              projectName
            ].nr !== "undefined" &&
            this.activeCustomerSearchCriteriaData.data.project_addresses[
              projectName
            ].nr.length > 0 &&
            typeof this.activeCustomerSearchCriteriaData.data.project_addresses[
              projectName
            ].selected !== "undefined" &&
            this.activeCustomerSearchCriteriaData.data.project_addresses[
              projectName
            ].selected
          ) {
            // if ( this.isStammobjectInDataset(this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr) ) {
            //   count += this.activeCustomerSearchCriteriaData.data.project_addresses[projectName].nr.length;
            // } else {
            count +=
              this.activeCustomerSearchCriteriaData.data.project_addresses[
                projectName
              ].nr.length;
            // }
          }
        }
      }
      return count;
    },
    getMatchingUnitsCount() {
      let count = 0;
      if (
        typeof this.matchingRealEstates !== "undefined" &&
        typeof this.matchingRealEstates[
          this.activeCustomerSearchCriteriaData.searchCriteriaId
        ] !== "undefined"
      ) {
        for (let projectName in this.activeCustomerSearchCriteriaData.data
          .project_addresses) {
          if (
            typeof this.activeCustomerSearchCriteriaData.data.project_addresses[
              projectName
            ].selected !== "undefined" &&
            this.activeCustomerSearchCriteriaData.data.project_addresses[
              projectName
            ].selected
          ) {
            if (
              typeof this.matchingRealEstates[
                this.activeCustomerSearchCriteriaData.searchCriteriaId
              ][projectName] !== "undefined" &&
              typeof this.matchingRealEstates[
                this.activeCustomerSearchCriteriaData.searchCriteriaId
              ][projectName].units.length !== "undefined"
            )
              count +=
                this.matchingRealEstates[
                  this.activeCustomerSearchCriteriaData.searchCriteriaId
                ][projectName].units.length;
          }
        }
      }
      return count;
    },

    loadRelatedProjects() {
      this.isProjectsLoading = true;
      this.projectsLoaded = false;

      // First, save the search profile
      this.sendSearchCriterias()
        .then((allSuccessfullySubmitted) => {
          if (allSuccessfullySubmitted) {
            // After saving, reload the search criteria to get updated IDs for new profiles
            return this.reloadSearchCriteriaAfterSave();
          } else {
            // throw new Error("Failed to save search profile");
          }
        })
        .then(() => {
          // Now get the active search criteria which should have an ID after saving
          const activeSearchCriteria =
            this.customerSearchCriterias[this.activeSearchCriteriaIndex];

          if (activeSearchCriteria && activeSearchCriteria.id) {
            return axios.get(
              this.globalApiMicroserviceBaseUrl +
                "/searchcriteria/" +
                activeSearchCriteria.id +
                "/compare/real-estates"
            );
          } else {
            throw new Error("No search criteria ID available after saving");
          }
        })
        .then((response) => {
          if (response.status === 200) {
            const activeSearchCriteria =
              this.customerSearchCriterias[this.activeSearchCriteriaIndex];

            this.matchingRealEstates[activeSearchCriteria.id] = response.data;
            this.projectsLoaded = true;
            this.showProjectSelection = true;
            
          }
        })
        .catch((error) => {
          console.log(error);
          
        })
        .finally(() => {
          this.isProjectsLoading = false;
        });
    },

    async reloadSearchCriteriaAfterSave() {
      // Save the active index to restore it after reload
      const activeIndex = this.activeSearchCriteriaIndex;

      // Get fresh search criteria data
      let dataToSend = {
        data: {
          id: this.customerDataMicroservice.id,
        },
      };

      try {
        const response = await axios.post(
          this.globalApiMicroserviceBaseUrl + "/searchcriteria/all",
          dataToSend
        );

        if (response.status === 200) {
          let filteredData = this.filterOnlyImportantSearchCriteria(
            response.data
          );

          // Update the search criteria array with fresh data including new IDs
          this.updateExistingSearchCriteria(filteredData.searchCriterias);

          // Restore the active index
          this.activeSearchCriteriaIndex = Math.min(
            activeIndex,
            this.customerSearchCriterias.length - 1
          );

          // Update active customer search criteria data
          if (this.customerSearchCriterias.length > 0) {
            this.activeCustomerSearchCriteriaData = this.getSearchCriteriaData(
              this.customerSearchCriterias[this.activeSearchCriteriaIndex]
            );
          }

          return true;
        }
        return false;
      } catch (error) {
        console.error("Error reloading search criteria:", error);
        throw error;
      }
    },

    loadUnitsForSelectedProjects() {
      this.isUnitsLoading = true;
      this.unitsLoaded = false;

      // Get all selected projects
      const selectedProjects = this.getActiveSelectedSearchCriteriaProjects();

      if (selectedProjects.length === 0) {
        this.notificationBannerInit(
          "warning",
          "Bitte wählen Sie mindestens ein Projekt aus"
        );
        this.isUnitsLoading = false;
        return;
      }

      let dataToSend = {
        data: {
          project_names: selectedProjects,
          company: this.company,
          filter: { sell_status: ["Verfügbar"] },
        },
      };

      axios
        .post(
          this.globalApiMicroserviceBaseUrl + "/realestate/projects",
          dataToSend
        )
        .then((response) => {
          if (response.status === 200) {
            this.projectAndUnitDatalist = response.data;
            this.unitsLoaded = true;
            this.showUnitSelection = true; // Show unit selection section
            this.notificationBannerInit("success", "Einheiten wurden geladen");
          }
        })
        .catch((error) => {
          console.log(error);
          this.notificationBannerInit(
            "warning",
            "Fehler beim Laden der Einheiten"
          );
        })
        .finally(() => {
          this.isUnitsLoading = false;
        });
    },

    getActiveSelectedSearchCriteriaProjects() {
      let projectNames = [];
      for (let index in this.customerSearchCriterias) {
        let searchCriteria = this.getSearchCriteriaData(
          this.customerSearchCriterias[index]
        );
        if (
          searchCriteria?.data === undefined ||
          searchCriteria.data?.project_addresses === undefined
        ) {
          continue;
        }
        for (let projectName in searchCriteria.data.project_addresses) {
          if (searchCriteria.data.project_addresses[projectName].selected) {
            projectNames.push(projectName);
          }
        }
      }

      return projectNames;
    },

    async preloadProjectsForAllProfiles() {
      // For each search criteria, load its projects if it has an ID
      for (let index in this.customerSearchCriterias) {
        const searchCriteria = this.customerSearchCriterias[index];
        if (searchCriteria.id) {
          try {
            const response = await axios.get(
              this.globalApiMicroserviceBaseUrl +
                "/searchcriteria/" +
                searchCriteria.id +
                "/compare/real-estates"
            );

            if (response.status === 200) {
              if (!this.matchingRealEstates) {
                this.matchingRealEstates = {};
              }
              this.matchingRealEstates[searchCriteria.id] = response.data;

              // Check if this profile has project_addresses
              const searchCriteriaData =
                this.getSearchCriteriaData(searchCriteria);
              if (
                searchCriteriaData?.data?.project_addresses &&
                !this.isEmpty(searchCriteriaData.data.project_addresses)
              ) {
                // This profile has project data, so we can mark projects as loaded
                if (index == this.activeSearchCriteriaIndex) {
                  this.projectsLoaded = true;
                  this.showProjectSelection = true;

                  // If there are selected projects, we could also preload units
                  const hasSelectedProjects = Object.values(
                    searchCriteriaData.data.project_addresses
                  ).some((project) => project.selected);

                  if (hasSelectedProjects && this.preloadUnits) {
                    await this.preloadUnitsForProfile(index);
                  }
                }
              }
            }
          } catch (error) {
            console.log("Error loading projects for profile", index, error);
          }
        }
      }
    },

    // Optional: Helper to preload units if needed
    async preloadUnitsForProfile(profileIndex) {
      const searchCriteria = this.customerSearchCriterias[profileIndex];
      const searchCriteriaData = this.getSearchCriteriaData(searchCriteria);

      // Get selected projects
      let selectedProjects = [];
      if (searchCriteriaData?.data?.project_addresses) {
        for (let projectName in searchCriteriaData.data.project_addresses) {
          if (searchCriteriaData.data.project_addresses[projectName].selected) {
            selectedProjects.push(projectName);
          }
        }
      }

      if (selectedProjects.length > 0) {
        // Only load units for the active profile to avoid too many requests
        if (profileIndex == this.activeSearchCriteriaIndex) {
          let dataToSend = {
            data: {
              project_names: selectedProjects,
              company: this.company,
              filter: { sell_status: ["Verfügbar"] },
            },
          };

          try {
            const response = await axios.post(
              this.globalApiMicroserviceBaseUrl + "/realestate/projects",
              dataToSend
            );

            if (response.status === 200) {
              this.projectAndUnitDatalist = response.data;
              this.unitsLoaded = true;
              this.showUnitSelection = true;
            }
          } catch (error) {
            console.log("Error loading units for profile", profileIndex, error);
          }
        }
      }
    },
    editSearchCriterianame(index) {
      this.isNameChangeActive = index;
    },
    async getExistingSearchCriteria() {
      this.isSearchCriteriaLoading = true;

      // Reset related state before loading new data
      this.projectsLoaded = false;
      this.unitsLoaded = false;
      this.showProjectSelection = false;
      this.showUnitSelection = false;
      this.matchingRealEstates = {};
      this.projectAndUnitDatalist = {};

      let dataToSend = {
        data: {
          id: this.customerDataMicroservice.id,
        },
      };

      try {
        const response = await axios.post(
          this.globalApiMicroserviceBaseUrl + "/searchcriteria/all",
          dataToSend
        );
        if (response.status === 200) {
          let filteredData = this.filterOnlyImportantSearchCriteria(
            response.data
          );

          this.updateExistingSearchCriteria(filteredData.searchCriterias);
          this.searchCriteriaToMatchFormsFromApiFetch =
            filteredData.searchCriteriaToMerge;

          // Initialize active search criteria index if there are search criteria
          if (this.customerSearchCriterias.length > 0) {
            this.activeSearchCriteriaIndex = 0;
            this.activeCustomerSearchCriteriaData = this.getSearchCriteriaData(
              this.customerSearchCriterias[0]
            );

            // NEW: Load projects for all existing search profiles
            this.preloadProjectsForAllProfiles();
          } else {
            this.activeSearchCriteriaIndex = -1;
            this.activeCustomerSearchCriteriaData = {};
            this.showSearchCriteriaFormFlag = true;
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isSearchCriteriaLoading = false;
        this.initialDataLoaded = true; // Mark that initial data has been loaded
      }
    },
    async searchCustomers(dataToSendPredefined = false) {
      // dataToSendPredefined is used only when data comes in from dataroom

      if (!dataToSendPredefined) {
        if (this.isLoading || this.customerSearchInput.length < 3) {
          return;
        }
      }

      this.isLoading = true;

      let dataToSend = {};
      if (!dataToSendPredefined) {
        dataToSend = {
          data: {
            customer_email: this.customerSearchInput,
          },
        };
      } else {
        dataToSend = dataToSendPredefined;
      }

      axios
        .post(
          this.globalApiMicroserviceBaseUrl + "/address/single",
          dataToSend,
          {
            cancelToken: new axios.CancelToken((cancel) => {
              this.cancelTokenCustomerSearch = cancel;
            }),
          }
        )
        .then((response) => {
          if (response.status === 200) {
            this.customerDataMicroservice = response.data;

            if (!dataToSendPredefined) {
              if (!this.isEmpty(response.data)) {
                this.foundCustomersList = response.data;
                this.dropdownsShow.showCustomerDropdown = true;
              } else {
                this.foundCustomersList = [];
                this.dropdownsShow.showCustomerDropdown = false;
              }
            } else {
              // Do this only when data comes in from dataroom
              if (!this.isEmpty(response.data)) {
                this.customerData = response.data;
              }
            }

            this.isLoading = false;
          }
        })
        .catch((error) => {
          this.foundCustomersList = [];
          this.dropdownsShow.showCustomerDropdown = true;

          if (!axios.isCancel(error)) {
            this.isLoading = false;
          }
        });
    },
    updateExistingSearchCriteria(newFetchedSearchCriteria) {
      this.customerSearchCriterias = newFetchedSearchCriteria;
    },
    getAllDataForProjectsUnits() {
      let array = [];
      for (let index in this.customerSearchCriterias) {
        let searchCriteriaData = this.getSearchCriteriaData(
          this.customerSearchCriterias[index]
        );
        if (searchCriteriaData.data?.project_addresses !== undefined) {
          for (let projectName of Object.keys(
            searchCriteriaData.data.project_addresses
          )) {
            array.push(projectName);
          }
        }
      }
      if (!this.isEmpty(array)) {
        this.getProjectUnitsData(array);
      }
    },
    getProjectUnitsData(projectNames) {
      let dataToSend = {
        data: {
          project_names: projectNames,
          company: this.company,
          filter: { sell_status: ["Verfügbar"] },
        },
      };

      axios
        .post(
          this.globalApiMicroserviceBaseUrl + "/realestate/projects",
          dataToSend
        )
        .then((response) => {
          if (response.status === 200) {
            this.projectAndUnitDatalist = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    restartCustomerSearch() {
      if (this.cancelTokenCustomerSearch) {
        this.isLoading = false;
        this.cancelTokenCustomerSearch();
      }
      this.searchCustomers();
    },
    setDropdownTop($event) {
      const eleName = $event.target.name;
      const additionalSpace = 5;
      if (this.$refs["input" + eleName] !== undefined) {
        this.$refs["dropdown" + eleName].$el.style.top =
          this.$refs["input" + eleName].$el.clientHeight +
          additionalSpace +
          "px";
      }
      if (!this.isInViewport(this.$refs["dropdown" + eleName].$el)) {
        this.dropdownRelativePosition = true;
        this.$refs["dropdown" + eleName].$el.style.top = "0px";
      } else {
        this.dropdownRelativePosition = false;
      }
    },
    dropdownClick(field, clickedText) {
      let selectedId = null;
      if (typeof clickedText === "object") {
        let eventObject = clickedText;
        clickedText = eventObject.target.innerText;
        selectedId = parseInt(eventObject.target.dataset.id);
      }

      if (field === "mail") {
        const clickedTextRemovedWhitespace = clickedText.replace(/\s+/g, "");
        const arr = clickedTextRemovedWhitespace.split("|"); // split the string by " | " delimiter
        const clickedMail = arr[0];
        let isAlreadySet = false;
        Object.entries(this.foundCustomersList).forEach(([index, value]) => {
          let dataset = value.dataset;
          if (!isAlreadySet) {
            if (typeof selectedId !== "undefined" && selectedId !== null) {
              if (value.id === selectedId) {
                this.customerData = value;
                this.customerDataMicroservice = value;
                isAlreadySet = true;
              }
            } else if (
              dataset.address_email === clickedMail &&
              dataset.address_phone[0] !== "" &&
              dataset.address_phone[0] === arr[1]
            ) {
              this.customerData = value;
              this.customerDataMicroservice = value;
              isAlreadySet = true;
            }
          }
        });
        this.customerSearchInput = clickedMail;
      } else {
        this.$data[field] = clickedText;
      }
      this.closeDropdowns();
    },
    closeDropdowns() {
      for (const index in this.dropdownsShow) {
        this.dropdownsShow[index] = false;
      }
    },
    async validateStep() {
      this.currentFormStepValid = true;
      if (this.customerData && Object.keys(this.customerData).length > 0) {
        this.currentFormStepValid = true;

        // Reset UI state when moving to step 2 with a new customer
        this.customerSearchCriterias = []; // Clear previous user's search criteria
        this.matchingRealEstates = {}; // Clear previous project matches
        this.activeSearchCriteriaIndex = -1; // Reset active index
        this.projectsLoaded = false; // Reset projects loaded state
        this.unitsLoaded = false; // Reset units loaded state
        this.showProjectSelection = false; // Hide project selection section
        this.showUnitSelection = false; // Hide unit selection section
      } else {
        this.currentFormStepValid = false;
        this.notificationBannerInit("warning", "Bitte Kunden auswählen");
      }

      if (this.typeOfMail === "mail") {
        if (this.isSpainUser) {
          await this.sendSpainDummySearchCriteria();
          this.currentStep = this.maxSteps - 2; // Move to preview
        } else {
          this.currentStep = this.maxSteps - 1; // Move to mails
        }
        return;
      }

      if (this.currentStep === 1 && this.currentFormStepValid) {
        // When entering step 2, immediately load search criteria data if customer is selected
        if (this.customerData && Object.keys(this.customerData).length > 0) {
          await this.getExistingSearchCriteria();
        } else {
          this.customerSearchCriterias = [];
        }
      } else if (this.currentStep === 2) {
        // When entering step 2, immediately load search criteria data if customer is selected
        if (this.customerData && Object.keys(this.customerData).length > 0) {
          await this.getExistingSearchCriteria();
        } else {
          this.customerSearchCriterias = [];
        }
      } else if (this.currentStep === 2) {
        let allFinished = true;
        let mergedSearchCriteriaIds = [];
        if (
          typeof this.mergedData !== "undefined" &&
          Object.keys(this.mergedData).length > 0
        ) {
          for (let index in this.mergedData) {
            let searchCriteriaIdIsValid = true;
            for (let index2 in this.mergedData[index]) {
              if (
                typeof this.mergedData[index][index2].mergeStatus !==
                  "undefined" &&
                this.mergedData[index][index2].mergeStatus === null
              ) {
                allFinished = false;
                searchCriteriaIdIsValid = false;
              }
            }
            if (searchCriteriaIdIsValid) {
              mergedSearchCriteriaIds.push(
                this.mergedData[index].searchCriteriaId
              );
            }
          }
        }

        if (!allFinished) {
          this.notificationBannerInit(
            "warning",
            "Es gibt Kundenwünsche die noch nicht bearbeitet wurde. Überprüfe alle Suchprofile"
          );
          return;
        }

        if (!this.isEmpty(mergedSearchCriteriaIds)) {
          const mergedUpdateAPIResponse =
            await this.sendMergedSearchCriteriasToUpdate(
              mergedSearchCriteriaIds
            );
        }

        const allSuccessfullySubmitted = await this.sendSearchCriterias();

        this.currentFormStepValid = allSuccessfullySubmitted;
        if (allSuccessfullySubmitted) {
          await this.getExistingSearchCriteria();
        }

        if (this.currentStep === 2) {
          if (
            typeof Object.keys(this.searchCriteriaToSubmit).length ===
              "undefined" ||
            Object.keys(this.searchCriteriaToSubmit).length === 0
          ) {
            this.currentFormStepValid = false;
            this.notificationBannerInit("warning", "Kein Suchprofil gefunden");
          }
        }
        if (this.currentStep === 2) {
          let allSearchCriteriaGotProjects = [];
          let isNonMatchingSelectedProjectActive = false;
          for (let index in this.customerSearchCriterias) {
            let status = false;

            let searchCriteriaData = this.getSearchCriteriaData(
              this.customerSearchCriterias[index]
            );
            let searchCriteriaMatchingProjects =
              this.matchingRealEstates[searchCriteriaData.searchCriteriaId];

            if (Object.keys(searchCriteriaMatchingProjects).length === 0) {
              isNonMatchingSelectedProjectActive = true;
            }

            if (
              searchCriteriaData.data?.project_addresses !== undefined &&
              Object.keys(searchCriteriaData.data.project_addresses).length > 0
            ) {
              for (let projectName in searchCriteriaData.data
                .project_addresses) {
                if (
                  searchCriteriaMatchingProjects?.[projectName] === undefined
                ) {
                  isNonMatchingSelectedProjectActive = true;
                }
                if (
                  searchCriteriaData.data.project_addresses[projectName]
                    .selected
                ) {
                  status = true;
                }
              }
            } else {
              status = false;
            }
            allSearchCriteriaGotProjects.push(status);
          }

          if (
            allSearchCriteriaGotProjects.includes(false) ||
            isNonMatchingSelectedProjectActive
          ) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
              "warning",
              "Jedes Suchprofil braucht mind. 1 Projekt"
            );
          }

          if (!this.isValidProjectSelection) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
              "warning",
              "Projekte die nicht mehr passen (rot markiert) müssen abgewählt werden."
            );
          }
        }
        if (this.currentStep === 2) {
          let allSearchCriteriaGotUnits = [];
          for (let index in this.customerSearchCriterias) {
            let status = false;

            let searchCriteriaData = this.getSearchCriteriaData(
              this.customerSearchCriterias[index]
            );
            if (
              searchCriteriaData.data?.project_addresses !== undefined &&
              Object.keys(searchCriteriaData.data.project_addresses).length > 0
            ) {
              for (let projectName in searchCriteriaData.data
                .project_addresses) {
                if (
                  searchCriteriaData.data.project_addresses[projectName]
                    .selected &&
                  searchCriteriaData.data.project_addresses[projectName].nr
                    .length > 0
                ) {
                  status = true;
                }
              }
            } else {
              status = false;
            }
            allSearchCriteriaGotUnits.push(status);
          }
          if (allSearchCriteriaGotUnits.includes(false)) {
            this.currentFormStepValid = false;
            this.notificationBannerInit(
              "warning",
              "Jedes Suchprofil braucht mind. 1 ausgewählte Einheit"
            );
          }
        }
      } else if (this.currentStep === 5) {
        // this.getPdfExpose();
        this.getEmailTemplate();
      }

      if (!this.currentFormStepValid) {
        return;
      }

      if (this.currentStep + 1 === this.maxSteps) {
        // trigger page before last page
        await this.sendEmail();

        this.updateCustomerData();

        if (!this.isEmailSubmitApiResponse) {
          return;
        }
      }

      this.getAllDataForProjectsUnits();

      this.currentStep += 1;
    },
    async saveSearchCriterias() {
      this.isLoading = true;

      const allSuccessfullySubmitted = await this.sendSearchCriterias();

      this.currentFormStepValid = allSuccessfullySubmitted;
      if (allSuccessfullySubmitted) {
        let transformedObject = {};
        if (this.jumpToFilteringTool && this.showOnlySearchCriterias) {
          for (let key in this.searchCriteriaToSubmit[
            this.activeSearchCriteriaIndex
          ]) {
            if (
              this.searchCriteriaToSubmit[
                this.activeSearchCriteriaIndex
              ].hasOwnProperty(key)
            ) {
              transformedObject[key] =
                this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex][
                  key
                ].value;
            }
          }
        }
        this.$emit("finished", {
          status: true,
          jumpToFilter: this.jumpToFilteringTool,
          transformedObject,
        });
      }
    },
    navBack() {
      if (this.currentStep === this.maxSteps) {
        window.location.reload();
      } else {
        if (this.typeOfMail === "mail") {
          this.currentStep = 1;
        } else {
          this.currentStep -= 1;
        }
      }
    },
    addAdditionalInformationsToRealEstates() {
      for (const index in this.customerSearchCriterias) {
        if (!this.isEmpty(this.customerSearchCriterias[index])) {
          let searchCriteriaData = this.getSearchCriteriaData(
            this.customerSearchCriterias[index]
          );
          let projectAddresses =
            this.customerSearchCriterias[index].search_criteria[
              searchCriteriaData.country
            ][searchCriteriaData.city][searchCriteriaData.type][
              "project_addresses"
            ];
          for (const projectName in projectAddresses) {
            if (
              typeof projectAddresses[projectName][
                "information_selection_all"
              ] === "undefined"
            ) {
              projectAddresses[projectName] = {
                ...projectAddresses[projectName],
                information_selection_all: false,
              };
            }
            if (
              typeof projectAddresses[projectName]["selected"] === "undefined"
            ) {
              projectAddresses[projectName] = {
                ...projectAddresses[projectName],
                selected: true,
              };
            }
          }
        }
      }
    },
    prepareSearchCriteriaToSubmit(searchCriteriaIndex) {
      for (let key in this.searchCriteriaToSubmit[searchCriteriaIndex]) {
        if (this.searchCriteriaToSubmit[searchCriteriaIndex][key].required) {
          if (
            this.isEmpty(
              this.searchCriteriaToSubmit[searchCriteriaIndex][key].value
            )
          ) {
            return false;
          }
        }
      }

      let country =
        this.searchCriteriaToSubmit[searchCriteriaIndex].country.value;
      let city = this.searchCriteriaToSubmit[searchCriteriaIndex].city.value;
      let usageType =
        this.searchCriteriaToSubmit[searchCriteriaIndex].usageType.value;

      if (
        this.isEmpty(country) ||
        this.isEmpty(city) ||
        this.isEmpty(usageType)
      ) {
        return false;
      }

      let data = {
        [country]: {
          [city]: {
            [usageType]: {},
          },
        },
      };

      let searchCriteriaData = {};
      let keys = Object.keys(this.searchCriteriaToSubmit[searchCriteriaIndex]);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        let value = this.searchCriteriaToSubmit[searchCriteriaIndex][key].value;
        if (typeof value === "string" && value === "false") {
          value = false;
        } else if (typeof value === "string" && value === "true") {
          value = true;
        }

        if (typeof value === "undefined" || value === null) {
          continue;
        }

        let snakeCaseKey = this.toSnakeCase(key);
        if (snakeCaseKey === "parking_space") {
          snakeCaseKey = "parking_slot";
        }

        if (snakeCaseKey === "pool") {
          snakeCaseKey = "swimmingpool";
        }

        if (snakeCaseKey === "near_golf") {
          snakeCaseKey = "golf";
        }

        if (snakeCaseKey === "real_estate_type") {
          snakeCaseKey = "object_type";
          value =
            value === "Alle" || value === false || value.includes("Alle")
              ? null
              : value;
        }

        if (snakeCaseKey === "rent_status") {
          if (value.includes("Alle")) {
            value = null;
          } else if (value.includes("Bezugsfrei / Bezugsfertig")) {
            // Entferne "Bezugsfrei / Bezugsfertig" aus dem Array
            value = value.filter(
              (item) => item !== "Bezugsfrei / Bezugsfertig"
            );
            // Füge "Bezugsfrei" und "Bezugsfertig" hinzu
            value.push("Bezugsfrei", "Bezugsfertig");
          }
        }

        if (snakeCaseKey === "district" || snakeCaseKey === "local_area") {
          value =
            value === "Alle" || value === false || value.includes("Alle")
              ? [null]
              : value;
        }

        searchCriteriaData[snakeCaseKey] = value;

        if (!searchCriteriaData["rooms"]) {
          searchCriteriaData["rooms"] = {};
        }
        if (snakeCaseKey === "rooms_from") {
          searchCriteriaData["rooms"]["from"] =
            value === "" ? null : parseFloat(parseFloat(value).toFixed(2));
        }
        if (snakeCaseKey === "rooms_to") {
          searchCriteriaData["rooms"]["to"] =
            value === "" ? null : parseFloat(parseFloat(value).toFixed(2));
        }

        if (!searchCriteriaData["bathrooms"]) {
          searchCriteriaData["bathrooms"] = {};
        }
        if (snakeCaseKey === "bath_rooms_from") {
          searchCriteriaData["bathrooms"]["from"] =
            value === "" ? null : parseFloat(parseFloat(value).toFixed(2));
        }
        if (snakeCaseKey === "bath_rooms_to") {
          searchCriteriaData["bathrooms"]["to"] =
            value === "" ? null : parseFloat(parseFloat(value).toFixed(2));
        }

        if (!searchCriteriaData["square_meters"]) {
          searchCriteriaData["square_meters"] = {};
        }
        if (snakeCaseKey === "square_metres_from") {
          searchCriteriaData["square_meters"]["from"] =
            value === "" ? null : parseFloat(parseFloat(value).toFixed(2));
        }
        if (snakeCaseKey === "square_metres_to") {
          searchCriteriaData["square_meters"]["to"] =
            value === "" ? null : parseFloat(parseFloat(value).toFixed(2));
        }

        if (!searchCriteriaData["year_of_construction"]) {
          searchCriteriaData["year_of_construction"] = {};
        }
        if (snakeCaseKey === "year_of_construction") {
          searchCriteriaData[snakeCaseKey] = {
            to: value === "" ? "" : parseFloat(parseFloat(value).toFixed(2)),
          };
        }

        if (!searchCriteriaData["price"]) {
          searchCriteriaData["price"] = {};
        }
        if (snakeCaseKey === "max_budget") {
          if (typeof value === "string") {
            value = value.replaceAll(".", "");
          }
          searchCriteriaData["price"]["to"] = parseFloat(
            parseFloat(value).toFixed(2)
          );
        }
        if (snakeCaseKey === "price_deviation") {
          searchCriteriaData["price"]["price_deviation"] =
            value === "" ? "" : parseFloat(parseFloat(value).toFixed(2));
        }
      }

      let searchCriteriaId = searchCriteriaData.id;
      data[country][city][usageType] =
        this.removeUnwantedKeys(searchCriteriaData);

      return { searchCriteria: data, searchCriteriaId: searchCriteriaId };
    },
    async sendSearchCriterias() {
      let allSuccessfullySubmitted = true;
      this.isSearchCriteriaLoading = true;

      if (
        typeof Object.keys(this.searchCriteriaToSubmit).length ===
          "undefined" ||
        Object.keys(this.searchCriteriaToSubmit).length === 0
      ) {
        // this.notificationBannerInit("warning", "Es ist ein Fehler aufgetreten");
        this.isSearchCriteriaLoading = false;
        return false;
      }

      let dataToSend = { data: [] };

      for (let index in this.searchCriteriaToSubmit) {
        let searchCriteriaData = this.prepareSearchCriteriaToSubmit(index);

        if (!searchCriteriaData) {
          this.notificationBannerInit(
            "warning",
            "Im Suchprofil " +
              (parseInt(index) + 1) +
              " ist ein Fehler aufgetreten"
          );
          this.isSearchCriteriaLoading = false;
          return false;
        }

        let customerAddressId = this.customerDataMicroservice.id;
        let company = this.getUserCompany();

        let dataToSet = {
          address_id: customerAddressId,
          company: company,
          agent_onoffice_id_or_username: this.getUserOoUsername(),
          search_criteria: searchCriteriaData.searchCriteria,
          category: "agent",
        };

        if (!this.isEmpty(this.customerSearchCriterias[index].name)) {
          dataToSet.name = this.customerSearchCriterias[index].name;
        }

        if (
          typeof searchCriteriaData.searchCriteriaId !== "undefined" &&
          searchCriteriaData.searchCriteriaId
        ) {
          dataToSet["search_criteria_id"] = searchCriteriaData.searchCriteriaId;
        }

        // Make sure project_addresses is included in the criteria if available
        if (this.searchCriteriaToSubmit[index].projectAddresses?.value) {
          const countryKey = Object.keys(dataToSet.search_criteria)[0];
          const cityKey = Object.keys(dataToSet.search_criteria[countryKey])[0];
          const typeKey = Object.keys(
            dataToSet.search_criteria[countryKey][cityKey]
          )[0];
          dataToSet.search_criteria[countryKey][cityKey][
            typeKey
          ].project_addresses =
            this.searchCriteriaToSubmit[index].projectAddresses.value;
        }

        dataToSend.data.push(dataToSet);
      }

      try {
        console.log("Sending search criteria with project data:", dataToSend);
        const response = await axios.post(
          this.globalApiMicroserviceBaseUrl + "/searchcriteria/update",
          dataToSend
        );
        if (response.status !== 200) {
          allSuccessfullySubmitted = false;
        }
      } catch (error) {
        allSuccessfullySubmitted = false;
        console.log(error);
      } finally {
        this.isSearchCriteriaLoading = false;
      }

      return allSuccessfullySubmitted;
    },
    async sendSpainDummySearchCriteria() {
      const defaultDummySpainSearchCriteria = {
        Spanien: {
          Alle: {
            Wohnen: {
              city: "",
              golf: false,
              lift: false,
              floor: { to: null, from: null },
              price: { to: null, from: null, price_deviation: null },
              rooms: { to: null, from: null },
              sauna: false,
              county: "",
              loggia: false,
              balcony: false,
              country: "Spanien",
              terrace: false,
              basement: false,
              bedrooms: { to: null, from: null },
              district: [],
              bathrooms: { to: null, from: null },
              free_from: null,
              near_city: false,
              local_area: [],
              ocean_view: false,
              usage_type: "Wohnen",
              object_kind: "",
              object_type: "",
              rent_status: [],
              sell_status: "",
              tram_circle: false,
              spain_region: false,
              swimmingpool: false,
              square_meters: { to: null, from: null },
              winter_garden: false,
              type_of_garden: "",
              project_addresses: {},
              year_of_construction: { to: null, from: null },
              price_per_square_meter: { to: null, from: null },
            },
          },
        },
      };

      let dataToSend = {
        data: [
          {
            address_id: this.customerDataMicroservice.id,
            company: this.company,
            agent_onoffice_id_or_username: this.getUserOoUsername(),
            search_criteria: defaultDummySpainSearchCriteria,
            category: "agent",
          },
        ],
      };

      try {
        const response = await axios.post(
          this.globalApiMicroserviceBaseUrl + "/searchcriteria/update",
          dataToSend
        );
      } catch (error) {
        console.log(error);
      }
    },
    async sendMergedSearchCriteriasToUpdate(ids) {
      let response;

      let dataToSend = {
        data: {
          search_criteria_ids: ids,
        },
      };

      try {
        response = await axios.post(
          this.globalApiMicroserviceBaseUrl + "/searchcriteria/merge/update",
          dataToSend
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.isSearchCriteriaLoading = false;
      }

      return response;
    },
    updateSelectedProjects(projectDataToUpdate, searchCriteriaId) {
      if (this.isEmpty(projectDataToUpdate)) {
        return;
      }

      const allSearchCriterias = this.customerSearchCriterias;
      for (let index in allSearchCriterias) {
        if (allSearchCriterias[index].id === searchCriteriaId) {
          const getSearchCriteriaData = this.getSearchCriteriaData(
            allSearchCriterias[index]
          );
          if (
            getSearchCriteriaData.data?.project_addresses === undefined ||
            this.isEmpty(getSearchCriteriaData.data.project_addresses)
          ) {
            getSearchCriteriaData.data.project_addresses = projectDataToUpdate;
          } else {
            for (let projectName in projectDataToUpdate) {
              if (
                typeof getSearchCriteriaData.data.project_addresses[
                  projectName
                ] !== "undefined"
              ) {
                getSearchCriteriaData.data.project_addresses[projectName] =
                  projectDataToUpdate[projectName];
              } else {
                getSearchCriteriaData.data.project_addresses = {
                  ...getSearchCriteriaData.data.project_addresses,
                  [projectName]: projectDataToUpdate[projectName],
                };
              }
            }
          }

          this.searchCriteriaToSubmit[
            this.activeSearchCriteriaIndex
          ].projectAddresses = {};
          this.searchCriteriaToSubmit[
            this.activeSearchCriteriaIndex
          ].projectAddresses.value =
            getSearchCriteriaData.data.project_addresses;
        }

        this.sendSearchCriterias().then((success) => {
          if (success) {
            
          } else {
            this.notificationBannerInit(
              "warning",
              "Fehler beim Speichern der Projektzuordnung"
            );
          }
        });
      }
    },
    updateSelectedUnits(unitsData) {
      if (
        typeof this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex]
          .projectAddresses === "undefined" ||
        typeof this.searchCriteriaToSubmit[this.activeSearchCriteriaIndex]
          .projectAddresses.value === "undefined"
      ) {
        this.searchCriteriaToSubmit[
          this.activeSearchCriteriaIndex
        ].projectAddresses = {};
      }
      this.searchCriteriaToSubmit[
        this.activeSearchCriteriaIndex
      ].projectAddresses.value = unitsData;
    },

    mapLanguage(data, modifier = "dataToLanguage") {
      const languageMap = {
        DEU: "Deutsch",
        FRA: "Französisch",
        NLD: "Niederländisch",
        POL: "Polnisch",
        ENG: "Englisch",
        ESP: "Spanisch",
      };

      const reverseLanguageMap = {
        Deutsch: "DEU",
        Französisch: "FRA",
        Niederländisch: "NLD",
        Polnisch: "POL",
        Englisch: "ENG",
        Spanisch: "ESP",
      };

      if (modifier === "dataToLanguage") {
        return languageMap[data] || "Englisch";
      }
      if (modifier === "languageToData") {
        return reverseLanguageMap[data] || "";
      }
    },
    updateCustomerData() {
      let dataToSend = {
        client_company: this.customerData.dataset.address_company,
        client_mail: this.customerData.dataset.address_email,
        client_id: this.customerData.dataset.address_id,
        client_language: this.mapLanguage(this.emailLanguage, "languageToData"),
      };

      axios
        .post(this.globalApiBaseUrl + "/onoffice/sendCustomerData", dataToSend)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    },
    getEmailTemplate() {
      let dataToSend = {};

      axios
        .post(
          this.globalApiBaseUrl + "/system/dataroomEmailTemplates",
          dataToSend
        )
        .then((response) => {
          if (response.status === 200) {
            this.emailTemplateAPI = response.data.response;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPdfExpose() {
      let data = [];
      for (let index in this.customerSearchCriterias) {
        let searchCriteriaData = this.getSearchCriteriaData(
          this.customerSearchCriterias[index]
        );
        if (
          searchCriteriaData.data?.project_addresses !== undefined &&
          Object.keys(searchCriteriaData.data.project_addresses).length > 0
        ) {
          for (let projectName in searchCriteriaData.data.project_addresses) {
            if (
              searchCriteriaData.data.project_addresses[projectName].selected &&
              searchCriteriaData.data.project_addresses[projectName].nr.length >
                0
            ) {
              let projectData = {
                project_name: projectName,
                estate_list: [],
              };
              if (typeof projectData[projectName] === "undefined") {
                for (let index in searchCriteriaData.data.project_addresses[
                  projectName
                ].nr) {
                  projectData.estate_list.push({
                    resource_id:
                      searchCriteriaData.data.project_addresses[projectName].nr[
                        index
                      ],
                    selected: true,
                  });
                }
              }
              data.push(projectData);
            }
          }
        }
      }

      let dataToSend = {
        data: {
          projects: data,
          company: this.getUserCompany(),
          agentusername: this.getUserOoUsername(),
        },
      };

      this.isLoadingAttachment = true;

      axios
        .post(
          this.globalApiMicroserviceBaseUrl + "/export/create/expose",
          dataToSend
        )
        .then((response) => {
          if (response.status === 200) {
            this.emailPdfExposeResponse = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoadingAttachment = false;
        });
    },
    async sendEmail() {
      this.isEmailSubmitLoading = true;

      let dataToSend = {
        data: {
          recipient: this.customerData.dataset.address_email,
          fromEmail: this.getUserMail(),
          emailData: {
            subject: this.emailSubject,
            body: this.emailContentModified + this.emailContentFixed,
          },
          projectList: this.getActiveSelectedSearchCriteriaProjects(),
          addressMsId: this.customerData.id,
        },
      };

      if (this.emailPdfExposeResponse?.publicUrl !== undefined) {
        dataToSend.data.attachmentSource = this.emailPdfExposeResponse.url;
      }

      try {
        const response = await axios.post(
          this.globalApiMicroserviceBaseUrl + "/mail/send",
          dataToSend
        );
        this.isEmailSubmitApiResponse = response.status === 200;
        this.$emit("finished", true);
        if (response.status !== 200) {
          this.notificationBannerInit(
            "warning",
            "E-Mail konnte nicht versendet werden"
          );
        }
      } catch (error) {
        console.log(error);
        this.isEmailSubmitApiResponse = false;
      } finally {
        this.isEmailSubmitLoading = false;
      }
    },
    renderEmailTemplate() {
      if (
        typeof this.emailLanguage !== "undefined" &&
        !this.isEmpty(this.emailTemplateAPI)
      ) {
        let template =
          this.emailTemplateAPI[this.emailTemplate][
            this.mapLanguage(this.emailLanguage, "languageToData")
          ];

        if (template.includes("{{link_to_dataroom_start}}")) {
          template = template.replaceAll(
            "{{link_to_dataroom_start}}",
            '<a href="' + this.iFrameUrl + '" target="_blank">'
          );
        }

        if (template.includes("{{link_to_dataroom_end}}")) {
          template = template.replaceAll("{{link_to_dataroom_end}}", "</a>");
        }

        if (this.typeOfMail !== "link" && !this.isSpainUser) {
          template = template.replace(
            /<p>{{show_when_is_datenraum_link_start}}.*?{{show_when_is_datenraum_link_end}}<\/p>/s,
            ""
          );
        } else {
          if (template.includes("{{show_when_is_datenraum_link_start}}")) {
            template = template.replaceAll(
              "{{show_when_is_datenraum_link_start}}",
              ""
            );
          }
          if (template.includes("{{show_when_is_datenraum_link_end}}")) {
            template = template.replaceAll(
              "{{show_when_is_datenraum_link_end}}",
              ""
            );
          }
        }

        this.emailContentFixed = template;
      }

      if (this.emailLanguage === "Deutsch") {
        this.emailSubject = "Ihre Anfrage bei Best Place";
      } else if (this.emailLanguage === "Polnisch") {
        this.emailSubject = "Twoje zapytanie do Best Place";
      } else if (this.emailLanguage === "Französisch") {
        this.emailSubject = "Votre demande à Best Place";
      } else if (this.emailLanguage === "Niederländisch") {
        this.emailSubject = "Uw vraag bij Best Place";
      } else if (this.emailLanguage === "Spanisch") {
        this.emailSubject = "Su consulta a Best Place";
      } else {
        this.emailSubject = "Your enquiry with Best Place";
      }
    },
    addBreaksToTextareaString() {
      this.emailContentModified = this.emailContent.replace(/\n/g, "<br>");
    },
    deleteSearchCriteria(index) {
      let response = confirm("Suchprofil wirklich löschen?");
      if (response !== true) {
        return;
      }

      if (
        typeof this.customerSearchCriterias[index] !== "undefined" &&
        typeof this.customerSearchCriterias[index].id !== "undefined"
      ) {
        axios
          .delete(
            this.globalApiMicroserviceBaseUrl +
              "/searchcriteria/" +
              this.customerSearchCriterias[index].id
          )
          .then((response) => {
            if (response.status === 200) {
              this.notificationBannerInit("success", "Erfolgreich gelöscht");

              if (typeof this.customerSearchCriterias[index] !== "undefined") {
                this.customerSearchCriterias.splice(index, 1);
              }

              this.deleteSCIndexForSearchCriteriaCompontent = index;

              // Reset all related data if this was the last search criteria
              if (this.customerSearchCriterias.length === 0) {
                this.activeSearchCriteriaIndex = -1; // Set to invalid index to hide components
                this.activeCustomerSearchCriteriaData = {}; // Clear active data
                this.matchingRealEstates = []; // Clear matching real estates
                this.projectAndUnitDatalist = {}; // Clear project/unit data
                // Reset any other relevant state
                this.projectsLoaded = false;
                this.unitsLoaded = false;
              } else {
                // Set appropriate index if not the last criteria
                this.activeSearchCriteriaIndex =
                  this.customerSearchCriterias.length > 0 ? 0 : -1;
              }

              this.triggerSearchCriteriaDeleteProcess = this.makeid(20);
            } else {
              this.notificationBannerInit(
                "warning",
                "Konnte nicht gelöscht werden"
              );
            }
          })
          .catch((error) => {
            this.notificationBannerInit(
              "warning",
              "Konnte nicht gelöscht werden Fehlermeldung:" +
                error.response.data.message
            );
          });
      } else {
        // Handle local deletion (no API call)
        if (typeof this.customerSearchCriterias[index] !== "undefined") {
          // Remove the item
          this.customerSearchCriterias.splice(index, 1);

          // Reset all related data if this was the last search criteria
          if (this.customerSearchCriterias.length === 0) {
            this.activeSearchCriteriaIndex = -1; // Set to invalid index to hide components
            this.activeCustomerSearchCriteriaData = {}; // Clear active data
            this.matchingRealEstates = []; // Clear matching real estates
            this.projectAndUnitDatalist = {}; // Clear project/unit data
            // Reset any other relevant state
            this.projectsLoaded = false;
            this.unitsLoaded = false;
          } else {
            // Set appropriate index if there are remaining criteria
            this.activeSearchCriteriaIndex = Math.min(
              index,
              this.customerSearchCriterias.length - 1
            );
          }

          this.deleteSCIndexForSearchCriteriaCompontent = index;
          this.triggerSearchCriteriaDeleteProcess = this.makeid(20);
        }
      }
    },
    addSearchCriteria() {
      this.triggerSearchCriteriaAddProcess = this.makeid(20);

      // Create a fresh search criteria object
      const newSearchCriteria = {
        name: `Suchprofil ${this.customerSearchCriterias.length + 1}`,
        search_criteria: {},
        category: "agent",
      };

      // Add it to the array
      this.customerSearchCriterias.push(newSearchCriteria);

      // Set this as the active profile
      this.activeSearchCriteriaIndex = this.customerSearchCriterias.length - 1;

      // Clear any existing project/unit data for this new profile
      this.projectsLoaded = false;
      this.unitsLoaded = false;
      this.showProjectSelection = false;
      this.showUnitSelection = false;

      // Clear matching real estates for this profile to avoid carryover
      if (this.matchingRealEstates) {
        // We don't have an ID yet for the new profile, so we'll rely on clearing
        // the display state instead
        this.matchingRealEstates = {};
      }

      this.showSearchCriteriaFormFlag = true; // Show the form
    },
    handleIframeBubbleEvent() {
      const vm = this;
      window.addEventListener("message", function (event) {
        if (event.data === "dataroomLoaded") {
          vm.iframeLoaded = true;
        }
      });
    },

    countSelectedProjects() {
      let count = 0;
      for (let index in this.customerSearchCriterias) {
        let searchCriteria = this.getSearchCriteriaData(
          this.customerSearchCriterias[index]
        );
        if (
          searchCriteria?.data === undefined ||
          searchCriteria.data?.project_addresses === undefined
        ) {
          continue;
        }
        for (let projectName in searchCriteria.data.project_addresses) {
          if (searchCriteria.data.project_addresses[projectName].selected) {
            count++;
          }
        }
      }
      return count;
    },
    handleDeleteAttachment() {
      let response = confirm("Anhang wirklich löschen?");
      if (response !== true) {
        return;
      }
      this.emailPdfExposeResponse = {};
    },
    isUserSpainCustomer() {
      const userEmail = this.getUserMail();
      this.isSpainUser = this.spainAgents.includes(userEmail);

      if (this.isSpainUser) {
        this.typeOfMail = "mail";
      }
    },
  },
  computed: {
    iFrameUrl() {
      let template = "mixed-project-new";
      if (this.isSpainUser) {
        template = "mixed-project-spain";
      }

      return (
        this.dataroomUrl +
        "/" +
        template +
        "/?token=" +
        this.customerDataMicroservice.static_identifier_token
      );
    },
  },
  watch: {
    activeSC: function (newVal) {
      for (let index in this.dropdowns) {
        this.dropdowns[index] = false;
      }

      if (typeof this.searchCriteria[newVal] === "undefined") {
        this.searchCriteria[newVal] = this.defaultSearchCriteriaData();
      }

      // Reset project display when switching profiles
      this.$parent.showProjectSelection = false;
      this.$parent.showUnitSelection = false;

      // Only show projects if this profile has them loaded
      if (
        this.customerSearchCriterias[newVal] &&
        this.getSearchCriteriaData(this.customerSearchCriterias[newVal]).data
          ?.project_addresses &&
        !this.isEmpty(
          this.getSearchCriteriaData(this.customerSearchCriterias[newVal]).data
            .project_addresses
        )
      ) {
        this.$parent.showProjectSelection = true;
      }

      this.updateSearchCriteria();
    },

    triggerAddSCProcess: function (newVal) {
      // Add a fresh search criteria object with default values
      this.addSearchCriteria();

      // Reset any project-related data
      if (this.searchCriteria[this.activeSC]) {
        this.searchCriteria[this.activeSC].projectAddresses = { value: {} };
      }
    },
    localSelectedProjectData: {
      handler: function (newVal, oldVal) {
        this.$emit("updateSelectedProjects", newVal, this.searchCriteriaId);
      },
      deep: true,
    },
    selectedProjectData: {
      handler: function (newVal, oldVal) {
        this.$emit("updateSelectedUnits", newVal);
      },
      deep: true,
    },

    customerSearchCriterias: {
      handler: function (val, oldVal) {
        this.searchCriteriaIds = [];
        if (!this.initAddAdditionalInformationsToRealEstatesDone) {
          this.addAdditionalInformationsToRealEstates();
          this.initAddAdditionalInformationsToRealEstatesDone = true;
        }

        if (
          !this.isEmpty(
            this.customerSearchCriterias[this.activeSearchCriteriaIndex]
          )
        ) {
          this.activeCustomerSearchCriteriaData = this.getSearchCriteriaData(
            this.customerSearchCriterias[this.activeSearchCriteriaIndex]
          );
        }
        for (let index in val) {
          if (!this.searchCriteriaIds.includes(val[index].id)) {
            this.searchCriteriaIds.push(val[index].id);
          }
        }
      },
      deep: true,
    },
    searchCriteriaToSubmit: {
      handler: function (val, oldVal) {
        let currentUsedSearchCriteriaCombinations = {};

        for (let index in val) {
          let city = val[index].city.value;
          let usageType = val[index].usageType.value;

          if (currentUsedSearchCriteriaCombinations?.[city] === undefined) {
            currentUsedSearchCriteriaCombinations[city] = [usageType];
          } else {
            if (
              !currentUsedSearchCriteriaCombinations[city].includes(usageType)
            ) {
              currentUsedSearchCriteriaCombinations[city].push(usageType);
            }
          }
        }

        this.currentUsedSearchCriteriaCombinations =
          currentUsedSearchCriteriaCombinations;
      },
      deep: true,
    },
    activeSearchCriteriaIndex: function (newVal, oldVal) {
      // Update the active search criteria data
      this.activeCustomerSearchCriteriaData = this.getSearchCriteriaData(
        this.customerSearchCriterias[this.activeSearchCriteriaIndex]
      );

      // Get the currently active search criteria
      const activeCriteria = this.customerSearchCriterias[newVal];

      if (activeCriteria && activeCriteria.id) {
        // Check if this profile already has projects loaded
        if (
          this.matchingRealEstates &&
          this.matchingRealEstates[activeCriteria.id]
        ) {
          // Projects are already loaded for this profile
          this.projectsLoaded = true;
          this.showProjectSelection = true;

          // Check if this profile has project data with selected projects
          const searchCriteriaData = this.getSearchCriteriaData(activeCriteria);
          if (searchCriteriaData?.data?.project_addresses) {
            const hasSelectedProjects = Object.values(
              searchCriteriaData.data.project_addresses
            ).some((project) => project.selected);

            if (hasSelectedProjects) {
              // If there are selected projects and we have the unit data, show the units section
              const selectedProjectNames = Object.keys(
                searchCriteriaData.data.project_addresses
              ).filter(
                (name) =>
                  searchCriteriaData.data.project_addresses[name].selected
              );

              const hasProjectData = selectedProjectNames.some(
                (name) =>
                  this.projectAndUnitDatalist &&
                  this.projectAndUnitDatalist[name]
              );

              if (hasProjectData) {
                this.showUnitSelection = true;
                this.unitsLoaded = true;
              } else {
                // We have selected projects but no unit data, so we need to load it
                this.showUnitSelection = false;
                this.unitsLoaded = false;

                // Optionally load units for this profile
                if (this.autoLoadUnits) {
                  this.loadUnitsForSelectedProjects();
                }
              }
            } else {
              // No selected projects for this profile
              this.showUnitSelection = false;
              this.unitsLoaded = false;
            }
          } else {
            // No project data for this profile
            this.showUnitSelection = false;
            this.unitsLoaded = false;
          }
        } else {
          // Projects not yet loaded for this profile
          this.projectsLoaded = false;
          this.showProjectSelection = false;
          this.showUnitSelection = false;
          this.unitsLoaded = false;

          // Optionally auto-load projects for this profile
          if (this.autoLoadProjects) {
            this.loadRelatedProjects();
          }
        }
      } else {
        // This is a new profile with no ID yet
        this.projectsLoaded = false;
        this.showProjectSelection = false;
        this.showUnitSelection = false;
        this.unitsLoaded = false;
      }
    },
    customerData: {
      handler: function (newVal, oldVal) {
        // Check if this is a substantive change (different customer)
        if (oldVal && newVal && oldVal.id !== newVal.id) {
          // Reset all project and unit related data
          this.customerSearchCriterias = [];
          this.matchingRealEstates = {};
          this.projectAndUnitDatalist = {};
          this.activeSearchCriteriaIndex = -1;
          this.projectsLoaded = false;
          this.unitsLoaded = false;
          this.showProjectSelection = false;
          this.showUnitSelection = false;
        }

        let language = "Englisch";
        if (
          newVal.dataset?.address_language !== undefined &&
          !this.isEmpty(newVal.dataset.address_language)
        ) {
          language = this.mapLanguage(newVal.dataset.address_language);
        }
        this.emailLanguage = language;
      },
      deep: true,
    },

    customerDataMicroservice: {
      handler: function (val, oldVal) {
        this.renderEmailTemplate();
      },
      deep: true,
    },
    emailLanguage: function (newVal) {
      this.renderEmailTemplate();
    },
    emailTemplate: function (newVal) {
      this.renderEmailTemplate();
    },
    currentStep: function (newVal) {
      this.$emit("currentStep", newVal);
      if (newVal === this.maxSteps - 1) {
        this.renderEmailTemplate();
      }
    },
  },
  mounted() {
    this.getEmailTemplate();
    this.isUserSpainCustomer();
    if (Object.keys(this.customerDatas).length > 0) {
      // Do this only when data comes in from dataroom
      let dataToSend = {
        data: {
          customer_nr: this.customerDatas.dataset.address_id,
          company: this.customerDatas.dataset.address_company,
        },
      };

      console.log(dataToSend);

      this.searchCustomers(dataToSend);
    }
    this.handleIframeBubbleEvent();

    if (
      !this.getUserRole() === 4 &&
      !this.agentsForNewDataroom.includes(this.getUserMail())
    ) {
      this.$router.push({ name: "dataRoomTool" });
    }
  },
};
</script>

<template>
  <Navigation
    @click="isNameChangeActive = false"
    v-if="Object.keys(customerDatas).length === 0"
  />

  <div
    class="multistep-form dataroom"
    @click="
      closeDropdowns;
      isNameChangeActive = false;
    "
  >
    <div class="headline" v-if="!showOnlySearchCriterias">
      <b style="color: black">DATENRAUM</b> - SCHRITT {{ currentStep }}/{{
        maxSteps
      }}
    </div>
    <CreateReservationProgressBar
      :currentStep="currentStep"
      :maxSteps="maxSteps"
      v-if="!showOnlySearchCriterias"
    />

    <div class="steps" :style="currentStep === 3 ? 'width: 100%;' : ''">
      <div class="loading-screen" v-if="isEmailSubmitLoading">
        <AnimateCircleIcon></AnimateCircleIcon>
      </div>

      <!-- Step 1: Customer and Email Type Selection -->
      <div :class="'step-' + currentStep" v-if="currentStep === 1">
        <div class="step-title">E-Mail-Art wählen</div>

        <div class="title" v-if="Object.keys(this.customerDatas).length === 0">
          <Seperator>Kundensuche</Seperator>
        </div>

        <div
          class="field-wrapper search"
          v-if="Object.keys(this.customerDatas).length === 0"
        >
          <InputField
            ref="inputRealEstates"
            inputType="text"
            inputName="Customers"
            :inputValue="customerSearchInput"
            v-model="customerSearchInput"
            @input="restartCustomerSearch()"
            @focus="setDropdownTop($event)"
          ></InputField>
          <label class="ph">Kundensuche nach E-Mail oder Telefon</label>
          <Dropdown
            ref="dropdownCustomers"
            :class="{
              active: dropdownsShow.showCustomerDropdown,
              relative: dropdownRelativePosition,
            }"
            type="customerData"
            :renderingObject="foundCustomersList"
            @dropdown-item-clicked="dropdownClick('mail', $event)"
            emitType="event"
            @click.stop=""
          ></Dropdown>
          <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
        </div>

        <div class="sperator"></div>

        <div
          class="customer-summary"
          v-if="Object.keys(customerData).length > 0"
        >
          <div class="inner-wrapper">
            <div class="title">
              <Seperator>Ausgewählter Kunde</Seperator>
            </div>

            <div class="data-wrapper">
              <div
                class="item"
                v-if="
                  customerData?.onoffice_ids_kg !== undefined &&
                  customerData.onoffice_ids_kg.length > 0
                "
              >
                <div>
                  KdNr{{ customerData.onoffice_ids_kg.length > 1 ? "s" : "" }}
                  KG:
                </div>
                <div>{{ customerData.onoffice_ids_kg.join(", ") }}</div>
              </div>
              <div
                class="item"
                v-if="
                  customerData?.onoffice_ids_living !== undefined &&
                  customerData.onoffice_ids_living.length > 0
                "
              >
                <div>
                  KdNr{{
                    customerData.onoffice_ids_living.length > 1 ? "s" : ""
                  }}
                  Living:
                </div>
                <div>{{ customerData.onoffice_ids_living.join(", ") }}</div>
              </div>
              <div class="item" v-if="customerData?.id !== undefined">
                <div>KdNr Microservice:</div>
                <div>{{ customerData.id }}</div>
              </div>
              <div class="item">
                <div>Name:</div>
                <div>
                  {{ customerData.dataset.address_salutation }}
                  {{ customerData.dataset.address_first_name }}
                  {{ customerData.dataset.address_last_name }}
                </div>
              </div>
              <div class="item">
                <div>E-Mail:</div>
                <div>{{ customerData.dataset.address_email }}</div>
              </div>
              <div class="item">
                <div>Telefon:</div>
                <div>
                  {{
                    customerData.dataset?.address_phone[0]
                      ? customerData.dataset?.address_phone[0]
                      : "-"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="email-type-wrapper" v-if="!isSpainUser">
          <div class="title">
            <Seperator>Wahl der E-Mail-Art an den Kunden</Seperator>
          </div>

          <div class="field-wrapper radios">
            <label for="dataroomLink" class="radio-wrapper">
              <InputField
                inputType="radio"
                id="dataroomLink"
                inputName="dataroomLink"
                value="link"
                :inputValue="typeOfMail"
                v-model="typeOfMail"
              ></InputField>
              Versand von Datenraum-link
            </label>
            <label for="customMail" class="radio-wrapper">
              <InputField
                inputType="radio"
                id="customMail"
                inputName="customMail"
                value="mail"
                :inputValue="typeOfMail"
                v-model="typeOfMail"
              ></InputField>
              Freie E-Mail
            </label>
          </div>
        </div>
      </div>

      <!-- Step 2: Region Selection, Search Criteria, Projects and Units Selection -->
      <!-- Updated step 2 template with loading states -->
      <div :class="'step-' + currentStep" v-else-if="currentStep === 2">
        <RegionSelection
          v-if="!showProjectSelection && !showUnitSelection"
          :regions="regions"
          :selectedRegions="selectedRegions"
        />

        <div class="step-title" v-if="customerData?.dataset !== undefined">
          Suchprofil eingeben für {{ customerData.dataset.address_first_name }}
          {{ customerData.dataset.address_last_name }}
        </div>

        <div class="searchcriteria-toggler-wrapper" @click.stop="">
          <div
            class="searchcriteria-toggler"
            :class="{ active: index === activeSearchCriteriaIndex }"
            v-for="(criteria, index) in customerSearchCriterias"
            @click="activeSearchCriteriaIndex = index"
          >
            <div class="searchcriteria-toggler-button">
              <SearchIcon></SearchIcon>
              <ToolTip
                :content="automaticSearchCriteriaToolTipText"
                hoverText="<AutomaticSearchcriteria>"
                style="margin-left: 5px"
                v-if="criteria.category === 'automatic'"
              ></ToolTip>
              <InputField
                v-if="isNameChangeActive === index"
                inputType="text"
                inputplaceholder=""
                inputName="searchCriteriaName"
                :inputValue="customerSearchCriterias[index].name"
                v-model="customerSearchCriterias[index].name"
              ></InputField>
              <span class="search-criteria-name" v-else>
                {{
                  !this.isEmpty(customerSearchCriterias[index].name)
                    ? customerSearchCriterias[index].name
                    : "Suchprofil " + (index + 1)
                }}
              </span>
            </div>

            <div class="action-button">
              <EditIcon
                @click.stop="editSearchCriterianame(index)"
                v-if="
                  Object.keys(customerSearchCriterias[index]).length > 0 ||
                  Object.keys(customerSearchCriterias).length > 1 ||
                  customerSearchCriterias.length > 0
                "
              ></EditIcon>
              <DeleteIcon
                @click.stop="deleteSearchCriteria(index)"
                v-if="
                  Object.keys(customerSearchCriterias[index]).length > 0 ||
                  Object.keys(customerSearchCriterias).length > 1 ||
                  customerSearchCriterias.length > 0
                "
              ></DeleteIcon>
            </div>
          </div>
          <div
            class="searchcriteria-toggler add"
            @click="
              addSearchCriteria();
              activeSearchCriteriaIndex = customerSearchCriterias.length - 1;
            "
            v-if="customerSearchCriterias.length < 3"
          >
            <PlusIcon></PlusIcon>
          </div>
        </div>

        <SearchCriteriaForm
          :customerDataSC="customerData"
          :activeSC="activeSearchCriteriaIndex"
          :microserviceCustomerData="customerDataMicroservice"
          :existingSearchCriteriaFromParent="searchCriteriaFormsFromApiFetch"
          :indexToDelete="deleteSCIndexForSearchCriteriaCompontent"
          :triggerDeleteProcess="triggerSearchCriteriaDeleteProcess"
          :triggerAddSCProcess="triggerSearchCriteriaAddProcess"
          :showCustomerSearchCriteria="showOnlySearchCriterias"
          :currentUsedSearchCriteriaCombos="
            currentUsedSearchCriteriaCombinations
          "
          v-if="
            activeSearchCriteriaIndex >= 0 &&
            Object.keys(customerData).length > 0
          "
        ></SearchCriteriaForm>

        <div class="action-buttons">
          <Button
            type="report"
            @click="loadRelatedProjects()"
            :disabled="isProjectsLoading"
          >
            Projekte laden
            <AnimateCircleIcon v-if="isProjectsLoading"></AnimateCircleIcon>
          </Button>
        </div>

        <!-- Project Selection Section -->
        <div
          v-if="showProjectSelection && projectsLoaded"
          class="project-selection-section"
        >
          <div class="section-header">
            <h2>Verfügbare Projekte</h2>
            <p>
              Wählen Sie die Projekte aus, die dem Kunden angezeigt werden
              sollen
            </p>
          </div>

          <DataroomProjectSelection
            :selectedProjectData="getSearchCriteriaActiveProjects()"
            :customerSearchCriteria="
              customerSearchCriterias[activeSearchCriteriaIndex]
            "
            :searchCriteriaId="
              customerSearchCriterias[activeSearchCriteriaIndex].id
            "
            :searchCriteriaIds="searchCriteriaIds"
            @updateSelectedProjects="updateSelectedProjects"
          />

          <div class="action-buttons load-units">
            <Button
              type="report"
              @click="loadUnitsForSelectedProjects()"
              :disabled="
                isUnitsLoading ||
                countSelectedProjects() === 0 ||
                countSelectedProjects() > 5
              "
            >
              Einheiten laden
              <AnimateCircleIcon v-if="isUnitsLoading"></AnimateCircleIcon>
            </Button>
          </div>
        </div>

        <div
          v-if="showUnitSelection && unitsLoaded"
          class="unit-selection-section"
        >
          <div class="section-header">
            <h2>Verfügbare Einheiten</h2>
            <p>
              Wählen Sie die Einheiten aus, die dem Kunden angezeigt werden
              sollen
            </p>
          </div>

          <DataroomUnitSelection
            :selectedProjectData="getSearchCriteriaActiveProjects()"
            :projectAndUnitDatalist="projectAndUnitDatalist"
            :searchCriteriaId="
              customerSearchCriterias[activeSearchCriteriaIndex].id
            "
            :searchCriteriaType="
              getSearchCriteriaData(
                customerSearchCriterias[activeSearchCriteriaIndex]
              ).type
            "
            @updateSelectedUnits="updateSelectedUnits"
          />
        </div>
      </div>

      <!-- Step 3: Dataroom Preview with iframe -->
      <div :class="'step-' + currentStep" v-else-if="currentStep === 3">
        <div class="step-title">
          Link für {{ customerData.dataset.address_first_name }}
          {{ customerData.dataset.address_last_name }} prüfen
        </div>
        <div class="iframe-wrapper">
          <div class="loading-screen" v-if="!iframeLoaded">
            <AnimateCircleIcon></AnimateCircleIcon>
          </div>
          <div class="watermark-wrapper">
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
            <div class="watermark">Vorschau / Preview</div>
          </div>
          <iframe class="preview-customerlink" :src="iFrameUrl"></iframe>
        </div>

        <div class="step-title">
          E-Mail erstellen für {{ customerData.dataset.address_first_name }}
          {{ customerData.dataset.address_last_name }}
        </div>

        <div class="field-wrapper two-col">
          <div class="field-wrapper">
            <InputField
              ref="inputRealEstates"
              inputType="text"
              inputName="EmailLanguage"
              :inputValue="emailLanguage"
              v-model="emailLanguage"
              @focus="setDropdownTop($event)"
              @click="
                dropdownsShow.showEmailLanguageDropdown =
                  !dropdownsShow.showEmailLanguageDropdown
              "
              @click.stop=""
            ></InputField>
            <label class="ph">Sprache</label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown
              ref="dropdownEmailLanguage"
              :class="{
                active: dropdownsShow.showEmailLanguageDropdown,
                relative: dropdownRelativePosition,
              }"
              type="county"
              :renderingObject="dropdownContent.emailContent"
              :activeItems="emailLanguage"
              @dropdown-item-clicked="dropdownClick('emailLanguage', $event)"
              @click.stop=""
            ></Dropdown>
          </div>
          <div class="field-wrapper radios">
            <label for="emailTemplateDe" class="radio-wrapper">
              <InputField
                inputType="radio"
                id="emailTemplateDe"
                inputName="emailTemplateDe"
                value="de"
                :inputValue="emailTemplate"
                v-model="emailTemplate"
              ></InputField>
              Vorlage Deutschland
            </label>
            <!--              <label for="emailTemplateEs" class="radio-wrapper">-->
            <!--                <InputField inputType="radio" id="emailTemplateEs" inputName="emailTemplateEs" value="es" :inputValue="emailTemplate" v-model="emailTemplate"></InputField>-->
            <!--                Vorlage Spanien-->
            <!--              </label>-->
          </div>
        </div>

        <div class="email-render">
          <div class="subject">
            <div class="field-wrapper">
              <InputField
                inputType="text"
                inputPlaceholder="EmailSubject"
                inputName="EmailSubject"
                :inputValue="emailSubject"
                v-model="emailSubject"
              ></InputField>
              <label class="ph">E-Mail Betreff</label>
            </div>
          </div>
          <div class="body">
            <div class="field-wrapper">
              <TextAreaField
                maxlength="2000"
                :inputVal="emailContent"
                v-model="emailContent"
                @input="addBreaksToTextareaString()"
              ></TextAreaField>
              {{ emailContent.length }} von 2000 Zeichen
              <label class="ph">E-Mail Inhalt</label>
            </div>
          </div>
        </div>

        <div class="email-preview">
          <AnimateCircleIcon v-if="isLoadingAttachment"></AnimateCircleIcon>
          <div
            class="attachments"
            v-if="emailPdfExposeResponse?.publicUrl !== undefined"
          >
            <span>Anhang: </span>
            <a :href="emailPdfExposeResponse.publicUrl" target="_blank">
              <div class="attachment">
                <span>Expose</span>
                <div
                  class="delete"
                  @click.stop.prevent="handleDeleteAttachment()"
                >
                  <DeleteIcon></DeleteIcon>
                </div>
              </div>
            </a>
          </div>
          <div class="sendto">An: {{ customerData.dataset.address_email }}</div>
          <div class="subject">Betreff: {{ emailSubject }}</div>
          <div v-html="emailContentModified"></div>
          <div class="fixed-content" v-html="emailContentFixed"></div>
        </div>
      </div>

      <div
        class="action"
        :style="currentStep === 1 ? 'justify-content: end;' : ''"
        v-if="currentStep !== maxSteps"
      >
        <Button
          type="edit"
          @click="navBack()"
          v-if="currentStep !== 1 && !showOnlySearchCriterias"
          >{{
            currentStep === maxSteps ? "Zurück zur Startseite" : "Zurück"
          }}</Button
        >
        <Button
          type="report"
          @click="validateStep()"
          v-if="currentStep !== maxSteps"
          >{{ currentStep === maxSteps - 1 ? "Weiter" : "Weiter" }}</Button
        >
      </div>

      <div class="action" style="justify-content: center" v-else>
        <Button
          type="edit"
          @click="navBack()"
          v-if="currentStep !== 1 && !showOnlySearchCriterias"
          >{{
            currentStep === maxSteps ? "Zurück zur Startseite" : "Zurück"
          }}</Button
        >
        <Button
          type="report"
          style="flex-basis: 100%"
          @click="saveSearchCriterias()"
          v-if="$route.name !== 'dataRoomToolNew'"
          >Email Senden <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.multistep-form {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.multistep-form .steps {
  width: 100%;
}

.multistep-form .steps-wrapper {
  flex-basis: 100%;
}

.navigation + .multistep-form .steps {
  width: 70% !important;
  margin-bottom: 100px;
}

.navigation + .multistep-form .steps-wrapper {
  flex-basis: 51% !important;
}

.headline {
  flex-basis: 50%;
  margin-top: 25px;
  margin-bottom: 25px;
  font-size: 18px;
}

.step-title {
  font-size: 20px;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

.title,
.customer-summary .data-wrapper .item > div:first-of-type {
  font-weight: bolder;
}

.customer-summary .data-wrapper .item {
  display: flex;
}

.customer-summary .data-wrapper .item > div:first-of-type {
  min-width: 150px;
}

.field-wrapper.radios {
  display: flex;
  justify-content: space-between;
}

.field-wrapper.radios * {
  cursor: pointer;
  text-align: center;
}

.seperator {
  z-index: 0;
}

.action {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  margin-top: 50px;
}

.searchcriteria-toggler-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 50px;
  cursor: pointer;
}

.searchcriteria-toggler .searchcriteria-toggler-button,
.action-button,
.searchcriteria-toggler.add {
  padding: 10px 25px;
  background-color: var(--light-light-gray);
}

.searchcriteria-toggler {
  margin-right: 15px;
  margin-bottom: 10px;
}

.searchcriteria-toggler.add {
  display: flex;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
}

.action-button i + i,
.search-criteria-name {
  margin-left: 15px;
}

.search-criteria-name {
  max-width: 250px;
}

.searchcriteria-toggler.active .searchcriteria-toggler-button {
  color: white;
  background-color: var(--blue);
  transition: all 0.2s;
}

.searchcriteria-toggler-button {
  align-items: center;
}

.searchcriteria-toggler,
.searchcriteria-toggler-button {
  display: flex;
}

.searchcriteria-toggler-button input {
  margin-left: 5px;
  padding: 5px 10px;
}

.preview-customerlink {
  width: 100%;
  height: 60vh;
  margin-top: 25px;
}

.field-wrapper.two-col {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.field-wrapper.two-col > div {
  flex-basis: 45%;
}

.email-render {
  margin-top: 50px;
}

.email-render > div + div {
  margin-top: 25px;
}

.email-preview {
  margin-top: 25px;
  padding: 25px;
  border-radius: 5px;
  background-color: var(--light-light-gray);
}

.email-preview .sendto,
.email-preview .subject {
  font-weight: 700;
  margin-bottom: 15px;
}

.loading-screen {
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-screen .loading-animation,
.iframe-wrapper .loading-animation {
  margin: 0;
  font-size: 40px;
}

.iframe-wrapper .loading-screen {
  background-color: rgba(255, 255, 255, 0.9);
}

.watermark-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  height: 100%;
  overflow: hidden;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
}

.watermark {
  transform: rotate(-45deg);
  white-space: nowrap;
  font-size: 2vw;
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  user-select: none;
}

.attachments {
  margin-bottom: 25px;
}

.multistep-form {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.multistep-form .steps {
  width: 100%;
}

.headline {
  flex-basis: 50%;
  margin-top: 25px;
  margin-bottom: 25px;
  font-size: 18px;
}

.step-title {
  font-size: 20px;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

.searchcriteria-toggler-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 50px;
  cursor: pointer;
}

.searchcriteria-toggler .searchcriteria-toggler-button,
.action-button,
.searchcriteria-toggler.add {
  padding: 10px 25px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.searchcriteria-toggler {
  margin-right: 15px;
  margin-bottom: 10px;
  display: flex;
}

.searchcriteria-toggler.add {
  display: flex;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
}

.action-button i + i,
.search-criteria-name {
  margin-left: 15px;
}

.searchcriteria-toggler.active .searchcriteria-toggler-button {
  color: white;
  background-color: #3490dc;
  transition: all 0.2s;
}

.searchcriteria-toggler-button {
  align-items: center;
  display: flex;
}

.search-profile-form {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  margin-bottom: 15px;
  gap: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
}

.form-group .required {
  color: red;
}

.dropdown {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 12px;
}

.advanced-filtering {
  margin-top: 30px;
}

.advanced-filter-toggle {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  color: #3490dc;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
}

.toggle-icon {
  margin-left: 10px;
}

.action-buttons-center {
  display: flex;
  position: absolute;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.action {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 50px;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 20px;
  margin-bottom: 5px;
}

.section-header p {
  color: #666;
  font-size: 14px;
}

.attachments,
.attachments a {
  display: flex;
  align-items: center;
  font-weight: 700;
}

.attachment {
  display: flex;
  padding: 5px 10px;
  border: solid 2px;
  margin-left: 10px;
  align-items: center;
}

.attachment .fa-trash {
  margin-left: 15px;
}

.attachment i {
  margin-right: 5px;
}

/* Styles for the new components */
.action-buttons-center {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-section p {
  margin-top: 1rem;
  color: #666;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #666;
  font-size: 0.9rem;
}

.search-criteria-section,
.project-selection-section,
.unit-selection-section {
  margin-bottom: 2rem;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 60vh;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0 30px;
}

.action-buttons button {
  flex-basis: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button.load-units {
  margin-top: 10px;
  flex-direction: column;
  justify-content: space-between;
}

.projects-selected-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.projects-selected-info .warning {
  color: var(--red);
  margin-left: 10px;
  font-weight: normal;
}

.no-search-profiles {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
}

/* Optional: Add this if you want to make the add button more prominent when there are no profiles */
.searchcriteria-toggler-wrapper .searchcriteria-toggler.add:only-child {
  background-color: #3490dc;
  color: white;
  padding: 15px 30px;
  transition: all 0.2s ease;
}

.no-search-profiles {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
}

/* Loading indicator style */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-indicator p {
  margin-top: 15px;
  color: #666;
  font-size: 16px;
}

/* Optional: Add this if you want to make the add button more prominent when there are no profiles */
.searchcriteria-toggler-wrapper .searchcriteria-toggler.add:only-child {
  background-color: #3490dc;
  color: white;
  padding: 15px 30px;
  transition: all 0.2s ease;
}

.searchcriteria-toggler-wrapper .searchcriteria-toggler.add:only-child:hover {
  background-color: #2779bd;
  transform: scale(1.05);
}

.searchcriteria-toggler-wrapper .searchcriteria-toggler.add:only-child:hover {
  background-color: #2779bd;
  transform: scale(1.05);
}

@media (max-width: 1400px) {
  .navigation + .multistep-form .steps {
    width: 70% !important;
  }

  .headline,
  .navigation + .multistep-form .steps-wrapper {
    flex-basis: 51% !important;
  }
}
</style>
