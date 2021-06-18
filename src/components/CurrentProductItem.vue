<template>
  <section class="item">
    <div class="item__pics pics">
      <div class="pics__wrapper">
        <img
          width="570"
          height="570"
          :src="getImageFromColor"
          :alt="product.title"
        >
      </div>
      <ul class="pics__list">
        <li
          class="pics__item"
          v-for="(item, index) in product.colors[colorIndex].gallery"
          :key="index"
        >
          <a
            href="#"
            class="pics__link"
            :class="{'pics__link--current': index === imageIndex}"
            @click.prevent="imageIndex = index"
          >
            <img
              width="98"
              height="98"
              :src="item.file.url"
              :alt="product.title"
            >
          </a>
        </li>
      </ul>
    </div>

    <div class="item__info">
      <span class="item__code">Артикул: {{product.id}}</span>
      <h2 class="item__title">
        {{product.title}}
      </h2>
      <div class="item__form">
        <form
          class="form"
          action="#"
          method="POST"
          @submit.prevent="addToCart"
        >
          <div class="item__row item__row--center">
            <div class="form__counter">
              <button
                type="button"
                aria-label="Убрать один товар"
                @click.prevent="changeAmount(false)"
              >
                <svg width="12" height="12" fill="currentColor">
                  <use xlink:href="#icon-minus"></use>
                </svg>
              </button>

              <input
                type="text"
                v-model.number="productAmount"
                name="count"
              >

              <button
                type="button"
                aria-label="Добавить один товар"
                @click.prevent="changeAmount()"
              >
                <svg width="12" height="12" fill="currentColor">
                  <use xlink:href="#icon-plus"></use>
                </svg>
              </button>
            </div>

            <b class="item__price">
              {{product.price | numberFormat}} ₽
            </b>
          </div>

          <div class="item__row">
            <fieldset class="form__block">
              <legend class="form__legend">Цвет</legend>
              <ul class="colors colors--black">
                <li
                  class="colors__item"
                  v-for="(item, index) in product.colors"
                  :key="index"
                >
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
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
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">Размер</legend>
              <label class="form__label form__label--small form__label--select">
                <select
                  class="form__select"
                  type="text"
                  name="category"
                  v-model="sizeIndex"
                >
                  <option
                    v-for="(item, index) in product.sizes"
                    :key="item.id"
                    :value="index"
                  >
                    {{item.title}}
                  </option>
                </select>
              </label>
            </fieldset>
          </div>

          <button class="item__button button button--primery" type="submit">
            <PreloaderForButton v-if="productAddSending" />
            <span v-else>В корзину</span>
          </button>

          <div v-if="productAdded">Товар успешно добавлен в корзину</div>
          <div v-if="productAddError">
            Произошла ошибка загрузки товара в корзину, попробуйте еще раз.
          </div>
        </form>
      </div>
    </div>

    <div class="item__desc">
      <ul class="tabs">
        <li class="tabs__item">
          <a
            href="#"
            class="tabs__link"
            :class="{'tabs__link--current': itemProperty === 'productInfo'}"
            @click.prevent="itemProperty = 'productInfo'"
          >
            Информация о товаре
          </a>
        </li>
        <li class="tabs__item">
          <a
            href="#"
            class="tabs__link"
            :class="{'tabs__link--current': itemProperty === 'delivery'}"
            @click.prevent="itemProperty = 'delivery'"
          >
            Доставка и возврат
          </a>
        </li>
      </ul>

      <div class="item__content" v-show="itemProperty === 'productInfo'">
        <h3>Состав:</h3>

        <ul>
          <li v-for="item in product.materials" :key="item.id">
            {{item.title}}
          </li>
        </ul>

        <h3>Уход:</h3>

        <p>
          Машинная стирка при макс. 30ºC короткий отжим<br>
          Гладить при макс. 110ºC<br>
          Не использовать машинную сушку<br>
          Отбеливать запрещено<br>
          Не подвергать химчистке<br>
        </p>
      </div>

      <div class="item__content" v-show="itemProperty === 'delivery'">
        <h3>Доставка:</h3>

        <p>
          <ol>
            <li v-for="item in productDeliveries" :key="item.id">
              {{item.title}} - {{item.price | numberFormat}} ₽
            </li>
          </ol>
        </p>

        <h3>Возврат:</h3>

        <p>
          Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
          Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране,
          в которой Вы осуществили покупку. БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
          Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов,
          позвоните по телефону 8 800 600 90 09<br>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import PreloaderForButton from '@/components/PreloaderForButton.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  name: 'CurrentProductItem',
  props: ['product', 'productDeliveries'],
  components: { PreloaderForButton },
  data() {
    return {
      productAmount: 1,
      itemProperty: 'productInfo',

      colorIndex: 0,
      imageIndex: 0,
      sizeIndex: 0,

      productAdded: false,
      productAddSending: false,
      productAddError: false,
    };
  },
  computed: {
    getImageFromColor() {
      const { gallery } = this.product.colors[this.colorIndex];
      if (gallery) {
        return gallery[this.imageIndex].file.url;
      }
      return '#';
    },
  },
  filters: {
    numberFormat,
  },
  methods: {
    ...mapActions(['addProductToCart']),
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.productAddError = false;

      this.addProductToCart({
        productId: this.product.id,
        colorId: this.product.colors[this.colorIndex].color.id,
        sizeId: this.product.sizes[this.sizeIndex].id,
        quantity: this.productAmount,
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;

          // показывает надпись "Товар успешно добавлен в корзину" на 2 секунды
          setTimeout(() => {
            this.productAdded = false;
          }, 2000);
        })
        .catch(() => {
          this.productAddSending = false;
          this.productAddError = true;
        });
    },
    changeAmount(operation = true) {
      if (operation) {
        this.productAmount += 1;
      }

      if (!operation && this.productAmount > 1) {
        this.productAmount -= 1;
      }
    },
  },
};
</script>
