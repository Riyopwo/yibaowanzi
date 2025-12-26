// === validator.js ===
// 只做分离，不做任何修改！

// ========== 数据验证函数 ==========
function validateData(data) {
    if (typeof data !== 'object' || data === null) {
        throw new Error('数据格式错误');
    }

    const safeData = {};
    for (const key in data) {
        // 跳过原型链上的属性
        if (!data.hasOwnProperty(key)) continue;

        // 清理键名（防止XSS）
        const safeKey = key.replace(/[<>"'`\\]/g, '');
        if (!safeKey) continue; // 跳过空键名

        const item = data[key];
        if (item && typeof item === 'object') {
            // 创建安全的副本
            safeData[safeKey] = {
                txt_url: isValidURL(item.txt_url) ? item.txt_url : '（地址无效）',
                epub_url: isValidURL(item.epub_url) ? item.epub_url : '（地址无效）',
                txt_code: isValidCode(item.txt_code) ? item.txt_code : '未知',
                epub_code: isValidCode(item.epub_code) ? item.epub_code : '未知'
            };
        }
    }

    // 检查数据量（防止恶意大文件）
    const keys = Object.keys(safeData);
    if (keys.length > 500) {
        console.warn('数据量较大：' + keys.length + '个条目');
    }

    return safeData;
}