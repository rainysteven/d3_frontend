import * as model from './model/fileModel';
import { UploadApiResult } from './model/uploadModel';

import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';

enum Api {
  ProjectFiles = '/api/records/',
  ProjectFilesStructureTree = '/api/records_structureTree/',
  UploadProjectFiles = 'http://localhost:8000/api/records/',
}

export const getProjectFile = (id: number) =>
  defHttp.get<model.ProjectFilesListGetResultModel>({ url: `${Api.ProjectFiles}${id}/` });

export const getProjectFilesList = (params: model.ProjectFilesListParams) =>
  defHttp.get<model.ProjectFilesListGetResultModel>({ url: Api.ProjectFiles, params });

export const isProjectFileExist = (file_name: string, is_delete = false) =>
  defHttp.get({ url: Api.ProjectFiles, params: { file_name, is_delete } });

export const getProjectFilesStructureTreeList = (is_delete = false, parent_file_exist = false) =>
  defHttp.get<model.ProjectFilesStructureTreeResultModel>({
    url: Api.ProjectFilesStructureTree,
    params: { is_delete, parent_file_exist },
  });
export const uploadProjectFiles = function (
  params: any,
  uploadParams: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.UploadProjectFiles,
      params,
      onUploadProgress,
    },
    uploadParams,
  );
};
