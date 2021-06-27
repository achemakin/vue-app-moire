import axios from 'axios';
import { API_BASE_URL } from '../config';

export default {
  state: {
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.rootState.cart.userAccessKey,
          },
        })
        .then((res) => {
          context.commit('updateOrderInfo', res.data);
        });
    },
    addOrder(context, values) {
      return axios
        .post(`${API_BASE_URL}/api/orders`, { ...values }, {
          params: {
            userAccessKey: context.rootState.cart.userAccessKey,
          },
        })
        .then((res) => {
          context.commit('resetCart');
          context.commit('updateOrderInfo', res.data);
          return res.data;
        })
        .catch((error) => {
          throw (error.response.data.error);
        });
    },
    getDeliveries() {
      return axios
        .get(`${API_BASE_URL}/api/deliveries`)
        .then((res) => res.data);
    },
    getPayments(context, values) {
      return axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: values ?? 1,
          },
        })
        .then((res) => res.data);
    },
  },
  getters: {
    orderInfo(state) {
      return state.orderInfo;
    },
    orderTotalQuantity(state) {
      return state.orderInfo ? state.orderInfo.basket.items
        .reduce((acc, item) => item.quantity + acc, 0)
        : null;
    },
  },
};
