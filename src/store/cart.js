import axios from 'axios';
import { API_BASE_URL } from '../config';

export default {
  state: {
    cartProducts: [],
    userAccessKey: null,
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProducts(state, items) {
      state.cartProducts = items;
    },
    deleteCartProduct(state, itemId) {
      state.cartProducts = state.cartProducts.filter((item) => item.id !== itemId);
    },
    resetCart(state) {
      state.cartProducts = [];
    },
    updateCartProductQuantity(state, { itemId, quantity }) {
      const item = state.cartProducts.find((i) => i.id === itemId);

      if (item) {
        item.quantity = quantity;
      }
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
    deleteCartProduct(context, itemId) {
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            basketItemId: itemId,
          },
        })
        .then(() => {
          context.commit('deleteCartProduct', itemId);
        });
    },
    updateCartProductQuantity(context, { itemId, quantity }) {
      let response = null;

      if (quantity >= 1) {
        response = axios
          .put(`${API_BASE_URL}/api/baskets/products`, {
            basketItemId: itemId,
            quantity,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((res) => {
            context.commit('updateCartProducts', res.data.items);
          })
          .catch(() => null);
      }

      return response;
    },
  },
  getters: {
    cartProducts(state) {
      const products = state.cartProducts;

      products.forEach((element, index) => {
        if (!element.color.gallery) {
          products[index].color.gallery = [{
            file: {
              url: 'https://via.placeholder.com/570/0000FF/808080?text=Test_Image',
            },
          }];
        }
      });

      return products;
    },
    cartTotalQuantity(state) {
      return state.cartProducts
        .reduce((acc, item) => item.quantity + acc, 0);
    },
    cartTotalPrice(state) {
      return state.cartProducts
        .reduce((acc, item) => (item.price * item.quantity) + acc, 0);
    },
  },
};
