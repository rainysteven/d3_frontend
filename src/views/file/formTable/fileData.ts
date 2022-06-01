import { isProjectFileExist } from '/@/api/file/file';
import { FormSchema } from '/@/components/Table';
export const fileFormSchema: FormSchema[] = [
  {
    field: 'input_name',
    label: '文件名',
    component: 'Input',
    helpMessage: ['文件名不能重复', '默认为上传文件名'],
    rules: [
      {
        required: false,
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            isProjectFileExist(value)
              .then((res) => {
                console.log(res);
                if (res.length !== 0) {
                  reject('文件名已重复');
                } else {
                  resolve();
                }
              })
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
  },
];
