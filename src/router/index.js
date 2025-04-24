
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import KaufpreisListView from '../views/KaufpreisListView.vue';
import LoginView from '../views/LoginView.vue';
import ErrorView from '../views/ErrorView.vue';
import SingleReservationView from '../views/GetSingleReservationView.vue';
import CreateReservationsModal from '../views/CreateReservationView.vue';
import CreateFilterView from "../views/FilterView.vue";
import getSingleVerkaufsmeldungView from "../views/GetSingleVerkaufsmeldungView.vue";
import webformNDBView from "@/views/customer/WebformNDBView.vue";
import realEstatesFilteringTool from "@/views/others/realEstatesFilteringTool.vue";
import realEstatesFilterView from "@/views/others/realEstatesFilterView.vue";
import webformGWGExternalView from "@/views/customer/WebformGWGExternalView.vue";
import webformFinanceUploadsView from "@/views/customer/WebformFinanceUploadsView.vue";
import webformFeedback from "@/views/customer/WebformFeedback.vue";
import canbanTool from "@/views/others/canbanTool.vue";
import canbanModalCreateLead from "@/views/others/modals/canbanModalCreateLead.vue";
import canbanModalCreateEditNotice from "@/views/others/modals/canbanModalCreateEditNotice.vue";
import canbanModalChangeAgent from "@/views/others/modals/canbanModalChangeAgent.vue";
import canbanModalEditLead from "@/views/others/modals/canbanModalEditLead.vue";
import canbanModalLeadInformation from "@/views/others/modals/canbanModalLeadInformation.vue";
import canbanModalDenieLead from "@/views/others/modals/canbanModalDenieLead.vue";
import canbanToolDeniedLeads from "@/views/others/canban/canbanToolDeniedLeads.vue";
import canbanModalDeleteLeadPermanent from "@/views/others/modals/canbanModalDeleteLeadPermanent.vue";
import canbanModalEditLeadBackToLV from "@/views/others/modals/canbanModalEditLeadBackToLV.vue";
import canbanModalEditLeadBackToAgent from "@/views/others/modals/canbanModalEditLeadBackToAgent.vue";
import canbanModalFilters from "@/views/others/modals/canbanModalFilters.vue";
import canbanModalWv from "@/views/others/modals/canbanModalWv.vue";
import canbanModalWvBack from "@/views/others/modals/canbanModalWvBack.vue";
import canbanModalMakeLeadQualified from "@/views/others/modals/canbanModalMakeLeadQualified.vue";
import canbanModalShowSearchCriteria from "@/views/others/modals/canbanModalShowSearchCriteria.vue";
import canbanModalDeleteAppointment from "@/views/others/modals/canbanModalDeleteAppointment.vue";
import canbanToolUnqualifiedLeads from "@/views/others/canban/canbanToolUnqualifiedLeads.vue";
import canbanModalLeadToUnqualified from "@/views/others/modals/canbanModalLeadToUnqualified.vue";
import canbanModalChangeRealEstate from "@/views/others/modals/canbanModalChangeRealEstate.vue";
import canbanModalLeadToReservation from "@/views/others/modals/canbanModalLeadToReservation.vue";
import canbanModalEditCustomerData from "@/views/others/modals/canbanModalEditCustomerData.vue";
import canbanModalCancelReservation from "@/views/others/modals/canbanModalCancelReservation.vue";
import dataRoomTool from "@/views/others/dataRoomTool.vue";
import dataRoomToolNew from "@/views/others/newDataRoomTool.vue";
import dataRoomToolNewV2 from "@/views/others/newDataRoomToolV2.vue";
import canbanModalMakeNotaryAppointment from "@/views/others/modals/canbanModalMakeNotaryAppointment.vue";
import canbanModalLeadToSale from "@/views/others/modals/canbanModalLeadToSale.vue";
import faqView from "@/views/general/faq.vue";
import canbanModalEditAppointment from "@/views/others/modals/canbanModalEditAppointment.vue";
import reportingView from "@/views/others/reporting/reportingTool.vue";
import KPIsDashboardView from '../views/KPIsDashboardView.vue';
import ReservationListView from '../views/ReservationListView.vue';
import KundenberichtView from '../views/KundenberichtView.vue';
//import webMailerView from "@/views/others/webMailerView.vue";
import agentFilterView from "@/views/others/agentFilterView.vue";
import agentRegionClustorFilterView from "@/views/others/agentRegionClustorFilterView.vue";
import agentOptionsCompanyView from "@/views/others/agentOptionsCompanyView.vue";
import webMailerView from "@/views/others/webMailerView.vue";
import optionsVIew from "@/views/others/optionsView.vue";
import EmailConfigView from "@/views/others/emailConfigView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/single-reservation/:id',
          component: SingleReservationView,
          name: 'singleReservationView'
        },
        {
          path: '/create-reservation/',
          component: CreateReservationsModal,
          name: 'createReservationView'
        },
        {
          path: '/edit-reservation/:id',
          component: CreateReservationsModal,
          name: 'editReservationView'
        },
        {
          path: '/filter/',
          component: CreateFilterView,
          name: 'filterView',
        },
        {
          path: '/single-verkaufsmeldung/:id',
          component: getSingleVerkaufsmeldungView,
          name: 'singleVerkaufsmeldungView'
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    },
    {
      path: '/ndb',
      name: 'ndbWebform',
      component: webformNDBView
    },
    {
      path: '/gwgex',
      name: 'gwgexternal',
      component: webformGWGExternalView
    },
    {
      path: '/finances',
      name: 'financesUploads',
      component: webformFinanceUploadsView
    },
    {
      path: '/feedback',
      name: 'feedbackForm',
      component: webformFeedback
    },
    {
      path: '/real-state-filter',
      name: 'realEstatesFilteringTool',
      component: realEstatesFilteringTool,
      children: [
        {
          path: '/real-state-filter/filter',
          component: realEstatesFilterView,
          name: 'realEstatesFilterView'
        }
      ]
    },
    {
      path: '/canban',
      name: 'canbanTool',
      component: canbanTool,
      children: [
        {
          path: '/canban/show-lead/:company/:id/:customerSysId',
          component: canbanModalLeadInformation,
          name: 'canbanModalLeadInformation'
        },
        {
          path: '/canban/create-new-lead/',
          component: canbanModalCreateLead,
          name: 'canbanModalCreateLead'
        },
        {
          path: '/canban/edit-notice/:id',
          component: canbanModalCreateEditNotice,
          name: 'canbanModalCreateEditNotice',
        },
        {
          path: '/canban/edit-agent/:company/:activityId',
          component: canbanModalChangeAgent,
          name: 'canbanModalChangeAgent'
        },
        {
          path: '/canban/edit-lead/:id/:customerSysId',
          component: canbanModalEditLead,
          name: 'canbanModalEditLead'
        },
        {
          path: '/canban/edit-lead/:id/:customerSysId',
          component: canbanModalEditLead,
          name: 'canbanModalEditLeadOnlyDataroom'
        },
        {
          path: '/canban/edit-lead/:id/:customerSysId/:realEstateNr',
          component: canbanModalMakeLeadQualified,
          name: 'canbanModalMakeLeadQualified'
        },
        {
          path: '/canban/edit-searchcriteria/:id',
          component: canbanModalMakeLeadQualified,
          name: 'canbanModalMakeEditSearchCriteria'
        },
        {
          path: '/canban/denie-lead/:id',
          component: canbanModalDenieLead,
          name: 'canbanModalDeleteLead'
        },
        {
          path: '/canban/filter/',
          component: canbanModalFilters,
          name: 'canbanModalFilters'
        },
        {
          path: '/canban/wv/:id-:type',
          component: canbanModalWv,
          name: 'canbanModalWv',
        },
        {
          path: '/canban/wv/:id',
          component: canbanModalWvBack,
          name: 'canbanModalWvBack',
        },
        {
          path: '/canban/searchcriteria/:activityId',
          component: canbanModalShowSearchCriteria,
          name: 'canbanModalShowSearchCriteria',
        },
        {
          path: '/canban/canbanModalDeleteAppointment/:id',
          component: canbanModalDeleteAppointment,
          name: 'canbanModalDeleteAppointment',
        },
        {
          path: '/canban/unqualified-leads/:id',
          component: canbanModalLeadToUnqualified,
          name: 'canbanModalLeadToUnqualified'
        },
        {
          path: '/canban/change-real-estate/:id',
          component: canbanModalChangeRealEstate,
          name: 'canbanModalChangeRealEstate'
        },
        {
          path: '/canban/create-reservation/:id/:realEstateNr',
          component: canbanModalLeadToReservation,
          name: 'canbanModalLeadToReservation'
        },
        {
          path: '/canban/edit-customerdata/:id/:customerSysId',
          component: canbanModalEditCustomerData,
          name: 'canbanModalEditCustomerData'
        },
        {
          path: '/canban/cancel-reservation/:id/:reservationId',
          component: canbanModalCancelReservation,
          name: 'canbanModalCancelReservation'
        },
        {
          path: '/canban/notary-appointment/:id/:reservationId',
          component: canbanModalMakeNotaryAppointment,
          name: 'canbanModalMakeNotaryAppointment'
        },
        {
          path: '/canban/edit-notary-appointment/:id/:reservationId/:tempReservationStatus',
          component: canbanModalMakeNotaryAppointment,
          name: 'canbanModalEditNotaryAppointment'
        },
        {
          path: '/canban/edit-appointment/:id/:appointmentId',
          component: canbanModalEditAppointment,
          name: 'canbanModalEditAppointment'
        },
        {
          path: '/canban/create-sale/:id/',
          component: canbanModalLeadToSale,
          name: 'canbanModalLeadToSale'
        },
      ]
    },
    {
      path: '/canban/denied-leads/',
      component: canbanToolDeniedLeads,
      name: 'canbanToolDeniedLeads',
      children: [
        {
          path: '/canban/denied-leads/delete-lead/:id',
          component: canbanModalDeleteLeadPermanent,
          name: 'canbanModalDeleteLeadPermanent'
        },
        {
          path: '/canban/denied-leads/edit-lead-to-lv/:id',
          component: canbanModalEditLeadBackToLV,
          name: 'canbanModalEditLeadBackToLV'
        },
        {
          path: '/canban/denied-leads/edit-lead-to-agent/:id',
          component: canbanModalEditLeadBackToAgent,
          name: 'canbanModalEditLeadBackToAgent'
        },
        {
          path: '/canban/denied-leads/show-lead/:company/:id/:customerSysId',
          component: canbanModalLeadInformation,
          name: 'canbanModalLeadInformationDenied'
        },
      ]
    },
    {
      path: '/canban/unqualified-leads/',
      component: canbanToolUnqualifiedLeads,
      name: 'canbanToolUnqualifiedLeads',
      children: [
        {
          path: '/canban/unqualified-leads/reactivate/:id',
          component: canbanModalEditLeadBackToAgent,
          name: 'canbanModalEditReactiveLead'
        },
        {
          path: '/canban/unqualified-leads/show-lead/:company/:id/:customerSysId',
          component: canbanModalLeadInformation,
          name: 'canbanModalLeadInformationUnqualified'
        },
      ]
    },
    {
      path: '/dataroom/',
      component: dataRoomTool,
      name: 'dataRoomTool',
    },
    {
      path: '/new-dataroom/',
      component: dataRoomToolNew,
      name: 'dataRoomToolNew',
    },
    {
      path: '/new-dataroom-v2/',
      component: dataRoomToolNewV2,
      name: 'dataRoomToolNewV2',
    },
    {
      path: '/kaufpreis-list',
      name: 'kaufpreis-list',
      component: KaufpreisListView,
    },
    {
      path: '/faq',
      name: 'faq',
      component: faqView,
    },
    {
      path: '/reporting',
      name: 'reporting',
      component: reportingView,
    },
    {
      path: '/reservation-list',
      name: 'reservation-list',
      component: ReservationListView
    },

    {
      path: '/KPIs-dashboard',
      name: 'KPIs-dashboard',
      component: KPIsDashboardView
    },

    {
      path: '/Kundenbericht',
      name: 'kundenbericht',
      component: KundenberichtView
    },
    {
      path: '/agentFilter',
      component: agentFilterView,
      name: 'agentFilterView',
    },
    {
      path: '/agentRegionFilter',
      component: agentRegionClustorFilterView,
      name: 'agentRegionClustorFilterView',
    },
    {
      path: '/setting/agent/company',
      component: agentOptionsCompanyView,
      name: 'agentOptionsCompanyView'
    },
    // {
    //   path: '/webmailer',
    //   component: webMailerView,
    //   name: 'webMailerView',
    // },
    // {
    //   path: '/optionsVIew',
    //   component: optionsVIew,
    //   name: 'optionsVIew',
    // },
    // {
    //   path: '/EmailConfigView',
    //   component: EmailConfigView,
    //   name: 'EmailConfigView',
    // }
  ]
})

export default router
