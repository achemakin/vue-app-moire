<template>
  <ul class="catalog__pagination pagination">
          <li class="pagination__item">
            <a href="#"
              class="pagination__link pagination__link--arrow"
              :class="{'pagination__link--disabled': page === 1}"
              aria-label="Предыдущая страница"
              @click.prevent="arrow('left')"
            >
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-left"></use>
              </svg>
            </a>
          </li>

          <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
            <a href="#"
              class="pagination__link"
              :class="{'pagination__link--current': pageNumber === page}"
              @click.prevent="paginate(pageNumber)"
            >
              {{ pageNumber }}
            </a>
          </li>

          <li class="pagination__item">
            <a href="#"
              class="pagination__link pagination__link--arrow"
              :class="{'pagination__link--disabled': page === pages}"
              aria-label="Следующая страница"
              @click.prevent="arrow()"
            >
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </a>
          </li>
        </ul>
</template>

<script>
export default {
  name: 'BasePagination',
  model: {
    prop: 'page',
    event: 'paginate',
  },
  props: ['page', 'pages'],
  methods: {
    paginate(page) {
      this.$emit('paginate', page);
    },
    arrow(direction = 'right') {
      if (direction === 'left' && this.page > 1) {
        this.paginate(this.page - 1);
      }
      if (direction === 'right' && this.page < this.pages) {
        this.paginate(this.page + 1);
      }
    },
  },
};
</script>
