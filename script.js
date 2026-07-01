/* ============================================
   AURA PICNIC - JavaScript Interactivity
   ============================================ */

// ============ DOM ELEMENTS ============
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTopBtn');
const faqQuestions = document.querySelectorAll('.faq-question');
const bookingForm = document.getElementById('bookingForm');
const selectedPackageText = document.getElementById('selectedPackage');
const estimatedPriceText = document.getElementById('estimatedPrice');
const packageSelect = document.getElementById('packageSelect');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const eventTypeInput = document.getElementById('eventType');
const eventDateInput = document.getElementById('eventDate');
const guestsInput = document.getElementById('guests');
const statNumbers = document.querySelectorAll('.stat-number');

const STORAGE_KEYS = {
    selectedPackage: 'auraPicnicSelectedPackage',
    selectedEventType: 'auraPicnicSelectedEventType'
};

const packagePrices = {
    'Silver Package': 299,
    'Gold Package': 549,
    'Premium Package': 999
};

function updatePackageSummary(packageName, guests = null) {
    if (!selectedPackageText || !estimatedPriceText) return;
    // Debug: log inputs
    console.log('updatePackageSummary called with:', { packageName, guests });

    selectedPackageText.textContent = packageName;
    if (packageSelect) {
        packageSelect.value = packageName;
    }

    const basePrice = packagePrices[packageName] || 0;
    const guestCount = parseInt(guests, 10);
    let totalPrice = basePrice;

    if (guestCount > 4) {
        totalPrice = basePrice + (guestCount - 4) * 25;
    }

    console.log('price calc:', { basePrice, guestCount, totalPrice });
    estimatedPriceText.textContent = totalPrice ? `$${totalPrice}` : '—';
}

// ============ MOBILE MENU TOGGLE ============
/**
 * Toggle mobile navigation menu when hamburger is clicked
 */
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

/**
 * Close mobile menu when a nav link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// ============ SMOOTH SCROLLING ============
/**
 * Smooth scrolling for anchor links (already handled by CSS scroll-behavior)
 * This ensures proper scrolling with offset for fixed header
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ BACK TO TOP BUTTON ============
/**
 * Show/hide back to top button based on scroll position
 */
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    /**
     * Scroll to top when back to top button is clicked
     */
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============ ANIMATED COUNTER ============
/**
 * Animate numbers counting up when they come into view
 * Uses Intersection Observer for performance
 */
const startCounter = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const targetNumber = parseInt(statElement.getAttribute('data-count'));
                animateCounter(statElement, targetNumber);
                observer.unobserve(statElement); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
};

/**
 * Animate a counter from 0 to target number
 * @param {HTMLElement} element - The element containing the counter
 * @param {number} target - The target number to count to
 */
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Divide into 50 steps for smooth animation
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Start counter animation when DOM is loaded
if (statNumbers.length > 0) {
    startCounter();
}

// ============ FAQ ACCORDION ============
/**
 * Handle FAQ accordion open/close functionality
 */
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        // Close other open items
        faqQuestions.forEach(otherQuestion => {
            if (otherQuestion !== question && otherQuestion.parentElement.classList.contains('active')) {
                otherQuestion.parentElement.classList.remove('active');
            }
        });

        // Toggle current item
        question.parentElement.classList.toggle('active');
    });
});

// ============ BOOKING FORM HANDLING ============
/**
 * Handle form submission as a static site inquiry.
 */
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    clearFieldErrors(bookingForm);

    const submitBtn = bookingForm.querySelector('.submit-btn');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        eventType: eventTypeInput ? eventTypeInput.value : '',
        selectedPackage: packageSelect ? packageSelect.value : '',
        eventDate: eventDateInput ? eventDateInput.value : '',
        guests: guestsInput ? guestsInput.value : '',
        message: document.getElementById('message').value
    };

    let isValid = true;

    if (!formData.name || formData.name.trim().length < 2) {
        setFieldError(document.getElementById('name'), 'Please enter your full name.');
        isValid = false;
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
        setFieldError(document.getElementById('email'), 'Please enter a valid email address.');
        isValid = false;
    }

    if (!formData.eventType) {
        setFieldError(eventTypeInput, 'Please select an event type.');
        isValid = false;
    }

    if (!formData.selectedPackage) {
        setFieldError(packageSelect, 'Please choose a package.');
        isValid = false;
    }

    if (!formData.eventDate) {
        setFieldError(eventDateInput, 'Please select a preferred event date.');
        isValid = false;
    } else if (new Date(formData.eventDate) < today) {
        setFieldError(eventDateInput, 'Please choose a future event date.');
        isValid = false;
    }

    if (!formData.guests || parseInt(formData.guests, 10) < 1) {
        setFieldError(guestsInput, 'Please enter at least 1 guest.');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Please complete the highlighted form fields.', 'error');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const savedInvoice = saveOrderLocally(formData);
        showNotification('Your inquiry has been received and saved locally!', 'success');
        showInvoice(savedInvoice);
        bookingForm.reset();
        if (selectedPackageText) selectedPackageText.textContent = 'None';
        if (estimatedPriceText) estimatedPriceText.textContent = '—';
        if (eventTypeInput) eventTypeInput.value = '';
        updateSavedOrderCount();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showNotification('Unable to submit booking right now. Please contact us directly.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Booking Inquiry';
        }
    }
});
}

// ============ BOOKING FORM HELPERS ============
function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('invalid-field');
    const errorText = field.parentElement.querySelector('.error-message');
    if (errorText) {
        errorText.remove();
    }
}

function clearFieldErrors(form) {
    if (!form) return;
    form.querySelectorAll('.invalid-field').forEach(field => field.classList.remove('invalid-field'));
    form.querySelectorAll('.error-message').forEach(el => el.remove());
}

function setFieldError(field, message) {
    if (!field || !field.parentElement) return;
    clearFieldError(field);
    field.classList.add('invalid-field');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    field.parentElement.appendChild(error);
}

function validateField(field, validator, message) {
    if (!field) return true;
    if (!validator(field.value)) {
        setFieldError(field, message);
        return false;
    }
    clearFieldError(field);
    return true;
}

// Live validation for key fields
[nameInput, emailInput, eventTypeInput, packageSelect, eventDateInput, guestsInput].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
        if (field.classList.contains('invalid-field')) {
            validateField(field, value => value.trim().length > 0, 'This field is required.');
        }
    });
});

// ============ NOTIFICATION SYSTEM ============
/**
 * Display temporary notification messages
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function getSavedOrders() {
    try {
        const stored = window.localStorage.getItem('auraPicnicOrders');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
}

function saveOrderLocally(order) {
    const orders = getSavedOrders();
    const invoice = {
        ...order,
        savedAt: new Date().toISOString(),
        invoiceId: `INV-${Date.now().toString().slice(-6)}`
    };
    orders.push(invoice);
    window.localStorage.setItem('auraPicnicOrders', JSON.stringify(orders));
    return invoice;
}

function formatDisplayDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function showInvoice(order) {
    const invoiceSection = document.getElementById('invoiceSection');
    if (!invoiceSection) return;

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText('invoiceId', order.invoiceId || '—');
    setText('invoiceSavedAt', formatDisplayDate(order.savedAt));
    setText('invoiceName', order.name || '—');
    setText('invoiceEmail', order.email || '—');
    setText('invoicePhone', order.phone || '—');
    setText('invoiceEventType', eventTypeLabels[order.eventType] || order.eventType || '—');
    setText('invoicePackage', order.selectedPackage || '—');
    setText('invoiceDate', formatDisplayDate(order.eventDate));
    setText('invoiceGuests', order.guests || '—');
    setText('invoiceMessage', order.message ? order.message : 'No special notes provided.');

    const total = packagePrices[order.selectedPackage] || 0;
    const guestCount = parseInt(order.guests, 10);
    let totalPrice = total;
    if (!isNaN(guestCount) && guestCount > 4) {
        totalPrice = total + (guestCount - 4) * 25;
    }
    setText('invoiceTotal', totalPrice ? `$${totalPrice}` : '—');

    invoiceSection.classList.remove('hidden');
}

function hideInvoice() {
    const invoiceSection = document.getElementById('invoiceSection');
    if (!invoiceSection) return;
    invoiceSection.classList.add('hidden');
}

function saveSelection(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        console.warn('Unable to save selection to localStorage', error);
    }
}

function getSelection(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function clearSelection(key) {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        // Ignore
    }
}

function updateSavedOrderCount() {
    const countElement = document.getElementById('localOrdersCount');
    if (!countElement) return;
    countElement.textContent = getSavedOrders().length;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Add animation keyframes if not already present
    if (!document.querySelector('style[data-notification-style]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-style', 'true');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============ SCROLL ANIMATIONS ============
/**
 * Add fade-in animation to elements as they scroll into view
 * Using Intersection Observer for performance
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply scroll observer to card elements
document.querySelectorAll('.service-card, .package-card, .testimonial-card, .gallery-item').forEach(element => {
    scrollObserver.observe(element);
});

// ============ FORM VALIDATION ENHANCEMENTS ============
/**
 * Real-time validation feedback for form inputs
 */
// emailInput and nameInput are declared with other DOM elements at the top
if (emailInput) {
    emailInput.addEventListener('blur', (e) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (e.target.value && !emailRegex.test(e.target.value)) {
            e.target.style.borderColor = '#f44336';
        } else {
            e.target.style.borderColor = '#eee';
        }
    });
}

if (nameInput) {
    nameInput.addEventListener('blur', (e) => {
        if (e.target.value.trim().length < 2) {
            e.target.style.borderColor = '#f44336';
        } else {
            e.target.style.borderColor = '#eee';
        }
    });
}

// ============ DATE INPUT VALIDATION ============
/**
 * Ensure selected date is not in the past
 */
if (eventDateInput) {
    eventDateInput.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showNotification('Please select a future date for your event.', 'error');
            e.target.value = '';
        }
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);
}

// ============ KEYBOARD NAVIGATION ============
/**
 * Handle keyboard navigation for better accessibility
 */
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    // ESC key to close FAQ items
    if (e.key === 'Escape') {
        faqQuestions.forEach(question => {
            if (question.parentElement.classList.contains('active')) {
                question.parentElement.classList.remove('active');
            }
        });
    }
});

// ============ NAVIGATION ACTIVE STATE ============
/**
 * Highlight the active navigation link based on current scroll position
 */
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.style.color = '';
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.style.color = '#e8b4d0';
                activeLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// ============ PARALLAX EFFECT ============
/**
 * Subtle parallax effect for hero section
 */
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
}

// ============ FORM INPUT ANIMATIONS ============
/**
 * Add subtle animations to form inputs on focus
 */
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', (e) => {
        e.target.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', (e) => {
        e.target.style.transform = 'scale(1)';
    });
});

// ============ SERVICE CARD CLICK HANDLER ============
/**
 * Handle clicks on service card "Book Now" buttons
 */
const eventTypeMap = {
    'Picnic': 'romantic',
    'Romantic Date Picnic': 'romantic',
    'Birthday Setup': 'birthday',
    'Proposal Setup': 'proposal',
    'Bridal Shower': 'bridal',
    'Corporate Events': 'corporate',
    'Garden Party': 'other',
    'Other': 'other'
};

const eventTypeLabels = {
    romantic: 'Picnic',
    birthday: 'Birthday Setup',
    bridal: 'Bridal Shower',
    corporate: 'Corporate Events',
    other: 'Other'
};

document.querySelectorAll('.service-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const eventType = button.closest('.service-card').querySelector('h3').textContent;
        const mappedValue = eventTypeMap[eventType] || 'other';
        saveSelection(STORAGE_KEYS.selectedEventType, mappedValue);

        if (eventTypeInput) {
            eventTypeInput.value = mappedValue;
        }

        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'booking.html';
        }
    });
});

// ============ PACKAGE BUTTON HANDLER ============
/**
 * Handle clicks on package buttons (only for buttons within package cards)
 */
document.querySelectorAll('.package-card .package-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const packageCard = button.closest('.package-card');
        if (packageCard) {
            const packageName = packageCard.querySelector('h3').textContent;
            saveSelection(STORAGE_KEYS.selectedPackage, packageName);

            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                updatePackageSummary(packageName, guestsInput ? guestsInput.value : null);
                if (packageSelect) {
                    packageSelect.value = packageName;
                    packageSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'booking.html';
            }
        }
    });
});

if (guestsInput) {
    guestsInput.addEventListener('input', () => {
        const currentPackage = packageSelect ? packageSelect.value : '';
        if (currentPackage) {
            updatePackageSummary(currentPackage, guestsInput.value);
        }
    });
}

if (packageSelect) {
    packageSelect.addEventListener('change', () => {
        const packageName = packageSelect.value;
        if (packageName) {
            updatePackageSummary(packageName, guestsInput ? guestsInput.value : null);
        } else {
            selectedPackageText.textContent = 'None';
            estimatedPriceText.textContent = '—';
        }
    });
}

// ============ INITIALIZE ON PAGE LOAD ============
/**
 * Run initialization tasks when page loads
 */
function populateBookingFromStorage() {
    const savedPackage = getSelection(STORAGE_KEYS.selectedPackage);
    const savedEventType = getSelection(STORAGE_KEYS.selectedEventType);

    if (savedPackage && packageSelect) {
        packageSelect.value = savedPackage;
        updatePackageSummary(savedPackage, guestsInput ? guestsInput.value : null);
    }

    if (savedEventType && eventTypeInput) {
        eventTypeInput.value = savedEventType;
    }

    clearSelection(STORAGE_KEYS.selectedPackage);
    clearSelection(STORAGE_KEYS.selectedEventType);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Aura Picnic website loaded successfully!');
    
    populateBookingFromStorage();

    // Initialize package summary if a package is already selected
    if (packageSelect && packageSelect.value) {
        updatePackageSummary(packageSelect.value, guestsInput ? guestsInput.value : null);
    }

    updateSavedOrderCount();

    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', () => {
            window.print();
        });
    }

    const invoiceSection = document.getElementById('invoiceSection');
    if (invoiceSection) {
        invoiceSection.classList.add('hidden');
    }
});

// ============ WINDOW RESIZE HANDLER ============
/**
 * Close mobile menu on window resize to desktop
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ============ HERO SCROLL CTA ============
/**
 * Add scroll indicator animation (optional enhancement)
 */
const scrollIndicator = document.createElement('div');
scrollIndicator.style.cssText = `
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 50px;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: bounce 2s infinite;
    cursor: pointer;
`;

// Add keyframes for bounce animation
if (!document.querySelector('style[data-scroll-indicator]')) {
    const style = document.createElement('style');
    style.setAttribute('data-scroll-indicator', 'true');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateX(-50%) translateY(0);
            }
            40% {
                transform: translateX(-50%) translateY(-10px);
            }
            60% {
                transform: translateX(-50%) translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ LAZY LOADING OPTIMIZATION ============
/**
 * Implement lazy loading for images (optional enhancement)
 * Using Intersection Observer for performance
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Images would be loaded here if we had actual image URLs
                imageObserver.unobserve(img);
            }
        });
    });

    // Observe all images (if you had actual images)
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============ CONSOLE WELCOME MESSAGE ============
/**
 * Welcome message in console
 */
console.log('%c✨ Welcome to Aura Picnic! ✨', 'color: #e8b4d0; font-size: 20px; font-weight: bold;');
console.log('%cCreating unforgettable luxury picnic experiences', 'color: #d4a574; font-size: 14px;');
