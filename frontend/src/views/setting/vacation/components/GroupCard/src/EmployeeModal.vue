<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="選擇人員"
    :minHeight="350"
    :zIndex="1000"
    okText="套用"
    @ok="handleOk"
  >
    <BasicTree
      ref="treeRef"
      class="mt-4"
      title="人員列表"
      v-model:checkedKeys="checkedKeys"
      checkable
      toolbar
      search
      :clickRowToExpand="true"
      :treeData="treeData"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { getEmployeeByKeyword } from '@/api/manager/employee';
  import { EmployeeModel } from '@/api/manager/model/employeeModel';
  import { setVacationGroupEmployee } from '@/api/setting/vacation';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { BasicTree } from '@/components/Tree';
  import { useMessage } from '@/hooks/web/useMessage';
  import { DataNode } from 'ant-design-vue/es/vc-tree/interface';
  import { onMounted, ref } from 'vue';

  const emit = defineEmits(['success', 'register']);

  //-樹狀結構的資料
  const treeData = ref<DataNode[]>([]);

  //-已選擇的節點
  const checkedKeys = ref<number[]>([]);

  //-當前設定的群組ID
  const vacationGroupId = ref<number>(0);

  //-員工列表
  // 將員工資料存在這, 只會執行一次fetch
  // 這方法感覺不太優雅, 假設員工有好幾萬, 如果都存在這不知道會不會有問題
  // 之後考慮換成分頁table
  // 或是直接使用區域變數, 把此變數放進modal入口
  // 每次點開modal都會fetch, 效率上可能會有點問題
  let employees: EmployeeModel[] = [];

  //-modal入口
  const [registerModal, { closeModal, changeLoading, setModalProps }] = useModalInner(
    async (data) => {
      changeLoading(true);
      //-群組ID
      vacationGroupId.value = data.vacationGroupId;

      checkedKeys.value = data.checkedInGroup;
      const checkedInVacation: number[] = data.checkedInVacation.filter((n: number) => {
        // 如果checkedKeys存在此key, 不能放進去(false)
        // 否則直接放(true)
        // 因為想要呈現在此假別中已選擇的員工不顯示, 但是自己群組已選擇的必須顯示
        return !(checkedKeys.value.indexOf(n) > -1);
      });

      //-treeData設定
      const dataMap = new Map<number, DataNode>();
      treeData.value = [];
      employees.forEach((employee) => {
        //-判斷此員工是否可呈現在畫面
        if (checkedInVacation.indexOf(employee.ID) > -1) {
          return;
        }

        if (dataMap.has(employee.departmentId!)) {
          //-如果map存在, 直接push
          const node = dataMap.get(employee.departmentId!)!;
          node.children!.push({ title: employee.realName, key: employee.ID });
        } else {
          //-如果不存在
          if (employee.department) {
            //-有部門的話, 建立在部門底下
            //!注意：部門的key必須用負數, 直接乘上-1即可
            //!因為最後再取值只需要員工的ID, 會過濾掉負數的值
            treeData.value.push({
              title: employee.department.name,
              key: employee.department.ID * -1,
              children: [{ title: employee.realName, key: employee.ID }],
            });
            //-放進map, 下次遍歷到直接push進map
            dataMap.set(employee.department.ID, treeData.value[treeData.value.length - 1]);
          } else {
            //-沒部門的話直接顯示
            treeData.value.push({
              title: employee.realName,
              key: employee.ID,
            });
          }
        }
      });

      changeLoading(false);
    },
  );

  /**
   * @description 提交
   */
  const handleOk = () => {
    setModalProps({ confirmLoading: true });
    setVacationGroupEmployee(vacationGroupId.value, filterID(checkedKeys.value))
      .then(() => {
        useMessage().createMessage.success({ content: '設定成功' });
        emit('success');
        closeModal();
      })
      .finally(() => {
        setModalProps({ confirmLoading: false });
      });
  };

  /**
   * @description 過濾負數id
   * @param keys id
   */
  const filterID = (keys: number[]): number[] => {
    const result: number[] = [];
    keys.forEach((n) => {
      if (n > 0) {
        result.push(n);
      }
    });
    return result;
  };

  onMounted(async () => {
    try {
      changeLoading(true);
      const employee = await getEmployeeByKeyword();
      employees = employee.items;
    } finally {
      changeLoading(false);
    }
  });
</script>
