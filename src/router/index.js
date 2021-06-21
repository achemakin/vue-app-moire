import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../pages/HomePage.vue';
import ProductPage from '../pages/ProductPage.vue';
import CartPage from '../pages/CartPage.vue';
import OrderPage from '../pages/OrderPage.vue';
import OrderInfoPage from '../pages/OrderInfoPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductPage,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
  },
  {
    path: '/order',
    name: 'order',
    component: OrderPage,
  },
  {
    path: '/order/:id',
    name: 'orderInfo',
    component: OrderInfoPage,
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFoundPage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
