<template>
<main class="content container">
    <div class="content__top">
      <BaseBreadcrumbs :items="[{title: 'Корзина'}]" />

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{totalQuantity}} {{declOfNum(totalQuantity, ['товар', 'товара', 'товаров'])}}
        </span>
      </div>
    </div>

    <section class="cart" v-if="totalQuantity">
      <form
        class="cart__form form"
        action="#"
        method="POST"
      >
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem
              v-for="item in cartProducts"
              :key="item.id"
              :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{cartTotalPrice | numberFormat}} ₽</span>
          </p>

          <router-link
            tag="button"
            class="cart__button button button--primery"
            type="submit"
            :to="{name: 'order'}">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs.vue';
import CartItem from '@/components/CartItem.vue';
import { mapGetters } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import declOfNum from '@/helpers/declOfNum';

export default {
  name: 'CartPage',
  components: { BaseBreadcrumbs, CartItem },
  computed: {
    ...mapGetters({
      cartProducts: 'cartProducts',
      totalQuantity: 'cartTotalQuantity',
      cartTotalPrice: 'cartTotalPrice',
    }),
  },
  methods: {
    declOfNum,
  },
  filters: {
    numberFormat,
  },
};
</script>
