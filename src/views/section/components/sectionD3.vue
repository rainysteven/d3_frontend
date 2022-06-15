<template>
  <div id="chart" style="height: 768px"></div>
</template>

<script>
  import { defineComponent, toRefs, watch } from 'vue';
  import { drawChart } from './antv-g6';
  export default defineComponent({
    name: 'SectionD3Chart',
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
      watch(edges, () => {
        drawChart(nodes.value, edges.value);
      });
    },
  });
</script>

<style></style>
