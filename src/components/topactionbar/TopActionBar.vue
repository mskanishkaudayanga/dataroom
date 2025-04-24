<script>
  import Button from '../buttons/button.vue'
  import InputField from "../forms/InputField.vue";
  import Dropdown from "../forms/Dropdown.vue";
  import SearchIcon from '../icons/icon-search.vue';
  import PlusIcon from "@/components/icons/icon-plus.vue";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import PatchnotesIcon from "@/components/icons/icon-patchnote.vue";
  import Faq from "@/views/general/faq.vue";
  import IconQuestionmark from "@/components/icons/icon-questionmark.vue";

  export default {
    name: "TopActionBar",
    components: {IconQuestionmark, Faq, PatchnotesIcon, CloseIcon, PlusIcon, Dropdown, Button, InputField, SearchIcon},
    data() {
      return {
        showSortingDropdown: false,
        showStatusDropdown: false,
        dropdownList: [
          'Nach Datum (aufsteigend)',
          'Nach Datum (absteigend)',
          'Nach Reservierungsnummer (aufsteigend)',
          'Nach Reservierungsnummer (absteigend)',
          'Nach Immobilien (aufsteigend)',
          'Nach Immobilien (absteigend)',
        ],
        dropdownStatusList: [
          'Alle',
          'Abgeschlossene Verkäufe',
          'Archivierte',
        ],
        dropdownRightAlign: false,
        dropdownTopPosition: 0,
        selectedStatus: '',
        searchInput: '',
        mobileSearchInit: false,
      }
    },
    methods: {
      setDropdownShowValue: function(value) {
        this.showSortingDropdown = value;
        this.dropdownRightAlign = value;
      },
      sortDropdownClick(data) {
        let propToSort = 'create_date';
        let order = 'ASC';
        if ( data.includes('Reservierungsnummer') ){
          propToSort = 'reservation_id';
        }
        if ( data.includes('Verkaufsmeldungsnummer') ){
          propToSort = 'verkaufsmeldung_id';
        }
        if ( data.includes('Immobilien') ){
          propToSort = 'estate_nrs';

          // order will be negated to match the first char sort
          order = 'DESC';
        }
        if ( data.includes('absteigend') ){
          order = 'DESC';

          // order will be negated to match the first char sort
          if ( data.includes('Immobilien') ) {
              order = 'ASC';
            }
          }
        this.$parent.sortingOption = {
          objectPropToSort: propToSort,
          order: order
        }
        this.closeDropdown();
      },
      statusDropdownClick(data) {
        this.selectedStatus = data;
        this.$parent.statusFilter = data;
        this.closeDropdown();
      },
      checkDropdown() {
        this.dropdownRightAlign = !this.isInViewport(this.$refs.dropdownSort.$el);
        this.dropdownTopPosition = this.$refs.dropdownButton.$el.clientHeight + 5;
      },
      closeDropdown() {
        this.showSortingDropdown = false;
        this.showStatusDropdown = false;
      }
    },
    watch: {
      searchInput: function() {
        this.$parent.searchInput = this.searchInput;
      },
    }
  }
</script>


<template>

  <div class="top-action-bar" @click="closeDropdown">

    <div class="left">
      <router-link :to="{name: 'createReservationView'}">
        <Button type="create reservation"><span class="mobile"><PlusIcon></PlusIcon></span><span>Reservierung erstellen</span></Button>
      </router-link>
    </div>

    <div class="right">

      <div class="field-wrapper" @click.stop="">
        <Button type="edit" @click="this.patchNotesInit">
          <PatchnotesIcon></PatchnotesIcon>
          Patch notes
        </Button>
      </div>
      <div class="field-wrapper" @click.stop="">
        <Button type="edit" @click="this.redirectToFAQ()">
          <IconQuestionmark></IconQuestionmark>
          FAQ
        </Button>
      </div>
      <div class="field-wrapper" @click.stop="">
        <Button type="sort" ref="dropdownButton" @click="showStatusDropdown = !showStatusDropdown; checkDropdown()">Status</Button>
        <Dropdown :ref="'dropdownStatus'" :class="{ active: showStatusDropdown }" type="sorting" :renderingObject="dropdownStatusList" @dropdown-item-clicked="statusDropdownClick"></Dropdown>
      </div>
      <div class="field-wrapper search">
        <div class="mobile-search">
          <Button type="search" @click="mobileSearchInit = !mobileSearchInit"></Button>
        </div>
        <span class="mobile-none">
          <InputField inputType="text" inputPlaceholder="KUNDENSUCHE..." inputName="search" :inputValue="searchInput" v-model="searchInput"></InputField>
          <label class="ph">KUNDENSUCHE...</label>
          <SearchIcon v-if="searchInput === ''"></SearchIcon>
          <CloseIcon @click="searchInput = ''" v-else></CloseIcon>
        </span>
      </div>
      <router-link :to="{name: 'filterView'}">
        <Button type="filter">Filter</Button>
      </router-link>
      <div class="field-wrapper" @click.stop="">
        <Button type="sort" ref="dropdownButton" @click="showSortingDropdown = !showSortingDropdown; checkDropdown()">Sortierung</Button>
        <Dropdown :ref="'dropdownSort'" :class="{ active: showSortingDropdown, 'align-right': dropdownRightAlign }" :style="{ top: dropdownTopPosition + 'px' }" type="sorting" :renderingObject="dropdownList" @dropdown-item-clicked="sortDropdownClick"></Dropdown>
      </div>
    </div>

    <div class="mobile-search-input" v-if="mobileSearchInit">
      <div class="field-wrapper search">
        <InputField inputType="text" inputPlaceholder="KUNDENSUCHE..." inputName="search" :inputValue="searchInput" v-model="searchInput"></InputField>
        <label class="ph">KUNDENSUCHE...</label>
        <SearchIcon v-if="searchInput === ''"></SearchIcon>
        <CloseIcon @click="searchInput = ''" v-else></CloseIcon>
      </div>
    </div>

  </div>

</template>


<style scoped>

.top-action-bar {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  margin-bottom: 15px;
}

.left, .right {
  display: flex;
}

.field-wrapper, .field-wrapper + a {
  margin-right: 15px;
}

.right input {
  border-radius: var(--border-radius);
  border-width: 1px;
}

.right .button + .button {
  margin-left: 15px;
}

.search input {
  height: 100%;
}

.search label {
  padding-left: 24px;
}

.search i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.mobile-search {
  display: none;
}

input:not(:placeholder-shown)~label, textarea:not(:placeholder-shown)~label, input:focus~label, textarea:focus~label {
  top: -10px;
}

.fa-xmark {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background: var(--red);
  color: white;
}

/* Tablet */
@media (max-width: 991px){
  .top-action-bar .button span {
    display: none;
  }

  .top-action-bar .button span.mobile {
    display: block;
  }
}

/* Mobile */
@media (max-width: 767px){
  .mobile-search {
    display: block;
  }

  .mobile-none{
    display: none;
  }

  .top-action-bar {
    flex-wrap: wrap;
  }

  .mobile-search-input {
    flex-basis: 100%;
    margin-top: 10px;
  }

  .right > div:last-of-type, .mobile-search-input .field-wrapper.search {
    margin-right: 0;
  }
}

</style>
