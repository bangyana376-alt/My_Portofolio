/**
 * main.js - Entry point Ultimate Portfolio
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 1. AOS
    AOS.init({
        duration: 800,
        once: true,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // 2. Particles
    if (typeof Particles !== 'undefined') {
        Particles.init();
    }

    // 3. Counters (animate on scroll)
    initCounters();

    // 4. Typewriter
    initTypewriter();

    // 5. Simulators
    if (typeof Simulator !== 'undefined') {
        Simulator.init();
    }

    // 6. Data Manager
    if (typeof DataManager !== 'undefined') {
        DataManager.init();
    }

    // 7. Router
    if (typeof Router !== 'undefined') {
        Router.init();
    }

    // 8. Mobile Menu
    initMobileMenu();

    // 9. Status Online
    initOnlineStatus();

    // 10. Career Selector
    initCareerSelector();

    // 11. Toast auto-hide
    document.addEventListener('click', function(e) {
        const toast = document.getElementById('toast');
        if (toast && toast.classList.contains('show')) {
            if (e.target.closest('.toast-close') || e.target.closest('.toast')) return;
            setTimeout(hideToast, 3000);
        }
    });

    // 12. Animate skill bars on scroll
    initSkillBars();
});

// ============================================
// COUNTERS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.animate-counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let current = 0;
                    const increment = target / 40;
                    
                    const update = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    update();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ============================================
// TYPEWRITER
// ============================================
function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;
    
    const roles = [
        "Data Entry Specialist",
        "Excel & Data Processing Expert",
        "Admin Distributor Professional",
        "Web & UI/UX Developer",
        "IT Support & Network Technician"
    ];
    
    let roleIndex = 0, charIndex = 0, isDeleting = false, timeoutId = null;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            el.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 30 : 60;
        
        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 300;
        }
        
        timeoutId = setTimeout(typeEffect, speed);
    }
    
    typeEffect();
    
    window.addEventListener('beforeunload', function() {
        if (timeoutId) clearTimeout(timeoutId);
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('hidden')) return;
        if (!e.target.closest('.mobile-header')) {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.focus();
        }
    });
}

window.toggleMobileMenu = function() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!menuBtn || !mobileMenu) return;
    
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
};

// ============================================
// ONLINE STATUS
// ============================================
function initOnlineStatus() {
    const statusElements = document.querySelectorAll('.status-text, .status-dot');
    const availabilityEl = document.getElementById('availabilityStatus');
    
    function updateStatus() {
        const now = new Date();
        const hours = now.getHours();
        const isOnline = hours >= 7 && hours < 22;
        
        const statusText = isOnline ? 'Online • Respon < 5 menit' : 'Offline • Balas dalam 12 jam';
        const statusColor = isOnline ? '#34d399' : '#94a3b8';
        const availability = isOnline ? 'Available for WFH • Full-time • Freelance' : 'Available • Respon dalam 12 jam';
        
        statusElements.forEach(el => {
            if (el.classList.contains('status-text')) {
                el.textContent = statusText;
            }
            if (el.classList.contains('status-dot') || el.classList.contains('status-dot-mobile')) {
                el.style.background = statusColor;
            }
        });
        
        if (availabilityEl) {
            availabilityEl.textContent = availability;
        }
    }
    
    updateStatus();
    setInterval(updateStatus, 60000);
}

// ============================================
// CAREER SELECTOR
// ============================================
function initCareerSelector() {
    const buttons = document.querySelectorAll('.career-btn');
    const descEl = document.getElementById('career-description');
    
    if (!buttons.length || !descEl) return;
    
    const descriptions = {
        'data-entry': `
            <span class="font-bold text-white text-base">⚡ Data Entry Specialist</span><br>
            Keahlian utama: <span class="text-emerald-400">Excel VLOOKUP/XLOOKUP, Pivot Table, Data Cleaning, PDF to Excel, 65+ WPM typing</span>.<br>
            Siap untuk posisi <strong class="text-emerald-400">WFH Data Entry</strong>, 
            <strong class="text-emerald-400">Admin Distributor</strong>, dan 
            <strong class="text-emerald-400">Administrasi Perkantoran</strong>.
        `,
        'web-dev': `
            <span class="font-bold text-white text-base">💻 Web Developer</span><br>
            Keahlian: <span class="text-amber-400">Laravel, Tailwind CSS, JavaScript, UI/UX Design</span>.<br>
            Siap untuk proyek <strong class="text-amber-400">Company Profile</strong>, 
            <strong class="text-amber-400">Web App</strong>, dan 
            <strong class="text-amber-400">Sistem Informasi</strong>.
        `,
        'it-support': `
            <span class="font-bold text-white text-base">🔧 IT Support & Network</span><br>
            Keahlian: <span class="text-cyan-400">MikroTik RouterOS, Fiber Optic (FTTH), Troubleshooting, Subnetting</span>.<br>
            Siap untuk posisi <strong class="text-cyan-400">Teknisi Jaringan</strong>, 
            <strong class="text-cyan-400">IT Support</strong>, dan 
            <strong class="text-cyan-400">Network Administrator</strong>.
        `
    };
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const career = this.dataset.career;
            if (descriptions[career]) {
                descEl.innerHTML = '<p class="text-sm text-slate-300 leading-relaxed">' + descriptions[career] + '</p>';
            }
        });
    });
}

window.filterCareer = function(career) {
    const btn = document.querySelector(`.career-btn[data-career="${career}"]`);
    if (btn) btn.click();
};

// ============================================
// SKILL BARS
// ============================================
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    bars.forEach(bar => observer.observe(bar));
}

// ============================================
// TOAST
// ============================================
window.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.style.borderColor = 'rgba(244,63,94,0.5)';
        toast.style.background = 'rgba(63,17,26,0.95)';
        toast.querySelector('i').className = 'fa-solid fa-circle-exclamation text-rose-400 text-base';
    } else {
        toast.style.borderColor = 'rgba(16,185,129,0.5)';
        toast.style.background = 'rgba(6,78,59,0.95)';
        toast.querySelector('i').className = 'fa-solid fa-circle-check text-emerald-400 text-base';
    }
    
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(hideToast, 3000);
};

window.hideToast = function() {
    const toast = document.getElementById('toast');
    if (toast) toast.className = 'toast';
};

// ============================================
// COPY TEXT
// ============================================
window.copyText = function(text) {
    if (!text) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('"' + text + '" berhasil disalin!'))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
};

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('"' + text + '" berhasil disalin!');
    } catch (e) {
        showToast('Gagal menyalin teks', 'error');
    }
    
    document.body.removeChild(textarea);
}

// ============================================
// MODALS
// ============================================
window.openHrModal = function() {
    const modal = document.getElementById('hrModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.querySelector('.modal-close')?.focus(), 100);
    }
};

window.closeHrModal = function() {
    const modal = document.getElementById('hrModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

window.openTestimonialForm = function() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('testiName')?.focus(), 100);
    }
};

window.closeTestimonialModal = function() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

// Close modals with Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';
    }
});

// Close modals by backdrop
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// ============================================
// CONTACT FORM
// ============================================
window.handleContactSubmit = function(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]');
    const email = form.querySelector('input[type="email"]');
    const jobType = form.querySelector('select');
    const message = form.querySelector('textarea');
    
    if (!name?.value.trim()) {
        showToast('Mohon isi nama Anda', 'error');
        name?.focus();
        return;
    }
    
    if (!email?.value.trim() || !isValidEmail(email.value)) {
        showToast('Mohon isi email yang valid', 'error');
        email?.focus();
        return;
    }
    
    if (!jobType?.value) {
        showToast('Pilih jenis pekerjaan', 'error');
        jobType?.focus();
        return;
    }
    
    if (!message?.value.trim()) {
        showToast('Mohon isi pesan Anda', 'error');
        message?.focus();
        return;
    }
    
    const jobLabels = {
        'data-entry': 'Data Entry Specialist',
        'admin': 'Admin Distributor',
        'web-dev': 'Web Developer',
        'it-support': 'IT Support',
        'freelance': 'Freelance Project',
        'other': 'Lainnya'
    };
    
    const waMsg = `Halo Suryana,%0A%0A*Nama:* ${encodeURIComponent(name.value)}%0A*Email:* ${encodeURIComponent(email.value)}%0A*Posisi:* ${encodeURIComponent(jobLabels[jobType.value] || jobType.value)}%0A*Pesan:*%0A${encodeURIComponent(message.value)}`;
    
    window.open(`https://wa.me/6285771868795?text=${waMsg}`, '_blank');
    showToast('Pesan terkirim! Silakan lanjutkan di WhatsApp');
    form.reset();
};

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// TEMPLATE MESSAGES
// ============================================
window.sendTemplate = function(type) {
    const templates = {
        'data-entry': 'Halo Suryana, saya tertarik dengan jasa Data Entry WFH Anda. Saya butuh bantuan untuk mengolah data Excel perusahaan kami. Apakah Anda tersedia untuk diskusi?',
        'web-dev': 'Halo Suryana, saya melihat portofolio web Anda. Saya butuh bantuan untuk membuat website company profile. Bisakah kita diskusi lebih lanjut?',
        'admin': 'Halo Suryana, kami mencari Admin Distributor yang teliti. Saya tertarik dengan pengalaman Anda di PT. Sinergi Multi Distrindo.',
        'it-support': 'Halo Suryana, kami butuh bantuan untuk setting jaringan kantor. Apakah Anda bisa membantu?'
    };
    
    const msg = encodeURIComponent(templates[type] || templates['data-entry']);
    window.open(`https://wa.me/6285771868795?text=${msg}`, '_blank');
    showToast('Template pesan dikirim ke WhatsApp');
};

// ============================================
// AUTO APPLY
// ============================================
window.autoApply = function(platform) {
    const message = encodeURIComponent(
        'Halo, saya Suryana - Data Entry & IT Specialist.\n' +
        'Portfolio: https://suryana.tech\n' +
        'WA: 085771868795\n' +
        'Email: bangyana376@gmail.com\n\n' +
        'Saya tertarik dengan posisi Data Entry / Admin / IT Support yang tersedia.\n' +
        'Terima kasih.'
    );
    
    const urls = {
        linkedin: 'https://www.linkedin.com/messaging/compose/?body=' + message,
        upwork: 'https://www.upwork.com/ab/find-work/',
        fiverr: 'https://www.fiverr.com/'
    };
    
    window.open(urls[platform], '_blank');
    showToast('Membuka ' + platform.charAt(0).toUpperCase() + platform.slice(1) + '...');
};

// ============================================
// TESTIMONIAL FORM
// ============================================
window.handleTestimonialSubmit = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('testiName')?.value.trim();
    const role = document.getElementById('testiRole')?.value.trim();
    const text = document.getElementById('testiText')?.value.trim();
    const rating = document.getElementById('testiRating')?.value || 5;
    
    if (!name) { showToast('Mohon isi nama Anda', 'error'); return; }
    if (!role) { showToast('Mohon isi posisi Anda', 'error'); return; }
    if (!text) { showToast('Mohon isi testimoni', 'error'); return; }
    
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const initial = name.charAt(0).toUpperCase();
    
    // Add testimoni to grid
    const grid = document.querySelector('.testimonial-grid');
    if (grid) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.setAttribute('data-aos', 'fade-up');
        card.innerHTML = `
            <div class="testimonial-stars">${stars}</div>
            <p class="testimonial-text">"${text}"</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${initial}</div>
                <div>
                    <strong>${name}</strong>
                    <span>${role}</span>
                </div>
            </div>
        `;
        grid.prepend(card);
    }
    
    closeTestimonialModal();
    document.getElementById('testimonialForm')?.reset();
    showToast('Terima kasih! Testimoni Anda telah ditambahkan.');
};

window.setRating = function(rating) {
    document.getElementById('testiRating').value = rating;
    document.querySelectorAll('.star').forEach((el, i) => {
        el.classList.toggle('active', i < rating);
    });
};

// ============================================
// PRINT HANDLER
// ============================================
window.addEventListener('beforeprint', function() {
    document.querySelectorAll('.page-view.hidden-view').forEach(el => {
        el.style.display = 'block';
        el.style.opacity = '1';
    });
});

window.addEventListener('afterprint', function() {
    document.querySelectorAll('.page-view.hidden-view').forEach(el => {
        el.style.display = '';
        el.style.opacity = '';
    });
});