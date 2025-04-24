<script>
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive, computed } from "vue";
import Loading from "./reservation-list/Loading.vue";
import LoadingTableData from "./reservation-list/LoadingTableData.vue";
import { agentsStoreRL } from "@/stores/agentsStoreRL";
import Nationalities from "../assets/reservation-list/nationality.json";
import ReservationTableHeader from "../assets/reservation-list/reservationHeader.json";
import CancellationTableHeader from "../assets/reservation-list/cancellationHeader.json";
import SoldTableHeader from "../assets/reservation-list/soldHeader.json";
import DropdownField from "./reservation-list/DropdownField.vue";
import EditTableImage from "./images/kaufpreis-list/edit-table-image.vue";
import AddTableImage from "./images/kaufpreis-list/add-table-image.vue";
import ResetIcon from "./icons/icon-reset.vue";
import SaveTableImage from "./images/kaufpreis-list/save-table-image.vue";
import TableDropdownField from "./reservation-list/TableDropdownField.vue";
import CreateViewModal from "./reservation-list/CreateViewModal.vue";
import ActivityDetailsModal from "./reservation-list/ActivityDetailsModal.vue";
import FileDownloadModal from "./reservation-list/FileDownloadModal.vue";
import LoadingOverlay from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Reservation List",
  components: {
    Loading,
    LoadingTableData,
    LoadingOverlay,
    DropdownField,
    EditTableImage,
    AddTableImage,
    ResetIcon,
    SaveTableImage,
    TableDropdownField,
    CreateViewModal,
    ActivityDetailsModal,
    FileDownloadModal,
  },
  setup() {
    const isLoading = ref(true);
    const isTableDataLoading = ref(true);
    const isActivityLoading = ref(true);
    const headers = ref([]);
    const reservationTableData = ref([]);
    const cancellationTableData = ref([]);
    const soldTableData = ref([]);
    const isReservedClicked = ref(true);
    const isCanceledClicked = ref(false);
    const isSoldClicked = ref(false);
    const loadingText = ref("Laden von Projektdaten");
    const years = ref([]);
    const months = ref([]);
    const yearInputModal = ref("");
    const monthInputModal = ref("");
    const clearDropdownsOnReset = ref(false);
    const editable = ref(false);
    const showCreateViewModal = ref(false);
    const realEstateAgents = ref([]);
    const allReservationData = ref([]);
    const nationalities = ref(Nationalities);
    const reservationHeader = ref(ReservationTableHeader);
    const cancelHeader = ref(CancellationTableHeader);
    const soldHeader = ref(SoldTableHeader);
    const fetchedReservationData = ref(false);
    const preSelectedYear = ref(null);
    const selectedYears = ref([]);
    const allActivities = ref([]);
    const showActivityDetailsModal = ref(false);
    const selectedRIDItemTableData = ref([]);
    const selectedRIDItemAllData = ref([]);
    const cancelTokenSource = ref(null);

    return {
      isLoading,
      isTableDataLoading,
      isActivityLoading,
      headers,
      reservationTableData,
      cancellationTableData,
      soldTableData,
      isReservedClicked,
      isCanceledClicked,
      isSoldClicked,
      loadingText,
      years,
      months,
      yearInputModal,
      monthInputModal,
      clearDropdownsOnReset,
      editable,
      showCreateViewModal,
      realEstateAgents,
      allReservationData,
      nationalities,
      reservationHeader,
      cancelHeader,
      soldHeader,
      fetchedReservationData,
      preSelectedYear,
      selectedYears,
      allActivities,
      showActivityDetailsModal,
      selectedRIDItemTableData,
      selectedRIDItemAllData,
      cancelTokenSource
    };
  },

  methods: {
    async resetAll() {
      this.isLoading = false;
      this.loadingText = "Laden von Projektdaten";
      this.isTableDataLoading = false;
      this.editable = false;
      this.allReservationData = [];
      this.fetchedReservationData = false;
      this.yearInputModal = "";
      this.monthInputModal = "";
      this.clearDropdownsOnReset = true;
      await this.$nextTick();
      this.loadYears();
      this.loadMonths();
      this.loadConfigData();
      this.showReservedData();
    },

    handleChangeByYear(emitData) {
      // this.allReservationData = [];
      this.selectedYears = [];
      this.selectedYears = emitData.selected_values.map(
        (element) => element.value
      );
      console.log("handleChangeByYear",this.selectedYears)

      this.yearInputModal = emitData.selected_titles;
      // let selectedValues = emitData.selected_values;
      // if (selectedValues.length > 0) {
      //     selectedValues.forEach(element => {
      //         this.selectedYears.push(element.value);
      //      });
      // }

      if (this.monthInputModal === "Alle") {
        this.getAllReportData(this.selectedYears, ["January", "December"]);
      } else {
        this.getAllReportData(this.selectedYears, [this.monthInputModal]);
      }
    },

    handleChangeByMonth(emitdata) {
      // this.allReservationData = [];
      this.monthInputModal = emitdata.title;

      if (this.monthInputModal === "Alle") {
        this.getAllReportData(this.selectedYears, ["January", "December"]);
      } else {
        this.getAllReportData(this.selectedYears, [this.monthInputModal]);
      }
    },

    formatPrice(value) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    },

    isUsernameInArray(username) {
      return this.realEstateAgents?.some(
        (agent) => agent?.selection_value === username
      );
    },

    getAgentLabel(username) {
      const agent = this.realEstateAgents.find(
        (agent) => agent.selection_value === username
      );
      return agent ? agent.selection_label : username;
    },

    getNatinalityLabel(nationality) {
      const nationalityLabel = this.nationalities.find(
        (item) => item.value === nationality
      );
      return nationalityLabel ? nationalityLabel.title : nationality;
    },

    generateNationalityOptions() {
      return this.nationalities?.map((nationality) => ({
        selection_label: nationality.title,
        selection_value: nationality.value,
      }));
    },

    isDateOverdue(rowData, index) {
      const ndbAnCovivio = rowData.find(
        (item) => item.field_name === "NDB_an_Covivio"
      );
      const ndbCovivioanEssen = rowData.find(
        (item) => item.field_name === "NDB_von_Covivio_an_Essen"
      );
      if (!ndbAnCovivio) {
        return false;
      }
      const ndbAnCovivioDate = new Date(ndbAnCovivio.value);
      const ndbCovivioanEssenDate = new Date(ndbCovivioanEssen.value);
      const diffTime = Math.abs(ndbAnCovivioDate - ndbCovivioanEssenDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 7;
    },

    generateRealEstateOptions() {
      const allAgents = this.realEstateAgents.map((agent) => ({
        selection_label: agent.selection_label,
        selection_value: agent.selection_value,
      }));
      return allAgents;
    },

    mapAllRealAgentsData(data) {
      this.isLoading = true;

      try {
        data?.living?.list_of_all_users_data?.forEach((item) => {
          const agentUsernameLiving = item?.user_Name;
          const agentFirstNameLiving = item?.user_Vorname || "";
          const agentLastNameLiving = item?.user_Nachname || "";

          if (agentFirstNameLiving || agentLastNameLiving) {
            const dataLiving = {
              selection_label: `${agentFirstNameLiving || ""} ${
                agentLastNameLiving || ""
              }`.trim(),
              selection_value: agentUsernameLiving,
            };
            this.realEstateAgents.push(dataLiving);
          } else if (agentUsernameLiving) {
            const dataLiving = {
              selection_label: agentUsernameLiving,
              selection_value: agentUsernameLiving,
            };
            this.realEstateAgents.push(dataLiving);
          }
        });
      } catch (error) {
        console.error("Error fetching agents data:", error);
        // this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },

    async getAllReportData(selectedYears, selectedMonths) {
      console.log("cancel",this.cancelTokenSource)
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("Operation canceled due to new request.");
      }
      this.cancelTokenSource = axios.CancelToken.source();
      this.allReservationData = [];
    
      try {
        this.isLoading = true;
        this.isTableDataLoading = true;
        this.isActivityLoading = true;
        this.allReservationData = [];
        this.loadingText = "Laden von Projektdaten";
        this.fetchedReservationData = false;

        // console.log("outerloop",selectedYears)
        // console.log("alldata",this.allReservationData)

        const firstMonth = moment().month(selectedMonths[0]).format("MM");
        const lastMonth = moment()
          .month(selectedMonths[selectedMonths.length - 1])
          .format("MM");

        // const promises = selectedYears.map(async (selectedYear) => {
        for (const selectedYear of selectedYears) {
          // console.log("innerloopyear",selectedYear)
          // console.log("innerloop",selectedYears)
          // console.log("alldata1",this.allReservationData)
          try {
            const response = await axios.request({
              method: "POST",
              url:
              this.globalApiBaseUrl +
                "/reservations/getReservationDataByDateRange",
              data: {
                dateFrom: `${selectedYear}-${firstMonth}-01`,
                dateTo: `${selectedYear}-${lastMonth}-31`,
              },
              cancelToken: this.cancelTokenSource.token,
            });
            // return response?.data?.response?.response || [];
            const fetchedData = response?.data?.response?.response || [];
            this.allReservationData.push(...fetchedData);


            if (this.allReservationData.length > 0) {
              this.isLoading = false;
            }
          } catch (error) {
            console.error(
              `Error fetching data for year ${selectedYear}:`,
              error
            );
            return [];
          }
        }
        // });

        // const responses = await Promise.all(promises);
        // this.allReservationData = responses.flat();

        if (this.allReservationData.length <= 0) {
          this.isLoading = false;
          this.isTableDataLoading = false;
          this.isActivityLoading = false;
          this.fetchedReservationData = true;
          this.noDataFoundWarningAlert();
          this.resetAllTableData();
          return;
        }

        this.reservationTableData = [];
        this.cancellationTableData = [];
        this.soldTableData = [];
        let financeDate = "";
        let ndbAnCovivioDate = "";

        // this.allReservationData.forEach((item) => {
        for (const item of this.allReservationData) {
          this.allActivities = [];
          financeDate = "";
          ndbAnCovivioDate = "";

          // if (item.microservice_customer_id > 0) {

          //     await this.getAllActivitiesData(item.microservice_customer_id);
          // }else{
          //   financeDate=""
          //   ndbAnCovivioDate=""
          // }

          // const activityData = this.allActivities?.filter((activityItem) =>
          //     // item.microservice_customer_id === String(activityItem.address_id) &&
          //     item.real_estates_data[0].real_estate_sys_id === activityItem.real_estate_ids[0]
          // );

          // activityData.forEach(activity=>{
          //   if(activity.kind === "Finanzierungsbestätigung geprüft"){
          //       financeDate = moment(activity.created_at).format("YYYY-MM-DD");
          //   }else if(activity.kind ===  "Kaufvertrag angefordert"){
          //       ndbAnCovivioDate = moment(activity.created_at).format("YYYY-MM-DD");
          //   }
          // })

          const microservice_id = item.microservice_customer_id;
          const customer_kd = item.customer_kdnr;

          const reservationId = item.reservation_id ? item.reservation_id : "";
          const reservationStatus = item.reservation_status
            ? item.reservation_status
            : "";
          const kauferName = item.client_full_name ? item.client_full_name : "";
          const betreuer_1 = item.real_estate_agent
            ? item.real_estate_agent
            : "";
          const betreuer_2 = item.secondary_real_estate_agent
            ? item.secondary_real_estate_agent
            : "";
          const ndbAnCovivio = ndbAnCovivioDate;
          const kvDataSendToLawyers =
            item.kv_data_send_to_lawyers &&
            moment(item.kv_data_send_to_lawyers).isValid()
              ? moment(item.kv_data_send_to_lawyers).format("YYYY-MM-DD")
              : item.kv_data_send_to_lawyers === "0000-00-00 00:00:00"
              ? ""
              : "";
          const kvDataSendFromLawyersToBerlin =
            item.kv_data_send_from_lawyers_to_berlin === "0000-00-00 00:00:00"
              ? ""
              : item.kv_data_send_from_lawyers_to_berlin &&
                moment(item.kv_data_send_from_lawyers_to_berlin).isValid()
              ? moment(item.kv_data_send_from_lawyers_to_berlin).format(
                  "YYYY-MM-DD"
                )
              : "";
          const kvCountdownStart =
            item.kv_countdown_start === "0000-00-00 00:00:00"
              ? ""
              : item.kv_countdown_start &&
                moment(item.kv_countdown_start).isValid()
              ? moment(item.kv_countdown_start).format("YYYY-MM-DD")
              : "";
          const kvNotarterminDate =
            item.kv_notartermin_date === "0000-00-00 00:00:00"
              ? ""
              : item.kv_notartermin_date &&
                moment(item.kv_notartermin_date).isValid()
              ? moment(item.kv_notartermin_date).format("YYYY-MM-DD")
              : "";
          const kvNotarterminTime =
            item.kv_notartermin_date === "0000-00-00 00:00:00"
              ? ""
              : item.kv_notartermin_date &&
                moment(item.kv_notartermin_date).isValid()
              ? moment(item.kv_notartermin_date).format("HH:mm")
              : "";
          const nationality =
            item?.ndb_formular_data?.formDataCustomers?.customerOne?.fields
              ?.nationality?.value ?? "";
          const financeProcess = "";
          const kvSignedByCovivio =
            item.kv_signed_by_covivio === "0000-00-00 00:00:00"
              ? ""
              : item.kv_signed_by_covivio &&
                moment(item.kv_signed_by_covivio).isValid()
              ? moment(item.kv_signed_by_covivio).format("YYYY-MM-DD")
              : "";

          // const vertragsentwurfvNotarVerschickt = item.kv_process >= 2 ? "Ja" : "Nein";
          const realEstateData = item.real_estates_data;
          const verkauftData = item.verkaufsmeldung;
          const gwgData = item.gwgs;
          let gwgExternal;
          let gwgInternal;

          if (gwgData !== null) {
            const filteredGwgData = gwgData.filter(
              (item) => item.reservation_id == reservationId
            );

            if (filteredGwgData.length > 0) {
              const gwgInternProcess = item.gwgintern_process
                ? item.gwgintern_process
                : "";
              const gwgExternalProcess = filteredGwgData[0]?.gwg_status
                ? filteredGwgData[0].gwg_status
                : "";
              gwgExternal = gwgExternalProcess == 3 ? "Ja" : "Nein";
              gwgInternal = gwgInternProcess == 2 ? "Ja" : "Nein";
            } else {
              gwgExternal = "Nein";
              gwgInternal = "Nein";
            }
          } else {
            gwgExternal = "Nein";
            gwgInternal = "Nein";
          }

          if (realEstateData <= 0) {
            continue;
          }

          realEstateData.forEach((realEstateItem) => {
              const immoNr = realEstateItem.estate_nr;
              const unitId = realEstateItem.real_estate_sys_id;

              const projectAndUnitArray = immoNr.split("-");
              const reservationDate = realEstateItem.create_date
                ? moment(realEstateItem.create_date).format("YYYY-MM-DD")
                : "";
              const commissionApprovedValue =
                realEstateItem.commission_approved_value
                  ? realEstateItem.commission_approved_value
                  : "";
              const reservationPrice = this.formatPrice(
                realEstateItem.estate_price
              );
              const reservationFeeEntrance = this.formatPrice(
                realEstateItem.estate_fee
              );
              let kaufpreisKVEntwurf;
              const filteredVerkauftData = verkauftData?.filter(
                (item) => item.real_estate_nr == immoNr
              );
              if (filteredVerkauftData > 0) {
                kaufpreisKVEntwurf = filteredVerkauftData[0].saleprice
                  ? filteredVerkauftData[0].saleprice
                  : "";
              }
              const cancellationReason = realEstateItem.cancellation_reason;
              const cancellation_status = realEstateItem.cancellation;

              const reservationData = [
                {
                  field_name: "RID",
                  value: reservationId,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "projekt",
                  value: projectAndUnitArray[0],
                  unit_id: unitId,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "einheit",
                  value: projectAndUnitArray[1],
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Name_Kaeufer",
                  value: kauferName,
                  field_type: "text",
                  company: item.company,
                  customer_kdnr: customer_kd,
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Betreuer_1",
                  value: betreuer_1,
                  field_type: "singleSelect",
                  options: this.generateRealEstateOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Betreuer_2",
                  value: betreuer_2,
                  field_type: "singleSelect",
                  options: this.generateRealEstateOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Kaufpreis_Reservierung",
                  value: reservationPrice,
                  field_type: "price",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Reservierung_Datum",
                  value: reservationDate,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Reservierungsgebuehr_Eingang",
                  value: reservationFeeEntrance,
                  field_type: "price",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "NDB_an_Covivio",
                  value: "",
                  microservice_id: microservice_id,
                  realEstateId: item.real_estates_data[0].real_estate_sys_id,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "NDB_von_Covivio_an_Essen",
                  value: kvDataSendToLawyers,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "NDB_von_an_Berlin",
                  value: kvDataSendFromLawyersToBerlin,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Kaufpreis_KV_Entwurf",
                  value: "",
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "14_Tage_Countdown",
                  value: kvCountdownStart,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                // {
                //   field_name: "Beurkundungs_faehig",
                //   value: kvCountdownStart,
                //   field_type: "date",
                //   editable: true,
                //   edited: false,
                // },
                {
                  field_name: "Notartermin_Datum",
                  value: kvNotarterminDate,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Notartermin_Uhrzeit",
                  value: kvNotarterminTime,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Herkunft_Erwerber",
                  value: nationality,
                  field_type: "singleSelect",
                  options: this.generateNationalityOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Finanzierung",
                  value: "",
                  microservice_id: microservice_id,
                  realEstateId: item.real_estates_data[0].real_estate_sys_id,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Bemerkungen",
                  value: "",
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Nutzung_nach_Kauf",
                  value: "",
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Provision",
                  value: commissionApprovedValue,
                  field_type: "number",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Annahme",
                  value: kvSignedByCovivio,
                  field_type: "singleSelect",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "GWG-Extern",
                  value: gwgExternal,
                  field_type: "checkbox",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "GWG-Intern",
                  value: gwgInternal,
                  field_type: "checkbox",
                  editable: false,
                  edited: false,
                },
              ];

              const cancelData = [
                {
                  field_name: "RID",
                  value: reservationId,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "projekt",
                  value: projectAndUnitArray[0],
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "einheit",
                  value: projectAndUnitArray[1],
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Name_Kaeufer",
                  value: kauferName,
                  field_type: "text",
                  company: item.company,
                  customer_kdnr: customer_kd,
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Betreuer_1",
                  value: betreuer_1,
                  field_type: "singleSelect",
                  options: this.generateRealEstateOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Betreuer_2",
                  value: betreuer_2,
                  field_type: "singleSelect",
                  options: this.generateRealEstateOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Kaufpreis_Reservierung",
                  value: reservationPrice,
                  field_type: "price",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Reservierung_Datum",
                  value: reservationDate,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Reservierungsgebuehr_Eingang",
                  value: reservationFeeEntrance,
                  field_type: "price",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "NDB_an_Covivio",
                  value: "",
                  microservice_id: microservice_id,
                  realEstateId: item.real_estates_data[0].real_estate_sys_id,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "NDB_von_Covivio_an_Essen",
                  value: kvDataSendToLawyers,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "NDB_von_an_Berlin",
                  value: kvDataSendFromLawyersToBerlin,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Kaufpreis_KV_Entwurf",
                  value: "",
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "14_Tage_Countdown",
                  value: kvCountdownStart,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                // {
                //   field_name: "Beurkundungs_faehig",
                //   value: kvCountdownStart,
                //   field_type: "date",
                //   editable: true,
                //   edited: false,
                // },
                {
                  field_name: "Notartermin_Datum",
                  value: kvNotarterminDate,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Notartermin_Uhrzeit",
                  value: kvNotarterminTime,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Herkunft_Erwerber",
                  value: nationality,
                  field_type: "singleSelect",
                  options: this.generateNationalityOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Finanzierung",
                  value: "",
                  microservice_id: microservice_id,
                  realEstateId: item.real_estates_data[0].real_estate_sys_id,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Grund der Absage",
                  value: cancellationReason,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Nutzung_nach_Kauf",
                  value: "",
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Provision",
                  value: commissionApprovedValue,
                  field_type: "number",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Annahme",
                  value: kvSignedByCovivio,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "GWG-Extern",
                  value: gwgExternal,
                  field_type: "checkbox",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "GWG-Intern",
                  value: gwgInternal,
                  field_type: "checkbox",
                  editable: false,
                  edited: false,
                },
              ];

              const soldData = [
                {
                  field_name: "RID",
                  value: reservationId,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "projekt",
                  value: projectAndUnitArray[0],
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "einheit",
                  value: projectAndUnitArray[1],
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Name_Kaeufer",
                  value: kauferName,
                  field_type: "text",
                  company: item.company,
                  customer_kdnr: customer_kd,
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Betreuer_1",
                  value: betreuer_1,
                  field_type: "singleSelect",
                  options: this.generateRealEstateOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Betreuer_2",
                  value: betreuer_2,
                  field_type: "singleSelect",
                  options: this.generateRealEstateOptions(),
                  editable: true,
                  edited: false,
                },
                {
                  field_name: "Reservierung_Datum",
                  value: reservationDate,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Reservierungsgebuehr_Eingang",
                  value: reservationFeeEntrance,
                  field_type: "price",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Kaufpreis_KV_Entwurf",
                  value: kaufpreisKVEntwurf,
                  field_type: "price",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "14_Tage_Countdown",
                  value: kvCountdownStart,
                  field_type: "date",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Notartermin_Datum",
                  value: kvNotarterminDate,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Notartermin_Uhrzeit",
                  value: kvNotarterminTime,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Nutzung_nach_Kauf",
                  value: null,
                  field_type: "text",
                  editable: false,
                  edited: false,
                },
                {
                  field_name: "Provision",
                  value: commissionApprovedValue,
                  field_type: "number",
                  editable: false,
                  edited: false,
                },
              ];

              // if (
              //   (verkauftData.length === 0 || verkauftData <= 0) &&
              //   cancellation_status === "0"
              // ) {
              //   this.reservationTableData.push(reservationData);
              // } else if (
              //   (verkauftData.length === 0 || verkauftData <= 0) &&
              //   cancellation_status === "1"
              // ) {
              //   this.cancellationTableData.push(cancelData);
              // } else if (
              //   (verkauftData.length > 0 || verkauftData > 0) &&
              //   cancellation_status === "1"
              // ) {
              //   this.cancellationTableData.push(cancelData);
              // } else if (
              //   (verkauftData.length > 0 || verkauftData > 0) &&
              //   cancellation_status === "0"
              // ) {
              //   this.soldTableData.push(soldData);
              // }

              if (reservationStatus === "-2") {
                this.cancellationTableData.push(cancelData);
              } else if (
                kvSignedByCovivio !== "undefined" &&
                kvSignedByCovivio !== "" &&
                kvSignedByCovivio !== null &&
                cancellation_status === "0"
              ) {
                this.soldTableData.push(soldData);
              } else if (cancellation_status === "1") {
                this.cancellationTableData.push(cancelData);
              } else if (
                reservationStatus !== "-2" &&
                (kvSignedByCovivio === "" || kvSignedByCovivio === null)
              ) {
                this.reservationTableData.push(reservationData);
              }
          });
        }

        // );
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        this.isLoading = false;
        this.isTableDataLoading = false;
        // this.updateActivities();
      }
    },

    async updateActivities() {
      this.isActivityLoading = true;

      try {
        // Update reservation activities
        for (const reservationItem of this.reservationTableData) {
          for (const item of reservationItem) {
            if (
              item.field_name === "NDB_an_Covivio" ||
              item.field_name === "Finanzierung"
            ) {
              const microserviceCustomerId = item.microservice_id;
              if (microserviceCustomerId > 0) {
                await this.getAllActivitiesData(microserviceCustomerId);
              } else {
                item.value = "";
              }

              const activityData = this.allActivities?.filter(
                (activityItem) =>
                  item.realEstateId === activityItem.real_estate_ids[0]
              );

              activityData.forEach((activity) => {
                if (
                  activity.kind === "Finanzierungsbestätigung geprüft" &&
                  item.field_name === "Finanzierung"
                ) {
                  item.value = moment(activity.created_at).format("YYYY-MM-DD");
                } else if (
                  activity.kind === "Kaufvertrag angefordert" &&
                  item.field_name === "NDB_an_Covivio"
                ) {
                  item.value = moment(activity.created_at).format("YYYY-MM-DD");
                }
              });
            }
          }
        }

        // Update cancellation activities
        for (const cancelationItem of this.cancellationTableData) {
          for (const item of cancelationItem) {
            if (
              item.field_name === "NDB_an_Covivio" ||
              item.field_name === "Finanzierung"
            ) {
              const microserviceCustomerId = item.microservice_id;
              if (microserviceCustomerId > 0) {
                await this.getAllActivitiesData(microserviceCustomerId);
              } else {
                item.value = "";
              }

              const activityData = this.allActivities?.filter(
                (activityItem) =>
                  item.realEstateId === activityItem.real_estate_ids[0]
              );

              activityData.forEach((activity) => {
                if (
                  activity.kind === "Finanzierungsbestätigung geprüft" &&
                  item.field_name === "Finanzierung"
                ) {
                  item.value = moment(activity.created_at).format("YYYY-MM-DD");
                } else if (
                  activity.kind === "Kaufvertrag angefordert" &&
                  item.field_name === "NDB_an_Covivio"
                ) {
                  item.value = moment(activity.created_at).format("YYYY-MM-DD");
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error updating activities:", error);
      } finally {
        this.isActivityLoading = false;
      }
    },

    async getAllActivitiesData(customerId) {
      try {
        const response = await axios.request({
          method: "POST",
          url: "https://ms.p.bestplace.tools/api/activities/selection",
          headers: {
            Authorization: `Bearer 3|pGahIEjwXEMWYr6QqwaP1c0OneTJEqLV6qxx2Cfs`,
          },
          data: {
            data: {
              microserice_address_id: customerId,
              activities: [
                "Kaufvertrag angefordert",
                "Finanzierungsbestätigung geprüft",
              ],
            },
          },
        });

        if (response && response.status === 200) {
          this.allActivities = response.data;
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        // this.isLoading = false;
      }
    },

    editButtonHandler() {
      this.editable = this.editable ? false : true;

      this.reservationTableData.forEach((row) => {
        row.forEach((item) => {
          if (
            item.field_name === "Betreuer_1" ||
            item.field_name === "Betreuer_2"
          ) {
            item.options = this.generateRealEstateOptions();
          }
        });
      });

      this.cancellationTableData.forEach((row) => {
        row.forEach((item) => {
          if (
            item.field_name === "Betreuer_1" ||
            item.field_name === "Betreuer_2"
          ) {
            item.options = this.generateRealEstateOptions();
          }
        });
      });

      this.soldTableData.forEach((row) => {
        row.forEach((item) => {
          if (
            item.field_name === "Betreuer_1" ||
            item.field_name === "Betreuer_2"
          ) {
            item.options = this.generateRealEstateOptions();
          }
        });
      });
    },

    openCreateReservation() {
      this.showCreateViewModal = this.showCreateViewModal ? false : true;
    },

    openActivityDetailsModal(emitData) {
      this.showActivityDetailsModal = this.showCreateViewModal ? false : true;
      this.selectedRIDItemTableData = emitData;
      const reservationId = emitData.find(
        (item) => item.field_name === "RID"
      )?.value;
      const filterdatafromAllReservations = this.allReservationData.find(
        (res) => res.reservation_id === reservationId
      );
      this.selectedRIDItemAllData = filterdatafromAllReservations;
    },

    closeCreateViewModal() {
      this.showCreateViewModal = false;
      this.resetAll();
    },

    closeActivityDetailsModal() {
      this.showActivityDetailsModal = false;
    },

    confirmationSave() {
      Swal.fire({
        title: "Warnung",
        text: "Wollen Sie die Änderungen speichern?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ja",
        cancelButtonText: "Nein",
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveButtonHandler();
        } else if (result.isDenied) {
          Swal.fire("Warnung", "Änderungen nicht gespeichert", "info");
        }
      });
    },

    async saveButtonHandler() {
      this.editable = this.editable ? false : true;
      let editedItems = [];

      editedItems = [
        ...editedItems,
        ...this.reservationTableData.filter((item) =>
          item.some((field) => field.edited === true)
        ),
        ...this.cancellationTableData.filter((item) =>
          item.some((field) => field.edited === true)
        ),
        ...this.soldTableData.filter((item) =>
          item.some((field) => field.edited === true)
        ),
      ];

      const updateReservationData = editedItems.map((item) => {
        const allReservationItem = this.allReservationData.find(
          (res) => res.reservation_id === item[0].value
        );

        const updateNdbData = allReservationItem?.ndb_formular_data
          ? {
              ...allReservationItem.ndb_formular_data,
              formDataCustomers: allReservationItem.ndb_formular_data
                ?.formDataCustomers
                ? {
                    ...allReservationItem.ndb_formular_data.formDataCustomers,
                    customerOne: allReservationItem.ndb_formular_data
                      .formDataCustomers?.customerOne
                      ? {
                          ...allReservationItem.ndb_formular_data
                            .formDataCustomers.customerOne,
                          fields: {
                            ...allReservationItem.ndb_formular_data
                              .formDataCustomers.customerOne.fields,
                            nationality: {
                              required: true,
                              value: item.find(
                                (field) =>
                                  field.field_name === "Herkunft_Erwerber"
                              )?.value,
                              valueType: "text",
                              valid: true,
                              label: {
                                de: "Nationalität",
                                en: "Nationality",
                              },
                            },
                          },
                        }
                      : null,
                  }
                : null,
            }
          : null;

        return {
          reservation_id: item.find((field) => field.field_name === "RID")
            .value,
          reservation_status: allReservationItem.reservation_status,
          client_full_name: allReservationItem.client_full_name,
          real_estate_agent: item.find(
            (field) => field.field_name === "Betreuer_1"
          )?.value,
          secondary_real_estate_agent: item.find(
            (field) => field.field_name === "Betreuer_2"
          )?.value,
          create_date: allReservationItem.create_date,
          customer_kdnr: allReservationItem.customer_kdnr,
          modified_date: allReservationItem.modified_date,
          company: allReservationItem.company,
          kv_process: allReservationItem.kv_process,
          kv_notartermin_date: allReservationItem.kv_notartermin_date,
          kv_notartermin_city: allReservationItem.kv_notartermin_city,
          kv_data_send_to_lawyers: allReservationItem.kv_data_send_to_lawyers,
          kv_data_send_from_lawyers_to_berlin:
            allReservationItem.kv_data_send_from_lawyers_to_berlin,
          finance_process: allReservationItem.finance_process,
          ndb_formular_data: updateNdbData,
          kv_countdown_start:
            item.find((field) => field.field_name === "14_Tage_Countdown")
              .value + " 00:00:00",
          kv_signed_by_covivio: allReservationItem.kv_signed_by_covivio,
          gwgex_process: allReservationItem.gwgex_process,
          gwgintern_process: allReservationItem.gwgintern_process,
          reservation_type: allReservationItem.reservation_type,
          real_estates_data: allReservationItem.real_estates_data.map(
            (realEstate) => ({
              id: realEstate.id,
              reservation_id: realEstate.reservation_id,
              create_date: realEstate.create_date,
              estate_nr: realEstate.estate_nr,
              estate_price: realEstate.estate_price,
              estate_fee: realEstate.estate_fee,
              estate_ini_oo_fee: realEstate.estate_ini_oo_fee,
              modified_date: realEstate.modified_date,
              cancellation_reason: realEstate.cancellation_reason,
              cancellation: realEstate.cancellation,
              estate_typ: realEstate.estate_typ,
              real_estate_agent: item.find(
                (field) => field.field_name === "Betreuer_1"
              ).value,
              real_estate_sys_id: realEstate.real_estate_sys_id,
              realestate_notartermin: realEstate.realestate_notartermin,
              discount_process: realEstate.discount_process,
              discount_requested_value: realEstate.discount_requested_value,
              discount_reason: realEstate.discount_reason,
              discount_file: realEstate.discount_file,
              discount_history: realEstate.discount_history,
              discount_approved_history: realEstate.discount_approved_history,
              discount_approved_value: realEstate.discount_approved_value,
              estate_rent: realEstate.estate_rent,
              commission_process: realEstate.commission_process,
              commission_requested_value: realEstate.commission_requested_value,
              commission_approved_value: realEstate.commission_approved_value,
              commission_value: realEstate.commission_value,
            })
          ),
          gwgs: allReservationItem.gwgs ? allReservationItem.gwgs : [],
          verkaufsmeldung: allReservationItem.verkaufsmeldung,
        };
      });

      try {
        // this.isLoading = true;
        // this.loadingText = 'Aktualisierung der Projektdaten! Bitte warten';
        const requests = updateReservationData.map(async (data) => {
          const options = {
            method: "POST",
            url:
              this.globalApiBaseUrl +
              "/reservations/createUpdateReservationKPL",
            data: data,
          };
          try {
            const response = await axios.request(options);
            let status = response.data.status;
            let message = response.data.message;

            if (!status) {
              return;
            }
            return true;
          } catch (error) {
            console.error("Error:", error);
            return false;
          }
        });

        const results = await Promise.all(requests);
        this.loading = false;
        if (results.every((result) => result)) {
          await Swal.fire("Success", "All updates were successful!", "success");

          if (this.monthInputModal === "Alle") {
            this.getAllReportData(this.selectedYears, ["January", "December"]);
          } else {
            this.getAllReportData(this.selectedYears, [this.monthInputModal]);
          }
        } else {
          Swal.fire("Error", "Some updates failed, please try again.", "error");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    confirmationClear() {
      Swal.fire({
        title: "Warnung",
        text: "Möchten Sie abreisen?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ja",
        cancelButtonText: "Nein",
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetAll();
        } else if (result.isDenied) {
          Swal.fire("Warnung", "Unbekannter fehler", "info");
        }
      });
    },

    loadYears() {
      this.years = [];
      const currentYear = new Date().getFullYear();

      const range = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step + 1 },
          (_, i) => start + i * step
        );

      const yearRange = range(currentYear, currentYear - 5, -1);

      this.years = yearRange.map((year, index) => {
        return {
          title: year.toString(),
          value: year,
          selected: year === currentYear,
        };
      });
    },

    loadMonths() {
      this.months = [];
      const currentMonth = moment().format("MMMM");
      const monthRange = Array.from({ length: 12 }, (_, i) =>
        new Date(2024, i).toLocaleString("en-US", { month: "long" })
      );
      this.months = [
        { title: "Alle", value: "all", selected: false },
        ...monthRange.map((month) => ({
          title: month,
          value: month,
          selected: month === currentMonth,
        })),
      ];
    },

    editExistingCells(event, data, rowIndex, colIndex) {
      if (data.field_type == "number") {
        const formattedValue = event.target.value;

        if (this.isReservedClicked && this.reservationTableData) {
          if (
            this.reservationTableData[rowIndex] &&
            this.reservationTableData[rowIndex][colIndex]
          ) {
            this.reservationTableData[rowIndex][colIndex].value =
              formattedValue;
            this.reservationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isCanceledClicked && this.cancellationTableData) {
          if (
            this.cancellationTableData[rowIndex] &&
            this.cancellationTableData[rowIndex][colIndex]
          ) {
            this.cancellationTableData[rowIndex][colIndex].value =
              formattedValue;
            this.cancellationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isSoldClicked && this.soldTableData) {
          if (
            this.soldTableData[rowIndex] &&
            this.soldTableData[rowIndex][colIndex]
          ) {
            this.soldTableData[rowIndex][colIndex].value = formattedValue;
            this.soldTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        }

        return;
      }

      if (data.field_type == "price") {
        const formattedValue = event.target.value;

        if (this.isReservedClicked && this.reservationTableData) {
          if (
            this.reservationTableData[rowIndex] &&
            this.reservationTableData[rowIndex][colIndex]
          ) {
            this.reservationTableData[rowIndex][colIndex].value =
              formattedValue;
            this.reservationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isCanceledClicked && this.cancellationTableData) {
          if (
            this.cancellationTableData[rowIndex] &&
            this.cancellationTableData[rowIndex][colIndex]
          ) {
            this.cancellationTableData[rowIndex][colIndex].value =
              formattedValue;
            this.cancellationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isSoldClicked && this.soldTableData) {
          if (
            this.soldTableData[rowIndex] &&
            this.soldTableData[rowIndex][colIndex]
          ) {
            this.soldTableData[rowIndex][colIndex].value = formattedValue;
            this.soldTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        }

        return;
      }

      if (data.field_type == "singleSelect" && data.options) {
        let newValue = event.selection_value;

        if (this.isReservedClicked && this.reservationTableData) {
          if (
            this.reservationTableData[rowIndex] &&
            this.reservationTableData[rowIndex][colIndex]
          ) {
            this.reservationTableData[rowIndex][colIndex].value = newValue;
            this.reservationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isCanceledClicked && this.cancellationTableData) {
          if (
            this.cancellationTableData[rowIndex] &&
            this.cancellationTableData[rowIndex][colIndex]
          ) {
            this.cancellationTableData[rowIndex][colIndex].value = newValue;
            this.cancellationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isSoldClicked && this.soldTableData) {
          if (
            this.soldTableData[rowIndex] &&
            this.soldTableData[rowIndex][colIndex]
          ) {
            this.soldTableData[rowIndex][colIndex].value = newValue;
            this.soldTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        }

        return;
      }

      if (data.field_type == "multiSelect" && data.options) {
        let newValue = event.selected_values;

        if (this.isReservedClicked && this.reservationTableData) {
          if (
            this.reservationTableData[rowIndex] &&
            this.reservationTableData[rowIndex][colIndex]
          ) {
            this.reservationTableData[rowIndex][colIndex].value = newValue;
            this.reservationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isCanceledClicked && this.cancellationTableData) {
          if (
            this.cancellationTableData[rowIndex] &&
            this.cancellationTableData[rowIndex][colIndex]
          ) {
            this.cancellationTableData[rowIndex][colIndex].value = newValue;
            this.cancellationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isSoldClicked && this.soldTableData) {
          if (
            this.soldTableData[rowIndex] &&
            this.soldTableData[rowIndex][colIndex]
          ) {
            this.soldTableData[rowIndex][colIndex].value = newValue;
            this.soldTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        }

        return;
      }

      if (data.field_type == "checkbox") {
        let newValue = event.target.checked;
        let formattedValue = newValue ? "Ja" : "Nein";

        if (this.isReservedClicked && this.reservationTableData) {
          if (
            this.reservationTableData[rowIndex] &&
            this.reservationTableData[rowIndex][colIndex]
          ) {
            this.reservationTableData[rowIndex][colIndex].value =
              formattedValue;
            this.reservationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isCanceledClicked && this.cancellationTableData) {
          if (
            this.cancellationTableData[rowIndex] &&
            this.cancellationTableData[rowIndex][colIndex]
          ) {
            this.cancellationTableData[rowIndex][colIndex].value =
              formattedValue;
            this.cancellationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isSoldClicked && this.soldTableData) {
          if (
            this.soldTableData[rowIndex] &&
            this.soldTableData[rowIndex][colIndex]
          ) {
            this.soldTableData[rowIndex][colIndex].value = formattedValue;
            this.soldTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        }

        return;
      }

      if (data.field_type == "date") {
        let newValue = event.target.value;

        if (this.isReservedClicked && this.reservationTableData) {
          if (
            this.reservationTableData[rowIndex] &&
            this.reservationTableData[rowIndex][colIndex]
          ) {
            this.reservationTableData[rowIndex][colIndex].value = newValue;
            this.reservationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isCanceledClicked && this.cancellationTableData) {
          if (
            this.cancellationTableData[rowIndex] &&
            this.cancellationTableData[rowIndex][colIndex]
          ) {
            this.cancellationTableData[rowIndex][colIndex].value = newValue;
            this.cancellationTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        } else if (this.isSoldClicked && this.soldTableData) {
          if (
            this.soldTableData[rowIndex] &&
            this.soldTableData[rowIndex][colIndex]
          ) {
            this.soldTableData[rowIndex][colIndex].value = newValue;
            this.soldTableData[rowIndex][colIndex].edited = true;
          } else {
            return;
          }
        }

        return;
      }

      return;
    },

    getRelatedValueOnlyEdit(data) {
      if (data.field_types == "number" && data.value) {
        data.value;
      }

      if (data.field_type == "price" && data.value) {
        return data.value;
      }
      if (data.field_type == "singleSelect" && data.options) {
        var options = data.options;

        if (options.length <= 0) {
          return data.value;
        }

        for (let index = 0; index < options.length; index++) {
          let item = options[index];
          if (item.selection_value == data.value) {
            let selectionValue = item.selection_label || item.selection_value;
            return selectionValue;
          }
        }

        return "";
      }
      if (data.field_type == "checkbox") {
        if (data.value == null || data.value == "") {
          return false;
        }

        return data.value == "Nein" ? false : true;
      }
      if (data.field_type == "date") {
        if (
          data.value == null ||
          data.value == "" ||
          data.value == "0000-00-00"
        ) {
          return "";
        }

        // // ' Mietbeginn ' field returns date values with .
        // // so we have to condition and format that value as date
        // if (data.value.includes('.')) {
        //     let dateArray = data.value.split('.');

        //     let newDate = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];

        //     let formattedValue = moment(newDate).format('YYYY-MM-DD')

        //     return formattedValue;
        // }
        // // end

        let formattedValue = moment(data.value).format("YYYY-MM-DD");
        return formattedValue;
      }

      return data.value;
    },

    showReservedData() {
      this.headers = this.reservationHeader;
      this.isReservedClicked = true;
      this.isCanceledClicked = false;
      this.isSoldClicked = false;
    },

    showCanceledData() {
      this.headers = this.cancelHeader;
      this.isCanceledClicked = true;
      this.isSoldClicked = false;
      this.isReservedClicked = false;
    },

    showSoldData() {
      this.headers = this.soldHeader;
      this.isSoldClicked = true;
      this.isReservedClicked = false;
      this.isCanceledClicked = false;
    },

    resetAllTableData() {
      this.reservationTableData = [];
      this.cancellationTableData = [];
      this.soldTableData = [];
    },

    noDataFoundWarningAlert() {
      Swal.fire(
        "Warnung",
        "Es wurden keine Daten für die ausgewählten Filter gefunden. Bitte versuchen Sie es erneut!",
        "warning"
      ).then((result) => {
        if (result.isConfirmed) {
          return;
        }
      });
    },

    async getAllAgents() {
      this.isLoading = true;
      const storeRL = agentsStoreRL();
      try {
        const response = await axios.get(
          this.globalApiBaseUrl + "/onoffice/getAllUsersByCompany?company=all"
        );

        if (response.data.status === 200) {
          storeRL.setAllAgentsRL(response.data.response);
          this.mapAllRealAgentsData(storeRL.getAllAgentsRL);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadConfigData() {
      this.clearDropdownsOnReset = false;

      this.loadYears();
      this.loadMonths();
      const currentYear = moment().year();
      const currentMonth = moment().format("MMMM");
      this.yearInputModal = currentYear.toString();
      this.monthInputModal = currentMonth;
      // this.getAllActivitiesData([this.yearInputModal], [this.monthInputModal]);

      this.preSelectedYear = {
        title: this.yearInputModal,
        value: currentYear,
        selected: true,
      };
      // this.getAllReportData([this.yearInputModal], [this.monthInputModal]);
    },
  },

  mounted() {
    this.getAllAgents();
    this.loadConfigData();
    this.showReservedData();
  },

  created() {
    const storeRL = agentsStoreRL();
    if (storeRL.allAgentsData.length === 0) {
      this.mapAllRealAgentsData(storeRL.getAllAgentsRL);
    }
  },

  computed: {
    realEstateOptions() {
      return [...this.realEstateAgents];
    },
  },
};
</script>

<template>
  <div class="reservation-list">
    <div class="rl-top-action-section">
      <div class="rl-button-container">
        <button
          class="rl-button"
          :class="{ clicked: isReservedClicked }"
          @click="showReservedData"
        >
          Reserviert
        </button>
        <button
          class="rl-button"
          :class="{ clicked: isCanceledClicked }"
          @click="showCanceledData"
        >
          Storniert
        </button>
        <button
          class="rl-button"
          :class="{ clicked: isSoldClicked }"
          @click="showSoldData"
        >
          Verkauft
        </button>
      </div>

      <div class="rl-edit-container">
        <div style="align-items: center">
          <button class="rl-create-button" @click="openCreateReservation">
            <AddTableImage style="width: 13px; height: 13px" />
            <span style="padding-right: 8px"></span>
            Neue Reservierung
          </button>
        </div>

        <div v-if="!editable" style="align-items: center; padding-left: 12px">
          <button class="rl-edit-fill-button" @click="editButtonHandler">
            <EditTableImage style="width: 13px; height: 13px" />
            <span style="padding-right: 8px"></span>
            Bearbeiten
          </button>
        </div>

        <div v-else style="align-items: center; padding-left: 12px">
          <button class="rl-save-fill-button" @click="confirmationSave">
            <SaveTableImage style="width: 13px; height: 13px" />
            <span style="padding-right: 8px"></span>
            Speichern
          </button>
        </div>

        <div style="align-items: center; padding-left: 12px">
          <button class="rl-edit-fill-button" @click="confirmationClear">
            <ResetIcon style="width: 13px; height: 13px" />
            <span style="padding-right: 8px"></span>
            Ansicht leeren
          </button>
        </div>
      </div>
    </div>

    <div class="rl-table-section">
      <div class="rl-table-title">
        <p>Bestplace Living GmbH - Reservierungen und Notartermine</p>

        <div style="display: flex">
          <div id="main-filter-dropdown-container" style="padding-right: 16px">
            <DropdownField
              placeHolder="Wählen Sie das Jahr"
              :inputModal="yearInputModal"
              :items="years"
              :isMultiSelect="true"
              :preSelectedProject="preSelectedYear"
              :isModal="true"
              :clearOnReset="clearDropdownsOnReset"
              v-on:onDropdownChange="handleChangeByYear"
            />
          </div>

          <div id="main-filter-dropdown-container">
            <DropdownField
              placeHolder="Wählen Sie den Monat"
              :inputModal="monthInputModal"
              :items="months"
              :isMultiSelect="false"
              :isModal="true"
              :clearOnReset="clearDropdownsOnReset"
              v-on:onDropdownChange="handleChangeByMonth"
            />
          </div>

          <div v-if="isTableDataLoading">
            <LoadingTableData />
          </div>
        </div>
      </div>

      <div
        class="rl-table-wrapper"
        style="
          background-color: transparent;
          margin-top: 12px;
          border-radius: 8px 0px 0px 0px;
          overflow-x: scroll;
          height: 82vh;
        "
      >
        <table
          id="table"
          class="rl-table"
          style="border-collapse: collapse; border-spacing: 0"
        >
          <thead>
            <tr>
              <!-- View Only & Editable Headers -->
              <template v-for="(header, index) in headers" :key="index">
                <template v-if="header.name == 'RID'">
                  <th
                    class="rl-stickey-table-header-col-0"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
                <template v-else-if="header.name == 'Projekt'">
                  <th
                    class="rl-stickey-table-header-col-1"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
                <template v-else-if="header.name == 'Einheit'">
                  <th
                    class="rl-stickey-table-header-col-2"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
                <template v-else-if="header.name == 'Betreuer 1' && editable">
                  <th
                    v-tooltip="'Betreuer 1'"
                    class="rl-viewing-table-header"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
                <template v-else-if="header.name == 'Betreuer 2' && editable">
                  <th
                    v-tooltip="'Betreuer 2'"
                    class="rl-viewing-table-header"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
                <template
                  v-else-if="header.name == '14 Tage Countdown' && editable"
                >
                  <th
                    v-tooltip="'14 Tage Countdown'"
                    class="rl-viewing-table-header"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
                <template
                  v-else-if="
                    header.name == 'NDB an Covivio' ||
                    header.name == 'Finanzierung'
                  "
                >
                  <th
                    class="rl-viewing-table-header"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    <span>{{ header.name }}</span>
                    <span
                      v-if="isActivityLoading"
                      class="loading-spinner"
                      style="margin-left: 5px"
                    ></span>
                  </th>
                </template>
                <template v-else>
                  <th
                    class="rl-viewing-table-header"
                    style="border-bottom: 1pt solid #dedede"
                  >
                    {{ header.name }}
                  </th>
                </template>
              </template>
            </tr>
          </thead>

          <!--Editable Reservation table data -->

          <template v-if="editable">
            <template v-if="isReservedClicked">
              <tbody>
                <div v-if="this.isLoading">
                  <Loading :loadingText="loadingText" />
                </div>

                <template
                  v-for="(row, rowIndex) in reservationTableData"
                  :key="rowIndex"
                >
                  <tr>
                    <template v-for="(item, colIndex) in row" :key="colIndex">
                      <template v-if="item.editable == false">
                        <template v-if="item.field_name === 'RID'">
                          <td class="rl-editable-sticky-table-data">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else-if="item.field_name === 'projekt'">
                          <td class="rl-editable-sticky-table-data-col-1">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else-if="item.field_name === 'einheit'">
                          <td class="rl-editable-sticky-table-data-col-2">
                            {{ item.value }}
                          </td>
                        </template>
                        <template
                          v-else-if="item.field_name === 'NDB_an_Covivio'"
                        >
                          <td
                            :class="
                              isActivityLoading
                                ? 'loading-skeleton'
                                : 'rl-viewing-table-data'
                            "
                          >
                            <template v-if="isActivityLoading"></template>
                            <template v-else>
                              {{ item.value }}
                            </template>
                          </td>
                        </template>
                        <template
                          v-else-if="item.field_name === 'Finanzierung'"
                        >
                          <td
                            :class="
                              isActivityLoading
                                ? 'loading-skeleton'
                                : 'rl-viewing-table-data'
                            "
                          >
                            <template v-if="isActivityLoading"> </template>
                            <template v-else>
                              {{ item.value }}
                            </template>
                          </td>
                        </template>
                        <template v-else>
                          <template v-if="item.field_type === 'checkbox'">
                            <td class="rl-editable-table-data">
                              <input
                                type="checkbox"
                                disabled
                                :checked="getRelatedValueOnlyEdit(item)"
                              />
                            </td>
                          </template>
                          <template v-else>
                            <td class="rl-editable-table-data">
                              {{ item.value }}
                            </td>
                          </template>
                        </template>
                      </template>

                      <template v-else>
                        <td>
                          <div
                            class="rl-editable-div"
                            :class="{ 'rl-edited-div': item.edited }"
                          >
                            <template v-if="item.field_type == 'number'">
                              <input
                                class="rl-editable-input-table-data"
                                type="number"
                                @input="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-if="item.field_type == 'price'">
                              <input
                                class="rl-editable-input-table-data"
                                type="price"
                                @input="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-else-if="item.field_type == 'checkbox'">
                              <input
                                class="rl-editable-input-table-data"
                                type="checkbox"
                                @change="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :checked="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-else-if="item.field_type == 'date'">
                              <input
                                class="rl-editable-input-table-data"
                                type="date"
                                @change="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template
                              v-else-if="item.field_type == 'singleSelect'"
                            >
                              <TableDropdownField
                                :placeHolder="getRelatedValueOnlyEdit(item)"
                                :items="item?.options"
                                :isMultiSelect="false"
                                :isModal="false"
                                :clearOnReset="false"
                                v-on:onDropdownChange="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                              />
                            </template>
                          </div>
                        </td>
                      </template>
                    </template>
                  </tr>
                  <template v-if="rowIndex == reservationTableData.length - 1">
                    <tr>
                      <td style="height: 170px"></td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </template>

            <!--Editable Cancellation table data -->
            <template v-if="isCanceledClicked">
              <tbody>
                <div v-if="this.isLoading">
                  <Loading :loadingText="loadingText" />
                </div>

                <template
                  v-for="(row, rowIndex) in cancellationTableData"
                  :key="rowIndex"
                >
                  <tr>
                    <template v-for="(item, colIndex) in row" :key="colIndex">
                      <template v-if="item.editable == false">
                        <template v-if="item.field_name === 'RID'">
                          <td class="rl-editable-sticky-table-data">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else-if="item.field_name === 'projekt'">
                          <td class="rl-editable-sticky-table-data-col-1">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else-if="item.field_name === 'einheit'">
                          <td class="rl-editable-sticky-table-data-col-2">
                            {{ item.value }}
                          </td>
                        </template>
                        <template
                          v-else-if="item.field_name === 'NDB_an_Covivio'"
                        >
                          <td
                            :class="
                              isActivityLoading
                                ? 'loading-skeleton'
                                : 'rl-viewing-table-data'
                            "
                          >
                            <template v-if="isActivityLoading"></template>
                            <template v-else>
                              {{ item.value }}
                            </template>
                          </td>
                        </template>
                        <template
                          v-else-if="item.field_name === 'Finanzierung'"
                        >
                          <td
                            :class="
                              isActivityLoading
                                ? 'loading-skeleton'
                                : 'rl-viewing-table-data'
                            "
                          >
                            <template v-if="isActivityLoading"> </template>
                            <template v-else>
                              {{ item.value }}
                            </template>
                          </td>
                        </template>
                        <template v-else>
                          <template v-if="item.field_type === 'checkbox'">
                            <td class="rl-editable-table-data">
                              <input
                                type="checkbox"
                                disabled
                                :checked="getRelatedValueOnlyEdit(item)"
                              />
                            </td>
                          </template>
                          <template v-else>
                            <td class="rl-editable-table-data">
                              {{ item.value }}
                            </td>
                          </template>
                        </template>
                      </template>

                      <template v-else>
                        <td>
                          <div
                            class="rl-editable-div"
                            :class="{ 'rl-edited-div': item.edited }"
                          >
                            <template v-if="item.field_type == 'number'">
                              <input
                                class="rl-editable-input-table-data"
                                type="number"
                                @input="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-if="item.field_type == 'price'">
                              <input
                                class="rl-editable-input-table-data"
                                type="price"
                                @input="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-else-if="item.field_type == 'checkbox'">
                              <input
                                class="rl-editable-input-table-data"
                                type="checkbox"
                                @change="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :checked="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-else-if="item.field_type == 'date'">
                              <input
                                class="rl-editable-input-table-data"
                                type="date"
                                @change="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template
                              v-else-if="item.field_type == 'singleSelect'"
                            >
                              <TableDropdownField
                                :placeHolder="getRelatedValueOnlyEdit(item)"
                                :items="item?.options"
                                :isMultiSelect="false"
                                :isModal="false"
                                :clearOnReset="false"
                                v-on:onDropdownChange="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                              />
                            </template>
                          </div>
                        </td>
                      </template>
                    </template>
                  </tr>
                  <template v-if="rowIndex == cancellationTableData.length - 1">
                    <tr>
                      <td style="height: 170px"></td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </template>

            <!--Editable Sold  table data -->
            <template v-if="isSoldClicked">
              <tbody>
                <div v-if="this.isLoading">
                  <Loading :loadingText="loadingText" />
                </div>

                <template
                  v-for="(row, rowIndex) in soldTableData"
                  :key="rowIndex"
                >
                  <tr>
                    <template v-for="(item, colIndex) in row" :key="colIndex">
                      <template v-if="item.editable == false">
                        <template v-if="item.field_name === 'RID'">
                          <td class="rl-editable-sticky-table-data">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else-if="item.field_name === 'projekt'">
                          <td class="rl-editable-sticky-table-data-col-1">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else-if="item.field_name === 'einheit'">
                          <td class="rl-editable-sticky-table-data-col-2">
                            {{ item.value }}
                          </td>
                        </template>
                        <template v-else>
                          <template v-if="item.field_type === 'checkbox'">
                            <td class="rl-editable-table-data">
                              <input
                                type="checkbox"
                                disabled
                                :checked="getRelatedValueOnlyEdit(item)"
                              />
                            </td>
                          </template>
                          <template v-else>
                            <td class="rl-editable-table-data">
                              {{ item.value }}
                            </td>
                          </template>
                        </template>
                      </template>

                      <template v-else>
                        <td>
                          <div
                            class="rl-editable-div"
                            :class="{ 'rl-edited-div': item.edited }"
                          >
                            <template v-if="item.field_type == 'number'">
                              <input
                                class="rl-editable-input-table-data"
                                type="number"
                                @input="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-if="item.field_type == 'price'">
                              <input
                                class="rl-editable-input-table-data"
                                type="price"
                                @input="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-else-if="item.field_type == 'checkbox'">
                              <input
                                class="rl-editable-input-table-data"
                                type="checkbox"
                                @change="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :checked="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template v-else-if="item.field_type == 'date'">
                              <input
                                class="rl-editable-input-table-data"
                                type="date"
                                @change="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                                :value="getRelatedValueOnlyEdit(item)"
                              />
                            </template>
                            <template
                              v-else-if="item.field_type == 'singleSelect'"
                            >
                              <TableDropdownField
                                :placeHolder="getRelatedValueOnlyEdit(item)"
                                :items="item.options"
                                :isMultiSelect="false"
                                :isModal="false"
                                :clearOnReset="false"
                                v-on:onDropdownChange="
                                  editExistingCells(
                                    $event,
                                    item,
                                    rowIndex,
                                    colIndex
                                  )
                                "
                              />
                            </template>
                          </div>
                        </td>
                      </template>
                    </template>
                  </tr>
                  <template v-if="rowIndex == soldTableData.length - 1">
                    <tr>
                      <td style="height: 170px"></td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </template>
          </template>

          <!-- View Only table data -->
          <template v-else>
            <template v-if="isReservedClicked">
              <tbody>
                <tr v-if="isLoading">
                  <!-- <Loading />  -->
                </tr>

                <tr
                  v-else-if="
                    fetchedReservationData &&
                    reservationTableData?.length === 0 &&
                    !showCreateViewModal
                  "
                >
                  {{
                    noDataFoundWarningAlert()
                  }}
                </tr>

                <tr
                  v-else
                  v-for="(row, rowIndex) in reservationTableData"
                  :key="rowIndex"
                >
                  <template v-for="(item, colIndex) in row" :key="colIndex">
                    <template v-if="item.field_name === 'RID'">
                      <td class="rl-viewing-sticky-table-data">
                        <a
                          href="#"
                          class="rid-link"
                          @click.prevent="openActivityDetailsModal(row)"
                        >
                          {{ item.value }}
                        </a>
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'projekt'">
                      <td class="rl-viewing-sticky-table-data-col-1">
                        {{ item.value }}
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'einheit'">
                      <td class="rl-viewing-sticky-table-data-col-2">
                        {{ item.value }}
                      </td>
                    </template>
                    <!-- <template v-else-if="item.field_name === 'NDB_an_Covivio'">
                      <td class="rl-viewing-table-data">
                        {{ item.value }}
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'Finanzierung'">
                      <td
                        :class="
                          isActivityLoading
                            ? 'loading-skeleton'
                            : 'rl-viewing-table-data'
                        "
                      >
                        <template v-if="isActivityLoading"> </template>
                        <template v-else>
                          {{ item.value }}
                        </template>
                      </td>
                    </template> -->
                    <template v-else-if="item.field_type === 'checkbox'">
                      <td class="rl-viewing-table-data">
                        <input
                          type="checkbox"
                          disabled
                          :checked="getRelatedValueOnlyEdit(item)"
                        />
                      </td>
                    </template>
                    <template
                      v-else-if="
                        item.field_name === 'Betreuer_1' ||
                        item.field_name === 'Betreuer_2'
                      "
                    >
                      <td class="rl-viewing-table-data">
                        {{ this.getAgentLabel(item.value) }}
                      </td>
                    </template>
                    <template
                      v-else-if="item.field_name === 'Herkunft_Erwerber'"
                    >
                      <td class="rl-viewing-table-data">
                        {{ this.getNatinalityLabel(item.value) }}
                      </td>
                    </template>
                    <template
                      v-else-if="item.field_name === 'NDB_von_Covivio_an_Essen'"
                    >
                      <td
                        :class="
                          isDateOverdue(row, rowIndex)
                            ? 'rl-table-cell-view-only-red'
                            : 'rl-viewing-table-data'
                        "
                      >
                        {{ item.value }}
                      </td>
                    </template>
                    <template v-else>
                      <td class="rl-viewing-table-data">
                        {{ item.value }}
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </template>

            <template v-else-if="isCanceledClicked">
              <tbody>
                <tr v-if="this.isLoading">
                  <!-- <Loading :loadingText="loadingText" /> -->
                </tr>

                <tr
                  v-else-if="
                    cancellationTableData.length <= 0 && !showCreateViewModal
                  "
                >
                  {{
                    noDataFoundWarningAlert()
                  }}
                </tr>

                <tr
                  v-else
                  v-for="(row, rowIndex) in cancellationTableData"
                  :key="rowIndex"
                >
                  <template v-for="(item, colIndex) in row" :key="colIndex">
                    <template v-if="item.field_name === 'RID'">
                      <td class="rl-viewing-sticky-table-data">
                        <a
                          href="#"
                          class="rid-link"
                          @click.prevent="openActivityDetailsModal(row)"
                        >
                          {{ item.value }}
                        </a>
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'projekt'">
                      <td class="rl-viewing-sticky-table-data-col-1">
                        {{ item.value }}
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'einheit'">
                      <td class="rl-viewing-sticky-table-data-col-2">
                        {{ item.value }}
                      </td>
                    </template>
                    <!-- <template v-else-if="item.field_name === 'NDB_an_Covivio'">
                      <td
                        :class="
                          isActivityLoading
                            ? 'loading-skeleton'
                            : 'rl-viewing-table-data'
                        "
                      >
                        <template v-if="isActivityLoading"> </template>
                        <template v-else>
                          {{ item.value }}
                        </template>
                      </td>
                    </template> -->
                    <!-- <template v-else-if="item.field_name === 'Finanzierung'">
                      <td class="rl-viewing-table-data">
                        :class="
                          isActivityLoading
                            ? 'loading-skeleton'
                            : 'rl-viewing-table-data'
                        "
                        >
                        <template v-if="isActivityLoading"> </template>
                        <template v-else>
                          {{ item.value }}
                        </template>
                      </td>
                    </template> -->
                    <template v-else-if="item.field_type === 'checkbox'">
                      <td class="rl-viewing-table-data">
                        <input
                          type="checkbox"
                          disabled
                          :checked="getRelatedValueOnlyEdit(item)"
                        />
                      </td>
                    </template>
                    <template
                      v-else-if="
                        item.field_name === 'Betreuer_1' ||
                        item.field_name === 'Betreuer_2'
                      "
                    >
                      <td class="rl-viewing-table-data">
                        {{ this.getAgentLabel(item.value) }}
                      </td>
                    </template>
                    <template
                      v-else-if="item.field_name === 'Herkunft_Erwerber'"
                    >
                      <td class="rl-viewing-table-data">
                        {{ this.getNatinalityLabel(item.value) }}
                      </td>
                    </template>

                    <template v-else>
                      <td class="rl-viewing-table-data">
                        {{ item.value }}
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </template>

            <template v-else="isSoldClicked">
              <tbody>
                <tr v-if="this.isLoading">
                  <!-- <Loading :loadingText="loadingText" /> -->
                </tr>

                <tr
                  v-else-if="soldTableData.length <= 0 && !showCreateViewModal"
                >
                  {{
                    noDataFoundWarningAlert()
                  }}
                </tr>

                <tr
                  v-else
                  v-for="(row, rowIndex) in soldTableData"
                  :key="rowIndex"
                >
                  <template v-for="(item, colIndex) in row" :key="colIndex">
                    <template v-if="item.field_name === 'RID'">
                      <td class="rl-viewing-sticky-table-data">
                        <a
                          href="#"
                          class="rid-link"
                          @click.prevent="openActivityDetailsModal(row)"
                        >
                          {{ item.value }}
                        </a>
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'projekt'">
                      <td class="rl-viewing-sticky-table-data-col-1">
                        {{ item.value }}
                      </td>
                    </template>
                    <template v-else-if="item.field_name === 'einheit'">
                      <td class="rl-viewing-sticky-table-data-col-2">
                        {{ item.value }}
                      </td>
                    </template>
                    <template v-else-if="item.field_type === 'checkbox'">
                      <td class="rl-viewing-table-data">
                        <input
                          type="checkbox"
                          disabled
                          :checked="getRelatedValueOnlyEdit(item)"
                        />
                      </td>
                    </template>
                    <template
                      v-else-if="
                        item.field_name === 'Betreuer_1' ||
                        item.field_name === 'Betreuer_2'
                      "
                    >
                      <td class="rl-viewing-table-data">
                        {{ this.getAgentLabel(item.value) }}
                      </td>
                    </template>

                    <template v-else>
                      <td class="rl-viewing-table-data">
                        {{ item.value }}
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </template>
          </template>
        </table>
      </div>
    </div>

    <CreateViewModal
      :show="showCreateViewModal"
      v-show="showCreateViewModal"
      @close="closeCreateViewModal"
    />

    <ActivityDetailsModal
      :show="showActivityDetailsModal"
      v-show="showActivityDetailsModal"
      :items="selectedRIDItemTableData"
      :allData="selectedRIDItemAllData"
      @close="closeActivityDetailsModal"
    />
    <!-- <FileDownloadModal
      :show="showActivityDetailsModal"
      v-show="showActivityDetailsModal"
      :items="selectedRIDItemTableData"
      :allData="selectedRIDItemAllData"
      @close="closeActivityDetailsModal"
    /> -->
  </div>
</template>

<style scoped>
.reservation-list {
  flex-basis: 100%;
  background: #eeeeee;
  font-family: "Montserrat";
  overflow-x: scroll;
}

.rl-top-action-section {
  display: flex;
  background-color: #262a33;
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 20px;
  padding-bottom: 16px;
}

.rl-table-section {
  height: 100%;
  background: #eeeeee;
  padding-top: 15px;
  padding-left: 24px;
  padding-bottom: 18px;
  overflow-x: scroll;
}

.rl-button-container {
  display: flex;
  margin-left: 0;
  margin-right: auto;
}

input::placeholder {
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.rl-button {
  border: 1px solid #bcbfc6;
  border-radius: 4px;
  background-color: #262a33;
  color: white;
  padding: 11px 45px 11px 45px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  margin-right: 16px;
}

.rl-button.clicked {
  background-color: white;
  color: black;
}

.rl-table-title {
  display: flex;
  justify-content: space-between;
  margin-right: 16px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
}

.rl-stickey-table-header-col-0 {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 3;
  white-space: nowrap;
  background-color: white;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  min-width: 100px;
}
.rl-stickey-table-header-col-1 {
  position: sticky;
  left: 100px;
  top: 0;
  z-index: 3;
  white-space: nowrap;
  background-color: white;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  min-width: 100px;
}
.rl-stickey-table-header-col-2 {
  position: sticky;
  left: 200px;
  top: 0;
  z-index: 3;
  white-space: nowrap;
  background-color: white;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  min-width: 100px;
}
.rl-viewing-table-header {
  top: 0;
  position: sticky;
  z-index: 2;
  white-space: nowrap;
  background-color: white;
  padding: 12px 25px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  min-height: 58px;
  min-width: 100px;
}

.rl-editable-table-data {
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.dropdown-arrow {
  position: absolute;
  color: var(--dark-gray) !important;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.rl-editable-input-table-data {
  white-space: nowrap;
  background-color: inherit;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.rl-viewing-table-data {
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 110px;
}

.rl-viewing-sticky-table-data {
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-height: 50px;
  max-height: 50px;
  position: sticky;
  left: 0;
  z-index: 1;
  min-height: 50px;
  max-height: 50px;
  min-width: 110px;
}
.rl-viewing-sticky-table-data-col-1 {
  position: sticky;
  left: 100px;
  z-index: 1;
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-height: 50px;
  max-height: 50px;
  min-width: 110px;
}

.rl-viewing-sticky-table-data-col-2 {
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-height: 50px;
  max-height: 50px;
  position: sticky;
  left: 205px;
  z-index: 1;
  min-height: 50px;
  max-height: 50px;
  min-width: 110px;
}

.rl-editable-sticky-table-data {
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  left: 1;
  left: 2;
  z-index: 1;
  min-height: 50px;
  max-height: 50px;
  min-width: 110px;
}

.rl-editable-sticky-table-data-col-1 {
  position: sticky;
  left: 100px;
  z-index: 1;
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-height: 50px;
  max-height: 50px;
  min-width: 110px;
}

.rl-editable-sticky-table-data-col-2 {
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-height: 50px;
  max-height: 50px;
  position: sticky;
  left: 205px;
  z-index: 1;
  min-width: 110px;
}

.rl-edit-container {
  display: flex;
  margin-left: auto;
  margin-right: 0;
}

.rl-table-cell-view-only-red {
  color: white;
  background-color: #d94139;
  white-space: nowrap;
  padding: 10px 12px;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.rl-edit-fill-button {
  display: flex;
  white-space: nowrap;
  border: white;
  border-radius: 4px;
  background-color: white;
  color: #22252d;
  padding: 10px 16px 10px 16px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.rl-create-button {
  display: flex;
  white-space: nowrap;
  border: 1px solid white;
  border-radius: 4px;
  background-color: var(--dark-gray);
  color: white;
  padding: 10px 16px 10px 16px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.rl-save-fill-button {
  display: flex;
  white-space: nowrap;
  border: white;
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 10px 16px 10px 16px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.rl-editable-div {
  padding: 10px 12px;
  background-color: #cccccc;
  border-style: none;
  text-align: center;
}

.rl-edited-div {
  padding: 10px 12px;
  background-color: #ad7a99;
  border-style: none;
  text-align: center;
}

.rl-editable-input-data {
  white-space: nowrap;
  background-color: inherit;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.loading-skeleton {
  background-color: #e0e0e0;
  animation: pulse 1.5s infinite;
  white-space: nowrap;
  padding: 10px 12px;
  background-color: #ffffff;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 110px;
}

.loading-spinner {
  border: 4px solid var(--dark-gray);
  border-top: 4px solid #ffff;
  border-radius: 50%;
  margin: auto;
  width: 20px;
  height: 20px;
  position: absolute;
  padding: 5px;
  animation: spin 2s linear infinite;
}

.rid-link {
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}

.rid-link :hover {
  text-decoration: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #c0c0c0; /* Darker shade during pulse */
  }
  100% {
    background-color: #e0e0e0;
  }
}
</style>
