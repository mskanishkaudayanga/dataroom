<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";

  export default {
    name: "canbanModalEditLeadBackToLV",
    components: {AnimateCircleIcon, Button, Dropdown, AsterixMarkIcon, DropdownArrow, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.id,
        destributeProcess: false,
      }
    },
    methods: {
      sendLeadBackToLV() {

        // if ( !this.destributeProcess ) {
        //   this.destributeProcess = true;
        //   return;
        // }

        if (this.isLoading) {
          return;
        }

        this.isLoading = true;

        let dataToSend = {
          'activityId': this.activityId
        };

        axios.post(this.globalApiBaseUrl + '/canban/leadBackToLV', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Lead erfolgreich an Leadverteiler gesendet');
                  } else {
                    this.notificationBannerInit('warning', 'Lead konnte an Leadverteiler gesendet werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Lead konnte an Leadverteiler gesendet werden');
                }
            ).finally(
            () => {
              this.isLoading = false;
            })
      },
      closeDropdowns() {
        for (const index in this.dropdownsEditUploads) {
          this.dropdownsEditUploads[index] = false;
        }
      },
      resetData() {
        this.isOpenModal = true;
        this.isLoading = false;
        this.activityId = this.$route.params.id;
        this.destributeProcess = false;
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
      closeModal(){
        this.resetData();
        this.$router.push({name: 'canbanToolDeniedLeads'})
      },
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
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
      dropdownClick(field, clickedText) {
        this.$data[field] = clickedText;
        this.closeDropdowns();
      },
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Lead in den Leaderverteiler senden</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <div class="actions">
          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button type="report"  @click="sendLeadBackToLV">Lead zurücksenden <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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

.verkaufsmeldung-data, .process-tabs-wrapper {
  display: flex;
  justify-content: space-between;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

.process-tabs-wrapper, .real-estates-list, .modal-body {
  margin-top: 40px;
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
