<template>
  <BasicModal
    width="800px"
    :title="t('component.ProjectFileUpload.taskList')"
    wrapClassName="upload-preview-modal"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
  >
    <FileTable :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch, ref } from 'vue';
  import FileTable from './FileTable.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { previewProps } from './props';
  import { PreviewFileItem } from './typing';
  import { downloadByUrl } from '/@/utils/file/download';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';

  export default defineComponent({
    //TODO 第二次添加的时候避免重复添加websocket
    components: { BasicModal, FileTable },
    props: previewProps,
    emits: ['list-change', 'register', 'delete'],
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const { t } = useI18n();

      const fileListRef = ref<PreviewFileItem[]>([]);
      const processListRef = ref({});
      watch(
        () => props.value,
        (value) => {
          if (!isArray(value)) value = [];
          fileListRef.value = value.filter((item) => !!item).map((item) => JSON.parse(item));
        },
        { immediate: true },
      );

      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex((item) => item.url === record.url);
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].url);
          emit(
            'list-change',
            fileListRef.value.map((item) => item.url),
          );
        }
      }

      // 下载
      function handleDownload(record: PreviewFileItem) {
        const { url = '' } = record;
        downloadByUrl({ url });
      }

      return {
        t,
        register,
        closeModal,
        fileListRef,
        processListRef,
        columns: createPreviewColumns(),
        actionColumn: createPreviewActionColumn({ handleRemove, handleDownload }) as any,
      };
    },
  });
</script>
<style lang="less">
  .upload-preview-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
