#!/usr/bin/env node

/**
 * 手动测试脚本 - 用于测试 biz-napi 的输入事件监听功能
 * 
 * 使用方法:
 * 1. 先运行 npm run build 构建项目
 * 2. 然后运行 npm run test:manual 或 node test-manual.js
 * 3. 移动鼠标、点击或按键，观察控制台输出
 * 4. 按 Ctrl+C 退出测试
 */

const { onInputEvent } = require('../dist/index.js');

console.log('🚀 开始监听输入事件...');
console.log('📝 说明:');
console.log('  - 移动鼠标会显示 MouseMove 事件');
console.log('  - 点击鼠标会显示 ButtonPress/ButtonRelease 事件'); 
console.log('  - 按键会显示 KeyPress/KeyRelease 事件');
console.log('  - 滚轮滚动会显示 Wheel 事件');
console.log('  - 按 Ctrl+C 退出测试\n');

let eventCount = 0;
let lastMouseMoveTime = 0;

// 监听输入事件
onInputEvent((event) => {
  eventCount++;
  
  // 限制鼠标移动事件的输出频率，避免刷屏
  if (event.event.type === 'MouseMove') {
    const now = Date.now();
    if (now - lastMouseMoveTime < 100) { // 限制每100ms输出一次鼠标移动
      return;
    }
    lastMouseMoveTime = now;
  }
  
  // 格式化时间戳
  const timestamp = new Date(event.time.secs_since_epoch * 1000).toLocaleTimeString();
  
  // 根据事件类型显示不同的信息
  let eventInfo = '';
  switch (event.event.type) {
    case 'KeyPress':
      eventInfo = `🎹 按键按下: ${event.event.value} ${event.name ? `(${event.name})` : ''}`;
      break;
    case 'KeyRelease':
      eventInfo = `🎹 按键释放: ${event.event.value}`;
      break;
    case 'ButtonPress':
      eventInfo = `🖱️  鼠标按下: ${event.event.value}`;
      break;
    case 'ButtonRelease':
      eventInfo = `🖱️  鼠标释放: ${event.event.value}`;
      break;
    case 'MouseMove':
      eventInfo = `🖱️  鼠标移动: (${event.event.value.x}, ${event.event.value.y})`;
      break;
    case 'Wheel':
      eventInfo = `🎡 滚轮滚动: dx=${event.event.value.delta_x}, dy=${event.event.value.delta_y}`;
      break;
    default:
      eventInfo = `❓ 未知事件: ${event.event.type}`;
  }
  
  console.log(`[${timestamp}] #${eventCount} ${eventInfo}`);
});

// 处理程序退出
process.on('SIGINT', () => {
  console.log(`\n\n✅ 测试完成！共监听到 ${eventCount} 个事件`);
  console.log('👋 感谢使用 biz-napi!');
  process.exit(0);
});

// 保持程序运行
console.log('⏳ 监听中... (移动鼠标或按键来测试)');
