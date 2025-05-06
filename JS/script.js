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
    // Certification details modal
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

    // Certification data - This would ideally come from a database or API
    // For now, we'll use a static object with details for each certification
    const certificationDetails = {
        'Java Certified Professional': {
            issuer: 'Oracle Corporation',
            date: '2023',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
            description: 'The Oracle Certified Professional Java SE certification validates programming knowledge of the Java language, including object-oriented concepts, database connectivity, and application development.',
            skills: ['Java SE', 'Object-Oriented Programming', 'API Development', 'Database Connectivity', 'Concurrency'],
            validity: 'Valid until: December 2026',
            credentialUrl: '#'
        },
        'Spring Framework Developer': {
            issuer: 'VMware Tanzu',
            date: '2023',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
            description: 'The Spring Professional certification demonstrates ability to develop enterprise applications using Spring Framework, Spring Boot, and related technologies.',
            skills: ['Spring Framework', 'Spring Boot', 'Dependency Injection', 'AOP', 'Spring Security', 'Spring Data'],
            validity: 'Valid until: August 2025',
            credentialUrl: '#'
        },
        'React Developer': {
            issuer: 'Meta',
            date: '2022',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            description: 'The Meta React Developer certification validates proficiency in building user interfaces with React, including state management, hooks, and component architecture.',
            skills: ['React.js', 'Redux', 'Hooks', 'Component Architecture', 'Frontend Development'],
            validity: 'Valid until: October 2025',
            credentialUrl: '#'
        },
        'AWS Certified Solutions Architect': {
            issuer: 'Amazon Web Services',
            date: '2023',
            image: 'assets/aws.png',
            description: 'The AWS Certified Solutions Architect certification validates expertise in designing distributed applications and systems on the AWS platform.',
            skills: ['AWS', 'Cloud Architecture', 'Security', 'Networking', 'Database Design', 'Cost Optimization'],
            validity: 'Valid until: March 2026',
            credentialUrl: '#'
        },
        'Docker Certified Associate': {
            issuer: 'Docker, Inc.',
            date: '2022',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
            description: 'The Docker Certified Associate (DCA) certification validates your ability to deploy, manage, and troubleshoot Docker container environments.',
            skills: ['Docker', 'Containerization', 'Docker Compose', 'Docker Swarm', 'Image Management'],
            validity: 'Valid until: November 2025',
            credentialUrl: '#'
        },
        'Certified Kubernetes Administrator': {
            issuer: 'Cloud Native Computing Foundation',
            date: '2023',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
            description: 'The Certified Kubernetes Administrator (CKA) certification demonstrates proficiency in operating Kubernetes clusters and containerized applications.',
            skills: ['Kubernetes', 'Container Orchestration', 'Cluster Management', 'Security', 'Networking', 'Troubleshooting'],
            validity: 'Valid until: July 2026',
            credentialUrl: '#'
        },
        'JavaScript Developer': {
            issuer: 'freeCodeCamp',
            date: '2021',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
            description: 'The JavaScript Developer certification validates proficiency in using JavaScript for web development, including ES6+ features, asynchronous programming, and DOM manipulation.',
            skills: ['JavaScript', 'ES6+', 'Async/Await', 'DOM Manipulation', 'Web APIs'],
            validity: 'No expiration date',
            credentialUrl: '#'
        },
        'TypeScript Professional': {
            issuer: 'Microsoft',
            date: '2022',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
            description: 'The TypeScript Professional certification validates expertise in using TypeScript for building large-scale applications with strong typing systems.',
            skills: ['TypeScript', 'Type Systems', 'Interfaces', 'Generics', 'Advanced Types'],
            validity: 'Valid until: September 2025',
            credentialUrl: '#'
        },
        'Node.js Developer': {
            issuer: 'OpenJS Foundation',
            date: '2022',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
            description: 'The Node.js Developer certification demonstrates proficiency in building server-side applications using Node.js and related technologies.',
            skills: ['Node.js', 'Express.js', 'RESTful APIs', 'Asynchronous Programming', 'NPM'],
            validity: 'Valid until: May 2025',
            credentialUrl: '#'
        },
        'MongoDB Developer': {
            issuer: 'MongoDB University',
            date: '2022',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
            description: 'The MongoDB Developer certification validates skills in working with MongoDB databases, including data modeling, querying, and optimization.',
            skills: ['MongoDB', 'NoSQL', 'Data Modeling', 'Aggregation', 'Performance Tuning'],
            validity: 'Valid until: December 2025',
            credentialUrl: '#'
        },
        'Python Developer': {
            issuer: 'Python Institute',
            date: '2021',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
            description: 'The Python Developer certification demonstrates proficiency in Python programming, including core language features, data structures, and common libraries.',
            skills: ['Python', 'OOP', 'Data Analysis', 'Web Development', 'Automation'],
            validity: 'Valid until: April 2024',
            credentialUrl: '#'
        },
        'Google Cloud Professional': {
            issuer: 'Google Cloud',
            date: '2023',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
            description: 'The Google Cloud Professional certification validates expertise in designing, developing, and managing applications on Google Cloud Platform.',
            skills: ['Google Cloud', 'Cloud Infrastructure', 'App Engine', 'Kubernetes Engine', 'BigQuery', 'Cloud Storage'],
            validity: 'Valid until: October 2026',
            credentialUrl: '#'
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

            modalValidity.textContent = certData.validity;

            // Set up credential button
            viewCredentialBtn.onclick = function() {
                window.open(certData.credentialUrl, '_blank');
            };

            // Show the modal
            detailModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        }
    }

    // Close modal functionality
    closeDetailModal.addEventListener('click', function() {
        detailModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal if clicking outside of content
    detailModal.addEventListener('click', function(event) {
        if (event.target === detailModal) {
            detailModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
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
        const observer = new MutationObserver(function(mutations) {
            addClickEvents();
        });

        observer.observe(certificationContainer, {
            childList: true,
            subtree: true
        });
    }
}