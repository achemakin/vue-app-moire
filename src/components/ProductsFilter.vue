<template>
  <aside class="filter">
    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          >
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          >
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{category.title}}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>

        <ul class="colors colors--black">
          <li
            class="colors__item"
            v-for="color in colors"
            :key="color.id"
          >
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="checkbox"
                name="colors[]"
                :value="color.id"
                v-model="currentColorsId"
              >
              <span
                class="colors__value"
                :style="{'background-color': color.code}"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in materials"
            :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="materials[]"
                :value="material.id"
                v-model="currentMaterialsId"
              >
              <span class="check-list__desc">
                {{material.title}}
                <span>({{material.productsCount}})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input class="check-list__check sr-only"
                type="checkbox"
                name="collections[]"
                :value="season.id"
                v-model="currentSeasonsId"
              >
              <span class="check-list__desc">
                {{season.title}}
                <span>({{season.productsCount}})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button
        class="filter__submit button button--primery"
        type="submit"
      >
        Применить
      </button>
      <button
        class="filter__reset button button--second"
        type="button"
        v-if="isActiveBtnReset"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductsFilter',
  props: ['priceFrom', 'priceTo', 'categoryId', 'colorsId', 'materialsId', 'seasonsId'],
  data() {
    return {
      currentPriceFrom: this.priceFrom,
      currentPriceTo: this.priceTo,
      currentCategoryId: this.categoryId,
      currentColorsId: this.colorsId,
      currentMaterialsId: this.materialsId,
      currentSeasonsId: this.seasonsId,

      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null,
    };
  },
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
    isActiveBtnReset() {
      const result = this.currentPriceFrom
       || this.currentPriceTo
       || this.currentCategoryId
       || this.currentColorsId.length
       || this.currentMaterialsId.length
       || this.currentSeasonsId.length;
      return result;
    },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorsId', this.currentColorsId);
      this.$emit('update:materialsId', this.currentMaterialsId);
      this.$emit('update:seasonsId', this.currentSeasonsId);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:colorsId', []);
      this.$emit('update:materialsId', []);
      this.$emit('update:seasonsId', []);

      this.currentPriceFrom = 0;
      this.currentPriceTo = 0;
      this.currentCategoryId = 0;
      this.currentColorsId = [];
      this.currentMaterialsId = [];
      this.currentSeasonsId = [];
    },
    ...mapActions({
      getCategories: 'getCategories',
      getColors: 'getColors',
      getMaterials: 'getMaterials',
      getSeasons: 'getSeasons',
    }),
    loadCategories() {
      this.getCategories()
        .then((data) => {
          this.categoriesData = data;
        });
    },
    loadColors() {
      this.getColors()
        .then((data) => {
          this.colorsData = data;
        });
    },
    loadMaterials() {
      this.getMaterials()
        .then((data) => {
          this.materialsData = data;
        });
    },
    loadSeasons() {
      this.getSeasons()
        .then((data) => {
          this.seasonsData = data;
        });
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
};
</script>
