/**
 * utils.js - Utility functions
 */

// ============================================
// DEBOUNCE
// ============================================
function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ============================================
// THROTTLE
// ============================================
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// HTML ESCAPE
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// VALIDATE EMAIL
// ============================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// VALIDATE NUMBER
// ============================================
function validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num)) return min;
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

// ============================================
// FORMAT CURRENCY
// ============================================
function formatCurrency(value, locale = 'id-ID', currency = 'IDR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(value);
}

// ============================================
// TRUNCATE TEXT
// ============================================
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ============================================
// DETECT MOBILE
// ============================================
function isMobile() {
    return window.innerWidth < 768;
}

// ============================================
// DETECT TOUCH DEVICE
// ============================================
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// ============================================
// SAFE QUERY SELECTOR
// ============================================
function $(selector, context = document) {
    return context.querySelector(selector);
}

function $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
        return false;
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        return null;
    }
}

// ============================================
// ANIMATION FRAME HELPER
// ============================================
function requestAnimationFrameSafe(callback) {
    if (typeof requestAnimationFrame === 'function') {
        return requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16);
}

// ============================================
// INTERSECTION OBSERVER HELPER
// ============================================
function onElementVisible(element, callback, threshold = 0.1) {
    if (!element) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(element);
                observer.disconnect();
            }
        });
    }, { threshold });
    
    observer.observe(element);
    return observer;
}

// Export for global access
window.Utils = {
    debounce,
    throttle,
    escapeHtml,
    isValidEmail,
    validateNumber,
    formatCurrency,
    truncateText,
    isMobile,
    isTouchDevice,
    $,
    $$,
    saveToStorage,
    loadFromStorage,
    requestAnimationFrameSafe,
    onElementVisible
};