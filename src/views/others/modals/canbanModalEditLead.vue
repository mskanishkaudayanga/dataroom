<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import DataroomForm from "@/components/forms/DataroomForm.vue";
  import NewDataRoomTool from "../newDataRoomTool.vue";

  export default {
    name: "canbanModalEditLead",
    components: {NewDataRoomTool, DataroomForm, TextAreaField, AnimateCircleIcon, Button, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        activityId: this.$route.params.id,
        customerSysId: this.$route.params.customerSysId,

        routerName: this.$route.name,

        apiUsersResponse: [],

        leadData: '',

        typeOf: 'mail',
        notice: '',

        submitProcess: false,

        triggerDropdownClose: '',

        dataroomStep: 0,
      }
    },
    methods: {
      closeDropdowns() {
        this.triggerDropdownClose = this.makeid(30);
        for (const index in this.dropdownsEditUploads) {
          this.dropdownsEditUploads[index] = false;
        }
        for (const index in this.dropdownsCancelReason) {
          this.dropdownsCancelReason[index] = false;
        }
      },
      searchCustomers() {

        this.isLoadingCustomer = true;

        let company = 'kg';
        if ( this.activityId.includes('living_') ) {
          company = 'living';
        }

        axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerDataBySysId?company='+company+'&system_id='+this.customerSysId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {

                    let data = response.data.response;
                    const newObj = {};
                    Object.keys(data).forEach(key => {
                      // Replace 'client_' with 'address_' in the key
                      const newKey = key.replace(/^client_/, 'address_');
                      // Assign the value from the original object to the new key in the new object
                      if ( key === 'client_phone' && !this.isEmpty(data[key]) ) {
                        newObj[newKey] = [data[key]];
                      } else {
                        newObj[newKey] = data[key];
                      }
                    });

                    newObj['dataset'] = newObj;

                    this.apiUsersResponse = newObj;
                    if ( newObj['dataset']?.address_company === undefined || newObj['dataset'].address_company === null || newObj['dataset'].address_company === '' ) {
                      newObj['dataset'].address_company = company;
                    }
                    this.apiUsersResponse = newObj;
                    console.log(newObj);
                  } else {
                    this.apiUsersResponse = [];
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.apiUsersResponse = [];
                }
            ).finally(
            () => {
              this.isLoadingCustomer = false;
            })
      },
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
      closeModal(){
        this.$router.push({name: 'canbanTool'})
      },
      getSingleLeadData() {
        axios.get(this.globalApiBaseUrl + '/canban/getSingleLead?activityId='+this.activityId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.leadData = response.data.response[0];
                    if ( typeof this.leadData.canban_searchcriteria !== 'undefined' && this.leadData.canban_searchcriteria !== '' ) {
                      this.leadData.canban_searchcriteria = JSON.parse(this.leadData.canban_searchcriteria);
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
      submitLead() {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let leadData = {
          "activityId": this.activityId,
          "activityType": this.typeOf,
          "activityNotice": this.notice
        };

        axios.post(this.globalApiBaseUrl + '/canban/leadToFollowUpStatus', leadData)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Lead erfolgreich gespeichert');
                  } else {
                    this.closeModal();
                    this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                }
            ).finally(
              () => {
                this.isLoading = false;
            })

      },
      pushCardToFollowup() {

        let dataToSend = {
          'activityId': this.activityId,
          'agentOoUsername': this.getUserOoUsername(),
        };

        axios.post(this.globalApiBaseUrl + '/canban/leadToFollowUpStatusByMicroservice', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Lead erfolgreich zu nachfassen geschickt');
                  } else {
                    this.notificationBannerInit('warning', 'Lead konnte nicht zu nachfassen geschickt werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                  this.notificationBannerInit('warning', 'Lead konnte nicht zu nachfassen geschickt werden');
                }
            ).finally(
            () => {
              this.isLoading = false;
            })
      },
      updateStep(step) {
        this.dataroomStep = step;
      }
    },
    mounted() {
      this.getSingleLeadData();
      this.searchCustomers();
    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper" :style="dataroomStep === 5 ? 'min-width: 90vw; max-width: 90vw;' : '' ">

      <div class="modal-header">
        <div class="title">{{ routerName === 'canbanModalEditLead' ? 'Lead bearbeiten' : 'Datenraum bearbeiten' }}</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <NewDataRoomTool :customerDatas="apiUsersResponse" :compareSearchCriteria="true" v-if="Object.keys(apiUsersResponse).length > 0" @finished="pushCardToFollowup()" @currentStep="updateStep"></NewDataRoomTool>

<!--        <form class="lead-data" v-if="routerName === 'canbanModalEditLead'">-->

<!--          <div class="field-wrapper radios">-->
<!--            <label for="typeMail" class="radio-wrapper">-->
<!--              <InputField inputType="radio" id="typeMail" inputName="typeMail" value="mail" :inputValue="typeOf" v-model="typeOf"></InputField>-->
<!--              E-Mail-->
<!--            </label>-->
<!--            <label for="typePhone" class="radio-wrapper">-->
<!--              <InputField inputType="radio" id="typePhone" inputName="typePhone" value="phone" :inputValue="typeOf" v-model="typeOf"></InputField>-->
<!--              Telefon-->
<!--            </label>-->
<!--            <label for="typePersonalMeeting" class="radio-wrapper">-->
<!--              <InputField inputType="radio" id="typePersonalMeeting" inputName="typePersonalMeeting" value="personalMeeting" :inputValue="typeOf" v-model="typeOf"></InputField>-->
<!--              Persönliches Treffen-->
<!--            </label>-->
<!--          </div>-->

<!--          <div class="field-wrapper" v-if="typeOf !== 'mail'">-->
<!--            <TextAreaField inputName="notice" :inputVal="notice" v-model="notice"></TextAreaField>-->
<!--            <label class="ph">Bemerkung</label>-->
<!--          </div>-->

<!--        </form>-->

<!--        <DataroomForm :activityIdOrCompany="leadData.aktivititaet_id" :customerSysId="leadData.adresse_id" :projectName="leadData.projekt_name" :triggerDropdownClose="triggerDropdownClose" :leadData="leadData"></DataroomForm>-->

        <div class="actions" v-if="routerName === 'canbanModalEditLead'">
          <Button type="delete" @click="closeModal">Schließen</Button>
<!--          <Button type="report" @click="submitLead" data-cy="submit-lead-to-follow-up">Lead bearbeiten <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>-->
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

.meta-data-top {
  margin-bottom: 25px;
  font-size: 12px;
}

.radio-wrapper {
  cursor: pointer;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

.radios, .radio-wrapper{
  text-align: center;
}

.field-wrapper + .field-wrapper {
  margin-top: 25px;
}

.field-wrapper.two-col {
  display: flex;
  justify-content: space-between;
}

.field-wrapper > span {
  flex-basis: 48%;
}

.radio-wrapper {
  display: inline-block;
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
  flex-basis: 100%;
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

.title-seperator {
  position: relative;
  flex-basis: 100%;
  margin: 25px 0;
  text-align: center;
  z-index: 0;
}

.title-seperator span {
  position: relative;
  padding: 0 15px;
  background: white;
  z-index: 2;
}

.title-seperator:after {
  content: '';
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--light-light-gray);
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
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
