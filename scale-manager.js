// 导入DOM元素
import { KeyboardElements } from './keyboard-elements.js';

// 键盘缩放管理模块
export const ScaleManager = (function() {
    const config = {
        MIN_SCALE: 0.5,
        MAX_SCALE: 1.5,
        SCALE_STEP: 0.05,
        DEFAULT_SCALE: 1
    };

    const state = {
        scale: config.DEFAULT_SCALE
    };

    function updateScale() {
        KeyboardElements.keyboard.style.transform = `scale(${state.scale})`;
        KeyboardElements.input.style.transform = `scale(${state.scale})`;
        KeyboardElements.scaleValue.textContent = `${Math.round(state.scale * 100)}%`;
    }

    function init() {
        KeyboardElements.scaleUp.addEventListener('click', () => {
            if (state.scale < config.MAX_SCALE) {
                state.scale = Math.min(state.scale + config.SCALE_STEP, config.MAX_SCALE);
                updateScale();
            }
        });

        KeyboardElements.scaleDown.addEventListener('click', () => {
            if (state.scale > config.MIN_SCALE) {
                state.scale = Math.max(state.scale - config.SCALE_STEP, config.MIN_SCALE);
                updateScale();
            }
        });

        updateScale();
    }

    function getScale() {
        return state.scale;
    }

    function setScale(newScale) {
        state.scale = Math.min(Math.max(newScale, config.MIN_SCALE), config.MAX_SCALE);
        updateScale();
    }

    function resetScale() {
        state.scale = config.DEFAULT_SCALE;
        updateScale();
    }

    return {
        init,
        getScale,
        setScale,
        resetScale
    };
})(); 