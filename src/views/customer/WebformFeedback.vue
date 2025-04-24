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
import TextAreaField from "@/components/forms/TextAreaField.vue";
import StarIcon from "@/components/icons/icon-star.vue";
import CheckmarkIcon from "@/components/icons/icon-checkmark.vue";
import DeleteIcon from "@/components/icons/icon-delete.vue";
import CloseIcon from "@/components/icons/icon-close.vue";

export default {
  components: {
    CloseIcon,
    DeleteIcon,
    CheckmarkIcon,
    StarIcon,
    TextAreaField,
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

      maxSteps: 1,
      currentStep: 1,
      currentStepValidator: true,
      isLoading: false,
      alreadySubmitted: false,
      submitSuccessfully: false,
      isSubmitProcessStarted: false,
      apiResponseReservation: [],
      apiResponseCustomer: [],
      allAPisFinishedLoading: false,
      formCheckOnce: false,
      formType: 'cancelFeedback',
      formTotalRating: 0,

      form: {
        question1: {
          type: 'checkbox',
          question: {
            de: 'Warum haben Sie sich gegen den Kauf der Immobilie entschieden?',
            en: 'Why did you decide not to purchase the property?',
          },
          answers: {
            de: [
                'Andere Immobilie gefunden',
                'Keine Finanzierung',
                'Lage unpassend',
                'Zu teuer',
                'Unzureichende Betreuung',
                'Sonstiges'
            ],
            en: [
                'Found another property',
                'tNo financing',
                'Location unsuitable',
                'too expensive',
                'Insufficient support',
                'Other'
            ],
          },
          selectedAnswers: [],
          answerOthersText: '',
          valid: true,
        },
        question2: {
          type: 'radio',
          question: {
            de: 'Hatten Sie Probleme in unserem Portfolio Wohnungen zu finden, die ihren Wünschen entsprechen?',
            en: 'Did you have problems finding apartments in our portfolio that met your requirements?',
          },
          answers: {
            de: [
              'Ja',
              'Nein',
            ],
            en: [
              'Yes',
              'No',
            ],
          },
          selectedAnswers: [],
          valid: true,
        },
        question3: {
          type: 'rating',
          question: {
            'de': 'Wie würden Sie die Zuverlässigkeit und Verfügbarkeit unseres/unserer Vertriebsmitarbeiters/in bewerten, wenn Sie Fragen oder Anliegen hatten?',
            'en': 'How would you rate the reliability and availability of our sales representative when you had questions or concerns?'
          },
          answer: 0,
          valid: true,
        },
        question4: {
          type: 'rating',
          question: {
            'de': 'Auf einer Skala von 1 bis 5, wie zufrieden waren Sie mit der Häufigkeit und Qualität der Kommunikation während des Verkaufsprozesses?',
            'en': 'On a scale of 1 to 5, how satisfied were you with the frequency and quality of communication during the sales process?'
          },
          answer: 0,
          valid: true,
        },
        question5: {
          type: 'rating',
          question: {
            'de': 'Wie würden Sie die fachliche Kompetenz & Professionalität unseres/unserer Vertriebsmitarbeiters/in während der Beratung bewerten?',
            'en': 'How would you rate the technical competence & professionalism of our sales representative during the consultation?'
          },
          answer: 0,
          valid: true,
        },
        question6: {
          type: 'text',
          question: {
            'de': 'Gab es während des Reservierungs-/Verkaufsprozesses unerwartete Hindernisse oder Probleme, die Ihre Zufriedenheit beeinträchtigt haben? Wie könnten wir dies verbessern?',
            'en': 'Were there any unexpected obstacles or problems during the reservation/sales process that affected your satisfaction? How could we improve this?'
          },
          answer: '',
          valid: true,
        },
        question7: {
          type: 'rating',
          question: {
            'de': 'Wie würden Sie die Transparenz und Genauigkeit der Informationen bewerten, die Ihnen während des Verkaufsprozesses zur Verfügung gestellt wurden?',
            'en': 'How would you rate the transparency and accuracy of the information provided to you during the sales process?'
          },
          answer: 0,
          valid: true,
        },
        question8: {
          type: 'rating',
          question: {
            'de': 'Wie würden Sie die Gesamterfahrung bewerten, die Sie mit unserer Immobilienfirma während des Verkaufs gemacht haben?',
            'en': 'How would you rate the overall experience you had with our real estate company during the sale?'
          },
          answer: 0,
          valid: true,
        },
        question9: {
          type: 'rating',
          question: {
            'de': 'Würden sie Best Place einem/einer Freund/in weiterempfehlen?',
            'en': 'Would you recommend Best Place to a friend?'
          },
          answer: 0,
          valid: true,
        }
      },

    }
  },
  methods: {
    nextStep() {
      this.currentStep = this.currentStep + 1;
    },
    validateForm() {
      let allAreValid = true;
      this.formCheckOnce = true;

      for (let key in this.form) {
        let item = this.form[key];

        if (item.type === 'checkbox' || item.type === 'radio') {
          if (!item.selectedAnswers || item.selectedAnswers.length === 0) {
            allAreValid = false;
            this.form[key].valid = false;
          } else {
            this.form[key].valid = true;
          }
        } else if (item.type === 'rating') {
          if (!item.answer || item.answer <= 0) {
            allAreValid = false;
            this.form[key].valid = false;
          } else {
            this.form[key].valid = true;
          }
        } else if (item.type === 'text') {
          if (!item.answer || item.answer.trim() === '') {
            allAreValid = false;
            this.form[key].valid = false;
          } else {
            this.form[key].valid = true;
          }
        }
      }

      return allAreValid
    },
    async getReservationByToken() {
      if ( !this.$route.query.token || this.$route.query.token === '' ) {
        this.alreadySubmitted = true;
      }

      if ( this.$route.query.token ) {

        if ( !this.getUserRole() ) {
          // Is customer
          this.sendOpenForm();

        }

        await axios.get(this.globalApiBaseUrl + '/reservations/getSingleReservationBasedOnTokenAndUsage?token=' + this.$route.query.token + '&pub=true')
        .then(
            (response) => {
              console.log(response);
              if (response.data.status === 200) {
                this.apiResponseReservation = response.data.response[0];
                if (this.apiResponseReservation.feedback_form_submitted && parseInt(this.apiResponseReservation.feedback_form_submitted) > 0) {
                  this.alreadySubmitted = true;
                }
                this.switchFormContent(this.apiResponseReservation);
              } else {
                this.alreadySubmitted = true;
              }
            }
        )
        .catch(
            (error) => {
              this.apiError = error;
            }
        )

        await axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString='+this.apiResponseReservation.customer_kdnr+'&company='+this.apiResponseReservation.company+'&onlyCustomerNrSearch=true&pub=true')
          .then(
              (response) => {
                if ( response.data.status === 200 ) {
                  this.apiResponseCustomer = response.data.response.client_data[0];
                  this.language = this.apiResponseCustomer.client_language;
                }
              }
          )
          .catch(
              (error) => {
                this.apiError = error;
              }
          ).finally(() => {
            this.allAPisFinishedLoading= true;
          })

      }
    },
    sendOpenForm(){

      axios.post(this.globalApiBaseUrl + '/reservations/openedFeedbackForm', {token: this.$route.query.token} ).then(
          (response) => {
            console.log(response);
          }
      ).catch(
          (error) => {
            console.log(error);
          }
      ).finally(
          () => {
            this.isLoading = false;
          })
    },
    submitData() {

      this.isSubmitProcessStarted = true;
      if ( this.isLoading || !this.validateForm() ) {
        return;
      }

      let data = {
        'type': this.formType,
        'form': this.form,
        'token': this.$route.query.token
      }

      axios.post(this.globalApiBaseUrl + '/reservations/submitFeedbackForm', data ).then(
        (response) => {
          if ( response.data.status === 200 ) {
            this.submitSuccessfully = true;
          } else {
            this.notificationBannerInit('warning', this.language = 'DEU' ? 'Es ist ein Fehler aufgetreten. Bitte versuchen es erneut.' : 'An error occurred please submit the formular again.');
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      ).finally(
      () => {
        this.isLoading = false;
      })

    },
    switchFormContent(reservationData) {

      reservationData.reservation_status = parseInt(reservationData.reservation_status);

      if (reservationData.reservation_status === -2) {
        this.formType = 'cancelFeedback';
        this.form = {
          question1: {
            type: 'checkbox',
            question: {
              de: 'Warum haben Sie sich gegen den Kauf der Immobilie entschieden?',
              en: 'Why did you decide not to purchase the property?',
            },
            answers: {
              de: [
                'Andere Immobilie gefunden',
                'Keine Finanzierung',
                'Lage unpassend',
                'Zu teuer',
                'Unzureichende Betreuung',
                'Sonstiges'
              ],
              en: [
                'Found another property',
                'No financing',
                'Location unsuitable',
                'too expensive',
                'Insufficient support',
                'Other'
              ],
            },
            selectedAnswers: [],
            answerOthersText: '',
            valid: true,
          },
          question2: {
            type: 'radio',
            question: {
              de: 'Hatten Sie Probleme in unserem Portfolio Wohnungen zu finden, die ihren Wünschen entsprechen?',
              en: 'Did you have problems finding apartments in our portfolio that met your requirements?',
            },
            answers: {
              de: [
                'Ja',
                'Nein',
              ],
              en: [
                'Yes',
                'No',
              ],
            },
            selectedAnswers: [],
            valid: true,
          },
          question3: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die Zuverlässigkeit und Verfügbarkeit unseres/unserer Vertriebsmitarbeiters/in bewerten, wenn Sie Fragen oder Anliegen hatten?',
              'en': 'How would you rate the reliability and availability of our sales representative when you had questions or concerns?'
            },
            answer: 0,
            valid: true,
          },
          question4: {
            type: 'rating',
            question: {
              'de': 'Auf einer Skala von 1 bis 5, wie zufrieden waren Sie mit der Häufigkeit und Qualität der Kommunikation während des Verkaufsprozesses?',
              'en': 'On a scale of 1 to 5, how satisfied were you with the frequency and quality of communication during the sales process?'
            },
            answer: 0,
            valid: true,
          },
          question5: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die fachliche Kompetenz & Professionalität unseres/unserer Vertriebsmitarbeiters/in während der Beratung bewerten?',
              'en': 'How would you rate the technical competence & professionalism of our sales representative during the consultation?'
            },
            answer: 0,
            valid: true,
          },
          question6: {
            type: 'text',
            question: {
              'de': 'Gab es während des Reservierungs-/Verkaufsprozesses unerwartete Hindernisse oder Probleme, die Ihre Zufriedenheit beeinträchtigt haben? Wie könnten wir dies verbessern?',
              'en': 'Were there any unexpected obstacles or problems during the reservation/sales process that affected your satisfaction? How could we improve this?'
            },
            answer: '',
            valid: true,
          },
          question7: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die Transparenz und Genauigkeit der Informationen bewerten, die Ihnen während des Verkaufsprozesses zur Verfügung gestellt wurden?',
              'en': 'How would you rate the transparency and accuracy of the information provided to you during the sales process?'
            },
            answer: 0,
            valid: true,
          },
          question8: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die Gesamterfahrung bewerten, die Sie mit unserer Immobilienfirma während des Verkaufs gemacht haben?',
              'en': 'How would you rate the overall experience you had with our real estate company during the sale?'
            },
            answer: 0,
            valid: true,
          },
          question9: {
            type: 'rating',
            question: {
              'de': 'Würden sie Best Place einem/einer Freund/in weiterempfehlen?',
              'en': 'Would you recommend Best Place to a friend?'
            },
            answer: 0,
            valid: true,
          }
        };
      } else if (reservationData.reservation_status === 7) {
        this.formType = 'saleFeedback';
        this.form = {
          question1: {
            type: 'radio',
            question: {
              de: 'Haben Sie bereits vor diesem Kauf Immobilien besessen?',
              en: 'Did you already own real estate before this purchase?',
            },
            answers: {
              de: [
                'Ja',
                'Nein',
              ],
              en: [
                'Yes',
                'No',
              ],
            },
            selectedAnswers: [],
            valid: true,
          },
          question2: {
            type: 'radio',
            question: {
              de: 'Haben Sie sich gut auf den Notartermin vorbereitet gefühlt?',
              en: 'Did you feel well prepared for the notary appointment?',
            },
            answers: {
              de: [
                'Ja',
                'Nein',
              ],
              en: [
                'Yes',
                'No',
              ],
            },
            selectedAnswers: [],
            valid: true,
          },
          question3: {
            type: 'radio',
            question: {
              de: 'Hatten Sie Probleme in unserem Portfolio Wohnungen zu finden, die ihren Wünschen entsprechen?',
              en: 'Did you have problems finding apartments in our portfolio that met your requirements?',
            },
            answers: {
              de: [
                'Ja',
                'Nein',
              ],
              en: [
                'Yes',
                'No',
              ],
            },
            selectedAnswers: [],
            valid: true,
          },
          question4: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die Zuverlässigkeit und Verfügbarkeit unseres/unserer Vertriebsmitarbeiters/in bewerten, wenn Sie Fragen oder Anliegen hatten?',
              'en': 'How would you rate the reliability and availability of our sales representative when you had questions or concerns?'
            },
            answer: 0,
            valid: true,
          },
          question5: {
            type: 'rating',
            question: {
              'de': 'Auf einer Skala von 1 bis 5, wie zufrieden waren Sie mit der Häufigkeit und Qualität der Kommunikation während des Verkaufsprozesses?',
              'en': 'On a scale of 1 to 5, how satisfied were you with the frequency and quality of communication during the sales process?'
            },
            answer: 0,
            valid: true,
          },
          question6: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die fachliche Kompetenz & Professionalität unseres/unserer Vertriebsmitarbeiters/in während der Beratung bewerten?',
              'en': 'How would you rate the technical competence & professionalism of our sales representative during the consultation?'
            },
            answer: 0,
            valid: true,
          },
          question7: {
            type: 'text',
            question: {
              'de': 'Gab es während des Reservierungs-/Verkaufsprozesses unerwartete Hindernisse oder Probleme, die Ihre Zufriedenheit beeinträchtigt haben? Wie könnten wir dies verbessern?',
              'en': 'Were there any unexpected obstacles or problems during the reservation/sales process that affected your satisfaction? How could we improve this?'
            },
            answer: '',
            valid: true,
          },
          question8: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die Transparenz und Genauigkeit der Informationen bewerten, die Ihnen während des Verkaufsprozesses zur Verfügung gestellt wurden?',
              'en': 'How would you rate the transparency and accuracy of the information provided to you during the sales process?'
            },
            answer: 0,
            valid: true,
          },
          question9: {
            type: 'rating',
            question: {
              'de': 'Wie würden Sie die Gesamterfahrung bewerten, die Sie mit unserer Immobilienfirma während des Verkaufs gemacht haben?',
              'en': 'How would you rate the overall experience you had with our real estate company during the sale?'
            },
            answer: 0,
            valid: true,
          },
          question10: {
            type: 'rating',
            question: {
              'de': 'Würden sie Best Place einem/einer Freund/in weiterempfehlen? ',
              'en': 'Would you recommend Best Place to a friend?'
            },
            answer: 0,
            valid: true,
          }
        };
      }
    },
    calcTotalRating() {
      let totalRating = 0;
      let ratingQuestionNumber = 0;
      for (let key in this.form) {
        let item = this.form[key];
        if (item.type === 'rating') {
          totalRating += this.form[key].answer
          ratingQuestionNumber += 1;
        }
      }

      this.formTotalRating = totalRating / ratingQuestionNumber;
    }
  },
  mounted() {
    this.getReservationByToken();
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.validateForm();
        this.calcTotalRating();
      },
    },
  },
}
</script>

<template>
  <div class="ndb-customer-view">
    <form class="ndb-form">
      <div class="intro">
        <h2>{{ language === 'DEU' ? 'Feedback' : 'Feedback' }}</h2>
      </div>

      <div v-if="submitSuccessfully" class="missing-error-alert">
        {{ language === 'DEU' ? 'Danke, wir wissen Ihr freundliches Feedback zu schätzen.' : 'Thanks, we really appreciate your kind feedback.' }}

        <div class="google-rating" v-if="formTotalRating >= 4 && formType === 'saleFeedback'">
          {{ language === 'DEU' ? 'Würden Sie uns eine Google Bewertung geben?' : 'Would you rate as on google?' }}

          <div>
            <a href="https://g.page/r/CUqmNvZ0OwU5EBM/review">
            {{ language === 'DEU' ? 'Google Bewertung abgeben' : 'Leave a Google review' }}
            </a>
          </div>
        </div>
      </div>
      <div v-else-if="alreadySubmitted" class="missing-error-alert">
        {{ language === 'DEU' ? 'Das Formular wurde bereits abgesendet.' : 'The form was already submitted' }}
      </div>

      <div class="webform-body-wrapper" v-else-if="allAPisFinishedLoading">

        <div class="page-1" v-if="currentStep === 1">

          <div class="question-wrapper">
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

          <div class="question-wrapper" v-for="(item, index) in form">
            <div class="question">
              <span class="checkmark-wrapper" :class="{'active': formCheckOnce && item.valid, 'error': isSubmitProcessStarted && !item.valid}">
                <span class="checkmark-inner-wrapper">
                  <CheckmarkIcon></CheckmarkIcon>
                </span>
              </span>
              {{ language === 'DEU' ? item.question.de : item.question.en }}
            </div>

            <div class="answers">

              <div :class="item.type" v-if="item.type === 'checkbox'">

                <div class="field-wrapper" v-for="(answer, index1) in item.answers[language === 'DEU' ? 'de' : 'en']" :key="index1">

                  <input class="checkbox field"
                         type="checkbox"
                         :id="'checkboxes-question1-' + index1"
                         :value="answer"
                         v-model="item.selectedAnswers">
                  <label :for="'checkboxes-question1-' + index1">{{ answer }}</label>

                </div>

                <div class="field-wrapper" v-if="item.selectedAnswers.includes('Sonstiges') || item.selectedAnswers.includes('Others')">
                  <TextAreaField inputName="notice" :inputVal="item.answerOthersText" v-model="item.answerOthersText"></TextAreaField>
                  <label class="ph">{{ language === 'DEU' ? 'Sonstige Bemerkung:' : 'Additional notes:' }}</label>
                </div>

              </div>

              <div :class="item.type" v-else>

                <div class="field-wrapper rating" v-if="item.type === 'rating'">
                  <div class="information-rating">
                    ({{ language === 'DEU' ? '1 = Sehr unzufrieden, 5 = Sehr zufrieden' : '1 = Very unsatisfied, 5 = Very satisfied' }})
                  </div>

                  <starIcon :id="index+1"
                            :class="{'active': index+1 <= item.answer}"
                            v-for="(range, index) in 5"
                            @click="item.answer = index+1"
                            style="margin-left:5px; font-size: 20px;"
                            :isFavored="index+1 <= item.answer"
                  ></starIcon>

                </div>

                <div class="field-wrapper radio" v-else-if="item.type === 'radio'">
                  <label :for="index+'-'+index1" class="radio-wrapper" v-for="(answer, index1) in item.answers[language === 'DEU' ? 'de' : 'en']" :key="index1">
                    <InputField inputType="radio" :id="index+'-'+index1" :inputName="index+'-'+index1" :value="answer === 'Ja' || answer === 'Yes'" :inputValue="item.selectedAnswers" v-model="item.selectedAnswers"></InputField>
                    {{answer}}
                  </label>
                </div>

                <div class="field-wrapper" v-else-if="item.type === 'text'">
                  <TextAreaField inputName="notice" :inputVal="item.answer" v-model="item.answer"></TextAreaField>
                  <label class="ph">{{ language === 'DEU' ? 'Ihr Meinung:' : 'Your opinion:' }}</label>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div class="actions" :style="{ justifyContent: currentStep === 1 ? 'end' : '' }" v-if="!alreadySubmitted">
          <Button type="edit" v-if="currentStep > 1" @click="currentStep = currentStep-1">{{ language === 'DEU' ? 'Zurück' : 'Back' }}</Button>
          <Button type="create reservation" @click="nextStep()" v-if="currentStep !== maxSteps">
            {{ language === 'DEU' ? 'Weiter' : 'Next' }}
          </Button>
          <Button type="create reservation" v-else @click="submitData()">
            {{ language === 'DEU' ? 'Feedback abschicken' : 'Send feedback' }}
            <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>
          </Button>
        </div>
      </div>

      <div v-else class="loading">
        <AnimateCircleIcon style="margin-bottom: 15px;"></AnimateCircleIcon>
        Lade Daten...
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
  margin-top: 25px;
}

.field-wrapper > span + span {
  margin-top: 25px;
}

.field-wrapper.radio {
  text-align: center;
}

.field-wrapper.two-col span {
  flex-basis: 100%;
}

input.checkbox {
  flex-basis: auto;
}

.answers > .checkbox {
  margin-top: 25px;
}

.checkbox .field-wrapper {
  justify-content: start;
}

.checkbox .field-wrapper *,
.field-wrapper.radio *,
.field-wrapper.rating *{
  cursor: pointer;
}

.rating i.fa-star.active {
  color: var(--blue);
  transition: color .2s;
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

.checkmark-wrapper {
  position: absolute;
  left: -30px;
  top: -2px;
  display: inline-block;
  width: 25px;
  height: 25px;
  background: var(--light-gray);
  border-radius: 100%;
  transition: background 0.2s;
}

.checkmark-inner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.checkmark-inner-wrapper i {
  color: white;
}

.checkmark-wrapper.active {
  background: var(--green);
}

.checkmark-wrapper.error {
  background: var(--red);
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

.page-1 label:first-of-type {
  margin-right: 15px;
}

.question {
  font-weight: 600;
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

.question[for="languageEng"] {
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

.question-wrapper + .question-wrapper {
  margin-top: 25px;
}

.google-rating {
  margin-top: 25px;
}

.google-rating a {
  font-weight: bold;
  color: var(--blue)
}

.loading {
  width: 100%;
  text-align: center;
}

.loading .loading-animation {
  font-size: 40px;
  margin-left: 0;
}

.information-rating {
  width: 100%;
  margin-bottom: 25px;
  font-size: 12px;
  font-style: italic
}

.field-wrapper.rating {
  margin-top: 0;
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
  .field-wrapper.radio {
    justify-content: space-around;
  }

  .actions {
      flex-wrap: wrap;
  }

  .actions .button {
    flex-basis: 100% !important;
  }
}

</style>
