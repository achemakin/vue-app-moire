import BaseFormField from '@/components/BaseFormField.vue';

export default {
  props: ['title', 'placeholder', 'value', 'error'],
  components: { BaseFormField },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
