document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initDarkMode();
    initBackToTop();
    initPreloader();
    initCursorEffects();
    initScrollEvents();
    initCounterAnimation();
    initSidebarToggle();
    initTypewriter();
});

/** === TYPEWRITER EFFECT === **/
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter-text');
    if (!typewriterElement) return;

    const texts = JSON.parse(typewriterElement.getAttribute('data-text') || '["Dinidu Sachintha"]');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typeSpeed = 1000; // Pause at the end of typing
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before typing next text
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/** === INTERSECTION OBSERVER FOR ANIMATIONS === **/
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
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
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Hide preloader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    });

    // Fallback in case load event already fired
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 2000);
}

/** === CONSOLIDATED SCROLL EVENT LISTENER === **/
function initScrollEvents() {
    window.addEventListener('scroll', debounce(handleScroll, 100));
    // Call once to set initial states
    handleScroll();
}

function handleScroll() {
    const scrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    // Navbar shrink effect
    if (navbar) {
        navbar.classList.toggle('shrink', scrollY > 50);
    }

    // Back to top visibility
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', scrollY > 300);
    }

    // Active navigation highlighting
    try {
        let current = '';
        const sections = document.querySelectorAll('section[id], div[id="home"]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.toggle('active', href.substring(1) === current);
            }
        });

        // Also update sidebar highlighting
        document.querySelectorAll('.sidebar-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                item.classList.toggle('active', href.substring(1) === current);
            }
        });
    } catch (error) {
        console.log('Navigation highlighting error:', error);
    }
}

/** === CUSTOM CURSOR HANDLING === **/
function initCursorEffects() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.addEventListener('mouseover', (e) => {
        const isInteractive = e.target.matches('a, button, .card, input, textarea, select, .nav-link');
        cursor.classList.toggle('hover', isInteractive);
    });
}

/** === COUNTER ANIMATION === **/
function initCounterAnimation() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target') || '0');
                    animateCounter(stat, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });

    observer.observe(statsSection);
}

function animateCounter(el, target) {
    let start = 0;
    const duration = 2000; // ms
    const increment = Math.ceil(target / (duration / 16)); // Approx. 60fps

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

/** === SIDEBAR TOGGLE ANIMATION === **/
function initSidebarToggle() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    if (sidebarItems.length === 0) return;

    window.addEventListener('scroll', () => {
        sidebarItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.toggle('visible', window.scrollY > 100);
            }, index * 100);
        });
    });

    // Initialize sidebar state
    if (window.scrollY > 100) {
        sidebarItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });
    }
}

/** === VISITOR COUNTER FIX === **/
document.addEventListener('DOMContentLoaded', () => {
    const dailyVisitors = document.getElementById('daily-visitors');
    const totalVisitors = document.getElementById('total-visitors');
    const uniqueVisitors = document.getElementById('unique-visitors');

    if (!dailyVisitors || !totalVisitors || !uniqueVisitors) return;

    try {
        setTimeout(() => {
            const mockData = {
                total: Math.floor(Math.random() * 10000 + 1000),
                today: Math.floor(Math.random() * 200 + 50),
                unique: Math.floor(Math.random() * 400 + 100)
            };

            totalVisitors.textContent = mockData.total.toLocaleString();
            dailyVisitors.textContent = mockData.today.toLocaleString();
            uniqueVisitors.textContent = mockData.unique.toLocaleString();
        }, 500);
    } catch (err) {
        console.log('Using fallback visitor data');
        totalVisitors.textContent = '1,234';
        dailyVisitors.textContent = '56';
        uniqueVisitors.textContent = '789';
    }
});