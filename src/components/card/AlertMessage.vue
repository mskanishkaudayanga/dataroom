<script>
  import SuccessIcon from '../icons/icon-success.vue'
  import WarningIcon from '../icons/icon-warning.vue'
  import InfoIcon from '../icons/icon-info.vue'

  export default {
    name: "AlertMessage",
    components: {SuccessIcon, WarningIcon, InfoIcon},
    props: {
      alertText: String,
      alertStatus: String
    }
  }
</script>


<template>

  <Transition name="fadein">

    <div class="alert-message" :class="alertStatus" v-if="alertStatus && alertText">

      <span v-if="alertStatus === 'success'">
        <SuccessIcon></SuccessIcon>
        <span v-html="alertText"></span>
      </span>
      <span v-else-if="alertStatus === 'warning'">
        <WarningIcon></WarningIcon>
        <span v-html="alertText"></span>
      </span>
      <span v-else-if="alertStatus === 'info'">
        <InfoIcon></InfoIcon>
        <span v-html="alertText"></span>
      </span>

    </div>

  </Transition>

</template>


<style scoped>

.alert-message {
  text-align: center;
  padding: 10px 5px;
  text-transform: uppercase;
  font-size: 14px;
  border-radius: var(--border-radius);
}

.alert-message.success {
  background-color: rgba(69, 158, 77, 0.1);
  color: var(--green);
}

.alert-message.warning {
  background-color: rgba(217, 65, 57, 0.1);
  color: var(--red);
}

.alert-message.info {
  background-color: rgba(242, 144, 39, 0.1);
  color: var(--orange);
}

i {
  margin-right: 10px;
}


</style>
