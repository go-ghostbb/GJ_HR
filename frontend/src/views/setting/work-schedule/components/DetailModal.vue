<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { WorkScheduleModel } from '@/api/setting/model/workShiftModel';
  import { reactive, ref } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { Badge, Button, Col, Collapse, CollapsePanel, Popconfirm, Row } from 'ant-design-vue';
  import { Description } from '@/components/Description';
  import { workShiftDescSchema } from './data';
  import { deleteWorkSchedule } from '@/api/setting/workShift';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'reload']);

  //-modal title
  const title = ref('');

  //-schedule data
  const scheduleData = reactive<WorkScheduleModel[]>([]);

  //-折疊面板key
  const activeKey = ref<number[]>([]);

  //-當前日期
  const currDate = ref<Dayjs>(dayjs());

  //-modal入口
  const [registerModal, { closeModal, changeLoading }] = useModalInner(
    (data: { date: Dayjs; schedule: WorkScheduleModel[] }) => {
      reset();
      title.value = data.date.format('YYYY-MM-DD');
      currDate.value = data.date;

      data.schedule.forEach((item) => {
        scheduleData.push(item);
      });
    },
  );

  /**
   * @description submit
   */
  const handleSubmit = () => {
    console.log('submit');
    closeModal();
  };

  /**
   * @description 刪除schedule
   * @param schedule
   */
  const handleDelete = (schedule: WorkScheduleModel) => {
    changeLoading(true);
    deleteWorkSchedule(schedule.ID)
      .then(() => {
        useMessage().createMessage.success({ content: '刪除成功' });
        emit('reload', currDate.value);
      })
      .catch((error) => console.error('刪除失敗', error));
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
  const updateData = (schedule: WorkScheduleModel[]) => {
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

<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :minHeight="350"
    width="700px"
    @ok="handleSubmit"
  >
    <!-- title -->
    <template #title>
      <span>{{ title }}</span>
    </template>

    <Collapse v-model:activeKey="activeKey">
      <CollapsePanel v-for="schedule in scheduleData" :key="schedule.ID">
        <!-- header -->
        <template #header>
          <Badge :color="schedule.workShift?.color" :text="schedule.workShift?.name" />
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
              <!-- 刪除按鈕 -->
              <Popconfirm title="確認刪除?" @confirm="handleDelete(schedule)">
                <Button class="ml-2" type="primary" danger size="small">
                  {{ '刪除' }}
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </div>

        <Description :column="1" :schema="workShiftDescSchema" :data="schedule.workShift" />
      </CollapsePanel>
    </Collapse>
  </BasicModal>
</template>

<style scoped lang="less"></style>
