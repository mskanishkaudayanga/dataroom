<script>

import DownloadIcon from "@/components/icons/icon-download.vue";
import axios from "axios";

export default {
  name: "TableChart",
  components: {DownloadIcon},
  props: {
    columnHeadlines: {
      type: Array,
      default: [],
    },
    rowDatas: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      uniqueId: this.makeid(20),
      csvDownloadUrl: '',
      isLoading: false,
    }
  },
  methods: {
    exportTable() {

      if ( this.isLoading ) {
        return;
      }

      let dataToSend = {
        'data': {
          'columnHeader': this.columnHeadlines,
          'rowData': this.rowDatas
        }
      };

      axios.post(this.globalApiMicroserviceBaseUrl + '/export/create/csv', dataToSend)
        .then(
            (response) => {
              if (response.status === 200) {
                this.csvDownloadUrl = response.data.fileUrl;
                window.open(this.globalApiMicroservicePublicFileUrl + this.csvDownloadUrl, '_blank');
              } else {
                this.csvDownloadUrl = '';
                this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
              }
            }
        )
        .catch(
            (error) => {
              this.csvDownloadUrl = '';
              this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
            }
        ).finally(() => {
          this.isLoading = false;
        });
    }
  },
  computed: {
    reducedDatasetToView() {
      let data = this.rowDatas;
      return data.slice(0, 100);
    }
  },
  mounted() {
  }
}
</script>

<template>

  <div class="table-chart">
    <div class="title">
      <slot></slot>
      <DownloadIcon style="margin-left: 15px;" @click="exportTable()"></DownloadIcon>
    </div>

    <div class="display-info" v-if="rowDatas.length > 100">Tabellenansicht wurde auf 100 Einträge reduziert. <br>Gesamtanzahl in CSV {{ rowDatas.length }}</div>
    <table>
      <thead>
        <tr>
          <td v-for="index in columnHeadlines">
            {{ index }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in reducedDatasetToView">
          <td v-for="val in data">
            {{ val }}
          </td>
        </tr>
      </tbody>
    </table>

  </div>

</template>

<style scoped>

.title {
  font-size:20px;
  color: var(--dark-gray);
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 25px;
  color: var(--dark-gray);
}

th, td {
  border: 1px solid black;
  padding: 0;
  margin: 0;
  text-align: left;
}

th, td {
  padding: 8px; /* Optional: you can adjust the padding as needed */
}

thead {
  font-weight: 700;
}

tbody tr:hover {
  background-color: var(--light-light-gray);
}

td {
  border: solid 1px black;
}

</style>
