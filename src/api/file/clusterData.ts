import * as model from './model/clusterDataModel';

import { defHttp } from '/@/utils/http/axios';

enum Api {
  ClusterDatas = '/api/clusters/',
}

export const getClusterDatasList = (structure_file: number) =>
  defHttp.get<model.ClusterDatasListGetResultModel>({
    url: Api.ClusterDatas,
    params: { structure_file },
  });
