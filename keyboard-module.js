// 导入依赖
import { defaultPinyinMap } from './pinyin-data.js';
import { KeyboardElements } from './keyboard-elements.js';
import { ScaleManager } from './scale-manager.js';

// 键盘模块
export const KeyboardModule = (function() {
    // 私有状态
    const state = {
        pinyinMap: {},
        currentInput: '',
        isUpperCase: false,
        isChineseMode: true,
        selectedIndex: -1,
        displayText: '',
        isSymbolKeyboard: false,
        isMathKeyboard: false,
        isNumberKeyboard: false,
        isPredictionPanelVisible: false,
        currentPredictionPage: 0,
        allPredictions: []
    };

    // 初始化函数
    async function init() {
        try {
            const response = await fetch('pinyin-mapping.json');
            if (!response.ok) {
                throw new Error('无法加载拼音映射文件');
            }
            state.pinyinMap = await response.json();
            console.log('成功加载拼音映射文件');
        } catch (error) {
            console.error('加载拼音映射文件出错:', error);
            state.pinyinMap = defaultPinyinMap;
        }

        // 初始化缩放控制
        ScaleManager.init();

        // 初始化其他功能
        initializeEventListeners();
    }

    // 初始化事件监听器
    function initializeEventListeners() {
        // 这里添加键盘事件监听器
    }

    // 公共接口
    return {
        init,
        // 其他公共方法
    };
})(); 