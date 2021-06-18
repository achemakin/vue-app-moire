<template>
<div class="preloader">
  <div class="item item-1"></div>
  <div class="item item-2"></div>
  <div class="item item-3"></div>
  <div class="item item-4"></div>
  <div class="item item-5"></div>
</div>
</template>

<script>
export default {
  name: 'Preloader',
};
</script>

<style scoped>
.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  overflow: hidden;
  animation-delay: 1s;
}
.preloader .item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preloader .item::before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0.7;
  animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
  transition: 0.5s all ease;
  transform: scale(1);
}
.preloader .item-1 {
  background-color: #eed968;
}
.preloader .item-1:before {
  background-color: #eed968;
  animation-delay: 200ms;
}
.preloader .item-2 {
  background-color: #eece68;
}
.preloader .item-2:before {
  background-color: #eece68;
  animation-delay: 400ms;
}
.preloader .item-3 {
  background-color: #eec368;
}
.preloader .item-3:before {
  background-color: #eec368;
  animation-delay: 600ms;
}
.preloader .item-4 {
  background-color: #eead68;
}
.preloader .item-4:before {
  background-color: #eead68;
  animation-delay: 800ms;
}
.preloader .item-5 {
  background-color: #ee8c68;
}
.preloader .item-5:before {
  background-color: #ee8c68;
  animation-delay: 1000ms;
}
@keyframes scale {
  0% {
    transform: scale(1);
  }
  50%, 75% {
    transform: scale(2.5);
  }
  78%, 100% {
    opacity: 0;
  }
}
</style>
