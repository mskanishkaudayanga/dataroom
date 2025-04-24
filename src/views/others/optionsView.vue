<script>
import Navigation from "@/components/Navigation.vue";
import tinymce from "tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/preview";
import arrowUpIcon from "@/components/icons/icon-arrow-up.vue";
import arrowDownIcon from "@/components/icons/icon-arrow-down.vue";
import ButtonComponent from "@/components/buttons/button.vue";
import Seperator from "@/components/utility/Seperator.vue";
import AlertMessage from "@/components/card/AlertMessage.vue";
import axios from "axios";
import CopyIcon from "@/components/icons/icon-copy.vue";



export default {
  data() {
    return {
      editorDE: null,
      editorEN: null,
      selectedTemplate: null,
      ToggleTemplatelist : false,
      SalesTemplateSelected : false,
      TogglePlaceHolders : false,
      isAbwicklung : false,
      selectedAbwicklungCategory: null,
      ToogleAbwicklung : false,
      visibleCategories: [],
      subjectDE: "",
      bodyDE: "",
      subjectEN: "",
      bodyEN: "",
      emails: [],
      template_id: "",
      isSalesToolActive: false,
      isDataRoomActive: false,
      showAlert:false,
      alertStatus : '',
      alertMessage : '',
      isLoading : false,



      tinymceConfig: {
        height: 500,
        menubar: false,
        language: 'en_US',
        language_url: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.7/langs/en.js',
        plugins: 'lists link image preview',
        toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        content_style: 'body { font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:1.6; }',

      },


      SalesTemplateList : [
        { value: 'Reservierung' , label : 'Reservierung'},
        { value: 'Abwicklung' , label : 'Abwicklung'},
        { value: 'Notartermin' , label : 'Notartermin'},
        { value: 'Beurkundung' , label : 'Beurkundung'},
        { value: 'Feedback' , label : 'Feedback'},

      ],

      Abwicklung_categories : [
        { value: 'NDB', label: 'NDB' , template : 'Abwicklung'},
        { value: 'Externes GWG', label: 'Externes GWG' , template : 'Abwicklung'},
        { value: 'Finanzierungd', label: 'Finanzierung' , template : 'Abwicklung'},
        { value: 'Kaufvertragn', label: 'Kaufvertrag' , template : 'Abwicklung',},
        { value: 'Maklerprovision', label: 'Maklerprovision' , template : 'Abwicklung'},
      ],

      SalesTemplateValue : null,
      subCategories : [
        { value: 'Reservation created', label: 'Reservation created' , template : 'Reservierung'},
        { value: 'Webform submitted', label: 'Webform submitted' , template : 'Reservierung'},
        { value: 'Customer opened webform first time', label: 'Customer opened webform first time' , template : 'Reservierung'},
        { value: 'Yousign invitation', label: 'Yousign invitation' , template : 'Reservierung'},
        { value: 'Customer signed paper', label: 'Customer signed paper' , template : 'Reservierung'},
        { value: 'Reservation approved', label: 'Reservation approved' , template : 'Reservierung'},
        { value: 'Reservation created', label: 'Reservation created' , template : 'Reservierung'},
        { value: 'Reservation rejected', label: 'Reservation rejected' , template : 'Reservierung'},
        { value: 'Reservation receipt', label: 'Reservation receipt' , template : 'Reservierung'},
        { value: 'Storno Units', label: 'Storno Units' , template : 'Reservierung'},
        { value: 'Storno fee not paid', label: 'Storno fee not paid' , template : 'Reservierung'},
        { value: '7 steps', label: '7 steps' , template : 'Reservierung'},
        { value: 'prepare finance', label: 'prepare finance' , template : 'Reservierung'},



        { value: 'NDB Invitation', label: 'NDB Invitation' , template : 'Abwicklung' , category : 'NDB'},
        { value: 'NDB first open Webform', label: 'NDB first open Webform' , template : 'Abwicklung', category : 'NDB'},
        { value: 'NDB Customer submitted webform', label: 'NDB Customer submitted webform' , template : 'Abwicklung', category : 'NDB'},
        { value: 'Agent submitted NDB', label: 'Agent submitted NDB' , template : 'Abwicklung', category : 'NDB'},
        { value: 'NDB approved', label: 'NDB approved' , template : 'Abwicklung', category : 'NDB'},
        { value: 'NDB rejected', label: 'NDB rejected' , template : 'Abwicklung', category : 'NDB'},



        { value: 'Yousign external GWG', label: 'Yousign external GWG' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'External GWG invitation', label: 'External GWG invitation' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'External GWG finished signature', label: 'External GWG finished signature' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'Internes GWG', label: 'Internes GWG' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'internal GWG Invitation', label: 'internal GWG Invitation' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'Internal GWG submitted', label: 'Internal GWG submitted' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'Internal GWG approved', label: 'Internal GWG approved' , template : 'Abwicklung', category : 'Externes GWG'},
        { value: 'External GWG rejected', label: 'External GWG rejected' , template : 'Abwicklung', category : 'Externes GWG'},


        { value: 'Finance Invitation', label: 'Finance Invitation' , template : 'Abwicklung',category : 'Finanzierungd'},
        { value: 'Finance webform submitted', label: 'Finance webform submitted' , template : 'Abwicklung',category : 'Finanzierungd'},
        { value: 'Finance approved', label: 'Finance approved' , template : 'Abwicklung',category : 'Finanzierungd'},
        { value: 'Finance rejected', label: 'Finance rejected' , template : 'Abwicklung',category : 'Finanzierungd'},


        { value: 'KV Email to Covivio', label: 'KV Email to Covivio' , template : 'Abwicklung',category : 'Kaufvertragn'},
        { value: 'KV Final Upload', label: 'KV Final Upload' , template : 'Abwicklung',category : 'Kaufvertragn'},
        { value: 'KV requested by Agent Email', label: 'KV requested by Agent Email' , template : 'Abwicklung',category : 'Kaufvertragn'},
        { value: 'KV Email discount approve', label: 'KV Email discount approve' , template : 'Abwicklung',category : 'Kaufvertragn'},


        { value: 'Provision request Email', label: 'Provision request Email' , template : 'Abwicklung',category : 'Maklerprovision'},
        { value: 'Provision Approval Email', label: 'Provision Approval Email' , template : 'Abwicklung',category : 'Maklerprovision'},


        { value: 'KV Email notary appointment created', label: 'KV Email notary appointment created' , template : 'Notartermin'},
        { value: 'Email reminder', label: 'Email reminder' , template : 'Notartermin'},
        { value: 'Notary appointment reminder customer', label: 'Notary appointment reminder customer' , template : 'Notartermin'},
        { value: 'KV Email notary appointment change', label: 'KV Email notary appointment change' , template : 'Notartermin'},
        { value: 'KV Email notary appointment canceled', label: 'KV Email notary appointment canceled' , template : 'Notartermin'},
        { value: 'notary appointment not take place', label: 'notary appointment not take place' , template : 'Notartermin'},

        { value: 'Beurkundung Email Reservation', label: 'KV Email discount rejection' , template : 'Beurkundung'},
        { value: 'KV Email discount rejection', label: 'Beurkundung Email Reservationn' , template : 'Beurkundung'},
        { value: 'Beurkundung Email Unit Cancel', label: 'Beurkundung Email Unit Cancel' , template : 'Beurkundung'},
        { value: 'Beurkundung Email Sale', label: 'Beurkundung Email Sale' , template : 'Beurkundung'},
        { value: 'Beurkundung Email complete cancel', label: 'Beurkundung Email complete cancel' , template : 'Beurkundung'},

        { value: 'Feedback Email Sale', label: 'Feedback Email Sale' , template : 'Feedback'},
        { value: 'Feedback Email Cancel', label: 'Feedback Email Cancel' , template : 'Feedback'},

      ],
      placeholders : [
        {
          category: "Reservation",
          items: {
            '{{reservation_id}}': "555",
            '{{reservation_create_date}}': "01.01.2023",
          },
        },
        {
          category: "Customer",
          items: {
            '{{customer_onoffice_kdnr}}': "1537821",
            '{{customer_greet}}': "Sehr geehrter / Sehr geehrte / Dear",
            '{{customer_salutation}}': "Herr / Frau / Mr. / Mrs.",
            '{{customer_title}}': "Dr.",
            '{{complete_name}}': "Max Mustermann",
            '{{complete_name_with_salutation}}': "Sehr geehrter Herr Dr. Mustermann",
            '{{customer_firstname}}': "Max",
            '{{customer_lastname}}': "Mustermann",
            '{{customer_iban}}': "DE12312312452321",
            '{{customer_email}}': "mustermann@muster.de",
          },
        },
        {
          category: "Real Estates",
          items: {
            '{{immo_data}}': "LEAD-WE01",
            '{{project_data}}': "Rosengarten Unter den Linden 1",
            '{{immo_data_without_nr}}': "LEAD",
            '{{project_name}}': "Leadverteiler 3 Living",
            '{{immo_unit_number}}': "WE 01",
            '{{immo_dataroom_link}}': "www.linkzumdataroom.de",
            '{{immo_reservationprice}}': "200000",
            '{{immo_beurkundeter_saleprice}}': "150000",
            '{{immo_commission}}': "LEAD-WE01: 3,57%, LEAD-WE02: 3,00%",
            '{{immo_lieferpreis}}': "Leadverteiler3-WE03: 169.290 €",
            '{{immo_vertriebspreis}}': "Leadverteiler3-WE03: 260.000 €",
            '{{immo_discountReason}}': "Leadverteiler3-WE03: reason here",
            '{{immo_discountValues}}': "Leadverteiler3-WE03: 1.500 €",
          },
        },
        {
          category: "Agent",
          items: {
            '{{agent_name}}': "Max",
            '{{agent_lastname}}': "Mustermann",
            '{{agent_mobile}}': "0176234413123",
            '{{agent_mail}}': "m.mustermann@bestplace.com",
            '{{agent_fax}}': "545646546",
            '{{agent_job_position}}': "Makler",
            '{{agent_company_name}}': "BEST PLACE IMMOBILIEN GMBH & CO. KG",
            '{{agent_street}}': "Unter den Linden",
            '{{agent_house_nr}}': "12",
            '{{agent_city}}': "Berlin",
            '{{agent_zipcode}}': "123456",
            '{{agent_county}}': "Bayern",
            '{{agent_country}}': "Deutschland",
          },
        },
        {
          category: "Company",
          items: {
            '{{company_name}}': "BEST PLACE IMMOBILIEN GMBH & CO. KG",
            '{{company_bank_name}}': "Sparkasse Dortmund",
            '{{company_iban}}': "DE7012312312321",
            '{{company_authorized_representative}}':
                "Luis Ibbeken, Dr. Daniel Frey, Ulf Illbruck",
            '{{company_professional_supervisory_authority}}':
                "Amtsgericht Berlin-Charlottenburg",
            '{{company_commercial_register_no}}': "HRB 193000B",
          },
        },
      ]
  }

  },
  components : {
    CopyIcon,
    Navigation,
    arrowUpIcon,
    arrowDownIcon,
    ButtonComponent,
    Seperator,
    AlertMessage
  },
  computed: {
    filteredSubCategories() {
      if(this.SalesTemplateValue ==='Abwicklung'){
        this.isAbwicklung = true;
        return this.Abwicklung_categories;
      }else{
        this.isAbwicklung = false;
        return this.subCategories.filter(
            (subCategory) => subCategory.template === this.SalesTemplateValue
        );
      }

    },
    filteredAbwicklungSubCategories() {
      if (this.selectedAbwicklungCategory) {
        return this.subCategories.filter(
            (subCategory) =>
                subCategory.category === this.selectedAbwicklungCategory
        );
      }
      return [];
    },

  },
  methods : {
    showTemplateList(){
     this.ToggleTemplatelist = true
    },
    async handleSelction(type, selectedValue) {
      if (type === "template") {
        this.SalesTemplateValue = selectedValue;
        this.SalesTemplateSelected = true;
        this.selectedAbwicklungCategory = null;
        this.ToogleAbwicklung = false;
      } else if (type === "subCategory") {
        this.ToogleAbwicklung = false;
        this.selectedTemplate = selectedValue;
        console.log("Subcategory Selected:", selectedValue);
        await this.setContent();
      } else if (type === "abwicklungCategory") {
        this.ToogleAbwicklung = true;
        this.selectedAbwicklungCategory = selectedValue;
      }else if(type ==="abwicklungCategoryFinal"){
        console.log(selectedValue);
        this.selectedTemplate = selectedValue;
        const templatesData  = this.getTemplateData();
        if(templatesData){
          this.setTemplate(templatesData);
        }
       await this.setContent();
      }
      console.log("Selected Type:", type, "Selected Value:", selectedValue);
    },
    async setContent() {
      try {
        const response = await this.getTemplateData();

        if (response.length > 0 && response[0]?.id) {
          const dataset = JSON.parse(response[0].dataset);
          this.template_id = response[0].id;

          const formattedBodyEn = dataset.body_en?.replace(/\n/g, "<br>") || '';
          const formattedBodyDE = dataset.body_de?.replace(/\n/g, "<br>") || '';

          const editorEN = tinymce.get("editorEN");
          const editorDE = tinymce.get("editorDE");

          if (editorEN && dataset.body_en) {
            editorEN.setContent(formattedBodyEn);
          }
          if (editorDE && dataset.body_de) {
            editorDE.setContent(formattedBodyDE);
          }

          this.subjectDE = dataset.subject_de || '';
          this.subjectEN = dataset.subject_en || '';
          this.emails = dataset.emails || '';
        } else {
          const editorEN = tinymce.get("editorEN");
          const editorDE = tinymce.get("editorDE");

          this.template_id = '';
          if (editorEN) editorEN.setContent('');
          if (editorDE) editorDE.setContent('');
          this.subjectEN = '';
          this.subjectDE = '';
          this.emails = '';
        }
      } catch (error) {
        console.error('An error occurred while setting the content:', error);

        const editorEN = tinymce.get("editorEN");
        const editorDE = tinymce.get("editorDE");

        this.template_id = '';
        if (editorEN) editorEN.setContent('');
        if (editorDE) editorDE.setContent('');
        this.subjectEN = '';
        this.subjectDE = '';
        this.emails = '';
      }
    }
    ,
    setTemplate(templatesData){

    },
    updatePlaceholder(value, key) {
      navigator.clipboard.writeText(key).then(() => {
        this.notificationBannerInit('success', 'Platzhalter kopiert')
      }).catch(err => {
        this.notificationBannerInit('error', 'Platzhalter konnte nicht kopiert werden')
      });
    },

    TogglePlaceHoldersMethod(){
      if (this.TogglePlaceHolders === false){
        this.TogglePlaceHolders = true;
        let allCats = [];
        this.placeholders.forEach((value, index) => {
          allCats.push(value.category)
        });
        this.visibleCategories = allCats;
      }else{
        this.TogglePlaceHolders = false;
        this.visibleCategories = [];
      }
    },

    toggleCategory(category) {
      const index = this.visibleCategories.indexOf(category);
      if (index > -1) {
        this.visibleCategories.splice(index, 1);
      } else {
        this.visibleCategories.push(category);
      }
    },
    isCategoryVisible(category) {
      return this.visibleCategories.includes(category);
    },
    updateContent(field, value) {
      console.log("update Content is called !");
      this[field] = value;
      console.log(`${field} updated:`, value);
    },
    initializeEditor(editorId, field) {
      tinymce.init({
        selector: `#${editorId}`,
        height: 500,
        menubar: false,
        toolbar: `undo redo | formatselect | fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor |
  alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | preview`,
        content_style:
            "body { font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:1.6; }",
        base_url: "/tinymce",  // Ensure correct base path
        script_url: "/tinymce/tinymce.min.js",
        skin_url: "/tinymce/skins/ui/oxide",
        content_css: "/tinymce/skins/content/default/content.css",
        setup: (editor) => {
          editor.on("change", () => {
            this[field] = editor.getContent();
          });

          editor.on("init", () => {
            editor.setContent(this[field]);
          });
        },
      });
    },
    async saveTemplates() {
      try {

        const editorEN = tinymce.get("editorEN");
        const editorDE = tinymce.get("editorDE");

        const bodyENHtml = editorEN ? editorEN.getContent() : "";
        const bodyDEHtml = editorDE ? editorDE.getContent() : "";


        this.bodyEN = bodyENHtml
            ? bodyENHtml.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?[^>]+(>|$)/g, "")
            : "";
        this.bodyDE = bodyDEHtml
            ? bodyDEHtml.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?[^>]+(>|$)/g, "")
            : "";

        const body = {
          data: {
            category: "email templates",
            dataset: {
              emails: this.emails,
              subject_de: this.subjectDE,
              body_de: this.bodyDE,
              subject_en: this.subjectEN,
              body_en: this.bodyEN,
            },
            identifier: this.selectedTemplate
          }
        };


        if (this.template_id){

          try {
            const url = this.globalApiMicroserviceBaseUrl+'/options/update'
            const response = await axios.post(url,body);

            this.showAlert= true;
            this.alertStatus = 'success';
            this.alertMessage = 'Erfolgreich gespeichert!';

            setTimeout(() => {
              this.showAlert = false;
            }, 5000);

          }catch (error){
            console.error("Error during PUT request:", error);

            this.showAlert= true;
            this.alertStatus = 'warning';
            this.alertMessage = 'Fehler beim Speichern der Daten!';

            setTimeout(() => {
              this.showAlert = false;
            }, 5000);

          }

        }else {

          try {
            const url = this.globalApiMicroserviceBaseUrl+'/options/store'
            const response = await axios.post(url,body );
            console.log("Response:", response);

            this.showAlert= true;
            this.alertStatus = 'success';
            this.alertMessage = 'Erfolgreich gespeichert!';

            setTimeout(() => {
              this.showAlert = false;
            }, 5000);

          }catch (error){

            this.showAlert= true;
            this.alertStatus = 'warning';
            this.alertMessage = 'Fehler beim Speichern der Daten!';

            setTimeout(() => {
              this.showAlert = false;
            }, 5000);


            console.error("Error during POST request:", error);

          }

        }

      } catch (error) {
        console.error("Error fetching templates:", error.message);
      }
    },
    async getTemplateData(){
      this.isLoading = true;
      try {
        const body = {
          data : {
            category: "email templates",
            identifier: this.selectedTemplate
          }
        };
        const url = this.globalApiMicroserviceBaseUrl+'/options/get'
        const response = await axios.post(url,body);

        console.log("The response data is...",response);
        return response.data;

      } catch (error) {
        console.error("Error fetching templates:", error.message);
        return error;
      } finally {
        this.isLoading = false;
      }
    },
    activateSalesTool() {
      this.isSalesToolActive = true;
      this.isDataRoomActive = false;
    },
    activateDataRoom() {
      this.isSalesToolActive = false;
      this.isDataRoomActive = true;
      this.showTemplateList();
    },


  },

  mounted() {
    this.$nextTick(() => {
      this.initializeEditor("editorDE", "bodyDE");
      this.initializeEditor("editorEN", "bodyEN");
    });
  },
  beforeDestroy() {
    tinymce.get("editorDE")?.destroy();
    tinymce.get("editorEN")?.destroy();
  },
  beforeUnmount() {
    tinymce.get("editorDE")?.destroy();
    tinymce.get("editorEN")?.destroy();
  }
}




</script>

<template>
  <Navigation/>
  <div class="parent-container">
    <div class="alert_div" v-if="showAlert">
      <AlertMessage :alertStatus="alertStatus" :alertText="alertMessage" />
    </div>
    <div class="tool_div">

    <div>
      <ButtonComponent type="create reservation" @click="activateSalesTool">
        Sales Tool
      </ButtonComponent>
    </div>
    <div :style="{ paddingLeft: '10px' }">
<!--      <ButtonComponent-->
<!--          type="search"-->
<!--          :class="{ active: isDataRoomActive }"-->
<!--          :style="{ backgroundColor: isDataRoomActive ? '#4E7DEE' : 'white',color: isDataRoomActive ? 'white' : '#4E7DEE'}"-->
<!--          @click="activateDataRoom"-->
<!--      >-->
<!--        Dataroom-->
<!--      </ButtonComponent>-->
    </div>

      <div v-if="isLoading" class="loading_div">Laden .....</div>




      <div  :style="{ paddingLeft: '30Vw' }">
      <ButtonComponent type="edit" >
      <router-link :to="{ name: 'EmailConfigView' }">
       Bauträger Emails konfigurieren
      </router-link>
        </ButtonComponent>
    </div>





  </div>
    <div class="list_dropdown">

      <div class="template_list">
        <select class="selection" @change="handleSelction('template', $event.target.value)">
          <option value="" disabled selected>Bitte auswählen</option>
          <option v-for="list in SalesTemplateList" :key="list.value" :value="list.value">
            {{ list.label }}
          </option>
        </select>
      </div>

      <div class="template_list" v-if="SalesTemplateSelected">
        <select
            class="selection" @change="isAbwicklung
              ? handleSelction('abwicklungCategory', $event.target.value)
              : handleSelction('subCategory', $event.target.value)">

          <option value="" disabled selected>Bitte auswählen</option>
          <option
              v-for="subCategory in filteredSubCategories"
              :key="subCategory.value"
              :value="subCategory.value"
          >
            {{ subCategory.label }}
          </option>
        </select>
      </div>


      <div class="template_list" v-if="isAbwicklung && ToogleAbwicklung">
        <select class="selection" @change="handleSelction('abwicklungCategoryFinal', $event.target.value)">
          <option value="" disabled selected>Bitte auswählen</option>
          <option
              v-for="category in filteredAbwicklungSubCategories"
              :key="category.value"
              :value="category.value"
          >
            {{ category.label }}
          </option>
        </select>
      </div>

    </div>

    <Seperator/>


    <span @click="TogglePlaceHoldersMethod" class="show_placeholders">
Umschalten Placeholders <arrowUpIcon v-if="TogglePlaceHolders"/> <arrowDownIcon v-else/>
    </span>

    <div class="placeholder-container" v-if="TogglePlaceHolders">
      <div v-for="category in placeholders" :key="category.category" class="category">
        <div
            class="category_heading"
            @click="toggleCategory(category.category)">
          {{ category.category }}
          <arrowUpIcon v-if="isCategoryVisible(category.category)" />
          <arrowDownIcon v-else />
        </div>
        <div
            class="placeholder-list"
            v-if="visibleCategories.includes(category.category)">
          <div
              v-for="(value, key) in category.items"
              :key="key"
              class="placeholder-item"
              @click="updatePlaceholder(value, key)"
          >
            <span class="placeholder-key">{{ key }}</span>:
            <span class="placeholder-value">{{ value }}</span>
            <CopyIcon/>
          </div>
        </div>
      </div>
    </div>

    <div class="email-compose-container">
      <div class="email-compose">
        <label for="subject1">Subject DE:</label>
        <input
            type="text"
            v-model="subjectDE"
            id="subject1"
            class="email-input"
            placeholder="Enter subject here"
        />
        <label for="body1">Body DE:</label>
        <textarea id="editorDE"></textarea>

      </div>

      <div class="email-compose">
        <label for="subject2">Subject EN:</label>
        <input
            type="text"
            v-model="subjectEN"
            id="subject2"
            class="email-input"
            placeholder="Enter subject here"
        />
        <label for="body2">Body EN:</label>
        <textarea id="editorEN"></textarea>

      </div>
    </div>


    <div class="save_button"  @click="saveTemplates">
      <span> Speichern </span>
    </div>
  </div>

</template>



<style scoped>

.loading_div {
  padding-left: 15px;
  padding-top: 10px;
}

.active {
  background-color: #2c3e50;
  color: #ffffff;
  border-color: #1a252f;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #34495e;
}

.list_dropdown {
  display: flex;
  margin-bottom: 10px;
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
  outline: none;
  box-shadow: 0 0 5px rgba(78, 125, 238, 0.5);
}


.category_heading {
  cursor: pointer;

}

.show_placeholders {
  cursor: pointer;
  color: #2b2525;
  margin-left: 30px;
}

.parent-container {
  display: block;
  width: 90%;
}

.tool_div{
  display: flex;
  margin: 30px;
  width: 100vw;
  height: 50px;
}


.tool_button{
  margin: 0 10px;
  width: 200px;
  height: 50px;
  color: white;
  background: #4E7DEE;
  border-radius: 10px;
  transition: background 0.3s ease;
  cursor: pointer;
}
.tool_button:hover {
  background: #3C6ABD;;
}

.selection {
  width: 200px;
  height: 40px;
  border-radius: 8px;
  outline: none;
  background: #f9f9f9;
  border: 1px solid #d1d5db;
  //color: #4e7dee;
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

.template_list {
  margin-left: 30px;
}

.placeholder-container {
  margin-top: 10px;
  width: 100%;
  display: block;
  box-sizing: border-box;
  padding-left: 30px;
}

.category {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
  color: #2b2525;
}

.placeholder-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.placeholder-item {
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--blue);
}

.placeholder-item:hover {
  background-color: var(--light-light-gray);
  transition: background-color 0.2s;
}

.placeholder-key {
  font-weight: bold;
}

.placeholder-value {
  color: #555;
}

.email-compose-container {
  display: flex;
  gap: 20px;
  padding: 30px;
}

.email-compose {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.email-input,
.email-textarea {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.email-textarea {
  height: 400px;
  resize: none;
}

.email-compose h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #4e7dee;
}


</style>
