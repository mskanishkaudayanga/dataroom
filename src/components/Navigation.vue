<script>
import DashboardIcon from './icons/icon-dashboard.vue'
import LogoutIcon from './icons/icon-logout.vue'
import axios from "axios";
import FilterIcon from "@/components/icons/icon-filter.vue";
import ArrowLeftIcon from "@/components/icons/icon-arrow-left.vue";
import ArrowRightIcon from "@/components/icons/icon-arrow-right.vue";
import FloorplansIcon from "@/components/icons/icon-floorplan.vue";
import LinkIcon from "@/components/icons/icon-link.vue";
import KaufpreisListIcon from "@/components/icons/icon-kaufpreis-list.vue";
import ReservationListIcon from "@/components/icons/icon-reservation-list.vue";
import KPIsDashboardIocn from "@/components/icons/icon-kpis-dashboard.vue";
import MailIcon from "@/components/icons/icon-mail.vue";

import GraphIcon from "@/components/icons/icon-graph.vue";
import {userRolesStore} from "@/stores/userRoleStore";
import PersonSearchIcon from "@/components/icons/icon-person-search.vue";
import Agent from "@/components/icons/icon-agent.vue";
import OptionIcon from "@/components/icons/icon-options.vue";

export default {
  name: "Navigation",
  components: {
    PersonSearchIcon, MailIcon,
    GraphIcon, LinkIcon, FloorplansIcon, ArrowRightIcon, ArrowLeftIcon, FilterIcon, DashboardIcon, LogoutIcon, KaufpreisListIcon, ReservationListIcon, KPIsDashboardIocn, Agent, OptionIcon},
  data() {
    return {
      allowReservationListRoles: false,
    }
  },
  methods: {
    getCurrentUserRoleName () {
      const store = userRolesStore();
      this.allowReservationListRoles = store.getUserRoles.includes("administrator") || store.getUserRoles.includes("administrator_kg") || store.getUserRoles.includes("administrator_living") || store.getUserRoles.includes("reservation_department") || this.getUserMail() === 't.radde@bestplace-living.de';
    },
    getCompHeight() {
      this.$emit('navigationHeight', this.$refs['nav'].offsetHeight)
    }
  },
  mounted() {
    this.getCompHeight();
    this.getCurrentUserRoleName();
  },
  updated() {
    this.getCurrentUserRoleName();
  },
  created() {
    window.addEventListener("resize", this.getCompHeight);
  },
  unmounted() {
    window.removeEventListener("resize", this.getCompHeight);
  }
}
</script>


<template>
  <div class="navigation" ref="nav">
    <div class="navigation-wrapper">

      <div class="navigation-header">
        <div class="logo"><b>B</b>C</div>
      </div>

      <div class="navigation-body">
        <div class="link-item" v-if="this.getUserCompany() === 'living' || this.getUserId() === 32 || this.kgAgentsForCockpit.includes(this.getUserMail())">
          <router-link :to="{name: 'home'}">
            <DashboardIcon></DashboardIcon>
          </router-link>
        </div>
        <div class="link-item">
          <router-link :to="{name: 'realEstatesFilteringTool'}">
            <FilterIcon></FilterIcon>
          </router-link>
        </div>
        <div class="link-item">
          <router-link :to="{name: 'canbanTool'}" data-cy="canban-button">
            <FloorplansIcon></FloorplansIcon>
          </router-link>
        </div>
        <!-- <div class="link-item">
          <router-link :to="{name: 'dataRoomTool'}" data-cy="dataroom-button">
            <LinkIcon></LinkIcon>
          </router-link>
        </div> -->
        <div class="link-item">
          <router-link :to="{name: 'dataRoomToolNew'}" data-cy="dataroom-button">
            <personSearchIcon></personSearchIcon>
          </router-link>
        </div>
        <div class="link-item">
          <router-link :to="{name: 'dataRoomToolNewV2'}" data-cy="dataroom-button">
            <personSearchIcon></personSearchIcon>
          </router-link>
        </div>
        <div class="link-item" v-if="this.getUserCompany() === 'living' || this.kgAgentsForKPL.includes(this.getUserMail())">
          <router-link to="/kaufpreis-list">
            <KaufpreisListIcon></KaufpreisListIcon>
          </router-link>
        </div>
        <div class="link-item" v-if="this.getUserRole() === 4 || this.getUserId() === 50 || this.getUserId() === 83">
          <router-link :to="{name: 'reporting'}" data-cy="reporting-button">
            <GraphIcon></GraphIcon>
          </router-link>
        </div>
        <div class="link-item" v-if="allowReservationListRoles">
          <router-link to="/reservation-list">
            <ReservationListIcon></ReservationListIcon>
          </router-link>
        </div>
        <div class="link-item" v-if="this.getUserRole() >= 3">
          <router-link to="/KPIs-dashboard">
            <KPIsDashboardIocn></KPIsDashboardIocn>
          </router-link>
        </div>
        <!-- <div class="link-item" v-if="this.getUserRole() === 4">
          <router-link :to="{name: 'agentFilterView'}" data-cy="dataroom-button">
            <Agent></Agent>
          </router-link>
        </div> -->
        <div class="link-item" v-if="this.getUserRole() === 4">
          <router-link :to="{name: 'agentRegionClustorFilterView'}" data-cy="dataroom-button">
            <Agent></Agent>
          </router-link>
        </div>
<!--        <div class="link-item">-->
<!--          <router-link :to="{name: 'webMailerView'}" data-cy="webmailer-button">-->
<!--            <MailIcon></MailIcon>-->
<!--          </router-link>-->
<!--        </div>-->
<!--        <div class="link-item">-->
<!--          <router-link :to="{name: 'optionsVIew'}" data-cy="options-button">-->
<!--            <OptionIcon></OptionIcon>-->
<!--          </router-link>-->
<!--        </div>-->

      </div>

      <div class="navigation-footer">
        <div class="link-item">
          <div @click="this.logoutUser" data-cy="logout-button">
            <LogoutIcon style="cursor: pointer"></LogoutIcon>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<style scoped>

.navigation {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--dark-gray);
}

.link-item + .link-item {
  margin-top: 15px;
}

.navigation-wrapper {
  min-height: 100%;
  width: 100px;
}

.navigation-header {
  width: 100px;
  height: 80px;
  display:flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  background-color: rgba(255, 255, 255, 0.05);
}

.navigation-body {
  width: 100%;
  margin-top: 15px;
  text-align: center;
}

.navigation-footer {
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
}

i {
  color: white;
  font-size: 30px;
}

@media (max-width: 1140px) {
  .collaps-filtertool-first-col {
    display: none;
  }
}

/* Mobile */
@media (max-width: 767px){
  .navigation {
    display: flex;
    position: relative;
    height: auto;
    width: 100%;
  }
  .navigation-wrapper {
    display: flex;
    flex-basis: 100%;
  }

  .navigation-header {
    width: 200px;
  }

  .navigation-header
  .navigation-body,
  .navigation-footer {
    flex-basis: 33%;
  }

  .navigation-body,
  .navigation-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0;
  }

  .navigation-footer {
    position: relative;
    bottom: unset;
    justify-content: end;
    padding-right: 15px;
  }

  .link-item + .link-item {
    margin-top: 0;
    margin-left: 25px;
  }
}

</style>
