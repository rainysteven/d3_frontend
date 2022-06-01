<template>
  <div>
    <a-button-group>
      <a-button type="primary" @click="openUploadModal" preIcon="carbon:cloud-upload">
        {{ t('component.ProjectFileUpload.upload') }}
      </a-button>
      <Tooltip placement="bottom" v-if="showPreview">
        <template #title>
          {{ t('component.ProjectFileUpload.uploaded') }}
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="bi:eye" />
          <template v-if="fileList.length && showPreviewNumber">
            {{ fileList.length }}
          </template>
        </a-button>
      </Tooltip>
    </a-button-group>

    <UploadModal
      v-bind="bindValue"
      :previewFileList="fileList"
      @register="registerUploadModal"
      @insert="handleInsert"
      @change="handleChange"
      @delete="handleDelete"
      @reload="handleReload"
    />

    <UploadPreviewModal
      :force-render="forceRender"
      :value="fileList"
      @register="registerPreviewModal"
      @list-change="handlePreviewChange"
      @delete="handlePreviewDelete"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, unref, computed } from 'vue';
  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';
  import { Icon } from '/@/components/Icon';
  import { Tooltip } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { uploadContainerProps } from './props';
  import { omit } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';
  import { PreviewFileItem } from './typing';

  export default defineComponent({
    name: 'BasicUpload',
    components: { UploadModal, UploadPreviewModal, Icon, Tooltip },
    props: uploadContainerProps,
    emits: ['change', 'delete', 'preview-delete', 'reload', 'update:value'],

    setup(props, { emit, attrs }) {
      const { t } = useI18n();
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();

      //   预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

      const fileList = ref<string[]>([]);
      const taskList: PreviewFileItem[] = [];
      const taskIndex = {};
      const forceRender = ref(true);

      const showPreview = computed(() => {
        const { emptyHidePreview } = props;
        if (!emptyHidePreview) return true;
        return emptyHidePreview ? fileList.value.length > 0 : true;
      });

      const bindValue = computed(() => {
        const value = { ...attrs, ...props };
        return omit(value, 'onChange');
      });

      watch(
        () => props.value,
        (value = []) => {
          fileList.value = isArray(value) ? value : [];
        },
        { immediate: true },
      );

      function handleInsert(item: PreviewFileItem) {
        taskList.push(item);
        taskIndex[item.id] = taskList.length - 1;
        changeFileList();
      }

      // 上传modal保存操作
      function handleChange(item) {
        const temp = taskList[taskIndex[item.id]];
        temp.percent = item.percent;
        temp.uploadStatus = item.uploadStatus;
        taskList[taskIndex[item.id]] = temp;
        changeFileList();
      }

      function changeFileList() {
        fileList.value = taskList.map((e) => JSON.stringify(e));
        emit('update:value', fileList.value);
        emit('change', fileList.value);
      }

      // 预览modal保存操作
      function handlePreviewChange(urls: string[]) {
        fileList.value = [...(urls || [])];
        emit('update:value', fileList.value);
        emit('change', fileList.value);
      }

      function handleDelete(record: Recordable) {
        emit('delete', record);
      }

      function handlePreviewDelete(url: string) {
        emit('preview-delete', url);
      }

      function handleReload() {
        emit('reload');
      }

      return {
        registerUploadModal,
        openUploadModal,
        handleChange,
        handleInsert,
        handlePreviewChange,
        registerPreviewModal,
        openPreviewModal,
        fileList,
        forceRender,
        showPreview,
        bindValue,
        handleDelete,
        handlePreviewDelete,
        handleReload,
        t,
      };
    },
  });
</script>
