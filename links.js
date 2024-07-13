document.addEventListener("DOMContentLoaded", function () {
    // 创建并插入CSS样式
    var style = document.createElement('style');
    style.innerHTML = `
    /* 定义友情链接的容器样式 */
    .bookmark-widget {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    }

    /* 定义书签的样式 */
    .bookmark {
    display: block;
    width: 22px;
    height: 46px;
    opacity: 0.2;
    transition: width 0.4s, opacity 0.4s;
    margin-bottom: 10px;
    text-decoration: none;
    overflow: hidden;
    position: relative;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    }

    /* 各个书签的背景颜色 */
    #bookmark1 {
    background-color: #00b3b0;
    }

    #bookmark2 {
    background-color: #49b300;
    }

    #bookmark3 {
    background-color: #ffb000;
    }

    #bookmark4 {
    background-color: #ff3e31;
    }

    #bookmark5 {
    background-color: #9758ff;
    }

    /* 定义书签标签的样式 */
    .bookmark-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.4s;
    white-space: nowrap;
    }

    /* 书签鼠标悬停时的样式 */
    .bookmark:hover {
    width: 100px;
    opacity: 1;
    }

    /* 书签鼠标悬停时标签的样式 */
    .bookmark:hover .bookmark-label {
    opacity: 1;
    }
    `;
    document.head.appendChild(style);
    // 创建并插入友情链接的HTML
    var linksHTML = `
    <div class="bookmark-widget">
        <a href="https://setity.github.io" class="bookmark" target="_blank" id="bookmark1">
            <span class="bookmark-label">晚安阅读器</span>
        </a>
        <a href="https://shenshenR0.github.io" class="bookmark" target="_blank" id="bookmark2">
            <span class="bookmark-label">小广告时钟</span>
        </a>
        <a href="https://shuijingliuli.github.io" class="bookmark" target="_blank" id="bookmark3">
            <span class="bookmark-label">微软薅羊毛</span>
        </a>
        <a href="https://sanfriy.github.io" class="bookmark" target="_blank" id="bookmark4">
            <span class="bookmark-label">清晨到星辰</span>
        </a>
        <a href="https://couwhoupesho.net/4/7705695" class="bookmark" target="_blank" id="bookmark5">
            <span class="bookmark-label">靓仔点广告</span>
        </a>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', linksHTML);
});
