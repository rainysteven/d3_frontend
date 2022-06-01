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
        <CatelogueVisualization :data="datas" />
      </template>
      <template v-if="currentKey == 'catelogueCirclePack'">
        <CatelogueCirclePack :data="treeData" />
      </template>
      <template v-if="currentKey == 'catelogueTreeMap'">
        <CatelogueTreeMap :data="treeData" />
      </template>
      <template v-if="currentKey == 'cluster'">
        <div v-for="i in 10" :key="i">这是用户{{ fileName }}操作日志Tab</div>
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
  import { getCatalogueDatasList, getCatalogueTreeMapDatas } from '/@/api/file/catelogueData';
  import CatelogueVisualization from './components/catelogue/catelogueVisualization.vue';
  import CatelogueTreeMap from './components/catelogue/catelogueTreeMap.vue';
  import CatelogueCirclePack from './components/catelogue/catelogueCirclePack.vue';
  export default defineComponent({
    name: 'FileVisualization',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      CatelogueVisualization,
      CatelogueCirclePack,
      CatelogueTreeMap,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const fileId = ref(route.params?.id);
      const fileName = ref('');
      const currentKey = ref('catelogueCirclePack');
      const { setTitle } = useTabs();
      const datas = ref();
      const treeData = ref();

      // 设置Tab的标题（不会影响页面标题）
      setTitle('文件数据可视化');

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/fileManager/formTable');
      }

      onMounted(() => {
        // getProjectFile(fileId.value).then((res) => {
        //   fileName.value = res.input_name;
        //   return {
        //     fileName,
        //   };
        // });
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
      });

      return { fileName, datas, currentKey, goBack, treeData };
    },
  });
</script>

<style></style>
