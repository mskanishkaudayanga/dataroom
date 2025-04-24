<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import InputField from "@/components/forms/InputField.vue";
  import Button from "@/components/buttons/button.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import {leadsFilterStore} from "@/stores/leadsFilterStore";
  import {leadsStore} from "@/stores/leadsStore";
  import {userRolesStore} from "@/stores/userRoleStore";

  export default {
    name: "canbanModalFilters",
    components: {TextAreaField, AnimateCircleIcon, Button, InputField, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,

        allLeadData: [],

        filters: {
          company: this.getUserRole() === 4 ? 'all' : this.getUserCompany(),
          projects: [],
          agents: [],
          source: []
        },

        allFilterData: [],

        userRole: 0,

        submitProcess: false,

        filtersLoadedFinal: false,
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
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
      closeModal(){
        this.$router.push({name: 'canbanTool'})
      },
      startFilter() {
        let store = leadsFilterStore();
        store.setLeadFilter(this.filters);
        store.setOffset(0);
        this.triggerCanbanReload();
        this.closeModal();
      },
      resetFilters() {
        let store = leadsFilterStore();
        let filtersReset = {
          company: this.getUserRole() === 3 ? 'all' : this.getUserCompany(),
          projects: [],
          agents: [],
          source: []
        }
        const userStore = userRolesStore();

        if ( this.CanbanDoubleCompanyAgent.includes(userStore.getUserOoUsername) ) {
          filtersReset.company = 'all';
        }

        this.filters = filtersReset;
        store.setLeadFilter(filtersReset);
        store.setOffset(0);
        this.triggerCanbanReload();
        this.closeModal();
      },
      renderMaklerFullname(maklerShortname) {
        let agentsData = this.getAgentsDataByShortname(maklerShortname);
        if ( typeof agentsData === 'object' ) {
          if ( typeof agentsData.user_Nachname !== 'undefined' ) {
            return agentsData.user_Nachname;
          } else if ( typeof agentsData.user_Name !== 'undefined' )
          return agentsData.user_Name;
        } else {
          return agentsData
        }
      },
      setActiveFilters() {
        this.filters = this.getAllLeadsFilterData();
      },
      getAllFilters() {

        if ( this.filtersLoadedFinal ) {
          return;
        }

        this.isLoading = true;

        axios.get(this.globalApiBaseUrl + '/canban/getAllPossibleFilters')
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.allFilterData = response.data.response;
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
              this.filtersLoadedFinal = true;
            }
        )
      }
    },
    mounted() {
      this.getAllFilters();
      this.setActiveFilters();
      this.userRole = this.getUserRole();

      const userStore = userRolesStore();

      if ( this.CanbanDoubleCompanyAgent.includes(userStore.getUserOoUsername) ) {
        this.filters.company = 'all';
      }

    },
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Leads filtern</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body" v-if="filtersLoadedFinal">

        <form class="lead-data">

          <div class="title-seperator" v-if="userRole >= 4"><span>Unternehmen</span></div>
          <div class="field-wrapper radios" v-if="userRole >= 4">
            <label for="companyAll" class="radio-wrapper">
              <InputField inputType="radio" id="companyAll" inputName="companyAll" value="all" :inputValue="filters.company" v-model="filters.company"></InputField>
              Alle
            </label>
            <label for="companyKG" class="radio-wrapper">
              <InputField inputType="radio" id="companyKG" inputName="companyKG" value="kg" :inputValue="filters.company" v-model="filters.company"></InputField>
              KG
            </label>
            <label for="companyLiving" class="radio-wrapper">
              <InputField inputType="radio" id="companyLiving" inputName="companyLiving" value="living" :inputValue="filters.company" v-model="filters.company"></InputField>
              Living
            </label>
          </div>

          <div class="title-seperator"><span>Projekte</span></div>
          <div class="field-wrapper checkboxes">
            <span v-for="index in allFilterData.projects">
              <input class="checkbox field" type="checkbox" :id="'filter-project-'+index" :value="index" v-model="filters.projects">
              <label :for="'filter-project-'+index">{{ index }}</label>
            </span>
          </div>

          <div class="title-seperator"><span>Kanäle</span></div>
          <div class="field-wrapper checkboxes">
            <span v-for="index in allFilterData.source">
              <input class="checkbox field" type="checkbox" :id="'filter-source-'+index" :value="index" v-model="filters.source" v-if="index !== ''">
              <label :for="'filter-source-'+index" v-if="index !== ''">{{ index }}</label>
            </span>
          </div>

          <div class="title-seperator" v-if="userRole > 1"><span>Makler</span></div>
          <div class="field-wrapper checkboxes" v-if="userRole > 1">
            <span v-for="index in allFilterData.agents">
              <input class="checkbox field" type="checkbox" :id="'filter-agent-'+index" :value="index" v-model="filters.agents">
              <label :for="'filter-agent-'+index">{{ renderMaklerFullname(index) }}</label>
            </span>
          </div>

        </form>

        <div class="actions">
          <Button type="delete" @click="resetFilters">Zurücksetzen</Button>
          <Button type="report" @click="startFilter">Filtern <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>
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

.field-wrapper.checkboxes {
  /*display: flex;*/
  /*flex-wrap: wrap;*/
  column-count: 3;
}

.field-wrapper.checkboxes > span {
  display: block;
}

.field-wrapper.checkboxes label {
  left: 0;
  cursor: pointer;
}

input[type="checkbox"] {
  position: relative;
  top: 5px;
  border: solid 2px black;
  height: 20px;
  width: 20px;
  padding: 0;
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
