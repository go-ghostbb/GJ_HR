<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">
          {{ '新增部門' }}
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as DepartmentModel),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '刪除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as DepartmentModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import DeptModal from './DeptModal.vue';
  import { columns, searchFormSchema } from './data';
  import { deleteDepartment, getDepartmentByKeyword } from '@/api/manager/department';
  import { DepartmentModel } from '@/api/manager/model/departmentModal';

  defineOptions({
    name: 'DepartmentManagement',
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

  //-modal註冊
  const [registerModal, { openModal }] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '部門列表',
    api: getDepartmentByKeyword,
    afterFetch: (record: DepartmentModel[]) => {
      setOption(record);
      return record;
    },
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    pagination: false,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: true,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    openModal(true, { isUpdate: false, treeData: selectOption.value });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: DepartmentModel
   */
  const handleEdit = (record: DepartmentModel) => {
    openModal(true, {
      record,
      isUpdate: true,
      treeData: selectOption.value,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: DepartmentModel
   */
  const handleDelete = (record: DepartmentModel) => {
    setLoading(true);
    deleteDepartment(record.ID)
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
  const setOption = (record: DepartmentModel[]) => {
    // 使用BFS(廣度優先搜尋演算法)
    // 這裡是陣列樹, 第一層搜尋會有差別外, 其餘演算法一樣

    selectOption.value = [{ label: '無', value: 0 }];
    const recordQueue: DepartmentModel[] = [];
    const optionQueue: option[] = [];

    // 一棵樹情況下只需放入root
    // 但這邊是陣列的樹, 這邊對演算法做一點修改
    // 使用迴圈將每棵樹的root放入
    // 模擬將陣列樹合併, 利用迴圈偽造出一個root

    //-第一層遍歷(root遍歷)
    record.forEach((e) => {
      //-只放入type為資料夾
      selectOption.value.push({ label: e.name, value: e.ID });

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
      optionTemp.label = recordTemp?.name;
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
