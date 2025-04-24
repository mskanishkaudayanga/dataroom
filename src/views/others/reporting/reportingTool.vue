<script>

import Navigation from "@/components/Navigation.vue";
import axios from "axios";
import InputField from "@/components/forms/InputField.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import Button from "@/components/buttons/button.vue";
import ReportingTable from "@/components/reporting/Table.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import PatchnotesIcon from "@/components/icons/icon-patchnote.vue";
import ArrowUpIcon from "@/components/icons/icon-arrow-up.vue";
import ArrowDownIcon from "@/components/icons/icon-arrow-down.vue";
import PieChart from "@/components/graphs/PieChart.vue";
import BarChart from "@/components/graphs/BarChart.vue";
import HoursglasshalfIcon from "@/components/icons/icon-hoursglasshalf.vue";
import StopwatchIcon from "@/components/icons/icon-stopwatch.vue";
import TableChart from "@/components/graphs/SimpleTable.vue";
import SaleIcon from "@/components/icons/icon-sale.vue";
import GraphIcon from "@/components/icons/icon-graph.vue";

export default {
  name: 'reportingTool',
  components: {
    GraphIcon,
    SaleIcon,
    TableChart,
    StopwatchIcon,
    HoursglasshalfIcon,
    BarChart,
    PieChart,
    ArrowDownIcon,
    ArrowUpIcon,
    PatchnotesIcon,
    AnimateCircleIcon, ReportingTable, Button, DropdownArrow, Dropdown, InputField, Navigation},
  data() {
    return {
      projectName: 'Alle',
      sources: ['Alle'],
      searchSources: '',
      searchAgents: '',
      agents: ['Alle'],
      sourcesValid: true,
      agentsValid: true,
      projectNameValid: true,
      dateFrom: '',
      dateTo: '',
      compareDateFrom: '',
      compareDateTo: '',
      clickedTileName: '',
      clickedTilCounty: '',
      showGraphs: false,
      fetchedData: [],
      compareFetchedData: [],
      leadDataPrepared: [],
      dropdownsShow: {
        projectName: false,
        sources: false,
        agents: false
      },
      dropdownRelativePosition: false,
      renderProjectNames: ['Alle'],
      renderAgents: ['Alle'],
      apiResponseAgents: [],
      renderSources: [
        "Alle",
        "Facebook",
        "Instagram",
        "Google",
        "LinkedIn",
        "WhatsApp",
        "Taboola",
        "Terminbuchung",
        "Empfehlung",
        "Zeitungsanzeige",
        "Bauschild",
        "Brief-Mailing",
        "Flyer",
        "Newsletter",
        "Tippgeber",
        "Showroom",
        "Aushang-im-Ladenlokal",
        "Werbung",
        "Artikel/Pressearbeit",
        "Kunde-hat-angerufen",
        "Veranstaltung/Seminar",
        "Freund/Privatkontakt",
        "Telefonbuch",
        "Internetrecherche",
        "Suchmaschine",
        "Sonstiges",
        "Portale",
        "Internet-Seiten",
        "Messe / Veranstaltung",
        "persönlicher Kontakt",
        "Börsen Import",
        "Zwischenablage",
        "Banken",
        "Geschäftspartner",
        "eigene-Homepage",
        "Neubaukompass",
        "Kleinanzeigen",
        "Direktaufruf Website",
        "Direktaufruf Landingpage",
        "Direktaufruf Micropage",
        "keine Quelle",
        "My Casa Away",
        "Immohunters.de",
        "Immobilienportal",
        "Immobilienscout24",
        "Immonet",
        "eigene Webseite",
        "Immowelt",
        "rightmoveco.uk",
        "bellevue",
        "ivd24",
        "LuxuryEstate.com",
        "Idealista.com",
        "immobiliare.it",
        "thinkspain.com",
        "Kyero.com",
        "immobilie1 AG",
        "Terminbuchung Büro",
        "Terminbuchung Telefon",
        "Terminbuchung Vorort"
      ],

      isLoading: false,

      colorSchema: {
        lightGray: '#999999',
        gray: '#777777',
        darkGray: '#262A33',
        lightGreen: '#88BB49',
        darkGreen: '#239149',
        red: '#D94139',
        lightBlue: '#4E7DEF',
        darkBlue: '#1757d9',
      },

      keysToFilterForSpecialGraphs: ["total", "has_phone", "projects", "agents", "sources"],
    }
  },
  methods: {
    dropdownClick(field, clickedText) {
      if ( field === 'agents' || field === 'sources' ) {

        if ( clickedText === 'Alle' ) {
          this.$data[field] = ['Alle'];
        } else {
          if ( !Array.isArray(this.$data[field]) ) {
            this.$data[field] = [];
          }
          this.$data[field] = this.$data[field].filter(item => item !== 'Alle');

          if ( this.$data[field].includes(clickedText) ) {
            // Remove from array
            this.$data[field] = this.$data[field].filter(item => item !== clickedText);
            if ( this.$data[field].length <= 0 ) {
              this.$data[field] = ['Alle'];
            }
          } else {
            // Add to array
            this.$data[field].push(clickedText);
          }

        }

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
    getReportingData(isAutomatic = false) {

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;

      let dataToSend = {
        data: {
          'projectname': this.projectName,
          'start_date': this.dateFrom,
          'end_date': this.dateTo,
        }
      };

      if ( !this.agents.includes('Alle') ) {
        dataToSend.data['agents'] = this.agents;
      }

      if ( !this.sources.includes('Alle') ) {
        dataToSend.data['sources'] = this.sources;
      }

      axios.post(this.globalApiMicroserviceBaseUrl + '/activities/reporting', dataToSend)
          .then(
              (response) => {
                if (response.status === 200) {
                  this.fetchedData = response.data;
                  console.log(this.fetchedData)
                  if ( !isAutomatic ) {
                    this.showGraphs = false;
                    this.clickedTilCounty = '';
                  }
                } else {
                  this.notificationBannerInit('warning', 'Keine Daten gefunden');
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
              }
          ).finally(() => {
            this.isLoading = false;
          });


      // For get delta data
      let startDate = new Date(this.dateFrom);
      let endDate = new Date(this.dateTo);
      let diffInTime = endDate.getTime() - startDate.getTime();

      let diffInDays = diffInTime / (1000 * 3600 * 24); // convert milliseconds into days

      startDate.setDate(startDate.getDate() - diffInDays); // subtract diffInDays from start_date
      endDate.setDate(endDate.getDate() - diffInDays); // subtract diffInDays from start_date

      let dd = String(startDate.getDate()).padStart(2, '0');
      let mm = String(startDate.getMonth() + 1).padStart(2, '0'); //January is 0, hence increment month by 1
      let yyyy = startDate.getFullYear();

      let ddEnd = String(endDate.getDate()).padStart(2, '0');
      let mmEnd = String(endDate.getMonth() + 1).padStart(2, '0'); //January is 0, hence increment month by 1
      let yyyyEnd = endDate.getFullYear();

      this.compareDateFrom = yyyy + '-' + mm + '-' + dd;
      this.compareDateTo = yyyyEnd + '-' + mmEnd + '-' + ddEnd;

      dataToSend = {
        data: {
          'projectname': this.projectName,
          'start_date': this.compareDateFrom,
          'end_date': this.compareDateTo,
        }
      };
      axios.post(this.globalApiMicroserviceBaseUrl + '/activities/reporting', dataToSend)
          .then(
              (response) => {
                if (response.status === 200) {
                  this.compareFetchedData = response.data;
                } else {
                  this.notificationBannerInit('warning', 'Keine Daten gefunden');
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
              }
          ).finally(() => {
        this.isLoading = false;
      });
    },
    getAgents() {
      axios.post(this.globalApiMicroserviceBaseUrl + '/agent/all')
          .then(
              (response) => {
                if (response.status === 200) {
                  this.apiResponseAgents = response.data;
                  for(let index in response.data) {
                    let agentStatus = false;
                    let agentFullName = '';
                    if ( typeof response.data[index].dataset_kg !== 'undefined' && response.data[index].dataset_kg !== null ) {
                      agentStatus = response.data[index].dataset_kg.agent_status === 'online';
                      agentFullName = response.data[index].dataset_kg.agent_first_name + ' ' + response.data[index].dataset_kg.agent_last_name;
                    } else if ( typeof response.data[index].dataset_living !== 'undefined' && response.data[index].dataset_living !== null ) {
                      agentStatus = response.data[index].dataset_living.agent_status === 'online';
                      agentFullName = response.data[index].dataset_living.agent_first_name + ' ' + response.data[index].dataset_living.agent_last_name;
                    }
                    if ( agentStatus ) {
                      this.renderAgents.push(agentFullName);
                    }
                  }
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          ).finally(() => {
          });
    },
    getProjects() {
      axios.get(this.globalApiBaseUrl + '/reporting/getReportingProjects')
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.renderProjectNames = this.renderProjectNames.concat(response.data.response);
                } else {
                  this.notificationBannerInit('warning', 'Keine Projekte gefunden');
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
              }
          )
    },
    getOnOfficeAppointmentData(appointment_id, company, item) {
      // Return a new Promise
      return new Promise((resolve, reject) => {
        axios.get(this.globalApiBaseUrl + '/onoffice/getSingleAppointment?appointmentId=' + appointment_id + '&company=' + company)
            .then(response => {
              if (response.data.status === 200) {
                let appointmentTypeInOnOffice = Object.keys(response.data.response.art)[0];
                for (const fetchedItem in this.fetchedData) {
                  if (this.fetchedData[fetchedItem].aktivititaet_id === item.aktivititaet_id) {
                    this.fetchedData[fetchedItem].termin_typ = appointmentTypeInOnOffice;
                  }
                }
                resolve(this.fetchedData); // Resolve the promise with the updated data
              } else {
                reject('Non-200 response'); // Reject the promise if the response is not 200
              }
            })
            .catch(error => {
              console.log(error);
              reject(error); // Reject the promise in case of an error
            });
      });
    },
    getDefaultDateRange() {
      const currentDate = new Date();
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      this.dateFrom = year+'-'+month+'-01';
      this.dateTo = year+'-'+month+'-'+lastDay;

      const date = new Date();
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const formatDate = (date) => {
        const d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        return [year,
          (month.length < 2) ? '0' + month : month,
          (day.length < 2) ? '0' + day : day
        ].join('-');
      };

      this.dateFrom = formatDate(firstDayOfMonth);
      this.dateTo = formatDate(lastDayOfMonth);

    },
    getRealEstateChanges(data) {
      if ( data !== undefined && data !== null && data !== '' ){
        if (typeof data !== 'object') {
          const realEstateData = JSON.parse(data);
          const keys = Object.keys(realEstateData);
          const dataOfChange =  realEstateData[keys[keys.length - 1]]
          return dataOfChange;
        }
      }
    },
    getDataTotal(dataset, searchFor) {
      let returnVal = 0;
      for(let keyNameToSearch of searchFor) {
        if (typeof dataset !== 'undefined' && typeof dataset[keyNameToSearch] !== 'undefined' && dataset[keyNameToSearch] !== null ) {
          returnVal += dataset[keyNameToSearch].total;
        }
      }
      return returnVal;
    },
    calcDelta(firstNumber, secondNumber) {
      let difference = firstNumber - secondNumber;
      let result = (difference / firstNumber) * 100;

      return isNaN(result) ? '-' : result.toFixed(2);
    },
    updateDateRange(data) {
      if ( data === 'week' ) {
        this.getWeekDates();
      } else if ( data === 'last_week' ) {
        this.getWeekDates(true);
      } else if ( data === 'last_month' ) {
        this.getLastMonthDates();
      } else if ( data === 'month' ) {
        this.getDefaultDateRange();
      }

      this.getReportingData();
    },
    getWeekDates(lastWeek = false) {
      let now = new Date();
      let dayOfWeek = now.getDay(); //Sunday is 0, Monday is 1, and so on.
      let numDay = dayOfWeek || 7;

      if ( lastWeek ) {
        now.setDate(now.getDate() - numDay - 6); // adjust to (previous) Monday
      } else {
        now.setDate(now.getDate() - numDay + 1); // adjust to (previous) Monday
      }
      let start = this.formatDate(now); // date string in yyyy-mm-dd format

      now.setDate(now.getDate() + 6); // adjust to Sunday
      let end = this.formatDate(now); // date string in yyyy-mm-dd format

      this.dateFrom = start;
      this.dateTo = end;
      return {start: start, end: end};
    },
    getLastMonthDates() {
      // today's date
      let now = new Date();

      // first day of this month
      let firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // last day of last month
      let lastDayLastMonth = new Date(firstDayThisMonth - 1);

      // first day of last month
      let firstDayLastMonth = new Date(lastDayLastMonth.getFullYear(), lastDayLastMonth.getMonth(), 1);

      this.dateFrom = this.formatDate(firstDayLastMonth);
      this.dateTo = this.formatDate(lastDayLastMonth);
      return {start: this.formatDate(firstDayLastMonth), end: this.formatDate(lastDayLastMonth)};
    },
    formatDate(date) {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    },
    clickTile(tileName, tileCounty) {
      if ( tileCounty !== this.clickedTilCounty ) {
        this.showGraphs = true;
        this.clickedTileName = tileName;
        this.clickedTilCounty = tileCounty;
      } else {
        this.showGraphs = false;
        this.clickedTilCounty = '';
      }
    },
    transformDateToGermanFormat(isoDateStr) {

      if ( this.isEmpty(isoDateStr) ) {
        return '';
      }

      // Parse the ISO 8601 date string
      const date = new Date(isoDateStr);

      // Extract the components
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');

      // Format the components into the desired format
      const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

      return formattedDate;
    },
    mergeSameObjectCounts(obj1, obj2) {
      const merged = { ...obj1 };

      for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          if (obj1.hasOwnProperty(key)) {
            if (typeof obj2[key] === 'object' && obj2[key] !== null) {
              merged[key] = this.mergeSameObjectCounts(obj1[key], obj2[key]);
            } else {
              merged[key] += obj2[key];
            }
          } else {
            merged[key] = obj2[key];
          }
        }
      }

      return merged;
    },
    sortData(data) {
      const dataArray = Object.entries(data);

      // Sort the array by values in descending order
      dataArray.sort((a, b) => b[1] - a[1]);

      // Convert the sorted array back to an object
      return Object.fromEntries(dataArray);
    },
    checkLeadActivities(activities) {
      const results = {};

      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];

        if (activity.lead_kind === "Lead Neukunde" || activity.lead_kind === "Lead Bestandskunde") {
          let foundMatchingActivity = false;
          let timeDifference = null;
          let leadEditTimestamp = null;
          let denyReason = null;


          // Search for edited leads
          for (let j = i + 1; j < activities.length; j++) {
            const subsequentActivity = activities[j];

            if ( subsequentActivity.lead_kind === "Lead akzeptiert" || subsequentActivity.lead_kind === "Lead nicht akzeptiert" ) {
              foundMatchingActivity = true;

              // Calculate the time difference
              const leadCreated = new Date(activity.lead_created);
              const subsequentLeadCreated = new Date(subsequentActivity.lead_created);

              const diffMs = subsequentLeadCreated - leadCreated; // Difference in milliseconds
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
              const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes

              timeDifference = diffHours + ' H ' + diffMinutes + ' M';

              function addLeadingZero(number) {
                return number < 10 ? `0${number}` : number;
              }
              const day = addLeadingZero(subsequentLeadCreated.getUTCDate());
              const month = addLeadingZero(subsequentLeadCreated.getUTCMonth() + 1); // Months are zero-based
              const year = subsequentLeadCreated.getUTCFullYear();
              const hours = addLeadingZero(subsequentLeadCreated.getUTCHours());
              const minutes = addLeadingZero(subsequentLeadCreated.getUTCMinutes());
              leadEditTimestamp = `${day}.${month}.${year} ${hours}:${minutes}`;

              break; // Stop searching after finding the first match
            }
          }

          // Search for reasons of deny
          for (let j = i + 1; j < activities.length; j++) {
            const subsequentActivity = activities[j];

            if ( subsequentActivity.lead_kind === "Lead nicht akzeptiert" || subsequentActivity.lead_kind === "Unqualifizierter Lead" ) {
              denyReason = subsequentActivity.lead_type;

              break; // Stop searching after finding the first match
            }
          }

          if ( !results[activity.lead_id] ) {
            results[activity.lead_id] = {
              lead_id: activity.lead_id,
              lead_kind: activity.lead_kind,
              found: foundMatchingActivity,
              time_difference: timeDifference,
              lead_edit_timestamp: leadEditTimestamp,
              denyReason: denyReason,
            };
          }

        }
      }

      return results;
    },
    getCurrentGraphType () {
      let type = '';
      const clickedTileName = this.clickedTileName;
      if ( clickedTileName === 'sales' ) {
        type = 'Verkauf';
      } else if ( clickedTileName === 'reservation' ) {
        type = 'Reservierung';
      }
      return type;
    }
  },
  computed: {
    reportDataLeadsProcessStatus() {
      const leadData = this.fetchedData;

      const allLeads = (leadData[this.clickedTilCounty]['Lead Neukunde']?.['total'] ?? 0) + (leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['total'] ?? 0);
      const acceptedLeads = leadData[this.clickedTilCounty]['Lead akzeptiert']?.['total'] ?? 0;
      const rejectedLeads = leadData[this.clickedTilCounty]['Lead nicht akzeptiert']?.['total'] ?? 0;

      return {
        labels: ['Bearbeitet', 'Unbearbeitet', 'Verweigert'],
        data: [acceptedLeads, allLeads - ( acceptedLeads + rejectedLeads ), rejectedLeads],
        colors: [this.colorSchema.darkGreen, this.colorSchema.red, this.colorSchema.lightGray]
      };

    },
    reportDataLeadsProcessTime() {
      const leadData = this.fetchedData;
      return leadData[this.clickedTilCounty]['processTime'];
    },
    reportDataLeadsWithPhone() {
      const leadData = this.fetchedData;

      const summedCustomers = (leadData[this.clickedTilCounty]['Lead Neukunde']?.['total'] ?? 0) + (leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['total'] ?? 0);
      const summedCustomersWithPhone = (leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['has_phone'] ?? 0) + (leadData[this.clickedTilCounty]['Lead Neukunde']?.['has_phone'] ?? 0);

      return {
        labels: ['mit Telefon', 'ohne Telefon'],
        data: [summedCustomersWithPhone, summedCustomers - summedCustomersWithPhone],
        colors: [this.colorSchema.darkGray, this.colorSchema.lightGray]
      };

    },
    reportDataLeadsCustomerType() {
      const leadData = this.fetchedData;

      const newCustomer = leadData[this.clickedTilCounty]['Lead Neukunde']?.['total'] ?? 0;
      const existingCustomer = leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['total'] ?? 0;

      return {
        labels: ['Neukunde', 'Bestandskunde'],
        data: [newCustomer, existingCustomer],
        colors: [this.colorSchema.darkGray, this.colorSchema.lightGray]
      };

    },
    reportDataLeadsStatus() {
      const leadData = this.fetchedData;

      const sale = leadData[this.clickedTilCounty]['Verkauf']?.['total'] ?? 0;
      const notaryAppointment = leadData[this.clickedTilCounty]['Notartermin vereinbart']?.['total'] ?? 0;
      const reservation = leadData[this.clickedTilCounty]['Reservierung']?.['total'] ?? 0;
      const qualified = leadData[this.clickedTilCounty]['Qualifizierter Lead']?.['total'] ?? 0;
      const unqualified = leadData[this.clickedTilCounty]['Unqualifizierter Lead']?.['total'] ?? 0;
      const inProcess = leadData[this.clickedTilCounty]['Lead akzeptiert']?.['total'] ?? 0;

      return {
        labels: ['in Berarbeitung', 'Interessent', 'Notartermin', 'auf Wiedervorlage', 'Reservierung', 'Verkauf', 'disqualifiziert'],
        data: [inProcess, qualified, notaryAppointment, 0, reservation, sale, unqualified],
        colors: [this.colorSchema.lightGray, this.colorSchema.lightBlue, this.colorSchema.lightGreen, this.colorSchema.gray, this.colorSchema.darkBlue, this.colorSchema.darkGreen, this.colorSchema.red ]
      };

    },
    reportDataLeadsUnqualified() {
      const leadData = this.fetchedData;

      if ( this.isEmpty(leadData[this.clickedTilCounty]['Unqualifizierter Lead']) ) {
        return {
          labels: [],
          data: [],
        };
      }

      const keysToFilter = this.keysToFilterForSpecialGraphs;
      const filteredData = Object.fromEntries(
          Object.entries(leadData[this.clickedTilCounty]['Unqualifizierter Lead']).filter(([key]) => !keysToFilter.includes(key))
      );

      const sortedData = this.sortData(filteredData);

      return {
        labels: Object.keys( sortedData ),
        data: Object.values( sortedData ),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataLeadsProject() {
      const leadData = this.fetchedData;

      const newCustomerProjects = leadData[this.clickedTilCounty]['Lead Neukunde']?.['projects'] ?? [];
      const existingCustomerProjects = leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['projects'] ?? [];

      const mergedListProjects = this.mergeSameObjectCounts(newCustomerProjects, existingCustomerProjects)

      let listProjects = {};
      for (let projectName in mergedListProjects) {
        if ( typeof listProjects[projectName] === 'undefined' ) {
          listProjects[projectName] = Object.values(mergedListProjects[projectName]).reduce((sum, value) => sum + value, 0);
        }
      }

      const sortedData = this.sortData(listProjects);

      let i = 1;
      for (let key in sortedData) {
        if ( i > 10 ) {
          delete sortedData[key];
        }
        i = i+1;
      }

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataLeadsSource() {
      const leadData = this.fetchedData;

      const newCustomer = leadData[this.clickedTilCounty]?.['Lead Neukunde']?.['sources'] ?? [];
      const existingCustomer = leadData[this.clickedTilCounty]?.['Lead Bestandskunde']?.['sources'] ?? [];

      const mergedListProjects = this.mergeSameObjectCounts(newCustomer, existingCustomer)

      const keysToFilter = this.keysToFilterForSpecialGraphs;
      const filteredData = Object.fromEntries(
          Object.entries(mergedListProjects).filter(([key]) => !keysToFilter.includes(key))
      );

      const sortedData = this.sortData(filteredData);
      if ( typeof sortedData['unset'] !== 'undefined' ) {
        delete sortedData['unset'];
      }

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataLeadsAgents() {
      const leadData = this.fetchedData;

      const newCustomerAgents = leadData[this.clickedTilCounty]['Lead Neukunde']?.['agents'] ?? [];
      const existingCustomerAgents = leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['agents'] ?? [];

      const mergedlistAgents = this.mergeSameObjectCounts(newCustomerAgents, existingCustomerAgents)

      const sortedData = this.sortData(mergedlistAgents);

      if ( typeof sortedData['unset'] !== 'undefined' ) {
        delete sortedData['unset'];
      }

      let i = 1;
      for (let key in sortedData) {
        if ( i > 10 ) {
          delete sortedData[key];
        }
        i = i+1;
      }

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataLeadsUnits() {
      const leadData = this.fetchedData;
      const selectedProject = this.projectName;

      const newCustomerProjects = leadData[this.clickedTilCounty]['Lead Neukunde']?.['projects'] ?? [];
      const existingCustomerProjects = leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['projects'] ?? [];

      const mergedListProjects = this.mergeSameObjectCounts(newCustomerProjects, existingCustomerProjects)
      let listProjects = mergedListProjects?.[selectedProject] ?? [];

      if ( this.isEmpty(listProjects) ) {
        return {
          labels: [],
          data: [],
        };
      }
      const sortedData = this.sortData(listProjects);

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataLeadsList() {
      const leadData = this.fetchedData;

      const customerList = leadData[this.clickedTilCounty]?.['customersList'] ?? [];

      let rowData = [];

      for ( let addressId in customerList ) {
        for ( let index in customerList[addressId] ) {

          let additionalDataForLeadStatus = this.checkLeadActivities(customerList[addressId]);

          let activity = customerList[addressId][index];

          let processTime = '';
          if ( !this.isEmpty(activity.lead_processed) ) {
            let timeCalc = this.calculateTimeDifferenceISO(activity.lead_created, activity.lead_processed)
            processTime = timeCalc.days + ' D ' + timeCalc.hours  + ' H ' + timeCalc.minutes + ' Min. ';
          }

          if ( activity.lead_kind === 'Lead Neukunde' || activity.lead_kind === 'Lead Bestandskunde'  ) {

            let dataToPush = [
              !this.isEmpty(activity.address_onoffice_ids) ? activity.address_onoffice_ids.join(', ') : '',
              activity.address_firstname + ' ' + activity.address_lastname,
              activity.lead_real_estate_nr,
              activity.lead_kind,
              activity.address_has_phone === 1 ? 'Ja' : 'Nein',
              additionalDataForLeadStatus[activity.lead_id].found ? 'Bearbeitet': 'Unbearbeitet',
              activity.lead_type,
              additionalDataForLeadStatus[activity.lead_id].denyReason ? additionalDataForLeadStatus[activity.lead_id].denyReason : '-' ,
              activity.lead_source,
              activity.lead_agent,
              this.transformDateToGermanFormat(activity.lead_created),
              additionalDataForLeadStatus[activity.lead_id].lead_edit_timestamp ? additionalDataForLeadStatus[activity.lead_id].lead_edit_timestamp : '-',
              additionalDataForLeadStatus[activity.lead_id].time_difference ? additionalDataForLeadStatus[activity.lead_id].time_difference : '-',
            ];

            rowData.push(dataToPush);
          }
        }
      }

      return {
        labels: ['KdNr.', 'Kunde', 'Immobilie', 'Kundenart', 'Telefon', 'Leadstatus', 'Aktionsart' ,'Absagegrund', 'Quelle', 'Makler', 'Lead erstellt', 'Lead bearbeitet', 'Benötigte Zeit'],
        data: rowData,
      };

    },
    reportDataDynamicConversionTotal() {

      const type = this.getCurrentGraphType()

      const leadData = this.fetchedData;

      const totalLeads = (leadData[this.clickedTilCounty]['Lead Neukunde']?.total ?? 0) + (leadData[this.clickedTilCounty]['Lead Bestandskunde']?.total ?? 0);
      const totalSales = leadData[this.clickedTilCounty][type]?.total ?? 0;

      const conversionRate = ( totalSales / totalLeads ) * 100;

      return conversionRate.toFixed(2);

    },
    reportDataDynamicConversionAgents() {

      const type = this.getCurrentGraphType()

      const leadData = this.fetchedData;

      const newCustomerAgents = leadData[this.clickedTilCounty]['Lead Neukunde']?.['agents'] ?? [];
      const existingCustomerAgents = leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['agents'] ?? [];

      const totalSales = leadData[this.clickedTilCounty][type]?.['agents'] ?? [];

      const mergedlistAgentsLeads = this.mergeSameObjectCounts(newCustomerAgents, existingCustomerAgents)

      let agentConversionList = {}
      for( let agent in totalSales ) {

        if ( typeof mergedlistAgentsLeads[agent] !== 'undefined' ) {
          agentConversionList[agent] = (totalSales[agent] / mergedlistAgentsLeads[agent]) * 100;
        } else {
          agentConversionList[agent] = (totalSales[agent] / 1) * 100;
        }
      }

      const sortedData = this.sortData(agentConversionList);

      if ( typeof sortedData['unset'] !== 'undefined' ) {
        delete sortedData['unset'];
      }

      let i = 1;
      for (let key in sortedData) {
        sortedData[key] = sortedData[key].toFixed(2);
        if ( i > 10 ) {
          delete sortedData[key];
        }
        i = i+1;
      }

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataDynamicConversionProjects() {
      const type = this.getCurrentGraphType()
      const leadData = this.fetchedData;

      const newCustomerAgents = leadData[this.clickedTilCounty]['Lead Neukunde']?.['projects'] ?? [];
      const existingCustomerAgents = leadData[this.clickedTilCounty]['Lead Bestandskunde']?.['projects'] ?? [];

      const totalSales = leadData[this.clickedTilCounty][type]?.['projects'] ?? [];

      const mergedlistProjectsLeads = this.mergeSameObjectCounts(newCustomerAgents, existingCustomerAgents)

      let newTotalSaleList = {}
      for( let project in totalSales ) {

        let count = 0;
        for ( let unit in totalSales[project] ) {
          count += totalSales[project][unit];
        }

        newTotalSaleList[project] = count;

      }

      let existingTotalLeadList = {}
      for( let project in mergedlistProjectsLeads ) {

        let count = 0;
        for ( let unit in mergedlistProjectsLeads[project] ) {
          count += mergedlistProjectsLeads[project][unit];
        }

        existingTotalLeadList[project] = count;

      }


      let projectConversionList = {}
      for( let project in newTotalSaleList ) {

        if ( typeof existingTotalLeadList[project] !== 'undefined' ) {
          projectConversionList[project] = (newTotalSaleList[project] / existingTotalLeadList[project]) * 100;
        } else {
          projectConversionList[project] = (newTotalSaleList[project] / 1) * 100;
        }
      }

      const sortedData = this.sortData(projectConversionList);

      if ( typeof sortedData['unset'] !== 'undefined' ) {
        delete sortedData['unset'];
      }

      let i = 1;
      for (let key in sortedData) {
        sortedData[key] = sortedData[key].toFixed(2);
        if ( i > 10 ) {
          delete sortedData[key];
        }
        i = i+1;
      }

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
    reportDataDynamicConversionList() {
      const type = this.getCurrentGraphType()
      const leadData = this.fetchedData;

      const customerList = leadData[this.clickedTilCounty]?.['customersList'] ?? [];

      let rowData = [];
      let totalSellValue = 0;

      for ( let addressId in customerList ) {
        for ( let index in customerList[addressId] ) {

          let activity = customerList[addressId][index];

          if ( activity.lead_kind === type ) {

            if ( typeof activity.real_estate_sold_price !== 'undefined' && activity.real_estate_sold_price !== null ) {
              totalSellValue += activity.real_estate_sold_price;
            }

            let dataToPush = [
              !this.isEmpty(activity.address_onoffice_ids) ? activity.address_onoffice_ids.join(', ') : '',
              activity.address_firstname + ' ' + activity.address_lastname,
              activity.lead_real_estate_nr,
              '',
              activity.lead_source,
              // activity.address_has_phone === 1 ? 'Ja' : 'Nein',
              activity.lead_agent,
              (typeof activity.real_estate_sold_price !== 'undefined' && activity.real_estate_sold_price !== null ? this.numberWithComma(activity.real_estate_sold_price) : 0 ) + ' €',
              this.transformDateToGermanFormat(activity.lead_created),
            ];

            let isSourceSet = false;
            let isLeadExisting = false;
            for ( let index in customerList[addressId] ) {
              activity = customerList[addressId][index];
              if ( activity.lead_kind === 'Lead Neukunde' || activity.lead_kind === 'Lead Bestandskunde'  ) {
                if ( !isSourceSet && typeof activity.lead_source !== 'undefined' && activity.lead_source !== null && !this.isEmpty(activity.lead_source) ) {
                  dataToPush[4] = activity.lead_source;
                  isSourceSet = true;
                }
                if ( activity.lead_kind === 'Lead Bestandskunde' ) {
                  isLeadExisting = true;
                }
              }
            }

            dataToPush[3] = 'Lead Neukunde';
            if ( isLeadExisting ) {
              dataToPush[3] = 'Lead Bestandskunde';
            }

            rowData.push(dataToPush);
          }
        }
      }

      return {
        labels: ['KdNr.', 'Kunde', 'Immobilie', 'Kundenart', 'Quelle', 'Makler', 'Kaufpreis', 'Datum'],
        data: rowData,
        realEstateTotalSellValue: this.numberWithComma(totalSellValue)
      };

    },
    reportDataDynamicConversionSources() {
      const type = this.getCurrentGraphType()
      const leadData = this.fetchedData;

      const customerList = leadData[this.clickedTilCounty]?.['customersList'] ?? [];

      let rowData = {};
      let sourceDataLeads = {};

      for ( let addressId in customerList ) {
        for ( let index in customerList[addressId] ) {

          if ( type === 'Reservierung' ) {
            console.log(customerList[addressId][index]);
          }

           let activity = customerList[addressId][index];

            if ( activity.lead_kind === 'Lead Neukunde' || activity.lead_kind === 'Lead Bestandskunde' ) {
              if ( typeof activity.lead_source !== 'undefined' && activity.lead_source !== null && !this.isEmpty(activity.lead_source) ) {
                if ( typeof sourceDataLeads[activity.lead_source] !== 'undefined' && sourceDataLeads[activity.lead_source] !== null ) {
                  sourceDataLeads[activity.lead_source] = sourceDataLeads[activity.lead_source] + 1;
                } else {
                  sourceDataLeads[activity.lead_source] = 1;
                }
              }
            }

            if ( activity.lead_kind === type ) {

            let dataToPush = [
              !this.isEmpty(activity.address_onoffice_ids) ? activity.address_onoffice_ids.join(', ') : '',
              activity.address_firstname + ' ' + activity.address_lastname,
              activity.lead_real_estate_nr,
              activity.lead_kind,
              activity.lead_source,
              activity.address_has_phone === 1 ? 'Ja' : 'Nein',
              activity.lead_agent,
              this.transformDateToGermanFormat(activity.lead_created),
            ];

            for ( let index in customerList[addressId] ) {
              activity = customerList[addressId][index];
              if ( activity.lead_kind === 'Lead Neukunde' || activity.lead_kind === 'Lead Bestandskunde'  ) {
                if ( typeof activity.lead_source !== 'undefined' && activity.lead_source !== null && !this.isEmpty(activity.lead_source) ) {

                  if ( typeof rowData[activity.lead_source] !== 'undefined' && rowData[activity.lead_source] !== null ) {
                    rowData[activity.lead_source] = rowData[activity.lead_source] + 1;
                  } else {
                    rowData[activity.lead_source] = 1;
                  }
                  break;
                }
              }
            }
          }
        }
      }

      for ( let source in rowData ) {
        if ( typeof sourceDataLeads[source] !== 'undefined' && sourceDataLeads[source] !== null ) {
          rowData[source] = (rowData[source] / sourceDataLeads[source]) * 100;
        }
      }

      const sortedData = this.sortData(rowData);

      if ( typeof sortedData['unset'] !== 'undefined' ) {
        delete sortedData['unset'];
      }

      let i = 1;
      for (let key in sortedData) {
        sortedData[key] = sortedData[key].toFixed(2);
        if ( i > 10 ) {
          delete sortedData[key];
        }
        i = i+1;
      }

      return {
        labels: Object.keys(sortedData),
        data: Object.values(sortedData),
        colors: [this.colorSchema.darkGray]
      };

    },
  },
  mounted() {
    this.getProjects();
    this.getAgents();
    this.getDefaultDateRange();

    this.getReportingData()

  }
}

</script>

<template>

  <Navigation/>

  <div class="reporting-wrapper">

    <div class="loading-wrapper" v-if="isLoading">
      <AnimateCircleIcon></AnimateCircleIcon>
    </div>

    <div class="top-action-bar">
      <Button type="edit" @click="this.patchNotesInit">
        <PatchnotesIcon></PatchnotesIcon>
        Patch notes
      </Button>
    </div>


    <div class="top-action" @click="closeDropdowns">
      <div class="field-wrapper">
        <span :class="{'invalid': !projectNameValid, 'valid': projectNameValid }">
          <InputField class="dropdown-input" ref="inputProjectname" inputType="text" inputName="Projectname" :inputValue="projectName" v-model="projectName" @focus="setDropdownTop($event)" @click="dropdownsShow.projectName = !dropdownsShow.projectName" @click.stop=""></InputField>
          <label class="ph">Projektname</label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownProjectname" :class="{active: dropdownsShow.projectName, relative: dropdownRelativePosition}" type="country" :renderingObject="renderProjectNames" :filterFor="projectName" @dropdown-item-clicked="dropdownClick('projectName', $event)" @click.stop=""></Dropdown>
        </span>
      </div>


      <div class="field-wrapper">
        <span :class="{'invalid': !agentsValid, 'valid': agentsValid }">
          <InputField class="dropdown-input" ref="inputAgents" inputType="text" inputName="Agents" :inputValue="agents" v-model="agents" @focus="setDropdownTop($event)" @click="dropdownsShow.agents = !dropdownsShow.agents" @click.stop=""></InputField>
          <label class="ph">Makler</label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownAgents" :class="{active: dropdownsShow.agents, relative: dropdownRelativePosition}" type="country" :renderingObject="renderAgents" :filterFor="agents" :activeItems="agents" @dropdown-item-clicked="dropdownClick('agents', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper">
        <span :class="{'invalid': !sourcesValid, 'valid': sourcesValid }">
          <InputField class="dropdown-input" ref="inputSources" inputType="text" inputName="Sources" :inputValue="sources" v-model="sources" @focus="setDropdownTop($event)" @click="dropdownsShow.sources = !dropdownsShow.sources" @click.stop=""></InputField>
          <label class="ph">Quelle</label>
          <DropdownArrow class="dropdown-arrow"></DropdownArrow>
          <Dropdown ref="dropdownSources" :class="{active: dropdownsShow.sources, relative: dropdownRelativePosition}" type="country" :renderingObject="renderSources" :filterFor="sources" :activeItems="sources" @dropdown-item-clicked="dropdownClick('sources', $event)" @click.stop=""></Dropdown>
        </span>
      </div>

      <div class="field-wrapper">
        <span>
          <InputField inputType="date" inputplaceholder="" inputName="dateFrom" :inputValue="dateFrom" v-model="dateFrom"></InputField>
          <label class="ph">Datum ab</label>
        </span>
      </div>

      <div class="field-wrapper">
        <span>
          <InputField inputType="date" inputplaceholder="" inputName="dateTo" :inputValue="dateTo" v-model="dateTo"></InputField>
          <label class="ph">Datum bis</label>
        </span>
      </div>

      <Button type="report" @click="getReportingData">Laden</Button>
    </div>

    <div class="top-action" style="padding-top: 0;">
      <div class="pre-selections">
        <Button type="edit" @click="updateDateRange('week');">Aktuelle Woche</Button>
        <Button type="edit" @click="updateDateRange('last_week');">Letzte Woche</Button>
        <Button type="edit" @click="updateDateRange('month');">Aktueller Monat</Button>
        <Button type="edit" @click="updateDateRange('last_month');">Letzter Monat</Button>
      </div>
    </div>

    <div class="reporting-body" v-if="compareFetchedData">

      <div class="looper" v-for="(key, index) in fetchedData">
        <div class="row" v-if="index !== 'unset'">
          <div class="title">{{ index }}</div>

          <div class="wrapper-card" style="cursor:pointer;" @click="clickTile('leads', index)">
            <div class="inner-wrapper">
              <div class="title">Leads</div>
              <div class="count">{{ getDataTotal(key, ['Lead Bestandskunde', 'Lead Neukunde']) }}</div>
              <div class="delta" :class="{'positiv': this.calcDelta( getDataTotal(key, ['Lead Bestandskunde', 'Lead Neukunde']), getDataTotal(this.compareFetchedData[index], ['Lead Bestandskunde', 'Lead Neukunde']) ) > 0 }">
                <ArrowUpIcon></ArrowUpIcon>
                <ArrowDownIcon></ArrowDownIcon>
                {{ this.calcDelta( getDataTotal(key, ['Lead Bestandskunde', 'Lead Neukunde']), getDataTotal(this.compareFetchedData[index], ['Lead Bestandskunde', 'Lead Neukunde']) )}} %
              </div>
              <div class="compare-count">vs. {{ getDataTotal(this.compareFetchedData[index], ['Lead Bestandskunde', 'Lead Neukunde']) }}</div>
              <div class="compare-date">{{ this.englishDateWithTimeToGermanDate(compareDateFrom) }} - {{ this.englishDateWithTimeToGermanDate(compareDateTo) }}</div>
            </div>
          </div>

          <div class="wrapper-card">
            <div class="inner-wrapper">
              <div class="title">Neue Suchprofile</div>
              <div class="count">{{ getDataTotal(key, ['Qualifizierter Lead']) }}</div>
              <div class="delta" :class="{'positiv': this.calcDelta( getDataTotal(key, ['Qualifizierter Lead']), getDataTotal(this.compareFetchedData[index], ['Qualifizierter Lead']) ) > 0 }">
                <ArrowUpIcon></ArrowUpIcon>
                <ArrowDownIcon></ArrowDownIcon>
                {{ this.calcDelta( getDataTotal(key, ['Termin']), getDataTotal(this.compareFetchedData[index], ['Qualifizierter Lead']) ) }} %
              </div>
              <div class="compare-count">vs. {{ getDataTotal(this.compareFetchedData[index], ['Qualifizierter Lead']) }}</div>
              <div class="compare-date">{{ this.englishDateWithTimeToGermanDate(compareDateFrom) }} - {{ this.englishDateWithTimeToGermanDate(compareDateTo) }}</div>
            </div>
          </div>

          <div class="wrapper-card">
            <div class="inner-wrapper">
              <div class="title">Termine</div>
              <div class="count">{{ getDataTotal(key, ['Termin']) }}</div>
              <div class="delta" :class="{'positiv': this.calcDelta( getDataTotal(key, ['Termin']), getDataTotal(this.compareFetchedData[index], ['Termin']) ) > 0 }">
                <ArrowUpIcon></ArrowUpIcon>
                <ArrowDownIcon></ArrowDownIcon>
                {{ this.calcDelta( getDataTotal(key, ['Termin']), getDataTotal(this.compareFetchedData[index], ['Termin']) ) }} %
              </div>
              <div class="compare-count">vs. {{ getDataTotal(this.compareFetchedData[index], ['Termin']) }}</div>
              <div class="compare-date">{{ this.englishDateWithTimeToGermanDate(compareDateFrom) }} - {{ this.englishDateWithTimeToGermanDate(compareDateTo) }}</div>
            </div>
          </div>

          <div class="wrapper-card" style="cursor:pointer;" @click="clickTile('reservation', index)">
            <div class="inner-wrapper">
              <div class="title">Reservierungen</div>
              <div class="count">{{ getDataTotal(key, ['Reservierung']) }}</div>
              <div class="delta" :class="{'positiv': this.calcDelta( getDataTotal(key, ['Reservierung']), getDataTotal(this.compareFetchedData[index], ['Reservierung']) ) > 0 }">
                <ArrowUpIcon></ArrowUpIcon>
                <ArrowDownIcon></ArrowDownIcon>
                {{ this.calcDelta( getDataTotal(key, ['Reservierung']), getDataTotal(this.compareFetchedData[index], ['Reservierung']) )}} %
              </div>
              <div class="compare-count">vs. {{ getDataTotal(this.compareFetchedData[index], ['Reservierung']) }}</div>
              <div class="compare-date">{{ this.englishDateWithTimeToGermanDate(compareDateFrom) }} - {{ this.englishDateWithTimeToGermanDate(compareDateTo) }}</div>
            </div>
          </div>

          <div class="wrapper-card" style="cursor:pointer;" @click="clickTile('sales', index)">
            <div class="inner-wrapper">
              <div class="title">Verkäufe</div>
              <div class="count">{{ getDataTotal(key, ['Verkauf']) }}</div>
              <div class="delta" :class="{'positiv': this.calcDelta( getDataTotal(key, ['Verkauf']), getDataTotal(this.compareFetchedData[index], ['Verkauf']) ) > 0 }">
                <ArrowUpIcon></ArrowUpIcon>
                <ArrowDownIcon></ArrowDownIcon>
                {{ this.calcDelta( getDataTotal(key, ['Verkauf']), getDataTotal(this.compareFetchedData[index], ['Verkauf']) )}} %
              </div>
              <div class="compare-count">vs. {{ getDataTotal(this.compareFetchedData[index], ['Verkauf']) }}</div>
              <div class="compare-date">{{ this.englishDateWithTimeToGermanDate(compareDateFrom) }} - {{ this.englishDateWithTimeToGermanDate(compareDateTo) }}</div>
            </div>
          </div>

          <div class="wrapper-graphs" :class="index" v-if="showGraphs && clickedTileName === 'leads' && clickedTilCounty === index">

            <div class="processing-time">
              <div class="title">Bearbeitungszeit im Schnitt</div>
              <StopwatchIcon></StopwatchIcon>
              <div class="time">{{ reportDataLeadsProcessTime.hours }} H {{ reportDataLeadsProcessTime.minutes }} Min</div>
              <div class="compare">
                <div class="time"></div>
                <div class="date"></div>
              </div>
            </div>

            <PieChart :labels="reportDataLeadsWithPhone.labels" :data="reportDataLeadsWithPhone.data" :colors="reportDataLeadsWithPhone.colors">Leads mit Telefonnummer</PieChart>

            <PieChart :labels="reportDataLeadsCustomerType.labels" :data="reportDataLeadsCustomerType.data" :colors="reportDataLeadsCustomerType.colors">Leads nach Kundenart</PieChart>

            <PieChart :labels="reportDataLeadsStatus.labels" :data="reportDataLeadsStatus.data" :colors="reportDataLeadsStatus.colors">Leads nach Kundenstatus</PieChart>

            <BarChart :labels="reportDataLeadsUnqualified.labels" :data="reportDataLeadsUnqualified.data" :colors="reportDataLeadsUnqualified.colors" legendLabel="Leads">Disqualifizierte Leads nach Absagegrund</BarChart>

            <BarChart :labels="reportDataLeadsProject.labels" :data="reportDataLeadsProject.data" :colors="reportDataLeadsProject.colors" legendLabel="Leads" v-if=" projectName === '' || projectName === 'Alle' ">Leads nach Projekten</BarChart>

            <BarChart :labels="reportDataLeadsSource.labels" :data="reportDataLeadsSource.data" :colors="reportDataLeadsSource.colors" legendLabel="Leads">Leads nach Quellen</BarChart>

            <BarChart :labels="reportDataLeadsAgents.labels" :data="reportDataLeadsAgents.data" :colors="reportDataLeadsAgents.colors" legendLabel="Leads">Leads nach Maklern</BarChart>

            <BarChart :labels="reportDataLeadsUnits.labels" :data="reportDataLeadsUnits.data" :colors="reportDataLeadsUnits.colors" legendLabel="Leads" v-if=" projectName !== '' && projectName !== 'Alle' ">Leads nach Einheiten</BarChart>

            <TableChart :columnHeadlines="reportDataLeadsList.labels" :rowDatas="reportDataLeadsList.data" >Leadaufstellung</TableChart>

          </div>


          <div class="wrapper-graphs" :class="index" v-if="showGraphs && clickedTileName === 'reservation' && clickedTilCounty === index">

            <BarChart :labels="reportDataDynamicConversionAgents.labels" :data="reportDataDynamicConversionAgents.data" :colors="reportDataDynamicConversionAgents.colors" legendLabel="Conversion %">Reservierungen nach Maklern</BarChart>

            <BarChart :labels="reportDataDynamicConversionProjects.labels" :data="reportDataDynamicConversionProjects.data" :colors="reportDataDynamicConversionProjects.colors" legendLabel="Conversion %">Reservierungen nach Projekten</BarChart>

            <BarChart :labels="reportDataDynamicConversionSources.labels" :data="reportDataDynamicConversionSources.data" :colors="reportDataDynamicConversionSources.colors" legendLabel="Conversion %">Reservierungen nach Quellen</BarChart>

            <div class="general-conversion">Reservierungsrate: <b>{{ reportDataDynamicConversionTotal }} %</b></div>
            <div class="general-conversion">Reservierungssvolumen: <b>{{ reportDataDynamicConversionList.realEstateTotalSellValue }} €</b></div>
            <TableChart :columnHeadlines="reportDataDynamicConversionList.labels" :rowDatas="reportDataDynamicConversionList.data" >Verkaufsaufstellung</TableChart>

          </div>


          <div class="wrapper-graphs" :class="index" v-if="showGraphs && clickedTileName === 'sales' && clickedTilCounty === index">

            <BarChart :labels="reportDataDynamicConversionAgents.labels" :data="reportDataDynamicConversionAgents.data" :colors="reportDataDynamicConversionAgents.colors" legendLabel="Conversion %">Conversions nach Maklern</BarChart>

            <BarChart :labels="reportDataDynamicConversionProjects.labels" :data="reportDataDynamicConversionProjects.data" :colors="reportDataDynamicConversionProjects.colors" legendLabel="Conversion %">Conversions nach Projekten</BarChart>

            <BarChart :labels="reportDataDynamicConversionSources.labels" :data="reportDataDynamicConversionSources.data" :colors="reportDataDynamicConversionSources.colors" legendLabel="Conversion %">Conversions nach Quellen</BarChart>

            <div class="general-conversion">Conversionrate: <b>{{ reportDataDynamicConversionTotal }} %</b></div>
            <div class="general-conversion">Verkaufsvolumen: <b>{{ reportDataDynamicConversionList.realEstateTotalSellValue }} €</b></div>
            <TableChart :columnHeadlines="reportDataDynamicConversionList.labels" :rowDatas="reportDataDynamicConversionList.data" >Verkaufsaufstellung</TableChart>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>

.reporting-wrapper {
  width: 100%;
}

.top-action {
  display: flex;
  padding: 25px;
  align-items: baseline;
}

label.ph {
  background-color: white;
}

.field-wrapper > span {
  display: block;
}

.top-action .field-wrapper + .field-wrapper, .top-action .field-wrapper + .button {
  margin-left: 25px;
}

.top-action-bar {
  display: flex;
  justify-content: end;
  margin: 25px 25px 0;
}

.reporting-body {
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
  justify-content: space-between;
}

.column {
  flex-basis: 25%;
  min-width: 400px;
}

.action-bar-top {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
  align-items: center;
  padding: 25px;
  background-color: var(--dark-gray);
  border-bottom: solid 1px rgba(255,255,255,0.2);
}

.column-title {
  position: sticky;
  top: 90px;
  background-color: var(--dark-gray);
  padding: 10px 30px 30px;
  text-align: center;
  font-size: 16px;
  color: white;
  min-width: 220px;
  z-index: 1;
}

.action-bar-top {
  position:sticky;
  top:0;
  z-index: 2;
}

.action-bar-top-inner-wrapper {
  display: flex;
  color: white;
}

.action-bar-top-inner-wrapper a,
.action-bar-top-inner-wrapper a > span {
  display: flex;
  align-items: center;
}

a {
  cursor: pointer;
}

.action-bar-top-inner-wrapper a + a {
  margin-left: 35px;
}

.action-bar-top-inner-wrapper i {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  background: var(--blue);
  border-radius: 50%;
  text-align: center;
  margin-right: 10px;
}

.action-bar-top-inner-wrapper a.filter i {
  font-size: 12px;
}

.single-top-menu-item {
  display: flex;
  margin-left: 35px;
  cursor: pointer;
}

.single-top-menu-item > span {
  display: flex;
  align-items: center;
}

.single-top-menu-item .field-wrapper {
  margin-left:15px;
}

.single-top-menu-item .field-wrapper input {
  width: 0;
  padding: 12px 0;
  border-width: 0;
  transition: width 0.2s, padding 0.2s;
}

.single-top-menu-item .field-wrapper.active input {
  width: 300px;
  padding: 12px 10px;
}

::placeholder {
  color: var(--light-gray);
  opacity: 1; /* Firefox */
}

.ph {
  background: transparent;
}

.canban-search .loading-animation {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  margin-top: 0;
  color: white;
}

.remove-active-filters {
  flex-basis: 100%;
  color: var(--red);
  cursor: pointer;
}

.loading-screen {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999999;
  background: rgba(255,255,255,.9);
}

.loading-screen .loading-animation {
  position: fixed;
  left: 50%;
  top: 50%;
  font-size: 50px;
}

.timerange-selection {
  margin-left: 10px;
  margin-top: -16px;
}

.timerange-selection .title {
  color: white;
}

.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.7);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.loading-animation {
  margin: 0;
  font-size: 40px;
}

.looper {
  width: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.looper .row {
  margin-top: 50px;
}

.row > .title {
  font-size: 20px;
  margin-bottom: 15px;
  flex-basis: 100%;
  color: var(--dark-gray);
}

.row .wrapper-card {
  padding: 15px;
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  flex-basis: 18%;
  text-align: center;
  color: var(--dark-gray);
}

.wrapper-card .title {
  font-size: 16px;
  margin-bottom: 20px;
  text-decoration: underline;
}

.count {
  font-size: 20px;
}
.delta i {
  margin-right: 5px;
}
.delta {
  margin-bottom: 20px;
  color: var(--red);
}
.delta .fa-up {
  display: none;
}
.delta.positiv {
  color: var(--green);
}
.delta.positiv .fa-up {
  display: inline-block;
}
.delta.positiv .fa-down {
  display: none;
}

.compare-date, .compare-count {
  font-size: 12px;
  line-height: 1.4em
}

.pre-selections {
  display: flex;
}

.pre-selections .button + .button {
  margin-left: 15px;
}

.wrapper-graphs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  width: 100%;
}

.wrapper-graphs > div {
  width: 30%;
  margin-top: 50px;
}

.processing-time {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  color: var(--dark-gray);
}

.processing-time > div  {
  flex-basis: 100%;
}

.processing-time .title {
  font-size: 20px;
  text-align: center;
}

.processing-time i {
  font-size: 200px;
}

.processing-time .time {
  font-size: 20px;
  text-align: center;
}

.wrapper-graphs > div.table-chart {
  width: 100%;
}

.general-conversion {
  font-size: 20px;
  color: black;
}

@media (max-width: 767px) {
  .reporting-wrapper {
    margin-top: var(--pseudoMarginTop);
  }
}

</style>
