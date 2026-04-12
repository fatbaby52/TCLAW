// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
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
            // Toggle aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded.toString());
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

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
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

    // Form submission handler with inline validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Helper function to show inline error
        function showError(input, message) {
            clearError(input);
            const error = document.createElement('span');
            error.className = 'form-error';
            error.textContent = message;
            error.setAttribute('role', 'alert');
            input.setAttribute('aria-invalid', 'true');
            input.parentNode.appendChild(error);
            input.focus();
        }

        // Helper function to clear error
        function clearError(input) {
            input.setAttribute('aria-invalid', 'false');
            const existingError = input.parentNode.querySelector('.form-error');
            if (existingError) existingError.remove();
        }

        // Clear errors on input
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => clearError(field));
            field.addEventListener('change', () => clearError(field));
        });

        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Clear all previous errors
            this.querySelectorAll('.form-error').forEach(err => err.remove());
            this.querySelectorAll('[aria-invalid]').forEach(el => el.setAttribute('aria-invalid', 'false'));

            // Basic validation
            const nameInput = this.querySelector('[name="name"]');
            const phoneInput = this.querySelector('[name="phone"]');
            const caseTypeInput = this.querySelector('[name="case-type"]');
            const emailInput = this.querySelector('[name="email"]');

            if (!data.name) {
                e.preventDefault();
                showError(nameInput, 'Please enter your name.');
                return;
            }

            if (!data.phone) {
                e.preventDefault();
                showError(phoneInput, 'Please enter your phone number.');
                return;
            }

            // Phone validation
            const phoneRegex = /^[\d\s\-\(\)\.+]+$/;
            if (!phoneRegex.test(data.phone)) {
                e.preventDefault();
                showError(phoneInput, 'Please enter a valid phone number.');
                return;
            }

            if (!data['case-type']) {
                e.preventDefault();
                showError(caseTypeInput, 'Please select a case type.');
                return;
            }

            // Email validation (if provided)
            const emailValue = data.email;
            if (emailValue) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailValue)) {
                    e.preventDefault();
                    showError(emailInput, 'Please enter a valid email address.');
                    return;
                }
            }

            // Push form submission event to dataLayer for GTM/GA4
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'form_submission',
                'form_name': 'contact_form',
                'case_type': data['case-type'] || 'not_specified'
            });

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
            const phoneNumber = this.href.replace('tel:', '');
            // Push to dataLayer for GTM/GA4
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'phone_click',
                'phone_number': phoneNumber,
                'click_location': this.closest('section')?.className || 'unknown'
            });
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

});

