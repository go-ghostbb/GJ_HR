<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="400px"
    @ok="handleSubmit"
  >
    <template #title>
      <span>{{ '設定權限' }}</span>
      <Button class="ml-2" size="small" @click="reload">刷新</Button>
    </template>

    <Tabs v-model:activeKey="tabActiveKey">
      <TabPane :key="authType.MENUSOFTWARE" tab="菜單(軟體端)">
        <Tree :treeData="menusSoftwareNode" checkable v-model:checkedKeys="menuSoftwareChecked" />
      </TabPane>

      <TabPane :key="authType.MENUWEB" tab="菜單(網頁端)">
        <Tree :treeData="menusWebNode" checkable v-model:checkedKeys="menuWebChecked" />
      </TabPane>

      <TabPane :key="authType.PERM" tab="權限標示">
        <Button class="mb-2" size="small" @click="permSelectAll()">
          {{ '選擇全部' }}
        </Button>
        <Button class="mb-2 ml-1" size="small" @click="permCancelAll()">
          {{ '取消全部' }}
        </Button>
        <CheckboxGroup v-model:value="permChecked" style="width: 100%">
          <Collapse v-model:active-key="collapseActiveKey" style="width: 100%">
            <!-- 遍歷permOptionMap -->
            <!-- 使用CollapsePanel(折疊面板)顯示資料 -->
            <CollapsePanel
              v-for="([permKey, permOptions], key) in permOptionMap"
              :key="key"
              :forceRender="true"
            >
              <template #header>
                <div class="flex justify-between">
                  <div>
                    <span>{{ permKey }}</span>
                  </div>
                  <div>
                    <span>{{ countChecked(permOptions) }}/{{ permOptions.length }}</span>
                  </div>
                </div>
              </template>

              <!-- 這裡是折疊面板裡面的數據 -->
              <Button class="mb-2" size="small" @click="permSelectAll(permOptions)">
                {{ '選擇全部' }}
              </Button>
              <Button class="mb-2 ml-1" size="small" @click="permCancelAll(permOptions)">
                {{ '取消全部' }}
              </Button>
              <Row>
                <Col v-for="(permOption, index) in permOptions" :key="index" span="24">
                  <!-- 遍歷permOption -->
                  <!-- 根據option顯示checkbox -->
                  <Checkbox :key="index" :value="permOption.value">
                    {{ permOption.label }}({{ permOption.perm }})
                  </Checkbox>
                </Col>
              </Row>
            </CollapsePanel>
          </Collapse>
        </CheckboxGroup>
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { getMenuByKeyword } from '@/api/manager/menu';
  import { MenuModel, ShowType } from '@/api/manager/model/menuModel';
  import { PermissionModel } from '@/api/manager/model/permissionModel';
  import { getPermByKeyword } from '@/api/manager/permission';
  import { setMenu, setPerm } from '@/api/manager/role';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import {
    TabPane,
    Tabs,
    Tree,
    TreeProps,
    CheckboxGroup,
    Checkbox,
    Collapse,
    CollapsePanel,
    Row,
    Col,
    Button,
  } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';

  const emit = defineEmits(['success', 'register']);

  enum authType {
    MENUSOFTWARE = 'menuSoftware',
    MENUWEB = 'menuWeb',
    PERM = 'perm',
  }

  interface option {
    perm: string;
    label: string;
    value: number;
  }

  //-當前tab key
  const tabActiveKey = ref<authType>(authType.MENUSOFTWARE);

  //-menu treeNode
  const menusSoftwareNode = ref<TreeProps['treeData']>([]);
  const menusWebNode = ref<TreeProps['treeData']>([]);

  //-已選擇的menu
  const menuSoftwareChecked = ref<number[]>([]);
  const menuWebChecked = ref<number[]>([]);

  //-當前collapse key
  const collapseActiveKey = ref<number>();

  //-permission option
  const permOptionMap = ref<Map<string, option[]>>(new Map<string, option[]>());

  //-已選擇的permission
  const permChecked = ref<number[]>([]);

  //-當前ID
  const id = ref<number>(0);

  //-drawer入口
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner((data) => {
    tabActiveKey.value = authType.MENUSOFTWARE;
    collapseActiveKey.value = undefined;
    menuSoftwareChecked.value = data.menuId.software;
    menuWebChecked.value = data.menuId.web;
    permChecked.value = data.permId;
    id.value = data.id;
  });

  //-提交
  const handleSubmit = async () => {
    try {
      setDrawerProps({ confirmLoading: true });

      //-更新可用menu
      await setMenu(id.value, [...menuSoftwareChecked.value, ...menuWebChecked.value]);

      //-更新可用perm
      await setPerm(id.value, permChecked.value);

      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  /**
   * @description 將MenuModel[]轉換為TreeProps['treeData']
   * @param menus
   */
  const convertDataNode = (menus: MenuModel[]): TreeProps['treeData'] => {
    // 使用BFS(廣度優先搜尋演算法)
    // 這裡是陣列樹, 第一層搜尋會有差別外, 其餘演算法一樣

    const result: TreeProps['treeData'] = [];

    const menuQueue: MenuModel[] = [];
    const optionQueue: TreeProps['treeData'] = [];

    // 一棵樹情況下只需放入root
    // 但這邊是陣列的樹, 這邊對演算法做一點修改
    // 使用迴圈將每棵樹的root放入
    // 模擬將陣列樹合併, 利用迴圈偽造出一個root

    //-第一層遍歷(root遍歷)
    menus.forEach((e) => {
      //-只放入type為資料夾
      result.push({ title: e.meta?.title, key: e.ID });

      if (e.children) {
        //-如果有子節點的話
        const lastSeletOption = result[result.length - 1];
        lastSeletOption.children = []; //-初始化
        //-遍歷子節點, 分別塞入queue
        e.children.forEach((child) => {
          menuQueue.push(child);
          if (lastSeletOption.children) {
            //-每遍歷一個option裡也要塞入一個
            lastSeletOption.children.push({ title: '', key: 0 });
            //-放入上行建立的物件(指針)
            optionQueue.push(lastSeletOption.children[lastSeletOption.children.length - 1]);
          }
        });
      }
    });

    //-queue
    while (menuQueue.length !== 0) {
      const menuTemp = menuQueue.pop()!;

      const optionTemp = optionQueue.pop()!;
      optionTemp.title = menuTemp?.meta?.title;
      optionTemp.key = menuTemp?.ID;

      //-遍歷子節點, 做法跟遍歷root一樣
      if (menuTemp.children) {
        optionTemp.children = []; //-初始化
        menuTemp.children.forEach((child) => {
          menuQueue.push(child);
          if (optionTemp.children) {
            optionTemp.children.push({ title: '', key: 0 });
            //-一樣需放入指針
            optionQueue.push(optionTemp.children[optionTemp.children.length - 1]);
          }
        });
      }
    }

    return result;
  };

  /**
   * @description 將PermissionModel[]轉換為Map<string, option[]>
   * @param perms
   */
  const convertOptionMap = (perms: PermissionModel[]): Map<string, option[]> => {
    const result = new Map<string, option[]>();
    let key: string;

    perms.forEach((perm) => {
      //-perm.perm may be "employee:create"
      const sp = perm.perm?.split(':');
      if (sp) {
        if (sp.length > 1) {
          key = sp[0];
        } else {
          key = 'other';
        }

        if (result.has(key)) {
          //-key存在的話, 直接push
          result.get(key)!.push({ perm: perm.perm!, label: perm.name!, value: perm.ID });
        } else {
          //-key不存在, 建立一個
          result.set(key, [{ perm: perm.perm!, label: perm.name!, value: perm.ID }]);
        }
      }
    });

    return result;
  };

  /**
   * @description 重新fetch
   */
  const reload = async () => {
    setDrawerProps({ loading: true });
    menusSoftwareNode.value = convertDataNode(await getMenuByKeyword({ show: ShowType.SOFTWARE }));
    menusWebNode.value = convertDataNode(await getMenuByKeyword({ show: ShowType.WEB }));
    permOptionMap.value = convertOptionMap((await getPermByKeyword()).items);
    setDrawerProps({ loading: false });
  };

  /**
   * @description 選擇全部按鈕事件
   * @param permOptions
   */
  const permSelectAll = (permOptions?: option[]) => {
    if (permOptions) {
      permOptions.forEach((permOption) => {
        if (permChecked.value.indexOf(permOption.value) === -1) {
          permChecked.value.push(permOption.value);
        }
      });
    } else {
      permChecked.value = [];
      permOptionMap.value.forEach((options, _key) => {
        options.forEach((option) => {
          permChecked.value.push(option.value);
        });
      });
    }
  };

  /**
   * @description 取消全部按鈕事件
   * @param permOptions
   */
  const permCancelAll = (permOptions?: option[]) => {
    if (permOptions) {
      permOptions.forEach((permOption) => {
        permChecked.value.filter((value, index, arr) => {
          // If the value at the current array index matches the specified value (2)
          if (value === permOption.value) {
            // Removes the value from the original array
            arr.splice(index, 1);
            return true;
          }
          return false;
        });
      });
    } else {
      permChecked.value = [];
    }
  };

  /**
   * @description 計算permOptions裡有幾個被選中
   * @param permOptions
   */
  const countChecked = (permOptions: option[]): number => {
    let count = 0;
    permOptions.forEach((permOption) => {
      if (permChecked.value.indexOf(permOption.value) !== -1) {
        count++;
      }
    });
    return count;
  };

  //-初始化(init)
  onMounted(async () => {
    await reload();
  });
</script>
