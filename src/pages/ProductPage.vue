<template>
  <main class="content container">
    <Preloader v-if="productLoading" />

    <ErrorLoad
      v-else-if="!productData"
      :load="loadProduct"
    />

    <div v-else>
      <div class="content__top">
        <BaseBreadcrumbs :items="linkItems" />
      </div>

      <CurrentProductItem
        :product="product"
        :product-deliveries="productDeliveries"
      />
    </div>
  </main>
</template>

<script>
import Preloader from '@/components/Preloader.vue';
import ErrorLoad from '@/components/ErrorLoad.vue';
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs.vue';
import CurrentProductItem from '@/components/CurrentProductItem.vue';
import { mapActions } from 'vuex';

export default {
  name: 'ProductPage',
  components: {
    Preloader,
    ErrorLoad,
    BaseBreadcrumbs,
    CurrentProductItem,
  },
  data() {
    return {
      productData: null,
      productDeliveries: [],

      productLoading: false,
      productLoadingFailed: false,

    };
  },
  computed: {
    product() {
      return this.productData ?? [];
    },
    linkItems() {
      return [
        { name: 'home', title: this.product.category.title },
        { title: this.product.title },
      ];
    },
  },
  methods: {
    ...mapActions({
      getDeliveries: 'getDeliveries',
      getProduct: 'getProduct',
    }),
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      this.getProduct(this.$route.params.id)
        .then((data) => {
          this.productData = data;
        })
        .catch(() => { this.productLoadingFailed = true; })
        .finally(() => { this.productLoading = false; });
    },
    loadDeliveries() {
      this.getDeliveries()
        .then((data) => {
          this.productDeliveries = data;
        });
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
