<script>
  import CreateReservationProgressBar from "@/components/card/CreateReservationProgressBar.vue";
  import InputField from "@/components/forms/InputField.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import Button from "@/components/buttons/button.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import axios from "axios";

  export default {
    name: "GwgInternForm",
    components: {AsterixMarkIcon, TextAreaField, InputField, CreateReservationProgressBar, Button},
    props: {
      triggerFormValidation: {
        type: String,
        default: '',
      },
      company: String,
      entity: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        formData: {
          company: {
            value: this.company === 'living' ? 'BEST PLACE Living GmbH' : 'BEST PLACE Immobilien GmbH & Co. KG',
            valid: ''
          },
          kindOfTransaktion: {
            value: 'Verkauf',
            valid: true
          },
          kindOfTransaktionOthersText: {
            value: '',
            valid: ''
          },
          otherTransaktionRelatedCompanies: {
            value: this.entity,
            valid: true
          },
          isRiskyCustomer: {
            value: false,
            valid: ''
          },
          riskyCustomerIndustry: {
            value: [],
            valid: ''
          },
          customerIsInRiskyCountry: {
            value: false,
            valid: ''
          },
          isPep: {
            value: false,
            valid: ''
          },
          managingOfEconomicBeneficiaries: {
            value: false,
            valid: ''
          },
          beneficiariesName: {
            value: '',
            valid: true
          },
          customerHasStrangeBehavior: {
            value: false,
            valid: ''
          },
          isStrangeBehaviorDangerForCovivio: {
            value: false,
            valid: ''
          },
          isStrangeBehaviorDangerForCovivioMsg: {
            value: '',
            valid: ''
          },
        },

        formDataValid: false,

        riskyIndustries: [
          'Wett- und Spieleinrichtung',
          'Metall-/Edelsteinhandel',
          'Anbieter von Treuhanddienstleistungen',
          'Gastronomie und Hotellerie',
          'Virtuelle/s Zahlungsmittel/Geld',
          'Immobilienwirtschaft',
          'Verkauf/Handel/Vermittlung von/mit hochwertigen Gütern (z.B. Luxusgüter, Antiquitäten, Kunstgegenstände, Autos/Fahrzeuge, Maschinen)',
        ],
      }
    },
    watch: {
      'formData.kindOfTransaktionOthersText.value': function(newVal) {
        this.formData.kindOfTransaktion.value = '';
      },
      'formData.kindOfTransaktion.value': function(newVal) {
        this.formData.kindOfTransaktionOthersText.value = '';
      },
      'formData.isRiskyCustomer.value': function(newVal) {
        this.formData.riskyCustomerIndustry.value = [];
      },
      'formData.managingOfEconomicBeneficiaries.value': function(newVal) {
        this.formData.beneficiariesName.value = '';
      },
      'formData.customerHasStrangeBehavior.value': function(newVal) {
        this.formData.isStrangeBehaviorDangerForCovivio.value = false;
        this.formData.isStrangeBehaviorDangerForCovivioMsg.value = '';
      },
      'formData.isStrangeBehaviorDangerForCovivio.value': function(newVal) {
        this.formData.isStrangeBehaviorDangerForCovivioMsg.value = '';
      },
      formData: {
        handler(val){
          this.$parent.internalGWGFormData = this.formData;
        },
        deep: true,
      },
      triggerFormValidation: function(){
        let formData = this.formData;
        let validation = true;

        if ( (!formData.kindOfTransaktion.value || formData.kindOfTransaktion.value === '') ){
          this.formData.kindOfTransaktion.valid = false;
          validation = false;
        } else {
          this.formData.kindOfTransaktion.valid = true;
        }

        if ( !formData.kindOfTransaktionOthersText.value || formData.kindOfTransaktionOthersText.value === '' ){
          this.formData.kindOfTransaktionOthersText.valid = false;
          validation = false;
        } else {
          this.formData.kindOfTransaktionOthersText.valid = true;
        }

        if ( this.formData.kindOfTransaktionOthersText.valid || this.formData.kindOfTransaktion.valid ) {
          validation  = true;
        }

        if ( formData.managingOfEconomicBeneficiaries.value === 'true' ) {
          if ( !formData.beneficiariesName.value || formData.beneficiariesName.value === '' ){
            this.formData.beneficiariesName.valid = false;
            validation = false;
          } else {
            this.formData.beneficiariesName.valid = true;
          }
        }
        this.$parent.internalGWGFormData = this.formData;
        this.$emit('validationResults', validation)

      }
    }
  }
</script>

<template>

  <form>

      <div class="titel">Allgemeine interne Informationen</div>
      <div class="question">Verpflichtete Gesellschaft i.S.d. GWG:</div>
      <div class="field-wrapper">
        <label for="company" class="radio-wrapper">
          <InputField inputType="radio" id="company" inputName="company" :value="formData.company.value" :inputValue="formData.company.value"  v-model="formData.company.value"></InputField>
          <span>{{ formData.company.value }}</span>
        </label>
      </div>
      <div class="question">Art der Transaktion:</div>
      <div class="field-wrapper">
<!--        <label for="kindOfTransaction-1" class="radio-wrapper" :class="{'invalid': !formData.kindOfTransaktion.valid && !formData.kindOfTransaktionOthersText.valid}">-->
<!--          <InputField inputType="radio" id="kindOfTransaction-1" inputName="kindOfTransaction-1" value="Erwerb" :inputValue="formData.kindOfTransaktion.value"  v-model="formData.kindOfTransaktion.value"></InputField>-->
<!--          <span>Erwerb</span>-->
<!--        </label>-->
        <label for="kindOfTransaction-2" class="radio-wrapper">
          <InputField inputType="radio" id="kindOfTransaction-2" inputName="kindOfTransaction-2" value="Verkauf" :inputValue="formData.kindOfTransaktion.value" v-model="formData.kindOfTransaktion.value"></InputField>
          <span>Verkauf</span>
        </label>
<!--        <label for="kindOfTransaction-3" class="radio-wrapper">-->
<!--          <InputField inputType="radio" id="kindOfTransaction-3" inputName="kindOfTransaction-3" value="Vermietung" :inputValue="formData.kindOfTransaktion.value" v-model="formData.kindOfTransaktion.value"></InputField>-->
<!--          <span>Vermietung</span>-->
<!--        </label>-->
      </div>
      <div class="question">Weitere an der Transaktion beteiligte Covivio Gesellschaft(en) (z.B. (Ver-)Käufergesellschaft /Vermietergesellschaft):</div>
      <div class="field-wrapper">
        <InputField inputType="text" :inputValue="formData.otherTransaktionRelatedCompanies.value" v-model="formData.otherTransaktionRelatedCompanies.value"></InputField>
        <label class="ph">Gesellschaft/en</label>
      </div>

      <div class="titel">Angaben zur Gegenpartei – natürliche Person</div>
      <div class="question">a. Ist der Geschäftspartner in einer risikoreichen Branche (s. Aufzählung unten) tätig?</div>
      <label for="isRiskyCustomer-1" class="radio-wrapper">
        <InputField inputType="radio" id="isRiskyCustomer-1" inputName="isRiskyCustomer-1" value="true" :inputValue="formData.isRiskyCustomer.value" v-model="formData.isRiskyCustomer.value"></InputField>
        <span>Ja</span>
      </label>
      <label for="isRiskyCustomer-2" class="radio-wrapper">
        <InputField inputType="radio" id="isRiskyCustomer-2" inputName="isRiskyCustomer-2" value="false" :inputValue="formData.isRiskyCustomer.value" v-model="formData.isRiskyCustomer.value"></InputField>
        <span>Nein</span>
      </label>
      <div class="field-wrapper risky-industries" v-if="formData.isRiskyCustomer.value === 'true'">
        <label :for="industy" class="checkbox-wrapper" v-for="(industy) in riskyIndustries" :key="industy">
          <InputField inputType="checkbox" :id="industy" :inputName="industy" :value="industy" :inputValue="formData.riskyCustomerIndustry.value"  v-model="formData.riskyCustomerIndustry.value"></InputField>
          <span>{{ industy }}</span>
        </label>
      </div>

      <div class="question">b. Hat der Geschäftspartner seinen Wohnsitz oder wirtschaftliche Interessen in Risikoländern oder Ländern, die restriktiven Maßnahmen/Sanktionen des deutschen Staates bzw. der EU unterliegen (siehe Anlage 1)? Tätigt er Geschäfte mit solchen Ländern?</div>
      <label for="isRiskyCountry-1" class="radio-wrapper">
        <InputField inputType="radio" id="isRiskyCountry-1" inputName="isRiskyCountry-1" value="true" :inputValue="formData.customerIsInRiskyCountry.value" v-model="formData.customerIsInRiskyCountry.value"></InputField>
        <span>Ja</span>
      </label>
      <label for="isRiskyCountry-2" class="radio-wrapper">
        <InputField inputType="radio" id="isRiskyCountry-2" inputName="isRiskyCountry-2" value="false" :inputValue="formData.customerIsInRiskyCountry.value" v-model="formData.customerIsInRiskyCountry.value"></InputField>
        <span>Nein</span>
      </label>

      <div class="info" v-if="formData.isRiskyCustomer.value === 'true' || formData.customerIsInRiskyCountry.value === 'true'">Hinweis: Wenn Sie eine der Fragen a) oder b) mit „Ja“ beantwortet haben, informieren Sie bitte den IA /IC Korrespondenten ihrer Abteilung entsprechend, bevor Sie die Geschäftsbeziehung fortsetzen.</div>

      <div class="question">c. Handelt der Geschäftspartner für einen wirtschaftlich Berechtigten?</div>
      <label for="managingOfEconomicBeneficiaries-1" class="radio-wrapper">
        <InputField inputType="radio" id="managingOfEconomicBeneficiaries-1" inputName="managingOfEconomicBeneficiaries-1" value="true" :inputValue="formData.managingOfEconomicBeneficiaries.value" v-model="formData.managingOfEconomicBeneficiaries.value"></InputField>
        <span>Ja</span>
      </label>
      <label for="managingOfEconomicBeneficiaries-2" class="radio-wrapper">
        <InputField inputType="radio" id="managingOfEconomicBeneficiaries-2" inputName="managingOfEconomicBeneficiaries-2" value="false" :inputValue="formData.managingOfEconomicBeneficiaries.value" v-model="formData.managingOfEconomicBeneficiaries.value"></InputField>
        <span>Nein</span>
      </label>

      <div class="field-wrapper" v-if="formData.managingOfEconomicBeneficiaries.value === 'true'" :class="{'invalid': !formData.beneficiariesName.valid}">
        <InputField inputType="text" :inputValue="formData.beneficiariesName.value" v-model="formData.beneficiariesName.value"></InputField>
        <label class="ph">Namen des Berechtigten <AsterixMarkIcon></AsterixMarkIcon></label>
      </div>

      <div class="question">d. Handelt es sich bei dem Geschäftspartner und / oder einem wirtschaftlich Berechtigten oder ein Familienmitglied oder um eine bekanntermaßen nahestehende Person um eine politisch exponierte Person?</div>
      <label for="isPep-1" class="radio-wrapper">
        <InputField inputType="radio" id="isPep-1" inputName="isPep-1" value="true" :inputValue="formData.isPep.value" v-model="formData.isPep.value"></InputField>
        <span>Ja</span>
      </label>
      <label for="isPep-2" class="radio-wrapper">
        <InputField inputType="radio" id="isPep-2" inputName="isPep-2" value="false" :inputValue="formData.isPep.value" v-model="formData.isPep.value"></InputField>
        <span>Nein</span>
      </label>

      <div class="question">e. Verhält sich die handelnde nat. Person fragwürdig?</div>
      <label for="customerHasStrangeBehavior-1" class="radio-wrapper">
        <InputField inputType="radio" id="customerHasStrangeBehavior-1" inputName="customerHasStrangeBehavior-1" value="true" :inputValue="formData.customerHasStrangeBehavior.value" v-model="formData.customerHasStrangeBehavior.value"></InputField>
        <span>Ja</span>
      </label>
      <label for="managingOfEconomicBeneficiaries-2" class="radio-wrapper">
        <InputField inputType="radio" id="customerHasStrangeBehavior-2" inputName="customerHasStrangeBehavior-2" value="false" :inputValue="formData.customerHasStrangeBehavior.value" v-model="formData.customerHasStrangeBehavior.value"></InputField>
        <span>Nein</span>
      </label>

      <div class="question" v-if="formData.customerHasStrangeBehavior.value === 'true'">f. Stellt der Geschäftspartner ein potenzielles Risiko für die Glaubwürdigkeit von Covivio dar?</div>
      <label for="isStrangeBehaviorDangerForCovivio-1" class="radio-wrapper" v-if="formData.customerHasStrangeBehavior.value === 'true'">
        <InputField inputType="radio" id="isStrangeBehaviorDangerForCovivio-1" inputName="isStrangeBehaviorDangerForCovivio-1" value="true" :inputValue="formData.isStrangeBehaviorDangerForCovivio.value" v-model="formData.isStrangeBehaviorDangerForCovivio.value"></InputField>
        <span>Ja</span>
      </label>
      <label for="isStrangeBehaviorDangerForCovivio-2" class="radio-wrapper" v-if="formData.customerHasStrangeBehavior.value === 'true'">
        <InputField inputType="radio" id="isStrangeBehaviorDangerForCovivio-2" inputName="isStrangeBehaviorDangerForCovivio-2" value="false" :inputValue="formData.isStrangeBehaviorDangerForCovivio.value" v-model="formData.isStrangeBehaviorDangerForCovivio.value"></InputField>
        <span>Nein</span>
      </label>
      <div class="field-wrapper" v-if="formData.isStrangeBehaviorDangerForCovivio.value === 'true'">
        <TextAreaField inputPlaceholder="Weitere Angaben / Anmerkungen" inputName="isStrangeBehaviorDangerForCovivioMsg" :inputVal="formData.isStrangeBehaviorDangerForCovivioMsg.value" v-model="formData.isStrangeBehaviorDangerForCovivioMsg.value"></TextAreaField>
        <label class="ph">Weitere Angaben / Anmerkungen</label>
      </div>
  </form>

</template>


<style scoped>

.titel {
  font-size: 16px;
  font-weight: 700;
  margin-top: 25px;
}

.titel, .question {
  width: 100%;
}

.question {
  margin-top: 25px;
  margin-bottom: 15px;
}

.titel:before, .question:before {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  margin: 0 auto 15px;
  background-color: var(--gray-text);
  opacity: 0.3;
}

form > div.titel:first-of-type:before {
  display: none;
}

.titel + .question:before {
  display: none;
}

label.radio-wrapper{
  display: inline-block;
}

label {
  text-align: center;
}

.info {
  font-weight: 700;
  font-style: italic;
  margin-top: 15px;
}

.field-wrapper + .field-wrapper,
[for="managingOfEconomicBeneficiaries-2"] + .field-wrapper,
[for="isStrangeBehaviorDangerForCovivio-2"] + .field-wrapper {
  margin-top: 15px;
}

.risky-industries {
  margin-top: 15px;
}

label {
  cursor: pointer;
}

.risky-industries label {
  display: block;
  width: 100%;
  text-align: left;
  margin-left:25px;
}

.risky-industries label + label {
  margin-top: 5px;
}

.risky-industries label input {
  margin-right: 15px;
  margin-left:0px;
}

</style>
