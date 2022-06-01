<template>
  <FileView
    :structureTreeApi="structureTreeApi"
    :strucutureTreeTitle="structureTreeTitle"
    :tableApi="tableApi"
    :tableColumns="tableColumns"
    :tableFormConfig="tableFormConfig"
    :tableTitle="tableTitle"
    :showPreviewNumber="showPreviewNumber"
    :uploadApi="uploadApi"
    :wsURL="wsURL"
    :viewURL="viewURL"
/></template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { FileView } from '/@/components/MyComponents/FileView';
  import { getBasicColumns, getFormConfig } from './tableData';
  import {
    getSectionFilesList,
    getSectionFilesStructureTreeList,
    uploadSectionFiles,
  } from '/@/api/section/section';

  export default defineComponent({
    components: { FileView },
    setup() {
      const fileViewProps = reactive({
        structureTreeApi: getSectionFilesStructureTreeList,
        structureTreeTitle: '切面文件树形结构',
        tableApi: getSectionFilesList,
        tableColumns: getBasicColumns,
        tableFormConfig: getFormConfig,
        tableTitle: '切面文件列表',
        showPreviewNumber: true,
        uploadApi: uploadSectionFiles,
        wsURL: 'ws://localhost:8000/ws/sections/',
        viewURL: '/section/fileTable/section_visualization/',
      });
      return {
        ...toRefs(fileViewProps),
      };
    },
  });
</script>
