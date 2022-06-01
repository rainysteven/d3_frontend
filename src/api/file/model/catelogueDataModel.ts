import { BasicFetchResult } from '../../model/baseModel';

export interface SubCatelogueDatasListItem {
  name: string;
  changeLoc: number;
  color: string;
  value: number;
}

export interface CatelogueDatasListItem {
  id: number;
  name: string;
  children: SubCatelogueDatasListItem[];
  catelogue_type: number;
}

export interface CatelogueTreeMapDatas {
  tree_data: string;
}

export type CatelogueDatasListGetResultModel = BasicFetchResult<CatelogueDatasListItem>;

export type CatelogueTreeMapDatasGetResultModel = BasicFetchResult<CatelogueTreeMapDatas>;
