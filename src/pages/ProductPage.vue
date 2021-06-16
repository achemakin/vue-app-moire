<template>
  <main class="content container" v-if="productLoading">
    <Preloader />
  </main>
  <main class="content container" v-else-if="!productData">
    Произошла ошибка загрузки товаров
    <button @click.prevent="loadProduct">Попробовать еще раз</button>
  </main>

  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'home'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'home'}">
            {{product.category.title}}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{product.title}}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="getImageFromColor"
            :alt="product.title">
        </div>
        <ul class="pics__list">
          <li
            class="pics__item"
            v-for="(item, index) in product.colors[colorIndex].gallery" :key="index">
            <a
              href="#"
              class="pics__link"
              :class="{'pics__link--current': index === imageIndex}"
              @click.prevent="imageIndex = index">
              <img
                width="98"
                height="98"
                :src="item.file.url"
                :alt="product.title">
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
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button
                  type="button"
                  aria-label="Убрать один товар"
                  @click.prevent="changeAmount('-')">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount" name="count">

                <button
                  type="button"
                  aria-label="Добавить один товар"
                  @click.prevent="changeAmount()">
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
                  <li class="colors__item" v-for="(item, index) in product.colors" :key="index">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        :value="index"
                        v-model="colorIndex">
                      <span class="colors__value" :style="{'background-color': item.color.code}">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category" v-model="sizeIndex">
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
              <Preloader1 v-if="productAddSending" />
              <span v-else>В корзину</span>
            </button>

            <div v-show="productAdded">Товар успешно добавлен в корзину</div>
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
              @click.prevent="itemProperty = 'productInfo'">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a
              href="#"
              class="tabs__link"
              :class="{'tabs__link--current': itemProperty === 'delivery'}"
              @click.prevent="itemProperty = 'delivery'">
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
  </main>
</template>

<script>
import Preloader from '@/components/Preloader.vue';
import Preloader1 from '@/components/Preloader1.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default {
  components: { Preloader, Preloader1 },
  data() {
    return {
      productAmount: 1,
      productData: null,
      productDeliveries: [],
      itemProperty: 'productInfo',

      colorIndex: 0,
      imageIndex: 0,
      sizeIndex: 0,

      productLoading: false,
      productLoadingFailed: false,

      productAdded: false,
      productAddSending: false,
    };
  },
  computed: {
    product() {
      if (this.productData) {
        this.productData.colors.forEach((element) => {
          element.gallery.push(
            {
              file: { url: 'https://via.placeholder.com/570/0000FF/808080?text=Test_Image_1' },
            },
            {
              file: { url: 'https://via.placeholder.com/570/FFFF00/000000?text=Test_Image_2' },
            },
          );
        });

        return this.productData;
      }

      return [];
    },
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

      this.addProductToCart({
        productId: this.product.id,
        colorId: this.product.colors[this.colorIndex].color.id,
        sizeId: this.product.sizes[this.sizeIndex].id,
        quantity: this.productAmount,
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
          setTimeout(() => {
            this.productAdded = false;
          }, 2000);
        });
    },
    changeAmount(operation = '+') {
      if (operation === '+') {
        this.productAmount += 1;
      }

      if (operation === '-' && this.productAmount > 1) {
        this.productAmount -= 1;
      }
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((res) => { this.productData = res.data; })
        .catch(() => { this.productLoadingFailed = true; })
        .then(() => { this.productLoading = false; });
    },
    loadDeliveries() {
      axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((res) => { this.productDeliveries = res.data; });
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
        this.loadDeliveries();
      },
      immediate: true,
    },
  },
};
</script>
