<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import MailIcon from "@/components/icons/icon-mail.vue";
  import SendIcon from "@/components/icons/icon-send.vue";
  import CheckmarkWithBorderIcon from "@/components/icons/icon-checkmarkWithBorder.vue";
  import PhoneIcon from "@/components/icons/icon-phone.vue";
  import EyeIcon from "@/components/icons/icon-eye.vue";
  import SaleIcon from "@/components/icons/icon-sale.vue";
  import ReservationIcon from "@/components/icons/icon-reservation.vue";
  import CancelIcon from "@/components/icons/icon-cancle.vue";
  import ActivityIcons from "@/components/icons/ActivityIcons.vue";

  export default {
    name: "canbanModalLeadInformation",
    components: {
      ActivityIcons,
      CancelIcon,
      ReservationIcon,
      SaleIcon, EyeIcon, PhoneIcon, CheckmarkWithBorderIcon, SendIcon, MailIcon, AnimateCircleIcon, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingActivities: false,
        activityId: this.$route.params.id,
        company: this.$route.params.company,
        customerSysId: this.$route.params.customerSysId,

        taskSubject: '',
        taskNotiz: '',

        apiActivitiesResponse: [],


      }
    },
    methods: {
      getSingleLeadData() {
        axios.get(this.globalApiBaseUrl + '/canban/getSingleLead?activityId='+this.activityId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    if ( typeof response.data.response[0]['bemerkung'] !== 'undefined' ) {
                      this.taskNotiz = typeof response.data.response[0]['bemerkung'] !== 'undefined' && !this.isEmpty(response.data.response[0]['bemerkung']) ? response.data.response[0]['bemerkung'] : '';
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
            }
        )
      },
      getActivityData() {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        axios.get(this.globalApiBaseUrl + '/onoffice/getTaskDataBySysId?taskSystemId=' + this.activityId + '&company=' + this.company )
            .then(
                (response) => {
                  if ( response.status === 200 ) {
                    if ( typeof response.data.response.task_data.task_Betreff !== 'undefined' ) {
                      this.taskSubject = response.data.response.task_data.task_Betreff;
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
      getAllCustomerActivities() {

        this.isLoadingActivities = true;

        axios.get(this.globalApiBaseUrl + '/onoffice/getAllCustomerActivities?customerSysId=' + this.customerSysId + '&company=' + this.company + '&searchBothCompanies=true' )
            .then(
                (response) => {
                  if ( response.status === 200 ) {
                    this.apiActivitiesResponse = response.data.response;
                    this.apiActivitiesResponse = this.sortArray(this.apiActivitiesResponse, 'Datum', 'ASC')
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally(
            () => {
              this.isLoadingActivities = false;
            })
      },
      closeDropdowns() {
        for (const index in this.dropdownsEditUploads) {
          this.dropdownsEditUploads[index] = false;
        }
        for (const index in this.dropdownsCancelReason) {
          this.dropdownsCancelReason[index] = false;
        }
      },
      closeModal(){
        this.$router.go(-1);
      }
    },
    mounted() {
      this.getSingleLeadData();
      this.getAllCustomerActivities();
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Lead Informationen</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>

        <div class="task-notiz">
          <span v-if="taskNotiz.length > 0" v-html="this.addHtmlBreaks(taskNotiz)"></span>
          <span v-else>Keine Details vorhanden</span>
        </div>

        <div class="activities-title">Aktivitäten</div>
        <div class="activities-list" v-if="apiActivitiesResponse.length > 0">
          <table>
            <thead>
              <tr>
                <td>Datum</td>
                <td>Art</td>
                <td>Immobilien</td>
                <td>Bemerkung</td>
                <td>Betreuer</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in apiActivitiesResponse">
                <td>{{ this.englishDateWithTimeToGermanDate(activity.Datum).split(' ')[0] }}</td>
                <td style="text-align:center;">
                  <ActivityIcons :activityKind="activity.Aktionsart" :activityType="activity.Aktionstyp" :title="activity.Aktionsart+' - '+activity.Aktionstyp"></ActivityIcons>
                </td>
                <td>
                  <div v-for="realEstate in activity.Objekt_nr" v-if="activity.Objekt_nr[0] !== null">
                    <span v-if="realEstate.real_estate_name">{{realEstate.real_estate_name}}</span>
<!--                    <span v-if="realEstate.real_estate_street">{{', ' + realEstate.real_estate_street}}</span>-->
                  </div>
                </td>
                <td :title="activity.Bemerkung">{{ activity.Bemerkung !== '' ? activity.Bemerkung.substring(0, 15) + ' ...' : '-' }}</td>
                <td>{{ activity.Benutzer === 'APIKG' ? 'System' : activity.Benutzer.charAt(0).toUpperCase() + activity.Benutzer.slice(1) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="apiActivitiesResponse.length <= 0 && !isLoadingActivities">Keine Aktivitäten gefunden</div>

        <AnimateCircleIcon v-if="isLoadingActivities"></AnimateCircleIcon>

      </div>

    </div>

  </div>

</template>


<style scoped>

.title {
  font-size: 18px;
  font-weight: 700;
}

.task-subject {
  font-size: 24px;
  margin-bottom: 25px;
}

.verkaufsmeldung-data, .process-tabs-wrapper {
  display: flex;
  justify-content: space-between;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

table {
  width: 100%;
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

.iframe-view .actions.approve-init .button:last-of-type {
  flex-basis: 100%;
}

.actions.approve-init.reject-init .button:last-of-type {
  flex-basis: 48%;
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

.real-estates-list {
  height: auto;
  margin-bottom: 25px;
}

.real-estate-list-item {
  border-bottom: none;
}

.fee-conditional {
  margin-bottom: 15px;
}

.activities-title {
  margin-top: 25px;
  margin-bottom: 15px;
  font-weight: 700;
  border-top: solid 1px var(--light-light-gray);
  padding-top: 25px;
}

tr td + td {
  border-left: solid 1px var(--light-light-gray);
}

thead tr td {
  padding: 0 5px;
  font-weight: 700;
}

tbody tr td {
  border-top: solid 1px var(--light-light-gray);
  padding: 10px 5px;
  font-size:14px;
}

@media (max-width: 767px) {
  .activities-list {
    overflow: hidden;
  }
  table {
    display: block;
    overflow: auto;
    width: 100%;
  }
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
