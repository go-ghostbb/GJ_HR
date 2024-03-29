<template>
  <BasicModal
    :class="prefixCls"
    v-bind="$attrs"
    @register="registerModal"
    title="減項設定"
    :minHeight="350"
    :zIndex="1000"
    okText="套用"
    @ok="handleOk"
  >
    <div v-for="(item, index) in calcReduceItem" :key="`${index}-reduce-item`">
      <div class="mb-3">
        <!-- 減項 -->
        <span class="ml-4">減項：</span>
        <Select
          v-model:value="item.salaryReduceItemId"
          class="w-150px"
          :options="reduceItemOptions"
          @change="(e) => handleAddChange(e as number, index)"
        />

        <!-- 金額 -->
        <span class="ml-4">金額：</span>
        <Input v-model:value="item.amount" class="w-100px" />

        <!-- 刪除減項 -->
        <Button class="ml-2" type="text" danger @click="handleRemove(index)">
          <template #icon>
            <CloseOutlined />
          </template>
        </Button>
      </div>
    </div>
    <!-- 新增減項 -->
    <Button type="link" style="font-size: 14px" @click="handleAdd">
      <template #icon>
        <PlusCircleOutlined />
      </template>
      新增減項
    </Button>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useDesign } from '@/hooks/web/useDesign';
  import { ref, onMounted, reactive } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
  import { Select, Input, Button } from 'ant-design-vue';
  import { getSalaryAddItemByKeyword } from '@/api/setting/salaryItem';
  import { CalcSalaryReduceModel } from '@/api/salary-work/model/salary-work';
  import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { SalaryAddItemModel } from '@/api/setting/model/salaryAddItemModel';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['success', 'register']);

  const { prefixCls } = useDesign('reduce-item-modal');

  //-減項下拉式選單options
  const reduceItemOptions = ref<SelectProps['options']>([]);
  //-map對照表
  const reduceItemMap = ref<Map<number, SalaryAddItemModel>>(new Map());

  //-reduce item
  const calcReduceItem = reactive<CalcSalaryReduceModel[]>([]);

  //-對應員工ID
  const calcEmployeeId = ref(0);

  //-modal入口
  const [registerModal, { closeModal, changeLoading }] = useModalInner((data) => {
    reset();
    calcEmployeeId.value = data.id;
    cloneDeep(data.reduceItem).forEach((item: CalcSalaryReduceModel) => {
      calcReduceItem.push(item);
    });
  });

  /**
   * @description 提交
   */
  const handleOk = () => {
    for (let i = 0; i < calcReduceItem.length; i++) {
      calcReduceItem[i].amount = Number(calcReduceItem[i].amount);
    }
    emit('success', calcEmployeeId.value, cloneDeep(calcReduceItem));
    closeModal();
  };

  /**
   * @description 重置
   */
  const reset = () => {
    while (calcReduceItem.length !== 0) {
      calcReduceItem.pop();
    }
  };

  /**
   * @description 獲取減項下拉式選單
   */
  const getAddItemOptions = async () => {
    try {
      changeLoading(true);
      const reduceItems = await getSalaryAddItemByKeyword();

      const options: SelectProps['options'] = [];
      const reduceMap: Map<number, SalaryAddItemModel> = new Map();
      reduceItems.items.forEach((item) => {
        options.push({ value: item.ID, label: item.name });
        reduceMap.set(item.ID, item);
      });
      reduceItemOptions.value = options;
      reduceItemMap.value = reduceMap;
    } finally {
      changeLoading(false);
    }
  };

  /**
   * @description 新增減項
   */
  const handleAdd = () => {
    calcReduceItem.push({ ID: 0, calcSalaryEmployeeId: calcEmployeeId.value });
  };

  /**
   * @description 點擊刪除年資
   * @param index
   */
  const handleRemove = (index: number) => {
    calcReduceItem.splice(index, 1);
  };

  /**
   * @description 減項選擇改變時
   * @param e
   */
  const handleAddChange = (id: number, index: number) => {
    const selectAdd = reduceItemMap.value.get(id!)!;
    calcReduceItem[index].incomeTax = selectAdd.incomeTax;
  };

  onMounted(() => {
    getAddItemOptions();
  });
</script>
