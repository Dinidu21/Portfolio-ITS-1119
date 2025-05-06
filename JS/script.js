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
    initializeCertificationDetailModal();
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

function initializeCertificationDetailModal() {
    const detailModal = document.getElementById('certification-detail-modal');
    const closeDetailModal = detailModal.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-certification-image');
    const modalTitle = document.getElementById('modal-certification-title');
    const modalIssuer = document.getElementById('modal-certification-issuer');
    const modalDate = document.getElementById('modal-certification-date');
    const modalDescription = document.getElementById('modal-certification-description').querySelector('p');
    const modalSkills = document.getElementById('modal-certification-skills');
    const modalValidity = document.getElementById('modal-certification-validity');
    const viewCredentialBtn = document.getElementById('view-credential-btn');

    // Certification data
    const certificationDetails = {
        'Oracle Certified Foundations Associate': {
            issuer: 'Oracle Corporation',
            date: '2025-02-28',
            image: 'assets/cert/oracle_cert.png',
            description: 'The Oracle Certified Foundations Associate certification recognizes foundational knowledge and skills in Oracle technologies.',
            skills: ['Oracle Technologies', 'Database Fundamentals', 'SQL', 'Cloud Basics'],
            validity: '2029-02-28',
            credentialUrl: 'assets/cert/oracle_cert.png'
        },
        'Introduction to Observability': {
            issuer: 'Datadog',
            date: '2025-05-02',
            image: 'assets/cert/datadog_observability.png',
            description: 'The Introduction to Observability course completion certificate validates understanding of observability concepts and practices using Datadog tools.',
            skills: ['Observability', 'Monitoring', 'Logging', 'Tracing', 'Datadog'],
            validity: '2035-02-28',
            credentialUrl: 'https://www.datadoghq.com/certification/sizn2kjwye'
        },
        'Skill Up 3.0 Industry Survival': {
            issuer: 'Leo Club of IIT',
            date: '2025-03-09',
            image: 'assets/cert/skillup_3_0.png',
            description: 'The Skill Up 3.0 Industry Survival certificate acknowledges participation in phases covering student support, panel discussions, and industry survival workshops.',
            skills: ['Industry Readiness', 'Professional Growth', 'Networking', 'Technical Skills'],
            validity: 'Not specified',
            credentialUrl: 'assets/cert/skillup_3_0.png'
        },
        'Problem Solving (Basic)': {
            issuer: 'HackerRank',
            date: '2024-09-18',
            image: 'assets/cert/hackerrank_problem_solving.png',
            description: 'The HackerRank Problem Solving (Basic) certification validates skills in solving basic algorithmic problems.',
            skills: ['Problem Solving', 'Algorithms', 'Data Structures', 'Coding'],
            validity: '2032-02-28',
            credentialUrl: 'assets/cert/hackerrank_problem_solving.png'
        },
        'Python (Basic)': {
            issuer: 'HackerRank',
            date: '2024-09-21',
            image: 'assets/cert/hackerrank_python.png',
            description: 'The HackerRank Python (Basic) certification validates proficiency in basic Python programming concepts.',
            skills: ['Python', 'Basic Programming', 'Data Structures', 'Control Flow'],
            validity: '2035-02-28',
            credentialUrl: 'assets/cert/hackerrank_python.png'
        },
        'Java (Basic)': {
            issuer: 'HackerRank',
            date: '2024-08-03',
            image: 'assets/cert/hackerrank_java.png',
            description: 'The HackerRank Java (Basic) certification validates proficiency in basic Java programming concepts.',
            skills: ['Java', 'Basic Programming', 'Object-Oriented Programming', 'Control Flow'],
            validity: '2029-02-28',
            credentialUrl: 'assets/cert/hackerrank_java.png'
        },
        'Introduction to Python': {
            issuer: 'Sololearn',
            date: '2024-06-30',
            image: 'assets/cert/sololearn_python.png',
            description: 'The Sololearn Introduction to Python course completion certificate validates theoretical and practical understanding of Python programming.',
            skills: ['Python', 'Basic Programming', 'Functions', 'Loops', 'Data Structures'],
            validity: '2028-02-28',
            credentialUrl: 'https://www.sololearn.com/certificates/CC-GHO0UT9'
        },
        'Deploy Apps on Azure App Service': {
            issuer: 'Microsoft',
            date: '2025-03-28',
            image: 'assets/cert/microsoft_azure.png',
            description: 'The Microsoft Learn Student Ambassador certificate recognizes attendance and completion of a workshop on deploying apps on Azure App Service.',
            skills: ['Azure', 'App Deployment', 'Cloud Computing', 'Web Applications'],
            validity: '2027-02-28',
            credentialUrl: 'assets/cert/microsoft_azure.png'
        },
        'CodeRally 5.0': {
            issuer: 'IEEE Computer Society Informatics Institute of Technology Student Branch',
            date: '2024-09-15',
            image: 'assets/cert/coderally_5_0.png',
            description: 'The CodeRally 5.0 certificate acknowledges participation in a 24-hour competitive programming hackathon.',
            skills: ['Competitive Programming', 'Problem Solving', 'Teamwork', 'Coding'],
            validity: '2027-02-28',
            credentialUrl: 'assets/cert/coderally_5_0.png'
        },
        'An Introduction to Financial Technology': {
            issuer: 'University of Sri Jayewardenepura',
            date: '2025-04-07',
            image: 'assets/cert/techxplore_fintech.png',
            description: 'The TechXplore Edition 1.0 certificate acknowledges participation in a session on Fintech and its applications.',
            skills: ['Fintech', 'Financial Technology', 'Innovation', 'Digital Payments'],
            validity: '2027-02-28',
            credentialUrl: 'assets/cert/techxplore_fintech.png'
        },
        'Postman API Fundamentals Student Expert': {
            issuer: 'Postman',
            date: '2023-12-09',
            image: 'assets/cert/postman_api_student_expert.png',
            description: 'The Postman API Fundamentals Student Expert certification validates proficiency in consuming APIs using Postman, including making various HTTP requests and understanding API concepts.',
            skills: ['API', 'Postman', 'Testing', 'Scripting', 'HTTP Requests'],
            validity: '2027-05-06',
            credentialUrl: 'assets/cert/postman_api_student_expert.png'
        },
        'Python for Beginners': {
            issuer: 'University of Moratuwa',
            date: '2023-12-15',
            image: 'assets/cert/python_for_beginners_moratuwa.png',
            description: 'The Python for Beginners certificate from the University of Moratuwa acknowledges participation in an online learning program focused on Python programming fundamentals.',
            skills: ['Python', 'Basic Programming', 'Functions', 'Loops', 'Data Structures'],
            validity: '2027-12-15',
            credentialUrl: 'assets/cert/python_for_beginners_moratuwa.png'
        }
    };

    // Add click event to all certification items
    const addClickEvents = () => {
        // Add click events to certification items in the carousel
        document.querySelectorAll('.certification-content').forEach(certItem => {
            certItem.addEventListener('click', function() {
                const certTitle = this.querySelector('h3').textContent;
                displayCertificationDetails(certTitle);
            });
        });

        // Add click events to certification items in the "View All" modal grid
        document.querySelectorAll('.certification-grid-item').forEach(certItem => {
            certItem.addEventListener('click', function() {
                const certTitle = this.querySelector('h3').textContent;
                // First close the "View All" modal
                const viewAllModal = document.getElementById('certifications-modal');
                viewAllModal.classList.remove('active');
                // Then open the detail modal
                displayCertificationDetails(certTitle);
            });
        });
    };

    // Function to display certification details in the modal
    function displayCertificationDetails(certificationTitle) {
        const certData = certificationDetails[certificationTitle];

        if (certData) {
            // Update modal content with certification details
            modalImage.style.backgroundImage = `url('${certData.image}')`;
            modalTitle.textContent = certificationTitle;
            modalIssuer.textContent = certData.issuer;
            modalDate.textContent = certData.date;
            modalDescription.textContent = certData.description;

            // Clear existing skills and add new ones
            modalSkills.innerHTML = '';
            certData.skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                modalSkills.appendChild(li);
            });
            modalValidity.textContent = `Valid until: ${certData.validity || 'Not specified'}`;
            viewCredentialBtn.onclick = () => window.open(certData.credentialUrl, '_blank');

            // Set up credential button
            viewCredentialBtn.onclick = function() {
                window.open(certData.credentialUrl, '_blank');
            };

            // Show the modal
            detailModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeDetailModal.addEventListener('click', () => {
        detailModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    detailModal.addEventListener('click', (event) => {
        if (event.target === detailModal) {
            detailModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && detailModal.classList.contains('active')) {
            detailModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Initialize the click events once DOM is loaded
    addClickEvents();

    // Set up a mutation observer to add click events to dynamically added certification items
    const certificationContainer = document.querySelector('.certifications-container');
    if (certificationContainer) {
        const observer = new MutationObserver(() => addClickEvents());
        observer.observe(certificationContainer, { childList: true, subtree: true });
    }
}
