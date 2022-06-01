<template>
  <div id="chart" style="height: 768px"></div>
  <div class="panels">
    <Collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
      <template #expandIcon="{ isActive }">
        <CaretRightOutlined :rotate="isActive ? 90 : 0" />
      </template>
      <CollapsePanel key="1" header="树形结果" :force-render="forceRender">
        <div id="force" style="width: 310px; height: 250px"></div>
      </CollapsePanel>
      <CollapsePanel key="2" header="模式选择" :force-render="forceRender">
        <Select
          v-model:value="mode"
          show-search
          placeholder="-------"
          style="width: 200px"
          :options="modeData"
          :allowClear="allowClear"
        />
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script>
  import { defineComponent, toRefs, watch, ref, reactive } from 'vue';
  import { Collapse, CollapsePanel, Select } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { draw, getData } from './EChart';
  export default defineComponent({
    name: 'SectionChart',
    components: { Collapse, CollapsePanel, CaretRightOutlined, Select },
    props: {
      nodes: {
        type: Object,
      },
      edges: {
        type: Object,
      },
    },
    setup(props) {
      const { nodes, edges } = toRefs(props);
      const property = reactive({
        allowClear: true,
        activeKey: ['1'],
        expandIconPosition: 'right',
        forceRender: true,
      });
      const mode = ref();
      const modeData = ref();
      const sortNodes = ref();
      watch(edges, () => {
        const temp = getData(nodes.value);
        modeData.value = temp.modeData;
        sortNodes.value = temp.nodes;
        draw('', sortNodes.value, edges.value);
      });
      watch(mode, () => {
        draw(mode.value !== undefined ? mode.value : '', sortNodes.value, edges.value);
      });
      return {
        ...toRefs(property),
        mode,
        modeData,
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
