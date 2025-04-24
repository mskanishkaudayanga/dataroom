<script>
import moment from "moment";
import CloseIcon from "../icons/icon-close.vue";
import DropdownField from "../reservation-list/DropdownField.vue";
import DropdownFieldGrey from "../reservation-list/DropdownFieldGrey.vue";
import OvalCheckboxField from "../kaufpreis-list/OvalCheckboxField.vue";
import GroupChecboxField from "../kaufpreis-list/GroupChecboxField.vue";
import { agentsStoreRL } from "@/stores/agentsStoreRL";
import AddIcon from "../icons/icon-plus.vue"
import LeftArrowIcon from "../icons/icon-arrow-left.vue";
import RedAsterixIcon from "../icons/icon-red-asterix-mark.vue";
import SearchIcon from "../icons/icon-search.vue";
import UpIcon from "../icons/icon-arrow-up.vue";
import DeleteIcon from "../icons/icon-delete.vue";
import DownIcon from "../icons/icon-arrow-down.vue";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive } from "vue";
import DropdownFieldData from "../reservation-list/DropdownFieldData.vue";
import Loading from "../reservation-list/Loading.vue";
import LoadingTableData from "../reservation-list/LoadingTableData.vue";

export default {
  name: "CreateViewModal",
  components: {
    Loading,
    AddIcon,
    CloseIcon,
    LeftArrowIcon,
    SearchIcon,
    DownIcon,
    UpIcon,
    DeleteIcon,
    RedAsterixIcon,
    DropdownField,
    OvalCheckboxField,
    GroupChecboxField,
    DropdownFieldData,
    LoadingTableData,
    DropdownFieldGrey,
  },

  setup() {
    const isLoading = ref(false);
    const realStateFormInitialState = {
      singleOrDoubleReservation: "",
      streetOrImmo: "",
      price: "",
      fee: "",
      provision: "",
    };
    const form_real_estate = ref({ ...realStateFormInitialState });
    const customerformInitialState = {
      customerEmailOrNumber: "",
      customerNumber: "",
      customerSalutation: "",
      customerTitle: "",
      customerFirstname: "",
      customerLastname: "",
      customerDateOfBirth: "",
      customerNationality: "",
      customerAddress: "",
      customerPLZ: "",
      customerCity: "",
      customerCountry: "",
      customerPhone: "",
      customerEmail: "",
      customerIban: "",
      customerBic: "",
      customerCreditInstitution: "",
      numberOfBuyers: "",
      realEstateAgent: "",
      selectRealEstateAgent: "",
      privateOrBusiness: "",
      customerCompany: "",
      customerMicroservicesId: "",
    };
    const form_customer = ref({ ...customerformInitialState });
    const reservationDataFormInitialState = {
      customerSignedReservationForm: null,
      reservationCreateDate: "",
      customerSignedDate: "",
      reservationFeePaymentDate: "",
    };
    const form_reservation = ref({ ...reservationDataFormInitialState });
    const ndbformInitialState = {
      ndbMartialStatus: "",
      matrimonialProperty: "",
      capitalInvestment: "",
      taxId: "",
      landLineNumber: "",
      iban: "",
      bic: "",
      creditInstitution: "",
      passportOrIdPhoto: "",
    };
    const form_ndb = ref({ ...ndbformInitialState });
    const ndbformOtherInitialState = {
      ndbExcelTemplate: "",
      ndbSendToCovivoDate: "",
      ndbSendToEssenDate: "",
    };
    const form_ndbOther = ref({ ...ndbformOtherInitialState });
    const kvEntwurfInitialState = {
      kvDraftDate: "",
      CtSendDate: "",
      notaryAppoinmentEssenOrBerlin: "",
      ctShippingDate: "",
    };
    const form_kvEntwurf = ref({ ...kvEntwurfInitialState });
    const externalGwgInitialState = {
      naturalPerson: "",
      identification: "",
      politicallyExposedPerson: "",
      sourceOfFunds: "",
      fundsFromLegalSource: "",
      notOnSanctionList: "",
    };
    const form_externalGwg = ref({ ...externalGwgInitialState });
    const externalgwgOtherInitialState = {
      proofofrepresentation: "",
      signedExternalGwg: "",
    };
    const form_externalOther = ref({ ...externalgwgOtherInitialState });
    const internalGwgInitialState = {
      obligatedCompany: "",
      transactionType: "",
      covivioCompaniesTransaction: "",
      riskIndustry: "",
      businessHighRiskCountries: "",
      beneficialOwner: "",
      questionableBehaviour: "",
    };
    const form_internalGwg = ref({ ...internalGwgInitialState });
    const form_customers = ref([
      {
        customer_data: JSON.parse(JSON.stringify(customerformInitialState)),
        isAddedByButton: false,
        ndbform_data: JSON.parse(JSON.stringify(ndbformInitialState)),
        externalGWG_data: JSON.parse(JSON.stringify(externalGwgInitialState)),
        internalGWG_data: JSON.parse(JSON.stringify(internalGwgInitialState)),
        maritalCategories: [],
        agentCategories: [],
        customerFormExpand: true,
        ndbFormExpand: true,
        externalGWGExpand: true,
        internalGWGExpand: true,
        other_data: null,
      },
    ]);
    const finanzierungsunterlagenInitialState = {
      documentCategory: "",
      financingDocuments: "",
    };
    const form_finanzierungsunterlagen = ref({
      ...finanzierungsunterlagenInitialState,
    });
    const notarterminInitialState = {
      notaryAppoinmentDate: "",
      notaryAppointmentProcess: "",
      takenPlaceOrNot: "",
    };
    const form_notartermin = ref({ ...notarterminInitialState });
    const finalKvInitialState = {
      finalKvForm: "",
      kvSignedByCovivio: "",
    };
    const form_finalKv = ref({ ...finalKvInitialState });
    const verkaufsmeldungInitialState = {
      date: "",
      salesPurchasePrice: "",
      customer: "",
      notarizationDate: "",
      notarizedpurchasePrice: "",
      currentDeliveryPrice: "",
      isGwgCustomerQuestionnaireAvailble: "",
      issGwgInternalQuestionnaireAvailble: "",
      isReservationFee: "",
      investment: "",
      otherSpecialFeatures: "",
    };
    const cancellationData = ref({
      expandCancelStateView: false,
      cancellationReason: "",
      additionalInformation: "",
    });
    const form_verkaufsmeldung = ref({ ...verkaufsmeldungInitialState });
    const currentStep = ref(1);
    const totalSteps = ref(7);
    const availableEstates = ref([]);
    const availbleCustomers = ref([]);
    const selectedEstate = ref(null);
    const realEstates = ref([]);
    const isSelectingEstate = ref(false);
    const customers = ref([]);
    const clearDropdownsOnReset = ref(false);
    const loadingText = ref("Laden von Konfigurationsdaten");
    const showCreateCustomerView = ref(false);
    const showCancelationMainView = ref(false);
    const realEstateAgents = ref([]);
    const livingAgents = ref([]);
    const kgAgents = ref([]);
    const addedUnits = ref([]);
    const maritalCategories = ref([]);
    const notarterminCategories = ref([]);
    const investmentCategories = ref([]);
    const cancellationReasons = ref([]);
    const isDropDownActive = ref(false);
    const errorMessage = ref("");
    const showErrors = ref(false);
    const loadingdropdown = ref(false);
    const showMoreCustomersView = ref(false);
    const selectedCustomers = ref([]);
    return {
      isLoading,
      form_real_estate,
      form_customer,
      form_customers,
      form_reservation,
      form_ndb,
      form_kvEntwurf,
      form_externalGwg,
      form_internalGwg,
      form_finanzierungsunterlagen,
      form_notartermin,
      form_finalKv,
      form_verkaufsmeldung,
      form_externalOther,
      form_ndbOther,
      currentStep,
      totalSteps,
      availableEstates,
      availbleCustomers,
      selectedEstate,
      realEstates,
      customers,
      clearDropdownsOnReset,
      loadingText,
      isSelectingEstate,
      showCreateCustomerView,
      realEstateAgents,
      livingAgents,
      kgAgents,
      addedUnits,
      maritalCategories,
      notarterminCategories,
      investmentCategories,
      cancellationReasons,
      isDropDownActive,
      errorMessage,
      showErrors,
      loadingdropdown,
      showCancelationMainView,
      cancellationData,
      showMoreCustomersView,
      selectedCustomers,
    };
  },

  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    validateStep() {
      if (this.currentStep === 1) {
        if (!this.form_real_estate.singleOrDoubleReservation) {
          this.showError("Bitte füllen Sie alle Pflichtfelder aus.");
          this.showErrors = true;
          return false;
        }
        this.showErrors = false;
        return true;
      }
      if (this.currentStep === 2) {
        if (this.addedUnits.length <= 0) {
          this.showError("BITTE FÜGEN SIE MINDESTENS EINE IMMOBILIE HINZU");
          this.showErrors = true;
          return false;
        }
        this.showErrors = false;
        return true;
      }
      if (this.currentStep === 3) {
        // if (!this.form_customers[0]?.customer_data?.customerEmailOrNumber) {
        //   this.showErrors = true;
        //   return false;

        // }
        const missingFields = this.form_customers.some((customerItem) => {
          return (
            !customerItem.customer_data.customerEmailOrNumber ||
            !customerItem.customer_data.customerNumber ||
            !customerItem.customer_data.customerSalutation ||
            !customerItem.customer_data.customerFirstname ||
            !customerItem.customer_data.customerLastname ||
            !customerItem.customer_data.customerDateOfBirth ||
            !customerItem.customer_data.customerNationality ||
            !customerItem.customer_data.customerAddress ||
            !customerItem.customer_data.customerPLZ ||
            !customerItem.customer_data.customerCity ||
            !customerItem.customer_data.customerCountry ||
            !customerItem.customer_data.customerEmail ||
            !this.form_reservation.reservationCreateDate
          );
        });

        if (missingFields) {
          this.showError("Bitte füllen Sie alle Pflichtfelder aus.");
          this.showErrors = true;
          return false;
        }
        return true;
      }
      if (this.currentStep === 4) {
        return true;
      }
      if (this.currentStep === 5) {
        return true;
      }
      if (this.currentStep === 6) {
        return true;
      }
      if (this.currentStep === 7) {
        return true;
      }
      this.showErrors = false;
    },

    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = "";
      }, 3000);
    },

    scrollToTop() {
      const modalInner = document.querySelector(".modal-inner");
      if (modalInner) {
        modalInner.scrollTop = 0;
      }
    },

    nextStep() {
      if (this.validateStep()) {
        if (this.currentStep < this.totalSteps) {
          this.showCancelationMainView = false;
          this.addedUnits.forEach((unit) => {
            unit.cancelData.expandCancelStateView = false;
          });
          this.currentStep++;
          this.$nextTick(() => {
            this.scrollToTop();
          });
        }
      }
      // else {
      //     Swal.fire("Fehler", "Bitte füllen Sie alle Pflichtfelder aus.", "error");
      // }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.showCancelationMainView = false;
        this.addedUnits.forEach((unit) => {
          unit.cancelData.expandCancelStateView = false;
        });
        this.currentStep--;
        this.$nextTick(() => {
          this.scrollToTop();
        });
      }
    },

    close() {
      this.$emit("close");
    },

    resetFormData() {
      this.form_real_estate = { ...this.realStateFormInitialState };
      // this.form_customer = { ...this.customerformInitialState };
      this.form_reservation = { ...this.reservationDataFormInitialState };
      this.form_ndb = { ...this.ndbMartialStatus };
      this.form_externalGwg = { ...this.externalGwgInitialState };
      this.form_internalGwg = { ...this.internalGwgInitialState };
      this.form_finanzierungsunterlagen = {
        ...this.finanzierungsunterlagenInitialState,
      };
      this.form_notartermin = { ...this.notarterminInitialState };
      this.form_finalKv = { ...this.finalKvInitialState };
      this.form_verkaufsmeldung = { ...this.verkaufsmeldungInitialState };
      this.availableEstates = [];
      this.addedUnits = [];
      this.showErrors = false;
      // this.clearDropdownsOnReset = true;
      this.currentStep = 1;
      this.showCancelationMainView = false;
      this.showMoreCustomersView = false;
      this.form_customers = [
        {
          customer_data: { ...this.customerformInitialState },
          ndbform_data: { ...this.ndbformInitialState },
          ndbFormExpand: true,
          isAddedByButton: false,
          customerFormExpand: true,
          externalGWG_data: { ...this.externalGwgInitialState },
          internalGWG_data: { ...this.internalGwgInitialState },
          maritalCategories: this.loadMaritalCategories(),
          externalGWGExpand: true,
          internalGWGExpand: true,
          agentCategories: [],
          other_data: null,
        },
      ];
    },

    loadMaritalCategories() {
      const data = [
        { title: "Witwe", value: "witwe", selected: false },
        { title: "Einzeln", value: "einzeln", selected: false },
        { title: "Verheiratet", value: "verheiratet", selected: false },
        {
          title: "Gesetzlicher Partner",
          value: "gesetzlicher_partner",
          selected: false,
        },
      ];
      return data;
    },

    loadCategoriesForAllCustomers() {
      this.form_customers.forEach((customer) => {
        customer.maritalCategories = loadMaritalCategories();
      });
    },

    removecustomersingedform() {
      this.form_reservation.customerSignedReservationForm = "";
      document.getElementById("customerSignedReservationForm").value = "";
    },

    removeNdbPhotoUpload(customerIndex) {
      this.form_customers[customerIndex].ndbform_data.passportOrIdPhoto = "";
      document.getElementById("ndbPhotoUpload").value = "";
    },

    removeNdbTemplateUpload() {
      this.form_ndbOther.ndbExcelTemplate = "";
      document.getElementById("ndbTemplateUpload").value = "";
    },

    removeSourceOfFundsUpload(customerIndex) {
      this.form_customers[customerIndex].externalGWG_data.sourceOfFunds = "";
      document.getElementById("sourceOfFundsUpload").value = "";
    },

    removeFundsFromLegalSourceFileUpload(customerIndex) {
      this.form_customers[customerIndex].externalGWG_data.fundsFromLegalSource =
        "";
      document.getElementById("fundsFromLegalSourceFileUpload").value = "";
    },

    removeRepresentationProofFileUpload() {
      this.form_externalOther.proofofrepresentation = "";
      document.getElementById("representationProofFileUpload").value = "";
    },

    removeSignedExternalgwgFileUpload() {
      this.form_externalOther.signedExternalGwg = "";
      document.getElementById("signedExternalgwgFileUpload").value = "";
    },

    removeFinancingFileUpload() {
      this.form_finanzierungsunterlagen.financingDocuments = "";
      document.getElementById("financingFileUpload").value = "";
    },

    removeKVFileUpload() {
      this.form_finalKv.finalKvForm = "";
      document.getElementById("kvFileUpload").value = "";
    },

    loadNotarterminCategories() {
      const data = [
        {
          title: "Notartermin Nicht Stattgefunden",
          value: "notartermin_nicht_stattgefunden",
          selected: false,
        },
        {
          title: "Notartermin Stattgefunden",
          value: "notartermin_stattgefunden",
          selected: false,
        },
      ];
      this.notarterminCategories = data;
    },

    loadInvestmentCategories() {
      const data = [
        {
          title: "Kapitalanage",
          value: "kapitalanage",
          selected: false,
        },
        {
          title: "Selbstnutzer",
          value: "selbstnutzer",
          selected: false,
        },
        {
          title: "Meiterkauf",
          value: "meiterkauf",
          selected: false,
        },
      ];
      this.investmentCategories = data;
    },

    loadCancelationReasons() {
      const data = [
        {
          title: "Finanzierung nicht möglich",
          value: "Finanzierung nicht möglich",
          selected: false,
        },
        {
          title: "Für anderes Objekt bei Best Place entschieden",
          value: "Für anderes Objekt bei Best Place entschieden",
          selected: false,
        },
        {
          title: "Für Konkurrenzprodukt entschieden",
          value: "Für Konkurrenzprodukt entschieden",
          selected: false,
        },
        {
          title: "Kaufpreis zu hoch",
          value: "Kaufpreis zu hoch",
          selected: false,
        },
        {
          title: "Immobilie unpassend",
          value: "Immobilie unpassend",
          selected: false,
        },
        {
          title: "Lage unpassend",
          value: "Lage unpassend",
          selected: false,
        },
        {
          title: "Sonstiges",
          value: "Sonstiges",
          selected: false,
        },
        {
          title: "Unbekannt",
          value: "Unbekannt",
          selected: false,
        },
      ];
      this.cancellationReasons = data;
    },

    setMaritalCategoriesData(data, emitdata) {
      data.ndbform_data.ndbMartialStatus = emitdata.title;
    },

    setNotarterminCategoriesData(emitdata) {
      this.form_notartermin.takenPlaceOrNot = emitdata.title;
    },

    setInvestmentCategoriesData(unit, selectedValue) {
      unit.verkaufData.investment = selectedValue.title;
    },

    setCancellationReasonsData(unit, selectedValue) {
      unit.cancelData.cancellationReason = selectedValue.title;
    },

    getAgentLabel(username) {
      const agent = this.realEstateAgents.find(
        (agent) => agent.value === username
      );
      const agentLabel = agent ? agent.title : username;
      return agentLabel ? `${agentLabel}` : null;
    },

    currentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },

    formatPrice(value) {
      if (value == null || value === "") return "";
      const numericValue = parseFloat(
        value.toString().replace(/\./g, "").replace(/,/g, ".")
      );
      if (isNaN(numericValue)) return "";

      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    },

    unFormatPrice(value) {
      if (value == null || value === "") return "";
      const numericValue = parseFloat(
        value.toString().replace(/\./g, "").replace(/,/g, ".")
      );
      if (isNaN(numericValue)) return "";
      return numericValue;
    },

    formatProvision(value) {
      if ((this.form_real_estate.streetOrImmo && value) > 0) {
        return `${value}%`;
      } else if (
        this.form_real_estate.streetOrImmo == "" ||
        this.form_real_estate.streetOrImmo == undefined
      ) {
        return "";
      } else {
        return "0 %";
      }
    },

    isUsernameInArray(username) {
      return this.realEstateAgents?.some((agent) => agent?.value === username);
    },

    async fetchAvailableEstates(searchString) {
      try {
        this.loadingdropdown = true;
        if (searchString.length < 3) {
          return;
        }

        const response = await axios.get(
          this.globalApiBaseUrl +
          `/onoffice/getRealEstate?searchString=${searchString}&removeStatusFilter=true`
        );
        // this.availableEstates = response?.data?.response.real_estates;
        this.availableEstates = response?.data?.response.real_estates.map(
          (estate) => ({
            value: estate.real_estate_id,
            title: estate.real_estate_id,
            selected: false,
            data: estate,
          })
        );
      } catch (error) {
        console.error("Error fetching real estate data: ", error);
      } finally {
        this.loadingdropdown = false;
      }
    },

    selectSingleOrDoubleOption(option) {
      if (this.form_real_estate.singleOrDoubleReservation === option) {
        this.form_real_estate.singleOrDoubleReservation = "";
      } else {
        this.form_real_estate.singleOrDoubleReservation = option;
      }
    },

    selectPrivateOrBusinessOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].customer_data.privateOrBusiness ===
        option
      ) {
        this.form_customers[customerIndex].customer_data.privateOrBusiness = "";
      } else {
        this.form_customers[customerIndex].customer_data.privateOrBusiness =
          option;
      }
    },

    handleSignedFormFileUpload(event) {
      this.form_reservation.customerSignedReservationForm =
        event.target?.files[0];
    },

    handleFinancingFileUpload(event) {
      this.form_finanzierungsunterlagen.financingDocuments =
        event.target.files[0];
    },

    handleNdbPhotoUpload(customerIndex, event) {
      this.form_customers[customerIndex].ndbform_data.passportOrIdPhoto =
        event.target.files[0];
    },

    handleNdbTemplateUpload(event) {
      this.form_ndbOther.ndbExcelTemplate = event.target.files[0];
    },

    handleSourceOfFundsFileUpload(customerIndex, event) {
      this.form_customers[customerIndex].externalGWG_data.sourceOfFunds =
        event.target.files[0];
    },

    handleFundsFromLegalSourceFileUpload(customerIndex, event) {
      this.form_customers[customerIndex].externalGWG_data.fundsFromLegalSource =
        event.target.files[0];
    },

    handleRepresentationProofFileUpload(event) {
      this.form_externalOther.proofofrepresentation = event.target.files[0];
    },

    handleSignedExternalgwgFileUpload(event) {
      this.form_externalOther.signedExternalGwg = event.target.files[0];
    },

    handleKVFileUpload(event) {
      this.form_finalKv.finalKvForm = event.target.files[0];
    },

    selectcapitalInvestmentOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].ndbform_data.capitalInvestment ===
        option
      ) {
        this.form_customers[customerIndex].ndbform_data.capitalInvestment = "";
      } else {
        this.form_customers[customerIndex].ndbform_data.capitalInvestment =
          option;
      }
    },

    selectEssenOrBerlinOption(option) {
      if (this.form_ndb.notaryAppoinmentEssenOrBerlin === option) {
        this.form_ndb.notaryAppoinmentEssenOrBerlin = "";
      } else {
        this.form_ndb.notaryAppoinmentEssenOrBerlin = option;
      }
    },

    selectNaturalPersonOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].externalGWG_data.naturalPerson ===
        option
      ) {
        this.form_customers[customerIndex].externalGWG_data.naturalPerson = "";
      } else {
        this.form_customers[customerIndex].externalGWG_data.naturalPerson =
          option;
      }
    },

    selectPoliticallyExposedPersonOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].externalGWG_data
          .politicallyExposedPerson === option
      ) {
        this.form_customers[
          customerIndex
        ].externalGWG_data.politicallyExposedPerson = "";
      } else {
        this.form_customers[
          customerIndex
        ].externalGWG_data.politicallyExposedPerson = option;
      }
    },

    selectNotOnSanctionListOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].externalGWG_data
          .notOnSanctionList === option
      ) {
        this.form_customers[customerIndex].externalGWG_data.notOnSanctionList =
          "";
      } else {
        this.form_customers[customerIndex].externalGWG_data.notOnSanctionList =
          option;
      }
    },

    selectRiskIndustryOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].internalGWG_data.riskIndustry ===
        option
      ) {
        this.form_customers[customerIndex].internalGWG_data.riskIndustry = "";
      } else {
        this.form_customers[customerIndex].internalGWG_data.riskIndustry =
          option;
      }
    },

    selectBusinessHighRiskCountriesOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].internalGWG_data
          .businessHighRiskCountries === option
      ) {
        this.form_customers[
          customerIndex
        ].internalGWG_data.businessHighRiskCountries = "";
      } else {
        this.form_customers[
          customerIndex
        ].internalGWG_data.businessHighRiskCountries = option;
      }
    },

    selectBeneficialOwnerOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].internalGWG_data.beneficialOwner ===
        option
      ) {
        this.form_customers[customerIndex].internalGWG_data.beneficialOwner =
          "";
      } else {
        this.form_customers[customerIndex].internalGWG_data.beneficialOwner =
          option;
      }
    },

    selectQuestionableBehaviourOption(customerIndex, option) {
      if (
        this.form_customers[customerIndex].internalGWG_data
          .questionableBehaviourr === option
      ) {
        this.form_customers[
          customerIndex
        ].internalGWG_data.questionableBehaviour = "";
      } else {
        this.form_customers[
          customerIndex
        ].internalGWG_data.questionableBehaviour = option;
      }
    },

    selectFinalKvSignedOption(event) {
      this.form_finalKv.kvSignedByCovivio = event.target.checked ? "yes" : "no";
    },

    selectGwgCustomerOption(unit) {
      unit.verkaufData.isGwgCustomerQuestionnaireAvailble = event.target.checked
        ? "ja"
        : "nein";
    },

    selectGwgInternalOption(unit) {
      unit.verkaufData.issGwgInternalQuestionnaireAvailble = event.target
        .checked
        ? "ja"
        : "nein";
    },

    selectReservationFeeOption(unit) {
      unit.verkaufData.isReservationFee = event.target.checked ? "ja" : "nein";
    },

    addMoreUnits() {
      if (this.selectedEstate) {
        const isAlreadyAdded = this.addedUnits.some(
          (estate) =>
            estate.realEstateData.real_estate_sys_id ===
            this.selectedEstate.real_estate_sys_id
        );

        if (isAlreadyAdded) {
          Swal.fire(
            "Fehler",
            "Diese Immobilie wurde bereits hinzugefüg",
            "error"
          );
        } else {
          this.selectedEstate.real_estate_price = this.form_real_estate.price;
          this.selectedEstate.real_estate_fee = this.form_real_estate.fee;

          const updatedEstate = {
            realEstateData: { ...this.selectedEstate },
            verkaufData: { ...this.form_verkaufsmeldung },
            verkaufDataOptions: JSON.parse(
              JSON.stringify(this.investmentCategories)
            ),
            expandUnitdetails: false,
            cancelData: { ...this.cancellationData },
            cancellationReasonOptions: JSON.parse(
              JSON.stringify(this.cancellationReasons)
            ),
          };
          this.addedUnits.push(updatedEstate);
        }
      }
    },

    addMoreCustomers() {
      if (this.form_customers.length < 4) {
        const lastCustomer =
          this.form_customers[this.form_customers.length - 1];
        if (lastCustomer && !lastCustomer.customer_data.customerNumber) {
          Swal.fire(
            "Fehler",
            "Bitte füllen Sie diese Kundendaten aus",
            "error"
          );
        } else {
          this.showMoreCustomersView = true;
          this.showErrors = false;
          this.form_customers.forEach((customer) => {
            (customer.customerFormExpand = false),
              (customer.isAddedByButton = true);
          });

          this.form_customers.push({
            customer_data: { ...this.customerformInitialState },
            ndbform_data: { ...this.ndbformInitialState },
            ndbFormExpand: false,
            externalGWG_data: { ...this.externalGwgInitialState },
            internalGWG_data: { ...this.internalGwgInitialState },
            maritalCategories: this.loadMaritalCategories(),
            agentCategories: [],
            customerFormExpand: true,
            externalGWGExpand: false,
            internalGWGExpand: false,
            isAddedByButton: true,
            other_data: null,
          });
        }
      }
    },

    toggleCustomerFormExpandable(customerIndex) {
      this.form_customers[customerIndex].customerFormExpand =
        !this.form_customers[customerIndex].customerFormExpand;
    },

    toggleNdbFormExpandable(customerIndex) {
      this.form_customers[customerIndex].ndbFormExpand =
        !this.form_customers[customerIndex].ndbFormExpand;
    },

    toggleExternalgwgFormExpandable(customerIndex) {
      this.form_customers[customerIndex].externalGWGExpand =
        !this.form_customers[customerIndex].externalGWGExpand;
    },

    toggleInternalgwgFormExpandable(customerIndex) {
      this.form_customers[customerIndex].internalGWGExpand =
        !this.form_customers[customerIndex].internalGWGExpand;
    },

    removeEstate(index) {
      this.addedUnits.splice(index, 1);
    },

    selectEstate(estate) {
      this.selectedEstate = ref(null);
      this.isSelectingEstate = true;
      this.selectedEstate = estate.data;
      this.form_real_estate.streetOrImmo = estate.data.real_estate_id;
      this.form_real_estate.price = this.formatPrice(
        estate.data.real_estate_price
      );
      this.form_real_estate.fee = this.formatPrice(estate.data.real_estate_fee);
      this.form_real_estate.provision = estate.data.real_estate_commission;
      setTimeout(() => {
        this.availableEstates = [];
        this.isSelectingEstate = false;
      }, 0);
    },

    handleCancelUnitsView() {
      this.showCancelationMainView = true;
    },

    //reset cancellation view
    cancelCancellationMainView() {
      this.showCancelationMainView = false;
      this.addedUnits.forEach((unit) => {
        unit.cancelData = {
          cancellationReason: "",
          additionalInformation: "",
          expandCancelStateView: false,
        };
        unit.cancellationReasonOptions.forEach((option) => {
          option.selected = false;
        });
        unit.verkaufDataOptions.forEach((option) => {
          option.selected = false;
        });
      });
    },

    handlecancelorproceed() {
      if (this.allUnitsCancelled) {
        this.confirmationSave();
      }
      // else {
      //   this.nextStep()
      //   this.showCancelationMainView = false;
      //   this.addedUnits.forEach(unit => {
      //     unit.cancelData.expandCancelStateView = false

      //   });
      // }
    },

    toggleSingleCancellationUnitExpandable(unit) {
      unit.cancelData.expandCancelStateView =
        !unit.cancelData.expandCancelStateView;
    },

    toggleUnitDetailsExpandable(unit) {
      unit.expandUnitdetails = !unit.expandUnitdetails;
    },

    async fetchCustomerData(customerIndex) {
      this.loadingdropdown = true;
      this.availbleCustomers = [];
      const searchString =
        this.form_customers[customerIndex].customer_data.customerEmailOrNumber;

      const apiUrlLiving =
        this.globalApiBaseUrl +
        `/onoffice/getCustomerData?searchString=${searchString}&company=living&onlyCustomerNrSearch=false`;
      // const apiUrlKg =
      //   this.globalApiBaseUrl +
      //   /onoffice/getCustomerData?searchString=${searchString}&company=kg&onlyCustomerNrSearch=false;

      try {
        const [responseLiving, responseKg] = await Promise.all([
          axios.get(apiUrlLiving),
          // axios.get(apiUrlKg),
        ]);
        const customerDataLiving = responseLiving.data.response.client_data;

        const formattedLivingData = customerDataLiving.map((customer) => ({
          title:
            customer.client_id +
            " | " +
            customer.client_email +
            " | " +
            customer.client_last_name,
          value: customer.client_email,
          selected: false,
          company: "living",
          data: customer,
        }));

        // const customerDataKg = responseKg.data.response.client_data;

        // const formattedKgData = customerDataKg.map((customer) => ({
        //   title: customer.client_email + " /kg",
        //   value: customer.client_email,
        //   selected: false,
        //   company: "kg",
        //   data: customer,
        // }));

        this.availbleCustomers = [...formattedLivingData];

        if (!customerDataLiving) {
          Swal.fire("Fehler", "Kundendaten nicht gefunden.", "error");
        }
      } catch (error) {
        Swal.fire("Fehler", "Fehler beim Abrufen der Kundendaten.", "error");
      } finally {
        this.loadingdropdown = false;
      }
    },

    async getCustomerMicroservicesId(customerNr) {
      try {
        // this.isLoading = true;
        const apiUrl = "https://ms.p.bestplace.tools/api/address/single";
        const requestBody = {
          data: {
            customer_nr: Number(customerNr),
            company: "living",
          },
        };
        const headers = {
          Authorization: "Bearer 3|pGahIEjwXEMWYr6QqwaP1c0OneTJEqLV6qxx2Cfs",
          "Content-Type": "application/json",
        };
        const response = await axios.post(apiUrl, requestBody, { headers });
        if (response.data) {
          const customerId = response.data?.id;

          return customerId;
        } else {
          console.error("Unexpected API response format:", response.data);
          return null;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getAllRealAgentsData() {
      try {
        const storeRL = agentsStoreRL();
        const agentData = storeRL.getAllAgentsRL;

        if (agentData.length === 0) {
          return;
        }

        agentData?.living?.list_of_all_users_data?.forEach((item) => {
          const agentUsernameLiving = item?.user_Name;
          const agentFirstNameLiving = item?.user_Vorname || "";
          const agentLastNameLiving = item?.user_Nachname || "";

          // const agentUsernameKg =
          //   item?.dataset_kg?.agent_username.toLowerCase();
          // const agentFullnameKg = item?.dataset_kg?.agent_fullname;

          // const agentUsernameLiving =
          //   item?.dataset_living?.agent_username.toLowerCase();
          // const agentFullnameLiving = item?.dataset_living?.agent_fullname;

          if (
            agentFirstNameLiving &&
            agentLastNameLiving.trim() !== "" &&
            !this.isUsernameInArray(agentUsernameLiving)
          ) {
            const dataLiving = {
              title:
                agentFirstNameLiving + " " + agentLastNameLiving + " / Living",
              value: agentUsernameLiving,
              selected: false,
            };
            this.livingAgents.push(dataLiving);
          } else if (
            agentUsernameLiving &&
            agentUsernameLiving.trim() !== "" &&
            !this.isUsernameInArray(agentUsernameLiving)
          ) {
            const dataLiving = {
              title: agentUsernameLiving + " / Living",
              value: agentUsernameLiving,
              selected: false,
            };
            this.livingAgents.push(dataLiving);
          }
        });
        // agentData?.kg?.list_of_all_users_data?.forEach((item) => {
        //   const agentUsernameKg = item?.user_Name;
        //   const agentFirstNameKg = item?.user_Vorname || "";
        //   const agentLastNameKg = item?.user_Nachname || "";

        //   if (
        //     agentFirstNameKg &&
        //     agentLastNameKg.trim() !== "" &&
        //     !this.isUsernameInArray(agentUsernameKg)
        //   ) {
        //     const dataKg = {
        //       title: agentFirstNameKg + " " + agentLastNameKg + " / Living",
        //       value: agentUsernameKg,
        //       selected: false,
        //     };
        //     this.kgAgents.push(dataKg);
        //   } else if (
        //     agentUsernameKg &&
        //     agentUsernameKg.trim() !== "" &&
        //     !this.isUsernameInArray(agentUsernameKg)
        //   ) {
        //     const dataKg = {
        //       title: agentUsernameKg + " / Kg",
        //       value: agentUsernameKg,
        //       selected: false,
        //     };
        //     this.kgAgents.push(dataKg);
        //   }
        // });
      } catch (error) {
        console.error("Error fetching report data:", error);
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },

    setRealEstateAgentData(customerIndex, emitdata) {
      this.form_customers[customerIndex].customer_data.realEstateAgent =
        emitdata.title;
      this.form_customers[customerIndex].customer_data.selectRealEstateAgent =
        emitdata.value;
    },

    removeCustomerForm(customerIndex) {
      this.form_customers.splice(customerIndex, 1);
    },

    removeCustomerNdbForm(customerIndex) {
      this.form_customers[customerIndex].ndbform_data = {
        ...this.ndbformInitialState,
      };

      this.form_customers[customerIndex].maritalCategories =
        this.form_customers[customerIndex].maritalCategories.map((category) => {
          return {
            ...category,
            selected: false,
          };
        });
    },

    removeCustomerExternalGWGForm(customerIndex) {
      this.form_customers[customerIndex].externalGWG_data = {
        ...this.externalGwgInitialState,
      };
    },

    removeCustomerInternalGWGForm(customerIndex) {
      this.form_customers[customerIndex].internalGWG_data = {
        ...this.internalGwgInitialState,
      };
    },

    async selectCustomer(customer, company, customerIndex) {
      const isCustomerAlreadyAdded = this.form_customers.some(
        (formCustomer) =>
          formCustomer.customer_data?.customerNumber === customer.client_id
      );

      if (isCustomerAlreadyAdded) {
        Swal.fire("Fehler", "Kunde ist bereits ausgewählt.", "error");
        return;
      }

      this.realEstateAgents = [];
      // this.selectedCustomer = customer;

      // if (company === "living") {
      this.realEstateAgents = this.livingAgents;
      this.form_customers[customerIndex].customer_data.customerCompany =
        "living";

      // }
      //  else if (company === "kg") {
      //   this.realEstateAgents = this.kgAgents;
      //   this.form_customers[customerIndex].customer_data.customerCompany = "kg";
      // }

      this.form_customers[customerIndex].customer_data.customerEmailOrNumber =
        customer.client_email;
      this.form_customers[customerIndex].customer_data.customerNumber =
        customer.client_id;
      this.form_customers[customerIndex].customer_data.customerSalutation =
        customer.client_salutation;
      this.form_customers[customerIndex].customer_data.customerTitle =
        customer.client_title;
      this.form_customers[customerIndex].customer_data.customerFirstname =
        customer.client_first_name;
      this.form_customers[customerIndex].customer_data.customerLastname =
        customer.client_last_name;
      this.form_customers[customerIndex].customer_data.customerDateOfBirth =
        moment(customer.client_birthday, "DD.MM.YYYY").format("YYYY-MM-DD");
      this.form_customers[customerIndex].customer_data.customerNationality =
        customer.client_nationality;
      this.form_customers[customerIndex].customer_data.customerAddress =
        customer.client_address;
      this.form_customers[customerIndex].customer_data.customerPLZ =
        customer.client_postal_code;
      this.form_customers[customerIndex].customer_data.customerCity =
        customer.client_city;
      this.form_customers[customerIndex].customer_data.customerCountry =
        customer.client_country;
      this.form_customers[customerIndex].customer_data.customerPhone =
        customer.client_phone;
      this.form_customers[customerIndex].customer_data.customerEmail =
        customer.client_email;

      this.form_customers[customerIndex].customer_data.realEstateAgent =
        this.getAgentLabel(customer.client_agent);
      this.form_customers[customerIndex].customer_data.selectRealEstateAgent =
        customer.client_agent;
      // this.form_customer.numberOfBuyers = null;
      this.availbleCustomers = [];
      this.form_customers[customerIndex].customer_data.customerMicroservicesId =
        await this.getCustomerMicroservicesId(customer.client_id);
    },

    confirmationSave() {
      Swal.fire({
        title: "Warnung",
        text: "Wollen Sie die Änderungen speichern?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ja",
        cancelButtonText: "Nein",
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveButtonHandler().then((reservation_id) => {
            if (reservation_id) {
              this.uploadFileData(reservation_id);
            }
          });
        } else if (result.isDenied) {
          Swal.fire("Warnung", "Änderungen nicht gespeichert", "info");
        }
      });
    },

    async saveButtonHandler() {
      this.isLoading = true;
      this.loadingText = "Erstellen einer manuellen Reservierung";
      let reservationStatus = null;

      if (this.allUnitsCancelled) {
        reservationStatus = -2;
      } else {
        reservationStatus = 7;
      }

      let realEstatesData = [];
      let verkaufData = [];
      // const numberToWord = ["One", "Two", "Three", "Four"];
      let customersData = {};

      this.addedUnits.forEach((unit) => {
        realEstatesData.push({
          create_date:
            this.form_reservation.reservationCreateDate +
            " " +
            this.currentTime(),
          estate_nr: unit.realEstateData.real_estate_id,
          estate_price: this.unFormatPrice(
            unit.realEstateData.real_estate_price
          ),
          estate_fee: this.unFormatPrice(unit.realEstateData.real_estate_fee),
          // estate_ini_oo_fee: null,
          // modified_date: null,
          cancellation_reason:
            `${unit.cancelData.cancellationReason} ${unit.cancelData.additionalInformation}`.trim(),
          cancellation: unit.cancelData.cancellationReason?.trim() ? 1 : 0,
          estate_typ: null,
          real_estate_agent:
            this.form_customers[0].customer_data.selectRealEstateAgent,
          real_estate_sys_id: unit.realEstateData.real_estate_sys_id,
          // realestate_notartermin: null,
          // discount_process: null,
          // discount_requested_value: null,
          // discount_reason: null,
          // discount_file: null,
          // discount_history: null,
          // discount_approved_history: null,
          // discount_approved_value: null,
          // estate_rent: null,
          // commission_process: null,
          // commission_requested_value: null,
          // commission_approved_value: null,
          commission_value: unit.realEstateData.real_estate_commission,
        });

        if (
          unit.cancelData &&
          unit.cancelData.cancellationReason?.trim() === ""
        ) {
          verkaufData.push({
            // verkaufsmeldung_id: null,
            // reservation_id: null,
            create_date:
              this.form_reservation.reservationCreateDate +
              " " +
              this.currentTime(),
            notartermin_date: this.form_notartermin.notaryAppoinmentDate? this.form_notartermin.notaryAppoinmentDate +
            " " + this.currentTime():"",
            saleprice: this.unFormatPrice(
              unit.realEstateData.real_estate_price
            ),
            fee: this.unFormatPrice(unit.realEstateData.real_estate_fee),
            documents: {
              gwg_customer:
                unit.verkaufData.isGwgCustomerQuestionnaireAvailble === "ja",
              gwg_internal:
                unit.verkaufData.issGwgInternalQuestionnaireAvailble === "ja",
              fee: unit.verkaufData.isReservationFee === "ja",
            },
            additional_notice: unit.verkaufData.otherSpecialFeatures,
            investment_kind: unit.verkaufData.investment,
            // onoffice_activity_id: null,
            // agent_onoffice_id: "",
            agent_onoffice_username:
              this.form_customers[0].customer_data.selectRealEstateAgent,
            // notartermin_status: "3",
            company: this.form_customers[0].customer_data.customerCompany,
            customer_name:
              this.form_customers[0].customer_data.customerSalutation +
              " " +
              this.form_customers[0].customer_data.customerFirstname +
              " " +
              this.form_customers[0].customer_data.customerLastname,
            real_estate_nr: unit.realEstateData.real_estate_id,
            real_estate_sys_id: unit.realEstateData.real_estate_sys_id,
            // modified_date: "",
            // reject_reason: null,
            // reminder_email_send: 1,
            // reminder_email_new_notartermin: 1,
            // reminder_email_customer_send: 1,
            customer_kdnr: this.form_customers[0].customer_data.customerNumber,
          });
        }
      });

      this.form_customers.forEach((customer, index) => {
        const customerKey = `customer${["One", "Two", "Three", "Four", "Five"][index]
          }`;
        customersData[customerKey] = {
          fields: {
            capitalInvestor: {
              required: true,
              value: customer.ndbform_data.capitalInvestment,
              valueType: "text",
              valid: true,
              label: {
                de: "Kapitalanlage",
                en: "Investment",
              },
            },
            salutation: {
              required: true,
              value: customer.customer_data.customerSalutation,
              valueType: "text",
              valid: true,
              label: {
                de: "Anrede",
                en: "Salutation",
              },
            },
            // title: {
            //   required: false,
            //   value: "",
            //   valueType: "text",
            //   valid: "",
            //   label: {
            //     de: "Titel",
            //     en: "Title",
            //   },
            // },
            firstName: {
              required: true,
              value: customer.customer_data.customerFirstname,
              valueType: "text",
              valid: true,
              label: {
                de: "Vorname",
                en: "Firstname",
              },
            },
            lastName: {
              required: true,
              value: customer.customer_data.customerLastname,
              valueType: "text",
              valid: true,
              label: {
                de: "Nachname",
                en: "Lastname",
              },
            },
            // birthName: {
            //   required: false,
            //   value: "",
            //   valueType: "text",
            //   valid: "",
            //   label: {
            //     de: "Geburtsname",
            //     en: "Birthname",
            //   },
            // },
            dateOfBirth: {
              required: true,
              value: customer.customer_data.customerDateOfBirth,
              valueType: "text",
              valid: true,
              label: {
                de: "Geburtstag",
                en: "Date of birth",
              },
            },
            nationality: {
              required: true,
              value: customer.customer_data.customerNationality,
              valueType: "text",
              valid: true,
              label: {
                de: "Nationalität",
                en: "Nationality",
              },
            },
            maritalStatus: {
              required: true,
              value: customer.ndbform_data.ndbMartialStatus,
              valueType: "text",
              valid: true,
              label: {
                de: "Familienstand",
                en: "Marital Status",
              },
            },
            propertyStatus: {
              required: false,
              value: customer.ndbform_data.matrimonialProperty,
              valueType: "text",
              valid: "",
              label: {
                de: "Güterstand",
                en: "Property Status",
              },
            },
            taxId: {
              required: true,
              value: customer.ndbform_data.taxId,
              valueType: "tax",
              valid: true,
              label: {
                de: "Steuer-ID",
                en: "Tax id",
              },
            },
            // occupation: {
            //   required: false,
            //   value: "",
            //   valueType: "text",
            //   valid: "",
            //   label: {
            //     de: "Beruf",
            //     en: "Occupation",
            //   },
            // },
            streetAndNr: {
              required: true,
              value: customer.customer_data.customerAddress,
              valueType: "text",
              valid: true,
              label: {
                de: "Straße und Nr.",
                en: "Street and nr.",
              },
            },
            postalcode: {
              required: true,
              value: customer.customer_data.customerPLZ,
              valueType: "text",
              valid: true,
              label: {
                de: "Postleitzahl",
                en: "Postalcode",
              },
            },
            city: {
              required: true,
              value: customer.customer_data.customerCity,
              valueType: "text",
              valid: true,
              label: {
                de: "Stadt",
                en: "City",
              },
            },
            landlinePhone: {
              required: false,
              value: customer.ndbform_data.landLineNumber,
              valueType: "text",
              valid: "",
              label: {
                de: "Festnetznummer",
                en: "Landline phone",
              },
            },
            mobilePhone: {
              required: true,
              value: customer.customer_data.customerPhone,
              valueType: "text",
              valid: true,
              label: {
                de: "Handynummer",
                en: "Mobile phone",
              },
            },
            mail: {
              required: true,
              value: customer.customer_data.customerEmail,
              valueType: "email",
              valid: true,
              label: {
                de: "E-Mail",
                en: "Mail",
              },
            },
            // personalIdentificationFile: {
            //   required: true,
            //   value: [{}],
            //   valueType: "files",
            //   valid: true,
            //   label: {
            //     de: "Hochladen von Personalausweis oder Reisepass",
            //     en: "Upload your identity card or passport",
            //   },
            // },
          },
        };
      });

      const nextRIDResponse = await axios.get("https://production.kpi.azbowsrilanka.com/api/rl-reservation-counter/getNextRID");

      let reservation_id = nextRIDResponse?.data?.data;

      let options = {
        method: "POST",
        url: this.globalApiBaseUrl + "/reservations/createUpdateReservationKPL",
        data: {
          reservation_id: reservation_id,
          formular_token: 0,
          reservation_status: reservationStatus,
          client_email: this.form_customers[0].customer_data.customerEmail,
          client_full_name:
            this.form_customers[0].customer_data.customerSalutation +
            " " +
            this.form_customers[0].customer_data.customerFirstname +
            " " +
            this.form_customers[0].customer_data.customerLastname,
          real_estate_agent:
            this.form_customers[0].customer_data.selectRealEstateAgent,
          create_date:
            this.form_reservation.reservationCreateDate +
            " " +
            this.currentTime(),
          customer_kdnr: this.form_customers[0].customer_data.customerNumber,
          microservice_customer_id:
            this.form_customers[0].customer_data.customerMicroservicesId,
          // modified_date: null,
          company: this.form_customers[0].customer_data.customerCompany,
          kv_process: 0,
          kv_notartermin_date: this.form_notartermin.notaryAppoinmentDate? this.form_notartermin.notaryAppoinmentDate +
            " " + this.currentTime():"",
          kv_notartermin_city:
            this.form_kvEntwurf.notaryAppoinmentEssenOrBerlin,
          kv_data_send_to_lawyers: this.form_ndbOther.ndbSendToEssenDate,
          // kv_data_send_from_lawyers_to_berlin: null,
          finance_process: 0,
          // kv_countdown_start: null,
          kv_signed_by_covivio: this.form_reservation.customerSignedDate,
          gwgex_process: 0,
          gwgintern_process: 0,
          real_estates_data: realEstatesData,
          reservation_type: this.form_real_estate.singleOrDoubleReservation,
          ndb_formular_data: {
            formBankData: {
              fields: {
                // accountOwner: {
                //   required: true,
                //   value: "",
                //   valueType: "text",
                //   valid: true,
                //   label: {
                //     de: "Kontoinhaber",
                //     en: "Account owner",
                //   },
                // },
                bank: {
                  required: true,
                  value: this.form_customers[0].ndbform_data.creditInstitution,
                  valueType: "text",
                  valid: true,
                  label: {
                    de: "Kreditinstitut",
                    en: "Bankname",
                  },
                },
                iban: {
                  required: true,
                  value: this.form_customers[0].ndbform_data.iban,
                  valueType: "iban",
                  valid: true,
                  label: {
                    de: "IBAN",
                    en: "IBAN",
                  },
                },
                bic: {
                  required: true,
                  value: this.form_customers[0].ndbform_data.bic,
                  valueType: "bic",
                  valid: true,
                  label: {
                    de: "BIC",
                    en: "BIC",
                  },
                },
              },
            },
            formDataCustomers: customersData,
            // formBusinessBuild: null,
          },
          gwgs: [
            {
              // id: null,
              // reservation_id: null,
              gwg_status: 0,
              customer_mail: this.form_customers[0].customer_data.customerEmail,
              customer_kdnr: this.form_customers[0].customer_data.customerNumber,
              webform_first_opening: 0,
              formular_data: {
                formPEP: {
                  kindOfPosition: {
                    required: true,
                    value: "Beamter",
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "Art der Position",
                      en: "Kind of position",
                    },
                  },
                  country: {
                    required: true,
                    value: "Deutschland",
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "Das entsprechende Land",
                      en: "Country",
                    },
                  },
                },
                formCustomer: {
                  birthPlace: {
                    required: false,
                    value: this.form_customer.customerCity,
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "Geburtsstadt",
                      en: "Birth city",
                    },
                  },
                  dateOfBirth: {
                    required: true,
                    value: this.form_customer.customerDateOfBirth,
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "Geburtstag",
                      en: "Date of birth",
                    },
                  },
                  nationality: {
                    required: true,
                    value: this.form_customer.customerNationality,
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "Nationalitu00e4t",
                      en: "Nationality",
                    },
                  },
                  streetAndNr: {
                    required: true,
                    value: this.form_customer.customerAddress,
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "Strau00dfe und Nr.",
                      en: "Street and nr.",
                    },
                  },
                  postalcode: {
                    required: true,
                    value: this.form_customer.customerPLZ,
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "Postleitzahl",
                      en: "Postalcode",
                    },
                  },
                  city: {
                    required: true,
                    value: this.form_customer.customerCity,
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "Stadt",
                      en: "City",
                    },
                  },
                  country: {
                    required: true,
                    value: this.form_customer.customerCountry,
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "Geburtsland",
                      en: "Birth country",
                    },
                  },
                },
                // formPOPOthers: {
                //   firstname: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Vorname",
                //       en: "Firstname",
                //     },
                //   },
                //   lastname: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Nachname",
                //       en: "Lastname",
                //     },
                //   },
                //   street: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Strau00dfe + Nr.",
                //       en: "Street and Nr.",
                //     },
                //   },
                //   zipcode: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Postleitzahl",
                //       en: "Zipcode",
                //     },
                //   },
                //   city: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Stadt",
                //       en: "City",
                //     },
                //   },
                //   country: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Land",
                //       en: "Country",
                //     },
                //   },
                //   nationality: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Nationalitu00e4t",
                //       en: "Nationality",
                //     },
                //   },
                //   dateOfBirth: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Geburtsdatum",
                //       en: "Birthdate.",
                //     },
                //   },
                //   kindOfPosition: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Art der Position",
                //       en: "Kind of position",
                //     },
                //   },
                //   countryOfPosition: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Relevantes land",
                //       en: "Relevant Country",
                //     },
                //   },
                //   relationship: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Beziehung zu Ihnen",
                //       en: "Relationship",
                //     },
                //   },
                // },
                // formPEPOthersAdditionalPerson: {
                //   firstname: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Vorname",
                //       en: "Firstname",
                //     },
                //   },
                //   lastname: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Nachname",
                //       en: "Lastname",
                //     },
                //   },
                //   street: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Strau00dfe + Nr.",
                //       en: "Street and Nr.",
                //     },
                //   },
                //   zipcode: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Postleitzahl",
                //       en: "Zipcode",
                //     },
                //   },
                //   city: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Stadt",
                //       en: "City",
                //     },
                //   },
                //   country: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Land",
                //       en: "Country",
                //     },
                //   },
                //   nationality: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Nationalitu00e4t",
                //       en: "Nationality",
                //     },
                //   },
                //   dateOfBirth: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Geburtsdatum",
                //       en: "Birthdate.",
                //     },
                //   },
                //   kindOfPosition: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Art der Position",
                //       en: "Kind of position",
                //     },
                //   },
                //   countryOfPosition: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Relevantes land",
                //       en: "Relevant Country",
                //     },
                //   },
                //   relationship: {
                //     required: true,
                //     value: "",
                //     valueType: "text",
                //     valid: "",
                //     label: {
                //       de: "Beziehung zu Ihnen",
                //       en: "Relationship",
                //     },
                //   },
                // },
                formFinancial: {
                  bankPercent: {
                    required: true,
                    value: 100,
                    valueType: "text",
                    valid: true,
                  },
                  bankSource: {
                    required: true,
                    value: "kredit",
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "",
                      en: "",
                    },
                  },
                  bankSourceCountry: {
                    required: true,
                    value: "Deutschland",
                    valueType: "text",
                    valid: true,
                    label: {
                      de: "",
                      en: "",
                    },
                  },
                  ownMoneyPercent: {
                    required: true,
                    value: "0",
                    valueType: "text",
                    valid: true,
                  },
                  ownMoneySource: {
                    required: false,
                    value: "",
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "",
                      en: "",
                    },
                  },
                  ownMoneySourceCountry: {
                    required: false,
                    value: "",
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "",
                      en: "",
                    },
                  },
                  othersPercent: {
                    required: true,
                    value: "0",
                    valueType: "text",
                    valid: true,
                  },
                  othersSource: {
                    required: false,
                    value: "",
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "",
                      en: "",
                    },
                  },
                  othersSourceCountry: {
                    required: false,
                    value: "",
                    valueType: "text",
                    valid: "",
                    label: {
                      de: "",
                      en: "",
                    },
                  },
                },
                // additionalInformations: "",
                // pepValue: "",
                // pepValueOthers: "",
                // pepValueAdditionalPerson: "",
                notOnSanktionalLists: this.form_externalGwg.notOnSanctionList,
                // legalSourceOfFinance: "",
                // identityOfPersonCheckbox: null,
                // identityOfRepresentatorCheckbox: "",
                // language: "",
                kindOfPurchaser: this.form_customer.privateOrBusiness,
              },
              // pdf_without_signature: "",
              // pdf_with_signature: "",
              // reject_reason: null,
              create_date: this.form_reservation.reservationCreateDate +
                " " +
                this.currentTime(),
              // modified_date: "",
              // send_webform_invitation: "",
            },
          ],
          verkaufsmeldung: verkaufData,
        },
      };

      // **Remove keys if values are null**
      if (!options.data.kv_notartermin_date) {
        delete options.data.kv_notartermin_date;
      }

      if (!options.data.kv_data_send_to_lawyers) {
        delete options.data.kv_data_send_to_lawyers;
      }

      try {
        const response = await axios.request(options);
        const status = response.data.status;
        const message = response.data.message;

        if (status) {
          const reservation_id = response.data.dataset.reservation_id;
          return reservation_id;
        } else {
          console.error("Error in API response: ", message);
        }
        // Swal.fire("Erfolg", "Erfolgreich gespeichert!", "success").then(
        //   (result) => {
        //     if (result.isConfirmed) {
        //       this.resetFormData();
        //     }
        //   }
        // );
      } catch (error) {
        console.error("Request failed: ", error);
      } finally {
        this.isLoading = false;
      }
    },

    async uploadFileData(reservationId) {
      try {
        this.isLoading = true;
        this.loadingText = "Hochladen von Dateien";

        const formData = new FormData();
        formData.append("reservationId", reservationId);

        this.form_customers.forEach((customer, customerIndex) => {
          const passportOrIdPhoto = customer.ndbform_data.passportOrIdPhoto;
          if (passportOrIdPhoto) {
            const key = `ndb[${customerIndex + 1}]`;
            formData.append(key, passportOrIdPhoto);
          } else {
            const key = `ndb[${customerIndex + 1}]`;
            formData.append(key, null);
          }

          const externalGwgs = customer.externalGWG_data.sourceOfFunds;
          if (externalGwgs) {
            const key = `externalGwgs[79][${customerIndex}]`;
            formData.append(key, externalGwgs);
          } else {
            const key = `externalGwgs[79][${customerIndex}]`;
            formData.append(key, null);
          }
        });

        const singleFileInputs = [
          {
            key: "reservation[0]",
            ref: this.form_reservation.customerSignedReservationForm,
          },

          { key: "ndb[0]", ref: this.form_ndbOther.ndbExcelTemplate },
          // { key: "receipt[0]", ref: this.$refs.receipt },
          // { key: "provision[127][0]", ref: this.$refs.provision },
          // { key: "internalGwg[0]", ref: this.$refs.internalGwg },
          // { key: "ndb[1]", ref: this.form_ndb.passportOrIdPhoto },

          // {
          //   key: "externalGwgs[79][0]",
          //   ref: this.form_externalGwg.sourceOfFunds,
          // },
          {
            key: "finances[Kontoauszug][0]",
            ref: this.form_finanzierungsunterlagen.financingDocuments,
          },
          // { key: "finances[Kontoauszug][1]", ref: this.$refs.finances },
          // { key: "finances[CustomCategory][0]", ref: this.$refs.finances },
          { key: "kv[0]", ref: this.form_finalKv.finalKvForm },
        ];

        singleFileInputs.forEach(({ key, ref }) => {
          if (ref && ref.name) {
            formData.append(key, ref);
          } else {
            formData.append(key, null);
          }
        });

        const options = {
          method: "POST",
          url:
            this.globalApiBaseUrl +
            "/reservations/createUpdateReservationKPLUploadFiles",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };

        const response = await axios.request(options);
        if (response.status === 200) {
          Swal.fire("Erfolg", "Erfolgreich gespeichert!", "success").then(
            (result) => {
              if (result.isConfirmed) {
                this.resetFormData();
              }
            }
          );
        }
      } catch {
        console.error("Error while uploading form data:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {
    "form_real_estate.streetOrImmo"(newValue) {
      if (!newValue) {
        this.availableEstates = [];
        this.form_real_estate.price = null;
        this.form_real_estate.fee = null;
        this.form_real_estate.provision = null;
      } else if (!this.isSelectingEstate) {
        this.fetchAvailableEstates(newValue);
      }
    },

    show(newValue) {
      this.getAllRealAgentsData();
      this.loadNotarterminCategories();
      this.loadInvestmentCategories();
      this.loadCancelationReasons();
      if (newValue) {
        this.resetFormData();
      }
    },
  },

  computed: {
    allUnitsCancelled() {
      const result = this.addedUnits.every(
        (unit) =>
          unit.cancelData &&
          unit.cancelData.cancellationReason &&
          unit.cancelData.cancellationReason?.trim() !== ""
      );
      return result;
    },
  },

  onMounted() {
    loadCategoriesForAllCustomers();
  },
};
</script>
<template>
  <div class="modal" v-if="show">
    <div class="modal-inner">
      <div v-if="this.isLoading">
        <Loading :loadingText="loadingText" />
      </div>

      <div class="top-header-container">
        <div v-if="currentStep > 1">
          <button class="back-arrow-button" @click="previousStep">
            <LeftArrowIcon />
          </button>
        </div>
        <div v-else>
          <div style="width: 36px; height: 36px; margin-left: 20px"></div>
        </div>
        <div>
          RESERVIERUNG ERSTELLEN
          <span style="color: var(--gray-text)">
            - SCHRITT {{ currentStep }}/{{ totalSteps }}</span>
        </div>
        <div>
          <button class="close-button" @click="close">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div class="progress-bar">
        <div v-for="step in totalSteps" :key="step" :class="['step', { active: step <= currentStep }]"></div>
      </div>
      <div class="cancel-button-container" style="padding: 0 45px; margin-bottom: 15px">
        <button class="unit-cancelation-button" v-if="currentStep >= 4 && currentStep <= 7"
          @click="handleCancelUnitsView">
          <span class="unit-delete-icon">
            <DeleteIcon />
          </span>
          STORNO
        </button>
      </div>

      <div v-if="
        this.currentStep >= 4 &&
        this.currentStep <= 7 &&
        showCancelationMainView
      " class="cancelation-container" style="padding: 0 45px">
        <div v-for="unit in addedUnits" :key="unit.realEstateData.real_estate_sys_id">
          <div class="checkbox-container">
            <label class="container">{{ unit.realEstateData.real_estate_id }}
              <input type="checkbox" :checked="unit.cancelData.expandCancelStateView === 'true'"
                @change="toggleSingleCancellationUnitExpandable(unit)" />
              <span class="checkmark"></span>
            </label>
          </div>

          <div v-if="unit.cancelData.expandCancelStateView" class="cancellation-expand-uni-view">
            <div class="dropdown-container" style="margin-bottom: 20px; margin-top: 20px">
              <DropdownField placeHolder="Grund" :inputModal="unit.cancelData.cancellationReason"
                :items="unit?.cancellationReasonOptions" :isMultiSelect="false" :isModal="true" :clearOnReset="!show"
                v-on:onDropdownChange="setCancellationReasonsData(unit, $event)" />
            </div>

            <div class="textfield-container" style="margin-bottom: 20px">
              <span class="placeholder-container">Zusätzliche Informationen</span>
              <textarea class="input-container" v-model="unit.cancelData.additionalInformation" rows="4" :disabled="!unit.cancelData.cancellationReason ||
                unit.cancelData.cancellationReason.trim() === ''
                "></textarea>
            </div>
          </div>
        </div>
        <div class="button-container">
          <button class="clear-cancellation-button" @click="cancelCancellationMainView">
            SCHLIESSEN
          </button>
          <button class="cancel-or-Proceed-button" v-if="allUnitsCancelled" @click="handlecancelorproceed">
            Reservierung stornieren
          </button>
        </div>
      </div>

      <div class="form-container">
        <div v-if="currentStep === 1">
          <ul>
            <div class="checkbox-container">
              <label class="container">Erstreservierung
                <input type="checkbox" :checked="form_real_estate.singleOrDoubleReservation === 'single'
                  " @change="selectSingleOrDoubleOption('single')" />
                <span class="checkmark" :class="{
                  'error-border':
                    !form_real_estate.singleOrDoubleReservation && showErrors,
                }">
                </span>
              </label>
            </div>

            <div class="checkbox-container">
              <label class="container">Zweitreservierung
                <input type="checkbox" :checked="form_real_estate.singleOrDoubleReservation === 'double'
                  " @change="selectSingleOrDoubleOption('double')" :class="{
                    'error-border':
                      !form_real_estate.singleOrDoubleReservation && showErrors,
                  }" />
                <span class="checkmark" :class="{
                  'error-border':
                    !form_real_estate.singleOrDoubleReservation && showErrors,
                }"></span>
              </label>
            </div>
          </ul>
        </div>

        <div v-if="currentStep === 2">
          <div class="header-container">
            <p>Zu reservierende Einheit(en)</p>
          </div>

          <div>
            <div class="textfield-container" style="margin-bottom: 20px">
              <div class="input-wrapper">
                <span class="placeholder-container">
                  Straße order Immo-Nr.
                  <RedAsterixIcon />
                </span>
                <input class="input-container" v-model="form_real_estate.streetOrImmo" type="text" :class="{
                  'error-border':
                    !form_real_estate.streetOrImmo && showErrors,
                }" />
                <div v-if="loadingdropdown" class="loading-icon-container">
                  <span class="loading-spinner"></span>
                </div>
              </div>

              <!-- <div v-if="availableEstates?.length > 0" class="dropdown">
                <div
                  class="dropdown-item"
                  v-for="estate in availableEstates"
                  :key="estate.real_estate_sys_id"
                  @click="selectEstate(estate)"
                >
                  {{ estate?.real_estate_id }}
                </div>
              </div> -->
              <DropdownFieldData :items="availableEstates" v-model="form_real_estate.streetOrImmo"
                @onDropDownChange="selectEstate" />
            </div>

            <div class="textfield-container" style="margin-bottom: 20px">
              <span class="placeholder-container">
                Preis
                <RedAsterixIcon />
              </span>
              <input class="input-container" v-model="form_real_estate.price" type="text" :class="{
                'error-border': !form_real_estate.price && showErrors,
              }" />
            </div>

            <ul>
              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="placeholder-container">Gebühr</span>
                <input class="input-container" v-model="form_real_estate.fee" type="text" />
              </div>

              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="placeholder-container">Provision</span>
                <input class="input-readonly-container" :value="formatProvision(form_real_estate.provision)" readonly
                  type="text" required />
              </div>
            </ul>

            <button class="add-button" @click="addMoreUnits">
              Einheit hinzufügen
            </button>
            <div class="textarea-container">
              <div v-if="addedUnits.length">
                <div v-for="(estate, index) in addedUnits" :key="index" class="box-container">
                  <div class="estate-details-left">
                    <span>{{ estate.realEstateData.real_estate_id }}</span>
                    <span>{{
                      this.formatPrice(estate.realEstateData.real_estate_price)
                      }}</span>
                  </div>

                  <div class="estate-details-right">
                    <span class="provision-box">Provi:
                      {{
                        this.formatProvision(
                          estate.realEstateData.real_estate_commission
                        )
                      }}</span>
                    <span>{{
                      this.formatPrice(estate.realEstateData.real_estate_fee)
                      }}</span>
                  </div>

                  <div class="estate-remove-button-container">
                    <button @click="removeEstate(index)" class="remove-button">
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="this.currentStep === 3">
          <div v-if="showMoreCustomersView" class="customer-lists">
            <div class="header-container">
              <p>Hinzugefügte Kunden:</p>
            </div>
          </div>

          <div v-for="(customerItem, customerIndex) in form_customers">
            <div v-if="
              showMoreCustomersView && customerItem.isAddedByButton === true
            " class="customer-list">
              <button class="added-customer-button" style="margin-top: 10px"
                @click="toggleCustomerFormExpandable(customerIndex)" :class="{
                  'background-color: #fafafa; ': customerItem?.isAddedByButton,
                }">
                <span class="added-customers-name">
                  {{
                    `Kunde ${customerIndex + 1} - ${(customerItem.customer_data?.customerFirstname ?? "") +
                    " " +
                    (customerItem.customer_data?.customerLastname ?? "")
                    }`
                  }}</span>
                <span class="spand-icon">
                  <DownIcon v-if="customerItem.customerFormExpand" />
                  <UpIcon v-else />
                </span>
                <span v-if="form_customers.length > 1" @click="removeCustomerForm(customerIndex)"
                  class="cancel-customer-button">
                  <DeleteIcon />
                </span>
              </button>
            </div>

            <div v-if="customerItem?.customerFormExpand" :class="{
              'customerform-grey-background': customerItem?.isAddedByButton,
            }">
              <div class="header-container">
                <p>Kundendaten:</p>
              </div>

              <div>
                <div class="search-container" style="margin-bottom: 20px">
                  <div class="input-wrapper">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      Kundennummer oder E-Mail
                      <RedAsterixIcon />
                    </span>
                    <input class="input-container" v-model="customerItem.customer_data.customerEmailOrNumber"
                      type="text" :class="{
                        'error-border':
                          !customerItem.customer_data.customerEmailOrNumber &&
                          showErrors,
                      }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                    <div v-if="loadingdropdown" class="loading-icon-container">
                      <span class="loading-spinner"></span>
                    </div>
                  </div>

                  <div v-if="availbleCustomers.length > 0" class="dropdown">
                    <div class="dropdown-item" v-for="customer in availbleCustomers" :key="customer.client_sys_id"
                      @click="
                        selectCustomer(
                          customer.data,
                          customer.company,
                          customerIndex
                        )
                        " :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }">
                      {{ customer.title }}
                    </div>
                  </div>

                  <button class="search-button" @click="fetchCustomerData(customerIndex)">
                    <SearchIcon />
                  </button>
                </div>
                <!-- <DropdownFieldData 
                        placeHolder=" Kundennummer oder E-Mail" 
                        :inputModal="form_customer.customerEmailOrNumber" 
                        :items="availbleCustomers" 
                        :isMultiSelect="false" 
                        :isModal="true" 
                        :clearOnReset="!show"
                        v-on:onDropdownChange="setMaritalCategoriesData" 
            />  -->

                <div class="textfield-container" style="margin-bottom: 20px">
                  <span :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : 'white',
                  }" class="placeholder-container">
                    Kundennummer
                    <RedAsterixIcon />
                  </span>
                  <input class="input-container" v-model="customerItem.customer_data.customerNumber" type="text" :class="{
                    'error-border':
                      !customerItem.customer_data.customerNumber &&
                      showErrors,
                  }" :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : '',
                    }" />
                </div>
              </div>

              <div class="header-container">
                <p>Personendaten:</p>
              </div>

              <div>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : 'white',
                  }" class="placeholder-container">
                    Anrede
                    <RedAsterixIcon />
                  </span>
                  <input class="input-container" v-model="customerItem.customer_data.customerSalutation" type="text"
                    :class="{
                      'error-border':
                        !customerItem.customer_data.customerSalutation &&
                        showErrors,
                    }" :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : '',
                    }" />
                </div>
                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      Vorname
                      <RedAsterixIcon />
                    </span>

                    <input class="input-container" v-model="customerItem.customer_data.customerFirstname" type="text"
                      :class="{
                        'error-border':
                          !customerItem.customer_data.customerFirstname &&
                          showErrors,
                      }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      Nachname
                      <RedAsterixIcon />
                    </span>
                    <input class="input-container" v-model="customerItem.customer_data.customerLastname" type="text"
                      :class="{
                        'error-border':
                          !customerItem.customer_data.customerLastname &&
                          showErrors,
                      }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                  </div>
                </ul>
                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      Geburtsdatum
                      <RedAsterixIcon />
                    </span>
                    <input class="input-container" v-model="customerItem.customer_data.customerDateOfBirth" type="date"
                      :class="{
                        'error-border':
                          (!customerItem.customer_data.customerDateOfBirth ||
                            customerItem.customer_data.customerDateOfBirth ===
                            '') &&
                          showErrors,
                      }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      Nationalität
                      <RedAsterixIcon />
                    </span>
                    <input class="input-container" v-model="customerItem.customer_data.customerNationality" type="text"
                      :class="{
                        'error-border':
                          !customerItem.customer_data.customerNationality &&
                          showErrors,
                      }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                  </div>
                </ul>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : 'white',
                  }" class="placeholder-container">
                    Straße & Hausnummer
                    <RedAsterixIcon />
                  </span>
                  <input class="input-container" v-model="customerItem.customer_data.customerAddress" type="text"
                    :class="{
                      'error-border':
                        !customerItem.customer_data.customerAddress &&
                        showErrors,
                    }" :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : '',
                    }" />
                </div>
                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      PLZ
                      <RedAsterixIcon />
                    </span>
                    <input class="input-container" v-model="customerItem.customer_data.customerPLZ" type="text" :class="{
                      'error-border':
                        !customerItem.customer_data.customerPLZ && showErrors,
                    }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : 'white',
                    }" class="placeholder-container">
                      Stadt
                      <RedAsterixIcon />
                    </span>
                    <input class="input-container" v-model="customerItem.customer_data.customerCity" type="text" :class="{
                      'error-border':
                        !customerItem.customer_data.customerCity &&
                        showErrors,
                    }" :style="{
                        backgroundColor: customerItem?.isAddedByButton
                          ? '#fafafa'
                          : '',
                      }" />
                  </div>
                </ul>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : 'white',
                  }" class="placeholder-container">
                    Land
                    <RedAsterixIcon />
                  </span>
                  <input class="input-container" v-model="customerItem.customer_data.customerCountry" type="text"
                    :class="{
                      'error-border':
                        !customerItem.customer_data.customerCountry &&
                        showErrors,
                    }" :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : '',
                    }" />
                </div>
              </div>

              <div class="header-container">
                <p>Kontakdaten:</p>
              </div>
              <div>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : 'white',
                  }" class="placeholder-container">
                    Telefon
                  </span>
                  <input class="input-container" v-model="customerItem.customer_data.customerPhone" type="text" :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : '',
                  }" />
                </div>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span :style="{
                    backgroundColor: customerItem?.isAddedByButton
                      ? '#fafafa'
                      : 'white',
                  }" class="placeholder-container">
                    E-Mail
                    <RedAsterixIcon />
                  </span>
                  <input class="input-container" v-model="customerItem.customer_data.customerEmail" type="text" :class="{
                    'error-border':
                      !customerItem.customer_data.customerEmail && showErrors,
                  }" :style="{
                      backgroundColor: customerItem?.isAddedByButton
                        ? '#fafafa'
                        : '',
                    }" />
                </div>
              </div>
              <div class="dropdown-container" style="margin-bottom: 20px">
                <DropdownFieldGrey v-if="customerItem?.isAddedByButton" placeHolder=" Betreuer"
                  :inputModal="customerItem?.customer_data?.realEstateAgent" :items="realEstateAgents"
                  :isMultiSelect="false" :isModal="true" :clearOnReset="!show" v-on:onDropdownChange="
                    setRealEstateAgentData(customerIndex, $event)
                    " />
                <DropdownField v-else placeHolder=" Betreuer" :inputModal="customerItem.customer_data.realEstateAgent"
                  :items="realEstateAgents" :isMultiSelect="false" :isModal="true" :clearOnReset="!show"
                  v-on:onDropdownChange="
                    setRealEstateAgentData(customerIndex, $event)
                    " />
              </div>

              <ul>
                <div class="checkbox-container">
                  <label class="container">Privat
                    <input type="checkbox" :checked="customerItem?.customer_data.privateOrBusiness ===
                      'private'
                      " @change="
                        selectPrivateOrBusinessOption(customerIndex, 'private')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Geschäftlich
                    <input type="checkbox" :checked="customerItem?.customer_data.privateOrBusiness ===
                      'business'
                      " @change="
                        selectPrivateOrBusinessOption(customerIndex, 'business')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>

              <!-- <div v-if="form_customers.length > 1 && customerIndex > 0">
                <button
                  class="cancel-customer-button"
                  @click="removeCustomerForm(customerIndex)"
                >
                  <DeleteIcon />
                </button>
              </div> -->
            </div>
          </div>

          <div v-if="this.form_customers.length < 4">
            <button class="add-more-customers-button" @click="addMoreCustomers()">
              <span class="add-customer-name"> Anderen Kunden hinzufügen</span>
              <span class="add-customer-icon" style="margin-left: 10px"></span>
            </button>
          </div>

          <div class="header-container">
            <p>Unterschriebenes Reservierungsformular :</p>
          </div>

          <div class="file-upload-container" style="margin-bottom: 30px">
            <label for="customerSignedReservationForm" class="file-upload-label">
              Datei hier hineinziehen oder
              <span class="clickable">klicken</span> um hochzuladen.
            </label>
            <input id="customerSignedReservationForm" type="file" name="Datei auswählen" accept="application/pdf"
              @change="handleSignedFormFileUpload" style="display: none" />
            <div v-if="form_reservation.customerSignedReservationForm" class="file-preview">
              <span class="file-name">
                {{ form_reservation.customerSignedReservationForm.name }}
              </span>
              <button class="remove-file" @click="removecustomersingedform">
                <CloseIcon />
              </button>
            </div>
          </div>

          <!-- <input
              id="customerSignedReservationForm"
              type="file"
              name="Datei auswählen"
              accept="application/pdf"
              @change="handleSignedFormFileUpload"
              style="display: none"
            />

            <label
              for="customerSignedReservationForm"
              style="
                display: inline-block;
                padding: 8px 12px;
                background-color: #eeeeee;
                color: black;
                border: 1px solid black;
                border-radius: 4px;
                cursor: pointer;
              "
            >
              Datei auswählen
            </label>

            <span
              v-if="this.form_reservation.customerSignedReservationForm"
              style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
                margin-left: 10px;
              "
            >
              {{ this.form_reservation.customerSignedReservationForm.name }}
              <button
                @click="Removecustomersingedform"
                style="
                  background-color: transparent;

                  color: grey;
                  cursor: pointer;
                  font-size: 10px;
                "
              >
                <CloseIcon />
              </button>
            </span> -->

          <div class="textfield-container" style="margin-bottom: 20px">
            <span class="placeholder-container">
              Zeitstempel der Reservierungserstellung
              <RedAsterixIcon />
            </span>
            <input class="input-container" v-model="form_reservation.reservationCreateDate" type="date" :class="{
              'error-border':
                (!form_reservation.reservationCreateDate ||
                  form_reservation.reservationCreateDate === '') &&
                showErrors,
            }" />
          </div>

          <div class="textfield-container" style="margin-bottom: 20px">
            <span class="placeholder-container">
              Kundenformular Unterschrieben Datum
            </span>
            <input class="input-container" v-model="form_reservation.customerSignedDate" type="date" />
          </div>

          <div class="textfield-container" style="margin-bottom: 20px">
            <span class="placeholder-container">
              Zeitstempel der Zahlung der Reservierungsgebühr
            </span>
            <input class="input-container" v-model="form_reservation.reservationFeePaymentDate" type="date" />
          </div>

          <!-- <div
            style="
              padding: 20px 22px;
              border-radius: 4px;
              background-color: #eeeeee;
              color: var(--dark-gray);
              font-family: inherit;
              margin-bottom: 10px;
            "
          >
            <label class="container"
              >Eingangsbestätigung
              <input type="checkbox" :checked="isManagementSeleceted" @change="isManagementSeleceted ? '': onUserRoleCheckboxChange($event, 1)"/>
              <span class="checkmark"></span>
            </label>
          </div> -->
        </div>

        <div v-if="this.currentStep === 4">
          <div class="main-container">
            <p>NDB</p>
          </div>

          <div v-for="(customerItem, customerIndex) in form_customers" :key="customerIndex"
            class="ndb-forms-main-container">
            <button class="added-ndbforms-button" style="margin-top: 10px"
              @click="toggleNdbFormExpandable(customerIndex)" :class="{
                'background-color: white; ': !customerItem?.ndbFormExpand,
              }">
              <span class="ndb-added-customername">
                {{
                  `Kunde ${customerIndex + 1} - ${customerItem.customer_data.customerFirstname +
                  " " +
                  customerItem.customer_data.customerLastname
                  }`
                }}
              </span>
              <span class="spand-icon">
                <DownIcon v-if="customerItem.ndbFormExpand" />
                <UpIcon v-else />
              </span>

              <span @click="removeCustomerNdbForm(customerIndex)" class="cancel-customer-button">
                <DeleteIcon />
              </span>
            </button>

            <div v-if="customerItem.ndbFormExpand" class="ndb-form-container">
              <ul>
                <div class="dropdown-container" style="margin-bottom: 20px; margin-top: 20px">
                  <DropdownFieldGrey placeHolder="Familienstand"
                    :inputModal="customerItem.ndbform_data.ndbMartialStatus" :items="customerItem.maritalCategories"
                    :isMultiSelect="false" :isModal="true" :clearOnReset="!show" v-on:onDropdownChange="
                      setMaritalCategoriesData(customerItem, $event)
                      " />
                </div>
                <div class="textfield-container" style="margin-bottom: 20px; margin-top: 20px">
                  <span class="grey-placeholder-container"> Güterstand </span>
                  <input class="grey-input-container" v-model="customerItem.ndbform_data.matrimonialProperty"
                    type="text" />
                </div>
              </ul>

              <div class="checkbox-text-container">
                <p>Nutzung als Kapitalanlage</p>
              </div>

              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.ndbform_data.capitalInvestment === 'ja'
                      " @change="
                        selectcapitalInvestmentOption(customerIndex, 'ja')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.ndbform_data.capitalInvestment === 'nein'
                      " @change="
                        selectcapitalInvestmentOption(customerIndex, 'nein')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>

              <ul>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span class="grey-placeholder-container"> Steuer-ID </span>
                  <input class="grey-input-container" v-model="customerItem.ndbform_data.taxId" type="text" />
                </div>
                <div class="grey-textfield-container" style="margin-bottom: 20px">
                  <span class="grey-placeholder-container">
                    Festnetznummer
                  </span>
                  <input class="grey-input-container" v-model="customerItem.ndbform_data.landLineNumber" type="text" />
                </div>
              </ul>

              <div class="header-container">
                <p>Bankverbindung:</p>
              </div>
              <div>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span class="grey-placeholder-container"> IBAN </span>
                  <input class="grey-input-container" v-model="customerItem.ndbform_data.iban" type="text" />
                </div>
                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container"> BIC </span>
                    <input class="grey-input-container" v-model="customerItem.ndbform_data.bic" type="text" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container">
                      Kreditinstitut
                    </span>
                    <input class="grey-input-container" v-model="customerItem.ndbform_data.creditInstitution"
                      type="text" />
                  </div>
                </ul>
              </div>
              <div class="header-container">
                <p>Foto vom Reisepass oder Personalausweis :</p>
              </div>
              <!-- <div>
                <input
                  id="pdfUpload"
                  type="file"
                  name="Datei auswählen"
                  accept="application/pdf"
                  @change="handleNdbPhotoUpload(customerIndex, $event)"
                  style="margin-bottom: 20px"
                />
              </div> -->

              <div class="file-upload-container" style="margin-bottom: 30px">
                <label for="ndbPhotoUpload" class="file-upload-label">
                  Datei hier hineinziehen oder
                  <span class="clickable">klicken</span> um hochzuladen.
                </label>
                <input id="ndbPhotoUpload" type="file" name="Datei auswählen" accept="application/pdf"
                  @change="handleNdbPhotoUpload(customerIndex, $event)" style="display: none" />
                <div v-if="
                  this.form_customers[customerIndex].ndbform_data
                    .passportOrIdPhoto
                " class="file-preview">
                  <span class="file-name">
                    {{
                      this.form_customers[customerIndex].ndbform_data
                        .passportOrIdPhoto.name
                    }}
                  </span>
                  <button class="remove-file" @click="removeNdbPhotoUpload(customerIndex)">
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="header-container">
            <p>Ausgefüllte NDB Excel-Vorlage hochladen :</p>
          </div>
          <!-- <div style="margin-bottom: 30px">
            <input
              id="pdfUpload"
              type="file"
              name="Datei auswählen"
              accept="application/pdf"
              @change="handleNdbTemplateUpload($event)"
            />
          </div> -->
          <div class="file-upload-container" style="margin-bottom: 30px">
            <label for="ndbTemplateUpload" class="file-upload-label">
              Datei hier hineinziehen oder
              <span class="clickable">klicken</span> um hochzuladen.
            </label>
            <input id="ndbTemplateUpload" type="file" name="Datei auswählen" accept="application/pdf"
              @change="handleNdbTemplateUpload" style="display: none" />
            <div v-if="this.form_ndbOther.ndbExcelTemplate" class="file-preview">
              <span class="file-name">
                {{ this.form_ndbOther.ndbExcelTemplate.name }}
              </span>
              <button class="remove-file" @click="removeNdbTemplateUpload">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div class="textfield-container" style="margin-bottom: 20px">
            <span class="placeholder-container">
              Datum an dem das NDB an Covivio gesendet wurde
            </span>
            <input class="input-container" v-model="form_ndbOther.ndbSendToCovivoDate" type="date" />
          </div>
          <div class="textfield-container" style="margin-bottom: 20px">
            <span class="placeholder-container">
              Datum an dem das NDB nach Essen gesendet wurde
            </span>
            <input class="input-container" v-model="form_ndbOther.ndbSendToEssenDate" type="date" />
          </div>

          <div>
            <div class="main-container" style="margin-bottom: 30px; margin-top: 20px">
              <p>KV-Entwurf</p>
            </div>
            <!-- <div
                  style="
                  padding: 20px 22px;
                  border-radius: 4px;
                  margin-bottom: 30px;
                  background-color: #eeeeee;
                  color: var(--dark-gray);
                  font-family: inherit;
                  "
                  >
                <label class="container"
                >Bestätigung des an den Kunden gesendeten CT-Entwurfs
                <input
                  type="checkbox"
                  :checked="isManagementSeleceted"
                  @change="isManagementSeleceted? '': onUserRoleCheckboxChange($event, 1) "
                />
                <span class="checkmark"></span>
                </label>
                </div> -->
            <div class="textfield-container" style="margin-bottom: 20px">
              <span class="placeholder-container">
                Entwurf des KV-Sendedatums (Kunde)
              </span>
              <input class="input-container" v-model="form_kvEntwurf.kvDraftDate" type="date" />
            </div>
            <div class="textfield-container" style="margin-bottom: 20px">
              <span class="placeholder-container">
                CT-Sendedatum (Covivio)
              </span>
              <input class="input-container" v-model="form_kvEntwurf.CtSendDate" type="date" />
            </div>

            <!-- <div class="checkbox-text-container">
            <p>Notartermin :</p>
          </div> -->

            <ul>
              <div class="checkbox-container">
                <label class="container">Notartermin in Essen
                  <input type="checkbox" :checked="form_kvEntwurf.notaryAppoinmentEssenOrBerlin === 'essen'
                    " @change="selectEssenOrBerlinOption('essen')" />
                  <span class="checkmark"></span>
                </label>
              </div>

              <div class="checkbox-container">
                <label class="container">Notartermin in Berlin
                  <input type="checkbox" :checked="form_kvEntwurf.notaryAppoinmentEssenOrBerlin === 'berlin'
                    " @change="selectEssenOrBerlinOption('berlin')" />
                  <span class="checkmark"></span>
                </label>
              </div>
            </ul>

            <div class="textfield-container" style="margin-bottom: 20px">
              <span class="placeholder-container">
                CT-Versand Datum/Uhrzeit (Essen nach Berlin)
              </span>
              <input class="input-container" v-model="form_kvEntwurf.ctShippingDate" type="date" />
            </div>
            <!-- <div class="header-container">
            <p>Hochladen des KV-Entwurfs :</p>
          </div>
          <div>
            <input
              id="pdfUpload"
              type="file"
              name="Datei auswählen"
              accept="image/jpeg, image/jpg"
              @change="handleFileUpload"
            />
          </div> -->
          </div>
        </div>

        <div v-if="this.currentStep === 5">
          <div class="main-container">
            <p>Externes GWG</p>
          </div>
          <div v-for="(customerItem, customerIndex) in form_customers" :key="customerIndex"
            class="ndb-forms-main-container">
            <button class="added-ndbforms-button" style="margin-top: 10px"
              @click="toggleExternalgwgFormExpandable(customerIndex)" :class="{
                'background-color: white; ': !customerItem?.externalGWGExpand,
              }">
              <span class="ndb-added-customername">
                {{
                  `Kunde ${customerIndex + 1} - ${customerItem.customer_data.customerFirstname +
                  " " +
                  customerItem.customer_data.customerLastname
                  }`
                }}
              </span>
              <span class="spand-icon">
                <DownIcon v-if="customerItem.externalGWGExpand" />
                <UpIcon v-else />
              </span>
              <span @click="removeCustomerExternalGWGForm(customerIndex)" class="cancel-customer-button">
                <DeleteIcon />
              </span>
            </button>

            <div v-if="customerItem.externalGWGExpand" class="ndb-form-container">
              <div class="checkbox-text-container" style="padding-top: 20px">
                <p>
                  Sind Sie eine natürliche Person und handeln im eigenen Namen
                  und im eigenen wirtschaftlichen Interessee
                </p>
              </div>
              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.externalGWG_data.naturalPerson === 'yes'
                      " @change="selectNaturalPersonOption(customerIndex, 'yes')" />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.externalGWG_data.naturalPerson === 'no'
                      " @change="selectNaturalPersonOption(customerIndex, 'no')" />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>
              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="grey-placeholder-container">
                  identifikation des Käufers/vertreters/Geschäftspartners
                </span>
                <input class="grey-input-container" v-model="customerItem.externalGWG_data.identification"
                  type="text" />
              </div>
              <div class="checkbox-text-container">
                <p>Politisch exponierte Person</p>
              </div>
              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.externalGWG_data
                        .politicallyExposedPerson === 'yes'
                      " @change="
                        selectPoliticallyExposedPersonOption(
                          customerIndex,
                          'yes'
                        )
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.externalGWG_data
                        .politicallyExposedPerson === 'no'
                      " @change="
                        selectPoliticallyExposedPersonOption(
                          customerIndex,
                          'no'
                        )
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>

              <div class="header-container">
                <p>Finanzmittleherkunft:</p>
              </div>

              <div class="file-upload-container" style="margin-bottom: 30px">
                <label for="ndbTemplateUpload" class="file-upload-label">
                  Datei hier hineinziehen oder
                  <span class="clickable">klicken</span> um hochzuladen.
                </label>
                <input id="ndbTemplateUpload" type="file" name="Datei auswählen" accept="application/pdf"
                  @change="handleNdbTemplateUpload" style="display: none" />
                <div v-if="this.form_ndbOther.ndbExcelTemplate" class="file-preview">
                  <span class="file-name">
                    {{ this.form_ndbOther.ndbExcelTemplate.name }}
                  </span>
                  <button class="remove-file" @click="removeNdbTemplateUpload">
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <!-- <div>
                <input
                  id="pdfUpload"
                  type="file"
                  name="Datei auswählen"
                  accept="application/pdf"
                  @change="handleSourceOfFundsFileUpload(customerIndex, $event)"
                />
              </div> -->
              <div class="header-container">
                <p>Mittel aus legaler Quelle :</p>
              </div>

              <div class="file-upload-container" style="margin-bottom: 30px">
                <label for="sourceOfFundsUpload" class="file-upload-label">
                  Datei hier hineinziehen oder
                  <span class="clickable">klicken</span> um hochzuladen.
                </label>
                <input id="sourceOfFundsUpload" type="file" name="Datei auswählen" accept="application/pdf"
                  @change="handleSourceOfFundsFileUpload(customerIndex, $event)" style="display: none" />
                <div v-if="
                  this.form_customers[customerIndex].externalGWG_data
                    .sourceOfFunds
                " class="file-preview">
                  <span class="file-name">
                    {{
                      this.form_customers[customerIndex].externalGWG_data
                        .sourceOfFunds.name
                    }}
                  </span>
                  <button class="remove-file" @click="removeSourceOfFundsUpload(customerIndex)">
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <!-- <div style="margin-bottom: 20px">
                <input
                  id="pdfUpload"
                  type="file"
                  name="Datei auswählen"
                  accept="application/pdf"
                  @change="
                    handleFundsFromLegalSourceFileUpload(customerIndex, $event)
                  "
                />
              </div> -->
              <div class="file-upload-container" style="margin-bottom: 30px">
                <label for="fundsFromLegalSourceFileUpload" class="file-upload-label">
                  Datei hier hineinziehen oder
                  <span class="clickable">klicken</span> um hochzuladen.
                </label>
                <input id="fundsFromLegalSourceFileUpload" type="file" name="Datei auswählen" accept="application/pdf"
                  @change="
                    handleFundsFromLegalSourceFileUpload(customerIndex, $event)
                    " style="display: none" />
                <div v-if="
                  this.form_customers[customerIndex].externalGWG_data
                    .fundsFromLegalSource
                " class="file-preview">
                  <span class="file-name">
                    {{
                      this.form_customers[customerIndex].externalGWG_data
                        .fundsFromLegalSource.name
                    }}
                  </span>
                  <button class="remove-file" @click="removeFundsFromLegalSourceFileUpload(customerIndex)">
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div class="checkbox-text-container">
                <p>Nicht auf Sanktionsliste</p>
              </div>
              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.externalGWG_data.notOnSanctionList ===
                      'true'
                      " @change="
                        selectNotOnSanctionListOption(customerIndex, 'true')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.externalGWG_data.notOnSanctionList ===
                      'false'
                      " @change="
                        selectNotOnSanctionListOption(customerIndex, 'false')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>
              <!-- <div>
                <button
                  class="cancel-customer-button"
                  @click="removeCustomerExternalGWGForm(customerIndex)"
                >
                  <DeleteIcon />
                </button>
              </div> -->
            </div>
          </div>
          <div class="header-container">
            <p>Falls vertreter, vertreternachweis :</p>
          </div>
          <div>
            <!-- <input
              id="pdfUpload"
              type="file"
              name="Datei auswählen"
              accept="application/pdf"
              @change="handleRepresentationProofFileUpload($event)"
            /> -->
          </div>
          <div class="file-upload-container" style="margin-bottom: 30px">
            <label for="representationProofFileUpload" class="file-upload-label">
              Datei hier hineinziehen oder
              <span class="clickable">klicken</span> um hochzuladen.
            </label>
            <input id="representationProofFileUpload" type="file" name="Datei auswählen" accept="application/pdf"
              @change="handleRepresentationProofFileUpload($event)" style="display: none" />
            <div v-if="this.form_externalOther.proofofrepresentation" class="file-preview">
              <span class="file-name">
                {{ this.form_externalOther.proofofrepresentation.name }}
              </span>
              <button class="remove-file" @click="removeRepresentationProofFileUpload()">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div class="header-container">
            <p>Unterschriebenes externes GWG hochladen :</p>
          </div>
          <div style="margin-bottom: 20px">
            <!-- <input
              id="pdfUpload"
              type="file"
              name="Datei auswählen"
              accept="application/pdf"
              @change="handleSignedExternalgwgFileUpload($event)"
            /> -->
          </div>
          <div class="file-upload-container" style="margin-bottom: 30px">
            <label for="signedExternalgwgFileUpload" class="file-upload-label">
              Datei hier hineinziehen oder
              <span class="clickable">klicken</span> um hochzuladen.
            </label>
            <input id="signedExternalgwgFileUpload" type="file" name="Datei auswählen" accept="application/pdf"
              @change="handleSignedExternalgwgFileUpload($event)" style="display: none" />
            <div v-if="this.form_externalOther.signedExternalGwg" class="file-preview">
              <span class="file-name">
                {{ this.form_externalOther.signedExternalGwg.name }}
              </span>
              <button class="remove-file" @click="removeSignedExternalgwgFileUpload()">
                <CloseIcon />
              </button>
            </div>
          </div>

          <div class="main-container">
            <p>Internes GWG</p>
          </div>

          <div v-for="(customerItem, customerIndex) in form_customers" :key="customerIndex"
            class="ndb-forms-main-container">
            <button class="added-ndbforms-button" style="margin-top: 10px"
              @click="toggleInternalgwgFormExpandable(customerIndex)" :class="{
                'background-color: #fafafa; ': customerItem?.internalGWGExpand,
              }">
              <span class="ndb-added-customername">
                {{
                  `Kunde ${customerIndex + 1} - ${customerItem.customer_data.customerFirstname +
                  " " +
                  customerItem.customer_data.customerLastname
                  }`
                }}
              </span>
              <span class="spand-icon">
                <DownIcon v-if="customerItem.internalGWGExpand" />
                <UpIcon v-else />
              </span>

              <span @click="removeCustomerInternalGWGForm(customerIndex)" class="cancel-customer-button">
                <DeleteIcon />
              </span>
            </button>

            <div v-if="customerItem.internalGWGExpand" class="ndb-form-container">
              <div class="header-container">
                <p>Allgemeine interne Informationen: :</p>
              </div>
              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="grey-placeholder-container">
                  Verpflichtete Gesellschaft
                </span>
                <input class="grey-input-container" v-model="customerItem.internalGWG_data.obligatedCompany"
                  type="text" />
              </div>
              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="grey-placeholder-container">
                  Art der transaktion
                </span>
                <input class="grey-input-container" v-model="customerItem.internalGWG_data.transactionType"
                  type="text" />
              </div>
              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="grey-placeholder-container">
                  Weitere an der transaktion beteiligte covivio gesellschaften
                </span>
                <input class="grey-input-container" v-model="customerItem.internalGWG_data.covivioCompaniesTransaction
                  " type="text" />
              </div>

              <div class="header-container">
                <p>Informationen zur Gegenpartei :</p>
              </div>

              <div class="checkbox-text-container">
                <p>Risikoreiche Branche?</p>
              </div>

              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.internalGWG_data.riskIndustry === 'yes'
                      " @change="selectRiskIndustryOption(customerIndex, 'yes')" />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.internalGWG_data.riskIndustry === 'no'
                      " @change="selectRiskIndustryOption(customerIndex, 'no')" />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>

              <div class="checkbox-text-container">
                <p>Wohnsitz in/Geschäfte mit riskikoreichen Ländern?</p>
              </div>

              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.internalGWG_data
                        .businessHighRiskCountries === 'yes'
                      " @change="
                        selectBusinessHighRiskCountriesOption(
                          customerIndex,
                          'yes'
                        )
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.internalGWG_data
                        .businessHighRiskCountries === 'no'
                      " @change="
                        selectBusinessHighRiskCountriesOption(
                          customerIndex,
                          'no'
                        )
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>

              <div class="checkbox-text-container">
                <p>Handelt er für einen wirtschaftlich berechtigten?</p>
              </div>

              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.internalGWG_data.beneficialOwner === 'yes'
                      " @change="
                        selectBeneficialOwnerOption(customerIndex, 'yes')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.internalGWG_data.beneficialOwner === 'no'
                      " @change="selectBeneficialOwnerOption(customerIndex, 'no')" />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>

              <div class="checkbox-text-container">
                <p>Fragwürdiges Verhalten?</p>
              </div>

              <ul>
                <div class="checkbox-container">
                  <label class="container">Ja
                    <input type="checkbox" :checked="customerItem.internalGWG_data.questionableBehaviour ===
                      'yes'
                      " @change="
                        selectQuestionableBehaviourOption(customerIndex, 'yes')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Nein
                    <input type="checkbox" :checked="customerItem.internalGWG_data.questionableBehaviour ===
                      'no'
                      " @change="
                        selectQuestionableBehaviourOption(customerIndex, 'no')
                        " />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </ul>
              <!-- <div>
                <button
                  class="cancel-customer-button"
                  @click="removeCustomerInternalGWGForm(customerIndex)"
                >
                  <DeleteIcon />
                </button>
              </div> -->
            </div>
          </div>

          <div>
            <div class="main-container" style="margin-bottom: 20px; margin-top: 20px">
              <p>Finanzierungsunterlagen</p>
            </div>
            <div>
              <div class="textfield-container">
                <span class="placeholder-container">
                  Kategorie des Dokuments
                </span>
                <input class="input-container" v-model="form_finanzierungsunterlagen.documentCategory" type="text" />
              </div>
            </div>
            <div class="header-container">
              <p>Hochladen der Finanzierungsunterlagen :</p>
            </div>
            <!-- <div style="margin-bottom: 30px">
              <input
                id="pdfUpload"
                type="file"
                name="Datei auswählen"
                accept="application/pdf"
                @change="handleFinancingFileUpload"
              />
            </div> -->
            <div class="file-upload-container" style="margin-bottom: 30px">
              <label for="financingFileUpload" class="file-upload-label">
                Datei hier hineinziehen oder
                <span class="clickable">klicken</span> um hochzuladen.
              </label>
              <input id="financingFileUpload" type="file" name="Datei auswählen" accept="application/pdf"
                @change="handleFinancingFileUpload($event)" style="display: none" />
              <div v-if="this.form_finanzierungsunterlagen.financingDocuments" class="file-preview">
                <span class="file-name">
                  {{
                    this.form_finanzierungsunterlagen.financingDocuments.name
                  }}
                </span>
                <button class="remove-file" @click="removeFinancingFileUpload()">
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="this.currentStep === 6">
          <div>
            <div class="main-container" style="margin-bottom: 30px">
              <p>Notartermin</p>
            </div>
            <div>
              <div class="textfield-container" style="margin-bottom: 20px">
                <span class="placeholder-container">
                  Datum und Uhrzeit des Notartermins festlegen
                </span>
                <input class="input-container" v-model="form_notartermin.notaryAppoinmentDate" type="date" />
              </div>
              <!-- <div class="textfield-container" style="margin-bottom: 20px">
                <span class="placeholder-container">
                  Möglichkeit Notartermin zu bearbeiten:
                </span>
                <input
                  class="input-container"
                  v-model="form_notartermin.notaryAppointmentProcess"
                  type="date"
                />
              </div> -->
              <div class="dropdown-container" style="margin-bottom: 20px; margin-top: 20px">
                <DropdownField placeHolder="Hat stattgefunden oder nicht" :inputModal="form_notartermin.takenPlaceOrNot"
                  :items="notarterminCategories" :isMultiSelect="false" :isModal="true" :clearOnReset="!show"
                  v-on:onDropdownChange="setNotarterminCategoriesData" />
              </div>
              <!-- <div>
                <div class="header-container">
                  <p>Möglichkeit Notartermin zu bearbeiten:</p>
                </div>
              </div> -->

              <!-- <div>
                <input
                  id="pdfUpload"
                  type="file"
                  name="Datei auswählen"
                  accept="image/jpeg, image/jpg"
                  @change="handleFileUpload"
                />
              </div> -->
              <!-- <div>
                <div class="header-container">
                  <p>Hat stattgefunden oder nicht:</p>
                </div>
              </div> -->

              <!-- <div>
                <input
                  id="pdfUpload"
                  type="file"
                  name="Datei auswählen"
                  accept="image/jpeg, image/jpg"
                  @change="handleFileUpload"
                  style="margin-bottom: 20px"
                />
              </div> -->
            </div>
          </div>
          <div>
            <div class="main-container">
              <p>Finaler KV</p>
            </div>
          </div>
          <div>
            <div class="header-container">
              <p>Hochladen des finalen KV :</p>
            </div>
          </div>

          <!-- <div style="margin-bottom: 20px">
            <input
              id="pdfUpload"
              type="file"
              name="Datei auswählen"
              accept="application/pdf"
              @change="handleKVFileUpload"
            />
          </div> -->
          <div class="file-upload-container" style="margin-bottom: 30px">
            <label for="kvFileUpload" class="file-upload-label">
              Datei hier hineinziehen oder
              <span class="clickable">klicken</span> um hochzuladen.
            </label>
            <input id="kvFileUpload" type="file" name="Datei auswählen" accept="application/pdf"
              @change="handleKVFileUpload($event)" style="display: none" />
            <div v-if="this.form_finalKv.finalKvForm" class="file-preview">
              <span class="file-name">
                {{ this.form_finalKv.finalKvForm.name }}
              </span>
              <button class="remove-file" @click="removeKVFileUpload()">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div class="checkbox-container">
            <label class="container">finaler KV wurde von Covivio unterschrieben
              <input type="checkbox" :checked="form_finalKv.kvSignedByCovivio === 'yes'"
                @change="selectFinalKvSignedOption" />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <div v-if="this.currentStep === 7">
          <div class="main-container" style="margin-bottom: 30px">
            <p>Verkaufsmeldung</p>
          </div>

          <div v-for="unit in addedUnits" style="margin-top: 10px" :key="unit.realEstateData.real_estate_sys_id"
            class="unit-container">
            <div v-if="!unit.cancelData?.cancellationReason?.trim()" class="ndb-form-container">
              <button class="added-ndbforms-button" @click="toggleUnitDetailsExpandable(unit)">
                <span class="ndb-added-customername">{{
                  unit.realEstateData.real_estate_id
                  }}</span>
                <span class="spand-icon">
                  <DownIcon v-if="unit.expandUnitdetails" />
                  <UpIcon v-else />
                </span>
              </button>

              <div v-if="unit.expandUnitdetails" class="unit-details-container">
                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container"> Datum </span>
                    <input class="grey-input-readonly-container" readonly
                      :value="form_reservation.reservationCreateDate" type="text" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container">
                      Vertriebskaufpreis
                    </span>
                    <input class="grey-input-readonly-container" readonly :value="unit.realEstateData.real_estate_price"
                      type="text" />
                  </div>
                </ul>

                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container"> Kunde </span>
                    <input class="grey-input-readonly-container" readonly :value="form_customers[0].customer_data.customerFirstname +
                      ' ' +
                      form_customers[0].customer_data.customerLastname
                      " type="text" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container">Beurkundung: Datum</span>
                    <input class="grey-input-readonly-container" readonly :value="form_notartermin.notaryAppoinmentDate"
                      type="text" />
                  </div>
                </ul>

                <ul>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container">beurkundeter Kaufpreis</span>
                    <input class="grey-input-readonly-container" readonly :value="this.formatPrice(
                      unit.realEstateData.real_estate_beurkundeter_price
                    )
                      " type="text" />
                  </div>
                  <div class="textfield-container" style="margin-bottom: 20px">
                    <span class="grey-placeholder-container">
                      Lieferpreis aktuell
                    </span>
                    <input class="grey-input-readonly-container" readonly :value="this.formatPrice(
                      unit.realEstateData.real_estate_delivery_price
                    )
                      " type="text" />
                  </div>
                </ul>

                <div class="checkbox-container">
                  <label class="container">GWG-Kundenfragebogen liegt vor:
                    <input type="checkbox" :checked="unit.verkaufData.isGwgCustomerQuestionnaireAvailble ===
                      'ja'
                      " @change="selectGwgCustomerOption(unit)" />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">GWG- internfragebogen liegt vor :
                    <input type="checkbox" :checked="unit.verkaufData.issGwgInternalQuestionnaireAvailble ===
                      'ja'
                      " @change="selectGwgInternalOption(unit)" />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="checkbox-container">
                  <label class="container">Reservierungsgebühr
                    <input type="checkbox" :checked="unit.verkaufData.isReservationFee === 'ja'"
                      @change="selectReservationFeeOption(unit)" />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="dropdown-container" style="margin-bottom: 20px; margin-top: 20px">
                  <DropdownFieldGrey placeHolder="Investmentart" :inputModal="unit.verkaufData.investment"
                    :items="unit.verkaufDataOptions" :isMultiSelect="false" :isModal="true" :clearOnReset="!show"
                    v-on:onDropdownChange="
                      setInvestmentCategoriesData(unit, $event)
                      " />
                </div>
                <div class="textfield-container" style="margin-bottom: 20px">
                  <span class="grey-placeholder-container">Weitere Besonderheiten</span>
                  <input class="grey-input-container" v-model="unit.verkaufData.otherSpecialFeatures" type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="button-container" style="padding: 0 45px">
        <button class="prev-button" v-if="this.currentStep > 1" @click="previousStep">
          Zurück
        </button>
        <button class="next-button" v-if="this.currentStep < this.totalSteps" @click="nextStep">
          WEITER
        </button>
        <button class="save-button" v-if="this.currentStep === this.totalSteps" @click="confirmationSave">
          Speichern
        </button>
      </div>

      <div v-if="errorMessage" class="error-alert">
        <i class="error-icon">!</i>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 4;
}

.modal-inner {
  background-color: white;
  min-width: 40%;
  max-width: 40%;
  min-height: 100vh;
  max-height: 100%;
  border-radius: 4px;
  padding-top: 16px;
  padding-bottom: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}

.back-arrow-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  border: none;
  border-radius: 18px;
  width: 36px;
  height: 36px;
  margin-left: 20px;
}

.top-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-gray);
}

.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: #f8f8f8;
  border: none;
  border-radius: 18px;
  margin-right: 20px;
}

.progress-bar {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.step {
  width: 20px;
  height: 20px;
  background-color: #d3d3d3;
  border-radius: 50%;
  margin: 0 5px;
}

.step.active {
  background-color: var(--blue);
}

.header-container {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: black;
  padding-top: 20px;
  margin-bottom: 20px;
}

.checkbox-text-container {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: black;
  margin-bottom: 20px;
}

.text-container {
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: black;
  margin-bottom: 35px;
}

.form-container {
  padding: 0 45px;
}

.form-group {
  margin-bottom: 20px;
}

.placeholder-container {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  background-color: white;
  color: var(--gray-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  top: -9px;
  left: 9px;
  z-index: 1;
}

.checkbox-container {
  padding: 20px 22px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #eeeeee;
  color: var(--dark-gray);
  font-family: inherit;
  margin-bottom: 20px;
}

.textfield-container {
  position: relative;
  width: 100%;
}

.input-container {
  width: 100%;
  padding: 12px 23px 8px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
}

.error-border {
  border: 1px solid red;
}

.main-container {
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: black;
}

ul {
  /* list-style: none;
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-count: 3; */

  display: grid;
  grid-template-columns: repeat(2, 2fr);
  gap: 10px;
  justify-content: space-between;
  margin-left: -40px;
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: white;
}

.container:hover input~.checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked~.checkmark {
  background-color: var(--blue);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked~.checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.add-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: transparent;
  color: var(--blue);
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  flex: 1;
  width: 100%;
}

.box-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid white;
  margin-bottom: 7px;
  margin-top: 7px;
}

.provision-box {
  display: inline-block;
  padding: 2px 10px;
  background-color: lightgray;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

.estate-details-left,
.estate-details-right {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 80%;
}

.estate-details-right {
  border-right: 1px solid white;
  align-items: flex-end;
  padding-right: 10px;
}

.estate-details-left span,
.estate-details-right span {
  font-size: 14px;
}

.estate-remove-button-container {
  display: flex;
  align-self: center;
  justify-content: center;
  padding: 10px;
  width: 20%;
}

.remove-button {
  border: 1px solid #eeeeee;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.grey-container {
  background-color: #f0f0f0;
  padding: 10px;
  width: 100%;
  height: 170px;
  border-radius: 4px;
  margin-top: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.textarea-container {
  width: 100%;
  height: 180px;
  background-color: #eeeeee;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 10px;
  font-family: inherit;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  resize: none;
  overflow: auto;
  margin-top: 15px;
}

.prev-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: transparent;
  color: var(--blue);
  padding: 13px 30px 13px 30px;
  margin-right: 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.next-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 60%;
  background-color: white;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item:hover {
  background: lightgray;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
  z-index: 1000;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  z-index: 1000;
}

.search-container {
  display: flex;
  justify-content: space-between;
}

.search-button {
  justify-content: center;
  align-items: center;
  width: 30%;
  background-color: var(--blue);
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 30px;
  padding: 10px;
  cursor: pointer;
}

.search-icon {
  font-size: 16px;
}

/* .file-upload-container {
  border: 2px #d9d9d9;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
}

.upload-box {
  color: #f9f9f9;
  font-size: 14px;
}

.clickable-text {
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
} */

/* .file-upload-container:hover {
  background-color: #f1f1f1;
} */

.error-alert {
  display: flex;
  position: fixed;
  left: 32.5%;
  width: 35%;
  bottom: 10px;
  align-items: center;
  background-color: #fdecea;
  color: #d93025;
  padding: 8px;
  border-radius: 5px;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  /* margin-left: 44px; */
  /* margin-right: 44px; */
  /* z-index: 4; */
}

.error-icon {
  font-weight: bold;
  margin-right: 8px;
  color: #d93025;
}

.save-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.grey-input-readonly-container {
  display: flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 23px 8px;
  background-color: #fafafa;
  color: var(--gray-text);
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  outline: none;
  width: 100%;
}

.input-readonly-container {
  display: flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 23px 8px;
  color: var(--gray-text);
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  outline: none;
  width: 100%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.loading-icon-container {
  position: absolute;
  top: 30%;
  right: 40px;
  z-index: 2;
}

.loading-spinner {
  border: 4px solid var(--dark-gray);
  border-top: 4px solid #ffff;
  border-radius: 50%;
  margin: auto;
  width: 20px;
  height: 20px;
  position: absolute;
  padding: 5px;
  animation: spin 2s linear infinite;
}

.unit-details-container {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.add-unit-name {
  flex-grow: 1;
  text-align: center;
}

.ndb-added-customername {
  flex-grow: 1;
  text-align: left;
}

.unit-delete-icon {
  padding-right: 10px;
}

.unit-cancelation-button {
  padding: 10px;
  background-color: white;
  color: red;
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  border: 1px solid var(--red);
  border-radius: 4px;
  display: flex;
  margin-left: auto;
  align-items: flex-end;
  justify-content: flex-end;
}

.cancel-or-Proceed-button {
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: var(--blue);
  color: white;
  padding: 13px 30px 13px 30px;
  margin-right: 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.add-units-button {
  display: flex;
  justify-content: space-between;
  align-items: "center";
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: transparent;
  color: var(--blue);
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  flex: 1;
  width: 100%;
}

.spand-icon {
  margin-left: auto;
  font-weight: bold;
}

.cancellation-expand-uni-view {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.add-more-customers-button {
  white-space: nowrap;
  border: 1px solid var(--blue);
  border-radius: 4px;
  background-color: transparent;
  color: var(--blue);
  padding: 13px 30px 13px 30px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
  display: flex;
  margin-left: auto;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-customer-button {
  border: 1px solid var(--red);
  border-radius: 4px;
  background-color: var(--white);
  color: var(--red);
  padding: 7px;
  margin-left: 15px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.added-customer-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  border-radius: 4px;
  background-color: #fafafa;
  border: 1px solid #fafafa;
  color: var(--gray-text);
  font-weight: bold;
  padding: 18px 18px 18px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  flex: 1;
  width: 100%;
}

.customerform-grey-background {
  background-color: #fafafa;
  border: 2px solid #fafafa;
  padding: 0 20px;
  margin-top: 0;
}

.added-ndbforms-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  border-radius: 4px;
  background-color: #fafafa;
  border: 1px solid #fafafa;
  color: var(--gray-text);
  font-weight: bold;
  padding: 20px 20px 20px 20px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  flex: 1;
  width: 100%;
}

.added-externalforms-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  border-radius: 4px;
  background-color: #fafafa;
  border: 1px solid #fafafa;
  color: var(--gray-text);
  font-weight: bold;
  padding: 20px 35px 20px 35px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  flex: 1;
  width: 100%;
}

.ndb-form-container {
  background-color: #fafafa;
  border: 2px solid #fafafa;
  padding: 0 20px;
}

.grey-placeholder-container {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  background-color: #fafafa;
  color: var(--gray-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  top: -9px;
  left: 9px;
  z-index: 1;
}

.grey-input-container {
  width: 100%;
  padding: 12px 23px 8px;
  border: 1px solid var(--light-gray);
  background-color: #fafafa;
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
}

.clear-cancellation-button {
  white-space: nowrap;
  border: 1px solid var(--red);
  border-radius: 4px;
  background-color: transparent;
  color: var(--red);
  padding: 13px 30px 13px 30px;
  margin-right: 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  flex: 1;
}

.file-upload-container {
  border: 1px solid #dfe3e6;
  width: 100%;
  border-radius: 4px;
  padding: 16px;
  background-color: #f8fafc;
  font-family: Arial, sans-serif;
}

.file-upload-label {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #666;
  /* margin-bottom: 12px; */
}

.clickable {
  color: #666;
  text-decoration: underline;
  cursor: pointer;
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  background-color: #f8fafc;
}

.file-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file {
  background: none;
  border: none;
  color: 1px #dfe3e6;
  font-size: 16px;
  cursor: pointer;
}
</style>
