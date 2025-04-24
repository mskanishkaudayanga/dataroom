<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import EditIcon from "@/components/icons/icon-edit.vue";
  import DeleteIcon from "@/components/icons/icon-delete.vue";
  import RemoveFilterIcon from "@/components/icons/icon-filter-slash.vue";
  import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";

  export default {
    name: "canbanModalCreateEditNotice",
    components: {
      CheckmarkIcon,
      RemoveFilterIcon,
      DeleteIcon, EditIcon, TextAreaField, AnimateCircleIcon, Button, AsterixMarkIcon, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingHistory: false,
        activityId: this.$route.params.id,
        noticeId: '',
        action: 'create',

        newNoticeData: {
          value: '',
          valid: true,
        },

        apiAllNotices: '',
      }
    },
    methods: {
      closeDropdowns() {
        for (const index in this.dropdownsEditUploads) {
          this.dropdownsEditUploads[index] = false;
        }
        for (const index in this.dropdownsCancelReason) {
          this.dropdownsCancelReason[index] = false;
        }
      },
      closeModal(){
        this.$router.push({name: 'canbanTool'})
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
      triggerCanbanReload() {
        this.$emit('reloadNotice', this.makeid(30));
      },
      getNotices(){

        this.isLoadingHistory = true;

        axios.get(this.globalApiBaseUrl + '/canban/getAllAddressNotices?leadId=' + this.activityId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiAllNotices = response.data.response;
                  } else {
                    this.apiAllNotices = '';
                  }
                }
            )
            .catch(
                (error) => {
                }
            ).finally(
            () => {
              this.isLoadingHistory = false;
            })
      },
      submitNotice() {

        if (this.isLoading) {
          return;
        }

        if (this.action !== 'delete'){
          if ( this.newNoticeData.value === '' ){
            this.newNoticeData.valid = false;
            return;
          }
        }

        let dataToSend = {
          'activityId': this.activityId,
          'notice': this.newNoticeData.value,
          'action': this.action,
          'noticeId': this.noticeId
        }

        axios.post(this.globalApiBaseUrl + '/canban/submitNotice', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.newNoticeData.value = '';
                    this.triggerCanbanReload();
                    this.getNotices();
                    this.notificationBannerInit('success', 'Notiz erfolgreich bearbeitet');
                    this.action = 'create';
                  } else {
                    this.triggerCanbanReload();
                    this.notificationBannerInit('warning', 'Ein Fehler ist aufgetreten');
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
              this.notificationBannerInit('warning', 'Ein Fehler ist aufgetreten');
            }
        ).finally(
          () => {
            this.isLoading = false;
          })

      },
      editInit(noticeId, noticeContent) {
        this.action = 'edit';
        this.newNoticeData.value = noticeContent;
        this.newNoticeData.valid = true;
        this.noticeId = noticeId;
      },
      deleteInit(noticeId) {
        this.action = 'delete';
        this.noticeId = noticeId;
      }
    },
    mounted() {
      this.getNotices();
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Notizen</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">


        <div class="field-wrapper" :class="{'invalid': !newNoticeData.valid, 'valid': newNoticeData.valid}" v-if="action !== 'edit'">
          <TextAreaField inputName="notice" :inputVal="newNoticeData.value" v-model="newNoticeData.value"></TextAreaField>
          <label class="ph">Neue Notiz <AsterixMarkIcon></AsterixMarkIcon></label>
        </div>

        <div class="actions" v-if="action !== 'edit'">
          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button type="report" @click="submitNotice">Notiz speichern <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
        </div>

        <AnimateCircleIcon v-if="isLoadingHistory"></AnimateCircleIcon>
        <div class="notice-history" :class="action">
          <div style="margin: 15px 0; font-weight: 700; border-top: solid 1px var(--light-light-gray); padding-top: 15px;" v-if="action !== 'edit'">
            Alle Notizen
          </div>
          <div  v-if="(apiAllNotices.length === 0 || apiAllNotices === '') && !isLoadingHistory">
            Keine Notizen gefunden
          </div>
          <TransitionGroup name="fadein">
            <div class="notice-item" v-for="notice in apiAllNotices" :key="notice.id">
              <div class="notice-header" style="font-weight: 400; font-size: 12px;" v-if="action !== 'edit'">
                Vom {{this.englishDateWithTimeToGermanDate(notice.create_date)}}
              </div>
              <div class="notice-content" v-if="action !== 'edit'">{{notice.notice}}</div>
              <div class="notice-item-actions" v-if="action !== 'edit'">
                <EditIcon @click="editInit(notice.id, notice.notice)" v-if="action !== 'delete'"></EditIcon>
                <DeleteIcon @click="deleteInit(notice.id)" style="color: var(--red)" v-if="action !== 'delete'"></DeleteIcon>
                <div class="delete-icons-process" v-if="action === 'delete' && noticeId === notice.id">
                  <CheckmarkIcon @click="submitNotice"></CheckmarkIcon>
                  <CloseIcon @click="action = 'create'"></CloseIcon>
                </div>
              </div>
            </div>
          </TransitionGroup>
          <div style="flex-basis: 100%; margin-top: 15px;" v-if="action === 'edit'">
            <div class="field-wrapper" :class="{'invalid': !newNoticeData.valid, 'valid': newNoticeData.valid}">
              <TextAreaField inputName="notice" :inputVal="newNoticeData.value" v-model="newNoticeData.value"></TextAreaField>
              <label class="ph">Notiz bearbeiten<AsterixMarkIcon></AsterixMarkIcon></label>
            </div>
            <div class="actions" style="flex-basis: 100%;">
              <Button type="delete" @click="action = 'create'">abbrechen</Button>
              <Button type="report" @click="submitNotice">Notiz bearbeiten <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>

</template>


<style scoped>

.title {
  font-size: 18px;
  font-weight: 700;
}

i {
  cursor: pointer;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.notice-item .notice-content {
  flex-basis: 85%;
}

.notice-item .notice-header {
  flex-basis: 100%;
}

.notice-item-actions {
  color: var(--blue);
}

.create .notice-item + .notice-item,
.delete .notice-item + .notice-item {
  margin-top: 15px;
  padding-top: 15px;
  border-top: solid 1px var(--light-light-gray);
}

.notice-item-actions i + i {
  margin-left: 10px;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

.process-tabs-wrapper, .real-estates-list, .modal-body {
  margin-top: 40px;
}

.invalid textarea {
  border-left: 5px solid red;
}

.verkaufsmeldung-data:first-of-type > div:last-of-type {
  text-align: right;
}

.verkaufsmeldung-data > div {
  flex-basis: 48%;
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

.actions .button.full-width {
  flex-basis: 100%;
}

.notice-content {
  word-break: break-word;
}

.actions.delete-init .button:last-of-type,
.actions.report-init .button:last-of-type,
.actions.approve-init .button:last-of-type{
  flex-basis: 48%;
  margin-bottom: 15px;
}

iframe {
  width: 100%;
  height: 70vh;
}

.iframe-view .actions.approve-init .button:last-of-type {
  flex-basis: 100%;
}

.actions.approve-init.reject-init .button:last-of-type {
  flex-basis: 48%;
}

.option-wrapper {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  padding: 25px 0;
  border-top: dotted 1px var(--light-gray);
  border-bottom: dotted 1px var(--light-gray);
}

.option-wrapper + .option-wrapper {
  border-top: none;
  margin-top: 0;
}

.option-wrapper .checkbox {
  flex-basis: auto;
  top: 0;
  margin-top: 0;
}

.real-estates-list {
  height: auto;
  margin-bottom: 25px;
}

.real-estate-list-item {
  border-bottom: none;
}

.fee-conditional {
  margin-bottom: 15px;
}

/* Medium Mobile */
@media (max-width: 500px){
  .verkaufsmeldung-data {
    flex-wrap: wrap;
  }
  .verkaufsmeldung-data > div {
    flex-basis: 100%;
  }
  .verkaufsmeldung-data:last-of-type {
    display:none;
  }
  .additional + .additional {
    margin-top: 10px;
  }
  .real-estate-list-item .row {
    flex-wrap: wrap;
  }
  .real-estate-list-item .row > div {
    flex-basis: 100%;
  }
  .verkaufsmeldung-data > div b {
    display: block;
  }
}


</style>
