<template>
  <main class="content container" v-if="order">
    <div class="content__top">
      <h1 class="content__title">
        Заказ оформлен <span>№ {{order.id}}</span>
      </h1>
    </div>

    <section class="cart">
      <div class="cart__form form">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина.
            На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <OrderInfoDictionary
              title="Получатель"
              :value="order.name"
            />

            <OrderInfoDictionary
              title="Адрес доставки"
              :value="order.address"
            />

            <OrderInfoDictionary
              title="Телефон"
              :value="order.phone"
            />

            <OrderInfoDictionary
              title="Email"
              :value="order.email"
            />

            <OrderInfoDictionary
              title="Способ оплаты"
              :value="order.paymentType"
            />
          </ul>
        </div>

        <OrderCartBlock
          :items="order.basket.items"
          :totalQuantity="totalQuantity"
          :totalPrice="order.totalPrice"
          :deliveryPrice="+order.deliveryType.price"
        />
      </div>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderInfoDictionary from '@/components/OrderInfoDictionary.vue';
import OrderCartBlock from '@/components/OrderCartBlock.vue';

export default {
  name: 'OrderInfo',
  components: { OrderInfoDictionary, OrderCartBlock },
  computed: {
    ...mapGetters({ order: 'orderInfo', totalQuantity: 'orderTotalQuantity' }),
  },
  created() {
    if (this.$store.orderInfo && this.$store.orderInfo.id === this.$route.params.id) {
      return;
    }

    this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  },
};
</script>
