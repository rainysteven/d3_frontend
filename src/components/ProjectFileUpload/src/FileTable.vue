<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { fileListProps } from './props';
  import { useModalContext } from '/@/components/Modal/src/hooks/useModalContext';

  export default defineComponent({
    name: 'FileTable',
    components: { BasicTable },
    props: fileListProps,
    setup(props) {
      const modalFn = useModalContext();
      const { columns, actionColumn } = props;
      const [registerTable, { setTableData }] = useTable({
        columns,
        bordered: true,
        striped: true,
        showTableSetting: false,
        showIndexColumn: false,
        rowKey: 'id',
        actionColumn,
      });
      watch(
        () => props.dataSource,
        () => {
          setTableData(props.dataSource);
          nextTick(() => {
            modalFn?.redoModalHeight?.();
          });
        },
      );

      return { registerTable };
    },
  });
</script>
