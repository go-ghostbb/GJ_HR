<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'role:create'" type="primary" @click="handleCreate">
          {{ '新增角色' }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: 'role:set',
                icon: 'ant-design:setting-outlined',
                color: 'warning',
                onClick: handleSet.bind(null, record as RoleModel),
              },
              {
                auth: 'role:edit',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as RoleModel),
              },
              {
                auth: 'role:delete',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '編輯角色',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as RoleModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="handleSuccess" />
    <AuthDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { deleteRole, getRoleByKeyword } from '@/api/manager/role';
  import { useTable, TableAction, BasicTable } from '@/components/Table';
  import { columns, searchFormSchema } from './data';
  import { useModal } from '@/components/Modal';
  import RoleModal from './RoleModal.vue';
  import AuthDrawer from './AuthDrawer.vue';
  import { RoleModel } from '@/api/manager/model/roleModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDrawer } from '@/components/Drawer';
  import { MenuModel, ShowType } from '@/api/manager/model/menuModel';
  import { PermissionModel } from '@/api/manager/model/permissionModel';

  defineOptions({
    name: 'RoleManager',
    inheritAttrs: false,
  });

  //-modal註冊
  const [registerModal, { openModal }] = useModal();

  //-drawer註冊
  const [registerDrawer, { openDrawer }] = useDrawer();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '角色列表',
    api: getRoleByKeyword,
    columns,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * @description 設定按鈕事件
   * @param record RoleModel
   */
  const handleSet = (record: RoleModel) => {
    openDrawer(true, {
      id: record.ID,
      menuId: getMenuId(record.menus!),
      permId: getPermId(record.permissions!),
    });
  };

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    openModal(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: RoleModel
   */
  const handleEdit = (record: RoleModel) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: RoleModel
   */
  const handleDelete = (record: RoleModel) => {
    setLoading(true);
    deleteRole(record.ID)
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
   * @description 獲取menu id, 使用BFS(廣度優先搜尋演算法)
   * @param menus MenuModel[]
   */
  const getMenuId = (menus: MenuModel[]): { software: number[]; web: number[] } => {
    if (!menus || menus.length === 0) {
      return { software: [], web: [] };
    }

    const queue: MenuModel[] = [];
    const result: { software: number[]; web: number[] } = { software: [], web: [] };

    //-塞入root
    menus.forEach((menu) => {
      if (menu.type !== 'directory') {
        switch (menu.show) {
          case ShowType.SOFTWARE:
            result.software.push(menu.ID);
            break;
          case ShowType.WEB:
            result.web.push(menu.ID);
            break;
        }
      }

      if (menu.children) {
        menu.children.forEach((e) => {
          queue.push(e);
        });
      }
    });

    while (queue.length !== 0) {
      const menu = queue.pop()!;
      if (menu.type !== 'directory') {
        switch (menu.show) {
          case ShowType.SOFTWARE:
            result.software.push(menu.ID);
            break;
          case ShowType.WEB:
            result.web.push(menu.ID);
            break;
        }
      }

      if (menu.children) {
        menu.children.forEach((e) => {
          queue.push(e);
        });
      }
    }

    return result;
  };

  /**
   * @description 獲取perm id
   * @param perms PermissionModel[]
   */
  const getPermId = (perms: PermissionModel[]): number[] => {
    const result: number[] = [];
    perms.forEach((perm) => {
      result.push(perm.ID);
    });
    return result;
  };
</script>
