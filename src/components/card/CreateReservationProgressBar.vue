<script>
  import CheckmarkIcon from "../icons/icon-checkmark.vue";

  export default {
    name: "CreateReservationProgressBar",
    components: {CheckmarkIcon},
    props: {
      currentStep: Number,
      maxSteps: Number
    },
    data() {
      return{
        stepProcessWidth: 0,
      }
    },
    mounted() {
      this.getProcessWidth();
    },
    updated() {
      this.getProcessWidth();
    },
    methods: {
      getProcessWidth() {
        let firstCircle = this.$refs.stepCircle1[0].getBoundingClientRect().left;
        let currentCircle = this.$refs['stepCircle'+this.currentStep][0].getBoundingClientRect().left;
        // 25 for the half of a circle to fit the center of it
        this.stepProcessWidth = (currentCircle - firstCircle);
      }
    }
  }
</script>


<template>

  <div class="steps-wrapper" :style="{ '--pseudoWidthSteps':stepProcessWidth+'px'}">

    <div class="step-item" :class="{ current: currentStep === steps, finished: currentStep > steps }" v-for="steps in maxSteps">

      <div class="circle" :ref="'stepCircle'+steps">
        <CheckmarkIcon v-if="currentStep > steps"></CheckmarkIcon>
      </div>

    </div>

  </div>

</template>


<style scoped>


.steps-wrapper {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.steps-wrapper::before,
.steps-wrapper::after{
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  height: 2px;
  background-color: var(--light-gray);
}

.steps-wrapper::before {
  width: 100%;
}

.steps-wrapper::after {
  width: var(--pseudoWidthSteps);
  background-color: var(--blue);
  left: 0%;
  transform: translate(0%, -50%);
  transition: width 0.2s;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border: solid 2px var(--light-gray);
  background: white;
}

.step-item.current .circle,
.step-item.finished .circle {
  position: relative;
  border-color: var(--blue);
  z-index: 1;
  transition: all 0.4s;
}

.step-item.current .circle:before {
  content: '';
  width: 10px;
  height: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--blue);
  border-radius: 100%;
  transition: all 0.2s;
}

.step-item.finished .circle {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  background-color: var(--blue);
}


</style>
