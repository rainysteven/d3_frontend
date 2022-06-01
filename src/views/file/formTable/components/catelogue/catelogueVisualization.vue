<template>
  <div id="chart"></div>
  <div class="panels">
    <Collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
      <template #expandIcon="{ isActive }">
        <CaretRightOutlined :rotate="isActive ? 90 : 0" />
      </template>
      <CollapsePanel key="1" header="图例">
        <div id="legend"></div>
      </CollapsePanel>
      <CollapsePanel key="2" header="描述">
        <p>hello</p>
      </CollapsePanel>
      <CollapsePanel key="3" header="文件查询">
        <Select
          v-model:value="file"
          show-search
          placeholder="选择文件"
          style="width: 200px"
          :options="fileData"
          :allowClear="allowClear"
        />
        <Select
          v-model:value="category"
          placeholder="选择类别"
          style="width: 100px"
          :options="categories"
          :allowClear="allowClear"
        />
      </CollapsePanel>
      <CollapsePanel key="4" header="Clusters" :force-render="forceRender">
        <div id="clusters" style="width: 310px; height: 260px"></div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, watch, ref, reactive, onMounted } from 'vue';
  import { Collapse, CollapsePanel, Select } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { drawChart, drawLegend, drawRootClusters, drawNodeClusters, getData } from './index';
  export default defineComponent({
    name: 'CatelogueVisualization',
    components: { Collapse, CollapsePanel, CaretRightOutlined, Select },
    props: {
      data: {
        type: Object,
      },
    },
    setup(props) {
      //TODO 导航切换data
      const property = reactive({
        allowClear: true,
        forceRender: true,
      });
      const fileData = ref();
      const categoryData = ref();
      const file = ref();
      const category = ref('');
      const categories = ref();
      const searchBox = ref();
      const node = ref();
      watch(
        () => props.data,
        () => {
          [fileData.value, categoryData.value] = getData(props.data);
          drawLegend();
          drawRootClusters(props.data);
          searchBox.value = drawChart(props.data, node);
        },
      );
      watch(file, () => {
        category.value = '';
        categories.value =
          typeof file.value === 'undefined'
            ? []
            : categoryData.value[file.value].map((e) => ({ value: e }));
        searchBox.value(file.value);
      });
      watch(category, () => {
        if (category.value !== '') {
          searchBox.value(
            typeof category.value !== 'undefined' ? `${file.value}/${category.value}` : file.value,
          );
        }
      });
      watch(node, () => {
        if (node.value.height === 1) {
          drawNodeClusters(node.value);
        } else if (node.value.height === 2) {
          drawRootClusters(props.data);
        }
      });
      const activeKey = ref(['1']);
      const expandIconPosition = ref('right');
      onMounted(() => {
        [fileData.value, categoryData.value] = getData(props.data);
        drawLegend();
        drawRootClusters(props.data);
        searchBox.value = drawChart(props.data, node);
      });
      return {
        ...toRefs(property),
        file,
        fileData,
        category,
        categories,
        categoryData,
        activeKey,
        expandIconPosition,
      };
    },
  });
</script>

<style>
  .panels {
    position: fixed !important;
    bottom: 0;
    right: -20;
    width: 350px;
    max-height: calc(100vh - 2 * var(--stage-padding));
    overflow-y: auto;
    padding: var(--stage-padding);
    scrollbar-width: thin;
  }
</style>
