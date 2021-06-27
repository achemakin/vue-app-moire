<template>
  <div class="preloader">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
  </div>
</template>

<script>
export default {
  name: 'PreloaderForButton',
};
</script>

<style scoped>
.preloader {
  text-align: center;
}
.item {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: #4b9cdb;
}
.preloader .item:nth-last-child(1) {
  animation: loading 1.5s 1s infinite;
}
.preloader .item:nth-last-child(2) {
  animation: loading 1.5s 0.5s infinite;
}
.preloader .item:nth-last-child(3) {
  animation: loading 1.5s 0s infinite;
}
@keyframes loading {
  0% {
    width: 15px;
  }
  50% {
    width: 35px;
  }
  100% {
    width: 15px;
  }
}
</style>
