/**
 * particles.js - Interactive particle background
 */

const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null, radius: 160 },
    animationId: null,
    isRunning: true,
    
    init: function() {
        this.canvas = document.getElementById('bgCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isRunning = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            } else {
                this.isRunning = true;
                if (!this.animationId) {
                    this.animate();
                }
            }
        });
    },
    
    resize: function() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    createParticles: function() {
        const count = Math.min(Math.floor(window.innerWidth / 18), 75);
        this.particles = [];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 2 + 1
            });
        }
    },
    
    bindEvents: function() {
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Touch support for mobile
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (touch) {
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
            }
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });
        
        // Reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.particles = [];
        }
    },
    
    animate: function() {
        if (!this.isRunning) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        this.draw();
    },
    
    draw: function() {
        const ctx = this.ctx;
        if (!ctx) return;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles and connections
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.fill();
            
            // Connections between particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 135) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / 135)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(this.mouse.x, this.mouse.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.45 * (1 - dist / this.mouse.radius)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }
    }
};

// Export for global access
window.Particles = Particles;