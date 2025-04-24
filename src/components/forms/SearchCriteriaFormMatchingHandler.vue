<script>

import CheckmarkIcon from "../icons/icon-checkmark.vue";
import DeleteIcon from "../icons/icon-delete.vue";

export default {
  name: "SearchCriteriaFormMatchingHandler",
  components: {DeleteIcon, CheckmarkIcon},
  props: {
    activeSearchCriteria: {
      type: [Array, Object],
      default: []
    },
    changes: {
      type: [Array, Object],
      default: []
    },
    activeSearchCriteriaField: {
      type: String,
      default: ''
    },
    fieldToCheck: String,
    fieldKeyToCheck: {
      type: String,
      default: ''
    },
    debug: {
      type: Boolean,
      default: false,
    },
    acceptAllMerged: '',
    rejectAllMerged: ''
  },
  emits: ['watchCountyChange'],
  data() {
    return {
      approveStatus: '',
      fieldWithChanges: {},
      activeSearchCriteriaFieldToCheck: '',
    }
  },
  methods: {
    approve(value) {

      if ( this.renderMatchChecker === null || typeof this.renderMatchChecker === 'undefined' || this.isEmpty(this.changes) ) {
        return;
      }

      let fieldName = this.activeSearchCriteriaFieldToCheck;
      if ( fieldName === 'price' ) {
        fieldName = 'maxBudget'
      }
      if ( fieldName === 'priceDeviation' ) {
        value += '%';
      }

      this.$emit('watchCountyChange', value);
      this.activeSearchCriteria[fieldName].value = value;
      this.approveStatus = true;
      this.updateParentDataMergeStatus(true);

    },
    reject() {

      if ( this.renderMatchChecker === null || typeof this.renderMatchChecker === 'undefined' || this.isEmpty(this.changes) ) {
        return;
      }

      this.approveStatus = false;
      this.updateParentDataMergeStatus(false);

    },
    updateParentDataMergeStatus(status) {
      if ( this.changes[this.activeSearchCriteriaFieldToCheck]?.mergeStatus !== undefined ) {
        this.changes[this.activeSearchCriteriaFieldToCheck].mergeStatus = status;
      }
    }
  },
  computed: {
    renderMatchChecker() {
      let activeSearchCriteriaFieldToCheck = this.isEmpty(this.activeSearchCriteriaField) ? this.fieldToCheck : this.activeSearchCriteriaField

      if ( activeSearchCriteriaFieldToCheck === 'maxBudget' ) {
        activeSearchCriteriaFieldToCheck = 'price'
      }

      this.activeSearchCriteriaFieldToCheck = activeSearchCriteriaFieldToCheck;

      if ( this.fieldToCheck === 'district' || this.fieldToCheck === 'localArea') {

        let isSetValue = false;
        for( let index in this.changes[this.activeSearchCriteriaFieldToCheck]?.value ) {
          if ( this.changes[this.activeSearchCriteriaFieldToCheck]?.value?.[index] !== undefined && this.changes[this.activeSearchCriteriaFieldToCheck]?.value?.[index] !== null ) {
            isSetValue = true;
          }
        }

        if ( !isSetValue ) {
          return ['Alle'];
        }

      }

      if ( activeSearchCriteriaFieldToCheck === 'freeFrom' ) {
        if ( this.changes[this.activeSearchCriteriaFieldToCheck]?.value !== undefined ) {
          return this.germanDateToEnglishDateFormat(this.changes[this.activeSearchCriteriaFieldToCheck].value);
        }
      }

      if ( typeof this.changes[this.activeSearchCriteriaFieldToCheck] !== 'undefined' && this.changes[this.activeSearchCriteriaFieldToCheck]?.value !== undefined ) {
        return this.changes[this.activeSearchCriteriaFieldToCheck].value;
      }
    },
  },
  watch: {
    acceptAllMerged: function(newVal) {
      this.approve(this.renderMatchChecker);
    },
    rejectAllMerged: function(newVal) {
      this.reject();
    }
  },
}
</script>


<template>

<!--  {{this.changes[this.activeSearchCriteriaFieldToCheck]}}-->
<!--  {{renderMatchChecker}}-->

  <div class="wrapper-merge-view" v-if="renderMatchChecker !== null && typeof renderMatchChecker !== 'undefined' && !this.isEmpty(this.changes) && this.changes[this.activeSearchCriteriaFieldToCheck]?.mergeStatus !== undefined && this.changes[this.activeSearchCriteriaFieldToCheck].mergeStatus === null">
    <div class="merge-data-wrapper">
      <div class="data">
        <span v-if="renderMatchChecker === true">Ja</span>
        <span v-else-if="renderMatchChecker === false">Nein</span>
        <span v-else-if="fieldToCheck === 'freeFrom'">{{this.englishDateWithTimeToGermanDate(renderMatchChecker)}}</span>
        <span v-else>{{ typeof renderMatchChecker === 'object' ? renderMatchChecker.join(", ") : renderMatchChecker }}</span>
      </div>
      <div class="actions">
        <div class="approve" @click="approve(renderMatchChecker)">
          <CheckmarkIcon></CheckmarkIcon>
        </div>
        <div class="reject" @click="reject()">
          <DeleteIcon></DeleteIcon>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.wrapper-merge-view {
  flex-basis: 100%;
}

.merge-data-wrapper, .actions {
  display: flex;
  flex-wrap: wrap;
}

.merge-data-wrapper {
  justify-content: space-between;
  padding: 10px 20px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: var(--light-light-gray);
  color: black;
}

.actions > div + div {
  margin-left: 10px;
}

.actions > div {
  cursor: pointer;
}

.actions .approve {
  color: var(--green);
}

.actions .reject {
  color: var(--red);
}

</style>
