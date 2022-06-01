import * as model from './model/catelogueDataModel';

import { defHttp } from '/@/utils/http/axios';

enum Api {
  CatelogueDatas = '/api/catelogues/',
  CatelogueTreeMapDatas = '/api/catelogues/TreeMap',
}

export const getCatalogueDatasList = (structure_file: number, catelogue_type = 1) =>
  defHttp.get<model.CatelogueDatasListGetResultModel>({
    url: Api.CatelogueDatas,
    params: { catelogue_type, structure_file },
  });

export const getCatalogueTreeMapDatas = (structure_file: number) =>
  defHttp.get<model.CatelogueDatasListGetResultModel>({
    url: Api.CatelogueTreeMapDatas,
    params: { structure_file },
  });
