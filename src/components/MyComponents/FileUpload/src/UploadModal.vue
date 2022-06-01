<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.upload')"
    :okText="t('component.upload.save')"
    v-bind="$attrs"
    @register="register"
    @ok="handleOk"
    :closeFunc="handleCloseFunc"
    :maskClosable="false"
    :keyboard="false"
    wrapClassName="upload-modal"
    :okButtonProps="getOkButtonProps"
    :cancelButtonProps="{ disabled: isUploadingRef }"
  >
    <template #centerFooter>
      <a-button
        @click="handleStartUpload"
        color="success"
        :disabled="!getIsSelectFile"
        :loading="isUploadingRef"
      >
        {{ getUploadBtnText }}
      </a-button>
    </template>

    <div class="upload-modal-toolbar">
      <Alert :message="getHelpText" type="info" banner class="upload-modal-toolbar__text" />

      <Upload
        :accept="getStringAccept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        class="upload-modal-toolbar__btn"
      >
        <a-button type="primary">
          {{ t('component.upload.choose') }}
        </a-button>
      </Upload>
    </div>
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, computed, PropType } from 'vue';
  import { Upload, Alert } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  //   import { BasicTable, useTable } from '/@/components/Table';
  // hooks
  import { useUploadType } from './useUpload';
  import { useMessage } from '/@/hooks/web/useMessage';
  //   types
  import { FileItem, UploadResultStatus } from './typing';
  import { basicProps } from './props';
  import { createTableColumns, createActionColumn } from './data';
  // utils
  import { checkFileType } from './helper';
  import { buildUUID } from '/@/utils/uuid';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  import FileList from './FileList.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: { BasicModal, Upload, Alert, FileList },
    props: {
      ...basicProps,
      previewFileList: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      wsURL: {
        type: String as PropType<string>,
      },
    },
    emits: ['change', 'insert', 'register', 'delete', 'reload'],
    setup(props, { emit }) {
      const state = reactive<{ fileList: FileItem[] }>({
        fileList: [],
      });

      //   是否正在上传
      const isUploadingRef = ref(false);
      const fileListRef = ref<FileItem[]>([]);
      const { accept, helpText, maxNumber, maxSize } = toRefs(props);

      const { t } = useI18n();
      const [register, { closeModal }] = useModalInner();
      const { notification } = useMessage();
      const taskIndex = {};
      const taskList: string[] = [];

      const { getAccept, getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });

      const { createMessage } = useMessage();

      const getIsSelectFile = computed(() => {
        return (
          fileListRef.value.length > 0 &&
          !fileListRef.value.every((item) => item.status === UploadResultStatus.SUCCESS)
        );
      });

      const getOkButtonProps = computed(() => {
        const someSuccess = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.SUCCESS,
        );
        return {
          disabled: isUploadingRef.value || fileListRef.value.length === 0 || !someSuccess,
        };
      });

      const getUploadBtnText = computed(() => {
        const someError = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.ERROR,
        );
        return isUploadingRef.value
          ? t('component.ProjectFileUpload.tasking')
          : someError
          ? t('component.ProjectFileUpload.reTaskFailed')
          : t('component.ProjectFileUpload.startTask');
      });

      // 上传前校验
      function beforeUpload(file: File) {
        const { size, name } = file;
        const { maxSize } = props;
        const accept = unref(getAccept);
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }

        // 设置类型,则判断
        if (accept.length > 0 && !checkFileType(file, accept)) {
          createMessage.error!(t('component.upload.acceptUpload', [accept.join(',')]));
          return false;
        }
        const uuid = buildUUID();
        const commonItem = {
          uuid,
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };
        fileListRef.value = [...unref(fileListRef), commonItem];
        return false;
      }

      // 删除
      function handleRemove(record: FileItem) {
        const index = fileListRef.value.findIndex((item) => item.uuid === record.uuid);
        index !== -1 && fileListRef.value.splice(index, 1);
        emit('delete', record);
      }

      async function uploadApiByItem(item: FileItem) {
        const { api } = props;
        if (!api || !isFunction(api)) {
          return warn('upload api must exist and be a function');
        }
        try {
          item.status = UploadResultStatus.UPLOADING;
          const { data } = await props.api?.(
            {
              channel_id: item.uuid,
            },
            {
              data: {
                ...(props.uploadParams || {}),
              },
              file: item.file,
              name: props.name,
              filename: props.filename,
            },
            function onUploadProgress(progressEvent: ProgressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              item.percent = complete;
            },
          );
          item.status = UploadResultStatus.SUCCESS;
          item.responseData = data;
          createWebSocket(item);
          return {
            success: true,
            error: null,
          };
        } catch (e) {
          console.log(e);
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }

      // 点击开始上传
      async function handleStartUpload() {
        const { maxNumber } = props;
        if ((fileListRef.value.length + props.previewFileList?.length ?? 0) > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        try {
          isUploadingRef.value = true;
          // 只上传不是成功状态的
          const uploadFileList =
            fileListRef.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
          const data = await Promise.all(
            uploadFileList.map((item) => {
              return uploadApiByItem(item);
            }),
          );
          isUploadingRef.value = false;
          // 生产环境:抛出错误
          const errorList = data.filter((item: any) => !item.success);
          if (errorList.length > 0) throw errorList;
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }

      //   点击保存
      function handleOk() {
        const { maxNumber } = props;

        if (fileListRef.value.length > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        if (isUploadingRef.value) {
          return createMessage.warning(t('component.upload.saveWarn'));
        }
        const fileList: string[] = [];

        for (const item of fileListRef.value) {
          const { status, responseData, uuid } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            responseData.result['id'] = uuid;
            fileList.push(JSON.stringify(responseData.result));
          }
        }

        // 存在一个上传成功的即可保存
        if (fileList.length <= 0) {
          return createMessage.warning(t('component.upload.saveError'));
        }
        fileListRef.value = [];
        closeModal();
      }

      const createWebSocket = function (item: FileItem) {
        const server = `${props.wsURL}${item.uuid}/`;
        const socket = new WebSocket(server);
        socket.onopen = function () {
          const { status, responseData, uuid } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            const state = {
              id: uuid,
              percent: 0,
              uploadStatus: 'active',
            };
            emit('insert', { ...responseData.result, ...state });
          }
          console.log('浏览器WebSocket已打开');
        };
        socket.onmessage = function (msg) {
          const data = JSON.parse(msg['data'])['message'];
          // const value = JSON.parse(taskList[taskIndex[item.uuid]]);
          const state = {
            id: item.uuid,
            percent: data.percent,
            uploadStatus: data.uploadStatus,
          };
          switch (data['uploadStatus']) {
            case 'success':
              notification.success({
                message: `${item.name}上传成功`,
              });
              break;
            case 'error':
              notification.error({
                message: `${item.name}上传失败`,
              });
              break;
            case 'closed':
              socket.close();
              break;
            default:
              emit('change', state);
          }
        };
        socket.onclose = function () {
          emit('reload');
          console.log('WebSocket已关闭');
        };
        socket.onerror = function (event) {
          console.log(event);
        };
        return socket;
      };

      // 点击关闭：则所有操作不保存，包括上传的
      async function handleCloseFunc() {
        if (!isUploadingRef.value) {
          fileListRef.value = [];
          return true;
        } else {
          createMessage.warning(t('component.upload.uploadWait'));
          return false;
        }
      }

      return {
        columns: createTableColumns() as any[],
        actionColumn: createActionColumn(handleRemove) as any,
        register,
        closeModal,
        getHelpText,
        getStringAccept,
        getOkButtonProps,
        beforeUpload,
        // registerTable,
        fileListRef,
        state,
        isUploadingRef,
        handleStartUpload,
        handleOk,
        handleCloseFunc,
        getIsSelectFile,
        getUploadBtnText,
        t,
      };
    },
  });
</script>
<style lang="less">
  .upload-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }

    &-toolbar {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &__btn {
        margin-left: 8px;
        text-align: right;
        flex: 1;
      }
    }
  }
</style>
