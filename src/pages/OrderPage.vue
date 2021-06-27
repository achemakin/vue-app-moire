<template>
  <main class="content container">
    <div class="content__top">
      <BaseBreadcrumbs :items="linkItems" />

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
              placeholder="Иванов Иван Иванович"
              v-model="formData.name"
              :error="formError.name"
            />

            <BaseFormText
              title="Адрес доставки"
              placeholder="163000 г. Архангельск, ул. Я.Тимме, д.20, кв.5"
              v-model="formData.address"
              :error="formError.address"
            />

            <BaseFormText
              title="Телефон"
              placeholder="+79990900000"
              type="tel"
              v-model="formData.phone"
              :error="formError.phone"
            />

            <BaseFormText
              title="Email"
              placeholder="example@mail.ru"
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
import { mapGetters, mapActions } from 'vuex';

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
      linkItems: [
        { name: 'cart', title: 'Корзина' },
        { title: 'Оформление заказа' },
      ],
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
    ...mapActions({
      addOrder: 'addOrder',
      getDeliveries: 'getDeliveries',
      getPayments: 'getPayments',
    }),
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.loading = true;

      this.addOrder({
        ...this.formData,
        deliveryTypeId: this.currentDeliveryTypeId,
        paymentTypeId: this.currentPaymentTypeId,
      })
        .then((data) => {
          this.$router.push({ name: 'orderInfo', params: { id: data.id } });
        })
        .catch((error) => {
          this.formError = error.request || {};
          this.formErrorMessage = error.message;
        })
        .then(() => {
          this.loading = false;
        });
    },
    loadDeliveries() {
      this.getDeliveries()
        .then((data) => {
          this.orderDeliveries = data;
          this.currentDeliveryTypeId = this.orderDeliveries[0].id;
        });
    },
    loadPayments() {
      this.getPayments(this.currentDeliveryTypeId)
        .then((data) => {
          this.orderPayments = data;
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
