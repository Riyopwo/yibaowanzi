// === ui.js ===

// ========== 全局元素引用 ==========
let mainCard, searchInput, searchButton, backButton, resultKeyword, resultStatus, resultsContainer;

// ========== 初始化元素引用 ==========
function initElements() {
    mainCard = document.querySelector('.main-card');
    searchInput = document.getElementById('keywordInput');
    searchButton = document.getElementById('searchButton');
    backButton = document.getElementById('backButton');
    resultKeyword = document.getElementById('resultKeyword');
    resultStatus = document.getElementById('resultStatus');
    resultsContainer = document.getElementById('resultsContainer');
}

// ========== UI事件处理 ==========
function setupEventListeners() {
    // 初始化元素引用
    initElements();

    // 搜索按钮点击事件
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            try {
                await performSearch();
            } catch (error) {
                console.error('搜索按钮出错:', error);
                if (resultStatus) {
                    resultStatus.textContent = '搜索出错啦(；´д｀)ゞ';
                }
            }
        });
    }

    // 搜索输入框回车事件
    if (searchInput) {
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                try {
                    await performSearch();
                } catch (error) {
                    console.error('回车搜索出错:', error);
                    if (resultStatus) {
                        resultStatus.textContent = '搜索出错啦(；´д｀)ゞ';
                    }
                }
            }
        });
    }

    // 返回按钮事件
    if (backButton) {
        backButton.addEventListener('click', () => {
            mainCard.classList.remove('show-result');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    // 页面加载完成后聚焦输入框
    if (searchInput) {
        searchInput.focus();
    }

    console.log('一包丸子查询工具已初始化');
}