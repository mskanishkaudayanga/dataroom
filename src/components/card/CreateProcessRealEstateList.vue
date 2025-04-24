<script>
  import axios from "axios";
  import DeleteIcon from "../icons/icon-delete.vue";
  import EditIcon from "../icons/icon-edit.vue";

  export default {
    name: "CreateProcessRealEstateList",
    components: {EditIcon, DeleteIcon},
    props: {
      realEstateData: Object,
      showEditFunctions: false,
    },
  }
</script>


<template>

    <TransitionGroup name="fadein" tag="div">

      <div class="real-estate-list-item" :class="{ 'show-edit-actions': showEditFunctions }" v-if="realEstateData" v-for="realEstate in realEstateData" :key="realEstate.estate_nr">

        <div class="row-wrapper">

          <div class="row">
            <div class="real-estate-nr">{{ realEstate.estate_nr }}</div>
            <div class="real-estate-rent-status">{{ realEstate.estate_rent === '0' ? 'frei' : 'vermietet' }}</div>
          </div>

          <div class="row">
            <div class="real-estate-price">{{ this.numberWithComma(parseInt(realEstate.estate_price)) }} {{ this.$currency }}</div>
            <div class="real-estate-fee">{{ this.numberWithComma(parseInt(realEstate.estate_fee)) }} {{ this.$currency }}</div>
          </div>

        </div>

        <div class="edit-actions" v-if="showEditFunctions">
          <EditIcon></EditIcon>
          <DeleteIcon></DeleteIcon>
        </div>

      </div>

    </TransitionGroup>

</template>


<style scoped>

.real-estate-list-item {
  display: flex;
}

.real-estate-list-item .row-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
  font-size: 12px;
  color: var(--dark-gray-text);
  padding: 5px 0;
}

.real-estate-list-item.show-edit-actions .row-wrapper {
  padding-right: 10px;
}

.real-estate-list-item .row {
  display: flex;
  justify-content: space-between;
  flex-basis:100%;
}

.real-estate-list-item {
  border-bottom: solid 1px white;
}

.real-estate-rent-status {
  background-color: var(--light-gray);
  text-transform: uppercase;
  color: white;
  padding: 0 5px;
  border-radius: 10px;
  font-size: 10px;
}

.edit-actions {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-basis: 80px;
  color: var(--blue);
  font-size: 18px;
  border-left: solid 1px white;
}

</style>
