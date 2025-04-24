<script>
import LoginView from "./views/LoginView.vue";
import axios from "axios";
import AlertMessage from "./components/card/AlertMessage.vue";
import {userRolesStore} from "@/stores/userRoleStore";
import {agentsStore} from "@/stores/agentsStore";
import PatchNotes from "@/components/patchNotes/patchNotes.vue";
import {patchNoteUserStore} from "@/stores/patchNoteUserStore";
import {userStore} from "./stores/userStore";

export default {
  components: {PatchNotes, LoginView, AlertMessage},
  data() {
    return {
      notificationBanner: {
        show: false,
        type: '',
        content: '',
      },
      apiAgentsResponse: [],
      isLoadingUserData: true,
      showPatchNotes: false,
      patchNoteTimer: null,
      patchNoteDataLoaded: false,
      currentRouterName: '',
    }
  },
  beforeMount(){
    this.checkApiValidation();
    this.getAllPatchNotes();
    this.patchNoteTimer = setInterval(() => {
      this.getAllPatchNotes();
    }, 10 * 60 * 1000); // every 10 minutes
  },
  beforeDestroy() {
    if (this.patchNoteTimer) {
      clearInterval(this.patchNoteTimer);
    }
  },
  mounted() {
    this.getAllReportData();
  },
  methods: {
    getAllReportData() {
      // let dataToSend = {
      //   dateFrom: '2023-01-01',
      //   dateTo: '2024-01-01'
      // }
      // axios.post(this.globalApiBaseUrl + '/reservations/getReservationDataByDateRange', dataToSend)
      //     .then( (response) => {
      //       if ( response.data.status === 200 ){
      //         console.log(response.data.response);
      //       }
      //     })
      //     .catch(error => console.log(error));
    },
    checkApiValidation(){
      if ( window.location.pathname === '/ndb' || window.location.pathname === '/gwgex' || window.location.pathname === '/finances' || window.location.pathname === '/feedback' ){
        this.isLoadingUserData = false;
        return false;
      }
      // let userStorage = userStore();
      // userStorage.setUserMicroserviceToken();

      this.isLoadingUserData = true;
      axios.post(this.globalApiBaseUrl + '/auth')
          .then( (response) => {
            if ( response.data.status === 200 ){
              const store = userRolesStore();
              store.setUserRoles(response.data.response.userRoles)
              store.setUserCompany(response.data.response.userCompany)
              store.setUserId(parseInt(response.data.response.id))
              store.setUserOoUsername(response.data.response.ooUsername)
              store.setUserMail(response.data.response.mail)
              if ( typeof response.data.response.userCompany === 'undefined' || response.data.response.userCompany === null) {
                this.logoutUser();
              }
              this.getAllAgents();
              if ( this.$route.name === undefined || ( (response.data.response.id !== undefined && response.data.response.id !== '' ) && this.$route.name === 'login' ) ) {
                this.redirectToHomeView()
              }
            } else {
              this.redirectToLoginView()
            }
            this.isLoadingUserData = false;
          })
          // .then(response => response.data.status === 200 ? this.redirectToHomeGWGExternal() : this.redirectToLoginView())
          .catch( (error) => {
                this.redirectToLoginView();
                this.isLoadingUserData = false;
            }
          );
    },
    getAllAgents() {
      axios.get(this.globalApiBaseUrl + '/onoffice/getAllUsersByCompany?company=all')
          .then(
              (response) => {
                if ( response.data.status === 200 ){
                  const store = agentsStore();
                  store.setAllAgents(response.data.response);
                  this.apiUsersResponse = response.data.response;
                }
              }
          ).catch(
          (error) => {
            console.log(error);
          }
      );
    },
    handlePatchNotes(){

      // TODO active patchnotes as soon as they are ready
      // const store = patchNoteUserStore();
      // if ( typeof store.getLastSeenPatchNote === 'undefined' || store.getLastSeenPatchNote === null || store.getLastSeenPatchNote === '' ) {
      //   this.showPatchNotes = true;
      // }
      //
      // if ((typeof store.getLastSeenPatchNote !== 'undefined' && store.getLastSeenPatchNote !== null && store.getLastSeenPatchNote !== '') && (typeof store.getLatestPatchNoteDate !== 'undefined' && store.getLatestPatchNoteDate !== null && store.getLatestPatchNoteDate !== '')) {
      //   let date1 = new Date(store.getLastSeenPatchNote);
      //   let date2 = new Date(store.getLatestPatchNoteDate);
      //
      //   if (date1 < date2) {
      //     // User did not saw the latest path notes
      //     this.showPatchNotes = true;
      //   }
      // }
    },
    getAllPatchNotes() {
      axios.get(this.globalApiBaseUrl + '/system/getPatchNotes')
          .then(
              (response) => {
                const store = patchNoteUserStore();
                if ( response.data.status === 200 && typeof response.data.response.length !== 'undefined' && response.data.response.length > 0 ){
                  store.setLatestPatchNoteDate(response.data.response[0].publish_date);
                  this.handlePatchNotes();
                }
              }
          ).catch(
          (error) => {
            console.log(error);
          }
      ).finally(
        () => {
          this.patchNoteDataLoaded = true;
        })
    },
    getAllAgentsRL() {
      axios
          .request({
            method: "POST",
            url: "https://ms.p.bestplace.tools/api/agent/all",
            data: {},
          })
          .then((response) => {
            if (response.status === 200) {
              const storeRL = agentsStoreRL();
              storeRL.setAllAgentsRL(response.data);
              this.apiAgentsRLResponse = response.data;
            }
          })
    },
  },
  watch: {
    $route(to, from){
      // Exec only when this router child component is requested
      this.currentRouterName = to.name;
      if ( to.name === 'canbanTool' || to.name === 'canbanToolUnqualifiedLeads' ){
        document.querySelector('#app').classList = ['canban'];
      } else {
        document.querySelector('#app').classList = [];
      }

    },
  }
}
</script>

<template>
  <div class="notification-banner" :id="currentRouterName" :class="{ 'active': notificationBanner.show }" @click="notificationBanner.show = !notificationBanner.show">
    <div class="content">
      <AlertMessage :alertStatus="notificationBanner.type" :alertText="notificationBanner.content"></AlertMessage>
      </div>
  </div>
  <PatchNotes :isOpenModal="showPatchNotes" v-if="showPatchNotes" @updateIsOpenModal="showPatchNotes = $event"></PatchNotes>
  <RouterView v-if="!isLoadingUserData" />

</template>

<style scoped>

.notification-banner {
  position:fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
  text-align: center;
  background-color: white;
  opacity: 0;
  box-shadow: 0px 5px 10px rgb(102 102 102 / 36%);
  -webkit-box-shadow: 0px 5px 10px rgb(102 102 102 / 36%);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  transition: opacity 0.5s, bottom 0.5s;
  z-index: -9999;
}

.notification-banner.active {
  opacity: 1;
  bottom: 0;
  cursor: pointer;
  z-index: 999999999;
}

.notification-banner .alert-message {
  padding: 25px;
}

.bottom-right-bar {
  position: fixed;
  right: 25px;
  bottom: 15px;
  color: white;
  font-size: 30px;
}


.icon-wrapper {
  background-color: var(--blue);
  width:50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 767px) {
  .notification-banner#dataRoomToolNew {
    left: unset;
    right: 25px;
    max-width: 250px;
    top: 25px;
  }
}

</style>
