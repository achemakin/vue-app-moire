<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: {id: product.id}}">
      <img :src="getImageFromColor" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{ name: 'product', params: {id: product.id}}">
        {{product.title}}
      </router-link>
    </h3>

    <span class="catalog__price">
      {{product.price | numberFormat}} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="(item, index) in product.colors" :key="index">
        <label class="colors__label">
          <input class="colors__radio sr-only"
            type="radio"
            :value="index"
            v-model="colorIndex">
          <span class="colors__value" :style="{'background-color': item.color.code}">
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['product'],
  data() {
    return {
      colorIndex: 0,
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
};
</script>
