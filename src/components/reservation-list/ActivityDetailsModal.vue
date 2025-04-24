<script>
import { ref, reactive, computed } from "vue";
import Loading from "../reservation-list/Loading.vue";
import axios from "axios";
import Swal from "sweetalert2";
import CloseIcon from "../icons/icon-close.vue";
import DeleteIcon from "../icons/icon-delete.vue";
import FileIcon from "../icons/icon-reservation-list.vue";
import DownloadIcon from "../icons/icon-download.vue";

import TableDropdownField from "../reservation-list/ActivityTableDropdownField.vue";
import Navbar from "../reservation-list/RlNavigationbar.vue";
import { v4 as uuidv4 } from "uuid";
import { agentsStoreRL } from "@/stores/agentsStoreRL";

export default {
  name: "ActivityDetailsModal",
  components: {
    Loading,
    CloseIcon,
    DeleteIcon,
    TableDropdownField,
    FileIcon,
    DownloadIcon,
  },

  setup() {
    const isLoading = ref(false);
    const loadingText = ref("Laden von Tätigkeitsdaten");
    const activityTableData = ref([]);
    const realEstateAgents = ref([]);
    const tableHeaders = ref([]);
    const reservationId = ref("");
    const reservationData = ref([]);
    const allActivitiesData = ref([]);
    const reservationType = ref([]);
    const deletedActivities = ref([]);
    const deletedActivityIds = ref(new Set());
    const selectedActivityTypes = ref([]);
    const showErrors = ref(false);
    const dropdownKey = ref(0);
    const activeTab = ref("activity");
    const filesTableData = ref([]);
    const isAllDataNotAvailable = ref(false);

    return {
      isLoading,
      loadingText,
      activityTableData,
      realEstateAgents,
      tableHeaders,
      reservationId,
      allActivitiesData,
      reservationData,
      deletedActivities,
      deletedActivityIds,
      reservationType,
      selectedActivityTypes,
      showErrors,
      dropdownKey,
      activeTab,
      filesTableData,
    };
  },

  props: {
    show: {
      type: Boolean,
      required: true,
    },

    items: {
      type: Object,
      required: true,
    },
    allData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    close() {
      this.resetAllData();
      this.$emit("close");
      this.activeTab = "activity";
      this.isAllDataNotAvailable = false;
    },

    loadReservationTypes() {
      this.reservationType = [
        {
          selection_label: "Reservierung",
          selection_value: "Reservierung",
          isDisable: false,
        },
        {
          selection_label: "Verkauf",
          selection_value: "Verkauf",
          isDisable: false,
        },
        {
          selection_label: "Storno",
          selection_value: "Storno",
          isDisable: false,
        },
      ];
    },

    resetAllData() {
      this.allActivitiesData = [];
      this.activityTableData = [];
      this.reservationId = "";
      this.reservationData = [];
      this.getAllAgents();
      this.deletedActivityIds.clear();
      this.showErrors = false;
      // this.getReservationId();
    },

    cancel() {
      this.getReservationId();
    },

    // loadActivityTableHeader() {
    //   const data = [
    //     { name: "Aktivität Typ", type: "" },
    //     { name: "", type: "" },
    //     { name: "Aktivität Art", type: "" },
    //     { name: "Datum der Aktivität", type: "" },
    //     { name: "Doppelte Reservierung", type: "" },
    //     { name: "Preis", type: "" },
    //     { name: "Verkaufspreisg", type: "" },
    //   ];
    //   this.tableHeaders.push(data);
    // },

    formatPrice(value) {
      return new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
      }).format(value);
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

    deleteActivityTableRow(row, index) {
      const activityId = row.find(
        (field) => field.field_name === "activity_date"
      ).id;

      Swal.fire({
        title: "Warnung",
        text: "Möchten Sie die Änderungen löschen?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ja",
        cancelButtonText: "Nein",
      }).then((result) => {
        if (result.isConfirmed) {
          // Store the ID if it exists
          if (activityId) {
            this.deletedActivityIds.add(activityId);
          }
          this.activityTableData.splice(index, 1);
          this.activityTableData = [...this.activityTableData];

          this.updateDisableOptionForActivityTypeDrodown();
          this.dropdownKey += 1;
        } else if (result.isDenied) {
          Swal.fire("Warnung", "Änderungen nicht gespeichert", "info");
        }
      });
    },

    editExistingCells(event, data, rowIndex, colIndex) {
      if (data.field_type == "checkbox") {
        let newValue = event.target.checked;

        if (newValue == null) {
          return;
        }

        let formattedValue = newValue == false ? 0 : 1;

        this.activityTableData[rowIndex][colIndex].value = formattedValue;
        this.activityTableData[rowIndex][colIndex].edited = true;

        // if (!this.activityTableData[rowIndex].edited) {
        //     this.activityTableData[rowIndex].edited = true;
        // }

        return;
      }

      if (data.field_type == "date") {
        let newValue = event.target.value;

        if (newValue == null) {
          return;
        }

        this.activityTableData[rowIndex][colIndex].value = newValue;
        this.activityTableData[rowIndex][colIndex].edited = true;

        // if (!this.existingTableData[rowIndex].edited) {
        //     this.existingTableData[rowIndex].edited = true;
        // }

        return;
      }

      if (data.field_type == "text") {
        let newValue = event.target.value;

        if (newValue == null) {
          return;
        }

        this.activityTableData[rowIndex][colIndex].value = newValue;
        this.activityTableData[rowIndex][colIndex].edited = true;

        // if (!this.existingTableData[rowIndex].edited) {
        //     this.existingTableData[rowIndex].edited = true;
        // }

        return;
      }
      if (data.field_type == "singleSelect") {
        let newValue = event.selection_value;

        if (newValue == null) {
          return;
        }
        this.activityTableData[rowIndex][colIndex].value = newValue;
        this.activityTableData[rowIndex][colIndex].edited = true;
        this.updateDisableOptionForActivityTypeDrodown();
      }
    },

    getRelatedValueOnlyEdit(data) {
      if (data.field_type == "checkbox") {
        if (data.value == null || data.value == "") {
          return false;
        }
        return data.value == 0 ? false : true;
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
    },

    async getAllAgents() {
      try {
        const storeRL = agentsStoreRL();
        const agentData = storeRL.getAllAgentsRL;

        agentData?.living?.list_of_all_users_data?.forEach((item) => {
          const agentUsernameLiving = item?.user_Name;
          const agentFirstNameLiving = item?.user_Vorname || "";
          const agentLastNameLiving = item?.user_Nachname || "";

          if (agentFirstNameLiving || agentLastNameLiving) {
            const dataLiving = {
              selection_label: `${agentFirstNameLiving || ""} ${
                agentLastNameLiving || ""
              }`.trim(),
              selection_value: agentUsernameLiving,
              onOffice_id: item.user_id,
            };
            this.realEstateAgents.push(dataLiving);
          } else if (agentUsernameLiving) {
            const dataLiving = {
              selection_label: agentUsernameLiving,
              selection_value: agentUsernameLiving,
              onOffice_id: item.user_id,
            };
            this.realEstateAgents.push(dataLiving);
          }
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
      }
    },

    async getAllActivitiesByRID() {
      this.showErrors = false;
      this.isLoading = true;
      this.allActivitiesData = [];
      this.activityTableData = [];
      const reservationId = this.reservationData[0].reservation_id;
      const immorNr = this.reservationData[0].immor_nr;

      try {
        this.loadingText = "Laden von Aktivitätsdaten";
        const activityResponse = await axios.get(
          `https://production.kpi.azbowsrilanka.com/api/project-bookings/getProjectBookingsByRID?rid=${reservationId}`
        );
        const activityResponseByRID = activityResponse?.data?.data;
        if (activityResponseByRID) {
          const filteredActivitiesByUnit = activityResponseByRID.filter(
            (activity) => activity.immo_nr.trim() === immorNr.trim()
          );

          this.allActivitiesData.push(...filteredActivitiesByUnit);
        }
        if (this.allActivitiesData?.length <= 0) {
          this.noDataFoundWarningAlert();
        }

        for (const item of this.allActivitiesData) {
          const data = [
            {
              field_name: "activity_type",
              value: item.activity_type,
              field_type: "singleSelect",
              // options: JSON.parse(JSON.stringify(this.reservationType)),
              options: [...this.reservationType],
            },
            // {
            //   field_name: "activity_kind",
            //   value: item.activity_kind,
            //   field_type: "text",
            // },
            {
              field_name: "activity_date",
              id: item.id,
              value: item.date,
              field_type: "date",
            },
            {
              field_name: "double_reservation",
              value: item.is_double_reservation,
              field_type: "checkbox",
            },
            {
              field_name: "price",
              value: this.formatPrice(item.reservation_price),
              field_type: "text",
            },
            {
              field_name: "sales_price",
              value: this.formatPrice(item.sold_price),
              field_type: "text",
            },
          ];
          this.activityTableData.push(data);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        this.isLoading = false;
        this.updateDisableOptionForActivityTypeDrodown();
      }
    },

    updateDisableOptionForActivityTypeDrodown() {
      //reset disable to false
      this.isLoading = true;
      this.activityTableData.forEach((row) => {
        row.forEach((item) => {
          if (item.field_name === "activity_type") {
            item.options = JSON.parse(JSON.stringify(this.reservationType));
            // item.options = [...this.reservationType];
          }
        });
      });

      const selectedTypes = [
        ...new Set(
          this.activityTableData
            .flat()
            .filter((row) => row.field_name === "activity_type" && row.value)
            .map((row) => row.value.toLowerCase())
        ),
      ];

      this.activityTableData.forEach((row) => {
        row.forEach((item) => {
          if (item.field_name === "activity_type" && item.options) {
            item.options = item.options.map((option) => ({
              ...option,
              isDisable: selectedTypes.includes(
                option.selection_value.toLowerCase()
              ),
            }));
          }
        });
      });
      this.isLoading = false;
    },

    unFormatPrice(value) {
      if (value == null || value === "") return "";
      const numericValue = parseFloat(
        value.toString().replace(/\./g, "").replace(/,/g, ".")
      );
      if (isNaN(numericValue)) return "";
      return numericValue;
    },

    async updateAllActivitiesByRID() {
      const generateUniqueId = () => Math.floor(Math.random() * 1000000);
      try {
        const activityData = this.activityTableData
          .filter((item) => {
            // Skip items that were marked as deleted
            const id = item.find(
              (field) => field.field_name === "activity_date"
            )?.id;
            return !id || !this.deletedActivityIds.has(id);
          })
          .map((item) => {
            const activityFromAllActivitiesData = this.allActivitiesData.find(
              (activity) =>
                activity.id ===
                item.find((field) => field.field_name === "activity_date").id
            );

            // Base data with common fields
            const baseData = {
              // activity_kind:
              //   item.find((field) => field.field_name === "activity_kind")
              //     .value || "",
              activity_kind: "None",
              activity_type:
                item.find((field) => field.field_name === "activity_type")
                  .value || "",
              date: item.find((field) => field.field_name === "activity_date")
                .value,
              is_double_reservation:
                item.find((field) => field.field_name === "double_reservation")
                  .value || 0,
              reservation_price: this.unFormatPrice(
                item.find((field) => field.field_name === "price").value
              ),
              sold_price: this.unFormatPrice(
                item.find((field) => field.field_name === "sales_price").value
              ),
              is_deleted:
                item.find((field) => field.field_name === "is_deleted")
                  ?.value || false,

              rid: this.reservationId,
              // agent_name: this.reservationData[0].agent_name,
              // company: this.reservationData[0].company || " ",
              // customer_id: this.reservationData[0].customer_id || 0,
              // unit_id: this.reservationData[0].unit_id || 0,
              // immo_nr: this.reservationData[0].immor_nr,
              // agent_id: this.reservationData[0].agent_id || 0,
            };

            // For existing records, include the ID
            if (activityFromAllActivitiesData) {
              return {
                ...baseData,
                id: activityFromAllActivitiesData.id,
                activity_id: activityFromAllActivitiesData.activity_id,
                agent_id: activityFromAllActivitiesData.agent_id,
                agent_name: activityFromAllActivitiesData.agent_name,
                company: activityFromAllActivitiesData.company || " ",
                customer_id: activityFromAllActivitiesData.customer_id || 0,
                unit_id: activityFromAllActivitiesData.unit_id || 0,
                immo_nr: activityFromAllActivitiesData.immor_nr,
              };
            }

            // For new records, set activity_id to unique
            return {
              ...baseData,
              activity_id: generateUniqueId(),
              agent_id: this.reservationData[0].agent_id,
              agent_name: this.reservationData[0].agent_name,
              company: this.reservationData[0].company || " ",
              customer_id: this.reservationData[0].customer_id || 0,
              unit_id: this.reservationData[0].unit_id || 0,
              immo_nr: this.reservationData[0].immor_nr,
            };
          });

        const updatedActivityData = activityData.filter(Boolean);

        // Add the deleted items with is_deleted flag
        this.deletedActivityIds.forEach((id) => {
          const deletedActivity = this.allActivitiesData.find(
            (activity) => activity.id === id
          );
          if (deletedActivity) {
            updatedActivityData.push({
              ...deletedActivity,
              is_deleted: true,
            });
          }
        });

        const activityResponse = await axios.put(
          `https://production.kpi.azbowsrilanka.com/api/project-bookings/updateProjectBookingsById`,
          updatedActivityData
        );

        // Clear deleted IDs after successful save
        this.deletedActivityIds.clear();

        Swal.fire("Success", "Aktivität erfolgreich aktualisiert!", "success");
        this.getAllActivitiesByRID();
      } catch (error) {
        console.error("Error fetching report data:", error);
        Swal.fire(
          "Error",
          "Aktivität konnte nicht aktualisiert werden",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    async getAgentsMicroservicesId(agentId) {
      try {
        this.isLoading = true;
        const apiUrl = "https://ms.p.bestplace.tools/api/agent/selection";
        const requestBody = {
          data: {
            agent_onoffice_ids: [agentId],
          },
        };
        const headers = {
          Authorization: "Bearer 3|pGahIEjwXEMWYr6QqwaP1c0OneTJEqLV6qxx2Cfs",
          "Content-Type": "application/json",
        };
        const response = await axios.post(apiUrl, requestBody, { headers });
        if (response.data && Array.isArray(response.data)) {
          const agentId = response.data[0]?.id;

          return agentId;
        } else {
          console.error("Unexpected API response format:", response.data);
          return null;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getCustomerMicroservicesId(customerNr) {
      try {
        this.isLoading = true;
        const apiUrl = "https://ms.p.bestplace.tools/api/address/single";
        const requestBody = {
          data: {
            customer_nr: Number(customerNr),
            company: "living",
          },
        };
        const headers = {
          Authorization: "Bearer 3|pGahIEjwXEMWYr6QqwaP1c0OneTJEqLV6qxx2Cfs",
          "Content-Type": "application/json",
        };
        const response = await axios.post(apiUrl, requestBody, { headers });
        if (response.data) {
          const customerId = response.data?.id;

          return customerId;
        } else {
          console.error("Unexpected API response format:", response.data);
          return null;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getReservationId() {
      this.reservationId =
        this.items.find((item) => item.field_name === "RID")?.value || "";
      const agent = this.realEstateAgents.find(
        (agent) =>
          agent.selection_value ===
            this.items.find((item) => item.field_name === "Betreuer_1")
              ?.value || 0
      );
      const customer_onofficeId =
        this.items.find((item) => item.field_name === "Name_Kaeufer")
          ?.customer_kdnr || 0;

      const agent_microservices_id = await this.getAgentsMicroservicesId(
        agent?.onOffice_id
      );

      const customer_microservices_id = await this.getCustomerMicroservicesId(
        customer_onofficeId
      );

      this.reservationData.push({
        reservation_id:
          this.items.find((item) => item.field_name === "RID")?.value || "",
        customer_id: customer_microservices_id,
        company:
          this.items.find((item) => item.field_name === "Name_Kaeufer")
            ?.company || "",
        immor_nr:
          (this.items.find((item) => item.field_name === "projekt")?.value ||
            "") +
          "-" +
          (this.items.find((item) => item.field_name === "einheit")?.value ||
            ""),
        agent_name:
          this.items.find((item) => item.field_name === "Betreuer_1")?.value ||
          "",
        agent_id: agent_microservices_id,
        unit_id: this.items.find((item) => item.field_name === "projekt")
          ?.unit_id,
        reservation_price: this.unFormatPrice(
          this.items.find(
            (item) => item.field_name === "Kaufpreis_Reservierung"
          )?.value
        ),
      });

      if (this.reservationId) {
        this.getAllActivitiesByRID();
      }
    },

    addActivityTableRow() {
      this.activityTableData.push([
        {
          field_name: "activity_type",
          value: "",
          field_type: "singleSelect",
          // options: JSON.parse(JSON.stringify(this.reservationType)),
          options: [...this.reservationType],
        },
        // {
        //   field_name: "activity_kind",
        //   value: null,
        //   field_type: "text",
        // },
        {
          field_name: "activity_date",
          id: "",
          value: "",
          field_type: "date",
        },
        {
          field_name: "double_reservation",
          value: 0,
          field_type: "checkbox",
        },
        {
          field_name: "price",
          value: this.reservationData[0]?.reservation_price
            ? this.formatPrice(this.reservationData[0].reservation_price)
            : null,
          field_type: "text",
        },
        {
          field_name: "sales_price",
          value: null,
          field_type: "text",
        },
      ]);
      this.updateDisableOptionForActivityTypeDrodown();
    },

    getAgentLabel(username) {
      const agent = this.realEstateAgents.find(
        (agent) => agent.selection_value === username
      );
      return agent ? agent.selection_label : username;
    },

    validateTableData() {
      this.showErrors = true;

      for (const row of this.activityTableData) {
        for (const item of row) {
          if (
            (item.field_name === "activity_type" && !item.value) ||
            (item.field_name === "date" && !item.value) ||
            (item.field_name === "reservation_price" && !item.value) ||
            (item.field_name === "sales_price" && !item.value)
          ) {
            return false;
          }
        }
      }

      return true;
    },

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    confirmationSave() {
      if (this.validateTableData()) {
        Swal.fire({
          title: "Warnung",
          text: "Wollen Sie die Änderungen speichern?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ja",
          cancelButtonText: "Nein",
        }).then((result) => {
          if (result.isConfirmed) {
            this.updateAllActivitiesByRID();
          } else if (result.isDenied) {
            Swal.fire("Warnung", "Änderungen nicht gespeichert", "info");
          }
        });
      } else {
        Swal.fire({
          title: "Fehler",
          text: "Bitte füllen Sie die Pflichtfelder aus",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    loadfilesData() {
      this.filesTableData = [];
      const baseData = [
        {
          field_title: "Endgültige Dokumentendatei",
          field_name: "final_document_file_url",
          value: this.allData.final_document_file_url,
        },
        // {
        //   field_title: "Finanzd Dateien",
        //   field_name: "finance_files",
        //   value: this.allData.finance_files,
        // },
        {
          field_title: "Gwg Intern pdf Mit Unterschrift",
          field_name: "gwgintern_pdf_with_signature",
          value: this.allData.gwgintern_pdf_with_signature,
        },
        {
          field_title: "KV Datei Mit Unterschrift",
          field_name: "kv_file_with_signature",
          value: this.allData.kv_file_with_signature,
        },
      ];
      let ndbFiles = this.allData.ndb_files;

      if (typeof ndbFiles === "string") {
        try {
          ndbFiles = JSON.parse(ndbFiles);
        } catch (error) {
          console.error("Error parsing ndb_files JSON:", error);
          ndbFiles = [];
        }
      }

      ndbFiles = Array.isArray(ndbFiles) ? ndbFiles : [ndbFiles];
      const ndbData = ndbFiles.map((file, index) => ({
        field_title: `NDB Datei ${index + 1}`,
        field_name: `ndb_files_${index + 1}`,
        value: file,
      }));

      const data = [...baseData, ...ndbData];
      this.isAllDataNotAvailable = data.every((item) => !item.value);
      this.filesTableData.push(data);

      console.log("allfiledata", this.filesTableData);
    },

    downloadPDF(file) {
      const link = document.createElement("a");
      let filePath = file.value;
      const baseURL = this.globalApiBaseUrl;

      const filteredBaseURL = baseURL.replace(/\/wp-json\/v1$/, '')      
      let parts = filePath.split('/wp-content/');
      let filteredFilePath = parts.length > 1 ? '/wp-content/' + parts[1] : null;

      if (filteredBaseURL == null || filteredFilePath == null) {
        return;
      }

      // filePath = filePath?.replace(/^"|"$/g, "");
      // filePath = filePath?.replace(/^\/html/, "");
      // filePath = filePath?.replace(/\/+/g, "/");

      const encodedURL = encodeURI(filteredFilePath);
      link.href = filteredBaseURL + encodedURL;
      link.setAttribute("download", file.field_name);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // downloadPDF(file) {
    //   const link = document.createElement("a");
    //   const filePath = file.value;
    //   const newFilePath = filePath.replace(/^\/html/, "");
    //   const fileUrl =
    //     "https://staging.cockpit.bestplace-living.de" + newFilePath;

    //   fetch(fileUrl)
    //     .then((response) => response.blob())
    //     .then((blob) => {
    //       const blobUrl = URL.createObjectURL(blob);
    //       link.href = blobUrl;
    //       link.setAttribute("download", file.field_name || "download.pdf");
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //       URL.revokeObjectURL(blobUrl);
    //     })
    //     .catch((error) => {
    //       console.error("Error downloading file:", error);
    //     });
    // },
  },

  watch: {
    show(newvalue) {
      if (newvalue === true) {
        this.loadReservationTypes();
        this.getAllAgents();
        this.getReservationId();
        this.loadfilesData();
      }
    },
  },
};
</script>

<template>
  <div class="modal" v-if="show">
    <div class="modal-inner">
      <div class="header">
        <button class="close-button" @click="close">
          <CloseIcon />
        </button>
      </div>
      <!-- <Navbar /> -->
      <div class="navbar-container">
        <button
          @click="setActiveTab('activity')"
          :class="{ active: activeTab === 'activity' }"
          class="nav-bar-item"
        >
          Aktivität
        </button>
        <button
          @click="setActiveTab('files')"
          :class="{ active: activeTab === 'files' }"
          class="nav-bar-item"
        >
          Dateien
        </button>
      </div>
      <div class="grey-line"></div>
      <div v-if="activeTab === 'activity'" class="activity-container">
        <div class="top-header-container">
          <span>
            RID:
            {{ items.find((item) => item.field_name === "RID")?.value || "" }}
          </span>
        </div>

        <div class="agents-container">
          <div class="textfield-container">
            <span class="placeholder-container">Betreuer 1</span>
            <input
              class="input-readonly-container"
              :value="
                this.getAgentLabel(
                  items.find((item) => item.field_name === 'Betreuer_1')
                    ?.value || ''
                )
              "
              type="text"
              readonly
            />
          </div>

          <div class="textfield-container">
            <span class="placeholder-container">Betreuer 2</span>
            <input
              class="input-readonly-container"
              :value="
                this.getAgentLabel(
                  items.find((item) => item.field_name === 'Betreuer_2')
                    ?.value || ''
                )
              "
              type="text"
              readonly
            />
          </div>
        </div>

        <div
          class="textfield-container"
          style="margin-bottom: 20px; width: 48%"
        >
          <span class="placeholder-container">Kaeufer</span>
          <input
            class="input-readonly-container"
            :value="
              items.find((item) => item.field_name === 'Name_Kaeufer')?.value ||
              ''
            "
            type="text"
            readonly
          />
        </div>

        <div class="activity-title">
          {{
            (items.find((item) => item.field_name === "projekt")?.value || "") +
            " - " +
            (items.find((item) => item.field_name === "einheit")?.value || "")
          }}
          - Activities
        </div>

        <div class="activity-table-container">
          <table
            id="table"
            class="activity-table"
            style="border-collapse: collapse; width: 100%; border-spacing: 0"
          >
            <thead>
              <tr>
                <!-- <template v-for="(header, index) in tableHeaders" :key="index">
                  <th class="activity-table-header">{{ header.name }}</th>
                </template> -->
                <th class="activity-table-header">Aktivität Typ</th>
                <!-- <th class="activity-table-header">Aktivität Art</th> -->
                <th class="activity-table-header">Datum der Aktivität</th>
                <th class="activity-table-header">Doppelte Reservierung</th>
                <th class="activity-table-header">Preis (€)</th>
                <th class="activity-table-header">Verkaufspreis (€)</th>
              </tr>
            </thead>
            <tbody>
              <div v-if="this.isLoading">
                <Loading :loadingText="loadingText" />
              </div>

              <template
                v-for="(row, rowIndex) in activityTableData"
                :key="rowIndex"
              >
                <tr>
                  <template v-for="(item, colIndex) in row" :key="colIndex">
                    <td
                      class="activity-editable-table-data"
                      :class="{
                        'error-border':
                          !item.value &&
                          showErrors &&
                          item.field_name !== 'double_reservation',
                      }"
                    >
                      <div class="activity-editable-div">
                        <template v-if="item.field_type == 'text'">
                          <input
                            class="activity-editable-input-data"
                            type=" text"
                            inputmode="text"
                            @input="
                              editExistingCells(
                                $event,
                                item,
                                rowIndex,
                                colIndex
                              )
                            "
                            v-model="item.value"
                          />
                        </template>
                        <template v-if="item.field_type == 'date'">
                          <input
                            class="activity-editable-input-data"
                            type="date"
                            @change="
                              editExistingCells(
                                $event,
                                item,
                                rowIndex,
                                colIndex
                              )
                            "
                            v-model="item.value"
                          />
                        </template>
                        <template v-if="item.field_type == 'checkbox'">
                          <input
                            class="activity-editable-input-data"
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
                        <template v-if="item.field_type == 'singleSelect'">
                          <TableDropdownField
                            :key="dropdownKey"
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
                  <td class="delete-button-column">
                    <button
                      class="delete-row-button"
                      @click="deleteActivityTableRow(row, rowIndex)"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <!-- <div class="button-container" style="padding: 0 45px"> -->
          <div class="left-button-container">
            <button class="add-button" @click="addActivityTableRow">
              Aktivität hinzufügen
            </button>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <div
        v-if="activeTab === 'activity'"
        class="right-button-container"
        style="padding: 0 45px"
      >
        <button class="cancel-button" @click="cancel">Stornieren</button>
        <button class="save-button" @click="confirmationSave">Speichern</button>
      </div>

      <div v-if="activeTab === 'files'">
        <div class="file-download-container">
          <table
            style="
              border-collapse: collapse;
              width: 100%;
              border-spacing: 0;
              border-radius: 8px 0px 0px 0px;
            "
            class="file-table"
          >
            <thead>
              <tr>
                <th class="file-table-header">Dateiname</th>
                <th class="file-table-header">Aktion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isAllDataNotAvailable === true">
                <td
                  colspan="2"
                  class="file-table-data"
                  style="text-align: center"
                >
                  Daten nicht verfügbar
                </td>
              </tr>
              <template
                v-for="(row, rowIndex) in filesTableData"
                :key="rowIndex"
              >
                <tr
                  v-for="(file, colIndex) in row"
                  :key="colIndex"
                  class="file-row"
                >
                  <template
                    v-if="file && file.value && isAllDataNotAvailable === false"
                  >
                    <td class="file-table-data">
                      <FileIcon class="file-icon" />
                      <span class="file-name">{{ file.field_title }}</span>
                    </td>

                    <td class="file-table-data" style="text-align: center">
                      <button
                        class="download-button"
                        @click="downloadPDF(file)"
                      >
                        <DownloadIcon />
                      </button>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <!-- <div class="download-all-button-container" style="padding: 0 150px">
          <button class="download-all" @click="downloadAllFiles">
            Alle Dateien Herunterladen
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 4;
}

.modal-inner {
  background-color: white;
  min-width: 60%;
  max-width: 40%;
  min-height: 100vh;
  max-height: 100%;
  border-radius: 4px;
  padding-top: 16px;
  padding-bottom: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.navbar-container {
  background-color: white;
  margin-bottom: 20px;
  padding: 0 45px;
  width: 100%;
}

.nav-bar-item {
  background-color: white;
  border: 1px white;
  color: black;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  padding: 14px 16px;
  width: 15%;
}

.nav-bar-item:hover {
  background-color: #ddd;
  color: black;
}

.nav-bar-item.active {
  background-color: var(--light-gray);
  color: white;
}

.grey-line {
  margin: 0 45px;
  border-top: 2px solid var(--light-gray);
  margin-bottom: 40px;
}
.header {
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
}

.top-header-container {
  display: flex;
  margin-bottom: 25px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-gray);
}

.close-button {
  width: 36px;
  height: 36px;
  background-color: #f8f8f8;
  border: none;
  border-radius: 18px;
}

.activity-container {
  padding: 0 45px;
}

.textfield-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
  width: 100%;
}

.input-readonly-container {
  width: 100%;
  padding: 12px 23px 8px;
  background-color: #fafafa;
  color: var(--gray-text);
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
}

.placeholder-container {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  background-color: white;
  color: var(--gray-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  top: -9px;
  left: 9px;
  z-index: 1;
}

.agents-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.activity-title {
  display: flex;
  white-space: nowrap;
  border-radius: 4px;
  background-color: #fafafa;
  border: 1px solid #fafafa;
  color: var(--gray-text);
  font-weight: bold;
  padding: 20px 20px 20px 20px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  flex: 1;
  width: 100%;
}

.activity-table-container {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.activity-table-header {
  /* white-space: nowrap; */
  flex: 1;
  background-color: white;
  border: 1px solid black;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.activity-editable-table-data {
  background-color: white;
  border: 1px solid black;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  flex: 1;
}

.activity-editable-input-data {
  white-space: nowrap;
  background-color: white;
  color: var(--dark-gray);
  border-style: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  padding: 0;
  width: 100%;
}

.left-button-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  margin-right: auto;
  width: 30%;
}

.right-button-container {
  margin-top: auto;
  gap: 20px;
  display: flex;
  margin-left: auto;
  width: 60%;
  justify-content: flex-end;
}

.add-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0;
  text-align: center;
  flex: 1;
}

.save-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.cancel-button {
  white-space: nowrap;
  border: 1px solid var(--red);
  border-radius: 4px;
  background-color: var(--white);
  color: red;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.delete-button-column {
  width: 0;
  position: relative;
  right: -10px;
}

.delete-row-button {
  position: absolute;
  align-self: center;
  justify-content: center;
  background-color: white;
  border: 1px solid white;
  color: red;
}
.error-border {
  border: 2px solid red;
}

/* file page */
.file-download-container {
  padding: 0 150px;
}

.file-table {
  width: 100%;
  margin-bottom: 40px;
  border-collapse: collapse;
}

.file-table-data {
  /* display: flex; */
  /* gap: 8px; */
  background-color: white;
  border: 1px solid black;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  /* text-align: center; */
  flex: 1;
}

.file-table-header {
  background-color: white;
  border: 1px solid black;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  flex: 1;
}

.file-icon {
  font-size: 20px;
  padding-right: 20px;
}

.file-name {
  flex-grow: 1;
}

.download-button {
  font-size: 20px;
  color: black;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  background-color: white;
}

.download-button:hover {
  background: #fafafa;
}

.download-all-button-container {
  margin-top: auto;
  display: flex;
  margin-left: auto;
  width: 40%;
  justify-content: flex-end;
}

.download-all {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}
</style>
