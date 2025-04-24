<script>

  import BadgeCheckIcon from "@/components/icons/icon-badge-check.vue";
  import EurocointIcon from "@/components/icons/icon-eurocoin.vue";
  import BankhouseIcon from "@/components/icons/icon-bankhouse.vue";
  import NonRenterIcon from "@/components/icons/icon-non-renter.vue";
  import AlertIcon from "@/components/icons/icon-warning.vue";
  import InfoIcon from "../icons/icon-info.vue";
  import AutomaticSearchcriteriaIcon from "@/components/icons/icon-code-gear.vue";

  export default {
    name: "ToolTip",
    components: {
      AutomaticSearchcriteriaIcon,
      NonRenterIcon, InfoIcon, AlertIcon, BankhouseIcon, EurocointIcon, BadgeCheckIcon},
    props: {
      hoverText: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
       customId: this.makeid(30),
      }
    },
    methods: {
      checkIconDisplay(iconName) {
        let hoverText = this.hoverText.replaceAll('<', '');
        hoverText = hoverText.replaceAll('>', '');
        if (iconName === hoverText ) {
          return true;
        }
        return false;
      },
      handleToolTipText(refId) {
        const icon = this.$refs['tooltipicon-' + refId].getBoundingClientRect();
        const text = this.$refs['tooltiptext-' + refId];

        const iconLeft = icon.left;
        const iconTop = icon.top;

        const textHeight = text.getBoundingClientRect().height;
        const textWidth = text.getBoundingClientRect().width;

        let tooltipTop = iconTop - (textHeight + 10);
        let tooltipLeft = iconLeft - (textWidth / 2);

        // Check if the tooltip is out of the viewport on the top side
        if (tooltipTop < 0) {
          tooltipTop = iconTop + icon.height + 10; // Position below the icon if above is out of view
        }

        // Check if the tooltip is out of the viewport on the left side
        if (tooltipLeft < 0) {
          tooltipLeft = 10; // Adjust to be slightly inside the viewport
        }

        // Check if the tooltip is out of the viewport on the right side
        if (tooltipLeft + textWidth > window.innerWidth) {
          tooltipLeft = window.innerWidth - textWidth - 10; // Adjust to be slightly inside the viewport
        }

        // Apply the calculated positions
        text.style.top = `${tooltipTop}px`;
        text.style.left = `${tooltipLeft}px`;
      }
    },
  }
</script>


<template>

  <div class="tooltip" :ref="'tooltipicon-'+customId" @mouseenter="handleToolTipText(customId, $event)">
    <BadgeCheckIcon v-if="checkIconDisplay('BadgeCheckIcon')"></BadgeCheckIcon>
    <EurocointIcon v-else-if="checkIconDisplay('EurocointIcon')"></EurocointIcon>
    <BankhouseIcon v-else-if="checkIconDisplay('BankhouseIcon')"></BankhouseIcon>
    <NonRenterIcon v-else-if="checkIconDisplay('NonRenterIcon')"></NonRenterIcon>
    <AlertIcon v-else-if="checkIconDisplay('AlertIcon')"></AlertIcon>
    <InfoIcon v-else-if="checkIconDisplay('InfoIcon')"></InfoIcon>
    <AutomaticSearchcriteriaIcon v-else-if="checkIconDisplay('AutomaticSearchcriteria')"></AutomaticSearchcriteriaIcon>
    <span v-else>
    {{ hoverText }}
    </span>
    <span class="tooltiptext" :ref="'tooltiptext-'+customId">{{ content }}</span>
  </div>

</template>


<style scoped>

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    opacity: 0;
    width: 150px;
    background-color: var(--light-gray);
    color: #fff;
    font-size: 14px;
    text-align: center;
    border-radius: 6px;
    padding: 5px 5px;
    box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
    -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
    -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);

    /* Position the tooltip */
    position: fixed;
    z-index: 1;
    transition: opacity 0.2s;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

</style>
