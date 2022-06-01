import * as model from './model/sectionModel';
import { UploadApiResult } from './model/uploadModel';

import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';

enum Api {
  SectionFiles = '/api/sections/',
  SectionFilesStructureTree = '/api/sections_structureTree/',
  SectionNodes = '/api/sectionNodes/',
  SectionNodesCategories = '/api/sections/list_categories',
  SectionEdges = '/api/sectionEdges',
  UploadSectionFiles = 'http://localhost:8000/api/sections/',
}

export const getSectionFile = (id: number) =>
  defHttp.get<model.SectionFilesListGetResultModel>({ url: `${Api.SectionFiles}${id}/` });

export const getSectionFilesList = (params: model.SectionFilesListParams) =>
  defHttp.get<model.SectionFilesListGetResultModel>({ url: Api.SectionFiles, params });

export const isSectionFileExist = (input_name: string, is_delete = false) =>
  defHttp.get({ url: Api.SectionFiles, params: { input_name, is_delete } });

export const getSectionFilesStructureTreeList = (is_delete = false) =>
  defHttp.get<model.SectionFilesStructureTree>({
    url: Api.SectionFilesStructureTree,
    params: { is_delete },
  });

export const getSectionNodesList = (origin_file_id: number, is_delete = false) =>
  defHttp.get<model.SectionNodesListGetResultModel>({
    url: Api.SectionNodes,
    params: { origin_file_id, is_delete },
  });

export const getSectionNodesCategoriesList = (
  parent_pk: number,
  parent_file_exist = false,
  is_delete = false,
) =>
  defHttp.get<model.SectionNodesListGetResultModel>({
    url: Api.SectionNodesCategories,
    params: { parent_pk, parent_file_exist, is_delete },
  });

export const getSectionEdgesList = (origin_file_id: number, is_delete = false) =>
  defHttp.get<model.SectionEdgesListGetResultModel>({
    url: Api.SectionEdges,
    params: { origin_file_id, is_delete },
  });

export const uploadSectionFiles = function (
  params: any,
  uploadParams: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.UploadSectionFiles,
      params,
      onUploadProgress,
    },
    uploadParams,
  );
};
