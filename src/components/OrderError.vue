<template>
  <div class="cart__error form__error-block">
    <h4>Заявка не отправлена!</h4>
    <p>
      {{errorTitle}}. Попробуйте отправить снова или перезагрузите страницу.
    </p>
  </div>
</template>

<script>
export default {
  name: 'OrderError',
  props: ['errorTitle'],
};
</script>
