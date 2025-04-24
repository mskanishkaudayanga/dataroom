<script>
// Importing components needed for this component
import axios from "axios";
import CloseIcon from "@/components/icons/icon-close.vue";
import InputField from "@/components/forms/InputField.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import Button from "@/components/buttons/button.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
import {patchNoteUserStore} from "@/stores/patchNoteUserStore";
import ArrowLeftIcon from "@/components/icons/icon-arrow-left.vue";

  export default {
    name: "patchNotes",
    components: {
      ArrowLeftIcon,
      AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    props: {
      isOpenModal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isLoading: false,
        patchNotes: [],
        noteIndexToRender: 0,
        activeTab: 'cockpit',
        isOverviewActive: false,
      }
    },
    methods: {
      // Fetches all the patch notes from the API
      getAllPatchNotes() {
        if (this.isLoading) {
          return;
        }
        this.isLoading = true;
        axios.get(this.globalApiBaseUrl + '/system/getPatchNotes')
            .then(
                (response) => {
                  const store = patchNoteUserStore();
                  // Update the patch notes if the response was successful
                  if ( response.data.status === 200 ){
                    this.patchNotes = response.data.response;
                    // updates the latest patch note date in the store
                    store.setLatestPatchNoteDate(this.patchNotes[0].publish_date);
                  } else {
                    // clear patch notes if response was not successful
                    this.patchNotes = [];
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
            }
        ).finally(
            () => {
              // Release the loading state
              this.isLoading = false;
            })
      },
      // Closes all open dropdowns
      closeDropdowns() {
        this.isOpenModal = false;
      },
      // Resets data back to initial state
      resetData() {
        this.isOpenModal = true;
        this.isLoading = false;
        this.activityId = this.$route.params.id;
        this.company = this.$route.params.company;
        this.apiUsersResponse = [];
        this.selectedAgent = '';
        this.dropdownsEditUploads = {
          showAgentsDropdown: false,
        };
        this.dropdownRelativePosition = false
      },
      // Generates random ID with a specified length
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
      // Closes the modal and sets the last time a patch note was seen
      closeModal(){
        const date = new Date();
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);
        const store = patchNoteUserStore();
        store.setLastSeenPatchNote(year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);

        this.$emit('updateIsOpenModal', false); // Emit event to parent component
      },
      // Triggers reload of the Kanban board with a random ID
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
      // Sets the dropdown at an appropriate position
      setDropdownTop($event) {
        const eleName = $event.target.name;
        const additionalSpace = 5;
        if ( this.$refs['input'+eleName] !== undefined ) {
          this.$refs['dropdown'+eleName].$el.style.top = this.$refs['input'+eleName].$el.clientHeight + additionalSpace + 'px';
        }
        if ( !this.isInViewport(this.$refs['dropdown'+eleName].$el) ) {
          this.dropdownRelativePosition = true;
          this.$refs['dropdown'+eleName].$el.style.top = '0px';
        } else {
          this.dropdownRelativePosition = false;
        }
      },
      // Handles dropdown click event
      dropdownClick(field, clickedText) {
        this.$data[field] = clickedText;
        this.closeDropdowns();
      },
      // Renders parsed JSON note content
      renderNoteContent(data){
        return JSON.parse(data);
      },
      // Handles tab change
      triggerTabChange(event) {
        let toolName = event.target.getAttribute('id');
        this.activeTab = toolName;
      },
      // Return string with first letter capitalize
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      updateIniActiveTab() {
        const routerView = this.$route.name;
        if ( routerView === 'home' ) {
          this.activeTab = 'cockpit';
        } else if ( routerView === 'realEstatesFilteringTool' ) {
          this.activeTab = 'filtertool';
        } else if ( routerView === 'canbanTool' ) {
          this.activeTab = 'salestool';
        } else if ( routerView === 'dataRoomTool' ) {
          this.activeTab = 'dataroom';
        } else if ( routerView === 'kaufpreis-list' ) {
          this.activeTab = 'salespricelist';
        } else if ( routerView === 'reporting' ) {
          this.activeTab = 'reporting';
        }
      }
    },
    computed: {
      userAllowedTools() {

        if ( this.noteIndexToRender === '' ) {
          return;
        }

        // Define the initial list of allowed tools
        let allowedTools = [
          'filtertool',
          'dataroom',
          'salestool'
        ];
        // Check for user's company, role and id to extend the allowed tools
        let userCompany = this.getUserCompany();
        let userId = this.getUserId();
        let userRole = this.getUserRole();

        // If user belongs to 'living' company or user is an agent for Cockpit, add 'cockpit' to the allowed tools
        if (userCompany === 'living' || userId === 32 || this.kgAgentsForCockpit.includes(this.getUserMail())) {
          allowedTools.push('cockpit');
        }

        // If user belongs to 'living' company, add 'salespricelist' to the allowed tools
        if (userCompany === 'living') {
          allowedTools.push('salespricelist');
        }

        // If user's role is 4 or user's id is 50, add 'reporting' to the allowed tools
        if (userRole === 4 || userId === 50) {
          allowedTools.push('reporting');
        }

        // Get the notes from the patchNotes object of the currently rendered note index.
        let notes = this.patchNotes[this.noteIndexToRender].notes;

        // Iterate over the keys in the notes
        // Delete the note if the key is not in the allowedTools list
        Object.keys(notes).forEach(key => {
          if (!allowedTools.includes(key)) {
            delete notes[key];
          }
        });

        // Return the updated notes
        return notes;

      }
    },
    mounted() {
      this.getAllPatchNotes();
      this.updateIniActiveTab();
    },
  }
</script>


<template>
  <div v-if="isOpenModal" class="modal-wrapper active">

    <div class="modal-inner-wrapper">
      <div class="modal-header">
<!--        <div class="show-all-notes" @click="isOverviewActive = true;"><ArrowLeftIcon></ArrowLeftIcon> Alle Notes anzeigen</div>-->
        <h4 class="title">Patch Notes</h4>
        <CloseIcon @click="closeModal"/>
      </div>

      <div class="loading-view" v-if="isLoading">
        <AnimateCircleIcon></AnimateCircleIcon>
      </div>

      <div class="modal-body" v-else>

        <div v-if="patchNotes.length > 0" class="patchnotes">
          <div class="note" v-for="(key, index) in patchNotes" :class="{'active-note': index === noteIndexToRender}">
            <div class="note-meta-data" @click="noteIndexToRender = index === noteIndexToRender ? '' : index">
              <h5 class="note-title">{{ key.title }} <DropdownArrow></DropdownArrow></h5>
              <p class="note-publish-date" v-show="index === noteIndexToRender">Veröffentlicht am: {{ englishDateWithTimeToGermanDate(key.publish_date) }}</p>
              <p class="note-modify-date" v-show="index === noteIndexToRender">Geändert am: {{ englishDateWithTimeToGermanDate(key.modify_date) }}</p>
            </div>
            <div v-if="index === noteIndexToRender">
              <div class="note-tabs">
                <Button v-for="(noteContents, toolName) in key.notes"
                        :type="toolName === activeTab ? 'report': 'edit'"
                        @click="activeTab = toolName"
                        :ref="toolName"
                        :id="toolName"
                        :key="toolName"
                        class="note-tab">
                  {{ toolName === 'salespricelist' ? 'Kaufpreisliste' : capitalizeFirstLetter(toolName) }}
                </Button>
              </div>
              <div class="note-wrapper" v-for="(noteContents, toolName) in userAllowedTools" :key="toolName">
                <div v-for="(noteContent, contentCategorie) in noteContents"
                     v-if="toolName === activeTab"
                     :ref="toolName"
                     :key="toolName + contentCategorie"
                     class="note-content">
                  <div class="note-categorie">{{ capitalizeFirstLetter(contentCategorie) }}:</div>
                  <span v-if="noteContent !== null" v-html="renderNoteContent(noteContent)"></span>
                  <span v-else>Keine Änderungen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 25px;" v-else>
          <b>Aktuell keine Patchnotes vorhanden.</b>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.loading-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}

.loading-view .loading-animation {
  font-size: 40px;
  margin-left: 0;
}

.title,
.note-categorie,
.note-meta-data .note-title {
  font-weight: 700;
}

.note-meta-data .note-title {
  font-size: 16px;
  flex-basis: 100%;
  text-align: center;
  padding: 15px 0;
  color: var(--blue);
  cursor: pointer;
}

.note-meta-data .note-title:hover {
  background-color: var(--light-light-gray);
}

.title {
  font-size: 18px;
}

.note-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  border-bottom: solid 1px var(--light-light-gray);
  margin: 15px 15px 15px 0;
  font-size:12px;
  padding-bottom:25px;
}

.note-tabs > div {
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 10px 10px 0;
}

.note-tabs .note-tab.active {
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
}

.note-wrapper .note-content {
  padding: 25px;
}

.note-wrapper .note-content:first-of-type {
  padding-top: 10px;
}

.note-wrapper .note-content + .note-content {
  border-top: solid 1px var(--light-light-gray)
}

.note-meta-data {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  justify-content: space-between;
}

.note.active-note .note-title i {
  transform: rotate(180deg);
}

.note + .note {
  border-top: solid 1px var(--light-light-gray);
}

.slide-down-enter-active {
  transition: all 0.3s ease;
}

.slide-down-enter, .slide-down-leave-to {
  transform: translateY(-100%);
}

.slide-down-leave-active, .slide-down-leave-to {
  display: none;
}
@media (max-width: 767px) {
  .note-tabs {
    justify-content: flex-start;
  }
}

</style>
