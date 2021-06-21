<template>
  <ul class="breadcrumbs">
    <li class="breadcrumbs__item">
      <router-link
        class="breadcrumbs__link"
        :to="{name: 'home'}"
      >
        Каталог
      </router-link>
    </li>
    <li
      class="breadcrumbs__item"
      v-for="(item, index) in menuItems"
      :key="index"
    >
      <router-link
        class="breadcrumbs__link"
        :to="{name: item.name}"
      >
        {{item.title}}
      </router-link>
    </li>
    <li class="breadcrumbs__item">
      <a class="breadcrumbs__link">
        {{lastItem.title}}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BaseBreadcrumbs',
  props: ['items'],
  computed: {
    menuItems() {
      return this.items.slice(0, this.items.length - 1);
    },
    lastItem() {
      return this.items[this.items.length - 1];
    },
  },
};
</script>
