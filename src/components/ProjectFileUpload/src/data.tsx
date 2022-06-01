import type { BasicColumn, ActionItem } from '/@/components/Table';
import { FileItem, UploadResultStatus } from './typing';
import { Progress, Tag, Tooltip } from 'ant-design-vue';
import TableAction from '/@/components/Table/src/components/TableAction.vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 文件上传列表
export function createTableColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'name',
      title: t('component.ProjectFileUpload.fileName'),
      align: 'left',
      customRender: ({ text, record }) => {
        const { percent, status: uploadStatus } = (record as FileItem) || {};
        let status: 'normal' | 'exception' | 'active' | 'success' = 'normal';
        if (uploadStatus === UploadResultStatus.ERROR) {
          status = 'exception';
        } else if (uploadStatus === UploadResultStatus.UPLOADING) {
          status = 'active';
        } else if (uploadStatus === UploadResultStatus.SUCCESS) {
          status = 'success';
        }
        return (
          <span>
            <p class="truncate mb-1" title={text}>
              {text}
            </p>
            <Progress percent={percent} size="small" status={status} />
          </span>
        );
      },
    },
    {
      dataIndex: 'size',
      title: t('component.ProjectFileUpload.fileSize'),
      width: 100,
      customRender: ({ text = 0 }) => {
        return text && (text / 1024).toFixed(2) + 'KB';
      },
    },
    // {
    //   dataIndex: 'type',
    //   title: '文件类型',
    //   width: 100,
    // },
    {
      dataIndex: 'status',
      title: t('component.ProjectFileUpload.fileStatue'),
      width: 120,
      customRender: ({ text }) => {
        if (text === UploadResultStatus.SUCCESS) {
          return <Tag color="green">{() => t('component.ProjectFileUpload.taskSuccess')}</Tag>;
        } else if (text === UploadResultStatus.ERROR) {
          return <Tag color="red">{() => t('component.ProjectFileUpload.taskError')}</Tag>;
        } else if (text === UploadResultStatus.UPLOADING) {
          return <Tag color="blue">{() => t('component.ProjectFileUpload.tasking')}</Tag>;
        }
        return text;
      },
    },
  ];
}
export function createActionColumn(handleRemove: Function): BasicColumn {
  return {
    width: 120,
    title: t('component.ProjectFileUpload.operating'),
    dataIndex: 'action',
    fixed: false,
    customRender: ({ record }) => {
      const actions: ActionItem[] = [
        {
          label: t('component.ProjectFileUpload.del'),
          color: 'error',
          onClick: handleRemove.bind(null, record),
        },
      ];
      return <TableAction actions={actions} outside={true} />;
    },
  };
}

// 文件预览列表
export function createPreviewColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'name',
      title: t('component.ProjectFileUpload.fileName'),
      align: 'left',
      customRender: ({ text, record }) => {
        const { percent, uploadStatus } = record;
        let content = '';
        let status: 'normal' | 'exception' | 'active' | 'success' = 'normal';
        if (uploadStatus === UploadResultStatus.ERROR) {
          status = 'exception';
        } else if (uploadStatus === UploadResultStatus.UPLOADING) {
          status = 'active';
          content = '读取中';
        } else if (uploadStatus === UploadResultStatus.SUCCESS) {
          status = 'success';
          content = '解析完成';
        }
        return (
          <span>
            {text}
            <Tooltip title={content}>
              <Progress percent={percent} size="small" status={status} successPercent={50} />
            </Tooltip>
          </span>
        );
      },
    },
    {
      dataIndex: 'type',
      title: t('component.ProjectFileUpload.fileType'),
      align: 'center',
      width: 75,
    },
  ];
}

export function createPreviewActionColumn({
  handleRemove,
  handleDownload,
}: {
  handleRemove: Fn;
  handleDownload: Fn;
}): BasicColumn {
  return {
    width: 160,
    title: t('component.ProjectFileUpload.operating'),
    dataIndex: 'action',
    fixed: false,
    customRender: ({ record }) => {
      const actions: ActionItem[] = [
        {
          label: t('component.ProjectFileUpload.del'),
          color: 'error',
          onClick: handleRemove.bind(null, record),
        },
        {
          label: t('component.ProjectFileUpload.download'),
          onClick: handleDownload.bind(null, record),
        },
      ];

      return <TableAction actions={actions} outside={true} />;
    },
  };
}
