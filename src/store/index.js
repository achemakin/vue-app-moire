import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProducts(state, item) {
      state.cartProducts = item;
    },
  },
  actions: {
    loadCart(context) {
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((res) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', res.data.user.accessKey);
            context.commit('updateUserAccessKey', res.data.user.accessKey);
          }

          context.commit('updateCartProducts', res.data.items);
        });
    },
    addProductToCart(context, {
      productId,
      colorId,
      sizeId,
      quantity,
    }) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          colorId,
          sizeId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((res) => {
          context.commit('updateCartProducts', res.data.items);
        });
    },
  },
  getters: {
    cartTotalQuantity(state) {
      return state.cartProducts
        .reduce((acc, item) => item.quantity + acc, 0);
    },
  },
});
