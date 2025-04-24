<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import InputField from "@/components/forms/InputField.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import Button from "@/components/buttons/button.vue";
  import AlertMessage from "@/components/card/AlertMessage.vue";
  import RealEstateList from "@/components/card/RealEstateList.vue";
  import DeleteIcon from "@/components/icons/icon-delete.vue";
  import PlusIcon from "@/components/icons/icon-plus.vue";
  import LinkIcon from "@/components/icons/icon-link.vue";
  import Swal from "sweetalert2";
  import UploadFieldArea from "@/components/forms/UploadDragAndDrop.vue";
  import FinanceUploadFields from "@/components/forms/FinanceUploadFields.vue";
  import UploadFieldsWithCategories from "@/components/forms/UploadFieldsWithCategories.vue";

  export default {
    name: "ReservationFileChanges",
    components: {
      UploadFieldsWithCategories,
      FinanceUploadFields,
      UploadFieldArea,
      LinkIcon,
      PlusIcon,
      DeleteIcon,
      RealEstateList,
      AlertMessage,
      Button, TextAreaField, DropdownArrow, Dropdown, AsterixMarkIcon, InputField, AnimateCircleIcon, CloseIcon},
    props: {
      reservationData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        activeFileCreateArea: false,
        selectedCategory: '',
        reservationDataAll: this.reservationData,
        reservationId: this.$route.params.id,

        selectedCustomer: '',

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
        },
        uploadCategory: [
            'Kundendateien',
            'Finale Datei'
        ],
        dropdowns: {
          selectedCategory: false,
          selectedCustomer: false
        },
        dropdownRelativePosition: false,
        getDropdownContentCategory: [
            'Reservierung',
            'NDB',
            'Kunden GWG',
            'Makler GWG',
            'Finanzen',
            'Kaufvertrag',
            'Provision'
        ],
        getDropdownCustomerSelection: [],
      }
    },
    methods: {
      renderCategoryName(string) {

        let str = string;
        str = str === 'reservation' ? 'Reservierung' : str;
        str = str === 'ndb' ? 'NDB' : str;
        str = str === 'externalGWG' ? 'Kunden GWG' : str;
        str = str === 'internalGWG' ? 'Makler GWG' : str;
        str = str === 'finance' ? 'Finanzen' : str;
        str = str === 'kv' ? 'Kaufvertrag' : str;
        str = str === 'provisions' ? 'Provision' : str;

        return str;

      },
      renderFileName(fileUrl) {
        let array = fileUrl.split('/');
        return array[ array.length - 1 ];
      },
      renderFileLabel(string) {

        let str = string;
        str = str.includes('final') ? 'Finales Dokument' : str;
        str = str.includes('_uploads') ? 'Kundendokumente' : str;

        return str;

      },
      triggerArchive(singleFile) {

        let fileName = this.renderFileName(singleFile);

        Swal.fire({
          title: 'Datei archivieren',
          html: 'Möchten Sie Datei <b>'+fileName+'</b> archivieren? <br><i style="font-size:14px;">Die Datei wird nicht gelöscht.</i>',
          icon: 'question',
          confirmButtonText: 'Ja',
          denyButtonText: 'Schließen',
          showDenyButton: true,
          confirmButtonColor: '#4E7DEF',
          denyButtonColor: '#D94139',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // trigger archive of file to api
            this.startArchive(singleFile);
          }
        });
      },
      startArchive(fileUrl) {

        if ( !fileUrl ) {
          this.notificationBannerInit('error', 'Datei konnte nicht archiviert werden');
          return;
        }

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          reservationId: this.reservationId,
          fileUrl: fileUrl
        }

        axios.post(this.globalApiBaseUrl + '/reservations/archiveFileCustomerFolder', dataToSend)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.notificationBannerInit('success', 'Datei erfolgreich archiviert');
                    this.reservationDataAll = this.removeUrl(this.reservationDataAll, dataToSend.fileUrl);
                  } else {
                    this.notificationBannerInit('warning', 'Datei konnte nicht gefunden werden');
                  }
                }
            )
            .catch(
                (error) => {
                  this.notification('error', 'Es ist ein Fehler aufgetreten');
                  console.log(error);
                }
            ).finally(
            () => {
              this.isLoading = false;
            }
        )
      },
      startAddFiles() {

        if ( this.uploads.length === 0 ) {
          this.notificationBannerInit('error', 'Keine Dateien ausgewählt');
          return;
        }

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let formData = new FormData();

        formData.append('reservationId', this.reservationId);
        formData.append('fileCategory', this.selectedCategory);

        for (const index in this.uploads) {
          if ( this.uploads[index].uploadFiles.length > 0 ){

            // Translate cat to german if it is eng
            let categoryName = this.uploads[index].category;

            for (const [fileIndex, val] in this.uploads[index].uploadFiles) {
              formData.append(categoryName+'['+fileIndex+']', this.uploads[index].uploadFiles[fileIndex]);
            }

            if ( typeof this.uploads[index].customNotice !== 'undefined'){
              formData.append('ownCategoryName', this.uploads[index].customNotice);
            }

          }
        }

        if ( this.selectedCategory === 'Kunden GWG' ) {
          formData.append('gwgCustomer', this.selectedCustomer);
        }

        axios.post(this.globalApiBaseUrl + '/reservations/addFilesCustomerFolder', formData)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.notificationBannerInit('success', 'Datei erfolgreich hochgeladen');
                    this.activeFileCreateArea = false;
                    this.triggerReload();
                  } else {
                    this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
                  }
                }
            )
            .catch(
                (error) => {
                  this.notification('error', 'Es ist ein Fehler aufgetreten');
                  console.log(error);
                }
            ).finally(
            () => {
              this.isLoading = false;
            }
        )
      },
      triggerReload() {
        this.$emit('triggerNewCustomerFolderEditView', this.makeid(30))
      },
      removeUrl(obj, url) {
        let newObj;

        if (Array.isArray(obj)) {
          newObj = obj.filter(item => item !== url);
          newObj = newObj.map(item => (typeof item === "object" ? removeUrl(item, url) : item));
        } else if (typeof obj === "object" && obj !== null) {
          newObj = {};
          for (let key in obj) {
            newObj[key] = this.removeUrl(obj[key], url);
          }
        } else {
          newObj = obj;
        }

        return newObj;
      },
      toggleDropdowns(index) {
        // Format int to string
        index = index+'';

        for (const item in this.dropdowns) {
          if ( index === item ) {
            this.dropdowns[index] = !this.dropdowns[index];
          } else {
            this.dropdowns[item] = false;
          }
        }
      },
      setDropdownTop($event) {
        const eleName = $event.target.name;
        const additionalSpace = 5;
        if ( this.$refs['input'+eleName] !== undefined ) {
          this.$refs['dropdown'+eleName][0].$el.style.top = this.$refs['input'+eleName].$el.clientHeight + additionalSpace + 'px';
        }
        if ( !this.isInViewport(this.$refs['dropdown'+eleName].$el) ) {
          this.dropdownRelativePosition = true;
          this.$refs['dropdown'+eleName].$el.style.top = '0px';
        } else {
          this.dropdownRelativePosition = false;
        }
      },
      dropdownClick(prop, clickedText) {
        this.$data[prop] = clickedText;
        this.closeDropdowns();
      },
      closeDropdowns() {
        for (const item in this.dropdowns) {
          this.dropdowns[item] = false;
        }
      },
    },
    computed: {
      reservationDataToRender() {
        let data = this.reservationDataAll;

        const removeCustomerData = (obj) => {
          let newObj = {};
          Object.keys(obj).forEach(key => {
            if (key === 'customer_data') return;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              newObj[key] = removeCustomerData(obj[key]);
            } else {
              newObj[key] = obj[key];
            }
          });
          return newObj;
        };

        let newData = removeCustomerData(data);

        return newData;

      },
    },
    watch: {
      selectedCategory(newVal, oldVal) {

       let newArray = [];
       if (this.selectedCategory === 'Kunden GWG') {
          Object.entries(this.reservationData.externalGWG.customer_data).forEach(([key, field]) => {
            newArray.push('Kunden Email: '+key);
          });
          if ( newArray.length === 1 ) {
            this.selectedCustomer = newArray[0];
          }
         this.getDropdownCustomerSelection = newArray;

       }

        if ( newVal.includes('Finanzen') ) {
          this.uploads = {
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
            },
          };
          this.uploadCategory = [
            'Kontoauszug',
            'Schreiben der Bank zur Bestätigung der entsprechenden Mittel',
            'Aufnahme / Bild des Banksaldos',
            'Eigene Angabe'
          ];
        } else {

          if ( newVal === 'Reservierung' || newVal === 'Kaufvertrag' || newVal.includes('GWG') ) {

            this.uploadCategory = [
              'Finale Datei'
            ];

            this.uploads = {
              1: {
                category: 'Kategorie auswählen',
                uploadFiles: [],
                valid: true,
              }
            };

          } else {

            this.uploadCategory = [
              'Kundendateien',
              'Finale Datei'
            ];

            this.uploads = {
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
            };

          }

        }
      },
      uploadCount: function() {
        this.$parent.uploadCount = this.uploadCount;
      },
      reservationData(newVal) {
        this.reservationDataAll = newVal
      }
    },
  }
</script>


<template>

  <div class="file-overview">

    <div class="add-button" @click="activeFileCreateArea = !activeFileCreateArea" v-if="!activeFileCreateArea">
      <span class="icon">
        <PlusIcon></PlusIcon>
      </span>
      <span style="margin-left: 15px;">Dateien Hinzufügen</span>
    </div>

    <div class="file-category" v-for="(key, index) in reservationDataToRender" v-if="!activeFileCreateArea">

      <div class="title">
        <span>
          {{ renderCategoryName(index) }}
        </span>
      </div>

      <div class="files" v-for="(fileData, fileLabel) in key">

        <div class="file-label">{{ renderFileLabel(fileLabel) }}:</div>

        <TransitionGroup name="fadein">
        <div class="single-file" v-for="(singleFile, fileIndex) in fileData" v-if="fileData.length > 0">
          <a :href="this.currentEnv.url+(this.localPathToBackendUrl(singleFile))" target="_blank" :key="'file'+fileIndex">
            <div class="file">
              - {{ renderFileName(singleFile) }}
            </div>
          </a>

          <div class="actions" :key="'file-action'+fileIndex">
            <a :href="this.currentEnv.url+(this.localPathToBackendUrl(singleFile))" target="_blank">
              <LinkIcon style="margin-right: 10px;"></LinkIcon>
            </a>
            <DeleteIcon style="color: var(--red);" @click="triggerArchive(singleFile)"></DeleteIcon>
          </div>
        </div>
        <div class="single-file no-results" v-else>
            <div>
              - Keine Dateien gefunden
            </div>
        </div>
        </TransitionGroup>

      </div>

    </div>

    <div class="upload-wrapper" v-if="activeFileCreateArea">
      <span>
        <InputField class="dropdown-input" inputType="text" inputName="UploadCat" :inputValue="selectedCategory" v-model="selectedCategory" @click="toggleDropdowns('selectedCategory')" @focus="setDropdownTop($event)" @click.stop=""></InputField>
        <label class="ph">Bereich auswählen</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown :ref="'dropdownUploadCat'" :class="{active: dropdowns.selectedCategory, relative: dropdownRelativePosition}" type="country" :renderingObject="getDropdownContentCategory" @dropdown-item-clicked="dropdownClick('selectedCategory', $event)" @click.stop=""></Dropdown>
      </span>

      <span v-if="selectedCategory === 'Kunden GWG' && getDropdownCustomerSelection.length > 1">
        <InputField class="dropdown-input" inputType="text" inputName="CustomerSelection" :inputValue="selectedCustomer" v-model="selectedCustomer" @click="toggleDropdowns('selectedCustomer')" @focus="setDropdownTop($event)" @click.stop=""></InputField>
        <label class="ph">Kunden auswählen</label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown :ref="'dropdownCustomerSelection'" :class="{active: dropdowns.selectedCustomer, relative: dropdownRelativePosition}" type="country" :renderingObject="getDropdownCustomerSelection" @dropdown-item-clicked="dropdownClick('selectedCustomer', $event)" @click.stop=""></Dropdown>
      </span>

      <UploadFieldsWithCategories :uploads="uploads" :categories="uploadCategory" :selectedCategory="selectedCategory" v-if="selectedCategory !== ''"></UploadFieldsWithCategories>

      <div class="upload-actions">
        <Button type="delete" @click="activeFileCreateArea = false; selectedCategory = ''">Abbrechen</Button>
        <Button type="report" @click="startAddFiles">Hinzufügen</Button>
      </div>
    </div>

  </div>

</template>


<style scoped>

.file-overview .file-category + .file-category {
  margin-top: 25px;
}

.file-overview .file-category .title {
  display: flex;
  text-align: center;
  font-weight: 700;
}

.file-overview .file-category .title > span {
  background-color: white;
  padding: 5px 10px 5px 0;
}

.file-overview .file-category .title:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  background-color: var(--light-light-gray);
  width: 100%;
  z-index: -1;
}


.file-overview .file-category .files {
  display: flex;
  flex-wrap: wrap;
}

.file-overview .file-category .files .single-file:not(.no-results):hover {
  background-color: var(--light-light-gray);
}

.file-overview .file-category .files .single-file {
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
  padding: 10px;
}

.file-overview .file-category .files .single-file a {
  color: var(--blue);
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: end;
  color: var(--blue);
  cursor: pointer;
}

.add-button .icon {
  background-color: var(--blue);
  border-radius: 100%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.upload-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 25px;
}

.upload-actions > div {
  flex-basis: 48%;
}

.file-label {
  flex-basis: 100%;
}

.upload-wrapper > span {
  display: block;
  margin-bottom: 15px;
}

</style>
