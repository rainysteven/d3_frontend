import { h } from 'vue';
import { Icon } from '/@/components/Icon';
import { BasicColumn, FormProps, FormSchema } from '/@/components/Table';
import { GMTToStr } from '/@/utils/dateUtils';

type TableDataType = {
  file_name: string;
  file_extension: string;
  file_type: number;
  timestamp: Date;
};

const file_type_object = {
  0: '结构文件',
  1: '统计文件',
  2: '依赖文件',
};

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '文件名称',
      dataIndex: 'file_name',
      width: 200,
    },
    {
      title: '文件类型',
      width: 100,
      dataIndex: 'file_extension',
    },
    {
      title: '文件类别',
      width: 100,
      dataIndex: 'file_type',
      customRender: function (object) {
        return file_type_object[object.text];
      },
    },
    {
      title: '是否解析',
      dataIndex: 'status',
      width: 75,
      customRender: ({ record }) => {
        return record.status === null
          ? null
          : record.file_type !== 0
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
