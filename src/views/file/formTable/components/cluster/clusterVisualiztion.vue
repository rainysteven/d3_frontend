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
      <CollapsePanel key="2" header="包查询">
        <TreeSelect
          v-model:value="selectedItem"
          :tree-data="treeData"
          style="width: 200px"
          :replace-fields="replaceFields"
        />
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, toRefs, watch, ref, reactive } from 'vue';
  import { Collapse, CollapsePanel, TreeSelect } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { drawChart, drawLegend } from './index';
  export default defineComponent({
    name: 'ClusterVisualization',
    components: { Collapse, CollapsePanel, CaretRightOutlined, TreeSelect },
    props: {
      data: {
        type: Object,
      },
    },
    setup(props) {
      //TODO 导航切换data
      const selectedItem = ref<string>();
      const selectOptions = ref<string[]>([]);
      const replaceFields = {
        children: 'children',
        key: 'id',
        title: 'name',
        value: 'qualifiedName',
      };
      const collapseState = reactive({
        activeKey: 1,
        allowClear: true,
        expandIconPosition: 'right',
      });
      const node = ref();
      const treeData = ref();
      watch(
        () => props.data,
        () => {
          drawLegend();
          drawChart(props.data, node);
        },
      );
      // onMounted(() => {
      //   drawLegend();
      //   treeData.value = props.data.children;
      //   drawChart(props.data, node);
      // });
      return {
        ...toRefs(collapseState),
        replaceFields,
        selectedItem,
        selectOptions,
        treeData,
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
