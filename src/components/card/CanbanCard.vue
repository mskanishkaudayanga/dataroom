<script>

  import EditIcon from "@/components/icons/icon-edit.vue";
  import ImageFlagGerman from "@/components/images/flag-german.vue";
  import InfoIcon from "@/components/icons/icon-info.vue";
  import DeleteIcon from "@/components/icons/icon-delete.vue";
  import ArrowRightIcon from "@/components/icons/icon-arrow-right.vue";
  import SearchIcon from "@/components/icons/icon-search.vue";
  import EurocointIcon from "@/components/icons/icon-eurocoin.vue";
  import BankhouseIcon from "@/components/icons/icon-bankhouse.vue";
  import axios from "axios";
  import ImageFlagEnglish from "@/components/images/flag-english.vue";
  import ArrowLeftIcon from "@/components/icons/icon-arrow-left.vue";
  import ArrowCircleIcon from "@/components/icons/icon-arrow-circle.vue";
  import { ref, onMounted, onUnmounted } from 'vue';
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import BadgeCheckIcon from "@/components/icons/icon-badge-check.vue";
  import ToolTip from "@/components/utility/ToolTip.vue";
  import ImageFlagFrance from "@/components/images/flag-france.vue";
  import ImageFlagNetherland from "@/components/images/flag-netherland.vue";
  import ImageFlagSpain from "@/components/images/flag-spain.vue";
  import PersonIcon from "@/components/icons/icon-person.vue";
  import DataroomLoginIcon from "@/components/icons/icon-dataroom-login.vue";
  import LinkIcon from "@/components/icons/icon-link.vue";
  import ImageFlagPoland from "@/components/images/flag-poland.vue";
  import ImageFlagUkrain from "@/components/images/flag-ukrain.vue";

  export default {
    name: "CanbanCard",
    props: {
      leadData: {
        type: Object,
        default: []
      },
      type: {
        type: String,
        default: 'lead'
      },
      colorSchema: {
        type: Object,
        default: []
      },
      triggerReloadNotices: {
        type: String,
        default: ''
      },
      triggerReloadCustomerData: {
        type: Object,
        default: {}
      },
      notificationsForSearchCriteriaMerge: {
        type: [Array, Object],
        default: {}
      },
    },
    components: {
      ImageFlagUkrain,
      ImageFlagPoland,
      LinkIcon,
      DataroomLoginIcon,
      PersonIcon,
      ImageFlagSpain,
      ImageFlagNetherland,
      ImageFlagFrance,
      ToolTip,
      BadgeCheckIcon,
      AnimateCircleIcon,
      ArrowCircleIcon,
      ArrowLeftIcon,
      ImageFlagEnglish,
      BankhouseIcon,
      EurocointIcon,
      SearchIcon, ArrowRightIcon, DeleteIcon, InfoIcon, ImageFlagGerman, EditIcon},
    data() {
      return {
        apiCustomerData: [],
        wasInViewport: false,
        isCurrentlyInViewport: false,
        isLoading: false,
        userRole: 0,
        cardHeight: 0, // min height is 300px
        latestRealEstateChangeTimestamp: '',
        latestRealEstateChangeRealEstateNr: '',
        latestRealEstateChangeProjectName: '',
        isLoadingNotices: false,
        apiAllNotices: '',
        apiReservationData: '',
      }
    },
    methods: {
      getCustomerData() {

        this.isLoading = true;
        axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerDataBySysId?system_id='+this.leadData.adresse_id+'&company='+this.leadData.unternehmen)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.apiCustomerData = response.data.response;
                    this.getNotices();
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
      getReservationData() {

        if( this.leadData.canban_temp_reservation_id === '' || this.leadData.canban_temp_reservation_id === null || typeof this.leadData.canban_temp_reservation_id === 'undefined') {
          return;
        }

        if ( this.leadData.unternehmen === 'kg' ) {
          axios.get(this.globalApiBaseUrl + '/canban/getTempReservationData?activityId='+this.leadData.aktivititaet_id)
              .then(
                  (response) => {
                    if ( response.data.status === 200 ){
                      this.apiReservationData = response.data.response;
                    }
                  }
              )
              .catch(
                  (error) => {
                    console.log(error);
                  }
              )
        } else if ( this.leadData.unternehmen === 'living' ){
          let data = JSON.stringify({
            "reservationId": this.leadData.cockpit_reservation_id
          });
          axios({ method: 'post', url: this.globalApiBaseUrl + '/reservations/getReservationsRealEstate', data: data })
              .then(
                  (response) => {
                    if ( response.data.status === 200 ){
                      this.apiReservationData = response.data.response;
                    }
                  }
              )
              .catch(
                  (error) => {
                    console.log(error);
                  }
              )
        }
      },
      checkQualifiedIcons(type) {
        let data = this.leadData.canban_searchcriteria;
        if ( typeof data === 'undefined' || data === null || data === '' ) {
          return false;
        }
        data = JSON.parse(data);
        if ( (type === 'finance' && data.kindOfFinance === 'Eigene Mittel') || (type === 'approved' && (data.approvedFinance === true || data.approvedFinance === 'true')) ) {
          return true;
        }
        return false;
      },
      checkIfIsUnqualifiedIsNotOutdated() {
        // it is outdated when 6 weeks since set to unqualified past
        if ( this.type === 'unqualified') {
          const currentDate = new Date();
          const sixWeeksAgo = new Date(currentDate.getTime() - (6 * 7 * 24 * 60 * 60 * 1000));

          const targetDate = new Date(this.leadData.canban_unqualified_datetime);
          if (targetDate < sixWeeksAgo) {
            return false;
          } else {
            return true;
          }
        }
      },
      checkIfCustomerIsInQualified() {
        let customerIdsInQualified = this.getCanbaQualifiedLeadCustomerSysIds();
        return customerIdsInQualified.includes(this.leadData.adresse_id);
      },
      getRealEstateChanges() {
        if ( this.leadData.canban_changed_real_estate !== undefined && this.leadData.canban_changed_real_estate !== null && this.leadData.canban_changed_real_estate !== '' ){
          if (typeof this.leadData.canban_changed_real_estate !== 'object') {
            this.leadData.canban_changed_real_estate = JSON.parse(this.leadData.canban_changed_real_estate);
            let keys = Object.keys(this.leadData.canban_changed_real_estate);
            this.latestRealEstateChangeTimestamp = keys[keys.length -1]
            let dataOfChange =  this.leadData.canban_changed_real_estate[keys[keys.length - 1]]
            this.latestRealEstateChangeRealEstateNr = dataOfChange.real_estate_id;
            this.latestRealEstateChangeProjectName = dataOfChange.real_estate_project_name;
          }
        }
      },
      getNotices(){

        if ( typeof this.leadData === undefined || this.leadData.adresse_id === '' ) {
          return;
        }

        this.isLoadingNotices = true;
        axios.get(this.globalApiBaseUrl + '/canban/getAllAddressNotices?leadId=' + this.leadData.aktivititaet_id)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiAllNotices = response.data.response;
                  } else {
                    this.apiAllNotices = '';
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally(
            () => {
              this.isLoadingNotices = false;
            })
      },
      formatDateForCard(dateString) {
        if ( typeof dateString === 'undefined' || dateString === '' || dateString === null ) {
          return '';
        }

        const inputString = dateString;
        const dateTimeArray = inputString.split(" ");

        const date1 = dateTimeArray[0];
        let time1 = dateTimeArray[1];
        const date2 = dateTimeArray[2];
        let time2 = dateTimeArray[3];

        let checkTime1Array = time1.split(":");
        if ( checkTime1Array.length >= 3 ) {
          time1 = checkTime1Array[0] + ':' + checkTime1Array[1];
        }

        let checkTime2Array = time2.split(":");
        if ( checkTime2Array.length >= 3 ) {
          time2 = checkTime2Array[0] + ':' + checkTime2Array[1];
        }

        const outputString = `${date1} ${time1} - ${time2}`;
        return outputString;
      },
      skipSearchCriteria(activityId) {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let data = {
          "activityId": activityId
        }

        axios({ method: 'post', url: this.globalApiBaseUrl + '/canban/leadToFollowUpStatusByMicroservice', data: data })
            .then(
                (response) => {
                  this.$emit('reloadCanban', this.makeid(30));
                  if (response.data.status === 200) {
                    this.notificationBannerInit('success', 'Lead erfolgreich verschoben');
                  } else {
                    this.notificationBannerInit('warning', 'Lead konnte nicht verschoben werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally(() => {
              this.isLoading = false;
        })

      }
    },
    computed: {
      getColorOfActivity() {
        let colorSchema = this.colorSchema;
        let searchString = this.leadData.aktivititaet_herkunft_kontakt;

        if ( typeof searchString === undefined || searchString === '') {
          return '';
        }

        if ( typeof colorSchema === undefined || colorSchema === '' || typeof colorSchema.length === undefined ||colorSchema.length >= 0) {
          return '';
        }

        if ( searchString.includes('ebay') ) {
          searchString = 'Kleinanzeigen';
        }

        if ( typeof colorSchema[searchString] !== 'undefined' ) {
          return 'background-color:'+colorSchema[searchString]['colorCode'];
        }

        return '';
      },
      maklerShortname() {
        let allAgents = this.getAgentsData();

        if ( allAgents.length === 0 ) {
          return '';
        }

        let agentsFromCompany = allAgents[this.leadData.unternehmen]['list_of_all_users_data'];

        let maklerNameWithoutPrefix = this.removeDBPrefixes(this.leadData.makler_s)

        // console.log(agentsFromCompany);

        if ( typeof agentsFromCompany !== undefined ) {
          let returnVal = maklerNameWithoutPrefix;
          Object.keys(agentsFromCompany).forEach((index) => {
            if ( typeof this.leadData.external_agent_mail !== 'undefined' && this.leadData.external_agent_mail !== '' && this.leadData.external_agent_mail !== null ) {
              // console.log(agentsFromCompany[index]['user_email']);
              if ( agentsFromCompany[index]['user_email'] === this.leadData.external_agent_mail ) {
                returnVal = agentsFromCompany[index]['user_Vorname'];
                return
              }
            } else if ( agentsFromCompany[index]['user_Name'] === maklerNameWithoutPrefix ) {
              returnVal = agentsFromCompany[index]['user_Nachname'];
              return
            }
          });
          return returnVal;
        } else {
          return maklerNameWithoutPrefix;
        }

      },
      formatedDate() {
        if ( this.leadData.datum_letzte_aenderung ) {
          const date = new Date(this.leadData.datum_letzte_aenderung);
          return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        } else {
          return '';
        }
      },
      formatedTime() {
        if ( this.leadData.datum_letzte_aenderung ) {
          const date = new Date(this.leadData.datum_letzte_aenderung);
          return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        } else {
          return '';
        }
      },
      daysLeftSinceCreation() {
        if ( this.leadData.datum_letzte_aenderung ) {
          const date1 = new Date(this.leadData.datum_letzte_aenderung);
          const date2 = new Date();
          const diffTime = Math.abs(date2 - date1);
          return Math.ceil(diffTime / (1000 * 60 * 60));
        } else {
          return '';
        }
      },
      cleanUpTaskId() {
        if ( typeof this.leadData.task_id !== undefined && this.leadData.task_id !== null && this.leadData.task_id.includes('|') ) {
          return this.leadData.task_id.replaceAll('|', '');
        }
        return this.leadData.task_id
      },
      renderAppointmentData() {
        let date = this.leadData.termin;
        return 'Termin: '+this.formatDateForCard(date);
      },
      renderNotaryAppointmentData() {
        let date = this.leadData.notary_appointment_date;

        let prefix = 'Termin: ';
        if ( parseInt(this.leadData.temp_reservation_status) === -2 ) {
          prefix = 'Abgesagt: ';
        }

        return prefix+this.formatDateForCard(date);
      },
      checkIfIsCypressTestCard() {
        let customerData = this.leadData.adresse_name.toLowerCase();
        if ( customerData.includes('patrick koll') ) {
          return 'testlead';
        }
      },
      dynamicRouterNameInformationModal() {
        let canbanModalLeadInformation = 'canbanModalLeadInformation';
        if (this.$route.name === 'canbanToolUnqualifiedLeads') {
          return canbanModalLeadInformation+'Unqualified';
        } else if(this.$route.name === 'canbanToolDeniedLeads') {
          return canbanModalLeadInformation+'Denied';
        }
        return canbanModalLeadInformation;
      },
      checkForChangeRealEstate() {
        let latestRealEstateNr = this.leadData.immo_nr;
        let changedData = this.leadData.canban_changed_real_estate;
        let latestTimestamp = '';
        if ( typeof changedData !== undefined && changedData !== '' && changedData !== null ) {
          if ( typeof changedData === 'string' ) {
            changedData = JSON.parse(changedData);
          }
          Object.entries(changedData).forEach(([index, value]) => {
            if ( latestTimestamp === '' ) {
              latestRealEstateNr = value.real_estate_id
            }
            if ( index >= latestTimestamp ) {
              latestRealEstateNr = value.real_estate_id
            }
          })
        }
        return latestRealEstateNr;
      },
      getAllReservationRealEstates() {

        if ( this.leadData.canban_temp_reservation_id === '' || this.leadData.canban_temp_reservation_id === null || typeof this.leadData.canban_temp_reservation_id === 'undefined' || this.apiReservationData === '' ) {
          return;
        }

        let returnVal = {};

        if ( typeof this.leadData.canban_temp_reservation_id !== undefined && this.leadData.canban_temp_reservation_id !== '' ) {
          let allRealEstates = this.apiReservationData[0].real_estates.real_estates;
          Object.entries(allRealEstates).forEach(([index, value]) => {
            if ( typeof returnVal[value.real_estate_project_name] === 'undefined' ) {
              returnVal[value.real_estate_project_name] = [];
            }
            returnVal[value.real_estate_project_name].push(value.real_estate_id)
          })

        } else {

          let allRealEstates = this.apiReservationData;
          Object.entries(allRealEstates).forEach(([index, value]) => {
            if ( typeof returnVal[value.project_name] === 'undefined' ) {
              returnVal[value.project_name] = [];
            }
            returnVal[value.project_name].push(value.estate_nr)
          })

        }

        return returnVal;
      },
      getReservationId() {
        if ( typeof this.leadData.canban_temp_reservation_id !== 'undefined' && this.leadData.canban_temp_reservation_id !== null && this.leadData.canban_temp_reservation_id !== '' ) {
          return this.leadData.canban_temp_reservation_id;
        }
        if ( typeof this.leadData.cockpit_reservation_id !== 'undefined' && this.leadData.cockpit_reservation_id !== null && this.leadData.cockpit_reservation_id !== '' ) {
          return this.leadData.cockpit_reservation_id;
        }
        return false;
      },
      checkIfNewMergeIsRequested() {
        if ( typeof this.notificationsForSearchCriteriaMerge !== 'undefined'
            && !this.isEmpty(this.notificationsForSearchCriteriaMerge)
            && typeof this.apiCustomerData !== 'undefined'
            && !this.isEmpty(this.apiCustomerData) ) {

            return this.notificationsForSearchCriteriaMerge?.[this.apiCustomerData.client_id]?.open_merge_requests !== undefined ? this.notificationsForSearchCriteriaMerge?.[this.apiCustomerData.client_id]?.open_merge_requests : [];
        }
      }
    },
    mounted() {
      // Get a reference to the element
      const element = this.$refs[this.leadData.aktivititaet_id];

      // Create a new Intersection Observer instance
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if ( entry.isIntersecting && !this.wasInViewport ) {
            this.wasInViewport = true;
            this.getCustomerData();
            this.getReservationData();
          }
          if ( entry.isIntersecting ) {
            this.isCurrentlyInViewport = true;
          }
        });
      });

      observer.observe(element);

      this.observer = observer;

      onUnmounted(() => {
        // Disconnect the observer when the component is unmounted
        this.observer.disconnect();
      });

      this.userRole = this.getUserRole();

      this.getRealEstateChanges();
    },
    updated() {
      this.getRealEstateChanges();
    },
    watch: {
      triggerReloadNotices: function(newVal) {
        this.getNotices();
      },
      triggerReloadCustomerData: {
        handler:function(newVal) {
          if ( newVal.customerSysId === this.leadData.adresse_id ){
            this.getCustomerData();
          }
        },
        deep:true
      },
    },
  }
</script>

<template>
  <div class="card-wrapper" :ref="leadData.aktivititaet_id" :style="{height: (apiCustomerData.length === 0 ? '300px' : 'auto')}" :class="{'is-outdated': !this.checkIfIsUnqualifiedIsNotOutdated()}">

    <div class="card-inner-wrapper" :style="isLoading ? 'overflow:hidden' : ''" :data-cy="checkIfIsCypressTestCard" v-show="isCurrentlyInViewport">

      <!-- LOADING SCREEN-->
      <div class="loading-screen" v-if="isLoading"><AnimateCircleIcon></AnimateCircleIcon></div>

      <div class="card-header">
        <div class="customer-name">
          <div>
            {{ leadData.adresse_name }}
            <span class="is-qualified-banner" v-if="this.checkIfCustomerIsInQualified() && type !== 'qualified' && type !== 'reserved'">
              <ToolTip :content="'Kunde ist bereits in Qualifiziert'" :hover-text="'<BadgeCheckIcon>'"></ToolTip>
            </span>
          </div>
          <div v-if="apiCustomerData.client_phone">{{apiCustomerData.client_phone}}</div>
        </div>
        <div>
          <span class="is-requested-merge" v-if="checkIfNewMergeIsRequested && parseInt(leadData.canban_status) > 1">
            <router-link :to="{name: 'canbanModalEditLeadOnlyDataroom', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}">
              <ToolTip :content="'Kunde hat sein Suchprofil angepasst.'" :hover-text="'<InfoIcon>'"></ToolTip>
            </router-link>
          </span>
        </div>
      </div>
      <div class="lead-meta-data customer">
        <span>
          <span class="flags" v-if="apiCustomerData.client_language">
            <ImageFlagEnglish v-if="apiCustomerData.client_language === 'ENG'"></ImageFlagEnglish>
            <ImageFlagFrance v-else-if="apiCustomerData.client_language === 'FRA'"></ImageFlagFrance>
            <ImageFlagNetherland v-else-if="apiCustomerData.client_language === 'NLD'"></ImageFlagNetherland>
            <ImageFlagSpain v-else-if="apiCustomerData.client_language === 'ESP'"></ImageFlagSpain>
            <ImageFlagPoland v-else-if="apiCustomerData.client_language === 'POL'"></ImageFlagPoland>
            <ImageFlagUkrain v-else-if="apiCustomerData.client_language === 'CHE'"></ImageFlagUkrain>
            <ImageFlagGerman v-else></ImageFlagGerman>
          </span>
          <span>{{ apiCustomerData.client_id }}</span>
          <span class="searchcriteria-modal" v-if="leadData.aktivititaet_id && leadData.canban_searchcriteria"><router-link :to="{name: 'canbanModalShowSearchCriteria', params:{ activityId: leadData.aktivititaet_id }}"><SearchIcon></SearchIcon></router-link></span>
          <span>|</span>
          <span>{{ maklerShortname }}
            <router-link v-if="leadData.aktivititaet_id && type !== 'denied' && type !== 'unqualified' && type !== 'reserved' && type !== 'notaryappointment' && type !== 'sale' && (userRole >= 3 || this.getUserId() === 68)" :to="{name: 'canbanModalChangeAgent', params:{ activityId: leadData.aktivititaet_id, company: leadData.unternehmen }}"><EditIcon></EditIcon></router-link></span>
        </span>

        <span>
          <span class="label" :class="{'new': leadData.aktivititaet_aktionsart === 'Neu' || leadData.aktivititaet_aktionsart === 'Neu Miete'}">{{ leadData.aktivititaet_aktionsart }}</span>
          <span class="info-action">
            <router-link v-if="leadData.aktivititaet_id && cleanUpTaskId" :to="{name: dynamicRouterNameInformationModal, params:{ id: leadData.aktivititaet_id, company: leadData.unternehmen, customerSysId: leadData.adresse_id  }}"><InfoIcon></InfoIcon></router-link>
          </span>
          <span class="info-action">
             <router-link :to="{name: 'canbanModalEditCustomerData', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}"><PersonIcon></PersonIcon></router-link>
          </span>
        </span>
      </div>

      <div class="lead-meta-data real-estate">
        <div class="label" :style="getColorOfActivity" v-if="leadData.aktivititaet_herkunft_kontakt && type !== 'wv'">{{ leadData.aktivititaet_herkunft_kontakt }}</div>
        <div class="label" :style="getColorOfActivity" v-else-if="type === 'wv'">Wiedervorlage bis {{ this.englishDateWithTimeToGermanDate(leadData.canban_wv_datetime) }}</div>
        <div class="label appointment" v-else>{{ leadData.aktivititaet_aktionstyp }}</div>
        <div class="date">
          {{ formatedDate }} | {{ formatedTime }} Uhr | {{daysLeftSinceCreation}} Std
        </div>
        <div class="date" v-if="type === 'appointment'">
          <b><u>
            {{ renderAppointmentData }}
            <router-link style="margin-left: 5px;" :to="{name: 'canbanModalEditAppointment', params:{ id: leadData.aktivititaet_id, appointmentId: leadData.termin_id_oo }}"><EditIcon></EditIcon></router-link>
          </u></b>
        </div>
        <div class="date" v-else-if="type === 'notaryappointment'">
          <b><u>
            {{ renderNotaryAppointmentData }}
            <router-link style="margin-left: 5px;" :to="{name: 'canbanModalEditNotaryAppointment', params:{ id: leadData.aktivititaet_id, reservationId: getReservationId, tempReservationStatus: leadData.temp_reservation_status }}"><EditIcon></EditIcon></router-link>
          </u></b>
        </div>

        <div class="real-estate-data" v-if="parseInt(leadData.canban_status) < 3 && (leadData.canban_temp_reservation_id === '' || leadData.canban_temp_reservation_id === null || typeof leadData.canban_temp_reservation_id === 'undefined')">
          <div class="real-estate-projectname" v-if="leadData.projekt_name || latestRealEstateChangeProjectName">
            <span v-if="latestRealEstateChangeProjectName">{{ latestRealEstateChangeProjectName}}</span>
            <span v-else>{{ leadData.projekt_name }}</span>
            <router-link style="margin-left: 5px;" v-if="leadData.aktivititaet_id && type !== 'denied' && type !== 'unqualified' && (parseInt(leadData.canban_status) === 1 || parseInt(leadData.canban_status) === 2 )" :to="{name: 'canbanModalChangeRealEstate', params:{ id: leadData.aktivititaet_id }}"><EditIcon></EditIcon></router-link>
          </div>
          <div class="real-estate-nr" v-if="latestRealEstateChangeRealEstateNr">{{latestRealEstateChangeRealEstateNr}}</div>
          <div class="real-estate-nr" v-else>{{leadData.immo_nr}}</div>
        </div>

        <div class="real-estate-data" v-if="apiReservationData.length > 0" v-for="(value, index) in getAllReservationRealEstates">
          <div class="real-estate-projectname">
            <span>{{index === '' ? 'Kein Projektname' : index}}</span>
          </div>

          <div class="real-estate-nr" v-for="realEstate in value">
            {{realEstate}}
          </div>
        </div>

        <div class="date denie-reason" v-if="type === 'denied'">
          <b>Grund: {{ apiCustomerData.client_lead_denie_reason ? apiCustomerData.client_lead_denie_reason : 'Keine Angaben' }}</b>
        </div>
        <div class="customer-qualified-icons" v-if="leadData.aktivititaet_id && type !== 'denied' && leadData.canban_searchcriteria && ( checkQualifiedIcons('finance') || checkQualifiedIcons('approved') )">
          <span v-if="checkQualifiedIcons('finance')"><ToolTip :hover-text="'<EurocointIcon>'" :content="'Eigenkapital vorhanden'"></ToolTip></span>
          <span v-if="checkQualifiedIcons('approved')"><ToolTip :hover-text="'<BankhouseIcon>'" :content="'Finanzierung zugesagt'"></ToolTip></span>
        </div>
      </div>

      <AnimateCircleIcon v-if="isLoadingNotices"></AnimateCircleIcon>
      <div class="notice" v-if="!isLoadingNotices">

        <div class="notice-inner-wrapper">

          <div class="notice-content" v-if="typeof apiAllNotices !== undefined && apiAllNotices !== ''">
            {{apiAllNotices[0].notice}}
          </div>
          <div v-else>
            Notiz erstellen
          </div>
          <div class="notice-edit">
            <router-link :to="{name: 'canbanModalCreateEditNotice', params:{ id: leadData.aktivititaet_id }}">
              <EditIcon></EditIcon>
            </router-link>
          </div>

        </div>

      </div>

      <!-- Lead Col -->
      <div class="actions" v-if="leadData.aktivititaet_id && parseInt(leadData.canban_status) === 0 && type === 'lead'">
        <router-link :to="{name: 'canbanModalDeleteLead', params:{ id: leadData.aktivititaet_id }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <a class="move-direct" @click="skipSearchCriteria(leadData.aktivititaet_id)">
          <ArrowRightIcon></ArrowRightIcon>
        </a>
        <router-link :to="{name: 'canbanModalEditLead', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}" class="next"><ArrowRightIcon></ArrowRightIcon></router-link>
      </div>

      <!-- Denied Leads -->
      <div class="actions" v-if="leadData.aktivititaet_id && type === 'denied'">
        <router-link :to="{name: 'canbanModalDeleteLeadPermanent', params:{ id: leadData.aktivititaet_id }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <router-link :to="{name: 'canbanModalEditLeadBackToLV', params:{ id: leadData.aktivititaet_id }}" class="toLv"><ArrowCircleIcon></ArrowCircleIcon></router-link>
        <router-link :to="{name: 'canbanModalEditLeadBackToAgent', params:{ id: leadData.aktivititaet_id }}" class="next"><ArrowLeftIcon></ArrowLeftIcon></router-link>
      </div>

      <!-- Appointment Leads -->
      <div class="actions" v-if="leadData.aktivititaet_id && type === 'appointment'">
        <router-link :to="{name: 'canbanModalDeleteAppointment', params:{ id: leadData.aktivititaet_id }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <router-link :to="{name: 'canbanModalEditLeadOnlyDataroom', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}" class="toLv" :class="{'animation-jump': checkIfNewMergeIsRequested}"><LinkIcon></LinkIcon></router-link>
      </div>

      <!-- Follow up Leads -->
      <div class="actions" v-if="leadData.aktivititaet_id && parseInt(leadData.canban_status) === 1 && type === 'lead'">
        <router-link :to="{name: 'canbanModalLeadToUnqualified', params:{ id: leadData.aktivititaet_id }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <router-link :to="{name: 'canbanModalWv', params:{ id: leadData.aktivititaet_id, type: 'followUp' }}" class="toLv"><ArrowCircleIcon></ArrowCircleIcon></router-link>
        <router-link :to="{name: 'canbanModalEditLeadOnlyDataroom', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}" class="toLv" :class="{'animation-jump': checkIfNewMergeIsRequested}"><LinkIcon></LinkIcon></router-link>
        <router-link :to="{name: 'canbanModalMakeLeadQualified', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id, realEstateNr: checkForChangeRealEstate }}" class="next"><ArrowRightIcon></ArrowRightIcon></router-link>
      </div>

      <!-- Qualified Leads -->
      <div class="actions" v-if="leadData.aktivititaet_id && parseInt(leadData.canban_status) === 2 && type === 'qualified'">
        <router-link :to="{name: 'canbanModalLeadToUnqualified', params:{ id: leadData.aktivititaet_id }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <router-link :to="{name: 'canbanModalWv', params:{ id: leadData.aktivititaet_id, type: 'qualified' }}" class="toLv"><ArrowCircleIcon></ArrowCircleIcon></router-link>
        <router-link :to="{name: 'canbanModalEditLeadOnlyDataroom', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}" class="toLv" :class="{'animation-jump': checkIfNewMergeIsRequested}"><LinkIcon></LinkIcon></router-link>
        <router-link :to="{name: 'canbanModalLeadToReservation', params:{ id: leadData.aktivititaet_id, realEstateNr: checkForChangeRealEstate }}" class="next"><ArrowRightIcon></ArrowRightIcon></router-link>
      </div>

      <!-- Reservation -->
      <div class="actions" v-if="leadData.aktivititaet_id && type === 'reserved' && getReservationId">
        <router-link :to="{name: 'canbanModalCancelReservation', params:{ id: leadData.aktivititaet_id, reservationId: getReservationId }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <router-link :to="{name: 'canbanModalEditLeadOnlyDataroom', params:{ id: leadData.aktivititaet_id, customerSysId: leadData.adresse_id }}" class="toLv" :class="{'animation-jump': checkIfNewMergeIsRequested}"><LinkIcon></LinkIcon></router-link>
        <router-link :to="{name: 'canbanModalMakeNotaryAppointment', params:{ id: leadData.aktivititaet_id, reservationId: getReservationId }}" class="next"><ArrowRightIcon></ArrowRightIcon></router-link>
      </div>

      <!-- NotaryAppointment -->
      <div class="actions" v-if="leadData.aktivititaet_id && type === 'notaryappointment' && getReservationId">
        <router-link :to="{name: 'canbanModalCancelReservation', params:{ id: leadData.aktivititaet_id, reservationId: getReservationId }}" class="delete"><DeleteIcon></DeleteIcon></router-link>
        <router-link :to="{name: 'canbanModalLeadToSale', params:{ id: leadData.aktivititaet_id }}" class="next"><ArrowRightIcon></ArrowRightIcon></router-link>
      </div>

      <!-- WV -->
      <div class="actions" v-if="leadData.aktivititaet_id && (typeof leadData.canban_wv_datetime !== 'undefined' && leadData.canban_wv_datetime !== '') && type === 'wv'">
        <router-link :to="{name: 'canbanModalWvBack', params:{ id: leadData.aktivititaet_id }}" class="next"><ArrowLeftIcon></ArrowLeftIcon></router-link>
      </div>

      <!-- Unqualified -->
      <div class="actions" v-if="leadData.aktivititaet_id && type === 'unqualified' && checkIfIsUnqualifiedIsNotOutdated()">
        <router-link :to="{name: 'canbanModalEditReactiveLead', params:{ id: leadData.aktivititaet_id }}" class="next"><ArrowLeftIcon></ArrowLeftIcon></router-link>
      </div>

    </div>
  </div>
</template>


<style scoped>

.card-wrapper {
  position: relative;
  z-index: 0;
  width: 400px;
  padding: 5px;
}

.card-inner-wrapper {
  background: white;
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  padding: 10px;
  border-radius: 5px;
}

.flags > img {
  box-shadow: 0px 0px 3px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 0px 3px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 0px 3px rgba(102, 102, 102, 0.36);
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.customer-name {
  font-weight: 700;
  margin-bottom: 10px;
  padding-bottom:5px;
  border-bottom: solid 1px var(--light-light-gray);
}

.is-qualified-banner {
  color: gold;
  font-size: 20px;
}

.is-requested-merge {
  color: orange;
  font-size: 20px;
}

.lead-meta-data {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  justify-content: space-between;
}

.lead-meta-data.customer > span {
  display: flex;
  align-items: center;
}

.lead-meta-data.customer > span > span + span {
  margin-left: 5px;
}

.info-action {
  font-size: 24px;
  color: var(--blue);
  cursor: pointer;
}

.lead-meta-data.customer img {
  width: 25px;
}

.lead-meta-data.real-estate {
  justify-content: center;
}

.lead-meta-data.real-estate > div {
  margin-bottom: 10px;
}

.date {
  flex-basis: 100%;
  text-align: center;
}

.customer-qualified-icons {
  flex-basis: 100%;
  text-align: center;
  font-size: 18px;
}

.customer-qualified-icons > span + span {
  margin-left: 10px;
}

.fa-pen {
  color: var(--blue);
}

.lead-meta-data.real-estate .real-estate-data .real-estate-projectname {
  font-weight: 700;
}

.lead-meta-data.real-estate .real-estate-data {
  text-align: center;
  width: 100%;
}

.label {
  background: var(--gray-text);
  border-radius: 10px;
  padding: 2px 10px;
  color: white;
}

.label.appointment {
  background-color: var(--red);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 25px;
  padding-top:15px;
  border-top: solid 1px var(--light-light-gray);
}

.notice-inner-wrapper {
  display: flex;
  justify-content: center;
}

.notice-edit {
  font-size: 14px;
  color: var(--blue);
  margin-left: 5px;
}

.notice-content {
  word-break: break-word;
}

.actions > a {
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.label.new {
  background-color: var(--dark-green);
}

.delete {
  background: var(--red);
}

.next {
  background: var(--blue);
}

.toLv {
  background: var(--green);
}

.card-wrapper a .card-inner-wrapper {
  height: 100%;
}

.meta-data {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.meta-data .customer-kdnr {
  margin-left: 15px;
}

.meta-data + .meta-data {
  margin-top: 10px;
}

.meta-data .processtab {
  flex-basis: 32%;
}

.card-body {
  margin-top: 10px;
}

.card-footer {
  margin-top:10px;
}

.denie-reason {
  margin-top: 15px;
  padding-top: 25px;
  border-top: solid 1px var(--light-light-gray);
}

.loading-screen {
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(255,255,255, 0.9);
  z-index: 1;
}

.searchcriteria-modal i {
  color: var(--blue);
  cursor: pointer;
}

.move-direct {
  background-color: var(--green);
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-10px);
  }
  20% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

.animation-jump {
  background-color: orange;
  display: inline-block;
  animation: jump 5s ease-in-out infinite;
}

/* Tablet */
@media (max-width: 991px){
  .title + .meta-data > div {
    display: flex;
    flex-basis: 48%;
  }
  .meta-data .customer-kdnr {
    margin-left: 0;
    justify-content: end;
  }
  .meta-data .processtab {
    flex-basis: 100%;
  }
  .meta-data .processtab + .processtab {
    margin-top: 10px;
  }
}

</style>
