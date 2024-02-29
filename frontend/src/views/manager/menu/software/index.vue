<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">
          {{ '新增菜單' }}
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as MenuModel),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '刪除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as MenuModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getMenuByKeyword, deleteMenu } from '@/api/manager/menu';
  import { GetMenuByKeywordParams, MenuModel, ShowType } from '@/api/manager/model/menuModel';
  import { columns, searchFormSchema } from '../data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDrawer } from '@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  defineOptions({
    name: 'MenuSoftwareManager',
    inheritAttrs: false,
  });

  /**
   * @description 資料夾下拉式選的的option結構
   */
  interface option {
    label?: string;
    value: number;
    children?: option[];
  }

  //-編輯和新增用的下拉式選單option
  const selectOption = ref<option[]>([]);

  //-drawer初始化
  const [registerDrawer, { openDrawer }] = useDrawer();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '菜單列表',
    columns,
    api: getMenuByKeyword,
    beforeFetch: (params: GetMenuByKeywordParams) => {
      params.show = ShowType.SOFTWARE;
    },
    afterFetch: (record: MenuModel[]) => {
      setOption(record);
      return record;
    },
    pagination: false, //-不分頁
    isTreeTable: true,
    striped: false,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: true,
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    openDrawer(true, { isUpdate: false, treeData: selectOption.value });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: GetMenuByKeywordModel
   */
  const handleEdit = (record: MenuModel) => {
    openDrawer(true, { record, isUpdate: true, treeData: selectOption.value });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: GetMenuByKeywordModel
   */
  const handleDelete = (record: MenuModel) => {
    setLoading(true);
    deleteMenu(record.ID)
      .then(() => {
        useMessage().createMessage.success({ content: '刪除成功' });
        reload();
      })
      .catch((err) => {
        console.log(err);
        useMessage().createMessage.error({ content: '刪除失敗' });
        setLoading(false);
      });
  };

  /**
   * @description 操作成功
   */
  const handleSuccess = () => {
    useMessage().createMessage.success({ content: '操作成功' });
    reload();
  };

  /**
   * @description 設定編輯和新增用的下拉式選單的option
   * @param record
   */
  const setOption = (record: MenuModel[]) => {
    // 使用BFS(廣度優先搜尋演算法)
    // 這裡是陣列樹, 第一層搜尋會有差別外, 其餘演算法一樣

    selectOption.value = [];
    const recordQueue: MenuModel[] = [];
    const optionQueue: option[] = [];
    //-第一層遍歷(root遍歷)
    record.forEach((e) => {
      selectOption.value.push({ label: e.meta?.title, value: e.ID });

      if (e.children) {
        //-如果有子節點的話
        const lastSeletOption = selectOption.value[selectOption.value.length - 1];
        lastSeletOption.children = []; //-初始化
        //-遍歷子節點, 分別塞入queue
        e.children.forEach((child) => {
          recordQueue.push(child);
          if (lastSeletOption.children) {
            //-每遍歷一個option裡也要塞入一個
            lastSeletOption.children.push({ label: '', value: 0 });
            //-放入上行建立的物件(指針)
            optionQueue.push(lastSeletOption.children[lastSeletOption.children.length - 1]);
          }
        });
      }
    });

    //-queue
    while (recordQueue.length !== 0) {
      const recordTemp = recordQueue.pop()!;
      const optionTemp = optionQueue.pop()!;
      optionTemp.label = recordTemp?.meta?.title;
      optionTemp.value = recordTemp?.ID;

      //-遍歷子節點, 做法跟遍歷root一樣
      if (recordTemp.children) {
        optionTemp.children = []; //-初始化
        recordTemp.children.forEach((child) => {
          recordQueue.push(child);
          if (optionTemp.children) {
            optionTemp.children.push({ label: '', value: 0 });
            //-一樣需放入指針
            optionQueue.push(optionTemp.children[optionTemp.children.length - 1]);
          }
        });
      }
    }
  };
</script>
