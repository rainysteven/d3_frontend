import * as model from './model/fileEdgeModel';

import { defHttp } from '/@/utils/http/axios';

enum Api {
  ProjectFileEdges = '/api/recordsEdges/',
}
export const getProjectFileEdgesList = (structure_file: number) =>
  defHttp.get<model.ProjectFileEdgesListGetResultModel>({
    url: Api.ProjectFileEdges,
    params: { structure_file },
  });
