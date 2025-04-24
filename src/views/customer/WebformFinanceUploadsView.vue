<script>
import InputField from "@/components/forms/InputField.vue";
import Dropdown from "@/components/forms/Dropdown.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import CreateReservationProgressBar from "@/components/card/CreateReservationProgressBar.vue";
import Button from "@/components/buttons/button.vue";
import axios from "axios";
import ImageFlagGerman from "@/components/images/flag-german.vue";
import ImageFlagEnglish from "@/components/images/flag-english.vue";
import UploadFieldArea from "@/components/forms/UploadDragAndDrop.vue";
import PlusIcon from "@/components/icons/icon-plus.vue";
import MinusIcon from "@/components/icons/icon-minus.vue";
import FinanceUploadFields from "@/components/forms/FinanceUploadFields.vue";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";

export default {
  components: {
    AnimateCircleIcon,
    FinanceUploadFields,
    MinusIcon,
    PlusIcon,
    UploadFieldArea,
    ImageFlagEnglish,
    ImageFlagGerman, Button, CreateReservationProgressBar, DropdownArrow, Dropdown, InputField},
  data() {
    return {
      language: 'DEU',

      uploadCount: 1,
      uploads: {
        1: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        2: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        3: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        4: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        },
        5: {
          category: 'Kategorie auswählen',
          uploadFiles: [],
          valid: true,
        }
      },

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

      maxSteps: 3,
      currentStep: 1,
      currentStepValidator: true,

      apiError: '',
      apiResponseReservation: '',
      apiResponseCustomer: '',

      alreadySubmitted: false,
      noTokenFound: false,
      tokenValue: this.$route.query.token,

      submitHandler: {
        formSubmitted: false,
        message: '',
      },

      isLoading: false,
    }
  },
  mounted() {
    this.checkToken();
    this.setInitAllUploadCategories();
  },
  methods: {
    setInitAllUploadCategories() {
      for ( const item in this.uploads ) {
        this.uploads[item].category = this.language === 'DEU' ? 'Kategorie auswählen' : 'Select category';
      }
    },
    closeDropdowns() {
      if ( this.$refs.uploadFields && typeof this.$refs.uploadFields !== 'undefined'){
        this.$refs.uploadFields.closeDropdowns();
      }
    },
    checkToken() {

      if ( this.isLoading ) {
        return;
      }

      this.isLoading = true;
      if ( this.$route.query.token ) {
        let token = this.$route.query.token;
        axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservationBasedOnTokenAndUsage?pub=true&token='+token)
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.apiResponseReservation = response.data.response[0];
                    // this.apiResponseReservation.finance_process = parseInt(this.apiResponseReservation.finance_process);
                    if ( parseInt(this.apiResponseReservation.finance_process) > 0 ){
                      this.alreadySubmitted = true;
                    }
                  }
                }
            )
            .catch(
                (error) => {
                  this.apiError = error;
                }
            )
      } else {
        this.noTokenFound = true;
      }
      this.isLoading = false;
    },
    checkIfUploadsAreValid() {
      let validator = true;
      for (let loop = 1; loop <= this.uploadCount; loop++) {
        if ( this.uploads[loop].uploadFiles.length > 0 ){
          if ( this.uploads[loop].category === 'Kategorie auswählen' || this.uploads[loop].category === 'Select category') {
            // invalid if no category is set
            this.uploads[loop].valid = false;
            validator = false;
          } else {
            this.uploads[loop].valid = true;
          }
        } else {
          // invalid if no file is set
          this.uploads[loop].valid = false;
          validator = false;
        }
      }
      return validator;
    },
    checkIfStepIsValid() {
      let formValidation = true;

      if ( this.currentStep === 2 ){
        formValidation = this.checkIfUploadsAreValid();
      }

      if ( !formValidation ) {
        this.currentStepValidator = formValidation;
      } else {
        this.currentStep += 1;
      }
    },
    submitData() {

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;

      let formData = new FormData();
      formData.append('token', this.tokenValue);

      for (const index in this.uploads) {
        if ( this.uploads[index].uploadFiles.length > 0 ){

          // Translate cat to german if it is eng
          let categoryName = this.uploads[index].category;
          if ( categoryName === 'Bank Statement' ) {
            categoryName = 'Kontoauszug';
          } else if( categoryName === 'Letter from Bank confirming the relevant funds' ) {
            categoryName = 'Schreiben der Bank zur Bestätigung der entsprechenden Mittel';
          } else if( categoryName === 'Screenshot or capture/Picture of the Bank Balance' ) {
            categoryName = 'Aufnahme / Bild des Banksaldos';
          } else if( categoryName === 'Other' ) {
            categoryName = 'Sonstiges';
          } else if( categoryName === 'Eigene Angabe' ) {
            categoryName = 'Eigene Angabe';
          }

          categoryName = categoryName.replaceAll('/', '_');
          categoryName = categoryName.replaceAll(' ', '_');
          categoryName = categoryName.replaceAll('ä', 'ae');

          for (const [fileIndex, val] in this.uploads[index].uploadFiles) {
            formData.append(categoryName+'['+fileIndex+']', this.uploads[index].uploadFiles[fileIndex]);
          }

          if ( typeof this.uploads[index].customNotice !== 'undefined'){
            formData.append('ownCategoryName', this.uploads[index].customNotice);
          }

        }
      }

      axios.post(this.globalApiBaseUrl + '/reservations/submitFinanceClientForm', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then(
            (response) => {
              if ( response.data.status === 200 ) {
                this.submitHandler.formSubmitted = true;
                this.submitHandler.message = this.language === 'DEU' ? 'Ihre Daten sind bei uns erfolgreich eingetroffen.' : 'Your submit was successful.';
              } else {
                this.submitHandler.message = this.language === 'DEU' ? 'Es ist ein Fehler aufgetreten.' : 'An Error occures.';
              }
            }
        )
        .catch(
            (error) => {
              this.submitHandler.message = this.language === 'DEU' ? 'Es ist ein Fehler aufgetreten.' : 'An Error occures.';
            }
        )
        .finally(() => {
          this.isLoading = false;
        })

    },
    renderObjectFile(file){
      return file.name;
    }
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
    language: function() {
      this.setInitAllUploadCategories();
    }
  },
}
</script>

<template>
  <div class="ndb-customer-view" @click="closeDropdowns">
    <form class="ndb-form">
      <div class="intro">
        <h2>{{ language === 'DEU' ? 'Bereitstellung von Finanzunterlagen für den Erwerb einer Immobilie' : 'Provide of finance information to purchase a real estate' }}</h2>
      </div>

      <div v-if="alreadySubmitted" class="missing-error-alert">
        Ihr Nachweise wurde bereits erfolgreich hochgeladen.
      </div>

      <div v-else-if="noTokenFound" class="missing-error-alert">
        Es konnten keine Daten gefunden werden. Bitte kontaktieren Sie ihren Makler.
      </div>

      <div v-else-if="submitHandler.formSubmitted" style="width: 100%;">
        <div style="flex-basis: 100%; text-align: center;">{{ submitHandler.message }}</div>
      </div>

      <div class="webform-body-wrapper" v-else>
        <div class="progress-bar">
          <CreateReservationProgressBar :currentStep="currentStep" :maxSteps="maxSteps"></CreateReservationProgressBar>
        </div>

        <div class="page-1" v-if="currentStep === 1">
          <div class="fieldgroup-label">{{ language === 'DEU' ? 'Sprache:' : 'Language:' }}</div>
          <div class="step-fields">
            <label for="languageDeu" class="radio-wrapper">
              <InputField inputType="radio" id="languageDeu" inputName="Language" value="DEU" :inputValue="language" v-model="language"></InputField>
              <imageFlagGerman></imageFlagGerman>
            </label>
            <label for="languageEng" class="radio-wrapper">
              <InputField inputType="radio" id="languageEng" inputName="Language" value="ENG" :inputValue="language" v-model="language"></InputField>
              <imageFlagEnglish></imageFlagEnglish>
            </label>
          </div>
        </div>

        <div class="page-2" v-if="currentStep === 2">
          <div class="fieldgroup-label" style="margin-bottom: 0;">{{ language === 'DEU' ? 'Unterlagen zum hochladen:' : 'Files for upload:' }}</div>
          <div class="info">{{ language === 'DEU' ? 'Nutzen Sie die nachfolgenden Felder zum hochladen Ihrer Unterlagen.' : 'Use the following fields to upload you files.' }} </div>
          <div class="step-fields">
            <FinanceUploadFields :language="language" :uploads="uploads" ref="uploadFields"></FinanceUploadFields>
          </div>
        </div>

        <div class="page-3" v-if="currentStep === 3">
          <div class="summary-title">{{ language === 'DEU' ? 'Zusammenfassung' : 'Summary' }}</div>
          <div class="summary">
            <div class="category" v-for="upload in uploads" v-show="upload.uploadFiles.length > 0">
              <div class="title">{{upload.category}}</div>
              <div v-if="typeof upload.customNotice !== 'undefined'">"{{ upload.customNotice }}"</div>
              <div class="filename">{{ language === 'DEU' ? 'Ausgewählte Dateien:' : 'Selected files:' }}</div>
              <ul>
                <li v-for="file in upload.uploadFiles">
                  {{ renderObjectFile(file) }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="actions" :style="{ justifyContent: currentStep === 1 ? 'end' : '' }" v-if="!submitHandler.formSubmitted">
          <Button type="edit" v-if="currentStep > 1" @click="currentStep = currentStep-1">{{ language === 'DEU' ? 'Zurück' : 'Back' }}</Button>
          <Button type="create reservation" v-if="currentStep !== maxSteps" @click="checkIfStepIsValid">{{ language === 'DEU' ? 'Weiter' : 'Next' }}</Button>
          <Button type="create reservation" v-else @click="submitData">
            {{ language === 'DEU' ? 'Unterlagen einreichen' : 'Submit files' }}
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>
      </div>

    </form>

  </div>
</template>

<style scoped>

.intro {
  width: 100%;
  text-align: center;
  margin-bottom: 25px;
}

.missing-error-alert {
  width: 100%;
  text-align: center;
}

form {
  min-width: 500px;
  width: 50%;
  background: white;
  border-radius: 5px;
  padding: 50px;
  height: fit-content;
}

.ndb-customer-view {
  display: flex;
  flex-basis: 100%;
  justify-content: center;
  min-height: 100vh;
  padding-top: 50px;
  background: radial-gradient(circle, rgba(21,71,109,1) 0%, rgba(15,40,60,1) 100%);
}

[class^="page-"],
.webform-body-wrapper {
  width: 100%;
}

.field-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.field-wrapper > span + span {
  margin-top: 25px;
}

.field-wrapper.two-col span {
  flex-basis: 100%;
}

.field-wrapper + .field-wrapper {
  margin-top: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  margin-top: 25px;
}

.progress-bar {
  flex-basis: 100%;
  margin-bottom: 50px;
}

.step-fields {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.step-fields .upload {
  flex-basis: 100%;
}

.step-fields .upload + .upload {
  margin-top: 25px;
}

.upload-cat {
  color: black;
}

.info {
  font-style: italic;
  margin-bottom: 25px;
}

label {
  cursor: pointer;
  text-align: center;
}

/* page 1 */
input[name="Language"] {
  display:none !important;
}

input[name="Language"] + img {
  width: 50px;
  filter: grayscale(100%);
  cursor: pointer;
}

input[modelvalue="DEU"][value="DEU"] + img,
input[modelvalue="ENG"][value="ENG"] + img {
  filter: unset;
}

label[for="languageEng"] {
  margin-left: 25px;
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

.summary {
  display: flex;
  flex-wrap: wrap;
}

.category {
  margin-bottom: 15px;
  flex-basis: 50%;
}

.category .title {
  font-size: 16px;
}

.summary-title {
  font-size: 18px;
  margin-bottom: 25px;
}

.filename {
  margin-top: 15px;
}

@media (max-width: 767px) {
  .actions .button + .button{
    margin-top: 15px;
  }
  .page-3 + .actions > .button  {
    flex-basis: 100% !important;
  }
  .page-3 + .actions {
    flex-wrap: wrap;
  }
  form {
    min-width: 50%;
    width: 100%;
  }
}

</style>
