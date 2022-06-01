import { BasicPageParams, BasicFetchResult } from '../../model/baseModel';

// 项目文件模型

export interface ProjectFilesListItem {
  id: number;
  file: string;
  file_name: string;
  file_extension: string;
  file_type: number;
  timestamp: Date;
  status: boolean;
  parent_file?: number;
}

export interface ProjectFilesStructureTree {
  id: number;
  file_name: string;
}

export type ProjectFilesListParams = BasicPageParams & {
  is_delete: boolean;
};

export type ProjectFilesListGetResultModel = BasicFetchResult<ProjectFilesListItem>;

export type ProjectFilesStructureTreeResultModel = BasicFetchResult<ProjectFilesStructureTree>;
