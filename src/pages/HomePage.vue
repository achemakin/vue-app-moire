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
        <div class="content__switch-limit">
          Количество карточек товара:
          <select
            name="limit"
            v-model="currentIndexLimit"
          >
            <option
              v-for="(item, index) in limit"
              :key="index"
              :value="index"
              :selected="index === currentIndexLimit"
            >
              {{item}}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="content__catalog">
      <ProductsFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :colors-id.sync="filterColors"
        :materials-id.sync="filterMaterials"
        :seasons-id.sync="filterSeasons"
      />

      <section class="catalog">
        <Preloader v-if="productsLoading" />

        <ErrorLoad
          v-else-if="productsLoadingFailed"
          :load="loadProducts"
        />

        <ul
          class="catalog__list"
          :class="{'size-12': limit[currentIndexLimit] >= 12}"
          v-else
        >
          <ProductItem
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </ul>

        <BasePagination
          v-model="page"
          :pages="pagination.pages"
        />
      </section>
    </div>
  </main>
</template>

<script>
import { page, limit } from '@/config';
import { mapActions } from 'vuex';
import declOfNum from '@/helpers/declOfNum';
import ProductItem from '@/components/ProductItem.vue';
import Preloader from '@/components/Preloader.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductsFilter from '@/components/ProductsFilter.vue';
import ErrorLoad from '@/components/ErrorLoad.vue';

export default {
  name: 'HomePage',
  components: {
    ProductItem,
    BasePagination,
    ProductsFilter,
    Preloader,
    ErrorLoad,
  },
  data() {
    return {
      page,
      limit,
      currentIndexLimit: 0,
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
    ...mapActions({ getProducts: 'getProducts' }),
    declOfNum,
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        this.getProducts({
          page: this.page,
          limit: this.limit[this.currentIndexLimit],
          categoryId: this.filterCategoryId,
          materialIds: this.filterMaterials,
          seasonIds: this.filterSeasons,
          colorIds: this.filterColors,
          minPrice: this.filterPriceFrom,
          maxPrice: this.filterPriceTo,
        })
          .then((data) => {
            this.productsData = data;
          })
          .catch(() => { this.productsLoadingFailed = true; })
          .finally(() => { this.productsLoading = false; });
      }, 0);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    currentIndexLimit() {
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

<style>
  .content__switch-limit {
    flex: 1 1 auto;
    text-align: end;
  }

  .catalog__list.size-12 {
    grid-template-columns: repeat(4, 200px);
  }
</style>
