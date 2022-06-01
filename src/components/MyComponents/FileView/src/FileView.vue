<template>
  <div>
    <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
      <StructureTree
        class="w-1/4 xl:w-1/5"
        :api="structureTreeApi"
        :changed="changed"
        :title="strucutureTreeTitle"
        @select="handleSelect"
      />
      <BasicTable
        class="w-3/4 xl:w-4/5"
        :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys, onChange: onSelectChange }"
        :searchInfo="searchInfo"
        @register="registerTable"
      >
        <template #form-custom> custom-slot </template>
        <template #toolbar>
          <BasicUpload
            class="my-5"
            :accept="['zip']"
            :api="uploadApi"
            :maxNumber="5"
            :maxSize="1024"
            :showPreviewNumber="showPreviewNumber"
            :wsURL="wsURL"
            @change="handleChange"
            @reload="handleReload"
          />
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看文件架构图',
                onClick: handleView.bind(null, record),
                ifShow: (!record.children && record.file_type === 0) || record.section_type === 1,
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑文件',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此文件',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </BasicTable>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicUpload } from '/@/components/MyComponents/FileUpload';
  import { StructureTree } from '/@/components/MyComponents/StructureTree';
  import { PageWrapper } from '/@/components/Page';
  import { fileViewProps } from '/@/components/MyComponents/FileView/src/props';
  import { useGo } from '/@/hooks/web/usePage';
  // import { useModal } from '/@/components/Modal';
  // import FileModal from './fileModal.vue';

  export default defineComponent({
    components: { BasicTable, BasicUpload, StructureTree, TableAction, PageWrapper },
    props: {
      ...fileViewProps,
    },
    setup(props) {
      const changed = ref<boolean>(true);
      const checkedKeys = ref<Array<string | number>>([]);
      const searchInfo = reactive<Recordable>({});
      const go = useGo();
      // const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: props.tableTitle,
        api: props.tableApi,
        beforeFetch: (params) => {
          params.is_delete = false;
        },
        handleSearchInfoFn(info) {
          return info;
        },
        bordered: true,
        columns: props.tableColumns(),
        formConfig: props.tableFormConfig(),
        isTreeTable: true,
        rowKey: 'id',
        showIndexColumn: false,
        showTableSetting: true,
        striped: false,
        tableSetting: { fullScreen: true },
        useSearchForm: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleChange() {}

      function handleEdit(record: Recordable) {
        // openModal(true, {
        //   record,
        //   isUpdate: true,
        // });
        console.log(record);
      }

      function handleDelete(record: Recordable) {
        console.log(record);
      }

      function handleReload() {
        changed.value = !changed.value;
        reload();
      }

      function handleSelect(Id = '') {
        searchInfo.parent_file_id = Id;
        reload();
      }

      function handleView(record: Recordable) {
        // go('/fileManager/formTable/file_visualization/' + record.id);
        go(`${props.viewURL}${record.id}`);
      }

      function onSelectChange(selectedRowKeys: (string | number)[]) {
        checkedKeys.value = selectedRowKeys;
      }

      return {
        ...toRefs(props),
        changed,
        checkedKeys,
        searchInfo,
        handleChange,
        handleDelete,
        handleEdit,
        handleReload,
        handleSelect,
        handleView,
        onSelectChange,
        registerTable,
      };
    },
  });
</script>
