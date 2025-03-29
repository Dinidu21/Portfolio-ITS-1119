document.addEventListener('DOMContentLoaded', () => {
    /** === INTERSECTION OBSERVER FOR ANIMATIONS === **/
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.card, .timeline-wrapper, .circle')
        .forEach(el => observer.observe(el));

    /** === DARK MODE TOGGLE & LOCAL STORAGE PERSISTENCE === **/
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    darkModeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    /** === BACK TO TOP BUTTON === **/
    const backToTopBtn = document.getElementById('back-to-top');
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /** === PRELOADER HIDE === **/
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader')?.classList.add('hidden');
        }, 500);
    });
});

/** === CONSOLIDATED SCROLL EVENT LISTENER === **/
window.addEventListener('scroll', debounce(() => {
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

}, 100)); // Debounced to reduce performance impact

/** === CUSTOM CURSOR HANDLING === **/
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.body.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, .card')) {
            cursor.classList.add('hover');
        } else {
            cursor.classList.remove('hover');
        }
    });
}

/** === UTILITY FUNCTION: DEBOUNCE === **/
function debounce(func, delay = 100) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}
