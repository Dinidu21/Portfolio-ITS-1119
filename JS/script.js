// Unified Intersection Observer for all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -10% 0px' // Slightly reduce the trigger area for smoother effect
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target;
            if (entry.isIntersecting) {
                // Add 'visible' class when element enters viewport
                target.classList.add('visible');
            } else {
                // Remove 'visible' class when element leaves viewport (both up and down)
                target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.card, .timeline-wrapper, .circle');
    animatedElements.forEach((element) => observer.observe(element));
});