document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initDarkMode();
    initBackToTop();
    initPreloader();
    initCursorEffects();
    initScrollEvents();
    initCounterAnimation();
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
                document.querySelectorAll('.stat-number').forEach(stat => {
                    animateCounter(stat, parseInt(stat.getAttribute('data-target')));
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.stats'));
}

function animateCounter(el, target) {
    let start = 0;
    const increment = target / 50;

    function updateCounter() {
        start += increment;
        if (start >= target) {
            el.textContent = target;
        } else {
            el.textContent = Math.ceil(start);
            requestAnimationFrame(updateCounter);
        }
    }

    updateCounter();
}

/** === UTILITY FUNCTION: DEBOUNCE (For performance optimization) === **/
function debounce(func, delay = 100) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}
