<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ pagination.total }} {{ declOfNum(pagination.total, ['товар', 'товара', 'товаров']) }}
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductsFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :colors-id.sync="filterColors"
        :materials-id.sync="filterMaterials"
        :seasons-id.sync="filterSeasons" />

      <section class="catalog">
        <Preloader v-if="productsLoading" />

        <div v-if="productsLoadingFailed">
          Произошла ошибка загрузки товаров
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>

        <ul class="catalog__list" v-if="!productsLoading">
          <ProductItem v-for="product in products" :key="product.id" :product="product" />
        </ul>

        <BasePagination v-model="page" :pages="pagination.pages" />
      </section>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { page, limit, API_BASE_URL } from '@/config';
import declOfNum from '@/helpers/declOfNum';
import ProductItem from '@/components/ProductItem.vue';
import Preloader from '@/components/Preloader.vue';
import BasePagination from '../components/BasePagination.vue';
import ProductsFilter from '../components/ProductsFilter.vue';

export default {
  components: {
    ProductItem,
    BasePagination,
    ProductsFilter,
    Preloader,
  },
  data() {
    return {
      page,
      limit,
      productsData: null,

      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterMaterials: [],
      filterSeasons: [],
      filterColors: [],

      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData ? this.productsData.items : [];
    },
    pagination() {
      return this.productsData ? this.productsData.pagination : 0;
    },
  },
  methods: {
    declOfNum,
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            page: this.page,
            limit: this.limit,
            categoryId: this.filterCategoryId,
            materialIds: this.filterMaterials,
            seasonIds: this.filterSeasons,
            colorIds: this.filterColors,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
          },
        })
          .then((res) => {
            this.productsData = res.data;
          })
          .catch(() => { this.productsLoadingFailed = true; })
          .then(() => { this.productsLoading = false; });
      }, 0);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    limit() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterMaterials() {
      this.loadProducts();
    },
    filterSeasons() {
      this.loadProducts();
    },
    filterColors() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
