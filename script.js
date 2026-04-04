// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Click-to-load TikTok embed (saves ~12MB of resources until user requests it)
    const loadTiktokBtn = document.getElementById('load-tiktok-btn');
    if (loadTiktokBtn) {
        loadTiktokBtn.addEventListener('click', function() {
            const placeholder = document.getElementById('tiktok-embed-placeholder');
            if (placeholder) {
                placeholder.innerHTML = '<p style="color: var(--text-muted);">Loading TikTok...</p>';
                placeholder.style.padding = '0';

                // Create the embed
                setTimeout(() => {
                    placeholder.innerHTML = `
                        <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@tony_carlos_law" data-unique-id="tony_carlos_law" data-embed-type="creator" style="max-width: 780px; min-width: 288px;">
                            <section><a target="_blank" href="https://www.tiktok.com/@tony_carlos_law">@tony_carlos_law</a></section>
                        </blockquote>
                    `;
                    const script = document.createElement('script');
                    script.src = 'https://www.tiktok.com/embed.js';
                    script.async = true;
                    document.body.appendChild(script);
                }, 100);
            }
        });
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handler with validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.phone || !data['case-type']) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }

            // Phone validation
            const phoneRegex = /^[\d\s\-\(\)\.+]+$/;
            if (!phoneRegex.test(data.phone)) {
                e.preventDefault();
                alert('Please enter a valid phone number.');
                return;
            }

            // Email validation (if provided)
            const emailValue = data.email;
            if (emailValue) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailValue)) {
                    e.preventDefault();
                    alert('Please enter a valid email address.');
                    return;
                }
            }

            // Form will submit to Formspree if validation passes
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.practice-card, .feature-card, .area-group').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Phone click tracking (for analytics)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // In production, send to analytics
            console.log('Phone call initiated:', this.href);
        });
    });

    // Language Toggle
    const langToggle = document.querySelector('#langToggle');
    if (langToggle) {
        const langOptions = langToggle.querySelectorAll('.lang-option');

        // Get saved language preference or default to English
        let currentLang = localStorage.getItem('preferredLang') || 'en';

        // Apply saved language on page load
        applyLanguage(currentLang);
        updateToggleUI(currentLang);

        // Handle language option clicks
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                if (lang !== currentLang) {
                    currentLang = lang;
                    localStorage.setItem('preferredLang', lang);
                    applyLanguage(lang);
                    updateToggleUI(lang);
                }
            });
        });

        function updateToggleUI(lang) {
            langOptions.forEach(option => {
                option.classList.toggle('active', option.getAttribute('data-lang') === lang);
            });
        }

        function applyLanguage(lang) {
            // Update html lang attribute
            document.documentElement.lang = lang === 'es' ? 'es' : 'en';

            // Find all elements with data-en and data-es attributes
            const translatableElements = document.querySelectorAll('[data-en][data-es]');

            translatableElements.forEach(el => {
                const translation = el.getAttribute(`data-${lang}`);
                if (translation) {
                    // Handle elements with SVG icons - only replace text, keep icons
                    if (el.querySelector('svg')) {
                        // Get all child nodes and only replace text nodes
                        el.childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                node.textContent = ' ' + translation + ' ';
                            }
                        });
                    } else if (el.tagName === 'BLOCKQUOTE') {
                        // For blockquotes, wrap in quotes
                        el.textContent = '"' + translation + '"';
                    } else if (el.tagName === 'OPTION') {
                        // For select options
                        el.textContent = translation;
                    } else {
                        // For regular elements
                        el.textContent = translation;
                    }
                }
            });
        }
    }

    // Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.testimonial-track');
        const cards = carousel.querySelectorAll('.testimonial-card');
        const prevBtn = carousel.querySelector('.testimonial-prev');
        const nextBtn = carousel.querySelector('.testimonial-next');
        const dotsContainer = carousel.querySelector('.testimonial-dots');

        let currentIndex = 0;
        let cardsPerView = window.innerWidth >= 768 ? 2 : 1;
        const totalSlides = Math.ceil(cards.length / cardsPerView);

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.testimonial-dot');

        function updateCarousel() {
            const cardWidth = 100 / cardsPerView;
            track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Auto-advance every 5 seconds
        let autoPlay = setInterval(nextSlide, 5000);

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carousel.addEventListener('mouseleave', () => {
            autoPlay = setInterval(nextSlide, 5000);
        });

        // Handle resize
        window.addEventListener('resize', () => {
            const newCardsPerView = window.innerWidth >= 768 ? 2 : 1;
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                updateCarousel();
            }
        });
    }
});

// Structured Data for FAQ (can be expanded)
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What areas does Tony Carlos Law serve?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tony Carlos Law serves Yuba City, Marysville, and the surrounding areas including Sutter County, Yuba County, Colusa County, Butte County, and other Northern California communities."
            }
        },
        {
            "@type": "Question",
            "name": "What types of cases does Tony Carlos handle?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tony Carlos handles criminal defense cases including DUI/DWI, drug crimes, theft, assault, domestic violence, felonies, and misdemeanors. He also handles immigration law matters including family-based immigration, green cards, deportation defense, and naturalization."
            }
        },
        {
            "@type": "Question",
            "name": "How do I schedule a consultation with Tony Carlos?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Contact the office at (530) 645-2551 to schedule your consultation. Tony Carlos Law is available 24/7 for emergencies."
            }
        }
    ]
};

// Add FAQ schema to page
const faqScript = document.createElement('script');
faqScript.type = 'application/ld+json';
faqScript.textContent = JSON.stringify(faqSchema);
document.head.appendChild(faqScript);
