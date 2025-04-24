<script>
  import CheckmarkIcon from "../icons/icon-checkmark.vue";
  import HoursglasshalfIcon from "../icons/icon-hoursglasshalf.vue";
  import MailIcon from "@/components/icons/icon-mail.vue";
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import ArrowLeftIcon from "@/components/icons/icon-arrow-left.vue";
  import LinkIcon from "@/components/icons/icon-link.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import ToolTip from "@/components/utility/ToolTip.vue";

  export default {
    name: "ProcessTabContent",
    components: {
      ToolTip,
      Dropdown, AsterixMarkIcon,
      LinkIcon,
      ArrowLeftIcon,
      AnimateCircleIcon, Button, InputField, CloseIcon, MailIcon, HoursglasshalfIcon, CheckmarkIcon},
    props: {
      processName: String,
      reservationData: [String, Object],
      gwgsData: {
        type: Object,
        default: []
      },
      verkaufsmeldungsData: {
        type: Object,
        default: []
      },
      realEstatesData: {
        type: Object,
        default: []
      }
    },
    emits: ['triggerReservationsReload'],
    data() {
      return{
        reservationMaxStatus: 5,
        progressMaxStatus: 12,
        isLoading: false,
        gwgMaxCount: 0,
        gwgMailPopupActive: false,
        gwgMailSelectedCustomers: [],
        gwgMailSelectedValid: true,
        gwgSendMailProcess: false,
        toggleShowGwgPdfs: false,
        toggleShowFinanceUploads: false,
        toggleShowNDBUploads: false,
        isOpenModalEmailTrigger: false,
        confirmMailSubmit: false,
        popupMailtriggerType: '',
        selectedProvisionDate: '',
        isCommissionChanged: false,
        latestProvisionProcesses: [],
      }
    },
    methods: {
      triggerEmail(type) {

        if ( type !== false ) {
          this.popupMailtriggerType = type;
        }

        if ( this.isLoading ) {
          return;
        }

        if ( typeof type === 'undefined' || type === '' || typeof this.reservationData.reservation_id === 'undefined' || this.reservationData.reservation_id === '' ){
          this.notificationBannerInit('warning', 'Ein Fehler ist aufgetreten');
          return;
        }


        let data;

        if ( !this.confirmMailSubmit ) {
          this.confirmMailSubmit = true;
          this.isOpenModalEmailTrigger = true;
          return false;
        }
        this.confirmMailSubmit = false;

        if ( !type ) {
          type = this.popupMailtriggerType;
        }

        if ( type === 'externalGWG' ){
          if ( this.gwgSendMailProcess === false && type === 'externalGWG' ) {
            if ( this.gwgMaxCount > 1 ) {
              this.gwgSendMailProcess = true;
            }
          }

          if ( this.gwgMaxCount === 1 ) {
            this.gwgMailSelectedCustomers = [this.gwgsDataOnlyActiveOnes[0].id];
          }

          if ( this.gwgSendMailProcess === true && type === 'externalGWG' ) {
            if (this.gwgMailSelectedCustomers.length) {
              this.gwgMailSelectedValid = true;
            } else {
              this.gwgMailSelectedValid = false;
              return;
            }
          }

          if ( this.gwgSendMailProcess === true && type === 'externalGWG' ) {
            data = JSON.stringify({
              "reservationId": this.reservationData.reservation_id,
              "type": type,
              "selectedGWGIDs": this.gwgMailSelectedCustomers,
            });
          } else if ( type === 'externalGWG' && this.gwgMaxCount === 1 ) {
            data = JSON.stringify({
              "reservationId": this.reservationData.reservation_id,
              "type": type,
              "selectedGWGIDs": this.gwgMailSelectedCustomers,
            });
          }

        } else {
          data = JSON.stringify({
            "reservationId": this.reservationData.reservation_id,
            "type": type
          });
        }

        if ( type === 'provision' ) {
          if ( this.isOpenModalEmailTrigger && this.isEmpty(this.selectedProvisionDate) ) {
            this.notificationBannerInit('warning', 'Kein Datum ausgewählt');
            return;
          }
          this.triggerProvisionProcess();
          return;
        }

        this.isLoading = true;
        axios({ method: 'POST', url: this.globalApiBaseUrl + '/reservations/manuellEmailTriggers', data: data })
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.notificationBannerInit('success', 'E-Mail wurde erfolgreich versendet');
                    this.$parent.triggerGWGReload = Math.floor(Math.random() * 1000000000 + 1000000000);
                  }
                }
            )
            .catch(
                (error) => {
                  this.notificationBannerInit('warning', 'E-Mail konnte nicht versendet werde');
                }
            ).finally(
            () => {
              this.isLoading = false;
              this.gwgMailPopupActive = false;
              this.isOpenModalEmailTrigger = false;
            }
        )
      },
      triggerProvisionProcess() {

        this.isLoading = true;

        let data = JSON.stringify({
          "reservationId": this.reservationData.reservation_id,
          "selectedDate": this.selectedProvisionDate,
        });

        axios({ method: 'POST', url: this.globalApiBaseUrl + '/reservations/triggerProvisionProcess', data: data })
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.notificationBannerInit('success', 'E-Mail wurde erfolgreich versendet');

                    // Start push a default array for the new process so view is updated directly
                    const date = new Date();
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    let defaultProvision = {
                      "process_status": "0",
                      "create_date": `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
                    }
                    this.reservationData.provision_processes.push(defaultProvision)
                  }
                }
            )
            .catch(
                (error) => {
                  this.notificationBannerInit('warning', 'E-Mail konnte nicht versendet werde');
                }
            ).finally(
            () => {
              this.isLoading = false;
              this.gwgMailPopupActive = false;
              this.isOpenModalEmailTrigger = false;
            }
        )
      },
      renderGWGStatus(status) {
        let gwgsTotal = 0;
        let gwgsFinished = 0;
        let statusToCheck = 0;
        if ( status === 'signed' ){
          statusToCheck = 2
        } else if ( status === 'approved' ) {
          statusToCheck = 3;
        }
        for( const index in this.gwgsData ) {
          gwgsTotal += 1;
          if ( this.gwgsData[index].gwg_status >= statusToCheck ) {
            gwgsFinished += 1;
          }
        }

        if ( status === 'invited' ) {
          gwgsFinished = 0;
          gwgsTotal = 0;
          for( const index in this.gwgsData ) {
            gwgsTotal += 1;
            if ( this.gwgsData[index].send_webform_invitation === 1 ) {
              gwgsFinished += 1;
            }
          }
        }

        this.gwgMaxCount = gwgsTotal;
        if ( gwgsTotal > 1 ) {
          return '('+gwgsFinished+'/'+gwgsTotal+')';
        } else {
          return '';
        }
      },
      currenExternalGWGStatus(statusNameToCheck) {
        let validator = true;
        // Check if ndb was submitted
        if ( parseInt(this.reservationData.reservation_status) === 7 ) {
          for ( const index in this.gwgsData ) {
            let status = parseInt(this.gwgsData[index].gwg_status);
            if ( statusNameToCheck === 'invited' ) {
              if ( status < 1 ) {
                validator = false;
              }
            } else if ( statusNameToCheck === 'signed' ) {
              if ( status < 2 ) {
                validator = false;
              }
            } else if ( statusNameToCheck === 'approved' ) {
              if ( status !== 3 ) {
                validator = false;
              }
            }
          }
        } else {
          validator = false;
        }

        return validator;
      },
      checkIfDBValExists(val) {
        if ( val !== null && val !== '' && val !== undefined ) {
          return true;
        } else {
          return false;
        }
      },
      openFileOpenerToggler(dataPropName ,event) {
        event.preventDefault();
        this.$data[dataPropName] = !this.$data[dataPropName]
      },
      transformToTwoDecimalFloat(input) {

        if ( typeof input === 'undefined' || input === null ) {
          return NaN;
        }

        // Extract numeric part from the input
        let numericPart = input.match(/[\d.]+/g);

        // If numeric part is found, convert it to a float
        if (numericPart) {
          let number = parseFloat(numericPart[0]);

          // Round the number to 2 decimal places
          number = Math.round(number * 100) / 100;

          return number;
        }

        // If no numeric part is found, return NaN
        return NaN;
      },
      checkIsCommissionDifferent() {

        this.isCommissionChanged = false;

        // If no init request was created
        if (this.isEmpty(this.reservationData.provision_processes)) {
          this.isCommissionChanged = true;
          return;
        }

        for ( let index in this.realEstatesData ) {
          let commissionDB = this.transformToTwoDecimalFloat(this.realEstatesData[index].commission_value);
          let commissionOnOffice = this.transformToTwoDecimalFloat(this.realEstatesData[index].estate_commission);
          if ( commissionDB !== commissionOnOffice) {
            this.isCommissionChanged = true;
          }
        }

      },
    },
    computed: {
      contentData() {

        if (this.processName === 'Reservierung') {
          return ['Angelegt', 'Gemeldet', 'Bestätigt', 'Gebühr eingegangen', 'Reservation']
        } else if (this.processName === 'Abwicklung') {
          return {
            ndb: ['NDB angefragt', 'NDB ausgefüllt', 'NDB bestätigt', 'NDB gesendet an Covivio', 'NDB an Essen gesendet', 'NDB an Berlin gesendet'],
            exGwg: ['Externes GWG angefragt', 'Externes GWG ausgefüllt', 'Externes GWG bestätigt'],
            intGwg: ['Internes GWG angefragt', 'Internes GWG ausgefüllt', 'Internes GWG bestätigt'],
            provisionProcess: ['Maklerprovision angefragt', 'Maklerprovision ausgefüllt', 'Maklerprovision bestätigt'],
            finance: ['Finanzunterlagen angefragt', 'Finanzunterlagen eingereicht', 'Finanzunterlagen bestätigt']
          }
        } else if (this.processName === 'Verkauf') {
          return ['Verkaufsformular Eingereicht', 'Verkaufsformular bestätigen', 'Verkauf abgeschlossen', 'Verkauf von Covivio unterschrieben']
        }
      },
      currenStatus() {
        let reservationStatus = parseInt(this.reservationData.reservation_status);
        if (this.processName === 'Reservierung' && reservationStatus >= 5) {
          return this.reservationMaxStatus;
        } else if (this.processName === 'Reservierung' && reservationStatus < 5) {
          return reservationStatus;
        }
        if (this.processName === 'Abwicklung' && reservationStatus > 4) {
          return (reservationStatus - 5) + parseInt(this.reservationData.gwgex_process) + parseInt(this.reservationData.gwgintern_process);
        } else if (this.processName === 'Abwicklung' && reservationStatus <= 5) {
          return 0;
        }
      },
      currenInternalGWGStatus() {
        return parseInt(this.reservationData.gwgintern_process);
      },
      currenProvisionRequestStatus() {
        const provisionProcesses = this.reservationData.provision_processes;
        this.checkIsCommissionDifferent();

        if ( typeof provisionProcesses === 'undefined' || Object.keys(provisionProcesses).length === 0 ) {
          return null;
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
          this.latestProvisionProcesses = provisionProcesses[latestIndex];
          status = parseInt(provisionProcesses[latestIndex].process_status);
        }

        return status;
      },
      currenFinanceStatus() {

        let status = parseInt(this.reservationData.finance_process);
        let sendMailProcess = parseInt(this.reservationData.finance_submitted_webform_invitation);
        return sendMailProcess + status;
      },
      currenKVStatus() {
        return parseInt(this.reservationData.kv_process);
      },
      currenSaleStatus() {
        if (typeof this.verkaufsmeldungsData !== 'undefined' && this.verkaufsmeldungsData.length > 0) {
          let reported = true;
          let sold = true;
          Object.entries(this.verkaufsmeldungsData).forEach(([key, field]) => {
            if (parseInt(field.notartermin_status) < 2) {
              reported = false;
            }
            if (parseInt(field.notartermin_status) < 3) {
              sold = false;
            }
          });
          return {
            reported: reported,
            sold: sold
          }
        } else {
          return {
            reported: false,
            sold: false
          }
        }
      },
      KVCountdownFinished() {
        if (typeof this.reservationData.kv_countdown_start !== 'undefined' && this.reservationData.kv_countdown_start && this.reservationData.kv_countdown_start !== '') {
          let countdown = this.reservationData.kv_countdown_start;
          countdown = countdown.replace(' ', 'T');
          let targetDate = new Date(countdown);
          let now = new Date();
          let diff = targetDate.getTime() - now.getTime();

          let daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
          // days left returns a minus value
          return 14 + daysLeft;
        }
      },
      gwgsDataOnlyActiveOnes() {
        if (this.gwgsData !== '' && this.gwgsData.length > 0) {
          return this.gwgsData.filter(obj => parseInt(obj['gwg_status']) < 1);
        } else {
          return [];
        }
      },
      renderGWGPdfUrl(type) {
        if (type === 'without_signature') {
          if (typeof this.gwgsData[0].pdf_without_signature !== 'undefined' && this.gwgsData[0].pdf_without_signature) {
            return this.gwgsData[0].pdf_without_signature;
          } else {
            return '';
          }
        } else if (type === 'with_signature') {
          if (typeof this.gwgsData[0].pdf_with_signature !== 'undefined' && this.gwgsData[0].pdf_with_signature) {
            return this.gwgsData[0].pdf_with_signature;
          } else {
            return '';
          }
        }
      },
      getAllFinanceUploadUrls() {
        if ( typeof this.reservationData.finance_files !== 'undefined' && this.reservationData.finance_files && this.reservationData.finance_files !== '' ) {
          let financeData = JSON.parse(this.reservationData.finance_files);
          let financeFiles = [];
          Object.entries(financeData).forEach(([key, field]) => {
            Object.entries(field).forEach(([key2, field2]) => {
              financeFiles.push(this.currentEnv.url+(this.localPathToBackendUrl(field2)));
            });
          });
          return financeFiles;
        }
      },
      ndbFiles() {
        let files = this.reservationData.ndb_files;
        if ( typeof files === 'object' ) {
          return files;
        } else if ( typeof files === 'string' ) {
          return [files];
        }
      },
      renderPopupMailTriggerStatus() {
        if ( this.popupMailtriggerType === 'externalGWG' ) {
          return 'GWG';
        } else if ( this.popupMailtriggerType === 'finance' ) {
          return 'Finanz';
        } else if ( this.popupMailtriggerType === 'ndb' ) {
          return 'NDB';
        } else {
          this.popupMailtriggerType
        }
      },
      getLastProvisionData() {

        let finalString = '';
        for ( let index in this.realEstatesData ) {
          let commissionDB = this.transformToTwoDecimalFloat(this.realEstatesData[index].commission_value);
          let commissionOnOffice = this.transformToTwoDecimalFloat(this.realEstatesData[index].estate_commission);
          if ( commissionDB !== commissionOnOffice) {
            if ( !this.isEmpty(finalString) ) {
              finalString += '<br>';
            }

            commissionDB += '%';
            if ( isNaN(commissionDB) ) {
              commissionDB = '-';
            }

            finalString += this.realEstatesData[index].estate_nr + ': vorheriger Wert <b>' + commissionDB + '</b> neuer Wert <b>' + commissionOnOffice + '%</b>';

          }
        }

        return finalString;
      },
    }
  }
</script>


<template>

  <ul v-if="this.processName === 'Reservierung'">
    <li v-for="(item, index) in contentData" :key="index" v-if="this.processName === 'Reservierung'">
      <span>
        <CheckmarkIcon v-if="index < currenStatus || currenStatus === 4 || index === 0"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <span v-if="index === 0">
          <a :href="this.currentEnv.url+'reservierungen/?token='+reservationData.formular_token" target="_blank">
            {{ item }}
            <LinkIcon class="retrigger-action"></LinkIcon>
          </a>
        </span>
        <span v-else-if="index === 2">
          <a :href="this.currentEnv.url+(this.localPathToBackendUrl(reservationData.final_document_file_url))" target="_blank" v-if="parseInt(reservationData.reservation_status) >= 3">
            {{ item }}
          </a>
          <span v-else>{{ item }}</span>
        </span>
        <span v-else>{{ item }}</span>
      </span>
    </li>
  </ul>
  <div class="tab-content-col" v-if="this.processName === 'Abwicklung'">
    <ul style="margin-bottom: 25px">
      <li>
        <span>
          <CheckmarkIcon v-if="currenStatus >= 0 && parseInt(this.reservationData.reservation_status) >= 4"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>
            <router-link :to="{name: 'ndbWebform', query: {token: this.reservationData.formular_token}}" target="_blank" v-if="parseInt(this.reservationData.reservation_status) >= 4">
              {{ contentData.ndb[0] }}
              <LinkIcon class="retrigger-action"></LinkIcon>
            </router-link>
            <span v-else>
              {{ contentData.ndb[0] }}
            </span>
            <MailIcon class="retrigger-action" @click="triggerEmail('ndb')" v-if="parseInt(this.reservationData.reservation_status) >= 4"></MailIcon>
          </span>
        </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="currenStatus >= 1"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>{{ contentData.ndb[1] }}</span>
        </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="currenStatus >= 2"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <a :href="this.currentEnv.url+(this.localPathToBackendUrl(ndbFiles[0]))" target="_blank" v-if="ndbFiles && parseInt(this.reservationData.reservation_status) >= 7 && ndbFiles.length === 1">
            <span>{{ contentData.ndb[2] }}</span>
          </a>
          <a href="" @click="openFileOpenerToggler('toggleShowNDBUploads' ,$event)" target="_blank" v-else-if="ndbFiles && parseInt(this.reservationData.reservation_status) >= 7 && ndbFiles.length > 1">
            <span>{{ contentData.ndb[2] }}</span>
          </a>
          <span v-else>{{ contentData.ndb[2] }}</span>

          <div class="multiple-gwg-pdf-list" v-if="toggleShowNDBUploads" v-for="(val, index) in ndbFiles">
            <div>
              <a :href="this.currentEnv.url+(this.localPathToBackendUrl(val))" target="_blank">
                {{index+1}}. Datei öffnen
              </a>
            </div>
           </div>
        </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="currenStatus >= 2"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>{{ contentData.ndb[3] }}</span>
        </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="currenStatus >= 2 && checkIfDBValExists(reservationData.kv_data_send_to_lawyers)"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>{{ contentData.ndb[4] }}</span>
        </span>
      </li>
      <li v-if="reservationData.kv_notartermin_city === 'berlin'">
        <span>
          <CheckmarkIcon v-if="currenStatus >= 2 && checkIfDBValExists(reservationData.kv_data_send_from_lawyers_to_berlin)"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>{{ contentData.ndb[5] }}</span>
        </span>
      </li>
    </ul>
  </div>

  <div class="tab-content-col" v-if="this.processName === 'Abwicklung'">
    <ul>
      <li>
      <span>
        <CheckmarkIcon v-if="currenExternalGWGStatus('invited')"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <router-link :to="{name: 'gwgexternal', query: {token: this.reservationData.formular_token, mail: this.gwgsData[0].customer_mail}}" target="_blank" v-if="parseInt(this.reservationData.reservation_status) >= 7 && gwgMaxCount === 1">
          <span>{{ contentData.exGwg[0] }} {{ renderGWGStatus('invited') }}</span>
          <LinkIcon class="retrigger-action"></LinkIcon>
        </router-link>
        <span v-else>{{ contentData.exGwg[0] }} {{ renderGWGStatus('invited') }}</span>
        <MailIcon class="retrigger-action" @click="triggerEmail('externalGWG')" v-if="parseInt(this.reservationData.reservation_status) >= 7 && gwgMaxCount === 1"></MailIcon>
        <MailIcon class="retrigger-action" @click="gwgMailPopupActive = true" v-if="parseInt(this.reservationData.reservation_status) >= 7 && gwgMaxCount > 1"></MailIcon>
      </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="currenExternalGWGStatus('signed')"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <a :href="this.currentEnv.url+(this.localPathToBackendUrl(this.gwgsData[0].pdf_without_signature))" target="_blank" v-if="typeof this.gwgsData[0] !== 'undefined' && this.gwgsData[0].pdf_without_signature && parseInt(this.gwgsData[0].gwg_status) >= 2 && gwgMaxCount === 1">
            <span>{{ contentData.exGwg[1] }} {{ renderGWGStatus('signed') }}</span>
           </a>
          <span v-else>{{ contentData.exGwg[1] }} {{ renderGWGStatus('signed') }}</span>
        </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="currenExternalGWGStatus('approved')"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
           <a :href="this.currentEnv.url+(this.localPathToBackendUrl(this.gwgsData[0].pdf_with_signature))" target="_blank" v-if="typeof this.gwgsData[0] !== 'undefined' && this.gwgsData[0].pdf_with_signature && parseInt(this.gwgsData[0].gwg_status) >= 3 && gwgMaxCount === 1">
            <span>{{ contentData.exGwg[2] }} {{ renderGWGStatus('approved') }}</span>
           </a>
           <a href="" @click="openFileOpenerToggler('toggleShowGwgPdfs',$event)" v-else-if="gwgMaxCount > 1">
            <span>{{ contentData.exGwg[2] }} {{ renderGWGStatus('approved') }}</span>
           </a>
          <span style="display: inline-block;" v-else>{{ contentData.exGwg[2] }} {{ renderGWGStatus('approved') }}</span>
          <div class="multiple-gwg-pdf-list" v-if="toggleShowGwgPdfs" v-for="(val, index) in gwgsData">
            <div v-if="val.pdf_with_signature">
              <a :href="this.currentEnv.url+(this.localPathToBackendUrl(val.pdf_with_signature))" target="_blank">
                {{index+1}}. PDF öffnen
              </a>
            </div>
           </div>
        </span>
      </li>
    </ul>
  </div>
  <div class="tab-content-col" v-if="this.processName === 'Abwicklung'">
    <ul>
      <li>
      <span>
        <CheckmarkIcon v-if="currenInternalGWGStatus >= 0 && currenStatus >= 2"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <span>{{ contentData.intGwg[0] }}</span>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenInternalGWGStatus >= 1"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <a :href="this.currentEnv.url+(this.localPathToBackendUrl(this.reservationData.gwgintern_pdf_without_signature))" target="_blank" v-if="this.reservationData.gwgintern_pdf_without_signature && parseInt(this.reservationData.reservation_status) >= 6">
          {{ contentData.intGwg[1] }}
        </a>
        <span v-else>{{ contentData.intGwg[1] }}</span>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenInternalGWGStatus >= 2"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <a :href="this.currentEnv.url+(this.localPathToBackendUrl(this.reservationData.gwgintern_pdf_with_signature))" target="_blank" v-if="this.reservationData.gwgintern_pdf_with_signature && parseInt(this.reservationData.reservation_status) >= 6">
          {{ contentData.intGwg[2] }}
        </a>
        <span v-else>{{ contentData.intGwg[2] }}</span>
      </span>
      </li>
    </ul>
  </div>
  <div class="tab-content-col" v-if="this.processName === 'Abwicklung'">
    <ul>
      <li>
      <span>
        <CheckmarkIcon v-if="currenFinanceStatus <= 3 && currenFinanceStatus > 0"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <router-link :to="{name: 'financesUploads', query: {token: this.reservationData.formular_token}}" target="_blank" v-if="parseInt(this.reservationData.reservation_status) >= 7">
            {{ contentData.finance[0] }}
            <LinkIcon class="retrigger-action"></LinkIcon>
          </router-link>
          <span v-else>
            {{ contentData.finance[0] }}
          </span>
        <MailIcon class="retrigger-action" @click="triggerEmail('finance')" v-if="parseInt(this.reservationData.reservation_status) >= 7"></MailIcon>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenFinanceStatus >= 2"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <span>{{ contentData.finance[1] }}</span>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenFinanceStatus >= 3"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <a href="" @click="openFileOpenerToggler('toggleShowFinanceUploads', $event);">{{ contentData.finance[2] }}</a>
         <div class="multiple-finance-uploads-list" v-if="getAllFinanceUploadUrls && toggleShowFinanceUploads" v-for="(val, index) in getAllFinanceUploadUrls">
            <div v-if="val">
              <a :href="val" target="_blank">
                {{index+1}}. Datei öffnen
              </a>
            </div>
           </div>
      </span>
      </li>
    </ul>
  </div>
  <div class="tab-content-col" v-if="this.processName === 'Abwicklung' && this.isAgentProvisionFeatureStart()">
    <ul>
      <li>
      <span>
        <CheckmarkIcon v-if="currenProvisionRequestStatus >= 0 && currenProvisionRequestStatus !== null"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <span>{{ contentData.provisionProcess[0] }}</span>
        <MailIcon class="retrigger-action" v-if="isCommissionChanged" @click="triggerEmail('provision')"></MailIcon>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenProvisionRequestStatus >= 1"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>{{ contentData.provisionProcess[1] }}</span>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenProvisionRequestStatus >= 2"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <a :href="this.currentEnv.url+(this.localPathToBackendUrl(latestProvisionProcesses.pdf_path_signed))" target="_blank" v-if="parseInt(latestProvisionProcesses.process_status) >= 2">
            {{ contentData.provisionProcess[2] }}
          </a>
          <span v-else>{{ contentData.provisionProcess[2] }}</span>
      </span>
      </li>
    </ul>
  </div>
  <div class="tab-content-col" v-if="this.processName === 'Abwicklung'">
    <ul>
      <li>
      <span>
        <CheckmarkIcon v-if="currenKVStatus >= 2"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>
            KV an Kunden geschickt
          </span>
      </span>
      </li>
      <li>
      <span>
        <CheckmarkIcon v-if="currenKVStatus >= 3"></CheckmarkIcon>
        <HoursglasshalfIcon v-else></HoursglasshalfIcon>
        <span> KV final hochgeladen</span>
      </span>
      </li>
      <li>
        <span>
          <CheckmarkIcon v-if="(currenKVStatus >= 3 && KVCountdownFinished <= 0) || this.checkIfIsNDBBusinessCustomer(reservationData)"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span> 14 Tage</span>
        </span>
      </li>
    </ul>
  </div>

  <ul v-if="this.processName === 'Verkauf'">
    <li v-for="(item, index) in contentData" :key="index" v-if="this.processName === 'Verkauf'">
        <span>
          <CheckmarkIcon v-if="(index === 0 && currenSaleStatus.reported)|| ((index === 1 || index === 2) && currenSaleStatus.sold) || checkIfDBValExists(reservationData.kv_signed_by_covivio)"></CheckmarkIcon>
          <HoursglasshalfIcon v-else></HoursglasshalfIcon>
          <span>
              {{ item }}
          </span>
        </span>
    </li>
  </ul>

  <div class="popup-multiple-gwgs" :class="{'active': gwgMailPopupActive}">
    <div class="popup-multiple-gwgs-inner-wrapper">
      <div class="head">
        <CloseIcon @click="gwgMailPopupActive = false"></CloseIcon>
      </div>
      <div class="body">
        <div class="gwg-customer-list" v-if="gwgsDataOnlyActiveOnes.length > 0">
          <span class="title">Wähle die Kunden, welche das GWG-Webform per E-Mail erhalten soll:</span>
          <div v-for="index in gwgsDataOnlyActiveOnes" :key="index.id">
            <label :for="index.id" :class="{'invalid': !gwgMailSelectedValid}">
              <input type="checkbox" :id="index.id" :name="index.id+''" :value="index.id" v-model="gwgMailSelectedCustomers">
              <div class="label-wrapper">
                <span>{{index.customer_mail}}</span>
                <span>KdNr.: {{index.customer_kdnr}}</span>
              </div>
            </label>
          </div>
        </div>
        <div v-else style="padding-bottom: 20px;">
          Alle Kunden GWGs wurden bereits akzeptiert.
        </div>
        <div class="actions" v-if="gwgsDataOnlyActiveOnes.length > 0">
          <Button type="report" @click="triggerEmail('externalGWG')" style="flex-basis: 100%;">
            E-Mail senden
            <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon>
          </Button>
        </div>
      </div>
    </div>
  </div>

  <div class="mail-confirmation-popup">
    <div class="modal-wrapper" :class="{ active: isOpenModalEmailTrigger }" v-if="isOpenModalEmailTrigger">
      <div class="modal-inner-wrapper">

        <div class="modal-header">
          <div class="title" style="font-size: 18px; font-weight: 700;"> {{ renderPopupMailTriggerStatus }} E-Mail senden</div>
          <CloseIcon class="modal-close" @click="isOpenModalEmailTrigger = false"></CloseIcon>
        </div>

        <div class="modal-body">

          <div style="margin-top: 25px;" v-if="popupMailtriggerType === 'provision'">
            Der Kunde hat noch keine Nachweis und Vermittlungsbestätigung unterschrieben oder bei mindestens einer Immobilie in der Reservierung wurde eine Veränderung der Provision festgestellt.<br> Wollen Sie dem Kunden eine neue Anfrage zur Nachweis und Vermittlungsbestätigung zusenden?
            <div class="field-wrapper">
               <span :class="{'invalid': this.isEmpty(selectedProvisionDate), 'valid': !this.isEmpty(selectedProvisionDate)}">
                <InputField inputType="date" inputName="Dateofbirth" :inputValue="selectedProvisionDate" v-model="selectedProvisionDate"></InputField>
                <label class="ph">Besichtigung am: <AsterixMarkIcon></AsterixMarkIcon></label>
              </span>
            </div>

            <div class="history" style="margin-top:25px;">
              <div v-html="getLastProvisionData"></div>
            </div>

          </div>
          <div class="actions">
            <Button type="delete" @click="isOpenModalEmailTrigger = false">Schließen</Button>
            <Button type="report" @click="triggerEmail(false)" data-cy="submit">E-Mail senden <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon></Button>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>


<style scoped>

ul {
  list-style: none;
}

li {
  position: relative;
}

li + li {
  margin-top: 5px;
}

i:not(.retrigger-action) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -25px;
  font-size: 16px;
}

i.modal-close {
  position: relative;
  top: 0;
  transform: unset;
  left: 0;
  font-size: unset;
}

i.fa-check, i.fa-check + span {
  color: var(--blue);
}

i.retrigger-action {
  color: var(--blue);
  margin-left: 10px;
}

a {
  text-decoration: underline;
}

.tab-content-col {
  flex-basis: 50%;
}

.tab-content-col + .tab-content-col {
  margin-bottom: 25px;
}

a {
  color: var(--blue);
}

.popup-multiple-gwgs {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
}

.popup-multiple-gwgs.active {
  display: block;
}

.popup-multiple-gwgs-inner-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 25px;
  width: 90%;
}

.popup-multiple-gwgs-inner-wrapper .head {
  display: flex;
  justify-content: end;
}

.popup-multiple-gwgs-inner-wrapper .head i {
  position: unset;
  top: -5px;
  left: unset;
  font-size: 20px;
  transform: unset;
}

.gwg-customer-list label {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: fit-content;
}

.gwg-customer-list > div {
  margin-top: 15px;
}

.gwg-customer-list label input {
  top: 0;
  margin-right: 15px;
}

.gwg-customer-list label span {
  display: block;
  cursor: pointer;
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

.invalid input, label.invalid {
  border-left: 5px solid red;
}

.fa-hourglass-half + a {
  color: inherit;
  text-decoration: none;
}

.multiple-gwg-pdf-list, .multiple-finance-uploads-list {
  margin-top: 5px;
  padding-left: 10px;
}

.field-wrapper {
  display: flex;
  margin-top: 15px;
}

.field-wrapper > span {
  width: 100%;
}

</style>
