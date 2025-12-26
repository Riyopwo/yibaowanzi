// === utils.js ===
// 只做分离，不做任何修改！

// ========== 简单安全函数 ==========
function makeSafe(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/&/g, '和')
        .replace(/</g, '小于')
        .replace(/>/g, '大于')
        .replace(/"/g, '双引号')
        .replace(/'/g, '单引号');
}

// ========== 验证函数 ==========
function isValidURL(url) {
    // 允许"..."占位符
    if (url === '...') return true;
    if (!url || url.trim() === '') return false;

    try {
        const urlObj = new URL(url);
        // 只允许 http: 和 https: 协议
        const allowedProtocols = ['http:', 'https:'];
        if (!allowedProtocols.includes(urlObj.protocol)) {
            return false;
        }

        // 检查域名是否合法（至少有一个点号，且不是本地地址）
        const hostname = urlObj.hostname;
        if (hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1' ||
            hostname.includes('..')) {
            return false;
        }

        // 检查端口（如果有）是否合理
        const port = urlObj.port;
        if (port) {
            const portNumber = parseInt(port, 10);
            if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
                return false;
            }
        }

        return true;
    } catch {
        return false;
    }
}

function isValidCode(code) {
    // 允许"...."占位符
    if (code === '....') return true;
    if (!code || code.trim() === '') return false;

    // 提取码可以是字母、数字、中文，长度1-20
    // 注意：有些网盘可能用中文提取码
    return /^[\u4e00-\u9fa5a-zA-Z\d_-]{1,20}$/.test(code);
}

// ========== 复制功能函数 ==========
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        button.classList.add('copied');
        button.style.background = '#10b981';

        setTimeout(() => {
            button.classList.remove('copied');
            button.style.background = '';
        }, 3000);
    }).catch(err => {
        console.error('复制失败: ', err);
        alert('复制失败，请手动复制地址');
    });
}