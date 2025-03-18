// 引入拼音助手
// import { getCandidateWords } from './pinyin-helper.js';

document.addEventListener('DOMContentLoaded', () => {
    const keyboard = document.querySelector('.keyboard');
    const symbolKeyboard = document.querySelector('.symbol-keyboard');
    const mathKeyboard = document.querySelector('.math-keyboard');
    const numberKeyboard = document.querySelector('.number-keyboard');
    const keyboardContainer = document.querySelector('.keyboard-container');
    const keyboardSystem = document.querySelector('.keyboard-system');
    const inputPreview = document.querySelector('.input-preview');
    const pinyinDisplay = document.querySelector('.pinyin-display');
    const wordSuggestions = document.querySelector('.word-suggestions');
    const inputText = document.querySelector('#inputText');
    const pinyinInput = document.querySelector('#pinyinInput');
    // 添加预测字选择区域相关元素
    const dropdownButton = document.querySelector('.dropdown-button');
    const predictionPanel = document.querySelector('.prediction-panel');
    const predictionRows = [
        document.querySelector('#prediction-row-1'),
        document.querySelector('#prediction-row-2'),
        document.querySelector('#prediction-row-3'),
        document.querySelector('#prediction-row-4')
    ];
    const backspaceBtn = document.querySelector('.backspace-btn');
    const upBtn = document.querySelector('.up-btn');
    const downBtn = document.querySelector('.down-btn');
    const returnBtn = document.querySelector('.return-btn');
    
    let currentInput = '';
    let isUpperCase = false;
    let isChineseMode = true; // 默认中文模式
    let selectedIndex = -1; // 当前选中的候选词索引
    let displayText = ''; // 输入显示区域的文本
    let isSymbolKeyboard = false; // 是否显示符号键盘
    let isMathKeyboard = false; // 是否显示数学符号键盘
    let isNumberKeyboard = false; // 是否显示数字键盘
    // 添加预测字选择区域相关变量
    let isPredictionPanelVisible = false; // 是否显示预测字选择区域
    let currentPredictionPage = 0; // 当前预测字页码
    let allPredictions = []; // 所有预测字

    // 拼音输入法的映射表 - 保留作为备用
    let pinyinMap = {
        // 初始化一个空对象，将从JSON文件加载
    };

    // 英文单词预测映射表
    let englishMap = {
        // 初始化一个空对象，将从JSON文件加载
    };

    // 从外部JSON文件加载拼音映射表
    fetch('pinyin-mapping.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载拼音映射文件');
            }
            return response.json();
        })
        .then(data => {
            console.log('成功加载拼音映射文件');
            pinyinMap = data; // 用加载的数据替换pinyinMap
        })
        .catch(error => {
            console.error('加载拼音映射文件出错:', error);
            // 如果加载失败，使用默认的备用映射表
            pinyinMap = {
                'a': ['啊', '阿', '吖', '啊啊', '阿门', '阿姨', '啊哈', '啊呀'],
                'ai': ['爱', '艾', '埃', '哎', '爱情', '爱心', '爱好', '爱国'],
                'an': ['安', '按', '案', '暗', '安静', '安全', '安装', '安排'],
                'ang': ['昂', '盎', '昂扬', '盎然', '昂首', '昂贵', '盎司', '盎格鲁'],
                'ao': ['奥', '澳', '傲', '熬', '奥运', '奥秘', '奥妙', '傲慢'],
                'ba': ['八', '把', '爸', '吧', '白', '爸爸', '把手', '巴黎'],
                'bai': ['白', '百', '败', '拜', '摆', '白色', '百度', '白天'],
                'ban': ['班', '版', '半', '办', '板', '搬家', '班级', '办法'],
                'bang': ['帮', '邦', '棒', '傍', '榜', '帮助', '帮忙', '棒球'],
                'bi': ['比', '必', '笔', '毕', '币', '比较', '必须', '笔记'],
                'bu': ['不', '步', '部', '布', '补', '不要', '不是', '不对'],
                'ca': ['擦', '才', '采', '彩', '猜', '擦拭', '擦掉', '擦亮'],
                'cai': ['才', '采', '彩', '猜', '财', '财富', '才能', '菜单'],
                'da': ['大', '打', '达', '答', '搭', '大家', '大学', '大小'],
                'dai': ['带', '待', '代', '贷', '戴', '代表', '带来', '代码'],
                'gu': ['古', '谷', '股', '骨', '鼓', '故事', '固定', '顾问'],
                'guo': ['国', '过', '果', '郭', '锅', '国家', '过去', '果然'],
                'han': ['汉', '喊', '含', '寒', '汗', '汉语', '寒冷', '含义'],
                'hen': ['很', '恨', '狠', '痕', '恒', '很多', '很好', '很大'],
                'hao': ['好', '号', '浩', '豪', '毫', '好的', '好吃', '好看'],
                'hui': ['会', '回', '灰', '惠', '汇', '回家', '会议', '回答'],
                'jia': ['家', '加', '价', '假', '嫁', '家庭', '加油', '加入'],
                'jiu': ['就', '旧', '久', '九', '酒', '救', '究', '纠'],
                'jin': ['进', '金', '今', '近', '尽', '今天', '进入', '金钱'],
                'kai': ['开', '凯', '慨', '楷', '铠', '开始', '开心', '开放'],
                'kan': ['看', '刊', '砍', '坎', '勘', '看见', '看到', '看书'],
                'lai': ['来', '赖', '莱', '睐', '徕', '来了', '来到', '来自'],
                'li': ['里', '理', '力', '利', '立', '理解', '力量', '利益'],
                'liang': ['两', '量', '良', '亮', '粮', '梁', '凉', '辆'],
                'ling': ['领', '令', '灵', '零', '龄', '铃', '陵', '岭'],
                'liu': ['六', '流', '留', '刘', '柳', '溜', '榴', '硫'],
                'ma': ['吗', '马', '妈', '码', '麻', '妈妈', '马上', '麻烦'],
                'mei': ['没', '美', '妹', '媒', '梅', '美国', '没有', '美丽'],
                'meng': ['梦', '猛', '蒙', '盟', '萌', '孟', '檬', '朦'],
                'ni': ['你', '尼', '呢', '妮', '腻', '你好', '你们', '你的'],
                'nian': ['年', '念', '粘', '碾', '廿', '年龄', '年轻', '年代'],
                'pi': ['批', '皮', '披', '疲', '脾', '啤', '匹', '屁'],
                'pin': ['品', '贫', '聘', '拼', '频', '品质', '拼音', '拼图'],
                'qi': ['起', '气', '期', '七', '其', '起来', '气温', '期待'],
                'qing': ['请', '清', '青', '情', '晴', '请问', '清楚', '情况'],
                'shi': ['是', '时', '事', '市', '十', '时间', '事情', '世界'],
                'shuo': ['说', '硕', '朔', '烁', '铄', '说话', '说明', '说道'],
                'ta': ['他', '她', '它', '塔', '踏', '他们', '她的', '它们'],
                'tian': ['天', '田', '填', '甜', '舔', '天气', '天空', '天天'],
                'wo': ['我', '握', '窝', '卧', '涡', '我的', '我们', '我是'],
                'xi': ['西', '系', '息', '希', '喜', '西安', '系统', '希望'],
                'xie': ['写', '谢', '些', '协', '鞋', '谢谢', '写字', '写作'],
                'xu': ['需', '许', '续', '序', '虚', '徐', '蓄', '絮'],
                'xun': ['寻', '训', '迅', '讯', '巡', '循', '旬', '熏'],
                'ya': ['呀', '压', '牙', '雅', '鸭', '牙齿', '压力', '雅思'],
                'yi': ['一', '以', '已', '亦', '医', '一个', '一起', '一定'],
                'yong': ['用', '永', '勇', '涌', '咏', '用户', '用法', '用途'],
                'yu': ['与', '于', '语', '玉', '鱼', '语言', '鱼类', '玉石'],
                'zai': ['在', '再', '载', '灾', '栽', '在家', '在线', '再见'],
                'zhe': ['这', '者', '着', '哲', '遮', '这个', '这里', '这样'],
                'zhong': ['中', '重', '钟', '终', '众', '中国', '中心', '重要']
            };
        });

    // 从外部JSON文件加载英文映射表
    fetch('english-mapping.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载英文映射文件');
            }
            return response.json();
        })
        .then(data => {
            console.log('成功加载英文映射文件');
            englishMap = data; // 用加载的数据替换englishMap
        })
        .catch(error => {
            console.error('加载英文映射文件出错:', error);
            // 如果加载失败，使用默认的备用映射表
            englishMap = {
                'a': ['about', 'after', 'again', 'air', 'all'],
                'b': ['back', 'bad', 'bag', 'ball', 'bank'],
                'c': ['call', 'can', 'car', 'card', 'care'],
                'd': ['day', 'data', 'date', 'design', 'detail'],
                'e': ['each', 'early', 'easy', 'eat', 'email'],
                'f': ['face', 'fact', 'fail', 'fair', 'fall'],
                'g': ['game', 'get', 'girl', 'give', 'good'],
                'h': ['hand', 'have', 'head', 'hear', 'help'],
                'i': ['i', 'in', 'if', 'image', 'info'],
                'j': ['job', 'join', 'just', 'jump', 'june'],
                'k': ['keep', 'key', 'kind', 'know', 'knowledge'],
                'l': ['last', 'late', 'law', 'learn', 'left'],
                'm': ['make', 'man', 'many', 'may', 'mean'],
                'n': ['name', 'need', 'new', 'next', 'nice'],
                'o': ['of', 'on', 'one', 'only', 'open'],
                'p': ['page', 'part', 'pay', 'people', 'play'],
                'q': ['quick', 'question', 'quiet', 'quite', 'quality'],
                'r': ['read', 'real', 'right', 'run', 'room'],
                's': ['say', 'see', 'send', 'set', 'show'],
                't': ['take', 'talk', 'team', 'tell', 'time'],
                'u': ['up', 'use', 'user', 'unit', 'under'],
                'v': ['value', 'very', 'video', 'view', 'visit'],
                'w': ['wait', 'walk', 'want', 'way', 'work'],
                'x': ['xbox', 'xml', 'xmas', 'xlsx', 'xcode'],
                'y': ['year', 'yes', 'you', 'your', 'young'],
                'z': ['zero', 'zip', 'zone', 'zoom', 'zombie']
            };
        });

    // 英文单词提示
    const englishSuggestions = {
        'a': ['about', 'after', 'again', 'air', 'all'],
        'ab': ['about', 'above', 'abroad', 'ability', 'able'],
        'ac': ['accept', 'access', 'account', 'across', 'action'],
        'ad': ['add', 'address', 'adjust', 'advance', 'advantage'],
        'b': ['back', 'bad', 'bag', 'ball', 'bank'],
        'be': ['be', 'beach', 'bear', 'beat', 'beauty'],
        'bi': ['big', 'bird', 'birth', 'birthday', 'bite'],
        'bl': ['black', 'blue', 'blood', 'block', 'blog'],
        'bo': ['book', 'body', 'box', 'boy', 'born'],
        'br': ['bring', 'break', 'bright', 'brother', 'brown'],
        'bu': ['but', 'business', 'build', 'button', 'busy'],
        'c': ['call', 'can', 'car', 'card', 'care'],
        'ch': ['check', 'child', 'choice', 'choose', 'change'],
        'cl': ['class', 'clear', 'click', 'close', 'cloud'],
        'co': ['come', 'code', 'color', 'company', 'computer'],
        'd': ['day', 'data', 'date', 'design', 'detail'],
        'de': ['design', 'detail', 'deep', 'delete', 'develop'],
        'do': ['do', 'done', 'down', 'document', 'download'],
        'e': ['each', 'early', 'easy', 'eat', 'email'],
        'en': ['end', 'enter', 'enjoy', 'enough', 'english'],
        'ex': ['example', 'excel', 'exist', 'export', 'express'],
        'f': ['face', 'fact', 'fail', 'fair', 'fall'],
        'fi': ['file', 'find', 'first', 'fish', 'five'],
        'fo': ['for', 'food', 'form', 'four', 'follow'],
        'fr': ['free', 'from', 'friend', 'front', 'fruit'],
        'g': ['game', 'get', 'girl', 'give', 'good'],
        'go': ['go', 'good', 'google', 'goal', 'gold'],
        'gr': ['great', 'green', 'group', 'grow', 'ground'],
        'h': ['hand', 'have', 'head', 'hear', 'help'],
        'he': ['he', 'head', 'heart', 'help', 'hello'],
        'hi': ['hi', 'high', 'him', 'his', 'history'],
        'ho': ['home', 'hope', 'hot', 'hour', 'house'],
        'i': ['i', 'in', 'if', 'image', 'info'],
        'im': ['image', 'important', 'import', 'improve', 'impact'],
        'in': ['in', 'info', 'input', 'inside', 'install'],
        'is': ['is', 'issue', 'island', 'isn\'t', 'iso'],
        'it': ['it', 'item', 'its', 'itself', 'italy'],
        'j': ['job', 'join', 'just', 'jump', 'june'],
        'k': ['keep', 'key', 'kind', 'know', 'knowledge'],
        'l': ['last', 'late', 'law', 'learn', 'left'],
        'li': ['like', 'life', 'light', 'line', 'list'],
        'lo': ['look', 'love', 'long', 'local', 'login'],
        'm': ['make', 'man', 'many', 'may', 'mean'],
        'ma': ['make', 'man', 'many', 'main', 'mail'],
        'me': ['me', 'mean', 'meet', 'media', 'menu'],
        'mo': ['more', 'most', 'move', 'money', 'month'],
        'n': ['name', 'need', 'new', 'next', 'nice'],
        'no': ['no', 'not', 'now', 'none', 'note'],
        'o': ['of', 'on', 'one', 'only', 'open'],
        'op': ['open', 'option', 'order', 'other', 'output'],
        'p': ['page', 'part', 'pay', 'people', 'play'],
        'pl': ['place', 'plan', 'play', 'please', 'plus'],
        'pr': ['price', 'print', 'problem', 'process', 'product'],
        'q': ['quick', 'question', 'quiet', 'quite', 'quality'],
        'r': ['read', 'real', 'right', 'run', 'room'],
        're': ['read', 'real', 'really', 'reason', 'receive'],
        's': ['say', 'see', 'send', 'set', 'show'],
        'se': ['see', 'search', 'second', 'send', 'service'],
        'sh': ['she', 'show', 'share', 'should', 'short'],
        'si': ['simple', 'since', 'single', 'site', 'size'],
        'so': ['so', 'some', 'soon', 'sorry', 'sort'],
        'sp': ['space', 'speak', 'special', 'speed', 'sport'],
        'st': ['start', 'state', 'still', 'store', 'study'],
        't': ['take', 'talk', 'team', 'tell', 'time'],
        'ta': ['take', 'talk', 'task', 'table', 'target'],
        'te': ['team', 'tech', 'tell', 'test', 'text'],
        'th': ['the', 'that', 'this', 'there', 'think'],
        'ti': ['time', 'title', 'tip', 'tiny', 'tired'],
        'to': ['to', 'today', 'tool', 'top', 'total'],
        'tr': ['try', 'true', 'track', 'trade', 'travel'],
        'u': ['up', 'use', 'user', 'unit', 'under'],
        'un': ['under', 'unit', 'until', 'update', 'upload'],
        'up': ['up', 'update', 'upload', 'upper', 'upon'],
        'us': ['use', 'user', 'using', 'useful', 'usual'],
        'v': ['value', 'very', 'video', 'view', 'visit'],
        'w': ['wait', 'walk', 'want', 'way', 'work'],
        'wa': ['wait', 'want', 'watch', 'water', 'way'],
        'we': ['we', 'web', 'week', 'well', 'welcome'],
        'wh': ['what', 'when', 'where', 'which', 'while'],
        'wi': ['with', 'will', 'win', 'window', 'wish'],
        'wo': ['work', 'world', 'would', 'word', 'wonder'],
        'wr': ['write', 'wrong', 'wrap', 'written', 'writing'],
        'x': ['xbox', 'xml', 'xmas', 'xlsx', 'xcode'],
        'y': ['year', 'yes', 'you', 'your', 'young'],
        'z': ['zero', 'zip', 'zone', 'zoom', 'zombie']
    };

    // 添加智能组合的拼音映射
    const intelligentPinyinMap = {
        'nihao': ['你好', '你好啊', '你好吗', '你好呀', '你好的', '你好呢', '你好哇', '你好啦'],
        'zaijian': ['再见', '再见啦', '再见了', '再见吧', '再会', '再见呀', '再相见', '拜拜'],
        'xiexie': ['谢谢', '谢谢你', '谢谢啦', '谢谢了', '感谢', '谢谢您', '多谢', '致谢'],
        'bukeqi': ['不客气', '不客气啦', '不用谢', '不用客气', '别客气', '没关系', '小事', '应该的'],
        'woaini': ['我爱你', '我爱你啊', '我爱你哦', '我爱你呀', '我爱你的', '爱你', '喜欢你', '最爱你'],
        'zaoshang': ['早上', '早上好', '早上起', '早上见', '早上来', '早安', '早', '早晨'],
        'wanshang': ['晚上', '晚上好', '晚上见', '晚上来', '晚上去', '晚安', '晚', '夜晚'],
        'mingtian': ['明天', '明天见', '明天好', '明天来', '明天去', '明日', '明早', '明晚'],
        'jintian': ['今天', '今天好', '今天来', '今天去', '今天的', '今日', '今早', '今晚'],
        'duoshao': ['多少', '多少钱', '多少人', '多少次', '几个', '几何', '几点', '几时'],
        'weishenme': ['为什么', '为何', '为啥', '什么原因', '怎么会', '为什么呢', '为什么会', '为什么要'],
        'zenmeyang': ['怎么样', '如何', '怎样', '咋样', '怎么', '怎么了', '怎么会', '怎么办'],
        'duibuqi': ['对不起', '抱歉', '不好意思', '对不住', '失礼了', '很抱歉', '请原谅', '请见谅'],
        'meiguanxi': ['没关系', '没事', '不要紧', '无所谓', '不打紧', '没问题', '不碍事', '无妨'],
        'xianzai': ['现在', '此刻', '目前', '当前', '如今', '眼下', '这会儿', '此时'],
        'haojiu': ['好久', '很久', '长时间', '许久', '好长时间', '好一阵子', '好些日子', '很长时间'],
        'huanying': ['欢迎', '欢迎你', '欢迎光临', '欢迎回来', '热烈欢迎', '欢迎访问', '欢迎加入', '欢迎使用'],
        'ganxie': ['感谢', '谢谢', '感激', '致谢', '多谢', '谢意', '谢谢你', '感谢您']
    };

    // 初始化语言切换键的图标
    const languageKey = document.querySelector('.key-language');
    if (languageKey) {
        // 根据当前模式设置初始图标
        languageKey.style.backgroundImage = isChineseMode ? 
            "url('icons/keyboard/chinese-icon.svg')" : 
            "url('icons/keyboard/english-icon.svg')";
    }

    // 调整输入区域高度
    function adjustInputAreaHeight() {
        const inputArea = document.querySelector('.input-display-area');
        const inputText = document.querySelector('#inputText');
        if (inputArea && inputText) {
            const textHeight = inputText.offsetHeight;
            const minHeight = 120; // 最小高度
            const newHeight = Math.max(minHeight, textHeight + 40); // 40px 为上下padding的总和
            inputArea.style.height = `${newHeight}px`;
            
            // 调整光标高度
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.height = `${textHeight}px`;
            }
        }
    }

    // 添加文本到显示区域
    function appendToDisplay(text) {
        console.log('添加文本到显示区域:', text);
        displayText += text;
        
        const inputText = document.querySelector('#inputText');
        if (inputText) {
            console.log('更新输入区域文本:', displayText);
            inputText.textContent = displayText;
            adjustInputAreaHeight();
        } else {
            console.error('未找到输入文本元素 #inputText');
        }
    }

    // 处理按键输入
    function handleInput(letter) {
        if (isChineseMode) {
            // 中文模式下的处理
            currentInput += letter;
            pinyinDisplay.textContent = currentInput;
            
            // 更新候选词
            updateSuggestions();
            
            // 显示候选词区域
            showPreviewArea();
        } else {
            // 英文模式下记录输入，以便提供单词预测
            currentInput += letter.toLowerCase();
            
            // 更新显示
            if (isUpperCase) {
                letter = letter.toUpperCase();
            }
            appendToDisplay(letter);
            
            // 更新英文单词提示
            updateSuggestions();
        }
    }

    // 处理按键点击事件
    keyboard.addEventListener('click', (e) => {
        console.log('点击了按键:', e.target);
        
        const key = e.target.closest('.key');
        if (!key) return;
        
        console.log('找到按键元素:', key);
        console.log('按键类名:', key.className);

        // 添加按键动画效果
            key.classList.add('pressed');
            setTimeout(() => {
                key.classList.remove('pressed');
            }, 200);

        if (key.classList.contains('key-letter') || key.classList.contains('key-with-number')) {
            const letter = key.textContent.replace(/[0-9]/g, '').trim();
            console.log('处理字母按键:', letter);
            handleInput(letter);
        } else if (key.classList.contains('key-special')) {
            if (key.classList.contains('key-backspace')) {
                console.log('处理退格键');
                handleSpecialKey('backspace');
            } else if (key.classList.contains('key-symbol')) {
                console.log('处理符号键');
                handleSpecialKey('symbol');
            } else if (key.classList.contains('key-number')) {
                console.log('处理数字键');
                handleSpecialKey('number');
            } else if (key.classList.contains('key-language')) {
                console.log('处理语言切换键');
                handleSpecialKey('language');
            } else if (key.classList.contains('key-enter')) {
                console.log('处理回车键');
                handleSpecialKey('enter');
            } else if (key.classList.contains('key-space')) {
                console.log('处理空格键');
                handleSpecialKey('space');
            } else if (key.classList.contains('key-shift-left') || key.classList.contains('key-shift-right')) {
                console.log('处理Shift键');
                handleSpecialKey('shift');
            } else if (key.classList.contains('key-ab')) {
                console.log('处理AB键');
                handleSpecialKey('ab');
            } else if (key.classList.contains('key-collapse')) {
                console.log('处理收起键');
                handleSpecialKey('collapse');
            }
        } else if (key.classList.contains('key-language')) {
            console.log('处理语言切换键');
            handleSpecialKey('language');
        }
    });

    // 处理特殊按键
    function handleSpecialKey(key) {
        console.log('处理特殊按键:', key);
        switch(key) {
            case 'backspace':
            if (isChineseMode && currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                pinyinDisplay.textContent = currentInput;
                    updateSuggestions();
                } else if (displayText.length > 0) {
                    displayText = displayText.slice(0, -1);
                    const inputText = document.querySelector('#inputText');
                    if (inputText) {
                    inputText.textContent = displayText;
                    adjustInputAreaHeight();
                    }
                }
                break;
            case 'enter':
                appendToDisplay('\n');
                break;
            case 'space':
            if (isChineseMode && currentInput.length > 0) {
                // 中文模式下，如果有拼音输入，选择第一个候选词
                const suggestions = document.querySelectorAll('.suggestion');
                if (suggestions.length > 0) {
                    selectSuggestion(0);
                }
            } else {
                appendToDisplay(' ');
            }
                break;
            case 'shift':
                toggleCase();
                break;
            case 'language':
                toggleLanguageMode(document.querySelector('.key-language'));
                break;
            case 'symbol':
            toggleSymbolKeyboard();
                break;
            case 'math':
                toggleMathKeyboard();
                break;
            case 'number':
            toggleNumberKeyboard();
                break;
            case 'ab':
                togglePredictionPanel();
                break;
            case 'collapse':
            keyboardContainer.classList.add('hidden');
                break;
        }
    }

    function toggleSymbolKeyboard() {
        isSymbolKeyboard = !isSymbolKeyboard;
        isMathKeyboard = false;
        isNumberKeyboard = false;
        if (isSymbolKeyboard) {
            keyboard.style.display = 'none';
            symbolKeyboard.style.display = 'block';
            mathKeyboard.style.display = 'none';
            numberKeyboard.style.display = 'none';
        } else {
            keyboard.style.display = 'block';
            symbolKeyboard.style.display = 'none';
            mathKeyboard.style.display = 'none';
            numberKeyboard.style.display = 'none';
        }
    }

    function toggleMathKeyboard() {
        isMathKeyboard = !isMathKeyboard;
        isSymbolKeyboard = false;
        isNumberKeyboard = false;
        if (isMathKeyboard) {
            keyboard.style.display = 'none';
            symbolKeyboard.style.display = 'none';
            mathKeyboard.style.display = 'block';
            numberKeyboard.style.display = 'none';
        } else {
            keyboard.style.display = 'block';
            symbolKeyboard.style.display = 'none';
            mathKeyboard.style.display = 'none';
            numberKeyboard.style.display = 'none';
        }
    }

    function toggleNumberKeyboard() {
        isNumberKeyboard = !isNumberKeyboard;
        isSymbolKeyboard = false;
        isMathKeyboard = false;
        if (isNumberKeyboard) {
            keyboard.style.display = 'none';
            symbolKeyboard.style.display = 'none';
            mathKeyboard.style.display = 'none';
            numberKeyboard.style.display = 'block';
        } else {
            keyboard.style.display = 'block';
            symbolKeyboard.style.display = 'none';
            mathKeyboard.style.display = 'none';
            numberKeyboard.style.display = 'none';
        }
    }

    function showPreviewArea() {
        keyboardSystem.style.display = 'none';
        inputPreview.style.display = 'flex';
        keyboardContainer.classList.add('expanded');
        
        if (isChineseMode) {
            // 中文模式下显示拼音
            pinyinDisplay.style.display = 'flex';
            pinyinDisplay.textContent = currentInput;
            
            // 根据输入内容调整拼音显示区域的宽度
            const textWidth = currentInput.length * 28; // 每个字符28px
            pinyinDisplay.style.width = `${Math.max(50, textWidth + 30)}px`; // 加上padding的宽度
        } else {
            // 英文模式下隐藏拼音显示区域
            pinyinDisplay.style.display = 'none';
        }
    }

    function hidePreviewArea() {
        keyboardSystem.style.display = 'flex';
        inputPreview.style.display = 'none';
        keyboardContainer.classList.remove('expanded');
        currentInput = '';
        selectedIndex = -1;
        // 确保预测面板也被隐藏
        predictionPanel.classList.remove('active');
    }

    function handleSpecialKeyPress(key) {
        key.classList.add('pressed');
        setTimeout(() => {
            key.classList.remove('pressed');
        }, 200);
    }

    document.querySelectorAll('.key-special').forEach(key => {
        key.addEventListener('click', function() {
            handleSpecialKeyPress(this);
        });
    });

    // 键盘显示和隐藏功能
    const inputDisplayArea = document.querySelector('.input-display-area');
    const collapseButtons = document.querySelectorAll('.key-collapse');

    // 收起键盘 - 为所有收起按钮添加事件监听器
    collapseButtons.forEach(button => {
        button.addEventListener('click', () => {
            keyboardContainer.classList.add('hidden');
        });
    });

    // 点击输入区域显示键盘
    inputDisplayArea.addEventListener('click', () => {
        keyboardContainer.classList.remove('hidden');
    });

    function handleMathKeyboardSpecialKey(key) {
        if (key.classList.contains('key-backspace')) {
            // 处理退格键
            if (displayText.length > 0) {
                displayText = displayText.slice(0, -1);
                inputText.textContent = displayText;
                adjustInputAreaHeight();
            }
        } else if (key.classList.contains('key-back')) {
            // 返回符号键盘
            toggleMathKeyboard();
        } else if (key.classList.contains('key-space')) {
            // 处理空格键
            appendToDisplay(' ');
            adjustInputAreaHeight();
        } else if (key.classList.contains('key-enter')) {
            // 处理回车键
            appendToDisplay('\n');
            adjustInputAreaHeight();
        } else if (key.classList.contains('key-pinyin-left') || key.classList.contains('key-pinyin-right')) {
            // 返回字母键盘
            toggleMathKeyboard();
            toggleSymbolKeyboard();
        } else if (key.classList.contains('key-number-left') || key.classList.contains('key-number-right')) {
            // 这里可以添加切换到数字键盘的逻辑
            // 暂时先返回字母键盘
            toggleMathKeyboard();
            toggleSymbolKeyboard();
        } else if (key.classList.contains('key-symbol')) {
            // 切换回符号键盘
            toggleMathKeyboard();
        }
    }

    // 添加下拉按钮点击事件
    if (dropdownButton) {
        dropdownButton.addEventListener('click', togglePredictionPanel);
    }

    // 添加预测面板控制按钮事件
    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => {
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                pinyinDisplay.textContent = currentInput;
                
                // 如果删除后没有输入了，隐藏预测面板并回到键盘初始页面
                if (currentInput.length === 0) {
                    hidePredictionPanel();
                    hidePreviewArea();
                } else {
                    updateSuggestions();
                    updatePredictionPanel();
                }
            }
        });
    }

    if (upBtn) {
        upBtn.addEventListener('click', () => {
            if (currentPredictionPage > 0) {
                currentPredictionPage--;
                updatePredictionPanel();
            }
        });
    }

    if (downBtn) {
        downBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(allPredictions.length / 36);
            if (currentPredictionPage < maxPages - 1) {
                currentPredictionPage++;
                updatePredictionPanel();
            }
        });
    }

    if (returnBtn) {
        returnBtn.addEventListener('click', hidePredictionPanel);
    }

    // 切换预测字选择区域显示/隐藏
    function togglePredictionPanel() {
        console.log('切换预测面板');
        if (predictionPanel.classList.contains('active')) {
            hidePredictionPanel();
        } else {
            showPredictionPanel();
        }
    }

    function showPredictionPanel() {
        console.log('显示预测面板');
        predictionPanel.classList.add('active');
        
        // 只隐藏当前活动的键盘
        if (symbolKeyboard.style.display === 'block') {
            symbolKeyboard.classList.add('keyboard-hidden');
        } else if (mathKeyboard.style.display === 'block') {
            mathKeyboard.classList.add('keyboard-hidden');
        } else if (numberKeyboard.style.display === 'block') {
            numberKeyboard.classList.add('keyboard-hidden');
        } else {
            keyboard.classList.add('keyboard-hidden');
        }
        
        // 更新预测面板内容
        updatePredictionPanel();
    }

    function hidePredictionPanel() {
        console.log('隐藏预测面板');
        predictionPanel.classList.remove('active');
        // 显示当前活动的键盘
        if (symbolKeyboard.style.display === 'block') {
            symbolKeyboard.classList.remove('keyboard-hidden');
        } else if (mathKeyboard.style.display === 'block') {
            mathKeyboard.classList.remove('keyboard-hidden');
        } else if (numberKeyboard.style.display === 'block') {
            numberKeyboard.classList.remove('keyboard-hidden');
        } else {
            keyboard.classList.remove('keyboard-hidden');
        }
    }

    // 更新预测字选择区域
    function updatePredictionPanel() {
        console.log('更新预测面板内容');
        // 清空所有行
        predictionRows.forEach(row => {
            row.innerHTML = '';
        });

        // 获取所有预测字
        if (allPredictions.length === 0) {
            if (isChineseMode) {
                // 中文模式下获取拼音候选词
                // 首先尝试从pinyinMap中获取完全匹配的拼音
                if (pinyinMap[currentInput]) {
                    allPredictions = pinyinMap[currentInput];
                } else {
                    // 如果没有完全匹配，使用智能匹配
                    allPredictions = intelligentPinyinMatch(currentInput);
                }
            } else {
                // 英文模式下收集所有可能的预测词
                const inputLower = currentInput.toLowerCase();
                allPredictions = [];
                
                // 1. 从englishSuggestions和englishMap中收集完全匹配
                if (englishSuggestions[inputLower]) {
                    allPredictions = allPredictions.concat(englishSuggestions[inputLower]);
                }
                
                if (englishMap[inputLower]) {
                    const mapWords = englishMap[inputLower];
                    console.log('从englishMap找到直接匹配:', mapWords.length);
                    allPredictions = allPredictions.concat(mapWords);
                }
                
                // 2. 收集前缀匹配 (从englishSuggestions)
                Object.keys(englishSuggestions).forEach(key => {
                    if (key.startsWith(inputLower) && key !== inputLower) {
                        const words = englishSuggestions[key];
                        allPredictions = allPredictions.concat(words);
                    }
                });
                
                // 3. 收集前缀匹配 (从englishMap)
                Object.keys(englishMap).forEach(key => {
                    if (key.startsWith(inputLower) && key !== inputLower) {
                        const words = englishMap[key];
                        allPredictions = allPredictions.concat(words);
                    }
                });
                
                // 4. 收集以输入为前缀的单词
                // 扫描englishMap中的所有单词列表
                Object.values(englishMap).forEach(wordList => {
                    wordList.forEach(word => {
                        if (word.toLowerCase().startsWith(inputLower) && !allPredictions.includes(word)) {
                            allPredictions.push(word);
                        }
                    });
                });
                
                // 去重并排序
                allPredictions = [...new Set(allPredictions)];
                allPredictions.sort((a, b) => a.length - b.length);
                
                if (isUpperCase) {
                    allPredictions = allPredictions.map(word => word.toUpperCase());
                }
            }
        }

        console.log(`找到 ${allPredictions.length} 个预测字`);
        
        // 计算当前页的预测字
        const startIndex = currentPredictionPage * 36;
        const endIndex = Math.min(startIndex + 36, allPredictions.length);
        const currentPagePredictions = allPredictions.slice(startIndex, endIndex);

        // 每行显示9个预测字
        const wordsPerRow = 9;
        
        // 填充预测字到每一行
        for (let i = 0; i < currentPagePredictions.length; i++) {
            const rowIndex = Math.floor(i / wordsPerRow);
            if (rowIndex < predictionRows.length) {
                const word = currentPagePredictions[i];
                const wordElement = document.createElement('div');
                wordElement.className = 'prediction-word';
                wordElement.textContent = word;
                wordElement.addEventListener('click', () => selectPredictionWord(word));
                predictionRows[rowIndex].appendChild(wordElement);
            }
        }

        // 更新上翻键图标的颜色
        const upBtnIcon = document.querySelector('.up-btn img');
        if (upBtnIcon) {
            if (currentPredictionPage === 0) {
                upBtnIcon.style.filter = 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)';
            } else {
                upBtnIcon.style.filter = 'none';
            }
        }
        
        // 更新下翻键图标的颜色
        const downBtnIcon = document.querySelector('.down-btn img');
        if (downBtnIcon) {
            const maxPages = Math.ceil(allPredictions.length / 36);
            if (currentPredictionPage >= maxPages - 1) {
                downBtnIcon.style.filter = 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)';
            } else {
                downBtnIcon.style.filter = 'none';
            }
        }
    }

    // 选择预测字
    function selectPredictionWord(word) {
        console.log(`选择预测字: ${word}`);
        if (isChineseMode) {
            // 将选中的字添加到输入区域
            appendToDisplay(word);
            // 清空当前拼音输入
            currentInput = '';
            pinyinDisplay.textContent = '';
            // 隐藏预测面板
            hidePredictionPanel();
            // 隐藏预览区域
            hidePreviewArea();
        } else {
            // 英文模式下，将选中的单词添加到输入区域
            // 首先删除已经输入的部分
            for (let i = 0; i < currentInput.length; i++) {
                // 模拟退格键删除已输入的字符
                if (displayText.length > 0) {
                    displayText = displayText.slice(0, -1);
                    inputText.textContent = displayText;
                }
            }
            // 然后添加完整的单词
            appendToDisplay(word);
            // 清空当前输入
            currentInput = '';
            // 隐藏预测面板
            hidePredictionPanel();
            // 隐藏预览区域
            hidePreviewArea();
        }
    }

    function toggleCase() {
        const letterKeys = document.querySelectorAll('.key-letter');
        letterKeys.forEach(key => {
            // 检查是否是带数字的字母键
            const letterBottom = key.querySelector('.letter-bottom');
            if (letterBottom) {
                // 如果是带数字的字母键，只改变字母部分
                if (/[A-Za-z]/.test(letterBottom.textContent)) {
                    letterBottom.textContent = isUpperCase 
                        ? letterBottom.textContent.toUpperCase() 
                        : letterBottom.textContent.toLowerCase();
                }
            } else {
                // 如果是普通字母键
                if (/[A-Za-z]/.test(key.textContent)) {
                    key.textContent = isUpperCase 
                        ? key.textContent.toUpperCase() 
                        : key.textContent.toLowerCase();
                }
            }
        });
        
        if (!isChineseMode && currentInput.length > 0) {
            updateSuggestions();
        }
    }

    // 添加点击候选词的功能
    wordSuggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion')) {
            const index = parseInt(e.target.dataset.index);
            selectSuggestion(index);
        }
    });

    // 添加数字键选词功能
    document.addEventListener('keydown', (e) => {
        if (isChineseMode && currentInput.length > 0) {
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= 5) {
                selectSuggestion(num - 1);
            }
        }
    });

    function handleSpecialKeyPress(key) {
        key.classList.add('pressed');
        setTimeout(() => {
            key.classList.remove('pressed');
        }, 200);
    }

    document.querySelectorAll('.key-special').forEach(key => {
        key.addEventListener('click', function() {
            handleSpecialKeyPress(this);
        });
    });

    function toggleLanguageMode(key) {
        console.log('切换语言模式，当前模式:', isChineseMode ? '中文' : '英文');
        isChineseMode = !isChineseMode;
        console.log('切换后模式:', isChineseMode ? '中文' : '英文');
        
        // 更新语言图标
        if (key) {
            console.log('设置背景图片');
            key.style.backgroundImage = isChineseMode ? 
                "url('icons/keyboard/chinese-icon.svg')" : 
                "url('icons/keyboard/english-icon.svg')";
        } else {
            console.log('未找到语言按键元素');
        }
        
        // 更新逗号和句号键的显示
        const commaKey = document.querySelector('.key-comma');
        const periodKey = document.querySelector('.key-period');
        
        console.log('更新逗号和句号键');
        if (commaKey) {
            const commaTop = commaKey.querySelector('.symbol-top');
            const commaBottom = commaKey.querySelector('.symbol-bottom');
            
            if (commaTop) commaTop.textContent = isChineseMode ? '，' : ',';
            if (commaBottom) commaBottom.textContent = isChineseMode ? '，' : ',';
        }
        
        if (periodKey) {
            const periodTop = periodKey.querySelector('.symbol-top');
            const periodBottom = periodKey.querySelector('.symbol-bottom');
            
            if (periodTop) periodTop.textContent = isChineseMode ? '。' : '.';
            if (periodBottom) periodBottom.textContent = isChineseMode ? '。' : '.';
        }
        
        // 清除当前输入状态
        console.log('清除当前输入状态');
        hidePreviewArea();
        currentInput = '';
        pinyinDisplay.textContent = '';
    }

    function updateSuggestions() {
        // 清空候选词区域
        wordSuggestions.innerHTML = '';
        
        // 如果没有输入，隐藏预览区域并返回
        if (!currentInput || currentInput.length === 0) {
            hidePreviewArea();
            return;
        }
        
        // 显示预览区域
        showPreviewArea();
        
        // 获取候选词
        let candidates = [];
        
        if (isChineseMode) {
            // 中文模式下获取拼音候选词
            // 首先尝试从pinyinMap中获取完全匹配的拼音
            if (pinyinMap[currentInput]) {
                candidates = pinyinMap[currentInput];
            } else {
                // 如果没有完全匹配，使用智能匹配
                candidates = intelligentPinyinMatch(currentInput);
            }
        } else {
            // 英文模式下使用所有可用的英文预测资源
            const inputLower = currentInput.toLowerCase();
            console.log('查找英文预测词，输入:', inputLower);
            
            // 收集所有匹配的英文预测词
            candidates = [];
            
            // 1. 优先从englishSuggestions中查找完全匹配
            if (englishSuggestions[inputLower]) {
                candidates = candidates.concat(englishSuggestions[inputLower]);
                console.log('从englishSuggestions找到直接匹配:', candidates.length);
            }
            
            // 2. 从englishMap中查找完全匹配
            if (englishMap[inputLower]) {
                const mapWords = englishMap[inputLower];
                console.log('从englishMap找到直接匹配:', mapWords.length);
                candidates = candidates.concat(mapWords);
            }
            
            // 3. 查找前缀匹配 (从englishSuggestions)
            Object.keys(englishSuggestions).forEach(key => {
                if (key.startsWith(inputLower) && key !== inputLower) {
                    const words = englishSuggestions[key];
                    candidates = candidates.concat(words);
                }
            });
            
            // 4. 查找前缀匹配 (从englishMap)
            Object.keys(englishMap).forEach(key => {
                if (key.startsWith(inputLower) && key !== inputLower) {
                    const words = englishMap[key];
                    candidates = candidates.concat(words);
                }
            });
            
            // 5. 查找单词本身以输入为前缀的情况
            // 扫描englishMap中的所有单词列表
            Object.values(englishMap).forEach(wordList => {
                wordList.forEach(word => {
                    if (word.toLowerCase().startsWith(inputLower) && !candidates.includes(word)) {
                        candidates.push(word);
                    }
                });
            });
            
            // 去重
            candidates = [...new Set(candidates)];
            console.log(`总共找到 ${candidates.length} 个英文预测词`);
            
            // 按长度排序，优先显示较短的单词
            candidates.sort((a, b) => a.length - b.length);
            
            // 如果使用了大写模式，转换候选词为大写
            if (isUpperCase) {
                candidates = candidates.map(word => word.toUpperCase());
            }
        }
        
        console.log(`找到 ${candidates.length} 个候选词`);
        
        // 显示候选词（最多显示8个）
        const displayCandidates = candidates.slice(0, 8);
        displayCandidates.forEach((candidate, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion';
            suggestionElement.textContent = candidate;
            suggestionElement.dataset.index = index;
            suggestionElement.addEventListener('click', () => selectSuggestion(index));
            wordSuggestions.appendChild(suggestionElement);
        });
        
        // 如果候选词超过8个，显示下拉按钮
        if (candidates.length > 8) {
            dropdownButton.style.display = 'flex';
            // 保存所有候选词，供预测面板使用
            allPredictions = candidates;
            // 重置预测页码
            currentPredictionPage = 0;
        } else {
            dropdownButton.style.display = 'none';
        }
    }

    function selectSuggestion(index) {
        const suggestions = document.querySelectorAll('.suggestion');
        if (suggestions.length > index) {
            const selectedWord = suggestions[index].textContent;
            appendToDisplay(selectedWord);
            
            // 清空当前拼音输入，但不隐藏预览区域
            currentInput = '';
            pinyinDisplay.textContent = '';
            
            // 保持预览区域显示，以便继续输入
            updateSuggestions();
        }
    }

    // 给符号键盘添加点击事件处理
    symbolKeyboard.addEventListener('click', (e) => {
        console.log('点击了符号键盘按键:', e.target);
        
        const key = e.target.closest('.key');
        if (!key) return;
        
        console.log('找到符号键盘按键元素:', key);
        console.log('符号键盘按键类名:', key.className);

        // 添加按键动画效果
        key.classList.add('pressed');
        setTimeout(() => {
            key.classList.remove('pressed');
        }, 200);

        // 处理拼音键
        if (key.classList.contains('key-pinyin-left') || key.classList.contains('key-pinyin-right')) {
            console.log('点击了拼音键，返回主键盘');
            toggleSymbolKeyboard(); // 返回主键盘
            return;
        }

        if (key.classList.contains('key-symbol-key')) {
            // 处理符号输入
            const symbolBottom = key.querySelector('.symbol-bottom');
            if (symbolBottom) {
                const symbol = symbolBottom.textContent;
                console.log('输入符号:', symbol);
                appendToDisplay(symbol);
            }
        } else if (key.classList.contains('key-special')) {
            if (key.classList.contains('key-backspace')) {
                console.log('处理退格键');
                handleSpecialKey('backspace');
            } else if (key.classList.contains('key-back')) {
                console.log('处理返回键');
                toggleSymbolKeyboard(); // 返回主键盘
            } else if (key.classList.contains('key-space')) {
                console.log('处理空格键');
                handleSpecialKey('space');
            } else if (key.classList.contains('key-math')) {
                console.log('处理数学符号键');
                handleSpecialKey('math');
            } else if (key.classList.contains('key-enter')) {
                console.log('处理回车键');
                handleSpecialKey('enter');
            }
        }
    });

    // 给数字键盘添加点击事件处理
    numberKeyboard.addEventListener('click', (e) => {
        console.log('点击了数字键盘按键:', e.target);
        
        const key = e.target.closest('.key');
        if (!key) return;
        
        console.log('找到数字键盘按键元素:', key);
        console.log('数字键盘按键类名:', key.className);

        // 添加按键动画效果
        key.classList.add('pressed');
        setTimeout(() => {
            key.classList.remove('pressed');
        }, 200);

        if (key.classList.contains('key-number-key')) {
            // 处理数字输入
            const number = key.textContent;
            console.log('输入数字:', number);
            appendToDisplay(number);
        } else if (key.classList.contains('key-special')) {
            if (key.classList.contains('key-backspace')) {
                console.log('处理退格键');
                handleSpecialKey('backspace');
            } else if (key.classList.contains('key-back')) {
                console.log('处理返回键');
                toggleNumberKeyboard(); // 返回主键盘
            } else if (key.classList.contains('key-space')) {
                console.log('处理空格键');
                handleSpecialKey('space');
            } else if (key.classList.contains('key-enter')) {
                console.log('处理回车键');
                handleSpecialKey('enter');
            }
        }
    });

    // 修复数学键盘的点击事件处理
    if (mathKeyboard) {
        mathKeyboard.addEventListener('click', (e) => {
            console.log('点击了数学键盘按键:', e.target);
            
            const key = e.target.closest('.key');
            if (!key) return;
            
            console.log('找到数学键盘按键元素:', key);
            console.log('数学键盘按键类名:', key.className);

            // 添加按键动画效果
            key.classList.add('pressed');
            setTimeout(() => {
                key.classList.remove('pressed');
            }, 200);

            if (key.classList.contains('key-math-key')) {
                // 处理数学符号输入
                const mathSymbol = key.textContent;
                console.log('输入数学符号:', mathSymbol);
                appendToDisplay(mathSymbol);
            } else if (key.classList.contains('key-special')) {
                if (key.classList.contains('key-backspace')) {
                    console.log('处理退格键');
                    handleSpecialKey('backspace');
                } else if (key.classList.contains('key-back')) {
                    console.log('处理返回键');
                    toggleMathKeyboard(); // 返回符号键盘
                } else if (key.classList.contains('key-space')) {
                    console.log('处理空格键');
                    handleSpecialKey('space');
                } else if (key.classList.contains('key-enter')) {
                    console.log('处理回车键');
                    handleSpecialKey('enter');
                }
            }
        });
    }

    // 添加触摸事件处理下滑手势
    keyboard.addEventListener('touchstart', handleKeyboardTouchStart, false);
    keyboard.addEventListener('touchmove', handleKeyboardTouchMove, false);
    keyboard.addEventListener('touchend', handleKeyboardTouchEnd, false);

    let keyboardTouchStartY = 0;
    let keyboardTouchStartX = 0;
    let currentKeyboardTouchKey = null;
    const MIN_SWIPE_DISTANCE = 30; // 最小下滑距离

    function handleKeyboardTouchStart(e) {
        console.log('键盘触摸开始');
        const key = e.target.closest('.key-with-number');
        if (!key) return;
        
        currentKeyboardTouchKey = key;
        keyboardTouchStartY = e.touches[0].clientY;
        keyboardTouchStartX = e.touches[0].clientX;
        console.log('记录触摸起始位置:', keyboardTouchStartX, keyboardTouchStartY);
    }

    function handleKeyboardTouchMove(e) {
        if (!currentKeyboardTouchKey) return;
        e.preventDefault(); // 防止页面滚动
    }

    function handleKeyboardTouchEnd(e) {
        if (!currentKeyboardTouchKey) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        
        const deltaY = touchEndY - keyboardTouchStartY;
        const deltaX = Math.abs(touchEndX - keyboardTouchStartX);
        
        console.log('触摸结束,位移:', deltaX, deltaY);
        
        // 检测是否为下滑手势（垂直移动大于水平移动且下滑距离足够）
        if (deltaY > MIN_SWIPE_DISTANCE && deltaY > deltaX) {
            console.log('检测到下滑手势');
            // 下滑手势，输入数字
            const numberTop = currentKeyboardTouchKey.querySelector('.number-top');
            if (numberTop) {
                const number = numberTop.textContent;
                console.log('输入上方数字:', number);
                appendToDisplay(number);
                
                // 添加视觉反馈
                numberTop.classList.add('number-active');
                setTimeout(() => {
                    numberTop.classList.remove('number-active');
                }, 300);
            }
        }
        
        currentKeyboardTouchKey = null;
    }

    // 为符号键盘添加下滑手势功能
    symbolKeyboard.addEventListener('touchstart', handleSymbolTouchStart, false);
    symbolKeyboard.addEventListener('touchmove', handleSymbolTouchMove, false);
    symbolKeyboard.addEventListener('touchend', handleSymbolTouchEnd, false);

    let symbolTouchStartY = 0;
    let symbolTouchStartX = 0;
    let currentSymbolTouchKey = null;

    function handleSymbolTouchStart(e) {
        console.log('符号键盘触摸开始');
        const key = e.target.closest('.key-symbol-key');
        if (!key) return;
        
        currentSymbolTouchKey = key;
        symbolTouchStartY = e.touches[0].clientY;
        symbolTouchStartX = e.touches[0].clientX;
        console.log('记录符号键触摸起始位置:', symbolTouchStartX, symbolTouchStartY);
    }

    function handleSymbolTouchMove(e) {
        if (!currentSymbolTouchKey) return;
        e.preventDefault(); // 防止页面滚动
    }

    function handleSymbolTouchEnd(e) {
        if (!currentSymbolTouchKey) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        
        const deltaY = touchEndY - symbolTouchStartY;
        const deltaX = Math.abs(touchEndX - symbolTouchStartX);
        
        console.log('符号键触摸结束,位移:', deltaX, deltaY);
        
        // 检测是否为下滑手势（垂直移动大于水平移动且下滑距离足够）
        if (deltaY > MIN_SWIPE_DISTANCE && deltaY > deltaX) {
            console.log('检测到符号键下滑手势');
            // 下滑手势，输入上方符号
            const symbolTop = currentSymbolTouchKey.querySelector('.symbol-top');
            if (symbolTop) {
                const symbol = symbolTop.textContent;
                console.log('输入上方符号:', symbol);
                appendToDisplay(symbol);
                
                // 添加视觉反馈
                symbolTop.classList.add('symbol-active');
                setTimeout(() => {
                    symbolTop.classList.remove('symbol-active');
                }, 300);
            }
        } else {
            // 正常点击，输入下方符号
            const symbolBottom = currentSymbolTouchKey.querySelector('.symbol-bottom');
            if (symbolBottom) {
                const symbol = symbolBottom.textContent;
                console.log('输入下方符号:', symbol);
                appendToDisplay(symbol);
                
                // 添加按键动画效果
                currentSymbolTouchKey.classList.add('pressed');
                setTimeout(() => {
                    currentSymbolTouchKey.classList.remove('pressed');
                }, 200);
            }
        }
        
        currentSymbolTouchKey = null;
    }

    // 为符号键盘添加右键点击处理上方符号输入
    symbolKeyboard.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // 阻止默认右键菜单
        
        const key = e.target.closest('.key-symbol-key');
        if (!key) return;
        
        // 输入上方符号
        const symbolTop = key.querySelector('.symbol-top');
        if (symbolTop) {
            const symbol = symbolTop.textContent;
            console.log('右键输入上方符号:', symbol);
            appendToDisplay(symbol);
            
            // 添加视觉反馈
            symbolTop.classList.add('symbol-active');
            setTimeout(() => {
                symbolTop.classList.remove('symbol-active');
            }, 200);
        }
    });

    // 为字母键盘添加右键点击处理数字输入
    keyboard.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // 阻止默认右键菜单
        
        const key = e.target.closest('.key-with-number');
        if (!key) return;
        
        // 输入数字
        const numberTop = key.querySelector('.number-top');
        if (numberTop) {
            const number = numberTop.textContent;
            console.log('右键输入数字:', number);
            appendToDisplay(number);
            
            // 添加视觉反馈
            numberTop.classList.add('number-active');
            setTimeout(() => {
                numberTop.classList.remove('number-active');
            }, 200);
        }
    });

    // 智能拼音匹配函数
    function intelligentPinyinMatch(input) {
        console.log('执行智能拼音匹配:', input);
        let results = [];
        
        // 检查是否有完整的智能组合
        if (intelligentPinyinMap[input]) {
            console.log('找到智能组合匹配');
            return intelligentPinyinMap[input];
        }
        
        // 检查是否是某个完整拼音的前缀
        for (const pinyin in pinyinMap) {
            if (pinyin.startsWith(input)) {
                console.log('找到前缀匹配:', pinyin);
                // 将这个完整拼音的候选词加入结果
                results = results.concat(pinyinMap[pinyin]);
            }
        }
        
        // 检查是否是某个智能组合的前缀
        for (const pinyin in intelligentPinyinMap) {
            if (pinyin.startsWith(input)) {
                console.log('找到智能组合的前缀匹配:', pinyin);
                // 将这个智能组合的候选词加入结果
                results = results.concat(intelligentPinyinMap[pinyin]);
            }
        }
        
        // 如果没有找到任何匹配，尝试模糊匹配
        if (results.length === 0 && input.length > 1) {
            console.log('尝试模糊匹配');
            // 逐个检查单个字符的拼音映射
            const firstChar = input.charAt(0);
            if (pinyinMap[firstChar]) {
                console.log('使用首字符匹配:', firstChar);
                results = pinyinMap[firstChar];
            }
        }
        
        // 去重
        results = [...new Set(results)];
        
        // 限制结果数量，避免过多
        return results.slice(0, 50);
    }
}); 