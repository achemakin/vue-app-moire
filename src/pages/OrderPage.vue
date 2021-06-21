<template>
  <main class="content container">
    <div class="content__top">
      <BaseBreadcrumbs
        :items="[{
            name: 'cart',
            title: 'Корзина'
          },
          {
            title: 'Оформление заказа'
          }
        ]"
      />

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="order"
      >
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              title="ФИО"
              placeholder="Введите ваше полное имя"
              v-model="formData.name"
              :error="formError.name"
            />

            <BaseFormText
              title="Адрес доставки"
              placeholder="Введите ваш адрес"
              v-model="formData.address"
              :error="formError.address"
            />

            <BaseFormText
              title="Телефон"
              placeholder="Введите ваш телефон"
              type="tel"
              v-model="formData.phone"
              :error="formError.phone"
            />

            <BaseFormText
              title="Email"
              placeholder="Введи ваш Email"
              type="email"
              v-model="formData.email"
              :error="formError.email"
            />

            <BaseFormTextarea
              title="Комментарий к заказу"
              placeholder="Ваши пожелания"
              v-model="formData.comment"
              :error="formError.comment"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="item in orderDeliveries"
                :key="item.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="item.id"
                    v-model="currentDeliveryTypeId"
                  >
                  <span class="options__value">
                    {{item.title}} <b>{{item.price | numberFormat}} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="item in orderPayments"
                :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="item.id"
                    v-model="currentPaymentTypeId"
                  >
                  <span class="options__value">
                    {{item.title}}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <OrderCartBlock
          :items="cartProducts"
          :totalQuantity="totalQuantity"
          :totalPrice="cartTotalPrice"
          :deliveryPrice="deliveryPrice"
        >
          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </OrderCartBlock>

        <OrderError v-if="formErrorMessage" :error-title="formErrorMessage" />
      </form>
    </section>
  </main>
</template>

<script>
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs.vue';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import OrderCartBlock from '@/components/OrderCartBlock.vue';
import OrderError from '@/components/OrderError.vue';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { API_BASE_URL } from '../config';

export default {
  name: 'OrderPage',
  components: {
    BaseBreadcrumbs,
    BaseFormText,
    BaseFormTextarea,
    OrderCartBlock,
    OrderError,
  },
  data() {
    return {
      formData: {},
      formError: {},
      orderDeliveries: [],
      currentDeliveryTypeId: null,
      orderPayments: [],
      currentPaymentTypeId: null,
      formErrorMessage: '',
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      cartProducts: 'cartProducts',
      totalQuantity: 'cartTotalQuantity',
      cartTotalPrice: 'cartTotalPrice',
    }),
    deliveryPrice() {
      return this.currentDeliveryTypeId
        ? +this.orderDeliveries.find((i) => i.id === this.currentDeliveryTypeId).price
        : null;
    },
  },
  filters: {
    numberFormat,
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.loading = true;

      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
          deliveryTypeId: this.currentDeliveryTypeId,
          paymentTypeId: this.currentPaymentTypeId,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((res) => {
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', res.data);
          this.$router.push({ name: 'orderInfo', params: { id: res.data.id } });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        })
        .then(() => {
          this.loading = false;
        });
    },
    loadDeliveries() {
      axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((res) => {
          this.orderDeliveries = res.data;
          this.currentDeliveryTypeId = this.orderDeliveries[0].id;
        });
    },
    loadPayments() {
      axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: this.currentDeliveryTypeId ?? 1,
          },
        })
        .then((res) => {
          this.orderPayments = res.data;
          this.currentPaymentTypeId = this.orderPayments[0].id;
        });
    },
  },
  watch: {
    currentDeliveryTypeId() {
      this.loadPayments();
    },
  },
  created() {
    this.loadDeliveries();
    this.loadPayments();
  },
};
</script>
