<template>
  <div>
    Произошла ошибка загрузки
    <button @click.prevent="load">Попробовать еще раз</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorLoad',
  props: ['load'],
};
</script>
