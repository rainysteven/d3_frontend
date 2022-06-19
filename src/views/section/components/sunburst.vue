<template>
  <template v-if="componentKey === 'd3'">
    <div id="chart"></div>
    <div class="panels">
      <Collapse v-model:activeKey="packageActiveKey" :expand-icon-position="expandIconPosition">
        <template #expandIcon="{ isActive }">
          <CaretRightOutlined :rotate="isActive ? 90 : 0" />
        </template>
        <CollapsePanel key="1" header="图例">
          <div id="legend"></div>
        </CollapsePanel>
        <template v-if="currentKey === 'package'">
          <CollapsePanel key="2" header="面包屑">
            <div id="breadCrumb"></div>
          </CollapsePanel>
          <CollapsePanel key="4" header="参数设置">
            <Row
              ><Col :span="15"><h4>结点展示是否受层次影响</h4></Col
              ><Col :span="9"
                ><Switch
                  v-model:checked="nodeCheckedValue"
                  checked-children="是"
                  un-checked-children="否"
                  @change="handleNodeCheckedChange" /></Col
            ></Row>
            <Row><h4>结点层次筛选</h4></Row>
            <Row>
              <Col :span="4">
                <h5>source</h5>
              </Col>
              <Col :span="6">
                <Select
                  v-model:value="source"
                  style="width: 100px; margin-left: 20px"
                  :options="sourceData"
                  @change="handleSourceChange"
                />
              </Col>
            </Row>
            <Row>
              <Col :span="4">
                <h5>target</h5>
              </Col>
              <Col :span="6">
                <Select
                  v-model:value="target"
                  style="width: 100px; margin-left: 20px"
                  :options="targetData"
                  @change="handleTargetChange"
                />
              </Col>
            </Row>
            <Row><h4>边出入度展示</h4></Row>
            <Row>
              <CheckboxGroup
                v-model:value="checkboxValue"
                :options="checkboxOptions"
                @change="handleCheckboxChange"
              />
            </Row>
            <Row
              ><Col :span="15">
                <Row><h4>边边框显示</h4></Row></Col
              ><Col :span="9"
                ><Switch
                  v-model:checked="edgeStrokeValue"
                  checked-children="是"
                  un-checked-children="否"
                  @change="handleEdgeStrokeChange" /></Col
            ></Row>
            <Row><h4>区域zoom</h4></Row>
            <Row>
              <Col :span="10"
                ><a-button :danger="buttonDanger" @click="handleClick">{{
                  buttonContent
                }}</a-button></Col
              >
              <Col :span="10"
                ><a-button :disabled="disabled" @click="zoomReset" type="primary"
                  >reset</a-button
                ></Col
              >
            </Row>
          </CollapsePanel>
        </template>
        <template v-if="currentKey === 'file'">
          <CollapsePanel key="2" header="文件选择">
            <Select
              v-model:value="fileType"
              placeholder="文件类型"
              style="width: 100px"
              :label-in-value="true"
              :options="fileTypes"
              @change="handleFileTypeChange"
            />
            <Select
              v-model:value="fileName"
              placeholder="文件名称"
              style="width: 200px"
              :options="fileNames"
              @change="handleFileNameChange"
            />
          </CollapsePanel>
          <CollapsePanel key="4" header="参数设置">
            <Row><h4>边出入度筛选</h4></Row>
            <Row>
              <CheckboxGroup
                v-model:value="fileEdgeValue"
                :options="fileEdgeOptions"
                @change="handleFileEdgeChange"
              />
            </Row>
            <Row><h4>文件关系筛选</h4></Row>
            <Row>
              <CheckboxGroup
                v-model:value="fileRelationValue"
                :options="fileRelationOptions"
                @change="handleFileRelationChange"
              />
            </Row> </CollapsePanel
        ></template>
        <CollapsePanel key="3" header="统计图" :force-render="true">
          <div id="count" style="width: 310px; height: 260px"></div>
        </CollapsePanel>
      </Collapse>
    </div>
  </template>
  <template v-if="componentKey === 'echarts'"
    ><SectionEChart :nodes="echartsNodes" :edges="echartsEdges"
  /></template>
</template>

<script>
  import { computed, defineComponent, reactive, onMounted, ref, toRefs, watch } from 'vue';
  import { CheckboxGroup, Col, Collapse, CollapsePanel, Row, Select, Switch } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { drawChart } from './sunburst';
  import SectionEChart from './sectionEChart.vue';
  export default defineComponent({
    name: 'SectionSunburst',
    components: {
      CheckboxGroup,
      Col,
      Collapse,
      CollapsePanel,
      CaretRightOutlined,
      Row,
      SectionEChart,
      Select,
      Switch,
    },
    props: {
      nodes: {
        type: Object,
      },
      edges: {
        type: Object,
      },
    },
    setup(props) {
      const checkboxGroupProps = reactive({
        checkboxValue: ['in', 'out'],
        checkboxOptions: [
          { label: '入度', value: 'in' },
          { label: '出度', value: 'out' },
        ],
        handleCheckboxChange: () => {},
        fileEdgeValue: ['in', 'out'],
        fileEdgeOptions: [
          { label: '入度', value: 'in' },
          { label: '出度', value: 'out' },
        ],
        handleFileEdgeChange: () => {},
        fileRelationValue: ['in_package', 'out_package', 'out_organization'],
        fileRelationOptions: [
          { label: '包内', value: 'in_package' },
          { label: '包外', value: 'out_package' },
          { label: '跨组织', value: 'out_organization' },
        ],
        handleFileRelationChange: () => {},
      });
      const collapseProps = reactive({
        allowClear: true,
        expandIconPosition: 'right',
        fileActiveKey: ['1'],
        forceRender: true,
        packageActiveKey: ['1', '2'],
      });
      const echartsProps = reactive({
        echartsNodes: [],
        echartsEdges: [],
      });
      const selectProps = reactive({
        fileName: '',
        fileNamesObject: {},
        fileType: { value: 'in_package' },
        fileTypes: [],
        handleFileNameChange: () => {},
        handleFileTypeChange: () => {},
      });
      const sourceProps = reactive({
        isChanged: true,
        source: '0',
        sourceData: [],
        sourceObject: [],
        target: '0',
        handleSourceChange: () => {},
        handleTargetChange: () => {},
      });
      const switchProps = reactive({
        edgeStrokeValue: false,
        nodeCheckedValue: false,
        handleNodeCheckedChange: () => {},
        handleEdgeStrokeChange: () => {},
      });
      const zoomProps = reactive({
        disabled: false,
        zoomAbled: () => {},
        zoomDisabled: () => {},
        zoomReset: () => {},
      });
      const componentKey = ref('d3');
      const currentKey = ref('package');
      const buttonContent = computed(() => (zoomProps.disabled ? '开启zoom' : '禁止zoom'));
      const buttonDanger = computed(() => !zoomProps.disabled);
      const handleClick = computed(() =>
        zoomProps.disabled ? zoomProps.zoomAbled : zoomProps.zoomDisabled,
      );
      const fileNames = computed(() => selectProps.fileNamesObject[selectProps.fileType.value]);
      const targetData = computed(() => sourceProps.sourceObject[sourceProps.source]);
      watch(
        () => props.edges,
        () => {
          drawChart(
            componentKey,
            currentKey,
            props.nodes,
            props.edges,
            checkboxGroupProps,
            echartsProps,
            selectProps,
            sourceProps,
            switchProps,
            zoomProps,
          );
        },
      );
      onMounted(() => {
        if (props.nodes && props.edges) {
          drawChart(
            componentKey,
            currentKey,
            props.nodes,
            props.edges,
            checkboxGroupProps,
            echartsProps,
            selectProps,
            sourceProps,
            switchProps,
            zoomProps,
          );
        }
      });
      return {
        ...toRefs(checkboxGroupProps),
        ...toRefs(collapseProps),
        ...toRefs(echartsProps),
        ...toRefs(selectProps),
        ...toRefs(sourceProps),
        ...toRefs(switchProps),
        ...toRefs(zoomProps),
        buttonContent,
        buttonDanger,
        componentKey,
        currentKey,
        fileNames,
        handleClick,
        targetData,
      };
    },
  });
</script>

<style>
  .tooltip {
    position: absolute;
    pointer-events: none;
    height: 40px;
    padding: 4px;
    border-radius: 8px;
    background-color: white;
    font-size: 0.8em;
  }
</style>
