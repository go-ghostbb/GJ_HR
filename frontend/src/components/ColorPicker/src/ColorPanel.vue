<template>
  <div class="modal hu-color-picker">
    <div class="color-panel">
      <!-- 默认颜色列表选择区 -->
      <ul class="colors color-box">
        <li
          v-for="item in colorsDefault"
          :key="item"
          class="item"
          :style="{ background: item }"
          @click="selectColor(item)"
        ></li>
      </ul>
      <div class="color-set">
        <!-- 颜色面板 -->
        <div class="saturation" @mousedown.prevent.stop="selectSaturation">
          <canvas ref="canvasSaturationRef" width="150" height="80"></canvas>
          <div :style="position.pointPosition" class="slide"></div>
        </div>
        <!-- 颜色卡条 -->
        <div class="hue" @mousedown.prevent.stop="selectHue">
          <canvas ref="canvasHueRef" width="12" height="80"></canvas>
          <div :style="position.slideHueStyle" class="slide"></div>
        </div>
      </div>
    </div>
    <!-- 颜色预览和颜色输入 -->
    <div class="color-view">
      <!-- 颜色预览区 -->
      <div :style="{ background: rgbString }" class="color-show"></div>
      <!-- 颜色输入区 -->
      <div class="input">
        <div class="color-type">
          <span class="name"> HEX </span>
          <input v-model="attr.modelHex" class="value" @blur="inputHex" />
        </div>
        <div class="color-type">
          <span class="name"> RGB </span>
          <input v-model="attr.modelRgb" class="value" @blur="inputRgb" />
        </div>
      </div>
    </div>
    <div class="btn">
      <Button class="cancel" @click="emits('cancel')">取消</Button>
      <Button class="confirm" @click="changeColor">確認</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, nextTick, onMounted, watch } from 'vue';
  import { Button } from 'ant-design-vue';
  import { rgb2hex, createLinearGradient, hex2rgb, rgb2hsv, isHex, isRgb } from './ColorPicker';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '#000000',
    },
  });
  const emits = defineEmits(['update:modelValue', 'ok', 'cancel']);
  defineExpose({ reset });
  const firstTime = ref(true);

  // 默认颜色列表
  const colorsDefault = reactive([
    '#ff7e79',
    '#fefe7f',
    '#00ff81',
    '#007ffe',
    '#ff80c0',
    '#ff0104',
    '#00fcff',
    '#847cc2',
    '#fe00fe',
    '#7e0101',
    '#fc7f01',
    '#027e04',
    '#65b2f3',
    '#f9b714',
    '#068081',
    '#8305a1',
    '#b0cf29',
    '#0bfa49',
    '#9e255e',
    '#ffffff',
  ]);
  const canvasSaturationRef = ref(null);
  const canvasHueRef = ref(null);
  const position = reactive({
    pointPosition: {
      top: '0px',
      left: '0px',
    },
    slideHueStyle: {},
  });
  const attr = reactive({
    modelRgb: '',
    modelHex: '',
    r: 0,
    g: 0,
    b: 0,
    h: 0,
    s: 0,
    v: 0,
  });
  const rgbString = computed(() => {
    return `rgb(${attr.r}, ${attr.g}, ${attr.b})`;
  });

  // 渲染面板颜色
  const renderSaturationColor = (color: string) => {
    const canvas: any = canvasSaturationRef.value;
    const height = canvas.height;
    const width = canvas.width;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    createLinearGradient('l', ctx, width, height, '#FFFFFF', 'rgba(255,255,255,0)');
    createLinearGradient('p', ctx, width, height, 'rgba(0,0,0,0)', '#000000');
  };
  // 颜色面板点击
  const selectSaturation = (e: MouseEvent) => {
    const canvas: any = canvasSaturationRef.value;
    const height = canvas.height;
    const width = canvas.width;
    let x = e.offsetX,
      y = e.offsetY;
    if (x < 0) x = 0;
    if (x > width) x = width;
    if (y < 0) y = 0;
    if (y > height) y = height;
    position.pointPosition = {
      top: y - 5 + 'px',
      left: x - 5 + 'px',
    };
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(Math.max(x - 5, 0), Math.max(0, y - 5), 1, 1);
    setRGBHSV(imageData.data);
    attr.modelHex = rgb2hex({ r: attr.r, g: attr.g, b: attr.b }, true);
  };

  // 渲染调色器颜色
  const renderHueColor = () => {
    const canvas: any = canvasHueRef.value;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#FF0000'); // red
    gradient.addColorStop(0.17 * 1, '#FF00FF'); // purple
    gradient.addColorStop(0.17 * 2, '#0000FF'); // blue
    gradient.addColorStop(0.17 * 3, '#00FFFF'); // green
    gradient.addColorStop(0.17 * 4, '#00FF00'); // green
    gradient.addColorStop(0.17 * 5, '#FFFF00'); // yellow
    gradient.addColorStop(1, '#FF0000'); // red
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };
  // 颜色条选中
  const selectHue = (e: any) => {
    const canvas: any = canvasHueRef.value;
    const { top: hueTop, height } = canvas.getBoundingClientRect();
    const ctx = e.target.getContext('2d');
    const mousemove = (e: any) => {
      let y = e.clientY - hueTop;
      if (y < 0) y = 0;
      if (y > height) y = height;
      position.slideHueStyle = {
        top: y - 2 + 'px',
      };
      // 先获取颜色条上的颜色在颜色面板上进行渲染
      const imgData = ctx.getImageData(0, Math.min(y, height - 1), 1, 1);
      const [r, g, b] = imgData.data;
      renderSaturationColor(`rgb(${r},${g},${b})`);
      // 再根据颜色面板上选中的点的颜色，来修改输入框的值
      nextTick(() => {
        const canvas: any = canvasSaturationRef.value;
        const ctx = canvas.getContext('2d');
        const pointX = parseFloat(position.pointPosition.left);
        const pointY = parseFloat(position.pointPosition.top);
        const pointRgb = ctx.getImageData(Math.max(0, pointX), Math.max(0, pointY), 1, 1);
        setRGBHSV(pointRgb.data);
        attr.modelHex = rgb2hex({ r: attr.r, g: attr.g, b: attr.b }, true);
      });
    };
    mousemove(e);
    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  // 默认颜色选择区选择颜色
  function selectColor(color: string) {
    setRGBHSV(color);
    attr.modelRgb = rgbString.value.substring(4, rgbString.value.length - 1);
    attr.modelHex = rgb2hex({ r: attr.r, g: attr.g, b: attr.b }, true);
    renderSaturationColor(rgbString.value);
    position.pointPosition = {
      left: Math.max(attr.s * 150 - 5, 0) + 'px',
      top: Math.max((1 - attr.v) * 80 - 5, 0) + 'px',
    };
    renderSlide();
  }

  // 调色卡的位置
  const renderSlide = () => {
    position.slideHueStyle = {
      top: (1 - attr.h / 360) * 78 + 'px',
    };
  };

  // hex输入框失去焦点
  function inputHex() {
    if (isHex(attr.modelHex)) {
      selectColor(attr.modelHex);
    } else {
      alert('请输入3位或者6位合法十六进制值');
    }
  }
  function inputRgb() {
    if (isRgb(attr.modelRgb)) {
      const [r, g, b] = attr.modelRgb.split(',');
      const hex = rgb2hex({ r, g, b }, true);
      attr.modelHex = hex;
      selectColor(attr.modelHex);
    } else {
      alert('请输入合法的rgb数值');
    }
  }

  // color可能是 #fff 也可能是 123,21,11  这两种格式
  function setRGBHSV(color: any, initHex = false) {
    let rgb: any = { r: '0', g: '0', b: '0' };
    if (typeof color !== 'string') {
      rgb = { r: color[0], g: color[1], b: color[2] };
    } else {
      if (!color.includes('#')) {
        const [r, g, b] = color.split(',');
        rgb = { r: r, g: g, b: b };
      } else {
        rgb = hex2rgb(color);
      }
    }
    const hsv = rgb2hsv(rgb);
    attr.r = rgb.r;
    attr.g = rgb.g;
    attr.b = rgb.b;
    attr.h = hsv.h;
    attr.s = hsv.s;
    attr.v = hsv.v;
    if (initHex) attr.modelHex = rgb2hex(rgb, true);
    attr.modelRgb = rgbString.value.substring(4, rgbString.value.length - 1);
  }

  // 确认选择的颜色
  function changeColor() {
    if (!isHex(attr.modelHex) || !isRgb(attr.modelRgb)) {
      return;
    } else {
      emits('update:modelValue', attr.modelHex);
      emits('ok');
    }
  }

  function reset() {
    if (!firstTime.value) {
      selectColor(props.modelValue);
      renderHueColor();
    }
  }

  watch(
    () => props.modelValue,
    (newVal, _) => {
      selectColor(newVal);
    },
  );

  onMounted(() => {
    selectColor(props.modelValue);
    renderHueColor();
    firstTime.value = false;
  });
</script>

<style lang="scss">
  .hu-color-picker {
    z-index: 1;
    border-radius: 4px;
    background: #242c3e;
    box-shadow: 0 0 16px 0 rgb(0 0 0 / 16%);

    canvas {
      vertical-align: top;
    }

    .color-set {
      display: flex;
      margin-left: 5px;
      padding: 8px 0 8px 8px;
      border-left: 1px solid #323e53;
    }

    .color-show {
      display: flex;
      width: 100px;
      height: 56px;
      margin: 8px auto;
    }
  }

  .color-panel {
    display: flex;
    padding: 8px 8px 0;

    .color-box {
      width: 100px;
    }
  }

  .color-view {
    display: flex;
    padding: 0 8px;
  }

  .input {
    flex: 1;
    margin-left: 8px;
  }

  .saturation {
    position: relative;
    cursor: pointer;

    .slide {
      position: absolute;
      top: 0;
      left: 100px;
      width: 8px;
      height: 8px;
      border: 1px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 1px 1px rgb(0 0 0 / 30%);
      pointer-events: none;
    }
  }

  .hue {
    position: relative;
    margin-left: 8px;
    cursor: pointer;

    .slide {
      position: absolute;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: 4px;
      border: 1px solid #f0f0f0;
      border-radius: 1px;
      background: #fff;
      box-shadow: 0 0 2px rgb(0 0 0 / 60%);
      pointer-events: none;
    }
  }

  .color-type {
    display: flex;
    margin: 8px auto;
    font-size: 12px;

    .name {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 24px;
      float: left;
      color: #a0acc0;
    }

    .value {
      display: block;
      box-sizing: border-box;
      flex: 1;
      width: 100px;
      height: 24px;
      padding: 0 8px;
      border: 1px solid #42516c;
      background: #2e3850;
      color: #eff0f4;
      caret-color: #49a4ff;

      &:focus-visible {
        outline: 1px solid rgb(18 107 190 / 50%);
      }
    }
  }

  .colors {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;

    .item {
      display: inline-block;
      box-sizing: border-box;
      flex-basis: calc(20% - 4px);
      width: 16px;
      height: 16px;
      margin: 2px;
      transition: all 0.1s;
      border-radius: 1px;
      vertical-align: top;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  .btn {
    margin-top: 0;
    padding: 8px;
    border-top: 1px solid #323e53;
    text-align: right;

    button {
      width: 52px;
      height: 20px;
      margin-left: 8px;
      padding: 0;
      border: none;
      border-radius: 2px;
      color: #fff;
      font-size: 12px;
      font-weight: 400;

      //#2a7dc9
      &.confirm {
        background-color: #49a4ff;

        &:not(:disabled):hover {
          background-color: #2a7dc9;
          color: #fff;
        }

        &:not(:disabled):active {
          background-color: #035db0;
        }
      }

      &.cancel {
        background-color: #ff4d4d;

        &:not(:disabled):hover {
          background-color: #d71414;
          color: #fff;
        }

        &:not(:disabled):active {
          background-color: #c10202;
        }
      }
    }
  }
</style>
