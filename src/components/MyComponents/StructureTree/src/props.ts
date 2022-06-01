import type { PropType } from 'vue';

export const structureTreeProps = {
  api: {
    type: Function as PropType<PromiseFn>,
    default: null,
    required: true,
  },
  changed: {
    type: Boolean as PropType<Boolean>,
    default: false,
  },
  title: {
    type: String as PropType<String>,
    default: '',
  },
};
