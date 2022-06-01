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
    getProjectFilesList,
    getProjectFilesStructureTreeList,
    uploadProjectFiles,
  } from '/@/api/file/file';

  export default defineComponent({
    components: { FileView },
    setup() {
      const fileViewProps = reactive({
        structureTreeApi: getProjectFilesStructureTreeList,
        structureTreeTitle: '项目文件树形结构',
        tableApi: getProjectFilesList,
        tableColumns: getBasicColumns,
        tableFormConfig: getFormConfig,
        tableTitle: '项目文件列表',
        showPreviewNumber: true,
        uploadApi: uploadProjectFiles,
        wsURL: 'ws://localhost:8000/ws/records/',
        viewURL: '/fileManager/formTable/file_visualization/',
      });
      return {
        ...toRefs(fileViewProps),
      };
    },
  });
</script>
