// 导入键盘模块
import { KeyboardModule } from './keyboard-module.js';

// 当DOM加载完成时初始化键盘
document.addEventListener('DOMContentLoaded', () => {
    KeyboardModule.init().catch(error => {
        console.error('键盘初始化失败:', error);
    });
}); 