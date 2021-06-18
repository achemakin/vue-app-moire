<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.color.gallery[0].file.url"
        width="120"
        height="120"
        alt="item.product.title"
      >
    </div>
    <h3 class="product__title">
      {{item.product.title}}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{'background-color': item.color.color.code}"></i>
        {{item.color.color.title}}
      </span>
    </p>
    <span class="product__code">
      Артикул: {{item.product.id}}
    </span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click.prevent="changeQuantity(false)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input
        type="text"
        name="count"
        v-model.number="quantity"
      >

      <button
        type="button"
        aria-label="Добавить один товар"
        @click.prevent="changeQuantity()"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{item.quantity * item.price | numberFormat}} ₽
    </b>

    <div v-if="deletingProductCart">Продукт удаляется</div>

    <button
      class="product__del button-del"
      type="button" aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.id)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'CartItem',
  props: ['item'],
  data() {
    return {
      deletingProductCart: false,
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.updateQuantity({ itemId: this.item.id, quantity: value });
      },
    },
  },
  methods: {
    ...mapActions({
      deleteCartProduct: 'deleteCartProduct',
      updateQuantity: 'updateCartProductQuantity',
    }),
    deleteProduct(itemId) {
      this.deletingProductCart = true;
      this.deleteCartProduct(itemId)
        .then(() => {
          this.deletingProductCart = false;
        });
    },
    changeQuantity(sub = true) {
      const quantity = sub ? this.item.quantity + 1 : this.item.quantity - 1;
      if (quantity >= 1) {
        this.updateQuantity({ itemId: this.item.id, quantity });
      } else {
        this.item.quantity = 1;
      }
    },
  },
};
</script>
