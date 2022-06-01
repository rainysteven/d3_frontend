<template>
  <PageWrapper :title="fileName" contentBackground @back="goBack">
    <template #extra>
      <a-button type="primary"> 导出数据 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="chord" tab="和弦图" />
        <a-tab-pane key="section" tab="弦图" />
        <a-tab-pane key="cluster" tab="切面图" />
        <a-tab-pane key="arc" tab="arc" />
        <a-tab-pane key="sunburst" tab="旭日图" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'chord'">
        <SectionChord :nodes="nodeDatas" :edges="edgeDatas" />
      </template>
      <template v-if="currentKey == 'section'">
        <SectionChart :nodes="nodeDatas" :edges="edgeDatas" />
      </template>
      <template v-if="currentKey == 'cluster'">
        <SectionD3Chart :nodes="nodeDatas" :edges="edgeDatas" />
      </template>
      <template v-if="currentKey == 'arc'">
        <SectionArc :nodes="nodeDatas" :edges="edgeDatas" />
      </template>
      <template v-if="currentKey == 'sunburst'">
        <SectionSunburst :nodes="nodeDatas" :edges="edgeDatas" />
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
  import {
    // getSectionFile,
    getSectionNodesList,
    getSectionEdgesList,
  } from '/@/api/section/section';
  import SectionChart from './components/sectionEChart.vue';
  import SectionD3Chart from './components/sectionD3.vue';
  import SectionArc from './components/sectionArc.vue';
  import SectionChord from './components/sectionChord.vue';
  import SectionSunburst from './components/sunburst.vue';
  export default defineComponent({
    name: 'SectionVisualization',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      SectionArc,
      SectionChart,
      SectionD3Chart,
      SectionChord,
      SectionSunburst,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到文件ID
      const fileId = ref(route.params?.id);
      const fileName = ref('');
      const currentKey = ref('sunburst');
      const { setTitle } = useTabs();
      const nodeDatas = ref();
      const edgeDatas = ref();

      // 设置Tab的标题（不会影响页面标题）
      setTitle('依赖切面可视化');

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/section/fileTable');
      }

      onMounted(() => {
        getSectionNodesList(fileId.value).then((res) => {
          nodeDatas.value = res;
          return {
            nodeDatas,
          };
        });
        getSectionEdgesList(fileId.value).then((res) => {
          edgeDatas.value = res;
          return {
            edgeDatas,
          };
        });
      });

      return { fileName, nodeDatas, edgeDatas, currentKey, goBack };
    },
  });
</script>

<style></style>
