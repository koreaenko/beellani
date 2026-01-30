/**
 * Bellani Beauty - Premium Lash Studio
 * JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initHeroInteractive();
});

/**
 * Interactive Hero Section with Mouse Tracking
 */
function initHeroInteractive() {
    const hero = document.querySelector('.hero');
    const floatingElements = document.getElementById('floating-elements');
    const canvas = document.getElementById('hero-canvas');

    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0, radius: 150 };
    let animationId;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.5
                ? `rgba(201, 168, 124, ${this.alpha})`  // Gold
                : `rgba(212, 165, 165, ${this.alpha})`; // Rose
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Calculate distance from mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to base position smoothly
                if (this.x !== this.baseX) {
                    const dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    const dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();
    window.addEventListener('resize', initParticles);

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Connect particles that are close
        connectParticles();

        animationId = requestAnimationFrame(animate);
    }

    // Connect nearby particles with lines
    function connectParticles() {
        const maxDistance = 120;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.15;
                    ctx.strokeStyle = `rgba(201, 168, 124, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    animate();

    // Mouse move effect on floating elements
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update mouse position for particles
        mouse.x = x;
        mouse.y = y;

        // Calculate movement for floating elements (parallax)
        const moveX = (x - rect.width / 2) / 30;
        const moveY = (y - rect.height / 2) / 30;

        if (floatingElements) {
            floatingElements.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        mouse.x = 0;
        mouse.y = 0;
        if (floatingElements) {
            floatingElements.style.transform = 'translate(0, 0)';
        }
    });

    // Touch support for mobile
    hero.addEventListener('touchmove', (e) => {
        const rect = hero.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    });
}


/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Hamburger animation
    hamburger.addEventListener('click', function () {
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.about-content, .about-image, .service-card, .gallery-item, .review-card, .contact-info, .contact-form-wrapper'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.innerHTML = `
            <span>전송 중...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="30 30" stroke-linecap="round"/>
            </svg>
        `;
        submitBtn.disabled = true;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .spinner {
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);

        // Simulate form submission (in production, replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        submitBtn.innerHTML = `
            <span>전송 완료!</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        `;
        submitBtn.style.background = '#4CAF50';

        // Show success message
        showNotification('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다!', 'success');

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 2000);
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success'
            ? '<path d="M20 6L9 17l-5-5"/>'
            : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>'}
        </svg>
        <span>${message}</span>
    `;

    // Inject styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 0.9rem;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    notification.querySelector('svg').style.cssText = 'width: 20px; height: 20px; flex-shrink: 0;';

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

/**
 * Add parallax effect to hero section
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const floatingElements = document.querySelectorAll('.float-circle');
        floatingElements.forEach((el, i) => {
            const speed = 0.1 + (i * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

/**
 * Active nav link highlighting
 */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop &&
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/**
 * Initialize all sliders
 */
document.addEventListener('DOMContentLoaded', () => {
    initSlider('gallery-slider', 'gallery-dots', 3);
    initSlider('reviews-slider', 'reviews-dots', 3);
});

/**
 * Slider/Carousel functionality
 */
function initSlider(sliderId, dotsId, itemsPerView = 1) {
    const container = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);

    if (!container) return;

    const track = container.querySelector('.slider-track');
    const items = container.querySelectorAll('.slider-item');
    const prevBtn = container.querySelector('.slider-prev');
    const nextBtn = container.querySelector('.slider-next');

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    let visibleItems = getVisibleItems();
    let totalSlides = Math.ceil(items.length / visibleItems);

    // Get number of visible items based on screen width
    function getVisibleItems() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return itemsPerView;
    }

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        totalSlides = Math.ceil(items.length / visibleItems);

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update dots
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        const maxIndex = totalSlides - 1;
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const itemWidth = 100 / visibleItems;
        const offset = currentIndex * visibleItems * itemWidth;
        track.style.transform = `translateX(-${offset}%)`;

        updateDots();
        updateButtons();
    }

    // Update button states
    function updateButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides - 1;
    }

    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    // Next slide
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch/Swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Mouse drag support
    let mouseStartX = 0;
    let isMouseDragging = false;

    track.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        isMouseDragging = true;
        track.style.cursor = 'grabbing';
    });

    track.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
    });

    track.addEventListener('mouseup', (e) => {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        track.style.cursor = 'grab';

        const diff = mouseStartX - e.clientX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    track.addEventListener('mouseleave', () => {
        isMouseDragging = false;
        track.style.cursor = 'grab';
    });

    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newVisibleItems = getVisibleItems();
            if (newVisibleItems !== visibleItems) {
                visibleItems = newVisibleItems;
                totalSlides = Math.ceil(items.length / visibleItems);
                currentIndex = Math.min(currentIndex, totalSlides - 1);
                createDots();
                goToSlide(currentIndex);
            }
        }, 200);
    });

    // Auto-slide (optional - uncomment to enable)
    // setInterval(() => {
    //     if (currentIndex < totalSlides - 1) {
    //         nextSlide();
    //     } else {
    //         goToSlide(0);
    //     }
    // }, 5000);

    // Initialize
    createDots();
    updateButtons();
}
