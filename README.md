# `@lie5860/biz-napi`


onInputEvent: 键鼠事件监听

##### 入参 eg 

```js
(event: MouseKeyBoardEvent) => void;
```

- callback: function 监听输入事件的函数

##### event object eg

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
