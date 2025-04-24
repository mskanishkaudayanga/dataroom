<script>
import MailIcon from "@/components/icons/icon-mail.vue";
import SendIcon from "@/components/icons/icon-send.vue";
import CheckmarkWithBorderIcon from "@/components/icons/icon-checkmarkWithBorder.vue";
import PhoneIcon from "@/components/icons/icon-phone.vue";
import EyeIcon from "@/components/icons/icon-eye.vue";
import SaleIcon from "@/components/icons/icon-sale.vue";
import ReservationIcon from "@/components/icons/icon-reservation.vue";
import CancelIcon from "@/components/icons/icon-cancle.vue";
import NoticeIcon from "@/components/icons/icon-notice.vue";
import QualifiedLeadIcon from "@/components/icons/icon-qualified-lead.vue";
import LeadIcon from "@/components/icons/icon-lead.vue";
import DocumentIcon from "@/components/icons/icon-document.vue";
import AgentChangeIcon from "@/components/icons/icon-agent-change.vue";
import DataroomLoginIcon from "@/components/icons/icon-dataroom-login.vue";
import AppointmentIcon from "@/components/icons/icon-appointment.vue";
import AppointmentPhoneIcon from "@/components/icons/icon-appointment-online-phone.vue";
import AppointmentOfficeIcon from "@/components/icons/icon-appointment-online-office.vue";
import AppointmentInPlaceIcon from "@/components/icons/icon-appointment-online-in-place.vue";
import AppointmentNotaryIcon from "@/components/icons/icon-appointment-notary.vue";
import SmsIcon from "@/components/icons/icon-sms.vue";
import AgbIcon from "@/components/icons/icon-agb.vue";
import UnqualifiedLeadIcon from "@/components/icons/icon-unqualified-lead.vue";
import AcceptedLeadIcon from "@/components/icons/icon-accepted-lead.vue";
import DeniedLeadIcon from "@/components/icons/icon-denied-lead.vue";
import OfferIcon from "@/components/icons/icon-offer.vue";
import WantToDeletedIcon from "@/components/icons/icon-want-to-deleted.vue";
import RevocationIcon from "@/components/icons/icon-revocation.vue";
import CustomerConfirmationIcon from "@/components/icons/icon-customer-confirmation.vue";

export default {
  name: "ActivityIcons",
  components: {
    CustomerConfirmationIcon,
    RevocationIcon,
    WantToDeletedIcon,
    OfferIcon,
    DeniedLeadIcon,
    AcceptedLeadIcon,
    UnqualifiedLeadIcon,
    AgbIcon,
    SmsIcon,
    AppointmentNotaryIcon,
    AppointmentInPlaceIcon,
    AppointmentOfficeIcon,
    AppointmentPhoneIcon,
    AppointmentIcon,
    DataroomLoginIcon,
    AgentChangeIcon,
    DocumentIcon,
    LeadIcon,
    QualifiedLeadIcon,
    NoticeIcon,
    CancelIcon, ReservationIcon, SaleIcon, EyeIcon, PhoneIcon, CheckmarkWithBorderIcon, SendIcon, MailIcon},
  props: {
    activityKind: String,
    activityType: {
     type: String,
     default: '',
    },
  },
}
</script>



<template>

  <MailIcon v-if="this.activityKind === 'Email' && this.activityType === 'Eingang'"></MailIcon>

  <SendIcon v-else-if="this.activityKind === 'Email' && this.activityType === 'Ausgang'"></SendIcon>

  <CheckmarkWithBorderIcon v-else-if="this.activityKind === 'Aufgabe'"></CheckmarkWithBorderIcon>

  <PhoneIcon v-else-if="this.activityKind === 'Telefonat'"></PhoneIcon>

  <SaleIcon v-else-if="this.activityKind === 'Verkauf'"></SaleIcon>

  <ReservationIcon v-else-if="this.activityKind === 'Reservierung'"></ReservationIcon>

  <CancelIcon v-else-if="this.activityKind === 'Storno'"></CancelIcon>

  <NoticeIcon v-else-if="this.activityKind === 'Notiz'"></NoticeIcon>

  <QualifiedLeadIcon v-else-if="this.activityKind === 'Qualifizierter Lead'"></QualifiedLeadIcon>

  <LeadIcon v-else-if="this.activityKind.includes('Lead Neukunde') || this.activityKind.includes('Lead Bestandskunde')"></LeadIcon>

  <DocumentIcon v-else-if="this.activityKind.includes('heruntergeladen') || this.activityKind === 'Download'"></DocumentIcon>

  <AgentChangeIcon v-else-if="this.activityKind === 'Betreuerwechsel'"></AgentChangeIcon>

  <DataroomLoginIcon v-else-if="this.activityKind === 'In Datenraum eingeloggt'"></DataroomLoginIcon>

  <EyeIcon v-else-if="this.activityKind === 'Termin' && this.activityType === 'Besichtigung'"></EyeIcon>

  <AppointmentPhoneIcon v-else-if="this.activityKind === 'Termin' && this.activityType === 'Online-Terminbuchung Telefon'"></AppointmentPhoneIcon>

  <AppointmentOfficeIcon v-else-if="this.activityKind === 'Termin' && this.activityType === 'Online-Terminbuchung Büro'"></AppointmentOfficeIcon>

  <AppointmentInPlaceIcon v-else-if="this.activityKind === 'Termin' && this.activityType === 'Online-Terminbuchung Vor Ort'"></AppointmentInPlaceIcon>

  <AppointmentNotaryIcon v-else-if="this.activityKind === 'Termin' && this.activityType === 'Notartermin'"></AppointmentNotaryIcon>

  <AppointmentIcon v-else-if="this.activityKind === 'Termin'"></AppointmentIcon>

  <SmsIcon v-else-if="this.activityKind === 'SMS'"></SmsIcon>

  <AgbIcon v-else-if="this.activityKind === 'AGB'"></AgbIcon>

  <UnqualifiedLeadIcon v-else-if="this.activityKind === 'Unqualifizierter Lead'"></UnqualifiedLeadIcon>

  <AcceptedLeadIcon v-else-if="this.activityKind === 'Lead akzeptiert'"></AcceptedLeadIcon>

  <DeniedLeadIcon v-else-if="this.activityKind === 'Lead nicht akzeptiert'"></DeniedLeadIcon>

  <OfferIcon v-else-if="this.activityKind === 'Kaufpreisangebot'"></OfferIcon>

  <WantToDeletedIcon v-else-if="this.activityKind === 'möchte gelöscht werden'"></WantToDeletedIcon>

  <RevocationIcon v-else-if="this.activityKind === 'Widerruf bestätigt'"></RevocationIcon>

  <CustomerConfirmationIcon v-else-if="this.activityKind === 'Customer Confirmation'"></CustomerConfirmationIcon>

</template>

<style scoped></style>
