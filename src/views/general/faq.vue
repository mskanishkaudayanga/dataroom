<script>

import Navigation from "@/components/Navigation.vue";
import DropdownArrow from "@/components/icons/icon-dropdown.vue";
import Button from "@/components/buttons/button.vue";
import axios from "axios";
import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
export default {
  name: 'faq',
  components: {AnimateCircleIcon, DropdownArrow, Navigation, Button},
  data() {
    return {
      activeItem: "faq-0",
      faqs: [],
      isLoading: false,
    }
  },
  methods: {
    toggleItem($event) {
      if ( this.activeItem === $event.target.dataset.ref ) {
        this.activeItem = '';
        return;
      }
      this.activeItem = $event.target.dataset.ref;
    },
    getFAQs() {

      this.isLoading = true;

      axios.get(this.globalApiBaseUrl + '/reservations/getFAQs')
        .then(
            (response) => {
              if ( response.status === 200 ) {
                this.faqs = response.data.response;
              } else {
                this.faqs = [];
                this.notificationBannerInit('warning', 'Keine FAQs gefunden');
              }
            }
        )
        .catch(
            (error) => {
              this.faqs = [];
              this.notificationBannerInit('warning', 'Keine FAQs gefunden');
            }
        ).finally(
        () => {
          this.isLoading = false;
        }
      )
    }
  },
  mounted() {
    this.getFAQs();
  }
}

</script>

<template>

  <Navigation/>

  <div class="faq-page">

    <div class="faq-wrapper">

      <div class="back-button" @click="this.redirectToLastHistory">Zurück</div>
      <div class="page-title"><h2>FAQ</h2></div>

      <AnimateCircleIcon v-if="isLoading"></AnimateCircleIcon>

      <div class="faq-item" :class="{'active': activeItem === 'faq-'+index}" v-for="(item, index) in faqs">

        <div class="faq-title" :data-ref="'faq-'+index" @click="toggleItem">
          {{ index+1 }}. {{ item.question }}
          <DropdownArrow></DropdownArrow>
        </div>

          <div class="faq-content" v-show="activeItem === 'faq-'+index">
            <span v-html="item.answer"></span>
          </div>

      </div>

    </div>

  </div>

</template>

<style scoped>

.faq-page {
  display: flex;
  flex-wrap: wrap;
  align-self: flex-start;
  justify-content: center;
  flex-basis: 100%;
  margin-top: 100px;
}

.faq-wrapper {
  flex-basis: 50%;
}

.page-title {
  flex-basis: 100%;
  margin-bottom: 50px;
}

.faq-item {
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
}

.faq-item + .faq-item {
  margin-top: 25px;
}

.faq-item > div {
  padding: 15px;
}

.faq-item.active i {
  transform: rotate(180deg);
}

.faq-title {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: var(--dark-gray-text);
}

.back-button {
  margin-bottom:10px;
  color:var(--blue);
  cursor: pointer;
}

@media (max-width: 767px) {
  .faq-wrapper {
    flex-basis: 90%;
  }
}

</style>
