<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-head`"> 加班倍率群組 </div>
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
              <td>{{ record.name }}</td>
              <td>{{ record.employee?.length }}位</td>
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

    <CreateVacationGroupModal @register="registerCreateModal" @success="reload" />
    <OvertimeRateDrawer @register="registerRateDrawer" @success="reload" />
    <EmployeeModal @register="registerEmployeeModal" @success="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { TableAction } from '@/components/Table';
  import { onMounted, ref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { PlusCircleOutlined } from '@ant-design/icons-vue';
  import { VacationGroupModel } from '@/api/setting/model/vacationGroupModel';
  import { deleteGroup, getVacationGroup } from '@/api/setting/vacation';
  import CreateVacationGroupModal from './CreateVacationGroupModal.vue';
  import OvertimeRateDrawer from './OvertimeRateDrawer.vue';
  import EmployeeModal from './EmployeeModal.vue';
  import { useModal } from '@/components/Modal';
  import { useDrawer } from '@/components/Drawer';

  const { prefixCls } = useDesign('vacation-group-card');

  export interface Props {
    vacationId: number;
  }

  //-註冊CreateVacationGroupModal(建立群組)
  const [registerCreateModal, createMethods] = useModal();
  //-註冊OvertimeRateDrawer(設定條件)
  const [registerRateDrawer, rateMethods] = useDrawer();
  //-註冊EmployeeModal(設定員工)
  const [registerEmployeeModal, employeeMethods] = useModal();

  //-父組件傳進來的參數
  const props = withDefaults(defineProps<Props>(), {
    vacationId: 0,
  });

  //-資料源
  const dataSource = ref<VacationGroupModel[]>([]);

  //-載入
  const loading = ref<boolean>(false);

  /**
   * @description 重新載入
   */
  const reload = async () => {
    try {
      loading.value = true;
      dataSource.value = await getVacationGroup(props.vacationId);
    } finally {
      loading.value = false;
    }
  };

  /**
   * @description 點擊新增事件
   */
  const handleCreate = () => {
    createMethods.openModal(true, { isUpdate: false, vacationId: props.vacationId });
  };

  /**
   * @description 點擊設定區間事件
   * @param record VacationGroupModel
   */
  const handleSettingCond = (record: VacationGroupModel) => {
    rateMethods.openDrawer(true, {
      vacationGroupId: record.ID,
      overtimeRate: record.vacationGroupOvertimeRate,
    });
  };

  /**
   * @description 點擊設定員工事件
   * @param record VacationGroupModel
   */
  const handleSettingEmploee = (record: VacationGroupModel) => {
    employeeMethods.openModal(true, {
      vacationGroupId: record.ID,
      checkedInVacation: getCheckedEmployeeByVacation(),
      checkedInGroup: getCheckedEmployeeByGroup(record),
    });
  };

  /**
   * @description 點擊刪除事件
   * @param record VacationGroupModel
   */
  const handleDelete = (record: VacationGroupModel) => {
    loading.value = true;
    deleteGroup(record.ID)
      .then(() => {
        reload();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  /**
   * @description 取得該假別中, 已有群組的所有員工
   */
  const getCheckedEmployeeByVacation = (): number[] => {
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
   * @param group VacationGroupModel
   */
  const getCheckedEmployeeByGroup = (group: VacationGroupModel): number[] => {
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
  @prefix-cls: ~'@{namespace}-vacation-group-card';

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
