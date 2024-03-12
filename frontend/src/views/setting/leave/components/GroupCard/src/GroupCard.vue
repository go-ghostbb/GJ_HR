<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-head`"> 給假群組 </div>
    <div :class="`${prefixCls}-body`">
      <div class="table-box">
        <table v-loading="loading">
          <thead>
            <tr>
              <th>群組名稱</th>
              <th>員工人數</th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(record, index) in dataSource" :key="`groupTable-${index}`">
              <!-- 群組名稱 -->
              <td>
                {{ record.name }}
                <EditOutlined style="color: #a9a9a9; cursor: pointer" @click="handleEdit(record)" />
              </td>

              <!-- 員工人數 -->
              <td>{{ record.employee?.length }}位</td>

              <!-- action -->
              <td>
                <TableAction
                  :actions="[
                    {
                      tooltip: '設定',
                      icon: 'ion:settings-outline',
                      onClick: handleSettingCond.bind(null, record),
                    },
                    {
                      tooltip: '人員',
                      icon: 'ion:person-outline',
                      onClick: handleSettingEmploee.bind(null, record),
                    },
                    {
                      tooltip: '刪除',
                      icon: 'ant-design:delete-outlined',
                      color: 'error',
                      popConfirm: {
                        title: 'Confirm?',
                        placement: 'left',
                        confirm: handleDelete.bind(null, record),
                      },
                    },
                  ]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 新增群組按鈕 -->
      <a-button type="link" style="font-size: 14px" @click="handleCreate">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        新增群組
      </a-button>
    </div>

    <LeaveGroupModal @register="registerGroupModal" @success="reload" />
    <ConditionDrawer @register="registerCondDrawer" @success="reload" />
    <EmployeeModal @register="registerEmployeeModal" @success="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { TableAction } from '@/components/Table';
  import { onMounted, ref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons-vue';
  import { LeaveGroupModel } from '@/api/setting/model/leaveGroupModel';
  import { deleteGroup, getLeaveGroup } from '@/api/setting/leave';
  import LeaveGroupModal from './LeaveGroupModal.vue';
  import ConditionDrawer from './ConditionDrawer.vue';
  import EmployeeModal from './EmployeeModal.vue';
  import { useModal } from '@/components/Modal';
  import { useDrawer } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';

  const { prefixCls } = useDesign('leave-group-card');

  export interface Props {
    leaveId: number;
  }

  //-註冊LeaveGroupModal(建立群組)
  const [registerGroupModal, groupMethods] = useModal();
  //-註冊ConditionDrawer(設定條件)
  const [registerCondDrawer, condMethods] = useDrawer();
  //-註冊EmployeeModal(設定員工)
  const [registerEmployeeModal, employeeMethods] = useModal();

  //-父組件傳進來的參數
  const props = withDefaults(defineProps<Props>(), {
    leaveId: 0,
  });

  //-資料源
  const dataSource = ref<LeaveGroupModel[]>([]);

  //-載入
  const loading = ref<boolean>(false);

  /**
   * @description 重新載入
   */
  const reload = async () => {
    try {
      loading.value = true;
      dataSource.value = await getLeaveGroup(props.leaveId);
    } finally {
      loading.value = false;
    }
  };

  /**
   * @description 點擊新增事件
   */
  const handleCreate = () => {
    groupMethods.openModal(true, { isUpdate: false, leaveId: props.leaveId });
  };

  /**
   * @description 點擊編輯事件
   */
  const handleEdit = (record: LeaveGroupModel) => {
    groupMethods.openModal(true, { isUpdate: true, leaveId: props.leaveId, record });
  };

  /**
   * @description 點擊設定條件事件
   * @param record LeaveGroupModel
   */
  const handleSettingCond = (record: LeaveGroupModel) => {
    condMethods.openDrawer(true, {
      leaveGroupId: record.ID,
      condition: record.leaveGroupCondition,
      default: record.leave?.default,
    });
  };

  /**
   * @description 點擊設定員工事件
   * @param record LeaveGroupModel
   */
  const handleSettingEmploee = (record: LeaveGroupModel) => {
    employeeMethods.openModal(true, {
      leaveGroupId: record.ID,
      checkedInLeave: getCheckedEmployeeByLeave(),
      checkedInGroup: getCheckedEmployeeByGroup(record),
    });
  };

  /**
   * @description 點擊刪除事件
   * @param record LeaveGroupModel
   */
  const handleDelete = (record: LeaveGroupModel) => {
    loading.value = true;
    deleteGroup(record.ID)
      .then(() => {
        useMessage().createMessage.success({ content: '刪除成功' });
        reload();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  /**
   * @description 取得該假別中, 已有群組的所有員工
   */
  const getCheckedEmployeeByLeave = (): number[] => {
    const result: number[] = [];
    dataSource.value.forEach((group) => {
      if (group.employee) {
        group.employee.forEach((employee) => {
          result.push(employee.ID);
        });
      }
    });
    return result;
  };

  /**
   * @description 取得該群組中有哪些員工
   * @param group LeaveGroupModel
   */
  const getCheckedEmployeeByGroup = (group: LeaveGroupModel): number[] => {
    const result: number[] = [];
    if (group.employee) {
      group.employee.forEach((employee) => {
        result.push(employee.ID);
      });
    }
    return result;
  };

  onMounted(() => {
    reload();
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-leave-group-card';

  .@{prefix-cls} {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0;
    border: @border-color-base 1px solid;
    border-radius: 8px;
    background-color: @component-background;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';
    font-size: 14px;

    &-head {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 38px;
      margin-bottom: -1px;
      padding: 0 12px;
      // border-bottom: 1px solid @border-color-base;
      border-radius: 8px 8px 0 0;
      background: transparent;
      color: @text-color-base;
      font-size: 16px;
      font-weight: 600;
    }

    &-body {
      box-sizing: border-box;
      padding: 6px 0;
      border-radius: 0 0 8px 8px;
      font-size: 14px;

      table {
        tr,
        th,
        td {
          height: 50px;
          padding-left: 12px;
          text-align: left;
        }

        thead th {
          border-bottom: @border-color-base 2px solid;
          color: @text-color-help-dark;
        }
      }
    }
  }
</style>
