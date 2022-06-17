<template>
  <PageWrapper :title="fileName" contentBackground @back="goBack">
    <template #extra>
      <a-button type="primary"> 导出数据 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="catelogue" tab="目录CirclePack" />
        <a-tab-pane key="catelogueCiclePack" tab="目录多层CirclePack" />
        <a-tab-pane key="catelogueTreeMap" tab="目录TreeMap" />
        <a-tab-pane key="cluster" tab="聚类可视化" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'catelogue'">
        <CatelogueVisualization :data="datas" :edges="edges" />
      </template>
      <template v-if="currentKey == 'catelogueCirclePack'">
        <CatelogueCirclePack :data="treeData" />
      </template>
      <template v-if="currentKey == 'catelogueTreeMap'">
        <CatelogueTreeMap :data="treeData" />
      </template>
      <template v-if="currentKey == 'cluster'">
        <ClusterVisualization :data="clusterData" />
      </template>
    </div>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Tabs } from 'ant-design-vue';
  import { getProjectFile } from '/@/api/file/file';
  import { getCatalogueDatasList, getCatalogueTreeMapDatas } from '/@/api/file/catelogueData';
  import { getClusterDatasList } from '/@/api/file/clusterData';
  import { getProjectFileEdgesList } from '/@/api/file/fileEdge';
  import CatelogueVisualization from './components/catelogue/catelogueVisualization.vue';
  import CatelogueTreeMap from './components/catelogue/catelogueTreeMap.vue';
  import CatelogueCirclePack from './components/catelogue/catelogueCirclePack.vue';
  import ClusterVisualization from './components/cluster/clusterVisualiztion.vue';
  export default defineComponent({
    name: 'FileVisualization',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      CatelogueVisualization,
      CatelogueCirclePack,
      CatelogueTreeMap,
      ClusterVisualization,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const fileId = ref(route.params?.id);
      const fileName = ref('');
      const currentKey = ref('catelogueTreeMap');
      const { setTitle } = useTabs();
      const clusterData = ref();
      const datas = ref();
      const treeData = ref();
      const edges = ref();

      // 设置Tab的标题（不会影响页面标题）
      setTitle('文件数据可视化');

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/fileManager/formTable');
      }

      onMounted(() => {
        getProjectFile(fileId.value).then((res) => {
          fileName.value = res.file_name;
          return {
            fileName,
          };
        });
        getCatalogueDatasList(fileId.value).then((res) => {
          datas.value = res[0];
          return {
            datas,
          };
        });
        getCatalogueTreeMapDatas(fileId.value).then((res) => {
          treeData.value = res[0];
          return {
            treeData,
          };
        });
        getClusterDatasList(fileId.value).then((res) => {
          clusterData.value = res[0];
          return {
            clusterData,
          };
        });
        getProjectFileEdgesList(fileId.value).then((res) => {
          edges.value = res;
          return {
            edges,
          };
        });
      });

      return { fileName, clusterData, currentKey, datas, edges, goBack, treeData };
    },
  });
</script>

<style></style>
