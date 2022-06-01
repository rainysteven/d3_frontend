<template>
  <div id="chart"></div>
</template>

<script>
  import { defineComponent, watch } from 'vue';
  import { drawChart } from './arc';
  export default defineComponent({
    name: 'SectionArc',
    props: {
      nodes: {
        type: Object,
      },
      edges: {
        type: Object,
      },
    },
    setup(props) {
      watch(
        () => props.edges,
        () => {
          drawChart(props.nodes, props.edges);
        },
      );
    },
  });
</script>

<style></style>
