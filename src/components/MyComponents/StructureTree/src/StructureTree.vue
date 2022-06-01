<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      toolbar
      search
      :clickRowToExpand="clickRowToExpand"
      :replace-fields="replaceFields"
      :title="title"
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  import { structureTreeProps } from './props';

  export default defineComponent({
    name: 'StructureTree',
    components: { BasicTree },
    props: {
      ...structureTreeProps,
    },
    emits: ['select'],
    setup(props, { emit }) {
      const treeProps = reactive({
        clickRowToExpand: true,
        replaceFields: {
          key: 'id',
          title: 'file_name',
        },
        title: props.title,
        treeData: [] as unknown as TreeItem[],
      });

      async function fetch() {
        const { api } = props;
        if (!api || !isFunction(api)) {
          return warn('api must exist and be a function');
        }
        const temp = (await api()) as unknown as TreeItem[];
        const setIcon = function (array) {
          array.forEach((object) => {
            if (object.children) {
              object.icon = 'eos-icons:project-outlined';
              setIcon(object.children);
            } else {
              object.icon = 'ant-design:folder-filled';
            }
          });
        };
        setIcon(temp);
        treeProps.treeData = temp;
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });
      watch(
        () => props.changed,
        () => {
          fetch();
        },
      );
      return { ...toRefs(treeProps), fetch, handleSelect };
    },
  });
</script>
