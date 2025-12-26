// === search.js ===
// 只做分离，不做任何修改！

// ========== 配置 ==========
const DATA_URL = 'data.json';  // ⚠️ 保持不变！

// ========== 全局变量 ==========
let lastClickTime = 0;

// ========== 搜索主函数 ==========
async function performSearch() {
    // 防频繁点击
    if (lastClickTime && Date.now() - lastClickTime < 4000) {
        alert('哎呀别点太快啦~等4秒再试试嘛(´･ω･`)');
        return;
    }
    lastClickTime = Date.now();

    // ========== 增强输入验证 ==========
    const rawKeyword = searchInput.value.trim();
    if (!rawKeyword) {
        alert('嗯？~请输入要查询的关键词嗷~(*￣︶￣)');
        return;
    }

    let keyword = rawKeyword;

    // 移除危险字符
    keyword = keyword.replace(/[<>"'`\\]/g, '');

    // 限制长度
    if (keyword.length > 30) {
        keyword = keyword.substring(0, 20);
        alert('关键词太长啦~自动截断了哦(◕ᴗ◕✿)');
    }

    // 检查是否为空（经过清理后）
    if (!keyword.trim()) {
        alert('关键词不能只包含特殊字符哦~');
        return;
    }

    const safeKeyword = makeSafe(keyword);

    // 切换到结果视图
    mainCard.classList.add('show-result');
    resultKeyword.textContent = safeKeyword;
    resultStatus.textContent = '奋力扒拉中(ﾟvﾟ)ノ...';

    resultsContainer.innerHTML =
        `<div class="state-container">
            <div class="state-icon" style="font-size: 4.5rem; margin-bottom: 30px;">
                🔍
            </div>
            <h3 class="state-title" style="color: #1e293b;">🐾 丢出的丸子出动啦！</h3>
            <p class="state-message" style="color: #64748b;">别急别急，丸子正在数据库里扒拉 <strong>"${safeKeyword}"</strong> 链接~马上就找到啦ᕦ(･ㅂ･)ᕤ！</p>
        </div>`;

    window.scrollTo(0, 0);

    try {
        // 使用本地或GitHub JSON文件获取数据
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error('请求失败，状态码: ' + response.status);
        }

        const data = await response.json();

        // 数据验证
        const safeData = validateData(data);

        // 使用安全数据
        const result = safeData[keyword];

        if (result) {
            resultStatus.textContent = '好耶！找到啦ヽ( ° ▽°)ノ';

            resultsContainer.innerHTML =
                `<div class="resource-card txt-card">
                    <div class="card-header">
                        <div class="card-icon">📄</div>
                        <div class="card-title">
                            <h3>TXT文档</h3>
                            <div class="code-tag">提取码：${result.txt_code || '未设置'}</div>
                        </div>
                    </div>
                    <div class="address-area">
                        <div class="address-label">
                            <span>下载地址：</span>
                            <button class="copy-button" data-url="${result.txt_url || ''}"></button>
                        </div>
                        <div class="address-text">${result.txt_url || '（未提供地址）'}</div>
                    </div>
                </div>

                <div class="resource-card epub-card">
                    <div class="card-header">
                        <div class="card-icon">📖</div>
                        <div class="card-title">
                            <h3>EPUB电子书</h3>
                            <div class="code-tag">提取码：${result.epub_code || '未设置'}</div>
                        </div>
                    </div>
                    <div class="address-area">
                        <div class="address-label">
                            <span>下载地址：</span>
                            <button class="copy-button" data-url="${result.epub_url || ''}"></button>
                        </div>
                        <div class="address-text">${result.epub_url || '（未提供地址）'}</div>
                    </div>
                </div>`;

            // 绑定复制按钮事件
            document.querySelectorAll('.copy-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const url = e.target.getAttribute('data-url');
                    if (url && url !== '') {
                        copyToClipboard(url, e.target);
                    } else {
                        alert('地址为空，无法复制');
                    }
                });
            });

        } else {
            resultStatus.textContent = '扒拉失败(T ^ T) ';
            // ⚠️ 修正图片路径：images/ku.png → assets/images/ku.png
            resultsContainer.innerHTML =
                `<div class="state-container">
                   <div class="state-icon" style="font-size: 4.5rem; margin-bottom: 30px;">
                       😢
                    </div>
                    <h3 class="state-title" style="color: #1e293b;">数据库里并没有嗷(｡•ˇ‸ˇ•｡)</h3>
                    <p class="state-message" style="color: #64748b;">
                        T^T数据库里没有相关的存货哦~<br>
                        检查一下是否是公众号內给出的相应关键词呢。
                    </p>
                </div>`;
        }
    } catch (error) {
        console.error('搜索出错:', error);
        resultStatus.textContent = '扒拉失败(T ^ T) ';
        // ⚠️ 修正图片路径：images/ku.png → assets/images/ku.png
        resultsContainer.innerHTML =
            `<div class="state-container">
                <div class="state-icon" style="font-size: 4.5rem; margin-bottom: 30px;">
                    🌐
                </div>
                <h3 class="state-title" style="color: #1e293b;">诶！网络请求异常啦(ŎдŎ；)！</h3>
                <p class="state-message" style="color: #64748b;">
                    请检查网络连接后再重新试一下吧(˘•ω•˘)，等你嗷ヾ(❀^ω^)ﾉﾞ。<br>
                    <!-- 错误信息已隐藏 -->
                </p>
            </div>`;
    }
}