<script>

import CheckmarkIcon from "../icons/icon-checkmark.vue";
import DeleteIcon from "../icons/icon-delete.vue";

export default {
  name: "SearchCriteriaFormMatchingView",
  components: {DeleteIcon, CheckmarkIcon},
  props: {
    activeSearchCriteria: {
      type: [Array, Object],
      default: []
    },
    searchCriteriaToMatch: {
      type: [Array, Object],
      default: []
    },
    searchCriteriaStructure: {
      type: [Array, Object],
      default: []
    }
    // activeSearchCriteriaField: {
    //   type: String,
    //   default: ''
    // },
    // fieldToCheck: String,
    // fieldKeyToCheck: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      approveStatus: '',
    }
  },
  methods: {
    compareObjects(obj1, obj2) {
      let diff = {};

      for (let key in obj1) {
        if (obj1.hasOwnProperty(key)) {
          if (obj2.hasOwnProperty(key)) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
              let nestedDiff = this.compareObjects(obj1[key], obj2[key]);
              if (Object.keys(nestedDiff).length > 0) {
                diff[key] = nestedDiff;
              }
            } else if (obj1[key] !== obj2[key]) {
              diff[key] = obj1[key];
            }
          } else {
            diff[key] = obj1[key];
          }
        }
      }

      for (let key in obj2) {
        if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
          diff[key] = obj2[key];
        }
      }

      return diff;
    },
    test() {
      let activeSearchCriteriaToMatchData = this.getSearchCriteriaData(this.activeSearchCriteria);
      console.log(this.activeSearchCriteria);
      this.activeSearchCriteria.search_criteria[activeSearchCriteriaToMatchData.country][activeSearchCriteriaToMatchData.city][activeSearchCriteriaToMatchData.type].balcony = false
      this.$emit('triggerUpdateSearchCriteria');
    }
  },
  computed: {
    // renderMatchChecker() {
    //
    //   if ( typeof this.searchCriteriaToMatch === 'undefined' || Object.keys(this.searchCriteriaToMatch).length === 0 ) {
    //     return;
    //   }
    //
    //   let dataToMatch = '';
    //   let key = '';
    //
    //   let searchCriteriaToMatchData = this.getSearchCriteriaData(this.searchCriteriaToMatch[0]);
    //
    //   if ( !this.isEmpty(this.fieldKeyToCheck) && searchCriteriaToMatchData.data[this.fieldToCheck]?.[this.fieldKeyToCheck] !== undefined ) {
    //     key = searchCriteriaToMatchData.data[this.fieldToCheck][this.fieldKeyToCheck];
    //   } else {
    //     key = searchCriteriaToMatchData.data[this.fieldToCheck];
    //   }
    //
    //   if ( typeof key !== 'undefined' && !this.isEmpty(key) ) {
    //     dataToMatch = key;
    //   }
    //
    //   let activeSearchCriteriaFieldToCheck = this.isEmpty(this.activeSearchCriteriaField) ? this.fieldToCheck : this.activeSearchCriteriaField;
    //   let originalValue = '';
    //   // console.log(this.activeSearchCriteria, activeSearchCriteriaFieldToCheck);
    //
    //   if ( typeof this.activeSearchCriteria[activeSearchCriteriaFieldToCheck] !== 'undefined' ) {
    //     if ( !this.isEmpty(this.fieldKeyToCheck) && this.activeSearchCriteria?.[activeSearchCriteriaFieldToCheck]?.[this.fieldKeyToCheck] !== undefined ) {
    //       originalValue = this.activeSearchCriteria[activeSearchCriteriaFieldToCheck][this.fieldKeyToCheck].value
    //     } else {
    //       originalValue = this.activeSearchCriteria[activeSearchCriteriaFieldToCheck].value
    //     }
    //   }
    //
    //   // console.log(dataToMatch)
    //   // console.log(originalValue)
    //
    //   if ( this.isEmpty(dataToMatch) ) {
    //     return;
    //   }
    //
    //   if ( dataToMatch == originalValue ) {
    //     return;
    //   }
    //
    //   let floatValuesAsThousender = ['price', 'maxBudget'];
    //   let floatValuesAsSimple = ['rooms'];
    //
    //   if ( floatValuesAsThousender.includes(this.fieldToCheck) ) {
    //     dataToMatch = this.numberWithComma(dataToMatch);
    //   }
    //   if ( floatValuesAsSimple.includes(this.fieldToCheck) ) {
    //     dataToMatch = parseFloat(dataToMatch).toFixed(2);
    //   }
    //
    //   return dataToMatch;
    // },
    renderMatchings() {

      if ( typeof this.searchCriteriaToMatch === 'undefined' || Object.keys(this.searchCriteriaToMatch).length === 0 ) {
        return;
      }

      let searchCriteriaToMatchData = this.getSearchCriteriaData(this.searchCriteriaToMatch[0]);
      let activeSearchCriteriaToMatchData = this.getSearchCriteriaData(this.activeSearchCriteria);

      let difference = {};

      difference = this.compareObjects(searchCriteriaToMatchData.data, activeSearchCriteriaToMatchData.data);

      return difference;

    }
  },
  watch: {}
  }
</script>


<template>

  <div class="wrapper-merge-view" v-if="!this.isEmpty(this.searchCriteriaToMatch)">
    <div class="merge-data-wrapper">
      <div class="rendering-matchings" v-for="(index, key) in renderMatchings">
<!--        <div>-->
<!--          {{key}}-->
<!--        </div>-->
      </div>
      <div @click="test">tester</div>
<!--      <div class="data">{{renderMatchChecker}}</div>-->
<!--      <div class="actions">-->
<!--        <div class="approve">-->
<!--          <CheckmarkIcon></CheckmarkIcon>-->
<!--        </div>-->
<!--        <div class="reject">-->
<!--          <DeleteIcon></DeleteIcon>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>


<style scoped>

.merge-data-wrapper, .actions {
  display: flex;
  flex-wrap: wrap;
}

.merge-data-wrapper {
  justify-content: space-between;
  padding: 10px 20px;
  margin-top: 5px;
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

.rendering-matchings {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
}

</style>
