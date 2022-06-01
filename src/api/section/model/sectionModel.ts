import { BasicPageParams, BasicFetchResult } from '../../model/baseModel';

// 依赖切面文件模型

export interface SectionFilesListItem {
  id: number;
  input_name: string;
  input_file: string;
  input_type: number;
  input_version: string;
  timestamp: Date;
  is_delete: boolean;
}

export interface SectionNodesListItem {
  _id: number;
  isHonor: number;
  category: string;
  name: string;
  mode_type: string;
  accessibility: boolean;
  static: boolean;
  _global: boolean;
}

export interface SectionEdgesListItem {
  source: number;
  target: number;
  soureFile: string;
  sourcePackageName: string;
  sourceIsHonor: number;
  targetFile: string;
  targetPackageName: string;
  targetIsHonor: number;
  value: string;
  mode_type: string;
}

export type SectionFilesListParams = BasicPageParams & {
  is_delete: boolean;
};

export type SectionFilesListGetResultModel = BasicFetchResult<SectionFilesListItem>;

export interface SectionFilesStructureTree {
  id: number;
  file_name: string;
}

export type SectionFilesStructureTreeResultModel = BasicFetchResult<SectionFilesStructureTree>;

export type SectionNodesListParams = BasicPageParams & {
  origin_file_id: number;
  is_delete: boolean;
};

export type SectionNodesListGetResultModel = BasicFetchResult<SectionNodesListItem>;

export type SectionNodesCategoriesParams = BasicPageParams & {
  is_delete: boolean;
  parent_file_exist: boolean;
  parent_pk: number;
};

export type SectionEdgesListParams = BasicPageParams & {
  origin_file_id: number;
  is_delete: boolean;
};

export type SectionEdgesListGetResultModel = BasicFetchResult<SectionEdgesListItem>;
