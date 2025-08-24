// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeCarousels();
    initializeModals();
    initializeForms();
    initializeCounters();
    initializeParallax();

    // Hide preloader after everything is loaded
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle scroll effects on navbar
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - navbar.offsetHeight;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const scrollToTop = document.getElementById('scrollToTop');

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 500) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    if (scrollToTop) {
        scrollToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true,
            easing: 'ease-out-cubic'
        });
    }
}

// ===== CAROUSEL INITIALIZATION =====
function initializeCarousels() {
    // Hero carousel
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            ride: 'carousel'
        });
    }
}

// ===== MODAL FUNCTIONALITY =====
function initializeModals() {
    // Gallery modal
    const galleryImages = document.querySelectorAll('.gallery-image');

    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const modal = document.getElementById('galleryModal');
            const modalImage = modal.querySelector('.modal-image');
            const modalTitle = modal.querySelector('.modal-title');

            if (modal && modalImage) {
                modalImage.src = this.src;
                modalTitle.textContent = this.alt || 'Gallery Image';

                if (typeof bootstrap !== 'undefined') {
                    const bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                }
            }
        });
    });
}

// ===== FORM HANDLING =====
function initializeForms() {
    // We'll use a MutationObserver to watch for the contact form being added to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                const contactForm = document.getElementById('contactForm');
                const submitBtn = document.getElementById('submitBtn');
                
                if (contactForm && submitBtn && !contactForm.dataset.initialized) {
                    console.log('Initializing contact form...');
                    initializeContactForm(contactForm, submitBtn);
                    contactForm.dataset.initialized = 'true';
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
}

function initializeContactForm(formContainer, submitBtn) {
    const statusDiv = document.getElementById('statusMessage');
    const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbym0o_LUvsuM41G4pgjS_EsD2FoKYjlQkwvWunKJf5HH6B3P2L7UWckC7IiCWOjBQ1d_w/exec';

    function showMessage(message, type = 'info') {
        statusDiv.innerHTML = `
            <div class="alert alert-${type}">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                ${message}
            </div>
        `;
        statusDiv.style.display = 'block';
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const eventType = document.getElementById('eventType').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !phone || !eventType || !message) {
            showMessage('Please fill in all required fields.', 'danger');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'danger');
            return false;
        }

        return true;
    }

    function clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('eventType').value = '';
        document.getElementById('message').value = '';
    }

    // Add submit event listener
    submitBtn.addEventListener('click', async function(e) {
        console.log('Submit button clicked');
        
        if (!validateForm()) {
            return;
        }

        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new URLSearchParams();
        formData.append('name', document.getElementById('name').value.trim());
        formData.append('email', document.getElementById('email').value.trim());
        formData.append('phone', document.getElementById('phone').value.trim());
        formData.append('eventType', document.getElementById('eventType').value);
        formData.append('message', document.getElementById('message').value.trim());

        try {
            console.log('Sending request to:', WEBAPP_URL);
            const response = await fetch(WEBAPP_URL, {
                method: 'POST',
                mode: 'no-cors', // Change to no-cors mode
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            // When using no-cors, we won't get the response content
            console.log('Form submitted successfully in no-cors mode');
            
            // Optional: Make a GET request to check submission status
            try {
                const checkResponse = await fetch(WEBAPP_URL + '?check=true', {
                    method: 'GET',
                    mode: 'cors'
                });
                const checkResult = await checkResponse.text();
                console.log('Submission check result:', checkResult);
            } catch (checkError) {
                console.log('Submission check error:', checkError);
            }

            showMessage(`
                <strong>Thank you!</strong> Your message has been sent successfully. 
                <br><small>We'll get back to you within 24 hours.</small>
            `, 'success');
            clearForm();

        } catch (error) {
            console.error('Submission error:', error);
            showMessage(`
                <strong>Unable to send message.</strong> ${error.message}
                <br><small>Please try again or contact us directly.</small>
            `, 'danger');
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 2000);
        }
    });

    // Add Enter key support
    formContainer.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            submitBtn.click();
        }
    });

    console.log('Contact form initialized successfully');
}

function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleBookingForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Generate WhatsApp message
    const message = `Hello! I would like to book your venue for ${data.eventType} on ${data.eventDate}. Guest count: ${data.guestCount}. Additional details: ${data.message || 'None'}`;
    const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, '_blank');
}

// ===== COUNTERS =====
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        element.textContent = Math.floor(current);

        if (current < target) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        min-width: 300px;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}