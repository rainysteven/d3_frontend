import { BasicFetchResult } from '../../model/baseModel';

interface ProjectFileEdgesListItem {
  source: number;
  target: number;
  values: Object;
}
export type ProjectFileEdgesListGetResultModel = BasicFetchResult<ProjectFileEdgesListItem>;
