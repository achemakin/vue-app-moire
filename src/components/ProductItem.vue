<template>
  <li class="catalog__item">
    <router-link
      class="catalog__pic"
      :to="{ name: 'product', params: {id: product.id}}"
    >
      <img
        :src="getImageFromColor"
        :alt="product.title"
      >
    </router-link>

    <PreloaderForButton v-if="productAddSending" />

    <div class="catalog__error" v-else-if="productAddError">
      Произошла ошибка загрузки товара в корзину.
    </div>

    <div class="catalog__wrapper" v-else>
      <h3 class="catalog__title">
        <router-link :to="{ name: 'product', params: {id: product.id}}">
          {{product.title}}
        </router-link>
      </h3>
      <button
        class="catalog__cart"
        type="button"
        aria-label="Добавить товар в корзину"
        @click.prevent="addToCart"
      >
        <svg width="19" height="24">
          <use xlink:href="#icon-cart"></use>
        </svg>
      </button>
    </div>

    <span class="catalog__price">
      {{product.price | numberFormat}} ₽
    </span>

    <ul class="colors colors--black">
      <li
        class="colors__item"
        v-for="(item, index) in product.colors"
        :key="index"
      >
        <label class="colors__label">
          <input class="colors__radio sr-only"
            type="radio"
            :value="index"
            v-model="colorIndex"
          >
          <span
            class="colors__value"
            :style="{'background-color': item.color.code}"
          >
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import PreloaderForButton from '@/components/PreloaderForButton.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  name: 'ProductItem',
  props: ['product'],
  components: { PreloaderForButton },
  data() {
    return {
      colorIndex: 0,

      productAddSending: false,
      productAddError: false,
    };
  },
  computed: {
    getImageFromColor() {
      const { gallery } = this.product.colors[this.colorIndex];
      if (gallery) {
        return gallery[0].file.url;
      }
      return '#';
    },
  },
  filters: {
    numberFormat,
  },
  methods: {
    ...mapActions({
      addProductToCart: 'addProductToCart',
      getProduct: 'getProduct',
    }),
    addToCart() {
      this.productAddSending = true;
      this.productAddError = false;

      this.getProduct(this.product.id)
        .then((data) => {
          this.addProductToCart({
            productId: data.id,
            colorId: data.colors[this.colorIndex].color.id,
            sizeId: data.sizes[0].id,
            quantity: 1,
          });
        })
        .catch(() => {
          this.productAddError = true;
          // убирает сообщение с ошибкой
          setTimeout(() => {
            this.productAddError = false;
          }, 2000);
        })
        .finally(() => { this.productAddSending = false; });
    },
  },
};
</script>

<style>
.catalog__wrapper {
  display: flex;
  justify-content: space-between;
}

.catalog__item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.size-12 .catalog__pic {
  width: 100%;
  height: 250px;
}

.size-12 img {
  width: 100%;
  height: 250px;
}

.catalog__cart {
  margin-left: 40px;
  flex: 0 0 auto;
  align-self: start;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.catalog__error {
  color: red;
}

</style>
