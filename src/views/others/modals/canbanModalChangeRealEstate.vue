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

export default {
  name: "canbanModalChangeRealEstate",
  components: {
    AlertMessage,
    Button, TextAreaField, DropdownArrow, Dropdown, AsterixMarkIcon, InputField, AnimateCircleIcon, CloseIcon},
  data() {
    return {
      isOpenModal: true,
      isLoadingSearch: false,
      isLoading: false,
      activityId: this.$route.params.id,

      searchInput: '',
      apiFoundRealEstates: [],
      selectedRealEstate: [],
      validSubmit: true,

      dropdownsShow: {
        showRealEstateDropdown: false,
      },

      dropdownRelativePosition: false,
    }
  },
  methods: {
    closeDropdowns() {
      for (const index in this.dropdownsShow) {
        this.dropdownsShow[index] = false;
      }
    },
    closeModal() {
      this.$router.push({name: 'canbanTool'});
      this.resetData();
    },
    setDropdownTop($event) {
      const eleName = $event.target.name;
      const additionalSpace = 5;
      if (this.$refs['input' + eleName] !== undefined) {
        this.$refs['dropdown' + eleName].$el.style.top = this.$refs['input' + eleName].$el.clientHeight + additionalSpace + 'px';
      }
      if (!this.isInViewport(this.$refs['dropdown' + eleName].$el)) {
        this.dropdownRelativePosition = true;
        this.$refs['dropdown' + eleName].$el.style.top = '0px';
      } else {
        this.dropdownRelativePosition = false;
      }
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
      this.$emit('reloadCanban', this.makeid(30));
    },
    searchRealEstate() {

      if (this.searchInput && this.searchInput.length >= 3) {

        if (this.isLoadingSearch) {
          return;
        }

        let company = 'living';
        if ( this.activityId.includes('kg_') ) {
          company = 'kg';
        }

        this.isLoadingSearch = true;

        axios.get(this.globalApiBaseUrl + '/onoffice/getRealEstate?searchString=' + this.searchInput + '&company='+company+'&allowStammobject=false')
            .then(
                (response) => {
                  this.apiFoundRealEstates = response.data.response.real_estates;
                  this.dropdownsShow.showRealEstateDropdown = true;
                }
            )
            .catch(
                (error) => {
                }
            ).finally(
            () => {
              this.isLoadingSearch = false;
            })
      }
    },
    submitLead() {

      if (this.isLoading) {
        return;
      }

      if ( this.selectedRealEstate.length === 0 ) {
        this.validSubmit = false;
        return;
      }

      const dataToSend = {
        'activityId': this.activityId,
        'newRealEstate': this.selectedRealEstate,
      };

      this.isLoading = true;

      axios.post(this.globalApiBaseUrl + '/canban/leadChangeRealEstate', dataToSend)
          .then(
              (response) => {
                if (response.data.status === 200) {
                  this.triggerCanbanReload();
                  this.closeModal();
                  this.notificationBannerInit('success', 'Immobilienwechsel erfolgreich');
                } else {
                  this.notificationBannerInit('warning', 'Es ist ein Fehler aufgetreten');
                }
              }
          )
          .catch(
              (error) => {
                console.log(error);
              }
          )
    },
    dropdownClick(field, clickedText) {
      if (field === 'selectedRealEstate') {
        Object.entries(this.apiFoundRealEstates).forEach(([index, value]) => {
          if (value.real_estate_id === clickedText) {
            this.selectedRealEstate = value;
            this.searchInput = value.real_estate_id;
          }
        });
      }
      this.closeDropdowns();
    },
    resetData(holdSearchEntry = false) {
      this.leadForm = {
        isOpenModal: true,
        isLoadingSearch: false,
        isLoading: false,

        searchInput: '',
        apiFoundRealEstates: [],
        selectedRealEstate: [],

        dropdownsShow: {
          showRealEstateDropdown: false,
        },

        dropdownRelativePosition: false,
        }
    },
  },
}
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Lead Immobilie ändern</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form class="lead-data">

          <div class="field-wrapper search" :class="{'invalid': !validSubmit, 'valid': validSubmit}">
            <InputField ref="inputRealEstates" inputType="text" inputPlaceholder="Straße oder Immo-Nr." inputName="RealEstates" :inputValue="searchInput" v-model="searchInput" @input="searchRealEstate" @focus="setDropdownTop($event)"></InputField>
            <label class="ph">Suchen nach Straße oder Immo-Nr. <AsterixMarkIcon></AsterixMarkIcon></label>
            <Dropdown ref="dropdownRealEstates" :class="{active: dropdownsShow.showRealEstateDropdown, relative: dropdownRelativePosition}" type="realEstate" :renderingObject="apiFoundRealEstates" @dropdown-item-clicked="dropdownClick('selectedRealEstate', $event)" @click.stop=""></Dropdown>
            <AnimateCircleIcon v-if="isLoadingSearch"></AnimateCircleIcon>
          </div>

        </form>

        <div class="actions">

          <Button type="delete" @click="closeModal">Schließen</Button>
          <Button type="report" @click="submitLead" data-cy="submit">Immobilie ändern <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>

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

.field-wrapper:not(.search)  {
  display: flex;
  justify-content: space-between;
}

.field-wrapper.radios {
  justify-content: center;
}

.field-wrapper > span {
  flex-basis: 48%;
}

.field-wrapper:not(.two-col) > span {
  flex-basis: 100%;
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

.loading-icon-offers .loading-animation {
  display: inline;
  font-size: 16px;
  margin-left: 5px;
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
