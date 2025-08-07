# `@lie5860/biz-napi`

## 功能介绍

本项目是一个 Node.js 原生模块，提供了监听键盘和鼠标事件的功能。通过 `onInputEvent` 函数，您可以监听并处理各种输入事件。

## 安装

```bash
npm install @lie5860/biz-napi
```

## 使用方法

### onInputEvent: 键鼠事件监听

监听键盘和鼠标输入事件。

#### 入参示例

```js
(event: MouseKeyBoardEvent) => void;
```

- callback: function 监听输入事件的函数

#### event object 示例

```json
{
  "time": { "secs_since_epoch": 1695999163, "nanos_since_epoch": 631148700 }, // 触发时间
  "name": "a", // 输入内容
  "event": { 
    "type":"KeyPress", // 事件类型
    "value": "KeyA" // 事件值
  } 
}
```

#### 事件类型说明

- `KeyPress`: 键盘按键按下事件
- `KeyRelease`: 键盘按键释放事件
- `ButtonPress`: 鼠标按键按下事件
- `ButtonRelease`: 鼠标按键释放事件
- `MouseMove`: 鼠标移动事件
- `Wheel`: 鼠标滚轮事件

#### 示例代码

```js
import { onInputEvent } from '@lie5860/biz-napi';

onInputEvent((event) => {
  console.log('Received event:', event);
});
```