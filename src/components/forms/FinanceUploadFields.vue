<script>
  import InputField from "@/components/forms/InputField.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import UploadFieldArea from "@/components/forms/UploadDragAndDrop.vue";
  import PlusIcon from "@/components/icons/icon-plus.vue";
  import MinusIcon from "@/components/icons/icon-minus.vue";

  export default {
    name: "FinanceUploadFields",
    components: {MinusIcon, PlusIcon, UploadFieldArea, Dropdown, DropdownArrow, InputField},
    props: {
      language: String,
      uploads: Object,
    },
    data() {
      return {
        uploadCount: 1,

        uploadCatsEN: [
          'Bank Statement',
          'Letter from Bank confirming the relevant funds',
          'Screenshot or capture/Picture of the Bank Balance',
          'Custom Notice'
        ],
        uploadCatsDE: [
          'Kontoauszug',
          'Schreiben der Bank zur Bestätigung der entsprechenden Mittel',
          'Aufnahme / Bild des Banksaldos',
          'Eigene Angabe'
        ],

        dropdowns: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
        },
        dropdownRelativePosition: false,

      }
    },
    methods: {
      addUploadField() {
        this.uploadCount += 1;
      },
      deleteUploadField() {
        this.uploads[this.uploadCount].category = this.language === 'DEU' ? 'Kategorie auswählen' : 'Select category';
        this.uploads[this.uploadCount].uploadFiles = [];
        this.uploadCount -= 1;
      },
      toggleDropdowns(index) {
        // Format int to string
        index = index+'';

        for (const item in this.dropdowns) {
          if ( index === item ) {
            this.dropdowns[index] = !this.dropdowns[index];
          } else {
            this.dropdowns[item] = false;
          }
        }
      },
      dropdownClick(index, clickedText) {
        this.uploads[index].category = clickedText;
        if ( clickedText === 'Eigene Angabe' || clickedText === 'Custom Notice' ){
          this.uploads[index].customNotice = '';
        } else {
          if ( typeof this.uploads[index].customNotice !== 'undefined' ){
            delete this.uploads[index].customNotice;
          }
        }
        this.closeDropdowns();
      },
      closeDropdowns() {
        for (const item in this.dropdowns) {
          this.dropdowns[item] = false;
        }
      },
      setDropdownTop(index, $event) {
        const eleName = $event.target.name;
        const additionalSpace = 5;
        if ( this.$refs['input'+eleName] !== undefined ) {
          this.$refs['dropdown'+eleName][0].$el.style.top = this.$refs['input'+eleName][0].$el.clientHeight + additionalSpace + 'px';
        }
        if ( !this.isInViewport(this.$refs['dropdown'+eleName][0].$el) ) {
          this.dropdownRelativePosition = true;
          this.$refs['dropdown'+eleName].$el[0].style.top = '0px';
        } else {
          this.dropdownRelativePosition = false;
        }
      },
      updateFiles(index, files) {
        this.uploads[index].uploadFiles = files;
      },
    },
    computed: {
      getDropdownContent() {

        let catsInUse = [
          this.uploads[1].category,
          this.uploads[2].category,
          this.uploads[3].category,
          this.uploads[4].category,
          // this.uploads[5].category
        ];

        let uploadCats = this.language === 'DEU' ? this.uploadCatsDE : this.uploadCatsEN;
        let filteredCats = uploadCats.filter(function(element){
          if ( catsInUse.includes(element) ) {
            return false;
          } else {
            return true;
          }
        });
        return filteredCats;
      },
    },
    watch: {
      uploads: {
        handler(newValue, oldValue) {
          this.$parent.uploads = this.uploads;
        },
        deep: true
      },
      uploadCount: function() {
       this.$parent.uploadCount = this.uploadCount;
      }
    },
  }
</script>


<template>
  <div class="field-wrapper two-col">

    <div v-for="index in uploadCount" class="upload" :class="{'valid': uploads[index].valid, 'invalid': !uploads[index].valid}">
      <span>
        <InputField class="dropdown-input" inputType="text" :inputName="'UploadCat'+index" :inputValue="uploads[index].category" v-model="uploads[index].category" @click="toggleDropdowns(index)" @focus="setDropdownTop(index, $event)" @click.stop=""></InputField>
        <label class="ph"></label>
        <DropdownArrow class="dropdown-arrow"></DropdownArrow>
        <Dropdown :ref="'dropdownUploadCat'+index" :class="{active: dropdowns[index], relative: dropdownRelativePosition}" :renderingObject="getDropdownContent" @dropdown-item-clicked="dropdownClick(index, $event)" @click.stop=""></Dropdown>
      </span>
       <div class="field-wrapper" style="margin-top:15px;" v-if="typeof uploads[index].customNotice !== 'undefined'">
        <InputField inputType="text" inputName="customNotice" :inputValue="uploads[index].customNotice" v-model="uploads[index].customNotice"></InputField>
        <label class="ph">{{ language === 'DEU' ? 'Eigener Kategoriename' : 'Own category name' }}</label>
      </div>
      <uploadFieldArea :maxFiles="10" :defaultFiles="uploads[index].uploadFiles" :language="language" @uploadedFiles="updateFiles(index, $event)"></uploadFieldArea>
    </div>
  </div>
  <div class="plus-button" v-if="uploadCount < 5" @click="addUploadField">
    <PlusIcon></PlusIcon> {{ language === 'DEU' ? 'Weitere Dateien Hochladen' : 'Add more files' }}
  </div>
  <div class="minus-button" v-if="uploadCount > 1" @click="deleteUploadField">
    <MinusIcon></MinusIcon> {{ language === 'DEU' ? 'Dateien entfernen' : 'Remove files' }}
  </div>
</template>


<style scoped>

.field-wrapper > span {
  flex-basis: 100%;
}

.dropzone-container {
  margin-bottom: 25px;
}

.invalid {
  border-left: 5px solid red;
}

.invalid input {
  border-left: unset;
}

.plus-button, .minus-button{
  margin-top: 15px;
  flex-basis: 100%;
  text-align: center;
  color: var(--blue);
  cursor: pointer;
}

.minus-button {
  color: var(--red);
}

</style>
