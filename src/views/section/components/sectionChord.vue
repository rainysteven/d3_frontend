<template>
  <div id="tooltip"></div>
  <div id="chart"></div>
  <div class="panels">
    <Collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
      <template #expandIcon="{ isActive }">
        <CaretRightOutlined :rotate="isActive ? 90 : 0" />
      </template>
      <CollapsePanel key="1" header="图例">
        <div id="legend"></div>
      </CollapsePanel>
      <CollapsePanel key="2" header="参数设置">
        <Row
          ><h4>{{ h4Value }}</h4></Row
        >
        <Row>
          <Col :span="15">
            <Slider
              v-model:value="sliderValue"
              :max="max"
              :min="min"
              :tooltip-visible="false"
              @change="handleSliderChange"
            />
          </Col>
          <Col :span="2">
            <InputNumber
              v-model:value="sliderValue"
              :max="max"
              :min="min"
              @change="handleSliderChange"
              style="margin-left: 16px; width: 5px"
            />
          </Col>
        </Row>
        <Row><h4>原生伴生筛选</h4></Row>
        <Row
          ><RadioGroup v-model:value="radioValue" @change="handleRadioChange"
            ><Radio :value="1">伴生</Radio><Radio :value="0">原生</Radio></RadioGroup
          ></Row
        >
        <Row><h4>区域zoom</h4></Row>
        <Row>
          <Col :span="10"
            ><a-button :danger="buttonDanger" @click="handleClick">{{
              buttonContent
            }}</a-button></Col
          >
          <Col :span="10"
            ><a-button :disabled="disabled" @click="zoomReset" type="primary">reset</a-button></Col
          >
        </Row>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
  import {
    Col,
    Collapse,
    CollapsePanel,
    InputNumber,
    Radio,
    RadioGroup,
    Row,
    Slider,
  } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { changeLinksByRadio, changeLinksBySlider, drawChart, drawLegend } from './chord';
  export default defineComponent({
    name: 'SectionChord',
    components: {
      Collapse,
      CollapsePanel,
      CaretRightOutlined,
      Radio,
      RadioGroup,
      Slider,
      Row,
      Col,
      InputNumber,
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
      const { nodes, edges } = toRefs(props);
      const collapseProps = reactive({
        allowClear: true,
        activeKey: ['1'],
        expandIconPosition: 'right',
        forceRender: true,
      });
      const sliderProps = reactive({
        max: 100,
        min: 10,
        sliderValue: 20,
        handleSliderChange: (value) => {
          changeLinksBySlider(radioProps.radioValue, value);
        },
      });
      const radioProps = reactive({
        radioValue: 1,
        handleRadioChange: (event) => {
          changeLinksByRadio(event.target.value, sliderProps);
        },
      });
      const zoomProps = reactive({
        disabled: false,
        zoomAbled: () => {},
        zoomDisabled: () => {},
        zoomReset: () => {},
      });
      const buttonContent = computed(() => (zoomProps.disabled ? '开启zoom' : '禁止zoom'));
      const buttonDanger = computed(() => !zoomProps.disabled);
      const handleClick = computed(() =>
        zoomProps.disabled ? zoomProps.zoomAbled : zoomProps.zoomDisabled,
      );
      const h4Value_array = ['原生到伴生边数', '伴生到原生边数'];
      const h4Value = computed(() => h4Value_array[radioProps.radioValue]);
      watch(edges, () => {
        drawLegend();
        drawChart(nodes.value, edges.value, radioProps, sliderProps, zoomProps);
      });
      return {
        ...toRefs(collapseProps),
        ...toRefs(sliderProps),
        ...toRefs(radioProps),
        ...toRefs(zoomProps),
        buttonContent,
        buttonDanger,
        handleClick,
        h4Value,
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
  .tool-tip {
    position: absolute;
    z-index: 2;
    visibility: hidden;
    background-color: #fff;
    border: 1px solid #333;
    padding: 12px 6px;
    pointer-events: none;
  }
</style>
