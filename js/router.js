/**
 * router.js - Page navigation & routing logic
 */

const Router = {
    currentPage: 'view-about',
    pages: {},
    navButtons: {},
    
    init: function() {
        // Get all page views
        document.querySelectorAll('.page-view').forEach(el => {
            this.pages[el.id] = el;
        });
        
        // Get all navigation buttons
        document.querySelectorAll('.nav-btn').forEach(el => {
            const pageId = el.id.replace('nav-', '');
            this.navButtons[pageId] = el;
        });
        
        // Set initial page
        this.switchPage('view-about');
    },
    
    switchPage: function(pageId) {
        // Validate page exists
        if (!this.pages[pageId]) {
            console.warn('Page not found:', pageId);
            return;
        }
        
        // Hide all pages
        Object.values(this.pages).forEach(page => {
            page.classList.add('hidden-view');
            page.classList.remove('animate-page-enter');
        });
        
        // Show target page
        const targetPage = this.pages[pageId];
        targetPage.classList.remove('hidden-view');
        // Trigger reflow for animation
        void targetPage.offsetWidth;
        targetPage.classList.add('animate-page-enter');
        
        // Update navigation
        Object.values(this.navButtons).forEach(btn => {
            btn.classList.remove('nav-btn-active');
            btn.removeAttribute('aria-current');
        });
        
        const activeBtn = this.navButtons[pageId];
        if (activeBtn) {
            activeBtn.classList.add('nav-btn-active');
            activeBtn.setAttribute('aria-current', 'page');
        }
        
        // Update current page
        this.currentPage = pageId;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger simulator update if needed
        if (pageId === 'view-demo-app') {
            setTimeout(() => {
                if (typeof Simulator !== 'undefined') {
                    Simulator.updateCharts();
                }
            }, 300);
        }
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('pageChange', { 
            detail: { pageId } 
        }));
    }
};

// Global function for inline onclick
window.switchPage = function(pageId) {
    Router.switchPage(pageId);
};

// ============================================
// DEMO APP - Simulator Tab Switching
// ============================================
window.switchSimTab = function(tab) {
    const views = {
        net: document.getElementById('simNetView'),
        do: document.getElementById('simDoView'),
        payroll: document.getElementById('simPayrollView'),
        saw: document.getElementById('simSawView')
    };
    
    const buttons = {
        net: document.getElementById('tabNetBtn'),
        do: document.getElementById('tabDoBtn'),
        payroll: document.getElementById('tabPayrollBtn'),
        saw: document.getElementById('tabSawBtn')
    };
    
    // Hide all views
    Object.values(views).forEach(v => v?.classList.add('hidden'));
    
    // Reset all buttons
    Object.values(buttons).forEach(b => {
        if (b) {
            b.className = 'sim-tab';
        }
    });
    
    // Show selected view
    const view = views[tab];
    const button = buttons[tab];
    
    if (view) view.classList.remove('hidden');
    if (button) {
        button.className = 'sim-tab active';
        // Add color class
        if (tab === 'net') button.classList.add('cyan');
        else if (tab === 'do') button.classList.add('blue');
        else if (tab === 'payroll') button.classList.add('emerald');
        else if (tab === 'saw') button.classList.add('purple');
    }
    
    // Trigger specific tab actions
    if (tab === 'payroll' && typeof Simulator !== 'undefined') {
        Simulator.calculatePayroll();
    }
    if (tab === 'saw' && typeof Simulator !== 'undefined') {
        Simulator.calculateSAW();
    }
    if (tab === 'do' && typeof Simulator !== 'undefined') {
        setTimeout(() => Simulator.updateCharts(), 100);
    }
};

// ============================================
// DOM READY - Initialize Router
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    Router.init();
});