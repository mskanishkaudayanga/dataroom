<script>
import { ref, reactive, computed } from "vue";
import Loading from "../reservation-list/Loading.vue";
import axios from "axios";
import Swal from "sweetalert2";
import CloseIcon from "../icons/icon-close.vue";
import DeleteIcon from "../icons/icon-delete.vue";
import FileIcon from "../icons/icon-reservation-list.vue";

import TableDropdownField from "../reservation-list/ActivityTableDropdownField.vue";
// import Navbar from "../reservation-list/RlNavigationbar.vue";
import { v4 as uuidv4 } from "uuid";
import { agentsStoreRL } from "@/stores/agentsStoreRL";

export default {
  name: "FileDownloadModal",
  components: {
    Loading,
    CloseIcon,
    DeleteIcon,
    TableDropdownField,
    // Navbar,
    FileIcon,
  },

  setup() {
    const isLoading = ref(false);
    const loadingText = ref("Laden von Tätigkeitsdaten");
    const filesTableData = ref([]);

    return {
      isLoading,
      loadingText,
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
      this.$emit("close");
      this.resetAll();
    },

    resetAll() {
      this.filesTableData = [];
    },

    loadfilesData() {
      const data = [
        {
          field_name: "final_document_file_url",
          value: this.allData.final_document_file_url,
        },
        {
          field_name: "finance_files",
          value: this.allData.finance_files,
        },
        {
          field_name: "gwgintern_pdf_with_signature",
          value: this.allData.gwgintern_pdf_with_signature,
        },
        {
          field_name: "kv_file_with_signature",
          value: this.allData.kv_file_with_signature,
        },
        {
          field_name: "ndb_files",
          value: this.allData.ndb_files,
        },
      ];
      this.filesTableData.push(data);

      console.log("allfiledata", this.filesTableData);
    },

    downloadPDF(file) {
      const link = document.createElement("a");
      const filePath = file.value;
      const newFilePath = filePath.replace(/^\/html/, "");
      link.href = "https://staging.cockpit.bestplace-living.de" + newFilePath;
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
          <tbody>
            <template v-for="(row, rowIndex) in filesTableData" :key="rowIndex">
              <tr
                v-for="(file, colIndex) in row"
                :key="colIndex"
                class="file-row"
              >
                <td class="file-data">
                  <!-- <FileIcon class="file-icon" /> -->
                  <span class="file-name">{{ file.field_name }}</span>
                </td>

                <td class="download-button-cell">
                  <button class="download-button" @click="downloadPDF(file)">
                    Herunterzuladen
                  </button>
                  <!-- <FileIcon class="file-icon" /> -->
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="right-button-container" style="padding: 0 45px">
        <button class="download-all" @click="downloadAllFiles">
          Alle Dateien Herunterladen
        </button>
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
  border-bottom: "black";
}

.navbar-menu {
  list-style-type: none;
  display: flex;
  margin-bottom: 10px;
}

.nav-bar-item {
  display: inline;
  color: black;
  font-family: inherit;
  font-size: 16px;
  border-radius: 5px;
  text-align: center;
  padding: 14px 16px;
}

.nav-bar-item:hover {
  background-color: #ddd;
  color: black;
}
.header {
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
}

.top-header-container {
  display: flex;
  margin-bottom: 25px;
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

.file-download-container {
  padding: 0 150px;
}

.file-table {
  width: 100%;
  margin-bottom: 40px;
  border-collapse: collapse;
}

.file-row {
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
  /* padding: 10px 0; */
}

.file-data {
  /* display: flex; */

  gap: 8px;
  background-color: white;
  border: 1px solid black;
  padding: 12px 20px 12px 12px;
  color: black;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  /* text-align: center; */
  flex: 1;
}

.download-button-cell {
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
  /* width: 20px; */
}

.file-name {
  flex-grow: 1;
}

.download-button {
  background: var(--blue);
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
}

.download-button:hover {
  background: #0056b3;
}

.download-all {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 10px 13px 10px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}
</style>
