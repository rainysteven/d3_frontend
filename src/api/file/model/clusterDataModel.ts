import { BasicFetchResult } from '../../model/baseModel';

interface ClusterDatasFileListItem {
  name: string;
  relation: Object;
  color: string;
  value: number;
}

interface ClusterDatasTypeListItem {
  name: string;
  color: string;
  children: ClusterDatasFileListItem[];
}

interface ClusterDatasRootListItem {
  name: string;
  children: ClusterDatasTypeListItem[];
}

export type ClusterDatasListGetResultModel = BasicFetchResult<ClusterDatasRootListItem>;
