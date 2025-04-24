<script>
  import CardTitle from './CardTitle.vue'
  import ProcessTab from './ProcessTabs.vue'
  import RealEstateList from "./RealEstateList.vue";
  import AlertMessage from "./AlertMessage.vue";
  import axios from "axios";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import Button from "@/components/buttons/button.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import {onUnmounted} from "vue";
  import {reservationStateStore} from "@/stores/reservationStateStore";

  export default {
    name: "Card",
    components: {TextAreaField, Button, AnimateCircleIcon, CardTitle, ProcessTab, RealEstateList, AlertMessage},
    props: {
      singleCardData: Object,
      statusViewChange: String
    },
    data() {
      return {
        alertStatus: '',
        alertMessage: '',
        verkaufsmeldungAPIData: [],
        customerData: [],

        isLoading: false,
        isLoadingSubmit: false,

        editNoticeMode: false,
        editNoticeProcess: false,
        notice: '',

        wasInViewport: false,
        isCurrentlyInViewport: false,
      }
    },
    mounted() {

      // Get a reference to the element
      const element = this.$refs[this.singleCardData.reservation_id];

      // Create a new Intersection Observer instance
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if ( entry.isIntersecting && !this.wasInViewport ) {
            this.wasInViewport = true;
            this.setAlertStatusMsg();
            this.checkUpdateSalepriceOfVerkaufsmeldung();
            this.updateCustomerData();
            this.getVerkaufsmeldungsData();
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

    },
    updated() {
      // this.setAlertStatusMsg();
      this.getVerkaufsmeldungsData();
    },
    methods: {
      pushRealEstatesToParentData(realEstateObject) {
        if ( realEstateObject ){
          this.$emit('apiRealEstates', realEstateObject);
        }
      },
      setAlertStatusMsg() {
        let reservationStatusToCheck = false;
        let verkaufsmeldungStatusToCheck = false;
        let reservationStatusText = false
        this.alertMessage = '';
        if ( this.singleCardData.reservation_status !== undefined && this.singleCardData.reservation_status !== '' ){
          reservationStatusToCheck = parseInt(this.singleCardData.reservation_status);
        }
        if ( this.singleCardData.reservation_status_name !== undefined && this.singleCardData.reservation_status_name !== '' ){
          reservationStatusText = this.singleCardData.reservation_status_name;
        }
        if ( this.singleCardData.notartermin_status !== undefined && this.singleCardData.notartermin_status !== '' ){
          verkaufsmeldungStatusToCheck = parseInt(this.singleCardData.notartermin_status);
        }

        this.alertStatus = 'success';
        if ( typeof reservationStatusText !== 'string' ){
          this.alertMessage = '';
        } else {
          this.alertMessage = reservationStatusText;
        }

        if ( reservationStatusText.includes('abgelehnt') || reservationStatusText.includes('abgesagt')  ){
          this.alertStatus = 'warning';
        }

        // Check Notartermin
        if ( verkaufsmeldungStatusToCheck === 0 ) {
          this.alertStatus = 'info';
          this.alertMessage = 'Notartermin noch nicht bestätigt oder ausstehend';
        }
        if ( verkaufsmeldungStatusToCheck === 1 ) {
          this.alertStatus = 'info';
          this.alertMessage = 'Warte auf Einreichung von Makler';
        }
        if ( verkaufsmeldungStatusToCheck === 2 ) {
          this.alertStatus = 'info';
          this.alertMessage = 'Warte auf bestätigung';
        }
        if ( verkaufsmeldungStatusToCheck === 3 ) {
          this.alertStatus = 'success';
          this.alertMessage = 'bestätigt';
        }
        if ( verkaufsmeldungStatusToCheck === -2 ) {
          this.alertStatus = 'warning';
          this.alertMessage = 'Verkaufsmeldung wurde abgelehnt';
        }
      },
      checkUpdateSalepriceOfVerkaufsmeldung() {
        if ( typeof this.singleCardData.verkaufsmeldung_id !== 'undefined' ){
          if ( !this.singleCardData.saleprice || this.singleCardData.saleprice === 0 || this.singleCardData.saleprice === '0' ){
            axios.get(this.globalApiBaseUrl + '/onoffice/getSingleRealEstate?systemid='+this.singleCardData.real_estate_sys_id)
              .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    let realEstateData = response.data.response.real_estates[0];
                    this.singleCardData.saleprice = realEstateData.real_estate_price;
                    this.singleCardData.fee = parseInt(realEstateData.real_estate_fee);
                  }
                }
              )
              .catch(
                (error) => {
                  console.log(error);
                }
              );
          }
        }
      },
      updateCustomerData() {
        if ( typeof this.singleCardData.verkaufsmeldung_id !== 'undefined' ){
          if ( !this.singleCardData.customer_name || this.singleCardData.customer_name === '' ){
            axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.singleCardData.customer_kdnr+'&company='+this.singleCardData.company+'&onlyCustomerNrSearch=true')
              .then(
                  (response) => {
                    if ( response.data.status === 200 ){
                      if ( response.data.response && response.data.response.client_data !== null ){
                        this.singleCardData.customer_name = response.data.response.client_data[0].client_salutation + ' ' + response.data.response.client_data[0].client_first_name + ' ' + response.data.response.client_data[0].client_last_name;
                      }
                    }
                  }
              )
              .catch(
                  (error) => {
                    console.log(error);
                  }
              );
          }
        } else {
          if ( !this.singleCardData.client_full_name || this.singleCardData.client_full_name === '' ){
            axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.singleCardData.customer_kdnr+'&company='+this.singleCardData.company+'&onlyCustomerNrSearch=true')
              .then(
                  (response) => {
                    if ( response.data.status === 200 ){
                      if ( response.data.response && response.data.response.client_data !== null ){
                        this.singleCardData.client_full_name = response.data.response.client_data[0].client_salutation + ' ' + response.data.response.client_data[0].client_first_name + ' ' + response.data.response.client_data[0].client_last_name;
                      }
                    }
                  }
              )
              .catch(
                  (error) => {
                    console.log(error);
                  }
              );
          }
        }
      },
      getVerkaufsmeldungsData() {

        this.verkaufsmeldungAPIData = this.singleCardData.verkaufsmeldung_raw;

        // if ( parseInt(this.singleCardData.reservation_status) >= 7 ) {
        //   axios.get(this.globalApiBaseUrl + '/verkaufsmeldung/getReservationVerkaufsmeldungen?reservationId=' + this.singleCardData.reservation_id)
        //     .then(
        //         (response) => {
        //           if ( response.data.status === 200 ){
        //             this.verkaufsmeldungAPIData = response.data.response;
        //           }
        //         }
        //     )
        //     .catch(
        //         (error) => {
        //           console.log(error);
        //         }
        //     ).finally(
        //     () => {
        //       this.isLoading = false;
        //     })
        // }
      },
      getCustomerData() {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;
        axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString=' + this.singleCardData.customer_kdnr + '&company=' + this.singleCardData.company + '&onlyCustomerNrSearch=true')
            .then(
                (response) => {
                  this.customerData = response.data.response.client_data[0];
                  this.notice = response.data.response.client_data[0].client_notice;
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
      favFinished(data) {
        this.$emit('favSuccessful', data);
      },
      changeNoticeModus(data) {
        this.editNoticeMode = data;
      },
      submitNoticeData() {

        if ( this.isLoadingSubmit ) {
          return;
        }

        if ( !this.editNoticeProcess ){
          this.editNoticeProcess = true;
          return;
        }

        this.isLoadingSubmit = true;

        let dataToSubmit = {
          'customerKdnr': this.singleCardData.customer_kdnr,
          'company': this.singleCardData.company,
          'notice': this.notice,
        };

        axios.post(this.globalApiBaseUrl + '/onoffice/updateNotice', dataToSubmit )
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.notificationBannerInit('success', 'EINE NOTIZ WURDE GESPEICHERT');
                    this.editNoticeMode = false;
                    this.editNoticeProcess = false;
                    this.notice = '';
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
              this.notificationBannerInit('warning', 'Notiz konnte nicht gespeichert werden')
            }
        ).finally(
            () => {
              this.isLoadingSubmit = false;
            })

      },
      preventLinkClickOnEditMod(event) {
        if(this.editNoticeMode) {
          event.preventDefault();
        }
      },
      checkIfIsOpenProvisionProcessToApprove(reservationData) {
        const provisionProcesses = reservationData.provision_processes;
        if ( typeof provisionProcesses === 'undefined' || Object.keys(provisionProcesses).length === 0 ) {
          return false;
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

        let status = 0;
        if ( typeof provisionProcesses[latestIndex] !== 'undefined' && Object.keys(provisionProcesses[latestIndex]).length > 0 ) {
          status = parseInt(provisionProcesses[latestIndex].process_status);
        }

        return status === 1;

      },

      renderStatusClass() {

        /**
         * only for rd and higher roles
         */
        if ( this.getUserRole() < 2 ) {
          return false;
        }

        if ( typeof this.singleCardData.reservation_status !== null && this.singleCardData.reservation_status !== '' && parseInt(this.singleCardData.reservation_status) === 3){
            return true;
        }

        if ( typeof this.singleCardData.reservation_status !== null && this.singleCardData.reservation_status !== '' && parseInt(this.singleCardData.reservation_status) === 6 ){
          return true;
        }

        if ( typeof this.singleCardData.gwg_status !== null && this.singleCardData.gwg_status !== '' && parseInt(this.singleCardData.gwg_status) === 2 ){
          return true;
        }

        if ( typeof this.singleCardData.gwgintern_process !== null && this.singleCardData.gwgintern_process !== '' && parseInt(this.singleCardData.gwgintern_process) === 1 ){
          return true;
        }

        if ( typeof this.singleCardData.finance_process !== null && this.singleCardData.finance_process !== '' && parseInt(this.singleCardData.finance_process) === 1 ){
          return true;
        }

        if ( typeof this.singleCardData.estate_discounts !== null && typeof this.singleCardData.estate_discounts !== 'undefined' && this.singleCardData.estate_discounts !== '' && this.singleCardData.estate_discounts !== null){
          if ( this.singleCardData.estate_discounts.includes('1') ) {
            return true;
          }
        }
        if ( typeof this.singleCardData.estate_commission_process !== null && typeof this.singleCardData.estate_commission_process !== 'undefined' && this.singleCardData.estate_commission_process !== '' && this.singleCardData.estate_commission_process !== null){
          if ( this.singleCardData.estate_commission_process.includes('1') ) {
            return true;
          }
        }

        if ( typeof this.singleCardData.sale_status !== null && typeof this.singleCardData.sale_status !== 'undefined' && this.singleCardData.sale_status !== '' && this.singleCardData.sale_status !== null ){
          if ( this.singleCardData.sale_status.includes('2') ) {
            return true;
          }
        }

        if ( typeof this.singleCardData.kv_notartermin_city !== null && this.singleCardData.kv_notartermin_city === 'berlin' && (this.singleCardData.kv_data_send_from_lawyers_to_berlin === null || this.singleCardData.kv_data_send_from_lawyers_to_berlin === '') ){
          return true;
        }

        if ( typeof this.singleCardData.kv_notartermin_city !== null && this.singleCardData.kv_notartermin_city === 'essen' && (this.singleCardData.kv_data_send_to_lawyers === null || this.singleCardData.kv_data_send_to_lawyers === '') ){
          return true;
        }

        if ( parseInt(this.singleCardData.reservation_status) === 7 && parseInt(this.singleCardData.kv_process) < 4){
          return true;
        }

        if ( parseInt(this.singleCardData.sale_create_vkm) === 1 && ( this.singleCardData.kv_signed_by_covivio === null || this.singleCardData.kv_signed_by_covivio === 'undefined' || this.singleCardData.kv_signed_by_covivio === '' ) ){
          return true;
        }

        if ( this.checkIfIsOpenProvisionProcessToApprove(this.singleCardData) ) {
          return true;
        }

        return false;
      },
      navigateToReservationSingleView(reservationId) {
        const store = reservationStateStore();
        store.setReservation(this.singleCardData);

        let test = store.getReservation;
        this.$router.push({ name: 'singleReservationView', params: { id: reservationId } });

      }
    },
    computed: {
      CountdownLeftDays() {
        if ( typeof this.singleCardData.kv_countdown_start !== 'undefined' && this.singleCardData.kv_countdown_start && this.singleCardData.kv_countdown_start !== '' ){
          let countdown = this.singleCardData.kv_countdown_start;
          countdown = countdown.replace(' ', 'T');
          let targetDate = new Date(countdown);
          let now = new Date();
          let diff = targetDate.getTime() - now.getTime();

          let daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
          // days left returns a minus value
          return 14+daysLeft;
        } else {
          return false;
        }
      },
      checkForFav() {
        let returnVal = false;
        let data = this.singleCardData.favoured_userids;
        let userIdAsString = this.getUserId()+'';
        if ( typeof data !== 'undefined' && data && data.length > 0 ){
          if ( data.includes(userIdAsString) ) {
            returnVal = true;
          }
        }
        return returnVal;
      },
    },
    watch: {
      editNoticeMode: function(newVal) {
        if ( newVal ) {
          this.getCustomerData();
        }
      },
      statusViewChange: function(newVal) {
        this.checkUpdateSalepriceOfVerkaufsmeldung();
        this.updateCustomerData();
        this.getVerkaufsmeldungsData();
      },
      singleCardData: {
        handler:function(newVal) {
          this.setAlertStatusMsg();
        },
        deep:true
      },
    }
  }
</script>

<template>

  <div class="card-wrapper reservation" :ref="singleCardData.reservation_id" :class="{'is-fav': checkForFav, 'red-border': renderStatusClass()}" v-if="singleCardData.reservation_id !== undefined && singleCardData.reservation_id !== false" >
    <a style="cursor: pointer;" @click="navigateToReservationSingleView(singleCardData.reservation_id)">

      <div class="overlayer" v-if="singleCardData.yousign_update_detected === '1'" ></div>

      <div class="card-inner-wrapper" @click="preventLinkClickOnEditMod">

        <div class="card-header">

          <CardTitle
              :reservationId="singleCardData.reservation_id"
              :cardCreateDate="singleCardData.create_date"
              :agentShortName="singleCardData.real_estate_agent"
              :displayOptionsIcon="true"
              @favSuccessful="favFinished"
              :isFavored="checkForFav"
              @toggleNoticeMod="changeNoticeModus"
              @click.stop=""
          >
          </CardTitle>

          <div class="meta-data" v-if="!editNoticeMode">

            <div v-if="singleCardData.client_full_name"> {{ singleCardData.client_full_name }}</div>
            <div v-else>-</div>

            <div class="customer-kdnr" v-if="singleCardData.customer_kdnr"> {{ singleCardData.customer_kdnr }}</div>
            <div v-else>-</div>

          </div>

          <div class="meta-data" v-if="!editNoticeMode && wasInViewport">

            <ProcessTab tabTitle="Reservierung" :reservationData="singleCardData" :statusViewChange="statusViewChange"></ProcessTab>
            <ProcessTab tabTitle="Abwicklung" :reservationData="singleCardData" :statusViewChange="statusViewChange"></ProcessTab>
            <ProcessTab tabTitle="Verkauf" :reservationData="singleCardData" :verkaufsmeldungsData="verkaufsmeldungAPIData" :statusViewChange="statusViewChange"></ProcessTab>

          </div>

        </div>

        <div class="card-body">

          <div class="real-estates-list" v-if="!editNoticeMode">

            <span v-if="wasInViewport">
              <RealEstateList :reservationId="parseInt(singleCardData.reservation_id)" :showEditFunctions="{edit: false, delete: false}" @apiRealEstates="pushRealEstatesToParentData"></RealEstateList>
            </span>

          </div>

          <div class="card-notice" @click.stop="" v-else>
            <div class="field-wrapper" style="margin-top: 25px;">
              <AnimateCircleIcon v-if="isLoading" style="position: absolute; top: 15px;"></AnimateCircleIcon>
              <TextAreaField inputName="noticeData" :inputVal="notice" v-model="notice">
              </TextAreaField>
              <label class="ph">Notiz bearbeiten </label>
            </div>
          </div>

        </div>

        <div class="card-footer">

          <div class="actions notice" v-if="editNoticeMode && !isLoading" @click.stop="">
            <Button type="delete" @click="editNoticeProcess = false; editNoticeMode = false; notice = ''" style="margin-bottom: 15px;">Schließen</Button>
            <Button :type="!editNoticeProcess ? 'edit' : 'report'" @click="submitNoticeData">{{!editNoticeProcess ? 'Speichern' : 'Bestätigen'}}<AnimateCircleIcon v-if="isLoadingSubmit"></AnimateCircleIcon></Button>
          </div>

          <div class="alert-message-wrapper" v-if="!editNoticeMode && singleCardData.yousign_update_detected === '0'">

            <AlertMessage :alertStatus="alertStatus" :alertText="alertMessage"></AlertMessage>

            <AlertMessage style="margin-top:10px; margin-bottom: 10px;" :alertStatus="CountdownLeftDays > 0 ? 'info' : 'success'" :alertText="CountdownLeftDays > 0 ? CountdownLeftDays + ' Tage verbleibend' : '14 Tage gewartet'" v-if="typeof CountdownLeftDays === 'number' && !this.checkIfIsNDBBusinessCustomer(singleCardData)"></AlertMessage>

            <AlertMessage :alertStatus="this.checkIfDateInFuture(singleCardData.kv_notartermin_date) ? 'info' : 'success'" :alertText="'Notartermin: '+this.englishDateWithTimeToGermanDate(singleCardData.kv_notartermin_date)" v-if="singleCardData.kv_notartermin_date"></AlertMessage>

          </div>

          <div class="alert-message-wrapper" v-else-if="singleCardData.yousign_update_detected === '1'">

            <AlertMessage alertStatus="warning" alertText="Immo bereits reserviert"></AlertMessage>

          </div>

        </div>

      </div>

    </a>

  </div>
  <div class="card-wrapper verkaufsmeldung" :ref="singleCardData.verkaufsmeldung_id" v-else-if="singleCardData.verkaufsmeldung_id !== undefined && singleCardData.verkaufsmeldung_id !== false && (parseInt(singleCardData.notartermin_status) >= 0 || parseInt(singleCardData.notartermin_status) === -2)">

    <router-link :to="{name: 'singleVerkaufsmeldungView', params:{ id: singleCardData.verkaufsmeldung_id }}">

      <div class="card-inner-wrapper">

        <div class="card-header">
          <CardTitle
            :reservationId="singleCardData.verkaufsmeldung_id"
            :cardCreateDate="singleCardData.create_date"
            :displayOptionsIcon="false"
            titleType="verkaufsmeldung"
          >
          </CardTitle>

          <div class="meta-data">

            <div v-if="singleCardData.customer_name"> {{ singleCardData.customer_name }}</div>
            <div v-else>-</div>

            <div class="customer-kdnr" v-if="singleCardData.customer_kdnr && singleCardData.customer_kdnr !== '0'"> {{ singleCardData.customer_kdnr }}</div>
            <div v-else>-</div>

          </div>

        </div>

        <div class="card-body">

          <div class="real-estates-list">

            <div class="real-estate-list-item">

              <div class="row-wrapper">

                <div class="row">
                  <div class="real-estate-nr">{{ singleCardData.real_estate_nr }}</div>
                </div>

                <div class="row">
                  <div class="real-estate-price" v-if="singleCardData.saleprice">{{ this.numberWithComma(singleCardData.saleprice) }} {{ this.$currency }}</div>
                  <div class="real-estate-price" v-else>-</div>

                  <div class="real-estate-fee" v-if="singleCardData.fee">{{ this.numberWithComma(singleCardData.fee) }} {{ this.$currency }}</div>
                  <div class="real-estate-fee" v-else>-</div>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div class="card-footer">

          <div class="alert-message-wrapper">

            <AlertMessage :alertStatus="alertStatus" :alertText="alertMessage"></AlertMessage>

          </div>

        </div>

      </div>

    </router-link>

  </div>
  <span v-else></span>
</template>


<style scoped>

.card-inner-wrapper {
  background: white;
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  padding: 10px;
  border-radius: 5px;
  border: solid 1px var(--gray-text);
}

.card-wrapper a {
  display: block;
  height: 100%;
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

.is-fav .card-inner-wrapper {
  border: solid 2px gold;
}

.red-border .card-inner-wrapper {
  border-color: var(--red);
  border-width: 2px;
}

.overlayer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.5;
  z-index: 1;
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
