<template>
  <div id="chart" style="width: 1440px; height: 768px"></div>
  <div class="panels">
    <Collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
      <template #expandIcon="{ isActive }">
        <CaretRightOutlined :rotate="isActive ? 90 : 0" />
      </template>
      <CollapsePanel key="1" header="包查询">
        <Select
          v-model:value="selectedItem"
          show-search
          placeholder="选择文件"
          style="width: 200px"
          :options="selectOptions"
          :allowClear="allowClear"
        />
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, watch, ref, reactive } from 'vue';
  import { Collapse, CollapsePanel, Select } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { drawChart, selectCallback } from './treeMap';
  export default defineComponent({
    name: 'CatelogueTreeMap',
    components: { Collapse, CollapsePanel, CaretRightOutlined, Select },
    props: {
      data: {
        type: Object,
      },
    },
    setup(props) {
      //TODO 导航切换data
      const { data } = toRefs(props);
      const selectedItem = ref<string>();
      const selectOptions = ref<string[]>([]);
      const collapseState = reactive({
        activeKey: 1,
        allowClear: true,
        expandIconPosition: 'right',
      });
      watch(data, () => {
        selectOptions.value = drawChart(data.value);
      });
      watch(selectedItem, () => {
        const mychart = selectCallback(selectedItem.value);
      });
      return {
        ...toRefs(collapseState),
        selectedItem,
        selectOptions,
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
