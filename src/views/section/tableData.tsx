import { h } from 'vue';
import { Icon } from '/@/components/Icon';
import { BasicColumn, FormProps, FormSchema } from '/@/components/Table';
import { GMTToStr } from '/@/utils/dateUtils';

type TableDataType = {
  id: number;
  input_name: string;
  input_type: number;
  mode_type: string;
  timestamp: Date;
};

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '输入文件',
      dataIndex: 'file_name',
      width: 200,
    },
    {
      title: '文件类别',
      width: 75,
      dataIndex: 'file_extension',
    },
    {
      title: '模式类别',
      dataIndex: 'mode_type',
      width: 175,
    },
    {
      title: '是否解析',
      dataIndex: 'status',
      width: 75,
      customRender: ({ record }) => {
        return record.status === null
          ? null
          : !record.end
          ? null
          : h(Icon, {
              icon: record.status ? 'ion:checkmark-circle' : 'ion:close-circle',
              color: record.status ? 'green' : 'red',
            });
      },
    },
    {
      title: '更新时间',
      width: 150,
      dataIndex: 'timestamp',
      format: (text: string, record: TableDataType, index: number) => {
        return GMTToStr(text);
      },
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
  ];
}

export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: any = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        component: 'Select',
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}
