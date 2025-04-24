<script>

  export default {
    name: "Seperator",
    props: {
      text: {
        type: String,
        default: ''
      },
    },
  }
</script>


<template>

  <div class="seperator">
    <span>
      <slot></slot>
    </span>
  </div>

</template>


<style scoped>

.seperator {
  position: relative;
  width: 100%;
  text-align: center;
  margin: 25px 0;
}

.seperator > span {
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 10px 15px;
}

.seperator:after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 1px;
  background-color: var(--light-light-gray);
}

</style>
