document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initDarkMode();
    initBackToTop();
    initPreloader();
    initCursorEffects();
    initScrollEvents();
    initCounterAnimation();
    initSidebarToggle();
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
        }, 500);
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