    const defaultSearchWords = ["盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", "敏而好学，不耻下问", "海内存知已，天涯若比邻","三人行，必有我师焉","莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神","学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切", "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴","近朱者赤，近墨者黑","吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人", "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少","天下兴亡，匹夫有责","人无远虑，必有近忧","为中华之崛起而读书","一日无书，百事荒废","岂能尽如人意，但求无愧我心","人生自古谁无死，留取丹心照汗青","吾生也有涯，而知也无涯","生于忧患，死于安乐","言必信，行必果","读书破万卷，下笔如有神","夫君子之行，静以修身，俭以养德","老骥伏枥，志在千里","一日不读书，胸臆无佳想","王侯将相宁有种乎","淡泊以明志。宁静而致远,","卧龙跃马终黄土"];
    let countdownIntervalId;
    let countdownTimeoutId;
    let nextSearchWord = '';
    let searchToggle = true; // 用于切换不同的搜索 URL
    let apiIndex = 0; // 用于循环使用 API
    let isSearching = false; // 标记搜索是否正在进行中
    let completedSearches = 0; // 记录已完成的搜索次数
    let totalSearches = localStorage.getItem('totalSearches') ? parseInt(localStorage.getItem('totalSearches')) : 0; // 初始化总搜索次数
    let isException = localStorage.getItem('isException') === 'true'; // 初始化异常状态
    let maxStops;
    let countdownMin = 40; // 默认最小倒计时
    let countdownMax = 70; // 默认最大倒计时

    const apis = [
        'https://v1.hitokoto.cn/',
        'https://api.xygeng.cn/one',
        'https://api.xygeng.cn/openapi/one'
    ];

    // 页面加载时显示已完成的总搜索次数
    document.getElementById('total-searches').textContent = totalSearches;

    // 判断设备类型
    function detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
        const deviceTypeElement = document.getElementById('device-type');
        if (isMobile) {
            deviceTypeElement.textContent = '移动设备';
            localStorage.setItem('maxStops', '24');
        } else {
            deviceTypeElement.textContent = '电脑设备';
            localStorage.setItem('maxStops', '36');
        }
    }
        window.onload = function() {
            var popup = document.getElementById('popup');
            var closeBtn = document.getElementById('close-btn');
            popup.style.display = 'block';
            setTimeout(function() {
                popup.style.display = 'none';
            }, 8000);
        }
    async function fetchSearchWords() {
        const apiUrl = apis[apiIndex];
        apiIndex = (apiIndex + 1) % apis.length; // 循环切换 API
        try {
            let response = await fetch(apiUrl);
            let data = await response.json();
            if (data.hitokoto) {
                return data.hitokoto;
            } else if (data.data && data.data.content) {
                return data.data.content;
            } else {
                throw new Error('从 API 获取的数据无效');
            }
        } catch {
            return defaultSearchWords[Math.floor(Math.random() * defaultSearchWords.length)];
        }
    }

    function displaySearchWord(word) {
        document.getElementById('current-search-word').textContent = word;
    }

    function addSearchHistory(word, iframeUrl) {
        const searchHistoryElement = document.getElementById('search-history');
        const historyItems = searchHistoryElement.querySelectorAll('.search-history-item');
        if (historyItems.length >= 2) {
            // 如果历史条目数量超过两个，删除最旧的 iframe
            const iframes = historyItems[1].querySelectorAll('iframe');
            if (iframes.length > 0) {
                historyItems[1].removeChild(iframes[0]);
            }
        }
        const newHistoryItem = document.createElement('div');
        newHistoryItem.className = 'search-history-item';
        newHistoryItem.innerHTML = `<p>${word}</p><iframe src="${iframeUrl}"></iframe>`;
        searchHistoryElement.insertBefore(newHistoryItem, searchHistoryElement.firstChild);
    }

    function performSearch(word) {
        const randomString = generateRandomString(4);
        const randomCvid = generateRandomString(32);
        let searchUrl;

        if (searchToggle) {
            searchUrl = `https://www.cn.bing.com/search?q=${encodeURIComponent(word)}&form=${randomString}&cvid=${randomCvid}`;
        } else {
            searchUrl = `https://www.cn.bing.com/search?q=${encodeURIComponent(word)}&cvid=${randomCvid}&FORM=${randomString}`;
        }

        searchToggle = !searchToggle; // 切换 URL 格式以备下一次搜索
        addSearchHistory(word, searchUrl);
    }

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    async function startAutoSearch() {
        if (isSearching) return; // 如果已经在搜索中，直接返回

        isSearching = true; // 标记搜索正在进行中

        async function startCountdown() {
            const delay = Math.floor(Math.random() * 9000) + 9000; // 9-18 秒的随机延迟
            let countdown = Math.ceil(delay / 1000);
            const countdownElement = document.getElementById('countdown-timer');

            nextSearchWord = await fetchSearchWords();
            displaySearchWord(nextSearchWord);
            countdownElement.textContent = countdown;

            countdownIntervalId = setInterval(() => {
                countdown -= 1;
                countdownElement.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(countdownIntervalId);
                }
            }, 1000);

            countdownTimeoutId = setTimeout(() => {
                performSearch(nextSearchWord);
                clearInterval(countdownIntervalId);
                completedSearches++;
                totalSearches++;

                // 更新已完成搜索次数和总搜索次数的显示
                document.getElementById('completed-searches').textContent = completedSearches;
                document.getElementById('total-searches').textContent = totalSearches;

                // 保存总搜索次数到 localStorage
                localStorage.setItem('totalSearches', totalSearches.toString());
                // 检查是否已经达到总搜索次数的要求
                if (totalSearches >= localStorage.getItem('maxStops')) {
                    stopAutoSearch();
                    localStorage.removeItem('totalSearches');
                    setTimeout(function(){
                                          window.location.href = 'https://cezoachu.net/4/7706872';
                                         }, 6000); 
                    } else {
                            if (completedSearches % 4 === 0) {// 检查是否完成了4次搜索
                                // 在完成每4次搜索后设置延迟，然后刷新页面
                                setTimeout(() => {
                                    window.location.reload();
                                }, 8000); // 设置适当的延迟时间，这里示例为 8000 毫秒（8秒）
                            } else {
                                    startCountdown(); // 继续搜索 
                                }
                }
            }, delay);
        }

        startCountdown(); // 开始第一次搜索倒计时
    }

    function stopAutoSearch() {
        clearInterval(initialCountdownInterval);
        clearInterval(countdownIntervalId);
        clearTimeout(countdownTimeoutId);
        document.getElementById('countdown-timer').textContent = '已停止';
        isSearching = false; // 标记搜索已停止

        // 清除页面加载时的初始化倒计时
        if (countdownWorker) {
            countdownWorker.postMessage({ type: 'stop' });
        }
    }

    // 页面加载完成后开始初始化
    document.addEventListener('DOMContentLoaded', () => {
        initializeCountdown(); // 初始化倒计时
        detectDevice(); // 检测设备类型
    });

    // 添加一个全局变量来存储初始倒计时的计时器 ID
    let initialCountdownInterval;

    function initializeCountdown() {
        const countdownElement = document.getElementById('countdown-timer');
        let initialCountdown = Math.floor(Math.random() * (countdownMax - countdownMin + 1)) + countdownMin; // 初始化倒计时为900-960秒
        countdownElement.textContent = initialCountdown;

        countdownWorker = new Worker(URL.createObjectURL(new Blob([`
            let intervalId;
            let remainingTime;

            self.onmessage = function(e) {
                const { type, duration } = e.data;

                if (type === 'start') {
                    remainingTime = duration;
                    intervalId = setInterval(() => {
                        remainingTime -= 1;
                        self.postMessage({ remainingTime });
                        if (remainingTime <= 0) {
                            clearInterval(intervalId);
                            self.postMessage({ type: 'done' });
                        }
                    }, 1000);
                } else if (type === 'stop') {
                    clearInterval(intervalId);
                }
            };
        `], { type: 'application/javascript' })));

        countdownWorker.postMessage({ type: 'start', duration: initialCountdown });

        countdownWorker.onmessage = function(e) {
            const { remainingTime, type } = e.data;

            if (type === 'done') {
                startAutoSearch(); // 倒计时结束后开始自动搜索
            } else {
                countdownElement.textContent = remainingTime;
            }
        };
    }

    document.getElementById("deleteDataButton").addEventListener("click", function() {
        localStorage.removeItem("totalSearches");
        localStorage.removeItem("isException");
        document.getElementById('total-searches').textContent = '0';
        document.getElementById('completed-searches').textContent = '0';
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    });

    document.getElementById('start-button').addEventListener('click', startAutoSearch);
    document.getElementById('stop-button').addEventListener('click', stopAutoSearch);

    // 异常按钮逻辑
    document.getElementById('exception-button').addEventListener('click', function() {
        if (!isException) {
            isException = true;
            localStorage.setItem('isException', 'true');
            this.textContent = '恢复正常';
            this.title = '点击切换到正常模式';
            countdownMin = 900;
            countdownMax = 960;
        } else {
            isException = false;
            localStorage.setItem('isException', 'false');
            this.textContent = '异常模式';
            this.title = '点击切换到异常模式'; 
            countdownMin = 60;
            countdownMax = 120;
        }
        setTimeout(() => {
            window.location.reload();
        }, 1000); // 1秒后刷新页面
    });

    // 初始化异常按钮状态
    if (isException) {
        const exceptionButton = document.getElementById('exception-button');
        exceptionButton.textContent = '恢复正常';
        exceptionButton.title = '点击切换到正常模式'; // 初始化提示文本
        countdownMin = 900;
        countdownMax = 960;
    }
