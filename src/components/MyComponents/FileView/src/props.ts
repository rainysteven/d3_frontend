import type { PropType } from 'vue';

const fileStructureTreeProps = {
  structureTreeApi: {
    type: Function as PropType<PromiseFn>,
    default: null,
    required: true,
  },
  strucutureTreeTitle: {
    type: String as PropType<String>,
    default: '',
  },
};

const fileTableProps = {
  tableApi: {
    type: Function as PropType<PromiseFn>,
    default: null,
    required: true,
  },
  tableColumns: {
    type: Function as PropType<Fn>,
    default: null,
    required: true,
  },
  tableFormConfig: {
    type: Function as PropType<Fn>,
    default: null,
    required: true,
  },
  tableTitle: {
    type: String as PropType<String>,
    default: '',
  },
};

const fileUploadProps = {
  showPreviewNumber: {
    type: Boolean as PropType<Boolean>,
    default: true,
  },
  uploadApi: {
    type: Function as PropType<PromiseFn>,
    default: null,
    required: true,
  },
  wsURL: {
    type: String as PropType<String>,
    required: true,
  },
};

export const fileViewProps = {
  ...fileStructureTreeProps,
  ...fileTableProps,
  ...fileUploadProps,
  viewURL: {
    type: String as PropType<String>,
    required: true,
  },
};
