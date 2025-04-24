<script>
  import OptionsIcon from '../icons/icon-optionsdots.vue'
  import StarIcon from "@/components/icons/icon-star.vue";
  import axios from "axios";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import EditIcon from "@/components/icons/icon-edit.vue";

  export default {
    name: "CardTitle",
    components: {EditIcon, AnimateCircleIcon, StarIcon, OptionsIcon},
    props: {
      reservationId: String,
      cardCreateDate: String,
      agentShortName: String,
      displayOptionsIcon: Boolean,
      titleType: {
        type: String,
        default: 'reservation'
      },
      countdown: {
        type: String,
        default: ''
      },
      notaryAppointment: {
        type: String,
        default: ''
      },
      isFavored: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        daysSinceCreation: '',
        reservationCreateDate: '',
        daysLeftText: '',

        isLoading: false,
      }
    },
    methods: {
      calcDaysLeftUpdateData() {
        let currentTimestamp = Date.now();
        let createDateTimestamp = new Date(this.cardCreateDate);

        createDateTimestamp = createDateTimestamp.getTime();

        const date1 = new Date(currentTimestamp);
        const date2 = new Date(createDateTimestamp);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


        this.reservationCreateDate = date2.toLocaleDateString('de-DE');

        this.daysSinceCreation = diffDays;

        if ( diffDays <= 1 ){
          this.daysLeftText = 'Tag';
        } else {
          this.daysLeftText = 'Tage';
        }
      },
      submitFavOfReservation() {

        if ( this.isLoading ) {
          return;
        }

        this.isLoading = true;

        let dataToSubmit = {
          'reservationId': this.reservationId,
          'enable': !this.isFavored,
        };

        axios.post(this.globalApiBaseUrl + '/reservations/fav', dataToSubmit )
            .then(
                (response) => {
                  if ( response.data.status === 200 ) {
                    this.notificationBannerInit('success', dataToSubmit.enable ? 'DIE RESERVIERUNG WURDE FAVORISIERT' : 'DU HAST DIE FAVORISIERUNG ENTFERNT')
                    this.$emit('favSuccessful', dataToSubmit);
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
              this.notificationBannerInit('warning', 'Reservierung konnte nicht favorisiert werden')
            }
        ).finally(
            () => {
              this.isLoading = false;
            })
      },
      toggleNoticeModus () {
        this.$emit('toggleNoticeMod', true);
      }
    },
    computed: {
      IdText() {
        return this.titleType === 'reservation' ? 'R-ID' : 'V-ID';
      },
      CountdownLeftDays() {
        if ( typeof this.countdown !== 'undefined' && this.countdown && this.countdown !== '' ){
          let countdown = this.countdown;
          countdown = countdown.replace(' ', 'T');
          let targetDate = new Date(countdown);
          let now = new Date();
          let diff = targetDate.getTime() - now.getTime();

          let daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
          // days left returns a minus value
          return 14+daysLeft;
        } else {
          return false;
        }
      },
      formatAgentShortnameToReadableText() {
        if ( this.agentShortName !== null && this.agentShortName !== undefined && this.agentShortName !== '' ) {
          let name = this.agentShortName.substring(1);
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return name;
        }
        return '';
      }
    },
    beforeMount() {
      this.calcDaysLeftUpdateData();
    },
    updated() {
      this.calcDaysLeftUpdateData();
    }
  }
</script>


<template>

  <div class="title">

    <div>
      <span data-cy="RdText">{{ reservationId.length ? IdText +' '+ reservationId : '' }}</span>

      {{ reservationCreateDate.length ? ' / ' + reservationCreateDate : '' }}

      <span v-if="titleType === 'reservation'">{{ daysSinceCreation ? ' / ' + daysSinceCreation + ' ' + daysLeftText : '' }}</span>
      <div v-if="this.getUserRole() > 1">Makler: {{ formatAgentShortnameToReadableText }}</div>
      <div class="sub-infos" v-if="CountdownLeftDays">
        <span v-if="CountdownLeftDays > 0">Countdown: <b>{{ CountdownLeftDays }} Tage</b> verbleibend</span>
        <span v-else>Countdown: <b>abgeschlossen</b></span>
      </div>
      <div class="sub-infos" v-if="notaryAppointment">
        Notartermin: {{ this.englishDateWithTimeToGermanDate(notaryAppointment) }}
      </div>
    </div>

    <div v-if="displayOptionsIcon" @click.prevent="">
      <StarIcon :isFavored="isFavored" @click="submitFavOfReservation" v-if="!isLoading"></StarIcon>
      <AnimateCircleIcon v-if="isLoading" style="font-size: 14px; margin: 0"></AnimateCircleIcon>

      <EditIcon style="margin-left: 15px;" @click="toggleNoticeModus"></EditIcon>
    </div>

  </div>

</template>


<style scoped>

.title {
  display: flex;
  color: var(--blue);
  justify-content: space-between;
  margin-bottom: 5px;
}

.sub-infos {
  font-size: 12px;
  font-weight: 500;
}

</style>
