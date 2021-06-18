<template>
  <main class="content container">
    <Preloader v-if="productLoading" />

    <ErrorLoad
      v-else-if="!productData"
      :load="loadProduct"
    />

    <div v-else>
      <div class="content__top">
        <BaseBreadcrumbs :items="[product.category.title, product.title]" />
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
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
  },
  methods: {
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((res) => {
          this.productData = res.data;
          this.productData.colors.forEach((element, index) => {
            if (!element.gallery) {
              this.productData.colors[index].gallery = [{ file: { url: '#' } }];
            }
            element.gallery.push(
              {
                file: { url: 'https://via.placeholder.com/570/0000FF/808080?text=Test_Image_1' },
              },
              {
                file: { url: 'https://via.placeholder.com/570/FFFF00/000000?text=Test_Image_2' },
              },
            );
          });
        })
        .catch(() => { this.productLoadingFailed = true; })
        .finally(() => { this.productLoading = false; });
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
