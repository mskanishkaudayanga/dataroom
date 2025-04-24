<script>
  import axios from "axios";

  export default {
    name: "ProcessTab",
    props: {
      tabTitle: String,
      reservationData: [String, Object],
      verkaufsmeldungsData: {
        type: Object,
        default: []
      },
      statusViewChange: String,
      triggerGWGLoad: String
    },
    data() {
      return {
        isFinished: false,
        reservationMaxStatus: 5,
        progressMaxStatus: 17,
        saleMaxStatus: 4,
        apiResponseVerkaufsmeldung: [],
        // apiResponseGWGs: [],
        reservationId: this.$route.params.id,
        // gwgLoaded: false,
        latestProvisionProcesses: [],
      }
    },
    computed: {
      renderProcessStatus() {
        return this.renderProcessMethod();
      },
      cssVars() {
        // if ( this.reservationData.reservation_id === '819' ) {
        //   console.log(this.reservationData);
        // }

        if ( typeof this.reservationData === 'undefined' ) {
          width = 0;
          return {
            '--pseudoWidth': width + '%',
          }
        }
        let width;
        let reservationStatus = parseInt(this.reservationData.reservation_status);
        if ( this.tabTitle === 'Reservierung' ){
          width = ( (parseInt(this.reservationData.reservation_status)+1) / this.reservationMaxStatus) * 100;
        } else if( this.tabTitle === 'Abwicklung' ) {

          let kvCorrectStatus = 0;
          if ( parseInt(this.reservationData.kv_process) > 0 ) {
            kvCorrectStatus = parseInt(this.reservationData.kv_process) - 1;
          }

          if ( this.KVCountdownFinished <= 0 ) {
            kvCorrectStatus += 1;
          }

          let gwgCount = 0;
          if ( this.reservationData.gwgs_raw.length > 0 ) {
            let status2 = true, status3 = true, statusInvite = true;
            for (const index in this.reservationData.gwgs_raw) {
              if ( parseInt(this.reservationData.gwgs_raw[index].gwg_status) <= 2 ) {
                status2 = false;
              }
              if ( parseInt(this.reservationData.gwgs_raw[index].gwg_status) <= 3 ) {
                status3 = false;
              }
              if ( parseInt(this.reservationData.gwgs_raw[index].send_webform_invitation) === 0 ) {
                statusInvite = false;
              }
            }
            if ( statusInvite ) {
              gwgCount += 1;
            }
            if ( !status3 ) {
              gwgCount += 2;
            } else if ( !status2 ) {
              gwgCount += 1;
            }
          }

          let ndbNotaryData = 0;
          if ( this.checkIfDBValExists(this.reservationData.kv_data_send_to_lawyers) ){
            ndbNotaryData += 1;
          }

          if ( this.checkIfDBValExists(this.reservationData.kv_notartermin_city) && this.reservationData.kv_notartermin_city === 'berlin' && this.checkIfDBValExists(this.reservationData.kv_data_send_from_lawyers_to_berlin) ){
            ndbNotaryData += 1;
          }

          let provisionStatus = 1;
          if ( typeof this.latestProvisionProcesses !== 'undefined' && Object.keys(this.latestProvisionProcesses).length > 0 ) {
            provisionStatus += parseInt(this.latestProvisionProcesses.process_status);
          }

          if ( !this.isAgentProvisionFeatureStart() ) {
            provisionStatus = 0;
          }

          let reservationStatusReset = (reservationStatus - 4) + ndbNotaryData + (parseInt(gwgCount)) + (parseInt(this.reservationData.gwgintern_process)+1) + (parseInt(this.reservationData.finance_process)+parseInt(this.reservationData.finance_submitted_webform_invitation)) + kvCorrectStatus + provisionStatus;
          if ( this.reservationData.reservation_status >= 4 ){
            width = (reservationStatusReset / this.progressMaxStatus) * 100;
          } else {
            width = 0;
          }
        } else if( this.tabTitle === 'Verkauf' ) {
          width = 0;

          let salesStatus = 0;
          if ( typeof this.verkaufsmeldungsData !== 'undefined' && this.verkaufsmeldungsData.length > 0) {
            let reported = true;
            let sold = true;
            Object.entries(this.verkaufsmeldungsData).forEach(([key, field]) => {
              if ( parseInt(field.notartermin_status) < 2 ) {
                reported = false;
              }
              if ( parseInt(field.notartermin_status) < 3 ) {
                sold = false;
              }
            });

            if ( typeof reported !== 'undefined' && reported ){
              salesStatus += 1;
            }
            if ( typeof sold !== 'undefined' && sold ){
              salesStatus += 2;
            }
          }

          if ( this.checkIfDBValExists(this.reservationData.kv_signed_by_covivio) ) {
            salesStatus += 1;
            this.saleMaxStatus = 4;
          }

          width = (salesStatus / this.saleMaxStatus) * 100;
        }
        return {
          '--pseudoWidth': width + '%',
        }
      },
      KVCountdownFinished() {
        if ( typeof this.reservationData.kv_countdown_start !== 'undefined' && this.reservationData.kv_countdown_start && this.reservationData.kv_countdown_start !== '' ){
          let countdown = this.reservationData.kv_countdown_start;
          countdown = countdown.replace(' ', 'T');
          let targetDate = new Date(countdown);
          let now = new Date();
          let diff = targetDate.getTime() - now.getTime();

          let daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
          // days left returns a minus value
          return 14+daysLeft;
        }
      }
    },
    methods: {
      currenProvisionRequestStatus() {
        let provisionProcesses = this.reservationData.provision_processes;
        if ( typeof provisionProcesses === 'undefined' || Object.keys(provisionProcesses).length === 0 ) {
          return [];
        }
        // get latest Request by its create_date
        let latestIndex = -1;
        let latestDate = new Date(0);
        provisionProcesses.forEach((item, index) => {
          const currentCreateDate = new Date(item.create_date);
          if (currentCreateDate > latestDate) {
            latestDate = currentCreateDate;
            latestIndex = index;
          }
        });
        if ( typeof provisionProcesses[latestIndex] !== 'undefined' && Object.keys(provisionProcesses[latestIndex]).length > 0 ) {
          this.latestProvisionProcesses = provisionProcesses[latestIndex];
        }
      },
      renderProcessMethod() {
        this.currenProvisionRequestStatus();
        let reservationStatus = parseInt(this.reservationData.reservation_status);
        if ( this.tabTitle === 'Reservierung' && reservationStatus >= 4 ){
          return this.reservationMaxStatus + ' / ' + this.reservationMaxStatus;
        } else if ( this.tabTitle === 'Reservierung' && reservationStatus < 4 ) {
          if ( reservationStatus === 0 ){
            return '1 / ' + this.reservationMaxStatus;
          } else {
            return reservationStatus + ' / ' + this.reservationMaxStatus;
          }
        }

        let provisionStatus = 0;
        if ( typeof this.latestProvisionProcesses !== 'undefined' && Object.keys(this.latestProvisionProcesses).length > 0 && this.isAgentProvisionFeatureStart() ) {
          provisionStatus += parseInt(this.latestProvisionProcesses.process_status) + 1;
        }

        if ( this.tabTitle === 'Abwicklung' && reservationStatus > 4 ){

          let kvStatus = parseInt(this.reservationData.kv_process);
          let kvCorrectStatus = 0;
          if ( kvStatus > 0 ) {
            kvCorrectStatus = kvStatus;
          }

          if (typeof this.reservationData.kv_countdown_start !== 'undefined' && this.reservationData.kv_countdown_start && this.reservationData.kv_countdown_start !== '') {
            let countdown = this.reservationData.kv_countdown_start;
            countdown = countdown.replace(' ', 'T');
            let targetDate = new Date(countdown);
            let now = new Date();
            let diff = targetDate.getTime() - now.getTime();

            let daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
            // days left returns a minus value
            if ( 14 + daysLeft >= 0 ) {
              kvCorrectStatus -= 1;
            }
          }

          let gwgCount = 0;
          let status2 = true, status3 = true, statusInvite = true;
          if ( this.reservationData.gwgs_raw.length > 0 ) {
            for (const index in this.reservationData.gwgs_raw) {
              let gwgStatus = parseInt(this.reservationData.gwgs_raw[index].gwg_status);

              if ( parseInt(this.reservationData.gwgs_raw[index].send_webform_invitation) === 0 && gwgStatus === 0 ) {
                statusInvite = false;
              }

              if ( gwgStatus !== 2 ) {
                status2 = false;
              }

              if ( gwgStatus !== 3 ) {
                status3 = false;
              }

            }
          }
          if ( statusInvite ) {
            gwgCount += 1;
          }
          if ( status3 ) {
            gwgCount = 3;
          } else if ( status2 ) {
            gwgCount = 2;
          }

          let ndbNotaryData = 1;

          // NDB ausgefüllt
          if ( reservationStatus >= 6 ){
            ndbNotaryData += 1;
          }
          // NDB accepted
          if ( reservationStatus >= 7 ){
            ndbNotaryData += 1;
          }
          if ( this.checkIfDBValExists(this.reservationData.kv_data_send_to_lawyers) ){
            ndbNotaryData += 1;
          }
          if ( this.checkIfDBValExists(this.reservationData.kv_notartermin_city) && this.reservationData.kv_notartermin_city === 'berlin' && this.checkIfDBValExists(this.reservationData.kv_data_send_from_lawyers_to_berlin) ){
            this.progressMaxStatus = 21;
            ndbNotaryData += 2;
          }
          
          let reservationStatusReset = provisionStatus + ndbNotaryData + (parseInt(gwgCount)) + (parseInt(this.reservationData.gwgintern_process)+1) + (parseInt(this.reservationData.finance_process)+parseInt(this.reservationData.finance_submitted_webform_invitation)) + kvCorrectStatus;

          // if ( this.reservationData.reservation_id === '819' ) {
          //   console.log(this.reservationData);
          //   console.log('res: '+ (reservationStatus - 4));
          //   console.log('notart: '+ ndbNotaryData);
          //   console.log('gwg: '+ gwgCount);
          //   console.log('gwgint: '+ (parseInt(this.reservationData.gwgintern_process)+1));
          //   console.log('finance: '+ (parseInt(this.reservationData.finance_process)+parseInt(this.reservationData.finance_submitted_webform_invitation)));
          //   console.log('kv: '+ kvCorrectStatus);
          // }

          return reservationStatusReset + ' / ' + this.progressMaxStatus;
        } else if ( this.tabTitle === 'Abwicklung' && reservationStatus === 4 ) {
          return (provisionStatus+1)+' / ' + this.progressMaxStatus;
        } else if ( this.tabTitle === 'Abwicklung' && reservationStatus < 5 ) {
          return '0 / ' + this.progressMaxStatus;
        }

        if ( this.tabTitle === 'Verkauf' ) {
          let salesStatus = 0;
          if ( typeof this.verkaufsmeldungsData !== 'undefined' && this.verkaufsmeldungsData.length > 0) {
            let reported = true;
            let sold = true;
            Object.entries(this.verkaufsmeldungsData).forEach(([key, field]) => {
              if ( parseInt(field.notartermin_status) < 2 ) {
                reported = false;
              }
              if ( parseInt(field.notartermin_status) < 3 ) {
                sold = false;
              }
            });

            if ( typeof reported !== 'undefined' && reported ){
              salesStatus += 1;
            }
            if ( typeof sold !== 'undefined' && sold ){
              salesStatus += 2;
            }
          }

          if ( this.checkIfDBValExists(this.reservationData.kv_signed_by_covivio) ) {
            salesStatus += 1;
          }

          return salesStatus+' / ' + this.saleMaxStatus;
        }

      },
      checkStatus() {
        if ( this.tabTitle === 'Reservierung' && (parseInt(this.reservationData.reservation_status)+1) >= this.reservationMaxStatus ){
          this.isFinished = true;
        } else if( this.tabTitle === 'Abwicklung' ) {

          let kvCorrectStatus = 0;
          if ( parseInt(this.reservationData.kv_process) > 0 ) {
            kvCorrectStatus = parseInt(this.reservationData.kv_process) - 1;
          }

          let reservationStatusReset = (parseInt(this.reservationData.reservation_status) - 4) + (parseInt(this.reservationData.gwgex_process)) + (parseInt(this.reservationData.gwgintern_process)+1) + (parseInt(this.reservationData.finance_process)+1) + parseInt(kvCorrectStatus);
          if ( reservationStatusReset >= this.progressMaxStatus  ) {
            this.isFinished = true;
          }
        } else if( this.tabTitle === 'Verkauf') {
          if ( typeof this.verkaufsmeldungsData !== 'undefined' && this.verkaufsmeldungsData.length > 0) {
            let sold = true;
            // Object.entries(this.verkaufsmeldungsData).forEach(([key, field]) => {
            //   if ( parseInt(field.notartermin_status) < 3 ) {
            //     sold = false;
            //   }
            // });
            if ( this.checkIfDBValExists(this.reservationData.kv_signed_by_covivio) ) {
              this.isFinished = true;
            }
            // if ( sold ) {
            //   this.isFinished = true;
            // }
          }

        } else {
          this.isFinished = false;
        }
      },
      // getReservationsGWG() {
      //   this.apiResponseGWGs = this.reservationData.gwgs_raw;
      //   // if ( parseInt(this.reservationData.reservation_status) < 7 || this.tabTitle !== 'Abwicklung' ) {
      //   //   return;
      //   // }
      //   // let reservationId = '';
      //   // if ( typeof this.reservationData.reservation_id !== 'undefined' ) {
      //   //   reservationId = this.reservationData.reservation_id;
      //   // } else {
      //   //   reservationId = this.reservationId;
      //   // }
      //   // this.isLoading = true;
      //   // axios.get(this.globalApiBaseUrl + '/reservations/getAllExternalGWGs?reservationId='+reservationId)
      //   //     .then(
      //   //         (response) => {
      //   //           if ( response.data.status === 200 ){
      //   //             this.apiResponseGWGs = response.data.response;
      //   //           }
      //   //         }
      //   //     )
      //   //     .catch(
      //   //         (error) => {
      //   //           console.log(error);
      //   //         }
      //   //     ).finally(
      //   //         () => {
      //   //           this.isLoading = false;
      //   //           this.gwgLoaded = true;
      //   //         }
      //   //     )
      // },
      checkIfDBValExists(val) {
        if ( val !== null && val !== '' && val !== undefined ) {
          return true;
        } else {
          return false;
        }
      }
    },
    beforeMount() {
      this.checkStatus();
    },
    updated() {
      this.checkStatus();
      this.renderProcessMethod();
      this.currenProvisionRequestStatus();
    },
    mounted() {
      // this.getReservationsGWG()
    },
  }
</script>


<template>

  <div class="processtab" :class="{ finished: isFinished }" :style="cssVars" @click="this.$emit('processTabClicked', this.tabTitle)">
    <div class="title">{{ tabTitle }}</div>
    <div class="status"> {{ renderProcessStatus }}</div>
  </div>

</template>


<style scoped>

.processtab {
  position: relative;
  background-color: var(--light-gray);
  border-radius: 5px;
  font-size: 12px;
  padding: 2px 5px;
  text-align: center;
  color: white;
  cursor: pointer;
}

.processtab:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  width: var(--pseudoWidth);
  height: 100%;
  background-color: orange;
  max-width: 100%;
}

.processtab.active {
  background-color: white;
  color: var(--blue);
  border: solid 1px var(--blue);
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
}

.processtab.active:before {
  width: 0;
  background-color: white;
}

.processtab.finished:before {
  background-color: var(--green);
  border-radius: 5px;
}

.status {
  margin-top: -5px;
}

</style>
