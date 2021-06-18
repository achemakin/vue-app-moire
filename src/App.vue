<template>
  <div>
    <Header />

    <router-view />

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'App',
  components: { Header, Footer },
  methods: {
    ...mapMutations(['updateUserAccessKey']),
    ...mapActions(['loadCart']),
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');

    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }

    this.loadCart();
  },
};
</script>
