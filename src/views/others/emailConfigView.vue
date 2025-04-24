<script>

import Navigation from "@/components/Navigation.vue";
import IconDelete from "@/components/icons/icon-delete.vue";
import iconPlus from "@/components/icons/icon-plus.vue";
import Seperator from "@/components/utility/Seperator.vue";
import InputField from "@/components/forms/InputField.vue";
import iconCheckmark from "@/components/icons/icon-checkmark.vue";
import iconCancle   from "@/components/icons/icon-cancle.vue";
import iconClose from "@/components/icons/icon-close.vue";
import iconCross from "@/components/icons/icon-cross.vue";
import AlertMessage from "@/components/card/AlertMessage.vue";
import axios from "axios";


export default {
  data(){
    return{
      SalesTemplateValue : null,
      SelectedBautrager : null,
      ShowBautrager : false,
      isLoading : false,
      activeEmailInputIndex: null,
      newEmail: "",
      newEmailValue: "",
      showEmailInput: false,
      templateEmails : {},
      bankInfo: {
        Bank: "",
        IBAN: "",
        BIC: "",
      },
      gdprEmails : [''],
      propertyDevId: "",
      showAlert:false,
      alertStatus : '',
      alertMessage : '',

      bautragerList: [
        {
          label: "Skjerven",
        },
        {
          label: "Bauwert",
        },
        {
          label: "BDRE Fünfte Grundwert GmbH",
        },
        {
          label: "Berliner Jungens",
        },
        {
          label: "Blueprint Project",
        },
        {
          label: "BWFD",
        },
        {
          label: "Compexx",
        },
        {
          label: "Covivio",
        },
        {
          label: "CW-IVB",
        },
        {
          label: "D&Co",
        },
        {
          label: "D&H",
        },
        {
          label: "Dreimann Construction",
        },
        {
          label: "Euroboden",
        },
        {
          label: "FiWi Immobilien",
        },
        {
          label: "Homebase",
        },
        {
          label: "Hypotreuhand",
        },
        {
          label: "Inter Stadt",
        },
        {
          label: "Krieger + Schramm",
        },
        {
          label: "La Grande",
        },
        {
          label: "MHMI",
        },
      ],




      subCategories: [
        { value: 'Reservation created', label: 'Reservation created', template: 'Reservierung' },
        { value: 'Webform submitted', label: 'Webform submitted', template: 'Reservierung' },
        { value: 'Customer opened webform first time', label: 'Customer opened webform first time', template: 'Reservierung' },
        { value: 'Yousign invitation', label: 'Yousign invitation', template: 'Reservierung' },
        { value: 'Customer signed paper', label: 'Customer signed paper', template: 'Reservierung' },
        { value: 'Reservation approved', label: 'Reservation approved', template: 'Reservierung' },
        { value: 'Reservation rejected', label: 'Reservation rejected', template: 'Reservierung' },
        { value: 'Reservation receipt', label: 'Reservation receipt', template: 'Reservierung' },
        { value: 'Storno Units', label: 'Storno Units', template: 'Reservierung' },
        { value: 'Storno fee not paid', label: 'Storno fee not paid', template: 'Reservierung' },
        { value: '7 steps', label: '7 steps', template: 'Reservierung' },
        { value: 'prepare finance', label: 'prepare finance', template: 'Reservierung' },
        { value: 'NDB Invitation', label: 'NDB Invitation', template: 'Abwicklung', category: 'NDB' },
        { value: 'NDB first open Webform', label: 'NDB first open Webform', template: 'Abwicklung', category: 'NDB' },
        { value: 'NDB Customer submitted webform', label: 'NDB Customer submitted webform', template: 'Abwicklung', category: 'NDB' },
        { value: 'Agent submitted NDB', label: 'Agent submitted NDB', template: 'Abwicklung', category: 'NDB' },
        { value: 'NDB approved', label: 'NDB approved', template: 'Abwicklung', category: 'NDB' },
        { value: 'NDB rejected', label: 'NDB rejected', template: 'Abwicklung', category: 'NDB' },
        { value: 'Yousign external GWG', label: 'Yousign external GWG', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'External GWG invitation', label: 'External GWG invitation', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'External GWG finished signature', label: 'External GWG finished signature', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'Internes GWG', label: 'Internes GWG', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'internal GWG Invitation', label: 'internal GWG Invitation', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'Internal GWG submitted', label: 'Internal GWG submitted', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'Internal GWG approved', label: 'Internal GWG approved', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'External GWG rejected', label: 'External GWG rejected', template: 'Abwicklung', category: 'Externes GWG' },
        { value: 'Finance Invitation', label: 'Finance Invitation', template: 'Abwicklung', category: 'Finanzierungd' },
        { value: 'Finance webform submitted', label: 'Finance webform submitted', template: 'Abwicklung', category: 'Finanzierungd' },
        { value: 'Finance approved', label: 'Finance approved', template: 'Abwicklung', category: 'Finanzierungd' },
        { value: 'Finance rejected', label: 'Finance rejected', template: 'Abwicklung', category: 'Finanzierungd' },
        { value: 'KV Email to Covivio', label: 'KV Email to Covivio', template: 'Abwicklung', category: 'Kaufvertragn' },
        { value: 'KV Final Upload', label: 'KV Final Upload', template: 'Abwicklung', category: 'Kaufvertragn' },
        { value: 'KV requested by Agent Email', label: 'KV requested by Agent Email', template: 'Abwicklung', category: 'Kaufvertragn' },
        { value: 'KV Email discount approve', label: 'KV Email discount approve', template: 'Abwicklung', category: 'Kaufvertragn' },
        { value: 'Provision request Email', label: 'Provision request Email', template: 'Abwicklung', category: 'Maklerprovision' },
        { value: 'Provision Approval Email', label: 'Provision Approval Email', template: 'Abwicklung', category: 'Maklerprovision' },
        { value: 'KV Email notary appointment created', label: 'KV Email notary appointment created', template: 'Notartermin' },
        { value: 'Email reminder', label: 'Email reminder', template: 'Notartermin' },
        { value: 'Notary appointment reminder customer', label: 'Notary appointment reminder customer', template: 'Notartermin' },
        { value: 'KV Email notary appointment change', label: 'KV Email notary appointment change', template: 'Notartermin' },
        { value: 'KV Email notary appointment canceled', label: 'KV Email notary appointment canceled', template: 'Notartermin' },
        { value: 'notary appointment not take place', label: 'notary appointment not take place', template: 'Notartermin' },
        { value: 'Beurkundung Email Reservation', label: 'Beurkundung Email Reservation', template: 'Beurkundung' },
        { value: 'KV Email discount rejection', label: 'KV Email discount rejection', template: 'Beurkundung' },
        { value: 'Beurkundung Email Unit Cancel', label: 'Beurkundung Email Unit Cancel', template: 'Beurkundung' },
        { value: 'Beurkundung Email Sale', label: 'Beurkundung Email Sale', template: 'Beurkundung' },
        { value: 'Beurkundung Email complete cancel', label: 'Beurkundung Email complete cancel', template: 'Beurkundung' },
        { value: 'Feedback Email Sale', label: 'Feedback Email Sale', template: 'Feedback' },
        { value: 'Feedback Email Cancel', label: 'Feedback Email Cancel', template: 'Feedback' }
      ]
      ,


      SalesTemplateList : [
        { value: 'Reservierung' , label : 'Reservierung'},
        { value: 'Abwicklung' , label : 'Abwicklung'},
        { value: 'Notartermin' , label : 'Notartermin'},
        { value: 'Beurkundung' , label : 'Beurkundung'},
        { value: 'Feedback' , label : 'Feedback'},
      ],

    }
  },
  components : {
    Navigation,
    IconDelete,
    iconPlus,
    Seperator,
    InputField,
    iconCheckmark,
    iconCancle,
    iconClose,
    iconCross,
    AlertMessage
  },
  computed : {

    filteredSubCategories() {
        return this.subCategories.filter(
            (subCategory) => subCategory.template === this.SalesTemplateValue
        );
    },
    filteredbautragerList() {
      console.log(this.SelectedBautrager);
      return this.bautragerList.filter(
          (ListItem) => ListItem.label === this.SelectedBautrager
      );
    }

  },
  methods : {
    handleSelction(type, selectedValue) {
      if (type === "template") {
        this.SalesTemplateValue = selectedValue;
        this.SalesTemplateSelected = true;
        this.selectedAbwicklungCategory = null;
        this.ToogleAbwicklung = false;
      }
    },



    showAddEmailInput(subCategoryName) {
      this.templateEmails[subCategoryName].push('');
    },
    cancelEmailAddition() {
      this.newEmail = "";
      this.activeEmailInputIndex = null;
    },
    addEmailToTemplate(subCategoryKey) {
      console.log("New email value:", this.newEmail);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(this.newEmail)) {
        if (!this.templateEmails[subCategoryKey]) {
          this.$set(this.templateEmails, subCategoryKey, []);
        }

        if (this.templateEmails[subCategoryKey].includes(this.newEmail)) {
          alert("Diese E-Mail-Adresse existiert bereits in dieser Kategorie.");
          return;
        }

        this.templateEmails[subCategoryKey].push(this.newEmail);
        this.newEmail = "";
        this.activeEmailInputIndex = null;
      } else {
      }
    },

    removeEmailFromTemplate(subCategoryKey, emailIndex) {
      if (this.templateEmails[subCategoryKey]) {
        this.templateEmails[subCategoryKey].splice(emailIndex, 1);
      }
    },
    handleBlur(subCategoryKey) {
      this.addEmailToTemplate(subCategoryKey);
    },

    async handleBautrager(event){
      this.SelectedBautrager = event.target.value;
      if(this.SelectedBautrager == 'none'){
        this.ShowBautrager =false;
      }else {
        this.ShowBautrager =true;
      }

      await this.setContent();


    },
    async setContent() {
      this.isLoading = true;
      this.ShowBautrager = false;

      try {
        const response = await this.getPropertyDeveloperData();
        if (response && response.length > 0) {
          const dataset = JSON.parse(response[0].dataset);
          this.bankInfo = {
            Bank: dataset.bank_information.bankname || '',
            IBAN: dataset.bank_information.iban || '',
            BIC: dataset.bank_information.bic || ''
          };
          this.gdprEmails = dataset.gdpr_emails || [''];
          this.propertyDevId = response[0].id;
          if (dataset.template_emails && Object.keys(dataset.template_emails).length > 0) {
            this.templateEmails = dataset.template_emails;
          }
        } else {

          this.bankInfo = { Bank: '', IBAN: '', BIC: '' };
          this.gdprEmails = [''];
          this.propertyDevId = '';

        }
        this.initializeTemplateEmails();

      } catch (error) {
        this.bankInfo = { Bank: '', IBAN: '', BIC: '' };
        this.gdprEmails = [''];
        this.initializeTemplateEmails();
        this.propertyDevId='';
      }finally {
        this.isLoading = false;
        this.ShowBautrager = true;
      }
    },
    initializeTemplateEmails() {

      this.subCategories.forEach((subCategory) => {
        if ( this.isEmpty(this.templateEmails[subCategory.value]) ) {
          this.templateEmails[subCategory.value] = [''];
        }
      });

    },
    async getPropertyDeveloperData(){

      try {
        const body = {
          data : {
            category: "property developer",
            identifier:  this.SelectedBautrager
          }
        };
        const url = this.globalApiMicroserviceBaseUrl+'/options/get'
        const response = await axios.post(url,body);

        this.ShowBautrager =true;

        return response.data;

      } catch (error) {
        console.error("Error fetching templates:", error.message);
      }

    },

    handleShowNewEmailInput() {
      this.gdprEmails.push('');
    },

    handleBlurNewEmail() {
      if (this.newEmailValue && this.newEmailValue.includes("@")) {
        if (this.gdprEmails.includes(this.newEmailValue)) {
          alert("Diese E-Mail-Adresse existiert bereits.");
        } else {
          this.gdprEmails.push(this.newEmailValue);
        }
      }
      this.newEmailValue = "";
      this.showEmailInput = false;
    },

    handleEnterNewEmail() {
      if (this.newEmailValue && this.newEmailValue.includes("@")) {
        if (this.gdprEmails.includes(this.newEmailValue)) {
          alert("Diese E-Mail-Adresse existiert bereits.");
        } else {
          this.gdprEmails.push(this.newEmailValue);
        }
      }
      this.newEmailValue = "";
      this.showEmailInput = false;
    },

    handleConfirmEmailUpdate(emailIndex) {
      const email = this.gdprEmails[emailIndex];
      if (email && email.includes("@")) {
        alert("E-Mail wurde aktualisiert!");
      } else {
        alert("Ungültige E-Mail-Adresse.");
      }
    },

    handleRemoveEmail(emailIndex) {
      this.gdprEmails.splice(emailIndex, 1);
    },
    async savePropertyDeveloper(){

      const body = {
        data : {
          category: "property developer",
          dataset : {
            gdpr_emails : this.gdprEmails,
            bank_information : {
              bankname : this.bankInfo.Bank,
              iban : this.bankInfo.IBAN,
              bic : this.bankInfo.BIC
            },
            template_emails : this.templateEmails,
          },
          identifier : this.SelectedBautrager
        }

      };

      if (this.propertyDevId){

        try {
          const url = this.globalApiMicroserviceBaseUrl+'/options/update'
          const response = await axios.post(url,body);

          console.log("Response:", response);
          this.notificationBannerInit(
              "success",
              "Erfolgreich gespeichert"
          );
        }catch (error){
          console.error("Error during PUT request:", error);
          this.notificationBannerInit(
              "warning",
              "Beim Speichern ist ein Fehler aufgetreten"
          );
        }

      }else {

        try {
          const url = this.globalApiMicroserviceBaseUrl+'/options/store'
          const response = await axios.post(url,body,);
          console.log("Response:", response);
          this.notificationBannerInit(
              "success",
              "Erfolgreich gespeichert"
          );

        }catch (error){
          console.error("Error during POST request:", error);
          this.notificationBannerInit(
              "warning",
              "Beim Speichern ist ein Fehler aufgetreten."
          );

        }

      }

    }

  }
}

</script>

<template>
  <Navigation />
  <div class="parent_div">
    <div class="alert_div" v-if="showAlert">
      <AlertMessage :alertStatus="alertStatus" :alertText="alertMessage" />
    </div>
    <div class="list_dropdown">
      <!-- Bauträger Dropdown -->
      <div class="template_list">
        <select class="selection" @change="handleBautrager($event)">
          <option value="none">Bauträger auswählen</option>
          <option v-for="list in bautragerList" :key="list.label" :value="list.label">
            {{ list.label }}
          </option>
        </select>

      </div>



      <div class="bu_info_div" v-if="ShowBautrager">
        <h4>Allgemeine Informationen zum Bauträger</h4>

        <div class="email_list_dat">
          <p class="label" :style="{ paddingTop: '40px' }">Datenschutzbeauftragter:</p>

          <div class="datenschutz-item">
            <div class="email-cards">
              <div
                  v-for="(email, emailIndex) in gdprEmails"
                  :key="emailIndex"
                  class="email-card"
              >
                <inputField inputType="email"
                            inputPlaceholder="Mail"
                            :inputName="emailIndex+'-gdpr'"
                            :inputValue="gdprEmails[emailIndex]"
                            v-model="gdprEmails[emailIndex]"
                />
                <div class="card-buttons" style="color:var(--red)">
                  <IconDelete @click="handleRemoveEmail(emailIndex)" />
                </div>
                <!-- Add button only for the last email -->
                <iconPlus v-if="emailIndex === gdprEmails.length - 1"
                          class="add-btn"
                          @click="handleShowNewEmailInput" />
              </div>
            </div>
          </div>
        </div>

        <!-- Bank Information -->

        <div class="detail_field">
          <h4>Bankinformationen</h4>
          <div v-if="filteredbautragerList.length > 0" class="bank-info">
            <div class="info-item">
              <label class="label" for="bank">Bank:</label>
              <input
                  id="bank"
                  type="text"
                  v-model="bankInfo.Bank"
                  class="value-input styled-input"
              />
            </div>
            <div class="info-item">
              <label class="label" for="iban">IBAN:</label>
              <input
                  id="iban"
                  type="text"
                  v-model="bankInfo.IBAN"
                  class="value-input styled-input"
              />
            </div>
            <div class="info-item">
              <label class="label" for="bic">BIC:</label>
              <input
                  id="bic"
                  type="text"
                  v-model="bankInfo.BIC"
                  class="value-input styled-input"
              />
            </div>
          </div>
          <div v-else>
            <p>Keine Bankinformationen für den ausgewählten Bauträger verfügbar.</p>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading_div">Laden .....</div>

<!--      <div v-else class="no-info">-->
<!--        <p>Keine Informationen verfügbar.</p>-->
<!--      </div>-->

    </div>

    <Seperator v-if="ShowBautrager"/>

    <!-- Sales Template Dropdown -->
    <div class="template_list" :style="{ paddingTop: '30Wv' }" v-if="ShowBautrager">
      <select class="selection" @change="handleSelction('template', $event.target.value)">
        <option value="" disabled selected>Bitte auswählen</option>
        <option v-for="list in SalesTemplateList" :key="list.value" :value="list.value">
          {{ list.label }}
        </option>
      </select>

    </div>

    <Seperator v-if="ShowBautrager"/>

<!--  </div>-->

    <div class="flex-container" v-if="ShowBautrager">
      <div v-for="(subCategory, index) in filteredSubCategories" :key="index" class="flex-row">
        <!-- Check for matching keys in templateEmails -->
        <div class="subcategory">
          {{ subCategory.value }}
        </div>
        <div class="email-card-container">

          <div v-if="templateEmails[subCategory.value] && templateEmails[subCategory.value].length > 0">

            <div
                v-for="(email, emailIndex) in templateEmails[subCategory.value]"
                :key="emailIndex"
                class="email-card"
            >
              <inputField inputType="email"
                          inputPlaceholder="Mail"
                          :inputName="emailIndex+'-'+subCategory.value"
                          :inputValue="templateEmails[subCategory.value][emailIndex]"
                          v-model="templateEmails[subCategory.value][emailIndex]"
              />
              <div class="card-buttons" style="color:var(--red);">
                  <IconDelete @click="removeEmailFromTemplate(subCategory.value, emailIndex)" />
              </div>
              <iconPlus v-if="emailIndex === templateEmails[subCategory.value].length - 1"
                        @click="showAddEmailInput(subCategory.value)"
                        style="color:var(--blue)"
              />
            </div>

          </div>
        </div>
        <Seperator />
      </div>
    </div>

    <div class="save_button" @click="savePropertyDeveloper">
      <span>Speichern</span>
    </div>
  </div>

</template>



<style scoped>

.email-card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.email-card-container > div {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.save_button {
  position: fixed;
  bottom: 5px;
  right: 20px;
  cursor: pointer;
  color: white;
  background-color: #4E7DEE;
  width: 100px;
  height: 45px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  line-height: 45px;
  transition: background-color 0.3s, transform 0.2s;
  z-index: 1000;
}


.save_button:hover {
  background-color: #3C6ABD;
  transform: scale(1.05);
}

.save_button:active {
  background-color: #2E5599;
  transform: scale(0.95);
}

.save_button:focus {
  outline: none; /* Remove default focus outline */
  box-shadow: 0 0 5px rgba(78, 125, 238, 0.5); /* Add subtle glow for accessibility */
}

.email_list_dat {
  display: flex;
}

.email-input {
  width: 200px;
  padding: 5px;
  font-size: 14px;
  color: #5985EF;
  border: none;
  border-radius: 8px;
  background: transparent;
  outline: none;
}

.email-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(89, 133, 239, 0.5);
}

.datenschutz-container {
  font-family: Arial, sans-serif;
  margin: 20px 0;
}



.datenschutz-item {
  padding-left: 100px;

}

.datenschutz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-weight: bold;
}

.add-email {
  display: flex;
  align-items: center;
  gap: 8px;
}

.email-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.email-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}



.flex-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.flex-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px 0;
}

.flex-item {
  flex: 1; /* Allow other items to grow and take available space */
}

.subcategory {
  font-weight: bold;
  color: #333;
  text-align: left; /* Align text to the left */
  width: 100%;
}

.email-card {
  display: flex;
  align-items: center; /* Center items vertically */
  justify-content: space-between; /* Space between text and buttons */
  gap: 10px;
  height: 60px; /* Fixed height for email cards */
  width: 350px; /* Fixed width for email cards */
  max-width: 350px;
  box-sizing: border-box; /* Include padding in width/height */
}

.email-card span {
  font-size: 14px;
  color: #555;
}

.selection {
  width: 200px;
  height: 40px;
  border-radius: 8px;
  outline: none;
  background: #f9f9f9;
  border: 1px solid #d1d5db;
  padding: 0 10px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.selection:hover {
  background: #eef3fc;
  border-color: #4e7dee;
}

.selection:focus {
  background: white;
  border-color: #4e7dee;
  box-shadow: 0 0 5px rgba(78, 125, 238, 0.5);
}

.selection::placeholder {
  color: #9ca3af;
  font-style: italic;
}


.parent_div {
  margin: 20px 20px 20px 20px;
  width: 100%;

}

.list_dropdown {
  display: flex;
  flex-direction: row;
  //gap: 10px;
  //margin: 20px 20px;

}

.bu_info_div {
  margin-top: 20px;
  margin-left: 10vW;
  padding-bottom: 100px;
}

.detail_field {
  //border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  max-width: 400px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
  text-align: left;
}

.bank-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eaeaea;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: bold;
  color: #555;
  padding-right: 5px;
}

.value {
  color: #333;
}

.detail_field {
  font-family: Arial, sans-serif;
  margin: 10px 0;
}


.datenschutz-item {
  margin: 15px 0;
}

.name {
  font-weight: bold;
  color: #007bff;
  margin: 0 0 5px;
}

.email-list {
  list-style-type: disc;
  margin: 5px 0 0 20px;
  padding: 0;
}

.email-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}



.add-email {
  margin-top: 10px;
}

.email-input {
  padding: 5px;
  font-size: 14px;
  width: calc(100% - 70px);
  margin-right: 5px;
}


.confirm-btn {
  border: 2px solid #6D94F1;
  color: #6D94F1;
}

.confirm-btn:hover {
  border-color: #4B73D5;
  color: #4B73D5;
}

/* Remove Button */
.remove-btn {
  border: 2px solid #6D94F1;
  color: #6D94F1;
}

.remove-btn:hover {
  border-color: #4B73D5;
  color: #4B73D5;
}

.add-btn {
  border: none;
  color: #6D94F1;
  cursor: pointer;

}

.add-btn:hover {
  border-color: #4B73D5;
  color: #4B73D5;
}

.cancel-btn {
  border: 2px solid #6D94F1;
  color: #6D94F1;
}

.cancel-btn:hover {
  border-color: #4B73D5; /* Darker shade on hover */
  color: #4B73D5; /* Match hover shade */
}

.styled-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.styled-input:focus {
  border-color: #4E7DEE;
  box-shadow: 0 0 4px rgba(78, 125, 238, 0.5);
}

.info-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: bold;
  width: 100px;
}

.info-actions {
  margin-top: 20px;
  text-align: right;
}

.save-btn {
  padding: 8px 16px;
  background-color: #4E7DEE;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #3a62ba;
}

.no-emails{
  margin-left: 100px;
  margin-top: 40px;
}

.loading_div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}








</style>
