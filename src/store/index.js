import Vue from 'vue';
import Vuex from 'vuex';
import cart from './cart';
import order from './order';
import products from './products';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cart,
    order,
    products,
  },
});
