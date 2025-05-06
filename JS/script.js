document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initDarkMode();
    initBackToTop();
    initPreloader();
    initCursorEffects();
    initScrollEvents();
    initCounterAnimation();
    initSidebarToggle();
    certifications();
});

/** === INTERSECTION OBSERVER FOR ANIMATIONS === **/
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.card, .timeline-wrapper, .circle')
        .forEach(el => observer.observe(el));
}

/** === DARK MODE TOGGLE & LOCAL STORAGE PERSISTENCE === **/
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
}

/** === BACK TO TOP BUTTON === **/
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/** === PRELOADER HIDE === **/
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader')?.classList.add('hidden');
        }, 300);
    });
}

/** === CONSOLIDATED SCROLL EVENT LISTENER === **/
function initScrollEvents() {
    window.addEventListener('scroll', debounce(handleScroll, 100));
}

function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar shrink effect
    document.querySelector('.navbar')?.classList.toggle('shrink', scrollY > 50);

    // Back to top visibility
    document.getElementById('back-to-top')?.classList.toggle('visible', scrollY > 300);

    // Active navigation highlighting
    let current = '';
    document.querySelectorAll('section, #home').forEach(section => {
        if (scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
    });
}

/** === CUSTOM CURSOR HANDLING === **/
function initCursorEffects() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.body.addEventListener('mouseover', (e) => {
        cursor.classList.toggle('hover', e.target.matches('a, button, .card'));
    });
}

/** === COUNTER ANIMATION === **/
function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(stat => {
                    animateCounter(stat, parseInt(stat.getAttribute('data-target')));
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });

    document.querySelectorAll('.stats, .visitor-stats').forEach(section => {
        observer.observe(section);
    });
}

function animateCounter(el, target) {
    const duration = 2000; // animation duration in ms (2 seconds)
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // value between 0 and 1

        const currentValue = Math.floor(progress * target);
        el.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}


/** === UTILITY FUNCTION: DEBOUNCE (For performance optimization) === **/
function debounce(func, delay = 100) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

/** === SIDEBAR TOGGLE ANIMATION === **/
function initSidebarToggle() {
    window.addEventListener('scroll', () => {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.toggle('visible', window.scrollY > 100);
            }, index * 100);
        });
    });
}

function certifications(){
        const carousel = document.querySelector('.carousel-track');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const viewAllBtn = document.getElementById('view-all-certifications');
        const modal = document.getElementById('certifications-modal');
        const closeModal = document.querySelector('.close-modal');

        // Certification section - hidden by default and revealed when scrolled to
        const certSection = document.getElementById('certifications');
        certSection.style.opacity = '0';
        certSection.style.transition = 'opacity 0.8s ease';

        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        }

        // Reveal section when scrolled to
        function checkScroll() {
            if (isInViewport(certSection) && certSection.style.opacity === '0') {
                certSection.style.opacity = '1';
            }
        }

        // Initial check and scroll listener
        checkScroll();
        window.addEventListener('scroll', checkScroll);

        // Automatic carousel functionality
        let scrollAmount = 0;
        const itemWidth = document.querySelector('.certification-item').offsetWidth;
        const totalItems = document.querySelectorAll('.certification-item').length;

        // Manual navigation
        prevBtn.addEventListener('click', function() {
            scrollAmount += itemWidth;
            if (scrollAmount > 0) {
                scrollAmount = -(totalItems / 2 * itemWidth);
            }
            carousel.style.transform = `translateX(${scrollAmount}px)`;
            carousel.style.transition = 'transform 0.5s ease';

            // Resume animation after manual navigation
            setTimeout(() => {
                carousel.style.transition = '';
                carousel.style.animation = 'none';
                carousel.offsetHeight; // Trigger reflow
                carousel.style.animation = 'carousel-scroll 40s linear infinite';
            }, 500);
        });

        nextBtn.addEventListener('click', function() {
            scrollAmount -= itemWidth;
            if (scrollAmount < -(totalItems / 2 * itemWidth)) {
                scrollAmount = 0;
            }
            carousel.style.transform = `translateX(${scrollAmount}px)`;
            carousel.style.transition = 'transform 0.5s ease';

            // Resume animation after manual navigation
            setTimeout(() => {
                carousel.style.transition = '';
                carousel.style.animation = 'none';
                carousel.offsetHeight; // Trigger reflow
                carousel.style.animation = 'carousel-scroll 40s linear infinite';
            }, 500);
        });

        // Modal functionality
        viewAllBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });

        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close modal if clicking outside of content
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Touch swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
            // Pause animation during touch
            carousel.style.animationPlayState = 'paused';
        }, { passive: true });

        carousel.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
            // Resume animation after touch
            setTimeout(() => {
                carousel.style.animationPlayState = 'running';
            }, 500);
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - next
                nextBtn.click();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous
                prevBtn.click();
            }
        }

        // Responsive adjustments
        function updateCarouselDisplay() {
            const viewportWidth = window.innerWidth;

            if (viewportWidth < 576) {
                // Mobile view adjustments
                document.querySelectorAll('.certification-item').forEach(item => {
                    item.style.width = '180px';
                });
            } else if (viewportWidth < 768) {
                document.querySelectorAll('.certification-item').forEach(item => {
                    item.style.width = '200px';
                });
            } else if (viewportWidth < 1200) {
                document.querySelectorAll('.certification-item').forEach(item => {
                    item.style.width = '220px';
                });
            } else {
                document.querySelectorAll('.certification-item').forEach(item => {
                    item.style.width = '250px';
                });
            }
        }

        // Initial update and resize listener
        updateCarouselDisplay();
        window.addEventListener('resize', updateCarouselDisplay);
}