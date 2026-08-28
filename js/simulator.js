/**
 * simulator.js - All simulator logic
 * Includes: Network Calculator, DO Manager, Payroll, SAW
 */

const Simulator = {
    chartInstance: null,
    sawWeights: { c1: 0.30, c2: 0.35, c3: 0.20, c4: 0.15 },
    
    init: function() {
        this.renderDO();
        this.calculateSAW();
        this.calculatePayroll();
        this.calculateNetwork();
        
        // Listen for data changes
        document.addEventListener('dataChanged', () => {
            this.renderDO();
            this.calculateSAW();
        });
    },
    
    // ===== NETWORK CALCULATOR =====
    calculateNetwork: function() {
        const prefix = document.getElementById('netPrefix')?.value || '24';
        this.updateNetworkResult(prefix);
    },
    
    updateNetworkResult: function(prefix) {
        const results = {
            '24': { hosts: '254 IP Host', mask: '255.255.255.0', usage: 'Ideal untuk Jaringan Utama Kantor / PT' },
            '25': { hosts: '126 IP Host', mask: '255.255.255.128', usage: 'Ideal untuk Subnet Divisi Administrasi & Staff' },
            '26': { hosts: '62 IP Host', mask: '255.255.255.192', usage: 'Ideal untuk Ruang Server & Router MikroTik' },
            '28': { hosts: '14 IP Host', mask: '255.255.255.240', usage: 'Ideal untuk Jaringan Point-to-Point / AP Terisolasi' }
        };
        
        const result = results[prefix] || results['24'];
        
        const maxHost = document.getElementById('resMaxHost');
        const subnetMask = document.getElementById('resSubnetMask');
        const netUsage = document.getElementById('resNetUsage');
        
        if (maxHost) maxHost.textContent = result.hosts;
        if (subnetMask) subnetMask.textContent = result.mask;
        if (netUsage) netUsage.textContent = result.usage;
    },
    
    // ===== DELIVERY ORDER =====
    renderDO: function() {
        const orders = DataManager.getDeliveryOrders();
        const searchQuery = document.getElementById('searchInput')?.value || '';
        const filtered = DataManager.searchDeliveryOrders(searchQuery);
        
        const tbody = document.getElementById('doTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400 text-sm">
                        <i class="fa-solid fa-inbox text-2xl block mb-2"></i>
                        Tidak ada data DO ditemukan
                    </td>
                </tr>
            `;
        } else {
            filtered.forEach(order => {
                const badgeClass = this.getStatusBadgeClass(order.status);
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-white/5 transition';
                tr.innerHTML = `
                    <td class="p-3.5 font-bold text-blue-400">${this.escapeHtml(order.doNo)}</td>
                    <td class="p-3.5 font-medium text-slate-200">${this.escapeHtml(order.customer)}</td>
                    <td class="p-3.5 text-slate-400">${this.escapeHtml(order.expedition)}</td>
                    <td class="p-3.5 font-semibold text-slate-300">${order.qty} Box</td>
                    <td class="p-3.5"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeClass}">${order.status}</span></td>
                    <td class="p-3.5 text-center">
                        <button onclick="Simulator.deleteDO(${order.id})" class="text-rose-400 hover:text-rose-300 text-xs font-bold" aria-label="Hapus DO">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
        
        this.updateDOStats();
        this.updateCharts();
    },
    
    getStatusBadgeClass: function(status) {
        const map = {
            'Delivered': 'bg-emerald-950 text-emerald-400 border-emerald-800',
            'Pending': 'bg-amber-950 text-amber-400 border-amber-800',
            'Retur': 'bg-rose-950 text-rose-400 border-rose-800'
        };
        return map[status] || 'bg-slate-800 text-slate-400 border-slate-700';
    },
    
    updateDOStats: function() {
        const stats = DataManager.getDOStats();
        
        const total = document.getElementById('statTotal');
        const delivered = document.getElementById('statDelivered');
        const pending = document.getElementById('statPending');
        const retur = document.getElementById('statRetur');
        
        if (total) total.textContent = stats.total + ' DO';
        if (delivered) delivered.textContent = stats.delivered + ' DO';
        if (pending) pending.textContent = stats.pending + ' DO';
        if (retur) retur.textContent = stats.retur + ' DO';
    },
    
    deleteDO: function(id) {
        if (confirm('Yakin ingin menghapus DO ini?')) {
            DataManager.deleteDeliveryOrder(id);
            this.renderDO();
            showToast('DO berhasil dihapus');
        }
    },
    
    // ===== CHARTS =====
    updateCharts: function() {
        const ctx = document.getElementById('doChart')?.getContext('2d');
        if (!ctx) return;
        
        const stats = DataManager.getDOStats();
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
        
        // Check if all zero
        if (stats.delivered === 0 && stats.pending === 0 && stats.retur === 0) {
            this.chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Terkirim', 'Pending', 'Retur'],
                    datasets: [{
                        data: [1, 0, 0],
                        backgroundColor: ['#475569', '#475569', '#475569'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            position: 'bottom', 
                            labels: { 
                                boxWidth: 10, 
                                font: { size: 10, family: 'Plus Jakarta Sans' }, 
                                color: '#94a3b8' 
                            } 
                        }
                    }
                }
            });
            return;
        }
        
        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Terkirim', 'Pending', 'Retur'],
                datasets: [{
                    data: [stats.delivered, stats.pending, stats.retur],
                    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            boxWidth: 10, 
                            font: { size: 10, family: 'Plus Jakarta Sans' }, 
                            color: '#94a3b8' 
                        } 
                    }
                }
            }
        });
    },
    
    // ===== PAYROLL CALCULATOR =====
    calculatePayroll: function() {
        const baseInput = document.getElementById('payBase');
        const daysInput = document.getElementById('payDays');
        const overtimeInput = document.getElementById('payOvertime');
        const resultEl = document.getElementById('payResult');
        
        if (!baseInput || !daysInput || !overtimeInput || !resultEl) return;
        
        const base = this.parseNumber(baseInput.value, 0);
        const days = this.parseNumber(daysInput.value, 0);
        const overtime = this.parseNumber(overtimeInput.value, 0);
        
        const hourlyRate = base / 8;
        const overtimeRate = hourlyRate * 1.5;
        const total = (base * days) + (overtime * overtimeRate);
        
        resultEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
    },
    
    // ===== SAW CALCULATOR =====
    calculateSAW: function() {
        const employees = DataManager.getSAWEmployees();
        
        const tableBody = document.getElementById('sawTableBody');
        const rankBody = document.getElementById('sawRankBody');
        
        if (!tableBody || !rankBody) return;
        
        // Render matrix table
        tableBody.innerHTML = '';
        if (employees.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-4 text-center text-slate-400 text-sm">
                        Belum ada data karyawan
                    </td>
                </tr>
            `;
            rankBody.innerHTML = `
                <tr>
                    <td colspan="3" class="p-4 text-center text-slate-400 text-sm">
                        Tambahkan karyawan untuk melihat hasil
                    </td>
                </tr>
            `;
            return;
        }
        
        employees.forEach(emp => {
            tableBody.innerHTML += `
                <tr class="hover:bg-white/5">
                    <td class="p-3 font-bold text-white">${this.escapeHtml(emp.name)}</td>
                    <td class="p-3 text-cyan-400">${emp.c1}</td>
                    <td class="p-3 text-cyan-400">${emp.c2}</td>
                    <td class="p-3 text-cyan-400">${emp.c3}</td>
                    <td class="p-3 text-rose-400">${emp.c4} Kali</td>
                    <td class="p-3 text-center">
                        <button onclick="Simulator.deleteSAW(${emp.id})" class="text-rose-400 hover:text-rose-300 font-bold" aria-label="Hapus karyawan">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        // Calculate SAW
        if (employees.length === 0) {
            rankBody.innerHTML = `
                <tr>
                    <td colspan="3" class="p-4 text-center text-slate-400 text-sm">
                        Tambahkan karyawan untuk melihat hasil
                    </td>
                </tr>
            `;
            return;
        }
        
        const maxC1 = Math.max(...employees.map(e => e.c1));
        const maxC2 = Math.max(...employees.map(e => e.c2));
        const maxC3 = Math.max(...employees.map(e => e.c3));
        const minC4 = Math.min(...employees.map(e => e.c4 === 0 ? 0.1 : e.c4));
        
        const processed = employees.map(emp => {
            const r1 = emp.c1 / maxC1;
            const r2 = emp.c2 / maxC2;
            const r3 = emp.c3 / maxC3;
            const actualC4 = emp.c4 === 0 ? 0.1 : emp.c4;
            const r4 = minC4 / actualC4;
            
            const v = (r1 * this.sawWeights.c1) + 
                     (r2 * this.sawWeights.c2) + 
                     (r3 * this.sawWeights.c3) + 
                     (r4 * this.sawWeights.c4);
            
            return { ...emp, v: v.toFixed(4) };
        });
        
        const sorted = [...processed].sort((a, b) => parseFloat(b.v) - parseFloat(a.v));
        
        rankBody.innerHTML = '';
        sorted.forEach((emp, idx) => {
            let badgeClass = 'bg-slate-800 text-slate-300';
            if (idx === 0) badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold';
            
            rankBody.innerHTML += `
                <tr class="hover:bg-white/5">
                    <td class="p-2.5"><span class="px-2 py-0.5 rounded-md text-[10px] ${badgeClass}">#${idx + 1}</span></td>
                    <td class="p-2.5 font-bold text-white">${this.escapeHtml(emp.name)}</td>
                    <td class="p-2.5 font-extrabold text-emerald-400">${emp.v}</td>
                </tr>
            `;
        });
    },
    
    deleteSAW: function(id) {
        if (confirm('Yakin ingin menghapus karyawan ini?')) {
            DataManager.deleteSAWEmployee(id);
            this.calculateSAW();
            showToast('Karyawan berhasil dihapus');
        }
    },
    
    // ===== UTILITY =====
    parseNumber: function(value, fallback = 0) {
        const num = parseFloat(value);
        return isNaN(num) || num < 0 ? fallback : num;
    },
    
    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ============================================
// GLOBAL FUNCTIONS FOR INLINE EVENT HANDLERS
// ============================================

window.runNetCalc = function() {
    const prefix = document.getElementById('netPrefix')?.value;
    if (prefix) Simulator.updateNetworkResult(prefix);
};

window.runPayrollCalc = function() {
    Simulator.calculatePayroll();
};

window.openAddModal = function() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.getElementById('inputDO')?.focus();
        }, 100);
    }
};

window.closeAddModal = function() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
};

window.handleAddDO = function(event) {
    event.preventDefault();
    
    const doNo = document.getElementById('inputDO')?.value.trim();
    const customer = document.getElementById('inputCustomer')?.value.trim();
    const expedition = document.getElementById('inputExpedition')?.value;
    const qty = document.getElementById('inputQty')?.value;
    const status = document.getElementById('inputStatus')?.value;
    
    if (!doNo) {
        showToast('Mohon isi No. DO', 'error');
        document.getElementById('inputDO')?.focus();
        return;
    }
    
    if (!customer) {
        showToast('Mohon isi Nama Toko', 'error');
        document.getElementById('inputCustomer')?.focus();
        return;
    }
    
    DataManager.addDeliveryOrder({ doNo, customer, expedition, qty, status });
    Simulator.renderDO();
    closeAddModal();
    document.getElementById('doForm')?.reset();
    showToast('DO berhasil ditambahkan!');
};

// SAW Modal
window.openSawModal = function() {
    const modal = document.getElementById('sawModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.getElementById('sawInputName')?.focus();
        }, 100);
    }
};

window.closeSawModal = function() {
    const modal = document.getElementById('sawModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
};

window.handleAddSawEmployee = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('sawInputName')?.value.trim();
    const c1 = document.getElementById('sawInputC1')?.value;
    const c2 = document.getElementById('sawInputC2')?.value;
    const c3 = document.getElementById('sawInputC3')?.value;
    const c4 = document.getElementById('sawInputC4')?.value;
    
    if (!name) {
        showToast('Mohon isi Nama Karyawan', 'error');
        document.getElementById('sawInputName')?.focus();
        return;
    }
    
    DataManager.addSAWEmployee({ name, c1, c2, c3, c4 });
    Simulator.calculateSAW();
    closeSawModal();
    event.target.reset();
    showToast('Karyawan berhasil ditambahkan!');
};

// Search handler for DO
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            Simulator.renderDO();
        });
    }
});

// Export for global access
window.Simulator = Simulator;