// === main.js ===
// 只做分离，不做任何修改！

// ========== 主初始化函数 ==========
function init() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
        // 设置UI事件监听器
        if (typeof setupEventListeners === 'function') {
            setupEventListeners();
        } else {
            console.error('UI模块未加载');
        }
    });
}
// ========== 启动应用 ==========
init();