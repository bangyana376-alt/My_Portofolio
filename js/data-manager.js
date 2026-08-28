/**
 * data-manager.js - Data persistence & management
 * Uses localStorage for persistence
 */

const DataManager = {
    storageKey: 'suryana_portfolio_data',
    data: {
        deliveryOrders: [],
        sawEmployees: []
    },
    
    init: function() {
        this.loadFromStorage();
        this.initDefaultData();
        this.saveToStorage();
    },
    
    loadFromStorage: function() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.data = { ...this.data, ...parsed };
            }
        } catch (e) {
            console.warn('Failed to load data from localStorage:', e);
        }
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save data to localStorage:', e);
        }
    },
    
    initDefaultData: function() {
        // Default Delivery Orders
        if (this.data.deliveryOrders.length === 0) {
            this.data.deliveryOrders = [
                { id: 1, doNo: 'DO-2026-0901', customer: 'Toko Berkah Mandiri', expedition: 'J&T Cargo', qty: 15, status: 'Delivered' },
                { id: 2, doNo: 'DO-2026-0902', customer: 'CV Sinar Utama', expedition: 'JNE Trucking', qty: 30, status: 'Delivered' },
                { id: 3, doNo: 'DO-2026-0903', customer: 'Toko Cahaya Interior', expedition: 'Internal Fleet', qty: 8, status: 'Pending' },
                { id: 4, doNo: 'DO-2026-0904', customer: 'PT Sentosa Abadi', expedition: 'SiCepat Dok', qty: 45, status: 'Delivered' },
                { id: 5, doNo: 'DO-2026-0905', customer: 'Smart Daily Shop Customer', expedition: 'J&T Cargo', qty: 4, status: 'Retur' }
            ];
        }
        
        // Default SAW Employees
        if (this.data.sawEmployees.length === 0) {
            this.data.sawEmployees = [
                { id: 1, name: 'Suryana', c1: 95, c2: 92, c3: 90, c4: 0 },
                { id: 2, name: 'Ahmad Rizky', c1: 85, c2: 88, c3: 82, c4: 2 },
                { id: 3, name: 'Siti Nurhaliza', c1: 78, c2: 95, c3: 85, c4: 1 }
            ];
        }
    },
    
    // ===== DELIVERY ORDER METHODS =====
    getDeliveryOrders: function() {
        return [...this.data.deliveryOrders];
    },
    
    addDeliveryOrder: function(order) {
        const newOrder = {
            id: Date.now(),
            doNo: order.doNo.trim(),
            customer: order.customer.trim(),
            expedition: order.expedition,
            qty: parseInt(order.qty) || 0,
            status: order.status
        };
        this.data.deliveryOrders.unshift(newOrder);
        this.saveToStorage();
        return newOrder;
    },
    
    deleteDeliveryOrder: function(id) {
        this.data.deliveryOrders = this.data.deliveryOrders.filter(o => o.id !== id);
        this.saveToStorage();
    },
    
    searchDeliveryOrders: function(query) {
        if (!query || !query.trim()) return this.getDeliveryOrders();
        const q = query.toLowerCase().trim();
        return this.data.deliveryOrders.filter(o => 
            o.doNo.toLowerCase().includes(q) || 
            o.customer.toLowerCase().includes(q)
        );
    },
    
    getDOStats: function() {
        const orders = this.data.deliveryOrders;
        return {
            total: orders.length,
            delivered: orders.filter(o => o.status === 'Delivered').length,
            pending: orders.filter(o => o.status === 'Pending').length,
            retur: orders.filter(o => o.status === 'Retur').length
        };
    },
    
    // ===== SAW EMPLOYEE METHODS =====
    getSAWEmployees: function() {
        return [...this.data.sawEmployees];
    },
    
    addSAWEmployee: function(employee) {
        const newEmployee = {
            id: Date.now(),
            name: employee.name.trim(),
            c1: Math.min(100, Math.max(1, parseInt(employee.c1) || 50)),
            c2: Math.min(100, Math.max(1, parseInt(employee.c2) || 50)),
            c3: Math.min(100, Math.max(1, parseInt(employee.c3) || 50)),
            c4: Math.max(0, parseInt(employee.c4) || 0)
        };
        this.data.sawEmployees.push(newEmployee);
        this.saveToStorage();
        return newEmployee;
    },
    
    deleteSAWEmployee: function(id) {
        this.data.sawEmployees = this.data.sawEmployees.filter(e => e.id !== id);
        this.saveToStorage();
    },
    
    // ===== UTILITY =====
    clearAllData: function() {
        if (confirm('Yakin ingin menghapus semua data?')) {
            this.data.deliveryOrders = [];
            this.data.sawEmployees = [];
            this.saveToStorage();
            this.initDefaultData();
            this.saveToStorage();
            showToast('Data berhasil direset');
            if (typeof Simulator !== 'undefined') {
                Simulator.renderDO();
                Simulator.calculateSAW();
            }
        }
    }
};

// Export for global access
window.DataManager = DataManager;