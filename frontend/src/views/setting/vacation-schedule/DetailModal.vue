<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :minHeight="350"
    width="700px"
    @ok="handleSubmit"
  >
    <template #footer></template>
    <template #title>
      <span>{{ title }}</span>
      <Button class="ml-2" shape="circle" size="small" @click="handleCreate">
        <FileAddOutlined />
      </Button>
    </template>

    <Collapse v-model:activeKey="activeKey">
      <CollapsePanel v-for="schedule in scheduleData" :key="schedule.ID">
        <!-- header -->
        <template #header>
          <Badge :color="schedule.vacation?.color" :text="schedule.vacation?.name" />
        </template>

        <!-- body -->
        <div class="mb-4">
          <Row justify="space-between">
            <Col>
              <span class="font-bold" style="font-size: 16px">
                {{ '來源資料' }}
              </span>
            </Col>
            <Col>
              <!-- 編輯按鈕 -->
              <Button size="small" type="primary" @click="handleEdit(schedule)">
                {{ '編輯' }}
              </Button>

              <!-- 刪除按鈕 -->
              <Popconfirm title="確認刪除?" @confirm="handleDelete(schedule)">
                <Button class="ml-2" type="primary" danger size="small">
                  {{ '刪除' }}
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </div>

        <Description :column="1" :schema="vacationDescSchema" :data="schedule" />
      </CollapsePanel>
    </Collapse>
  </BasicModal>
  <ScheduleModal @register="registerScheduleDrawer" @success="handleSuccess" />
  <ConfirmModal
    @register="registerConfirmModal"
    @result="
      (mode: 'all' | 'one', schedule: VacationScheduleModel) => {
        handleDelete(schedule, mode);
      }
    "
  />
</template>

<script lang="ts" setup>
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { Badge, Collapse, CollapsePanel, Button, Row, Col, Popconfirm } from 'ant-design-vue';
  import { Description } from '@/components/Description';
  import { reactive, ref } from 'vue';
  import { useDrawer } from '@/components/Drawer';
  import ScheduleModal from './ScheduleModal.vue';
  import ConfirmModal from './ConfirmModal.vue';
  import { FileAddOutlined } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { VacationScheduleModel } from '@/api/setting/model/vacationScheduleModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { vacationDescSchema } from './data';
  import { deleteVacationSchedule } from '@/api/setting/vacation';

  const emit = defineEmits(['register', 'reload']);

  //-modal title
  const title = ref('');

  //-折疊面板key
  const activeKey = ref<number[]>([]);

  //-schedule data
  const scheduleData = reactive<VacationScheduleModel[]>([]);

  //-當前日期
  const currDate = ref<Dayjs>(dayjs());

  //-ScheduleModal註冊
  const [registerScheduleDrawer, scheduleMethod] = useDrawer();

  //-ConfirmModal註冊
  const [registerConfirmModal, confirmMethod] = useModal();

  //-modal入口
  const [registerModal, { closeModal, changeLoading }] = useModalInner((data) => {
    title.value = data.date.format('YYYY-MM-DD');
    currDate.value = data.date;

    reset();
    data.schedule.forEach((schedule) => {
      scheduleData.push(schedule);
    });

    if (scheduleData.length > 0) {
      activeKey.value = [scheduleData[0].ID];
    }
  });

  /**
   * @description 成功
   */
  const handleSuccess = async () => {
    useMessage().createMessage.success({ content: '操作成功' });
    //-reload true
    changeLoading(true);
    emit('reload', currDate.value);
  };

  /**
   * @description 提交
   */
  const handleSubmit = () => {
    closeModal();
  };

  /**
   * @description 點擊新增
   */
  const handleCreate = () => {
    scheduleMethod.openDrawer(true, { isUpdate: false, date: currDate });
  };

  /**
   * @description 編輯
   * @param record VacationScheduleModel
   */
  const handleEdit = (record: VacationScheduleModel) => {
    scheduleMethod.openDrawer(true, { isUpdate: true, record });
  };

  /**
   * @description 刪除
   * @param record
   */
  const handleDelete = async (record: VacationScheduleModel, deleteType?: 'all' | 'one') => {
    if (record.repeat && record.repeat !== 'none' && !deleteType) {
      confirmMethod.openModal(true, { schedule: record });
      return;
    }

    try {
      changeLoading(true);
      if (!deleteType || (deleteType && deleteType === 'one')) {
        await deleteVacationSchedule(record.ID, false);
      } else {
        await deleteVacationSchedule(record.ID, true);
      }
      useMessage().createMessage.success({ content: '刪除成功' });
      changeLoading(true);
      emit('reload', currDate.value);
    } finally {
      console.error('刪除失敗');
    }
  };

  /**
   * @description reset
   */
  const reset = () => {
    while (scheduleData.length !== 0) {
      scheduleData.pop();
    }
  };

  /**
   * @description 更新資料
   * @param schedule
   */
  const updateData = (schedule: VacationScheduleModel[]) => {
    //-emit reload之後, 最後一關在這
    reset();
    schedule.forEach((e) => {
      scheduleData.push(e);
    });
    //-reload false
    changeLoading(false);
  };

  defineExpose({ updateData });
</script>
