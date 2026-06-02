// 顏色工具函數
class ColorUtils {
    // HEX 轉 RGB
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // RGB 轉 HEX
    static rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }

    // RGB 轉 HSL
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // HSL 轉 RGB
    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    // 獲取互補色
    static getComplementary(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.h = (hsl.h + 180) % 360;
        const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
        return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    // 獲取相似色
    static getAnalogous(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [];
        for (let i = -1; i <= 1; i++) {
            const newHsl = { ...hsl, h: (hsl.h + i * 30) % 360 };
            const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        return colors;
    }

    // 獲取三色組合
    static getTriadic(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [];
        for (let i = 0; i < 3; i++) {
            const newHsl = { ...hsl, h: (hsl.h + i * 120) % 360 };
            const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        return colors;
    }

    // 獲取四色組合
    static getTetradic(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [];
        for (let i = 0; i < 4; i++) {
            const newHsl = { ...hsl, h: (hsl.h + i * 90) % 360 };
            const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        return colors;
    }

    // 獲取單色系
    static getMonochromatic(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [];
        for (let i = 0; i < 5; i++) {
            const lightness = 20 + (i * 15);
            const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness);
            colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        return colors;
    }

    // 獲取深淺變化
    static getShades(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [];
        for (let i = -2; i <= 2; i++) {
            const lightness = Math.max(0, Math.min(100, hsl.l + i * 15));
            const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness);
            colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        return colors;
    }

    // 隨機顏色
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // 獲取對比度足夠的文本顏色
    static getTextColor(hex) {
        const rgb = this.hexToRgb(hex);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    // RGB 轉字符串
    static rgbToString(rgb) {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    // HSL 轉字符串
    static hslToString(hsl) {
        return `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    }

    // 獲取顏色名稱（近似）
    static getColorName(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        if (hsl.s < 10) {
            if (hsl.l < 20) return '黑色';
            if (hsl.l > 80) return '白色';
            return '灰色';
        }

        if (hsl.h < 30 || hsl.h >= 330) return '紅色';
        if (hsl.h < 60) return '橙色';
        if (hsl.h < 90) return '黃色';
        if (hsl.h < 150) return '綠色';
        if (hsl.h < 210) return '青色';
        if (hsl.h < 270) return '藍色';
        if (hsl.h < 300) return '紫色';
        return '紅色';
    }
}

// DOM 元素
const colorMode = document.getElementById('colorMode');
const baseColor = document.getElementById('baseColor');
const generateBtn = document.getElementById('generateBtn');
const colorsGrid = document.getElementById('colorsGrid');
const exportBtn = document.getElementById('exportBtn');
const exportCssBtn = document.getElementById('exportCssBtn');
const previewArea = document.getElementById('previewArea');
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const hslInput = document.getElementById('hslInput');
const toast = document.getElementById('toast');

// 應用狀態
let currentColors = [];
let lockedColors = new Set();

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    generateColors();
    setupEventListeners();
});

// 設置事件監聽器
function setupEventListeners() {
    generateBtn.addEventListener('click', generateColors);
    colorMode.addEventListener('change', generateColors);
    baseColor.addEventListener('change', generateColors);
    exportBtn.addEventListener('click', exportColors);
    exportCssBtn.addEventListener('click', exportCss);

    // 顏色轉換工具
    hexInput.addEventListener('input', (e) => {
        const hex = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            const rgb = ColorUtils.hexToRgb(hex);
            const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
            rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            hslInput.value = `${hsl.h}, ${hsl.s}, ${hsl.l}`;
        }
    });

    rgbInput.addEventListener('input', (e) => {
        const values = e.target.value.split(',').map(v => parseInt(v.trim()));
        if (values.length === 3 && values.every(v => v >= 0 && v <= 255)) {
            const hex = ColorUtils.rgbToHex(values[0], values[1], values[2]);
            const hsl = ColorUtils.rgbToHsl(values[0], values[1], values[2]);
            hexInput.value = hex;
            hslInput.value = `${hsl.h}, ${hsl.s}, ${hsl.l}`;
        }
    });

    hslInput.addEventListener('input', (e) => {
        const values = e.target.value.split(',').map(v => parseInt(v.trim()));
        if (values.length === 3) {
            const rgb = ColorUtils.hslToRgb(values[0], values[1], values[2]);
            const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b);
            hexInput.value = hex;
            rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        }
    });
}

// 生成配色
function generateColors() {
    const mode = colorMode.value;
    const base = baseColor.value;
    let colors = [];

    switch (mode) {
        case 'complementary':
            colors = [base, ColorUtils.getComplementary(base)];
            break;
        case 'analogous':
            colors = ColorUtils.getAnalogous(base);
            break;
        case 'triadic':
            colors = ColorUtils.getTriadic(base);
            break;
        case 'tetradic':
            colors = ColorUtils.getTetradic(base);
            break;
        case 'monochromatic':
            colors = ColorUtils.getMonochromatic(base);
            break;
        case 'shades':
            colors = ColorUtils.getShades(base);
            break;
        default: // random
            colors = Array.from({ length: 5 }, () => ColorUtils.getRandomColor());
    }

    // 保留鎖定的顏色
    const newColors = colors.map((color, index) => {
        if (lockedColors.has(index) && currentColors[index]) {
            return currentColors[index];
        }
        return color;
    });

    currentColors = newColors;
    renderColors();
    renderPreview();
    updateConverter();
}

// 渲染顏色卡片
function renderColors() {
    colorsGrid.innerHTML = '';

    currentColors.forEach((color, index) => {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.animation = `fadeIn 0.3s ease ${index * 0.05}s`;

        const rgb = ColorUtils.hexToRgb(color);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const textColor = ColorUtils.getTextColor(color);
        const colorName = ColorUtils.getColorName(color);

        card.innerHTML = `
            <div class="color-display" style="background-color: ${color}; color: ${textColor};">
                ${color.toUpperCase()}
            </div>
            <div class="color-info">
                <div class="color-hex">${color.toUpperCase()}</div>
                <div class="color-rgb">RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                <div class="color-name">${colorName}</div>
                <div class="color-buttons">
                    <button class="color-btn copy-btn" onclick="copyColor('${color}', 'hex')">複製</button>
                    <button class="color-btn lock-btn ${lockedColors.has(index) ? 'locked' : ''}" onclick="toggleLock(${index})">🔓</button>
                </div>
            </div>
        `;

        colorsGrid.appendChild(card);
    });
}

// 複製顏色
function copyColor(color, format) {
    let text = color;

    if (format === 'rgb') {
        const rgb = ColorUtils.hexToRgb(color);
        text = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    } else if (format === 'hsl') {
        const rgb = ColorUtils.hexToRgb(color);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        text = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    }

    navigator.clipboard.writeText(text);
    showToast(`已複製: ${text}`, 'success');
}

// 切換鎖定
function toggleLock(index) {
    if (lockedColors.has(index)) {
        lockedColors.delete(index);
    } else {
        lockedColors.add(index);
    }
    renderColors();
}

// 導出所有顏色
function exportColors() {
    const text = currentColors.map(color => color.toUpperCase()).join('\n');
    navigator.clipboard.writeText(text);
    showToast('已複製所有顏色代碼', 'success');
}

// 導出 CSS
function exportCss() {
    let css = ':root {\n';
    currentColors.forEach((color, index) => {
        css += `  --color-${index + 1}: ${color};\n`;
    });
    css += '}';

    navigator.clipboard.writeText(css);
    showToast('已複製 CSS 變量', 'success');
}

// 渲染預覽
function renderPreview() {
    previewArea.innerHTML = '';

    currentColors.forEach((color, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';

        const rgb = ColorUtils.hexToRgb(color);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);

        item.innerHTML = `
            <div class="preview-item-color" style="background-color: ${color};"></div>
            <div class="preview-item-text">${ColorUtils.getColorName(color)}</div>
            <div class="preview-item-text">${color.toUpperCase()}</div>
        `;

        previewArea.appendChild(item);
    });
}

// 更新轉換工具
function updateConverter() {
    if (currentColors.length > 0) {
        const color = currentColors[0];
        const rgb = ColorUtils.hexToRgb(color);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);

        hexInput.value = color.toUpperCase();
        rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        hslInput.value = `${hsl.h}, ${hsl.s}, ${hsl.l}`;
    }
}

// 顯示提示消息
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
