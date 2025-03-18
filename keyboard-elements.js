// 键盘DOM元素管理模块
export const KeyboardElements = {
    keyboard: document.querySelector('.keyboard-container'),
    input: document.querySelector('.input-display-area'),
    symbolKeyboard: document.querySelector('.symbol-keyboard'),
    mathKeyboard: document.querySelector('.math-keyboard'),
    numberKeyboard: document.querySelector('.number-keyboard'),
    keyboardSystem: document.querySelector('.keyboard-system'),
    inputPreview: document.querySelector('.input-preview'),
    pinyinDisplay: document.querySelector('.pinyin-display'),
    wordSuggestions: document.querySelector('.word-suggestions'),
    inputText: document.querySelector('#inputText'),
    pinyinInput: document.querySelector('#pinyinInput'),
    dropdownButton: document.querySelector('.dropdown-button'),
    predictionPanel: document.querySelector('.prediction-panel'),
    predictionRows: [
        document.querySelector('#prediction-row-1'),
        document.querySelector('#prediction-row-2'),
        document.querySelector('#prediction-row-3'),
        document.querySelector('#prediction-row-4')
    ],
    backspaceBtn: document.querySelector('.backspace-btn'),
    upBtn: document.querySelector('.up-btn'),
    downBtn: document.querySelector('.down-btn'),
    returnBtn: document.querySelector('.return-btn'),
    scaleUp: document.getElementById('scaleUp'),
    scaleDown: document.getElementById('scaleDown'),
    scaleValue: document.getElementById('scaleValue')
}; 