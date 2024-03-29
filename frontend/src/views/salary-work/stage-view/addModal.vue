<template>
  <BasicModal
    :class="prefixCls"
    v-bind="$attrs"
    @register="registerModal"
    title="加項設定"
    :minHeight="350"
    :zIndex="1000"
    okText="套用"
    @ok="handleOk"
  >
    <div v-for="(item, index) in calcAddItem" :key="`${index}-add-item`">
      <div class="mb-3">
        <!-- 加項 -->
        <span class="ml-4">加項：</span>
        <Select
          v-model:value="item.salaryAddItemId"
          class="w-150px"
          :options="addItemOptions"
          @change="(e) => handleAddChange(e as number, index)"
        />

        <!-- 金額 -->
        <span class="ml-4">金額：</span>
        <Input v-model:value="item.amount" class="w-100px" />

        <!-- 刪除加項 -->
        <Button class="ml-2" type="text" danger @click="handleRemove(index)">
          <template #icon>
            <CloseOutlined />
          </template>
        </Button>
      </div>
    </div>
    <!-- 新增加項 -->
    <Button type="link" style="font-size: 14px" @click="handleAdd">
      <template #icon>
        <PlusCircleOutlined />
      </template>
      新增加項
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
  import { CalcSalaryAddModel } from '@/api/salary-work/model/salary-work';
  import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { SalaryAddItemModel } from '@/api/setting/model/salaryAddItemModel';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['success', 'register']);

  const { prefixCls } = useDesign('add-item-modal');

  //-加項下拉式選單options
  const addItemOptions = ref<SelectProps['options']>([]);
  //-map對照表
  const addItemMap = ref<Map<number, SalaryAddItemModel>>(new Map());

  //-add item
  const calcAddItem = reactive<CalcSalaryAddModel[]>([]);

  //-對應員工ID
  const calcEmployeeId = ref(0);

  //-modal入口
  const [registerModal, { closeModal, changeLoading }] = useModalInner((data) => {
    reset();
    calcEmployeeId.value = data.id;
    cloneDeep(data.addItem).forEach((item: CalcSalaryAddModel) => {
      calcAddItem.push(item);
    });
  });

  /**
   * @description 提交
   */
  const handleOk = () => {
    for (let i = 0; i < calcAddItem.length; i++) {
      calcAddItem[i].amount = Number(calcAddItem[i].amount);
    }
    emit('success', calcEmployeeId.value, cloneDeep(calcAddItem));
    closeModal();
  };

  /**
   * @description 重置
   */
  const reset = () => {
    while (calcAddItem.length !== 0) {
      calcAddItem.pop();
    }
  };

  /**
   * @description 獲取加項下拉式選單
   */
  const getAddItemOptions = async () => {
    try {
      changeLoading(true);
      const addItems = await getSalaryAddItemByKeyword();

      const options: SelectProps['options'] = [];
      const addMap: Map<number, SalaryAddItemModel> = new Map();
      addItems.items.forEach((item) => {
        options.push({ value: item.ID, label: item.name });
        addMap.set(item.ID, item);
      });
      addItemOptions.value = options;
      addItemMap.value = addMap;
    } finally {
      changeLoading(false);
    }
  };

  /**
   * @description 新增加項
   */
  const handleAdd = () => {
    calcAddItem.push({ ID: 0, calcSalaryEmployeeId: calcEmployeeId.value });
  };

  /**
   * @description 點擊刪除年資
   * @param index
   */
  const handleRemove = (index: number) => {
    calcAddItem.splice(index, 1);
  };

  /**
   * @description 加項選擇改變時
   * @param e
   */
  const handleAddChange = (id: number, index: number) => {
    const selectAdd = addItemMap.value.get(id!)!;
    calcAddItem[index].salaryType = selectAdd.salaryType;
    calcAddItem[index].incomeTax = selectAdd.incomeTax;
    calcAddItem[index].benefits = selectAdd.benefits;
    calcAddItem[index].premiums = selectAdd.premiums;
  };

  onMounted(() => {
    getAddItemOptions();
  });
</script>
