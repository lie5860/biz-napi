#!/usr/bin/env node

/**
 * 高级测试脚本 - 提供更多测试选项和统计功能
 * 
 * 使用方法:
 * node test-advanced.js [选项]
 * 
 * 选项:
 *   --filter=type    只显示特定类型的事件 (KeyPress, KeyRelease, ButtonPress, ButtonRelease, MouseMove, Wheel)
 *   --no-mouse-move  不显示鼠标移动事件
 *   --stats          显示事件统计信息
 *   --json           以 JSON 格式输出事件
 *   --help           显示帮助信息
 */

const { onInputEvent } = require('../dist/index.js');

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  filter: null,
  noMouseMove: false,
  stats: false,
  json: false,
  help: false
};

args.forEach(arg => {
  if (arg.startsWith('--filter=')) {
    options.filter = arg.split('=')[1];
  } else if (arg === '--no-mouse-move') {
    options.noMouseMove = true;
  } else if (arg === '--stats') {
    options.stats = true;
  } else if (arg === '--json') {
    options.json = true;
  } else if (arg === '--help') {
    options.help = true;
  }
});

// 显示帮助信息
if (options.help) {
  console.log(`
🔧 biz-napi 高级测试脚本

使用方法:
  node test-advanced.js [选项]

选项:
  --filter=type      只显示特定类型的事件
                     可选值: KeyPress, KeyRelease, ButtonPress, ButtonRelease, MouseMove, Wheel
  --no-mouse-move    不显示鼠标移动事件（避免刷屏）
  --stats            每5秒显示一次事件统计信息
  --json             以 JSON 格式输出事件（便于后续处理）
  --help             显示此帮助信息

示例:
  node test-advanced.js --filter=KeyPress              # 只显示按键按下事件
  node test-advanced.js --no-mouse-move --stats        # 不显示鼠标移动，显示统计
  node test-advanced.js --json > events.json           # 将事件保存为 JSON 文件

按 Ctrl+C 退出测试
  `);
  process.exit(0);
}

// 事件统计
const eventStats = {
  KeyPress: 0,
  KeyRelease: 0,
  ButtonPress: 0,
  ButtonRelease: 0,
  MouseMove: 0,
  Wheel: 0,
  total: 0
};

// 按键统计
const keyStats = {};
const buttonStats = {};

let startTime = Date.now();
let lastMouseMoveTime = 0;

console.log('🚀 高级测试模式启动...');
if (!options.json) {
  console.log(`📝 配置: ${JSON.stringify(options, null, 2)}`);
  console.log('⏳ 监听中...\n');
}

// 监听输入事件
onInputEvent((event) => {
  const eventType = event.event.type;
  
  // 应用过滤器
  if (options.filter && eventType !== options.filter) {
    return;
  }
  
  // 过滤鼠标移动事件
  if (options.noMouseMove && eventType === 'MouseMove') {
    return;
  }
  
  // 限制鼠标移动事件频率
  if (eventType === 'MouseMove') {
    const now = Date.now();
    if (now - lastMouseMoveTime < 100) {
      return;
    }
    lastMouseMoveTime = now;
  }
  
  // 更新统计
  eventStats[eventType]++;
  eventStats.total++;
  
  // 按键统计
  if (eventType === 'KeyPress' || eventType === 'KeyRelease') {
    const key = event.event.value;
    keyStats[key] = (keyStats[key] || 0) + 1;
  }
  
  // 鼠标按钮统计
  if (eventType === 'ButtonPress' || eventType === 'ButtonRelease') {
    const button = event.event.value;
    buttonStats[button] = (buttonStats[button] || 0) + 1;
  }
  
  if (options.json) {
    // JSON 输出模式
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: event,
      eventCount: eventStats.total
    }));
  } else {
    // 普通输出模式
    const timestamp = new Date(event.time.secs_since_epoch * 1000).toLocaleTimeString();
    
    let eventInfo = '';
    switch (eventType) {
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
        eventInfo = `❓ 未知事件: ${eventType}`;
    }
    
    console.log(`[${timestamp}] #${eventStats.total} ${eventInfo}`);
  }
});

// 定期显示统计信息
if (options.stats && !options.json) {
  setInterval(() => {
    const runtime = Math.floor((Date.now() - startTime) / 1000);
    console.log('\n📊 事件统计 (过去时间):');
    console.log(`⏱️  运行时间: ${runtime}秒`);
    console.log(`📈 总事件数: ${eventStats.total}`);
    
    Object.keys(eventStats).forEach(type => {
      if (type !== 'total' && eventStats[type] > 0) {
        console.log(`   ${type}: ${eventStats[type]}`);
      }
    });
    
    if (Object.keys(keyStats).length > 0) {
      console.log('🎹 按键统计:');
      Object.entries(keyStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([key, count]) => {
          console.log(`   ${key}: ${count}`);
        });
    }
    
    if (Object.keys(buttonStats).length > 0) {
      console.log('🖱️  鼠标按钮统计:');
      Object.entries(buttonStats).forEach(([button, count]) => {
        console.log(`   ${button}: ${count}`);
      });
    }
    
    console.log('');
  }, 5000);
}

// 处理程序退出
process.on('SIGINT', () => {
  if (!options.json) {
    const runtime = Math.floor((Date.now() - startTime) / 1000);
    console.log('\n\n✅ 测试完成！');
    console.log(`⏱️  总运行时间: ${runtime}秒`);
    console.log(`📈 总事件数: ${eventStats.total}`);
    
    console.log('\n📊 最终统计:');
    Object.keys(eventStats).forEach(type => {
      if (type !== 'total' && eventStats[type] > 0) {
        console.log(`   ${type}: ${eventStats[type]}`);
      }
    });
    
    if (Object.keys(keyStats).length > 0) {
      console.log('\n🎹 最常用按键:');
      Object.entries(keyStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([key, count]) => {
          console.log(`   ${key}: ${count}`);
        });
    }
    
    console.log('\n👋 感谢使用 biz-napi!');
  }
  process.exit(0);
});
