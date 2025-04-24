<script>
  import axios from "axios";
  import DeleteIcon from "../icons/icon-delete.vue";
  import EditIcon from "../icons/icon-edit.vue";
  import InputField from "@/components/forms/InputField.vue";
  import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";
  import CloseIcon from "@/components/icons/icon-close.vue";

  export default {
    name: "RealEstateList",
    components: {CloseIcon, CheckmarkIcon, InputField, EditIcon, DeleteIcon},
    props: {
      reservationId: Number,
      showEditFunctions: Object,
      realEstateObject: Object,
    },
    data() {
      return {
        apiResponseStatus: false,
        realEstateData: this.realEstateObject ? this.realEstateObject : '',
        editMode: false,
      }
    },
    methods: {
      getReservationsRealEstates( reservationId ) {
        let data = JSON.stringify({
          "reservationId": reservationId
        });
        this.$emit('apiRealEstatesIsLoading', true);
        axios({ method: 'post', url: this.globalApiBaseUrl + '/reservations/getReservationsRealEstate', data: data })
            .then(
                (response) => {
                  this.realEstateData = response.data.response;

                  for ( const index in this.realEstateData ) {
                    if ( this.realEstateData[index].estate_commission === null || this.realEstateData[index].estate_commission === undefined || this.realEstateData[index].estate_commission === '' ) {
                      this.realEstateData[index].estate_commission = '0%';
                    }
                  }

                  this.apiResponseStatus = this.checkValideApiResponse(response.data);
                  this.pushRealEstatesToParentData(response.data.response);
                  this.$parent.apiRealEstates = this.realEstateData;
                  this.getOnOfficeRealEstateData();
                }
            )
            .catch(
                (error) => {
                  this.realEstateData = error;
                }
            )
      },
      pushRealEstatesToParentData(realEstateObject) {
        if ( realEstateObject ){
          this.$emit('apiRealEstates', realEstateObject);
        }
      },
      getOnOfficeRealEstateData() {

        for ( const index in this.realEstateData ) {
          if ( (typeof this.realEstateData[index]['discount_approved_value'] !== 'undefined' && this.realEstateData[index]['discount_approved_value'] && this.realEstateData[index]['discount_approved_value'] !== '') || (this.realEstateData[index]['commission_approved_value'] !== null || this.realEstateData[index]['commission_approved_value'] !== '') ) {
            axios.get(this.globalApiBaseUrl + '/onoffice/getSingleRealEstate?systemid='+this.realEstateData[index].real_estate_sys_id)
                .then(
                    (response) => {
                      if ( response.data.status === 200 ){
                        this.realEstateData[index].beurkundet_price = response.data.response.real_estates[0].real_estate_beurkundeter_price;
                        this.realEstateData[index].estate_commission = response.data.response.real_estates[0].real_estate_commission.includes('%') ? response.data.response.real_estates[0].real_estate_commission : response.data.response.real_estates[0].real_estate_commission+' %';
                        let numericStr = this.realEstateData[index].estate_commission.replace(/[^0-9]/g, "");
                        if ( numericStr === '' ) {
                          this.realEstateData[index].estate_commission = 'Keine';
                        }
                        this.pushRealEstatesToParentData(this.realEstateData);
                      }
                    }
                )
                .catch(
                    (error) => {
                      console.log(error);
                    }
                ).finally(()=>{
                  this.$emit('apiRealEstatesIsLoading', false);
            });
          }
        }
      },
    },
    watch: {
      realEstateData: function (val) {
        for ( const index in val ) {
          if ( typeof val[index].editMode === 'undefined') {
            val[index].editMode = false;
          }
        }
      },
      reservationId: function (val) {
        this.getReservationsRealEstates(this.reservationId);
      }
    },
    mounted() {
      if ( this.reservationId ) {
        this.getReservationsRealEstates(this.reservationId);
      }
    },
  }
</script>


<template>

    <TransitionGroup name="only-fade-in" tag="div">

      <div class="real-estate-list-item" :class="{ 'show-edit-actions': showEditFunctions }" v-if="apiResponseStatus || realEstateData" v-for="realEstate in realEstateData" :key="realEstate.estate_nr">

        <div class="row-wrapper">
          <div class="row">
            <div class="real-estate-nr">{{ realEstate.estate_nr }}</div>
            <div style="display: flex;" v-if="!realEstate.editMode">
              <div class="real-estate-rent-status" style="margin-right: 10px">Provi: {{realEstate.estate_commission }}</div>
              <div class="real-estate-rent-status">{{ (realEstate.estate_rent === '0' || !realEstate.estate_rent || realEstate.estate_rent === 'false') ? 'frei' : 'vermietet' }}</div>
            </div>

            <div class="edit-fields" v-if="realEstate.editMode">
              <InputField inputType="text" inputName="RealEstateCommision" :inputValue="realEstate.estate_commission.replace('%','')" v-model="realEstate.estate_commission"></InputField>
            </div>

          </div>

          <div class="row" v-if="!realEstate.editMode">
            <div class="real-estate-price">
              <span :class="{'crosslined-text': realEstate.beurkundet_price && realEstate.beurkundet_price >= 0 && parseInt(realEstate.estate_price) !== realEstate.beurkundet_price  ? true : false}" style="display: inline-block;">{{ this.numberWithComma(realEstate.estate_price) }} {{ this.$currency }}</span>
              <span style="display: inline-block; margin-left: 5px;" v-if="realEstate.beurkundet_price && parseInt(realEstate.estate_price) !== realEstate.beurkundet_price">{{ this.numberWithComma(realEstate.beurkundet_price) }} {{ this.$currency }}</span>
            </div>
            <div class="real-estate-fee">{{ this.numberWithComma(realEstate.estate_fee) }} {{ this.$currency }}</div>
          </div>
        </div>

        <div class="edit-actions" v-if="(showEditFunctions.edit || showEditFunctions.delete) && !realEstate.editMode">
          <EditIcon v-if="showEditFunctions.edit" @click="realEstate.editMode = true"></EditIcon>
          <DeleteIcon v-if="showEditFunctions.delete" @click="$emit('realEstateDelete', realEstate.estate_nr)"></DeleteIcon>
        </div>
        <div class="edit-actions" v-if="realEstate.editMode">
          <CheckmarkIcon @click="saveNewRealEstatePrice(realEstate.real_estate_id)"></CheckmarkIcon>
          <CloseIcon @click="realEstate.editMode = false"></CloseIcon>
        </div>

      </div>

    </TransitionGroup>

</template>


<style scoped>

</style>
