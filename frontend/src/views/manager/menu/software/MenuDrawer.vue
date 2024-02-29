<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { formSchema } from '../data';
  import { createMenu, updateMenu } from '@/api/manager/menu';
  import { MenuModel, ShowType } from '@/api/manager/model/menuModel';

  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref(true);
  const record = ref<MenuModel>();

  //-form設定
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  //-drawer入口
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner((data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    //-如果是要編輯菜單的話，把值塞進form
    if (unref(isUpdate)) {
      record.value = data?.record;
      setFieldsValue({ ...record.value });
    } else {
      record.value = { ID: 0 };
    }

    //-將資料夾下拉式選單option塞入
    updateSchema({
      field: 'parentId',
      componentProps: { treeData: data.treeData },
    });
  });

  //-drawer標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜單' : '編輯菜單'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過
      setDrawerProps({ confirmLoading: true });
      values.show = ShowType.SOFTWARE; //-軟體用menu
      //-number格式
      //-猜測套件問題有時候number會變成string, 需手動轉回來
      values.sort = Number(values.sort);
      if (!unref(isUpdate)) {
        //-新增
        await createMenu(values as MenuModel);
      } else {
        //-編輯
        // //-將原有database model塞入
        // values.ID = record.value?.ID;
        // values.CreatedAt = record.value?.CreatedAt;
        //-寫入顯示於software
        await updateMenu(record.value!.ID, values as MenuModel);
      }
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };
</script>
