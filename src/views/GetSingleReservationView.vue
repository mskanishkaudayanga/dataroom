<script>
import axios from "axios";
import CardTitle from "../components/card/CardTitle.vue";
import CloseIcon from "../components/icons/icon-close.vue";
import ProcessTab from "../components/card/ProcessTabs.vue";
import RealEstateList from "../components/card/RealEstateList.vue";
import Button from "../components/buttons/button.vue";
import InputField from "../components/forms/InputField.vue";
import UploadFieldArea from "../components/forms/UploadDragAndDrop.vue";
import AlertMessage from "../components/card/AlertMessage.vue";
import ProcessTabContent from "../components/card/ProcessTabsContent.vue";
import TextAreaField from "../components/forms/TextAreaField.vue";
import AnimateCircleIcon from "../components/icons/icon-animate-loading-circle.vue";
import GwgInternForm from "@/components/card/GwgInternForm.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import FinanceUploadFields from "@/components/forms/FinanceUploadFields.vue";
import DiscountIcon from "@/components/icons/icon-discount.vue";
import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";
import DeleteIcon from "@/components/icons/icon-delete.vue";
import MailIcon from "@/components/icons/icon-mail.vue";
import HistoryIcon from "@/components/icons/icon-history.vue";
import DownloadIcon from "@/components/icons/icon-download.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import ReservationFileChanges from "@/components/forms/ReservationFileChanges.vue";
import ImagesIcon from "@/components/icons/icon-images.vue";
import FilesIcon from "@/components/icons/icon-files.vue";
import {reservationStateStore} from "@/stores/reservationStateStore";

export default {
  name: "getSingleReservationModal",
  components: {
    FilesIcon,
    ImagesIcon,
    ReservationFileChanges,
    AsterixMarkIcon,
    DownloadIcon,
    HistoryIcon,
    MailIcon,
    DeleteIcon,
    CheckmarkIcon,
    DiscountIcon,
    FinanceUploadFields,
    Dropdown,
    DropdownArrow,
    GwgInternForm,
    AnimateCircleIcon,
    TextAreaField,
    ProcessTabContent,
    UploadFieldArea,
    InputField,
    Button,
    RealEstateList,
    ProcessTab,
    CardTitle,
    CloseIcon,
    AlertMessage
  },
  data() {
    return {
      reservationId: this.$route.params.id,
      apiResponseReservation: '',
      apiResponseCustomer: '',
      apiResponseGWGs: [],
      apiResponseReservationFinished: false,
      reservationRawData: false,
      apiResponseCustomerFinished: false,
      apiResponseGWGsFinished: false,
      apiResponseStatus: false,
      apiRealEstates: [],
      isOpenModal: false,
      isLoading: false,
      isLoadingRealEstates: false,
      isLoadingDeleteNotaryAppointment: false,
      deleteReservationStarted: false,
      deleteReservationStartedOnInit: false,
      deleteConfirmation: false,
      deleteApiStatus: 404,
      reportReservationStarted: false,
      reportApiStatus: 404,
      approveReservationStarted: false,
      approveApiStatus: 404,
      approveApiIframeUrl: '',
      filesForReport: '',
      filesForReportValid: true,
      approveProvisionProcess: false,
      isOpenProvisionToApprove: false,
      approveProvisionProcessIframeUrl: '',
      alertStatus: '',
      alertMessage: '',
      processTabClicked: false,
      processTabClick: '',
      rejectReservationStarted: false,
      rejectConfirmation: false,
      rejectReason: '',
      reservationWithFee: false,
      approveReceivedFee: false,

      ndbResponse: [],
      ndbDownloadUrl: '/files/ndb_vorlage.xlsx',
      ndbProjectEntity: '',

      triggerGWGReload: '',

      deleteReservationReason: {
        valid: true,
        value: '',
      },
      deleteReservationCustomText: {
        valid: true,
        value: '',
      },

      ndbProcessStarted: false,
      ndbShowCustomerSubmittedFormData: false,
      ndbUploadedFiles: [],
      ndbUploaded: [],
      ndbUploadedFilesValid: true,
      ndbFinished: false,
      ndbApproveProcess: false,
      ndbRejectProcess: false,
      ndbRejectReason: '',

      externalGWGProcess: false,
      externalGWGRejectProcess: [],
      externalGWGApproveProcess: false,
      externalGWGRejectReason: '',
      externalGWGForApproval: 0,

      internalGWGProcess: false,
      internalGWGReportProcess: false,
      internalGWGRejectProcess: false,
      internalGWGApproveProcess: false,
      internalGWGRejectReason: '',

      internalGWGFormData: {},
      internalGWGFormDataValidation: false,

      FinanceProcess: false,
      FinanceRejectProcess: false,
      FinanceApproveProcess: false,
      FinanceEditProcess: false,
      FinanceUploadEditProcess: false,
      FinanceRejectReason: '',
      FinanceFilesApiResponse: '',

      uploads: {
        1: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        2: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        3: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        4: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        5: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        }
      },

      StartKV: false,

      KvCustomerReceivedData: false,
      KvCustomerReceivedFile: {
        valid: true,
        file: '',
      },

      KvFinalUploadProcess: false,
      finalKvUpload: false,
      KvFinalUploadFile: {
        valid: true,
        file: '',
      },
      KvFinalUploadFileDrafts: {
        valid: true,
        files: [],
      },
      KvFinalUploadChangeType: false,

      KvCreateNotartermin: false,
      KvDeleteNotartermin: false,
      KvNotarterminDate: {
        valid: true,
        value: '',
      },

      KvNotarterminDateEditProcess: false,

      KvCreateDiscountRequest: false,
      KvDiscountRequestData: [],

      KvDiscountInit: false,
      KvDiscountProcess: false,
      KvDiscountReject: false,
      KvDiscountRejectReason: '',

      KvDiscountApprove: false,
      KvDiscountApprovedValue: [],

      CommissionChangeProcess: false,
      CommissionChangeApprove: false,
      CommissionChangeReject: false,
      CommissionChangeApprovedValue: [],

      PriceChangeProcess: false,
      PriceChangeApprovedValue: [],

      uploadCatsDE: [
        'Kontoauszug',
        'Schreiben der Bank zur Bestätigung der entsprechenden Mittel',
        'Aufnahme / Bild des Banksaldos',
      ],
      dropdownsEditUploads: {},
      dropdownRelativePosition: false,

      triggerInternalGWGFormValidation: '',

      notaryAppointmentOccuredProcess: false,
      notaryAppointmentNotOccuredProcess: false,

      verkaufsmeldungAPIData: [],
      hasSoldUnits: false,

      cancelProcess: false,
      cancelProcessApprove: false,
      cancelData: [],

      dropdownsCancelReason: {},

      dropdownsDeleteReason: false,

      cancelReasons: {
        'Finanzierung nicht möglich': 'Finanzierung nicht möglich',
        'Für anderes Objekt bei Best Place entschieden': 'Für anderes Objekt bei Best Place entschieden',
        'Für Konkurrenzprodukt entschieden': 'Für Konkurrenzprodukt entschieden',
        'Kaufpreis zu hoch': 'Kaufpreis zu hoch',
        'Immobilie unpassend': 'Immobilie unpassend',
        'Lage unpassend': 'Lage unpassend',
        'Sonstiges': 'Sonstiges',
        'Unbekannt': 'Unbekannt'
      },

      apiResponseAllMailings: [],
      showMailingHistory: false,

      showFileChangeView: false,

      startNotaryToLawyerProcess: false,
      KvNotarterminCity: {
        valid: true,
        value: 'berlin',
      },
      KvSendToLawyerDate: {
        valid: true,
        value: '',
      },

      startFinalSaleCovivoSignedProcess: false,
      finalSaleCovivoSignedDate: {
        valid: true,
        value: '',
      },

      showNDBSummary: false,

      mergedDataForReservationFileChangeView: '',
    }
  },
  methods: {
    updateRealEstateList(data) {
      this.apiRealEstates = data;
    },
    updateRealEstateLoadingStatus(status) {
      this.isLoadingRealEstates = status;
    },
    checkIfIsOpenProvisionProcessToApprove() {
      let provisionProcesses = this.apiResponseReservation.provision_processes;

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

      if ( typeof provisionProcesses[latestIndex].yousign_reservation_department_link !== 'undefined' && provisionProcesses[latestIndex].yousign_reservation_department_link !== null && provisionProcesses[latestIndex].yousign_reservation_department_link !== '' ) {
        setTimeout(
            ()=>{
              const yousign = new Yousign({
                signatureLink: provisionProcesses[latestIndex].yousign_reservation_department_link,
                iframeContainerId: 'provision-approval',
                isSandbox: this.yousignSandbox,
              });
            },
            500
        )
      }

      this.isOpenProvisionToApprove = status === 1;

    },
    checkKvNotification() {

      if ( !this.KvNotarterminDate.value || this.KvNotarterminDate.value === '' || this.KvNotarterminDate.value === '0000-00-00 00:00:00' ) {
        this.KvNotarterminDateEditProcess = false;
      } else {
        this.KvNotarterminDateEditProcess = true;
      }
    },
    closeDropdowns() {
      for (const index in this.dropdownsEditUploads) {
        this.dropdownsEditUploads[index] = false;
      }

      for (const index in this.dropdownsCancelReason) {
        this.dropdownsCancelReason[index] = false;
      }

      this.dropdownsDeleteReason = false;
    },
    changeUploadFileCategory(mediaUrl, event) {
      let formatedCat = event.replaceAll(' ', '_');
      formatedCat = formatedCat.replaceAll('/', '_');

      for (const catName in this.FinanceFilesApiResponse) {
        for (const valIndex in this.FinanceFilesApiResponse[catName]) {
          if (this.FinanceFilesApiResponse[catName][valIndex] === mediaUrl) {
            this.FinanceFilesApiResponse[catName].splice(valIndex, 1);
            if (this.FinanceFilesApiResponse[catName].length === 0) {
              delete this.FinanceFilesApiResponse[catName];
            }
          }
        }
      }

      if (typeof this.FinanceFilesApiResponse[formatedCat] === 'undefined') {
        this.FinanceFilesApiResponse[formatedCat] = [mediaUrl];
      } else {
        this.FinanceFilesApiResponse[formatedCat].push(mediaUrl);
      }

    },
    submitEditUploadCategories() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "updatedCats": this.FinanceFilesApiResponse,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/updateUploadCategories', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  // this.isOpenModal = false;
                  // this.resetData();
                  this.FinanceEditProcess = false;
                  this.notificationBannerInit('success', 'Änderung wurde erfolgreich übernommen');
                  this.getFinanceFiles();
                  // this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Änderung konnte nicht übernommen werden');
                console.log(error);
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )

    },
    setDropdownTop(index, $event) {
      const eleName = $event.target.name;
      const additionalSpace = 5;
      if (this.$refs['input' + eleName] !== undefined) {
        this.$refs['dropdown' + eleName][0].$el.style.top = this.$refs['input' + eleName][0].$el.clientHeight + additionalSpace + 'px';
      }

      let element = this.$refs['dropdown' + eleName][0];
      if ( typeof element === undefined || element === null ) {
        element = this.$refs['dropdown' + eleName];
      }

      if ( typeof element !== 'undefined' && !this.isInViewport(element.$el) ) {
        this.dropdownRelativePosition = true;
        this.$refs['dropdown' + eleName].$el[0].style.top = '0px';
      } else {
        this.dropdownRelativePosition = false;
      }
    },
    toggleDropdowns(index) {
      if (typeof this.dropdownsEditUploads[index] !== 'undefined') {
        this.dropdownsEditUploads[index] = !this.dropdownsEditUploads[index];
      } else {
        this.dropdownsEditUploads[index] = true;
      }
    },
    toggleCancelReasonDropdowns(index) {
      if (typeof this.dropdownsCancelReason[index] !== 'undefined') {
        this.dropdownsCancelReason[index] = !this.dropdownsCancelReason[index];
      } else {
        this.dropdownsCancelReason[index] = true;
      }
    },
    toggleDeleteReasonDropdowns(index) {
      if (typeof this.dropdownsCancelReason[index] !== 'undefined') {
        this.dropdownsCancelReason[index] = !this.dropdownsCancelReason[index];
      } else {
        this.dropdownsCancelReason[index] = true;
      }
    },
    updateCancelReasonDropdown(index, clickedText) {
      this.cancelData[index].reason = clickedText;
      this.closeDropdowns();
    },
    updateDeleteReasonDropdown(clickedText) {
      this.deleteReservationReason.value = clickedText;
      this.closeDropdowns();
    },
    async getApisData() {
      this.isLoading = true;

      const store = reservationStateStore();
      this.apiResponseReservation = store.getReservation;
      if ( typeof this.apiResponseReservation.ndb_files === 'string' && this.apiResponseReservation.ndb_files.includes('[') ){
        // Only new json string will have clip char
        this.apiResponseReservation.ndb_files = JSON.parse(this.apiResponseReservation.ndb_files);
      }
      this.apiResponseStatus = 200;
      this.updateDataAfterApiCall();
      this.apiResponseReservationFinished = true;

      this.apiResponseGWGs = this.apiResponseReservation.gwgs_raw;
      let gwgsForApproval = this.apiResponseGWGs.filter(obj => parseInt(obj['gwg_status']) === 2);
      this.externalGWGForApproval = gwgsForApproval.length;
      let rejectProcesses = [];
      for ( const val in gwgsForApproval ) {
        let gwgId = gwgsForApproval[val].id;
        let data = {[gwgId]: false};
        rejectProcesses.push(data);
      }
      this.externalGWGRejectProcess = rejectProcesses;
      this.apiResponseGWGsFinished = true;

      this.verkaufsmeldungAPIData = this.apiResponseReservation.verkaufsmeldung_raw;

      this.apiResponseCustomerFinished = false;

      // Get single reservation via api
      // await axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservation?reservationId=' + reservationId)
      //     .then(
      //         (response) => {
      //           this.apiResponseReservation = response.data.response[0];
      //           if ( typeof this.apiResponseReservation.ndb_files === 'string' && this.apiResponseReservation.ndb_files.includes('[') ){
      //             // Only new json string will have clip char
      //             this.apiResponseReservation.ndb_files = JSON.parse(this.apiResponseReservation.ndb_files);
      //           }
      //           this.apiResponseStatus = this.checkValideApiResponse(response.data);
      //           this.updateDataAfterApiCall();
      //         }
      //     )
      //     .catch(
      //         (error) => {
      //           this.apiResponseReservation = error;
      //         }
      //     ).finally(
      //         () => {
      //           this.apiResponseReservationFinished = true;
      //         }
      //     )

      // Get single customer data via api
      await axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString=' + this.apiResponseReservation.customer_kdnr + '&company=' + this.apiResponseReservation.company + '&onlyCustomerNrSearch=true')
          .then(
              (response) => {
                this.apiResponseCustomer = response.data.response.client_data[0];
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          ).finally(
              () => {
                this.isLoading = false;
                this.apiResponseCustomerFinished = true;
              }
          )

        // get gwgs of reservation
        //   await axios.get(this.globalApiBaseUrl + '/reservations/getAllExternalGWGs?reservationId='+reservationId)
        //     .then(
        //         (response) => {
        //           if ( response.data.status === 200 ){
        //             this.apiResponseGWGs = response.data.response;
        //
        //             let gwgsForApproval = this.apiResponseGWGs.filter(obj => parseInt(obj['gwg_status']) === 2);
        //             this.externalGWGForApproval = gwgsForApproval.length;
        //             let rejectProcesses = [];
        //             for ( const val in gwgsForApproval ) {
        //               let gwgId = gwgsForApproval[val].id;
        //               let data = {[gwgId]: false};
        //               rejectProcesses.push(data);
        //             }
        //             this.externalGWGRejectProcess = rejectProcesses;
        //           }
        //         }
        //     )
        //     .catch(
        //         (error) => {
        //           console.log(error);
        //         }
        //     ).finally(
        //         () => {
        //           this.isLoading = false;
        //           this.apiResponseGWGsFinished = true;
        //         }
        //     )

        // if ( parseInt(this.apiResponseReservation.reservation_status) >= 7 ){
        //   await axios.get(this.globalApiBaseUrl + '/verkaufsmeldung/getReservationVerkaufsmeldungen?reservationId=' + reservationId)
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
    getGWGAPIData() {
      this.isLoading = true;

      axios.get(this.globalApiBaseUrl + '/reservations/getAllExternalGWGs?reservationId='+this.reservationId)
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  this.apiResponseGWGs = response.data.response;

                  let gwgsForApproval = this.apiResponseGWGs.filter(obj => parseInt(obj['gwg_status']) === 2);
                  this.externalGWGForApproval = gwgsForApproval.length;
                  let rejectProcesses = [];
                  for ( const val in gwgsForApproval ) {
                    let gwgId = gwgsForApproval[val].id;
                    let data = {[gwgId]: false};
                    rejectProcesses.push(data);
                  }
                  this.externalGWGRejectProcess = rejectProcesses;
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
    closeModal() {
      this.apiResponseStatus = false;
      this.isOpenModal = false;
      this.apiResponseCustomer = '';
      this.approveApiStatus = 404;
      this.approveReservationStarted = false;
      this.approveApiIframeUrl = '';
      this.redirectToHomeView();
    },
    deleteReservation() {

      if ( this.isLoading ) {
        return;
      }

      if ( this.deleteReservationReason.value === '' ) {
        this.deleteReservationReason.valid = false;
        return;
      }
      this.deleteReservationReason.valid = true;

      if ( this.deleteReservationReason.value === 'Sonstiges' ) {
        let textArea = this.deleteReservationCustomText.value.replace(/\s/g, "");
        if ( this.deleteReservationCustomText.value === '' || textArea === '' ) {
          this.deleteReservationCustomText.valid = false;
          return
        }
      }
      this.deleteReservationCustomText.valid = true;

      this.isLoading = true;
      let data = JSON.stringify({
        'reservationId': this.reservationId,
        'deleteReason': this.deleteReservationReason.value,
        'deleteCustomText': this.deleteReservationCustomText.value
      });

      axios({method: 'delete', url: this.globalApiBaseUrl + '/reservations/deleteReservation', data: data})
          .then(
              (response) => {
                this.deleteApiStatus = response.data.status;
                this.$emit('deletedReservation', this.reservationId);
                this.resetData();
                this.redirectToHomeView();
                this.notificationBannerInit('success', 'Reservierung erfolgreich gelöscht');
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
    updateDataAfterApiCall() {
      if (typeof this.apiResponseReservation.kv_requestedSalesPrice !== 'undefined' && this.apiResponseReservation.kv_requestedSalesPrice && this.apiResponseReservation.kv_requestedSalesPrice !== '') {
        this.KvDiscountApprovedValue = this.apiResponseReservation.kv_requestedSalesPrice;
      } else {
        this.KvDiscountApprovedValue = '';
      }

      if (typeof this.apiResponseReservation.kv_notartermin_date !== 'undefined' && this.apiResponseReservation.kv_notartermin_date && this.apiResponseReservation.kv_notartermin_date !== '') {
        this.KvNotarterminDate.value = this.apiResponseReservation.kv_notartermin_date;
        this.KvNotarterminDate.valid = true;
      } else {
        this.KvNotarterminDate.value = '';
      }
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
    updateFilesForReport(files) {
      this.filesForReport = files[0];
    },
    updateFilesForKVCustomerReceived(files) {
      this.KvCustomerReceivedFile.file = files[0];
      if (typeof this.KvCustomerReceivedFile.file === undefined || this.KvCustomerReceivedFile.file === '') {
        this.KvCustomerReceivedFile.valid = false;
      } else {
        this.KvCustomerReceivedFile.valid = true;
      }
    },
    updateFilesForFinalKv(files) {
      if ( parseInt(this.apiResponseReservation.sale_create_vkm) === 1 ){
        this.finalKvUpload = true;
      } else {
        this.finalKvUpload = false;
      }

      this.KvFinalUploadFile.file = files[0];
      if (typeof this.KvFinalUploadFile.file === undefined || this.KvFinalUploadFile.file === '') {
        this.KvFinalUploadFile.valid = false;
      } else {
        this.KvFinalUploadFile.valid = true;
      }
    },
    updateFilesForFinalKvDraft(files) {
      this.KvFinalUploadFileDrafts.files = files;
      if (typeof this.KvFinalUploadFileDrafts.files === undefined || this.KvFinalUploadFile.files === '') {
        this.KvFinalUploadFileDrafts.valid = false;
      } else {
        this.KvFinalUploadFileDrafts.valid = true;
      }
    },
    updateNdbFileForReport(files) {
      this.ndbUploadedFiles = files;
    },
    reportReservation() {

      if ( this.isLoading ) {
        return;
      }

      if ( typeof this.filesForReport === 'undefined' || this.filesForReport === '' ) {
        this.filesForReportValid = false;
        return;
      }
      this.filesForReportValid = true;

      this.isLoading = true;
      let formData = new FormData();
      formData.append('file', this.filesForReport);
      formData.append('reservationId', this.reservationId);

      axios.post(this.globalApiBaseUrl + '/reservations/reportReservation', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
          .then(
              (response) => {
                this.reportApiStatus = response.data.status;
                this.notificationBannerInit('success', 'DIE RESERVIERUNG WURDE EINGEREICHT');
                this.resetData();
                this.redirectToHomeView();
                this.reloadDashboard();
              }
          )
          .catch(
              (error) => {
                this.reportApiStatus = error;
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    triggerReservationsReload() {
      this.reloadDashboard();
    },
    getReservationIframeUrl() {
      // this.isLoading = true;
      this.approveReservationStarted = true;

      console.log(this.apiResponseReservation.reservation_dep_iframlink)

      setTimeout(
          ()=>{
            const yousign = new Yousign({
              signatureLink: this.apiResponseReservation.reservation_dep_iframlink,
              iframeContainerId: 'reservation-approval',
              isSandbox: this.yousignSandbox,
            });
          },
          500
      )

      // axios.get(this.globalApiBaseUrl + '/reservations/getIframeByReservationsid?reservationId=' + this.reservationId)
      //     .then(
      //         (response) => {
      //           if (response.data.status === 200) {
      //             this.approveApiStatus = response.data.status;
      //             this.approveApiIframeUrl = response.data.response;
      //           }
      //           this.isLoading = false;
      //         }
      //     )
      //     .catch(
      //         (error) => {
      //           console.log(error);
      //         }
      //     ).finally(
      //     () => {
      //       this.isLoading = false;
      //     }
      // )
    },
    approveReservation() {
      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/approveReservation', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                  this.notificationBannerInit('success', 'DIE RESERVIERUNG WURDE AKZEPTIERT');
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
    approveReservationFeeReceived() {

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/receivedReservationfee', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                  this.notificationBannerInit('success', 'DIE RESERVIERUNGSGEBÜHR IST EINGEGANGEN');
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
    rejectReservation() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "reservationRejectReason": this.rejectReason,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/rejectReservation', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.notificationBannerInit('success', 'DIE RESERVIERUNG WURDE ABGELEHNT')
                  this.redirectToHomeView();
                  this.reloadDashboard();
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
    rejectExternalGWG(gwgId) {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "rejectReason": this.externalGWGRejectReason,
        "gwgID": gwgId
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/rejectExternalGWG', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.getApisData();
                  this.notificationBannerInit('success', 'DAS EXTERNES GWG WURDE ABGELEHNT');
                  this.externalGWGRejectReason = false;
                  this.reloadDashboard();
                  if ( this.externalGWGForApproval <= 1) {
                    this.resetData();
                    this.redirectToHomeView();
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
    processTabClickEvent(data) {
      if (!this.processTabClicked) {
        this.processTabClicked = true;
      }
      if (this.processTabClicked && this.processTabClick === data) {
        this.processTabClicked = false;
        this.processTabClick = '';
      } else {
        this.processTabClick = data;
      }
    },
    reloadDashboard() {
      this.$emit('detectCompleteReload', true);
    },
    checkIfRealEstatesGotFee(arrayOfRealEstates) {
      let returnVal = false;
      for (const RealEstate of arrayOfRealEstates) {
        if (RealEstate['estate_fee'] && parseInt(RealEstate['estate_fee']) > 0) {
          returnVal = true;
          break;
        }
      }
      return returnVal
    },
    downloadNDBTemplate() {

      window.open(this.ndbDownloadUrl);

    },
    getNDBProjectData() {
      let projects = [];
      this.apiRealEstates.forEach(function (item, index) {
        projects.push(item.project_name);
      });

      axios.get(this.globalApiBaseUrl + '/reservations/getProjectBasedNDBData')
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.ndbResponse = response.data.response;
                  for (const apiData in response.data.response) {
                    if ( projects.includes(response.data.response[apiData].projectName) ) {
                      if ( typeof response.data.response[apiData].projectNDBFile !== undefined && response.data.response[apiData].projectNDBFile !== '' ) {
                        this.ndbDownloadUrl = response.data.response[apiData].projectNDBFile;
                        this.ndbProjectEntity = response.data.response[apiData].projectEntity;
                      } else {
                        this.ndbDownloadUrl = '/files/ndb_vorlage.xlsx';
                        this.ndbProjectEntity = '';
                      }
                    }
                  }
                } else {
                  this.ndbDownloadUrl = '/files/ndb_vorlage.xlsx';
                  this.ndbProjectEntity = '';
                }
              }
          )
          .catch(
              (error) => {
                this.FinanceFilesApiResponse = error;
                this.ndbDownloadUrl = '/files/ndb_vorlage.xlsx';
                this.ndbProjectEntity = '';
              }
          ).finally(
          () => {
            this.isLoading = false;
          })
    },
    submitNDBAgent() {

      if ( this.isLoading ) {
        return;
      }

      if ( typeof this.ndbUploadedFiles === 'undefined' || this.ndbUploadedFiles.length === 0 ){
        this.ndbUploadedFilesValid = false;
        return;
      }

      this.ndbUploadedFilesValid = true;

      this.isLoading = true;
      let formData = new FormData();
      formData.append('reservationId', this.reservationId);

      for (const [fileIndex, val] in this.ndbUploadedFiles) {
        formData.append('files['+fileIndex+']', this.ndbUploadedFiles[fileIndex]);
      }

      axios.post(this.globalApiBaseUrl + '/reservations/reportNDB', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }
        ).then(
            (response) => {
              this.reportApiStatus = response.data.status;
              this.ndbFinished = true;
              this.resetData();
              this.redirectToHomeView();
              this.reloadDashboard();
              this.notificationBannerInit('success', 'DAS NDB WURDE EINGEREICHT')
            }
        )
        .catch(
            (error) => {
              this.reportApiStatus = error;
            }
        ).finally( () => {
            this.isLoading = false;
          })
    },
    rejectNDB() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "ndbRejectReason": this.ndbRejectReason,
      });
      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/rejectNDB', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.isOpenModal = false;
                  this.resetData();
                  this.notificationBannerInit('success', 'DAS NDB WURDE ABGELEHNT')
                  this.redirectToHomeView();
                  this.reloadDashboard();
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
    downloadSubmittedNDB(ndbFilePath = this.apiResponseReservation.ndb_files) {
      if ( typeof ndbFilePath === 'string' ) {
          window.location = this.currentEnv.url + this.localPathToBackendUrl(ndbFilePath)
        this.notificationBannerInit('success', 'NDB wird heruntergeladen')
      } else if ( typeof ndbFilePath === 'object' ) {
        this.showNDBSummary = !this.showNDBSummary;
      } else {
        this.notificationBannerInit('warning', 'NDB Datei konnte nicht gefunden werden')
      }
    },
    getFilenameFromPath(path) {
      let arr = path.split('/');
      return arr[arr.length - 1];
    },
    approveNDB() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/approvesNDB', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DAS NDB WURDE AKZEPTIERT');
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
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
    approveExternalGWG(gwgID) {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "gwgID": gwgID
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/approveExternalGWG', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.getApisData();
                  this.notificationBannerInit('success', 'DAS EXTERNES GWG WURDE AKZEPTIERT');
                  this.reloadDashboard();
                  if ( this.externalGWGForApproval <= 1) {
                    this.resetData();
                    this.redirectToHomeView();
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
    ValidateInternalGWG() {
      // Check in component if form is valid by change prop datax
      this.triggerInternalGWGFormValidation = this.makeid(50);
    },
    approveInternalGWG() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/approveInternalGWG', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DAS INTERNE GWG WURDE AKZEPTIERT');
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Internes GWG konnte nicht akzeptiert werden');
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    rejectInternalGWG() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "rejectReason": this.internalGWGRejectReason,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/rejectInternalGWG', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DAS INTERNE GWG WURDE ABGELEHNT');
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Internes GWG konnte nicht abgelehnt werden');
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitInternalGWG(validation) {
      if (validation) {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let data = JSON.stringify({
          "reservationId": this.reservationId,
          "formData": this.internalGWGFormData
        });

        axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/submitInternalGWGClientForm', data: data})
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.notificationBannerInit('success', 'DAS INTERNE GWG WURDE EINGEREICHT');
                    this.resetData();
                    this.redirectToHomeView();
                    this.reloadDashboard();
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Internes GWG konnte nicht eingereicht werden');
                }
            ).finally(
            () => {
              this.isLoading = false;
            }
        )
      }
    },
    makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    },
    getFinanceFiles() {
      this.isLoading = true;
      axios.get(this.globalApiBaseUrl + '/reservations/getFinanceFiles?reservationId=' + this.reservationId)
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.FinanceFilesApiResponse = response.data.response;
                } else if (response.data.status === 404) {
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.FinanceFilesApiResponse = error;
              }
          ).finally(
          () => {
            this.isLoading = false;
            }
        )

    },
    isImgUrl(url) {
      return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url.toLowerCase())
    },
    isDocUrl(url) {
      return /\.(pdf)$/.test(url.toLowerCase())
    },
    deleteFinanceFile(fileUrl) {

      if ( this.isLoading ) {
        return;
      }

      if (confirm('Diese Datei unwiderruflich löschen, wenn die Reservierung keine Dateien mehr hat werden die Finanzunterlagen automatisch abgelehnt')) {

        this.isLoading = true;
        let data = JSON.stringify({
          "reservationId": this.reservationId,
          "mediaUrlToDelete": fileUrl
        });
        axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/deleteUploadFile', data: data})
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.getFinanceFiles();
                    this.notificationBannerInit('success', 'Datei erfolgreich gelöscht');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Datei konnte nicht gelöscht werden');
                }
            ).finally(
            () => {
              this.isLoading = false;
            }
        )
      }
    },
    approveFinance() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });
      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/approveFinance', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.notificationBannerInit('success', 'DIE FINANZIERUNGSUNTERLAGEN WURDEN AKZEPTIERT');
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Finanzunterlagen konnten nicht akzeptiert werden');
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    rejectFinance() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "rejectReason": this.FinanceRejectReason,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/rejectFinance', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.notificationBannerInit('success', 'DIE FINANZIERUNGSUNTERLAGEN WURDEN ABGELEHNT')
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.notificationBannerInit('warning', 'Finanzunterlagen konnten nicht abgelehnt werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    getDropdownUploadCatsContent(CatToExclude) {

      let catToExcludeFormat = CatToExclude.replaceAll('_', '');
      let catsToUse = [];
      for (const item in this.uploadCatsDE) {
        if (catToExcludeFormat !== this.uploadCatsDE[item]) {
          catsToUse.push(this.uploadCatsDE[item]);
        }
      }

      let filteredCats = catsToUse.filter(function (element) {
        if (element !== catToExcludeFormat) {
          return true;
        } else {
          return false;
        }
      });
      return filteredCats;
    },
    submitAdditionalFinanceUploads() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;

      let formData = new FormData();
      formData.append('reservationId', this.reservationId);

      for (const index in this.uploads) {
        if (this.uploads[index].uploadFiles.length > 0) {

          // Translate cat to german if it is eng
          let categoryName = this.uploads[index].category;
          if (categoryName === 'Bank Statement') {
            categoryName = 'Kontoauszug';
          } else if (categoryName === 'Letter from Bank confirming the relevant funds') {
            categoryName = 'Schreiben der Bank zur Bestätigung der entsprechenden Mittel';
          } else if (categoryName === 'Screenshot or capture/Picture of the Bank Balance') {
            categoryName = 'Aufnahme / Bild des Banksaldos';
          } else if (categoryName === 'Other') {
            categoryName = 'Sonstiges';
          } else if (categoryName === 'Eigene Angabe') {
            categoryName = 'Eigene Angabe';
          }

          categoryName = categoryName.replaceAll('/', '_');
          categoryName = categoryName.replaceAll(' ', '_');
          categoryName = categoryName.replaceAll('ä', 'ae');

          for (const [fileIndex, val] in this.uploads[index].uploadFiles) {
            formData.append(categoryName + '[' + fileIndex + ']', this.uploads[index].uploadFiles[fileIndex]);
          }

          if (typeof this.uploads[index].customNotice !== 'undefined') {
            formData.append('ownCategoryName', this.uploads[index].customNotice);
          }

        }
      }

      axios.post(this.globalApiBaseUrl + '/reservations/submitFinanceAdditionalUploads', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'Dateien erfolgreich hochgeladen');
                  this.getFinanceFiles();
                  this.FinanceEditProcess = false;
                  this.FinanceUploadEditProcess = false;
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          )
          .finally(() => {
            this.isLoading = false;
          })
    },
    cancelUnits() {
      if ( this.isLoading ) {
        return;
      }

      let validData = true;
      let realEstatesToCancle = [];
      for(const [index, val] in this.cancelData) {
        // check if is int because we have props which are in full string on canceldata will be in int prop
        if ( !isNaN(parseInt(index)) && this.cancelData[index].process ){
          if ( typeof this.cancelData[index].reason !== 'undefined' && this.cancelData[index].reason && this.cancelData[index].reason !== '' ){
            this.cancelData[index].valid = true;
            if ( this.cancelData.clientEmailStornoEmailCustomContent ) {
              this.cancelData[index]['clientEmailStornoEmailCustomContent'] = this.cancelData.clientEmailStornoEmailCustomContent
            }
            if ( this.cancelData.sendClientStornoEmail ) {
              this.cancelData[index]['sendClientStornoEmail'] = this.cancelData.sendClientStornoEmail
            }
            if ( this.cancelData.sendClientFeedbackEmail ) {
              this.cancelData[index]['sendClientFeedbackEmail'] = true; // default is always true changerequest by madura
            }
            realEstatesToCancle.push(this.cancelData[index]);

            if ( this.cancelData[index].reason === 'Sonstiges' ) {
              if ( typeof this.cancelData[index].additionalText !== 'undefined' && this.cancelData[index].additionalText && this.cancelData[index].additionalText !== '' ) {
                this.cancelData[index].additionalTextValid = true;
              } else {
                this.cancelData[index].additionalTextValid = false;
                validData = false;
              }
            }

          } else {
            this.cancelData[index].valid = false;
            validData = false;
          }
        }

      }

      if ( !validData || realEstatesToCancle.length === 0 ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "cancelData": realEstatesToCancle
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/realEstateStorno', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.notificationBannerInit('success', 'DIE RESERVIERUNG WURDE STORNIERT')
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Stornieren war nicht erfolgreich')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    startProcessKV() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });
      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/startKVProcess', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.resetData();
                  this.notificationBannerInit('success', 'KV erfolgreich angefordert')
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'KV konnte nicht angefordert werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    customerReceivedKVdata() {

      if ( this.isLoading ) {
        return;
      }

      if (typeof this.KvCustomerReceivedFile.file === undefined || this.KvCustomerReceivedFile.file === '') {
        this.KvCustomerReceivedFile.valid = false;
        return;
      }

      this.KvCustomerReceivedFile.valid = true;

      this.isLoading = true;

      let formData = new FormData();
      formData.append('reservationId', this.reservationId);
      formData.append('file', this.KvCustomerReceivedFile.file);

      axios.post(this.globalApiBaseUrl + '/reservations/customerReceivedKV', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then(
            (response) => {
              if (response.data.status === 200) {
                this.notificationBannerInit('success', 'DER KUNDE HAT SEINEN KAUFVERTRAG ERHALTEN');
                this.resetData();
                this.redirectToHomeView();
                this.reloadDashboard();
              }
            }
        )
        .catch(
            (error) => {
              this.notificationBannerInit('success', 'KV konnte nicht aktualisiert werden');
            }
        )
        .finally(() => {
          this.isLoading = false;
        })
    },
    submitFinalKV() {

      if ( this.isLoading ) {
        return;
      }

      if (typeof this.KvFinalUploadFile.file === undefined || this.KvFinalUploadFile.file === '') {
        this.KvFinalUploadFile.valid = false;
        return;
      }

      this.KvFinalUploadFile.valid = true;

      let formData = new FormData();
      formData.append('reservationId', this.reservationId);
      formData.append('file', this.KvFinalUploadFile.file);
      formData.append('finalKvUpload', this.finalKvUpload);
      for (const [fileIndex, val] in this.KvFinalUploadFileDrafts.files) {
        formData.append('drafts['+fileIndex+']', this.KvFinalUploadFileDrafts.files[fileIndex]);
      }
      formData.append('bigChange', this.KvFinalUploadChangeType);

      this.isLoading = true;

      axios.post(this.globalApiBaseUrl + '/reservations/submitFinalKV', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then(
            (response) => {
              if (response.data.status === 200) {
                this.notificationBannerInit('success', 'DER KAUFVERTRAG WURDE HOCHGELADEN');
                this.resetData();
                this.redirectToHomeView();
                this.reloadDashboard();
              }
            }
        )
        .catch(
            (error) => {
              this.notificationBannerInit('success', 'KV konnte nicht hochgeladen werden');
            }
        )
        .finally(() => {
          this.isLoading = false;
        })
    },
    createNotartermin() {

      if ( this.isLoading ) {
        return;
      }

      if (typeof this.KvNotarterminDate.value === 'undefined' || this.KvNotarterminDate.value === '') {
        this.KvNotarterminDate.valid = false;
        return;
      } else {
        this.KvNotarterminDate.valid = true;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "dateTime": this.KvNotarterminDate.value.replaceAll('T', ' ') + ':00',
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/createKVNotartermin', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  if ( this.KvNotarterminDateEditProcess ) {
                    this.notificationBannerInit('success', 'DER NOTARTERMIN WURDE VEREINBART')
                  } else {
                    this.notificationBannerInit('success', 'DER NOTARTERMIN HAT SICH GEÄNDERT')
                  }
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Notartermin konnte nicht erstellt werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    deleteNotartermin() {

      if ( this.isLoadingDeleteNotaryAppointment ) {
        return;
      }

      if ( !this.KvDeleteNotartermin ) {
        this.KvDeleteNotartermin = true;
        return;
      }

      this.isLoadingDeleteNotaryAppointment = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/deleteKVNotartermin', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'Der Notartermin wurde gelöscht')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Notartermin konnte nicht gelöscht werden')
              }
          ).finally(
          () => {
            this.isLoadingDeleteNotaryAppointment = false;
          }
      )
    },
    submitNotaryDataBasedOnLawyers() {

      if ( this.isLoading ) {
        return;
      }

      if (typeof this.KvSendToLawyerDate.value === 'undefined' || this.KvSendToLawyerDate.value === '') {
        this.KvSendToLawyerDate.valid = false;
        return;
      } else {
        this.KvSendToLawyerDate.valid = true;
      }

      let action = 'sendToBerlin';
      if ( this.apiResponseReservation.kv_notartermin_city === null || this.apiResponseReservation.kv_notartermin_city === '' || this.apiResponseReservation.kv_notartermin_city === 'undefined' ) {
        action = 'sendToLawyer';
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "action": action,
        "dateTime": this.KvSendToLawyerDate.value.replaceAll('T', ' ') + ':00',
        "city": this.KvNotarterminCity.value
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/submitNotaryDataBasedOnLawyers', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'Daten gespeichert')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Ein Fehler ist aufgetreten')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitFinalKVCovivioSigned() {

      if ( this.isLoading ) {
        return;
      }

      if (typeof this.finalSaleCovivoSignedDate.value === 'undefined' || this.finalSaleCovivoSignedDate.value === '') {
        this.finalSaleCovivoSignedDate.valid = false;
        return;
      } else {
        this.finalSaleCovivoSignedDate.valid = true;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "dateTime": this.finalSaleCovivoSignedDate.value.replaceAll('T', ' ') + ':00',
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/finalSaleCovivoSignedDate', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'Daten gespeichert')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Ein Fehler ist aufgetreten')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitDiscountRequest() {

      if ( this.isLoading ) {
        return;
      }

      let validator = true;
      for (let step = 0; step <= this.KvDiscountRequestData.length - 1; step++) {
        if (this.KvDiscountRequestData[step].selected) {
          if (typeof this.KvDiscountRequestData[step].value === 'undefined' || this.KvDiscountRequestData[step].value === '' || this.KvDiscountRequestData[step].value.startsWith('NaN')) {
            this.KvDiscountRequestData[step].valueValid = false;
            validator = false;
          } else {
            this.KvDiscountRequestData[step].valueValid = true;
          }
          if (typeof this.KvDiscountRequestData[step].reason === 'undefined' || this.KvDiscountRequestData[step].reason === '') {
            this.KvDiscountRequestData[step].reasonValid = false;
            validator = false;
          } else {
            this.KvDiscountRequestData[step].reasonValid = true;
          }
        }
      }

      if (!validator || !validator) {
        return;
      }

      Object.entries(this.KvDiscountRequestData).forEach(([index, value]) => {
        if ( !value.selected ){
          this.KvDiscountRequestData.splice(index, 1);
        }
      });

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "discountData": this.KvDiscountRequestData,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/createKVDiscountRequest', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DIE KAUFPREISANPASSUNG WURDE EINGEREICHT')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Kaufpreisanpassung konnte nicht eingereicht werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitCommissionRequest() {

      if ( this.isLoading ) {
        return;
      }

      // this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "commissionData": this.CommissionChangeApprovedValue,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/createCommissionChangeRequest', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DIE PROVISIONSANPASSUNG WURDE EINGEREICHT')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'PROVISIONSANPASSUNG konnte nicht eingereicht werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitCommissionApproval() {

      if ( this.isLoading ) {
        return;
      }

      // this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/commissionChangeApproval', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DIE PROVISIONSANPASSUNG WURDE AKZEPTIERT')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                } else {
                  this.notificationBannerInit('warning', 'PROVISIONSANPASSUNG konnte nicht akzeptiert werden')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'PROVISIONSANPASSUNG konnte nicht akzeptiert werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitCommissionReject() {

      if ( this.isLoading ) {
        return;
      }

      // this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/commissionChangeReject', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DIE PROVISIONSANPASSUNG WURDE ABGELEHNT')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                } else {
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                  this.notificationBannerInit('warning', 'PROVISIONSANPASSUNG konnte nicht abgelehnt werden')
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'PROVISIONSANPASSUNG konnte nicht abgelehnt werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    submitPriceChange() {

      if ( this.isLoading ) {
        return;
      }

      let validator = true;
      this.PriceChangeApprovedValue.forEach(function(realEstate) {
        if (realEstate.selected) {
            let reason = realEstate.reason.replace(/\s/g, "");
            realEstate.reasonValid = reason !== '';
            realEstate.valueValid = realEstate.value > 0;
        }
        if ( !realEstate.reasonValid || !realEstate.valueValid ) {
          validator = false;
        }
      });

      if ( !validator ) {
        return;
      }

      this.isLoading = true;
      let data = {
        "reservationId": this.reservationId,
        "priceChangeData": this.PriceChangeApprovedValue,
      };

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/createPriceChange', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'Kaufpreisanpassung erfolgreich')
                } else {
                  this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten')
                }
                this.resetData();
                this.redirectToHomeView();
                this.reloadDashboard();
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    updateNotarterminOccured(handler) {

      if ( this.isLoading ) {
        return;
      }

      if ( typeof handler !== 'boolean' ){
        return;
      }

      this.isLoading = true;
      let dataToSend = {
        'reservationId': this.reservationId,
        'notarterminOccur': handler
      }

      axios.post(this.globalApiBaseUrl + '/verkaufsmeldung/updateNotarterminOccur', dataToSend )
          .then(
              (response) => {
                if ( response.data.status === 200) {
                  this.redirectToHomeView();
                  this.resetData();
                  if ( handler ) {
                    this.notificationBannerInit('success', 'DER NOTARTERMIN HAT ERFOLGREICH STATTGEFUNDEN')
                  } else {
                    this.notificationBannerInit('success', 'DER NOTARTERMIN HAT NICHT STATTGEFUNDEN')
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
    rejectKVDiscount(estateNr, reason) {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "estateNr": estateNr,
        "rejectReason": reason,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/rejectKVDiscountRequest', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DIE KAUFPREISANPASSUNG WURDE ABGELEHNT')
                  this.resetData();
                  this.redirectToHomeView();
                  this.reloadDashboard();
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Kaufpreisanpassung konnte nicht abgelehnt werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
          }
      )
    },
    approveKVDiscount(estateNr, finalDiscount) {

      if (typeof estateNr === 'undefined' || estateNr === '' || estateNr === 'NaN' || this.isLoading) {
        return;
      }

      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId,
        "immoNr": estateNr,
        "finalDiscount": finalDiscount,
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/approveKVDiscountRequest', data: data})
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.notificationBannerInit('success', 'DIE KAUFPREISANPASSUNG WURDE AKZEPTIERT')
                  this.reloadRealEstatesAPIData();
                } else {
                  this.notificationBannerInit('warning', 'Kaufpreisanpassung konnte nicht akzeptiert werden: '+response.data.msg)
                }
              }
          )
          .catch(
              (error) => {
                this.notificationBannerInit('warning', 'Kaufpreisanpassung konnte nicht akzeptiert werden')
              }
          ).finally(
          () => {
            this.isLoading = false;
            }
        )
    },
    reloadRealEstatesAPIData() {
      this.isLoading = true;
      let data = JSON.stringify({
        "reservationId": this.reservationId
      });

      axios({method: 'POST', url: this.globalApiBaseUrl + '/reservations/getReservationsRealEstate', data: data})
        .then(
            (response) => {
              if (response.data.status === 200) {
                this.apiRealEstates = response.data.response;
                this.checkForDiscountRequests();
                this.createKvDiscountRequestDataObject();
              }
            }
        )
        .catch(
            (error) => {
              this.notificationBannerInit('warning', 'Immobilien Daten konnten nicht neu geladen werden')
            }
        ).finally(
        () => {
          this.isLoading = false;
        }
      )
    },
    createKvDiscountRequestDataObject() {
      this.KvDiscountRequestData = [];
      for (let step = 0; step <= this.apiRealEstates.length - 1; step++) {
        // Runs 5 times, with values of step 0 through 4.
        this.KvDiscountRequestData.push(
            {
              selected: false,
              immoNr: this.apiRealEstates[step].estate_nr,
              valueValid: true,
              value: '',
              reasonValid: true,
              reason: '',
            }
        );
      }
    },
    createCommissionRequestDataObject() {
      this.CommissionChangeApprovedValue = [];
      this.PriceChangeApprovedValue = [];
      for (let step = 0; step <= this.apiRealEstates.length - 1; step++) {
        // Runs 5 times, with values of step 0 through 4.
        let existingCommission = this.apiRealEstates[step].estate_commission.replace('%', '')
        this.CommissionChangeApprovedValue.push(
            {
              selected: false,
              immoNr: this.apiRealEstates[step].estate_nr,
              valueValid: true,
              value: existingCommission,
              reasonValid: true,
              reason: '',
            }
        );
        this.PriceChangeApprovedValue.push(
            {
              selected: false,
              immoNr: this.apiRealEstates[step].estate_nr,
              sysID: this.apiRealEstates[step].real_estate_sys_id,
              valueValid: true,
              value: 0,
              reasonValid: true,
              reason: '',
            }
        );
      }
    },
    checkForDiscountRequests() {
      let existingDiscountRequests = false;
      Object.entries(this.apiRealEstates).forEach(([value, index]) => {
        if (parseInt(index.discount_process) === 1) {
          existingDiscountRequests = true;
        }
      });
      this.KvDiscountProcess = existingDiscountRequests;
    },
    getReservationCancelMailRendering() {
      axios.get(this.globalApiBaseUrl + '/reservations/getEmailRendering?reservationId=' + this.reservationId)
          .then(
              (response) => {
                if ( response.data.status === 200 ) {
                  // remove all html elements from string
                  this.cancelData.clientEmailStornoEmailCustomContent = response.data.response.body.rendering.replace(/<[^>]*>/g, '');
                } else {
                  this.cancelData.clientEmailStornoEmailCustomContent = '';
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
                this.cancelData.clientEmailStornoEmailCustomContent = '';
              }
          ).finally(
          () => {
            this.isLoading = false;
          })

    },
    getMailingHistory() {
      this.isLoading = true;
      axios.get(this.globalApiBaseUrl + '/reservations/getEmailHistory?reservationId=' + this.reservationId)
          .then(
              (response) => {
                this.apiResponseAllMailings = response.data.response;
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
    renderEmailCat(stringCat) {

      let returnVal = '';
      if ( stringCat === 'render_emailbody_agreement' ) {
        returnVal = 'Reservierung Webform-Aufforderung';
      } else if ( stringCat === 'create_procedures' ) {
        returnVal = 'Reservierung Yousign-Aufforderung';
      } else if ( stringCat === 'render_seven_steps' ) {
        returnVal = '7 Schritte zur Vorbereitung';
      } else if ( stringCat === 'render_prepare_finance' ) {
        returnVal = 'Infos zur Vorbereitung der Finanzen';
      } else if ( stringCat === 'render_emailbody_storno' ) {
        returnVal = 'Stornierung';
      } else if ( stringCat === 'render_emailbody_storno_feenotpaid' ) {
        returnVal = 'Stornierung Gebühr nicht bezahlt';
      } else if ( stringCat === 'render_emailbody_approved' ) {
        returnVal = 'Reservierung wurde akzeptiert';
      } else if ( stringCat === 'render_emailbody_fee_receipt' ) {
        returnVal = 'Reservierung Gebührenbeleg';
      } else if ( stringCat === 'render_gwg_webform_invitation' ) {
        returnVal = 'GWG Webform-Aufforderung';
      } else if ( stringCat === 'create_gwg_procedures' ) {
        returnVal = 'GWG Yousign-Aufforderung';
      } else if ( stringCat === 'render_ndb_webform_invitation' ) {
        returnVal = 'NDB Webform-Aufforderung';
      } else if ( stringCat === 'render_finance_webform_invitation' ) {
        returnVal = 'Finanz Webform-Aufforderung';
      } else if ( stringCat === 'render_notary_reminder_for_customer' ) {
        returnVal = 'Notartermin Erinnerung';
      }

      return returnVal;

    },
    restrictInputCommission(event, index) {
      let input = event.target.value;
      if ( input > 100 ) {
        this.CommissionChangeApprovedValue[index].value = 100;
      }
      if ( input < 0 || input === '' ) {
        this.CommissionChangeApprovedValue[index].value = 0;
      }
    },
    mergedDataForReservationFileChange() {

      if ( !this.apiResponseReservationFinished || !this.apiResponseCustomerFinished || !this.apiResponseGWGsFinished ) {
        return;
      }


      let allFiles = {
        reservation: {},
        ndb: {},
        externalGWG: {},
        internalGWG: {},
        finance: {},
        kv: {}
      };

      allFiles['reservation'].finale_file = typeof this.apiResponseReservation.final_document_file_url === 'undefined' || this.apiResponseReservation.final_document_file_url == null || this.apiResponseReservation.final_document_file_url === '' ? [] : [this.apiResponseReservation.final_document_file_url]

      let ndbCustomerFilesDecoded = this.apiResponseReservation.ndb_customer_uploads ? JSON.parse(this.apiResponseReservation.ndb_customer_uploads) : [];
      let onlyNdbCustomerFiles = [];
      let customerCount = 0;
      if ( ndbCustomerFilesDecoded ) {
        for( const index in ndbCustomerFilesDecoded ) {
          onlyNdbCustomerFiles.push(ndbCustomerFilesDecoded[index]);
          customerCount = customerCount+1;
        }
        onlyNdbCustomerFiles = [... new Set(onlyNdbCustomerFiles)]
      }
      allFiles['ndb'] = {
        'customer_data': customerCount === 0 ? 1 : customerCount, // customer count default to 1
        'customer_uploads': onlyNdbCustomerFiles.length > 0 ? onlyNdbCustomerFiles : [],
        'final_file': typeof this.apiResponseReservation.ndb_files === 'undefined' || this.apiResponseReservation.ndb_files == null || this.apiResponseReservation.ndb_files === '' ? [] : [this.apiResponseReservation.ndb_files]
      }

      let allExGWGs = [];
      let customerExGWGData = {};
      if ( this.apiResponseGWGs ) {
        for( const index in this.apiResponseGWGs ) {
          allExGWGs.push(this.apiResponseGWGs[index].pdf_with_signature);
          customerExGWGData[this.apiResponseGWGs[index].customer_mail] = this.apiResponseGWGs[index].pdf_with_signature;
        }
        allExGWGs = [... new Set(allExGWGs)]
      }

      allFiles['externalGWG'] = {
        'customer_data': customerExGWGData,
        'final_file': typeof allExGWGs === 'undefined' || allExGWGs == null || allExGWGs === [] ? [] : allExGWGs
      }
      allFiles['internalGWG'] = {
        'final_file': typeof this.apiResponseReservation.gwgintern_pdf_with_signature === 'undefined' || this.apiResponseReservation.gwgintern_pdf_with_signature == null || this.apiResponseReservation.gwgintern_pdf_with_signature === '' ? [] : [this.apiResponseReservation.gwgintern_pdf_with_signature]
      }

      let financeCustomerFilesDecoded = this.apiResponseReservation.finance_files ? JSON.parse(this.apiResponseReservation.finance_files) : [];
      let onlyFinanceCustomerFiles = [];
      if ( financeCustomerFilesDecoded ) {
        for( const index in financeCustomerFilesDecoded ) {
          onlyFinanceCustomerFiles.push(financeCustomerFilesDecoded[index]);
        }
        onlyFinanceCustomerFiles = [... new Set(onlyFinanceCustomerFiles)]
      }
      allFiles['finance'] = {
        'customer_uploads': onlyFinanceCustomerFiles.length > 0 ? onlyFinanceCustomerFiles : []
      }

      let kvFiles = [];
      if ( this.isJsonString(this.apiResponseReservation.kv_file_with_signature) ) {
        kvFiles = [JSON.parse(this.apiResponseReservation.kv_file_with_signature)]
      } else if ( this.apiResponseReservation.kv_file_with_signature ) {
        kvFiles = [this.apiResponseReservation.kv_file_with_signature]
      }

      allFiles['provisions'] = {
        'final_files': [],
        'customer_uploads': []
      }
      if ( typeof this.apiResponseReservation.provision_processes !== 'undefined' && !this.isEmpty(this.apiResponseReservation.provision_processes) ) {
        allFiles['provisions']['customer_uploads'] = this.apiResponseReservation.provision_processes.map(item => item.pdf_path_unsigned).filter(path => path !== null && !path.includes('/user-archive'));
        allFiles['provisions']['final_files'] = this.apiResponseReservation.provision_processes.map(item => item.pdf_path_signed ).filter(path => path !== null && !path.includes('/user-archive'));
      }

      allFiles['kv'] = {
        'final_file': kvFiles
      }

      for (let key in allFiles) {
        for (let subKey in allFiles[key]) {
          if (Array.isArray(allFiles[key][subKey])) {
            allFiles[key][subKey] = allFiles[key][subKey].flat().filter(item => item !== null && item !== undefined)
          }
        }
      }

      this.mergedDataForReservationFileChangeView = allFiles;

    }
  },
  computed: {
    renderCustomerSubmittedData() {
      let allData = this.apiResponseReservation.ndb_formular_data;
      let fileUploads = JSON.parse(this.apiResponseReservation.ndb_customer_uploads);
      let htmlRender = '';

      let l = 1;
      Object.entries(allData.formDataCustomers).forEach(([customerName, field]) => {
        htmlRender += '<div class="header customer"><b>'+l+'. Kundendaten:</b></div>';
        Object.entries(field.fields).forEach(([key, field]) => {
          if ( field.label.de !== 'Hochladen von Personalausweis oder Reisepass' ){
            htmlRender += '<div>';
            htmlRender += '<span class="label">' + field.label.de + ': </span>' + field.value;
            htmlRender += '</div>';
          } else {
            htmlRender += '<div>';
            htmlRender += '<span class="label">' + field.label.de + ': </span>';
            Object.entries(fileUploads[customerName]).forEach(([key, field]) => {
              let link = this.currentEnv.url + this.localPathToBackendUrl(field);
              htmlRender += '<a href="'+link+'" target="_blank">Zum Bild</a>';
            });
            htmlRender += '</div>';
          }

        });
        l += 1;
      });

      return htmlRender;
    },
    notaryAppointmentinFuture() {
      return this.checkIfDateInFuture(this.apiResponseReservation.kv_notartermin_date);
    },
    currentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1)).slice(-2);
      const day = ('0' + now.getDate()).slice(-2);
      const hours = ('0' + now.getHours()).slice(-2);
      const minutes = ('0' + now.getMinutes()).slice(-2);

      const currentTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      return currentTime;
    },
    discountRequested() {
      let object = {
        isRequested: false,
        realEstates: []
      };
      Object.entries(this.apiRealEstates).forEach(([value, index]) => {
        if (parseInt(index.discount_process) === 1) {
          object.isRequested = true;
          object.realEstates.push(index);
        }
      });
      return object;
    },
    commissionRequested() {
      let object = {
        isRequested: false,
        realEstates: []
      };
      Object.entries(this.apiRealEstates).forEach(([value, index]) => {
        if (parseInt(index.commission_process) === 1) {
          object.isRequested = true;
          object.realEstates.push(index);
        }
      });
      return object;
    },
  },
  watch: {
    $route(to, from) {
      // Exec only when this router child component is requested
      if (to.name === 'singleReservationView') {
        this.isLoading = true;
        this.reservationId = this.$route.params.id;
        this.getApisData();
        this.isOpenModal = true;
      }

      if (to.name !== 'singleReservationView') {
        this.resetData();
      }
    },
    apiRealEstates: function (newVal) {
      this.reservationWithFee = this.checkIfRealEstatesGotFee(newVal)
      this.getNDBProjectData();
      this.checkIfIsOpenProvisionProcessToApprove();
    },
    KvDiscountProcess: function(newVal) {
      let newObject = [];
      let newObjectValues = [];
      this.KvDiscountApprove = newObject;
      this.discountRequested.realEstates.forEach(function (item, index) {
        newObject[index] = {};
        newObject[index].approveProcess = false;
        newObject[index].rejectProcess = false;
        newObject[index].editProcess = false;

        newObjectValues[index] = {};
        newObjectValues[index].editedValue = '';
        newObjectValues[index].approveValue = '';
        newObjectValues[index].rejectReason = '';
      });
      if ( !newVal ){
        newObject = false;
        newObjectValues = false;
      }
      this.KvDiscountApprove = newObject;
      this.KvDiscountApprovedValue = newObjectValues;
    },
    cancelProcess: function(newVal) {
      let newObject = [];
      this.getReservationCancelMailRendering();
      this.apiRealEstates.forEach(function (item, index) {
        newObject[index] = {};
        newObject[index].realEstateSysId = item.real_estate_sys_id;
        newObject[index].realEstateNr = item.estate_nr;
        newObject[index].reason = '';
        newObject[index].additionalText = '';
        newObject[index].additionalTextValid = true;
        newObject[index].process = false;
        newObject[index].valid = true;
      });
      newObject.sendClientStornoEmail = false;
      newObject.sendClientFeedbackEmail = true;
      newObject.clientEmailStornoEmailCustomContent = '';
      this.cancelData = newObject;
    },
    triggerGWGReload: function(newVal) {
      this.getApisData();
    },
    showMailingHistory: function(newVal) {
      if ( newVal ) {
        this.getMailingHistory();
      }
    },
    verkaufsmeldungAPIData: function(newVal) {
      let isSold = false;
      newVal.forEach(function (item, index) {
        if ( parseInt(item.notartermin_status) === 3 ) {
          isSold = true;
        }
      });
      this.hasSoldUnits = isSold;
    },
    apiResponseReservationFinished: function() {
      this.mergedDataForReservationFileChange();
      this.deleteReservationStarted = typeof this.apiResponseReservation.yousign_update_detected !== 'undefined' && this.apiResponseReservation.yousign_update_detected === '1';
      this.deleteReservationStartedOnInit = typeof this.apiResponseReservation.yousign_update_detected !== 'undefined' && this.apiResponseReservation.yousign_update_detected === '1';
    },
    apiResponseCustomerFinished: function() {
      this.mergedDataForReservationFileChange();
    },
    apiResponseGWGsFinished: function() {
      this.mergedDataForReservationFileChange();
    }
  },
  mounted() {
    if ( this.$route.name === 'singleReservationView' || this.$route.name === 'filterView' || this.$route.name === 'createReservationView' ) {
      if ( !this.isOpenModal ) {
        this.redirectToHomeView();
      }
    }
  }
}
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal, isLoading: isLoading }" v-if="isOpenModal"
       @click="closeDropdowns">

    <div class="modal-inner-wrapper" :class="{ 'iframe-view': approveReservationStarted }">

      <div class="loading-screen-init" v-if="!this.apiResponseReservationFinished || !this.apiResponseCustomerFinished || !this.apiResponseGWGsFinished || isLoadingRealEstates">
        <AnimateCircleIcon></AnimateCircleIcon>
      </div>

      <div class="modal-header">
        <div class="modal-title-wrapper">
          <CardTitle :reservationId="reservationId" :cardCreateDate="apiResponseReservation.create_date"
                     :displayOptionsIcon="false" :countdown="apiResponseReservation.kv_countdown_start" :notaryAppointment="apiResponseReservation.kv_notartermin_date" :agentShortName="apiResponseReservation.real_estate_agent"></CardTitle>
          <CloseIcon @click="closeModal()"></CloseIcon>
        </div>
        <div class="subheadline" :style="{'justify-content': 'space-between'}" v-if="!deleteReservationStartedOnInit">
          <div class="button-discount" v-if="parseInt(apiResponseReservation.reservation_status) === 7 && parseInt(apiResponseReservation.sale_create_vkm) !== 1">
            <Button type="edit" @click="KvDiscountInit = !KvDiscountInit; cancelProcess = false; createKvDiscountRequestDataObject()">
              <DiscountIcon></DiscountIcon>
              KPA
            </Button>
          </div>

          <div class="button-discount" v-if="parseInt(apiResponseReservation.reservation_status) <= 4">
            <Button type="edit" @click="CommissionChangeProcess = !CommissionChangeProcess; createCommissionRequestDataObject()">
              <DiscountIcon></DiscountIcon>
              Provi.
            </Button>
          </div>

          <div class="button-discount" v-if="( parseInt(apiResponseReservation.reservation_status) <= 7 && parseInt(apiResponseReservation.reservation_status) >= 4 && parseInt(apiResponseReservation.sale_create_vkm) !== 1 ) && this.getUserRole() >= 2">
            <Button type="edit" @click="PriceChangeProcess = !PriceChangeProcess; createCommissionRequestDataObject()">
              <DiscountIcon></DiscountIcon>
              KPA Intern.
            </Button>
          </div>

          <div class="button-discount" v-if="parseInt(apiResponseReservation.sale_create_vkm) !== 1">
            <Button type="edit" @click="showMailingHistory = !showMailingHistory;">
              <MailIcon></MailIcon>
            </Button>
          </div>

          <div class="button-discount">
            <Button type="edit" @click="showFileChangeView = !showFileChangeView;">
              <FilesIcon></FilesIcon>
            </Button>
          </div>

          <div class="button-cancel">
            <Button type="delete" @click="cancelProcess = !cancelProcess; KvDiscountInit = false" v-if="parseInt(apiResponseReservation.reservation_status) >= 2 && parseInt(apiResponseReservation.sale_create_vkm) !== 1">
              <DeleteIcon></DeleteIcon>
              Storno
            </Button>
            <Button type="delete" v-if="parseInt(apiResponseReservation.reservation_status) < 2" @click="deleteReservationStarted = true">Löschen
            </Button>
          </div>
        </div>
      </div>

      <div class="modal-body">

        <div class="customer-data"
             v-if="!reportReservationStarted && !approveReservationStarted && !ndbProcessStarted && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !externalGWGApproveProcess && !internalGWGProcess && !FinanceProcess && !internalGWGRejectProcess && !internalGWGReportProcess && !KvCustomerReceivedData && !KvCreateNotartermin && !KvCreateDiscountRequest && !KvDiscountReject && !KvDiscountApprove && !KvDiscountInit && !KvDiscountProcess && !KvFinalUploadProcess && !externalGWGProcess && !cancelProcess && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess && !startFinalSaleCovivoSignedProcess && !CommissionChangeProcess && !CommissionChangeApprove && !deleteReservationStarted && !PriceChangeProcess && !approveProvisionProcess">
          <div>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_id">KdNr: {{ apiResponseCustomer.client_id }}</div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_first_name && apiResponseCustomer.client_last_name">
                {{ apiResponseCustomer.client_salutation }} {{ apiResponseCustomer.client_title }}
                {{ apiResponseCustomer.client_first_name }} {{ apiResponseCustomer.client_last_name }}
              </div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_postal_code">{{ apiResponseCustomer.client_postal_code }}
                {{ apiResponseCustomer.client_city }}
              </div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_country">{{ apiResponseCustomer.client_country }}</div>
            </Transition>
          </div>
          <div>
            <Transition name="fadein">
              <div v-show="apiResponseCustomer.client_birthday">Geb.: {{ apiResponseCustomer.client_birthday }}</div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_language">Sprache:
                {{ apiResponseCustomer.client_language === 'DEU' ? 'deutsch' : 'englisch' }}
              </div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_phone">Tel.: <a
                  :href="'tel:'+apiResponseCustomer.client_phone">{{ apiResponseCustomer.client_phone }}</a></div>
            </Transition>
            <Transition name="fadein">
              <div v-if="apiResponseCustomer.client_email">
                 E-Mail: <a
                  :href="'mailto:'+apiResponseCustomer.client_email">{{ apiResponseCustomer.client_email }}</a>
              </div>
            </Transition>
          </div>
        </div>

        <div class="process-tabs-wrapper"
             v-if="!reportReservationStarted && !approveReservationStarted && !ndbProcessStarted && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !externalGWGApproveProcess && !internalGWGProcess && !FinanceProcess && !internalGWGRejectProcess && !internalGWGReportProcess && !KvCustomerReceivedData && !KvCreateNotartermin && !KvCreateDiscountRequest && !KvDiscountReject && !KvDiscountApprove && !KvDiscountInit && !KvDiscountProcess && !KvFinalUploadProcess && !externalGWGProcess && !cancelProcess && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess && !startFinalSaleCovivoSignedProcess && !CommissionChangeProcess && !CommissionChangeApprove && !deleteReservationStarted && !PriceChangeProcess && !approveProvisionProcess">

          <ProcessTab tabTitle="Reservierung" :reservationData="apiResponseReservation"
                      @processTabClicked="processTabClickEvent"></ProcessTab>
          <ProcessTab tabTitle="Abwicklung" :reservationData="apiResponseReservation"
                      @processTabClicked="processTabClickEvent"></ProcessTab>
          <ProcessTab tabTitle="Verkauf" :reservationData="apiResponseReservation"
                      @processTabClicked="processTabClickEvent" :verkaufsmeldungsData="verkaufsmeldungAPIData"></ProcessTab>

        </div>

        <div class="real-estates-list" :class="{ 'process-tab-active': processTabClicked }"
             v-if="!reportReservationStarted && !approveReservationStarted && !ndbProcessStarted && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !externalGWGApproveProcess && !internalGWGProcess && !FinanceProcess && !internalGWGRejectProcess && !internalGWGReportProcess && !KvCustomerReceivedData && !KvCreateNotartermin && !KvCreateDiscountRequest && !KvDiscountReject && !KvDiscountApprove && !KvDiscountInit && !KvDiscountProcess && !KvFinalUploadProcess && !externalGWGProcess && !cancelProcess && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess && !startFinalSaleCovivoSignedProcess && !CommissionChangeProcess && !CommissionChangeApprove && !deleteReservationStarted && !PriceChangeProcess && !approveProvisionProcess">

          <div class="process-tab-content" :class="{ 'active': processTabClicked }">
            <ProcessTabContent :reservationData="apiResponseReservation" :processName="processTabClick" :realEstatesData="apiRealEstates"
                               key="processTabContent" v-if="processTabClicked" :gwgsData="apiResponseGWGs" :verkaufsmeldungsData="verkaufsmeldungAPIData" @triggerReservationsReload="reloadDashboard"></ProcessTabContent>
          </div>

          <RealEstateList :reservationId="parseInt(reservationId)"
                          :showEditFunctions="{edit: false, delete: false}"
                          @apiRealEstates="updateRealEstateList"
                          @apiRealEstatesIsLoading="updateRealEstateLoadingStatus"></RealEstateList>

        </div>

        <div class="report-data" v-if="reportReservationStarted" :class="{'invalid': !filesForReportValid}">

          <UploadFieldArea :maxFiles="1" :allowedTypes="['.pdf']" @uploadedFiles="updateFilesForReport"></UploadFieldArea>

        </div>

        <div class="approve-data" v-if="approveReservationStarted && !rejectReservationStarted">

          <div id="reservation-approval" class="iframe"></div>

        </div>

        <div class="reject-data" v-if="rejectReservationStarted">

          <div class="field-wrapper">
            <TextAreaField inputName="rejectReason" :inputVal="rejectReason" v-model="rejectReason"></TextAreaField>
            <label class="ph">Grund der Ablehnung (optional)</label>
          </div>

        </div>

        <div class="ndb-customer-formdata" v-if="ndbShowCustomerSubmittedFormData">
          <span v-html="renderCustomerSubmittedData"></span>
        </div>

        <div class="report-data" v-if="ndbProcessStarted">
          <span v-if="typeof this.apiResponseReservation.ndb_files !== 'string' && this.apiResponseReservation.ndb_files !== '' && this.apiResponseReservation.ndb_files !== null && this.apiResponseReservation.ndb_files.length > 0">
            Alle NDBs hochladen, auch die nicht geändert wurden.
          </span>
          <UploadFieldArea :class="{'invalid': !ndbUploadedFilesValid}" :allowedTypes="['.xls', '.xlsx']" :maxFiles="9" @uploadedFiles="updateNdbFileForReport"></UploadFieldArea>
        </div>

        <div class="reject-data" v-if="ndbRejectProcess">
          <div class="field-wrapper">
            <TextAreaField inputName="ndbRejectReason" :inputVal="ndbRejectReason" v-model="ndbRejectReason"></TextAreaField>
            <label class="ph">Grund der Ablehnung (optional)</label>
          </div>
        </div>

        <div class="reject-data" v-if="FinanceRejectProcess">
          <div class="field-wrapper">
            <TextAreaField inputName="financeRejectReason" :inputVal="FinanceRejectReason" v-model="FinanceRejectReason"></TextAreaField>
            <label class="ph">Grund der Ablehnung (optional)</label>
          </div>
        </div>

        <div class="finance-data" v-if="FinanceProcess && !FinanceRejectProcess && !FinanceUploadEditProcess">
          <div class="cat-wrapper" v-for="(val, index) in FinanceFilesApiResponse">
            <div class="cat-title" v-if="val[0] !== ''">{{ index.replaceAll('_', ' ') }}</div>
            <div class="media" v-for="(mediaUrl, indexVal) in val">
              <div class="edit-upload-cat" v-if="FinanceEditProcess">
                <span>
                  <InputField class="dropdown-input" inputType="text" :inputName="'UploadCat'+index+indexVal"
                              :inputValue="index.replaceAll('_', ' ').replaceAll('ae', 'ä')"
                              @click="toggleDropdowns(index+indexVal)" @focus="setDropdownTop(index, $event)"
                              @click.stop=""></InputField>
                  <label class="ph"></label>
                  <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                  <Dropdown :ref="'dropdownUploadCat'+index+indexVal"
                            :class="{active: dropdownsEditUploads[index+indexVal], relative: dropdownRelativePosition}"
                            :renderingObject="getDropdownUploadCatsContent(index)"
                            @dropdown-item-clicked="changeUploadFileCategory(mediaUrl, $event)"
                            @click.stop=""></Dropdown>
                </span>
              </div>
              <div class="delete-single-file" @click="deleteFinanceFile(mediaUrl)" v-if="FinanceEditProcess">
                <closeIcon></closeIcon>
                Datei löschen
              </div>
              <img :src="this.currentEnv.url + this.localPathToBackendUrl(mediaUrl)" v-if="isImgUrl(mediaUrl)">
              <iframe :src="this.currentEnv.url + this.localPathToBackendUrl(mediaUrl)" v-if="isDocUrl(mediaUrl)"></iframe>
            </div>
          </div>
        </div>

        <div class="finance-data-upload" v-if="FinanceUploadEditProcess">
          <FinanceUploadFields language="DEU" :uploads="uploads" ref="uploadFields"></FinanceUploadFields>
        </div>

        <div class="gwg-intern-form" v-if="internalGWGProcess">
          <GwgInternForm :entity="ndbProjectEntity" :triggerFormValidation="triggerInternalGWGFormValidation"
                         :company="apiResponseReservation.company"
                         @validationResults="submitInternalGWG"></GwgInternForm>
        </div>

        <div class="reject-data" v-if="internalGWGRejectProcess">
          <div class="field-wrapper">
            <TextAreaField inputName="externalGWGRejectReason" :inputVal="internalGWGRejectReason" v-model="internalGWGRejectReason"></TextAreaField>
            <label class="ph">Grund der Ablehnung (optional)</label>
          </div>
        </div>


        <div class="approve-data" v-for="gwg in apiResponseGWGs" v-if="externalGWGProcess">
          <div class="external-gwg" v-if="parseInt(gwg.gwg_status) === 2">
            <iframe :src="this.currentEnv.url + this.localPathToBackendUrl(gwg.pdf_with_signature)" v-if="!externalGWGRejectProcess[gwg.id]"></iframe>

            <div class="reject-data" v-if="externalGWGRejectProcess[gwg.id]">
              <div class="field-wrapper">
                <TextAreaField inputName="externalGWGRejectReason" :inputVal="externalGWGRejectReason" v-model="externalGWGRejectReason"></TextAreaField>
                <label class="ph">Grund der Ablehnung (optional)</label>
              </div>
            </div>

            <div class="actions approve-init">

              <Button type="delete" @click="externalGWGProcess = false"
                      v-if="externalGWGProcess && !externalGWGRejectProcess[gwg.id] && !externalGWGApproveProcess">Schließen
              </Button>

              <Button type="delete" @click="externalGWGRejectProcess[gwg.id] = false"
                      v-if="externalGWGProcess && externalGWGRejectProcess[gwg.id]">Schließen
              </Button>
              <Button type="delete full" @click="externalGWGRejectProcess[gwg.id] = true"
                      v-if="externalGWGProcess && !externalGWGRejectProcess[gwg.id] && !externalGWGApproveProcess">Externes GWG
                ablehnen
              </Button>
              <Button type="delete full" @click="rejectExternalGWG(gwg.id);" v-if="externalGWGRejectProcess[gwg.id]">
                Ablehnen Bestätigen
                <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
              </Button>

              <Button type="delete" @click="externalGWGApproveProcess = false"
                      v-if="externalGWGProcess && externalGWGApproveProcess && !externalGWGRejectProcess[gwg.id]">Schließen
              </Button>
              <Button type="report" @click="externalGWGApproveProcess = true"
                      v-if="externalGWGProcess && !externalGWGApproveProcess && !externalGWGRejectProcess[gwg.id]" style="flex-basis: 100%;">Externes GWG
                akzeptieren
              </Button>
              <Button type="report" @click="approveExternalGWG(gwg.id)" v-if="externalGWGProcess && externalGWGApproveProcess " style="flex-basis: 48%;">
                Bestätigen
                <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
              </Button>
            </div>
          </div>
        </div>

        <div class="approve-data" v-if="internalGWGReportProcess && !internalGWGRejectProcess">
          <iframe :src="this.currentEnv.url + this.localPathToBackendUrl(apiResponseReservation.gwgintern_pdf_without_signature)"
                  v-if="typeof apiResponseReservation.gwgintern_pdf_without_signature !== 'undefined' && apiResponseReservation.gwgintern_pdf_without_signature !== ''"></iframe>
          <div v-else>
            Es wurde kein Dokument gefunden.
          </div>
        </div>

        <div class="create-notartermin-data" :class="{'invalid': !KvNotarterminDate.valid}" v-if="KvCreateNotartermin">
          <div class="field-wrapper">
            <InputField inputName="KvNotarterminDate" inputType="datetime-local" :inputValue="KvNotarterminDate.value" v-model="KvNotarterminDate.value"></InputField>
            <label class="ph">Datum und Uhrzeit des Notartermins</label>
          </div>
        </div>

        <div class="notartermin-to-lawyer" v-if="startNotaryToLawyerProcess">
          <div class="field-wrapper" :class="{'invalid': !KvSendToLawyerDate.valid}">
            <InputField inputName="KvNotarterminDate" inputType="datetime-local" :inputValue="KvSendToLawyerDate.value" v-model="KvSendToLawyerDate.value"></InputField>
            <label class="ph">Wann wurden die Unterlagen Übermittelt?</label>
          </div>
          <div class="field-wrapper radios" v-if="apiResponseReservation.kv_notartermin_city === null || apiResponseReservation.kv_notartermin_city === '' || apiResponseReservation.kv_notartermin_city === 'undefined'">
            <label for="notaryCityBerlin" class="radio-wrapper">
              <InputField inputType="radio" id="notaryCityBerlin" inputName="notaryCityBerlin" value="berlin" :inputValue="KvNotarterminCity.value" v-model="KvNotarterminCity.value"></InputField>
              Notartermin in Berlin
            </label>
            <label for="notaryCityEssen" class="radio-wrapper">
              <InputField inputType="radio" id="notaryCityEssen" inputName="notaryCityEssen" value="essen" :inputValue="KvNotarterminCity.value" v-model="KvNotarterminCity.value"></InputField>
              Notartermin in Essen
            </label>
          </div>
        </div>

        <div class="notartermin-to-lawyer" v-if="startFinalSaleCovivoSignedProcess">
          <div class="field-wrapper" :class="{'invalid': !finalSaleCovivoSignedDate.valid}">
            <InputField inputName="KvNotarterminDate" inputType="datetime-local" :inputValue="finalSaleCovivoSignedDate.value" v-model="finalSaleCovivoSignedDate.value"></InputField>
            <label class="ph">Wann wurden die Unterlagen final unterschrieben?</label>
          </div>
        </div>

        <div class="report-data" v-if="KvCustomerReceivedData" :class="{'invalid': !KvCustomerReceivedFile.valid}">
          <div style="margin-bottom:15px;">Laden Sie den KV hoch, welcher an den Kunden gesendet wurde:</div>
          <UploadFieldArea :maxFiles="1" @uploadedFiles="updateFilesForKVCustomerReceived"></UploadFieldArea>
        </div>

        <div class="report-data" v-if="KvFinalUploadProcess && parseInt(apiResponseReservation.sale_create_vkm) === 0" :class="{'invalid': !KvFinalUploadFile.valid}">
          <UploadFieldArea :maxFiles="1" @uploadedFiles="updateFilesForFinalKv"></UploadFieldArea>
          <label for="KvBigChange" style="cursor:pointer; margin-top: 15px; display: inline-block;">
            <InputField inputType="checkbox" id="KvBigChange" inputPlaceholder="" :inputValue="KvFinalUploadChangeType" inputName="KvBigChange"
                        v-model="KvFinalUploadChangeType"></InputField>
            Grundlegende Vertragsänderung
          </label>
        </div>
        <div class="report-data" v-else-if="KvFinalUploadProcess && parseInt(apiResponseReservation.sale_create_vkm) === 1">
          <div class="upload-title">Entwürfe hochladen:</div>
          <UploadFieldArea :maxFiles="10" @uploadedFiles="updateFilesForFinalKvDraft"></UploadFieldArea>

          <div style="margin-top:25px;" class="upload-title">Finales Dokument hochladen:</div>
          <UploadFieldArea :maxFiles="1" @uploadedFiles="updateFilesForFinalKv" :class="{'invalid': !KvFinalUploadFile.valid}"></UploadFieldArea>
        </div>

        <div class="request-discount-data" v-if="KvDiscountInit">
          <div v-for="(val, index) in KvDiscountRequestData">
            <div class="real-estate-discount-title">{{ KvDiscountRequestData[index].immoNr }}:
              <InputField inputType="checkbox" inputPlaceholder="" :inputName="'selectedDiscountUnit-'+index"
                          v-model="KvDiscountRequestData[index].selected"></InputField>
            </div>
            <div class="field-wrapper" :class="{'invalid': !KvDiscountRequestData[index].reasonValid}"
                 v-if="KvDiscountRequestData[index].selected">
              <TextAreaField inputName="KvDiscountRejectReason" :inputVal="KvDiscountRequestData[index].reason"
                             v-model="KvDiscountRequestData[index].reason"></TextAreaField>
              <label class="ph">Grund des Rabatts</label>
            </div>
            <div class="field-wrapper" :class="{'invalid': !KvDiscountRequestData[index].valueValid}"
                 style="margin-top: 15px;" v-if="KvDiscountRequestData[index].selected">
              <InputField inputName="KvDiscountRequestValue"
                          :inputValue="this.numberWithComma(KvDiscountRequestData[index].value)"
                          v-model="KvDiscountRequestData[index].value"></InputField>
              <label class="ph">Höhe des Rabatts</label>
            </div>
          </div>
        </div>

        <div class="request-commission-change" v-if="CommissionChangeProcess">
          <div v-for="(val, index) in CommissionChangeApprovedValue">
            <div class="real-estate-discount-title">{{ CommissionChangeApprovedValue[index].immoNr }}:
              <InputField inputType="checkbox" inputPlaceholder="" :inputName="'selectedDiscountUnit-'+index"
                          v-model="CommissionChangeApprovedValue[index].selected"></InputField>
            </div>
            <div class="field-wrapper" :class="{'invalid': !CommissionChangeApprovedValue[index].valueValid}"
                 style="margin-top: 15px;" v-if="CommissionChangeApprovedValue[index].selected">
              <InputField inputName="KvDiscountRequestValue"
                          inputType="number"
                          step="0.1"
                          min="0"
                          max="100"
                          :inputValue="CommissionChangeApprovedValue[index].value"
                          v-model="CommissionChangeApprovedValue[index].value"
                          @keyup="restrictInputCommission($event, index)"></InputField>
              <label class="ph">Änderung der Provision (%)</label>
            </div>
          </div>
        </div>

        <div class="request-commission-approval" v-if="CommissionChangeApprove">
          <div v-for="(val, index) in commissionRequested.realEstates">
            <span>{{val.estate_nr}}</span>
            <span>Angefragte Provision: <b>{{val.commission_requested_value}} %</b></span>
          </div>
        </div>


        <div class="request-price-change" v-if="PriceChangeProcess">
          <div v-for="(val, index) in PriceChangeApprovedValue">
            <div class="real-estate-discount-title">{{ PriceChangeApprovedValue[index].immoNr }}:
              <InputField inputType="checkbox" inputPlaceholder="" :inputName="'selectedDiscountUnit-'+index"
                          v-model="PriceChangeApprovedValue[index].selected"></InputField>
            </div>
            <div class="field-wrapper"
                 v-if="PriceChangeApprovedValue[index].selected">
              <TextAreaField inputName="KvDiscountRejectReason" :inputVal="PriceChangeApprovedValue[index].reason"
                             v-model="PriceChangeApprovedValue[index].reason"
                             :class="{'invalid': !PriceChangeApprovedValue[index].reasonValid}"></TextAreaField>
              <label class="ph">Grund der Anpassung</label>
            </div>
            <div class="field-wrapper"
                 style="margin-top: 15px;" v-if="PriceChangeApprovedValue[index].selected">
              <InputField inputName="KvDiscountRequestValue"
                          inputType="text"
                          :inputValue="this.numberWithComma(PriceChangeApprovedValue[index].value)"
                          v-model="PriceChangeApprovedValue[index].value"
                          :class="{'invalid': !PriceChangeApprovedValue[index].valueValid}"></InputField>
              <label class="ph">Wert der Kaufpreisanpassung</label>
            </div>
          </div>
        </div>

        <div class="actions approve-init"
             v-if="PriceChangeProcess">

          <Button type="delete" @click="PriceChangeProcess = false">
            Schließen
          </Button>

          <Button type="report" @click="submitPriceChange">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>


        <div class="actions approve-init"
             v-if="commissionRequested.realEstates.length > 0">

          <Button type="report" @click="CommissionChangeApprove = true" v-if="!CommissionChangeApprove" style="flex-basis: 100%;">
            Provisionnsanpassung einsehen
          </Button>

          <Button type="delete" @click="CommissionChangeApprove = false" v-if="CommissionChangeApprove">
            Schließen
          </Button>

          <Button type="delete full" @click="submitCommissionReject" v-if="CommissionChangeApprove">
            Ablehnen
          </Button>

          <Button type="report" @click="submitCommissionApproval" v-if="CommissionChangeApprove" style="flex-basis: 100%;">
            Bestätigen
          </Button>

        </div>

        <div class="request-discount-data" v-if="cancelProcess">
          <div class="cancle-title">Wählen Sie die Einheiten aus, welche Storniert werden sollen:</div>
          <div v-for="(val, index) in cancelData">
            <div class="real-estate-discount-title" style="display: flex;">{{ cancelData[index].realEstateNr }}:
              <input type="checkbox" :name="'selectedCancelUnit-'+index"
                          v-model="cancelData[index].process" style="cursor: pointer;">
            </div>
            <span v-if="cancelData[index].process">
              <InputField class="dropdown-input" inputType="text" :inputName="'CancelReason'+index"
                          :inputValue="(cancelData[index].reason === false || cancelData[index].reason === '' || typeof cancelData[index].reason === 'undefined') ? 'Grund auswählen' : cancelData[index].reason"
                          :class="{'invalid': !cancelData[index].valid }"
                          @click="toggleCancelReasonDropdowns(index)"
                          @focus="setDropdownTop(index, $event)"
                          @click.stop=""></InputField>
              <label class="ph"></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown :ref="'dropdownCancelReason'+index"
                        :renderingObject="cancelReasons"
                        :class="{active: dropdownsCancelReason[index], relative: dropdownRelativePosition}"
                        @dropdown-item-clicked="updateCancelReasonDropdown(index, $event)"
                        @click.stop=""></Dropdown>
              <div class="field-wrapper" style="margin-top:25px;">
                <TextAreaField :class="{'invalid': !cancelData[index].additionalTextValid }" inputName="reasonText" :inputVal="cancelData[index].additionalText" v-model="cancelData[index].additionalText"></TextAreaField>
              <label class="ph">Zusätzliche Informationen</label>
            </div>
            </span>
          </div>
          <div class="real-estate-discount-title">
            <span style="display: flex;">
              Eigene E-Mail an Kunden senden:
              <input style="cursor: pointer;" type="checkbox" name="sendCustomCancelMail" v-model="cancelData.sendClientStornoEmail">
            </span>

            <div class="field-wrapper" style="margin-top:25px;" v-if="cancelData.sendClientStornoEmail">
              <TextAreaField :inputName="'CustomCancelMailContent'" :inputVal="cancelData.clientEmailStornoEmailCustomContent" v-model="cancelData.clientEmailStornoEmailCustomContent"></TextAreaField>
              <label class="ph">E-Mail Inhalt</label>
            </div>

<!--            <span style="display: flex; margin-top: 15px;">-->
<!--              Kundenfeedback anfragen:-->
<!--              <input style="cursor: pointer;" type="checkbox" name="sendClientFeedbackEmail" v-model="cancelData.sendClientFeedbackEmail">-->
<!--            </span>-->
          </div>
        </div>

        <div class="request-delete" v-if="deleteReservationStarted">
          <div class="field-wrapper" style="margin-top:25px;">
            <InputField class="dropdown-input" inputType="text" :inputName="'DeleteReason'"
              :inputValue="(deleteReservationReason.value === false || deleteReservationReason.value === '' || typeof deleteReservationReason.value === 'undefined') ? 'Grund auswählen' : deleteReservationReason.value"
              :class="{'invalid': !deleteReservationReason.valid }"
              @click="dropdownsDeleteReason = !dropdownsDeleteReason"
              @focus="setDropdownTop(0, $event)"
              @click.stop=""></InputField>
            <label class="ph">Grund <AsterixMarkIcon></AsterixMarkIcon></label>
            <DropdownArrow class="dropdown-arrow"></DropdownArrow>
            <Dropdown :ref="'dropdownDeleteReason'"
              :renderingObject="cancelReasons"
              :class="{active: dropdownsDeleteReason, relative: dropdownRelativePosition}"
              @dropdown-item-clicked="updateDeleteReasonDropdown($event)"
              @click.stop=""></Dropdown>
            <div class="field-wrapper" style="margin-top:25px;">
              <TextAreaField :class="{'invalid': !deleteReservationCustomText.valid }" inputName="reasonText" :inputVal="deleteReservationCustomText.value" v-model="deleteReservationCustomText.value"></TextAreaField>
              <label class="ph">Zusätzliche Informationen <AsterixMarkIcon v-show="deleteReservationReason.value === 'Sonstiges'"></AsterixMarkIcon></label>
            </div>
          </div>
        </div>

        <div class="request-discount-data" v-if="KvDiscountProcess">
          <div v-for="(realEstateData, index) in discountRequested.realEstates" class="discount-overview-item">
            <div><b>Kaufpreisanpassung für</b> {{ realEstateData.estate_nr }}:</div>
            <div class="overview-discount-requests">
              <div><b>Grund:</b> <div>{{ realEstateData.discount_reason }}</div></div>
              <div><b>Wert der Anpassung:</b> <div><span style="display: block; text-align: right" :class="{'crosslined-text': KvDiscountApprovedValue[index].approveValue ? true : false}">{{ this.numberWithComma(realEstateData.discount_requested_value) }} €</span> <span style="display: block; text-align: right" v-if="KvDiscountApprovedValue[index].approveValue">{{ this.numberWithComma(KvDiscountApprovedValue[index].approveValue) }} €</span></div></div>
            </div>
            <div class="final-discount" v-if="KvDiscountApprove[index].editProcess">
              <div class="field-wrapper" style="margin-top:25px;">
                <InputField inputName="KvDiscountRequestValue" :inputValue="this.numberWithComma(KvDiscountApprovedValue[index].editedValue)" v-model="KvDiscountApprovedValue[index].editedValue"></InputField>
                <label class="ph">Finaler Rabatt</label>
              </div>
            </div>
            <div class="final-reject-reason" v-if="KvDiscountApprove[index].rejectProcess">
              <div class="field-wrapper" style="margin-top:25px;">
                <TextAreaField :inputName="'KvDiscountRejectReason'+index" :inputVal="KvDiscountApprovedValue[index].rejectReason" v-model="KvDiscountApprovedValue[index].rejectReason"></TextAreaField>
                <label class="ph">Grund der Ablehnung (optional)</label>
              </div>
            </div>
            <div class="actions approve-init">
              <Button type="delete" @click="KvDiscountApprove[index].approveProcess = false; KvDiscountApprove[index].rejectProcess = false; KvDiscountApprove[index].editProcess = false" v-if="KvDiscountApprove[index].approveProcess || KvDiscountApprove[index].rejectProcess">Schließen</Button>

              <Button type="delete full" @click="KvDiscountApprove[index].rejectProcess = true" v-if="!KvDiscountApprove[index].rejectProcess && !KvDiscountApprove[index].approveProcess">Ablehnen</Button>

              <Button type="edit" @click="KvDiscountApprove[index].editProcess = true; KvDiscountApprove[index].approveProcess = true;" v-if="!KvDiscountApprove[index].approveProcess && !KvDiscountApprove[index].rejectProcess">Bearbeiten</Button>

              <Button type="report" @click="KvDiscountApprove[index].approveProcess = true" v-if="!KvDiscountApprove[index].approveProcess && !KvDiscountApprove[index].rejectProcess" style="flex-basis: 100%;">Akzeptieren</Button>

              <Button type="report" @click="KvDiscountApprovedValue[index].approveValue = KvDiscountApprovedValue[index].editedValue; KvDiscountApprove[index].approveProcess = false; KvDiscountApprove[index].rejectProcess = false; KvDiscountApprove[index].editProcess = false" v-if="KvDiscountApprove[index].editProcess">Änderung Bestätigen</Button>

              <Button type="report" @click="approveKVDiscount(realEstateData.estate_nr, KvDiscountApprovedValue[index].approveValue)" v-if="KvDiscountApprove[index].approveProcess && !KvDiscountApprove[index].rejectProcess && !KvDiscountApprove[index].editProcess">Bestätigen <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon></Button>

              <Button type="report" @click="rejectKVDiscount(realEstateData.estate_nr, KvDiscountApprovedValue[index].rejectReason)" v-if="KvDiscountApprove[index].rejectProcess && !KvDiscountApprove[index].approveProcess">Bestätigen <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon></Button>
            </div>
          </div>
        </div>

        <div class="mail-history" v-if="showMailingHistory">
          <div class="mail-history-inner-wrapper">
            <div v-for="(val, index) of apiResponseAllMailings" v-show="renderEmailCat(val.mail_cat) !== ''" :key="val.id">
              <div>E-Mail gesendet: <b>{{renderEmailCat(val.mail_cat)}}</b></div>
              <div>am: <b>{{this.englishDateWithTimeToGermanDate(val.createdatetime)}}</b></div>
            </div>
          </div>
        </div>

        <ReservationFileChanges v-if="showFileChangeView" :reservationData="mergedDataForReservationFileChangeView" @triggerNewCustomerFolderEditView="getApisData()"></ReservationFileChanges>

        <div class="reject-discount-data" v-if="KvDiscountReject">
          <div class="field-wrapper">
            <TextAreaField inputName="KvDiscountRejectReason" :inputVal="KvDiscountRejectReason" v-model="KvDiscountRejectReason"></TextAreaField>
            <label class="ph">Grund der Ablehnung (optional)</label>
          </div>
        </div>


        <div class="approve-data" v-show="approveProvisionProcess">

          <div id="provision-approval" class="iframe"></div>

        </div>

        <div class="actions"
             :class="{ 'delete-init' : deleteReservationStarted, 'report-init' : reportReservationStarted }"
             v-if="parseInt(apiResponseReservation.reservation_status) === 0 && !CommissionChangeProcess && !showFileChangeView">

          <router-link :to="{name: 'editReservationView', params:{ id: reservationId }}"
                       v-if="!deleteReservationStarted && !reportReservationStarted">
            <Button type="edit">Bearbeiten</Button>
          </router-link>

          <Button type="report" v-if="!deleteReservationStarted && !reportReservationStarted"
                  @click="reportReservationStarted = true" style="flex-basis: 48%">Melden
          </Button>
          <Button type="delete" v-if="reportReservationStarted && reportApiStatus !== 200"
                  @click="reportReservationStarted = false">Abbrechen
          </Button>
          <Button type="create reservation" v-if="reportReservationStarted && reportApiStatus !== 200"
                  @click="reportReservation">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>

        <div class="actions delete-init" v-if="deleteReservationStarted">
          <Button type="delete" @click="deleteReservationStarted = false" v-if="!deleteReservationStartedOnInit">Abbrechen
          </Button>
          <Button type="create reservation" @click="deleteReservation">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>

        <div class="actions" v-if="isOpenProvisionToApprove">
          <Button type="edit" @click="approveProvisionProcess = true"
                  v-if="isOpenProvisionToApprove && !approveProvisionProcess && !ndbProcessStarted && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !ndbApproveProcess">
            Provisionsnachweis einsehen
          </Button>
          <Button type="delete" @click="approveProvisionProcess = false; reloadSingleReservationStore()" v-if="approveProvisionProcess">Abbrechen
          </Button>
        </div>

        <div class="actions"
             :class="{ 'approve-init' : approveReservationStarted, 'reject-init': rejectReservationStarted, 'is-yousign': approveApiIframeUrl.includes('yousign') }"
             v-if="parseInt(apiResponseReservation.reservation_status) === 2 && this.getUserRole() > 1 && !deleteReservationStarted && !showMailingHistory && !showFileChangeView && !CommissionChangeProcess && !CommissionChangeApprove">

          <Button type="delete" @click="approveReservationStarted = false"
                  v-if="approveReservationStarted && !rejectReservationStarted">Abbrechen
          </Button>
          <Button type="delete" @click="rejectReservationStarted = false" v-if="rejectReservationStarted">Abbrechen
          </Button>
          <Button type="delete full" @click="rejectReservationStarted = true;"
                  v-if="approveReservationStarted && !rejectReservationStarted">Reservierung Ablehnen
          </Button>
          <Button type="delete full" @click="rejectReservation"
                  v-if="approveReservationStarted && rejectReservationStarted">
            Reservierung Ablehnen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
          <Button type="report" @click="getReservationIframeUrl"
                  v-if="!approveReservationStarted && !rejectReservationStarted">
            Unterlagen einsehen
          </Button>
          <Button type="report" @click="approveReservation"
                  v-if="approveReservationStarted && !rejectReservationStarted && !approveApiIframeUrl.includes('yousign')">
            Reservierung Akzeptieren
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions" :class="{ 'approve-init' : approveReceivedFee}"
             v-if="parseInt(apiResponseReservation.reservation_status) === 3 && reservationWithFee && this.getUserRole() > 1 && !CommissionChangeProcess">

          <Button type="report" @click="approveReceivedFee = true" v-if="!approveReceivedFee">Gebühren eingegangen
          </Button>
          <Button type="delete" @click="approveReceivedFee = false" v-if="approveReceivedFee">Abbrechen</Button>
          <Button type="report" @click="approveReservationFeeReceived" v-if="approveReceivedFee">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 5 && !ndbFinished">

          <Button type="edit" @click="ndbShowCustomerSubmittedFormData = true"
                  v-if="!ndbProcessStarted && !ndbShowCustomerSubmittedFormData">Kundendaten einsehen
          </Button>
          <Button type="delete" @click="ndbShowCustomerSubmittedFormData = false"
                  v-if="ndbShowCustomerSubmittedFormData">Schließen
          </Button>

          <Button type="edit" @click="downloadNDBTemplate" v-if="!ndbProcessStarted">
            NDB Vorlage runterladen
          </Button>

          <Button type="report" @click="ndbProcessStarted = true"
                  v-if="!ndbProcessStarted && !ndbShowCustomerSubmittedFormData" style="flex-basis: 100%;">NDB hochladen
          </Button>
          <Button type="delete" @click="ndbProcessStarted = false" v-if="ndbProcessStarted">Abbrechen</Button>
          <Button type="report" @click="submitNDBAgent" v-if="ndbProcessStarted">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 6 && this.getUserRole() > 1">

          <Button type="edit" @click="ndbShowCustomerSubmittedFormData = true"
                  v-if="!ndbProcessStarted && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !ndbApproveProcess">
            Kundendaten einsehen
          </Button>
          <Button type="delete" @click="ndbShowCustomerSubmittedFormData = false"
                  v-if="ndbShowCustomerSubmittedFormData" style="flex-basis: 100%">Schließen
          </Button>

          <Button type="edit" @click="ndbProcessStarted = true; showNDBSummary = false;"
                  v-if="!ndbProcessStarted && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !ndbApproveProcess">
            NDB ändern
          </Button>
          <Button type="delete" @click="ndbProcessStarted = false" v-if="ndbProcessStarted">Abbrechen</Button>
          <Button type="report" @click="submitNDBAgent" v-if="ndbProcessStarted">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="edit" @click="downloadSubmittedNDB" style="flex-basis: 100%;">NDB Herunterladen</Button>
          <div class="ndb-downloads" v-if="showNDBSummary">
            <div v-for="file in apiResponseReservation.ndb_files" @click="downloadSubmittedNDB(file)">
              <span>{{ getFilenameFromPath(file) }}</span>
              <span><DownloadIcon></DownloadIcon></span>
            </div>
          </div>

          <Button type="delete full" @click="ndbRejectProcess = true; showNDBSummary = false;"
                  v-if="!ndbRejectProcess && !ndbApproveProcess && !ndbShowCustomerSubmittedFormData && !ndbProcessStarted">
            NDB ablehnen
          </Button>
          <Button type="delete" @click="ndbRejectProcess = false" v-if="ndbRejectProcess">Abbrechen</Button>
          <Button type="report" @click="rejectNDB" v-if="ndbRejectProcess">Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="report" @click="ndbApproveProcess = true; showNDBSummary = false;"
                  v-if="!ndbApproveProcess && !ndbShowCustomerSubmittedFormData && !ndbRejectProcess && !ndbProcessStarted">
            NDB akzeptieren
          </Button>
          <Button type="delete" @click="ndbApproveProcess = false" v-if="ndbApproveProcess">Abbrechen</Button>
          <Button type="report" @click="approveNDB" v-if="ndbApproveProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="externalGWGForApproval > 0 && !internalGWGProcess && this.getUserRole() > 1">

          <Button type="edit" @click="externalGWGProcess = true" v-if="!externalGWGProcess" style="flex-basis: 100%;">Externes GWG einsehen
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.gwgintern_process) <= 0 && !externalGWGProcess && apiResponseReservation.reservation_status >= 7 && !KvCustomerReceivedData && !KvFinalUploadProcess && !KvCreateNotartermin && !KvDiscountInit && !FinanceProcess && !cancelProcess && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess">

          <Button type="edit" @click="internalGWGProcess = true" v-if="!internalGWGProcess" style="flex-basis: 100%">Internes GWG ausfüllen
          </Button>

          <Button type="delete" @click="internalGWGProcess = false" v-if="internalGWGProcess">Schließen</Button>
          <Button type="report" @click="ValidateInternalGWG" v-if="internalGWGProcess">Einreichen <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon></Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.gwgintern_process) === 1 && !externalGWGProcess && apiResponseReservation.reservation_status >= 7 && !KvCustomerReceivedData && this.getUserRole() > 1 && !showMailingHistory && !showFileChangeView">

          <Button type="edit" @click="internalGWGReportProcess = true" v-if="!internalGWGReportProcess" style="flex-basis: 100%">Internes GWG
            einsehen
          </Button>
          <Button type="delete" @click="internalGWGReportProcess = false"
                  v-if="internalGWGReportProcess && !internalGWGRejectProcess && !internalGWGApproveProcess">Schließen
          </Button>

          <Button type="delete" @click="internalGWGRejectProcess = false"
                  v-if="internalGWGRejectProcess && !internalGWGApproveProcess">Schließen
          </Button>
          <Button type="delete full" @click="internalGWGRejectProcess = true"
                  v-if="internalGWGReportProcess && !internalGWGRejectProcess && !internalGWGApproveProcess">Ablehnen
          </Button>
          <Button type="delete full" @click="rejectInternalGWG"
                  v-if="internalGWGRejectProcess && !internalGWGApproveProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="report" @click="internalGWGApproveProcess = true"
                  v-if="internalGWGReportProcess && !internalGWGRejectProcess && !internalGWGApproveProcess"
                  style="flex-basis: 100%;">Akzeptieren
          </Button>
          <Button type="delete" @click="internalGWGApproveProcess = false" v-if="internalGWGApproveProcess">Schließen
          </Button>
          <Button type="report" @click="approveInternalGWG" v-if="internalGWGApproveProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.finance_process) === 1 && !KvCustomerReceivedData && this.getUserRole() > 1 && !internalGWGProcess && !notaryAppointmentOccuredProcess && !KvCreateNotartermin && !KvFinalUploadProcess && !startNotaryToLawyerProcess">

          <Button type="edit" @click="FinanceProcess = true; getFinanceFiles()" v-if="!FinanceProcess" style="flex-basis: 100%;">Finanz&shy;unterlagen
            einsehen
          </Button>
          <Button type="delete" @click="FinanceProcess = false"
                  v-if="FinanceProcess && !FinanceRejectProcess && !FinanceApproveProcess && !FinanceEditProcess">
            Schließen
          </Button>

          <Button type="delete" @click="FinanceRejectProcess = false" v-if="FinanceProcess && FinanceRejectProcess">
            Schließen
          </Button>
          <Button type="delete full" @click="FinanceRejectProcess = true;"
                  v-if="FinanceProcess && !FinanceRejectProcess && !FinanceApproveProcess && !FinanceEditProcess">
            Unterlagen ablehnen
          </Button>
          <Button type="delete full" @click="rejectFinance" v-if="FinanceRejectProcess">
            Ablehnen Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="delete" @click="FinanceEditProcess = false; FinanceUploadEditProcess = false"
                  v-if="FinanceEditProcess">Schließen
          </Button>
          <Button type="edit" @click="FinanceEditProcess = true;"
                  v-if="FinanceProcess && !FinanceRejectProcess && !FinanceApproveProcess && !FinanceEditProcess">
            Bearbeiten
          </Button>
          <Button type="edit" @click="FinanceUploadEditProcess = true;"
                  v-if="FinanceEditProcess && !FinanceRejectProcess && !FinanceApproveProcess && !FinanceUploadEditProcess">
            Weitere Dateien hochladen
          </Button>
          <Button type="report" @click="submitAdditionalFinanceUploads" v-if="FinanceUploadEditProcess">
            Dateien hochladen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
          <Button type="report" @click="submitEditUploadCategories"
                  v-if="FinanceEditProcess && !FinanceUploadEditProcess" style="flex-basis: 100%;">
            Änderungen übernehmen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="delete" @click="FinanceApproveProcess = false" v-if="FinanceProcess && FinanceApproveProcess">
            Schließen
          </Button>
          <Button type="report" @click="FinanceApproveProcess = true"
                  v-if="FinanceProcess && !FinanceApproveProcess && !FinanceEditProcess && !FinanceRejectProcess">
            Unterlagen akzeptieren
          </Button>
          <Button type="report" @click="approveFinance" v-if="FinanceProcess && FinanceApproveProcess">
            Akzeptieren bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 7 && parseInt(apiResponseReservation.kv_process) === 0 && !KvDiscountInit && this.getUserRole() > 1">

          <Button type="delete" @click="StartKV = false" v-if="StartKV">Schließen</Button>
          <Button type="edit" @click="StartKV = true" v-if="!StartKV">KV beantragen</Button>
          <Button type="report" @click="startProcessKV()" v-if="StartKV">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init" v-if="cancelProcess">

          <Button type="delete" @click="cancelProcess = false; cancelProcessApprove = false">Schließen</Button>
          <Button type="delete full" @click="cancelProcessApprove = true" v-if="!cancelProcessApprove">Stornierung abschicken</Button>
          <Button type="report" @click="cancelUnits()" v-if="cancelProcessApprove">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 7 && parseInt(apiResponseReservation.kv_process) === 1 && !KvDiscountInit && !internalGWGProcess && parseInt(apiResponseReservation.sale_create_vkm) !== 1 && !internalGWGReportProcess && !FinanceProcess && !externalGWGProcess && this.getUserRole() > 1 && !cancelProcess && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess && !KvFinalUploadProcess">

          <Button type="delete" @click="KvCustomerReceivedData = false" v-if="KvCustomerReceivedData">Schließen</Button>
          <Button type="edit" @click="KvCustomerReceivedData = true" v-if="!KvCustomerReceivedData" style="flex-basis: 100%;">Kunde hat KV
            erhalten
          </Button>
          <Button type="report" @click="customerReceivedKVdata()" v-if="KvCustomerReceivedData">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 7 && !KvDiscountInit && !internalGWGProcess && !internalGWGReportProcess && !FinanceProcess && !externalGWGProcess && this.getUserRole() > 1 && !cancelProcess && !showMailingHistory && !showFileChangeView && !internalGWGProcess && !KvDiscountProcess && !KvFinalUploadProcess && !KvCustomerReceivedData && (apiResponseReservation.kv_notartermin_city === null || apiResponseReservation.kv_notartermin_city === 'berlin' || apiResponseReservation.kv_notartermin_city === '' ) && (apiResponseReservation.kv_data_send_from_lawyers_to_berlin === null || apiResponseReservation.kv_data_send_from_lawyers_to_berlin === '') && !startFinalSaleCovivoSignedProcess">

          <Button type="delete" @click="startNotaryToLawyerProcess = false" v-if="startNotaryToLawyerProcess">Schließen</Button>
          <Button type="edit" @click="startNotaryToLawyerProcess = true" v-if="!startNotaryToLawyerProcess" style="flex-basis: 100%;">
            {{ apiResponseReservation.kv_notartermin_city === 'berlin' ? 'KV von Essen nach Berlin gesendet' : 'KV nach Essen gesendet' }}
          </Button>
          <Button type="report" @click="submitNotaryDataBasedOnLawyers()" v-if="startNotaryToLawyerProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 7 && parseInt(apiResponseReservation.kv_process) >= 2 && parseInt(apiResponseReservation.kv_notartermin_id) !== 1 && !KvDiscountInit && !KvFinalUploadProcess && !internalGWGProcess && parseInt(apiResponseReservation.sale_create_vkm) !== 1 && this.getUserRole() > 1 && !cancelProcess && !FinanceProcess && !startNotaryToLawyerProcess && !showMailingHistory && !showFileChangeView">

          <Button type="delete" @click="KvCreateNotartermin = false; KvDeleteNotartermin = false" v-if="KvCreateNotartermin">Schließen</Button>
          <Button type="edit" @click="KvCreateNotartermin = true; checkKvNotification()" v-if="!KvCreateNotartermin" style="flex-basis: 100%">Notartermin
            {{ KvNotarterminDate.value && KvNotarterminDate.value !== '' ? 'bearbeiten' : 'erstellen' }}
          </Button>
          <Button type="report" @click="createNotartermin();" v-if="KvCreateNotartermin">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
          <Button style="flex-basis: 100%;" type="delete full" @click="deleteNotartermin();" v-if="KvNotarterminDateEditProcess">
            {{ !KvDeleteNotartermin ? 'Notartermin löschen' : 'Notartermin löschen bestätigen' }}
            <AnimateCircleIcon v-if="isLoadingDeleteNotaryAppointment"></AnimateCircleIcon>
          </Button>
        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) === 7 && parseInt(apiResponseReservation.kv_process) < 4 && !KvDiscountInit && !KvCreateNotartermin && !internalGWGProcess && !FinanceProcess && !cancelProcess && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess && !KvCustomerReceivedData && !startFinalSaleCovivoSignedProcess">

          <Button type="delete" @click="KvFinalUploadProcess = false" v-if="KvFinalUploadProcess">Schließen</Button>
          <Button type="edit" @click="KvFinalUploadProcess = true" v-if="!KvFinalUploadProcess" style="flex-basis: 100%">Finalen KV hochladen
          </Button>
          <Button type="report" @click="submitFinalKV()" v-if="KvFinalUploadProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) >= 4 && discountRequested.isRequested && !KvDiscountInit && parseInt(apiResponseReservation.sale_create_vkm) !== 1 && this.getUserRole() > 1">

          <Button type="edit" @click="KvDiscountProcess = true" v-if="!KvDiscountProcess">KPA Anfrage einsehen</Button>
          <Button type="delete" @click="KvDiscountProcess = false; KvDiscountApprove = false" v-if="KvDiscountProcess">
            Schließen
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) >= 4 && KvDiscountInit && parseInt(apiResponseReservation.sale_create_vkm) !== 1">
          <Button type="delete" @click="KvCreateDiscountRequest = false; KvDiscountInit = false" v-if="KvDiscountInit">
            Schließen
          </Button>
          <Button type="edit" @click="KvCreateDiscountRequest = true" v-if="!KvCreateDiscountRequest">KPA einreichen
          </Button>
          <Button type="report" @click="submitDiscountRequest()" v-if="KvCreateDiscountRequest">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.reservation_status) <= 4 && CommissionChangeProcess">
          <Button type="delete" @click="CommissionChangeProcess = false" v-if="CommissionChangeProcess">
            Schließen
          </Button>
          <Button type="edit" @click="CommissionChangeApprove = true" v-if="!CommissionChangeApprove">
            Provi anpassen
          </Button>
          <Button type="report" @click="submitCommissionRequest()" v-if="CommissionChangeApprove">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>

        <div class="actions approve-init"
             v-if="notaryAppointmentinFuture !== null && typeof notaryAppointmentinFuture !== 'undefined' && !notaryAppointmentinFuture && parseInt(apiResponseReservation.sale_create_vkm) !== 1 && parseInt(apiResponseReservation.sale_create_vkm) !== -1 && !cancelProcess && !internalGWGRejectProcess && !internalGWGProcess && !internalGWGApproveProcess && !KvFinalUploadProcess && !KvCreateNotartermin && !showMailingHistory && !showFileChangeView && !startNotaryToLawyerProcess">
          <Button type="delete" @click="notaryAppointmentNotOccuredProcess = true;"
                  v-if="!notaryAppointmentNotOccuredProcess && !notaryAppointmentOccuredProcess">Notartermin nicht
            stattgefunden
          </Button>
          <Button type="delete" @click="notaryAppointmentNotOccuredProcess = false"
                  v-if="notaryAppointmentNotOccuredProcess && !notaryAppointmentOccuredProcess">Schließen
          </Button>
          <Button type="report" @click="updateNotarterminOccured(false)"
                  v-if="notaryAppointmentNotOccuredProcess && !notaryAppointmentOccuredProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

          <Button type="edit" @click="notaryAppointmentOccuredProcess = true;"
                  v-if="!notaryAppointmentOccuredProcess && !notaryAppointmentNotOccuredProcess">Notartermin
            stattgefunden
          </Button>
          <Button type="delete" @click="notaryAppointmentOccuredProcess = false"
                  v-if="notaryAppointmentOccuredProcess && !notaryAppointmentNotOccuredProcess">Schließen
          </Button>
          <Button type="report" @click="updateNotarterminOccured(true)"
                  v-if="notaryAppointmentOccuredProcess && !notaryAppointmentNotOccuredProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>

        <div class="actions approve-init"
             v-if="showMailingHistory === true">
          <Button type="delete" @click="showMailingHistory = false;" style="flex-basis: 100%;">Schließen
          </Button>
        </div>

        <div class="actions approve-init"
             v-if="parseInt(apiResponseReservation.sale_create_vkm) === 1 && ( apiResponseReservation.kv_signed_by_covivio === null || apiResponseReservation.kv_signed_by_covivio === 'undefined' || apiResponseReservation.kv_signed_by_covivio === '' )">

          <Button type="delete" @click="startFinalSaleCovivoSignedProcess = false" v-if="startFinalSaleCovivoSignedProcess">Schließen</Button>
          <Button type="edit" @click="startFinalSaleCovivoSignedProcess = true" v-if="!startFinalSaleCovivoSignedProcess" style="flex-basis: 100%;">
            KV Final von Covivio unterschrieben
          </Button>
          <Button type="report" @click="submitFinalKVCovivioSigned()" v-if="startFinalSaleCovivoSignedProcess">
            Bestätigen
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>

        </div>

        <div class="actions approve-init"
             v-if="!notaryAppointmentinFuture && parseInt(apiResponseReservation.sale_create_vkm) === 1 && !startFinalSaleCovivoSignedProcess">
          <span v-for="(val, index) in verkaufsmeldungAPIData" style="flex-basis: 100%;">
            <router-link :to="{name: 'singleVerkaufsmeldungView', params:{ id: val.verkaufsmeldung_id }}">
              <Button type="edit">Verkaufsmeldung für {{ val.real_estate_nr }} einsehen</Button>
            </router-link>
          </span>
        </div>

        <AlertMessage :alertStatus="alertStatus" :alertText="alertMessage"></AlertMessage>

      </div>

    </div>

  </div>

</template>


<style scoped>

.loading-screen-init {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .8);
  z-index: 999;
}

.loading-screen-init .loading-animation {
  font-size: 40px;
  margin-left: 0;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.customer-data, .process-tabs-wrapper {
  display: flex;
  justify-content: space-between;
}

.process-tabs-wrapper, .real-estates-list, .modal-body {
  margin-top: 40px;
}

.modal-title-wrapper {
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
}

.customer-data > div:last-of-type {
  text-align: right;
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

.actions .button:last-of-type {
  flex-basis: 100%;
}

.actions.delete-init .button:last-of-type,
.actions.report-init .button:last-of-type,
.actions.approve-init .button:last-of-type {
  flex-basis: 48%;
  margin-bottom: 15px;
}

iframe, .iframe {
  width: 100%;
  height: 70vh;
}

.iframe-view .actions.approve-init .button:last-of-type {
  flex-basis: 100%;
}

.actions.approve-init.reject-init .button:last-of-type, .actions.approve-init.is-yousign .button:last-of-type {
  flex-basis: 48%;
}

.process-tab-content {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: -999;
  width: 100%;
  min-height: calc(100% + 35px);
  left: 0;
  border-radius: var(--border-radius);
  padding: 20px 0;
}

.field-wrapper.radios {
  display:flex;
  justify-content: center;
  margin-top: 25px;
}

.process-tab-content.active {
  z-index: 9;
  top: -35px;
  background: white;
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  border: solid 1px var(--blue);
}

.real-estates-list.process-tab-active {
  overflow: unset;
}

.finance-data img {
  max-width: 100%;
  height: auto;
}

.finance-data .media {
  text-align: right;
}

.finance-data .media .dropdown {
  text-align: left;
}

.finance-data .media + .media {
  margin-top: 25px;
}

.finance-data img, .finance-data iframe {
  display: block;
}

.delete-single-file {
  display: inline-block;
  color: var(--red);
  text-align: right;
  cursor: pointer;
}

.delete-single-file:hover + img, .delete-single-file:hover + iframe {
  transition: opacity 0.2s;
  opacity: 0.5;
}

.cat-wrapper {
  margin-top: 50px;
}

.cat-wrapper .cat-title {
  font-size: 16px;
  font-weight: 700;
}

.invalid input, .invalid textarea, .invalid .dropzone-container {
  border-left: 5px solid red;
}

.request-discount-data > div + div {
  border-top: solid 1px var(--light-light-gray);
  padding-top: 15px;
  margin-top: 25px;
}

.real-estate-discount-title {
  margin-bottom: 15px;
}

.overview-discount-requests {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 15px;
}

.overview-discount-requests {
  flex-basis: 48%;
}

.discount-overview-item + .discount-overview-item {
  border-top: solid 1px var(--light-light-gray);
  padding-top: 20px;
}

.ndb-downloads {
  flex-basis: 100%;
  margin-bottom: 25px;
}

.ndb-downloads i {
  color: var(--blue);
}

.ndb-downloads > div {
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
  background-color: var(--light-light-gray);
  cursor: pointer;
}

.ndb-downloads > div:hover,
.ndb-downloads > div:hover i{
  background-color: var(--blue);
  color: white;
}

.subheadline {
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.countdown {
  color: var(--blue);
}

.button-discount, .button-cancel {
  display: flex;
  margin-top: 15px;
}

.invalid {
  border-left: 5px solid red;
}

.approve-data .external-gwg {
  margin-top: 50px;
  border-bottom: solid 1px var(--light-light-gray);
}

.hidder {
  background-color: #F7F7F7;
  position: absolute;
  bottom: 15px;
  left: 10px;
  width: 200px;
  height: 50px;
  z-index: 9;
}

.mail-history-inner-wrapper > div {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.mail-history-inner-wrapper > div + div {
  margin-top: 5px;
}

.request-commission-approval > div {
  display: flex;
  justify-content: space-between;
}

/* Mobile */
@media (max-width: 767px) {
  .customer-data {
    flex-wrap: wrap;
    flex-basis: 100%;
  }

  .customer-data > div:last-of-type {
    text-align: left;
  }

  .customer-data a {
    word-break: break-all;
  }
  .overview-discount-requests {
    flex-basis: 100%;
  }
}

@media (max-width: 650px) {
  .hidder {
    width: 100px;
  }
}

/* Small Mobile */
@media (max-width: 350px) {
  .process-tabs-wrapper {
    flex-wrap: wrap;
  }

  .process-tabs-wrapper .processtab {
    flex-basis: 100%;
  }

  .process-tabs-wrapper .processtab + .processtab {
    margin-top: 10px;
  }
}

</style>
