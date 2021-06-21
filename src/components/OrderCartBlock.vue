<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li
        class="cart__order"
        v-for="(item, index) in items"
        :key="index"
        :item="item"
      >
        <h3>{{item.product.title}}</h3>
        <b>{{item.quantity}} x {{item.price | numberFormat}} ₽</b>
        <span>Артикул: {{item.product.id}}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>Доставка:
        <b v-if="deliveryPrice === 0">Бесплатно</b>
        <b v-else>{{deliveryPrice | numberFormat}} ₽</b>
      </p>
      <p>Итого:
        <b>{{totalQuantity}}</b>
        {{declOfNum(totalQuantity, ['товар', 'товара', 'товаров'])}} на сумму
        <b>{{orderPrice | numberFormat}} ₽</b></p>
    </div>

    <slot />
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import declOfNum from '@/helpers/declOfNum';

export default {
  name: 'OrderCartBlock',
  props: ['items', 'totalQuantity', 'totalPrice', 'deliveryPrice'],
  filters: {
    numberFormat,
  },
  computed: {
    orderPrice() {
      return this.deliveryPrice + this.totalPrice;
    },
  },
  methods: {
    declOfNum,
  },
};
</script>
